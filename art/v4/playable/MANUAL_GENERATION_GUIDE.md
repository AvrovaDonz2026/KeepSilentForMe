# V4 叙事角色扩展包 - 手动生成指南

**问题**: API端点 `api.qingyun.top` DNS解析失败  
**状态**: 自动生成脚本无法执行  
**解决方案**: 手动生成或使用替代API端点

---

## 🔧 问题诊断

```
错误: HTTPSConnectionPool(host='api.qingyun.top', port=443): 
Max retries exceeded with url: /v1/images/edits 
(Caused by NameResolutionError: Failed to resolve 'api.qingyun.top')
```

**原因**: 网络无法解析该域名，可能是：
- 域名暂时不可用
- 网络环境DNS限制
- 服务端问题

**已修复**: Python代码中的 `null` → `None` 错误

---

## 方案1: 手动使用提示词生成

### 步骤

1. **复制提示词**: 从生成器脚本中获取每个资产的完整提示词
2. **使用图像生成平台**: 
   - DALL-E 3 (OpenAI)
   - Midjourney
   - Stable Diffusion
   - 其他支持图像编辑的平台

3. **上传源图**: 
   - 主角5张: `source/CHAR_stand.png`
   - 朋友2张: `../../../storyboard/frames/K6-friend-at-door.png`
   - 面试官2张: `../../../storyboard/frames/K3-interview.png`
   - echo: `source/CHAR_stand.png`
   - hollow: `creature/CREEP_3.png`

4. **后处理**:
   - 去除绿色背景
   - 缩放到 1024x1024
   - 确保四角透明
   - 保存到对应目录

---

## 方案2: 使用替代API端点

### OpenAI 官方API

修改 `generate_narrative_extension.py` 中的API配置：

```python
# 替换
API_BASE = "https://api.openai.com/v1"
API_KEY = "your-openai-api-key"
```

然后重新运行：
```bash
python3 generate_narrative_extension.py
```

### Azure OpenAI

```python
API_BASE = "https://your-resource.openai.azure.com/openai"
API_KEY = "your-azure-key"
```

---

## 方案3: 完整提示词清单（手动生成）

### 主角动作（5张）

#### 1. CHAR_sleeve_press
**源图**: `source/CHAR_stand.png`

```
East Asian young woman in grey hoodie, pressing/adjusting her sleeve cuff with one hand, side view, anxious gesture before speaking. Body posture slightly hunched, focused on sleeve. Doomer aesthetic, low saturation, ink wash style. NO background, NO scene elements, transparent PNG. 1024x1024, bottom-center anchor.
```

#### 2. CHAR_interview_sit
**源图**: `source/CHAR_stand.png`

```
East Asian young woman sitting in interview position, grey hoodie, hands folded on lap or table (hands at bottom edge), formal but nervous posture, side-angled view. Shoulders slightly raised, tension visible. Doomer aesthetic, muted colors. NO background, NO furniture, transparent PNG. 1024x1024, bottom-center anchor.
```

#### 3. CHAR_livestream_speaking
**源图**: `source/CHAR_stand.png`

```
East Asian young woman speaking to camera/monitor, grey hoodie, slight forward lean toward desk (implied but not shown), performing engagement. Hands gesture subtly (cut at wrists). Trying to appear energetic but exhausted underneath. Doomer aesthetic. NO background, NO computer/desk visible, transparent PNG. 1024x1024, bottom-center anchor.
```

#### 4. CHAR_apology_bow
**源图**: `source/CHAR_stand.png`

```
East Asian young woman bowing in apology, grey hoodie, upper body bent forward at 30-45 degrees, head lowered, arms at sides or hands clasped in front. Submissive posture, weight of obligation visible. Doomer aesthetic, shadowed face. NO background, transparent PNG. 1024x1024, bottom-center anchor.
```

#### 5. CHAR_final_speaking
**源图**: `source/CHAR_stand.png`

```
East Asian young woman standing, mouth visibly open mid-speech, grey hoodie, front-facing or slight angle, moment of speaking final words. Expression: determined, resigned, or empty depending on interpretation. Doomer aesthetic, dramatic lighting. NO background, transparent PNG. 1024x1024, bottom-center anchor.
```

### NPC（4张）

#### 6. NPC_friend_door_silhouette
**源图**: `../../../storyboard/frames/K6-friend-at-door.png`

```
Male silhouette standing at door threshold, backlit from exterior, completely dark shape with no facial features visible. Casual clothing (jacket or shirt), average build, hands in pockets or at sides. Friend waiting at apartment entrance. Doomer aesthetic, high contrast, grey exterior light behind. NO facial details, NO interior scene, transparent PNG. 1024x1024, bottom-center anchor.
```

#### 7. NPC_friend_hesitant_silhouette
**源图**: `../../../storyboard/frames/K6-friend-at-door.png`

```
Same male silhouette but body language shifted: one hand reaching toward door frame or scratching head, weight on one leg, hesitant posture. Still completely dark silhouette, no facial features. Uncertainty visible in stance. Doomer aesthetic, backlit. NO face, NO interior, transparent PNG. 1024x1024, bottom-center anchor.
```

#### 8. NPC_interviewer_a
**源图**: `../../../storyboard/frames/K3-interview.png`

```
Professional interviewer half-body, sitting behind table (table edge at bottom of frame), business attire, intentionally blurred/soft focus, not main subject. Left side positioning. Neutral professional posture, holding paper or tablet. Doomer aesthetic, cold fluorescent lighting, low detail. NO sharp facial features, NO background beyond implied table, transparent PNG. 1024x1024, bottom-center anchor.
```

#### 9. NPC_interviewer_b
**源图**: `../../../storyboard/frames/K3-interview.png`

```
Second professional interviewer, same style as interviewer_a but right side positioning, slightly different posture (leaning back or arms crossed). Also blurred/background figure. Business attire, holding pen or resting hands on table. Doomer aesthetic, cold office lighting. NO detailed face, NO background, transparent PNG. 1024x1024, bottom-center anchor.
```

### 结局层（2张）

#### 10. ENDING_echo_overlap
**源图**: `source/CHAR_stand.png`

```
Ghost echo/afterimage effect: semi-transparent duplicate of woman's silhouette, slightly offset from original position (shifted 10-15% left/right/up), creating overlapping residual image. Grey hoodie figure appears doubled, suggesting fractured identity or dissociation. 30-50% opacity on echo layer. Doomer aesthetic, haunting. NO background, transparent PNG. 1024x1024, bottom-center anchor.
```

#### 11. ENDING_hollow_proxy
**源图**: `creature/CREEP_3.png`

```
Human-shaped hollow shell: dark silhouette in woman's posture/clothing outline (grey hoodie shape) but completely empty inside—either pure black void or semi-transparent showing background through. NO facial features at all, not even eye sockets. Shell/husk/empty vessel quality. Doomer aesthetic, existential emptiness. NO background, transparent PNG. 1024x1024, bottom-center anchor.
```

---

## 方案4: 批量生成脚本（其他平台）

### 使用 Replicate API

```python
import replicate

# 安装: pip install replicate
# 设置: export REPLICATE_API_TOKEN=your_token

for asset in assets:
    output = replicate.run(
        "stability-ai/stable-diffusion:image-to-image",
        input={
            "image": open(asset['source'], "rb"),
            "prompt": asset['prompt'],
            "width": 1024,
            "height": 1024
        }
    )
    # 保存 output
```

---

## 手动生成后的处理步骤

### 1. 绿键去背（如需要）

```python
from PIL import Image

img = Image.open('generated.png').convert('RGBA')
pixels = img.load()

for y in range(img.height):
    for x in range(img.width):
        r, g, b, a = pixels[x, y]
        # 检测绿色
        if g > 100 and g > r * 1.5 and g > b * 1.5:
            pixels[x, y] = (r, g, b, 0)

img.save('output.png')
```

### 2. 确保尺寸和锚点

```python
# 等比缩放到 1024x1024
img = Image.open('input.png')
img = img.resize((1024, 1024), Image.Resampling.LANCZOS)
img.save('output.png')
```

### 3. 验证四角透明

```python
img = Image.open('output.png')
pixels = img.load()
corners = [(0, 0), (1023, 0), (0, 1023), (1023, 1023)]

for x, y in corners:
    alpha = pixels[x, y][3]
    print(f"Corner ({x},{y}): alpha={alpha}")
    # 应该都是 0
```

---

## 完成后的验证

### 手动放置文件

```bash
# 创建目录
mkdir -p char npc ending

# 放置文件
mv CHAR_sleeve_press.png char/
mv CHAR_interview_sit.png char/
mv CHAR_livestream_speaking.png char/
mv CHAR_apology_bow.png char/
mv CHAR_final_speaking.png char/

mv NPC_friend_door_silhouette.png npc/
mv NPC_friend_hesitant_silhouette.png npc/
mv NPC_interviewer_a.png npc/
mv NPC_interviewer_b.png npc/

mv ENDING_echo_overlap.png ending/
mv ENDING_hollow_proxy.png ending/
```

### 手动更新 manifest.json

在 `manifest.json` 中添加（已修复 null → None 问题）：

```json
{
  "narrativeBindings": {
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
        "A": null,
        "B": "ENDING_echo_overlap",
        "C": "ENDING_hollow_proxy"
      },
      "anchor": "scene.floor_center_left"
    }
  }
}
```

并在 `assets` 数组中添加11个新资产条目。

### 运行验证器

```bash
python3 validate_v4_extension.py
```

期望结果：0 错误，0-5 警告

---

## 联系表生成（手动）

创建 `NARRATIVE_CONTACT_SHEET.md`:

```markdown
# V4 叙事角色扩展包 - 资产联系表

生成时间: 2026-07-31

## character_actions
- **CHAR_sleeve_press** (压袖口动作)
  - 章节: L0
  - 源图: source/CHAR_stand.png
  - 输出: char/CHAR_sleeve_press.png

[...其余10个资产...]
```

---

## 总结

由于网络问题，自动生成脚本暂时无法执行。建议：

1. **检查网络**: 尝试访问 `https://api.qingyun.top/v1/models`
2. **使用VPN**: 如果是DNS限制
3. **替代API**: 使用 OpenAI 官方或其他平台
4. **手动生成**: 使用上述完整提示词在图像生成平台手动创建

生成器脚本已修复 `null` → `None` 错误，网络问题解决后可重新运行。

---

**文档版本**: v1.1  
**最后更新**: 2026-07-31  
**状态**: 待网络问题解决或手动生成
