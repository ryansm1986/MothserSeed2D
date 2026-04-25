# idle_left QA

- Confirmed job: `animation=idle direction=left frame_count=5`
- Base sprite: `assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Generated pose: `assets/characters/green_warrior_v2/idle/raw/idle_left_pose.png`
- Raw output: `assets/characters/green_warrior_v2/idle/raw/idle_left_raw.png`
- Raw strip note: generated strip repacked into equal transparent slots with per-slot padding before normalization
- Normalized frames: `assets/characters/green_warrior_v2/idle/frames/idle_left_01.png` through `idle_left_05.png`
- Preview: `assets/characters/green_warrior_v2/idle/preview/idle_left_preview.png`
- Enlarged QA preview: `assets/characters/green_warrior_v2/idle/preview/idle_left_preview_4x.png`
- Coordination note: did not work on `idle_up`, reserved for the other thread.

## Gates

- Matches approved transparent base sprite: pass
- Generated pose fits idle/left: pass
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

- frame 1: slot_size=396x793 bbox=(55, 142, 340, 650) margins=(55, 142, 56, 143) ok=true
- frame 2: slot_size=396x793 bbox=(44, 142, 352, 650) margins=(44, 142, 44, 143) ok=true
- frame 3: slot_size=396x793 bbox=(47, 143, 349, 650) margins=(47, 143, 47, 143) ok=true
- frame 4: slot_size=396x793 bbox=(40, 143, 355, 650) margins=(40, 143, 41, 143) ok=true
- frame 5: slot_size=396x793 bbox=(55, 143, 341, 650) margins=(55, 143, 55, 143) ok=true

## Mechanical Frame Checks

- `idle_left_01.png` size=64x64 bbox=(14, 0, 50, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_left_02.png` size=64x64 bbox=(12, 0, 51, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_left_03.png` size=64x64 bbox=(13, 0, 51, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_left_04.png` size=64x64 bbox=(12, 0, 52, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_left_05.png` size=64x64 bbox=(14, 0, 50, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true

## Queue State

- approved=6
- pending=49
- in_progress=1
- needs_revision=0

Final QA status: `approved`
