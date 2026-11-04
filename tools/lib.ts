import { copyFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot: string = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export const defaultGameData: string =
  process.env.SKYRIM_DATA ??
  "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Skyrim Special Edition\\Data";

/** Files directly inside `dir` whose names match `pattern`. Missing dir → []. */
export function listFiles(dir: string, pattern: RegExp): string[] {
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
  return names
    .filter((name) => pattern.test(name))
    .map((name) => join(dir, name))
    .filter((path) => statSync(path).isFile());
}

/** Copy each file into `destDir`, keeping its file name. */
export function copyInto(files: readonly string[], destDir: string): void {
  for (const f of files) copyFileSync(f, join(destDir, basename(f)));
}

/** Escape a string for literal use inside a RegExp. */
export const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const warn = (msg: string): void => console.warn(`\x1b[33mWARNING: ${msg}\x1b[0m`);
export const success = (msg: string): void => console.log(`\x1b[32m${msg}\x1b[0m`);
