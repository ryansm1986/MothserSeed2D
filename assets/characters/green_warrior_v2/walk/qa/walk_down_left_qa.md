# walk_down_left QA

Job: `walk_down_left`
Animation: `walk`
Direction: `down_left`
Frame count: 8
Status: Approved
Owner: Codex sprite thread
Completed: 2026-04-25 21:49 CT

## Source And Outputs

- Canonical base/reference: `assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Edit canvas: `assets/characters/green_warrior_v2/walk/raw/walk_down_left_edit_canvas.png`
- Chroma-key strip: `assets/characters/green_warrior_v2/walk/raw/walk_down_left_chromakey.png`
- Transparent cleaned strip: `assets/characters/green_warrior_v2/walk/raw/walk_down_left_raw.png`
- Frames: `assets/characters/green_warrior_v2/walk/frames/walk_down_left_01.png` through `walk_down_left_08.png`
- Standard preview: `assets/characters/green_warrior_v2/walk/preview/walk_down_left_preview.png`
- 4x preview: `assets/characters/green_warrior_v2/walk/preview/walk_down_left_preview_4x.png`
- Focused weapon/no-shield preview: `assets/characters/green_warrior_v2/walk/preview/walk_down_left_weapon_no_shield_check_8x.png`

## Mechanical Checks

- Exact frame count: pass, 8 frames.
- Frame dimensions: pass, every frame is 64x64.
- Transparency: pass, frames use alpha transparency.
- Chroma key: pass, no opaque `#ff00ff` pixels remain in normalized frames.
- Content: pass, every frame has a non-empty alpha bounding box.
- Component cleanup: pass, tiny detached alpha islands from the generated strip were removed; every final frame has one visible alpha component.
- Alignment: pass, frames use shared bottom-center alignment.

## Visual Checks

- Direction: pass, down-left walk cycle.
- Character consistency: pass, same green warrior silhouette, outfit proportions, armor, hair, boots, and palette family.
- Sword: pass, sword is visibly held in the character's right hand in every frame.
- Left hand: pass, left hand remains empty in every frame.
- Shield/off-hand object: pass, no shield, buckler, off-hand weapon, or held object.
- Background/scenery: pass, no scenery, labels, UI, poster composition, or unrelated objects.
- Motion read: pass, readable 8-frame walk loop with stable torso and anchored feet.

## Decision

Approved. The row was updated in `animation_queue.csv` with the output paths above.
