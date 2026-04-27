# special_up QA

Status: `approved`
Fresh-source status: `fresh_v3_image_generated`

## Job

- Queue row: `special_up`
- Animation: `special`
- Direction: `up`
- Frame count: `8`
- Frame profile: `expanded_action_384` (`384x384`, anchor `{ x: 192, y: 376 }`)

## Files

- Fresh chromakey source: `assets/characters/green_warrior_v3/special/raw/special_up_imagegen_source_chromakey.png`
- Alpha source: `assets/characters/green_warrior_v3/special/raw/special_up_imagegen_source_alpha.png`
- Grouped-pose diagnostic: `assets/characters/green_warrior_v3/special/raw/special_up_grouped_poses.png`
- Repacked raw strip: `assets/characters/green_warrior_v3/special/raw/special_up_raw.png`
- Repacked chromakey strip: `assets/characters/green_warrior_v3/special/raw/special_up_raw_chromakey.png`
- Normalized frames: `assets/characters/green_warrior_v3/special/frames/special_up_01.png` through `special_up_08.png`
- Standard preview: `assets/characters/green_warrior_v3/special/preview/special_up_preview.png`
- 4x preview: `assets/characters/green_warrior_v3/special/preview/special_up_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v3/special/preview/special_up_weapon_no_shield_focus.png`
- Side-padding/no-cropping check: `assets/characters/green_warrior_v3/special/preview/special_up_side_padding_no_crop_check.png`
- Creative-motion overlay: `assets/characters/green_warrior_v3/special/preview/special_up_creative_motion_overlay.png`
- Looping GIF: `assets/characters/green_warrior_v3/special/preview/special_up_anim.gif`

## Source Provenance

- Base/reference assets used: `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`, approved v3 `attack_up_04.png`, and approved v3 `special_up_right_05.png` visual reference.
- Source was image-generated as a fresh full horizontal `special + up` strip with a cool blue/cyan glow power effect.
- No `green_warrior_v2` assets, older animation strips, repaired frames, raw sheets, assembled sheets, or normalized frames from another character folder were used as source.
- Source-authenticity check: passed. The row was not made by rotating, warping, scaling, pose-transforming, or drawing over idle frames.
- Rejected source attempts: none.

## Processing Notes

- Source size: `2172x724`.
- Chroma key was removed from a flat magenta source with an extra magenta-despill cleanup pass for antialiased edges.
- Equal-slot slicing was used after visual source inspection because the source had 8 clean pose lanes. This was not used to salvage contaminated effects.
- Poses were repacked into `3600px` raw slots, then normalized with one shared source scale to `384x384`.
- Minimum repacked raw gutter between neighboring visible poses: `3449px`.

## Mechanical Checks

- Frame count: `8`.
- All normalized frames are exactly `384x384`.
- Transparency: all normalized frame corners are fully transparent.
- Edge contact: no normalized frame touches the frame edge.
- Worst transparent padding across the row: left `116px`, top `100px`, right `116px`, floor `18px`.
- Top/side padding meets the `96px` expanded-action target; floor padding meets the `8px` anchored-foot target.
- Side-padding/no-cropping check: passed. Sword, scarf, boots, blue/cyan glow, vertical power burst, and impact effect stay inside the 384 frame.
- Gutter contamination check: passed after repack. No sword, scarf, shadow, glow, particle haze, alpha haze, loose pixels, labels, UI, scenery, or unrelated objects appear in the raw gutters.

## Visual QA

- Direction check: passed. All eight frames read as up/back-facing, including follow-through and recovery.
- Creative-motion check: passed. The body changes pose through ready stance, crouch/coil, upward lunge away from camera, power impact, follow-through, and recovery; the row does not read as idle with a glow pasted over it.
- Glow/power-effect check: passed. The special attack uses cool blue, cyan, teal, and white energy around the sword and impact while keeping the effect compact per pose.
- Weapon/no-shield check: passed. The sword is visibly held in the character's right hand across the row, the left hand is empty, and no shield, buckler, off-hand weapon, or held object appears.

Final QA status: `approved`.
