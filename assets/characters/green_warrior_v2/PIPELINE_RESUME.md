# green_warrior_v2 Sprite Pipeline Workflow And Resume Notes

Last updated: 2026-04-25 from this Codex thread.

This document is the handoff note for continuing the `green_warrior_v2` sprite pipeline without mixing in any other character, task, or thread.

## Source Of Truth

- Required plan: `C:/Projects/MotherSeed2D/assets/character_asset_generation_plan.md`
- Character folder: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2`
- Original base sprite: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/warrior_base_v2.png`
- Untouched base backup: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/base/warrior_base_v2_original.png`
- Canonical transparent base: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Queue file: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/animation_queue.csv`

Use only the canonical `green_warrior_v2` base/edit canvas as visual reference. Do not reference, inspect, blend, borrow from, or prompt from other character assets.

## Plan Contract

The plan requires 56 jobs total: 7 animations x 8 directions.

Direction order:

1. `down`
2. `down_right`
3. `right`
4. `up_right`
5. `up`
6. `up_left`
7. `left`
8. `down_left`

Animation order:

1. `idle`: 5 frames
2. `walk`: 8 frames
3. `run`: 8 frames
4. `sprint`: 12 frames
5. `dodge`: 5 frames
6. `attack`: 8 frames
7. `special`: 8 frames

Allowed queue statuses are exactly:

- `pending`
- `in_progress`
- `needs_revision`
- `approved`
- `rejected`

Only one row should be `in_progress`. Finish or explicitly release that row before starting the next row.

## Current Queue State

At the latest check:

- `approved`: 10
- `in_progress`: 1
- `needs_revision`: 1
- `pending`: 44

Approved rows:

- `idle_down`
- `idle_down_right`
- `idle_right`
- `idle_up_right`
- `idle_up`
- `idle_up_left`
- `idle_left`
- `idle_down_left`
- `walk_down`
- `walk_down_right`

Current active row:

- `walk_up_right` is `in_progress`

Parked row requiring follow-up:

- `walk_right` is `needs_revision` pending focused sword QA/repair on late frames.

## Completed Work

Base cleanup is complete:

- Background removed from the canonical transparent base.
- Character RGB pixels were preserved during cleanup.
- Base cleanup QA lives at `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/base/base_cleanup_qa.md`.

Idle is complete:

- All 8 idle directions are approved.
- Frames live under `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/idle/frames`.
- Assembly outputs:
  - `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/idle/assembled/idle_8dir_sheet.png`
  - `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/idle/assembled/idle_8dir_preview.png`
  - `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/idle/assembled/idle_8dir_metadata.json`

Walk progress:

- `walk_down` is approved.
- `walk_down_right` is approved after a focused local sword repair.
- `walk_right` is parked in `needs_revision` for focused sword follow-up.
- `walk_up_right` is now the active `in_progress` row (next available animation in plan order).

## Critical Recent Context

The user identified a QA failure: the last two `walk_down_right` frames had no sword in hand.

That was corrected locally, without using another asset:

- Backups:
  - `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/walk/frames/walk_down_right_07_before_sword_repair.png`
  - `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/walk/frames/walk_down_right_08_before_sword_repair.png`
- Focused verification preview:
  - `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/walk/preview/walk_down_right_frames_06_08_sword_check_8x.png`

The same missing-sword problem likely affects `walk_right`. Current `walk_right` files exist, but the row is not approved:

- `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/walk/frames/walk_right_01.png` through `walk_right_08.png`
- `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/walk/preview/walk_right_repair_inspect_4x.png`

Resume by opening `walk_right_repair_inspect_4x.png` first, then make a close 8x preview of frames 6-8. If frames 7 or 8 lack a sword in hand, repair them before QA approval.

## Off-Target Generation Warning

One image generation retry produced unrelated imagery. The user called out that it had nothing to do with the project.

Do not use off-target generated images. Only use images that:

- live under `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/...`
- match the active queue row
- use the `green_warrior_v2` base as the only reference
- pass visual QA

If generation drifts into non-sprite or unrelated content, reject it and either retry from the proper edit canvas or perform a deterministic local repair.

## Per-Job Workflow

1. Verify `animation_queue.csv`.
2. Confirm no other row is currently owned by this thread.
3. Set exactly one row to `in_progress`.
4. Build an edit canvas from the canonical transparent base.
5. Generate one full strip for exactly one animation and one direction.
6. Copy the generated image into the current animation `raw/` folder.
7. Remove chroma key or background.
8. Repack detected frame components into equal transparent slots with enough side padding for the sword.
9. Normalize to `64x64` frames with shared bottom-center anchoring.
10. Render normal and enlarged previews.
11. QA mechanically and visually.
12. Mark the row `approved` only after QA passes.
13. After all 8 directions for an animation are approved, assemble that animation sheet and metadata.

## Local Tools And Scripts

Bundled Python:

```powershell
C:/Users/there/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe
```

Sprite pipeline scripts:

```powershell
C:/Users/there/.codex/plugins/cache/openai-curated/game-studio/421657af/scripts/build_sprite_edit_canvas.py
C:/Users/there/.codex/plugins/cache/openai-curated/game-studio/421657af/scripts/normalize_sprite_strip.py
```

Chroma removal helper:

```powershell
C:/Users/there/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py
```

Generated image source folder used in this thread:

```powershell
C:/Users/there/.codex/generated_images/019dc5db-3e0c-7083-8e39-b71f709f1d88/
```

## Prompting Rules For Generation

Prompt every generation with these constraints:

- based only on the supplied `green_warrior_v2` reference
- same character
- same outfit proportions
- same silhouette family
- same palette family
- same readable sword/shield/armor details
- same requested facing direction
- exact frame count
- one horizontal strip
- transparent or flat `#ff00ff` chroma-key background
- no scenery
- no labels
- no UI
- no poster composition
- no unrelated symbols or decorative objects

For this character, `#ff00ff` chroma-key has worked better than asking directly for transparent output because the character contains green tones.

## Repack And Normalization Notes

After chroma removal, detect alpha-connected components and keep the largest `frame_count` components sorted by x.

Use dynamic slot width when repacking. Do not rely on the original image width divided by frame count if a frame includes a wide sword pose. A safe rule is:

```text
slot_w = max(max_component_width + 96, original_width // frame_count)
```

Then center each component in its slot, save the repacked raw strip, and normalize with shared scale and bottom-center alignment.

## QA Checklist

Mechanical checks:

- exact frame count
- every frame is `64x64`
- background is transparent
- no magenta chroma-key pixels remain
- non-empty alpha bounding box in every frame
- no frame is cropped by the slot

Visual checks:

- correct facing direction
- same character and palette
- no unrelated objects or labels
- feet remain anchored
- loop reads cleanly for `idle`, `walk`, `run`, and `sprint`
- one-shot timing reads clearly for `dodge`, `attack`, and `special`
- sword remains visibly in hand on all frames where it should be present
- last two frames are inspected closely before approval

## Immediate Resume Checklist

1. Read `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/animation_queue.csv`.
2. Confirm `walk_up_right` is the only `in_progress` row.
3. Generate `walk_up_right` using only the canonical `green_warrior_v2` base reference.
4. Repack and normalize to eight `64x64` frames with shared bottom-center anchoring.
5. Render standard and enlarged previews, then run mechanical + visual QA.
6. Mark `walk_up_right` approved only after QA passes.
7. Return to `walk_right` (`needs_revision`) and finish the focused sword late-frame repair/QA before continuing further rows.

## Coordination Rule

The user explicitly said not to work on the other thread's task. Before editing queue rows or assets, check the queue. If another thread has marked a row or its QA note suggests ownership by another active task, skip it and continue only on the row owned by this thread.
