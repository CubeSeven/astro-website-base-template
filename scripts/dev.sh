#!/usr/bin/env bash
set -euo pipefail

# Starts the Astro dev server in the background, bound to 0.0.0.0.
# Uses setsid to detach from the shell session so it survives tool timeouts.
# Usage: bash scripts/dev.sh [--port <port>]

PORT=4321
if [ "${1:-}" = "--port" ] && [ -n "${2:-}" ]; then
  PORT="$2"
fi

HOST="0.0.0.0"
LOG="/tmp/astro-dev.log"

echo "Starting Astro dev server on http://${HOST}:${PORT}/"
echo "Logs: ${LOG}"

# Kill existing server on the same port if any
lsof -ti :"$PORT" 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

# Detach with setsid + disown so the process survives shell exit
setsid node_modules/.bin/astro dev --host "$HOST" --port "$PORT" > "$LOG" 2>&1 &
disown

sleep 3
if lsof -ti :"$PORT" >/dev/null 2>&1; then
  echo "✓ Server is running on http://${HOST}:${PORT}/"
else
  echo "✗ Server failed to start. Check logs: ${LOG}"
  cat "$LOG"
  exit 1
fi
