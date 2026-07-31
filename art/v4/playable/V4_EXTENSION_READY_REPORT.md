# V4 叙事角色扩展包 - 实施就绪报告

**日期**: 2026-07-31  
**状态**: ✅ 规范完成，脚本就绪，待生成  
**版本**: v4-narrative-extension-1

---

## 📋 任务概述

将 `art/v4/playable` 从 **22件核心资产** 扩展到 **33件资产**，新增 11 张透明叙事角色层。

**设计原则**：
- ✅ 保留现有背景、表情、UI 与消音体，不重绘
- ✅ 新增角色层用于章节叙事增强
- ✅ 所有新资产 1024x1024 RGBA，透明角，底部中心锚点
- ✅ 使用 `/images/edits` API，身份锁定策略

---

## 📦 新增资产清单（11张）

### 主角动作（5张）
| ID | 名称 | 章节 | 用途 |
|----|------|------|------|
| CHAR_sleeve_press | 压袖口动作 | L0 | 开场紧张准备 |
| CHAR_interview_sit | 面试坐姿 | L1 | 面试场景 |
| CHAR_livestream_speaking | 直播说话 | L2 | 直播表演 |
| CHAR_apology_bow | 道歉鞠躬 | L4 | 道歉场景 |
| CHAR_final_speaking | 终局开口 | L5 | 最终选择 |

**身份锁定**：所有5张使用 `source/CHAR_stand.png` 作为唯一身份参考

### NPC（4张）
| ID | 名称 | 章节 | 特性 |
|----|------|------|------|
| NPC_friend_door_silhouette | 朋友门口剪影 | L3 | 无脸男性剪影 |
| NPC_friend_hesitant_silhouette | 朋友犹豫剪影 | L3 | 无脸男性剪影 |
| NPC_interviewer_a | 面试官A | L1 | 模糊背景人物 |
| NPC_interviewer_b | 面试官B | L1 | 模糊背景人物 |

**场景参考**：朋友使用 K6，面试官使用 K3

### 结局层（2张）
| ID | 名称 | 结局 | 源图 |
|----|------|------|------|
| ENDING_echo_overlap | 异化结局重叠残影 | L5_B | CHAR_stand.png |
| ENDING_hollow_proxy | 吞没结局空壳 | L5_C | CREEP_3.png |

---

## 🛠️ 已完成工作

### 1. 生成器脚本
**文件**: `generate_narrative_extension.py`

**功能**：
- ✅ 使用 `/images/edits` API 生成11张资产
- ✅ 身份锁定：主角5张仅用 CHAR_stand.png
- ✅ 绿色键控去背
- ✅ 等比缩放到 1024x1024
- ✅ 自动更新 manifest.json（新增 narrativeBindings）
- ✅ 生成资产联系表

**运行方式**：
```bash
# Dry run（验证配置）
python3 generate_narrative_extension.py --dry-run

# 正式生成
python3 generate_narrative_extension.py
```

**Dry run 验证结果**: ✅ 通过
- 11个资产配置正确
- 源图路径正确
- 提示词质量符合标准

### 2. 验证器脚本
**文件**: `validate_v4_extension.py`

**功能**：
- ✅ 检查所有11个PNG文件存在性
- ✅ 验证尺寸（1024x1024）
- ✅ 验证格式（RGBA）
- ✅ 验证四角透明
- ✅ 检测绿键残留（<100像素）
- ✅ 验证 manifest.json 引用完整性
- ✅ 验证资产总数（33件）

**运行方式**：
```bash
python3 validate_v4_extension.py
```

### 3. 规范文档
**文件**: `V4_NARRATIVE_EXTENSION_SPEC.md`

**内容**：
- ✅ 完整的资产清单和技术约束
- ✅ API 方案和身份锁定策略
- ✅ manifest.json 更新规范
- ✅ 验证清单（自动+手动）
- ✅ 提示词质量标准
- ✅ 风险与对策
- ✅ 预期成果和文件结构

---

## 🎯 Manifest.json 更新

### 新增字段：narrativeBindings

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

**兼容性**：现有 `sceneBindings` 保持不变，作为默认绑定。

---

## ✅ 验证清单

### 自动验证（运行 validate_v4_extension.py）
- [ ] 所有11个PNG文件存在
- [ ] 尺寸均为 1024x1024
- [ ] 格式均为 RGBA
- [ ] 四角完全透明
- [ ] 残留绿键 <100 像素
- [ ] manifest.json 中所有引用的资产 ID 存在
- [ ] 资产总数 = 33

### 手动验证
- [ ] **身份一致性**：5张主角动作的脸部特征、服装、发型一致
- [ ] **朋友无脸**：两张朋友剪影完全无可辨识五官
- [ ] **面试官模糊**：面试官为背景人物，无清晰面部
- [ ] **结局层可叠放**：echo/hollow 可与 L5 背景自然融合
- [ ] **无场景烘焙**：所有角色层背景透明，无墙壁/家具残留

### 章节引用验证
- [ ] L0 引用 CHAR_sleeve_press ✅
- [ ] L1 引用 CHAR_interview_sit + 2个面试官 ✅
- [ ] L2 引用 CHAR_livestream_speaking ✅
- [ ] L3 引用 2个朋友剪影 ✅
- [ ] L4 引用 CHAR_apology_bow ✅
- [ ] L5 引用 CHAR_final_speaking + 结局层 ✅

---

## 🚀 执行计划

### Step 1: 生成资产
```bash
cd /home/donz/KeepSilentForMe/art/v4/playable
python3 generate_narrative_extension.py
```

**预估时间**: 15-30分钟（11次API调用 + 后处理）

**输出**：
- `char/` - 5张主角动作
- `npc/` - 4张NPC
- `ending/` - 2张结局层
- `manifest.json` - 更新后的清单
- `NARRATIVE_CONTACT_SHEET.md` - 资产联系表

### Step 2: 验证
```bash
python3 validate_v4_extension.py
```

**期望结果**: 0 错误，0-5 警告（背景fit/crop警告可忽略）

### Step 3: 人工检查
- 在图像查看器中打开所有11张资产
- 检查身份一致性、无脸约束、透明背景
- 测试结局层与 L5 背景叠放效果

### Step 4: Git 提交
```bash
git add char/ npc/ ending/ manifest.json NARRATIVE_CONTACT_SHEET.md
git commit -m "feat(v4): 添加11张叙事角色扩展资产"
```

---

## 📊 资产统计

### 现有资产（22件）
- 背景：5
- 主角姿势：3（desk, door, stand）
- 表情：8
- 消音体：3
- UI：2
- 特效：1

### 新增资产（11件）
- 主角动作：5（sleeve_press, interview_sit, livestream_speaking, apology_bow, final_speaking）
- NPC：4（2个朋友剪影 + 2个面试官）
- 结局层：2（echo_overlap, hollow_proxy）

### 总计：33件

---

## ⚠️ 关键约束

### Doomer 美术风格（不可妥协）
- ✅ 深黑、蓝黑、灰绿色调
- ✅ 低饱和度、高对比阴影
- ✅ 35mm颗粒感
- ❌ 禁止：亮色、赛博霓虹、可爱偶像风格

### 角色约束
- ✅ 主角：灰连帽、长黑发、东亚女性
- ❌ 朋友：**绝对禁止可辨识五官**（完全黑色剪影）
- ❌ 空壳：**绝对禁止五官**（人形空洞轮廓）
- ❌ 消音体相关：**禁止拟人化**

### 技术约束
- ✅ 所有资产：1024x1024 RGBA
- ✅ 四角必须透明
- ✅ 底部中心锚点
- ❌ 禁止：场景烘焙、文字、水印

---

## 📁 文件清单

### 新增文件
```
art/v4/playable/
├── generate_narrative_extension.py       # 生成器脚本 ✅
├── validate_v4_extension.py             # 验证器脚本 ✅
├── V4_NARRATIVE_EXTENSION_SPEC.md       # 规范文档 ✅
├── V4_EXTENSION_READY_REPORT.md         # 本文档 ✅
└── NARRATIVE_CONTACT_SHEET.md           # 待生成
```

### 待生成资产
```
art/v4/playable/
├── char/
│   ├── CHAR_sleeve_press.png            # 待生成
│   ├── CHAR_interview_sit.png           # 待生成
│   ├── CHAR_livestream_speaking.png     # 待生成
│   ├── CHAR_apology_bow.png             # 待生成
│   └── CHAR_final_speaking.png          # 待生成
├── npc/                                 # 新建目录
│   ├── NPC_friend_door_silhouette.png   # 待生成
│   ├── NPC_friend_hesitant_silhouette.png # 待生成
│   ├── NPC_interviewer_a.png            # 待生成
│   └── NPC_interviewer_b.png            # 待生成
└── ending/                              # 新建目录
    ├── ENDING_echo_overlap.png          # 待生成
    └── ENDING_hollow_proxy.png          # 待生成
```

---

## 🎉 准备就绪

**状态**: ✅ 所有脚本和规范文档已完成

**下一步**: 执行 `python3 generate_narrative_extension.py` 生成资产

**API配置**:
- 端点: https://api.qingyun.top/v1
- 模型: gpt-image-2
- 方法: /images/edits
- Key: 已配置

---

**文档版本**: v1.0  
**最后更新**: 2026-07-31  
**作者**: Claude Opus 5
