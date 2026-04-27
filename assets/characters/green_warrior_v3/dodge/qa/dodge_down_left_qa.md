# dodge_down_left QA

Status: `approved`

## Inputs

- Queue row: `dodge_down_left`
- Animation/direction: `dodge + down_left`
- Direction wording: `down-left diagonal-forward`
- Base sprite: `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`
- 128 seed: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png`
- Current-pipeline references used: `assets/characters/green_warrior_v3/idle/frames/idle_down_left_01.png`
- Edit/reference canvas: `assets/characters/green_warrior_v3/dodge/raw/dodge_down_left_edit_canvas.png`
- Fresh source: `assets/characters/green_warrior_v3/dodge/raw/dodge_down_left_imagegen_source_chromakey.png`
- Alpha source: `assets/characters/green_warrior_v3/dodge/raw/dodge_down_left_source_alpha.png`
- Repacked raw strip: `assets/characters/green_warrior_v3/dodge/raw/dodge_down_left_raw.png`
- Frame profile: `default_128` (`128x128`, anchor `{ x: 64, y: 120 }`)

## Provenance

The accepted source was generated as a fresh full horizontal `dodge + down_left` image-generation strip from the canonical v3 base/seed and approved v3 `idle_down_left` reference only. No `green_warrior_v2` assets, older animation strips, repaired frames, raw sheets, or normalized frames from another character folder were used as source.

## Mechanical QA

- Source size: `2172x724`
- Initial generated source pose gaps: `[222, 247, 208, 203]px`
- Initial generated source spacing check: passed the current default-profile `128px` minimum before cleanup/repack.
- Repacked raw slot: `819x512`
- Repacked raw pose gaps: `[635, 606, 605, 618]px`, above two full `128px` frame widths.
- Shared normalization scale: `0.444444`
- Normalized frames: `assets/characters/green_warrior_v3/dodge/frames/dodge_down_left_01.png` through `dodge_down_left_05.png`
- Frame padding `(left, top, right, floor)`:
  - frame 1: `(25, 16, 25, 8)`
  - frame 2: `(22, 33, 21, 8)`
  - frame 3: `(12, 44, 12, 8)`
  - frame 4: `(21, 49, 20, 8)`
  - frame 5: `(18, 29, 18, 8)`

## Visual QA

- Direction check: all frames read as `face/chest angled toward viewer and screen left`, including crouch, roll, and recovery frames.
- Motion check: the body changes pose across the row with ready stance, crouch/anticipation, roll entry, full roll, and recovery.
- Roll check: frame 4 clearly includes the requested combat roll.
- Weapon/no-shield check: sword remains visible with the character's right hand, the left hand is empty, and no shield, buckler, off-hand weapon, or held off-hand object is present.
- Padding/no-cropping check: no body, sword, scarf, boots, or loose pixels touch normalized frame edges.
- Bleed check: no inter-frame bleed in the standard, 4x, focused weapon/no-shield preview, or looping GIF.

## Preview Outputs

- Standard preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_down_left_preview.png`
- 4x preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_down_left_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v3/dodge/preview/dodge_down_left_weapon_no_shield_focus_4x.png`
- Review GIF: `assets/characters/green_warrior_v3/dodge/preview/dodge_down_left_anim.gif`

Final QA status: `approved`
