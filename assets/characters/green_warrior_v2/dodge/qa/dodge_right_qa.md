# dodge_right QA

- Job ID: dodge_right
- Animation/direction: dodge/right
- Frame count: 5
- Normalized frame size: 64x64
- Source/reference: idle_right approved frame and dodge_right edit canvas
- Local cleanup: filtered purplish source shadow pixels and removed a non-character vertical boundary artifact from frame 02; backup saved as dodge_right_02_before_boundary_cleanup.png
- Raw strip: assets/characters/green_warrior_v2/dodge/raw/dodge_right_raw.png
- Normalized frames: assets/characters/green_warrior_v2/dodge/frames/dodge_right_01.png through dodge_right_05.png
- Standard preview: assets/characters/green_warrior_v2/dodge/preview/dodge_right_preview.png
- 4x preview: assets/characters/green_warrior_v2/dodge/preview/dodge_right_preview_4x.png
- Focused weapon/no-shield preview: assets/characters/green_warrior_v2/dodge/preview/dodge_right_weapon_no_shield_check_8x.png

## Checks

- PASS: 5 normalized frames were produced.
- PASS: every frame is 64x64.
- PASS: transparent background; chroma key removed and no magenta pixels remain in normalized frames.
- PASS: character keeps the approved green_warrior_v2 palette family, outfit proportions, and right-facing dodge roll read.
- PASS: sword remains visible in the character's right hand every frame.
- PASS: left hand remains empty; no shield, buckler, off-hand weapon, or held object visible.
- PASS: no scenery, labels, UI, poster composition, or unrelated objects.

## Result

Approved.
