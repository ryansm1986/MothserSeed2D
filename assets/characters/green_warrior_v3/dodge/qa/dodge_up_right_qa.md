# dodge_up_right QA

Status: `approved`

## Inputs

- Queue row: `dodge_up_right`
- Animation/direction: `dodge + up_right`
- Direction wording: `up-right away-facing back/side diagonal`
- Base sprite: `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`
- 128 seed: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png`
- Current-pipeline references used: `assets/characters/green_warrior_v3/idle/frames/idle_up_right_01.png`
- Edit/reference canvas: `assets/characters/green_warrior_v3/dodge/raw/dodge_up_right_edit_canvas.png`
- Fresh source: `assets/characters/green_warrior_v3/dodge/raw/dodge_up_right_imagegen_source_chromakey.png`
- Alpha source: `assets/characters/green_warrior_v3/dodge/raw/dodge_up_right_source_alpha.png`
- Repacked raw strip: `assets/characters/green_warrior_v3/dodge/raw/dodge_up_right_raw.png`
- Frame profile: `default_128` (`128x128`, anchor `{ x: 64, y: 120 }`)

## Provenance

The accepted source was generated as a fresh full horizontal `dodge + up_right` image-generation strip from the canonical v3 base/seed and approved v3 `idle_up_right` reference only. No `green_warrior_v2` assets, older animation strips, repaired frames, raw sheets, or normalized frames from another character folder were used as source.

## Mechanical QA

- Source size: `2172x724`
- Initial generated source pose gaps: `[236, 169, 221, 221]px`
- Initial generated source spacing check: passed the current default-profile `128px` minimum before cleanup/repack.
- Repacked raw slot: `819x512`
- Repacked raw pose gaps: `[624, 607, 601, 613]px`, above two full `128px` frame widths.
- Shared normalization scale: `0.412214`
- Normalized frames: `assets/characters/green_warrior_v3/dodge/frames/dodge_up_right_01.png` through `dodge_up_right_05.png`
- Frame padding `(left, top, right, floor)`:
  - frame 1: `(23, 12, 23, 8)`
  - frame 2: `(25, 42, 24, 8)`
  - frame 3: `(16, 44, 16, 8)`
  - frame 4: `(23, 62, 22, 8)`
  - frame 5: `(21, 15, 20, 8)`

## Visual QA

- Direction check: all frames read as `back/side row angled away toward screen right`, including crouch, roll, and recovery frames.
- Motion check: the body changes pose across the row with ready stance, crouch/anticipation, roll entry, full roll, and recovery.
- Roll check: frame 4 clearly includes the requested combat roll.
- Weapon/no-shield check: sword remains visible with the character's right hand, the left hand is empty, and no shield, buckler, off-hand weapon, or held off-hand object is present.
- Padding/no-cropping check: no body, sword, scarf, boots, or loose pixels touch normalized frame edges.
- Bleed check: no inter-frame bleed in the standard, 4x, focused weapon/no-shield preview, or looping GIF.

## Preview Outputs

- Standard preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_up_right_preview.png`
- 4x preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_up_right_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_up_right_weapon_no_shield_focus_4x.png`
- Review GIF: `assets/characters/green_warrior_v3/dodge/preview/dodge_up_right_anim.gif`

Final QA status: `approved`
