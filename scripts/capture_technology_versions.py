#!/usr/bin/env python3
"""Capture allowlisted version metadata on the Mac Studio without changing services.

Writes only to an ignored .tmp file by default. No environment, credentials,
container configuration, model contents, personal paths or host names are emitted.
"""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import platform
import plistlib
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def run(argv):
    try:
        result = subprocess.run(argv, capture_output=True, text=True, timeout=30, check=False)
        return result.stdout.strip() if result.returncode == 0 else None
    except (OSError, subprocess.TimeoutExpired):
        return None


def extract_version(text):
    match = re.search(r"(?<!\w)v?(\d+\.\d+(?:\.\d+){0,2}(?:(?:a|b|rc)\d+|[-+][\w.-]+|\.dev\d+)?)", text or "")
    return match[1] if match else None


def capture():
    commands = {
        "macOS": ["sw_vers", "-productVersion"], "Homebrew": ["brew", "--version"],
        "Git": ["git", "--version"], "Python": ["python3", "--version"],
        "Node.js": ["node", "--version"], "npm": ["npm", "--version"],
        "pnpm": ["pnpm", "--version"], "GitHub CLI": ["gh", "--version"],
        "Git LFS": ["git", "lfs", "version"], "Ollama": ["ollama", "--version"],
        "OpenClaw": ["openclaw", "--version"], "Bash": ["bash", "--version"],
        "Zsh": ["zsh", "--version"], "Docker client": ["docker", "version", "--format", "{{.Client.Version}}"],
        "Docker server": ["docker", "version", "--format", "{{.Server.Version}}"],
    }
    result = {name: extract_version(run(argv)) for name, argv in commands.items()}
    apps = {"Docker Desktop": "Docker", "LM Studio": "LM Studio", "VS Code": "Visual Studio Code",
            "Microsoft Edge": "Microsoft Edge", "OneDrive": "OneDrive", "Claude Desktop": "Claude",
            "ChatGPT Desktop": "ChatGPT", "Codex Desktop": "Codex", "GitHub Desktop": "GitHub Desktop",
            "Notion Desktop": "Notion", "Perplexity": "Perplexity", "Microsoft Word": "Microsoft Word"}
    for name, bundle in apps.items():
        try:
            data = plistlib.loads((Path("/Applications") / (bundle + ".app") / "Contents/Info.plist").read_bytes())
            result[name] = extract_version(str(data.get("CFBundleShortVersionString", "")))
        except (OSError, ValueError, plistlib.InvalidFileException):
            result[name] = None
    packages = {}
    for line in (run(["brew", "list", "--versions"]) or "").splitlines():
        fields = line.split()
        if fields and re.fullmatch(r"[\w@+./-]+", fields[0]):
            packages[fields[0]] = [v for v in fields[1:] if re.fullmatch(r"[\w.,+_-]+", v)]
    python_packages = {}
    for package in ("mlx", "mlx-lm", "huggingface-hub", "pip"):
        # importlib.metadata reads package metadata without importing the package.
        value = run(["python3", "-c", "import importlib.metadata as m; import sys; print(m.version(sys.argv[1]))", package])
        python_packages[package] = extract_version(value)
    extensions = {}
    code = "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
    for line in (run([code, "--list-extensions", "--show-versions"]) or "").splitlines():
        if re.fullmatch(r"[\w.-]+\.[\w.-]+@[\w.+-]+", line):
            name, version = line.rsplit("@", 1)
            extensions[name] = version
    images = {}
    for container in ("open-webui", "qdrant", "searxng"):
        # Read only the image ID, then its RepoDigests. Never dump docker inspect.
        image_id = run(["docker", "container", "inspect", "--format", "{{.Image}}", container])
        if image_id and re.fullmatch(r"sha256:[a-f0-9]{64}", image_id):
            digest_text = run(["docker", "image", "inspect", "--format", "{{json .RepoDigests}}", image_id])
            try:
                digests = json.loads(digest_text or "null") or []
            except ValueError:
                digests = []
            images[container] = {"image_id": image_id, "repo_digests": [d for d in digests if re.fullmatch(r"[\w./:-]+@sha256:[a-f0-9]{64}", d)]}
        else:
            images[container] = None
    return {"captured_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "versions": result, "homebrew": packages, "python_environment_packages": python_packages,
            "vscode_extensions": extensions, "container_images": images,
            "qualification": "Null means unavailable. Python packages describe only python3 on PATH; inspect other virtual environments separately. Review before publication."}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / ".tmp/mac-studio-versions.json")
    args = parser.parse_args()
    if platform.system() != "Darwin":
        parser.error("Run on the target Mac Studio. This Windows/Linux checkout cannot establish installed Mac versions.")
    data = capture()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print("Saved version metadata. Review it before updating public installed-version evidence.")


if __name__ == "__main__":
    main()
