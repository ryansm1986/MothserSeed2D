# spinning_head Projectile QA

- Required skill: `$game-studio:sprite-pipeline`
- Source: `C:\Users\there\.codex\generated_images\019dcfec-b56b-7e50-8490-94beddef3feb\ig_0b6e6b221d7fd7310169ef9ab1353081988928982585e10bbe.png`
- Raw chroma strip: `assets\monsters\tree_goblin\projectiles\spinning_head\raw\spinning_head_horizontal_yaw_generated_chromakey.png`
- Transparent raw strip: `assets\monsters\tree_goblin\projectiles\spinning_head\raw\spinning_head_horizontal_yaw_raw.png`
- Normalized frames: `assets\monsters\tree_goblin\projectiles\spinning_head\frames\spinning_head_01.png` through `assets\monsters\tree_goblin\projectiles\spinning_head\frames\spinning_head_08.png`
- Preview: `assets\monsters\tree_goblin\projectiles\spinning_head\preview\spinning_head_preview_2x.png`
- GIF: `assets\monsters\tree_goblin\projectiles\spinning_head\spinning_head.gif`
- Frame size: `128x128`
- Origin: `64,64`
- Motion: left-to-right horizontal spin with front, side, and back views.

## Checks

- [x] Full strip generated in one pass.
- [x] Each frame is a fresh view of the head, not a squash-only transform.
- [x] Side and back views are visible in the spin.
- [x] Frames normalized with one shared scale.
- [x] Transparent background preserved after chroma removal.
- [x] Preview and GIF rebuilt from normalized frames.
