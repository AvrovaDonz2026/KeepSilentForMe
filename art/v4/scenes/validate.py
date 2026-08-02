#!/usr/bin/env python3
"""Validate the full-page scene manifest and generated PNGs."""
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / "manifest.json"
CHAPTERS = ROOT.parents[2] / "script" / "chapters.json"


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    chapters = json.loads(CHAPTERS.read_text(encoding="utf-8"))["chapters"]
    raw_assets = manifest.get("assets", [])
    if not isinstance(raw_assets, list):
        fail("assets must be a list")
    if any(not isinstance(asset, dict) for asset in raw_assets):
        fail("every asset must be an object")
    asset_ids = [asset.get("id") for asset in raw_assets]
    if any(not asset_id for asset_id in asset_ids):
        fail("every asset needs an id")
    if len(set(asset_ids)) != len(asset_ids):
        fail("asset IDs must be unique")
    asset_paths = [asset.get("path") for asset in raw_assets]
    if any(not path for path in asset_paths):
        fail("every asset needs a path")
    if len(set(asset_paths)) != len(asset_paths):
        fail("asset paths must be unique")
    assets = dict(zip(asset_ids, raw_assets))
    expected_size = tuple(manifest.get("canvas", []))
    if expected_size != (1536, 1024):
        fail(f"unexpected canvas {expected_size}")
    if len(raw_assets) != 13:
        fail(f"expected 13 page assets, got {len(raw_assets)}")

    scene_pages = manifest.get("scenePages")
    if not isinstance(scene_pages, list) or len(set(scene_pages)) != len(scene_pages):
        fail("scenePages must be a unique list")
    if scene_pages != asset_ids:
        fail("scenePages must list every registered page asset once and in asset order")

    for asset_id, asset in assets.items():
        if asset.get("kind") != "scenePage":
            fail(f"{asset_id} must be registered as kind scenePage")
        if tuple(asset.get("dimensions", [])) != expected_size:
            fail(f"{asset_id} has invalid manifest dimensions {asset.get('dimensions')}")
        path = ROOT / asset["path"]
        if not path.is_file():
            fail(f"missing {asset_id}: {path}")
        with Image.open(path) as image:
            if image.size != expected_size:
                fail(f"{asset_id} has size {image.size}, expected {expected_size}")
            if image.mode not in {"RGB", "RGBA"}:
                fail(f"{asset_id} has unsupported mode {image.mode}")
            if image.mode == "RGBA" and image.getchannel("A").getextrema()[0] < 255:
                fail(f"{asset_id} contains transparent pixels")

    page_ids = set(assets)
    cover_page = manifest.get("coverPage")
    if cover_page not in page_ids:
        fail(f"coverPage references missing page {cover_page}")
    bindings = manifest.get("pageBindings", {})
    chapter_ids = [chapter["id"] for chapter in chapters]
    if set(bindings) != set(chapter_ids):
        fail("pageBindings must contain exactly the chapter IDs")
    ending_ids = {"A_separate", "B_alienate", "C_consume", "C_cold"}
    referenced_endings = set()
    for chapter in chapters:
        binding = bindings.get(chapter["id"])
        if not isinstance(binding, dict):
            fail(f"missing page binding for {chapter['id']}")
        default_page = binding.get("default")
        if default_page not in page_ids:
            fail(f"{chapter['id']} has missing default page {default_page}")
        lines = binding.get("lines")
        line_ids = [line["id"] for line in chapter.get("lines", [])]
        if len(set(line_ids)) != len(line_ids):
            fail(f"{chapter['id']} contains duplicate line IDs")
        if not isinstance(lines, dict) or set(lines) != set(line_ids):
            fail(f"{chapter['id']} must bind every line exactly once")
        for line in chapter.get("lines", []):
            page_id = lines[line["id"]]
            if page_id not in page_ids:
                fail(f"{line['id']} references missing page {page_id}")
            for zone in line.get("zones", []):
                ending = zone.get("ending")
                if ending and ending not in ending_ids:
                    fail(f"{line['id']} references unknown ending {ending}")
                if ending:
                    referenced_endings.add(ending)

    endings = manifest.get("endingPages", {})
    if not isinstance(endings, dict) or set(endings) != ending_ids:
        fail("endingPages must contain all four ending IDs")
    for ending, page_id in endings.items():
        if page_id not in page_ids:
            fail(f"{ending} references missing page {page_id}")
    if referenced_endings != ending_ids:
        fail(f"chapter data must reference every ending exactly by ID; missing {sorted(ending_ids - referenced_endings)}")

    print(f"OK: {len(assets)} scene pages, {len(chapters)} chapters, 4 endings")


if __name__ == "__main__":
    main()
