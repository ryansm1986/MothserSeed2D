# green_warrior_v3 128 Sprite Pipeline Workflow And Resume Notes

Last updated: 2026-04-26 after regenerating `walk_right` from a fresh base-only source strip with the explicit footfall cadence `right foot forward > feet middle > left foot forward > feet middle`, then approving the row.

This document is the handoff note for running the `green_warrior_v3` sprite pipeline without mixing in another character, task, or thread.

## Source Of Truth

- Character folder: `assets/characters/green_warrior_v3`
- Copied source base: `assets/characters/green_warrior_v3/warrior_base_v3.png`
- Untouched base backup: `assets/characters/green_warrior_v3/base/warrior_base_v3_original.png`
- Canonical transparent base: `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`
- Padded 128 seed frame: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png`
- Queue file: `assets/characters/green_warrior_v3/animation_queue.csv`
- Frame profiles: `assets/characters/green_warrior_v3/frame_profiles.csv`
- Plan copy: `assets/characters/green_warrior_v3/character_asset_generation_plan_128.md`

Use only the canonical `green_warrior_v3` base/edit canvas and padded v3 seed as visual reference. Do not reference, inspect, blend, borrow from, or prompt from any other animation output, approved pipeline frame, other character folder, or older generated animation strip.

## Fresh-Source Contract

Every animation job must create a fresh source strip for `green_warrior_v3`.

- Do not use any existing animation strips, normalized frames, raw sheets, repaired frames, or approved pipeline outputs as generation, normalization, or visual-reference sources.
- Do not use `green_warrior_v2` animation strips, normalized frames, raw sheets, or repaired frames as generation or normalization sources.
- Do not treat copied or re-normalized historical strips as final source material for future work.
- A job may reference only the canonical v3 base and the padded v3 seed to preserve proportions, facing, costume, palette, and foot anchoring.
- Current-pipeline animation frames are not guides. Every job still needs a new raw strip generated from the base/seed only for its own `<animation>/<direction>` row.
- For attack and special rows, the source strip must be a newly image-generated animation for the requested action and direction. Do not make action rows by rotating, skewing, scaling, warping, or drawing effects over any existing animation frame.
- If an existing v3 row was produced by re-normalizing older animation frames and it shows bleed, cutoff, stray effect fragments, or scale artifacts, mark it `needs_revision` and regenerate it from a fresh source strip.
- Keep raw source provenance in the per-job QA note: list the base/seed used, and state that no existing animation strip, approved frame, raw sheet, repaired frame, or other character folder was used as source or reference.

## Creative Animation Contract

Fresh source generation must create real animation, not a static pose with an effect drawn over it.

- Attack and special rows must visibly change the character pose across the strip: anticipation, crouch or coil, launch/lunge, contact, follow-through, and recovery.
- Attack and special poses must be fully redrawn by image generation from the base/seed prompt. Procedural transforms of idle frames are not acceptable source generation.
- The torso, head, shoulders, sword arm, scarf, and feet should show purposeful motion appropriate to the action and facing direction.
- The character may lean, twist, step, squash/stretch slightly, recoil, and use brief afterimages or smear frames when that improves readability.
- Sword arcs and impact flashes must support the body motion; they cannot be the only animated element.
- Do not approve rows where the character still reads as idle, even if the effect layer moves.
- Preserve identity, costume, palette, and foot anchoring while allowing dynamic pose variation. Consistency should not mean stiffness.

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
3. `sprint`: 8 frames
4. `dodge`: 5 frames
5. `attack`: 8 frames
6. `special`: 8 frames

## Frame Size Profiles

- Default profile: `128x128`, anchor `{ x: 64, y: 120 }`. Use for `idle`, `walk`, `sprint`, and `dodge`.
- Expanded action profile: `384x384`, anchor `{ x: 192, y: 376 }`. Use for `attack` and `special`; this oversized square canvas is mandatory so weapon arcs, impact flashes, detached effect islands, special effects, and the full sprite silhouette have clear room inside each final frame.
- Action scale policy: use one fixed character/source scale across the whole action animation. Do not shrink individual frames to fit larger sword arcs or effects; the expanded canvas and gutters must absorb those extremes.

All frames in one job must share the same profile. If a runtime integration requires every final sheet to be strictly `128x128`, keep attack/special effects in separate overlays or request an explicit 128-only pass before generation. Do not crop action rows down just to match the default frame size.

## Current Queue State

At the latest check:

- `pending`: 0
- `in_progress`: 0
- `needs_revision`: 1
- `approved`: 47
- `rejected`: 0

Allowed queue statuses are exactly:

- `pending`
- `in_progress`
- `needs_revision`
- `approved`
- `rejected`

Multiple rows may be `in_progress` when multiple agents are active. Each `in_progress` row must identify its owner in `qa_notes`.

Queue rows currently marked `in_progress`: none

Queue rows currently marked `pending`: none

Queue rows currently marked `needs_revision`:

- `special_left`

There are 47 approved rows. Use `animation_queue.csv` as the source of truth for the full approved list.

## Existing Outputs And Regeneration Policy

Idle outputs were redone on 2026-04-26, then updated to natural standing stance:

- All 8 idle directions are approved from fresh base-reference-only v3 source strips.
- Each row has 5 frames normalized to the default v3 profile: `128x128`, anchor `{ x: 64, y: 120 }`.
- The redo intentionally replaced the earlier bootstrapped idle rows. Do not reuse the old v2-derived idle source material for future approvals.
- Source method: each idle row was image-generated as a fresh 5-pose horizontal source strip using only the canonical v3 base/seed as visual reference. The prompt asked for a simple natural standing stance with feet planted under the body and modestly apart, not feet glued together and not a walking stride.
- Retired source method: previous idle redo context is historical only. Future idle or animation regeneration must start from the canonical v3 base/seed only and must not reference walk, idle, sprint, dodge, attack, special, or other approved frames unless the user explicitly changes that rule.
- Rejected image-generation attempts for `idle_down` are preserved under `assets/characters/green_warrior_v3/idle/raw/` and `assets/characters/green_warrior_v3/idle/frames/` with `idle_down_rejected_*` names. They were rejected because they did not match the canonical spiky-haired base warrior or because frame 3 read too short.
- Mechanical QA result: 40 idle frames, all `128x128`, transparent background, no empty frames, no edge contact, no neighboring-frame bleed.
- Height guard result: all approved idle rows have `0px` to `1px` visible-height drift after regenerating the lower-looking `idle_down` strip; no final idle frame is empty or touches an edge.
- Worst transparent padding across normalized idle frames: left `27px`, top `13px`, right `26px`, floor `16px`.
- Raw strips use `640px` slots per pose to provide wide transparent gutters.
- Legacy bootstrap helper: `tools/generate_green_warrior_v3_idle_from_v2.py`. Do not use this helper for fresh-source approval.
- Frames live under `assets/characters/green_warrior_v3/idle/frames`.
- QA notes live under `assets/characters/green_warrior_v3/idle/qa`.
- Review contact sheet: `assets/characters/green_warrior_v3/idle/preview/idle_base_only_natural_stance_contact_4x.png`.
- Assembly outputs listed below are stale relative to the idle redo unless rebuilt in a separate assembly step:
  - `assets/characters/green_warrior_v3/idle/assembled/idle_8dir_sheet_128.png`
  - `assets/characters/green_warrior_v3/idle/assembled/idle_8dir_preview_2x.png`
  - `assets/characters/green_warrior_v3/idle/assembled/idle_8dir_metadata.json`

Walk outputs were redone on 2026-04-26 from the canonical base reference only:

- All 8 walk directions are approved from fresh base-reference-only v3 source strips.
- Each row has 8 frames normalized to the default v3 profile: `128x128`, anchor `{ x: 64, y: 120 }`.
- Source method: each walk row was image-generated as a fresh 8-pose horizontal source strip using only the visible canonical v3 base/seed as visual reference. Do not use old walk outputs, idle outputs, dodge/sprint/action frames, v2 material, repaired strips, or normalized historical frames as source for this pass.
- `walk_right` was regenerated again on 2026-04-26 because the previous right-facing walk read as sliding/floating, then regenerated once more to enforce the requested footfall cadence. The approved replacement uses the sequence `right foot/screen-right boot forward`, `feet in the middle`, `opposite/left foot forward`, `feet in the middle`, then repeats for frames 5-8. It uses a fresh base-only source strip and was repacked into wide raw gutters before normalization.
- Rejected `walk_right` attempt: `assets/characters/green_warrior_v3/walk/raw/walk_right_rejected_tight_gutters_chromakey.png` improved foot motion but was rejected for tight native gutters.
- Rejected `walk_right` attempt: `assets/characters/green_warrior_v3/walk/raw/walk_right_rejected_grounded_wrong_cadence_chromakey.png` was grounded but did not make the requested right/middle/left/middle cadence explicit enough.
- Mechanical QA result: 64 walk frames, all `128x128`, transparent background, no empty frames, no normalized-frame edge contact, and 8 frames per direction.
- Mechanical QA result for regenerated `walk_right`: 8 frames, all `128x128`, transparent background, no empty frames, no normalized-frame edge contact, one alpha component per frame, shared scale `0.4082`, height drift `3px`, worst padding L/T/R/B `[31, 12, 31, 16]`, and raw repack gutter estimate `520px`.
- The successful walk prompts explicitly described the direction in camera terms, required the spiky-haired base identity, and stated that no other character reference should be used.
- Raw strips use `640px` slots per pose after chroma cleanup/repack. The original image-generated sources are preserved as `assets/characters/green_warrior_v3/walk/raw/walk_<direction>_imagegen_base_only_chromakey.png`.
- Frames live under `assets/characters/green_warrior_v3/walk/frames`.
- QA notes live under `assets/characters/green_warrior_v3/walk/qa`.
- Review contact sheet: `assets/characters/green_warrior_v3/walk/preview/walk_base_only_redo_contact_4x.png`.
- Existing walk assembly outputs, if present, are stale relative to this redo unless rebuilt in a separate assembly step.

Sprint outputs were redone on 2026-04-26 from the canonical base reference only:

- All 8 sprint directions are approved from fresh base-reference-only v3 source strips.
- Each row has 8 frames normalized to the default v3 profile: `128x128`, anchor `{ x: 64, y: 120 }`.
- Source method: each sprint row was image-generated as a fresh 8-pose horizontal source strip using only the visible canonical v3 base/seed as visual reference. Do not use idle, walk, old sprint, dodge, attack, special, v2 material, repaired strips, normalized historical frames, or other character folders as source for sprint approvals.
- Mechanical QA result: 64 sprint frames, all `128x128`, transparent background, no empty frames, no normalized-frame edge contact, and 8 frames per direction.
- Final visual QA also checked and removed detached source specks/secondary alpha fragments from normalized frames, then regenerated the standard, 4x, weapon/no-shield, side-padding/no-crop, motion overlay, and GIF previews.
- The successful sprint prompts described each direction in camera terms and asked for an energetic forward lean, long alternating stride, torso bob, sword-arm counter-swing, scarf/hair/cloth response, and the sword held in the character's right hand.
- Raw strips use `640px` slots per pose after chroma cleanup/repack. The original image-generated sources are preserved as `assets/characters/green_warrior_v3/sprint/raw/sprint_<direction>_imagegen_base_only_chromakey.png`.
- Rejected source attempt: `assets/characters/green_warrior_v3/sprint/raw/sprint_up_left_rejected_offhand_duplicate_sword_chromakey.png` was rejected for duplicated/off-hand sword before the accepted `sprint_up_left` pass.
- Frames live under `assets/characters/green_warrior_v3/sprint/frames`.
- QA notes live under `assets/characters/green_warrior_v3/sprint/qa`.
- Review contact sheet: `assets/characters/green_warrior_v3/sprint/preview/sprint_base_only_redo_contact_4x.png`.
- Existing sprint assembly outputs, if present, are stale relative to this redo unless rebuilt in a separate assembly step.

Attack is being regenerated from full image-generation sources:

- The previous procedural attack pass is invalid because it transformed existing animation frames and drew action effects on top.
- All 8 attack directions have been regenerated from fresh image-generated strips using the prompt guideline `attack + direction`.
- Approved fresh attack rows: `attack_down`, `attack_down_right`, `attack_right`, `attack_up_right`, `attack_up`, `attack_up_left`, `attack_left`, and `attack_down_left`.
- Remaining attack rows needing full approval: none.
- Each row has 8 frames normalized to the expanded v3 action profile: `384x384`, anchor `{ x: 192, y: 376 }`.
- Mechanical QA result: 64 attack frames, all `384x384`, transparent background, 8 frames per direction, no empty frames, and no normalized-frame edge contact.
- The generated strip must show newly drawn body poses for the requested direction: anticipation, lunge/contact, follow-through, and recovery.
- QA must reject any row where the body reads as an idle frame, a rotated idle frame, a warped idle frame, or a pasted-over effect.
- Raw strips must use wide gutters and final frames must keep the expanded action padding requirements.
- During the successful 2026-04-26 attack pass, the best prompts explicitly named the direction in camera terms and repeated that the direction must hold through recovery frames. For example, `down` means down/front-facing; `right` means screen-right side profile; `up` means up/back-facing; diagonal up rows mean away-facing back/side diagonal; diagonal down rows mean forward-facing diagonal.
- The best source prompts requested compact effects that stay inside their own pose cell. Reject and regenerate any source where a slash arc, impact flash, sword tip, scarf, spark, shadow, or loose pixel crosses into a neighboring pose lane or gutter.
- Do not normalize a contaminated source by slicing equal slots if the source visibly bridges pose lanes. Equal-slot slicing is only a fallback when the source is visually clean and alpha grouping is confused by harmless antialiasing; otherwise regenerate the source.
- Check direction frame-by-frame, especially recovery frames. A row can look good overall but still fail if one recovery frame turns into a side, front, or back direction inconsistent with `<DIRECTION>`.
- Procedural helper rejected for approval: `tools/generate_green_warrior_v3_attack_fresh.py`. Keep only as a failed-history artifact unless deleted later.
- Legacy bootstrap helper retained for history only: `tools/generate_green_warrior_v3_attack_from_v2.py`. Do not use this helper for fresh-source approval.
- Frames live under `assets/characters/green_warrior_v3/attack/frames`.
- QA notes live under `assets/characters/green_warrior_v3/attack/qa`.
- No fresh attack assembly sheet has been generated in this pass. Assemble only in a separate assembly step when requested.

Special is being regenerated from full image-generation sources:

- Approved fresh special rows so far: `special_down`, `special_down_right`, `special_right`, `special_up_right`, `special_up`, `special_up_left`, and `special_down_left`.
- `special_left` is currently `needs_revision`. Six fresh image-generation attempts were rejected because lunge/contact frames drifted into screen-right or mixed direction. Rejected sources are preserved under `assets/characters/green_warrior_v3/special/raw/` with `special_left_rejected_*` names, and the row QA is `assets/characters/green_warrior_v3/special/qa/special_left_qa.md`.
- Mechanical QA result for approved special rows: 56 frames, all `384x384`, transparent background, 8 frames per approved direction, no empty frames, and no normalized-frame edge contact.
- The approved special rows use cool blue/cyan/teal/white power effects tied to body motion, with compact per-pose glow and wide repacked raw gutters.
- No fresh special assembly sheet has been generated. Do not assemble special while `special_left` remains `needs_revision`.

## Directory Layout

Each animation has the same clean working directories:

- `raw`: generated strips, chromakey outputs, edit canvases, and intermediate repacks
- `frames`: normalized frames
- `preview`: standard, enlarged, and focused QA preview PNGs
- `gif`: one looping review GIF per direction/job, named `<JOB_ID>.gif` such as `walk_right.gif`
- `qa`: per-job QA notes
- `assembled`: full animation sheets and metadata after all directions are approved

Do not assemble an animation while any direction for that animation is still `in_progress` or `needs_revision`.

## Bleed And Padding Rules

The older pipeline had several repairs caused by tight raw strip spacing, edge contact, and baked-in source contamination. This v3 run starts stricter:

- Generate one full strip at a time for exactly one `job_id`.
- Generate a new raw source strip for every job. Re-normalizing an older animation strip is not enough for approval unless the user explicitly requests a salvage pass.
- The initial image-generated source strip must leave at least one full frame of empty flat `#ff00ff` space between the visible bounding boxes of neighboring poses before any chroma cleanup, segmentation, repack, or normalization.
- Full-frame source-strip spacing means at least `128px` between neighboring visible poses for default `128x128` rows and at least `384px` between neighboring visible poses for expanded `384x384` attack/special rows.
- For attack/special rows, prefer sources where pose/effect islands are visually compact and separated before cleanup. If a contact flash bridges two neighboring poses, reject the source and regenerate with stricter wording rather than trying to crop around the contamination.
- For side and diagonal attacks, inspect both the source image edge and the final 384 frame edge. Reject sources where the first or last pose has a clipped sword tip or effect at the image boundary, even if normalization could hide the crop.
- Require at least two full frame-widths of empty flat `#ff00ff` gutter between poses. For expanded action rows, use at least `3072px` of raw-strip gutter and enough final-frame canvas to visually separate adjacent cells in the assembled sheet.
- Segment by alpha components after chroma cleanup before cropping.
- Repack with dynamic slots. Default profile minimum: `slot_w = max(max_group_width + 512, ceil(original_width / frame_count) + 384)`. Expanded action minimum: `slot_w = max(max_group_width + 3072, ceil(original_width / frame_count) + 2048)`.
- Keep at least `12px` transparent top/side padding in default frames and `96px` top/side padding in expanded action frames unless a specific frame is manually approved. The shared foot anchor intentionally leaves `8px` of floor padding.
- Render a looping review GIF after normalized frames are exported: `python tools/render_sprite_gif.py --job-id <JOB_ID>`. Save it under `assets/characters/green_warrior_v3/<ANIMATION>/gif/<JOB_ID>.gif` and link it in QA.
- Do not pass action rows through per-frame silhouette fitting. If one frame has a larger sword arc or effect, keep the shared scale and let the larger `384x384` frame absorb it.
- Reject any standard, 4x, or focused QA preview that shows inter-frame bleed, edge contact, detached weapon fragments, effect haze in gutters, or cropped sword/effect pixels.
- If bleed appears even though final frames have adequate transparent bounds, assume it is baked into the source strip and regenerate the source instead of widening the final frame again.

## Prompt Invariants

Every generation prompt must preserve:

- same character
- same facing direction
- same palette family
- same silhouette family
- same readable face or key features
- same outfit proportions
- sword held visibly in the character's right hand in every frame
- left hand empty in every frame
- no shield, buckler, off-hand weapon, or held object
- transparent background or flat `#ff00ff` chroma key
- exact frame count and horizontal strip layout
- at least one full frame of empty flat `#ff00ff` spacing between neighboring visible poses in the initial generated strip
- compact per-pose effects that do not cross into neighboring pose cells
- explicit direction wording that covers recovery frames
- no scenery, labels, UI, poster composition, or unrelated objects

## Attack Prompting Tips From Approved Rows

- Use direction-specific language, not only the direction slug. Say `down/front-facing`, `down-right diagonal-forward`, `right-facing side profile`, `up-right away-facing back/side diagonal`, or `up/back-facing` as appropriate.
- Repeat `including recovery frames` in the direction constraint. The most common subtle failure is a good action sequence with a recovery frame facing the wrong way.
- Keep the frame sequence concrete: ready, crouch/anticipation, coil/windup, lunge/contact, impact, follow-through, recovery step, ready recovery.
- Say that the body must move and list body parts: torso, shoulders, head, sword arm, scarf, and feet. This consistently produced better action than asking for a slash alone.
- Ask for compact slash arcs and impact flashes that stay inside their own pose cell. Wide effects are acceptable only when they still leave clean source gutters and fit inside the expanded 384 frame after normalization.
- Reject early when source issues are baked in: cropped sword tips at the image edge, effects crossing pose lanes, loose pixels in gutters, shield/off-hand objects, or a direction mismatch.
- Log rejected source attempts in the QA provenance when useful. This explains why a job may have multiple generated chromakey files and helps the next agent avoid repeating the same prompt mistake.

## First Step For A New Thread

Run:

```powershell
python tools/resume_green_warrior_v3_pipeline.py --job-id <JOB_ID> --claim --write-qa-stub --owner "<thread name>"
```

Then work only on that `job_id` prefix and that QA note.
