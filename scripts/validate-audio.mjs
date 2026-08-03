import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const audioRoot = resolve(repositoryRoot, "web", "audio");
const manifestPath = resolve(audioRoot, "manifest.json");

if (!existsSync(manifestPath)) throw new Error("Missing web/audio/manifest.json");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const tracks = Array.isArray(manifest.tracks) ? manifest.tracks : [];
const trackIds = new Set(tracks.map((track) => track?.id).filter(Boolean));
const requiredChapters = ["L0", "L1", "L2", "L3", "L4", "L5"];
const requiredEndings = ["A_separate", "B_alienate", "C_consume", "C_cold"];

if (!manifest.title || !trackIds.has(manifest.title)) {
  throw new Error(`Invalid title track: ${manifest.title ?? ""}`);
}

for (const track of tracks) {
  if (!track?.id || typeof track.path !== "string" || !track.path) {
    throw new Error(`Invalid audio track entry: ${track?.id ?? ""}`);
  }
  const filePath = resolve(audioRoot, track.path);
  const relativePath = relative(audioRoot, filePath);
  if (isAbsolute(relativePath) || relativePath.startsWith("..") || !existsSync(filePath)) {
    throw new Error(`Missing audio file for ${track.id}: ${track.path}`);
  }
}

for (const chapterId of requiredChapters) {
  const trackId = typeof manifest.chapters?.[chapterId] === "string"
    ? manifest.chapters[chapterId]
    : manifest.chapters?.[chapterId]?.track;
  if (!trackIds.has(trackId)) throw new Error(`Missing chapter audio binding: ${chapterId}`);
}

for (const endingId of requiredEndings) {
  const trackId = typeof manifest.endings?.[endingId] === "string"
    ? manifest.endings[endingId]
    : manifest.endings?.[endingId]?.track;
  if (!trackIds.has(trackId)) throw new Error(`Missing ending audio binding: ${endingId}`);
}

console.log(`Audio manifest OK: ${tracks.length} tracks, ${requiredChapters.length} chapters, ${requiredEndings.length} endings`);
