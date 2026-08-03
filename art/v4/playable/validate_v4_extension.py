#!/usr/bin/env python3
"""
V4 Narrative Extension Validator
验证扩展包的资产完整性和质量
"""

import os
import json
from PIL import Image


# Compatibility entry point for older documentation and tooling. The playable
# pack now includes interactive state/event layers, so the canonical validator
# is validate.py; delegate before the legacy narrative-only checks below run.
if __name__ == "__main__":
    import runpy

    runpy.run_path(os.path.join(os.path.dirname(__file__), "validate.py"), run_name="__main__")
    raise SystemExit(0)

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

# 扩展包资产清单
EXTENSION_ASSETS = {
    "character_actions": [
        "char/CHAR_sleeve_press.png",
        "char/CHAR_interview_sit.png",
        "char/CHAR_livestream_speaking.png",
        "char/CHAR_apology_bow.png",
        "char/CHAR_final_speaking.png"
    ],
    "npcs": [
        "npc/NPC_friend_door_silhouette.png",
        "npc/NPC_friend_hesitant_silhouette.png",
        "npc/NPC_interviewer_a.png",
        "npc/NPC_interviewer_b.png"
    ],
    "ending_layers": [
        "ending/ENDING_echo_overlap.png",
        "ending/ENDING_hollow_proxy.png"
    ]
}

# 所有资产（22现有 + 11新增 = 33）
ALL_ASSETS_COUNT = 33

def validate_file_exists(filepath):
    """验证文件存在"""
    full_path = f"{PROJECT_ROOT}/{filepath}"
    exists = os.path.exists(full_path)
    return {
        "check": "file_exists",
        "path": filepath,
        "passed": exists,
        "message": "✅ 文件存在" if exists else "❌ 文件缺失"
    }

def validate_image_properties(filepath):
    """验证图片属性"""
    full_path = f"{PROJECT_ROOT}/{filepath}"

    if not os.path.exists(full_path):
        return {
            "check": "image_properties",
            "path": filepath,
            "passed": False,
            "message": "❌ 文件不存在"
        }

    try:
        img = Image.open(full_path)
        results = []

        # 检查尺寸
        size_ok = img.size == (1024, 1024)
        results.append({
            "check": "dimensions",
            "passed": size_ok,
            "value": f"{img.size[0]}x{img.size[1]}",
            "expected": "1024x1024",
            "message": "✅ 尺寸正确" if size_ok else f"❌ 尺寸错误: {img.size}"
        })

        # 检查模式
        mode_ok = img.mode == 'RGBA'
        results.append({
            "check": "color_mode",
            "passed": mode_ok,
            "value": img.mode,
            "expected": "RGBA",
            "message": "✅ RGBA模式" if mode_ok else f"❌ 模式错误: {img.mode}"
        })

        # 检查透明角
        pixels = img.load()
        corners = [(0, 0), (1023, 0), (0, 1023), (1023, 1023)]
        corner_names = ["左上", "右上", "左下", "右下"]

        transparent_corners = []
        for (x, y), name in zip(corners, corner_names):
            alpha = pixels[x, y][3] if img.mode == 'RGBA' else 255
            if alpha == 0:
                transparent_corners.append(name)

        corners_ok = len(transparent_corners) == 4
        results.append({
            "check": "transparent_corners",
            "passed": corners_ok,
            "value": f"{len(transparent_corners)}/4",
            "message": f"✅ 四角透明" if corners_ok else f"⚠️  仅 {len(transparent_corners)}/4 角透明: {', '.join(transparent_corners)}"
        })

        # 检查绿键残留
        if img.mode == 'RGBA':
            green_pixels = 0
            total_opaque = 0

            for y in range(img.height):
                for x in range(img.width):
                    r, g, b, a = pixels[x, y]
                    if a > 0:
                        total_opaque += 1
                        # 检测绿色 (g > 100 且 g > r*1.5 且 g > b*1.5)
                        if g > 100 and g > r * 1.5 and g > b * 1.5:
                            green_pixels += 1

            green_ratio = (green_pixels / total_opaque * 100) if total_opaque > 0 else 0
            green_ok = green_pixels < 100

            results.append({
                "check": "green_key_residue",
                "passed": green_ok,
                "value": f"{green_pixels} 像素 ({green_ratio:.2f}%)",
                "message": f"✅ 无明显绿键残留" if green_ok else f"⚠️  残留绿键: {green_pixels} 像素"
            })

        return {
            "check": "image_properties",
            "path": filepath,
            "passed": all(r["passed"] for r in results if "passed" in r),
            "details": results
        }

    except Exception as e:
        return {
            "check": "image_properties",
            "path": filepath,
            "passed": False,
            "message": f"❌ 验证失败: {str(e)}"
        }

def validate_manifest_references():
    """验证 manifest.json 中的引用"""
    manifest_path = f"{PROJECT_ROOT}/manifest.json"

    if not os.path.exists(manifest_path):
        return {
            "check": "manifest_references",
            "passed": False,
            "message": "❌ manifest.json 不存在"
        }

    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)

    results = []

    # 检查 narrativeBindings
    if "narrativeBindings" not in manifest:
        results.append({
            "check": "narrativeBindings_exists",
            "passed": False,
            "message": "❌ narrativeBindings 字段缺失"
        })
        return {
            "check": "manifest_references",
            "passed": False,
            "details": results
        }

    results.append({
        "check": "narrativeBindings_exists",
        "passed": True,
        "message": "✅ narrativeBindings 字段存在"
    })

    # 检查每个章节的引用
    bindings = manifest["narrativeBindings"]
    chapters = ["L0", "L1", "L2", "L3", "L4", "L5"]

    for chapter in chapters:
        if chapter not in bindings:
            results.append({
                "check": f"chapter_{chapter}_binding",
                "passed": False,
                "message": f"⚠️  {chapter} 未定义 narrativeBinding"
            })
            continue

        binding = bindings[chapter]

        # 检查 characterAction
        if "characterAction" in binding:
            asset_id = binding["characterAction"]
            # 检查资产是否在 assets 列表中
            asset_exists = any(a.get("id") == asset_id for a in manifest.get("assets", []))
            results.append({
                "check": f"{chapter}_characterAction",
                "passed": asset_exists,
                "value": asset_id,
                "message": f"✅ {chapter} characterAction: {asset_id}" if asset_exists else f"❌ {chapter} characterAction 引用不存在: {asset_id}"
            })

        # 检查 npcs
        if "npcs" in binding:
            for npc_id in binding["npcs"]:
                asset_exists = any(a.get("id") == npc_id for a in manifest.get("assets", []))
                results.append({
                    "check": f"{chapter}_npc_{npc_id}",
                    "passed": asset_exists,
                    "value": npc_id,
                    "message": f"✅ {chapter} NPC: {npc_id}" if asset_exists else f"❌ {chapter} NPC 引用不存在: {npc_id}"
                })

        # 检查 endingLayers (L5)
        if "endingLayers" in binding:
            for ending, layer_id in binding["endingLayers"].items():
                if layer_id is None:
                    results.append({
                        "check": f"L5_ending_{ending}",
                        "passed": True,
                        "message": f"✅ L5 结局{ending}: 无额外层"
                    })
                else:
                    asset_exists = any(a.get("id") == layer_id for a in manifest.get("assets", []))
                    results.append({
                        "check": f"L5_ending_{ending}",
                        "passed": asset_exists,
                        "value": layer_id,
                        "message": f"✅ L5 结局{ending}: {layer_id}" if asset_exists else f"❌ L5 结局{ending} 引用不存在: {layer_id}"
                    })

    return {
        "check": "manifest_references",
        "passed": all(r["passed"] for r in results),
        "details": results
    }

def validate_asset_count():
    """验证资产总数"""
    manifest_path = f"{PROJECT_ROOT}/manifest.json"

    if not os.path.exists(manifest_path):
        return {
            "check": "asset_count",
            "passed": False,
            "message": "❌ manifest.json 不存在"
        }

    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)

    asset_count = len(manifest.get("assets", []))
    count_ok = asset_count == ALL_ASSETS_COUNT

    return {
        "check": "asset_count",
        "passed": count_ok,
        "value": asset_count,
        "expected": ALL_ASSETS_COUNT,
        "message": f"✅ 资产总数: {asset_count}/{ALL_ASSETS_COUNT}" if count_ok else f"⚠️  资产总数: {asset_count}/{ALL_ASSETS_COUNT}"
    }

def main():
    """主验证流程"""
    print("=" * 80)
    print("V4 Narrative Extension Validator")
    print("=" * 80)
    print()

    all_results = []
    error_count = 0
    warning_count = 0

    # 1. 验证新增文件存在
    print("━━━ 1. 文件存在性检查 ━━━")
    print()

    for category, files in EXTENSION_ASSETS.items():
        print(f"类别: {category}")
        for filepath in files:
            result = validate_file_exists(filepath)
            all_results.append(result)
            print(f"  {result['message']}: {filepath}")
            if not result["passed"]:
                error_count += 1
        print()

    # 2. 验证图片属性
    print("━━━ 2. 图片属性验证 ━━━")
    print()

    for category, files in EXTENSION_ASSETS.items():
        for filepath in files:
            result = validate_image_properties(filepath)
            all_results.append(result)

            if "details" in result:
                print(f"{filepath}:")
                for detail in result["details"]:
                    print(f"  {detail['message']}")
                    if not detail.get("passed", True):
                        if "❌" in detail["message"]:
                            error_count += 1
                        elif "⚠️" in detail["message"]:
                            warning_count += 1
                print()
            else:
                print(f"{filepath}: {result['message']}")
                if not result["passed"]:
                    error_count += 1
                print()

    # 3. 验证 manifest 引用
    print("━━━ 3. Manifest 引用验证 ━━━")
    print()

    manifest_result = validate_manifest_references()
    all_results.append(manifest_result)

    if "details" in manifest_result:
        for detail in manifest_result["details"]:
            print(f"  {detail['message']}")
            if not detail.get("passed", True):
                if "❌" in detail["message"]:
                    error_count += 1
                elif "⚠️" in detail["message"]:
                    warning_count += 1
    else:
        print(f"  {manifest_result['message']}")
        if not manifest_result["passed"]:
            error_count += 1
    print()

    # 4. 验证资产总数
    print("━━━ 4. 资产总数验证 ━━━")
    print()

    count_result = validate_asset_count()
    all_results.append(count_result)
    print(f"  {count_result['message']}")
    if not count_result["passed"]:
        warning_count += 1
    print()

    # 总结
    print("=" * 80)
    print("验证总结")
    print("=" * 80)
    print(f"错误: {error_count}")
    print(f"警告: {warning_count}")

    if error_count == 0 and warning_count == 0:
        print("\n✅ 所有验证通过！扩展包已就绪。")
    elif error_count == 0:
        print(f"\n⚠️  验证通过，但有 {warning_count} 个警告。")
    else:
        print(f"\n❌ 验证失败，发现 {error_count} 个错误。")

    return error_count == 0

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
