# dodge_up_right QA

- Job ID: dodge_up_right
- Animation/direction: dodge/up_right
- Frame count: 5
- Normalized frame size: 64x64
- Source/reference: idle_up_right approved frame and dodge_up_right edit canvas
- Local cleanup: filtered purplish source shadow pixels and removed a non-character vertical boundary artifact from frame 03; backup saved as dodge_up_right_03_before_boundary_cleanup.png
- Raw strip: assets/characters/green_warrior_v2/dodge/raw/dodge_up_right_raw.png
- Normalized frames: assets/characters/green_warrior_v2/dodge/frames/dodge_up_right_01.png through dodge_up_right_05.png
- Standard preview: assets/characters/green_warrior_v2/dodge/preview/dodge_up_right_preview.png
- 4x preview: assets/characters/green_warrior_v2/dodge/preview/dodge_up_right_preview_4x.png
- Focused weapon/no-shield preview: assets/characters/green_warrior_v2/dodge/preview/dodge_up_right_weapon_no_shield_check_8x.png

## Checks

- PASS: 5 normalized frames were produced.
- PASS: every frame is 64x64.
- PASS: transparent background; chroma key removed and no magenta pixels remain in normalized frames.
- PASS: character keeps the approved green_warrior_v2 palette family, outfit proportions, and up-right/back-right dodge roll read.
- PASS: sword remains visible on the character's right-hand side during the roll.
- PASS: left hand remains empty; no shield, buckler, off-hand weapon, or held object visible.
- PASS: no scenery, labels, UI, poster composition, or unrelated objects.

## Result

Approved.
