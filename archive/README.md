# 归档资产

这里保存项目早期美术、历史分镜和生成结果。归档内容用于回溯、比较和重新生成，
不会被 Web Pages 或 Tauri 运行时复制。

## 当前入口

- 当前可玩透明资产：[`../art/v4/playable/`](../art/v4/playable/)
- 当前整页场景资产：[`../art/v4/scenes/`](../art/v4/scenes/)
- 当前道具锁分镜：[`../storyboard/v4-prop-lock/`](../storyboard/v4-prop-lock/)

## 归档分区

- `art-v1/`：早期角色、消音体、UI、提示词和生成脚本；兼容背景保留在 `art/bg/`
- `generated-assets/`：早期批量生成结果 JSON 和本地生成目录
- `storyboard/v1-dark/`：第一版深黑气氛稿
- `storyboard/v2-readable/`：第二版可读光方案
- `storyboard/v3-room-lock/`：第三版房间拓扑锁
- `storyboard/demo-effects/`：D0-D6 玩法效果参考图和生成脚本
- `storyboard/legacy-root-v4/`：曾位于 `storyboard/` 根目录、现已由 `v4-prop-lock/` 取代的重复副本

归档文件不删除、不重压缩；新章节和运行时逻辑不要直接引用这里的路径。
