# walk_left QA

Status: `approved`

## Inputs
- Base sprite: `assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Pose seed: `assets/characters/green_warrior_v2/walk/raw/walk_left_pose.png`
- Raw strip: `assets/characters/green_warrior_v2/walk/raw/walk_left_raw.png`
- Normalized frames: `assets/characters/green_warrior_v2/walk/frames/walk_left_01.png` through `walk_left_08.png`
- Preview: `assets/characters/green_warrior_v2/walk/preview/walk_left_preview.png`
- Enlarged checks: `assets/characters/green_warrior_v2/walk/preview/walk_left_preview_4x.png`, `assets/characters/green_warrior_v2/walk/preview/walk_left_sword_empty_left_hand_check_8x.png`

## Mechanical QA
- Exact frame count: 8
- Frame size: 64x64 for every frame
- Background: transparent
- Residual magenta: none detected
- Alpha content: non-empty every frame
- Sword: visible in every frame
- Left hand: no held shield/off-hand object visible in enlarged preview
- Coordination: `walk_up_left` left untouched for the other active thread

Final QA status: `approved`
