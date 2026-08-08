import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const chaptersPath = resolve(repositoryRoot, "script", "chapters.json");
const data = JSON.parse(readFileSync(chaptersPath, "utf8"));
const chapters = data.chapters;
const errors = [];
const chapterIds = new Set();
const lineIds = new Set();
const zoneIds = new Set();
let lineCount = 0;
let zoneCount = 0;

if (!Array.isArray(chapters) || !chapters.length) {
  errors.push("chapters.json must contain a non-empty chapters array");
}

for (const chapter of chapters ?? []) {
  if (!chapter?.id || !Array.isArray(chapter.lines)) {
    errors.push("Chapter is missing an id or lines array");
    continue;
  }
  if (chapterIds.has(chapter.id)) errors.push(`Duplicate chapter ID: ${chapter.id}`);
  chapterIds.add(chapter.id);
  if (Object.hasOwn(chapter, "title") || Object.hasOwn(chapter, "narration")) {
    errors.push(`${chapter.id} still contains localized chapter text`);
  }
  for (const line of chapter.lines) {
    lineCount += 1;
    if (!line?.id || lineIds.has(line.id)) errors.push(`Duplicate or missing line ID: ${line?.id ?? ""}`);
    lineIds.add(line?.id);
    if (Object.hasOwn(line ?? {}, "raw") || !Array.isArray(line?.zones)) {
      errors.push(`${line?.id ?? "unknown"} must contain stable zones only`);
      continue;
    }
    for (const zone of line.zones) {
      zoneCount += 1;
      if (!zone?.id || zoneIds.has(zone.id) || !zone.id.startsWith(`${line.id}_Z`)) {
        errors.push(`${line.id} has an invalid or duplicate zone ID: ${zone?.id ?? ""}`);
      }
      zoneIds.add(zone?.id);
      for (const key of ["text", "start", "occurrence", "remain", "npc", "eat"]) {
        if (Object.hasOwn(zone ?? {}, key)) errors.push(`${zone?.id ?? line.id} still contains localized ${key}`);
      }
    }
  }
}

const l2s02 = chapters?.flatMap((chapter) => chapter.lines ?? []).find((line) => line.id === "L2_S02");
if (l2s02?.zones?.some((zone) => zone.flags?.includes("pass+"))) {
  errors.push("L2_S02 must not contain pass+");
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Chapter rules OK: ${chapters.length} chapters, ${lineCount} lines, ${zoneCount} stable zones`);
}
