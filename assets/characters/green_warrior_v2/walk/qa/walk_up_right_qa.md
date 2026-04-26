# walk_up_right QA

Status: `in_progress` (active queue row from `PIPELINE_RESUME.md` flow)

## Inputs
- Queue row: `walk_up_right`
- Base sprite: `assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Expected pose output: `assets/characters/green_warrior_v2/walk/raw/walk_up_right_pose.png`
- Expected raw strip: `assets/characters/green_warrior_v2/walk/raw/walk_up_right_raw.png`
- Expected normalized frames: `assets/characters/green_warrior_v2/walk/frames/walk_up_right_01.png through walk_up_right_08.png`
- Expected preview: `assets/characters/green_warrior_v2/walk/preview/walk_up_right_preview.png`

## Required Before Approval
- Generate one `8`-frame `walk_up_right` strip from the canonical `green_warrior_v2` base only.
- Repack with transparent padding wide enough for sword poses.
- Normalize to `64x64` with shared bottom-center anchoring.
- Export standard preview and enlarged `4x` preview.
- Run focused late-frame sword visibility check before approval.

Final QA status: `pending_generation`
