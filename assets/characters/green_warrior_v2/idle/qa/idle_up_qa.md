# idle_up QA

- Confirmed job: `animation=idle direction=up frame_count=5`
- Base sprite: `assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Generated pose: `assets/characters/green_warrior_v2/idle/raw/idle_up_pose.png`
- Raw output: `assets/characters/green_warrior_v2/idle/raw/idle_up_raw.png`
- Raw strip note: generated strip repacked into equal transparent slots with per-slot padding before normalization
- Normalized frames: `assets/characters/green_warrior_v2/idle/frames/idle_up_01.png` through `idle_up_05.png`
- Preview: `assets/characters/green_warrior_v2/idle/preview/idle_up_preview.png`
- Enlarged QA preview: `assets/characters/green_warrior_v2/idle/preview/idle_up_preview_4x.png`

## Gates

- Matches approved transparent base sprite: pass
- Generated pose fits idle/up: pass
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

- frame 1: slot_size=396x793 bbox=(73, 168, 322, 625) margins=(73, 168, 74, 168) ok=true
- frame 2: slot_size=396x793 bbox=(70, 166, 326, 626) margins=(70, 166, 70, 167) ok=true
- frame 3: slot_size=396x793 bbox=(82, 166, 313, 626) margins=(82, 166, 83, 167) ok=true
- frame 4: slot_size=396x793 bbox=(84, 166, 311, 626) margins=(84, 166, 85, 167) ok=true
- frame 5: slot_size=396x793 bbox=(74, 166, 322, 626) margins=(74, 166, 74, 167) ok=true

## Mechanical Frame Checks

- `idle_up_01.png` size=64x64 bbox=(14, 0, 49, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_up_02.png` size=64x64 bbox=(14, 0, 50, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_up_03.png` size=64x64 bbox=(16, 0, 48, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_up_04.png` size=64x64 bbox=(16, 0, 48, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_up_05.png` size=64x64 bbox=(14, 0, 49, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true

## Queue State

- approved=8
- pending=48
- in_progress=0
- needs_revision=0

Final QA status: `approved`
