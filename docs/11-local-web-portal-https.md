# Local Web Portal and HTTPS Front Door

This note captures a future architecture layer for the Mac Studio Local AI Workbench.

## Decision

Use the Mac Studio as a private AI appliance and local web app staging host. Use Caddy on macOS as the front door. Use Docker for services behind it.

## Placement

- Caddy: Homebrew on macOS.
- LM Studio and Ollama: native macOS.
- Open WebUI, Qdrant, and SearXNG: Docker.
- Local app backends: Docker or native depending on dependencies.
- Static app builds: served by Caddy.

## Router boundary

The ASUS routers should remain network infrastructure for routing, wireless coverage, and DHCP. They should not be treated as the app hosting or certificate management layer for the local AI stack.

## Home portal

A private home portal should link to Larry, OpenClaw, Open WebUI, Qdrant, SearXNG, local app previews, and status pages.

## Next actions

1. Install Caddy.
2. Create a Caddyfile.
3. Build a starter portal page.
4. Add a network diagram.

Source note: distilled from a ChatGPT architecture thread on 2026-06-15. The live ChatGPT source URL was not available at capture time.
