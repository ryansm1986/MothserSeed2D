# green_warrior_v2 Sprite Pipeline Workflow And Resume Notes

Last updated: 2026-04-26 after repacking `attack_down_left` for consistency with neighboring attack rows.

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

The plan requires 48 jobs total: 6 animations x 8 directions.

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
3. `sprint`: 12 frames
4. `dodge`: 5 frames
5. `attack`: 8 frames
6. `special`: 8 frames

## Frame Size Profiles

Future pipeline work should normalize against an animation-size profile instead of assuming every row is `64x64`.

- Default profile: `64x64`, anchor `{ x: 32, y: 60 }`. Use this for `idle`, `walk`, `sprint`, and `dodge` unless a row is explicitly approved for a larger profile.
- Wide action profile: `96x80`, anchor `{ x: 48, y: 76 }`. Use this for future `attack` and `special` regeneration so one-handed sword arcs and special-action silhouettes have enough room.

All frames in one job must share the same profile. Existing approved `attack` rows are trusted historical `64x64` outputs for now; do not resize them unless the user explicitly asks for attack regeneration or runtime integration work.

Allowed queue statuses are exactly:

- `pending`
- `in_progress`
- `needs_revision`
- `approved`
- `rejected`

Multiple rows may be `in_progress` when multiple agents are active. Each `in_progress` row must identify its owner in `qa_notes`, for example: `Owner: Codex thread <name>; claimed: 2026-04-25 21:30 CT; scope: walk_down_left only`.

An agent may edit only the row it owns. If a row is `in_progress` without a clear owner note, treat it as owned by another active thread until the user says otherwise.

## Current Queue State

At the latest check:

- `approved`: 46
- `in_progress`: 1
- `needs_revision`: 0
- `pending`: 1

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
- `walk_right`
- `walk_up`
- `walk_up_right`
- `walk_up_left`
- `walk_left`
- `walk_down_left`
- `sprint_down`
- `sprint_right`
- `sprint_up_right`
- `sprint_up`
- `sprint_up_left`
- `sprint_left`
- `dodge_down`
- `dodge_down_right`
- `dodge_right`
- `dodge_up_right`
- `dodge_up`
- `dodge_up_left`
- `dodge_left`
- `dodge_down_left`
- `attack_down`
- `attack_down_right`
- `attack_right`
- `attack_up_right`
- `attack_up`
- `attack_up_left`
- `attack_left`
- `attack_down_left`
- `special_down`
- `special_down_right`
- `special_right`
- `special_up_right`
- `special_up`
- `special_up_left`
- `special_left`
- `special_down_left`

Current active rows:

- `sprint_down_right` is `in_progress` and owned by another scoped thread note. Do not touch it unless the user reassigns it.

Parallel coordination state:

- Multiple agents may work at once, but each thread owns exactly one `job_id`.
- Ownership is recorded in `animation_queue.csv` using `status=in_progress` plus an owner/scope note in `qa_notes`.
- A thread may write only files with its owned `job_id` prefix, plus that job's QA note.
- Do not assemble sheets while any direction for that animation is still `in_progress` or `needs_revision`.

Parked row requiring follow-up:

- `sprint_down_left` is currently `pending`. `sprint_down_right` is owned by another active thread. All `dodge`, `attack`, and `special` rows are approved.

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
- `walk_right` is approved after focused frames 6-8 sword QA; no local repair was needed.
- `walk_up_right` is approved after generation, chroma cleanup, component repack, normalization, preview, and QA.
- `walk_up` was completed by another active row and is approved.
- `walk_up_left` is approved after generation, chroma cleanup, component repack, normalization, preview, and QA.
- `walk_left` is approved: 8 frames, 64x64, transparent background, left-facing walk cycle, sword visible, left hand empty, no shield/off-hand object.
- `walk_down_left` is approved: 8 frames, 64x64, transparent background, down-left walk cycle, sword visible in the character's right hand every frame, left hand empty, no shield/off-hand object.
- `walk_down_left` files:
  - Edit canvas: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/walk/raw/walk_down_left_edit_canvas.png`
  - Chroma-key strip: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/walk/raw/walk_down_left_chromakey.png`
  - Transparent raw strip: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/walk/raw/walk_down_left_raw.png`
  - Frames: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/walk/frames/walk_down_left_01.png` through `walk_down_left_08.png`
  - Standard preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/walk/preview/walk_down_left_preview.png`
  - 4x preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/walk/preview/walk_down_left_preview_4x.png`
  - Focused QA preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/walk/preview/walk_down_left_weapon_no_shield_check_8x.png`
  - QA note: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/walk/qa/walk_down_left_qa.md`

Sprint progress:

- `sprint_down` is approved after regeneration from user feedback: 12 frames, 64x64, transparent background, down-facing sprint cycle with a stronger leaned posture and raised sword in the character's right hand every frame. Left hand remains empty; no shield/off-hand object.
- `sprint_down` files:
  - Edit canvas: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/raw/sprint_down_edit_canvas.png`
  - Chroma-key strip: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/raw/sprint_down_chromakey.png`
  - Transparent raw strip: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/raw/sprint_down_raw.png`
  - Frames: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/frames/sprint_down_01.png` through `sprint_down_12.png`
  - Standard preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/preview/sprint_down_preview.png`
  - 4x preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/preview/sprint_down_preview_4x.png`
  - Focused QA preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/preview/sprint_down_weapon_no_shield_check_8x.png`
  - QA note: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/qa/sprint_down_qa.md`
- `sprint_right` is approved: 12 frames, 64x64, transparent background, right-facing sprint cycle with strong forward lean. Sword is visible in the character's right hand every frame; left hand remains empty; no shield/off-hand object.
- `sprint_right`, `sprint_up_right`, `sprint_up`, `sprint_up_left`, and `sprint_left` were reprocessed on 2026-04-26 after user feedback about bleed between sprint sprites. The repaired rows use full-strip alpha component-mask extraction, wide transparent raw gutters, and fresh 64x64 normalization/previews. `sprint_up_right` had 12 isolated source poses. `sprint_right`, `sprint_up`, `sprint_up_left`, and `sprint_left` had 11 isolated source poses, so each uses one repeated pose to preserve the required 12 normalized frames.
- `sprint_right` files:
  - Edit canvas: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/raw/sprint_right_edit_canvas.png`
  - Pose/reference copy: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/raw/sprint_right_pose.png`
  - Chroma-key strip: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/raw/sprint_right_chromakey.png`
  - Transparent raw strip before slot repack: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/raw/sprint_right_raw_unpacked.png`
  - Transparent raw strip: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/raw/sprint_right_raw.png`
  - Frames: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/frames/sprint_right_01.png` through `sprint_right_12.png`
  - Standard preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/preview/sprint_right_preview.png`
  - 4x preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/preview/sprint_right_preview_4x.png`
  - Focused QA preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/preview/sprint_right_weapon_no_shield_check_8x.png`
  - QA note: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/sprint/qa/sprint_right_qa.md`

Attack progress:

- All 8 `attack` rows were redone on 2026-04-26 using the wide action profile: `96x80`, shared bottom-center anchor `{ x: 48, y: 76 }`.
- The wide redo reused the existing approved attack strips as motion/source inspiration, then repacked and normalized into larger frames so sword arcs no longer touch the frame bounds.
- Mechanical QA after the wide redo: 8 frames per direction, all `96x80`, transparent background, no hot-magenta residue, no empty frames, and no top/bottom/side edge contact in normalized frames.
- `attack_up_right` received an additional focused repair after user feedback: frames 05, 06, and 07 were locally cleaned to remove detached sword/impact fragments and restore a complete in-hand sword inside the `96x80` frame. Backups were saved as `attack_up_right_05_before_full_sword_repair.png`, `attack_up_right_06_before_full_sword_repair.png`, and `attack_up_right_07_before_full_sword_repair.png`.
- `attack_up` and `attack_up_left` received an additional scale redo after user feedback that those directions were smaller than the rest. Their previous normalized frames were backed up as `attack/frames/<job_id>_NN_before_scale_redo.png`; the approved rows were widened/repacked within the same `96x80` wide action profile, chroma residue was cleared, previews were rerendered, and QA notes were rewritten.
- `attack_down_left` received an additional consistency redo after user feedback that it looked different from the other attack sprites. Its previous normalized frames were backed up as `attack/frames/attack_down_left_NN_before_consistency_redo.png`; the approved row was repacked smaller inside the same `96x80` wide action profile so its footprint matches `attack_down_right` more closely, previews were rerendered, and its QA note was rewritten.
- Previous 64-profile raw backups were preserved as `attack/raw/<job_id>_raw_64profile_before_wide_repack.png`.
- Standard attack files for each approved direction now follow this pattern:
  - Edit canvas: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/attack/raw/<job_id>_edit_canvas.png`
  - Pose/reference copy: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/attack/raw/<job_id>_pose.png`
  - Chroma-key strip: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/attack/raw/<job_id>_chromakey.png`
  - Transparent raw strip: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/attack/raw/<job_id>_raw.png`
  - Frames: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/attack/frames/<job_id>_01.png` through `<job_id>_08.png`
  - Standard preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/attack/preview/<job_id>_preview.png`
  - 4x preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/attack/preview/<job_id>_preview_4x.png`
  - Focused QA preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/attack/preview/<job_id>_weapon_no_shield_check_8x.png`
  - QA note: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/attack/qa/<job_id>_qa.md`
- No attack sheet was assembled in this pass.

Dodge progress:

- All 8 `dodge` rows are approved as 5-frame dodge rolls: `dodge_down`, `dodge_down_right`, `dodge_right`, `dodge_up_right`, `dodge_up`, `dodge_up_left`, `dodge_left`, and `dodge_down_left`.
- Each dodge row was generated from its approved idle-direction seed/edit canvas, then chroma-key cleaned, repacked with sword padding, normalized to `64x64`, previewed, and QA'd.
- The user clarified the dodge action should be a roll after the first `dodge_down` pass. `dodge_down` was revised from the earlier crouch/slide result into a roll. The replaced source was preserved as `dodge_down_chromakey_replaced_non_roll.png`.
- Several generated roll strips included source shadow or thin frame-boundary artifacts. These were locally cleaned only in the active job's own files and documented in each job QA note.
- Standard dodge files follow this pattern:
  - Edit canvas: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/dodge/raw/<job_id>_edit_canvas.png`
  - Pose/reference copy: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/dodge/raw/<job_id>_pose.png`
  - Chroma-key strip: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/dodge/raw/<job_id>_chromakey.png`
  - Transparent raw strip: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/dodge/raw/<job_id>_raw.png`
  - Frames: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/dodge/frames/<job_id>_01.png` through `<job_id>_05.png`
  - Standard preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/dodge/preview/<job_id>_preview.png`
  - 4x preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/dodge/preview/<job_id>_preview_4x.png`
  - Focused QA preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/dodge/preview/<job_id>_weapon_no_shield_check_8x.png`
  - QA note: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/dodge/qa/<job_id>_qa.md`
- No dodge sheet was assembled in this pass.

Special progress:

- All 8 `special` rows are approved as 8-frame flashy spinning glowy special attacks: `special_down`, `special_down_right`, `special_right`, `special_up_right`, `special_up`, `special_up_left`, `special_left`, and `special_down_left`.
- Each special row uses the wide action profile: `96x80`, shared bottom-center anchor `{ x: 48, y: 76 }`.
- `special_down` was generated as a full strip from the approved down-facing reference, chroma-cleaned, component-cleaned, repacked, normalized to the wide action profile, previewed, and QA'd.
- `special_down_right`, `special_right`, `special_up_right`, `special_up`, `special_up_left`, `special_left`, and `special_down_left` were generated locally from canonical in-project `green_warrior_v2` sources: approved direction idle seed/edit canvas plus approved direction attack motion frames, then augmented with procedural green/yellow spinning sword-energy arcs.
- `special_right` and `special_left` had tiny detached non-character fragments cleaned from their own job-prefixed normalized frames after focused preview QA; previews were rerendered and the cleanup is documented in their QA notes.
- Standard special files follow this pattern:
  - Edit canvas: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/special/raw/<job_id>_edit_canvas.png`
  - Pose/reference copy: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/special/raw/<job_id>_pose.png`
  - Chroma-key strip: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/special/raw/<job_id>_chromakey.png`
  - Transparent raw strip: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/special/raw/<job_id>_raw.png`
  - Frames: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/special/frames/<job_id>_01.png` through `<job_id>_08.png`
  - Standard preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/special/preview/<job_id>_preview.png`
  - 4x preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/special/preview/<job_id>_preview_4x.png`
  - Focused QA preview: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/special/preview/<job_id>_weapon_no_shield_check_6x.png`
  - QA note: `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/special/qa/<job_id>_qa.md`
- No special sheet was assembled in this pass.

Current non-idle animation state:

- All 8 `walk` rows are now trusted and approved.
- `sprint_down`, `sprint_right`, `sprint_up_right`, `sprint_up`, `sprint_up_left`, and `sprint_left` are approved in the queue.
- `sprint_down_right` remains in progress and owned by another scoped thread note.
- `sprint_down_left` remains pending.
- All 8 `dodge` rows are now trusted and approved as dodge rolls. No dodge sheet was assembled in this pass.
- All 8 `attack` rows are now trusted and approved. No attack sheet was assembled in this pass.
- All 8 `special` rows are now trusted and approved. No special sheet was assembled in this pass.
- Only `idle`, completed/approved `walk` rows, approved `sprint` rows, approved `dodge` rows, approved `attack` rows, and approved `special` rows should be assumed trusted from this resume note.

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

Resolved on resume: `walk_right_frames_06_08_sword_check_8x.png` was created and frames 6-8 retain visible sword detail, so the row was approved without local repair.

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
2. Confirm the target row is not owned by another active thread.
3. Set exactly one row owned by this thread to `in_progress`, and put an owner/scope note in `qa_notes`.
4. Build an edit canvas from the canonical transparent base.
5. Generate one full strip for exactly one animation and one direction.
6. Copy the generated image into the current animation `raw/` folder.
7. Remove chroma key or background.
8. Repack detected frame groups into equal transparent slots with wide side padding for the sword. Do not split the first pass by `image_width / frame_count`.
9. Normalize to the animation profile frame size with the profile's shared bottom-center anchor.
10. Render normal and enlarged previews.
11. QA mechanically and visually.
12. Mark the row `approved` only after QA passes.
13. After all 8 directions for an animation are approved, assemble that animation sheet and metadata.

## Parallel Agent Rules

- Re-read `animation_queue.csv` immediately before claiming a row and again before writing final status.
- Never claim a row already marked `in_progress` by another owner.
- Never edit raw, frame, preview, or QA files for another job ID.
- Never use another job's generated raw strip as the visual reference.
- If another agent owns a neighboring direction, do not inspect or revise its files unless the user explicitly reassigns it.
- If a generated attempt fails, keep rejected artifacts under the active job prefix with a clear suffix such as `_rejected_missing_sword`.
- If the queue changed while this thread was working, preserve the other changes and update only this thread's owned row.
- Assembly is a separate integration pass after all directions for an animation are approved and no thread is still working in that animation folder.

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
C:/Users/there/.codex/generated_images/019dc7aa-4a7f-7d62-88cf-8ca17f5d19c6/
```

## Prompting Rules For Generation

Prompt every generation with these constraints:

- based only on the supplied `green_warrior_v2` reference
- same character
- same outfit proportions
- same silhouette family
- same palette family
- same readable sword and armor details
- sword visibly held in the character's right hand in every frame
- for back-facing/up-facing rows, the character's right hand appears on screen-right
- left hand empty in every frame
- no shield, buckler, off-hand weapon, or held object in the left hand
- same requested facing direction
- exact frame count
- one horizontal strip
- large flat `#ff00ff` gutters between every pose; use at least two full sprite-widths of empty magenta space so no pose, sword, scarf, shadow, glow, alpha haze, loose pixels, or limb crosses into a neighboring frame
- transparent or flat `#ff00ff` chroma-key background
- no scenery
- no labels
- no UI
- no poster composition
- no unrelated symbols or decorative objects

For this character, `#ff00ff` chroma-key has worked better than asking directly for transparent output because the character contains green tones.

## Repack And Normalization Notes

Bleed prevention is mandatory. Sprint strips exposed that equal-width slicing can pull body, sword, or scarf slivers from a neighboring pose into the normalized frame. Do not approve a row if the standard, 4x, or focused QA preview shows any stray vertical fragments, alpha haze, shadows, sword pieces, scarf pieces, or loose pixels between sprites.

After chroma removal, segment the full transparent strip by alpha components before any frame slicing. Choose the `frame_count` primary body components sorted by x, then assign detached sword, scarf, hair, and armor pieces to the nearest primary body group before cropping. This preserves disconnected weapon pixels without keeping unrelated edge bleed.

Use dynamic slot width when repacking. Do not rely on the original image width divided by frame count, even if the strip appears evenly spaced. The minimum safe rule is:

```text
slot_w = max(max_group_width + 320, ceil(original_width / frame_count) + 240)
```

Then center each grouped pose in its slot, save the repacked raw strip, and normalize with shared scale and bottom-center alignment. If a generated strip has tight pose spacing, reprocess from the full-strip component groups or regenerate with at least two full sprite-widths of magenta gutter between poses; do not salvage it with equal-width slot slicing.

Use the profile frame size and anchor during normalization:

- Default profile: `64x64`, anchor `{ x: 32, y: 60 }`.
- Wide action profile for future `attack` and `special` regeneration: `96x80`, anchor `{ x: 48, y: 76 }`.

For `attack` and `special`, preserve enough transparent side padding that the sword or action silhouette never touches the left or right frame edge in the focused QA preview.

## QA Checklist

Mechanical checks:

- exact frame count
- every frame matches the active animation profile size
- every frame in the job uses the same dimensions
- background is transparent
- no magenta chroma-key pixels remain
- non-empty alpha bounding box in every frame
- no frame is cropped by the slot
- no neighboring-frame bleed or stray body/sword fragments appear in preview gutters
- no alpha haze, shadows, scarf fragments, loose pixels, or sword fragments remain between sprites in standard, 4x, or focused QA previews

Visual checks:

- correct facing direction
- same character and palette
- no unrelated objects or labels
- feet remain aligned to the animation profile anchor
- loop reads cleanly for `idle`, `walk`, and `sprint`
- one-shot timing reads clearly for `dodge`, `attack`, and `special`
- sword remains visibly in the character's right hand on every frame
- sword and weapon arcs are not cropped; `attack` and `special` rows require an explicit side-padding/no-cropping check
- frame spacing is clean in the 4x preview; reject or reprocess any row with visible slivers, haze, shadows, or loose pixels between poses
- for `up`, `up_left`, and `up_right` rows, verify the right-hand sword on the screen-right side of the back-facing sprite
- left hand remains empty in every frame; reject any shield or off-hand object
- last two frames are inspected closely before approval

## Immediate Resume Checklist

1. Read `C:/Projects/MotherSeed2D/assets/characters/green_warrior_v2/animation_queue.csv`.
2. Check all `in_progress` rows and their owner/scope notes.
3. Do not use deleted or pending/in-progress `sprint` outputs; all `attack`, `dodge`, and `special` rows are approved in the queue.
4. Continue only with rows that are not owned by another active task and that have valid source/QA context.

## Agent Prompt Template

Use this when starting another Codex thread:

```text
Use $game-studio:sprite-pipeline.

Project: D:/projects/MotherSeed2D
Character: green_warrior_v2
Resume file: assets/characters/green_warrior_v2/PIPELINE_RESUME.md
Queue file: assets/characters/green_warrior_v2/animation_queue.csv

Task: Work only on <JOB_ID>, which is <ANIMATION>/<DIRECTION> with <FRAME_COUNT> frames.

Parallel coordination:
- Re-read animation_queue.csv first.
- If <JOB_ID> is in_progress and owned by another thread, stop and report it.
- Claim only <JOB_ID> by setting status=in_progress and qa_notes to: Owner: <thread name>; claimed: <date/time>; scope: <JOB_ID only>.
- Do not edit any files for other job IDs.
- Do not assemble sheets.

Sprite requirements:
- Use only canonical green_warrior_v2 base/reference assets.
- Generate one full horizontal strip for <JOB_ID>.
- Same character, same facing direction, same silhouette, same outfit proportions, same palette family.
- Sword visibly held in the character's right hand in every frame.
- Left hand empty in every frame.
- No shield, buckler, off-hand weapon, or held object.
- Transparent or flat #ff00ff chroma-key background.
- At least two full sprite-widths of empty flat #ff00ff gutter between each neighboring pose; no sword, scarf, shadow, glow, alpha haze, or loose pixels between poses.
- No scenery, labels, UI, poster composition, or unrelated objects.

Workflow:
1. Build or verify the edit canvas from the approved seed/reference.
2. Generate one full strip.
3. Save raw/chromakey files under assets/characters/green_warrior_v2/<ANIMATION>/raw/ with the <JOB_ID> prefix.
4. Remove chroma key, group full-strip alpha components into poses, repack with wide transparent padding using at least `slot_w = max(max_group_width + 320, ceil(original_width / frame_count) + 240)`, then normalize to the animation profile size and shared bottom-center anchor. Default profile is 64x64 with anchor { x: 32, y: 60 }; attack/special wide action profile is 96x80 with anchor { x: 48, y: 76 }.
5. Save frames as assets/characters/green_warrior_v2/<ANIMATION>/frames/<JOB_ID>_01.png through the final frame.
6. Render standard, 4x, and focused weapon/no-shield QA previews; for attack/special, include an explicit side-padding/no-cropping check. Reject any visible inter-frame bleed or stray fragments.
7. Write assets/characters/green_warrior_v2/<ANIMATION>/qa/<JOB_ID>_qa.md.
8. Mark only <JOB_ID> approved if QA passes, or needs_revision with a concrete reason.
9. Update PIPELINE_RESUME.md with exactly what changed.
```

## Coordination Rule

The user explicitly said not to work on the other thread's task. Before editing queue rows or assets, check the queue. If another thread has marked a row or its QA note suggests ownership by another active task, skip it and continue only on the row owned by this thread.
