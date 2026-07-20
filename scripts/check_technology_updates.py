#!/usr/bin/env python3
"""Check tracked technology versions without changing the host or repository."""
import json
import os
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INVENTORY = ROOT / "config" / "technology-inventory.json"
REPORT = ROOT / "reports" / "technology-update-report.md"

def get_json(url):
    request = urllib.request.Request(url, headers={"User-Agent": "mac-studio-local-ai-workbench-version-check"})
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.load(response)

def latest(item):
    tracking = item.get("tracking")
    if tracking == "github-release":
        release = get_json(f"https://api.github.com/repos/{item['repository']}/releases/latest")
        return release.get("tag_name", "unknown").lstrip("v")
    if tracking == "npm":
        return get_json(f"https://registry.npmjs.org/{item['name']}/latest").get("version", "unknown")
    if tracking == "brew":
        formula = item["name"].lower().replace(" ", "-")
        try:
            return get_json(f"https://formulae.brew.sh/api/formula/{formula}.json")["versions"]["stable"]
        except Exception:
            return get_json(f"https://formulae.brew.sh/api/cask/{formula}.json")["version"]
    return item.get("latest", "not tracked")

def main():
    data = json.loads(INVENTORY.read_text(encoding="utf-8"))
    rows, updates, failures = [], [], []
    for item in data["technologies"]:
        observed = item.get("latest", "not tracked")
        try:
            observed = latest(item)
            if item["current"] not in ("not captured", "not confirmed", "latest", "latest (historical banner v0.9.5)") and observed not in ("unknown", "not applicable") and observed != item["current"]:
                updates.append(item["name"])
        except Exception as exc:
            failures.append(f"{item['name']}: {exc}")
        rows.append((item["name"], item["current"], observed, item["source"]))
    lines = ["# Technology update report", "", f"Generated: {date.today().isoformat()}", "", "| Technology | Recorded | Latest observed | Evidence |", "|---|---|---|---|"]
    lines += [f"| {name} | {current} | {observed} | {source} |" for name, current, observed, source in rows]
    lines += ["", f"Updates available: {len(updates)}"]
    if updates:
        lines += ["", "Technologies requiring review:", ""] + [f"- {name}" for name in updates]
    if failures:
        lines += ["", "Checks that could not be completed:", ""] + [f"- {failure}" for failure in failures]
    REPORT.parent.mkdir(exist_ok=True)
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))

if __name__ == "__main__":
    main()
