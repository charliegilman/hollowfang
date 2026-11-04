/*
  package-hollowfang.ts
  Copies the mod's plugin, compiled scripts and script sources into a staging
  folder laid out like Data\, then zips it for Vortex / Nexus. Both the staging
  folder and the zip are written to dist/.

  Usage:
    pnpm package
    pnpm package --version 2.0.1
    pnpm package --data-dir "D:\Games\Skyrim Special Edition\Data"

  Options:
    --data-dir   Game Data folder to read from (default: Steam SSE install, or $SKYRIM_DATA)
    --mod-name   Plugin base name (default: Hollowfang)
    --prefix     Script name prefix (default: CG_Hollowfang)
    --version    Version used in the output names (default: package.json version)
    --out-dir    Output folder (default: <repo>/dist)
*/
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative, sep } from "node:path";
import { parseArgs } from "node:util";
import { zipSync, type Zippable } from "fflate";
import { copyInto, defaultGameData, escapeRegExp, listFiles, repoRoot, success, warn } from "./lib.ts";

const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));

const { values: opts } = parseArgs({
  options: {
    "data-dir": { type: "string", default: defaultGameData },
    "mod-name": { type: "string", default: "Hollowfang" },
    prefix: { type: "string", default: "CG_Hollowfang" },
    version: { type: "string", default: pkg.version },
    "out-dir": { type: "string", default: join(repoRoot, "dist") },
  },
});

const dataDir = opts["data-dir"];
const modName = opts["mod-name"];
const prefix = escapeRegExp(opts.prefix);
const stage = join(opts["out-dir"], `${modName}-${opts.version}`);

// Start clean
rmSync(stage, { recursive: true, force: true });
mkdirSync(join(stage, "Scripts"), { recursive: true });
mkdirSync(join(stage, "Source", "Scripts"), { recursive: true });


// Plugin (.esp / .esm / .esl)
const plugins = listFiles(dataDir, new RegExp(`^${escapeRegExp(modName)}\\.(esp|esm|esl)$`, "i"));
if (plugins.length === 0) {
  console.error(`No plugin named ${modName}.esp/.esm/.esl found in ${dataDir}`);
  process.exit(1);
}
copyInto(plugins, stage);

// Compiled scripts
const pex = listFiles(join(dataDir, "Scripts"), new RegExp(`^${prefix}.*\\.pex$`, "i"));
copyInto(pex, join(stage, "Scripts"));

// Script sources
const psc = listFiles(join(dataDir, "Source", "Scripts"), new RegExp(`^${prefix}.*\\.psc$`, "i"));
copyInto(psc, join(stage, "Source", "Scripts"));

// Sanity checks
const baseName = (f: string): string => basename(f, extname(f)).toLowerCase();
const pexByName = new Map(pex.map((f) => [baseName(f), f]));
if (pex.length === 0) warn("No compiled .pex scripts found - the mod's scripts won't run!");
const missing = psc.filter((f) => !pexByName.has(baseName(f)));
if (missing.length) {
  warn(`Source without compiled script (not compiled?): ${missing.map((f) => basename(f, ".psc")).join(", ")}`);
}
// The Creation Kit writes the .psc a few ms after the .pex when it compiles,
// so allow some slack before calling a source "newer".
const STALE_TOLERANCE_MS = 2000;
const stale = psc.filter((f) => {
  const match = pexByName.get(baseName(f));
  return match && statSync(f).mtimeMs - statSync(match).mtimeMs > STALE_TOLERANCE_MS;
});
if (stale.length) {
  warn(`Source newer than compiled script (recompile?): ${stale.map((f) => basename(f, ".psc")).join(", ")}`);
}

// Collect staged files (paths relative to the stage root)
const staged = readdirSync(stage, { recursive: true, encoding: "utf8" })
  .map((p) => join(stage, p))
  .filter((p) => statSync(p).isFile())
  .map((p) => relative(stage, p));

console.log();
success(`Staged in ${stage}`);
staged.forEach((p) => console.log(`  ${p}`));

// Zip (contents at the archive root, no wrapper folder)
const zipPath = `${stage}.zip`;
const entries: Zippable = Object.fromEntries(
  staged.map((p) => {
    const full = join(stage, p);
    return [p.split(sep).join("/"), [readFileSync(full), { mtime: statSync(full).mtime }]];
  }),
);
writeFileSync(zipPath, zipSync(entries, { level: 9 }));
console.log();
success(`Zipped to ${zipPath}`);
