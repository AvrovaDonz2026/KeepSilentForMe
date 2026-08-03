#!/usr/bin/env bash
# Generate KeepSilentForMe v4 prop-lock masters + keyframes via qingyuntop gpt-image-2
set -euo pipefail

API="${API:-https://api.qingyuntop.top/v1}"
KEY="${OPENAI_API_KEY:-$(cat /tmp/opencode/api_key.txt)}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$SCRIPT_DIR/../.." && pwd)"
ROOT="$SCRIPT_DIR"
V3="$REPO/archive/storyboard/v3-room-lock"
S09="/home/donz/game/video-storyboard-doomer-1999/generated/S09.png"
S11="/home/donz/game/video-storyboard-doomer-1999/generated/S11.png"
SIZE="${SIZE:-1536x1024}"
QUALITY="${QUALITY:-medium}"
MODEL="${MODEL:-gpt-image-2}"
LOG="$ROOT/gen.log"

mkdir -p "$ROOT"/{masters,frames,frames-2k,visual,prompts,_json}
export OPENAI_API_KEY="$KEY"

log() { echo "[$(date +%H:%M:%S)] $*" | tee -a "$LOG"; }

decode_json() {
  local jp="$1" op="$2"
  python3 - "$jp" "$op" <<'PY'
import json, base64, sys
from pathlib import Path
jp, op = sys.argv[1], sys.argv[2]
d = json.load(open(jp))
data = d.get("data") or []
if not data or "b64_json" not in data[0]:
    print("FAIL", str(d)[:800], file=sys.stderr)
    raise SystemExit(1)
raw = base64.b64decode(data[0]["b64_json"])
Path(op).write_bytes(raw)
print(f"WROTE {op} bytes={len(raw)} size={d.get('size')}")
PY
}

# skip if good file exists unless FORCE=1
need() {
  local f="$1"
  if [[ "${FORCE:-0}" == "1" ]]; then return 0; fi
  if [[ -f "$f" && $(stat -c%s "$f") -gt 100000 ]]; then
    log "skip exists $(basename "$f")"
    return 1
  fi
  return 0
}

edit_images() {
  local out="$1" prompt_file="$2"; shift 2
  local jp="$ROOT/_json/$(basename "$out" .png).json"
  local args=(
    -4 --connect-timeout 30 -m 420 -sS
    -o "$jp" -w "%{http_code}"
    "$API/images/edits"
    -H "Authorization: Bearer $KEY"
    -F "model=$MODEL"
    -F "prompt=$(cat "$prompt_file")"
    -F "size=$SIZE"
    -F "quality=$QUALITY"
    -F "n=1"
  )
  local img
  for img in "$@"; do
    args+=(-F "image=@${img};type=image/png")
  done
  local code
  code=$(curl "${args[@]}" || echo 000)
  log "HTTP $code -> $(basename "$out")"
  if [[ "$code" != "200" ]]; then
    log "ERR body: $(head -c 400 "$jp" 2>/dev/null || true)"
    return 1
  fi
  decode_json "$jp" "$out"
}

# ---------- masters ----------
gen_masters() {
  local r0="$ROOT/masters/R0-master-room.png"
  local r0b="$ROOT/masters/R0b-street-from-window.png"
  local r0c="$ROOT/masters/R0c-desk-props.png"

  if need "$r0"; then
    log "=== R0 master ==="
    edit_images "$r0" "$ROOT/prompts/R0-master-room.txt" \
      "$S09" "$S11" \
      "$V3/masters/R0-master-room.png" \
      "$V3/masters/R0b-street-from-window.png"
  fi

  if need "$r0b"; then
    log "=== R0b street+curtain ==="
    # prefer new R0 if present
    local r0ref="$r0"
    [[ -f "$r0ref" ]] || r0ref="$V3/masters/R0-master-room.png"
    edit_images "$r0b" "$ROOT/prompts/R0b-street-from-window.txt" \
      "$S09" "$S11" "$r0ref" \
      "$V3/masters/R0b-street-from-window.png"
  fi

  if need "$r0c"; then
    log "=== R0c desk props ==="
    local r0ref="$r0"
    [[ -f "$r0ref" ]] || r0ref="$V3/masters/R0-master-room.png"
    edit_images "$r0c" "$ROOT/prompts/R0c-desk-props.txt" \
      "$S09" "$r0ref" "$S11"
  fi
}

# ---------- keyframes ----------
# name|outfile
K_JOBS=(
  "K1|K1-she-needs-silence.png"
  "K2|K2-only-one-action.png"
  "K3|K3-interview.png"
  "K4|K4-first-livestream.png"
  "K5|K5-fed-by-unspoken.png"
  "K6|K6-friend-at-door.png"
  "K7|K7-apology-stream.png"
  "K8|K8-room-without-audience.png"
  "K9|K9-you-are-the-unsaid.png"
)

gen_keyframes() {
  local r0="$ROOT/masters/R0-master-room.png"
  local r0b="$ROOT/masters/R0b-street-from-window.png"
  local r0c="$ROOT/masters/R0c-desk-props.png"
  for f in "$r0" "$r0b" "$r0c"; do
    [[ -f "$f" ]] || { log "missing master $f"; return 1; }
  done

  local job id out
  for job in "${K_JOBS[@]}"; do
    IFS='|' read -r id out <<<"$job"
    local path="$ROOT/frames/$out"
    if ! need "$path"; then continue; fi
    log "=== $id ==="
    # desk-heavy shots include R0c; all get R0+R0b
    case "$id" in
      K2|K3|K4|K7|K9)
        edit_images "$path" "$ROOT/prompts/${id}.txt" \
          "$S09" "$S11" "$r0" "$r0b" "$r0c"
        ;;
      *)
        edit_images "$path" "$ROOT/prompts/${id}.txt" \
          "$S09" "$S11" "$r0" "$r0b" "$r0c"
        ;;
    esac
  done
}

STAGE="${1:-all}"
log "START stage=$STAGE size=$SIZE quality=$QUALITY"
case "$STAGE" in
  masters) gen_masters ;;
  keys|keyframes) gen_keyframes ;;
  all) gen_masters; gen_keyframes ;;
  R0|R0b|R0c)
    FORCE="${FORCE:-0}"
    case "$STAGE" in
      R0) rm -f "$ROOT/masters/R0-master-room.png"; FORCE=1 gen_masters ;;
      R0b) rm -f "$ROOT/masters/R0b-street-from-window.png"; ;;
      R0c) rm -f "$ROOT/masters/R0c-desk-props.png"; ;;
    esac
    # targeted
    if [[ "$STAGE" == "R0" ]]; then
      FORCE=1
      need() { return 0; }
      r0="$ROOT/masters/R0-master-room.png"
      edit_images "$r0" "$ROOT/prompts/R0-master-room.txt" \
        "$S09" "$S11" \
        "$V3/masters/R0-master-room.png" \
        "$V3/masters/R0b-street-from-window.png"
    elif [[ "$STAGE" == "R0b" ]]; then
      r0="$ROOT/masters/R0-master-room.png"
      [[ -f "$r0" ]] || r0="$V3/masters/R0-master-room.png"
      edit_images "$ROOT/masters/R0b-street-from-window.png" \
        "$ROOT/prompts/R0b-street-from-window.txt" \
        "$S09" "$S11" "$r0" "$V3/masters/R0b-street-from-window.png"
    else
      r0="$ROOT/masters/R0-master-room.png"
      [[ -f "$r0" ]] || r0="$V3/masters/R0-master-room.png"
      edit_images "$ROOT/masters/R0c-desk-props.png" \
        "$ROOT/prompts/R0c-desk-props.txt" \
        "$S09" "$r0" "$S11"
    fi
    ;;
  K1|K2|K3|K4|K5|K6|K7|K8|K9)
    id="$STAGE"
    declare -A MAP=(
      [K1]=K1-she-needs-silence.png
      [K2]=K2-only-one-action.png
      [K3]=K3-interview.png
      [K4]=K4-first-livestream.png
      [K5]=K5-fed-by-unspoken.png
      [K6]=K6-friend-at-door.png
      [K7]=K7-apology-stream.png
      [K8]=K8-room-without-audience.png
      [K9]=K9-you-are-the-unsaid.png
    )
    path="$ROOT/frames/${MAP[$id]}"
    rm -f "$path"
    r0="$ROOT/masters/R0-master-room.png"
    r0b="$ROOT/masters/R0b-street-from-window.png"
    r0c="$ROOT/masters/R0c-desk-props.png"
    edit_images "$path" "$ROOT/prompts/${id}.txt" \
      "$S09" "$S11" "$r0" "$r0b" "$r0c"
    ;;
  *) log "usage: $0 [all|masters|keyframes|R0|R0b|R0c|K1..K9]"; exit 2 ;;
esac
log "DONE stage=$STAGE"
ls -la "$ROOT/masters" "$ROOT/frames" 2>/dev/null | tee -a "$LOG"
