import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const videoRoot = resolve(repositoryRoot, "web", "video");
const manifestPath = resolve(videoRoot, "manifest.json");
const sceneManifestPath = resolve(repositoryRoot, "art", "v4", "scenes", "manifest.json");
const errors = [];
const warnings = [];

const expectedSequences = {
  A_separate: [
    ["K15_L5_A_release", "PAGE_L5_empty"],
    ["K16_END_A_hold", "PAGE_END_A_separate"],
  ],
  B_alienate: [
    ["K17_L5_B_offset", "PAGE_L5_empty"],
    ["K18_END_B_hold", "PAGE_END_B_alienate"],
  ],
  C_consume: [
    ["K19_L5_C_drop", "PAGE_L5_empty"],
    ["K20_END_C_hold", "PAGE_END_C_hollow"],
  ],
  C_cold: [
    ["K19_L5_C_drop", "PAGE_L5_empty"],
    ["K20_END_C_hold", "PAGE_END_C_hollow"],
  ],
  reveal: [
    ["K21_RV_interview_hold", "PAGE_L1_interview"],
    ["K22_RV_poster_hold", "PAGE_L5_poster"],
  ],
};

const expectedChapterOutros = {
  L0_to_L1: [
    ["K01_L0_ink", "PAGE_L0_desk", 5],
    ["K02_L0_door", "PAGE_L0_desk", 5],
  ],
  L1_pass_to_L2: [
    ["K03_L1_nod", "PAGE_L1_interview", 5],
    ["K04_L1_ink", "PAGE_L1_interview", 5],
  ],
  L1_fail_retry: [
    ["K05_L1_fail_light", "PAGE_L1_interview", 3],
    ["K06_L1_fail_shatter", "PAGE_L1_interview", 3],
  ],
  L2_to_L3: [
    ["K07_L2_indicator", "PAGE_L2_live", 5],
    ["K08_L2_creature", "PAGE_L2_live", 5],
  ],
  L3_to_L4: [
    ["K09_L3_door_close", "PAGE_L3_door_default", 5],
    ["K10_L3_stage2", "PAGE_L3_door_default", 5],
  ],
  L4_perform_to_L5: [
    ["K11_L4_live_off", "PAGE_L4_apology", 5],
    ["K12_L4_stack", "PAGE_L4_apology", 5],
  ],
  L4_refuse_to_L5: [
    ["K13_L4_refuse_cable", "PAGE_L4_apology", 5],
    ["K14_L4_refuse_echo", "PAGE_L4_apology", 5],
  ],
};

function readJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`${label} 无法读取: ${error.message}`);
    return null;
  }
}

function resolveVideoPath(path, label) {
  if (typeof path !== "string" || !path) {
    errors.push(`${label} 缺少视频路径`);
    return null;
  }
  const target = resolve(videoRoot, path);
  const prefix = `${videoRoot}${sep}`;
  if (!target.startsWith(prefix)) {
    errors.push(`${label} 越过 web/video 根目录: ${path}`);
    return null;
  }
  if (!path.startsWith("kling/") || !path.toLowerCase().endsWith(".mp4")) {
    errors.push(`${label} 必须是 kling/ 下的 MP4: ${path}`);
  }
  return target;
}

function parseRate(rate) {
  if (typeof rate !== "string") return Number.NaN;
  const [numerator, denominator] = rate.split("/").map(Number);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return Number.NaN;
  }
  return numerator / denominator;
}

function probeVideo(path, label, expectedDuration) {
  const result = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "stream=codec_type,codec_name,width,height,avg_frame_rate,duration:format=duration",
      "-of",
      "json",
      path,
    ],
    { encoding: "utf8" },
  );

  if (result.error?.code === "ENOENT") {
    warnings.push("未找到 ffprobe，已跳过视频编码、尺寸、帧率和时长检查");
    return;
  }
  if (result.error) {
    errors.push(`${label} ffprobe 启动失败: ${result.error.message}`);
    return;
  }
  if (result.status !== 0) {
    errors.push(`${label} ffprobe 失败: ${(result.stderr || "未知错误").trim()}`);
    return;
  }

  let metadata;
  try {
    metadata = JSON.parse(result.stdout);
  } catch (error) {
    errors.push(`${label} ffprobe 输出不是有效 JSON: ${error.message}`);
    return;
  }
  const stream = (metadata.streams ?? []).find((item) => item.codec_type === "video");
  if (!stream) {
    errors.push(`${label} 没有视频流`);
    return;
  }
  if (stream.codec_name !== "h264") errors.push(`${label} 编码必须是 H.264: ${stream.codec_name ?? "未知"}`);
  if (stream.width !== 1920 || stream.height !== 1080) {
    errors.push(`${label} 尺寸必须是 1920x1080: ${stream.width ?? "?"}x${stream.height ?? "?"}`);
  }
  const frameRate = parseRate(stream.avg_frame_rate);
  if (!Number.isFinite(frameRate) || Math.abs(frameRate - 24) > 0.1) {
    errors.push(`${label} 帧率必须约为 24fps: ${stream.avg_frame_rate ?? "未知"}`);
  }
  const duration = Number(stream.duration ?? metadata.format?.duration);
  if (!Number.isFinite(duration) || Math.abs(duration - expectedDuration) > 0.3) {
    errors.push(`${label} 时长应约为 ${expectedDuration}s: ${Number.isFinite(duration) ? duration : "未知"}`);
  }
}

function validateClipCollection({ collection, expected, labelPrefix, scenePages, clipDefinitions }) {
  if (!collection || typeof collection !== "object" || Array.isArray(collection)) {
    errors.push(`${labelPrefix}清单缺失或格式无效`);
    return;
  }
  const actualIds = Object.keys(collection).sort();
  const expectedIds = Object.keys(expected).sort();
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
    errors.push(`${labelPrefix}必须正好包含: ${expectedIds.join(", ")}`);
  }

  for (const [sequenceId, expectedClips] of Object.entries(expected)) {
    const sequence = collection[sequenceId];
    if (!sequence || !Array.isArray(sequence.clips)) {
      errors.push(`${labelPrefix} ${sequenceId} 缺少 clips 数组`);
      continue;
    }
    if (sequence.clips.length !== expectedClips.length) {
      errors.push(`${labelPrefix} ${sequenceId} 必须包含 ${expectedClips.length} 个视频`);
    }
    expectedClips.forEach(([expectedId, expectedPage, expectedDuration], index) => {
      const label = `${labelPrefix} ${sequenceId} 视频 ${index + 1}`;
      const clip = sequence.clips[index];
      if (!clip || clip.id !== expectedId) {
        errors.push(`${label} ID 应为 ${expectedId}: ${clip?.id ?? "缺失"}`);
        return;
      }
      if (clip.beforePage !== expectedPage) {
        errors.push(`${label} beforePage 应为 ${expectedPage}: ${clip.beforePage ?? "缺失"}`);
      }
      if (!scenePages.has(clip.beforePage)) {
        errors.push(`${label} 引用了不存在的场景页: ${clip.beforePage ?? "缺失"}`);
      }
      if (!Number.isFinite(clip.duration) || clip.duration <= 0) {
        errors.push(`${label} duration 必须为正数`);
      }
      if (expectedDuration !== undefined && clip.duration !== expectedDuration) {
        errors.push(`${label} duration 应为 ${expectedDuration}s: ${clip.duration ?? "缺失"}`);
      }
      const target = resolveVideoPath(clip.path, label);
      if (!target) return;
      if (!existsSync(target)) {
        errors.push(`${label} 文件不存在: ${relative(repositoryRoot, target)}`);
        return;
      }
      const stats = statSync(target);
      if (!stats.isFile() || stats.size === 0) {
        errors.push(`${label} 文件为空或不是普通文件: ${relative(repositoryRoot, target)}`);
        return;
      }
      const definition = JSON.stringify({ path: clip.path, beforePage: clip.beforePage, duration: clip.duration });
      if (clipDefinitions.has(clip.id) && clipDefinitions.get(clip.id) !== definition) {
        errors.push(`${label} 与同 ID 视频定义不一致: ${clip.id}`);
      } else {
        clipDefinitions.set(clip.id, definition);
      }
      if (process.env.SKIP_FFPROBE !== "1" && !clipDefinitions.get(`${clip.id}:probed`)) {
        probeVideo(target, label, clip.duration);
        clipDefinitions.set(`${clip.id}:probed`, true);
      }
    });
  }
}

const manifest = readJson(manifestPath, "运行时视频清单");
const sceneManifest = readJson(sceneManifestPath, "场景清单");
if (!manifest || !sceneManifest) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  if (manifest.schemaVersion !== 1) errors.push("运行时视频清单 schemaVersion 必须为 1");
  if (manifest.format !== "video/mp4") errors.push("运行时视频清单 format 必须为 video/mp4");
  if (manifest.default?.muted !== true) errors.push("运行时视频必须默认静音");
  if (manifest.default?.playsInline !== true) errors.push("运行时视频必须默认 playsInline");

  const scenePages = new Set(sceneManifest.scenePages ?? []);
  const sequences = manifest.sequences;
  if (!sequences || typeof sequences !== "object" || Array.isArray(sequences)) {
    errors.push("运行时视频清单缺少 sequences 对象");
  } else {
    const clipDefinitions = new Map();
    validateClipCollection({
      collection: sequences,
      expected: expectedSequences,
      labelPrefix: "序列",
      scenePages,
      clipDefinitions,
    });

    const chapterOutros = manifest.chapterOutros;
    validateClipCollection({
      collection: chapterOutros,
      expected: expectedChapterOutros,
      labelPrefix: "章节过场",
      scenePages,
      clipDefinitions,
    });

    const expectedClipIds = new Set([
      ...Object.values(expectedSequences).flat().map(([id]) => id),
      ...Object.values(expectedChapterOutros).flat().map(([id]) => id),
    ]);
    if (clipDefinitions.size && [...clipDefinitions.keys()].some((id) => !id.endsWith(":probed") && !expectedClipIds.has(id))) {
      errors.push("运行时视频清单包含未批准的镜头 ID");
    }
    if (clipDefinitions.size - [...clipDefinitions.keys()].filter((id) => id.endsWith(":probed")).length !== expectedClipIds.size) {
      errors.push(`运行时视频必须包含 ${expectedClipIds.size} 个唯一 MP4`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  if (warnings.length) console.error(warnings.map((warning) => `! ${warning}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Runtime videos OK: 12 sequences, 22 unique MP4 assets, 1920x1080 H.264 @ 24fps");
  if (warnings.length) console.log(warnings.map((warning) => `! ${warning}`).join("\n"));
}
