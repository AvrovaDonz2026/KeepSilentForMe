const DATA_URL = "../script/chapters.json";
const LOCALE_MANIFEST_URL = "../script/locales/manifest.json";
const LOCALE_ROOT = "../script/locales/";
const PLAYABLE_MANIFEST_URL = "../art/v4/playable/manifest.json";
const PAGE_MANIFEST_URL = "../art/v4/scenes/manifest.json";
const AUDIO_MANIFEST_URL = "audio/manifest.json?v=audio-3";
const VIDEO_MANIFEST_URL = "video/manifest.json?v=video-2";
const PLAYABLE_ROOT = "../art/v4/playable/";
const PAGE_ROOT = "../art/v4/scenes/";
const AUDIO_ROOT = "audio/";
const VIDEO_ROOT = "video/";
const SAVE_KEY = "keep-silent-for-me-demo";
const LOCALE_KEY = "keep-silent-for-me-locale";
const AUDIO_SETTINGS_KEY = "keep-silent-for-me-audio-settings";
const REVEAL_SEEN_KEY = "keep-silent-for-me-reveal-seen";
const MEMORY_CHAPTER_IDS = new Set(["L1", "L2", "L3", "L4"]);
const LIVE_CHAPTER_IDS = new Set(["L2", "L4"]);
const BGM_FADE_MS = 650;
const PAGE_TURN_DURATION_MS = 720;
const TITLE_CLOSE_DELAY_MS = 540;
const LIVE_VIEWER_TICK_MS = 1800;
const FX_REMOVE_DELAY_MS = 950;
const FEEDBACK_HINT_DELAY_MS = 420;
const FEEDBACK_DIALOGUE_REFRESH_DELAY_MS = 620;
const FEEDBACK_RISK_DELAY_MS = 120;
const TOAST_DEFAULT_DURATION_MS = 2100;
const TOAST_REJECT_DURATION_MS = 1500;
const TOAST_SELECTION_DURATION_MS = 2500;
const TOAST_FAILURE_DURATION_MS = 2600;
const BAR_DEFAULT_WIDTH = "min(34vw, 400px)";
const BAR_MIN_WIDTH = 88;
const BAR_MAX_WIDTH = 520;
const BAR_REST_X_RATIO = 0.62;
const BAR_REST_Y_RATIO = 0.44;
const BAR_REST_BOTTOM_GUTTER = 330;
const ZONE_REACHABLE_MIN_DISTANCE = 150;
const ZONE_REACHABLE_WIDTH_RATIO = 0.86;
const SELECTION_SNAP_DELAY_MS = 260;
const SELECTION_FEEDBACK_DELAY_MS = 1060;
const LINE_RENDER_DELAY_MS = 360;
const DEBUG_KEYS = new Set(["chapter", "line", "ending"]);

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
  stage: document.querySelector("#stage"),
  scenePage: document.querySelector("#scene-page"),
  storyVideoLayer: document.querySelector("#story-video-layer"),
  storyVideo: document.querySelector("#story-video"),
  storyVideoCaption: document.querySelector("#story-video-caption"),
  storyVideoSkip: document.querySelector("#story-video-skip"),
  bgmA: document.querySelector("#bgm-a"),
  bgmB: document.querySelector("#bgm-b"),
  titleScreen: document.querySelector("#title-screen"),
  titleKicker: document.querySelector("#title-kicker"),
  titleGameName: document.querySelector("#title-game-name"),
  titleLatinName: document.querySelector("#title-latin-name"),
  titleTagline: document.querySelector("#title-tagline"),
  titlePrimary: document.querySelector("#title-primary"),
  titleNewGame: document.querySelector("#title-new-game"),
  titleLanguageLabel: document.querySelector("#title-language-label"),
  titleLanguageSelect: document.querySelector("#title-language-select"),
  titleStatus: document.querySelector("#title-status"),
  wordmarkName: document.querySelector("#wordmark-name"),
  languageMenuButton: document.querySelector("#language-menu-button"),
  languageMenu: document.querySelector("#language-menu"),
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
  errorTitle: document.querySelector("#error-title"),
  errorCopy: document.querySelector("#error-copy"),
  restartButton: document.querySelector("#restart-button"),
  soundButton: document.querySelector("#sound-button"),
  audioSettingsButton: document.querySelector("#audio-settings-button"),
  audioSettings: document.querySelector("#audio-settings"),
  audioSettingsClose: document.querySelector("#audio-settings-close"),
  audioEnabled: document.querySelector("#audio-enabled"),
  audioEnabledStatus: document.querySelector("#audio-enabled-status"),
  musicVolume: document.querySelector("#music-volume"),
  musicVolumeValue: document.querySelector("#music-volume-value"),
  sfxVolume: document.querySelector("#sfx-volume"),
  sfxVolumeValue: document.querySelector("#sfx-volume-value"),
  audioSettingsStatus: document.querySelector("#audio-settings-status"),
  audioSettingsEyebrow: document.querySelector("#audio-settings-eyebrow"),
  audioSettingsTitle: document.querySelector("#audio-settings-title"),
  audioControlLabel: document.querySelector("#audio-control-label"),
  musicVolumeLabel: document.querySelector("#music-volume-label"),
  sfxVolumeLabel: document.querySelector("#sfx-volume-label"),
  statusCaption: document.querySelector("#status-caption"),
  memoryFragmentsLabel: document.querySelector("#memory-fragments-label"),
  memoryWhisperLabel: document.querySelector("#memory-whisper-label"),
  retryButton: document.querySelector("#retry-button"),
};

const state = {
  data: null,
  baseData: null,
  localeManifest: null,
  locale: null,
  localeData: null,
  fallbackLocaleData: null,
  localeSwitching: false,
  playable: null,
  pages: null,
  audio: null,
  video: null,
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
  audioSettings: {
    enabled: true,
    musicVolume: 1,
    sfxVolume: 1,
  },
  audioContext: null,
  bgm: {
    activeSlot: 0,
    activeTrackId: "",
    desiredTrackId: "",
    pendingTrackId: "",
    baseGain: 0,
    desiredGain: 0,
    fadeTimer: null,
    transitionToken: 0,
    started: false,
  },
  overlayAction: null,
  toastTimer: null,
  transitionTimers: new Set(),
  transitionVersion: 0,
  persistenceAvailable: true,
  pageToken: 0,
  pageLoads: new Map(),
  hasSave: false,
  titleReady: false,
  titleStarting: false,
  debugMode: false,
  videoSequenceToken: 0,
  videoCaptionTimers: new Set(),
  videoPlaying: false,
  videoSkipRequested: false,
  revealSeen: false,
  pendingMigrationNotice: false,
};

function pathValue(object, path) {
  return path.split(".").reduce((value, key) => (
    value && typeof value === "object" ? value[key] : undefined
  ), object);
}

function formatText(value, variables = {}) {
  if (typeof value !== "string") return "";
  return value.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => (
    Object.prototype.hasOwnProperty.call(variables, key) ? String(variables[key]) : match
  ));
}

function localeValue(path, fallback = "") {
  const current = pathValue(state.localeData, path);
  if (current !== undefined && current !== null) return current;
  const fallbackValue = pathValue(state.fallbackLocaleData, path);
  return fallbackValue !== undefined && fallbackValue !== null ? fallbackValue : fallback;
}

function t(path, variables = {}, fallback = "") {
  return formatText(localeValue(path, fallback), variables);
}

function localeDescriptor(localeId) {
  return state.localeManifest?.locales?.find((locale) => locale?.id === localeId) ?? null;
}

function defaultLocaleDescriptor() {
  return localeDescriptor(state.localeManifest?.defaultLocale) ?? state.localeManifest?.locales?.[0] ?? null;
}

function localeLabel(locale) {
  if (!locale) return "";
  return locale.beta ? `${locale.nativeName} (${t("ui.beta", {}, "Beta")})` : locale.nativeName;
}

function compactLocaleLabel(locale) {
  if (!locale) return "";
  return locale.id === "zh-CN" ? "中文" : locale.id.toUpperCase();
}

function normalizeBrowserLocale(locale) {
  if (typeof locale !== "string" || !locale) return "";
  const normalized = locale.replace("_", "-").toLowerCase();
  if (localeDescriptor(normalized)) return normalized;
  const language = normalized.split("-")[0];
  if (language === "zh") return localeDescriptor("zh-CN") ? "zh-CN" : "";
  return localeDescriptor(language) ? language : "";
}

function requestedLocaleDescriptor() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("lang")) {
    const requested = params.get("lang") ?? "";
    const match = localeDescriptor(requested);
    if (!match) console.warn(`Unsupported locale query: ${requested}`);
    return match ?? defaultLocaleDescriptor();
  }
  const saved = localeDescriptor(storageGet(LOCALE_KEY));
  if (saved) return saved;
  for (const candidate of navigator.languages ?? [navigator.language]) {
    const localeId = normalizeBrowserLocale(candidate);
    if (localeId) return localeDescriptor(localeId);
  }
  return defaultLocaleDescriptor();
}

function localePath(locale) {
  if (!locale || typeof locale.path !== "string" || !locale.path || locale.path.includes("..")) return "";
  return `${LOCALE_ROOT}${locale.path}`;
}

async function fetchLocaleData(locale) {
  const path = localePath(locale);
  if (!path) throw new Error("Invalid locale path");
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`Locale data unavailable: ${locale.id}`);
  const data = await response.json();
  if (!data || data.schemaVersion !== 1 || data.locale !== locale.id) {
    throw new Error(`Locale data is invalid: ${locale.id}`);
  }
  return data;
}

function joinLocalizedChapters(baseData, localizedData) {
  if (!baseData || !Array.isArray(baseData.chapters) || !localizedData?.game?.lines) {
    throw new Error("Localized chapter data is invalid");
  }
  return baseData.chapters.map((baseChapter) => {
    const localizedChapter = localizedData.game.chapters?.[baseChapter.id];
    if (!localizedChapter || typeof localizedChapter.title !== "string") {
      throw new Error(`Locale is missing chapter ${baseChapter.id}`);
    }
    return {
      ...baseChapter,
      title: localizedChapter.title,
      narration: localizedChapter.narration ?? [],
      objective: localizedChapter.objective ?? "",
      lines: (baseChapter.lines ?? []).map((baseLine) => {
        const localizedLine = localizedData.game.lines[baseLine.id];
        if (!localizedLine || typeof localizedLine.raw !== "string" || !localizedLine.zones) {
          throw new Error(`Locale is missing line ${baseLine.id}`);
        }
        return {
          ...baseLine,
          raw: localizedLine.raw,
          zones: (baseLine.zones ?? []).map((baseZone) => {
            const localizedZone = localizedLine.zones[baseZone.id];
            if (!localizedZone || typeof localizedZone.text !== "string" || !localizedZone.text
              || !Number.isInteger(localizedZone.start)) {
              throw new Error(`Locale is missing zone ${baseZone.id}`);
            }
            return { ...baseZone, ...localizedZone };
          }),
        };
      }),
    };
  });
}

function zoneById(chapterId, zoneId) {
  const chapter = state.chapters.find((item) => item.id === chapterId);
  return chapter?.lines?.flatMap((line) => line.zones ?? []).find((zone) => zone.id === zoneId) ?? null;
}

function textForZoneId(chapterId, zoneId) {
  const zone = zoneById(chapterId, zoneId);
  return zone?.eat || zone?.text || "";
}

function languageSwitchLocked() {
  return dom.app.classList.contains("is-loading")
    || state.dragging
    || state.locked
    || state.videoPlaying
    || state.titleStarting
    || state.memoryDrag !== null
    || !dom.memoryOverlay.classList.contains("is-hidden")
    || state.localeSwitching;
}

function closeLanguageMenu() {
  dom.languageMenu.classList.add("is-hidden");
  dom.languageMenuButton.setAttribute("aria-expanded", "false");
}

function syncLanguageControls() {
  const disabled = languageSwitchLocked() || !state.localeManifest?.locales?.length;
  dom.titleLanguageSelect.disabled = disabled;
  dom.languageMenuButton.disabled = disabled;
  dom.languageMenuButton.setAttribute("aria-disabled", String(disabled));
  if (disabled) closeLanguageMenu();
}

function renderLanguageControls() {
  const locales = state.localeManifest?.locales ?? [];
  const selectedId = state.locale?.id ?? "";
  const options = locales.map((locale) => {
    const option = document.createElement("option");
    option.value = locale.id;
    option.textContent = localeLabel(locale);
    option.selected = locale.id === selectedId;
    return option;
  });
  dom.titleLanguageSelect.replaceChildren(...options);
  dom.titleLanguageSelect.value = selectedId;
  dom.languageMenuButton.textContent = compactLocaleLabel(state.locale);
  dom.languageMenuButton.setAttribute("aria-label", `${t("ui.languageMenuLabel")}: ${localeLabel(state.locale)}`);
  dom.languageMenuButton.setAttribute("title", localeLabel(state.locale));
  const choices = locales.map((locale) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "language-menu-option";
    button.role = "menuitemradio";
    button.setAttribute("aria-checked", String(locale.id === selectedId));
    button.textContent = localeLabel(locale);
    button.addEventListener("click", () => { void switchLocale(locale.id, { persist: true }); });
    return button;
  });
  dom.languageMenu.replaceChildren(...choices);
  syncLanguageControls();
}

function applyLocaleText() {
  if (!state.localeData || !state.locale) return;
  document.documentElement.lang = state.locale.id;
  document.title = localeValue("documentTitle", "Keep Silent for Me");
  dom.stage.setAttribute("aria-label", t("ui.stageLabel"));
  dom.titleScreen.setAttribute("aria-label", t("ui.titleScreenLabel"));
  dom.storyVideoSkip.textContent = t("ui.storyVideoSkip");
  dom.titleKicker.textContent = t("ui.titleKicker");
  dom.titleGameName.textContent = t("game.title");
  dom.titleLatinName.textContent = t("game.latinTitle");
  dom.titleTagline.textContent = t("game.tagline");
  dom.titleNewGame.textContent = t("ui.titleNewGame");
  dom.titleLanguageLabel.textContent = t("ui.languageLabel");
  dom.wordmarkName.textContent = t("game.title");
  dom.languageMenu.setAttribute("aria-label", t("ui.languageMenuLabel"));
  dom.restartButton.setAttribute("aria-label", t("ui.restart"));
  dom.restartButton.setAttribute("title", t("ui.restart"));
  dom.audioSettingsButton.setAttribute("aria-label", t("ui.audioSettingsOpen"));
  dom.audioSettingsButton.setAttribute("title", t("ui.audioSettings"));
  dom.audioSettingsEyebrow.textContent = t("ui.soundSettingsEyebrow");
  dom.audioSettingsTitle.textContent = t("ui.audioSettings");
  dom.audioSettingsClose.setAttribute("aria-label", t("ui.audioSettingsClose"));
  dom.audioSettingsClose.setAttribute("title", t("ui.audioSettingsClose"));
  dom.audioControlLabel.textContent = t("ui.sound");
  dom.musicVolumeLabel.textContent = t("ui.music");
  dom.sfxVolumeLabel.textContent = t("ui.soundEffects");
  dom.statusCaption.textContent = t("ui.sceneStatus");
  dom.statusCopy.textContent = localeValue("sceneMeta.L0.status", "");
  dom.sceneCaption.textContent = t("ui.sceneLoading");
  dom.liveChat.setAttribute("aria-label", t("ui.liveChatLabel"));
  dom.dialogueFrame.setAttribute("aria-label", t("ui.dialogueLabel"));
  dom.speakerName.textContent = t("ui.speaker");
  dom.feedbackCopy.textContent = t("ui.initialFeedback");
  dom.overlayEyebrow.textContent = t("ui.chapterEnded");
  dom.overlayAction.textContent = t("ui.continue");
  dom.memoryEyebrow.textContent = t("ui.memoryEyebrow", { chapterId: currentChapter()?.id ?? "L0" });
  dom.memoryTitle.textContent = t("ui.memoryTitle");
  dom.memoryCopy.textContent = t("ui.memoryCopy");
  dom.memoryFragmentsLabel.textContent = t("ui.memoryFragments");
  dom.memoryWhisperLabel.textContent = t("ui.memoryWhisper");
  dom.memoryPool.setAttribute("aria-label", t("ui.memoryPoolLabel"));
  dom.memoryLane.setAttribute("aria-label", t("ui.memoryLaneLabel"));
  dom.memoryConfirm.textContent = t("ui.memoryConfirm");
  dom.errorTitle.textContent = t("ui.errorTitle");
  dom.retryButton.textContent = t("ui.retry");
  if (dom.errorPanel.classList.contains("is-hidden")) dom.errorCopy.textContent = t("ui.errorLocalServer");
  renderLanguageControls();
  updateAudioSettingsUI();
}

async function switchLocale(localeId, { persist = false } = {}) {
  if (languageSwitchLocked()) return false;
  const target = localeDescriptor(localeId);
  if (!target) return false;
  if (target.id === state.locale?.id) {
    closeLanguageMenu();
    return true;
  }
  state.localeSwitching = true;
  syncLanguageControls();
  try {
    const localizedData = await fetchLocaleData(target);
    const chapters = joinLocalizedChapters(state.baseData, localizedData);
    state.locale = target;
    state.localeData = localizedData;
    state.data = { ...state.baseData, endings: localizedData.game.endings ?? {} };
    state.chapters = chapters;
    if (persist) storageSet(LOCALE_KEY, target.id);
    applyLocaleText();
    if (dom.titleScreen.classList.contains("is-hidden")) {
      renderLine();
    } else {
      configureTitleScreen();
    }
    return true;
  } catch (error) {
    console.error(error);
    showToast(t("ui.errorTitle", {}, "Unable to switch language."), TOAST_FAILURE_DURATION_MS);
    return false;
  } finally {
    state.localeSwitching = false;
    closeLanguageMenu();
    syncLanguageControls();
  }
}

function assetUrl(id) {
  const asset = state.assets.get(id);
  return asset ? `${PLAYABLE_ROOT}${asset.path}` : "";
}

function pageUrl(id) {
  const asset = state.pageAssets.get(id);
  return asset ? `${PAGE_ROOT}${asset.path}` : "";
}

function videoUrl(path) {
  if (typeof path !== "string" || !path || path.includes("..")) return "";
  return `${VIDEO_ROOT}${path}`;
}

function validateVideoManifest() {
  const sequences = state.video?.sequences;
  if (!sequences || typeof sequences !== "object" || Array.isArray(sequences)) {
    throw new Error("运行时视频清单缺少 sequences");
  }
  for (const [sequenceId, sequence] of Object.entries(sequences)) {
    if (!sequence || !Array.isArray(sequence.clips) || !sequence.clips.length) {
      throw new Error(`视频序列 ${sequenceId} 缺少 clips`);
    }
    for (const clip of sequence.clips) {
      if (!clip?.id || !videoUrl(clip.path)) throw new Error(`视频序列 ${sequenceId} 包含无效视频路径`);
      if (!state.pageAssets.has(clip.beforePage)) {
        throw new Error(`视频 ${clip.id} 引用了不存在的首帧场景页 ${clip.beforePage ?? ""}`);
      }
      if (!Number.isFinite(Number(clip.duration)) || Number(clip.duration) <= 0) {
        throw new Error(`视频 ${clip.id} 缺少有效时长`);
      }
    }
  }
  for (const endingId of ["A_separate", "B_alienate", "C_consume", "C_cold"]) {
    if (!sequences[endingId]?.clips?.length) throw new Error(`结局 ${endingId} 缺少视频序列`);
  }
  if (!sequences.reveal?.clips?.length) throw new Error("反转序列缺少视频");

  const chapterOutros = state.video?.chapterOutros;
  const requiredChapterOutros = [
    "L0_to_L1",
    "L1_pass_to_L2",
    "L1_fail_retry",
    "L2_to_L3",
    "L3_to_L4",
    "L4_perform_to_L5",
    "L4_refuse_to_L5",
  ];
  if (!chapterOutros || typeof chapterOutros !== "object" || Array.isArray(chapterOutros)) {
    throw new Error("运行时视频清单缺少 chapterOutros");
  }
  for (const sequenceId of requiredChapterOutros) {
    const sequence = chapterOutros[sequenceId];
    if (!sequence || sequence.kind !== "chapterOutro" || !Array.isArray(sequence.clips) || !sequence.clips.length) {
      throw new Error(`章节过场 ${sequenceId} 缺少有效 clips`);
    }
    for (const clip of sequence.clips) {
      if (!clip?.id || !videoUrl(clip.path)) throw new Error(`章节过场 ${sequenceId} 包含无效视频路径`);
      if (!state.pageAssets.has(clip.beforePage)) {
        throw new Error(`章节过场 ${clip.id} 引用了不存在的首帧场景页 ${clip.beforePage ?? ""}`);
      }
      if (!Number.isFinite(Number(clip.duration)) || Number(clip.duration) <= 0) {
        throw new Error(`章节过场 ${clip.id} 缺少有效时长`);
      }
    }
  }
}

function clearVideoCaptionTimers() {
  for (const timer of state.videoCaptionTimers) window.clearTimeout(timer);
  state.videoCaptionTimers.clear();
  dom.storyVideoCaption.textContent = "";
  dom.storyVideoCaption.classList.remove("is-visible");
}

function setVideoCaption(text) {
  dom.storyVideoCaption.textContent = text;
  dom.storyVideoCaption.classList.toggle("is-visible", Boolean(text));
}

function hideStoryVideo() {
  clearVideoCaptionTimers();
  dom.storyVideo.pause();
  dom.storyVideo.style.opacity = "0";
  dom.storyVideoLayer.classList.add("is-hidden");
  dom.storyVideoLayer.setAttribute("aria-hidden", "true");
  dom.storyVideoSkip.classList.add("is-hidden");
  dom.app.classList.remove("is-video-playing");
  state.videoPlaying = false;
  state.videoSkipRequested = false;
  syncLanguageControls();
}

function cancelStoryVideo() {
  state.videoSequenceToken += 1;
  state.videoSkipRequested = true;
  dom.storyVideo.dispatchEvent(new Event("storycancel"));
  hideStoryVideo();
}

function setRevealSeen() {
  state.revealSeen = true;
  storageSet(REVEAL_SEEN_KEY, "1");
}

function startRevealCaptions(token) {
  const whispers = state.eatLog
    .slice(-3)
    .map((entry) => textForZoneId(entry?.chapterId, entry?.zoneId))
    .filter(Boolean);
  const captions = localeValue("game.revealCaptions", []);
  const cues = [
    [0, captions[0] ?? ""],
    [2000, captions[1] ?? ""],
    [5000, captions[2] ?? ""],
    [7600, whispers.length ? t("ui.swallowed", { text: whispers.join(" · ") }) : (captions[3] ?? "")],
    [9200, captions[4] ?? ""],
  ];
  for (const [delay, text] of cues) {
    const timer = window.setTimeout(() => {
      state.videoCaptionTimers.delete(timer);
      if (token === state.videoSequenceToken) setVideoCaption(text);
    }, delay);
    state.videoCaptionTimers.add(timer);
  }
}

async function loadStoryClip(clip, token) {
  if (token !== state.videoSequenceToken) return false;
  const loaded = await setScenePage(clip.beforePage, false);
  if (!loaded || token !== state.videoSequenceToken) return false;
  const src = videoUrl(clip.path);
  if (!src) throw new Error(`视频 ${clip.id} 路径无效`);
  dom.storyVideo.style.opacity = "0";
  dom.storyVideo.pause();
  dom.storyVideo.src = src;
  dom.storyVideo.load();
  if (dom.storyVideo.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
    await new Promise((resolve, reject) => {
      let timer = window.setTimeout(() => {
        cleanup();
        reject(new Error(`视频 ${clip.id} 加载超时`));
      }, 12000);
      const cleanup = () => {
        window.clearTimeout(timer);
        dom.storyVideo.removeEventListener("canplay", onReady);
        dom.storyVideo.removeEventListener("error", onError);
      };
      const onReady = () => { cleanup(); resolve(); };
      const onError = () => { cleanup(); reject(new Error(`视频 ${clip.id} 解码失败`)); };
      dom.storyVideo.addEventListener("canplay", onReady, { once: true });
      dom.storyVideo.addEventListener("error", onError, { once: true });
    });
  }
  if (token !== state.videoSequenceToken) return false;
  dom.storyVideo.currentTime = 0;
  return true;
}

async function playLoadedStoryClip(clip, token) {
  if (token !== state.videoSequenceToken) return false;
  dom.storyVideoLayer.classList.remove("is-hidden");
  dom.storyVideoLayer.setAttribute("aria-hidden", "false");
  dom.app.classList.add("is-video-playing");
  dom.storyVideo.style.opacity = "1";
  let cancelFinished = () => {};
  const finished = new Promise((resolve, reject) => {
    const cleanup = () => {
      dom.storyVideo.removeEventListener("ended", onEnded);
      dom.storyVideo.removeEventListener("error", onError);
      dom.storyVideoSkip.removeEventListener("click", onSkip);
      dom.storyVideo.removeEventListener("storycancel", onCancel);
    };
    const onEnded = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error(`视频 ${clip.id} 播放失败`)); };
    const onSkip = () => {
      // A skip applies to the whole sequence, not only the currently loaded clip.
      state.videoSkipRequested = true;
      cleanup();
      dom.storyVideo.pause();
      resolve();
    };
    const onCancel = () => { cleanup(); dom.storyVideo.pause(); resolve(); };
    cancelFinished = () => { cleanup(); dom.storyVideo.pause(); resolve(); };
    dom.storyVideo.addEventListener("ended", onEnded, { once: true });
    dom.storyVideo.addEventListener("error", onError, { once: true });
    dom.storyVideoSkip.addEventListener("click", onSkip, { once: true });
    dom.storyVideo.addEventListener("storycancel", onCancel, { once: true });
    if (state.videoSkipRequested) {
      cleanup();
      resolve();
    }
  });
  try {
    await dom.storyVideo.play();
  } catch (error) {
    cancelFinished();
    throw new Error(`视频 ${clip.id} 无法自动播放: ${error.message}`);
  }
  await finished;
  return token === state.videoSequenceToken;
}

async function playStorySequence(sequenceId, { reveal = false } = {}) {
  const sequence = state.video?.sequences?.[sequenceId] ?? state.video?.chapterOutros?.[sequenceId];
  if (!sequence?.clips?.length) throw new Error(`视频序列不存在: ${sequenceId}`);
  const token = ++state.videoSequenceToken;
  state.videoPlaying = true;
  state.videoSkipRequested = false;
  syncLanguageControls();
  dom.storyVideo.muted = true;
  dom.storyVideo.defaultMuted = true;
  dom.storyVideoSkip.classList.toggle("is-hidden", !(reveal && state.revealSeen));
  try {
    for (let index = 0; index < sequence.clips.length; index += 1) {
      const clip = sequence.clips[index];
      const loaded = await loadStoryClip(clip, token);
      if (!loaded) return false;
      if (reveal && index === 0) startRevealCaptions(token);
      const played = await playLoadedStoryClip(clip, token);
      if (!played || state.videoSkipRequested) break;
    }
    if (reveal) setRevealSeen();
    return token === state.videoSequenceToken;
  } finally {
    if (token === state.videoSequenceToken) hideStoryVideo();
  }
}

function chapterOutroSequenceId(chapter) {
  switch (chapter?.id) {
    case "L0":
      return "L0_to_L1";
    case "L1":
      return chapterResult(chapter) === "pass" ? "L1_pass_to_L2" : "L1_fail_retry";
    case "L2":
      return "L2_to_L3";
    case "L3":
      return "L3_to_L4";
    case "L4": {
      const perform = Number(state.flags.apology_perform) || 0;
      const refuse = Number(state.flags.apology_refuse) || 0;
      // 混线平票取表演；当前运行时没有额外的 1 秒噪声插片。
      return perform >= refuse ? "L4_perform_to_L5" : "L4_refuse_to_L5";
    }
    default:
      return "";
  }
}

async function playChapterOutro(sequenceId, onComplete = null) {
  try {
    const played = await playStorySequence(sequenceId);
    if (!played) return null;
    onComplete?.();
    return true;
  } catch (error) {
    console.error(error);
    showToast(t("ui.transitionVideoFailed"), TOAST_FAILURE_DURATION_MS);
    onComplete?.();
    return false;
  }
}

async function playChapterOutroThenAdvance(chapter) {
  const sequenceId = chapterOutroSequenceId(chapter);
  if (!sequenceId) {
    nextChapter();
    return;
  }
  hideOverlay();
  hideMemoryOverlay();
  state.locked = true;
  syncLanguageControls();
  const result = await playChapterOutro(sequenceId);
  if (result === null) return;
  if (currentChapter()?.id !== chapter?.id) return;
  nextChapter();
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

function clampAudioValue(value, fallback = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(1, Math.max(0, number));
}

function storageGet(key) {
  try {
    const storage = globalThis.localStorage;
    if (!storage) {
      state.persistenceAvailable = false;
      return null;
    }
    return storage.getItem(key);
  } catch (error) {
    state.persistenceAvailable = false;
    return null;
  }
}

function storageSet(key, value) {
  try {
    const storage = globalThis.localStorage;
    if (!storage) {
      state.persistenceAvailable = false;
      return false;
    }
    storage.setItem(key, value);
    return true;
  } catch (error) {
    state.persistenceAvailable = false;
    return false;
  }
}

function storageRemove(key) {
  try {
    const storage = globalThis.localStorage;
    if (!storage) {
      state.persistenceAvailable = false;
      return false;
    }
    storage.removeItem(key);
    return true;
  } catch (error) {
    state.persistenceAvailable = false;
    return false;
  }
}

function scheduleTransition(callback, delay) {
  const timer = window.setTimeout(() => {
    state.transitionTimers.delete(timer);
    callback();
  }, delay);
  state.transitionTimers.add(timer);
  return timer;
}

function cancelTransitionTimers() {
  state.transitionVersion += 1;
  for (const timer of state.transitionTimers) window.clearTimeout(timer);
  state.transitionTimers.clear();
}

function saveAudioSettings() {
  if (!storageSet(AUDIO_SETTINGS_KEY, JSON.stringify(state.audioSettings))) {
    console.warn("audio settings unavailable");
  }
}

function restoreAudioSettings() {
  state.audioSettings = { enabled: true, musicVolume: 1, sfxVolume: 1 };
  const raw = storageGet(AUDIO_SETTINGS_KEY);
  try {
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && typeof saved === "object" && !Array.isArray(saved)) {
        state.audioSettings.enabled = saved.enabled !== false;
        state.audioSettings.musicVolume = clampAudioValue(saved.musicVolume);
        state.audioSettings.sfxVolume = clampAudioValue(saved.sfxVolume);
      }
    }
  } catch (error) {
    storageRemove(AUDIO_SETTINGS_KEY);
  }
  state.sound = state.audioSettings.enabled;
  updateAudioSettingsUI();
}

function audioTrackLabel(trackId) {
  return localeValue(`trackLabels.${trackId}`, t("ui.waitingTrack")) || trackId || t("ui.waitingTrack");
}

function setRangeProgress(input, value) {
  if (!input) return;
  input.style.setProperty("--range-progress", `${Math.round(value * 100)}%`);
}

function updateSoundButton() {
  if (!dom.soundButton) return;
  dom.soundButton.textContent = state.sound ? "◌" : "·";
  dom.soundButton.setAttribute("aria-label", state.sound ? t("ui.soundToggleOff") : t("ui.soundToggleOn"));
  dom.soundButton.setAttribute("title", state.sound ? t("ui.soundToggleOff") : t("ui.soundToggleOn"));
  dom.soundButton.setAttribute("aria-pressed", String(state.sound));
}

function updateAudioSettingsUI() {
  const settings = state.audioSettings;
  if (!settings || !dom.audioEnabled) return;
  const musicPercent = Math.round(settings.musicVolume * 100);
  const sfxPercent = Math.round(settings.sfxVolume * 100);
  dom.audioEnabled.checked = state.sound;
  dom.audioEnabledStatus.textContent = state.sound ? t("ui.audioOn") : t("ui.audioOff");
  dom.musicVolume.value = String(musicPercent);
  dom.musicVolume.setAttribute("aria-valuetext", `${musicPercent}%`);
  dom.musicVolumeValue.textContent = `${musicPercent}%`;
  dom.sfxVolume.value = String(sfxPercent);
  dom.sfxVolume.setAttribute("aria-valuetext", `${sfxPercent}%`);
  dom.sfxVolumeValue.textContent = `${sfxPercent}%`;
  setRangeProgress(dom.musicVolume, settings.musicVolume);
  setRangeProgress(dom.sfxVolume, settings.sfxVolume);
  const trackId = state.bgm.desiredTrackId || state.bgm.activeTrackId || state.audio?.title;
  dom.audioSettingsStatus.textContent = state.sound
    ? t("ui.currentTrack", { track: audioTrackLabel(trackId) })
    : t("ui.currentTrackMuted");
  updateSoundButton();
}

function setAudioEnabled(enabled, playFeedback = false) {
  state.sound = Boolean(enabled);
  state.audioSettings.enabled = state.sound;
  saveAudioSettings();
  updateAudioSettingsUI();
  if (state.sound) {
    startBgm();
    if (playFeedback) ping("snap");
  } else {
    state.bgm.started = false;
    stopBgmSlots();
  }
}

function setMusicVolume(value) {
  state.audioSettings.musicVolume = clampAudioValue(Number(value) / 100);
  state.bgm.desiredGain = Math.min(1, state.bgm.baseGain * state.audioSettings.musicVolume);
  if (state.bgm.activeTrackId && !state.bgm.pendingTrackId) {
    const active = bgmSlot(state.bgm.activeSlot);
    if (active.src) active.volume = state.bgm.desiredGain;
  }
  saveAudioSettings();
  updateAudioSettingsUI();
}

function setSfxVolume(value) {
  state.audioSettings.sfxVolume = clampAudioValue(Number(value) / 100);
  saveAudioSettings();
  updateAudioSettingsUI();
}

function openAudioSettings() {
  dom.audioSettings.classList.remove("is-hidden");
  dom.audioSettingsButton.setAttribute("aria-expanded", "true");
  updateAudioSettingsUI();
}

function closeAudioSettings() {
  dom.audioSettings.classList.add("is-hidden");
  dom.audioSettingsButton.setAttribute("aria-expanded", "false");
}

function toggleAudioSettings() {
  if (dom.audioSettings.classList.contains("is-hidden")) openAudioSettings();
  else closeAudioSettings();
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
    const targetGain = state.bgm.desiredTrackId === trackId ? state.bgm.desiredGain : gain;
    next.volume = targetGain * eased;
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
  state.bgm.baseGain = bgmGain(binding, track);
  state.bgm.desiredGain = Math.min(1, state.bgm.baseGain * state.audioSettings.musicVolume);
  updateAudioSettingsUI();
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
  setAudioEnabled(!state.sound, true);
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

function isKnownZoneId(chapterId, lineId, zoneId) {
  const chapter = state.chapters.find((item) => item.id === chapterId);
  const line = chapter?.lines?.find((item) => item.id === lineId);
  return Boolean(line?.zones?.some((zone) => zone.id === zoneId));
}

function normalizeSelections(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  return raw
    .filter((entry) => entry && typeof entry === "object"
      && typeof entry.chapterId === "string"
      && typeof entry.lineId === "string"
      && typeof entry.zoneId === "string"
      && isKnownZoneId(entry.chapterId, entry.lineId, entry.zoneId))
    .filter((entry) => !seen.has(entry.zoneId) && seen.add(entry.zoneId))
    .map((entry) => ({ chapterId: entry.chapterId, lineId: entry.lineId, zoneId: entry.zoneId }));
}

function normalizeMemoryByChapter(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return Object.fromEntries(Object.entries(raw)
    .filter(([chapterId, fragments]) => state.chapters.some((chapter) => chapter.id === chapterId) && Array.isArray(fragments))
    .map(([chapterId, fragments]) => [
      chapterId,
      [...new Set(fragments.filter((zoneId) => typeof zoneId === "string" && textForZoneId(chapterId, zoneId)))],
    ]));
}

function normalizeMemoryDraft(raw) {
  if (!raw || typeof raw !== "object" || typeof raw.chapterId !== "string" || !Array.isArray(raw.fragmentIds)) return null;
  const fragmentIds = [...new Set(raw.fragmentIds.filter((zoneId) => typeof zoneId === "string" && textForZoneId(raw.chapterId, zoneId)))];
  if (!fragmentIds.length) return null;
  const ids = new Set(fragmentIds);
  const order = Array.isArray(raw.order) ? raw.order.filter((id) => typeof id === "string" && ids.has(id)) : [];
  return {
    chapterId: raw.chapterId,
    fragments: fragmentIds.map((id) => ({ id, text: textForZoneId(raw.chapterId, id) })),
    order: [...new Set(order)],
  };
}

function memoryFragmentsForChapter(chapterId) {
  return state.eatLog
    .filter((entry) => entry.chapterId === chapterId)
    .map((entry) => ({ id: entry.zoneId, text: textForZoneId(chapterId, entry.zoneId) }))
    .filter((fragment) => fragment.text);
}

function memoryDraftMatches(draft, chapterId, fragments) {
  if (!draft || draft.chapterId !== chapterId || !Array.isArray(draft.fragments)) return false;
  return draft.fragments.length === fragments.length
    && draft.fragments.every((fragment, index) => fragment?.id === fragments[index].id);
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
  dom.memoryEcho.textContent = fragments.map((zoneId) => textForZoneId(previousChapter.id, zoneId)).filter(Boolean).join(" · ");
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
  dom.liveChatViewers.textContent = t("ui.viewerCount", { count: new Intl.NumberFormat(state.locale?.id ?? "zh-CN").format(state.liveViewerCount) });
  const changes = [7, 4, -3, 11, -5, 6, -2, 9, -7, 3];
  let tick = 0;
  state.liveViewerTimer = window.setInterval(() => {
    if (!LIVE_CHAPTER_IDS.has(currentChapter()?.id) || dom.liveChat.classList.contains("is-hidden")) {
      window.clearInterval(state.liveViewerTimer);
      state.liveViewerTimer = null;
      return;
    }
    state.liveViewerCount = Math.max(0, state.liveViewerCount + changes[tick % changes.length]);
    dom.liveChatViewers.textContent = t("ui.viewerCount", { count: new Intl.NumberFormat(state.locale?.id ?? "zh-CN").format(state.liveViewerCount) });
    tick += 1;
  }, LIVE_VIEWER_TICK_MS);
}

function renderLiveChat(chapter, line) {
  if (!LIVE_CHAPTER_IDS.has(chapter?.id) || !line) {
    hideLiveChat();
    return;
  }
  const localizedMessages = localeValue(`liveChat.${line.id}`, null);
  const fallbackMessages = localeValue("ui.fallbackChat", []);
  const messages = Array.isArray(localizedMessages)
    ? localizedMessages
    : (Array.isArray(fallbackMessages) ? fallbackMessages : []);
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

function showToast(text, duration = TOAST_DEFAULT_DURATION_MS) {
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
      }, PAGE_TURN_DURATION_MS);
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
      showToast(t("ui.sceneLoadRetained", { pageId }), TOAST_FAILURE_DURATION_MS);
      return false;
    }
    dom.scenePage.classList.remove("is-visible", "is-turning");
    throw error;
  }
}

function setScene(chapter, line = currentLine(), animate = false) {
  const meta = localeValue(`sceneMeta.${chapter?.id}`, localeValue("sceneMeta.L0", {}));
  dom.stage.dataset.chapter = chapter?.id ?? "L0";
  dom.statusCopy.textContent = meta.status ?? "";
  dom.sceneCaption.textContent = meta.caption ?? t("ui.sceneLoading");
  dom.statusFill.style.width = `${Math.max(18, ((state.chapterIndex + 1) / state.chapters.length) * 100)}%`;
  syncBgmForLocation(chapter);
  if (line) setScenePage(pageForLine(chapter, line), animate);
}

function dialogueZoneStart(raw, zone) {
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
}

function buildDialogue(raw, zones) {
  const intervals = zones
    .map((zone, index) => {
      const start = dialogueZoneStart(raw, zone);
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
  syncLanguageControls();
  dom.blackBar.classList.remove("is-locked", "bar-active", "bar-snap", "bar-locked", "bar-cracked");
  const cracked = manifestLayerIds("bar_cracked", line.id)?.length;
  const locked = manifestLayerIds("bar_locked", line.id)?.length;
  setBarSource(cracked ? "cracked" : locked ? "locked" : "hover");
  dom.blackBar.style.width = BAR_DEFAULT_WIDTH;
  dom.chapterKicker.textContent = `${chapter.id} · ${chapter.title}`;
  dom.chapterTitle.textContent = localeValue(`sceneMeta.${chapter.id}.readout`, chapter.title);
  dom.speakerName.textContent = t("ui.speaker");
  dom.lineId.textContent = line.id;
  dom.zoneCount.textContent = String(line.zones.length).padStart(2, "0");
  dom.feedbackCopy.textContent = state.chapterIndex === 0 ? t("ui.lineFeedbackFirst") : t("ui.lineFeedback");
  renderMemoryEcho(chapter, line);
  renderLiveChat(chapter, line);
  buildDialogue(line.raw, line.zones);
  setScene(chapter, line, true);
  clearNearestZone();
  window.requestAnimationFrame(positionBarAtRest);
  triggerManifestEvent("zone_hint", undefined, FEEDBACK_HINT_DELAY_MS);
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
  setBarCenter(
    window.innerWidth * BAR_REST_X_RATIO,
    Math.min(window.innerHeight * BAR_REST_Y_RATIO, window.innerHeight - BAR_REST_BOTTOM_GUTTER),
  );
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
  return Boolean(
    target
      && target.distance < Math.max(ZONE_REACHABLE_MIN_DISTANCE, target.rect.width * ZONE_REACHABLE_WIDTH_RATIO),
  );
}

function updateDragTarget(clientX, clientY) {
  const nearest = nearestZone(clientX, clientY);
  if (!nearest) return;
  if (isReachableZone(nearest)) {
    setNearestZone(nearest.index, nearest.element);
    dom.blackBar.style.width = `${Math.min(BAR_MAX_WIDTH, Math.max(BAR_MIN_WIDTH, nearest.rect.width + 22))}px`;
  } else {
    clearNearestZone();
    dom.blackBar.style.width = BAR_DEFAULT_WIDTH;
  }
}

function onPointerDown(event) {
  if (state.locked || event.button > 0) return;
  event.preventDefault();
  const rect = dom.blackBar.getBoundingClientRect();
  state.dragging = true;
  syncLanguageControls();
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
  syncLanguageControls();
  state.pointerId = null;
  if (dom.blackBar.hasPointerCapture(event.pointerId)) dom.blackBar.releasePointerCapture(event.pointerId);
  const rect = dom.blackBar.getBoundingClientRect();
  const target = nearestZone(rect.left + rect.width / 2, rect.top + rect.height / 2);
  if (!isReachableZone(target)) {
    clearNearestZone();
    setBarSource("hover");
    dom.blackBar.style.width = BAR_DEFAULT_WIDTH;
    positionBarAtRest();
    showToast(t("ui.selectionNotFound"), TOAST_REJECT_DURATION_MS);
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
  dom.blackBar.style.width = `${Math.min(BAR_MAX_WIDTH, Math.max(BAR_MIN_WIDTH, rect.width + 22))}px`;
  setBarSource("snap");
  setBarCenter(rect.left + rect.width / 2, rect.top + rect.height / 2);
  state.locked = true;
  syncLanguageControls();
  dom.blackBar.classList.add("is-locked");
  ping("snap");
  triggerManifestEvent("bar_snap", index);
  const version = state.transitionVersion;
  scheduleTransition(() => applySelection(index, version), SELECTION_SNAP_DELAY_MS);
}

function applyFlags(flags = []) {
  for (const flag of flags) {
    const match = /^([a-z_]+)([+-])$/.exec(flag);
    if (!match) continue;
    const [, name, operator] = match;
    state.flags[name] = Math.max(0, (state.flags[name] ?? 0) + (operator === "+" ? 1 : -1));
  }
}

function applySelection(index, version = state.transitionVersion) {
  if (version !== state.transitionVersion || !state.locked) return;
  const line = currentLine();
  const zone = line?.zones?.[index];
  if (!line || !zone) return;
  getZones()
    .filter((item) => Number(item.dataset.zoneIndex) === index)
    .forEach((item) => item.classList.add("is-eaten"));
  applyFlags(zone.flags);
  state.eatLog.push({ chapterId: currentChapter().id, lineId: line.id, zoneId: zone.id });
  dom.feedbackCopy.textContent = zone.npc || t("ui.swallowedNpcFallback");
  dom.statusCopy.textContent = zone.eat ? t("ui.swallowed", { text: zone.eat }) : t("ui.swallowedFallback");
  appendLiveChat(zone.npc || t("ui.swallowedFallback"));
  showToast(zone.npc || t("ui.swallowedFallback"), TOAST_SELECTION_DURATION_MS);
  triggerFeedback("snap", index);
  triggerManifestEvent("censor_absorb", index);
  triggerManifestEvent("dialogue_refresh", index, FEEDBACK_DIALOGUE_REFRESH_DELAY_MS);
  if (zone.flags?.some((flag) => flag.startsWith("risk"))) triggerFeedback("reject", index, FEEDBACK_RISK_DELAY_MS);
  triggerManifestEvent("bar_reject", index, FEEDBACK_RISK_DELAY_MS);
  const transition = commitSelection(zone, line);
  saveState();
  scheduleTransition(() => continueAfterSelection(transition, version), SELECTION_FEEDBACK_DELAY_MS);
}

function commitSelection(zone, line) {
  if (line.is_ending) {
    const endingId = zone.ending ?? "A_separate";
    state.endingId = endingId;
    return { kind: "ending", endingId };
  }
  state.lineIndex += 1;
  return {
    kind: state.lineIndex >= currentChapter().lines.length ? "chapter" : "line",
  };
}

function continueAfterSelection(transition, version) {
  if (version !== state.transitionVersion) return;
  if (transition.kind === "ending") {
    void finishEnding(transition.endingId, version).catch((error) => {
      if (version !== state.transitionVersion) return;
      console.error(error);
      state.locked = false;
      showToast(t("ui.endingSceneFailed"), TOAST_FAILURE_DURATION_MS);
    });
    return;
  }
  if (transition.kind === "chapter") {
    finishChapter();
    return;
  }
  scheduleTransition(() => {
    if (version === state.transitionVersion) renderLine();
  }, LINE_RENDER_DELAY_MS);
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
      window.setTimeout(() => sprite.remove(), FX_REMOVE_DELAY_MS);
    }
  };
  const version = state.transitionVersion;
  const run = () => {
    if (version !== state.transitionVersion) return;
    schedule();
  };
  if (delay) scheduleTransition(run, delay); else run();
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
    void playChapterOutroThenAdvance(chapter);
    return;
  }
  if (!memoryDraftMatches(state.memoryDraft, chapter.id, fragments)) {
    state.memoryDraft = { chapterId: chapter.id, fragments, order: [] };
  }
  hideOverlay();
  state.locked = true;
  dom.memoryEyebrow.textContent = t("ui.memoryEyebrow", { chapterId: chapter.id });
  dom.memoryTitle.textContent = t("ui.memoryTitle");
  dom.memoryCopy.textContent = t("ui.memoryCopy");
  renderMemoryDraft();
  dom.memoryOverlay.classList.remove("is-hidden");
  syncLanguageControls();
  saveState();
}

function hideMemoryOverlay() {
  const drag = state.memoryDrag;
  if (drag?.pointerId !== undefined && drag.element?.hasPointerCapture?.(drag.pointerId)) {
    drag.element.releasePointerCapture(drag.pointerId);
  }
  dom.memoryOverlay.classList.add("is-hidden");
  state.memoryDrag = null;
  state.suppressMemoryClick = false;
  syncLanguageControls();
}

function confirmMemory() {
  const draft = state.memoryDraft;
  if (!draft || draft.order.length !== draft.fragments.length) return;
  state.memoryByChapter[draft.chapterId] = [...draft.order];
  state.memoryDraft = null;
  ping("snap");
  saveState();
  hideMemoryOverlay();
  void playChapterOutroThenAdvance(currentChapter());
}

function finishChapter() {
  const chapter = currentChapter();
  if (LIVE_CHAPTER_IDS.has(chapter?.id)) hideLiveChat();
  if (chapter.id === "L1" && chapterResult(chapter) === "fail") {
    hideOverlay();
    state.locked = true;
    void playChapterOutro("L1_fail_retry", () => {
      if (currentChapter()?.id !== "L1") return;
      state.locked = true;
      syncLanguageControls();
      showOverlay(
        t("ui.retryInterviewEyebrow"),
        t("ui.retryInterviewTitle"),
        t("ui.retryInterviewAction"),
        () => restartChapter(),
        t("ui.retryInterviewToast"),
      );
    });
    return;
  }
  if (state.chapterIndex >= state.chapters.length - 1) return;
  const chapterOverlay = localeValue(`game.chapterOverlays.${chapter.id}`, null);
  const title = chapterOverlay?.title ?? t("ui.nextChapter");
  const copy = chapterOverlay?.copy ?? t("ui.nextChapterCopy");
  const action = MEMORY_CHAPTER_IDS.has(chapter.id)
    ? () => openMemoryOverlay(chapter)
    : () => void playChapterOutroThenAdvance(chapter);
  showOverlay(t("ui.chapterEnded"), title, copy, action);
}

function nextChapter() {
  cancelTransitionTimers();
  hideOverlay();
  hideMemoryOverlay();
  state.endingId = null;
  state.chapterIndex += 1;
  state.lineIndex = 0;
  state.selectedZone = null;
  state.locked = false;
  syncLanguageControls();
  saveState();
  setScene(currentChapter(), currentLine(), true);
  renderLine();
}

function restartChapter() {
  cancelTransitionTimers();
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
  syncLanguageControls();
  state.selectedZone = null;
  saveState();
  setScene(currentChapter(), currentLine(), true);
  renderLine();
}

async function playRevealSequence() {
  hideOverlay();
  state.locked = true;
  try {
    await playStorySequence("reveal", { reveal: true });
    showOverlay(
      t("ui.replayEyebrow"),
      t("ui.replayTitle"),
      t("ui.replayCopy"),
      () => restartGame(),
      t("ui.replayAction"),
    );
  } catch (error) {
    console.error(error);
    showToast(t("ui.revealVideoFailed"), TOAST_FAILURE_DURATION_MS);
    showOverlay(
      t("ui.replayEyebrow"),
      t("ui.replayTitle"),
      t("ui.revealVideoFallback"),
      () => restartGame(),
      t("ui.replayAction"),
    );
  }
}

async function finishEnding(endingId, expectedTransitionVersion = null, { playSequence = true } = {}) {
  if (expectedTransitionVersion !== null && expectedTransitionVersion !== state.transitionVersion) return false;
  const pageId = state.pages?.endingPages?.[endingId];
  if (!pageId) throw new Error(`结局页面不存在: ${endingId}`);
  state.endingId = endingId;
  state.locked = true;
  syncLanguageControls();
  syncBgmForLocation(null, endingId);
  saveState();
  if (playSequence) {
    try {
      await playStorySequence(endingId);
    } catch (error) {
      console.error(error);
      showToast(t("ui.endingVideoFailed"), TOAST_FAILURE_DURATION_MS);
    }
  }
  const loaded = await setScenePage(pageId, false);
  if (!loaded || (expectedTransitionVersion !== null && expectedTransitionVersion !== state.transitionVersion)) {
    return false;
  }
  dom.stage.dataset.ending = endingId;
  state.locked = true;
  syncLanguageControls();
  const endingTitle = localeValue(`game.endingTitles.${endingId}`, t("ui.endingFallbackTitle"));
  const endingCopy = state.data.endings?.[endingId] ?? "";
  showOverlay(
    t("ui.endingEyebrow", { endingId }),
    endingTitle,
    endingCopy,
    () => void playRevealSequence(),
    t("ui.watchReveal"),
  );
  return true;
}

function showOverlay(eyebrow, title, copy, action, actionLabel = t("ui.continue")) {
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
  cancelStoryVideo();
  cancelTransitionTimers();
  hideLiveChat();
  clearTimeout(state.toastTimer);
  state.toastTimer = null;
  dom.toast.classList.remove("is-visible");
  if (state.pointerId !== null && dom.blackBar.hasPointerCapture?.(state.pointerId)) {
    dom.blackBar.releasePointerCapture(state.pointerId);
  }
  state.dragging = false;
  state.pointerId = null;
  state.dragOffsetX = 0;
  state.dragOffsetY = 0;
  storageRemove(SAVE_KEY);
  state.chapterIndex = 0;
  state.lineIndex = 0;
  state.flags = {};
  state.eatLog = [];
  state.memoryByChapter = {};
  state.memoryDraft = null;
  state.endingId = null;
  state.hasSave = false;
  state.pendingMigrationNotice = false;
  state.locked = false;
  syncLanguageControls();
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
  const chapter = currentChapter();
  const line = currentLine();
  const saved = storageSet(SAVE_KEY, JSON.stringify({
    schemaVersion: 2,
    position: {
      chapterId: chapter?.id ?? "L0",
      lineId: line?.id ?? null,
    },
    flags: state.flags,
    selections: state.eatLog,
    memoryByChapter: state.memoryByChapter,
    memoryDraft: state.memoryDraft ? {
      chapterId: state.memoryDraft.chapterId,
      fragmentIds: state.memoryDraft.fragments.map((fragment) => fragment.id),
      order: state.memoryDraft.order,
    } : null,
    endingId: state.endingId,
  }));
  if (saved) {
    state.hasSave = true;
  } else {
    state.hasSave = false;
    console.warn("save unavailable");
  }
}

function restoreState() {
  state.hasSave = false;
  state.pendingMigrationNotice = false;
  const raw = storageGet(SAVE_KEY);
  try {
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) throw new Error("存档格式无效");
    const endingIds = new Set(Object.keys(state.pages?.endingPages ?? {}));
    if (saved.endingId !== null && saved.endingId !== undefined && !endingIds.has(saved.endingId)) {
      throw new Error("存档结局无效");
    }
    if (saved.flags !== undefined
      && (!saved.flags || typeof saved.flags !== "object" || Array.isArray(saved.flags))) {
      throw new Error("存档状态无效");
    }
    if (saved.schemaVersion === 2) {
      const position = saved.position;
      if (!position || typeof position.chapterId !== "string") throw new Error("存档位置无效");
      const chapterIndex = state.chapters.findIndex((chapter) => chapter.id === position.chapterId);
      if (chapterIndex < 0) throw new Error("存档章节无效");
      const lines = state.chapters[chapterIndex]?.lines ?? [];
      const lineIndex = position.lineId === null
        ? lines.length
        : lines.findIndex((line) => line.id === position.lineId);
      if (lineIndex < 0) throw new Error("存档台词无效");
      state.chapterIndex = chapterIndex;
      state.lineIndex = lineIndex;
      state.flags = saved.flags ?? {};
      state.eatLog = normalizeSelections(saved.selections);
      state.memoryByChapter = normalizeMemoryByChapter(saved.memoryByChapter);
      state.memoryDraft = normalizeMemoryDraft(saved.memoryDraft);
      state.endingId = typeof saved.endingId === "string" ? saved.endingId : null;
      state.hasSave = true;
      return;
    }

    // Legacy saves persist translated text and cannot reliably be mapped to a
    // zone (several selectable texts are duplicated). Preserve progression only.
    const chapterIndex = saved.chapterIndex;
    const lineIndex = saved.lineIndex;
    const lines = state.chapters[chapterIndex]?.lines ?? [];
    if (!Number.isSafeInteger(chapterIndex) || chapterIndex < 0 || chapterIndex >= state.chapters.length
      || !Number.isSafeInteger(lineIndex) || lineIndex < 0 || lineIndex > lines.length) {
      throw new Error("旧版存档位置无效");
    }
    state.chapterIndex = chapterIndex;
    state.lineIndex = lineIndex;
    state.flags = saved.flags ?? {};
    state.eatLog = [];
    state.memoryByChapter = {};
    state.memoryDraft = null;
    state.endingId = typeof saved.endingId === "string" ? saved.endingId : null;
    state.hasSave = true;
    state.pendingMigrationNotice = true;
    saveState();
  } catch (error) {
    storageRemove(SAVE_KEY);
    console.warn("discarding invalid save", error.message);
  }
}

function readDebugParam(params, key) {
  const values = params.getAll(key);
  if (!values.length) return { present: false, value: null };
  if (values.length !== 1 || !values[0]) throw new Error(`调试参数 ${key} 必须只有一个非空值`);
  return { present: true, value: values[0] };
}

function parseDebugLocation() {
  const params = new URLSearchParams(window.location.search);
  const values = Object.fromEntries([...DEBUG_KEYS].map((key) => [key, readDebugParam(params, key)]));
  const active = [...DEBUG_KEYS].some((key) => values[key].present);
  if (!active) return { active: false };

  const chapterId = values.chapter.value;
  const lineId = values.line.value;
  const endingId = values.ending.value;
  if (values.ending.present && (values.chapter.present || values.line.present)) {
    throw new Error("调试结局不能同时指定章节或台词");
  }
  if (values.line.present && !values.chapter.present) {
    throw new Error("调试台词必须同时指定 chapter");
  }
  if (values.ending.present) {
    const endingPages = state.pages?.endingPages ?? {};
    if (!Object.prototype.hasOwnProperty.call(endingPages, endingId)) {
      throw new Error(`未知调试结局: ${endingId}`);
    }
    const chapterIndex = state.chapters.findIndex((chapter) => chapter.id === "L5");
    if (chapterIndex < 0) throw new Error("找不到终局章节 L5");
    return {
      active: true,
      endingId,
      chapterIndex,
      lineIndex: Math.max(0, (state.chapters[chapterIndex].lines?.length ?? 1) - 1),
    };
  }

  const chapterIndex = state.chapters.findIndex((chapter) => chapter.id === chapterId);
  if (chapterIndex < 0) throw new Error(`未知调试章节: ${chapterId}`);
  const lines = state.chapters[chapterIndex].lines ?? [];
  const lineIndex = values.line.present ? lines.findIndex((line) => line.id === lineId) : 0;
  if (lineIndex < 0) throw new Error(`台词不属于 ${chapterId}: ${lineId}`);
  return { active: true, chapterId, lineId: lineId ?? null, chapterIndex, lineIndex };
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
  dom.titlePrimary.textContent = hasSave ? t("ui.titlePrimaryContinue") : t("ui.titlePrimaryNew");
  dom.titleNewGame.classList.toggle("is-hidden", !hasSave);
  dom.titleStatus.textContent = state.pendingMigrationNotice
    ? t("ui.oldSaveMigrated")
    : (hasSave ? t("ui.titleHasSave") : t("ui.titleReady"));
  state.titleReady = true;
  syncLanguageControls();
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
  syncLanguageControls();
}

function closeTitleScreen() {
  dom.titleScreen.classList.add("is-leaving");
  dom.titleScreen.setAttribute("aria-hidden", "true");
  dom.titleScreen.inert = true;
  dom.titlePrimary.disabled = true;
  dom.titleNewGame.disabled = true;
  syncLanguageControls();
  window.setTimeout(() => {
    dom.titleScreen.classList.add("is-hidden");
    dom.app.classList.remove("is-title-screen");
  }, TITLE_CLOSE_DELAY_MS);
}

async function startGame(mode = "continue") {
  if (!state.titleReady || state.titleStarting) return;
  state.titleStarting = true;
  syncLanguageControls();
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
      await finishEnding(endingId, null, { playSequence: false });
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
    dom.titleStatus.textContent = t("ui.endingSceneFailed");
    dom.titlePrimary.disabled = false;
    dom.titleNewGame.disabled = false;
  } finally {
    state.titleStarting = false;
    syncLanguageControls();
  }
}

function applyDebugLocation(location) {
  if (!location?.active) return;
  state.chapterIndex = location.chapterIndex;
  state.lineIndex = location.lineIndex;
  state.endingId = location.endingId ?? null;
  // A debug URL is an explicit location request; an interrupted memory draft
  // from local storage must not hijack the requested chapter or line.
  state.memoryDraft = null;
}

function audioContext() {
  if (!state.audioContext) state.audioContext = new AudioContext();
  return state.audioContext;
}

function ping(kind) {
  if (!state.sound || state.audioSettings.sfxVolume <= 0) return;
  try {
    const context = audioContext();
    if (context.state === "suspended") void context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const peak = 0.035 * state.audioSettings.sfxVolume;
    oscillator.frequency.value = { pick: 152, snap: 218, reject: 78 }[kind] ?? 140;
    oscillator.type = kind === "reject" ? "sawtooth" : "sine";
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), context.currentTime + 0.012);
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
  dom.titleLanguageSelect.addEventListener("change", (event) => {
    void switchLocale(event.target.value, { persist: true });
  });
  dom.languageMenuButton.addEventListener("click", () => {
    if (languageSwitchLocked()) return;
    const opening = dom.languageMenu.classList.contains("is-hidden");
    dom.languageMenu.classList.toggle("is-hidden", !opening);
    dom.languageMenuButton.setAttribute("aria-expanded", String(opening));
  });
  dom.audioSettingsButton.addEventListener("click", toggleAudioSettings);
  dom.audioSettingsClose.addEventListener("click", closeAudioSettings);
  dom.audioEnabled.addEventListener("change", () => setAudioEnabled(dom.audioEnabled.checked));
  dom.musicVolume.addEventListener("input", (event) => setMusicVolume(event.target.value));
  dom.sfxVolume.addEventListener("input", (event) => setSfxVolume(event.target.value));
  dom.memoryOverlay.addEventListener("pointermove", onMemoryPointerMove);
  dom.memoryOverlay.addEventListener("pointerup", onMemoryPointerUp);
  dom.memoryOverlay.addEventListener("pointercancel", onMemoryPointerCancel);
  document.addEventListener("pointerdown", () => {
    if (state.debugMode && !state.bgm.started) startBgm();
  }, { capture: true });
  document.addEventListener("pointerdown", (event) => {
    if (dom.audioSettings.classList.contains("is-hidden")) return;
    if (!dom.audioSettings.contains(event.target) && event.target !== dom.audioSettingsButton) closeAudioSettings();
  }, { capture: true });
  document.addEventListener("pointerdown", (event) => {
    if (dom.languageMenu.classList.contains("is-hidden")) return;
    if (!dom.languageMenu.contains(event.target) && event.target !== dom.languageMenuButton) closeLanguageMenu();
  }, { capture: true });
  window.addEventListener("resize", () => {
    if (state.dialogueLayout) layoutDialogueZones();
    if (!state.dragging && !state.locked) positionBarAtRest();
    if (state.hoverZone !== null) setNearestZone(state.hoverZone);
  });
  window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "r" && dom.titleScreen.classList.contains("is-hidden")) restartGame();
    if (event.key === "Escape" && !dom.audioSettings.classList.contains("is-hidden")) {
      event.preventDefault();
      closeAudioSettings();
      return;
    }
    if (event.key === "Escape" && !dom.memoryOverlay.classList.contains("is-hidden")) {
      event.preventDefault();
      return;
    }
    if (event.key === "Escape" && !dom.overlay.classList.contains("is-hidden")) {
      event.preventDefault();
      return;
    }
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
        const start = dialogueZoneStart(line.raw, zone);
        if (start < 0
          || start + zone.text.length > line.raw.length
          || line.raw.slice(start, start + zone.text.length) !== zone.text) {
          throw new Error(`${line.id} 的遮挡区不在原句中`);
        }
        if (Number.isInteger(zone.start) && zone.start < 0) {
          throw new Error(`${line.id} 的遮挡区起点无效`);
        }
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
      fetch(LOCALE_MANIFEST_URL, fetchOptions),
      fetch(PLAYABLE_MANIFEST_URL, fetchOptions),
      fetch(PAGE_MANIFEST_URL, fetchOptions),
      fetch(AUDIO_MANIFEST_URL, fetchOptions),
      fetch(VIDEO_MANIFEST_URL, fetchOptions),
    ]);
    if (responses.some((response) => !response.ok)) throw new Error("Runtime data unavailable");
    state.baseData = await responses[0].json();
    state.localeManifest = await responses[1].json();
    state.playable = await responses[2].json();
    state.pages = await responses[3].json();
    state.audio = await responses[4].json();
    state.video = await responses[5].json();
    if (state.localeManifest?.schemaVersion !== 1 || !Array.isArray(state.localeManifest?.locales)) {
      throw new Error("Locale manifest is invalid");
    }
    const fallbackLocale = defaultLocaleDescriptor();
    if (!fallbackLocale) throw new Error("Locale manifest has no default locale");
    state.fallbackLocaleData = await fetchLocaleData(fallbackLocale);
    let selectedLocale = requestedLocaleDescriptor() ?? fallbackLocale;
    let selectedData = state.fallbackLocaleData;
    if (selectedLocale.id !== fallbackLocale.id) {
      try {
        selectedData = await fetchLocaleData(selectedLocale);
      } catch (error) {
        console.warn(error);
        selectedLocale = fallbackLocale;
      }
    }
    state.locale = selectedLocale;
    state.localeData = selectedData;
    state.data = { ...state.baseData, endings: selectedData.game?.endings ?? {} };
    state.chapters = joinLocalizedChapters(state.baseData, selectedData);
    restoreAudioSettings();
    state.assets = new Map((state.playable.assets ?? []).map((asset) => [asset.id, asset]));
    state.pageAssets = new Map((state.pages.assets ?? []).map((asset) => [asset.id, asset]));
    if (!state.chapters.length || !state.assets.size || !state.pageAssets.size) throw new Error("章节或资产为空");
    applyLocaleText();
    validateBindings();
    validateAudioManifest();
    validateVideoManifest();
    state.revealSeen = storageGet(REVEAL_SEEN_KEY) === "1";
    const debugLocation = parseDebugLocation();
    restoreState();
    applyDebugLocation(debugLocation);
    state.debugMode = debugLocation.active;
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
      await finishEnding(state.endingId, null, { playSequence: false });
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
    dom.errorCopy.textContent = `${t("ui.runtimeDataMissing", {}, "Runtime data is unavailable.")} ${t("ui.loadErrorSuffix", {}, "Please open the game through a local web server.")}`;
    dom.errorPanel.classList.remove("is-hidden");
  }
}

bindEvents();
load();
