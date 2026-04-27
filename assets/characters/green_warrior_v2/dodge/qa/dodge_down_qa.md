# dodge_down QA

- Job ID: dodge_down
- Animation/direction: dodge/down
- Frame count: 5
- Normalized frame size: 64x64
- Source/reference: idle_down approved frame and dodge_down edit canvas
- Replaced attempt: assets/characters/green_warrior_v2/dodge/raw/dodge_down_chromakey_replaced_non_roll.png
- Local cleanup: removed a non-character vertical boundary artifact from frame 02; backup saved as dodge_down_02_before_boundary_cleanup.png
- Raw strip: assets/characters/green_warrior_v2/dodge/raw/dodge_down_raw.png
- Normalized frames: assets/characters/green_warrior_v2/dodge/frames/dodge_down_01.png through dodge_down_05.png
- Standard preview: assets/characters/green_warrior_v2/dodge/preview/dodge_down_preview.png
- 4x preview: assets/characters/green_warrior_v2/dodge/preview/dodge_down_preview_4x.png
- Focused weapon/no-shield preview: assets/characters/green_warrior_v2/dodge/preview/dodge_down_weapon_no_shield_check_8x.png

## Checks

- PASS: 5 normalized frames were produced.
- PASS: every frame is 64x64.
- PASS: transparent background; chroma key removed and no magenta pixels remain in normalized frames.
- PASS: character keeps the approved green_warrior_v2 palette family, outfit proportions, and down-facing dodge roll read.
- PASS: sword remains visible in the character's right hand every frame.
- PASS: left hand remains empty; no shield, buckler, off-hand weapon, or held object visible.
- PASS: no scenery, labels, UI, poster composition, or unrelated objects.

## Result

Approved.
