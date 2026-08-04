import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(repositoryRoot, "video", "prompts", "kling", "manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const errors = [];
const ids = new Set();

function repoFile(relativePath, label) {
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

if (manifest.model !== "kling-video-v3_0") {
  errors.push("Kling 单场景清单必须默认使用 who_am_i 返回的 kling-video-v3_0");
}
if (manifest.mode !== "image_to_video") errors.push("Kling 清单 mode 必须是 image_to_video");
if (manifest.preferMultiShots !== false) errors.push("单场景清单必须关闭 preferMultiShots");
if (manifest.enableAudio !== false) errors.push("游戏视频必须关闭 enableAudio");
repoFile(manifest.commonPrompt, "公共单场景约束");

const omni = manifest.omni;
if (omni?.model !== "kling-video-v3_0_omni") {
  errors.push("Omni 参考图清单必须使用 kling-video-v3_0_omni");
}
if (omni?.preferMultiShots !== false) errors.push("Omni 单场景清单必须关闭 preferMultiShots");
if (omni?.enableAudio !== false) errors.push("Omni 游戏视频必须关闭 enableAudio");
if (omni?.videoReferenceSupported !== false) errors.push("当前 Omni 清单必须明确不支持视频文件输入");
const omniPrefixPath = repoFile(omni?.promptPrefix, "Omni 参考图前缀");
if (omniPrefixPath) {
  const prefix = readFileSync(omniPrefixPath, "utf8");
  if (!prefix.includes("图片1") || !prefix.includes("图片2")) {
    errors.push("Omni 参考图前缀必须说明图片1和图片2的引用规则");
  }
}

if (!Array.isArray(manifest.assets) || manifest.assets.length !== 22) {
  errors.push("Kling 单场景清单应包含 22 条镜头");
}

for (const [index, asset] of (manifest.assets ?? []).entries()) {
  const label = `镜头 ${index + 1}`;
  if (!asset?.id || ids.has(asset.id)) errors.push(`${label} ID 缺失或重复: ${asset?.id ?? ""}`);
  ids.add(asset?.id);
  const promptPath = repoFile(asset?.prompt, `${label} prompt`);
  if (promptPath) {
    const prompt = readFileSync(promptPath, "utf8");
    if (!prompt.includes("单场景图生视频")) errors.push(`${label} 缺少单场景标记`);
    if (!prompt.includes("不要") && !prompt.includes("禁止")) errors.push(`${label} 缺少禁止项`);
  }
  repoFile(asset?.firstFrame, `${label} 首帧`);
  if (asset?.lastFrame) errors.push(`${label} 不应跨页使用 lastFrame: ${asset.lastFrame}`);
  if (!Number.isInteger(asset?.duration) || asset.duration < 3 || asset.duration > 15) {
    errors.push(`${label} 时长必须是 3-15 秒: ${asset?.duration ?? ""}`);
  }
  if (typeof asset?.output !== "string" || !asset.output.endsWith(".mp4")) {
    errors.push(`${label} 输出必须是 MP4: ${asset?.output ?? ""}`);
  }
}

const omniReferences = omni?.references ?? {};
for (const asset of (manifest.assets ?? [])) {
  const refs = omniReferences[asset.id];
  const label = `Omni ${asset.id}`;
  if (!Array.isArray(refs) || refs.length < 2 || refs.length > (omni?.maxReferenceImages ?? 7)) {
    errors.push(`${label} 必须有 2-${omni?.maxReferenceImages ?? 7} 张参考图`);
    continue;
  }
  refs.forEach((reference, index) => {
    const expectedSlot = `image_${index + 1}`;
    if (reference?.slot !== expectedSlot) {
      errors.push(`${label} 槽位必须连续为 ${expectedSlot}: ${reference?.slot ?? ""}`);
    }
    const path = repoFile(reference?.path, `${label} ${expectedSlot}`);
    if (index === 0 && reference?.path !== asset.firstFrame) {
      errors.push(`${label} 的 image_1 必须等于单场景首帧`);
    }
    if (!reference?.role || typeof reference.role !== "string") {
      errors.push(`${label} ${expectedSlot} 缺少用途说明`);
    }
    if (path && !/\.(png|jpe?g|webp)$/i.test(path)) {
      errors.push(`${label} ${expectedSlot} 不是图片文件: ${reference.path}`);
    }
  });
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Kling single-scene prompts OK: ${ids.size} shots + Omni references, model=${manifest.model}`);
}
