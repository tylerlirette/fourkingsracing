#!/usr/bin/env bash
set -euo pipefail

TOKEN="${PAGEBUILDER_GIT_TOKEN:-}"
if [ -z "$TOKEN" ]; then
  echo "PAGEBUILDER_GIT_TOKEN is missing; cannot install private pagebuilder." >&2
  exit 1
fi

KIT_DIR="${TMPDIR:-/tmp}/pagebuilder-kit"
rm -rf "$KIT_DIR"
git clone --depth 1 "https://x-access-token:${TOKEN}@github.com/tylerlirette/pagebuilder.git" "$KIT_DIR"

npm pkg set "dependencies.@tylerlirette/pagebuilder=file:${KIT_DIR}"
rm -f package-lock.json
npm install