const DATA_URL = "../script/chapters.json";
const PLAYABLE_MANIFEST_URL = "../art/v4/playable/manifest.json";
const PAGE_MANIFEST_URL = "../art/v4/scenes/manifest.json";
const AUDIO_MANIFEST_URL = "audio/manifest.json?v=audio-2";
const PLAYABLE_ROOT = "../art/v4/playable/";
const PAGE_ROOT = "../art/v4/scenes/";
const AUDIO_ROOT = "audio/";
const SAVE_KEY = "keep-silent-for-me-demo";
const MEMORY_CHAPTER_IDS = new Set(["L1", "L2", "L3", "L4"]);
const LIVE_CHAPTER_IDS = new Set(["L2", "L4"]);
const BGM_FADE_MS = 650;

const SCENE_META = {
  L0: { readout: "雨窗 · 书桌", status: "她坐在书桌前，把第一句话递了出来。", caption: "整页 · D0 书桌" },
  L1: { readout: "会议室", status: "她在回答问题。你在决定哪些部分可以被听见。", caption: "整页 · D1 面试" },
  L2: { readout: "第一次直播", status: "屏幕亮着，房间没有变亮。", caption: "整页 · 直播阶段" },
  L3: { readout: "门厅", status: "门开着一条缝，朋友还没有进来。", caption: "整页 · 门口" },
  L4: { readout: "道歉直播", status: "她把表情交给了观众，黑条比她更早知道答案。", caption: "整页 · 道歉" },
  L5: { readout: "没有观众的房间", status: "没有观众。只有她，和你吞下去的字。", caption: "整页 · 终局" },
};

const LIVE_CHAT_COPY = {
  L2_S01: ["来了来了", "新人？", "脸呢", "声音有点困", "主播看镜头"],
  L2_S02: ["为什么直播", "说实话", "冷淡姐", "缺钱也正常", "好好说话哈哈"],
  L2_S03: ["唱一首！", "心里在骂谁", "这主播好凶", "嘴硬", "点歌点歌"],
  L2_S04: ["有你在？", "这句像告白", "主播你在看谁", "好像什么都能说", "突然认真"],
  L2_S05: ["问问日常", "她笑了", "好温柔", "下播吧", "是不是不开心"],
  L2_S06: ["房间好暗", "开灯看看", "后面有人吗", "有点吓人", "别关灯"],
  L2_S07: ["晚安", "再播一会", "想你们？", "这句好假", "下次见"],
  L4_S01: ["道歉", "别装死", "终于上线了", "先解释清楚", "表情呢"],
  L4_S02: ["对不起就完了？", "终于道歉", "假道歉", "别念稿", "你觉得自己没错？"],
  L4_S03: ["又在卖惨", "有担当？", "如果是什么意思", "说人话", "谁被伤害了"],
  L4_S04: ["在跟谁说话", "少吃一点？", "什么暗号", "后半句呢", "她旁边有人"],
  L4_S05: ["只说我们想听的", "威胁观众？", "好好反省", "她眼神不对", "别演了"],
  L4_S06: ["还敢骂人", "互撕开始", "下播吧", "举报了", "这才是真话"],
  L4_S07: ["还没道完", "谁留下来", "别走", "直播别关", "拜拜"],
};

const LIVE_VIEWERS = {
  L2_S01: 1204,
  L2_S02: 1238,
  L2_S03: 1311,
  L2_S04: 1486,
  L2_S05: 1402,
  L2_S06: 1198,
  L2_S07: 1067,
  L4_S01: 8842,
  L4_S02: 9137,
  L4_S03: 8871,
  L4_S04: 8240,
  L4_S05: 7788,
  L4_S06: 10320,
  L4_S07: 6140,
};

const dom = {
  app: document.querySelector("#app"),
  stage: document.querySelector(".stage"),
  scenePage: document.querySelector("#scene-page"),
  bgmA: document.querySelector("#bgm-a"),
  bgmB: document.querySelector("#bgm-b"),
  titleScreen: document.querySelector("#title-screen"),
  titlePrimary: document.querySelector("#title-primary"),
  titleNewGame: document.querySelector("#title-new-game"),
  titleStatus: document.querySelector("#title-status"),
  chapterKicker: document.querySelector("#chapter-kicker"),
  chapterTitle: document.querySelector("#chapter-title"),
  statusCopy: document.querySelector("#status-copy"),
  statusFill: document.querySelector("#status-rule-fill"),
  sceneCaption: document.querySelector("#scene-caption"),
  liveChat: document.querySelector("#live-chat"),
  liveChatTrack: document.querySelector("#live-chat-track"),
  liveChatViewers: document.querySelector("#live-chat-viewers"),
  fxLayer: document.querySelector("#fx-layer"),
  dialogueFrame: document.querySelector("#dialogue-frame"),
  dialogueContent: document.querySelector(".dialogue-content"),
  memoryEcho: document.querySelector("#memory-echo"),
  dialogueText: document.querySelector("#dialogue-text"),
  dialogueZones: document.querySelector("#dialogue-zones"),
  speakerName: document.querySelector("#speaker-name"),
  lineId: document.querySelector("#line-id"),
  feedbackCopy: document.querySelector("#feedback-copy"),
  zoneCount: document.querySelector("#zone-count"),
  blackBar: document.querySelector("#black-bar"),
  zoneHalo: document.querySelector("#zone-halo"),
  toast: document.querySelector("#toast"),
  overlay: document.querySelector("#chapter-overlay"),
  overlayEyebrow: document.querySelector("#overlay-eyebrow"),
  overlayTitle: document.querySelector("#overlay-title"),
  overlayCopy: document.querySelector("#overlay-copy"),
  overlayAction: document.querySelector("#overlay-action"),
  memoryOverlay: document.querySelector("#memory-overlay"),
  memoryEyebrow: document.querySelector("#memory-eyebrow"),
  memoryTitle: document.querySelector("#memory-title"),
  memoryCopy: document.querySelector("#memory-copy"),
  memoryPool: document.querySelector("#memory-pool"),
  memoryLane: document.querySelector("#memory-lane"),
  memoryConfirm: document.querySelector("#memory-confirm"),
  errorPanel: document.querySelector("#error-panel"),
  errorCopy: document.querySelector("#error-copy"),
  restartButton: document.querySelector("#restart-button"),
  soundButton: document.querySelector("#sound-button"),
  retryButton: document.querySelector("#retry-button"),
};

const state = {
  data: null,
  playable: null,
  pages: null,
  audio: null,
  assets: new Map(),
  pageAssets: new Map(),
  chapters: [],
  chapterIndex: 0,
  lineIndex: 0,
  flags: {},
  eatLog: [],
  memoryByChapter: {},
  memoryDraft: null,
  memoryDrag: null,
  suppressMemoryClick: false,
  liveChatLineId: "",
  liveChatMessages: [],
  liveViewerCount: 0,
  liveViewerTimer: null,
  endingId: null,
  selectedZone: null,
  hoverZone: null,
  hoverTarget: null,
  dialogueLayout: null,
  dragging: false,
  locked: false,
  pointerId: null,
  dragOffsetX: 0,
  dragOffsetY: 0,
  sound: true,
  audioContext: null,
  bgm: {
    activeSlot: 0,
    activeTrackId: "",
    desiredTrackId: "",
    pendingTrackId: "",
    desiredGain: 0,
    fadeTimer: null,
    transitionToken: 0,
    started: false,
  },
  overlayAction: null,
  toastTimer: null,
  pageToken: 0,
  pageLoads: new Map(),
  hasSave: false,
  titleReady: false,
  titleStarting: false,
  debugMode: false,
};

function assetUrl(id) {
  const asset = state.assets.get(id);
  return asset ? `${PLAYABLE_ROOT}${asset.path}` : "";
}

function pageUrl(id) {
  const asset = state.pageAssets.get(id);
  return asset ? `${PAGE_ROOT}${asset.path}` : "";
}

function audioTrack(trackId) {
  const tracks = state.audio?.tracks;
  if (Array.isArray(tracks)) return tracks.find((track) => track?.id === trackId) ?? null;
  return tracks?.[trackId] ?? null;
}

function audioBinding(chapterId, endingId = null) {
  const bindings = state.audio?.bindings ?? state.audio ?? {};
  if (endingId) return bindings.endings?.[endingId] ?? null;
  return bindings.chapters?.[chapterId] ?? null;
}

function normalizeAudioBinding(binding) {
  if (typeof binding === "string") return { track: binding };
  return binding && typeof binding === "object" ? binding : null;
}

function bgmSlot(index) {
  return index === 0 ? dom.bgmA : dom.bgmB;
}

function bgmGain(binding, track) {
  return Math.min(1, Math.max(0, Number(binding?.gain ?? track?.gain ?? track?.defaultGain ?? 0.1)));
}

function clearBgmFade() {
  if (state.bgm.fadeTimer) {
    window.clearInterval(state.bgm.fadeTimer);
    state.bgm.fadeTimer = null;
  }
}

function stopBgmSlots() {
  clearBgmFade();
  state.bgm.pendingTrackId = "";
  for (let index = 0; index < 2; index += 1) {
    const slot = bgmSlot(index);
    slot.pause();
    slot.volume = 0;
  }
}

function transitionBgm(trackId, gain) {
  const track = audioTrack(trackId);
  if (!track || typeof track.path !== "string") return;
  const current = bgmSlot(state.bgm.activeSlot);
  const nextIndex = state.bgm.activeSlot === 0 ? 1 : 0;
  const next = bgmSlot(nextIndex);
  const token = ++state.bgm.transitionToken;
  const currentVolume = current.src ? current.volume : 0;

  clearBgmFade();
  state.bgm.pendingTrackId = trackId;
  next.pause();
  next.src = `${AUDIO_ROOT}${track.path}`;
  next.loop = track.loop !== false;
  next.currentTime = 0;
  next.volume = 0;

  const playPromise = next.play();
  if (playPromise?.catch) {
    playPromise.catch(() => {
      state.bgm.started = false;
      state.bgm.pendingTrackId = "";
    });
  }

  const startedAt = performance.now();
  state.bgm.fadeTimer = window.setInterval(() => {
    if (token !== state.bgm.transitionToken) {
      clearBgmFade();
      return;
    }
    const progress = Math.min(1, (performance.now() - startedAt) / BGM_FADE_MS);
    const eased = progress * progress * (3 - 2 * progress);
    current.volume = currentVolume * (1 - eased);
    next.volume = gain * eased;
    if (progress >= 1) {
      clearBgmFade();
      current.pause();
      current.volume = 0;
      state.bgm.activeSlot = nextIndex;
      state.bgm.activeTrackId = trackId;
      state.bgm.pendingTrackId = "";
    }
  }, 16);
}

function syncBgmForLocation(chapter = currentChapter(), endingId = null) {
  const rawBinding = endingId
    ? state.audio?.endings?.[endingId]
    : state.audio?.chapters?.[chapter?.id] ?? audioBinding(chapter?.id);
  const binding = normalizeAudioBinding(rawBinding);
  const trackId = binding?.track ?? state.audio?.title ?? "";
  const track = audioTrack(trackId);
  if (!track) return;

  state.bgm.desiredTrackId = trackId;
  state.bgm.desiredGain = bgmGain(binding, track);
  if (!state.sound || !state.bgm.started) return;
  if (state.bgm.pendingTrackId === trackId) return;
  if (!state.bgm.pendingTrackId && state.bgm.activeTrackId === trackId && bgmSlot(state.bgm.activeSlot).src) {
    const activeSlot = bgmSlot(state.bgm.activeSlot);
    activeSlot.volume = state.bgm.desiredGain;
    const playPromise = activeSlot.play();
    if (playPromise?.catch) playPromise.catch(() => { state.bgm.started = false; });
    return;
  }
  transitionBgm(trackId, state.bgm.desiredGain);
}

function startBgm() {
  if (!state.sound || !state.audio) return;
  state.bgm.started = true;
  syncBgmForLocation(state.endingId ? null : currentChapter(), state.endingId);
}

function toggleSound() {
  state.sound = !state.sound;
  dom.soundButton.textContent = state.sound ? "◌" : "·";
  dom.soundButton.setAttribute("aria-label", state.sound ? "关闭提示音和配乐" : "打开提示音和配乐");
  dom.soundButton.setAttribute("title", state.sound ? "关闭提示音和配乐" : "打开提示音和配乐");
  if (state.sound) {
    ping("snap");
    startBgm();
  } else {
    state.bgm.started = false;
    stopBgmSlots();
  }
}

function currentChapter() {
  return state.chapters[state.chapterIndex];
}

function currentLine() {
  return currentChapter()?.lines?.[state.lineIndex] ?? null;
}

function chapterDefaultPage(chapter) {
  return state.pages?.pageBindings?.[chapter?.id]?.default ?? null;
}

function normalizeEatLog(raw, fallbackChapterId = "L0") {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (typeof entry === "string" && entry.trim()) return { chapterId: fallbackChapterId, text: entry };
      if (!entry || typeof entry !== "object" || typeof entry.text !== "string" || !entry.text.trim()) return null;
      return {
        chapterId: typeof entry.chapterId === "string" && entry.chapterId ? entry.chapterId : fallbackChapterId,
        text: entry.text,
      };
    })
    .filter(Boolean);
}

function normalizeMemoryByChapter(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return Object.fromEntries(Object.entries(raw).map(([chapterId, fragments]) => [
    chapterId,
    Array.isArray(fragments) ? fragments.filter((fragment) => typeof fragment === "string" && fragment.trim()) : [],
  ]));
}

function normalizeMemoryDraft(raw) {
  if (!raw || typeof raw !== "object" || typeof raw.chapterId !== "string" || !Array.isArray(raw.fragments)) return null;
  const fragments = raw.fragments
    .map((fragment, index) => {
      if (!fragment || typeof fragment.text !== "string" || !fragment.text.trim()) return null;
      return { id: typeof fragment.id === "string" && fragment.id ? fragment.id : `${raw.chapterId}-${index}`, text: fragment.text };
    })
    .filter(Boolean);
  const ids = new Set(fragments.map((fragment) => fragment.id));
  const order = Array.isArray(raw.order) ? raw.order.filter((id) => typeof id === "string" && ids.has(id)) : [];
  return { chapterId: raw.chapterId, fragments, order: [...new Set(order)] };
}

function memoryFragmentsForChapter(chapterId) {
  return state.eatLog
    .filter((entry) => entry.chapterId === chapterId)
    .map((entry, index) => ({ id: `${chapterId}-${index}`, text: entry.text }));
}

function memoryDraftMatches(draft, chapterId, fragments) {
  if (!draft || draft.chapterId !== chapterId || !Array.isArray(draft.fragments)) return false;
  return draft.fragments.length === fragments.length
    && draft.fragments.every((fragment, index) => fragment?.id === fragments[index].id && fragment?.text === fragments[index].text);
}

function renderMemoryEcho(chapter, line) {
  const previousChapter = state.chapters[state.chapterIndex - 1];
  const fragments = previousChapter ? state.memoryByChapter[previousChapter.id] : null;
  const isFirstLine = line?.id === chapter?.lines?.[0]?.id;
  if (!isFirstLine || !fragments?.length) {
    dom.memoryEcho.textContent = "";
    dom.memoryEcho.classList.add("is-hidden");
    return;
  }
  dom.memoryEcho.textContent = fragments.join(" · ");
  dom.memoryEcho.classList.remove("is-hidden");
}

function updateLiveChatTrack(restart = true) {
  const fragment = document.createDocumentFragment();
  const scrollingMessages = [...state.liveChatMessages, ...state.liveChatMessages];
  for (const message of scrollingMessages) {
    const item = document.createElement("div");
    item.className = "live-chat-item";
    item.textContent = message;
    fragment.append(item);
  }
  dom.liveChatTrack.replaceChildren(fragment);
  if (!restart) return;
  dom.liveChatTrack.classList.remove("is-scrolling");
  void dom.liveChatTrack.offsetWidth;
  dom.liveChatTrack.classList.add("is-scrolling");
}

function startLiveViewerCounter(lineId) {
  window.clearInterval(state.liveViewerTimer);
  state.liveViewerCount = LIVE_VIEWERS[lineId] ?? 1204;
  dom.liveChatViewers.textContent = `观众 ${state.liveViewerCount.toLocaleString("zh-CN")}`;
  const changes = [7, 4, -3, 11, -5, 6, -2, 9, -7, 3];
  let tick = 0;
  state.liveViewerTimer = window.setInterval(() => {
    if (!LIVE_CHAPTER_IDS.has(currentChapter()?.id) || dom.liveChat.classList.contains("is-hidden")) {
      window.clearInterval(state.liveViewerTimer);
      state.liveViewerTimer = null;
      return;
    }
    state.liveViewerCount = Math.max(0, state.liveViewerCount + changes[tick % changes.length]);
    dom.liveChatViewers.textContent = `观众 ${state.liveViewerCount.toLocaleString("zh-CN")}`;
    tick += 1;
  }, 1800);
}

function renderLiveChat(chapter, line) {
  if (!LIVE_CHAPTER_IDS.has(chapter?.id) || !line) {
    hideLiveChat();
    return;
  }
  const messages = LIVE_CHAT_COPY[line.id] ?? ["直播中", "有人吗", "听得见吗"];
  state.liveChatLineId = line.id;
  state.liveChatMessages = [...messages];
  startLiveViewerCounter(line.id);
  dom.liveChat.classList.remove("is-hidden");
  updateLiveChatTrack();
}

function appendLiveChat(message) {
  if (!LIVE_CHAPTER_IDS.has(currentChapter()?.id) || !message) return;
  state.liveChatMessages = [...state.liveChatMessages.slice(-7), message];
  updateLiveChatTrack();
}

function hideLiveChat() {
  window.clearInterval(state.liveViewerTimer);
  dom.liveChat.classList.add("is-hidden");
  dom.liveChatTrack.replaceChildren();
  dom.liveChatTrack.classList.remove("is-scrolling");
  state.liveChatLineId = "";
  state.liveChatMessages = [];
  state.liveViewerCount = 0;
  state.liveViewerTimer = null;
}

function showToast(text, duration = 2100) {
  clearTimeout(state.toastTimer);
  dom.toast.textContent = text;
  dom.toast.classList.add("is-visible");
  state.toastTimer = window.setTimeout(() => dom.toast.classList.remove("is-visible"), duration);
}

function pageForLine(chapter, line) {
  const binding = state.pages?.pageBindings?.[chapter?.id];
  return binding?.lines?.[line?.id] ?? binding?.default ?? null;
}

function loadPageImage(pageId, src) {
  const existing = state.pageLoads.get(pageId);
  if (existing) return existing;
  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`场景页加载失败: ${pageId}`));
    image.src = src;
  }).catch((error) => {
    state.pageLoads.delete(pageId);
    throw error;
  });
  state.pageLoads.set(pageId, promise);
  return promise;
}

async function setScenePage(pageId, animate = true) {
  const src = pageUrl(pageId);
  if (!src) throw new Error(`场景页资产不存在: ${pageId}`);
  if (dom.scenePage.dataset.asset === pageId && dom.scenePage.classList.contains("is-visible")) return true;

  const token = ++state.pageToken;
  const previousPageId = dom.scenePage.dataset.asset || "";
  const previousSrc = dom.scenePage.getAttribute("src") || "";

  try {
    await loadPageImage(pageId, src);
    if (token !== state.pageToken) return false;
    dom.scenePage.src = src;
    dom.scenePage.dataset.asset = pageId;
    dom.stage.dataset.page = pageId;
    dom.scenePage.classList.remove("is-turning");
    dom.scenePage.classList.add("is-visible");
    void dom.scenePage.offsetWidth;
    if (animate) {
      dom.scenePage.classList.add("is-turning");
      window.setTimeout(() => {
        if (token === state.pageToken) dom.scenePage.classList.remove("is-turning");
      }, 720);
    }
    return true;
  } catch (error) {
    if (token !== state.pageToken) return false;
    console.error(error);
    // Never commit a failed page ID. Keeping the last committed source avoids
    // a transparent scene during a transient network or decode failure.
    dom.scenePage.dataset.asset = previousPageId;
    dom.stage.dataset.page = previousPageId;
    if (previousSrc) {
      dom.scenePage.src = previousSrc;
      dom.scenePage.classList.add("is-visible");
      showToast(`场景页 ${pageId} 暂时无法载入，已保留上一页。`, 2600);
      return false;
    }
    dom.scenePage.classList.remove("is-visible", "is-turning");
    throw error;
  }
}

function setScene(chapter, line = currentLine(), animate = false) {
  const meta = SCENE_META[chapter?.id] ?? SCENE_META.L0;
  dom.stage.dataset.chapter = chapter?.id ?? "L0";
  dom.statusCopy.textContent = meta.status;
  dom.sceneCaption.textContent = meta.caption;
  dom.statusFill.style.width = `${Math.max(18, ((state.chapterIndex + 1) / state.chapters.length) * 100)}%`;
  syncBgmForLocation(chapter);
  if (line) setScenePage(pageForLine(chapter, line), animate);
}

function buildDialogue(raw, zones) {
  const locate = (zone) => {
    if (Number.isInteger(zone.start)) return zone.start;
    const occurrence = Math.max(1, Number(zone.occurrence) || 1);
    let from = 0;
    let start = -1;
    for (let count = 0; count < occurrence; count += 1) {
      start = raw.indexOf(zone.text, from);
      if (start < 0) break;
      from = start + zone.text.length;
    }
    return start;
  };
  const intervals = zones
    .map((zone, index) => {
      const start = locate(zone);
      return { zone, index, start, end: start < 0 ? -1 : start + zone.text.length };
    })
    .filter((item) => item.start >= 0 && item.end > item.start && item.end <= raw.length);
  if (intervals.length !== zones.length) {
    throw new Error("台词遮挡区无法定位到原句");
  }

  dom.dialogueText.replaceChildren(document.createTextNode(raw));
  state.dialogueLayout = { intervals };
  layoutDialogueZones();
}

function layoutDialogueZones() {
  const layout = state.dialogueLayout;
  const textNode = dom.dialogueText.firstChild;
  if (!layout || !textNode || !dom.dialogueZones) return;

  clearNearestZone();
  const hostRect = dom.dialogueContent.getBoundingClientRect();
  const fragment = document.createDocumentFragment();
  for (const item of layout.intervals) {
    const range = document.createRange();
    range.setStart(textNode, item.start);
    range.setEnd(textNode, item.end);
    const rects = [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0);
    if (!rects.length) throw new Error(`台词遮挡区 ${item.index + 1} 没有可见位置`);
    rects.forEach((rect, rectIndex) => {
      const hit = document.createElement("span");
      hit.className = "zone";
      hit.dataset.zoneIndex = String(item.index);
      hit.dataset.zoneRect = String(rectIndex);
      Object.assign(hit.style, {
        left: `${rect.left - hostRect.left}px`,
        top: `${rect.top - hostRect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
      hit.addEventListener("pointerenter", () => {
        if (!state.dragging && !state.locked) setNearestZone(item.index, hit);
      });
      hit.addEventListener("pointerleave", () => {
        if (!state.dragging && state.hoverTarget === hit) clearNearestZone();
      });
      fragment.append(hit);
    });
  }
  dom.dialogueZones.replaceChildren(fragment);
}

function setBarSource(mode) {
  const source = {
    hover: "UI_bar_hover",
    active: "UI_bar_active",
    snap: "UI_bar_snap",
    locked: "UI_bar_locked",
    cracked: "UI_bar_cracked",
  }[mode] ?? "UI_bar_hover";
  const src = assetUrl(source);
  if (src) dom.blackBar.src = src;
  dom.blackBar.classList.toggle("bar-hover", mode === "hover");
  dom.blackBar.classList.toggle("bar-active", mode === "active");
  dom.blackBar.classList.toggle("bar-snap", mode === "snap");
  dom.blackBar.classList.toggle("bar-locked", mode === "locked");
  dom.blackBar.classList.toggle("bar-cracked", mode === "cracked");
}

function renderLine() {
  const chapter = currentChapter();
  const line = currentLine();
  if (!chapter || !line) {
    finishChapter();
    return;
  }
  state.selectedZone = null;
  state.hoverZone = null;
  state.hoverTarget = null;
  state.locked = false;
  dom.blackBar.classList.remove("is-locked", "bar-active", "bar-snap", "bar-locked", "bar-cracked");
  const cracked = manifestLayerIds("bar_cracked", line.id)?.length;
  const locked = manifestLayerIds("bar_locked", line.id)?.length;
  setBarSource(cracked ? "cracked" : locked ? "locked" : "hover");
  dom.blackBar.style.width = "min(34vw, 400px)";
  dom.chapterKicker.textContent = `${chapter.id} · ${chapter.title}`;
  dom.chapterTitle.textContent = SCENE_META[chapter.id]?.readout ?? chapter.title;
  dom.speakerName.textContent = "她";
  dom.lineId.textContent = line.id;
  dom.zoneCount.textContent = String(line.zones.length).padStart(2, "0");
  dom.feedbackCopy.textContent = state.chapterIndex === 0 ? "黑条在句子外等着。" : "她还没有把这句话说完。";
  renderMemoryEcho(chapter, line);
  renderLiveChat(chapter, line);
  buildDialogue(line.raw, line.zones);
  setScene(chapter, line, true);
  clearNearestZone();
  window.requestAnimationFrame(positionBarAtRest);
  triggerManifestEvent("zone_hint", undefined, 420);
}

function setBarCenter(x, y) {
  const stageRect = dom.stage.getBoundingClientRect();
  const halfWidth = dom.blackBar.getBoundingClientRect().width / 2;
  const halfHeight = dom.blackBar.getBoundingClientRect().height / 2;
  const minX = stageRect.left + halfWidth + 12;
  const maxX = stageRect.right - halfWidth - 12;
  const minY = Math.max(stageRect.top + halfHeight + 12, 92);
  const maxY = stageRect.bottom - halfHeight - 12;
  const safeX = Math.min(maxX, Math.max(minX, x));
  const safeY = Math.min(maxY, Math.max(minY, y));
  dom.blackBar.style.left = `${safeX}px`;
  dom.blackBar.style.top = `${safeY}px`;
  return { x: safeX, y: safeY };
}

function positionBarAtRest() {
  if (state.dragging || state.locked) return;
  setBarCenter(window.innerWidth * 0.62, Math.min(window.innerHeight * 0.44, window.innerHeight - 330));
}

function getZones() {
  return [...dom.dialogueZones.querySelectorAll(".zone")];
}

function nearestZone(x, y) {
  let nearest = null;
  for (const zone of getZones()) {
    const rect = zone.getBoundingClientRect();
    const distance = Math.hypot(rect.left + rect.width / 2 - x, rect.top + rect.height / 2 - y);
    const index = Number(zone.dataset.zoneIndex);
    if (!nearest || distance < nearest.distance) nearest = { index, distance, rect, element: zone };
  }
  return nearest;
}

function setNearestZone(index, element = null) {
  clearNearestZone();
  const zones = getZones().filter((zone) => Number(zone.dataset.zoneIndex) === index);
  const zone = element && zones.includes(element) ? element : zones[0];
  if (!zone) return;
  zones.forEach((item) => item.classList.add("is-nearest"));
  state.hoverZone = index;
  state.hoverTarget = zone;
  const rect = zone.getBoundingClientRect();
  dom.zoneHalo.style.left = `${rect.left + rect.width / 2}px`;
  dom.zoneHalo.style.top = `${rect.top + rect.height / 2}px`;
  dom.zoneHalo.style.width = `${Math.max(rect.width + 18, 54)}px`;
  dom.zoneHalo.style.height = `${Math.max(rect.height + 14, 38)}px`;
  dom.zoneHalo.classList.add("is-visible");
}

function clearNearestZone() {
  for (const zone of getZones()) zone.classList.remove("is-nearest");
  state.hoverZone = null;
  state.hoverTarget = null;
  dom.zoneHalo.classList.remove("is-visible");
}

function isReachableZone(target) {
  return Boolean(target && target.distance < Math.max(150, target.rect.width * 0.86));
}

function updateDragTarget(clientX, clientY) {
  const nearest = nearestZone(clientX, clientY);
  if (!nearest) return;
  if (isReachableZone(nearest)) {
    setNearestZone(nearest.index, nearest.element);
    dom.blackBar.style.width = `${Math.min(520, Math.max(88, nearest.rect.width + 22))}px`;
  } else {
    clearNearestZone();
    dom.blackBar.style.width = "min(34vw, 400px)";
  }
}

function onPointerDown(event) {
  if (state.locked || event.button > 0) return;
  event.preventDefault();
  const rect = dom.blackBar.getBoundingClientRect();
  state.dragging = true;
  state.pointerId = event.pointerId;
  state.dragOffsetX = event.clientX - (rect.left + rect.width / 2);
  state.dragOffsetY = event.clientY - (rect.top + rect.height / 2);
  dom.blackBar.setPointerCapture(event.pointerId);
  setBarSource("active");
  updateDragTarget(event.clientX, event.clientY);
  ping("pick");
}

function onPointerMove(event) {
  if (!state.dragging || event.pointerId !== state.pointerId) return;
  event.preventDefault();
  const x = event.clientX - state.dragOffsetX;
  const y = event.clientY - state.dragOffsetY;
  const center = setBarCenter(x, y);
  updateDragTarget(center.x, center.y);
}

function onPointerUp(event) {
  if (!state.dragging || event.pointerId !== state.pointerId) return;
  state.dragging = false;
  state.pointerId = null;
  if (dom.blackBar.hasPointerCapture(event.pointerId)) dom.blackBar.releasePointerCapture(event.pointerId);
  const rect = dom.blackBar.getBoundingClientRect();
  const target = nearestZone(rect.left + rect.width / 2, rect.top + rect.height / 2);
  if (!isReachableZone(target)) {
    clearNearestZone();
    setBarSource("hover");
    dom.blackBar.style.width = "min(34vw, 400px)";
    positionBarAtRest();
    showToast("黑条没有找到可以吞下的句子。", 1500);
    ping("reject");
    return;
  }
  snapToZone(target.index, target.element);
}

function snapToZone(index, targetElement = null) {
  const zone = targetElement ?? getZones().find((item) => Number(item.dataset.zoneIndex) === index);
  if (!zone || state.locked) return;
  const rect = zone.getBoundingClientRect();
  state.selectedZone = index;
  setNearestZone(index, zone);
  dom.blackBar.style.width = `${Math.min(520, Math.max(88, rect.width + 22))}px`;
  setBarSource("snap");
  setBarCenter(rect.left + rect.width / 2, rect.top + rect.height / 2);
  state.locked = true;
  dom.blackBar.classList.add("is-locked");
  ping("snap");
  triggerManifestEvent("bar_snap", index);
  window.setTimeout(() => applySelection(index), 260);
}

function applyFlags(flags = []) {
  for (const flag of flags) {
    const match = /^([a-z_]+)([+-])$/.exec(flag);
    if (!match) continue;
    const [, name, operator] = match;
    state.flags[name] = Math.max(0, (state.flags[name] ?? 0) + (operator === "+" ? 1 : -1));
  }
}

function applySelection(index) {
  const line = currentLine();
  const zone = line?.zones?.[index];
  if (!line || !zone) return;
  getZones()
    .filter((item) => Number(item.dataset.zoneIndex) === index)
    .forEach((item) => item.classList.add("is-eaten"));
  applyFlags(zone.flags);
  state.eatLog.push({ chapterId: currentChapter().id, text: zone.eat || zone.text });
  dom.feedbackCopy.textContent = zone.npc || "字在黑条下安静下来。";
  dom.statusCopy.textContent = zone.eat ? `已吞下「${zone.eat}」。` : "字被收进了黑条里。";
  appendLiveChat(zone.npc || "字被收进去了");
  showToast(zone.npc || "字被吃掉了。", 2500);
  triggerFeedback("snap", index);
  triggerManifestEvent("censor_absorb", index);
  triggerManifestEvent("dialogue_refresh", index, 620);
  if (zone.flags?.some((flag) => flag.startsWith("risk"))) triggerFeedback("reject", index, 120);
  triggerManifestEvent("bar_reject", index, 120);
  saveState();
  window.setTimeout(() => finishLine(zone), 1060);
}

function fxPosition(index) {
  const zone = index === undefined
    ? null
    : state.hoverTarget && Number(state.hoverTarget.dataset.zoneIndex) === index
      ? state.hoverTarget
      : getZones().find((item) => Number(item.dataset.zoneIndex) === index);
  if (!zone) return { left: "50%", top: "46%" };
  const rect = zone.getBoundingClientRect();
  return { left: `${rect.left + rect.width / 2}px`, top: `${rect.top + rect.height / 2}px` };
}

function triggerFeedback(kind, index, delay = 0, assetIds = null) {
  const map = {
    hint: ["FX_zone_hint"],
    snap: ["FX_zone_snap_pulse"],
    absorb: ["FX_censor_absorb", "FX_text_fragment_burst"],
    refresh: ["FX_dialog_refresh_glitch"],
    reject: ["FX_bar_reject_shiver"],
  };
  const schedule = () => {
    for (const id of assetIds ?? map[kind] ?? []) {
      const src = assetUrl(id);
      if (!src) continue;
      const sprite = document.createElement("img");
      sprite.className = `fx-sprite ${kind === "absorb" ? "is-ink" : ""}`;
      sprite.src = src;
      sprite.alt = "";
      const position = fxPosition(index);
      Object.assign(sprite.style, position);
      sprite.style.transform = "translate(-50%, -50%)";
      sprite.style.width = id.includes("burst") ? "min(34vw, 440px)" : "min(62vw, 980px)";
      sprite.style.height = "auto";
      dom.fxLayer.append(sprite);
      window.setTimeout(() => sprite.remove(), 950);
    }
  };
  if (delay) window.setTimeout(schedule, delay); else schedule();
}

function manifestLayerIds(name, lineId) {
  const binding = state.playable?.interactiveBindings?.[currentChapter()?.id];
  const entry = binding?.events?.[name] ?? binding?.states?.[name];
  if (!entry || entry.trigger !== lineId) return null;
  return (entry.layers ?? []).map((layer) => layer?.asset).filter((id) => id && state.assets.has(id));
}

function triggerManifestEvent(name, index, delay = 0) {
  const ids = manifestLayerIds(name, currentLine()?.id);
  if (!ids?.length) return false;
  const kind = {
    zone_hint: "hint",
    bar_snap: "snap",
    censor_absorb: "absorb",
    dialogue_refresh: "refresh",
    bar_reject: "reject",
  }[name];
  if (!kind) return false;
  triggerFeedback(kind, index, delay, ids);
  return true;
}

function finishLine(zone) {
  const line = currentLine();
  if (!line || !zone) return;
  if (line.is_ending) {
    finishEnding(zone.ending ?? "A_separate");
    return;
  }
  state.lineIndex += 1;
  saveState();
  if (state.lineIndex >= currentChapter().lines.length) {
    finishChapter();
    return;
  }
  window.setTimeout(renderLine, 360);
}

function chapterResult(chapter) {
  if (chapter.id === "L1") {
    const pass = state.flags.pass ?? 0;
    const fail = state.flags.fail ?? 0;
    return pass >= 4 && fail < 2 ? "pass" : "fail";
  }
  return "pass";
}

function memoryFragmentById(id) {
  return state.memoryDraft?.fragments?.find((fragment) => fragment.id === id) ?? null;
}

function setMemoryOrder(nextOrder) {
  if (!state.memoryDraft) return;
  const validIds = new Set(state.memoryDraft.fragments.map((fragment) => fragment.id));
  const seen = new Set();
  state.memoryDraft.order = nextOrder.filter((id) => validIds.has(id) && !seen.has(id) && seen.add(id));
}

function moveMemoryFragment(id, beforeId = null) {
  if (!state.memoryDraft || !memoryFragmentById(id)) return;
  const order = state.memoryDraft.order.filter((item) => item !== id);
  const targetIndex = beforeId ? order.indexOf(beforeId) : -1;
  if (targetIndex >= 0) order.splice(targetIndex, 0, id);
  else order.push(id);
  setMemoryOrder(order);
  renderMemoryDraft();
  saveState();
}

function removeMemoryFragment(id) {
  if (!state.memoryDraft) return;
  setMemoryOrder(state.memoryDraft.order.filter((item) => item !== id));
  renderMemoryDraft();
  saveState();
}

function toggleMemoryFragment(id) {
  if (!state.memoryDraft) return;
  if (state.memoryDraft.order.includes(id)) removeMemoryFragment(id);
  else moveMemoryFragment(id);
}

function createMemoryFragment(fragment) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "memory-fragment";
  chip.dataset.memoryId = fragment.id;
  chip.textContent = fragment.text;
  chip.setAttribute("aria-label", fragment.text);
  chip.addEventListener("pointerdown", onMemoryPointerDown);
  chip.addEventListener("click", () => {
    if (state.suppressMemoryClick) {
      state.suppressMemoryClick = false;
      return;
    }
    toggleMemoryFragment(fragment.id);
  });
  return chip;
}

function renderMemoryDraft() {
  const draft = state.memoryDraft;
  if (!draft) return;
  setMemoryOrder(draft.order);
  const fragmentMap = new Map(draft.fragments.map((fragment) => [fragment.id, fragment]));
  const orderedIds = new Set(draft.order);
  const poolFragmentNodes = draft.fragments
    .filter((fragment) => !orderedIds.has(fragment.id))
    .map(createMemoryFragment);
  const laneFragmentNodes = draft.order
    .map((id) => fragmentMap.get(id))
    .filter(Boolean)
    .map(createMemoryFragment);
  dom.memoryPool.replaceChildren(...poolFragmentNodes);
  dom.memoryLane.replaceChildren(...laneFragmentNodes);
  dom.memoryConfirm.disabled = draft.order.length !== draft.fragments.length;
  dom.memoryConfirm.setAttribute("aria-disabled", String(dom.memoryConfirm.disabled));
}

function onMemoryPointerDown(event) {
  if (event.button !== undefined && event.button > 0) return;
  const chip = event.currentTarget;
  event.preventDefault();
  state.memoryDrag = {
    id: chip.dataset.memoryId,
    source: chip.parentElement?.id ?? "",
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
    element: chip,
  };
  chip.classList.add("is-dragging");
  chip.setPointerCapture(event.pointerId);
}

function onMemoryPointerMove(event) {
  const drag = state.memoryDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
  if (distance > 6) {
    drag.moved = true;
    event.preventDefault();
  }
}

function clearMemoryDrag(event) {
  const drag = state.memoryDrag;
  if (!drag) return null;
  drag.element?.classList.remove("is-dragging");
  if (event && drag.element?.hasPointerCapture?.(event.pointerId)) {
    drag.element.releasePointerCapture(event.pointerId);
  }
  state.memoryDrag = null;
  return drag;
}

function onMemoryPointerUp(event) {
  const drag = state.memoryDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  const targetElement = document.elementFromPoint(event.clientX, event.clientY);
  const targetFragment = targetElement?.closest?.(".memory-fragment");
  const targetLane = targetElement?.closest?.("#memory-lane");
  const targetPool = targetElement?.closest?.("#memory-pool");
  const targetId = targetFragment?.dataset.memoryId ?? null;
  if (drag.moved) {
    if (targetLane) moveMemoryFragment(drag.id, targetId);
    else if (drag.source === "memory-lane" && targetPool) removeMemoryFragment(drag.id);
    state.suppressMemoryClick = true;
    window.setTimeout(() => { state.suppressMemoryClick = false; }, 0);
  }
  clearMemoryDrag(event);
}

function onMemoryPointerCancel(event) {
  clearMemoryDrag(event);
}

function openMemoryOverlay(chapter) {
  if (!chapter || !MEMORY_CHAPTER_IDS.has(chapter.id)) {
    nextChapter();
    return;
  }
  const fragments = memoryFragmentsForChapter(chapter.id);
  if (!fragments.length) {
    state.memoryByChapter[chapter.id] = [];
    state.memoryDraft = null;
    saveState();
    nextChapter();
    return;
  }
  if (!memoryDraftMatches(state.memoryDraft, chapter.id, fragments)) {
    state.memoryDraft = { chapterId: chapter.id, fragments, order: [] };
  }
  hideOverlay();
  state.locked = true;
  dom.memoryEyebrow.textContent = `${chapter.id} · 语言胃`;
  dom.memoryTitle.textContent = "你吞下的字还没有沉下去";
  dom.memoryCopy.textContent = "把它们收拢成一句只留给自己的私语。";
  renderMemoryDraft();
  dom.memoryOverlay.classList.remove("is-hidden");
  saveState();
}

function hideMemoryOverlay() {
  dom.memoryOverlay.classList.add("is-hidden");
  state.memoryDrag = null;
  state.suppressMemoryClick = false;
}

function confirmMemory() {
  const draft = state.memoryDraft;
  if (!draft || draft.order.length !== draft.fragments.length) return;
  const fragments = new Map(draft.fragments.map((fragment) => [fragment.id, fragment.text]));
  state.memoryByChapter[draft.chapterId] = draft.order.map((id) => fragments.get(id)).filter(Boolean);
  state.memoryDraft = null;
  ping("snap");
  saveState();
  hideMemoryOverlay();
  nextChapter();
}

function finishChapter() {
  const chapter = currentChapter();
  if (LIVE_CHAPTER_IDS.has(chapter?.id)) hideLiveChat();
  if (chapter.id === "L1" && chapterResult(chapter) === "fail") {
    showOverlay("面试结束", "她没有被录用。", "把这一章重新说一遍", () => restartChapter(), "重试面试");
    return;
  }
  if (state.chapterIndex >= state.chapters.length - 1) return;
  const titles = {
    L0: ["第一口字", "她第一次把不能说的话交给你。"],
    L1: ["面试结束", "她走出会议室，黑条没有离开。"],
    L2: ["直播结束", "屏幕熄灭以后，那句‘有你在’还亮着。"],
    L3: ["门重新合上", "朋友没有问完，你也没有回答完。"],
    L4: ["道歉结束", "刚才有一条，不是她拖的。"],
  };
  const [title, copy] = titles[chapter.id] ?? ["下一段", "她还在等下一句。"];
  const action = MEMORY_CHAPTER_IDS.has(chapter.id) ? () => openMemoryOverlay(chapter) : () => nextChapter();
  showOverlay("段落结束", title, copy, action);
}

function nextChapter() {
  hideOverlay();
  hideMemoryOverlay();
  state.endingId = null;
  state.chapterIndex += 1;
  state.lineIndex = 0;
  state.selectedZone = null;
  state.locked = false;
  saveState();
  setScene(currentChapter(), currentLine(), true);
  renderLine();
}

function restartChapter() {
  hideOverlay();
  hideMemoryOverlay();
  const chapter = currentChapter();
  state.eatLog = state.eatLog.filter((entry) => entry.chapterId !== chapter?.id);
  if (chapter?.id) delete state.memoryByChapter[chapter.id];
  state.memoryDraft = null;
  state.endingId = null;
  state.lineIndex = 0;
  state.flags.pass = 0;
  state.flags.fail = 0;
  state.locked = false;
  state.selectedZone = null;
  saveState();
  setScene(currentChapter(), currentLine(), true);
  renderLine();
}

async function finishEnding(endingId) {
  const pageId = state.pages?.endingPages?.[endingId];
  if (!pageId) throw new Error(`结局页面不存在: ${endingId}`);
  const loaded = await setScenePage(pageId, true);
  if (!loaded) return false;
  dom.stage.dataset.ending = endingId;
  state.endingId = endingId;
  state.locked = true;
  syncBgmForLocation(null, endingId);
  saveState();
  const titles = {
    A_separate: "她把手收了回去",
    B_alienate: "留下的不是‘我’",
    C_consume: "请求空壳",
    C_cold: "身份被抹去",
  };
  const endingCopy = state.data.endings?.[endingId] ?? "她取回了自己的声音。";
  showOverlay(`结局 · ${endingId}`, titles[endingId] ?? "最后一句", endingCopy, () => restartGame(), "重新开始");
  return true;
}

function showOverlay(eyebrow, title, copy, action, actionLabel = "继续") {
  state.overlayAction = action;
  dom.overlayEyebrow.textContent = eyebrow;
  dom.overlayTitle.textContent = title;
  dom.overlayCopy.textContent = copy;
  dom.overlayAction.textContent = actionLabel;
  dom.overlay.classList.remove("is-hidden");
}

function hideOverlay() {
  dom.overlay.classList.add("is-hidden");
  state.overlayAction = null;
}

function resetRun() {
  localStorage.removeItem(SAVE_KEY);
  state.chapterIndex = 0;
  state.lineIndex = 0;
  state.flags = {};
  state.eatLog = [];
  state.memoryByChapter = {};
  state.memoryDraft = null;
  state.endingId = null;
  state.hasSave = false;
  state.locked = false;
  state.selectedZone = null;
  state.hoverZone = null;
  state.hoverTarget = null;
  delete dom.stage.dataset.ending;
}

function restartGame() {
  resetRun();
  hideOverlay();
  hideMemoryOverlay();
  setScene(currentChapter(), currentLine(), true);
  renderLine();
}

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      chapterIndex: state.chapterIndex,
      lineIndex: state.lineIndex,
      flags: state.flags,
      eatLog: state.eatLog,
      memoryByChapter: state.memoryByChapter,
      memoryDraft: state.memoryDraft,
      endingId: state.endingId,
    }));
    state.hasSave = true;
  } catch (error) {
    console.warn("save unavailable", error);
  }
}

function restoreState() {
  state.hasSave = false;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return;
    state.hasSave = true;
    state.chapterIndex = Math.min(Number(saved.chapterIndex) || 0, state.chapters.length - 1);
    state.lineIndex = Math.max(0, Number(saved.lineIndex) || 0);
    const lines = state.chapters[state.chapterIndex]?.lines ?? [];
    if (state.lineIndex > lines.length) state.lineIndex = lines.length;
    state.flags = saved.flags && typeof saved.flags === "object" ? saved.flags : {};
    state.eatLog = normalizeEatLog(saved.eatLog, state.chapters[state.chapterIndex]?.id ?? "L0");
    state.memoryByChapter = normalizeMemoryByChapter(saved.memoryByChapter);
    state.memoryDraft = normalizeMemoryDraft(saved.memoryDraft);
    state.endingId = typeof saved.endingId === "string" ? saved.endingId : null;
  } catch (error) {
    localStorage.removeItem(SAVE_KEY);
  }
}

function hasDebugLocation() {
  const params = new URLSearchParams(window.location.search);
  return ["chapter", "line", "ending"].some((key) => params.has(key));
}

function configureTitleScreen() {
  const hasSave = state.hasSave;
  dom.app.classList.add("is-title-screen");
  dom.titleScreen.classList.remove("is-hidden", "is-leaving");
  dom.titleScreen.setAttribute("aria-hidden", "false");
  dom.titleScreen.setAttribute("aria-busy", "false");
  dom.titleScreen.inert = false;
  dom.titlePrimary.disabled = false;
  dom.titleNewGame.disabled = false;
  dom.titlePrimary.textContent = hasSave ? "继续游戏" : "开始游戏";
  dom.titleNewGame.classList.toggle("is-hidden", !hasSave);
  dom.titleStatus.textContent = hasSave ? "已有一段未完成的记录。" : "准备就绪。";
  state.titleReady = true;
}

function skipTitleScreen() {
  dom.app.classList.remove("is-title-screen");
  dom.titleScreen.classList.add("is-hidden");
  dom.titleScreen.classList.remove("is-leaving");
  dom.titleScreen.setAttribute("aria-hidden", "true");
  dom.titleScreen.setAttribute("aria-busy", "false");
  dom.titleScreen.inert = true;
  dom.titlePrimary.disabled = true;
  dom.titleNewGame.disabled = true;
  state.titleReady = false;
}

function closeTitleScreen() {
  dom.titleScreen.classList.add("is-leaving");
  dom.titleScreen.setAttribute("aria-hidden", "true");
  dom.titleScreen.inert = true;
  dom.titlePrimary.disabled = true;
  dom.titleNewGame.disabled = true;
  window.setTimeout(() => {
    dom.titleScreen.classList.add("is-hidden");
    dom.app.classList.remove("is-title-screen");
  }, 540);
}

async function startGame(mode = "continue") {
  if (!state.titleReady || state.titleStarting) return;
  state.titleStarting = true;
  dom.titlePrimary.disabled = true;
  dom.titleNewGame.disabled = true;
  if (mode === "new") resetRun();

  try {
    const endingId = mode === "continue" ? state.endingId : null;
    const pendingMemory = state.memoryDraft?.chapterId === currentChapter()?.id;
    const pageId = endingId
      ? state.pages.endingPages[endingId]
      : pageForLine(currentChapter(), currentLine()) ?? chapterDefaultPage(currentChapter());
    if (!pageId) throw new Error("当前游戏页面不存在");

    // Start from the trusted button gesture before waiting on image decoding.
    state.bgm.started = true;
    syncBgmForLocation(endingId ? null : currentChapter(), endingId);

    if (endingId) {
      await finishEnding(endingId);
    } else {
      await setScenePage(pageId, true);
      state.endingId = null;
      if (pendingMemory) {
        setScene(currentChapter(), null, false);
        openMemoryOverlay(currentChapter());
      } else {
        setScene(currentChapter(), currentLine(), false);
        renderLine();
      }
    }
    startBgm();
    closeTitleScreen();
  } catch (error) {
    console.error(error);
    state.bgm.started = false;
    stopBgmSlots();
    dom.titleStatus.textContent = "场景暂时无法载入，请重试。";
    dom.titlePrimary.disabled = false;
    dom.titleNewGame.disabled = false;
  } finally {
    state.titleStarting = false;
  }
}

function applyDebugLocation() {
  const params = new URLSearchParams(window.location.search);
  const chapterId = params.get("chapter");
  const lineId = params.get("line");
  const endingId = params.get("ending");
  if (chapterId) {
    state.endingId = null;
    const chapterIndex = state.chapters.findIndex((chapter) => chapter.id === chapterId);
    if (chapterIndex >= 0) state.chapterIndex = chapterIndex;
  }
  if (lineId) {
    state.endingId = null;
    const lineIndex = currentChapter().lines.findIndex((line) => line.id === lineId);
    if (lineIndex >= 0) state.lineIndex = lineIndex;
  }
  if (endingId && state.pages?.endingPages?.[endingId]) state.endingId = endingId;
}

function audioContext() {
  if (!state.audioContext) state.audioContext = new AudioContext();
  return state.audioContext;
}

function ping(kind) {
  if (!state.sound) return;
  try {
    const context = audioContext();
    if (context.state === "suspended") void context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = { pick: 152, snap: 218, reject: 78 }[kind] ?? 140;
    oscillator.type = kind === "reject" ? "sawtooth" : "sine";
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.16);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
  } catch (error) {
    // Browsers can block audio until a gesture; the visual loop still works.
  }
}

function bindEvents() {
  dom.blackBar.addEventListener("pointerdown", onPointerDown);
  dom.blackBar.addEventListener("pointermove", onPointerMove);
  dom.blackBar.addEventListener("pointerup", onPointerUp);
  dom.blackBar.addEventListener("pointercancel", onPointerUp);
  dom.restartButton.addEventListener("click", restartGame);
  dom.soundButton.addEventListener("click", toggleSound);
  dom.retryButton.addEventListener("click", load);
  dom.titlePrimary.addEventListener("click", () => startGame(state.hasSave ? "continue" : "new"));
  dom.titleNewGame.addEventListener("click", () => startGame("new"));
  dom.overlayAction.addEventListener("click", () => state.overlayAction?.());
  dom.memoryConfirm.addEventListener("click", confirmMemory);
  dom.memoryOverlay.addEventListener("pointermove", onMemoryPointerMove);
  dom.memoryOverlay.addEventListener("pointerup", onMemoryPointerUp);
  dom.memoryOverlay.addEventListener("pointercancel", onMemoryPointerCancel);
  document.addEventListener("pointerdown", () => {
    if (state.debugMode && !state.bgm.started) startBgm();
  }, { capture: true });
  window.addEventListener("resize", () => {
    if (state.dialogueLayout) layoutDialogueZones();
    if (!state.dragging && !state.locked) positionBarAtRest();
    if (state.hoverZone !== null) setNearestZone(state.hoverZone);
  });
  window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "r" && dom.titleScreen.classList.contains("is-hidden")) restartGame();
    if (event.key === "Escape" && !dom.memoryOverlay.classList.contains("is-hidden")) return;
    if (event.key === "Escape" && !dom.overlay.classList.contains("is-hidden")) hideOverlay();
  });
}

function validateBindings() {
  const pageBindings = state.pages.pageBindings ?? {};
  const endingPages = state.pages.endingPages ?? {};
  const endingIds = new Set(["A_separate", "B_alienate", "C_consume", "C_cold"]);
  const referencedEndings = new Set();
  const chapterIds = new Set(state.chapters.map((chapter) => chapter.id));
  if (!state.pages.coverPage || !state.pageAssets.has(state.pages.coverPage)) {
    throw new Error(`封面场景页不存在: ${state.pages.coverPage ?? ""}`);
  }
  for (const chapterId of Object.keys(pageBindings)) {
    if (!chapterIds.has(chapterId)) throw new Error(`整页绑定包含未知章节 ${chapterId}`);
  }
  for (const chapter of state.chapters) {
    const binding = pageBindings[chapter.id];
    if (!binding) throw new Error(`${chapter.id} 缺少整页绑定`);
    if (!binding.default || !state.pageAssets.has(binding.default)) {
      throw new Error(`${chapter.id} 缺少有效默认场景页`);
    }
    const lineIds = new Set((chapter.lines ?? []).map((line) => line.id));
    const lineBindings = binding.lines ?? {};
    for (const lineId of Object.keys(lineBindings)) {
      if (!lineIds.has(lineId)) throw new Error(`整页绑定包含未知台词 ${lineId}`);
    }
    for (const line of chapter.lines ?? []) {
      if (!Object.prototype.hasOwnProperty.call(lineBindings, line.id)) {
        throw new Error(`${line.id} 缺少显式整页绑定`);
      }
      const pageId = lineBindings[line.id];
      if (!pageId || !state.pageAssets.has(pageId)) throw new Error(`${line.id} 缺少场景页 ${pageId ?? ""}`);
      for (const zone of line.zones ?? []) {
        if (!line.raw.includes(zone.text)) throw new Error(`${line.id} 的遮挡区不在原句中`);
        if (zone.ending && !endingIds.has(zone.ending)) {
          throw new Error(`${line.id} 引用了未知结局 ${zone.ending}`);
        }
        if (zone.ending) referencedEndings.add(zone.ending);
      }
    }
  }
  if (Object.keys(endingPages).length !== endingIds.size || [...endingIds].some((id) => !Object.prototype.hasOwnProperty.call(endingPages, id))) {
    throw new Error("结局绑定必须包含四个结局 ID");
  }
  for (const pageId of Object.values(endingPages)) {
    if (!state.pageAssets.has(pageId)) throw new Error(`结局缺少场景页 ${pageId}`);
  }
  if (referencedEndings.size !== endingIds.size) throw new Error("章节台词没有覆盖全部结局 ID");
}

function validateAudioManifest() {
  const tracks = Array.isArray(state.audio?.tracks) ? state.audio.tracks : [];
  const trackIds = new Set(tracks.map((track) => track?.id).filter(Boolean));
  if (!tracks.length || !state.audio?.title || !trackIds.has(state.audio.title)) {
    throw new Error("配乐 manifest 缺少有效封面曲目");
  }
  for (const track of tracks) {
    if (!track.id || typeof track.path !== "string" || !track.path || !trackIds.has(track.id)) {
      throw new Error(`配乐条目无效: ${track.id ?? ""}`);
    }
  }
  for (const chapter of state.chapters) {
    const binding = normalizeAudioBinding(state.audio.chapters?.[chapter.id]);
    if (!binding?.track || !trackIds.has(binding.track)) {
      throw new Error(`${chapter.id} 缺少有效配乐绑定`);
    }
  }
  for (const endingId of ["A_separate", "B_alienate", "C_consume", "C_cold"]) {
    const binding = normalizeAudioBinding(state.audio.endings?.[endingId]);
    if (!binding?.track || !trackIds.has(binding.track)) {
      throw new Error(`${endingId} 缺少有效配乐绑定`);
    }
  }
}

function preloadPages(excludeId = "") {
  const pending = [...state.pageAssets.values()]
    .map((asset) => asset.id)
    .filter((pageId) => pageId !== excludeId);
  window.setTimeout(async () => {
    // Keep the first viewport responsive: warm one page at a time after the
    // committed page is visible instead of opening 13 large requests at once.
    for (const pageId of pending) {
      try {
        await loadPageImage(pageId, pageUrl(pageId));
      } catch (error) {
        console.warn(error.message);
      }
    }
  }, 0);
}

async function load() {
  dom.errorPanel.classList.add("is-hidden");
  dom.app.classList.add("is-loading");
  try {
    const fetchOptions = { cache: "no-store" };
    const responses = await Promise.all([
      fetch(DATA_URL, fetchOptions),
      fetch(PLAYABLE_MANIFEST_URL, fetchOptions),
      fetch(PAGE_MANIFEST_URL, fetchOptions),
      fetch(AUDIO_MANIFEST_URL, fetchOptions),
    ]);
    if (responses.some((response) => !response.ok)) throw new Error("数据文件未找到");
    state.data = await responses[0].json();
    state.playable = await responses[1].json();
    state.pages = await responses[2].json();
    state.audio = await responses[3].json();
    state.chapters = state.data.chapters ?? [];
    state.assets = new Map((state.playable.assets ?? []).map((asset) => [asset.id, asset]));
    state.pageAssets = new Map((state.pages.assets ?? []).map((asset) => [asset.id, asset]));
    if (!state.chapters.length || !state.assets.size || !state.pageAssets.size) throw new Error("章节或资产为空");
    validateBindings();
    validateAudioManifest();
    restoreState();
    applyDebugLocation();
    state.debugMode = hasDebugLocation();
    const savedEnding = state.endingId && state.pages.endingPages?.[state.endingId] ? state.endingId : null;
    state.endingId = savedEnding;
    if (!state.debugMode) {
      const coverPageId = state.pages.coverPage;
      await setScenePage(coverPageId, false);
      syncBgmForLocation(null);
      preloadPages(coverPageId);
      dom.app.classList.remove("is-loading");
      configureTitleScreen();
      return;
    }

    const initialPageId = savedEnding
      ? state.pages.endingPages[savedEnding]
      : pageForLine(currentChapter(), currentLine()) ?? chapterDefaultPage(currentChapter());
    await setScenePage(initialPageId, false);
    if (state.endingId && state.pages.endingPages?.[state.endingId]) {
      await finishEnding(state.endingId);
    } else if (state.memoryDraft?.chapterId === currentChapter()?.id) {
      state.endingId = null;
      setScene(currentChapter(), null, false);
      openMemoryOverlay(currentChapter());
    } else {
      state.endingId = null;
      setScene(currentChapter(), currentLine(), false);
      renderLine();
    }
    preloadPages(initialPageId);
    dom.app.classList.remove("is-loading");
    skipTitleScreen();
  } catch (error) {
    console.error(error);
    dom.app.classList.remove("is-loading");
    dom.errorCopy.textContent = `${error.message}。请用本地服务器打开 web/，不要直接双击 HTML。`;
    dom.errorPanel.classList.remove("is-hidden");
  }
}

bindEvents();
load();
