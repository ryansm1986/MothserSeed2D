# dodge_right QA

Status: `approved`

## Inputs

- Queue row: `dodge_right`
- Animation/direction: `dodge + right`
- Direction wording: `screen-right side profile`
- Base sprite: `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`
- 128 seed: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png`
- Current-pipeline references used: `assets/characters/green_warrior_v3/idle/frames/idle_right_01.png`
- Edit/reference canvas: `assets/characters/green_warrior_v3/dodge/raw/dodge_right_edit_canvas.png`
- Fresh source: `assets/characters/green_warrior_v3/dodge/raw/dodge_right_imagegen_source_chromakey.png`
- Alpha source: `assets/characters/green_warrior_v3/dodge/raw/dodge_right_source_alpha.png`
- Repacked raw strip: `assets/characters/green_warrior_v3/dodge/raw/dodge_right_raw.png`
- Frame profile: `default_128` (`128x128`, anchor `{ x: 64, y: 120 }`)

## Provenance

The accepted source was generated as a fresh full horizontal `dodge + right` image-generation strip from the canonical v3 base/seed and approved v3 `idle_right` reference only. No `green_warrior_v2` assets, older animation strips, repaired frames, raw sheets, or normalized frames from another character folder were used as source.

Rejected attempts:

- `dodge_right_rejected_attempt1_chromakey.png`: action and costume read well, but measured source gutters were only `142-183px` while pursuing the stricter wide-lane target.
- `dodge_right_rejected_attempt2_chromakey.png`: source spacing improved, but the costume drifted into a large green cape/cloak instead of the approved short mustard-yellow scarf.
- `dodge_right_rejected_attempt3_chromakey.png`: costume was closer, but source gutters remained below the stricter wide-lane target.
- `dodge_right_rejected_attempt4_chromakey.png`: source gutters improved, but frame 1 read too front-facing for the `right` row.

## Mechanical QA

- Source size: `2172x724`
- Initial generated source pose gaps: `[276, 244, 248, 239]px`
- Initial generated source spacing check: passed the required full-frame `128px` minimum before cleanup/repack.
- Repacked raw slot: `819x512`
- Repacked raw pose gaps: `[664, 632, 624, 640]px`, above two full `128px` frame widths.
- Shared normalization scale: `0.446281`
- Normalized frames: `assets/characters/green_warrior_v3/dodge/frames/dodge_right_01.png` through `dodge_right_05.png`
- Frame padding `(left, top, right, floor)`:
  - frame 1: `(36, 12, 35, 8)`
  - frame 2: `(24, 55, 23, 8)`
  - frame 3: `(21, 63, 21, 8)`
  - frame 4: `(20, 81, 20, 8)`
  - frame 5: `(28, 39, 28, 8)`

## Visual QA

- Direction check: all frames read as a screen-right dodge row; frame 1 and frame 5 are upright right-facing ready/recovery poses, frames 2-3 crouch and commit into the rightward roll, and frame 4 contains the full roll.
- Motion check: the body changes pose across the row with crouch, forward lean, curled roll, scarf movement, sword-arm position changes, and recovery step.
- Roll check: frame 4 clearly includes the requested combat roll.
- Weapon/no-shield check: sword is visible with the character's right hand, the left hand is empty, and no shield, buckler, off-hand weapon, or held off-hand object is present.
- Padding/no-cropping check: no body, sword, scarf, boots, or loose pixels touch normalized frame edges.
- Bleed check: no inter-frame bleed in the standard, 4x, focused weapon/no-shield preview, or looping GIF.

## Preview Outputs

- Standard preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_right_preview.png`
- 4x preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_right_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_right_weapon_no_shield_focus_4x.png`
- Review GIF: `assets/characters/green_warrior_v3/dodge/preview/dodge_right_anim.gif`

Final QA status: `approved`

