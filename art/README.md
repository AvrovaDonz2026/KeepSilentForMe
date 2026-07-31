# 美术资产目录

本目录保留早期竖切资产；当前运行时资产以
[`v4/playable/`](v4/playable/) 为唯一入口。不要把新章节层或交互状态混回
根目录的旧批次。

## 目录职责

| 路径 | 用途 |
| --- | --- |
| `bg/` | 旧基础背景；V4 manifest 通过 `legacyBackgroundRoot` 兼容引用 |
| `char/`、`creature/`、`ui/` | 旧基础输出，仅供回溯或重新生成使用 |
| `_json/` | 旧批次的生成响应与元数据 |
| `prompts/` | 旧基础批次提示词 |
| `v4/playable/` | 当前 43 件可玩资产、原始参考图、生成脚本和运行时 manifest |
| `gen_art.sh` | 旧基础批次生成入口；新资产使用 `v4/playable/generate.sh` |

从仓库根目录运行旧批次：`./art/gen_art.sh all|bg|char|creature|face|ui`
模型：`gpt-image-2` · 参考 R0/D0-D6/S09

## 已产出

| 路径 | 用途 |
| --- | --- |
| `bg/BG_apartment.png` | L0/L2/L4 公寓 |
| `bg/BG_meeting.png` | L1 会议室 |
| `bg/BG_live.png` | 直播桌差分 |
| `bg/BG_door.png` | L3 门厅 |
| `bg/BG_finale.png` | L5 空房 |
| `char/CHAR_desk.png` | 书桌坐姿 |
| `char/CHAR_stand.png` | 站姿 |
| `char/CHAR_door.png` | 门边背影 |
| `creature/CREEP_1.png` | 消音 Stage1 |
| `creature/CREEP_2.png` | Stage2 |
| `creature/CREEP_3.png` | Stage3 |
| `v4/playable/faces/` | 12 张可直接运行的表情差分 |
| `ui/UI_bar.png` | 黑条 |
| `ui/UI_dialog.png` | 对话框底 |

## 当前补充

- 章节动作、NPC、结局层和交互 FX/UI 均在 `v4/playable/` 中维护。
- 关末视频 `video/V*.mp4` 和音频仍属于后续开发资产，不放入本目录的静态图批次。
- 旧基础图可能带场景底色；需要透明运行时层时使用 V4 pack 中的 RGBA 输出。

## 风格

见仓库根目录 `art-style.md` 与 `schedule.md` §十二。
