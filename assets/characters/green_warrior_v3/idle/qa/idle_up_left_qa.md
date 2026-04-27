# idle_up_left QA

Status: approved pending final visual review.

Generated: 2026-04-26 19:26:22 -0500

Animation/direction: `idle` + `up_left`.

Source provenance: fresh full horizontal idle source strip generated from the visible canonical base reference only: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png` / `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`. No old idle, walk, dodge, sprint, attack, special, v2, repaired strips, normalized historical frames, or other character folder were used as source or visual reference.

Profile: default_128, 5 frames, 128x128, anchor {x:64,y:120}.

QA checks:

- Identity: preserves spiky green hair, brown/gold armor, green cloth panels, sword design, and base v3 proportions.
- Direction: intended `up_left` for all five frames.
- Stance: simple natural standing stance, feet planted under body with modest spacing; not feet glued together and not a walking stride.
- Weapon/off-hand: sword remains in the character right hand; left hand remains empty; no shield/buckler/off-hand weapon added.
- Motion: subtle idle breathing/settle only, no walking step, attack, or magic effect.
- Height guard: per-frame visible heights [98, 98, 98, 98, 98]; drift 0 px.
- Padding/no-crop: worst normalized padding L/T/R/B = [34, 14, 34, 16]; no alpha touches frame edge.
- Raw gutters: 640px slots, estimated minimum transparent gutter 394 px; no inter-pose alpha bleed remains after repack.

Outputs:

- Source chromakey: `assets\characters\green_warrior_v3\idle\raw\idle_up_left_imagegen_base_only_natural_stance_chromakey.png`
- Alpha cleanup: `assets\characters\green_warrior_v3\idle\raw\idle_up_left_imagegen_base_only_natural_stance_alpha.png`
- Raw: `assets\characters\green_warrior_v3\idle\raw\idle_up_left_raw.png`
- Chroma raw: `assets\characters\green_warrior_v3\idle\raw\idle_up_left_raw_chromakey.png`
- Frames: `assets\characters\green_warrior_v3\idle\frames\idle_up_left_01.png` through `assets\characters\green_warrior_v3\idle\frames\idle_up_left_05.png`
- Preview: `assets\characters\green_warrior_v3\idle\preview\idle_up_left_preview.png`
- 4x preview: `assets\characters\green_warrior_v3\idle\preview\idle_up_left_preview_4x.png`
- Weapon/no-shield focus: `assets\characters\green_warrior_v3\idle\preview\idle_up_left_weapon_no_shield_focus.png`
- Side-padding/no-crop check: `assets\characters\green_warrior_v3\idle\preview\idle_up_left_side_padding_no_crop_check.png`
- GIF: `assets\characters\green_warrior_v3\idle\gif\idle_up_left.gif`
