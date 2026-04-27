# dodge_down_right QA

Status: `approved`

## Inputs

- Queue row: `dodge_down_right`
- Animation/direction: `dodge + down_right`
- Direction wording: `down-right diagonal-forward`
- Base sprite: `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`
- 128 seed: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png`
- Current-pipeline references used: `assets/characters/green_warrior_v3/idle/frames/idle_down_right_01.png`
- Edit/reference canvas: `assets/characters/green_warrior_v3/dodge/raw/dodge_down_right_edit_canvas.png`
- Fresh source: `assets/characters/green_warrior_v3/dodge/raw/dodge_down_right_imagegen_source_chromakey.png`
- Alpha source: `assets/characters/green_warrior_v3/dodge/raw/dodge_down_right_source_alpha.png`
- Repacked raw strip: `assets/characters/green_warrior_v3/dodge/raw/dodge_down_right_raw.png`
- Frame profile: `default_128` (`128x128`, anchor `{ x: 64, y: 120 }`)

## Provenance

The accepted source was generated as a fresh full horizontal `dodge + down_right` image-generation strip from the canonical v3 base/seed and approved v3 `idle_down_right` reference only. No `green_warrior_v2` assets, older animation strips, repaired frames, raw sheets, or normalized frames from another character folder were used as source.

## Mechanical QA

- Source size: `2172x724`
- Initial generated source pose gaps: `[198, 194, 193, 174]px`
- Initial generated source spacing check: passed the current default-profile `128px` minimum before cleanup/repack.
- Repacked raw slot: `819x512`
- Repacked raw pose gaps: `[591, 561, 580, 597]px`, above two full `128px` frame widths.
- Shared normalization scale: `0.4`
- Normalized frames: `assets/characters/green_warrior_v3/dodge/frames/dodge_down_right_01.png` through `dodge_down_right_05.png`
- Frame padding `(left, top, right, floor)`:
  - frame 1: `(25, 12, 24, 8)`
  - frame 2: `(12, 41, 12, 8)`
  - frame 3: `(13, 46, 13, 8)`
  - frame 4: `(20, 62, 19, 8)`
  - frame 5: `(20, 23, 19, 8)`

## Visual QA

- Direction check: all frames read as `face/chest angled toward viewer and screen right`, including crouch, roll, and recovery frames.
- Motion check: the body changes pose across the row with ready stance, crouch/anticipation, roll entry, full roll, and recovery.
- Roll check: frame 4 clearly includes the requested combat roll.
- Weapon/no-shield check: sword remains visible with the character's right hand, the left hand is empty, and no shield, buckler, off-hand weapon, or held off-hand object is present.
- Padding/no-cropping check: no body, sword, scarf, boots, or loose pixels touch normalized frame edges.
- Bleed check: no inter-frame bleed in the standard, 4x, focused weapon/no-shield preview, or looping GIF.

## Preview Outputs

- Standard preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_down_right_preview.png`
- 4x preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_down_right_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_down_right_weapon_no_shield_focus_4x.png`
- Review GIF: `assets/characters/green_warrior_v3/dodge/preview/dodge_down_right_anim.gif`

Final QA status: `approved`
