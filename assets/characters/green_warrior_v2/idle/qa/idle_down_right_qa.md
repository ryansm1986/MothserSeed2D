# idle_down_right QA

- Confirmed job: `animation=idle direction=down_right frame_count=5`
- Base sprite: `assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Generated pose: `assets/characters/green_warrior_v2/idle/raw/idle_down_right_pose.png`
- Raw output: `assets/characters/green_warrior_v2/idle/raw/idle_down_right_raw.png`
- Rejected attempt 1 note: read as down_left during user QA
- Rejected attempt 2 note: corrected direction but sword was cropped at strip edge
- Final raw strip note: attempt 3 repacked into equal transparent slots with per-slot padding before normalization
- Normalized frames: `assets/characters/green_warrior_v2/idle/frames/idle_down_right_01.png` through `idle_down_right_05.png`
- Preview: `assets/characters/green_warrior_v2/idle/preview/idle_down_right_preview.png`
- Enlarged QA preview: `assets/characters/green_warrior_v2/idle/preview/idle_down_right_preview_4x.png`

## Gates

- Matches approved transparent base sprite: pass
- Generated pose fits idle/down_right: pass
- Additional frames create subtle idle motion: pass
- Transparent background preserved: pass
- Character colors not visibly distorted: pass
- Facing direction correct: pass after revision
- Feet/ground contact bottom anchored: pass
- Frame size fixed at 64x64: pass
- Motion reads at game scale: pass
- No extra objects, scenery, labels, or UI text: pass
- No cropped weapon/body in raw strip slots: pass
- Loop readability: pass

## Raw Slot Crop Checks

- frame 1: slot_size=396x793 bbox=(38, 156, 357, 636) margins=(38, 156, 39, 157) ok=true
- frame 2: slot_size=396x793 bbox=(28, 155, 367, 638) margins=(28, 155, 29, 155) ok=true
- frame 3: slot_size=396x793 bbox=(33, 157, 362, 635) margins=(33, 157, 34, 158) ok=true
- frame 4: slot_size=396x793 bbox=(29, 156, 367, 636) margins=(29, 156, 29, 157) ok=true
- frame 5: slot_size=396x793 bbox=(27, 157, 368, 635) margins=(27, 157, 28, 158) ok=true

## Mechanical Frame Checks

- `idle_down_right_01.png` size=64x64 bbox=(11, 0, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_down_right_02.png` size=64x64 bbox=(9, 0, 54, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_down_right_03.png` size=64x64 bbox=(10, 1, 54, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_down_right_04.png` size=64x64 bbox=(9, 0, 54, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_down_right_05.png` size=64x64 bbox=(9, 1, 54, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true

## Queue State

- approved=2
- pending=54
- in_progress=0
- needs_revision=0

Final QA status: `approved`
