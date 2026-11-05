# Changelog

All notable changes to Hollowfang are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-11-05

Safe to install over 1.0.0 on an existing save.

### Added
- Silent Step: at 25 kills, your footsteps are 25% quieter while Hollowfang is equipped. It doesn't stack with Muffle, and it's listed under Magic > Active Effects.
- Deep Thirst: at 50 kills, each hit with Hollowfang drains 5 stamina from the target and gives it to you.
- A description for Hollowfang's abilities in the Active Effects menu.
- Players who passed 25 or 50 kills in 1.0.0 get the matching unlock message on their next kill.

### Fixed
- Removed the "Hollowfang controller loaded" debug notification shown when the mod first loads.

## [1.0.0] - 2026-11-04

### Added

- Hollowfang, a unique Elven dagger with an Absorb Stamina enchantment.
- Hollowfang is added to the player's inventory once, when the mod first loads, in new games and existing saves.
- Damage scaling by player level, from steel-tier at level 1 up to daedric-tier from level 46.
- Smithing support, including the Elven Smithing perk.
- Kill tracking for kills made with Hollowfang. Hits on corpses don't count.
- Stride: +2% movement speed for every 10 kills, up to +10% at 50 kills, while Hollowfang is equipped.
- Soul Feeding: from 10 kills, each kill restores some of Hollowfang's enchantment charge.

### Known issues

- A "Hollowfang controller loaded" debug notification appears when the mod first loads.

[Unreleased]: https://github.com/OWNER/hollowfang/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/OWNER/hollowfang/releases/tag/v1.0.0
