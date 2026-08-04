#!/usr/bin/env bash
set -euo pipefail
API="${OPENAI_BASE_URL:-${API:-https://api.qingyuntop.top/v1}}"
API="${API%/}"
[[ "$API" == */v1 ]] || API="$API/v1"
KEY="${OPENAI_API_KEY:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$SCRIPT_DIR/../../.." && pwd)"
ROOT="$SCRIPT_DIR"
S09="${S09:-}"
S11="${S11:-}"
R0="$REPO/storyboard/v4-prop-lock/masters/R0-master-room.png"
R0b="$REPO/storyboard/v4-prop-lock/masters/R0b-street-from-window.png"
R0c="$REPO/storyboard/v4-prop-lock/masters/R0c-desk-props.png"
SIZE="${SIZE:-1536x1024}"
QUALITY="${QUALITY:-medium}"
MODEL="${MODEL:-gpt-image-2}"
mkdir -p "$ROOT"/{frames,prompts,_json}
if [[ -z "$KEY" ]]; then
  echo "OPENAI_API_KEY is required; keys are read only from the process environment." >&2
  exit 2
fi
[[ -f "$S09" ]] || { echo "S09 reference is missing; set S09=/path/to/S09.png" >&2; exit 1; }
[[ -f "$S11" ]] || { echo "S11 reference is missing; set S11=/path/to/S11.png" >&2; exit 1; }
log(){ echo "[$(date +%H:%M:%S)] $*" | tee -a "$ROOT/gen.log"; }

decode(){
  python3 - "$1" "$2" <<'PY'
import json,base64,sys
from pathlib import Path
jp,op=sys.argv[1],sys.argv[2]
d=json.load(open(jp))
data=d.get("data") or []
if not data or "b64_json" not in data[0]:
    print("FAIL",str(d)[:900],file=sys.stderr); raise SystemExit(1)
raw=base64.b64decode(data[0]["b64_json"])
Path(op).write_bytes(raw)
print("WROTE",op,len(raw))
PY
}

gen(){
  local id="$1" out="$2"; shift 2
  local pf="$ROOT/prompts/${id}.txt"
  local jp="$ROOT/_json/${id}.json"
  local path="$ROOT/frames/$out"
  if [[ "${FORCE:-0}" != "1" && -f "$path" && $(stat -c%s "$path") -gt 100000 ]]; then
    log "skip $out"; return 0
  fi
  log "=== $id ==="
  local args=( -4 --connect-timeout 30 -m 480 -sS -o "$jp" -w "%{http_code}"
    "$API/images/edits" -H "Authorization: Bearer $KEY"
    -F "model=$MODEL" -F "prompt=$(cat "$pf")" -F "size=$SIZE" -F "quality=$QUALITY" -F "n=1" )
  local img
  for img in "$@"; do args+=(-F "image=@${img};type=image/png"); done
  local code; code=$(curl "${args[@]}" || echo 000)
  log "HTTP $code -> $out"
  [[ "$code" == "200" ]] || { log "ERR $(head -c 400 "$jp")"; return 1; }
  decode "$jp" "$path"
}

run_one(){
  case "$1" in
    D0) gen D0-core-mechanic D0-core-mechanic.png "$S09" "$S11" "$R0" "$R0c" "$R0b" ;;
    D1) gen D1-interview D1-interview.png "$S09" "$S11" ;;
    D2) gen D2-livestream D2-livestream.png "$S09" "$S11" "$R0" "$R0c" "$R0b" ;;
    D3) gen D3-friend-door D3-friend-door.png "$S09" "$S11" "$R0" "$ROOT/frames/D0-core-mechanic.png" ;;
    D4) gen D4-apology-stream D4-apology-stream.png "$S09" "$S11" "$R0" "$R0c" "$R0b" ;;
    D5) gen D5-finale-room D5-finale-room.png "$S09" "$S11" "$R0" "$ROOT/frames/D0-core-mechanic.png" "$ROOT/frames/D4-apology-stream.png" ;;
    D6) gen D6-creature-stages D6-creature-stages.png "$S09" "$R0" "$ROOT/frames/D0-core-mechanic.png" "$ROOT/frames/D4-apology-stream.png" ;;
    *) echo "bad id $1"; return 2 ;;
  esac
}

STAGE="${1:-all}"
if [[ "$STAGE" == "all" ]]; then
  # parallel batches of 3 to avoid rate limits
  for id in D0 D1 D2; do run_one "$id" & done; wait
  for id in D3 D4 D5; do run_one "$id" & done; wait
  run_one D6
else
  run_one "$STAGE"
fi
log DONE
ls -la "$ROOT/frames"
