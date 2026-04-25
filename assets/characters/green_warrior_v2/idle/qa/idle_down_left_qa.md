# idle_down_left QA

- Confirmed job: `animation=idle direction=down_left frame_count=5`
- Base sprite: `assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Generated pose: `assets/characters/green_warrior_v2/idle/raw/idle_down_left_pose.png`
- Raw output: `assets/characters/green_warrior_v2/idle/raw/idle_down_left_raw.png`
- Raw strip note: generated strip repacked into equal transparent slots with per-slot padding before normalization
- Normalized frames: `assets/characters/green_warrior_v2/idle/frames/idle_down_left_01.png` through `idle_down_left_05.png`
- Preview: `assets/characters/green_warrior_v2/idle/preview/idle_down_left_preview.png`
- Enlarged QA preview: `assets/characters/green_warrior_v2/idle/preview/idle_down_left_preview_4x.png`

## Gates

- Matches approved transparent base sprite: pass
- Generated pose fits idle/down_left: pass
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

- frame 1: slot_size=396x793 bbox=(36, 153, 359, 640) margins=(36, 153, 37, 153) ok=true
- frame 2: slot_size=396x793 bbox=(35, 153, 361, 640) margins=(35, 153, 35, 153) ok=true
- frame 3: slot_size=396x793 bbox=(32, 153, 363, 640) margins=(32, 153, 33, 153) ok=true
- frame 4: slot_size=396x793 bbox=(38, 153, 358, 640) margins=(38, 153, 38, 153) ok=true
- frame 5: slot_size=396x793 bbox=(33, 153, 362, 640) margins=(33, 153, 34, 153) ok=true

## Mechanical Frame Checks

- `idle_down_left_01.png` size=64x64 bbox=(11, 0, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_down_left_02.png` size=64x64 bbox=(10, 0, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_down_left_03.png` size=64x64 bbox=(10, 0, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_down_left_04.png` size=64x64 bbox=(11, 0, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_down_left_05.png` size=64x64 bbox=(10, 0, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true

## Queue State

- approved=7
- pending=48
- in_progress=1
- needs_revision=0

Final QA status: `approved`
