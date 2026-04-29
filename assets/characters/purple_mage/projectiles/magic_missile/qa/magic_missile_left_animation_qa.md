# Magic Missile Left Animation QA

- Required skill: `$game-studio:sprite-pipeline`
- Source strip: `assets/characters/purple_mage/projectiles/magic_missile/raw/magic_missile_left_strip_green.png`
- Transparent source: `assets/characters/purple_mage/projectiles/magic_missile/raw/magic_missile_left_strip_transparent.png`
- Pipeline source: `assets/characters/purple_mage/projectiles/magic_missile/raw/magic_missile_left_strip_even.png`
- Pipeline frames: `assets/characters/purple_mage/projectiles/magic_missile/pipeline_frames/01.png` through `08.png`
- Runtime frames: `assets/characters/purple_mage/projectiles/magic_missile/frames/magic_missile_left_01.png` through `magic_missile_left_08.png`
- Runtime strip: `assets/characters/purple_mage/projectiles/magic_missile/magic_missile_left_strip.png`
- Preview: `assets/characters/purple_mage/projectiles/magic_missile/preview/magic_missile_left_preview.png`

## Checks

- The projectile faces left in all frames.
- The eight frames were generated as one strip to reduce frame-to-frame drift.
- Chroma-key background was removed from the generated strip.
- The strip was padded to eight equal 272px source slots before normalization.
- Runtime frames are 256x256 with transparent corners and center anchoring for projectile drawing.
- Runtime frames were rotated -40 degrees after normalization so the projectile reads as a left-facing horizontal shot.
- The animation reads as a looping internal movement effect: pulsing core, shifting flame, and sparkle flicker.
- Existing `magic_missile.png` was preserved as the single-frame fallback.
