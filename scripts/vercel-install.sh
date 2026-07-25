#!/usr/bin/env bash
set -euo pipefail
TOKEN="${PAGEBUILDER_GIT_TOKEN:-}"
if [ -n "$TOKEN" ]; then
  git config --global url."https://${TOKEN}@github.com/".insteadOf "https://github.com/"
  git config --global url."https://${TOKEN}@github.com/".insteadOf "ssh://git@github.com/"
  git config --global url."https://${TOKEN}@github.com/".insteadOf "git@github.com:"
fi
npm install