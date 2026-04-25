# One-At-A-Time 8-Direction Animation Pipeline

## Summary
Generate 56 total jobs: 7 animations x 8 directions. The pipeline must treat each job as exactly one animation plus one direction, finish QA for that job, then move to the next. No batching across animations, no batching across directions.

The user will supply the approved base sprite. Before animation generation begins, prepare that base sprite by making its background transparent without distorting, recoloring, or compressing the character pixels.

For every animation/direction job, the agent must generate new pictures that fit the current spec. Example: for `idle_right`, use the approved base sprite as the character model, generate a correct `idle_right` pose, then generate the additional frames needed to make that idle animation look natural.

## Base Sprite Preparation
1. Save the user-supplied base sprite as the untouched original.
2. Create a working copy for transparency cleanup.
3. Remove only the background pixels and preserve the character pixels exactly.
4. Do not apply color correction, smoothing, scaling, compression, palette reduction, or anti-aliasing changes to the character.
5. Export a transparent PNG as the canonical base sprite.
6. QA the cleaned base sprite against the original.
7. Use only the approved transparent base sprite for every animation job.

## Job Queue
Create a single queue table with:

`job_id`, `animation`, `direction`, `frame_count`, `status`, `base_sprite`, `generated_pose`, `raw_output`, `normalized_output`, `preview`, `qa_notes`

Allowed statuses:

`pending`, `in_progress`, `needs_revision`, `approved`, `rejected`

Only one row may be `in_progress`. The asset pipeline must not inspect, start, or generate assets for the next row until the current row is `approved` or explicitly `rejected`.

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

## Per-Job Steps
For each queue row:

1. Lock only this job as `in_progress`.
2. Confirm: `animation=<name> direction=<direction> frame_count=<n>`.
3. Load the approved transparent base sprite as the character model.
4. Generate a new pose/image matching only the current animation and direction.
5. Generate the remaining frames for that same animation/direction so the motion reads well.
6. Keep the full strip limited to this one animation and this one direction.
7. Prompt constraints must include: based on the supplied transparent base sprite, same character, same facing direction, same silhouette, same outfit proportions, same palette family, transparent background, exact frame count, no scenery, no labels, no poster composition.
8. Save raw output as: `assets/characters/<character>/<animation>/raw/<animation>_<direction>_raw.png`.
9. Normalize into fixed `64x64` frames with shared bottom-center anchor.
10. Save normalized frames as: `assets/characters/<character>/<animation>/frames/<animation>_<direction>_01.png`.
11. Render a preview: `<animation>_<direction>_preview.png`.
12. QA the preview at game scale.
13. If QA fails, revise only this job.
14. If QA passes, mark this job `approved`.
15. Only then move to the next queue row.

## QA Gates
Each job must pass:

- Matches the approved transparent base sprite.
- New generated pose fits the requested animation and direction.
- Additional frames create a believable animation.
- Transparent background preserved.
- Character colors are not distorted.
- Facing direction is correct.
- Feet/ground contact stays anchored.
- Frame size is fixed at `64x64`.
- Motion reads clearly at game scale.
- No extra objects, scenery, labels, or UI text.
- Looping animations loop cleanly: `idle`, `walk`, `run`, `sprint`.
- One-shot animations have clear anticipation/contact/recovery: `dodge`, `attack`, `special`.

## Assembly And Integration
After all 8 directions for one animation are approved, assemble that animation's sheet and metadata. Do not assemble partial directions into runtime assets unless they are clearly marked as draft.

After all 56 jobs are approved:

- Update character metadata from 4 directions to 8 directions.
- Use the 8-direction list consistently in manifests, frame paths, previews, and runtime loading.
- Extend `DirectionName` and direction selection logic from 4-way to 8-way.
- Keep existing runtime animation mappings compatible unless new runtime names are added.

## Assumptions
- The supplied base sprite is the source of truth for the character.
- Every animation/direction requires newly generated images, not just reused existing frames.
- Background removal must preserve character colors exactly.
- Each generation request should produce one full strip for one animation/direction, not individual unrelated frames.
- The pipeline should prioritize consistency over speed.
