# V4 叙事角色扩展包规范

## 概述

将 `art/v4/playable` 从 22 件核心资产扩展到 33 件，新增 11 张透明叙事角色层。保留现有背景、表情、UI 与消音体，不重绘。

**版本**: v4-narrative-extension-1  
**日期**: 2026-07-31  
**状态**: 规范完成，待生成

---

## 新增资产清单（11张）

### 主角动作（5张）

所有主角动作使用 `source/CHAR_stand.png` 作为唯一身份参考，确保身份一致性。

| ID | 名称 | 章节 | 用途 | 输出路径 |
|----|------|------|------|----------|
| CHAR_sleeve_press | 压袖口动作 | L0 | 开场紧张准备 | char/CHAR_sleeve_press.png |
| CHAR_interview_sit | 面试坐姿 | L1 | 面试场景 | char/CHAR_interview_sit.png |
| CHAR_livestream_speaking | 直播说话 | L2 | 直播表演 | char/CHAR_livestream_speaking.png |
| CHAR_apology_bow | 道歉鞠躬 | L4 | 道歉场景 | char/CHAR_apology_bow.png |
| CHAR_final_speaking | 终局开口 | L5 | 最终选择 | char/CHAR_final_speaking.png |

**技术约束**：
- 尺寸：1024x1024 RGBA
- 锚点：底部中心 (0.5, 1.0)
- 透明背景，无场景元素
- 身份锁定：灰连帽、长黑发、东亚女性特征
- 禁止：场景烘焙、文字、水印

### NPC（4张）

NPC 使用对应章节的关键帧作为场景参考。

| ID | 名称 | 章节 | 源图 | 输出路径 |
|----|------|------|------|----------|
| NPC_friend_door_silhouette | 朋友门口剪影 | L3 | K6-friend-at-door.png | npc/NPC_friend_door_silhouette.png |
| NPC_friend_hesitant_silhouette | 朋友犹豫剪影 | L3 | K6-friend-at-door.png | npc/NPC_friend_hesitant_silhouette.png |
| NPC_interviewer_a | 面试官A | L1 | K3-interview.png | npc/NPC_interviewer_a.png |
| NPC_interviewer_b | 面试官B | L1 | K3-interview.png | npc/NPC_interviewer_b.png |

**技术约束**：
- 尺寸：1024x1024 RGBA
- 锚点：底部中心或预定义位置
- 朋友剪影：完全黑色轮廓，**禁止可辨识五官**
- 面试官：模糊背景人物，低细节，无清晰面部特征
- 禁止：场景背景烘焙（仅人物）

### 结局层（2张）

结局层用于 L5 的三个结局变体（A/B/C）。

| ID | 名称 | 结局 | 源图 | 输出路径 |
|----|------|------|------|----------|
| ENDING_echo_overlap | 异化结局重叠残影 | L5_B | source/CHAR_stand.png | ending/ENDING_echo_overlap.png |
| ENDING_hollow_proxy | 吞没结局空壳 | L5_C | creature/CREEP_3.png | ending/ENDING_hollow_proxy.png |

**技术约束**：
- 尺寸：1024x1024 RGBA
- 锚点：底部中心
- echo_overlap：30-50% 不透明度，偏移叠加效果
- hollow_proxy：人形轮廓但内部空洞，**禁止五官**
- 可与 L5 背景叠放

---

## 实现策略

### API 方案

**端点**: `/v1/images/edits`  
**模型**: gpt-image-2  
**方法**: 图像编辑（使用源图作为身份/场景参考）

**身份锁定策略**：
- 主角5张动作：仅用 `CHAR_stand.png` 作为身份输入
- NPC：使用对应章节关键帧（K3/K6）作为场景上下文
- 结局层：CHAR_stand.png（echo）/ CREEP_3.png（hollow）

### 后处理流程

1. **绿色键控去背**：移除生成图中的绿色背景
2. **等比缩放**：确保输出为 1024x1024
3. **透明角验证**：四角必须为完全透明
4. **原始源图留存**：保存未处理版本到 `source/raw/`

### manifest.json 更新

新增字段：`narrativeBindings`

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

**兼容性**：现有 `sceneBindings` 保持不变，作为默认绑定。`narrativeBindings` 为可选增强层。

---

## 验证清单

### 自动验证

运行 `python3 validate_v4_extension.py`：

- [ ] 所有11个PNG文件存在
- [ ] 尺寸均为 1024x1024
- [ ] 格式均为 RGBA
- [ ] 四角完全透明（alpha=0）
- [ ] 残留绿键 <100 像素
- [ ] manifest.json 中所有引用的资产 ID 存在

### 手动验证

- [ ] **身份一致性**：5张主角动作的脸部特征、服装、发型一致
- [ ] **朋友无脸**：两张朋友剪影完全无可辨识五官
- [ ] **面试官模糊**：面试官为背景人物，无清晰面部
- [ ] **结局层可叠放**：echo/hollow 可与 L5 背景自然融合
- [ ] **无场景烘焙**：所有角色层背景透明，无墙壁/家具残留
- [ ] **底部锚点对齐**：所有资产底部对齐，适合放置在场景地面

### 章节引用验证

- [ ] L0 引用 CHAR_sleeve_press
- [ ] L1 引用 CHAR_interview_sit + 2个面试官
- [ ] L2 引用 CHAR_livestream_speaking
- [ ] L3 引用 2个朋友剪影
- [ ] L4 引用 CHAR_apology_bow
- [ ] L5 引用 CHAR_final_speaking + 结局层
- [ ] L5_A 无额外层
- [ ] L5_B 引用 ENDING_echo_overlap
- [ ] L5_C 引用 ENDING_hollow_proxy

---

## 生成命令

### Dry Run（验证配置）

```bash
cd /home/donz/KeepSilentForMe/art/v4/playable
python3 generate_narrative_extension.py --dry-run
```

### 正式生成

```bash
python3 generate_narrative_extension.py
```

**预估时间**：
- API 调用：11 次（每次 30-120秒）
- 后处理：每张约 10秒
- 总计：约 15-30 分钟

**输出**：
- `char/` - 5张主角动作
- `npc/` - 4张NPC
- `ending/` - 2张结局层
- `manifest.json` - 更新后的清单
- `NARRATIVE_CONTACT_SHEET.md` - 资产联系表

---

## 提示词质量标准

### 必须包含

- ✅ Doomer 美术风格标识
- ✅ 透明背景声明（transparent PNG, NO background）
- ✅ 尺寸和锚点（1024x1024, bottom-center anchor）
- ✅ 角色身份描述（East Asian woman, grey hoodie, long black hair）
- ✅ 动作/姿势详细说明

### 必须禁止

- ❌ NO background / NO scene elements / NO furniture
- ❌ NO text / NO watermarks
- ❌ NO facial features（针对朋友和空壳）
- ❌ NO detailed face（针对面试官）
- ❌ NO anthropomorphized creature（针对消音体相关）

### 示例提示词

**主角动作** (CHAR_sleeve_press):
```
East Asian young woman in grey hoodie, pressing/adjusting her sleeve cuff with one hand, side view, anxious gesture before speaking. Body posture slightly hunched, focused on sleeve. Doomer aesthetic, low saturation, ink wash style. NO background, NO scene elements, transparent PNG. 1024x1024, bottom-center anchor.
```

**朋友剪影** (NPC_friend_door_silhouette):
```
Male silhouette standing at door threshold, backlit from exterior, completely dark shape with no facial features visible. Casual clothing (jacket or shirt), average build, hands in pockets or at sides. Friend waiting at apartment entrance. Doomer aesthetic, high contrast, grey exterior light behind. NO facial details, NO interior scene, transparent PNG. 1024x1024, bottom-center anchor.
```

---

## 风险与对策

### 风险1：身份一致性偏移

**问题**：5张主角动作使用同一源图，但生成结果可能出现脸部/服装差异。

**对策**：
- 使用 images/edits 保持源图作为身份锁定
- 提示词中明确"same woman as source image"
- 如果差异较大，重新生成并选择最一致的版本

### 风险2：朋友长出五官

**问题**：AI 可能为剪影添加可辨识的面部特征。

**对策**：
- 提示词强调"NO facial features visible"
- 描述为"completely dark shape / silhouette"
- 后处理阶段人工检查，如有五官则重新生成

### 风险3：场景元素烘焙

**问题**：背景透明但角色带有墙壁/家具阴影或反光。

**对策**：
- 提示词明确"NO background, NO scene elements"
- 绿键去背流程移除大部分烘焙元素
- 轻微阴影可接受（增加立体感）

### 风险4：结局层不可叠放

**问题**：echo/hollow 与 L5 背景叠放时视觉冲突。

**对策**：
- echo 使用 30-50% 不透明度，避免过于实体
- hollow 为轮廓式空壳，透过内部可见背景
- 测试时与 apartment_empty 背景实际叠放验证

---

## 联系表生成

运行生成器后，自动生成 `NARRATIVE_CONTACT_SHEET.md`：

```markdown
# V4 叙事角色扩展包 - 资产联系表

## character_actions
- **CHAR_sleeve_press** (压袖口动作)
  - 章节: L0
  - 源图: source/CHAR_stand.png
  - 输出: char/CHAR_sleeve_press.png

## npcs
- **NPC_friend_door_silhouette** (朋友门口剪影)
  - 章节: L3
  - 源图: ../../../storyboard/frames/K6-friend-at-door.png
  - 输出: npc/NPC_friend_door_silhouette.png

## ending_layers
- **ENDING_echo_overlap** (异化结局重叠残影)
  - 章节: L5_B
  - 源图: source/CHAR_stand.png
  - 输出: ending/ENDING_echo_overlap.png
```

---

## 预期成果

### 资产数量

- **现有资产**: 22 件（背景5 + 主角3 + 表情8 + 消音体3 + UI 2 + 特效1）
- **新增资产**: 11 件（主角动作5 + NPC 4 + 结局层2）
- **总计**: 33 件

### 文件结构

```
art/v4/playable/
├── manifest.json              # 更新：新增 narrativeBindings
├── NARRATIVE_CONTACT_SHEET.md # 新增：叙事角色联系表
├── generate_narrative_extension.py
├── validate_v4_extension.py   # 新增：扩展验证器
├── char/
│   ├── CHAR_desk.png          # 现有
│   ├── CHAR_door.png          # 现有
│   ├── CHAR_stand.png         # 现有
│   ├── CHAR_sleeve_press.png  # 新增
│   ├── CHAR_interview_sit.png # 新增
│   ├── CHAR_livestream_speaking.png # 新增
│   ├── CHAR_apology_bow.png   # 新增
│   └── CHAR_final_speaking.png # 新增
├── npc/                       # 新增目录
│   ├── NPC_friend_door_silhouette.png
│   ├── NPC_friend_hesitant_silhouette.png
│   ├── NPC_interviewer_a.png
│   └── NPC_interviewer_b.png
├── ending/                    # 新增目录
│   ├── ENDING_echo_overlap.png
│   └── ENDING_hollow_proxy.png
├── creature/                  # 现有
├── face/                      # 现有
├── ui/                        # 现有
└── source/                    # 现有
```

---

## 后续工作

1. **运行生成器**：`python3 generate_narrative_extension.py`
2. **验证资产**：`python3 validate_v4_extension.py`
3. **人工检查**：身份一致性、朋友无脸、结局层可叠放
4. **更新 README**：记录扩展包版本和新增资产
5. **Git 提交**：提交所有新增资产和更新的 manifest.json

---

**文档版本**: v1.0  
**最后更新**: 2026-07-31  
**状态**: 规范完成，待实施
