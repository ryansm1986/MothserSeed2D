# idle_down QA

- Confirmed job: `animation=idle direction=down frame_count=5`
- Base sprite: `assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Generated pose: `assets/characters/green_warrior_v2/idle/raw/idle_down_pose.png`
- Raw output: `assets/characters/green_warrior_v2/idle/raw/idle_down_raw.png`
- Normalized frames: `assets/characters/green_warrior_v2/idle/frames/idle_down_01.png` through `idle_down_05.png`
- Preview: `assets/characters/green_warrior_v2/idle/preview/idle_down_preview.png`
- Enlarged QA preview: `assets/characters/green_warrior_v2/idle/preview/idle_down_preview_4x.png`

## Gates

- Matches approved transparent base sprite: pass
- Generated pose fits idle/down: pass
- Additional frames create subtle idle motion: pass
- Transparent background preserved: pass
- Character colors not visibly distorted: pass
- Facing direction correct: pass
- Feet/ground contact bottom anchored: pass
- Frame size fixed at 64x64: pass
- Motion reads at game scale: pass
- No extra objects, scenery, labels, or UI text: pass after connected-component cleanup
- Loop readability: pass

## Mechanical Frame Checks

- `idle_down_01.png` size=64x64 bbox=(9, 0, 54, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_down_02.png` size=64x64 bbox=(11, 0, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_down_03.png` size=64x64 bbox=(11, 0, 52, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_down_04.png` size=64x64 bbox=(10, 0, 54, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true
- `idle_down_05.png` size=64x64 bbox=(11, 0, 52, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 ok=true

## Queue State

- approved=1
- pending=55
- in_progress=0

Final QA status: `approved`
