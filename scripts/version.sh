#!/bin/bash
set -euo pipefail

BUMP_TYPE="${1:-}"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if [[ -z "$BUMP_TYPE" ]]; then
  echo "Usage: scripts/version.sh <patch|minor|major>"
  exit 1
fi

if [[ "$BUMP_TYPE" != "patch" && "$BUMP_TYPE" != "minor" && "$BUMP_TYPE" != "major" ]]; then
  echo "Error: bump type must be patch, minor, or major"
  exit 1
fi

cd "$PROJECT_DIR"

# Bump version in package.json (no git tag)
npm version "$BUMP_TYPE" --no-git-tag-version

# Read new version from package.json
VERSION=$(node -p "require('./package.json').version")

# Sync version to app.json
node -e "
const fs = require('fs');
const app = JSON.parse(fs.readFileSync('app.json', 'utf8'));
app.expo.version = '$VERSION';
fs.writeFileSync('app.json', JSON.stringify(app, null, 2) + '\n');
"

echo "Bumped to v${VERSION} (package.json + app.json)"

# Optionally tag
if [[ "${2:-}" == "--tag" ]]; then
  git add package.json app.json
  git commit -m "chore: bump version to v${VERSION}"
  git tag "v${VERSION}"
  echo "Committed and tagged v${VERSION}"
  echo "Push with: git push origin main v${VERSION}"
fi
