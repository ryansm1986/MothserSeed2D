# idle_right QA

- Confirmed job: `animation=idle direction=right frame_count=5`
- Base sprite: `assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Generated pose: `assets/characters/green_warrior_v2/idle/raw/idle_right_pose.png`
- Raw output: `assets/characters/green_warrior_v2/idle/raw/idle_right_raw.png`
- Raw strip note: generated strip repacked into equal transparent slots with per-slot padding before normalization
- Normalized frames: `assets/characters/green_warrior_v2/idle/frames/idle_right_01.png` through `idle_right_05.png`
- Preview: `assets/characters/green_warrior_v2/idle/preview/idle_right_preview.png`
- Enlarged QA preview: `assets/characters/green_warrior_v2/idle/preview/idle_right_preview_4x.png`

## Gates

- Matches approved transparent base sprite: pass
- Generated pose fits idle/right: pass
- Additional frames create subtle idle motion: pass
- Transparent background preserved: pass
- Character colors not visibly distorted: pass
- Facing direction correct: pass
- Feet/ground contact bottom anchored: pass
- Frame size fixed at 64x64: pass
- Motion reads at game scale: pass
- No extra objects, scenery, labels, or UI text: pass
- No cropped weapon/body in raw strip slots: pass
- Loop readability: pass

## Raw Slot Crop Checks

- frame 1: slot_size=396x793 bbox=(41, 156, 355, 637) margins=(41, 156, 41, 156) ok=true
- frame 2: slot_size=396x793 bbox=(42, 155, 353, 638) margins=(42, 155, 43, 155) ok=true
- frame 3: slot_size=396x793 bbox=(29, 162, 367, 631) margins=(29, 162, 29, 162) ok=true
- frame 4: slot_size=396x793 bbox=(34, 163, 361, 630) margins=(34, 163, 35, 163) ok=true
- frame 5: slot_size=396x793 bbox=(41, 162, 355, 631) margins=(41, 162, 41, 162) ok=true

## Mechanical Frame Checks

- `idle_right_01.png` size=64x64 bbox=(11, 0, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_right_02.png` size=64x64 bbox=(11, 0, 52, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_right_03.png` size=64x64 bbox=(9, 2, 54, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_right_04.png` size=64x64 bbox=(10, 2, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_right_05.png` size=64x64 bbox=(11, 2, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true

## Queue State

- approved=3
- pending=53
- in_progress=0
- needs_revision=0

Final QA status: `approved`
