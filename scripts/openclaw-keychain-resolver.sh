#!/bin/sh
set -eu

# OpenClaw SecretRef exec-provider resolver for the local macOS Keychain.
# The provider alias selects the Keychain service; secret values never enter
# this repository or the command line.

request=$(/bin/cat)
provider=$(/usr/bin/jq -r '.provider // empty' <<EOF
$request
EOF
)

case "$provider" in
  keychain_gateway)
    service=openclaw-gateway-token
    ;;
  keychain_ollama)
    service=openclaw-ollama-api-key
    ;;
  *)
    /usr/bin/jq -n --arg provider "$provider" \
      '{protocolVersion: 1, values: {}, errors: {unknown_provider: {code: "NOT_FOUND"}}}'
    exit 0
    ;;
esac

secret=$(/usr/bin/security find-generic-password \
  -a okh -s "$service" -w)

/usr/bin/jq -n --arg secret "$secret" \
  '{protocolVersion: 1, values: {value: $secret}}'
