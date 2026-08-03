# Web技术栈实现指南

> **当前实现**：《请替我沉默》使用 **Web (HTML5 + CSS + JavaScript)** 作为运行时，并由 **Tauri 2** 提供桌面壳。本文保留早期技术验证和视频方案，当前运行入口以 `web/`、两个 manifest 和 `src-tauri/` 为准。

---

## 📋 目录

1. [技术选型理由](#技术选型理由)
2. [核心技术解决方案](#核心技术解决方案)
3. [历史 Day 0 验证](#历史-day-0-技术验证与参考模板)
4. [快速启动模板](#快速启动模板)
5. [开发路线图](#开发路线图)
6. [常见问题FAQ](#常见问题faq)

---

## 技术选型理由

### ✅ 为什么选择Web技术栈

| 优势 | 说明 |
|------|------|
| **字符热区方案已验证** | 单一文本节点 + `Range.getClientRects()` 自动处理换行、重叠和响应式字体 |
| **零构建流程** | 无需Webpack/Vite，F5刷新即可测试 |
| **跨平台原生** | 同一份代码运行在PC/Mac/iOS/Android |
| **部署简单** | 静态托管，一键发布到Vercel/Netlify |
| **易分发** | 一个URL即可分享，无需下载安装 |
| **学习成本低** | 纯原生JS，无框架依赖 |

### ❌ 不选Unity/Godot的原因

| 问题 | Web方案 |
|------|---------|
| 中文字符热区计算困难 | DOM自动处理 |
| 需要下载客户端（>100MB） | 浏览器直接运行 |
| 移动端适配复杂 | 响应式CSS自适应 |
| 发布流程繁琐 | 静态文件托管 |

---

## 核心技术解决方案

### 1. 字符级热区吸附（核心玩法）

**问题**：如何精确获取"很容易把事情搞砸"这段文字的屏幕位置？

**当前解决方案**：原句只渲染一次，再用 `Range` 生成独立的透明命中矩形。下面的 `<span>` 代码仅保留为早期概念示例，不能作为当前实现的 DOM 结构依据。

```html
<!-- 原始句子 -->
我叫——算了，名字不重要，我只是一个很普通、很容易把事情搞砸的人。

<!-- 用span包裹zone -->
<div id="dialogue-text">
  我叫——算了，名字不重要，我只是一个很普通、<span class="zone" data-id="0">很容易把事情搞砸</span>的人。
</div>
```

```javascript
// 获取zone的精确屏幕位置
const zone = document.querySelector('[data-id="0"]');
const rect = zone.getBoundingClientRect();

console.log(rect);
// {
//   x: 234,
//   y: 450,
//   width: 189,
//   height: 32,
//   top: 450,
//   bottom: 482,
//   left: 234,
//   right: 423
// }

// 黑条吸附到这个位置
blackBar.style.left = rect.left + 'px';
blackBar.style.top = rect.top + 'px';
blackBar.style.width = rect.width + 'px';
```

**优势**：
- ✅ 浏览器自动处理中文排版
- ✅ 不需要手动计算字符索引
- ✅ 自动适配不同字体大小

### 2. 黑条拖拽与吸附

**使用Pointer Events统一处理鼠标和触摸**：

```javascript
const bar = document.getElementById('black-bar');
let isDragging = false;

bar.addEventListener('pointerdown', (e) => {
  isDragging = true;
  bar.setPointerCapture(e.pointerId); // 锁定指针
});

bar.addEventListener('pointermove', (e) => {
  if (!isDragging) return;
  
  // 使用requestAnimationFrame优化性能
  requestAnimationFrame(() => {
    bar.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
});

bar.addEventListener('pointerup', (e) => {
  isDragging = false;
  
  // 计算最近的zone并吸附
  const nearestZone = findNearestZone(e.clientX, e.clientY);
  snapToZone(bar, nearestZone);
});
```

### 3. 媒体层（规划，不属于当前 Demo）

策划案中的 `V0_out`、`V1_pass`、`V_RV` 等视频仍是后续媒体层设计，当前 `web/`
没有 `<video>` 播放器，也不会因为缺少视频文件而阻塞章节推进。当前章节切换使用整页
场景图片的翻页/淡入动画；提示音继续使用 `main.js` 中的 Web Audio，BGM 使用
`web/audio/manifest.json` 与两个隐藏的 HTMLAudioElement 播放槽。

#### CC0 BGM 播放层

音频 manifest 记录曲目路径、循环标记、默认增益、章节/结局绑定和来源信息。标题、
L0/L1 使用 `rain-room`，L2/L4 使用 `live-pressure`，L3 使用 `door-tension`，L5 与四个结局使用
`hollow-hope`。章节或结局变化时，当前槽淡出、备用槽淡入约 650ms；同一章节的台词
切换不会重启音乐。素材全部存放在 `web/audio/bgm/`，不从第三方域名热链。

浏览器自动播放被阻止时，运行时只记录待播放曲目，等待开始按钮或调试入口的第一次
用户手势重试；右上角总开关会同时暂停/恢复 BGM 和 Web Audio 提示音。来源页、CC0
记录、转码参数和 SHA-256 见 `web/audio/SOURCES.md`。

### 4. 关末回声：语言胃 / Echo Digest

L1-L4 完成后，运行时会把本章所有已吞下的文字转成碎片池。玩家可以通过点击、鼠标
拖拽或触摸拖拽把碎片放进私语 lane；没有正确顺序，也没有失败分支。确认后，私语只
作为下一章第一句旁的叙事回声和视觉反馈，不会修改 flags、章节绑定或结局判定。

碎片在进入池子时保留重复项，并以章节 ID 归属，避免不同章节的同名文字混在一起。
`main.js` 会在整个私语层监听 `pointermove` / `pointerup`，兼容部分浏览器不把
Pointer Capture 的结束事件送回原按钮的情况。

#### L2/L4 直播滚屏

L2 与 L4 使用独立的 `#live-chat` DOM 层和 `LIVE_CHAT_COPY` 文本表。每句直播台词
切换一组评论，CSS 轨道从首条评论立即开始向上循环；吸附后的 `zone.npc` 反馈通过
`appendLiveChat()` 追加。观众人数从每句的 `LIVE_VIEWERS` 基准开始，以 1.8 秒间隔
小幅波动。该层不写入存档，离开直播章节时清空计时器，`prefers-reduced-motion` 会关闭
滚动和红点脉冲。布局在桌面端使用 `min(480px, 42vw)` × `min(420px, 48vh)`，移动端
使用 `min(280px, 72vw)` 且最高 `270px`；已在 Chrome 的 1280×900 和 390×844 视口
验证滚屏不会遮挡底部台词框。

### 5. localStorage存档

```javascript
// 当前 Demo 的存档形状（键名：keep-silent-for-me-demo）
const gameState = {
  chapterIndex: 2,
  lineIndex: 1,
  flags: { pass: 5, fail: 1 },
  eatLog: [
    { chapterId: "L1", text: "不能说的话" },
    { chapterId: "L1", text: "很容易把事情搞砸" }
  ],
  memoryByChapter: {
    L1: ["不能说的话", "很容易把事情搞砸"]
  },
  memoryDraft: null,
  endingId: null
};

// 存档
function saveGame() {
  localStorage.setItem('keep-silent-for-me-demo', JSON.stringify(gameState));
}

// 读档
function loadGame() {
  const saved = localStorage.getItem('keep-silent-for-me-demo');
  if (saved) {
    return JSON.parse(saved);
  }
  return null;
}

// 当前 Demo 暂未提供导出/导入存档 UI；清除浏览器数据会清除进度。
// 旧版 eatLog 字符串数组会在读档时按当前章节转换为 { chapterId, text }。
```

---

## 历史 Day 0 技术验证与参考模板

以下内容记录最初的验证思路。当前仓库已经包含完整 `web/` Demo，日常开发应直接运行
根目录静态服务器；视频质量和真实移动设备回归仍是未完成项。

### 验证1：字符热区吸附（2小时）

创建 `test-zone.html`：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    .zone { 
      background: rgba(255,0,0,0.2); 
      padding: 2px 4px;
    }
    #info { 
      position: fixed; 
      top: 10px; 
      right: 10px; 
      background: white; 
      padding: 10px; 
    }
  </style>
</head>
<body>
  <div style="font-size: 24px; padding: 50px;">
    我<span class="zone" data-id="0">其实没什么经验，而且我经常会说错话，</span>但我真的很需要这份工作。
  </div>
  
  <div id="info"></div>
  
  <script>
    const zone = document.querySelector('.zone');
    const info = document.getElementById('info');
    
    zone.addEventListener('click', () => {
      const rect = zone.getBoundingClientRect();
      info.innerHTML = `
        位置: (${rect.left.toFixed(0)}, ${rect.top.toFixed(0)})<br>
        尺寸: ${rect.width.toFixed(0)} × ${rect.height.toFixed(0)}
      `;
    });
  </script>
</body>
</html>
```

**验收标准**：
- ✅ 点击zone能正确显示位置和尺寸
- ✅ 中文、英文、标点符号都能正确包裹
- ✅ 改变字体大小后位置自动更新

### 验证2：AI视频质量（后续媒体任务）

1. 用D0首帧生成V0_out测试片（6-8秒）
2. 检查清单：
   - [ ] 人物脸部是否崩坏
   - [ ] 消音体是否长出五官
   - [ ] doomer风格是否保持（深黑、低饱和）
   - [ ] 文件大小是否合理（<10MB）

**若失败率>50%**：切换到备用方案（静帧 + CSS Ken Burns效果）

### 验证3：移动端兼容（后续设备 QA）

在手机浏览器测试：
- [ ] 触摸拖拽是否流畅
- [ ] 横竖屏、触摸拖拽和低端设备表现
- [ ] localStorage是否可用
- [ ] 字体渲染是否正常

---

## 快速启动模板

### Day 1 最小可运行 Demo（历史参考）

创建 `index.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keep Silent For Me</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      width: 100vw; 
      height: 100vh; 
      background: #0A0A0A;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    
    #game-container { 
      position: relative; 
      width: 100%; 
      height: 100%; 
    }
    
    #dialogue-box {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 25vh;
      background: rgba(18, 18, 18, 0.9);
      padding: 3vw;
      display: flex;
      align-items: center;
    }
    
    #dialogue-text {
      color: #E8E4DC;
      font-size: clamp(18px, 2vw, 32px);
      line-height: 1.6;
    }
    
    .zone {
      background: rgba(255, 0, 0, 0.1);
      transition: background 0.2s;
      cursor: pointer;
    }
    
    .zone:hover {
      background: rgba(255, 0, 0, 0.3);
    }
    
    #black-bar {
      position: absolute;
      background: #0A0A0A;
      height: 48px;
      min-width: 80px;
      cursor: grab;
      touch-action: none;
      will-change: transform;
      display: none;
      border-radius: 2px;
    }
    
    #black-bar.dragging {
      cursor: grabbing;
    }
  </style>
</head>
<body>
  <div id="game-container">
    <div id="dialogue-box">
      <div id="dialogue-text">加载中...</div>
    </div>
    <div id="black-bar"></div>
  </div>
  
  <script>
    // 游戏数据（简化版）
    const testLine = {
      raw: "我其实没什么经验，而且我经常会说错话，但我真的很需要这份工作。",
      zones: [
        {
          text: "其实没什么经验，而且我经常会说错话，",
          remain: "我真的很需要这份工作。",
          npc: "态度诚恳，可以。"
        },
        {
          text: "真的很需要这份工作",
          remain: "我其实没什么经验，而且我经常会说错话。",
          npc: "那我们很难录用。"
        }
      ]
    };
    
    // 渲染对话
    function renderLine(line) {
      let html = line.raw;
      line.zones.forEach((zone, i) => {
        html = html.replace(zone.text, 
          `<span class="zone" data-id="${i}">${zone.text}</span>`);
      });
      document.getElementById('dialogue-text').innerHTML = html;
      
      // 显示黑条
      const bar = document.getElementById('black-bar');
      bar.style.display = 'block';
      
      // 初始化拖拽
      initDrag(line.zones);
    }
    
    // 拖拽逻辑
    function initDrag(zones) {
      const bar = document.getElementById('black-bar');
      let isDragging = false;
      
      bar.addEventListener('pointerdown', (e) => {
        isDragging = true;
        bar.classList.add('dragging');
        bar.setPointerCapture(e.pointerId);
      });
      
      bar.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        
        requestAnimationFrame(() => {
          bar.style.transform = `translate(${e.clientX - bar.offsetWidth/2}px, ${e.clientY - bar.offsetHeight/2}px)`;
        });
      });
      
      bar.addEventListener('pointerup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        bar.classList.remove('dragging');
        
        // 找最近的zone
        const zoneElements = document.querySelectorAll('.zone');
        let nearestZone = null;
        let minDistance = Infinity;
        
        zoneElements.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.sqrt(
            Math.pow(e.clientX - centerX, 2) + 
            Math.pow(e.clientY - centerY, 2)
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            nearestZone = { element: el, data: zones[index], rect };
          }
        });
        
        // 吸附动画
        if (nearestZone) {
          bar.style.transition = 'transform 0.15s ease-out';
          bar.style.transform = `translate(${nearestZone.rect.left}px, ${nearestZone.rect.top}px)`;
          bar.style.width = nearestZone.rect.width + 'px';
          
          setTimeout(() => {
            // 切换到remain文本
            document.getElementById('dialogue-text').textContent = nearestZone.data.remain;
            alert('NPC: ' + nearestZone.data.npc);
            bar.style.transition = '';
          }, 200);
        }
      });
    }
    
    // 启动游戏
    renderLine(testLine);
  </script>
</body>
</html>
```

**验收标准**：
- ✅ 能看到完整句子，zone有背景色
- ✅ 黑条可以拖动
- ✅ 松手后吸附到最近zone
- ✅ 显示remain文本和NPC反馈

---

## 开发路线图（目标设计）

详见 `schedule.md` 第六章：七天制作排期（Web技术栈）

当前已完成 Day 2/4 对应的核心 Demo、整页场景和 4 首 CC0 BGM 接入；尚未完成的是视频、外部 SFX、
完整跨章节规则和设备 QA。具体问题见根目录 `issue.md`。

---

## 常见问题FAQ

### Q1: 为什么不用React/Vue？
**A**: 本游戏是状态机驱动，不需要复杂的响应式框架。纯JS更轻量，无构建流程。

### Q2: 当前 Demo 是否播放视频？
**A**: 否。关末视频仍是规划中的媒体层；当前章节之间使用整页场景翻页/淡入，右上角控制 Web Audio 提示音和本地 CC0 BGM。

### Q3: localStorage存档会丢失吗？
**A**: 是的，清除浏览器数据会丢失。当前 Demo 使用 `keep-silent-for-me-demo` 保存进度，尚未提供导出/导入。

### Q4: 如何优化性能？
**A**: 
- 使用 `transform` 代替 `left/top`
- `requestAnimationFrame` 节流拖拽事件
- `will-change` 提示浏览器优化
- 页面 PNG 是完整场景图；透明 V4 资产仅作为源文件和 UI/反馈层，不再作为角色场景叠加层

### Q5: 如何部署到生产环境？
**A**: 
```bash
# Vercel（推荐）
npm install -g vercel
vercel

# Netlify（拖拽）
# 访问 app.netlify.com/drop

# GitHub Pages
# Settings → Pages → Source: GitHub Actions
```

---

## 相关文档

- **完整策划案**：`schedule.md`（含§十一 Web程序组装手册）
- **台词脚本**：`台本.md`（35句完整数据）
- **美术规范**：`art-style.md`（Doomer风格）
- **当前可玩资产包**：`art/v4/playable/README.md`（manifest、生成入口与校验）
- **项目总览**：`README.md`

---

*文档版本：v1.2 · 最后更新：2026-08-03*
