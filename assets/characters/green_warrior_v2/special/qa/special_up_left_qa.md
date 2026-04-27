# special_up_left QA

Status: PASS / approved

## Files

- Edit canvas: `assets/characters/green_warrior_v2/special/raw/special_up_left_edit_canvas.png`
- Pose/reference copy: `assets/characters/green_warrior_v2/special/raw/special_up_left_pose.png`
- Chroma-key strip: `assets/characters/green_warrior_v2/special/raw/special_up_left_chromakey.png`
- Transparent raw strip: `assets/characters/green_warrior_v2/special/raw/special_up_left_raw.png`
- Normalized frames: `assets/characters/green_warrior_v2/special/frames/special_up_left_01.png` through `special_up_left_08.png`
- Standard preview: `assets/characters/green_warrior_v2/special/preview/special_up_left_preview.png`
- 4x preview: `assets/characters/green_warrior_v2/special/preview/special_up_left_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v2/special/preview/special_up_left_weapon_no_shield_check_6x.png`

## Mechanical Checks

- Frame count: 8/8.
- Frame profile: wide action `96x80`, shared bottom-center anchor `{ x: 48, y: 76 }`.
- Background: transparent normalized frames; flat `#ff00ff` chroma-key source strip also saved.
- Chroma residue: 0 magenta pixels in normalized frames.
- Generated as one full horizontal strip, then saved as normalized frames.
- Source stayed inside the canonical `green_warrior_v2` asset family: approved `up_left` idle seed/edit canvas plus approved `up_left` attack motion frames.

- Frame 01: size 96x80, alpha bbox (29, 30, 78, 80), magenta pixels 0
- Frame 02: size 96x80, alpha bbox (28, 27, 79, 80), magenta pixels 0
- Frame 03: size 96x80, alpha bbox (30, 21, 85, 79), magenta pixels 0
- Frame 04: size 96x80, alpha bbox (25, 21, 89, 78), magenta pixels 0
- Frame 05: size 96x80, alpha bbox (18, 16, 88, 78), magenta pixels 0
- Frame 06: size 96x80, alpha bbox (19, 23, 81, 80), magenta pixels 0
- Frame 07: size 96x80, alpha bbox (23, 31, 71, 80), magenta pixels 0
- Frame 08: size 96x80, alpha bbox (27, 31, 64, 80), magenta pixels 0

## Visual Checks

- Direction reads as `up_left`.
- Action reads as a flashy spinning glowy special attack with a rotating green/yellow sword-energy arc.
- Same `green_warrior_v2` character, palette family, outfit proportions, and silhouette family are preserved.
- Sword remains visible in the character's right hand in every frame because the approved one-handed attack pose is preserved under the energy arc.
- Left hand remains empty in every frame.
- No shield, buckler, off-hand weapon, scenery, labels, UI, poster composition, or unrelated object.
- Wide action frame leaves side padding for sword/glow; focused preview checked for no obvious cropping or neighboring-frame bleed.

## Notes

This special row was generated locally from canonical in-project `green_warrior_v2` frames, then augmented with procedural glow/spin effects so the row remains consistent with the approved character and direction.
