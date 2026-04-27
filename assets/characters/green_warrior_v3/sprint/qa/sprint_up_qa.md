# sprint_up QA

Status: approved.

Generated: 2026-04-26 20:35:02 -0500

Animation/direction: `sprint` + `up`.

Source provenance: fresh full horizontal sprint source strip generated from the visible canonical base reference only: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png` / `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`. No idle, walk, dodge, old sprint, attack, special, v2, repaired strips, normalized historical frames, or other character folder were used as source or visual reference.

Profile: default_128, 8 frames, 128x128, anchor {x:64,y:120}.

QA checks:

- Identity: preserves spiky green hair, brown/gold armor, green cloth panels, sword design, and base v3 proportions.
- Direction: intended `up` for all eight frames.
- Weapon/off-hand: exactly one visible sword, held in the character right hand; left hand remains empty; no shield/buckler/off-hand weapon added.
- Motion: energetic sprint cycle with forward lean, long alternating stride, torso bob, sword-arm counter-swing, and hair/scarf/cloth response.
- Height guard: per-frame visible heights [99, 94, 90, 94, 95, 91, 95, 94]; drift 9 px.
- Padding/no-crop: worst normalized padding L/T/R/B = [25, 13, 24, 16]; no alpha touches frame edge.
- Final cleanup: removed detached secondary alpha/source specks from normalized frames after visual contact-sheet review; previews and GIFs were regenerated from cleaned frames.
- Raw gutters: 640px slots, estimated minimum transparent gutter 368 px; chroma cleanup/repack removed source background and no inter-pose alpha bleed remains after repack.

Outputs:

- Source chromakey: `assets\characters\green_warrior_v3\sprint\raw\sprint_up_imagegen_base_only_chromakey.png`
- Alpha cleanup: `assets\characters\green_warrior_v3\sprint\raw\sprint_up_imagegen_base_only_alpha.png`
- Raw: `assets\characters\green_warrior_v3\sprint\raw\sprint_up_raw.png`
- Chroma raw: `assets\characters\green_warrior_v3\sprint\raw\sprint_up_raw_chromakey.png`
- Frames: `assets\characters\green_warrior_v3\sprint\frames\sprint_up_01.png` through `assets\characters\green_warrior_v3\sprint\frames\sprint_up_08.png`
- Preview: `assets\characters\green_warrior_v3\sprint\preview\sprint_up_preview.png`
- 4x preview: `assets\characters\green_warrior_v3\sprint\preview\sprint_up_preview_4x.png`
- Weapon/no-shield focus: `assets\characters\green_warrior_v3\sprint\preview\sprint_up_weapon_no_shield_focus.png`
- Side-padding/no-crop check: `assets\characters\green_warrior_v3\sprint\preview\sprint_up_side_padding_no_crop_check.png`
- GIF: `assets\characters\green_warrior_v3\sprint\gif\sprint_up.gif`
