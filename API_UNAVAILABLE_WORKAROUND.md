# 美术资产生成 - API不可用应急方案

**当前情况**: API服务503不可用  
**时间**: 2026-07-31  
**状态**: 需要使用替代方案

---

## 🚨 问题诊断

### API状态
- **端点**: `https://api.qingyuntop.top/v1`
- **错误**: 503 Service Unavailable
- **影响**: 无法通过API生成图片

### 已尝试的解决方案
1. ✅ 修复域名（api.qingyuntop.top）
2. ✅ 添加重试机制
3. ✅ 简化提示词
4. ❌ 服务端503错误，无法解决

---

## 💡 立即可用的替代方案

### 方案1: 等待API服务恢复（推荐优先尝试）
```bash
# 等待几分钟后重试
python3 /tmp/generate_assets_fixed.py
```

### 方案2: 使用其他AI图像生成平台

#### DALL-E 3 (OpenAI)
1. 访问: https://platform.openai.com/playground
2. 复制 `PROMPTS_ALL.txt` 中的提示词
3. 逐个生成并下载
4. 放置到 `generated_assets/` 对应目录

#### Midjourney
1. 访问: https://midjourney.com
2. 使用Discord命令: `/imagine prompt: [提示词]`
3. 下载生成的图片
4. 后处理并放置到对应目录

#### Leonardo.ai
1. 访问: https://leonardo.ai
2. 使用Image Generation功能
3. 复制提示词生成
4. 下载并整理

### 方案3: 本地Stable Diffusion
如果你有本地SD环境（ComfyUI/AUTOMATIC1111）:
```bash
# 使用本地模型生成
# 参考 art/v4/playable/generate_local.py
```

---

## 📋 优先级1资产清单（最重要的6张）

### 1. BG_apartment（公寓场景）
**提示词**:
```
Dark apartment room interior with desk, CRT monitor, desk lamp, rain window, 
doomer aesthetic, deep black and blue-black colors, 35mm film grain, 
low saturation, cinematic 16:9 composition
```
**尺寸**: 1792x1024或1920x1080  
**保存为**: `generated_assets/bg/BG_apartment.png`

### 2. BG_meeting_room（会议室）
**提示词**:
```
Small formal meeting room, long table, cold fluorescent lighting, 
glass partition, professional oppressive atmosphere, doomer aesthetic, 
16:9 composition
```
**尺寸**: 1792x1024或1920x1080  
**保存为**: `generated_assets/bg/BG_meeting_room.png`

### 3. CHAR_desk_pose（主角坐姿）
**提示词**:
```
East Asian woman sitting at desk, side profile, grey hoodie, long black hair, 
exhausted posture, doomer aesthetic, transparent background PNG
```
**尺寸**: 1024x1024  
**保存为**: `generated_assets/char/CHAR_desk_pose.png`

### 4. FACE_anxious（紧张表情）
**提示词**:
```
East Asian woman face close-up, anxious expression, eyebrows furrowed, 
eyes downward, doomer aesthetic, transparent background PNG
```
**尺寸**: 1024x1024  
**保存为**: `generated_assets/faces/FACE_anxious.png`

### 5. FACE_cold（冷淡表情）
**提示词**:
```
East Asian woman face close-up, flat affect, emotionless, dull gaze, 
doomer aesthetic, transparent background PNG
```
**尺寸**: 1024x1024  
**保存为**: `generated_assets/faces/FACE_cold.png`

### 6. CREATURE_stage1（消音体阶段1）
**提示词**:
```
Abstract ink stain blob, fragmented Chinese characters, matte black, 
NO facial features, NO eyes, palm-sized, doomer aesthetic, 
transparent background PNG
```
**尺寸**: 1024x1024  
**保存为**: `generated_assets/creature/CREATURE_stage1.png`

---

## 📦 完整资产清单

详见以下文档获取所有19张资产的完整提示词:
- **PROMPTS_ALL.txt** - 可直接复制的提示词
- **ASSET_GENERATION_GUIDE.md** - 详细生成指南（200-400词完整提示词）

---

## ✅ 验证生成的资产

生成完成后运行:
```bash
cd /home/donz/KeepSilentForMe
python3 -c "
import os
from PIL import Image

assets_dir = 'generated_assets'
required = [
    'bg/BG_apartment.png',
    'bg/BG_meeting_room.png',
    'char/CHAR_desk_pose.png',
    'faces/FACE_anxious.png',
    'faces/FACE_cold.png',
    'creature/CREATURE_stage1.png'
]

print('验证优先级1资产:')
for asset in required:
    path = f'{assets_dir}/{asset}'
    if os.path.exists(path):
        img = Image.open(path)
        print(f'✅ {asset}: {img.size} {img.mode}')
    else:
        print(f'❌ {asset}: 缺失')
"
```

---

## 🔄 后续步骤

### 一旦有了优先级1的6张资产:
1. **立即可以开始Day 0验证**
   - 测试zone包裹（不需要美术资产）
   - 验证Web技术方案

2. **可以开始Day 1开发**
   - 使用临时占位图
   - 实现核心拖拽循环
   - 后续替换为最终资产

3. **继续生成剩余资产**（13张）
   - 优先级2资产可以并行生成
   - 不阻塞开发进度

---

## 📞 寻求帮助

如果所有方案都无法使用:
1. 检查 `storyboard/frames/` 是否有可用的参考图
2. 使用占位图先完成开发
3. 后续补充最终美术资产

---

**报告生成时间**: 2026-07-31 18:00  
**API状态**: 503 Service Unavailable  
**建议**: 使用方案2（其他平台）或等待API恢复
