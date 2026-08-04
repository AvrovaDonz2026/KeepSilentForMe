# MiniMax H3 视频提示词

这里保存《请替我沉默》的 H3 图生视频提示词和生成参数。当前覆盖 11 条分镜：
`V0_out`、`V1_pass`、`V1_fail`、`V2_out`、`V3_out`、`V4_perform`、
`V4_refuse`、`V5_A`、`V5_B`、`V5_C` 和 `V_RV`。

可灵版本位于 `prompts/kling/`，已将动作拆成 22 个单场景镜头。每条镜头只使用一个
整页首帧，跨章节和结局切换由游戏页面完成。

提示词只描述镜头运动、角色动作和氛围；台词、字幕、黑条、按钮和弹幕由游戏 HTML
或视频外层叠加，不要求模型生成。首帧统一优先使用 `art/v4/scenes/pages/` 的
无 UI 整页图；`D0-D5` 旧分镜含台词框，不作为默认上传首帧。

## 目录

- `prompts/minimax-h3/manifest.json`：视频 ID、首帧、时长、尺寸、负面提示和分支说明。
- `prompts/minimax-h3/*.txt`：可直接粘贴到 H3 的中文运动提示词。
- `prompts/minimax-h3/COMMON_HARD_LOCK.txt` 和 `COMMON_NEGATIVE.txt`：必须置于每条提示词之前的强化约束。
- `prompts/minimax-h3/alternatives.json`：8 条单场景保守备选提示词，专门用于跨场景或消音体运动失败时重试。
- `prompts/minimax-h3/README.md`：生成顺序、参数建议和验收规则。
- `prompts/kling/manifest.json`：22 个可灵单场景镜头、首帧、时长和输出名。
- `prompts/kling/*.txt`：可直接粘贴到 Kling `image_to_video` 的单镜头提示词。
- `prompts/kling/OMNI_REFERENCE_PREFIX.txt`：Kling 3 Omni 的图片1-7引用规则；manifest 的
  `omni.references` 为每条镜头登记角色、表情、消音体和特效参考照片。
- `prompts/kling/README.md`：可灵参数、生成顺序和镜头分组说明。
- `generated/README.md`：当前已生成 MP4 的逐帧复盘和重试记录；MP4 本身被 `.gitignore` 忽略。
- `node scripts/validate-video-prompts.mjs`：检查提示词、首末帧和输出路径。
- `node scripts/validate-kling-prompts.mjs`：检查可灵 22 条单场景镜头和页面引用。

## 生成建议

先用 1 秒、1 步做端点验证，再按 manifest 的正式时长生成。当前 24GB GPU 建议先使用
`416x416` 验证动作；正式画面可尝试 `640x416`（保持接近整页 3:2 比例），确认显存
足够后再提高分辨率。不要并发提交任务。

```bash
H3=/home/donz/.codex/skills/generate-minimax-h3-video/scripts/generate_h3_video.sh
${H3} --dry-run \
  --prompt "$(cat video/prompts/minimax-h3/V0_out.txt)" \
  --detailed-prompt "$(cat video/prompts/minimax-h3/COMMON_HARD_LOCK.txt)" \
  --negative-prompt "$(cat video/prompts/minimax-h3/COMMON_NEGATIVE.txt)" \
  --image art/v4/scenes/pages/PAGE_L0_desk.png \
  --width 416 --height 416 --length 1 --steps 1
```

实际生成时，把 `--length`、`--width`、`--height`、`--negative-prompt` 和首帧路径替换
为 `manifest.json` 对应条目，并将 MP4 输出到未纳入仓库的 `video/generated/`。

## 生成前后硬门槛

1. **先核对首帧，再提交任务。** 逐条确认上传的图片文件名和画面内容都与
   `manifest.json` 的 `firstFrame` 一致；不要依赖队列顺序或浏览器里残留的上一张上传图。
   如果首帧错位，先重传，不能靠提示词补救。
2. **一条视频先只做一个场景。** 当前样本显示跨房间转场容易被 H3 改成明亮办公室、走廊
   或全新构图；优先使用 `alternatives.json` 的 `single_room`、`door_lock` 和
   `creature_focus` 版本，场景切换交给游戏页面或后期剪辑。
3. **以 ffprobe 实测时长为准。** `--length` 是请求值，不代表服务一定返回同样时长；
   生成后记录实际秒数，必要时在后期裁切，不能把时长差异误判为提示词动作失败。
4. **先验收再接入 Demo。** 首帧、末帧和中段都要检查：房间布局、人物身份、手部、消音体
   边缘、曝光是否稳定，以及是否出现可读文字/UI。

## 验收

- 保持同一张脸、发型、灰色连帽衫、房间拓扑和雨窗，不新增角色或房间。
- 消音体只由哑光黑条、碎字和不可读 glyph 构成，不长出五官，不变成普通人。
- 不出现可读文字、字幕、UI、直播数字、按钮、水印或 logo。
- 镜头以慢推、轻微横移和焦点转移为主，不使用 Vlog 抖动或快速剪辑。
- 先检查脸部、手部、消音体边缘和首尾帧，再接入游戏。
