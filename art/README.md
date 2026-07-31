# 生产美术资产（竖切）

> 生成：`./gen_art.sh all|bg|char|creature|face|ui`  
> 模型：`gpt-image-2` · API 见脚本 · 参考 R0/D0–D6/S09

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
| `face/FACE_sheet.png` | 8 表情联画（额度不足时可能未出） |
| `ui/UI_bar.png` | 黑条 |
| `ui/UI_dialog.png` | 对话框底 |

## 待补

- 表情单张裁切（从 `FACE_sheet` 或逐张 `FACE_*.png`）
- 关末视频 `video/V*.mp4`（图生视频，首帧用 Demo/本目录 BG）
- 透明底精修（当前为带背景成图，引擎侧可遮罩或重出）

## 风格

见仓库根目录 `art-style.md` 与 `schedule.md` §十二。
