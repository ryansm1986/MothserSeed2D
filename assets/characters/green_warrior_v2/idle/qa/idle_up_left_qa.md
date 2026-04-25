# idle_up_left QA

- Confirmed job: `animation=idle direction=up_left frame_count=5`
- Base sprite: `assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Generated pose: `assets/characters/green_warrior_v2/idle/raw/idle_up_left_pose.png`
- Raw output: `assets/characters/green_warrior_v2/idle/raw/idle_up_left_raw.png`
- Raw strip note: generated strip repacked into equal transparent slots with per-slot padding before normalization
- Normalized frames: `assets/characters/green_warrior_v2/idle/frames/idle_up_left_01.png` through `idle_up_left_05.png`
- Preview: `assets/characters/green_warrior_v2/idle/preview/idle_up_left_preview.png`
- Enlarged QA preview: `assets/characters/green_warrior_v2/idle/preview/idle_up_left_preview_4x.png`
- Coordination note: did not work on `idle_up`, which was marked for the other thread.

## Gates

- Matches approved transparent base sprite: pass
- Generated pose fits idle/up_left: pass
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

- frame 1: slot_size=396x793 bbox=(42, 162, 354, 630) margins=(42, 162, 42, 163) ok=true
- frame 2: slot_size=396x793 bbox=(38, 162, 358, 630) margins=(38, 162, 38, 163) ok=true
- frame 3: slot_size=396x793 bbox=(41, 162, 355, 630) margins=(41, 162, 41, 163) ok=true
- frame 4: slot_size=396x793 bbox=(35, 162, 360, 630) margins=(35, 162, 36, 163) ok=true
- frame 5: slot_size=396x793 bbox=(40, 162, 355, 630) margins=(40, 162, 41, 163) ok=true

## Mechanical Frame Checks

- `idle_up_left_01.png` size=64x64 bbox=(10, 0, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_up_left_02.png` size=64x64 bbox=(10, 0, 54, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_up_left_03.png` size=64x64 bbox=(10, 0, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_up_left_04.png` size=64x64 bbox=(10, 0, 54, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_up_left_05.png` size=64x64 bbox=(10, 0, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true

## Queue State

- approved=5
- pending=51
- in_progress=0
- needs_revision=0

Final QA status: `approved`
