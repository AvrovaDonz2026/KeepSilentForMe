# 《请替我沉默》美术风格规范

> 以现有母版风格为准：  
> `/home/donz/game/video-storyboard-doomer-1999/coordinate-storyboard/generated-gpt-image-2/`  
> （尤其 `M1` 室内、`M2` 人物剪影、`M5` 台灯+CRT、`M6` 雨夜空场、`M8` 侧影室内）  
> **尽可能沿用这套，不再走“可爱亮色二次元立绘”路线。**

---

## 一、风格一句话

**低饱和、深黑层次、手绘 2D 写实动画线稿的当代都市 doomer 氛围。**  
安静、疲惫、观察式镜头；不是赛博霓虹，不是偶像直播美颜，不是厚涂商业插画。

机制符号（黑条 / 被吃文字 / 消音体）是画面里唯一允许“异常生长”的元素，仍须服从同一套黑阶与哑光材质。

---

## 二、从母版里锁死的视觉 DNA

| 维度 | 规范 | 母版依据 |
| --- | --- | --- |
| 媒介 | 克制的手绘 2D 写实动画线稿；哑光磨损表面；淡交叉线；细 35mm 颗粒 | 全系列 prompts / 成图 |
| 黑阶 | 深黑室内层级（S09 系）：大面积近黑，靠微弱 practical 光分出层次 | M1, M5, M8 |
| 外景材质 | 湿蓝黑城市、雨水玻璃、脏钠灯反射、空场负空间 | M2, M6 |
| 人物 | 东亚年轻女性；长黑发刘海；灰橄榄 / 深蓝灰连帽衫；体态内收；多背影或 3/4 侧影 | M1, M2, M5, M8 |
| 表情 | 克制、疲惫、空白、假平静；**不要**大眼闪闪、偶像妆、亮面二次元脸 | M2, M8 |
| 灯光 | 单点 practical（台灯）为主；窗外冷雨/城市杂光为辅；信号红 ≤ 画面约 2% | M1, M5 |
| 色彩 | 近黑、蓝黑、脏灰绿、极少量钠灯棕；禁止高饱和粉蓝偶像色 | 全系列 |
| 构图 | 电影感 16:9 关键帧感；人物常 < 画面高度 30%—50%；留负空间 | M2, M6 |
| 情绪 | quiet / exhausted / waiting / observational | prompts 统一 mood |
| 时代地点感 | 当代都市（可继续用 2022—2026 北京式旧公寓、雨夜、CRT、旧桌） | prompts constraints |

---

## 三、必须避免（与母版 consistent）

- 可读正文大面积刷在场景底图上（UI 另做图层）
- 水印、箭头、分镜框、坐标、字幕条进原画
- 赛博霓虹、高光 3D、亮色 anime rendering
- 性感化、美少女偶像直播包装、粉嫩滤镜
- 血腥重口、武器、无必要烟草酒具堆料（母版已有意清理）
- 欧洲地标、乱入外语招牌（除非关卡叙事需要且可控）

---

## 四、对本作的适配：doomer 底 + 消音符号

### 4.1 角色「少女」怎么画

不要改成甜美 VTuber 立绘。沿用母版人物逻辑：

| 项 | 做法 |
| --- | --- |
| 造型 | 长黑发、连帽衫或朴素居家/出门层；可加一件“出门伪装”（薄外套、耳麦）表示直播/面试，但颜色仍低饱和 |
| 表演脸 | 6—8 态：**假笑、紧张、冷淡、空白、依赖、崩溃边缘、讨好、抽离**——全是微表情，不靠夸张 Q 版 |
| 站位 | 对话场景可用半身；过场与气氛图优先背影/侧影（母版强项） |
| 直播关 | 她可以面对“镜头”，但画面仍是暗房+显示器冷光，而不是舞台灯美颜 |

**卖点兼容**：可爱不是粉嫩，而是“在脏暗房间里仍要维持正确的话”的脆弱感。

### 4.2 消音体（玩家）怎么画

在 doomer 黑阶里生长，而不是卡通黑影贴图：

| 阶段 | 视觉 |
| --- | --- |
| 1 萌芽 | 对话框里渗出的墨迹/黑体残字，沿桌角、袖口、嘴边爬 |
| 2 半人 | 由碎字与消音条组成的半透明轮廓，贴在她身侧或肩后；边缘有颗粒与交叉线 |
| 3 实体 | 几乎与她重叠的模糊人形；仍保持哑光、非霓虹；可占画面很大，但不破坏整体蓝黑层级 |

被“吃掉”的文字：短促蠕动，像湿墙上的污迹在重组，而不是彩色特效字。

### 4.3 黑条 UI

- 游戏内操作黑条 = **实体感消音条**（哑光黑、轻微厚度、边缘毛刺/颗粒）
- 与电影审查条同源，但属于活物：吸附、吞噬时有短促形变
- UI 文字用干净 HUD 层叠在画面上，**不要烤进场景原画**（母版 avoid readable text on plate）

### 4.4 五关场景（同风格换 topology）

| 关卡 | 场景关键词（母版语汇） |
| --- | --- |
| 1 面试 | 廉价办公室/隔间；冷白管灯也可压成灰蓝；桌面空、 thruline 紧张 |
| 2 直播 | 旧公寓书桌 + 显示器/台灯（直接吃 M5 基因）；弹幕用 UI 层，不画进背景 |
| 3 朋友来访 | 同一公寓门廊/狭小客厅；门外漏光可极少量信号红（门缝，参考 M1） |
| 4 道歉直播 | 同直播桌，红反射略增但仍 ≤2% 级“舆论压力” |
| 5 无观众房间 | 清空杂物的房间；台灯或只剩窗光；最大负空间（吃 M1/M6 空场） |

外景过场（可选）：雨夜窗、湿柏油、空椅（M2/M6）——用于章节间喘息，不开放探索。

---

## 五、资产清单（按此风格生产）

| 资产 | 规格建议 | 备注 |
| --- | --- | --- |
| 少女关键姿势 | 3—5（背、侧、半身对镜/对屏、低头） | 优先侧/背降低表情成本 |
| 表情差分 | 6—8 | 眼神与嘴角微变即可 |
| 消音体 | 3 阶段 × 可 tile 的墨迹/字屑 | 可程序叠字 |
| 场景 BG | 5 张 16:9 | 面试/直播桌/门厅/同桌加压/空房 |
| 道具 | CRT/显示器、台灯、旧椅、雨窗 | 直接复用母版物件语言 |
| UI | 对话框、黑条、简单按钮 | 与原画分层；高对比但不高饱和 |
| 海报/标题 | 1 张 | 她侧脸 + 嘴边爬字人形；近黑底 |

产出尺寸可与母版一致：`2048×1152`（16:9）作 BG/关键帧；立绘再切。

---

## 六、生成提示词骨架（沿用母版写法）

做新图时，建议保持与 `prompts/M*.txt` 同结构：

```text
Use case: illustration-story / game-background / character-portrait.
Asset type: 16:9 cinematic keyframe for [关卡名].
Style/medium: dense but controlled hand-drawn 2D realistic animation linework,
matte worn surfaces, subtle cross-hatching, fine 35mm grain;
deep-black interior hierarchy + wet blue-black city depth when exterior visible.
Lighting/mood: one practical lamp and/or cold rain window; quiet, exhausted, observational.
Color palette: near black, blue-black, dirty gray-green, tiny sodium brown;
signal red may occupy less than 2% of the frame.
Character (if any): same young East Asian woman, long black hair, gray-olive or blue-gray hoodie;
restrained face; no glamour, no bright anime eyes; age-appropriate.
Project motif (if any): matte black censor-bar / eaten glyphs may creep as a living silhouette
beside her; still matte, never neon.
Constraints: contemporary urban China 2022-2026; clean plate; physically coherent furniture;
screens may show only blank/dark or abstract glow — no baked-in UI paragraphs.
Avoid: readable spam text, watermark, arrows, coordinates, cyberpunk neon, glossy 3D,
bright anime rendering, idol livestream aesthetic, sexualization, tobacco clutter, weapons.
```

**多图参考策略（与 doomer 项目相同）**：

1. 人物+室内线稿黑阶母版（S09 / M5 / M8 一类）  
2. 雨夜湿材质+空场母版（S11 / M6 一类）  
3. 本关构图 blocking 草图（只借构图，不借别的画风）

---

## 七、对策划与卖点的影响（已对齐方向）

| 原表述风险 | 改用本风格后 |
| --- | --- |
| “可爱二次元立绘” | 改为 **doomer 手绘写实动画风少女** |
| “粉嫩主播”传播图 | 改为 **暗房侧脸 + 黑条人形缠绕**（更独特、更贴母版） |
| 亮色 UI 大面板 | 改为 **极简 HUD + 实体黑条**，让原画呼吸 |

**更新后的视觉卖点一句**：  
在几乎全黑的房间里，她说正确的话；你从被遮住的字里，长在她身侧。

这与母版的“疲惫等待 / 室内深黑 / 雨夜城市”完全同频，也比通用萌系更难被换皮。

---

## 八、一致性检查表（出图自检）

- [ ] 是否仍是近黑 + 蓝黑，而不是灰白明亮日常漫？  
- [ ] 是否只有一处主 practical 光或等价克制光？  
- [ ] 人物是否连帽/朴素，而非偶像服？  
- [ ] 有无大眼闪高光、霓虹、粉紫渐变？  
- [ ] 消音体是否哑光、像污迹/墨/条，而非彩色特效？  
- [ ] 场景原画上是否误烤了大段 UI 字？  
- [ ] 情绪是否“安静疲惫”而非“热血爽感”？  

任一否 → 回母版 M1/M2/M5/M6/M8 对齐。

---

## 九、母版索引（制作时打开对稿）

| 文件 | 借用什么 |
| --- | --- |
| `M1-now-and-door.png` | 室内深黑、门缝信号红、背影、旧公寓 |
| `M2-see-others.png` | 侧影、雨窗、城市湿反光、人物占比 |
| `M5-echo-becomes-price.png` | 台灯+书桌+屏幕（直播/面试桌直接基因） |
| `M6-presence-and-body.png` | 空场、雨玻璃、钠灯、负空间 |
| `M8-camera-and-robe.png` | 侧立、单灯、旧机器、灰尘颗粒 |
| `prompts/*.txt` | 英文约束句式与 avoid 列表 |

---

*v0.1 · 美术风格锁定：Doomer-1999 / GPT-Image-2 关键帧系 → 《请替我沉默》全案默认视觉。*
