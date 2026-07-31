#!/usr/bin/env python3
"""
V4 Narrative Character Extension Pack Generator
扩展 art/v4/playable 从 22 件核心资产到 33 件叙事角色资产
"""

import os
import json
import requests
import base64
from PIL import Image
import io

# API配置
API_BASE = "https://api.qingyuntop.top/v1"
API_KEY = "sk-oQ0L8sg62Ny0Od2ZJlcPpcgOBTaZHDhY1l4I2WFZNO9Q5jAU"

# 项目路径
PROJECT_ROOT = "/home/donz/KeepSilentForMe/art/v4/playable"
SOURCE_DIR = f"{PROJECT_ROOT}/source"
OUTPUT_DIR = f"{PROJECT_ROOT}"

# 新增资产定义（11张）
NEW_ASSETS = {
    "character_actions": [
        {
            "id": "CHAR_sleeve_press",
            "name": "压袖口动作",
            "chapter": "L0",
            "source": "source/CHAR_stand.png",  # 身份锁定：仅用站姿作为身份参考
            "prompt": "East Asian young woman in grey hoodie, pressing/adjusting her sleeve cuff with one hand, side view, anxious gesture before speaking. Body posture slightly hunched, focused on sleeve. Doomer aesthetic, low saturation, ink wash style. NO background, NO scene elements, transparent PNG. 1024x1024, bottom-center anchor.",
            "output_path": "char/CHAR_sleeve_press.png"
        },
        {
            "id": "CHAR_interview_sit",
            "name": "面试坐姿",
            "chapter": "L1",
            "source": "source/CHAR_stand.png",
            "prompt": "East Asian young woman sitting in interview position, grey hoodie, hands folded on lap or table (hands at bottom edge), formal but nervous posture, side-angled view. Shoulders slightly raised, tension visible. Doomer aesthetic, muted colors. NO background, NO furniture, transparent PNG. 1024x1024, bottom-center anchor.",
            "output_path": "char/CHAR_interview_sit.png"
        },
        {
            "id": "CHAR_livestream_speaking",
            "name": "直播说话",
            "chapter": "L2",
            "source": "source/CHAR_stand.png",
            "prompt": "East Asian young woman speaking to camera/monitor, grey hoodie, slight forward lean toward desk (implied but not shown), performing engagement. Hands gesture subtly (cut at wrists). Trying to appear energetic but exhausted underneath. Doomer aesthetic. NO background, NO computer/desk visible, transparent PNG. 1024x1024, bottom-center anchor.",
            "output_path": "char/CHAR_livestream_speaking.png"
        },
        {
            "id": "CHAR_apology_bow",
            "name": "道歉鞠躬",
            "chapter": "L4",
            "source": "source/CHAR_stand.png",
            "prompt": "East Asian young woman bowing in apology, grey hoodie, upper body bent forward at 30-45 degrees, head lowered, arms at sides or hands clasped in front. Submissive posture, weight of obligation visible. Doomer aesthetic, shadowed face. NO background, transparent PNG. 1024x1024, bottom-center anchor.",
            "output_path": "char/CHAR_apology_bow.png"
        },
        {
            "id": "CHAR_final_speaking",
            "name": "终局开口",
            "chapter": "L5",
            "source": "source/CHAR_stand.png",
            "prompt": "East Asian young woman standing, mouth visibly open mid-speech, grey hoodie, front-facing or slight angle, moment of speaking final words. Expression: determined, resigned, or empty depending on interpretation. Doomer aesthetic, dramatic lighting. NO background, transparent PNG. 1024x1024, bottom-center anchor.",
            "output_path": "char/CHAR_final_speaking.png"
        }
    ],

    "npcs": [
        {
            "id": "NPC_friend_door_silhouette",
            "name": "朋友门口剪影",
            "chapter": "L3",
            "source": "../../../storyboard/frames/K6-friend-at-door.png",  # 使用K6关键帧作为场景参考
            "prompt": "Male silhouette standing at door threshold, backlit from exterior, completely dark shape with no facial features visible. Casual clothing (jacket or shirt), average build, hands in pockets or at sides. Friend waiting at apartment entrance. Doomer aesthetic, high contrast, grey exterior light behind. NO facial details, NO interior scene, transparent PNG. 1024x1024, bottom-center anchor.",
            "output_path": "npc/NPC_friend_door_silhouette.png"
        },
        {
            "id": "NPC_friend_hesitant_silhouette",
            "name": "朋友犹豫剪影",
            "chapter": "L3",
            "source": "../../../storyboard/frames/K6-friend-at-door.png",
            "prompt": "Same male silhouette but body language shifted: one hand reaching toward door frame or scratching head, weight on one leg, hesitant posture. Still completely dark silhouette, no facial features. Uncertainty visible in stance. Doomer aesthetic, backlit. NO face, NO interior, transparent PNG. 1024x1024, bottom-center anchor.",
            "output_path": "npc/NPC_friend_hesitant_silhouette.png"
        },
        {
            "id": "NPC_interviewer_a",
            "name": "面试官A",
            "chapter": "L1",
            "source": "../../../storyboard/frames/K3-interview.png",
            "prompt": "Professional interviewer half-body, sitting behind table (table edge at bottom of frame), business attire, intentionally blurred/soft focus, not main subject. Left side positioning. Neutral professional posture, holding paper or tablet. Doomer aesthetic, cold fluorescent lighting, low detail. NO sharp facial features, NO background beyond implied table, transparent PNG. 1024x1024, bottom-center anchor.",
            "output_path": "npc/NPC_interviewer_a.png"
        },
        {
            "id": "NPC_interviewer_b",
            "name": "面试官B",
            "chapter": "L1",
            "source": "../../../storyboard/frames/K3-interview.png",
            "prompt": "Second professional interviewer, same style as interviewer_a but right side positioning, slightly different posture (leaning back or arms crossed). Also blurred/background figure. Business attire, holding pen or resting hands on table. Doomer aesthetic, cold office lighting. NO detailed face, NO background, transparent PNG. 1024x1024, bottom-center anchor.",
            "output_path": "npc/NPC_interviewer_b.png"
        }
    ],

    "ending_layers": [
        {
            "id": "ENDING_echo_overlap",
            "name": "异化结局重叠残影",
            "chapter": "L5_B",
            "source": "source/CHAR_stand.png",  # 主角作为基础
            "prompt": "Ghost echo/afterimage effect: semi-transparent duplicate of woman's silhouette, slightly offset from original position (shifted 10-15% left/right/up), creating overlapping residual image. Grey hoodie figure appears doubled, suggesting fractured identity or dissociation. 30-50% opacity on echo layer. Doomer aesthetic, haunting. NO background, transparent PNG. 1024x1024, bottom-center anchor.",
            "output_path": "ending/ENDING_echo_overlap.png"
        },
        {
            "id": "ENDING_hollow_proxy",
            "name": "吞没结局空壳",
            "chapter": "L5_C",
            "source": "creature/CREEP_3.png",  # 消音体作为基础
            "prompt": "Human-shaped hollow shell: dark silhouette in woman's posture/clothing outline (grey hoodie shape) but completely empty inside—either pure black void or semi-transparent showing background through. NO facial features at all, not even eye sockets. Shell/husk/empty vessel quality. Doomer aesthetic, existential emptiness. NO background, transparent PNG. 1024x1024, bottom-center anchor.",
            "output_path": "ending/ENDING_hollow_proxy.png"
        }
    ]
}

def encode_image_base64(image_path):
    """将图片编码为base64"""
    with open(image_path, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')

def generate_asset_via_edit(asset_def, dry_run=False):
    """使用 /images/edits 生成资产"""
    print(f"\n{'[DRY RUN] ' if dry_run else ''}生成: {asset_def['id']}")
    print(f"  章节: {asset_def['chapter']}")
    print(f"  源图: {asset_def['source']}")
    print(f"  输出: {asset_def['output_path']}")

    if dry_run:
        print(f"  提示词: {asset_def['prompt'][:100]}...")
        return None

    # 准备源图
    source_path = f"{PROJECT_ROOT}/{asset_def['source']}"
    if not os.path.exists(source_path):
        print(f"  ⚠️  源图不存在，跳过")
        return None

    try:
        # 使用 images/edits API
        headers = {
            "Authorization": f"Bearer {API_KEY}"
        }

        files = {
            "image": (os.path.basename(source_path), open(source_path, 'rb'), 'image/png'),
            "prompt": (None, asset_def['prompt']),
            "size": (None, "1024x1024"),
            "n": (None, "1")
        }

        response = requests.post(
            f"{API_BASE}/images/edits",
            headers=headers,
            files=files,
            timeout=120
        )

        if response.status_code == 200:
            result = response.json()
            image_url = result['data'][0]['url']
            print(f"  ✅ 生成成功: {image_url}")
            return image_url
        else:
            print(f"  ❌ API错误: {response.status_code}")
            print(f"  响应: {response.text[:200]}")
            return None

    except Exception as e:
        print(f"  ❌ 生成失败: {str(e)}")
        return None

def process_green_key_removal(image_data):
    """绿色键控去背"""
    img = Image.open(io.BytesIO(image_data))
    img = img.convert('RGBA')

    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            # 检测绿色（简单阈值）
            if g > 100 and g > r * 1.5 and g > b * 1.5:
                pixels[x, y] = (r, g, b, 0)  # 设为透明

    return img

def validate_asset(asset_path):
    """验证资产"""
    if not os.path.exists(asset_path):
        return {"valid": False, "error": "文件不存在"}

    try:
        img = Image.open(asset_path)

        # 检查尺寸
        if img.size != (1024, 1024):
            return {"valid": False, "error": f"尺寸错误: {img.size}"}

        # 检查RGBA
        if img.mode != 'RGBA':
            return {"valid": False, "error": f"模式错误: {img.mode}"}

        # 检查透明角
        pixels = img.load()
        corners = [
            (0, 0), (1023, 0), (0, 1023), (1023, 1023)
        ]
        for x, y in corners:
            if pixels[x, y][3] != 0:
                return {"valid": False, "error": f"角落({x},{y})不透明"}

        # 检查残留绿键
        green_pixels = 0
        for y in range(img.height):
            for x in range(img.width):
                r, g, b, a = pixels[x, y]
                if a > 0 and g > 100 and g > r * 1.5 and g > b * 1.5:
                    green_pixels += 1

        if green_pixels > 100:
            return {"valid": False, "warning": f"残留绿键像素: {green_pixels}"}

        return {"valid": True}

    except Exception as e:
        return {"valid": False, "error": str(e)}

def update_manifest(new_assets_data):
    """更新 manifest.json"""
    manifest_path = f"{PROJECT_ROOT}/manifest.json"

    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)

    # 添加新资产到 assets 数组
    for category, assets in new_assets_data.items():
        for asset in assets:
            asset_entry = {
                "id": asset["id"],
                "path": asset["output_path"],
                "kind": "narrativeCharacter" if category == "character_actions" else "npc" if category == "npcs" else "endingLayer",
                "dimensions": [1024, 1024],
                "pivot": [0.5, 1.0],
                "anchor": "scene.floor_center" if category != "npcs" else "scene.predefined"
            }
            manifest["assets"].append(asset_entry)

    # 添加 narrativeBindings
    manifest["narrativeBindings"] = {
        "L0": {
            "scene": "apartment_rain",
            "characterAction": "CHAR_sleeve_press",
            "anchor": "scene.desk_area"
        },
        "L1": {
            "scene": "meeting_room",
            "characterAction": "CHAR_interview_sit",
            "npcs": ["NPC_interviewer_a", "NPC_interviewer_b"],
            "anchor": "scene.interview_table"
        },
        "L2": {
            "scene": "apartment_desk_live",
            "characterAction": "CHAR_livestream_speaking",
            "anchor": "scene.desk_chair"
        },
        "L3": {
            "scene": "apartment_door",
            "npcs": ["NPC_friend_door_silhouette", "NPC_friend_hesitant_silhouette"],
            "anchor": "scene.door_threshold"
        },
        "L4": {
            "scene": "apartment_desk_apology",
            "characterAction": "CHAR_apology_bow",
            "anchor": "scene.floor_center"
        },
        "L5": {
            "scene": "apartment_empty",
            "characterAction": "CHAR_final_speaking",
            "endingLayers": {
                "A": None,
                "B": "ENDING_echo_overlap",
                "C": "ENDING_hollow_proxy"
            },
            "anchor": "scene.floor_center_left"
        }
    }

    # 写回文件
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print(f"✅ manifest.json 已更新（新增 {sum(len(a) for a in new_assets_data.values())} 个资产）")

def generate_contact_sheet(assets_data):
    """生成叙事角色联系表"""
    output = []
    output.append("# V4 叙事角色扩展包 - 资产联系表\n")
    output.append("生成时间: 2026-07-31\n\n")

    for category, assets in assets_data.items():
        output.append(f"## {category}\n")
        for asset in assets:
            output.append(f"- **{asset['id']}** ({asset['name']})\n")
            output.append(f"  - 章节: {asset['chapter']}\n")
            output.append(f"  - 源图: {asset['source']}\n")
            output.append(f"  - 输出: {asset['output_path']}\n\n")

    contact_sheet_path = f"{PROJECT_ROOT}/NARRATIVE_CONTACT_SHEET.md"
    with open(contact_sheet_path, 'w', encoding='utf-8') as f:
        f.write(''.join(output))

    print(f"✅ 联系表已生成: {contact_sheet_path}")

def main(dry_run=False):
    """主函数"""
    print("=" * 80)
    print("V4 Narrative Character Extension Pack Generator")
    print("=" * 80)

    if dry_run:
        print("\n🔍 DRY RUN 模式 - 仅验证配置，不实际生成\n")

    # 创建输出目录
    for dir_name in ["char", "npc", "ending"]:
        os.makedirs(f"{OUTPUT_DIR}/{dir_name}", exist_ok=True)

    results = {}

    # 生成所有资产
    for category, assets in NEW_ASSETS.items():
        print(f"\n{'='*80}")
        print(f"处理类别: {category}")
        print(f"{'='*80}")

        category_results = []
        for asset in assets:
            url = generate_asset_via_edit(asset, dry_run=dry_run)
            category_results.append({
                **asset,
                "url": url,
                "generated": url is not None
            })

        results[category] = category_results

    if not dry_run:
        # 更新 manifest.json
        update_manifest(NEW_ASSETS)

        # 生成联系表
        generate_contact_sheet(NEW_ASSETS)

    # 统计
    total = sum(len(assets) for assets in NEW_ASSETS.values())
    print(f"\n{'='*80}")
    print(f"完成统计")
    print(f"{'='*80}")
    print(f"总资产数: {total}")
    print(f"主角动作: {len(NEW_ASSETS['character_actions'])}")
    print(f"NPC: {len(NEW_ASSETS['npcs'])}")
    print(f"结局层: {len(NEW_ASSETS['ending_layers'])}")

    if dry_run:
        print("\n✅ DRY RUN 完成 - 配置验证通过")
    else:
        print("\n✅ 扩展包生成完成")

if __name__ == "__main__":
    import sys
    dry_run = "--dry-run" in sys.argv
    main(dry_run=dry_run)
