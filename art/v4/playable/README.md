# V4 Playable Asset Pack

This directory contains the V4 source and feedback asset expansion for Keep Silent
For Me. The page-turn Demo renders complete scenes from `art/v4/scenes/`; the
transparent narrative layers here remain available for source continuity and
future variants, but are not composited at runtime by the Demo.

The pack preserves the earlier `art/` batch and uses the v4 prop-lock storyboard
only as a visual and continuity reference. UI and feedback layers remain separate
because they are still rendered by HTML; scene characters and endings are baked
into the full-page images.

## Deliverables

- `faces/`: 12 interchangeable dialogue portraits (10 base expressions plus 2 variants).
- `char/`: desk, standing, door-side, and five narrative full-body sprites.
- `npc/`: friend silhouettes and interview-side observers.
- `ending/`: the overlap echo and hollow replacement ending sprites.
- `creature/`: the three silence-entity stages.
- `fx/`: 18 reusable ink/glyph, CRT, door, censor, snap, absorption, and
  dialogue-refresh state layers.
- `ui/`: 8 runtime UI layers: dialogue panel, censor bar, live indicator, and
  hover/active/snap/locked/cracked bar states.
- `source/`: raw chroma-key model output retained for reprocessing.
- `validation/`: validator report plus category and full-pack visual contact sheets.
- `manifest.json`: runtime labels, dimensions, anchors, and animation mappings.

## Directory Layout

The generated runtime files and their editable inputs stay separated:

```text
art/v4/playable/
  faces/ char/ npc/ creature/ ending/ fx/ ui/  final RGBA runtime layers
  source/                                      raw keyed model output and masks
  prompts/                                     per-asset prompts and common style lock
  validation/                                  report and visual contact sheets
  generate.sh                                  one generation entry point
  manifest.json                                runtime paths and chapter bindings
```

`source/` is intentionally retained for identity-locked edits and re-keying.
The page-turn runtime loads scene pages from `art/v4/scenes/manifest.json` and
uses this manifest for UI/feedback asset paths; the transparent narrative folders
are source-only for this Demo.
The older root-level `art/` folders are compatibility inputs, not a second
runtime pack.

## Generation

`generate.sh` calls the bundled Codex image-generation CLI with a process-local
`OPENAI_API_KEY` and `OPENAI_BASE_URL`. It never reads or stores a credential.
All final PNGs are generated on a solid green key, then converted to alpha.
The provider may return a different aspect ratio from the requested canvas;
the script crops dialogue portraits, center-fits legacy sprites, and bottom-fits
the new pivoted narrative layers into the exact manifest canvas after keying.

The selected Python interpreter needs the dependencies in `requirements.txt`.
For example:

```bash
uv venv .venv
uv pip install --python .venv/bin/python -r art/v4/playable/requirements.txt
```

Run one asset or a named group after exporting credentials:

```bash
OPENAI_BASE_URL=https://api.qingyuntop.top/v1 \
OPENAI_API_KEY=... \
PYTHON=.venv/bin/python \
./art/v4/playable/generate.sh faces
```

Supported targets are `all`, `faces`, `characters`, `creatures`, `npcs`,
`endings`, `narrative`, `fx`, `ui`, `interactive`, `feedback`, or an individual asset ID from
`manifest.json`. The `narrative` group covers the five new main-character
poses, four NPC layers, and both ending layers.

The `interactive` group adds the original ten state/event layers plus the twelve
feedback layers without introducing new character identities. The feedback
group covers hover, active drag, snap confirmation, zone hinting, drag residue,
text absorption, dialogue refresh, rejection shiver, fragment burst, and the
ink-to-creature transfer. GPT Image 2 requests use a model-valid source canvas
(`1024x1024` for square FX, `1536x512` for strips and bar variants); the script
trims and resizes outputs to their manifest dimensions after chroma removal.

`generate_narrative_extension.py` is retained as a dry-run reference only; its
live path is disabled to prevent duplicate manifest entries. Use `generate.sh`
for all API calls.

Every new main-character pose uses `/images/edits` with one canonical
`source/CHAR_stand.png` reference. This keeps hair, hoodie, proportions, and
face identity stable across the playable poses. The ending echo is edited from
the generated `CHAR_final_speaking` source, while the hollow proxy is edited
from `source/CREEP_3.png`.

The interactive layers also use `/images/edits`, one visual reference per asset,
and never add a person to the effect. `interactiveBindings` records the chapter
line trigger, optional exclusive state group, runtime anchor, and render layer
for L0-L5. L0 now has the complete tutorial feedback loop; L1 intentionally has
no CRT overlay because its scene is the meeting room.

All twelve feedback layers in the current pack are `/images/edits` outputs using
approved V4 material references; the temporary local derivatives made during a
provider-quota interruption were replaced after the edit endpoint became
available again.
The machine ending IDs are `A_separate`, `B_alienate`, `C_consume`, and
`C_cold`; Chinese labels remain display-only in the screenplay.

Face edits use `/images/edits` with one canonical portrait plus a local oval
expression mask. To regenerate the face set without changing that canonical
portrait, use `FORCE=1 PRESERVE_FACE_BASE=1`.

## Verification

Run the validator with the same Python environment used for generation:

```bash
PYTHON=.venv/bin/python
$PYTHON art/v4/playable/validate.py
```

It writes `validation/report.json` and checks manifest references, output
dimensions, RGBA mode, transparent corners for layered assets, interactive
state/event anchors, ending IDs, and visible chroma-green remnants. The five
older backgrounds remain external dependencies
and are reported as runtime fit/crop warnings because they are not 16:9.
