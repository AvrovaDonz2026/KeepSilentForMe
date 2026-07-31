#!/usr/bin/env python3
"""
V4 叙事角色扩展包 - 使用本地Stable Diffusion生成
适用于无法访问远程API的情况
"""

import os
import json
from PIL import Image
import subprocess

PROJECT_ROOT = "/home/donz/KeepSilentForMe/art/v4/playable"

# 新增资产定义（与原版相同）
NEW_ASSETS = {
    "character_actions": [
        {
            "id": "CHAR_sleeve_press",
            "name": "压袖口动作",
            "chapter": "L0",
            "source": "source/CHAR_stand.png",
            "prompt": "East Asian young woman in grey hoodie, pressing/adjusting her sleeve cuff with one hand, side view, anxious gesture before speaking. Body posture slightly hunched, focused on sleeve. Doomer aesthetic, low saturation, ink wash style. NO background, NO scene elements, transparent PNG. 1024x1024, bottom-center anchor.",
            "output_path": "char/CHAR_sleeve_press.png"
        },
        # ... 其余资产定义 ...
    ]
}

def generate_with_local_sd(asset_def):
    """使用本地Stable Diffusion生成"""
    print(f"\n生成: {asset_def['id']}")
    print(f"  提示词: {asset_def['prompt'][:100]}...")

    # 检查是否安装了ComfyUI或AUTOMATIC1111
    # 这里提供CLI接口示例

    # 方案1: 使用ComfyUI的命令行
    # 方案2: 使用AUTOMATIC1111的API
    # 方案3: 输出提示词到文件，手动生成

    # 当前实现：输出到待生成清单
    return None

def export_generation_list():
    """导出待生成资产清单到CSV/JSON"""
    output = []

    for category, assets in NEW_ASSETS.items():
        for asset in assets:
            output.append({
                "id": asset["id"],
                "name": asset["name"],
                "chapter": asset["chapter"],
                "source": asset["source"],
                "prompt": asset["prompt"],
                "output": asset["output_path"]
            })

    # 保存为JSON
    with open(f"{PROJECT_ROOT}/generation_queue.json", 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"✅ 导出了 {len(output)} 个资产到 generation_queue.json")

    # 保存为可读的Markdown
    with open(f"{PROJECT_ROOT}/GENERATION_QUEUE.md", 'w', encoding='utf-8') as f:
        f.write("# V4 叙事角色扩展包 - 待生成清单\n\n")
        for i, asset in enumerate(output, 1):
            f.write(f"## {i}. {asset['id']} - {asset['name']}\n\n")
            f.write(f"**章节**: {asset['chapter']}  \n")
            f.write(f"**源图**: `{asset['source']}`  \n")
            f.write(f"**输出**: `{asset['output']}`  \n\n")
            f.write(f"**提示词**:\n```\n{asset['prompt']}\n```\n\n")
            f.write("---\n\n")

    print(f"✅ 生成了可读清单 GENERATION_QUEUE.md")

if __name__ == "__main__":
    print("=" * 80)
    print("V4 Narrative Extension - 本地生成方案")
    print("=" * 80)

    export_generation_list()

    print("\n" + "=" * 80)
    print("下一步：")
    print("=" * 80)
    print("1. 查看 GENERATION_QUEUE.md 获取完整清单")
    print("2. 使用以下任一方式生成：")
    print("   - ComfyUI (本地)")
    print("   - AUTOMATIC1111 (本地)")
    print("   - Midjourney (在线)")
    print("   - DALL-E 3 (在线)")
    print("3. 将生成的文件放到对应目录")
    print("4. 运行 validate_v4_extension.py 验证")
