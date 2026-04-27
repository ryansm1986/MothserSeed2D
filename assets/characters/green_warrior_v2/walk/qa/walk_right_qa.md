# walk_right QA

Status: `approved`

## Inputs
- Queue row: `walk_right`
- Frames: `assets/characters/green_warrior_v2/walk/frames/walk_right_01.png` through `walk_right_08.png`
- Preview: `assets/characters/green_warrior_v2/walk/preview/walk_right_preview.png`
- Refreshed enlarged preview: `assets/characters/green_warrior_v2/walk/preview/walk_right_preview_4x.png`
- Focused late-frame check: `assets/characters/green_warrior_v2/walk/preview/walk_right_frames_06_08_sword_check_8x.png`

## Mechanical QA
- Frame count: pass, 8 frames.
- Frame size: pass, every frame is `64x64`.
- Transparency: pass, alpha preserved.
- Chroma cleanup: pass, no magenta-like opaque pixels detected.
- Content: pass, every frame has a non-empty alpha bounding box.

## Visual QA
- Direction: pass, right-facing walk cycle.
- Character consistency: pass, green hair, scarf, armor, tunic, boots, sword, and scabbard remain readable.
- Motion read: pass, walking cycle reads at enlarged preview scale.
- Late-frame sword visibility: pass, frames 6-8 retain visible sword in hand/at side.
- Repair: not needed after focused check.

Final QA status: `approved`
