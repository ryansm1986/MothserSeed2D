# attack_up QA

Status: PASS / approved after scale redo

## Files

- Previous normalized frames backed up as `assets/characters/green_warrior_v2/attack/frames/attack_up_NN_before_scale_redo.png`.
- Chroma-key strip: `assets/characters/green_warrior_v2/attack/raw/attack_up_chromakey.png`
- Transparent raw strip: `assets/characters/green_warrior_v2/attack/raw/attack_up_raw.png`
- Normalized frames: `assets/characters/green_warrior_v2/attack/frames/attack_up_01.png` through `attack_up_08.png`
- Standard preview: `assets/characters/green_warrior_v2/attack/preview/attack_up_preview.png`
- 4x preview: `assets/characters/green_warrior_v2/attack/preview/attack_up_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v2/attack/preview/attack_up_weapon_no_shield_check_6x.png`

## Mechanical Checks

- Frame count: 8/8.
- Frame profile: wide action `96x80`.
- Background: transparent normalized frames; flat `#ff00ff` chroma-key strip also saved.
- Chroma residue: 0 magenta pixels in normalized frames.
- Redo reason: prior row read visually smaller than neighboring attack directions; this pass widened/repacked the canonical one-handed attack poses and removed hot-magenta residue from resampling.

- Frame 01: size 96x80, alpha bbox (29, 32, 67, 76), magenta pixels 0
- Frame 02: size 96x80, alpha bbox (28, 20, 68, 76), magenta pixels 0
- Frame 03: size 96x80, alpha bbox (30, 7, 66, 76), magenta pixels 0
- Frame 04: size 96x80, alpha bbox (24, 19, 73, 76), magenta pixels 0
- Frame 05: size 96x80, alpha bbox (26, 1, 71, 76), magenta pixels 0
- Frame 06: size 96x80, alpha bbox (26, 16, 69, 76), magenta pixels 0
- Frame 07: size 96x80, alpha bbox (30, 20, 66, 76), magenta pixels 0
- Frame 08: size 96x80, alpha bbox (29, 32, 67, 76), magenta pixels 0

## Visual Checks

- Direction remains `up`.
- Character/action footprint is larger and closer to neighboring wide-profile attack rows.
- Same `green_warrior_v2` character, palette family, outfit proportions, and attack timing are preserved.
- Sword remains visible in the character's right hand in every frame.
- Left hand remains empty in every frame.
- No shield, buckler, off-hand weapon, scenery, labels, UI, poster composition, or unrelated object.
- Focused preview checked for side padding and no sword cropping.
