# Web Demo

This is the first playable runtime for the V4 asset pack. It is intentionally
dependency-free: native HTML, CSS, JavaScript, Pointer Events, and localStorage.

Run it from the repository root so the page can fetch the chapter script, the
interaction manifest, and the full-page scene manifest:

```bash
python3 -m http.server 8765 --directory .
```

Open `http://127.0.0.1:8765/web/`.

GitHub Pages deployment is handled by
`.github/workflows/deploy-pages.yml`. After the first Pages setup, pushes to `main`
publish the game at:

`https://avrovadonz2026.github.io/KeepSilentForMe/web/`

Normal launches show the title cover first, using `coverPage` from
`art/v4/scenes/manifest.json`. A saved run exposes Continue and New Game;
chapter/line/ending query parameters remain direct debug entry points.

The demo runs L0 through L5, renders each line from the canonical chapter JSON,
and turns between complete scene pages from `art/v4/scenes/pages/`. Page timing is
bound by `art/v4/scenes/manifest.json`: chapter openings and key dialogue nodes
swap the entire background page, while the dialogue frame, draggable black bar,
feedback FX, and ending overlay remain HTML controls. This avoids runtime
alignment problems from stacking separate transparent character, creature, and
background layers.

Generate or validate the page pack from the repository root:

```bash
OPENAI_API_KEY=... art/v4/scenes/generate_pages.sh all
python3 art/v4/scenes/validate.py
```

The generator accepts `MODEL=gpt-image2` as an alias and normalizes it to the
provider model name `gpt-image-2`. It keeps API responses and logs under `/tmp`
and never writes credentials into the repository.
