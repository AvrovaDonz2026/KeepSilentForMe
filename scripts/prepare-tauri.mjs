import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = resolve(repositoryRoot, "dist", "tauri");

function inside(base, relativePath) {
  const baseRoot = resolve(base);
  const target = resolve(baseRoot, relativePath);
  const prefix = `${baseRoot}${sep}`;
  if (target !== baseRoot && !target.startsWith(prefix)) {
    throw new Error(`Refusing to copy outside ${baseRoot}: ${relativePath}`);
  }
  return target;
}

function copyManifestAssets(sourceRoot, destinationRoot) {
  const manifestPath = resolve(sourceRoot, "manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  mkdirSync(destinationRoot, { recursive: true });
  cpSync(manifestPath, resolve(destinationRoot, "manifest.json"));

  for (const asset of manifest.assets ?? []) {
    if (!asset || typeof asset.path !== "string") {
      throw new Error(`Invalid asset entry in ${manifestPath}`);
    }
    const sourcePath = inside(sourceRoot, asset.path);
    const destinationPath = inside(destinationRoot, asset.path);
    if (!existsSync(sourcePath)) {
      throw new Error(`Missing runtime asset: ${relative(repositoryRoot, sourcePath)}`);
    }
    mkdirSync(dirname(destinationPath), { recursive: true });
    cpSync(sourcePath, destinationPath);
  }
}

rmSync(distRoot, { recursive: true, force: true });
mkdirSync(distRoot, { recursive: true });
cpSync(resolve(repositoryRoot, "web"), distRoot, { recursive: true });

for (const file of ["index.html", "js/main.js"]) {
  const filePath = resolve(distRoot, file);
  const rewritten = readFileSync(filePath, "utf8")
    .replaceAll("../art/", "art/")
    .replaceAll("../script/", "script/");
  writeFileSync(filePath, rewritten);
}

copyManifestAssets(
  resolve(repositoryRoot, "art", "v4", "playable"),
  resolve(distRoot, "art", "v4", "playable"),
);
copyManifestAssets(
  resolve(repositoryRoot, "art", "v4", "scenes"),
  resolve(distRoot, "art", "v4", "scenes"),
);

const chapterSource = resolve(repositoryRoot, "script", "chapters.json");
const chapterDestination = resolve(distRoot, "script", "chapters.json");
mkdirSync(dirname(chapterDestination), { recursive: true });
cpSync(chapterSource, chapterDestination);

for (const file of ["index.html", "js/main.js"]) {
  const rewrittenFile = readFileSync(resolve(distRoot, file), "utf8");
  for (const stalePath of ["../art/", "../script/"]) {
    if (rewrittenFile.includes(stalePath)) {
      throw new Error(`Unrewritten runtime path in dist/tauri/${file}: ${stalePath}`);
    }
  }
}

console.log(`Prepared Tauri frontend at ${relative(repositoryRoot, distRoot)}`);
