# special_up QA

Status: PASS / approved

## Files

- Edit canvas: `assets/characters/green_warrior_v2/special/raw/special_up_edit_canvas.png`
- Pose/reference copy: `assets/characters/green_warrior_v2/special/raw/special_up_pose.png`
- Chroma-key strip: `assets/characters/green_warrior_v2/special/raw/special_up_chromakey.png`
- Transparent raw strip: `assets/characters/green_warrior_v2/special/raw/special_up_raw.png`
- Normalized frames: `assets/characters/green_warrior_v2/special/frames/special_up_01.png` through `special_up_08.png`
- Standard preview: `assets/characters/green_warrior_v2/special/preview/special_up_preview.png`
- 4x preview: `assets/characters/green_warrior_v2/special/preview/special_up_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v2/special/preview/special_up_weapon_no_shield_check_6x.png`

## Mechanical Checks

- Frame count: 8/8.
- Frame profile: wide action `96x80`, shared bottom-center anchor `{ x: 48, y: 76 }`.
- Background: transparent normalized frames; flat `#ff00ff` chroma-key source strip also saved.
- Chroma residue: 0 magenta pixels in normalized frames.
- Generated as one full horizontal strip, then saved as normalized frames.
- Source stayed inside the canonical `green_warrior_v2` asset family: approved `up` idle seed/edit canvas plus approved `up` attack motion frames.

- Frame 01: size 96x80, alpha bbox (33, 36, 78, 80), magenta pixels 0
- Frame 02: size 96x80, alpha bbox (35, 32, 77, 80), magenta pixels 0
- Frame 03: size 96x80, alpha bbox (29, 21, 82, 79), magenta pixels 0
- Frame 04: size 96x80, alpha bbox (18, 24, 86, 78), magenta pixels 0
- Frame 05: size 96x80, alpha bbox (12, 15, 75, 79), magenta pixels 0
- Frame 06: size 96x80, alpha bbox (15, 24, 65, 80), magenta pixels 0
- Frame 07: size 96x80, alpha bbox (19, 31, 59, 80), magenta pixels 0
- Frame 08: size 96x80, alpha bbox (24, 33, 69, 80), magenta pixels 0

## Visual Checks

- Direction reads as `up`.
- Action reads as a flashy spinning glowy special attack with a rotating green/yellow sword-energy arc.
- Same `green_warrior_v2` character, palette family, outfit proportions, and silhouette family are preserved.
- Sword remains visible in the character's right hand in every frame because the approved one-handed attack pose is preserved under the energy arc.
- Left hand remains empty in every frame.
- No shield, buckler, off-hand weapon, scenery, labels, UI, poster composition, or unrelated object.
- Wide action frame leaves side padding for sword/glow; focused preview checked for no obvious cropping or neighboring-frame bleed.

## Notes

This special row was generated locally from canonical in-project `green_warrior_v2` frames, then augmented with procedural glow/spin effects so the row remains consistent with the approved character and direction.
