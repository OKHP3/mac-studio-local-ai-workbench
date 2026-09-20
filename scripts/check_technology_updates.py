#!/usr/bin/env python3
"""Monitor release metadata without installing software or altering host evidence."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html import unescape
import gzip
import json
import os
from pathlib import Path
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
MARKER = "<!-- workbench-technology-tracker:v2 -->"
TITLE = "Technology updates require review"
SCOPES = {"host", "support", "repository", "external-site", "planned", "absent", "format", "service", "model", "vendored"}


def request(url, payload=None, method=None):
    headers = {"User-Agent": "workbench-technology-tracker", "Accept": "application/json"}
    # The token is never sent to a package registry or vendor site.
    if urllib.parse.urlsplit(url).hostname == "api.github.com" and os.environ.get("GH_TOKEN"):
        headers["Authorization"] = "Bearer " + os.environ["GH_TOKEN"]
    data = None
    if payload is not None:
        data = json.dumps(payload).encode()
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=30) as response:
        raw = response.read()
        if response.headers.get("Content-Encoding") == "gzip" or raw.startswith(b"\x1f\x8b"):
            raw = gzip.decompress(raw)
        return raw.decode("utf-8")


def get_json(url, payload=None, method=None):
    return json.loads(request(url, payload, method))


def version_key(value):
    """Numeric versions and numeric packaging revisions; never alpha/beta/RC."""
    match = re.fullmatch(r"v?(\d+(?:\.\d+){0,3})(?:-(\d+))?(?:\+[\w.-]+)?", value or "")
    if not match:
        return None
    parts = tuple(int(n) for n in match[1].split("."))
    return parts + (0,) * (4 - len(parts)) + (int(match[2] or 0),)


def choose_stable(versions):
    candidates = [(version_key(v), v) for v in versions if version_key(v) is not None]
    if not candidates:
        raise ValueError("No stable numeric version in source")
    return max(candidates)[1].removeprefix("v")


def resolve(source):
    kind, url = source["kind"], source.get("url")
    if kind == "none":
        return {"version": None, "note": source["reason"], "url": url}
    if kind == "html":
        page = unescape(re.sub(r"<[^>]+>", " ", request(url)))
        values = re.findall(source["pattern"], re.sub(r"\s+", " ", page))
        return {"version": choose_stable(values), "url": url}
    data = get_json(url)
    if kind == "github":
        if data.get("draft") or data.get("prerelease"):
            raise ValueError("Release source returned a draft or prerelease")
        version = data["tag_name"].removeprefix(source.get("prefix", "v"))
        if version_key(version) is None:
            raise ValueError("Release tag is not a supported stable version")
        return {"version": version, "url": data["html_url"], "published": data.get("published_at")}
    if kind == "pypi":
        version = choose_stable(v for v, files in data["releases"].items()
                                if any(not f.get("yanked") for f in files))
        return {"version": version, "url": f"https://pypi.org/project/{source['package']}/{version}/"}
    if kind == "node":
        return {"version": choose_stable(d["version"] for d in data), "url": url,
                "note": "Latest LTS: " + choose_stable(d["version"] for d in data if d.get("lts"))}
    if kind == "docker-rolling":
        digest = data.get("digest")
        if not digest or not re.fullmatch(r"sha256:[a-f0-9]{64}", digest):
            raise ValueError("Registry did not return a manifest digest")
        return {"version": None, "digest": digest, "url": url,
                "note": "Rolling image; no numbered stable release. Tag last updated: " + data["last_updated"]}
    if kind == "marketplace":
        if data.get("preRelease") is False:
            return {"version": choose_stable([data["version"]]), "url": url}
        versions = sorted((v for v in data.get("allVersions", {}) if version_key(v)), key=version_key, reverse=True)
        # Bounded fallback: registry 'latest' can point to a prerelease.
        for version in versions[:20]:
            target = url.rsplit("/", 1)[0] + "/" + version
            release = get_json(target)
            if release.get("preRelease") is False:
                return {"version": version, "url": target}
        raise ValueError("No stable extension in the newest 20 published versions")
    if kind == "json":
        for key in source["field"].split("."):
            data = data[key]
        version = str(data).split(",")[0].removeprefix("v")
        if not version or version.lower() in {"none", "latest", "null"}:
            raise ValueError("Source did not return a concrete version")
        if source.get("numeric", True) and version_key(version) is None:
            raise ValueError("Source returned a prerelease or unsupported version")
        return {"version": version, "url": url, "note": source.get("note", "")}
    raise ValueError("Unsupported source kind: " + kind)


def validate_inventory(data, root=ROOT):
    if data.get("schema_version") != 2:
        raise ValueError("Expected inventory schema_version 2")
    seen = set()
    for item in data["technologies"]:
        if item["id"] in seen or item["scope"] not in SCOPES:
            raise ValueError("Duplicate id or invalid scope: " + item["id"])
        seen.add(item["id"])
        if "latest" in item or "current" in item:
            raise ValueError("Keep installed evidence separate from release observations")
        for evidence in item["evidence"]:
            if not evidence.startswith("https://") and not (root / evidence).is_file():
                raise ValueError("Missing evidence: " + evidence)
        if item.get("recorded") and not item.get("recorded_date"):
            raise ValueError("Recorded version requires date: " + item["id"])
        if item["source"]["kind"] != "none" and not item["source"]["url"].startswith("https://"):
            raise ValueError("Release source must use HTTPS")
    formulae = {i.get("formula") for i in data["technologies"]}
    casks = {i.get("cask") for i in data["technologies"]}
    for path, names in [("manifests/brew-formulae.manual.txt", formulae),
                        ("mac-studio-setup/brew-formulae.txt", formulae),
                        ("manifests/brew-casks.manual.txt", casks)]:
        missing = {line.strip() for line in (root / path).read_text().splitlines()
                   if line.strip() and not line.startswith("#")} - names
        if missing:
            raise ValueError(f"Inventory missing entries from {path}: {sorted(missing)}")


def compare(item, observed):
    if observed.get("error"):
        return "source-error"
    if item["scope"] in {"absent", "planned", "format", "service", "model", "vendored"}:
        return item["scope"]
    if observed.get("digest"):
        return "rolling-review"
    if not item.get("recorded"):
        return "installed-unknown"
    current, newest = version_key(item["recorded"]), version_key(observed.get("version"))
    if current is None or newest is None:
        return "manual-review"
    if newest > current:
        return "update-available"
    if newest < current:
        return "source-behind-record"
    return "matches-record"


def check(item):
    item = dict(item)
    if item.get("workflow_action"):
        workflow = (ROOT / ".github/workflows/technology-updates.yml").read_text(encoding="utf-8-sig")
        pins = re.findall(r"uses:\s*" + re.escape(item["workflow_action"]) + r"@([a-f0-9]{40})\s*#\s*v(\d+(?:\.\d+){2})", workflow)
        if len(pins) != 1:
            raise ValueError("Expected one SHA pin and version comment for " + item["workflow_action"])
        item["recorded"] = pins[0][1]
        item["recorded_date"] = datetime.now(timezone.utc).date().isoformat()
        item["notes"] = "Workflow pin observed: " + pins[0][0] + ". Dependabot maintains this reference."
    try:
        observed = resolve(item["source"])
    except (urllib.error.URLError, TimeoutError, OSError, ValueError, KeyError, TypeError) as exc:
        # Never substitute cached release values after a failed check.
        observed = {"version": None, "url": item["source"].get("url"),
                    "error": f"{type(exc).__name__}: {exc}"}
    return {**item, "observed": observed, "status": compare(item, observed)}


def cell(value):
    return str(value or "Unknown").replace("|", r"\|").replace("\n", " ").replace("\r", " ")


def render(results, stamp):
    updates = sum(r["status"] == "update-available" for r in results)
    errors = sum(bool(r["observed"].get("error")) for r in results)
    lines = ["# Technology update report", "", f"Checked (UTC): {stamp}", "",
             "Recorded versions are dated repository evidence, not a fresh Mac Studio inspection.",
             "Latest values are source observations, not installed or compatibility-tested versions.",
             "Homebrew rows track the stable version available in the named formula/cask channel.",
             "See [maintenance plan](../docs/15-technology-version-management.md) for boundaries and adoption steps.", "",
             f"Inventory entries: {len(results)}. Newer than recorded: {updates}. Source failures: {errors}.", ""]
    for scope in ["host", "repository", "external-site", "support", "planned", "format", "service", "vendored", "model", "absent"]:
        group = [r for r in results if r["scope"] == scope]
        if not group:
            continue
        lines += [f"## {scope.replace('-', ' ').title()}", "",
                  "| Technology | Recorded version (date) | Latest stable / channel | Result | Evidence and release source |",
                  "|---|---|---|---|---|"]
        for row in group:
            obs = row["observed"]
            version = obs.get("version") or ("rolling digest " + obs["digest"] if obs.get("digest") else "Not versioned / manual")
            if obs.get("error"):
                version = "Unknown (lookup failed)"
            recorded = row.get("recorded") or "Unknown"
            if row.get("recorded_date"):
                recorded += " (" + row["recorded_date"] + ")"
            refs = []
            for index, evidence in enumerate(row["evidence"], 1):
                target = evidence if evidence.startswith("https://") else "../" + evidence.replace(" ", "%20")
                refs.append(f"[evidence {index}]({target})")
            if obs.get("url"):
                refs.append(f"[release source]({obs['url']})")
            lines.append("| " + " | ".join(map(cell, [row["name"], recorded, version, row["status"], "; ".join(refs)])) + " |")
        lines += [""]
    lines += ["## Qualifications", ""]
    for row in results:
        notes = [row.get("notes"), row["observed"].get("note"), row["observed"].get("error")]
        if any(notes):
            lines.append(f"- **{row['name']}**: " + " ".join(cell(n) for n in notes if n))
    return "\n".join(lines) + "\n"


def issue_body(results):
    # Exclude timestamps so unchanged findings do not trigger weekly edits.
    active = [r for r in results if r["status"] in {
        "update-available", "source-error", "source-behind-record",
        "manual-review", "installed-unknown", "rolling-review"}]
    lines = [MARKER, "Release monitoring does not update the Mac Studio.",
             "Capture host versions, back up affected data, test each candidate, then record adoption.", "",
             "| Technology | Recorded | Latest | Finding |", "|---|---|---|---|"]
    for row in active:
        obs = row["observed"]
        finding = row["status"] + (": " + obs["error"] if obs.get("error") else "")
        lines.append("| " + " | ".join(map(cell, [row["name"], row.get("recorded"), obs.get("version") or obs.get("digest"), finding])) + " |")
    lines += ["", "Full source links and qualifications are in the workflow report artifact.",
              "See docs/15-technology-version-management.md for the upgrade and rollback procedure."]
    return active, "\n".join(lines)


def sync_issue(results, repository, api=get_json):
    if not re.fullmatch(r"[\w.-]+/[\w.-]+", repository):
        raise ValueError("Expected owner/repository")
    base = f"https://api.github.com/repos/{repository}/issues"
    existing, page = [], 1
    while True:
        batch = api(f"{base}?state=open&per_page=100&page={page}")
        existing.extend(i for i in batch if not i.get("pull_request") and
                        (MARKER in (i.get("body") or "") or
                         (i["title"] == TITLE and i.get("user", {}).get("login") == "github-actions[bot]")))
        if len(batch) < 100:
            break
        page += 1
    active, body = issue_body(results)
    if existing:
        primary = min(existing, key=lambda i: i["number"])
        if primary.get("body") != body or not active:
            api(f"{base}/{primary['number']}", {"body": body, "state": "open" if active else "closed"}, "PATCH")
    elif active:
        api(base, {"title": TITLE, "body": body}, "POST")


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--inventory", type=Path, default=ROOT / "config/technology-inventory.json")
    parser.add_argument("--output-dir", type=Path, default=ROOT / ".tmp/technology-report")
    parser.add_argument("--validate-only", action="store_true")
    parser.add_argument("--issue", action="store_true", help="Maintain a single issue; requires GH_TOKEN")
    args = parser.parse_args(argv)
    data = json.loads(args.inventory.read_text(encoding="utf-8"))
    validate_inventory(data)
    if args.validate_only:
        print(f"Inventory valid: {len(data['technologies'])} entries; all Homebrew manifest entries covered")
        return 0
    with ThreadPoolExecutor(max_workers=6) as pool:
        results = list(pool.map(check, data["technologies"]))
    stamp = datetime.now(timezone.utc).isoformat(timespec="seconds")
    args.output_dir.mkdir(parents=True, exist_ok=True)
    (args.output_dir / "technology-update-report.md").write_text(render(results, stamp), encoding="utf-8", newline="\n")
    (args.output_dir / "technology-update-report.json").write_text(
        json.dumps({"checked_at": stamp, "technologies": results}, indent=2) + "\n", encoding="utf-8", newline="\n")
    if args.issue:
        if not os.environ.get("GH_TOKEN"):
            raise ValueError("--issue requires GH_TOKEN")
        sync_issue(results, os.environ["GITHUB_REPOSITORY"])
    failures = sum(bool(r["observed"].get("error")) for r in results)
    print(f"Checked {len(results)} entries; {sum(r['status'] == 'update-available' for r in results)} newer than recorded; {failures} source failures")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
