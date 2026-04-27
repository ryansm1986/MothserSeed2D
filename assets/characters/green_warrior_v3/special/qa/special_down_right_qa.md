# special_down_right QA

Status: `approved`
Fresh-source status: `fresh_v3_image_generated`

## Job

- Queue row: `special_down_right`
- Animation: `special`
- Direction: `down_right`
- Frame count: `8`
- Frame profile: `expanded_action_384` (`384x384`, anchor `{ x: 192, y: 376 }`)

## Files

- Fresh chromakey source: `assets/characters/green_warrior_v3/special/raw/special_down_right_imagegen_source_chromakey.png`
- Alpha source: `assets/characters/green_warrior_v3/special/raw/special_down_right_imagegen_source_alpha.png`
- Grouped-pose diagnostic: `assets/characters/green_warrior_v3/special/raw/special_down_right_grouped_poses.png`
- Repacked raw strip: `assets/characters/green_warrior_v3/special/raw/special_down_right_raw.png`
- Repacked chromakey strip: `assets/characters/green_warrior_v3/special/raw/special_down_right_raw_chromakey.png`
- Normalized frames: `assets/characters/green_warrior_v3/special/frames/special_down_right_01.png` through `special_down_right_08.png`
- Standard preview: `assets/characters/green_warrior_v3/special/preview/special_down_right_preview.png`
- 4x preview: `assets/characters/green_warrior_v3/special/preview/special_down_right_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v3/special/preview/special_down_right_weapon_no_shield_focus.png`
- Side-padding/no-cropping check: `assets/characters/green_warrior_v3/special/preview/special_down_right_side_padding_no_crop_check.png`
- Creative-motion overlay: `assets/characters/green_warrior_v3/special/preview/special_down_right_creative_motion_overlay.png`
- Looping GIF: `assets/characters/green_warrior_v3/special/preview/special_down_right_anim.gif`

## Source Provenance

- Base/reference assets used: `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`, approved v3 `attack_down_right_04.png`, and approved v3 `special_down_05.png` visual reference.
- Source was image-generated as a fresh full horizontal `special + down_right` strip with a cool blue/cyan glow power effect.
- No `green_warrior_v2` assets, older animation strips, repaired frames, raw sheets, assembled sheets, or normalized frames from another character folder were used as source.
- Source-authenticity check: passed. The row was not made by rotating, warping, scaling, pose-transforming, or drawing over idle frames.
- Rejected source attempts: none.

## Processing Notes

- Source size: `2172x724`.
- Chroma key was removed from a flat magenta source with an extra magenta-despill cleanup pass for antialiased edges.
- Alpha components were grouped into 8 ordered pose clusters from the full source strip.
- Poses were repacked into `3600px` raw slots, then normalized with one shared source scale to `384x384`.
- Minimum repacked raw gutter between neighboring visible poses: `3435px`.

## Mechanical Checks

- Frame count: `8`.
- All normalized frames are exactly `384x384`.
- Transparency: all normalized frame corners are fully transparent.
- Edge contact: no normalized frame touches the frame edge.
- Worst transparent padding across the row: left `102px`, top `201px`, right `101px`, floor `18px`.
- Top/side padding meets the `96px` expanded-action target; floor padding meets the `8px` anchored-foot target.
- Side-padding/no-cropping check: passed. Sword, scarf, boots, blue/cyan glow, power burst, and impact effect stay inside the 384 frame.
- Gutter contamination check: passed after repack. No sword, scarf, shadow, glow, particle haze, alpha haze, loose pixels, labels, UI, scenery, or unrelated objects appear in the raw gutters.

## Visual QA

- Direction check: passed. All eight frames read as down-right diagonal-forward, including follow-through and recovery.
- Creative-motion check: passed. The body changes pose through ready stance, crouch/coil, diagonal-forward lunge, power impact, follow-through, and recovery; the row does not read as idle with a glow pasted over it.
- Glow/power-effect check: passed. The special attack uses cool blue, cyan, teal, and white energy around the sword and impact while keeping the effect compact per pose.
- Weapon/no-shield check: passed. The sword is visibly held in the character's right hand across the row, the left hand is empty, and no shield, buckler, off-hand weapon, or held object appears.

Final QA status: `approved`.
