# idle_up_right QA

- Confirmed job: `animation=idle direction=up_right frame_count=5`
- Base sprite: `assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Generated pose: `assets/characters/green_warrior_v2/idle/raw/idle_up_right_pose.png`
- Raw output: `assets/characters/green_warrior_v2/idle/raw/idle_up_right_raw.png`
- Raw strip note: generated strip repacked into equal transparent slots with per-slot padding before normalization
- Normalized frames: `assets/characters/green_warrior_v2/idle/frames/idle_up_right_01.png` through `idle_up_right_05.png`
- Preview: `assets/characters/green_warrior_v2/idle/preview/idle_up_right_preview.png`
- Enlarged QA preview: `assets/characters/green_warrior_v2/idle/preview/idle_up_right_preview_4x.png`

## Gates

- Matches approved transparent base sprite: pass
- Generated pose fits idle/up_right: pass
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

- frame 1: slot_size=396x793 bbox=(37, 155, 359, 637) margins=(37, 155, 37, 156) ok=true
- frame 2: slot_size=396x793 bbox=(42, 157, 354, 635) margins=(42, 157, 42, 158) ok=true
- frame 3: slot_size=396x793 bbox=(36, 155, 359, 637) margins=(36, 155, 37, 156) ok=true
- frame 4: slot_size=396x793 bbox=(37, 157, 359, 635) margins=(37, 157, 37, 158) ok=true
- frame 5: slot_size=396x793 bbox=(38, 157, 358, 635) margins=(38, 157, 38, 158) ok=true

## Mechanical Frame Checks

- `idle_up_right_01.png` size=64x64 bbox=(10, 0, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_up_right_02.png` size=64x64 bbox=(11, 1, 52, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_up_right_03.png` size=64x64 bbox=(10, 0, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_up_right_04.png` size=64x64 bbox=(10, 1, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_up_right_05.png` size=64x64 bbox=(11, 1, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true

## Queue State

- approved=4
- pending=51
- in_progress=1
- needs_revision=0

Final QA status: `approved`
