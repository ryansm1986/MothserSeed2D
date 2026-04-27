# dodge_up QA

Status: `approved`

## Inputs

- Queue row: `dodge_up`
- Animation/direction: `dodge + up`
- Direction wording: `up/back-facing`
- Base sprite: `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`
- 128 seed: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png`
- Current-pipeline references used: `assets/characters/green_warrior_v3/idle/frames/idle_up_01.png`
- Edit/reference canvas: `assets/characters/green_warrior_v3/dodge/raw/dodge_up_edit_canvas.png`
- Fresh source: `assets/characters/green_warrior_v3/dodge/raw/dodge_up_imagegen_source_chromakey.png`
- Alpha source: `assets/characters/green_warrior_v3/dodge/raw/dodge_up_source_alpha.png`
- Repacked raw strip: `assets/characters/green_warrior_v3/dodge/raw/dodge_up_raw.png`
- Frame profile: `default_128` (`128x128`, anchor `{ x: 64, y: 120 }`)

## Provenance

The accepted source was generated as a fresh full horizontal `dodge + up` image-generation strip from the canonical v3 base/seed and approved v3 `idle_up` reference only. No `green_warrior_v2` assets, older animation strips, repaired frames, raw sheets, or normalized frames from another character folder were used as source.

## Mechanical QA

- Source size: `2172x724`
- Initial generated source pose gaps: `[260, 212, 212, 291]px`
- Initial generated source spacing check: passed the current default-profile `128px` minimum before cleanup/repack.
- Repacked raw slot: `819x512`
- Repacked raw pose gaps: `[627, 613, 626, 638]px`, above two full `128px` frame widths.
- Shared normalization scale: `0.415385`
- Normalized frames: `assets/characters/green_warrior_v3/dodge/frames/dodge_up_01.png` through `dodge_up_05.png`
- Frame padding `(left, top, right, floor)`:
  - frame 1: `(25, 12, 25, 8)`
  - frame 2: `(24, 41, 23, 8)`
  - frame 3: `(19, 41, 19, 8)`
  - frame 4: `(29, 65, 28, 8)`
  - frame 5: `(24, 14, 24, 8)`

## Visual QA

- Direction check: all frames read as `back-facing row away from the viewer`, including crouch, roll, and recovery frames.
- Motion check: the body changes pose across the row with ready stance, crouch/anticipation, roll entry, full roll, and recovery.
- Roll check: frame 4 clearly includes the requested combat roll.
- Weapon/no-shield check: sword remains visible with the character's right hand, the left hand is empty, and no shield, buckler, off-hand weapon, or held off-hand object is present.
- Padding/no-cropping check: no body, sword, scarf, boots, or loose pixels touch normalized frame edges.
- Bleed check: no inter-frame bleed in the standard, 4x, focused weapon/no-shield preview, or looping GIF.

## Preview Outputs

- Standard preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_up_preview.png`
- 4x preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_up_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_up_weapon_no_shield_focus_4x.png`
- Review GIF: `assets/characters/green_warrior_v3/dodge/preview/dodge_up_anim.gif`

Final QA status: `approved`
