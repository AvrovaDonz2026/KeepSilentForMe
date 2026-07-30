# Web技术栈实现指南

> **技术选型确认**：《请替我沉默》采用 **Web (HTML5 + CSS + JavaScript)** 技术栈开发

---

## 📋 目录

1. [技术选型理由](#技术选型理由)
2. [核心技术解决方案](#核心技术解决方案)
3. [Day 0 技术验证](#day-0-技术验证)
4. [快速启动模板](#快速启动模板)
5. [开发路线图](#开发路线图)
6. [常见问题FAQ](#常见问题faq)

---

## 技术选型理由

### ✅ 为什么选择Web技术栈

| 优势 | 说明 |
|------|------|
| **字符热区问题已解决** | DOM `getBoundingClientRect()` 自动计算中文字符包围盒 |
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

**解决方案**：用 `<span>` 包裹每个zone

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

### 3. 视频播放与预加载

```javascript
// 视频播放器（支持移动端自动播放fallback）
async function playVideo(videoId) {
  const video = document.createElement('video');
  video.src = `assets/video/${videoId}.mp4`;
  
  try {
    await video.play();
  } catch (err) {
    // 移动端自动播放失败，显示播放按钮
    if (err.name === 'NotAllowedError') {
      showPlayButton(() => video.play());
    }
  }
}

// 预加载关键视频
function preloadCriticalVideos() {
  const videos = ['V0_out', 'V1_pass', 'V_RV'];
  videos.forEach(id => {
    const video = document.createElement('video');
    video.src = `assets/video/${id}.mp4`;
    video.preload = 'auto';
  });
}
```

### 4. localStorage存档

```javascript
// 游戏状态
const gameState = {
  chapter: 2,
  flags: { pass: 5, fail: 1 },
  eatLog: ["不能说的话", "很容易把事情搞砸"],
  seenVideos: ["V0_out", "V1_pass"]
};

// 存档
function saveGame() {
  localStorage.setItem('keepsilent_save', JSON.stringify(gameState));
}

// 读档
function loadGame() {
  const saved = localStorage.getItem('keepsilent_save');
  if (saved) {
    return JSON.parse(saved);
  }
  return null;
}

// 导出存档（下载JSON文件）
function exportSave() {
  const blob = new Blob([JSON.stringify(gameState)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'keepsilent_save.json';
  a.click();
}
```

---

## Day 0 技术验证

**必须在Day 0完成以下3项验证**，否则不要开始Day 1开发：

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

### 验证2：AI视频质量（3小时）

1. 用D0首帧生成V0_out测试片（6-8秒）
2. 检查清单：
   - [ ] 人物脸部是否崩坏
   - [ ] 消音体是否长出五官
   - [ ] doomer风格是否保持（深黑、低饱和）
   - [ ] 文件大小是否合理（<10MB）

**若失败率>50%**：切换到备用方案（静帧 + CSS Ken Burns效果）

### 验证3：移动端兼容（1小时）

在手机浏览器测试：
- [ ] 触摸拖拽是否流畅
- [ ] 视频能否播放（自动播放+手动播放）
- [ ] localStorage是否可用
- [ ] 字体渲染是否正常

---

## 快速启动模板

### Day 1 最小可运行Demo

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

## 开发路线图

详见 `schedule.md` 第六章：七天制作排期（Web技术栈）

**核心里程碑**：
- Day 0: 技术验证通过
- Day 2: L0+L1可玩
- Day 4: 全章节完成
- Day 7: 公开发布

---

## 常见问题FAQ

### Q1: 为什么不用React/Vue？
**A**: 本游戏是状态机驱动，不需要复杂的响应式框架。纯JS更轻量，无构建流程。

### Q2: 移动端视频自动播放被禁用怎么办？
**A**: 在首次用户交互（点击"开始游戏"）后初始化音频上下文，失败时显示播放按钮。

### Q3: localStorage存档会丢失吗？
**A**: 是的，清除浏览器数据会丢失。建议实现"导出/导入存档"功能（下载JSON文件）。

### Q4: 如何优化性能？
**A**: 
- 使用 `transform` 代替 `left/top`
- `requestAnimationFrame` 节流拖拽事件
- `will-change` 提示浏览器优化
- 图片用WebP格式，视频720p

### Q5: 如何部署到生产环境？
**A**: 
```bash
# Vercel（推荐）
npm install -g vercel
vercel

# Netlify（拖拽）
# 访问 app.netlify.com/drop

# GitHub Pages
# Settings → Pages → Deploy from main branch
```

---

## 相关文档

- **完整策划案**：`schedule.md`（含§十一 Web程序组装手册）
- **台词脚本**：`台本.md`（35句完整数据）
- **美术规范**：`art-style.md`（Doomer风格）
- **项目总览**：`README.md`

---

*文档版本：v1.0 · 最后更新：2026-07-30*
