#!/usr/bin/env bash

set -e
set -u

lerna bootstrap --hoist
npm run build
lerna exec npm pack
mkdir dist || true
find packages -name '*.tgz' -exec mv {} dist \;