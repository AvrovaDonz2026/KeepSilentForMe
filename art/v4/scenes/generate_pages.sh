#!/usr/bin/env bash
set -euo pipefail

# Full-page scene generation for the V4 page-turn runtime. The API key is read
# only from the environment and response JSON is kept under /tmp.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$ROOT/../../.." && pwd)"
API="${OPENAI_BASE_URL:-https://api.qingyuntop.top/v1}"
API="${API%/}"
[[ "$API" == */v1 ]] || API="$API/v1"
KEY="${OPENAI_API_KEY:-}"
MODEL="${MODEL:-gpt-image-2}"
SIZE="${SIZE:-1536x1024}"
QUALITY="${QUALITY:-medium}"
TMP_ROOT="${TMP_ROOT:-/tmp/keep-silent-scene-pages}"
PROMPTS="$ROOT/prompts"
PAGES="$ROOT/pages"
LOG="$TMP_ROOT/generate.log"

mkdir -p "$PAGES" "$TMP_ROOT/json"

REFS="$TMP_ROOT/refs"
mkdir -p "$REFS"

# Some storyboard frames are presentation composites with a dialogue/UI strip
# at the bottom. Keep their upper composition as a reference, but do not feed
# the baked controls back into the image model.
crop_clean_ref() {
  local source="$1" output="$2" height="$3"
  [[ -s "$output" ]] && return 0
  convert "$source" -crop "1536x${height}+0+0" +repage -resize 1536x1024\! "$output"
}

if [[ "${1:-all}" == "dry-run" ]]; then
  for id in PAGE_L0_desk PAGE_L1_interview PAGE_L2_live PAGE_L2_fed PAGE_L3_door_default PAGE_L3_door_hesitant PAGE_L4_apology PAGE_L4_break PAGE_L5_empty PAGE_L5_poster PAGE_END_A_separate PAGE_END_B_alienate PAGE_END_C_hollow; do
    echo "$id -> $PAGES/${id}.png"
  done
  exit 0
fi

# The provider's documented spelling is gpt-image-2; accept the shorthand the
# user supplied without changing the command-line interface.
[[ "$MODEL" == "gpt-image2" ]] && MODEL="gpt-image-2"

log() {
  mkdir -p "$TMP_ROOT"
  printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*" | tee -a "$LOG"
}

need() {
  [[ "${FORCE:-0}" == "1" || ! -s "$1" ]]
}

decode() {
  python3 - "$1" "$2" <<'PY'
import base64, json, sys
from pathlib import Path

source, output = sys.argv[1:]
payload = json.loads(Path(source).read_text())
items = payload.get("data") or []
if not items or "b64_json" not in items[0]:
    raise SystemExit(f"image response has no b64_json: {str(payload)[:500]}")
Path(output).write_bytes(base64.b64decode(items[0]["b64_json"]))
PY
  # The gateway may return the first reference's canvas despite `size`. Keep
  # the runtime contract stable for every page asset.
  convert "$2" -resize 1536x1024\! "$2"
  identify -format '%f %wx%h %[channels]\n' "$2"
}

prompt_for() {
  local id="$1"
  cat "$PROMPTS/common.txt" "$PROMPTS/$id.txt"
}

ref() {
  local path="$1"
  [[ -f "$path" ]] || { log "missing reference: $path"; return 1; }
  printf '%s\n' "$path"
}

edit_page() {
  local id="$1"; shift
  local output="$PAGES/${id}.png"
  local response="$TMP_ROOT/json/${id}.json"
  if ! need "$output"; then
    log "skip existing $id"
    return 0
  fi
  if [[ -z "$KEY" ]]; then
    echo "OPENAI_API_KEY is required for generation; it is never read from a repository file." >&2
    return 2
  fi

  local image
  for image in "$@"; do
    [[ -f "$image" ]] || { log "missing reference for $id: $image"; return 1; }
  done

  local prompt
  prompt="$(prompt_for "$id")"
  local args=(
    -4 --connect-timeout 30 -m 600 -sS
    -o "$response" -w "%{http_code}"
    "$API/images/edits"
    -H "Authorization: Bearer $KEY"
    -F "model=$MODEL"
    -F "prompt=$prompt"
    -F "size=$SIZE"
    -F "quality=$QUALITY"
    -F "n=1"
  )
  for image in "$@"; do
    args+=( -F "image=@${image};type=image/png" )
  done
  log "generate $id refs=$# model=$MODEL size=$SIZE"
  local code
  code="$(curl "${args[@]}" || true)"
  if [[ "$code" != "200" ]]; then
    log "HTTP $code for $id: $(head -c 400 "$response" 2>/dev/null || true)"
    return 1
  fi
  decode "$response" "$output" | tee -a "$LOG"
}

S09="${S09:-/home/donz/game/video-storyboard-doomer-1999/generated/S09.png}"
S11="${S11:-/home/donz/game/video-storyboard-doomer-1999/generated/S11.png}"
V4="$REPO/storyboard/v4-prop-lock"
BG_APARTMENT="$REPO/art/bg/BG_apartment.png"
BG_LIVE="$REPO/art/bg/BG_live.png"
BG_DOOR="$REPO/art/bg/BG_door.png"
BG_FINALE="$REPO/art/bg/BG_finale.png"
BG_MEETING="$REPO/art/bg/BG_meeting.png"
K1="$V4/frames-2k/K1-she-needs-silence.png"
K2="$V4/frames-2k/K2-only-one-action.png"
K3="$V4/frames-2k/K3-interview.png"
K4="$V4/frames-2k/K4-first-livestream.png"
K5="$V4/frames-2k/K5-fed-by-unspoken.png"
K6="$V4/frames-2k/K6-friend-at-door.png"
K7="$V4/frames-2k/K7-apology-stream.png"
K8="$V4/frames-2k/K8-room-without-audience.png"
K9="$V4/frames-2k/K9-you-are-the-unsaid.png"
D0="$REPO/storyboard/demo-effects/frames/D0-core-mechanic.png"
D1="$REPO/storyboard/demo-effects/frames/D1-interview.png"
D2="$REPO/storyboard/demo-effects/frames/D2-livestream.png"
D3="$REPO/storyboard/demo-effects/frames/D3-friend-door.png"
D4="$REPO/storyboard/demo-effects/frames/D4-apology-stream.png"
D5="$REPO/storyboard/demo-effects/frames/D5-finale-room.png"
CHAR_INTERVIEW="$REPO/art/v4/playable/char/CHAR_interview_sit.png"
CHAR_LIVE="$REPO/art/v4/playable/char/CHAR_livestream_speaking.png"
CHAR_APOLOGY="$REPO/art/v4/playable/char/CHAR_apology_bow.png"
CHAR_DESK="$REPO/art/v4/playable/char/CHAR_desk.png"
CHAR_DOOR="$REPO/art/v4/playable/char/CHAR_door.png"
CHAR_FINAL="$REPO/art/v4/playable/char/CHAR_final_speaking.png"
NPC_HESITANT="$REPO/art/v4/playable/npc/NPC_friend_hesitant_silhouette.png"
CREEP_2="$REPO/art/v4/playable/creature/CREEP_2.png"
CREEP_3="$REPO/art/v4/playable/creature/CREEP_3.png"
NPC_FRIEND="$REPO/art/v4/playable/npc/NPC_friend_door_silhouette.png"
ENDING_ECHO="$REPO/art/v4/playable/ending/ENDING_echo_overlap.png"
ENDING_HOLLOW="$REPO/art/v4/playable/ending/ENDING_hollow_proxy.png"

crop_clean_ref "$S09" "$REFS/S09-clean.png" 820
crop_clean_ref "$S11" "$REFS/S11-clean.png" 820
crop_clean_ref "$D0" "$REFS/D0-clean.png" 820
crop_clean_ref "$D1" "$REFS/D1-clean.png" 820
crop_clean_ref "$D2" "$REFS/D2-clean.png" 820
crop_clean_ref "$D3" "$REFS/D3-clean.png" 820
crop_clean_ref "$D4" "$REFS/D4-clean.png" 820
crop_clean_ref "$D5" "$REFS/D5-clean.png" 820

run_job() {
  case "$1" in
    PAGE_L0_desk)
      edit_page "$1" "$(ref "$BG_APARTMENT")" "$(ref "$V4/masters/R0-master-room.png")" "$(ref "$V4/masters/R0c-desk-props.png")" "$(ref "$REFS/S09-clean.png")" "$(ref "$REFS/S11-clean.png")" "$(ref "$REFS/D0-clean.png")" "$(ref "$K1")" "$(ref "$K2")" "$(ref "$CHAR_DESK")" ;;
    PAGE_L1_interview)
      edit_page "$1" "$(ref "$BG_MEETING")" "$(ref "$REFS/S09-clean.png")" "$(ref "$K3")" "$(ref "$REFS/D1-clean.png")" "$(ref "$CHAR_INTERVIEW")" ;;
    PAGE_L2_live)
      edit_page "$1" "$(ref "$BG_LIVE")" "$(ref "$V4/masters/R0-master-room.png")" "$(ref "$V4/masters/R0b-street-from-window.png")" "$(ref "$V4/masters/R0c-desk-props.png")" "$(ref "$REFS/S11-clean.png")" "$(ref "$REFS/D2-clean.png")" "$(ref "$K4")" "$(ref "$CHAR_LIVE")" ;;
    PAGE_L2_fed)
      edit_page "$1" "$(ref "$BG_LIVE")" "$(ref "$V4/masters/R0-master-room.png")" "$(ref "$V4/masters/R0b-street-from-window.png")" "$(ref "$V4/masters/R0c-desk-props.png")" "$(ref "$REFS/S11-clean.png")" "$(ref "$REFS/D2-clean.png")" "$(ref "$K5")" "$(ref "$CHAR_LIVE")" "$(ref "$CREEP_2")" ;;
    PAGE_L3_door_default)
      edit_page "$1" "$(ref "$BG_APARTMENT")" "$(ref "$BG_DOOR")" "$(ref "$V4/masters/R0-master-room.png")" "$(ref "$REFS/D3-clean.png")" "$(ref "$K6")" "$(ref "$CHAR_DOOR")" "$(ref "$NPC_FRIEND")" ;;
    PAGE_L3_door_hesitant)
      edit_page "$1" "$(ref "$PAGES/PAGE_L3_door_default.png")" "$(ref "$K6")" "$(ref "$NPC_HESITANT")" ;;
    PAGE_L4_apology)
      edit_page "$1" "$(ref "$BG_LIVE")" "$(ref "$V4/masters/R0-master-room.png")" "$(ref "$V4/masters/R0c-desk-props.png")" "$(ref "$REFS/D4-clean.png")" "$(ref "$K7")" "$(ref "$CHAR_APOLOGY")" "$(ref "$CREEP_3")" ;;
    PAGE_L4_break)
      edit_page "$1" "$(ref "$PAGES/PAGE_L4_apology.png")" "$(ref "$REFS/D4-clean.png")" "$(ref "$K7")" "$(ref "$CREEP_3")" ;;
    PAGE_L5_empty)
      edit_page "$1" "$(ref "$BG_FINALE")" "$(ref "$V4/masters/R0-master-room.png")" "$(ref "$REFS/D5-clean.png")" "$(ref "$K8")" "$(ref "$CHAR_FINAL")" "$(ref "$CREEP_3")" ;;
    PAGE_L5_poster)
      edit_page "$1" "$(ref "$BG_FINALE")" "$(ref "$V4/masters/R0-master-room.png")" "$(ref "$V4/masters/R0c-desk-props.png")" "$(ref "$REFS/D5-clean.png")" "$(ref "$K9")" "$(ref "$CHAR_FINAL")" "$(ref "$CREEP_3")" ;;
    PAGE_END_A_separate)
      edit_page "$1" "$(ref "$BG_FINALE")" "$(ref "$K8")" "$(ref "$PAGES/PAGE_L5_empty.png")" ;;
    PAGE_END_B_alienate)
      edit_page "$1" "$(ref "$PAGES/PAGE_END_A_separate.png")" "$(ref "$K8")" "$(ref "$ENDING_ECHO")" ;;
    PAGE_END_C_hollow)
      edit_page "$1" "$(ref "$BG_FINALE")" "$(ref "$K8")" "$(ref "$ENDING_HOLLOW")" ;;
    *) echo "unknown page id: $1" >&2; return 2 ;;
  esac
}

ALL_PAGES=(
  PAGE_L0_desk PAGE_L1_interview PAGE_L2_live PAGE_L2_fed
  PAGE_L3_door_default PAGE_L3_door_hesitant
  PAGE_L4_apology PAGE_L4_break PAGE_L5_empty PAGE_L5_poster
  PAGE_END_A_separate PAGE_END_B_alienate PAGE_END_C_hollow
)

case "${1:-all}" in
  all|batch)
    for id in "${ALL_PAGES[@]}"; do run_job "$id"; done ;;
  *) run_job "$1" ;;
esac

log "done"
