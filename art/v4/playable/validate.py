#!/usr/bin/env python3
"""Validate the v4 playable PNG pack described by manifest.json."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import sys
from typing import Any

from PIL import Image


CORNER_SIZE = 8
ALPHA_CORNER_LIMIT = 8
OPAQUE_ALPHA = 245
GREEN_ERROR = (4, 251, 4)
EXPECTED_ENDING_IDS = {"A_separate", "B_alienate", "C_consume", "C_cold"}
EXPECTED_INTERACTIVE_LEVELS = ("L0", "L1", "L2", "L3", "L4", "L5")


def is_within(path: Path, parent: Path) -> bool:
    try:
        path.relative_to(parent)
    except ValueError:
        return False
    return True


def read_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def image_stats(path: Path, require_transparent_corners: bool) -> dict[str, Any]:
    with Image.open(path) as opened:
        image = opened.convert("RGBA")
        original_mode = opened.mode
        width, height = image.size
        alpha = image.getchannel("A")
        alpha_histogram = alpha.histogram()
        total = width * height
        transparent = alpha_histogram[0]
        partial = sum(alpha_histogram[1:255])
        opaque = sum(alpha_histogram[OPAQUE_ALPHA:])
        corner_max_alpha: list[int] = []
        for box in (
            (0, 0, CORNER_SIZE, CORNER_SIZE),
            (width - CORNER_SIZE, 0, width, CORNER_SIZE),
            (0, height - CORNER_SIZE, CORNER_SIZE, height),
            (width - CORNER_SIZE, height - CORNER_SIZE, width, height),
        ):
            corner_max_alpha.append(image.crop(box).getchannel("A").getextrema()[1])

        green_pixels = 0
        red_max, green_min, blue_max = GREEN_ERROR
        pixels = image.get_flattened_data() if hasattr(image, "get_flattened_data") else image.getdata()
        for red, green, blue, opacity in pixels:
            if opacity > ALPHA_CORNER_LIMIT and red <= red_max and green >= green_min and blue <= blue_max:
                green_pixels += 1

    return {
        "mode": original_mode,
        "dimensions": [width, height],
        "alpha": {
            "transparent": transparent,
            "partial": partial,
            "opaque": opaque,
            "opaqueFraction": opaque / total,
            "cornerMax": corner_max_alpha,
            "requiresTransparentCorners": require_transparent_corners,
        },
        "greenPixels": green_pixels,
    }


def add_error(result: dict[str, Any], message: str) -> None:
    result["errors"].append(message)


def add_warning(result: dict[str, Any], message: str) -> None:
    result["warnings"].append(message)


def validate_narrative_bindings(
    manifest: dict[str, Any],
    asset_ids: set[Any],
    report: dict[str, Any],
) -> None:
    bindings = manifest.get("narrativeBindings")
    if not isinstance(bindings, dict):
        add_error(report, "narrativeBindings must be an object")
        return

    scene_bindings = manifest.get("sceneBindings", {})
    if not isinstance(scene_bindings, dict):
        scene_bindings = {}

    for level in ("L0", "L1", "L2", "L3", "L4", "L5"):
        binding = bindings.get(level)
        if not isinstance(binding, dict):
            add_error(report, f"narrativeBindings.{level} must be an object")
            continue
        scene = binding.get("scene")
        if not isinstance(scene, str) or scene not in scene_bindings:
            add_error(report, f"narrativeBindings.{level}.scene references missing scene {scene}")
        for flag in ("replaceCharacter", "replaceNpc", "replaceCreature", "replaceSceneLayers"):
            if not isinstance(binding.get(flag), bool):
                add_error(report, f"narrativeBindings.{level}.{flag} must be boolean")
        layers = binding.get("layers")
        if not isinstance(layers, list):
            add_error(report, f"narrativeBindings.{level}.layers must be an array")
        else:
            for index, layer in enumerate(layers):
                if not isinstance(layer, dict):
                    add_error(report, f"narrativeBindings.{level}.layers[{index}] must be an object")
                    continue
                asset = layer.get("asset")
                if asset not in asset_ids:
                    add_error(report, f"narrativeBindings.{level}.layers[{index}] references missing asset {asset}")
                anchor = layer.get("anchor")
                if not isinstance(anchor, str) or not anchor.strip():
                    add_error(report, f"narrativeBindings.{level}.layers[{index}] needs a non-empty anchor")

    l3_binding = bindings.get("L3")
    l3_variants = l3_binding.get("variants") if isinstance(l3_binding, dict) else None
    friend = l3_variants.get("friend") if isinstance(l3_variants, dict) else None
    if not isinstance(friend, dict):
        add_error(report, "narrativeBindings.L3.variants.friend must be an object")
    else:
        default = friend.get("default")
        if default not in asset_ids:
            add_error(report, f"narrativeBindings.L3 friend default references missing asset {default}")
        after = friend.get("after")
        if not isinstance(after, dict):
            add_error(report, "narrativeBindings.L3.variants.friend.after must be an object")
        else:
            for state, asset in after.items():
                if state != "L3_S04b":
                    add_error(report, f"narrativeBindings.L3 friend after has unknown state {state}")
                if asset not in asset_ids:
                    add_error(report, f"narrativeBindings.L3 friend after {state} references missing asset {asset}")

    ending_ids = manifest.get("endingIds")
    if not isinstance(ending_ids, list) or set(ending_ids) != EXPECTED_ENDING_IDS:
        add_error(report, "endingIds must contain A_separate, B_alienate, C_consume, and C_cold")

    l5_binding = bindings.get("L5")
    ending_overrides = l5_binding.get("endingOverrides") if isinstance(l5_binding, dict) else None
    if not isinstance(ending_overrides, dict):
        add_error(report, "narrativeBindings.L5.endingOverrides must be an object")
    else:
        if set(ending_overrides) != EXPECTED_ENDING_IDS:
            add_error(report, "narrativeBindings.L5.endingOverrides must match endingIds")
        for ending, override in ending_overrides.items():
            if not isinstance(override, dict):
                add_error(report, f"narrativeBindings.L5.endingOverrides.{ending} must be an object")
                continue
            for list_key in ("replace", "layers", "hide"):
                values = override.get(list_key)
                if not isinstance(values, list):
                    add_error(report, f"narrativeBindings.L5.endingOverrides.{ending}.{list_key} must be an array")
                    continue
                for asset in values:
                    if asset not in asset_ids:
                        add_error(report, f"narrativeBindings.L5.endingOverrides.{ending}.{list_key} references missing asset {asset}")
            anchors = override.get("anchorByAsset")
            if not isinstance(anchors, dict):
                add_error(report, f"narrativeBindings.L5.endingOverrides.{ending}.anchorByAsset must be an object")
            else:
                for asset in override.get("replace", []):
                    anchor = anchors.get(asset)
                    if not isinstance(anchor, str) or not anchor.strip():
                        add_error(report, f"narrativeBindings.L5.endingOverrides.{ending} needs an anchor for {asset}")


def validate_interactive_bindings(
    manifest: dict[str, Any],
    asset_ids: set[Any],
    report: dict[str, Any],
) -> None:
    bindings = manifest.get("interactiveBindings")
    if not isinstance(bindings, dict):
        add_error(report, "interactiveBindings must be an object")
        return

    scene_bindings = manifest.get("sceneBindings", {})
    if not isinstance(scene_bindings, dict):
        scene_bindings = {}
    layer_order = manifest.get("layerOrder", [])
    if not isinstance(layer_order, list):
        layer_order = []
    layer_ids = set(layer_order)

    for level in EXPECTED_INTERACTIVE_LEVELS:
        binding = bindings.get(level)
        if not isinstance(binding, dict):
            add_error(report, f"interactiveBindings.{level} must be an object")
            continue
        scene = binding.get("scene")
        if not isinstance(scene, str) or scene not in scene_bindings:
            add_error(report, f"interactiveBindings.{level}.scene references missing scene {scene}")
        if not isinstance(binding.get("replaceSceneLayers"), bool):
            add_error(report, f"interactiveBindings.{level}.replaceSceneLayers must be boolean")

        for bucket in ("states", "events"):
            entries = binding.get(bucket, {})
            if entries is None:
                continue
            if not isinstance(entries, dict):
                add_error(report, f"interactiveBindings.{level}.{bucket} must be an object")
                continue
            for name, entry in entries.items():
                if not isinstance(entry, dict):
                    add_error(report, f"interactiveBindings.{level}.{bucket}.{name} must be an object")
                    continue
                trigger = entry.get("trigger")
                if trigger is not None and (
                    not isinstance(trigger, str)
                    or re.fullmatch(r"L[0-5]_S\d+[A-Za-z]*", trigger) is None
                ):
                    add_error(report, f"interactiveBindings.{level}.{bucket}.{name}.trigger must be a chapter line ID")
                if bucket == "states" and (
                    not isinstance(entry.get("group"), str)
                    or not entry.get("group", "").strip()
                ):
                    add_error(report, f"interactiveBindings.{level}.states.{name}.group must be a non-empty string")
                if bucket == "events":
                    duration = entry.get("durationMs")
                    if not isinstance(duration, int) or duration <= 0:
                        add_error(report, f"interactiveBindings.{level}.{bucket}.{name}.durationMs must be positive")
                layers = entry.get("layers")
                if not isinstance(layers, list) or not layers:
                    add_error(report, f"interactiveBindings.{level}.{bucket}.{name}.layers must be a non-empty array")
                    continue
                for index, layer in enumerate(layers):
                    if not isinstance(layer, dict):
                        add_error(report, f"interactiveBindings.{level}.{bucket}.{name}.layers[{index}] must be an object")
                        continue
                    asset = layer.get("asset")
                    if asset not in asset_ids:
                        add_error(report, f"interactiveBindings.{level}.{bucket}.{name}.layers[{index}] references missing asset {asset}")
                    anchor = layer.get("anchor")
                    if not isinstance(anchor, str) or not anchor.strip():
                        add_error(report, f"interactiveBindings.{level}.{bucket}.{name}.layers[{index}] needs a non-empty anchor")
                    render_layer = layer.get("layer")
                    if render_layer not in layer_ids:
                        add_error(report, f"interactiveBindings.{level}.{bucket}.{name}.layers[{index}] uses unknown layer {render_layer}")


def check_asset(
    asset: dict[str, Any],
    pack_root: Path,
    repo_root: Path,
) -> dict[str, Any]:
    result: dict[str, Any] = {
        "id": asset.get("id"),
        "path": asset.get("path"),
        "errors": [],
        "warnings": [],
    }
    relative_path = asset.get("path")
    expected_dimensions = asset.get("dimensions")
    kind = asset.get("kind")
    if not isinstance(relative_path, str) or not relative_path:
        add_error(result, "missing asset path")
        return result
    if Path(relative_path).is_absolute() or ".." in Path(relative_path).parts:
        add_error(result, "asset path must remain inside the pack")
        return result
    path = (pack_root / relative_path).resolve()
    if not is_within(path, repo_root):
        add_error(result, "asset path escapes repository")
        return result
    if not path.is_file():
        add_error(result, "file is missing")
        return result
    if path.suffix.lower() != ".png":
        add_error(result, "asset is not a PNG")
        return result

    requires_transparent_corners = kind not in {"ui"}
    stats = image_stats(path, requires_transparent_corners)
    result.update(stats)
    if not isinstance(expected_dimensions, list) or len(expected_dimensions) != 2:
        add_error(result, "manifest dimensions must be [width, height]")
    elif stats["dimensions"] != expected_dimensions:
        add_error(result, f"dimensions are {stats['dimensions']}, expected {expected_dimensions}")
    if stats["mode"] != "RGBA":
        add_error(result, f"mode is {stats['mode']}, expected RGBA")
    alpha = stats["alpha"]
    if requires_transparent_corners:
        if alpha["transparent"] == 0:
            add_error(result, "transparent asset has no transparent pixels")
        if alpha["opaqueFraction"] < 0.001:
            add_error(result, "opaque subject coverage is below 0.1%")
        if any(value > ALPHA_CORNER_LIMIT for value in alpha["cornerMax"]):
            add_error(result, "one or more 8px corners are not transparent")
    if stats["greenPixels"]:
        add_error(result, f"contains {stats['greenPixels']} visible pure chroma-green pixels")
    return result


def validate_references(manifest: dict[str, Any], report: dict[str, Any]) -> None:
    assets = manifest.get("assets")
    if not isinstance(assets, list):
        add_error(report, "manifest.assets must be an array")
        return
    ids = [asset.get("id") for asset in assets if isinstance(asset, dict)]
    paths = [asset.get("path") for asset in assets if isinstance(asset, dict)]
    if len(ids) != len(set(ids)):
        add_error(report, "asset IDs are not unique")
    if len(paths) != len(set(paths)):
        add_error(report, "asset paths are not unique")
    asset_ids = set(ids)

    validate_narrative_bindings(manifest, asset_ids, report)
    validate_interactive_bindings(manifest, asset_ids, report)

    for label, binding in manifest.get("faceMap", {}).items():
        if not isinstance(binding, dict):
            add_error(report, f"faceMap.{label} must be an object")
            continue
        for key in ("asset", "from", "to"):
            value = binding.get(key)
            if value is not None and value not in asset_ids:
                add_error(report, f"faceMap.{label}.{key} references missing asset {value}")

    for name, binding in manifest.get("sceneBindings", {}).items():
        if not isinstance(binding, dict):
            add_error(report, f"sceneBindings.{name} must be an object")
            continue
        for key in ("character", "creature", "transition"):
            value = binding.get(key)
            if value is not None and key != "transition" and value not in asset_ids:
                add_error(report, f"sceneBindings.{name}.{key} references missing asset {value}")
        background = binding.get("background")
        if background is not None and background not in manifest.get("backgrounds", {}):
            add_error(report, f"sceneBindings.{name}.background references missing background {background}")

    for name, transition in manifest.get("creatureTransitions", {}).items():
        if not isinstance(transition, dict):
            add_error(report, f"creatureTransitions.{name} must be an object")
            continue
        for key in ("from", "to", "effect"):
            value = transition.get(key)
            if value is not None and value not in asset_ids:
                add_error(report, f"creatureTransitions.{name}.{key} references missing asset {value}")


def validate_backgrounds(manifest: dict[str, Any], pack_root: Path, repo_root: Path, report: dict[str, Any]) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    logical_canvas = manifest.get("logicalCanvas")
    for name, relative_path in manifest.get("backgrounds", {}).items():
        entry: dict[str, Any] = {"id": name, "path": relative_path, "errors": [], "warnings": []}
        if not isinstance(relative_path, str):
            add_error(entry, "background path must be a string")
            result.append(entry)
            continue
        path = (pack_root / relative_path).resolve()
        if not is_within(path, repo_root):
            add_error(entry, "background path escapes repository")
        elif not path.is_file():
            add_error(entry, "background file is missing")
        else:
            with Image.open(path) as image:
                entry["dimensions"] = list(image.size)
                entry["mode"] = image.mode
            if logical_canvas and entry["dimensions"] != logical_canvas:
                add_warning(entry, f"does not match logical canvas {logical_canvas}; runtime must fit or crop it")
        result.append(entry)
    for entry in result:
        for error in entry["errors"]:
            add_error(report, f"background {entry['id']}: {error}")
        for warning in entry["warnings"]:
            add_warning(report, f"background {entry['id']}: {warning}")
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, default=Path(__file__).with_name("manifest.json"))
    parser.add_argument("--report", type=Path, default=Path(__file__).with_name("validation") / "report.json")
    parser.add_argument("--strict-backgrounds", action="store_true")
    args = parser.parse_args()

    manifest_path = args.manifest.resolve()
    pack_root = manifest_path.parent
    repo_root = pack_root.parents[2]
    manifest = read_json(manifest_path)
    report: dict[str, Any] = {
        "manifest": str(manifest_path.relative_to(repo_root)),
        "errors": [],
        "warnings": [],
        "assets": [],
    }
    validate_references(manifest, report)

    assets = manifest.get("assets", [])
    if isinstance(assets, list):
        for asset in assets:
            if not isinstance(asset, dict):
                add_error(report, "manifest.assets contains a non-object value")
                continue
            entry = check_asset(asset, pack_root, repo_root)
            report["assets"].append(entry)
            for error in entry["errors"]:
                add_error(report, f"asset {entry['id']}: {error}")
            for warning in entry["warnings"]:
                add_warning(report, f"asset {entry['id']}: {warning}")

    report["backgrounds"] = validate_backgrounds(manifest, pack_root, repo_root, report)
    if args.strict_backgrounds:
        for entry in report["backgrounds"]:
            for warning in entry["warnings"]:
                add_error(report, f"background {entry['id']}: {warning}")
    report["ok"] = not report["errors"]
    report["assetCount"] = len(report["assets"])
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {args.report}")
    print(f"Assets: {report['assetCount']}; errors: {len(report['errors'])}; warnings: {len(report['warnings'])}")
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
