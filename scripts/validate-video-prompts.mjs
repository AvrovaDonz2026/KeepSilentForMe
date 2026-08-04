import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(repositoryRoot, "video", "prompts", "minimax-h3", "manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const errors = [];
const ids = new Set();
let alternativeCount = 0;
const [width, height] = manifest.canvas ?? [];

function fileFromRepo(relativePath, label) {
  if (typeof relativePath !== "string" || !relativePath) {
    errors.push(`${label} 缺少路径`);
    return null;
  }
  const target = resolve(repositoryRoot, relativePath);
  const prefix = `${repositoryRoot}${sep}`;
  if (!target.startsWith(prefix)) {
    errors.push(`${label} 越过仓库根目录: ${relativePath}`);
    return null;
  }
  if (!existsSync(target)) errors.push(`${label} 不存在: ${relativePath}`);
  return target;
}

if (!Array.isArray(manifest.assets) || manifest.assets.length !== 11) {
  errors.push("H3 manifest 应包含 11 条视频资产");
}
if (!Number.isInteger(width) || !Number.isInteger(height) || width % 32 || height % 32) {
  errors.push("H3 画布尺寸必须是 32 的倍数");
}
if (typeof manifest.commonNegativePrompt !== "string" || !manifest.commonNegativePrompt.trim()) {
  errors.push("H3 manifest 缺少公共负面提示");
}
const hardLockPath = fileFromRepo(manifest.hardLock, "公共硬约束");
const negativePromptPath = fileFromRepo(manifest.negativePrompt, "公共负面提示文件");
if (hardLockPath && !readFileSync(hardLockPath, "utf8").includes("HARD LOCK")) {
  errors.push("公共硬约束文件缺少 HARD LOCK 标记");
}
if (negativePromptPath && !readFileSync(negativePromptPath, "utf8").trim()) {
  errors.push("公共负面提示文件为空");
}
const alternativesPath = fileFromRepo(manifest.alternatives, "备选提示词清单");
if (alternativesPath) {
  let alternatives;
  try {
    alternatives = JSON.parse(readFileSync(alternativesPath, "utf8"));
  } catch (error) {
    errors.push(`备选提示词清单 JSON 无效: ${error.message}`);
  }
  if (!Array.isArray(alternatives?.alternatives) || alternatives.alternatives.length !== 8) {
    errors.push("备选提示词清单应包含 8 条提示词");
  }
  alternativeCount = alternatives?.alternatives?.length ?? 0;
  for (const [index, alternative] of (alternatives?.alternatives ?? []).entries()) {
    const label = `备选提示词 ${index + 1}`;
    const path = fileFromRepo(alternative?.prompt, `${label} prompt`);
    if (path) {
      const prompt = readFileSync(path, "utf8");
      if (!prompt.trim() || !prompt.includes("强化备选")) errors.push(`${label} 内容无效`);
    }
    if (!alternative?.baseVideo) errors.push(`${label} 缺少 baseVideo`);
  }
}

for (const [index, asset] of (manifest.assets ?? []).entries()) {
  const label = `视频 ${index + 1}`;
  if (!asset?.id || ids.has(asset.id)) errors.push(`${label} ID 缺失或重复: ${asset?.id ?? ""}`);
  ids.add(asset?.id);
  const promptPath = fileFromRepo(asset?.prompt, `${label} prompt`);
  if (promptPath) {
    const prompt = readFileSync(promptPath, "utf8");
    if (!prompt.trim()) errors.push(`${label} prompt 为空`);
    if (!prompt.includes("最高优先级硬约束") || !prompt.includes("严禁")) {
      errors.push(`${label} prompt 缺少强化约束段`);
    }
  }
  fileFromRepo(asset?.firstFrame, `${label} 首帧`);
  if (asset?.lastFrame) fileFromRepo(asset.lastFrame, `${label} 末帧`);
  if (!Number.isInteger(asset?.duration) || asset.duration < 1) errors.push(`${label} 时长无效`);
  if (typeof asset?.output !== "string" || !asset.output.endsWith(".mp4")) {
    errors.push(`${label} 输出必须是 MP4: ${asset?.output ?? ""}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`H3 video prompts OK: ${ids.size} primary + ${alternativeCount} alternatives, ${width}x${height}`);
}
