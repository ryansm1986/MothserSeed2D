# attack_up_right QA

Job: `attack_up_right`
Animation: `attack`
Direction: `up_right`
Frames: 8
Profile: wide action `96x80`, anchor `{ x: 48, y: 76 }`

## Source

- Canonical base/reference: `assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Existing attack strip was used as motion/source inspiration.
- Previous 64-profile raw backup: `assets/characters/green_warrior_v2/attack/raw/attack_up_right_raw_64profile_before_wide_repack.png`
- Repacked transparent raw strip: `assets/characters/green_warrior_v2/attack/raw/attack_up_right_raw.png`

## QA

- Mechanical: pass, 8 frames, all `96x80`, transparent background, no hot-magenta residue, no empty frames.
- Padding: pass, no normalized frame touches the top, bottom, left, or right bounds after wide-profile normalization.
- Visual: pass, up-right/back-right one-handed slash; sword/arc has more room than the previous `64x64` profile; left hand remains empty; no shield/off-hand object.
- Focused repair: frames 05, 06, and 07 were locally cleaned to remove detached sword/impact fragments and restore a complete in-hand sword inside the `96x80` frame.
- Backups: `attack_up_right_05_before_full_sword_repair.png`, `attack_up_right_06_before_full_sword_repair.png`, and `attack_up_right_07_before_full_sword_repair.png`.

## Preview Outputs

- Standard preview: `assets/characters/green_warrior_v2/attack/preview/attack_up_right_preview.png`
- 4x preview: `assets/characters/green_warrior_v2/attack/preview/attack_up_right_preview_4x.png`
- Focused weapon/no-shield QA preview: `assets/characters/green_warrior_v2/attack/preview/attack_up_right_weapon_no_shield_check_8x.png`
