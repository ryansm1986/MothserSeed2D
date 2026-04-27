# attack_right QA

Status: `approved`

## Inputs

- Queue row: `attack_right`
- Animation/direction: `attack + right`
- Base sprite: `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`
- 128 seed: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png`
- Fresh chromakey source: `assets/characters/green_warrior_v3/attack/raw/attack_right_imagegen_source_chromakey.png`
- Repacked raw strip: `assets/characters/green_warrior_v3/attack/raw/attack_right_raw.png`
- Normalized frames: `assets/characters/green_warrior_v3/attack/frames/attack_right_01.png` through `attack_right_08.png`
- Standard preview: `assets/characters/green_warrior_v3/attack/preview/attack_right_preview.png`
- Frame profile: `expanded_action_384` (`384x384`, anchor `{ x: 192, y: 376 }`)
- Required initial source-strip spacing: `384px` empty flat `#ff00ff` between neighboring visible pose bounds before cleanup/repack

## Source Provenance

- Generated one fresh full horizontal `attack + right` source strip from the canonical `green_warrior_v3` base/seed and approved current-pipeline v3 references.
- Source was image-generated as a right-facing action strip. It was not made by rotating, warping, scaling, pose-transforming, or drawing effects over idle frames.
- No `green_warrior_v2` assets, older animation strips, repaired frames, raw sheets, assembled sheets, or normalized frames from another character folder were used as source.

## QA Checks

- Frame count: `8`.
- Frame size: all frames are `384x384`.
- Initial source-strip spacing gate: current requirement is at least one full action frame, `384px`, between neighboring visible poses before cleanup/repack.
- Repacked raw gutters: `>=3084px`.
- Transparency: normalized frame corners are fully transparent.
- Edge contact: none detected.
- Direction check: passed; row reads as `attack + right`.
- Creative-motion check: passed; sequence reads as a generated attack animation rather than an idle/effect overlay.
- Source-authenticity check: passed; newly image-generated as `attack + right`, not a procedural idle-frame transform.
- Weapon/no-shield check: passed; sword remains the primary right-hand weapon, with no shield or off-hand weapon.

Final QA status: `approved`
