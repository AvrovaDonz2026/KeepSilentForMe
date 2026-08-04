#!/usr/bin/env bash
# Production art batch for 请替我沉默
# Usage: ./gen_art.sh all | bg | char | creature | face | ui | BG_apartment | ...
set -euo pipefail
API="${OPENAI_BASE_URL:-${API:-https://api.qingyuntop.top/v1}}"
API="${API%/}"
[[ "$API" == */v1 ]] || API="$API/v1"
KEY="${OPENAI_API_KEY:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$SCRIPT_DIR/../.." && pwd)"
ROOT="$SCRIPT_DIR"
SB="$REPO/storyboard"
S09="${S09:-}"
S11="${S11:-}"
R0="$SB/v4-prop-lock/masters/R0-master-room.png"
R0b="$SB/v4-prop-lock/masters/R0b-street-from-window.png"
R0c="$SB/v4-prop-lock/masters/R0c-desk-props.png"
D0="$REPO/archive/storyboard/demo-effects/frames/D0-core-mechanic.png"
D1="$REPO/archive/storyboard/demo-effects/frames/D1-interview.png"
D2="$REPO/archive/storyboard/demo-effects/frames/D2-livestream.png"
D3="$REPO/archive/storyboard/demo-effects/frames/D3-friend-door.png"
D4="$REPO/archive/storyboard/demo-effects/frames/D4-apology-stream.png"
D5="$REPO/archive/storyboard/demo-effects/frames/D5-finale-room.png"
D6="$REPO/archive/storyboard/demo-effects/frames/D6-creature-stages.png"
SIZE="${SIZE:-1536x1024}"
QUALITY="${QUALITY:-medium}"
MODEL="${MODEL:-gpt-image-2}"
mkdir -p "$ROOT"/{bg,char,face,creature,ui,prompts,_json,gen}
if [[ -z "$KEY" ]]; then
  echo "OPENAI_API_KEY is required; keys are read only from the process environment." >&2
  exit 2
fi
log(){ echo "[$(date +%H:%M:%S)] $*" | tee -a "$ROOT/gen/gen.log"; }

decode(){
  python3 - "$1" "$2" <<'PY'
import json,base64,sys
from pathlib import Path
jp,op=sys.argv[1],sys.argv[2]
d=json.load(open(jp))
data=d.get("data") or []
if not data or "b64_json" not in data[0]:
    print("FAIL",str(d)[:900],file=sys.stderr); raise SystemExit(1)
Path(op).write_bytes(base64.b64decode(data[0]["b64_json"]))
print("WROTE",op,Path(op).stat().st_size)
PY
}

# gen id outdir outfile refimages...
gen(){
  local id="$1" outdir="$2" out="$3"; shift 3
  local pf="$ROOT/prompts/${id}.txt"
  local jp="$ROOT/_json/${id}.json"
  local path="$ROOT/$outdir/$out"
  if [[ ! -f "$pf" ]]; then log "missing prompt $pf"; return 1; fi
  if [[ "${FORCE:-0}" != "1" && -f "$path" && $(stat -c%s "$path") -gt 80000 ]]; then
    log "skip $outdir/$out"; return 0
  fi
  log "=== $id -> $outdir/$out ==="
  local args=( -4 --connect-timeout 30 -m 480 -sS -o "$jp" -w "%{http_code}"
    "$API/images/edits" -H "Authorization: Bearer $KEY"
    -F "model=$MODEL" -F "prompt=$(cat "$pf")" -F "size=$SIZE" -F "quality=$QUALITY" -F "n=1" )
  local img
  for img in "$@"; do
    [[ -f "$img" ]] || { log "missing ref $img"; return 1; }
    args+=(-F "image=@${img};type=image/png")
  done
  local code; code=$(curl "${args[@]}" || echo 000)
  log "HTTP $code -> $out"
  [[ "$code" == "200" ]] || { log "ERR $(head -c 500 "$jp")"; return 1; }
  decode "$jp" "$path"
}

run_one(){
  case "$1" in
    BG_apartment) gen BG_apartment bg BG_apartment.png "$S09" "$R0" "$R0c" "$D0" ;;
    BG_meeting)   gen BG_meeting   bg BG_meeting.png   "$S09" "$D1" ;;
    BG_live)      gen BG_live      bg BG_live.png      "$S09" "$R0" "$R0c" "$D2" "$D4" ;;
    BG_door)      gen BG_door      bg BG_door.png      "$S09" "$R0" "$D3" ;;
    BG_finale)    gen BG_finale    bg BG_finale.png    "$S09" "$R0" "$D5" ;;
    CHAR_desk)    gen CHAR_desk    char CHAR_desk.png  "$S09" "$D0" "$D2" ;;
    CHAR_stand)   gen CHAR_stand   char CHAR_stand.png "$S09" "$D1" "$D0" ;;
    CHAR_door)    gen CHAR_door    char CHAR_door.png  "$S09" "$D3" ;;
    CREEP_1)      gen CREEP_1      creature CREEP_1.png "$S09" "$D6" "$D0" ;;
    CREEP_2)      gen CREEP_2      creature CREEP_2.png "$S09" "$D6" "$D4" ;;
    CREEP_3)      gen CREEP_3      creature CREEP_3.png "$S09" "$D6" "$D5" ;;
    FACE_sheet)   gen FACE_sheet   face FACE_sheet.png "$S09" "$D0" "$D1" "$D5" ;;
    UI_bar)       gen UI_bar       ui UI_bar.png       "$D0" ;;
    UI_dialog)    gen UI_dialog    ui UI_dialog.png    "$D0" ;;
    *) echo "bad id $1"; return 2 ;;
  esac
}

BG_IDS=(BG_apartment BG_meeting BG_live BG_door BG_finale)
CHAR_IDS=(CHAR_desk CHAR_stand CHAR_door)
CREEP_IDS=(CREEP_1 CREEP_2 CREEP_3)
FACE_IDS=(FACE_sheet)
UI_IDS=(UI_bar UI_dialog)
ALL_IDS=("${BG_IDS[@]}" "${CHAR_IDS[@]}" "${CREEP_IDS[@]}" "${FACE_IDS[@]}" "${UI_IDS[@]}")

STAGE="${1:-all}"
case "$STAGE" in
  all)
    for id in "${BG_IDS[@]}"; do run_one "$id" & done; wait
    for id in "${CHAR_IDS[@]}" "${CREEP_IDS[@]}"; do run_one "$id" & done; wait
    for id in "${FACE_IDS[@]}" "${UI_IDS[@]}"; do run_one "$id" & done; wait
    ;;
  bg)   for id in "${BG_IDS[@]}"; do run_one "$id" & done; wait ;;
  char) for id in "${CHAR_IDS[@]}"; do run_one "$id" & done; wait ;;
  creature) for id in "${CREEP_IDS[@]}"; do run_one "$id" & done; wait ;;
  face) for id in "${FACE_IDS[@]}"; do run_one "$id"; done ;;
  ui)   for id in "${UI_IDS[@]}"; do run_one "$id" & done; wait ;;
  *)    run_one "$STAGE" ;;
esac
log DONE
find "$ROOT" -name '*.png' -printf '%p %s\n' | sort
