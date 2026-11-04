# Hollowfang

A unique dagger for Skyrim Special Edition / Anniversary Edition that grows with you, and with every life it takes.

Hollowfang starts out as a modest, steel-tier blade and keeps pace with the best daggers in the game as you level. Kills made with it unlock new abilities, so it stays useful from Helgen to the end of your playthrough without ever being the strongest weapon in the room.

## Features

- **Delivered on install.** Hollowfang appears in your inventory as soon as the mod loads, in a new game or an existing save.
- **Scales with your level.** Damage keeps pace with the best dagger tier you'd otherwise be carrying (see [Level scaling](#level-scaling)).
- **Smithing-friendly.** It can be improved at a grindstone, and the Elven Smithing perk applies.
- **Absorb Stamina enchantment**, with a 1000-point charge.
- **Grows with every kill** (see [Kill unlocks](#kill-unlocks)).

## Requirements

- Skyrim Special Edition or Anniversary Edition
- No SKSE or other dependencies

## Installation

**Vortex (recommended):** download with the *Mod Manager Download* button, then enable and deploy the mod.

**Manual:** extract the archive into your `Skyrim Special Edition\Data` folder and enable `Hollowfang.esp` in your load order.

## How it works

### Level scaling

Hollowfang's base damage is 7, which is roughly steel-tier. Its damage multiplier rises with your character level:

| Player level | Comparable tier | Damage multiplier |
|---|---|---|
| 1–11 | Steel | ×1.00 |
| 12–23 | Elven | ×1.15 |
| 24–35 | Glass | ×1.30 |
| 36–45 | Ebony | ×1.45 |
| 46+ | Daedric | ×1.60 |

The scaling only keeps Hollowfang level with normal gear; it doesn't stack extra power on top. One-Handed perks, sneak attacks and Smithing improvements apply exactly as they would to any other dagger.

### Kill unlocks

Hollowfang counts every creature or person you kill with it. Corpse hits don't count.

| Kills | Unlock |
|---|---|
| 10 | **Soul Feeding:** each kill restores some of the enchantment's charge |
| 10, 20, 30, 40, 50 | **Stride:** +2% movement speed per tier, up to +10% |

All bonuses only apply while Hollowfang is equipped.

## Compatibility

Hollowfang only adds new records and doesn't change any vanilla ones, so it should be compatible with any other mod.

As with any scripted mod, **don't uninstall it partway through a playthrough.** The scripts leave data in your save that can't be cleanly removed.

## Known issues

- 1.0.0 shows a "Hollowfang controller loaded" debug notification when the mod first loads. It will be removed in 1.0.1.

## Records (for patchers)

All records use the `CG_Hollowfang` prefix:

| Type | Editor ID | Purpose |
|---|---|---|
| WEAP | `CG_Hollowfang` | The dagger |
| QUST | `CG_HollowfangQuest` | Controller: kill counting, unlocks, delivery |
| GLOB | `CG_HollowfangKills` | Kill counter |
| PERK | `CG_HollowfangPerk` | On-hit tracker and level scaling |
| SPEL | `CG_HollowfangHitSpell` | Hidden on-hit kill tracker |
| SPEL | `CG_HollowfangPassives` | Ability holding the speed tiers |
| MGEF | `CG_HollowfangKillTrackerEffect` | Scripted kill-tracking effect |
| MGEF | `CG_HollowfangSpeedEffect` | +2% SpeedMult step |
| MESG | `CG_HollowfangMsg*` | Unlock popups |

---

## Development

### Repository layout

```
Data/                   What ships, laid out like Skyrim's Data folder
  Hollowfang.esp
  Scripts/              Compiled Papyrus (.pex), committed on purpose
  Source/Scripts/       Papyrus source (.psc)
tools/
  sync-from-game.ts     Copies the mod's files from the game into Data/
  package-hollowfang.ts Stages and zips a release into dist/
  lib.ts                Shared helpers
```

The compiled `.pex` files are committed because compiling Papyrus needs the Creation Kit and Bethesda's vanilla script sources, neither of which can be installed on a CI runner or redistributed. Only the mod's own `CG_Hollowfang*` scripts are ever copied into the repo.

### Prerequisites

- [Node.js](https://nodejs.org/) 22.18 or newer (runs the TypeScript tools directly, without a build step)
- [pnpm](https://pnpm.io/)
- Skyrim Special Edition and the Creation Kit, for editing the plugin and compiling scripts

```sh
pnpm install
```

If Skyrim isn't installed in the default Steam location, set `SKYRIM_DATA` to your game's `Data` folder, or pass `--data-dir` to the scripts.

### Workflow

1. Edit the plugin and compile scripts in the Creation Kit, working in the game's `Data` folder.
2. **Quit Skyrim before testing a recompile.** The game keeps scripts in memory for the whole session.
3. Test in game from the main menu with `coc qasmoke`.
4. Copy the results into the repo:

   ```sh
   pnpm sync
   ```

5. Commit using [Conventional Commits](https://www.conventionalcommits.org/), for example `feat: add Silent Step unlock` or `fix: count one-hit kills`.

### Releasing

Versions follow [Semantic Versioning](https://semver.org/). To release:

1. Update `version` in `package.json` and add an entry to `CHANGELOG.md`.
2. Build the release from the repo's `Data` folder:

   ```sh
   pnpm package --data-dir Data
   ```

   This writes `dist/Hollowfang-<version>/` and `dist/Hollowfang-<version>.zip`. It warns about missing compiled scripts, and about sources that are newer than their compiled scripts.
3. Commit, tag and push:

   ```sh
   git tag v<version>
   git push --follow-tags
   ```

4. Upload the zip to Nexus Mods as the main file.

### Useful console commands

| Command | Purpose |
|---|---|
| `help hollowfang 4` | List the mod's records and their FormIDs |
| `player.additem <WEAP FormID> 1` | Add the dagger |
| `set CG_HollowfangKills to <n>` | Jump to a kill count |
| `sqv CG_HollowfangQuest` | Show the controller quest's state and script variables |
| `player.getav speedmult` | Check the speed bonus |
| `player.setlevel <n>` | Test level scaling |

Script logging needs `bEnableLogging=1` and `bEnableTrace=1` under `[Papyrus]` in `SkyrimCustom.ini`. The mod's trace lines are prefixed with `[Hollowfang]`.
