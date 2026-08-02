# V4 Full-Page Scene Pack

The Web Demo uses one complete scene image per page. Character, NPC, silence
creature, room and ending art are baked into these pages; the browser no longer
positions transparent character layers.

`manifest.json` is the source of truth for page IDs, the title cover page,
line-to-page bindings and ending pages. The current pack contains 13 pages; the
title cover reuses `PAGE_L5_poster` through `coverPage` and does not add another
image asset:

- L0 desk, L1 interview;
- L2 livestream start and fed stage;
- L3 door default and hesitant friend;
- L4 apology and break;
- L5 empty room and poster key art;
- A, B and shared C hollow ending pages.

Generate through the edit endpoint without putting a key in the repository:

```bash
OPENAI_BASE_URL=https://api.qingyuntop.top/v1 \
OPENAI_API_KEY=... \
MODEL=gpt-image-2 \
./art/v4/scenes/generate_pages.sh all
```

The script accepts `MODEL=gpt-image2` as an alias, keeps response JSON under
`/tmp/keep-silent-scene-pages`, and skips existing pages unless `FORCE=1` is
set. Prompts use the V4 prop-lock references and explicitly forbid UI text.

Validate generated pages with:

```bash
python3 art/v4/scenes/validate.py
```
