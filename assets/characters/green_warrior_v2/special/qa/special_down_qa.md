# special_down QA

Status: PASS / approved

## Files

- Edit canvas: `assets/characters/green_warrior_v2/special/raw/special_down_edit_canvas.png`
- Pose/reference copy: `assets/characters/green_warrior_v2/special/raw/special_down_pose.png`
- Chroma-key strip: `assets/characters/green_warrior_v2/special/raw/special_down_chromakey.png`
- Transparent raw strip: `assets/characters/green_warrior_v2/special/raw/special_down_raw.png`
- Normalized frames: `assets/characters/green_warrior_v2/special/frames/special_down_01.png` through `special_down_08.png`
- Standard preview: `assets/characters/green_warrior_v2/special/preview/special_down_preview.png`
- 4x preview: `assets/characters/green_warrior_v2/special/preview/special_down_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v2/special/preview/special_down_weapon_no_shield_check_6x.png`

## Mechanical Checks

- Frame count: 8/8.
- Frame profile: wide action `96x80`, shared bottom-center anchor.
- Background: transparent after chroma-key removal.
- Chroma residue: 0 visible magenta pixels in normalized frames.
- Frames are non-empty and share consistent dimensions.
- Raw strip was component-cleaned, repacked with wide action padding, and normalized from the approved down-facing seed/reference.

## Visual Checks

- Direction reads as down/front-facing.
- Action reads as a flashy spinning glowy special attack with build-up, sword arc, spin, and recovery.
- Same `green_warrior_v2` character, palette family, outfit proportions, and silhouette family are preserved.
- Sword remains visible in the character's right hand in every frame.
- Left hand remains empty in every frame.
- No shield, buckler, off-hand weapon, scenery, labels, UI, poster composition, or unrelated object.
- Focused preview confirms no obvious neighboring-frame bleed or sword cropping.

## Notes

Frame 03 includes a tall vertical glow spike that reaches the top of the wide action frame; it is intentional special-effect energy, not a held object or background prop.
