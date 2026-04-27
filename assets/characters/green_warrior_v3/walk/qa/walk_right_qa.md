# walk_right QA

Status: approved.

Generated: 2026-04-26 21:12:00 -05:00

Animation/direction: `walk` + `right`.

Source provenance: fresh full horizontal walk source strip generated from the visible canonical base reference only: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png` / `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`. No idle, old walk, sprint, dodge, attack, special, v2, repaired strips, normalized historical frames, or other character folder were used as source or visual reference.

Rejected attempts: `walk_right_rejected_tight_gutters_chromakey.png` was rejected because foot motion improved but native source gutters were too tight. `walk_right_rejected_grounded_wrong_cadence_chromakey.png` was rejected because it was grounded but did not make the requested right-foot-forward / middle / left-foot-forward / middle cadence explicit enough.

Profile: default_128, 8 frames, 128x128, anchor {x:64,y:120}.

QA checks:

- Identity: preserves spiky green hair, brown/gold armor, green cloth panels, scarf, sword design, and base v3 proportions.
- Direction: right-facing side profile for all eight frames.
- Footfall cadence: frame 1 right foot/screen-right boot forward, frame 2 feet middle, frame 3 opposite/left foot forward, frame 4 feet middle, frame 5 right foot forward, frame 6 feet middle, frame 7 opposite/left foot forward, frame 8 feet middle for loop recovery.
- Grounded-foot motion: at least one boot reads as planted on the shared ground height in every normalized frame; middle frames bring the feet under the hips instead of hovering.
- Weapon/off-hand: one visible sword held in the character right hand; left hand empty; no shield/buckler/off-hand weapon added.
- Height guard: per-frame visible heights [98, 100, 99, 98, 98, 98, 98, 97]; drift 3 px.
- Padding/no-crop: worst normalized padding L/T/R/B = [31, 12, 31, 16]; no alpha touches frame edge.
- Raw gutters: repacked into 674px slots after chroma cleanup, estimated minimum transparent gutter 520px; no inter-pose alpha bleed remains after repack.

Outputs:

- Source chromakey: `assets/characters/green_warrior_v3/walk/raw/walk_right_imagegen_base_only_chromakey.png`
- Alpha cleanup: `assets/characters/green_warrior_v3/walk/raw/walk_right_imagegen_base_only_alpha.png`
- Raw: `assets/characters/green_warrior_v3/walk/raw/walk_right_raw.png`
- Chroma raw: `assets/characters/green_warrior_v3/walk/raw/walk_right_raw_chromakey.png`
- Frames: `assets/characters/green_warrior_v3/walk/frames/walk_right_01.png` through `assets/characters/green_warrior_v3/walk/frames/walk_right_08.png`
- Preview: `assets/characters/green_warrior_v3/walk/preview/walk_right_preview.png`
- 4x preview: `assets/characters/green_warrior_v3/walk/preview/walk_right_preview_4x.png`
- Weapon/no-shield focus: `assets/characters/green_warrior_v3/walk/preview/walk_right_weapon_no_shield_focus.png`
- Side-padding/no-crop check: `assets/characters/green_warrior_v3/walk/preview/walk_right_side_padding_no_crop_check.png`
- GIF: `assets/characters/green_warrior_v3/walk/gif/walk_right.gif`
