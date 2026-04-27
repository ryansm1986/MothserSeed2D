# Agent Job Prompt Template

Use `$game-studio:sprite-pipeline`.

Project: `<PROJECT_PATH>`
Subject id: `<SUBJECT_ID>`
Subject type: `<character|monster|npc|boss|object>`
Base image: `<BASE_IMAGE_PATH>`
Pipeline folder: `<SUBJECT_PIPELINE_FOLDER>`
Queue file: `<SUBJECT_PIPELINE_FOLDER>/animation_queue.csv`
Frame profiles: `<SUBJECT_PIPELINE_FOLDER>/frame_profiles.csv`

Task: Work only on `<JOB_ID>`, which is `<ANIMATION>/<DIRECTION>` with `<FRAME_COUNT>` frames.

## Required Inputs

- Base image must exist before generation starts.
- Animation name is required.
- Direction set default is 8-directional unless the user selected 4-directional.
- Frame count default comes from the animation defaults unless the user specified a count.
- Required items/weapons/features default to what is visible in the base image.

## Parallel Coordination

- Re-read `animation_queue.csv` before doing anything.
- If `<JOB_ID>` is owned by another `in_progress` row note, stop and report it.
- Claim only `<JOB_ID>` by setting `status=in_progress` and `qa_notes` to `Owner: <thread name>; claimed: <date/time>; scope: <JOB_ID only>`.
- Do not edit files for other job IDs.
- Do not assemble animation sheets.

## Sprite Requirements

- Use the base image as the required visual source.
- Generate one fresh full horizontal source strip for `<JOB_ID>`.
- Do not create a source strip by rotating, warping, scaling, or drawing over an existing animation frame.
- Same subject, same facing direction, same silhouette family, same proportions, same palette family.
- Character item, clothing, skin, hair, fur, scale, armor, and equipment colors must remain consistent with the base image unless the user explicitly specifies a color change.
- Preserve required items, weapons, armor, clothing, body features, horns, claws, wings, tail, glow, or other user-specified details.
- Do not add unrequested weapons, shields, props, limbs, extra heads, extra tails, or unrelated items.
- Make the animation readable at game scale.
- The body or creature anatomy must move in a way appropriate to `<ANIMATION>`.
- For action rows, include anticipation, action/contact, follow-through, and recovery.
- Transparent or flat `#ff00ff` chroma-key background.
- Initial generated strip must have at least one full frame of empty flat `#ff00ff` space between neighboring visible pose bounds before cleanup/repack.
- Minimum initial source spacing is the selected frame width: `128px` for `128x128`, `384px` for `384x384`, or the custom profile width.
- No body part, item, weapon, wing, tail, scarf, shadow, glow, particle haze, alpha haze, loose pixel, scenery, label, UI, poster element, or unrelated object may enter the gutters.

## Workflow

1. Verify the base image exists.
2. Confirm the active `animation`, `direction`, `frame_count`, direction set, required items/features, and frame profile.
3. Generate one fresh source strip for `<JOB_ID>`.
4. Save raw/chromakey files under `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/raw/` using the `<JOB_ID>` prefix.
5. Verify full-frame empty spacing between neighboring visible poses in the initial generated strip.
6. Reject and regenerate before normalization if the source has cropped pixels, wrong-facing frames, color drift from the base image, missing required items/features, unrequested objects, or baked-in gutter contamination.
7. Remove chroma key, group full-strip alpha components into poses, repack with wide transparent padding, then normalize to the selected profile.
8. Save frames as `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/frames/<JOB_ID>_01.png` through the final frame.
9. Render standard, 4x, and focused QA preview PNGs under `<ANIMATION>/preview/`.
10. Render one looping direction GIF at `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/gif/<JOB_ID>.gif`.
11. Write `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/qa/<JOB_ID>_qa.md` with source provenance and QA checks.
12. Update only the `<JOB_ID>` queue row.
