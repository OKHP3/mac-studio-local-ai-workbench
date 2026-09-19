"""Behavior tests for release selection, evidence boundaries and issue lifecycle."""
import copy
import gzip
import importlib.util
import json
import subprocess
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import urllib.error

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("tracker", ROOT / "scripts/check_technology_updates.py")
tracker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tracker)


def item(scope="host", recorded="1.9.0"):
    return {"id": "example", "name": "Example", "scope": scope, "recorded": recorded,
            "recorded_date": "2026-05-12", "evidence": ["README.md"],
            "source": {"kind": "github", "url": "https://api.github.com/repos/example/example/releases/latest"}}


class ReleaseSelection(unittest.TestCase):
    def test_numeric_order_and_packaging_revisions(self):
        self.assertGreater(tracker.version_key("1.10.0"), tracker.version_key("1.9.0"))
        self.assertGreater(tracker.version_key("2026.7.1-2"), tracker.version_key("2026.7.1"))
        self.assertEqual(tracker.version_key("v2.0"), tracker.version_key("2.0.0"))

    def test_prereleases_and_unknowns_are_not_stable(self):
        for value in ("1.0.0rc1", "2.0.0-beta.2", "latest", None, "planned", "3.15.0a7"):
            self.assertIsNone(tracker.version_key(value))

    def test_never_reports_downgrade_as_upgrade(self):
        self.assertEqual(tracker.compare(item(recorded="2.0"), {"version": "1.0"}), "source-behind-record")

    def test_unknown_and_planned_do_not_count_as_updates(self):
        self.assertEqual(tracker.compare(item(recorded=None), {"version": "2.0"}), "installed-unknown")
        self.assertEqual(tracker.compare(item("planned"), {"version": "2.0"}), "planned")
        self.assertEqual(tracker.compare(item("absent"), {"version": "2.0"}), "absent")

    def test_release_flags_override_numeric_version(self):
        with patch.object(tracker, "get_json", return_value={"tag_name": "v2.0.0", "prerelease": True}):
            with self.assertRaises(ValueError):
                tracker.resolve(item()["source"])

    def test_moby_prefix(self):
        source = {**item()["source"], "prefix": "docker-v"}
        with patch.object(tracker, "get_json", return_value={"tag_name": "docker-v29.8.1", "html_url": "https://github.com/moby/moby/releases/tag/docker-v29.8.1"}):
            self.assertEqual(tracker.resolve(source)["version"], "29.8.1")

    def test_pypi_ignores_yanked_and_prereleases(self):
        data = {"releases": {"1.9.0": [{"yanked": False}], "1.10.0": [{"yanked": False}],
                             "2.0.0": [{"yanked": True}], "3.0.0rc1": [{"yanked": False}], "4.0.0": []}}
        with patch.object(tracker, "get_json", return_value=data):
            actual = tracker.resolve({"kind": "pypi", "url": "https://pypi.org/pypi/example/json", "package": "example"})
        self.assertEqual(actual["version"], "1.10.0")

    def test_node_current_and_lts_are_distinct(self):
        data = [{"version": "v26.9.0", "lts": False}, {"version": "v24.9.0", "lts": "Krypton"}]
        with patch.object(tracker, "get_json", return_value=data):
            actual = tracker.resolve({"kind": "node", "url": "https://nodejs.org/dist/index.json"})
        self.assertEqual(actual["version"], "26.9.0")
        self.assertIn("24.9.0", actual["note"])

    def test_extension_latest_can_be_prerelease(self):
        data = {"version": "2.1.0", "preRelease": True, "allVersions": {"2.1.0": "ignored", "2.0.0": "ignored"}}
        with patch.object(tracker, "get_json", side_effect=[data, {"preRelease": True}, {"preRelease": False}]):
            actual = tracker.resolve({"kind": "marketplace", "url": "https://open-vsx.org/api/Continue/continue/latest"})
        self.assertEqual(actual["version"], "2.0.0")

    def test_html_only_matches_explicit_stable_heading(self):
        source = {"kind": "html", "url": "https://www.python.org/downloads/macos/",
                  "pattern": r"Latest Python 3 Release\s*-\s*Python\s*(3\.\d+\.\d+)(?![a-zA-Z0-9.])"}
        with patch.object(tracker, "request", return_value="<p>Python 3.15.0rc1</p><p>Latest Python 3 Release - <b>Python 3.14.7</b></p>"):
            self.assertEqual(tracker.resolve(source)["version"], "3.14.7")

    def test_source_failure_never_reuses_old_latest(self):
        original = item()
        with patch.object(tracker, "resolve", side_effect=urllib.error.URLError("offline")):
            actual = tracker.check(original)
        self.assertEqual(actual["status"], "source-error")
        self.assertIsNone(actual["observed"]["version"])
        self.assertEqual(original["recorded"], "1.9.0")

    def test_rolling_digest_not_counted_as_stable_release(self):
        digest = "sha256:" + "a" * 64
        with patch.object(tracker, "get_json", return_value={"digest": digest, "last_updated": "2026-09-18"}):
            result = tracker.resolve({"kind": "docker-rolling", "url": "https://hub.docker.com/v2/example"})
        self.assertIsNone(result["version"])
        self.assertEqual(tracker.compare(item(), result), "rolling-review")

    def test_http_decompresses_gzip_and_does_not_leak_token(self):
        class Response:
            headers = {"Content-Encoding": "gzip"}
            def __enter__(self): return self
            def __exit__(self, *args): pass
            def read(self): return gzip.compress(b'{"version":"1.0"}')
        with patch.dict("os.environ", {"GH_TOKEN": "test-token"}), patch.object(tracker.urllib.request, "urlopen", return_value=Response()) as fetch:
            self.assertEqual(tracker.get_json("https://registry.npmjs.org/example/latest")["version"], "1.0")
            self.assertNotIn("Authorization", fetch.call_args.args[0].headers)

    def test_inventory_covers_every_manifest_entry(self):
        data = json.loads((ROOT / "config/technology-inventory.json").read_text(encoding="utf-8"))
        tracker.validate_inventory(data)
        broken = copy.deepcopy(data)
        broken["technologies"] = [i for i in broken["technologies"] if i.get("formula") != "git"]
        with self.assertRaisesRegex(ValueError, "missing entries"):
            tracker.validate_inventory(broken)

    def test_evidence_uses_git_filename_case_even_on_windows(self):
        tracked = set(subprocess.check_output(["git", "ls-files"], cwd=ROOT, text=True).splitlines())
        data = json.loads((ROOT / "config/technology-inventory.json").read_text(encoding="utf-8"))
        for technology in data["technologies"]:
            for evidence in technology["evidence"]:
                if not evidence.startswith("https://"):
                    self.assertIn(evidence, tracked, "Evidence path must match Git filename case")

    def test_partial_network_failure_preserves_report_and_fails_run(self):
        data = {"technologies": [item()]}
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "inventory.json"
            path.write_text(json.dumps(data), encoding="utf-8")
            with patch.object(tracker, "validate_inventory"), patch.object(tracker, "resolve", side_effect=ValueError("bad response")):
                code = tracker.main(["--inventory", str(path), "--output-dir", temp])
            self.assertEqual(code, 1)
            report = json.loads((Path(temp) / "technology-update-report.json").read_text())
            self.assertIsNone(report["technologies"][0]["observed"]["version"])
            self.assertIn("lookup failed", (Path(temp) / "technology-update-report.md").read_text())


class IssueLifecycle(unittest.TestCase):
    def setUp(self):
        self.rows = [{**item(), "observed": {"version": "1.10.0"}, "status": "update-available"}]

    def test_creates_one_issue_without_labels(self):
        calls = []
        def api(url, payload=None, method=None):
            calls.append((url, payload, method))
            return [] if method is None else {}
        tracker.sync_issue(self.rows, "owner/repo", api)
        self.assertEqual(calls[-1][2], "POST")
        self.assertNotIn("labels", calls[-1][1])

    def test_unchanged_findings_do_not_edit_issue(self):
        _, body = tracker.issue_body(self.rows)
        calls = []
        def api(url, payload=None, method=None):
            calls.append((url, payload, method))
            return [{"number": 4, "title": tracker.TITLE, "body": body}]
        tracker.sync_issue(self.rows, "owner/repo", api)
        self.assertEqual(len(calls), 1)

    def test_migrates_old_bot_issue_instead_of_creating_duplicates(self):
        calls = []
        def api(url, payload=None, method=None):
            calls.append((url, payload, method))
            return [{"number": 9, "title": tracker.TITLE, "body": "old", "user": {"login": "github-actions[bot]"}}] if method is None else {}
        tracker.sync_issue(self.rows, "owner/repo", api)
        self.assertEqual(calls[-1][2], "PATCH")
        self.assertTrue(calls[-1][0].endswith("/9"))

    def test_resolved_findings_close_existing_issue(self):
        calls = []
        def api(url, payload=None, method=None):
            calls.append((url, payload, method))
            return [{"number": 4, "title": tracker.TITLE, "body": tracker.MARKER}] if method is None else {}
        tracker.sync_issue([], "owner/repo", api)
        self.assertEqual(calls[-1][1]["state"], "closed")

    def test_issue_api_failure_is_not_suppressed(self):
        def api(*args): raise urllib.error.URLError("permission denied")
        with self.assertRaises(urllib.error.URLError):
            tracker.sync_issue(self.rows, "owner/repo", api)


if __name__ == "__main__":
    unittest.main()
