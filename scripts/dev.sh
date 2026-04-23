#!/bin/bash
# 빌드 후 브라우저 새로고침 (macOS)
# Usage: ./scripts/dev.sh

node scripts/build-data.js

# macOS Safari/Chrome 새로고침
osascript -e 'tell application "System Events" to keystroke "r" using command down' 2>/dev/null || true

echo "Done! Browser refreshed."
