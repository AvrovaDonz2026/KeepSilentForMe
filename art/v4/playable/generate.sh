#!/usr/bin/env bash
# Generate the v4 playable asset pack through the bundled imagegen CLI.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$ROOT/../../.." && pwd)"
PYTHON="${PYTHON:-python3}"
IMAGE_GEN="${IMAGE_GEN:-${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/image_gen.py}"
REMOVE_KEY="${REMOVE_KEY:-${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/remove_chroma_key.py}"
MODEL="${MODEL:-gpt-image-2}"
QUALITY="${QUALITY:-high}"
DRY_RUN="${DRY_RUN:-0}"
FORCE="${FORCE:-0}"
PRESERVE_FACE_BASE="${PRESERVE_FACE_BASE:-0}"
MODEL_MASK=""

export OPENAI_BASE_URL="${OPENAI_BASE_URL:-https://api.qingyuntop.top/v1}"

PROMPTS="$ROOT/prompts"
COMMON_PROMPT="$PROMPTS/common.txt"
SOURCE="$ROOT/source"
FACE_MASK="$SOURCE/FACE_expression-mask.png"
TMP_ROOT="${TMP_ROOT:-$REPO/tmp/imagegen/v4-playable}"

V4="$REPO/storyboard/v4-prop-lock"
DEMO="$REPO/storyboard/demo-effects/frames"
R0="$V4/masters/R0-master-room.png"
R0C="$V4/masters/R0c-desk-props.png"
K1="$V4/frames-2k/K1-she-needs-silence.png"
K2="$V4/frames-2k/K2-only-one-action.png"
K4="$V4/frames-2k/K4-first-livestream.png"
K5="$V4/frames-2k/K5-fed-by-unspoken.png"
K6="$V4/frames-2k/K6-friend-at-door.png"
K7="$V4/frames-2k/K7-apology-stream.png"
K8="$V4/frames-2k/K8-room-without-audience.png"
K9="$V4/frames-2k/K9-you-are-the-unsaid.png"
D0="$DEMO/D0-core-mechanic.png"
D1="$DEMO/D1-interview.png"
D2="$DEMO/D2-livestream.png"
D4="$DEMO/D4-apology-stream.png"
D6="$DEMO/D6-creature-stages.png"

FACE_IDS=(
  FACE_anxious FACE_composed FACE_fake_smile FACE_cold FACE_breaking
  FACE_dependent FACE_blank FACE_pleasing FACE_detached FACE_resolved
  FACE_downcast FACE_camera
)

INTERACTIVE_IDS=(
  FX_crt_glow_reflection FX_crt_screen_off UI_live_dot
  FX_comment_noise_stream FX_door_knock_ripple FX_door_lock_click
  UI_bar_locked UI_bar_cracked FX_censor_shatter FX_gray_letter_fall
)

FEEDBACK_IDS=(
  UI_bar_hover UI_bar_active UI_bar_snap
  FX_zone_hint FX_zone_snap_pulse FX_censor_drag_trail FX_censor_absorb
  FX_dialog_refresh_glitch FX_bar_reject_shiver FX_text_fragment_burst
  FX_letter_to_creature_arc FX_ink_feed_burst
)

log() {
  printf '[v4-playable] %s\n' "$*"
}

die() {
  printf '[v4-playable] error: %s\n' "$*" >&2
  exit 1
}

file_ready() {
  [[ -s "$1" && "$FORCE" != "1" ]]
}

ensure_tools() {
  [[ -f "$IMAGE_GEN" ]] || die "image generation CLI not found: $IMAGE_GEN"
  [[ -f "$REMOVE_KEY" ]] || die "chroma-key helper not found: $REMOVE_KEY"
  command -v "$PYTHON" >/dev/null 2>&1 || die "Python interpreter not found: $PYTHON"
  command -v magick >/dev/null 2>&1 || die "ImageMagick 'magick' is required"
  [[ "$DRY_RUN" == "1" || -n "${OPENAI_API_KEY:-}" ]] || die "OPENAI_API_KEY is not set"
}

compose_prompt() {
  local id="$1"
  local out="$TMP_ROOT/${id}.txt"
  [[ -f "$COMMON_PROMPT" ]] || die "missing common prompt: $COMMON_PROMPT"
  [[ -f "$PROMPTS/${id}.txt" ]] || die "missing asset prompt: $PROMPTS/${id}.txt"
  {
    cat "$COMMON_PROMPT"
    if [[ "$id" == FACE_* && "$id" != "FACE_base" ]]; then
      cat "$PROMPTS/FACE_identity_lock.txt"
      printf '\n'
    fi
    printf '\n\n'
    cat "$PROMPTS/${id}.txt"
  } > "$out"
  printf '%s\n' "$out"
}

run_model() {
  local id="$1"
  local size="$2"
  local out="$3"
  shift 3

  if file_ready "$out"; then
    log "skip raw $id"
    return 0
  fi

  local ref
  for ref in "$@"; do
    [[ -f "$ref" ]] || die "missing reference for $id: $ref"
  done

  local prompt_file
  prompt_file="$(compose_prompt "$id")"
  local args=(
    "$PYTHON" "$IMAGE_GEN" edit
    --model "$MODEL"
    --size "$size"
    --quality "$QUALITY"
    --output-format png
    --no-augment
    --prompt-file "$prompt_file"
    --out "$out"
  )
  for ref in "$@"; do
    args+=(--image "$ref")
  done
  if [[ -n "$MODEL_MASK" ]]; then
    args+=(--mask "$MODEL_MASK")
  fi
  if [[ "$FORCE" == "1" ]]; then
    args+=(--force)
  fi
  if [[ "$DRY_RUN" == "1" ]]; then
    args+=(--dry-run)
  fi

  log "generate $id ($size)"
  "${args[@]}"
}

to_alpha() {
  local input="$1"
  local out="$2"
  if file_ready "$out"; then
    return 0
  fi
  [[ -s "$input" ]] || die "raw source missing for alpha conversion: $input"

  local args=(
    "$PYTHON" "$REMOVE_KEY"
    --input "$input"
    --out "$out"
    --auto-key border
    --soft-matte
    --transparent-threshold 12
    --opaque-threshold 220
    --despill
  )
  if [[ "$FORCE" == "1" ]]; then
    args+=(--force)
  fi
  "${args[@]}"
}

fit_canvas() {
  local input="$1"
  local out="$2"
  local size="$3"
  if file_ready "$out"; then
    return 0
  fi
  magick "$input" -resize "$size" -background none -gravity center -extent "$size" "$out"
}

fit_bottom_canvas() {
  local input="$1"
  local out="$2"
  local size="$3"
  if file_ready "$out"; then
    return 0
  fi
  magick "$input" -resize "$size" -background none -gravity south -extent "$size" "$out"
}

crop_face_canvas() {
  local input="$1"
  local out="$2"
  local scaled="$TMP_ROOT/$(basename "${out%.png}")-face-scale.png"
  if file_ready "$out"; then
    return 0
  fi

  magick "$input" -resize 1024x "$scaled"
  local dimensions width height offset
  dimensions="$(identify -format '%w %h' "$scaled")"
  read -r width height <<<"$dimensions"
  if (( height >= 1024 )); then
    offset=$(( (height - 1024) / 3 ))
    magick "$scaled" -crop "1024x1024+0+${offset}" +repage "$out"
  else
    magick "$input" -resize '1024x1024^' -gravity center -extent 1024x1024 "$out"
  fi
}

render_base() {
  if [[ "$PRESERVE_FACE_BASE" == "1" && -s "$SOURCE/FACE_base.png" ]]; then
    log "preserve canonical FACE_base"
    ensure_face_mask
    return 0
  fi
  run_model FACE_base 1024x1024 "$SOURCE/FACE_base.png" "$K5" "$K9"
  ensure_face_mask
}

ensure_face_mask() {
  [[ -s "$SOURCE/FACE_base.png" ]] || die "canonical FACE_base is required before face edits"
  if file_ready "$FACE_MASK"; then
    return 0
  fi
  local geometry
  geometry="$(identify -format '%wx%h' "$SOURCE/FACE_base.png")"
  # The transparent oval is the only region the edit endpoint may redraw.
  magick -size "$geometry" xc:white \
    \( -size "$geometry" xc:white -fill black -draw 'ellipse 512,650 300,245 0,360' \) \
    -alpha off -compose CopyOpacity -composite "$FACE_MASK"
}

render_face() {
  local id="$1"
  local alpha="$TMP_ROOT/${id}-alpha.png"
  render_base
  if [[ "$DRY_RUN" == "1" ]]; then
    return 0
  fi
  if file_ready "$ROOT/faces/${id}.png"; then
    log "skip final $id"
    return 0
  fi
  local previous_mask="$MODEL_MASK"
  MODEL_MASK="$FACE_MASK"
  run_model "$id" 1024x1024 "$SOURCE/${id}.png" "$SOURCE/FACE_base.png"
  MODEL_MASK="$previous_mask"
  to_alpha "$SOURCE/${id}.png" "$alpha"
  crop_face_canvas "$alpha" "$ROOT/faces/${id}.png"
}

render_character() {
  local id="$1"
  local alpha="$TMP_ROOT/${id}-alpha.png"
  shift
  if [[ "$DRY_RUN" == "1" ]]; then
    run_model "$id" 1024x1024 "$SOURCE/${id}.png" "$@"
    return 0
  fi
  run_model "$id" 1024x1024 "$SOURCE/${id}.png" "$@"
  to_alpha "$SOURCE/${id}.png" "$alpha"
  fit_canvas "$alpha" "$ROOT/char/${id}.png" 1024x1024
}

render_narrative_layer() {
  local id="$1"
  local destination="$2"
  local alpha="$TMP_ROOT/${id}-alpha.png"
  shift 2
  if [[ "$DRY_RUN" == "1" ]]; then
    run_model "$id" 1024x1024 "$SOURCE/${id}.png" "$@"
    return 0
  fi
  run_model "$id" 1024x1024 "$SOURCE/${id}.png" "$@"
  to_alpha "$SOURCE/${id}.png" "$alpha"
  fit_bottom_canvas "$alpha" "$ROOT/$destination/${id}.png" 1024x1024
}

render_narrative_character() {
  local id="$1"
  render_narrative_layer "$id" char "$SOURCE/CHAR_stand.png"
}

render_creature() {
  local id="$1"
  local alpha="$TMP_ROOT/${id}-alpha.png"
  shift
  if [[ "$DRY_RUN" == "1" ]]; then
    run_model "$id" 1024x1024 "$SOURCE/${id}.png" "$@"
    return 0
  fi
  run_model "$id" 1024x1024 "$SOURCE/${id}.png" "$@"
  to_alpha "$SOURCE/${id}.png" "$alpha"
  fit_canvas "$alpha" "$ROOT/creature/${id}.png" 1024x1024
}

render_interactive_layer() {
  local id="$1"
  local destination="$2"
  local model_size="$3"
  local final_size="$4"
  local alpha="$TMP_ROOT/${id}-alpha.png"
  shift 4
  if [[ "$DRY_RUN" == "1" ]]; then
    run_model "$id" "$model_size" "$SOURCE/${id}.png" "$@"
    return 0
  fi
  if file_ready "$ROOT/$destination/${id}.png"; then
    log "skip final $id"
    return 0
  fi
  run_model "$id" "$model_size" "$SOURCE/${id}.png" "$@"
  to_alpha "$SOURCE/${id}.png" "$alpha"
  case "$id" in
    UI_live_dot)
      # GPT Image 2 requires a large request canvas; trim the generated dot
      # before reducing it to the compact runtime HUD asset.
      magick "$alpha" -trim +repage -resize '96x96' -background none -gravity center -extent "$final_size" "$ROOT/$destination/${id}.png"
      ;;
    UI_bar_locked|UI_bar_cracked|UI_bar_hover|UI_bar_active|UI_bar_snap)
      magick "$alpha" -trim +repage -resize "${final_size}!" "$ROOT/$destination/${id}.png"
      ;;
    *)
      fit_canvas "$alpha" "$ROOT/$destination/${id}.png" "$final_size"
      ;;
  esac
}

render_crt_screen_off() {
  if [[ ! -s "$SOURCE/FX_crt_glow_reflection.png" ]]; then
    render_interactive_layer FX_crt_glow_reflection fx 1024x1024 1024x1024 "$R0C"
  fi
  render_interactive_layer FX_crt_screen_off fx 1024x1024 1024x1024 "$SOURCE/FX_crt_glow_reflection.png"
}

render_interactive() {
  render_interactive_layer FX_crt_glow_reflection fx 1024x1024 1024x1024 "$R0C"
  render_crt_screen_off
  render_interactive_layer UI_live_dot ui 1024x1024 128x128 "$SOURCE/FX_ink_glyph_motes.png"
  render_interactive_layer FX_comment_noise_stream fx 1024x1024 1024x1024 "$SOURCE/FX_ink_glyph_motes.png"
  render_interactive_layer FX_door_knock_ripple fx 1024x1024 1024x1024 "$K6"
  render_interactive_layer FX_door_lock_click fx 1024x1024 1024x1024 "$K6"
  render_interactive_layer UI_bar_locked ui 1536x512 400x48 "$SOURCE/UI_bar.png"
  render_interactive_layer UI_bar_cracked ui 1536x512 400x48 "$SOURCE/UI_bar.png"
  render_interactive_layer FX_censor_shatter fx 1024x1024 1024x1024 "$SOURCE/FX_censor_growth_strip.png"
  render_interactive_layer FX_gray_letter_fall fx 1024x1024 1024x1024 "$SOURCE/FX_ink_glyph_motes.png"
}

render_feedback() {
  render_interactive_layer UI_bar_hover ui 1536x512 400x48 "$SOURCE/UI_bar.png" "$D0" "$D4"
  render_interactive_layer UI_bar_active ui 1536x512 400x48 "$SOURCE/UI_bar.png" "$D0" "$D4"
  render_interactive_layer UI_bar_snap ui 1536x512 400x48 "$SOURCE/UI_bar.png" "$D0" "$D4"
  render_interactive_layer FX_zone_hint fx 1536x512 1024x256 "$SOURCE/FX_censor_growth_strip.png" "$D0"
  render_interactive_layer FX_zone_snap_pulse fx 1536x512 1024x256 "$SOURCE/FX_censor_growth_strip.png" "$D0"
  render_interactive_layer FX_censor_drag_trail fx 1536x512 1024x256 "$SOURCE/FX_censor_growth_strip.png" "$D0" "$D4"
  render_interactive_layer FX_censor_absorb fx 1536x512 1024x256 "$SOURCE/FX_censor_growth_strip.png" "$D0" "$D4"
  render_interactive_layer FX_dialog_refresh_glitch fx 1536x512 1024x256 "$SOURCE/FX_comment_noise_stream.png" "$D2"
  render_interactive_layer FX_bar_reject_shiver fx 1536x512 1024x256 "$SOURCE/UI_bar_cracked.png" "$D4"
  render_interactive_layer FX_text_fragment_burst fx 1024x1024 1024x1024 "$SOURCE/FX_censor_shatter.png" "$D0" "$D4"
  render_interactive_layer FX_letter_to_creature_arc fx 1024x1024 1024x1024 "$SOURCE/FX_ink_glyph_motes.png" "$D6"
  render_interactive_layer FX_ink_feed_burst fx 1024x1024 1024x1024 "$SOURCE/FX_ink_glyph_motes.png" "$D6"
}

render_motes() {
  local alpha="$TMP_ROOT/FX_ink_glyph_motes-alpha.png"
  if [[ "$DRY_RUN" == "1" ]]; then
    run_model FX_ink_glyph_motes 1024x1024 "$SOURCE/FX_ink_glyph_motes.png" "$D0" "$D6"
    return 0
  fi
  run_model FX_ink_glyph_motes 1024x1024 "$SOURCE/FX_ink_glyph_motes.png" "$D0" "$D6"
  to_alpha "$SOURCE/FX_ink_glyph_motes.png" "$alpha"
  fit_canvas "$alpha" "$ROOT/fx/FX_ink_glyph_motes.png" 1024x1024
}

render_growth_strip() {
  local alpha="$TMP_ROOT/FX_censor_growth_strip-alpha.png"
  if [[ "$DRY_RUN" == "1" ]]; then
    run_model FX_censor_growth_strip 1536x512 "$SOURCE/FX_censor_growth_strip.png" "$D0" "$D4"
    return 0
  fi
  if file_ready "$ROOT/fx/FX_censor_growth_strip.png"; then
    log "skip final FX_censor_growth_strip"
    return 0
  fi
  run_model FX_censor_growth_strip 1536x512 "$SOURCE/FX_censor_growth_strip.png" "$D0" "$D4"
  to_alpha "$SOURCE/FX_censor_growth_strip.png" "$alpha"
  magick "$alpha" -resize 1024x -gravity center -crop 1024x256+0+0 +repage "$ROOT/fx/FX_censor_growth_strip.png"
}

render_dialog() {
  local alpha="$TMP_ROOT/UI_dialog-alpha.png"
  local scaled="$TMP_ROOT/UI_dialog-scaled.png"
  local left="$TMP_ROOT/UI_dialog-left.png"
  local center="$TMP_ROOT/UI_dialog-center.png"
  local right="$TMP_ROOT/UI_dialog-right.png"
  if [[ "$DRY_RUN" == "1" ]]; then
    run_model UI_dialog 1536x512 "$SOURCE/UI_dialog.png" "$D0"
    return 0
  fi
  if file_ready "$ROOT/ui/UI_dialog.png"; then
    log "skip final UI_dialog"
    return 0
  fi
  run_model UI_dialog 1536x512 "$SOURCE/UI_dialog.png" "$D0"
  to_alpha "$SOURCE/UI_dialog.png" "$alpha"
  magick "$alpha" -resize '1440x480^' -background none -gravity center -extent 1440x480 "$scaled"
  magick "$scaled" -crop 48x480+0+0 +repage "$left"
  magick "$scaled" -crop 1344x480+48+0 +repage -resize 1824x480! "$center"
  magick "$scaled" -crop 48x480+1392+0 +repage "$right"
  magick "$left" "$center" "$right" +append "$ROOT/ui/UI_dialog.png"
}

render_bar() {
  local alpha="$TMP_ROOT/UI_bar-alpha.png"
  if [[ "$DRY_RUN" == "1" ]]; then
    run_model UI_bar 1536x512 "$SOURCE/UI_bar.png" "$D0" "$D4"
    return 0
  fi
  if file_ready "$ROOT/ui/UI_bar.png"; then
    log "skip final UI_bar"
    return 0
  fi
  run_model UI_bar 1536x512 "$SOURCE/UI_bar.png" "$D0" "$D4"
  to_alpha "$SOURCE/UI_bar.png" "$alpha"
  magick "$alpha" -trim +repage -resize 400x48! "$ROOT/ui/UI_bar.png"
}

render_faces() {
  local id
  for id in "${FACE_IDS[@]}"; do
    render_face "$id"
  done
}

render_characters() {
  render_character CHAR_desk "$K2" "$K4" "$R0C"
  render_character CHAR_stand "$K1" "$K8" "$R0"
  render_character CHAR_door "$K6" "$R0"
  render_narrative_character CHAR_sleeve_press
  render_narrative_character CHAR_interview_sit
  render_narrative_character CHAR_livestream_speaking
  render_narrative_character CHAR_apology_bow
  render_narrative_character CHAR_final_speaking
}

render_npcs() {
  render_narrative_layer NPC_friend_door_silhouette npc "$K6"
  render_narrative_layer NPC_friend_hesitant_silhouette npc "$K6"
  render_narrative_layer NPC_interviewer_a npc "$D1"
  render_narrative_layer NPC_interviewer_b npc "$D1"
}

render_ending_echo() {
  render_narrative_character CHAR_final_speaking
  if [[ "$DRY_RUN" == "1" ]]; then
    render_narrative_layer ENDING_echo_overlap ending "$SOURCE/CHAR_stand.png"
  else
    render_narrative_layer ENDING_echo_overlap ending "$SOURCE/CHAR_final_speaking.png"
  fi
}

render_ending_hollow() {
  if [[ ! -s "$SOURCE/CREEP_3.png" ]]; then
    render_creature CREEP_3 "$D6" "$K8"
  fi
  render_narrative_layer ENDING_hollow_proxy ending "$SOURCE/CREEP_3.png"
}

render_endings() {
  render_ending_echo
  render_ending_hollow
}

render_creatures() {
  render_creature CREEP_1 "$D6" "$K2"
  render_creature CREEP_2 "$D6" "$K4"
  render_creature CREEP_3 "$D6" "$K8"
}

usage() {
  cat <<'EOF'
Usage: generate.sh [all|faces|characters|creatures|npcs|endings|narrative|fx|ui|interactive|feedback|ASSET_ID]

Environment:
  OPENAI_API_KEY      Required unless DRY_RUN=1.
  OPENAI_BASE_URL     Defaults to https://api.qingyuntop.top/v1.
  MODEL               Defaults to gpt-image-2.
  QUALITY             Defaults to high.
  DRY_RUN=1           Print image requests without calling the API.
  FORCE=1             Regenerate and overwrite this pack's assets.
EOF
}

main() {
  local target="${1:-all}"
  case "$target" in
    -h|--help|help)
      usage
      return 0
      ;;
  esac
  ensure_tools
  mkdir -p "$SOURCE" "$ROOT/faces" "$ROOT/char" "$ROOT/creature" "$ROOT/npc" "$ROOT/ending" "$ROOT/fx" "$ROOT/ui" "$TMP_ROOT"

  case "$target" in
    all)
      render_faces
      render_characters
      render_creatures
      render_npcs
      render_endings
      render_motes
      render_growth_strip
      render_dialog
      render_bar
      render_interactive
      render_feedback
      ;;
    faces) render_faces ;;
    characters) render_characters ;;
    creatures) render_creatures ;;
    npcs) render_npcs ;;
    endings) render_endings ;;
    narrative)
      render_characters
      render_npcs
      render_endings
      ;;
    fx)
      render_motes
      render_growth_strip
      ;;
    ui)
      render_dialog
      render_bar
      ;;
    interactive)
      render_interactive
      render_feedback
      ;;
    feedback) render_feedback ;;
    FACE_base) render_base ;;
    FACE_anxious|FACE_composed|FACE_fake_smile|FACE_cold|FACE_breaking|FACE_dependent|FACE_blank|FACE_pleasing|FACE_detached|FACE_resolved|FACE_downcast|FACE_camera)
      render_face "$target"
      ;;
    CHAR_desk)
      render_character CHAR_desk "$K2" "$K4" "$R0C"
      ;;
    CHAR_stand)
      render_character CHAR_stand "$K1" "$K8" "$R0"
      ;;
    CHAR_door)
      render_character CHAR_door "$K6" "$R0"
      ;;
    CHAR_sleeve_press) render_narrative_character CHAR_sleeve_press ;;
    CHAR_interview_sit) render_narrative_character CHAR_interview_sit ;;
    CHAR_livestream_speaking) render_narrative_character CHAR_livestream_speaking ;;
    CHAR_apology_bow) render_narrative_character CHAR_apology_bow ;;
    CHAR_final_speaking) render_narrative_character CHAR_final_speaking ;;
    NPC_friend_door_silhouette) render_narrative_layer NPC_friend_door_silhouette npc "$K6" ;;
    NPC_friend_hesitant_silhouette) render_narrative_layer NPC_friend_hesitant_silhouette npc "$K6" ;;
    NPC_interviewer_a) render_narrative_layer NPC_interviewer_a npc "$D1" ;;
    NPC_interviewer_b) render_narrative_layer NPC_interviewer_b npc "$D1" ;;
    ENDING_echo_overlap) render_ending_echo ;;
    ENDING_hollow_proxy) render_ending_hollow ;;
    CREEP_1) render_creature CREEP_1 "$D6" "$K2" ;;
    CREEP_2) render_creature CREEP_2 "$D6" "$K4" ;;
    CREEP_3) render_creature CREEP_3 "$D6" "$K8" ;;
    FX_ink_glyph_motes) render_motes ;;
    FX_censor_growth_strip) render_growth_strip ;;
    UI_dialog) render_dialog ;;
    UI_bar) render_bar ;;
    FX_crt_glow_reflection) render_interactive_layer FX_crt_glow_reflection fx 1024x1024 1024x1024 "$R0C" ;;
    FX_crt_screen_off) render_crt_screen_off ;;
    UI_live_dot) render_interactive_layer UI_live_dot ui 1024x1024 128x128 "$SOURCE/FX_ink_glyph_motes.png" ;;
    FX_comment_noise_stream) render_interactive_layer FX_comment_noise_stream fx 1024x1024 1024x1024 "$SOURCE/FX_ink_glyph_motes.png" ;;
    FX_door_knock_ripple) render_interactive_layer FX_door_knock_ripple fx 1024x1024 1024x1024 "$K6" ;;
    FX_door_lock_click) render_interactive_layer FX_door_lock_click fx 1024x1024 1024x1024 "$K6" ;;
    UI_bar_locked) render_interactive_layer UI_bar_locked ui 1536x512 400x48 "$SOURCE/UI_bar.png" ;;
    UI_bar_cracked) render_interactive_layer UI_bar_cracked ui 1536x512 400x48 "$SOURCE/UI_bar.png" ;;
    FX_censor_shatter) render_interactive_layer FX_censor_shatter fx 1024x1024 1024x1024 "$SOURCE/FX_censor_growth_strip.png" ;;
    FX_gray_letter_fall) render_interactive_layer FX_gray_letter_fall fx 1024x1024 1024x1024 "$SOURCE/FX_ink_glyph_motes.png" ;;
    UI_bar_hover) render_interactive_layer UI_bar_hover ui 1536x512 400x48 "$SOURCE/UI_bar.png" "$D0" "$D4" ;;
    UI_bar_active) render_interactive_layer UI_bar_active ui 1536x512 400x48 "$SOURCE/UI_bar.png" "$D0" "$D4" ;;
    UI_bar_snap) render_interactive_layer UI_bar_snap ui 1536x512 400x48 "$SOURCE/UI_bar.png" "$D0" "$D4" ;;
    FX_zone_hint) render_interactive_layer FX_zone_hint fx 1536x512 1024x256 "$SOURCE/FX_censor_growth_strip.png" "$D0" ;;
    FX_zone_snap_pulse) render_interactive_layer FX_zone_snap_pulse fx 1536x512 1024x256 "$SOURCE/FX_censor_growth_strip.png" "$D0" ;;
    FX_censor_drag_trail) render_interactive_layer FX_censor_drag_trail fx 1536x512 1024x256 "$SOURCE/FX_censor_growth_strip.png" "$D0" "$D4" ;;
    FX_censor_absorb) render_interactive_layer FX_censor_absorb fx 1536x512 1024x256 "$SOURCE/FX_censor_growth_strip.png" "$D0" "$D4" ;;
    FX_dialog_refresh_glitch) render_interactive_layer FX_dialog_refresh_glitch fx 1536x512 1024x256 "$SOURCE/FX_comment_noise_stream.png" "$D2" ;;
    FX_bar_reject_shiver) render_interactive_layer FX_bar_reject_shiver fx 1536x512 1024x256 "$SOURCE/UI_bar_cracked.png" "$D4" ;;
    FX_text_fragment_burst) render_interactive_layer FX_text_fragment_burst fx 1024x1024 1024x1024 "$SOURCE/FX_censor_shatter.png" "$D0" "$D4" ;;
    FX_letter_to_creature_arc) render_interactive_layer FX_letter_to_creature_arc fx 1024x1024 1024x1024 "$SOURCE/FX_ink_glyph_motes.png" "$D6" ;;
    FX_ink_feed_burst) render_interactive_layer FX_ink_feed_burst fx 1024x1024 1024x1024 "$SOURCE/FX_ink_glyph_motes.png" "$D6" ;;
    -h|--help|help)
      usage
      ;;
    *)
      usage >&2
      die "unknown target: $target"
      ;;
  esac
}

main "$@"
