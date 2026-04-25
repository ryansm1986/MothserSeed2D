# walk_down_right QA

- Confirmed job: `animation=walk direction=down_right frame_count=8`
- Previous candidate failed QA: frames 7 and 8 lost sword in hand.
- Repair: composited sword pixels from matching earlier frame onto frames 7 and 8, then rebuilt preview/raw strip from final normalized frames.
- Raw output: `assets/characters/green_warrior_v2/walk/raw/walk_down_right_raw.png`
- Preview: `assets/characters/green_warrior_v2/walk/preview/walk_down_right_preview.png`
- Enlarged QA preview: `assets/characters/green_warrior_v2/walk/preview/walk_down_right_preview_4x.png`
- Focused sword check: `assets/characters/green_warrior_v2/walk/preview/walk_down_right_frames_06_08_sword_check_8x.png`

## Gates

- Matches approved transparent base sprite: pass
- Generated pose fits walk/down_right: pass
- Additional frames create believable walk motion: pass
- Transparent background preserved: pass
- Facing direction correct: pass
- Sword visible in hand every frame: pass after repair
- Frame size fixed at 64x64: pass
- Motion reads at game scale: pass
- No extra objects, scenery, labels, or UI text: pass

## Mechanical Frame Checks

- `walk_down_right_01.png` size=64x64 bbox=(8, 0, 56, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 sword_pixels=142 ok=true
- `walk_down_right_02.png` size=64x64 bbox=(9, 2, 54, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 sword_pixels=167 ok=true
- `walk_down_right_03.png` size=64x64 bbox=(14, 1, 49, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 sword_pixels=119 ok=true
- `walk_down_right_04.png` size=64x64 bbox=(11, 2, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 sword_pixels=165 ok=true
- `walk_down_right_05.png` size=64x64 bbox=(10, 1, 53, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 sword_pixels=142 ok=true
- `walk_down_right_06.png` size=64x64 bbox=(10, 1, 54, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 sword_pixels=132 ok=true
- `walk_down_right_07.png` size=64x64 bbox=(14, 1, 54, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 sword_pixels=190 ok=true
- `walk_down_right_08.png` size=64x64 bbox=(14, 1, 54, 64) corner_alpha=[0, 0, 0, 0] magenta_key_pixels=0 sword_pixels=186 ok=true

## Queue State

- approved=10
- pending=46
- in_progress=0
- needs_revision=0

Final QA status: `approved`

## Focused Correction

- Frames 7 and 8 were corrected so the sword blade/hilt are visible in hand.
