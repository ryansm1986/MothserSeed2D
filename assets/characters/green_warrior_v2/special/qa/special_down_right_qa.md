# special_down_right QA

Status: PASS / approved

## Files

- Edit canvas: `assets/characters/green_warrior_v2/special/raw/special_down_right_edit_canvas.png`
- Pose/reference copy: `assets/characters/green_warrior_v2/special/raw/special_down_right_pose.png`
- Chroma-key strip: `assets/characters/green_warrior_v2/special/raw/special_down_right_chromakey.png`
- Transparent raw strip: `assets/characters/green_warrior_v2/special/raw/special_down_right_raw.png`
- Normalized frames: `assets/characters/green_warrior_v2/special/frames/special_down_right_01.png` through `special_down_right_08.png`
- Standard preview: `assets/characters/green_warrior_v2/special/preview/special_down_right_preview.png`
- 4x preview: `assets/characters/green_warrior_v2/special/preview/special_down_right_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v2/special/preview/special_down_right_weapon_no_shield_check_6x.png`

## Mechanical Checks

- Frame count: 8/8.
- Frame profile: wide action `96x80`, shared bottom-center anchor `{ x: 48, y: 76 }`.
- Background: transparent normalized frames; flat `#ff00ff` chroma-key source strip also saved.
- Chroma residue: 0 magenta pixels in normalized frames.
- Generated as one full horizontal strip, then saved as normalized frames.
- Source stayed inside the canonical `green_warrior_v2` asset family: approved `down_right` idle seed/edit canvas plus approved `down_right` attack motion frames.

- Frame 01: size 96x80, alpha bbox (23, 25, 67, 79), magenta pixels 0
- Frame 02: size 96x80, alpha bbox (16, 16, 69, 80), magenta pixels 0
- Frame 03: size 96x80, alpha bbox (12, 23, 71, 80), magenta pixels 0
- Frame 04: size 96x80, alpha bbox (8, 22, 73, 80), magenta pixels 0
- Frame 05: size 96x80, alpha bbox (11, 22, 79, 79), magenta pixels 0
- Frame 06: size 96x80, alpha bbox (24, 23, 78, 78), magenta pixels 0
- Frame 07: size 96x80, alpha bbox (24, 29, 76, 79), magenta pixels 0
- Frame 08: size 96x80, alpha bbox (28, 29, 70, 80), magenta pixels 0

## Visual Checks

- Direction reads as `down_right`.
- Action reads as a flashy spinning glowy special attack with a rotating green/yellow sword-energy arc.
- Same `green_warrior_v2` character, palette family, outfit proportions, and silhouette family are preserved.
- Sword remains visible in the character's right hand in every frame because the approved one-handed attack pose is preserved under the energy arc.
- Left hand remains empty in every frame.
- No shield, buckler, off-hand weapon, scenery, labels, UI, poster composition, or unrelated object.
- Wide action frame leaves side padding for sword/glow; focused preview checked for no obvious cropping or neighboring-frame bleed.

## Notes

This special row was generated locally from canonical in-project `green_warrior_v2` frames, then augmented with procedural glow/spin effects so the row remains consistent with the approved character and direction.
