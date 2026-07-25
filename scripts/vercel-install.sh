#!/usr/bin/env bash
set -euo pipefail

TOKEN="${PAGEBUILDER_GIT_TOKEN:-}"
if [ -z "$TOKEN" ]; then
  echo "PAGEBUILDER_GIT_TOKEN is missing; cannot install private pagebuilder." >&2
  exit 1
fi

KIT_DIR="$(pwd)/.vendor/pagebuilder"
rm -rf "$(pwd)/.vendor"
mkdir -p "$(pwd)/.vendor"
git clone --depth 1 "https://x-access-token:${TOKEN}@github.com/tylerlirette/pagebuilder.git" "$KIT_DIR"

npm pkg set "dependencies.@tylerlirette/pagebuilder=file:.vendor/pagebuilder"
rm -f package-lock.json
npm install

test -f node_modules/@tylerlirette/pagebuilder/package.json
test -f node_modules/@tylerlirette/pagebuilder/src/ui.ts
echo "pagebuilder vendored ok"