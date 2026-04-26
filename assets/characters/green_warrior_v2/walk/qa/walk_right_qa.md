# walk_right QA

Status: `in_progress` (resumed from `PIPELINE_RESUME.md` checklist)

## Inputs
- Queue row: `walk_right`
- Frames: `assets/characters/green_warrior_v2/walk/frames/walk_right_01.png` through `walk_right_08.png`
- Existing repair preview: `assets/characters/green_warrior_v2/walk/preview/walk_right_repair_inspect_4x.png`

## Required Before Approval
- Generate/refresh focused `8x` close preview for frames `6-8`.
- Confirm sword remains visible in hand for frames `7` and `8`.
- If missing, perform local repair using nearest good `walk_right` frame as source.
- Rebuild full walk_right previews after repair.
- Re-run mechanical checks (64x64, transparent BG, non-empty alpha per frame).

Final QA status: `pending_visual_check`
