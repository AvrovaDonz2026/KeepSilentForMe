# H3 生成清单

## 统一参数

- 模式：`图生视频`
- FPS：16
- Seed：`-1`（需要重现时改为固定整数）
- 首轮验证：`1s / 1 step / 416x416`
- 正式草稿：按 `manifest.json` 的时长，先用 `640x416`
- `refine`：开启；`upscale` 与 `interpolate`：首轮关闭
- 负面提示：每条 manifest 都包含一份；不能省略“无可读文字/UI”约束
- 强化约束：每条主提示词开头已经内置 `HARD LOCK`；生成时仍建议把 `COMMON_HARD_LOCK.txt`
  和 `COMMON_NEGATIVE.txt` 作为前置文本/负面提示一起提交。

## 首帧契约

H3 会忠实放大错误的上传帧，因此生成前必须人工确认 `manifest.json` 的 `firstFrame` 与
实际上传文件相同。这轮曾出现过上一条任务画廊残留造成的错位；现在每条串行任务前都先
调用 `clear_all_tasks`，并在结果流中匹配本次任务 ID。生成后仍要抽查起始帧，不能只看
Gradio 画廊当前显示的缩略图。

## 本轮复盘规则

- 长任务必须串行提交；使用 H3 skill 脚本的 `--reset-queue`，它会在上传和提交前清空
  远端队列/输出状态。
- `manifest.json` 的 `prompt` 是主提示，`selectedPrompt` 是当前成片实际采用的锁帧提示；批量
  重跑应优先读取 `selectedPrompt`，避免复现已经拒绝的漂移版本。
- 首帧正确后优先保持单场景：本轮 `V1_pass`、`V2_out`、`V3_out`、`V4_perform`、
  `V4_refuse` 使用 `alternatives.json` 中的单场景备选提示词。
- 若备选仍造成曝光漂移，优先使用“首帧就是整条视频母版、宁可静止也不重绘”的锁帧版本；
  消音体不得因为动作描述而新增大面积黑块。
- H3 对 `lastFrame` 不保证逐帧落版。V5 三条片不接受会把 Stage3 重绘成巨大人形的动态
  版本，采用 `PAGE_L5_empty` 静帧保持、黑场过渡和 manifest 指定终局页淡入；V_RV 保留
  H3 抽象动态段后再稳定落到海报。
- 验收至少抽查首帧、中段、末段，并用 `ffprobe` 核对 640x416、H.264、实测时长；有
  可读文字、跨房间、额外人物或明显换脸的版本不进入 Demo。

## 首帧映射

| 视频 | 首帧 | 推荐时长 |
| --- | --- | ---: |
| V0_out | `PAGE_L0_desk` | 8s |
| V1_pass / V1_fail | `PAGE_L1_interview` | 8s / 2s |
| V2_out | `PAGE_L2_live` | 8s |
| V3_out | `PAGE_L3_door_default` | 8s |
| V4_perform / V4_refuse | `PAGE_L4_apology` | 10s |
| V5_A | `PAGE_L5_empty` → `PAGE_END_A_separate` | 12s |
| V5_B | `PAGE_L5_empty` → `PAGE_END_B_alienate` | 12s |
| V5_C | `PAGE_L5_empty` → `PAGE_END_C_hollow` | 12s |
| V_RV | `PAGE_L1_interview`，末帧可选 `PAGE_L5_poster` | 15s |

`V5_C` 同时服务 `C_consume` 与 `C_cold`；`C_cold` 只需在同一提示词末尾增加
“镜面/脸部进一步留空，不出现任何五官”。

## 生成顺序

1. 先运行 H3 脚本的 `--dry-run`，确认 28 个参数和图片路径都正确。
2. 开启 `--reset-queue`，依次生成 `V0_out`、`V1_pass`、`V2_out`、`V3_out`，先验收
   人物和房间连续性。
3. 再生成 `V4_perform`、`V4_refuse` 与三个终局视频；有 `lastFrame` 的任务保留原始
   H3 片，最后再做静帧落版。
4. 最后生成 `V1_fail` 和 `V_RV`，并检查 `V_RV` 的海报末段。

如果模型出现换脸、换房、手部变形、消音体五官化或自动生成文字，先确认首帧无误；
再改用 `alternatives.json` 中对应的单场景备选，并把 `COMMON_HARD_LOCK.txt` 放在最前面。
跨房间转场不作为 H3 单条视频的验收项，交给游戏页面翻页或后期剪辑。

当前 MP4 的逐帧观察、实测时长和重试顺序见 [`video/generated/README.md`](../../generated/README.md)。

## 音频和字幕边界

H3 只负责画面运动。雨声、门锁、CRT 电流、纸屑落地和低语使用后期音轨；旁白、
动态 eat 文本和结局字幕使用游戏 HTML/视频外层叠加。不要让模型烧录任何中文或英文。
