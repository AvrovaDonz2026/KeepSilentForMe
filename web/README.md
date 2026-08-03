# Web Demo

`web/` 是当前可玩的原生 HTML/CSS/JavaScript 运行时。它不需要打包器，
通过 Pointer Events 处理鼠标和触摸拖拽，通过 `localStorage` 保存当前章节、台词、
旗标和结局状态。

## 本地运行

必须通过静态服务器打开，不能直接双击 `index.html`：

```bash
python3 -m http.server 8765 --directory .
```

打开 <http://127.0.0.1:8765/web/>。

正常启动顺序为：

1. 载入章节 JSON、V4 可玩 manifest 和整页场景 manifest。
2. 显示 `coverPage` 指定的标题封面（当前为 `PAGE_L5_poster`）。
3. 没有存档时显示“开始游戏”；有存档时显示“继续游戏”和“重新开始”。
4. 进入 L0-L5，完成最后一句后显示对应结局覆盖层。

## 调试入口

URL 参数是直接调试入口，启动时会跳过标题封面：

```text
/web/?chapter=L3
/web/?chapter=L3&line=L3_S04b
/web/?ending=A_separate
```

可用章节 ID 为 `L0`、`L1`、`L2`、`L3`、`L4`、`L5`；结局 ID 为
`A_separate`、`B_alienate`、`C_consume`、`C_cold`。

## 当前运行时边界

- 句子原文只渲染一次，`Range.getClientRects()` 生成可换行、可重叠的透明命中层。
- 玩家只能把黑条拖到预定义连续 zone；吸附后显示 HTML 反馈和整页切换动画。
- 角色、朋友、消音体和结局已经绘制进 13 张整页 PNG，运行时不再叠加透明叙事层。
- `pageBindings` 负责章节/台词到场景页的映射；`endingPages` 负责四个逻辑结局。
- L1 会按 `pass/fail` 显示重试层；L2/L3/L4 当前只记录旗标并继续推进。
- `L5_S06` 直接决定四个结局；`C_consume` 和 `C_cold` 共用 `PAGE_END_C_hollow`。
- 右上角提示音使用 Web Audio 生成，可关闭；当前没有 BGM、外部 SFX、配音或视频播放。

## 在线与桌面构建

GitHub Pages 工作流位于 `.github/workflows/deploy-pages.yml`，在线入口为：

<https://avrovadonz2026.github.io/KeepSilentForMe/web/>

Tauri 2 工作流位于 `.github/workflows/build-tauri.yml`。最新成功运行生成：

- `keep-silent-for-me-windows-x64-nsis`
- `keep-silent-for-me-linux-amd64-appimage`
- `keep-silent-for-me-linux-amd64-deb`

桌面构建前，`scripts/prepare-tauri.mjs` 会将 `web/`、`script/chapters.json`、
`art/v4/playable/` 和 `art/v4/scenes/` 组装到 `dist/tauri/`。

## 场景页生成与校验

`art/v4/scenes/manifest.json` 是页面 ID、封面、章节绑定和结局绑定的唯一来源。
生成脚本使用 `/images/edits`，不会把密钥写入仓库：

```bash
OPENAI_BASE_URL=https://api.qingyuntop.top/v1 \
OPENAI_API_KEY=... \
MODEL=gpt-image-2 \
./art/v4/scenes/generate_pages.sh all

python3 art/v4/scenes/validate.py
```

生成器默认跳过已存在的 PNG；使用 `FORCE=1` 才会重绘。响应和日志保存在 `/tmp`。

## 相关文档

- 根目录 [README.md](../README.md)：项目状态、部署和下一步
- [art/v4/scenes/README.md](../art/v4/scenes/README.md)：13 张整页场景页
- [art/v4/playable/README.md](../art/v4/playable/README.md)：55 件 V4 UI/反馈与源资产
- [issue.md](../issue.md)：当前规则和叙事数据问题清单
