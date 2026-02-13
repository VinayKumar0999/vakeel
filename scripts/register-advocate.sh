#!/usr/bin/env bash
# Register an advocate via POST /api/auth/register (JSON body, no files)
# Usage: ./scripts/register-advocate.sh [BASE_URL]
# Example: ./scripts/register-advocate.sh http://localhost:3000

BASE_URL="${1:-http://localhost:3000}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BODY_FILE="${SCRIPT_DIR}/advocate-register-body.json"

if [ ! -f "$BODY_FILE" ]; then
  echo "Error: $BODY_FILE not found"
  exit 1
fi

echo "Registering advocate at $BASE_URL/api/auth/register ..."
curl -s -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d @"$BODY_FILE" | jq .
