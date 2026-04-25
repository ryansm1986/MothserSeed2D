# walk_down QA

- Confirmed job: `animation=walk direction=down frame_count=8`
- Base sprite: `assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Generated pose: `assets/characters/green_warrior_v2/walk/raw/walk_down_pose.png`
- Raw output: `assets/characters/green_warrior_v2/walk/raw/walk_down_raw.png`
- Raw strip note: generated strip repacked into equal transparent slots with per-slot padding before normalization
- Normalized frames: `assets/characters/green_warrior_v2/walk/frames/walk_down_01.png` through `walk_down_08.png`
- Preview: `assets/characters/green_warrior_v2/walk/preview/walk_down_preview.png`
- Enlarged QA preview: `assets/characters/green_warrior_v2/walk/preview/walk_down_preview_4x.png`

## Gates

- Matches approved transparent base sprite: pass
- Generated pose fits walk/down: pass
- Additional frames create believable walk motion: pass
- Transparent background preserved: pass
- Character colors not visibly distorted: pass
- Facing direction correct: pass
- Feet/ground contact bottom anchored: pass
- Frame size fixed at 64x64: pass
- Motion reads at game scale: pass
- No extra objects, scenery, labels, or UI text: pass
- Loop readability: pass

## Raw Slot Crop Checks

- frame 1: slot_size=271x724 bbox=(17, 176, 253, 548) margins=(17, 176, 18, 176) ok=true
- frame 2: slot_size=271x724 bbox=(9, 178, 261, 545) margins=(9, 178, 10, 179) ok=true
- frame 3: slot_size=271x724 bbox=(11, 178, 260, 546) margins=(11, 178, 11, 178) ok=true
- frame 4: slot_size=271x724 bbox=(21, 176, 250, 547) margins=(21, 176, 21, 177) ok=true
- frame 5: slot_size=271x724 bbox=(21, 177, 250, 547) margins=(21, 177, 21, 177) ok=true
- frame 6: slot_size=271x724 bbox=(15, 176, 256, 548) margins=(15, 176, 15, 176) ok=true
- frame 7: slot_size=271x724 bbox=(21, 179, 250, 544) margins=(21, 179, 21, 180) ok=true
- frame 8: slot_size=271x724 bbox=(16, 176, 254, 547) margins=(16, 176, 17, 177) ok=true

## Mechanical Frame Checks

- `walk_down_01.png` size=64x64 bbox=(11, 0, 52, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `walk_down_02.png` size=64x64 bbox=(10, 1, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `walk_down_03.png` size=64x64 bbox=(10, 1, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `walk_down_04.png` size=64x64 bbox=(12, 0, 51, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `walk_down_05.png` size=64x64 bbox=(12, 0, 51, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `walk_down_06.png` size=64x64 bbox=(11, 0, 52, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `walk_down_07.png` size=64x64 bbox=(12, 1, 51, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `walk_down_08.png` size=64x64 bbox=(11, 0, 52, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true

## Queue State

- approved=17
- pending=39
- in_progress=0
- needs_revision=0

Final QA status: `approved`
