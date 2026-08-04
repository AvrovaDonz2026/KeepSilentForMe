import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const chaptersPath = resolve(repositoryRoot, "script", "chapters.json");
const data = JSON.parse(readFileSync(chaptersPath, "utf8"));
const chapters = data.chapters;

if (!Array.isArray(chapters) || !chapters.length) {
  throw new Error("chapters.json 缺少 chapters 数组");
}

function locate(raw, zone) {
  if (Number.isInteger(zone.start)) return zone.start;
  const occurrence = zone.occurrence === undefined ? 1 : Number(zone.occurrence);
  if (!Number.isInteger(occurrence) || occurrence < 1) return -1;
  let from = 0;
  let start = -1;
  for (let count = 0; count < occurrence; count += 1) {
    start = raw.indexOf(zone.text, from);
    if (start < 0) return -1;
    from = start + zone.text.length;
  }
  return start;
}

const errors = [];
const chapterIds = new Set();
const ids = new Set();
let lineCount = 0;
let zoneCount = 0;

for (const chapter of chapters) {
  if (!chapter?.id || !Array.isArray(chapter.lines)) {
    errors.push("章节缺少 id 或 lines");
    continue;
  }
  if (chapterIds.has(chapter.id)) errors.push(`重复章节 ID: ${chapter.id}`);
  chapterIds.add(chapter.id);
  for (const line of chapter.lines) {
    lineCount += 1;
    if (!line?.id || ids.has(line.id)) errors.push(`重复或缺失台词 ID: ${line?.id ?? ""}`);
    ids.add(line?.id);
    if (typeof line.raw !== "string" || !Array.isArray(line.zones)) {
      errors.push(`${line?.id ?? "unknown"} 缺少 raw 或 zones`);
      continue;
    }
    for (const [index, zone] of line.zones.entries()) {
      zoneCount += 1;
      if (!zone || typeof zone.text !== "string" || !zone.text) {
        errors.push(`${line.id} zone ${index + 1} 缺少 text`);
        continue;
      }
      const start = locate(line.raw, zone);
      if (start < 0
        || start + zone.text.length > line.raw.length
        || line.raw.slice(start, start + zone.text.length) !== zone.text) {
        errors.push(`${line.id} zone ${index + 1} 无法定位: ${zone.text}`);
        continue;
      }
      if (zone.remainMode === "mechanical") {
        const expected = line.raw.slice(0, start) + line.raw.slice(start + zone.text.length);
        if (zone.remain !== expected) {
          errors.push(`${line.id} zone ${index + 1} remain 与单段删除不一致`);
        }
      }
    }
  }
}

const l2s02 = chapters.flatMap((chapter) => chapter.lines ?? []).find((line) => line.id === "L2_S02");
if (l2s02?.zones?.some((zone) => zone.flags?.includes("pass+"))) {
  errors.push("L2_S02 不应包含 pass+ 旗标");
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Chapter data OK: ${chapters.length} chapters, ${lineCount} lines, ${zoneCount} zones`);
}
