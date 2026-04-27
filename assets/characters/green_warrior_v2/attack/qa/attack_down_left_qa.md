# attack_down_left QA

Status: PASS / approved after consistency redo

## Files

- Previous normalized frames backed up as `assets/characters/green_warrior_v2/attack/frames/attack_down_left_NN_before_consistency_redo.png`.
- Chroma-key strip: `assets/characters/green_warrior_v2/attack/raw/attack_down_left_chromakey.png`
- Transparent raw strip: `assets/characters/green_warrior_v2/attack/raw/attack_down_left_raw.png`
- Normalized frames: `assets/characters/green_warrior_v2/attack/frames/attack_down_left_01.png` through `attack_down_left_08.png`
- Standard preview: `assets/characters/green_warrior_v2/attack/preview/attack_down_left_preview.png`
- 4x preview: `assets/characters/green_warrior_v2/attack/preview/attack_down_left_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v2/attack/preview/attack_down_left_weapon_no_shield_check_6x.png`

## Mechanical Checks

- Frame count: 8/8.
- Frame profile: wide action `96x80`.
- Background: transparent normalized frames; flat `#ff00ff` chroma-key strip also saved.
- Chroma residue: 0 magenta pixels in normalized frames.
- Redo reason: prior `attack_down_left` row was visually larger and more zoomed than neighboring attack rows. This pass repacked the canonical one-handed poses smaller inside the same wide action profile and bottom-centered them for consistency.

- Frame 01: size 96x80, alpha bbox (24, 19, 71, 76), magenta pixels 0
- Frame 02: size 96x80, alpha bbox (25, 11, 71, 76), magenta pixels 0
- Frame 03: size 96x80, alpha bbox (19, 23, 77, 76), magenta pixels 0
- Frame 04: size 96x80, alpha bbox (18, 24, 78, 76), magenta pixels 0
- Frame 05: size 96x80, alpha bbox (21, 27, 75, 76), magenta pixels 0
- Frame 06: size 96x80, alpha bbox (22, 23, 73, 76), magenta pixels 0
- Frame 07: size 96x80, alpha bbox (26, 7, 69, 76), magenta pixels 0
- Frame 08: size 96x80, alpha bbox (24, 20, 71, 76), magenta pixels 0

## Visual Checks

- Direction remains `down_left`.
- Character/action footprint is closer to `attack_down_right`, `attack_down`, and `attack_left` while keeping the same action timing.
- Same `green_warrior_v2` character, palette family, outfit proportions, and one-handed attack motion are preserved.
- Sword remains visible in the character's right hand in every frame.
- Left hand remains empty in every frame.
- No shield, buckler, off-hand weapon, scenery, labels, UI, poster composition, or unrelated object.
- Focused preview checked for side padding and no sword cropping.
