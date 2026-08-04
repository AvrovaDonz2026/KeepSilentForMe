# Kling 单场景镜头清单

这里是把 MiniMax H3 长提示拆开的可灵图生视频版本。每个 `.txt` 只描述一个房间、一个
主要动作和一个停帧点；L0-L5 与四个结局之间的翻页由游戏页面或后期剪辑完成，不让 Kling
在一条任务中自行换房间。

## 固定参数

- 推荐模型：`kling-video-v3_0`，以当前 `kling who_am_i` 返回为准。
- `duration`：每条 3-15 秒，本清单默认 5 秒；`K05` 和 `K06` 为 3 秒失败测试。
- `resolution`：`1080p`；有会员并确认额度后再改为服务端允许的更高档位。
- `prefer_multi_shots`：`false`，禁止模型自行拆镜头。
- `enable_audio`：`false`，雨声、门锁、CRT 电流和游戏 BGM 由后期/HTML 控制。
- Kling 没有 H3 的 `detailed-prompt` 或独立 negative prompt；每条提示已经把最重要的
  禁止项写入正文，`COMMON_SINGLE_SCENE.txt` 供复核或复制时放在正文最前面。

## 文件与末帧

`manifest.json` 中每个资产只配置一个 `firstFrame`，输出应以单场景动作为主。终局页
(`PAGE_END_*`) 是独立的保持镜头，不用 `tailImage` 强行跨页；页面切换时先停止上一条
视频，再切换整页图并播放对应终局保持镜头。输入本地图片时由 `kling` CLI 自动上传，
不要手工拼接可灵 URL。

先运行 `kling who_am_i`，再用 `kling image_to_video --help` 核对参数。示例：

```bash
KLANG="PATH=/home/donz/.npm-global/bin:$PATH"
${KLANG} kling image_to_video \
  --model kling-video-v3_0 \
  --image art/v4/scenes/pages/PAGE_L0_desk.png \
  --duration 5 --resolution 1080p \
  --prefer_multi_shots false --enable_audio false \
  "$(cat video/prompts/kling/K01_L0_ink.txt)"
```

每次生成都会消耗灵感值。提交后记录真实 `generationId`，用 `kling query_tasks` 轮询；
失败或参数错误先停下，不自动改 prompt 重投。

## 镜头分组

| 分组 | 镜头 |
| --- | --- |
| L0 书桌 | `K01` 墨迹、`K02` 门把手 |
| L1 采访 | `K03` 点头、`K04` 墨迹、`K05` 灯闪、`K06` 遮挡碎裂 |
| L2 直播 | `K07` CRT 指示灯、`K08` 消音体聚拢 |
| L3 门厅 | `K09` 关门、`K10` Stage2 拉长 |
| L4 道歉/拒绝 | `K11` 指示灯、`K12` Stage3 堆叠、`K13` 拔线、`K14` 碎片振动 |
| L5 结局 | `K15` A 释放、`K16` A 保持、`K17` B 错位、`K18` B 保持、`K19` C 落条、`K20` C 保持 |
| 反转 | `K21` 采访层保持、`K22` 海报层保持 |

## 验收

- 起始帧必须与 manifest 的页面一致；错帧先重传，不能用 prompt 补救。
- 中段只能出现该文件写明的一个动作，房间、曝光、人物和消音体边缘不漂移。
- 结尾停住，不新增角色、文字、字幕、UI、logo、水印或自动音频。
- 用 `ffprobe` 检查时长、编码和分辨率，再接入 Demo；页面翻页负责跨场景连续性。
