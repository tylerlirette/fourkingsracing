#!/usr/bin/env bash
set -euo pipefail

TOKEN="${PAGEBUILDER_GIT_TOKEN:-}"
if [ -z "$TOKEN" ]; then
  echo "PAGEBUILDER_GIT_TOKEN is missing; cannot install private pagebuilder." >&2
  exit 1
fi

# Keep the kit inside the project so Next can resolve/transpile package exports.
KIT_DIR="$(pwd)/.vendor/pagebuilder"
rm -rf "$(pwd)/.vendor"
mkdir -p "$(pwd)/.vendor"
git clone --depth 1 "https://x-access-token:${TOKEN}@github.com/tylerlirette/pagebuilder.git" "$KIT_DIR"

npm pkg set "dependencies.@tylerlirette/pagebuilder=file:.vendor/pagebuilder"
rm -f package-lock.json
npm install

# Sanity-check package exports resolve for the build.
node -e "require.resolve('@tylerlirette/pagebuilder/ui'); require.resolve('@tylerlirette/pagebuilder/preview'); require.resolve('@tylerlirette/pagebuilder/schemas'); console.log('pagebuilder exports ok')"