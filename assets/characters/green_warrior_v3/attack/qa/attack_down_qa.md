# attack_down QA

Status: `approved`

## Inputs

- Queue row: `attack_down`
- Animation/direction: `attack + down`
- Base sprite: `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`
- 128 seed: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png`
- Approved current-pipeline references used: `assets/characters/green_warrior_v3/idle/frames/idle_down_01.png`
- Edit canvas: `assets/characters/green_warrior_v3/attack/raw/attack_down_edit_canvas.png`
- Fresh chromakey source: `assets/characters/green_warrior_v3/attack/raw/attack_down_imagegen_source_chromakey.png`
- Alpha source: `assets/characters/green_warrior_v3/attack/raw/attack_down_imagegen_source_alpha.png`
- Repacked raw strip: `assets/characters/green_warrior_v3/attack/raw/attack_down_raw.png`
- Repacked chromakey strip: `assets/characters/green_warrior_v3/attack/raw/attack_down_raw_chromakey.png`
- Normalized frames: `assets/characters/green_warrior_v3/attack/frames/attack_down_01.png` through `attack_down_08.png`
- Standard preview: `assets/characters/green_warrior_v3/attack/preview/attack_down_preview.png`
- 4x preview: `assets/characters/green_warrior_v3/attack/preview/attack_down_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v3/attack/preview/attack_down_weapon_no_shield_focus.png`
- Side-padding/no-cropping check: `assets/characters/green_warrior_v3/attack/preview/attack_down_side_padding_no_crop_check.png`
- Creative-motion overlay: `assets/characters/green_warrior_v3/attack/preview/attack_down_creative_motion_overlay.png`

## Source Provenance

- Regenerated the full strip after QA caught `attack_down_07.png` facing the wrong direction in the first pass.
- Final source is one fresh full horizontal `attack + down` source strip from the canonical `green_warrior_v3` base/seed and the approved v3 down idle reference.
- Source was image-generated as a down/front-facing action strip, then chroma-key removed and repacked. It was not made by rotating, warping, scaling, pose-transforming, or drawing effects over idle frames.
- No `green_warrior_v2` assets, older animation strips, repaired frames, raw sheets, assembled sheets, or normalized frames from another character folder were used as source.

## Processing

- Removed flat `#ff00ff` chroma key from the generated source.
- Segmented the eight full-strip alpha pose groups in x order.
- Repacked poses into equal transparent slots before normalization.
- Repacked raw strip size: `26496x1024`.
- Raw slot width: `3312px`.
- Raw inter-pose gutters: `3110, 3126, 3111, 3093, 3110, 3113, 3118px`.
- Normalized with one shared scale to `expanded_action_384` (`384x384`, anchor `{ x: 192, y: 376 }`).

## QA Checks

- Frame count: `8`.
- Frame size: all frames are `384x384`.
- Transparency: all normalized frame corners are fully transparent.
- Edge contact: none detected.
- Worst final padding: left `116px`, top `99px`, right `116px`, bottom `11px`.
- Direction check: passed; all eight frames read as down/front-facing, including `attack_down_07.png`.
- Side-padding/no-cropping: passed; sword arcs and impact flash remain inside the 384 frame with action-profile side padding.
- Creative-motion check: passed; sequence includes ready stance, crouch anticipation, overhead windup, lunge, contact/impact, follow-through, recovery step, and ready recovery. Torso, shoulders, head, sword arm, scarf, and feet all change pose.
- Source-authenticity check: passed; newly image-generated as `attack + down`, not a procedural idle-frame transform or effect-only draw-over.
- Weapon/no-shield check: passed; sword remains visible as the primary right-hand weapon, left hand is empty/no off-hand weapon is present, and no shield or buckler appears.
- Gutter check: passed; no sword, scarf, shadow, glow, particle haze, alpha haze, loose pixels, scenery, labels, UI, or unrelated objects appear in the repacked gutters.

Final QA status: `approved`
