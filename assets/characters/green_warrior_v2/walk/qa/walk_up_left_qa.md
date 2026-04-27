# walk_up_left QA

Status: `approved`

## Inputs
- Queue row: `walk_up_left`
- Seed/reference: `assets/characters/green_warrior_v2/idle/frames/idle_up_left_01.png`
- Edit canvas: `assets/characters/green_warrior_v2/walk/raw/walk_up_left_edit_canvas.png`
- Generated chroma strip: `assets/characters/green_warrior_v2/walk/raw/walk_up_left_chromakey.png`
- Alpha strip before repack: `assets/characters/green_warrior_v2/walk/raw/walk_up_left_raw_alpha.png`
- Repacked raw strip: `assets/characters/green_warrior_v2/walk/raw/walk_up_left_raw.png`
- Pose output: `assets/characters/green_warrior_v2/walk/raw/walk_up_left_pose.png`
- Normalized frames: `assets/characters/green_warrior_v2/walk/frames/walk_up_left_01.png` through `walk_up_left_08.png`
- Preview: `assets/characters/green_warrior_v2/walk/preview/walk_up_left_preview.png`
- Enlarged preview: `assets/characters/green_warrior_v2/walk/preview/walk_up_left_preview_4x.png`
- Late-frame sword check: `assets/characters/green_warrior_v2/walk/preview/walk_up_left_frames_06_08_sword_check_4x.png`

## Mechanical QA
- Frame count: pass, 8 frames.
- Frame size: pass, every frame is `64x64`.
- Transparency: pass, alpha preserved after chroma removal.
- Chroma cleanup: pass, no magenta-like opaque pixels detected.
- Content: pass, every frame has a non-empty alpha bounding box.
- Slot safety: pass, raw strip was repacked from 8 detected alpha components with side padding for the sword.

## Visual QA
- Direction: pass, up-left/back-left read is preserved.
- Character consistency: pass, green hair, scarf, armor, tunic, boots, sword, and scabbard remain readable.
- Motion read: pass, walking leg alternation reads at enlarged preview scale.
- Late-frame sword visibility: pass, frames 6-8 retain visible sword detail.
- Avoid list: pass, no scenery, labels, UI, or unrelated objects.

Final QA status: `approved`
