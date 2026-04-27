# walk_up QA

Status: approved pending final visual review.

Generated: 2026-04-26 18:50:18 -0500

Animation/direction: `walk` + `up`.

Source provenance: fresh full horizontal walk source strip generated from the visible canonical base reference only: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png` / `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`. No idle, old walk, dodge, sprint, attack, special, v2, repaired strips, normalized historical frames, or other character folder were used as source or visual reference.

Profile: default_128, 8 frames, 128x128, anchor {x:64,y:120}.

QA checks:

- Identity: preserves spiky green hair, brown/gold armor, green cloth panels, sword design, and base v3 proportions.
- Direction: intended `up` for all eight frames.
- Weapon/off-hand: sword remains in the character right hand; left hand remains empty; no shield/buckler/off-hand weapon added.
- Motion: alternating walk cycle with body bob, feet changing support, sword-arm motion, and cloth/hair response.
- Height guard: per-frame visible heights [97, 97, 98, 97, 97, 99, 94, 96]; drift 5 px.
- Padding/no-crop: worst normalized padding L/T/R/B = [20, 13, 20, 16]; no alpha touches frame edge.
- Raw gutters: 640px slots, estimated minimum transparent gutter 369 px; chroma source cleanup removed gradient magenta background and no inter-pose alpha bleed remains after repack.

Outputs:

- Source chromakey: `assets\characters\green_warrior_v3\walk\raw\walk_up_imagegen_base_only_chromakey.png`
- Alpha cleanup: `assets\characters\green_warrior_v3\walk\raw\walk_up_imagegen_base_only_alpha.png`
- Raw: `assets\characters\green_warrior_v3\walk\raw\walk_up_raw.png`
- Chroma raw: `assets\characters\green_warrior_v3\walk\raw\walk_up_raw_chromakey.png`
- Frames: `assets\characters\green_warrior_v3\walk\frames\walk_up_01.png` through `assets\characters\green_warrior_v3\walk\frames\walk_up_08.png`
- Preview: `assets\characters\green_warrior_v3\walk\preview\walk_up_preview.png`
- 4x preview: `assets\characters\green_warrior_v3\walk\preview\walk_up_preview_4x.png`
- Weapon/no-shield focus: `assets\characters\green_warrior_v3\walk\preview\walk_up_weapon_no_shield_focus.png`
- Side-padding/no-crop check: `assets\characters\green_warrior_v3\walk\preview\walk_up_side_padding_no_crop_check.png`
- GIF: `assets\characters\green_warrior_v3\walk\gif\walk_up.gif`
