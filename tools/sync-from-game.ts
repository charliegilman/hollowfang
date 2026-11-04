/*
  sync-from-game.ts
  Copies the plugin, compiled scripts and script sources from the game's Data
  folder into this repo's Data folder, then shows git status.

  Usage:
    pnpm sync
    pnpm sync --data-dir "D:\Games\Skyrim Special Edition\Data"
*/
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { copyInto, defaultGameData, listFiles, repoRoot, warn } from "./lib.ts";

const { values: opts } = parseArgs({
  options: {
    "data-dir": { type: "string", default: defaultGameData },
  },
});

const gameData = opts["data-dir"];
const repoData = join(repoRoot, "Data");
mkdirSync(join(repoData, "Scripts"), { recursive: true });
mkdirSync(join(repoData, "Source", "Scripts"), { recursive: true });


const plugin = listFiles(gameData, /^Hollowfang\.esp$/i);
if (plugin.length === 0) {
  console.error(`Hollowfang.esp not found in ${gameData}`);
  process.exit(1);
}
copyInto(plugin, repoData);

const pex = listFiles(join(gameData, "Scripts"), /^CG_Hollowfang.*\.pex$/i);
if (pex.length === 0) warn("No CG_Hollowfang*.pex scripts found");
copyInto(pex, join(repoData, "Scripts"));

const psc = listFiles(join(gameData, "Source", "Scripts"), /^CG_Hollowfang.*\.psc$/i);
if (psc.length === 0) warn("No CG_Hollowfang*.psc sources found");
copyInto(psc, join(repoData, "Source", "Scripts"));

execFileSync("git", ["-C", repoRoot, "status", "--short"], { stdio: "inherit" });
