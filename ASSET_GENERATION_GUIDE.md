# 《请替我沉默》美术资产生成指南

> **目标**：生成所有游戏所需的美术资产（场景/角色/表情/消音体/UI）
> **工具**：可使用 gpt-image2 / DALL-E 3 / Midjourney / Stable Diffusion
> **API配置**：api.qingyun.top + sk-oQ0L8sg62Ny0Od2ZJlcPpcgOBTaZHDhY1l4I2WFZNO9Q5jAU

---

## 📋 资产清单总览

| 类型 | 数量 | 优先级1 | 优先级2 | 总计 |
|------|------|---------|---------|------|
| 场景背景 | 4张 | 2 | 2 | 4 |
| 角色姿势 | 2张 | 1 | 1 | 2 |
| 表情差分 | 8张 | 4 | 4 | 8 |
| 消音体 | 3张 | 2 | 1 | 3 |
| UI元素 | 2张 | - | 2 | 2 |
| **总计** | **19张** | **9** | **10** | **19** |

**建议顺序**：
1. 优先级1（核心9张）：公寓+会议室 + 书桌姿势 + 4个表情 + 消音体Stage1/2
2. 优先级2（扩展10张）：门厅+终局 + 背影 + 4个表情 + 消音体Stage3 + UI

---

## 🎨 核心风格DNA（所有资产通用）

```
Art style: Hand-drawn 2D realistic animation linework, doomer aesthetic
Color palette: Deep black, blue-black, dirty grey-green, minimal signal red (≤2%)
Lighting: Single desk lamp + cold window light, 35mm film grain
Atmosphere: Quiet, exhausted, observational, NOT cyberpunk neon or idol anime
Character: East Asian young woman, long black hair, grey/blue-grey hoodie or plain layers, mostly side/back view
NO: Bright colors, cute idol style, cyberpunk neon, thick paint commercial moe, high-gloss 3D
Medium: Digital painting, ink wash style, low saturation, high contrast shadows
```

**关键禁止项**：
- ❌ 亮色可爱偶像立绘
- ❌ 赛博霓虹风格
- ❌ 厚涂商业萌系
- ❌ 高光3D风格
- ❌ 消音体长出五官/眼睛/鬼脸

---

## 1️⃣ 场景背景（4张，16:9）

### BG_apartment（公寓主场景）🔴 优先级1

**用途**：L0/L2/L4/L5 主场景  
**参考**：storyboard/D0, D2, D4, R0

**完整提示词**：
```
Art style: Hand-drawn 2D realistic animation linework, doomer aesthetic
Color palette: Deep black, blue-black, dirty grey-green, minimal signal red (≤2%)
Lighting: Single desk lamp + cold window light, 35mm film grain
Atmosphere: Quiet, exhausted, observational, NOT cyberpunk neon or idol anime
NO: Bright colors, cute idol style, cyberpunk neon, thick paint commercial moe, high-gloss 3D
Medium: Digital painting, ink wash style, low saturation, high contrast shadows

Scene: Small dark apartment room interior, west-facing corner desk with old CRT monitor (turned off, dark screen), black articulated desk lamp casting focused light on desk surface, stacked books and scattered papers on desk, three-panel rain-streaked window showing night cityscape outside, grey-brown curtain partially drawn, wooden door visible on window's right side. Deep shadows in room corners, minimalist worn furniture, rainy night atmosphere filtering through window. Cinematic 16:9 composition, low angle view emphasizing isolation and confinement. No people visible, focus on environment and mood.
```

**生成参数**：
- 尺寸：1792x1024 或 1920x1080
- 模型：gpt-image2 / DALL-E 3
- 质量：high/standard

---

### BG_meeting_room（会议室）🔴 优先级1

**用途**：L1 面试场景  
**参考**：storyboard/D1

**完整提示词**：
```
Art style: Hand-drawn 2D realistic animation linework, doomer aesthetic
Color palette: Deep black, blue-black, dirty grey-green, minimal signal red (≤2%)
Lighting: Cold white fluorescent overhead lighting, harsh and oppressive
Atmosphere: Professional but claustrophobic, NOT cyberpunk or modern tech office
Medium: Digital painting, ink wash style, low saturation, high contrast shadows

Scene: Small formal meeting room, long rectangular table with dark wood surface, projection screen on far wall (blank or subtle company logo), glass partition on one side showing blurred office corridor, two or three chairs visible in silhouette. Cold sterile atmosphere, fluorescent ceiling lights creating harsh shadows. 16:9 cinematic composition from candidate's perspective looking across table. Two interviewer figures in background, intentionally blurred/silhouetted - not the focus. Empty chair in foreground suggesting player's perspective. Professional oppressive atmosphere.
```

**生成参数**：
- 尺寸：1792x1024 或 1920x1080
- 模型：gpt-image2 / DALL-E 3

---

### BG_door_hallway（门厅）🟡 优先级2

**用途**：L3 朋友来访场景  
**参考**：storyboard/D3

**完整提示词**：
```
Art style: Hand-drawn 2D realistic animation linework, doomer aesthetic
Color palette: Deep black, blue-black, dirty grey-green
Lighting: Dark interior vs grey exterior light through door gap
Atmosphere: Cramped, tense, boundaries being tested
Medium: Digital painting, low saturation, dramatic lighting contrast

Scene: Apartment entrance hallway, narrow and cramped space. Wooden door half-open on left side, friend's silhouette visible outside door (backlit, face not detailed - just dark shape of person). Rain-streaked window visible on right side of hallway. Dark interior with warm lamp glow contrasting against cold grey exterior light seeping through door gap. Shadows suggesting confined space, walls close together. Sense of threshold between inside safety and outside world. 16:9 cinematic composition, viewing from inside apartment looking toward door.
```

---

### BG_finale_empty（终局空房）🟡 优先级2

**用途**：L5 终局场景  
**参考**：storyboard/D5

**完整提示词**：
```
Art style: Hand-drawn 2D realistic animation linework, doomer aesthetic
Color palette: Deep black, blue-black, extreme contrast shadows
Lighting: Single desk lamp, more dramatic shadows than apartment scene
Atmosphere: Isolation, finality, abstract emptiness
Medium: Digital painting, very low saturation, high contrast

Scene: Same apartment room as BG_apartment but emptier and more abstract. Less furniture visible, more empty floor space and wall area. Single desk lamp creates dramatic long shadows across empty space. Three-panel window barely visible in darkness. Feeling of void and isolation, less lived-in than main apartment. More psychological space than physical room. Objects/furniture more simplified or fading into shadows. 16:9 cinematic composition emphasizing emptiness and solitude. Rain window still visible but more subdued.
```

---

## 2️⃣ 角色姿势（2张，透明PNG）

### CHAR_desk_pose（书桌姿势侧影）🔴 优先级1

**用途**：L0/L1/L2/L4 主要姿势  
**参考**：D0, D2

**完整提示词**：
```
Art style: Hand-drawn 2D realistic animation linework, doomer aesthetic
Color palette: Deep black, blue-black, grey tones
Character design: East Asian young woman, long straight black hair (past shoulders), grey or blue-grey hoodie, plain clothing layers
NO: Bright colors, cute anime style, idol aesthetics, high-gloss rendering

Character: Young East Asian woman sitting at desk position, side profile view (facing left), long straight black hair falling naturally, wearing grey hoodie with hood down. Posture slightly hunched forward, shoulders curved inward showing exhaustion or resignation. Head tilted slightly down. Minimal facial features visible in profile - just gentle line suggesting closed or downcast eyes, simple nose and lip lines. Half-body portrait from waist up. Arms positioned as if hands on desk (cut off at forearms). Overall mood: tired, withdrawn, existing rather than living.

IMPORTANT: Transparent background PNG, no background elements. Clean edges suitable for layering over game backgrounds.
```

**生成参数**：
- 尺寸：1024x1024
- 格式：PNG with transparency
- 模型：gpt-image2

---

### CHAR_standing_back（背影站姿）🟡 优先级2

**用途**：L3/L5 特定场景  
**参考**：D3, D5

**完整提示词**：
```
Art style: Hand-drawn 2D realistic animation linework, doomer aesthetic
Color palette: Deep black, blue-black, grey tones
Character: East Asian young woman, long black hair, grey hoodie
NO: Bright colors, cute style, idol aesthetics

Character: Young woman standing, full back view (facing away from viewer), long straight black hair flowing down back past shoulder blades, wearing grey hoodie or plain shirt, slightly hunched shoulders showing exhaustion. Full body from head to knees/calves, weight shifted slightly to one leg (contrapposto but subtle and tired), one shoulder slightly lower than other. Head turned very slightly suggesting looking down or to the side but face not visible. Overall posture: resigned, withdrawn, bearing invisible weight.

IMPORTANT: Transparent background PNG, no background. Suitable for layering in game scenes.
```

---

## 3️⃣ 表情差分（8张，脸部特写PNG）

**通用规范**：
- East Asian woman face
- Long black hair framing face
- Minimal color, low saturation
- Transparent background PNG
- Close-up crop: chin to forehead
- Consistent face structure across all expressions

### FACE_anxious（紧张）🔴 优先级1

```
Art style: Hand-drawn 2D realistic linework, doomer aesthetic, low saturation
Color palette: Black hair, pale skin, grey tones, minimal color

Expression: East Asian woman face close-up portrait, long black hair framing face, eyebrows slightly furrowed inward creating small crease between brows, eyes looking downward or aside (not direct eye contact), lips pressed together in thin line. Tension visible in jaw and brow but controlled, not dramatic. Anxiety held inside rather than displayed outwardly. Subtle shadows under eyes suggesting stress or sleeplessness. Overall mood: nervous but trying to maintain composure.

Transparent background PNG. Face only, shoulders barely visible at bottom edge.
```

---

### FACE_fake_smile（假笑）🟡 优先级2

```
Art style: Hand-drawn 2D realistic linework, doomer aesthetic
Color: Black hair, pale skin, low saturation

Expression: East Asian woman face close-up, long black hair, forced smile at corners of mouth but eyes remain flat and unexpressive. Smile muscles engaged but eyes don't crinkle naturally - dead or distant gaze despite upturned lips. Professional mask expression. Slight tension visible in jaw. Expression reads as "performing happiness" rather than feeling it. 

Transparent background PNG. Face close-up.
```

---

### FACE_cold（冷淡）🔴 优先级1

```
Art style: Hand-drawn 2D linework, doomer aesthetic, low saturation
Color: Black hair, pale skin, minimal color

Expression: East Asian woman face close-up, long black hair, completely flat affect. Eyebrows relaxed and horizontal, eyes open but with minimal highlights (dull gaze), pupils slightly unfocused or looking through rather than at viewer. Lips in neutral position, neither smiling nor frowning - just closed. No emotional warmth in expression. Face readable as emotionally shut down or dissociated. Minimal shadows suggesting flatness of affect.

Transparent background PNG.
```

---

### FACE_breaking（崩溃边缘）🟡 优先级2

```
Art style: Hand-drawn 2D linework, doomer aesthetic
Color: Black hair, pale skin, grey-red accent in eyes only

Expression: East Asian woman face close-up, long black hair, on verge of emotional breakdown but still holding back. Eyes slightly reddened or watery but no tears falling, OR lower lip caught between teeth in biting gesture. Eyebrows drawn together in distress but still controlled. Slight trembling suggested in line quality. Expression reads as "barely holding it together" - breakdown imminent but not yet released. Restrained suffering visible in micro-expressions.

Transparent background PNG.
```

---

### FACE_dependent（依赖）🔴 优先级1

```
Art style: Hand-drawn 2D linework, doomer aesthetic, low saturation
Color: Black hair, pale skin, minimal color

Expression: East Asian woman face close-up, long black hair partially covering one side of face, eyes looking toward shoulder or slightly to the side (not straight ahead), gaze directed at something beside camera suggesting looking at another presence. Slight vulnerability or softness in eyes that isn't present in other expressions. Lips slightly parted or neutral. Expression suggests seeking or reaching toward something/someone emotionally. Dependent but quiet about it.

Transparent background PNG.
```

---

### FACE_blank（空白）🟡 优先级2

```
Art style: Hand-drawn 2D linework, doomer aesthetic
Color: Black hair, pale skin, extreme low saturation

Expression: East Asian woman face close-up, long black hair, expression completely withdrawn and empty. Eyes open but unfocused, staring at nothing, pupils dilated or distant. Face muscles completely relaxed, no tension anywhere. Expression suggesting complete emotional shutdown or dissociation - nobody home. More extreme than "cold" - this is absence rather than suppression. Blank canvas quality to face.

Transparent background PNG.
```

---

### FACE_pleasing（讨好）🟡 优先级2

```
Art style: Hand-drawn 2D linework, doomer aesthetic
Color: Black hair, pale skin, low saturation

Expression: East Asian woman face close-up, long black hair, exaggerated pleasant expression that reads as "trying too hard." Eyebrows raised higher than natural, wide smile showing effort, eyes opened wider than comfortable. Expression of someone performing friendliness or agreeability rather than genuinely feeling it. Customer service smile. Slight strain visible in trying to maintain pleasant face.

Transparent background PNG.
```

---

### FACE_detached（抽离）🔴 优先级1

```
Art style: Hand-drawn 2D linework, doomer aesthetic, low saturation
Color: Black hair, pale skin, minimal color

Expression: East Asian woman face in three-quarter profile or full side profile, looking toward window or away from viewer, gaze completely disconnected from present moment. Eyes open but unfocused, looking through rather than at anything. Face relaxed but in dissociative way rather than peaceful. Expression of being somewhere else mentally. Hair falling across part of face, partially obscuring features. Sense of drifting away from reality.

Transparent background PNG.
```

---

## 4️⃣ 消音体（3张，抽象实体PNG）

**核心约束**：
- ⚠️ **绝对禁止**：人脸、五官、眼睛、鬼脸、人形脸部
- ✅ **必须**：纯抽象文字/墨迹实体
- ✅ **材质**：哑光黑、中文字符碎片、墨水质感

### CREATURE_stage1（阶段1-墨迹）🔴 优先级1

```
Art style: Abstract 2D entity, doomer aesthetic, ink and text-based
Color: Matte black, blue-black, ink stain colors
Material: Chinese characters fragmenting into ink

Abstract entity concept: Small palm-sized ink stain blob with thin black bars emerging from edges. Composed of fragmenting Chinese text characters dissolving into matte black ink wash. Writhing or crawling form suggesting movement. Liquid and solid hybrid - parts clearly text, parts pure ink. Some characters legible, others blurred or half-dissolved.

CRITICAL: NO facial features whatsoever. NO eyes. NO mouth. NO ghost face. NO humanoid face shape. This is pure abstract text-and-ink entity, not a creature with features. Think: living calligraphy or sentient ink stain, not monster or spirit.

Size reference: palm-sized, small enough to cling to desk corner or sleeve edge.

Transparent background PNG suitable for layering over scenes.
```

---

### CREATURE_stage2（阶段2-半身）🔴 优先级1

```
Art style: Abstract 2D entity, doomer aesthetic, text and ink-based
Color: Matte black, fragmented Chinese characters, ink wash
Material: Dense text fragments forming mass

Abstract entity: Half-torso sized mass of fragmented Chinese characters and black bars, writhing and shifting. More text fragments than Stage 1, characters stacking and overlapping to create denser semi-transparent form. Vague vertical shape suggesting shoulders/torso outline but NOT humanoid face or features. Think: cloud of text coalescing into rough body shape, but still clearly made of written characters and ink rather than flesh.

CRITICAL: NO facial features. NO eyes. NO humanoid face. NO ghost features. Pure text/ink entity - characters are the entity itself, not decoration on a body. The mass reads as "text trying to become physical" not "person made of text."

Size: Half-torso, large enough to visibly cling to shoulder/back area of character.

Semi-transparent PNG with layering capability.
```

---

### CREATURE_stage3（阶段3-重叠）🟡 优先级2

```
Art style: Abstract 2D entity, doomer aesthetic, dense text mass
Color: Deep matte black, Chinese character fragments, high density
Material: Compressed text and ink forming near-solid mass

Abstract entity: Nearly human-height mass of densely packed black character fragments forming vague body-like silhouette. Almost solid black at center core with edges dissolving into recognizable Chinese characters. Vertical humanoid-scale shape but NO FACE - where head would be is just more dense text, no features. Shape suggests merging with human silhouette through alignment and overlap, not through mimicry of human features.

CRITICAL: NO facial features whatsoever. NO eyes. NO mouth. NO head shape with face. This is text-entity at maximum density - almost human-shaped OUTLINE but still clearly abstract text mass, not mimicking human features. Think: person's shadow made entirely of written words, not ink-creature with a face.

Size: Nearly full human height, nearly overlapping with character's body in scene.

Transparent PNG for layering, works best when overlapped with character sprite.
```

---

## 5️⃣ UI元素（2张）

### UI_dialogue_box（对话框底板）

```
UI element: Simple dark semi-transparent dialogue box panel

Design: Rectangular bar with slightly rounded corners (4-8px radius), semi-transparent dark grey background (#121212 at 85-92% opacity). Width approximately 16:9 aspect ratio, height about 20-25% of that width to create horizontal bar shape suitable for bottom-of-screen placement. Minimal and clean, no decorative elements, no borders, no ornate frames. Modern minimalist UI aesthetic matching doomer color palette.

Dimensions suggestion: 1920x480 pixels or similar 16:9 bar proportion.
PNG with alpha transparency channel for proper layering over game backgrounds.
```

---

### UI_black_bar（可拖拽黑条）

```
UI element: Solid matte black rectangular bar for dragging mechanic

Design: Simple solid black rectangle (#0A0A0A, 100% opacity), completely opaque with no transparency. Edges have subtle 1-pixel noise/roughness to give hand-drawn quality rather than perfect digital rectangle. Slightly irregular edges (very subtle) to match doomer hand-drawn aesthetic. No gradient, no shadow, no effects - just solid matte black bar.

Dimensions: 400x48 pixels (adjustable in-engine but this provides good base aspect ratio)
PNG format with transparency around edges of bar, bar itself solid black.
```

---

## 📥 生成工作流程

### 方式1：使用提供的API

```bash
# 已创建脚本：/tmp/generate_assets_v2.py
python3 /tmp/generate_assets_v2.py
```

### 方式2：手动生成（推荐）

1. **复制对应提示词** → 粘贴到图像生成平台
2. **生成参数设置**：
   - 场景背景：1792x1024 或 1920x1080
   - 角色/表情/消音体：1024x1024
   - UI元素：根据规格设置
3. **下载图片** → 保存到 `web/assets/` 对应目录
4. **质量检查**：
   - ✅ 符合doomer风格（深黑/低饱和）
   - ✅ 消音体无五官
   - ✅ 透明背景正确
   - ✅ 分辨率符合要求

### 方式3：批量生成清单

所有提示词已保存到：
- `/home/donz/KeepSilentForMe/generated_assets/prompts/`

---

## ✅ 验收清单

### 场景背景（4张）
- [ ] BG_apartment - 公寓主场景，深黑，雨窗，CRT
- [ ] BG_meeting_room - 会议室，冷白光，长桌
- [ ] BG_door_hallway - 门厅，门半开，朋友剪影
- [ ] BG_finale_empty - 终局空房，更空旷，戏剧性光影

### 角色姿势（2张）
- [ ] CHAR_desk_pose - 侧坐书桌，灰连帽，疲惫
- [ ] CHAR_standing_back - 背影站姿，全身，消极体态

### 表情差分（8张）
- [ ] FACE_anxious - 紧张，眉蹙，视线下
- [ ] FACE_fake_smile - 假笑，嘴角上扬但眼睛死
- [ ] FACE_cold - 冷淡，平眉平眼，无情感
- [ ] FACE_breaking - 崩溃边缘，眼红/咬唇，克制
- [ ] FACE_dependent - 依赖，侧看，脆弱
- [ ] FACE_blank - 空白，抽离，表情完全撤离
- [ ] FACE_pleasing - 讨好，过度友善，职业假面
- [ ] FACE_detached - 抽离，侧脸看窗，断线

### 消音体（3张）
- [ ] CREATURE_stage1 - 巴掌大墨团，细条，纯抽象
- [ ] CREATURE_stage2 - 半身碎字堆，肩侧，无五官
- [ ] CREATURE_stage3 - 等高重叠，密集黑字，仍无脸

### UI元素（2张）
- [ ] UI_dialogue_box - 半透明深灰对话框
- [ ] UI_black_bar - 纯黑哑光可拖拽条

---

## 🎯 质量标准

### 必须通过
✅ 符合doomer风格（深黑/低饱和/手绘感）  
✅ 消音体绝对无五官/眼睛/鬼脸  
✅ 透明PNG背景干净无杂质  
✅ 分辨率达标（场景1920×1080，其他1024×1024）  
✅ 与参考图（D0-D6）风格一致  

### 如果不符合
❌ 亮色/高饱和 → 重新生成  
❌ 消音体长脸 → 重新生成，强调"NO face"  
❌ 风格不统一 → 检查提示词是否包含完整DOOMER_STYLE  

---

## 📁 最终文件命名规范

```
web/assets/
├── bg/
│   ├── BG_apartment.jpg/png
│   ├── BG_meeting_room.jpg/png
│   ├── BG_door_hallway.jpg/png
│   └── BG_finale_empty.jpg/png
├── char/
│   ├── CHAR_desk_pose.png (透明)
│   └── CHAR_standing_back.png (透明)
├── char/faces/
│   ├── FACE_anxious.png
│   ├── FACE_fake_smile.png
│   ├── FACE_cold.png
│   ├── FACE_breaking.png
│   ├── FACE_dependent.png
│   ├── FACE_blank.png
│   ├── FACE_pleasing.png
│   └── FACE_detached.png
├── creature/
│   ├── CREATURE_stage1.png (透明)
│   ├── CREATURE_stage2.png (透明)
│   └── CREATURE_stage3.png (透明)
└── ui/
    ├── UI_dialogue_box.png (透明)
    └── UI_black_bar.png (透明)
```

---

*文档版本：v1.0 · 最后更新：2026-07-30*
*对应策划案：schedule.md §十二 美术组装手册*
