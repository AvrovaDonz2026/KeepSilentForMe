# V4 Playable Asset Pack

This directory contains the runtime-facing asset expansion for Keep Silent For Me.

The pack preserves the earlier `art/` batch and uses the v4 prop-lock storyboard
only as a visual and continuity reference. It is designed for layered scene
composition: full-body sprites remain separate from the dialogue portrait cards.

## Deliverables

- `faces/`: 12 interchangeable dialogue portraits.
- `char/`: desk, standing, door-side, and five narrative full-body sprites.
- `npc/`: friend silhouettes and interview-side observers.
- `ending/`: the overlap echo and hollow replacement ending sprites.
- `creature/`: the three silence-entity stages.
- `fx/`: reusable ink/glyph effects.
- `ui/`: the dialogue panel and draggable censor bar.
- `source/`: raw chroma-key model output retained for reprocessing.
- `manifest.json`: runtime labels, dimensions, anchors, and animation mappings.

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
`endings`, `narrative`, `fx`, `ui`, or an individual asset ID from
`manifest.json`. The `narrative` group covers the five new main-character
poses, four NPC layers, and both ending layers.

`generate_narrative_extension.py` is retained as a dry-run reference only; its
live path is disabled to prevent duplicate manifest entries. Use `generate.sh`
for all API calls.

Every new main-character pose uses `/images/edits` with one canonical
`source/CHAR_stand.png` reference. This keeps hair, hoodie, proportions, and
face identity stable across the playable poses. The ending echo is edited from
the generated `CHAR_final_speaking` source, while the hollow proxy is edited
from `source/CREEP_3.png`.

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
dimensions, RGBA mode, transparent corners for layered assets, and visible
chroma-green remnants. The five older backgrounds remain external dependencies
and are reported as runtime fit/crop warnings because they are not 16:9.
