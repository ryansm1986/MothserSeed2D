# Agent Job Prompt Template

Use `$game-studio:sprite-pipeline`.

Keep using `$game-studio:sprite-pipeline` for the entire job: source-strip generation, cleanup, normalization, preview rendering, GIF creation, QA notes, and queue update.

Process exactly one animation/direction job at a time. Do not generate or process multiple directions in one source image, one source sheet, one prompt, or one batch.

Use only the reusable template files and `$game-studio:sprite-pipeline` for this job. Do not search the project for existing animation tools, old pipeline scripts, old generated strips, old normalized frames, hidden automation, or another character/monster pipeline. Do all job output work from scratch for `<JOB_ID>`. If this job needs a fresh helper script, config, checklist, or temporary processing tool, create it only under `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/tools/`, name job-specific tools with the `<JOB_ID>` prefix, and record it in the queue and QA note.

Inferred project root: `<PROJECT_PATH>`
Inferred subject id: `<SUBJECT_ID>`
Inferred subject type: `<character|monster>`
Base folder: `<BASE_FOLDER_PATH>`
Required base files: `<BASE_FOLDER_PATH>/north.png`, `<BASE_FOLDER_PATH>/south.png`, `<BASE_FOLDER_PATH>/east.png`, `<BASE_FOLDER_PATH>/west.png`
Mapped base source(s) for this job: `<BASE_SOURCE_PATHS>`
Inferred pipeline folder: `<SUBJECT_PIPELINE_FOLDER>`
Queue file: `<SUBJECT_PIPELINE_FOLDER>/animation_queue.csv`
Frame profiles: `<SUBJECT_PIPELINE_FOLDER>/frame_profiles.csv`
Subject size: `<default|medium|large>`
One-job-at-a-time answer: `<YES_STRICTLY_FOLLOW_TEMPLATES_OR_EXPLICIT_ALTERNATE_WORKFLOW>`

Task: Work only on `<JOB_ID>`, which is `<ANIMATION>/<DIRECTION>` with `<FRAME_COUNT>` frames.

## Required Inputs

- `$game-studio:sprite-pipeline` must be active for this animation/direction job.
- Template-only tooling is required. Use only the copied subject pipeline files derived from `assets/sprite_pipeline_template` plus the required base folder, unless the user explicitly approves another tool or reference.
- Fresh helper tools are allowed only when created inside the active animation folder at `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/tools/`. Do not create or modify helper tools in the project root, project `scripts/`, reusable template folder, another subject folder, or another animation folder unless the user explicitly approves it.
- Base folder must exist before generation starts.
- Base folder location/path is required.
- Base folder must contain `north.png`, `south.png`, `east.png`, and `west.png`.
- Project root, subject type, subject id, and pipeline folder must be inferred from the base folder path. Do not ask for them separately.
- Valid base folders are `<project>/assets/characters/<subject_id>/base/` and `<project>/assets/monsters/<subject_id>/base/`.
- Animation name is required.
- Direction set default is 8-directional unless the user selected 4-directional.
- One-job-at-a-time default is yes: strictly follow the templates.
- If the intake answer was blank or yes, this prompt must process exactly one queue row and must not batch directions.
- If the user answered no, this job prompt must include the user's explicit approved alternate workflow before any generation starts.
- If the selected direction set is 8-directional, the queue must include all eight required directions: `south`, `southeast`, `east`, `northeast`, `north`, `northwest`, `west`, and `southwest`.
- If the selected direction set is 4-directional, the queue must include all four required directions: `south`, `east`, `north`, and `west`.
- Frame count default comes from the animation defaults unless the user specified a count.
- Required items/weapons/features default to what is visible in the directional base set.
- Subject size defaults to `default`. For monsters, `default` is about character size, `medium` is about 2 times character size, and `large` is about 3 times character size.
- For monster jobs, the selected monster frame profile's width is the minimum required empty source-strip gutter between every neighboring pair of visible pose bounds.
- If spacing requires more room, expand the horizontal source canvas width and gutters. Do not shrink the subject, reduce the selected scale, or crop animation/effect pixels to make the strip fit.

## Directional Base Selection

- `north` uses `<BASE_FOLDER_PATH>/north.png`.
- `south` uses `<BASE_FOLDER_PATH>/south.png`.
- `east` uses `<BASE_FOLDER_PATH>/east.png`.
- `west` uses `<BASE_FOLDER_PATH>/west.png`.
- `northeast` uses both `<BASE_FOLDER_PATH>/north.png` and `<BASE_FOLDER_PATH>/east.png`.
- `southeast` uses both `<BASE_FOLDER_PATH>/south.png` and `<BASE_FOLDER_PATH>/east.png`.
- `southwest` uses both `<BASE_FOLDER_PATH>/south.png` and `<BASE_FOLDER_PATH>/west.png`.
- `northwest` uses both `<BASE_FOLDER_PATH>/north.png` and `<BASE_FOLDER_PATH>/west.png`.
- Legacy aliases map as `up=north`, `down=south`, `right=east`, `left=west`, `up_right=northeast`, `down_right=southeast`, `down_left=southwest`, and `up_left=northwest`.

## Parallel Coordination

- Re-read `animation_queue.csv` before doing anything.
- Do not search for tools or workflow instructions outside the copied subject pipeline files.
- Do not use, create, or modify animation tools outside `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/tools/` unless the user explicitly approved that specific tool.
- Verify the queue contains every required direction for the selected direction set before claiming work. If the selected direction set is 8-directional and any of the eight directions are missing, stop and report the missing directions.
- If `<JOB_ID>` is owned by another `in_progress` row note, stop and report it.
- Claim only `<JOB_ID>` by setting `status=in_progress` and `qa_notes` to `Owner: <thread name>; claimed: <date/time>; scope: <JOB_ID only>`.
- Work only on `<JOB_ID>`. Do not generate source strips for any other direction while this job is active.
- Do not batch directions together even when queue rows are still pending.
- Do not edit files for other job IDs.
- Do not assemble animation sheets.

## Sprite Requirements

- Use the mapped directional base file or adjacent cardinal base pair as the required visual source.
- Do not use prior generated animation frames, old source strips, old sheets, other subject folders, or existing animation outputs as visual source material unless the user explicitly approved them.
- Generate one fresh full horizontal source strip for `<JOB_ID>`.
- The source-generation request must name exactly one animation and exactly one direction: `<ANIMATION>/<DIRECTION>`.
- The generated source image must contain exactly one horizontal strip for `<DIRECTION>` only.
- Do not request or accept multiple directions, multiple rows, direction sheets, cardinal/diagonal sets, turnarounds, comparison panels, reference grids, or any extra facing in the source image.
- If the generated source image contains any direction other than `<DIRECTION>`, reject it before normalization and regenerate a single-direction strip.
- Before image generation, write a numbered frame-by-frame pose plan with one distinct motion beat per requested frame.
- Every source-strip frame slot must be a distinct newly drawn animation pose for that beat.
- Do not duplicate or near-duplicate the same pose across frames. Do not create animation by shifting, rotating, scaling, smearing, changing only shadows, changing only effects, or drawing effects over an unmoving body.
- Frame-to-frame silhouettes must visibly change at game scale. For idle, use subtle but real breathing, weight shift, cloth, hair, weapon, tail, wing, or posture changes. For locomotion/actions, use clear limb, torso, head, weapon, or creature-anatomy progression.
- Do not create a source strip by rotating, warping, scaling, or drawing over an existing animation frame.
- Same subject, same facing direction, same silhouette family, same proportions, same palette family.
- Preserve the selected subject size and footprint across frames. Do not shrink medium or large monsters into a character-sized frame.
- Do not generate smaller versions of the subject to satisfy strip spacing. Keep the subject at the selected size and solve spacing by expanding the source canvas width, lane width, and gutters.
- Character item, clothing, skin, hair, fur, scale, armor, and equipment colors must remain consistent with the directional base set unless the user explicitly specifies a color change.
- Preserve required items, weapons, armor, clothing, body features, horns, claws, wings, tail, glow, or other user-specified details.
- Do not add unrequested weapons, shields, props, limbs, extra heads, extra tails, or unrelated items.
- Make the animation readable at game scale.
- The body or creature anatomy must move in a way appropriate to `<ANIMATION>`.
- For action rows, include anticipation, action/contact, follow-through, and recovery.
- For action rows, include distinct wind-up, commitment, impact/cast/contact, follow-through, and recovery poses. Do not use an idle body with an effect pasted on top.
- Transparent or flat `#ff00ff` chroma-key background.
- Initial generated strip must have at least one full frame of empty flat `#ff00ff` space between neighboring visible pose bounds before cleanup/repack.
- Minimum initial source spacing is the selected frame width: `128px` for default character-size gameplay, `256px` for medium monster gameplay, `384px` for default expanded action or large monster gameplay, `768px` for medium monster expanded action, `1152px` for large monster expanded action, or the custom profile width.
- If the source strip is too tight, regenerate or rebuild it on a wider horizontal canvas. Add width to the canvas and gutters; do not reduce pose size, subject scale, effect scale, or silhouette size.
- Minimum source canvas width should start at `(frame_count * selected_frame_width) + ((frame_count - 1) * min_initial_source_spacing_px) + (2 * min_raw_gutter_px)` and expand beyond that whenever the subject, weapon, tail, wing, shadow, glow, or effects need more room.
- For monster rows, measure the empty gutter between the rightmost visible pixel of pose `N` and the leftmost visible pixel of pose `N+1`, including limbs, tail, wings, weapons, shadows, glows, particles, alpha haze, and all effect pixels.
- For monster rows, every neighboring source-pose gap must be at least one selected-frame width: `256px` for medium gameplay, `384px` for large gameplay, `768px` for medium action/effect rows, or `1152px` for large action/effect rows.
- Reject and regenerate monster strips that fail the full-frame spacing check on a wider source canvas at the same monster scale. Do not salvage them by equal-slot slicing, shrinking the monster, cropping effects, or accepting bleed into neighboring pose lanes.
- No body part, item, weapon, wing, tail, scarf, shadow, glow, particle haze, alpha haze, loose pixel, scenery, label, UI, poster element, or unrelated object may enter the gutters.

## Workflow

1. Confirm `$game-studio:sprite-pipeline` is active for this job.
2. Confirm template-only tooling: use only the copied subject pipeline files, `frame_profiles.csv`, `animation_queue.csv`, `agent_job_prompt_template.md`, `job_qa_template.md`, and the required base folder. Do not search for other tools.
3. Verify the base folder exists and contains `north.png`, `south.png`, `east.png`, and `west.png`.
4. Confirm the active `animation`, `direction`, mapped base source(s), `frame_count`, direction set, subject size, required items/features, and frame profile.
5. Confirm the one-job-at-a-time intake answer. If blank or yes, strictly follow this one-row job prompt. If no, verify the user explicitly approved an alternate workflow before continuing.
6. Confirm the queue contains all required directions for the selected direction set.
7. Write the numbered frame-by-frame pose plan for `<FRAME_COUNT>` frames.
8. If a fresh helper tool is needed, create it under `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/tools/` with the `<JOB_ID>` prefix before use, then list it in the QA note and queue row.
9. Generate one fresh one-direction source strip for `<JOB_ID>` using `$game-studio:sprite-pipeline`.
10. Save raw/chromakey files under `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/raw/` using the `<JOB_ID>` prefix.
11. Verify the source image contains exactly one horizontal strip for `<DIRECTION>` and no other directions, rows, panels, turnarounds, or grouped direction sheet.
12. Verify every source frame is a distinct newly drawn pose with visible silhouette/body progression.
13. Verify full-frame empty spacing between neighboring visible poses in the initial generated strip.
14. For monster jobs, measure and record that every neighboring source-pose gap is at least the selected monster frame width before cleanup/repack/normalization.
15. Reject and regenerate before normalization if the source has multiple directions, multiple rows, direction sheets, comparison panels, cropped pixels, wrong-facing frames, duplicated or near-duplicated frames, static body poses, effect-only changes, color drift from the directional base set, missing required items/features, unrequested objects, baked-in gutter contamination, or monster source spacing below one selected-frame width.
16. If spacing fails, regenerate or rebuild the raw strip on a wider horizontal source canvas with larger gutters at the same selected subject scale. Do not solve spacing by shrinking poses, reducing scale, or cropping effects.
17. Remove chroma key, group full-strip alpha components into poses, repack with wide transparent padding, then normalize to the selected profile using `$game-studio:sprite-pipeline`.
18. Save frames as `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/frames/<JOB_ID>_01.png` through the final frame.
19. Render standard, 4x, and focused QA preview PNGs under `<ANIMATION>/preview/`.
20. Render one looping direction GIF at `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/gif/<JOB_ID>.gif`.
21. Write `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/qa/<JOB_ID>_qa.md` with source provenance and QA checks.
22. Update only the `<JOB_ID>` queue row.
