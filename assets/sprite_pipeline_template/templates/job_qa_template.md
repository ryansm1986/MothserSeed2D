# <JOB_ID> QA

Status: `pending_generation`

## Inputs

- Queue row: `<JOB_ID>`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling; no unapproved existing project animation tools
- Inferred project root: `<PROJECT_PATH>`
- Inferred subject id: `<SUBJECT_ID>`
- Inferred subject type: `<character|monster>`
- Animation/direction: `<ANIMATION> + <DIRECTION>`
- One-direction-only source: `<CONFIRM_SINGLE_DIRECTION_SOURCE>`
- Base folder location: `<BASE_FOLDER_PATH>`
- Required cardinal base files: `north.png`, `south.png`, `east.png`, `west.png`
- Mapped base source(s): `<BASE_SOURCE_PATHS>`
- User animation direction: `<USER_ANIMATION_DIRECTION_OR_DEFAULT>`
- Direction set: `<4_DIRECTIONAL_OR_8_DIRECTIONAL>`
- Required directions for selected set: `<REQUIRED_DIRECTIONS>`
- One-job-at-a-time answer: `<YES_STRICTLY_FOLLOW_TEMPLATES_OR_EXPLICIT_ALTERNATE_WORKFLOW>`
- Frame count: `<FRAME_COUNT>`
- Frame-by-frame pose plan: `<FRAME_BEAT_PLAN_OR_LINK>`
- Subject size: `<default|medium|large>`
- Required items/weapons/features: `<REQUIRED_ITEMS_OR_DEFAULT_FROM_BASE>`
- Frame profile: `<PROFILE>`
- Required initial source-strip spacing: `<FRAME_WIDTH>` empty pixels between neighboring visible pose bounds before cleanup/repack
- Monster spacing measurement, if subject type is monster: `<MEASURED_SOURCE_GAPS_OR_NOT_APPLICABLE>`
- Source canvas/gutter handling: `<CONFIRM_WIDER_CANVAS_USED_WHEN_NEEDED_AND_NO_SCALE_SHRINK>`
- Expected raw strip: `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/raw/<JOB_ID>_raw.png`
- Expected normalized frames: `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/frames/<JOB_ID>_01.png` through `<JOB_ID>_<FRAME_COUNT>.png`
- Expected preview: `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/preview/<JOB_ID>_preview.png`
- Expected review GIF: `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/gif/<JOB_ID>.gif`
- Expected local tools folder, if needed: `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/tools/`

## Source Provenance

- Fresh source confirmation: `<CONFIRM_MAPPED_BASE_SOURCES_USED>`
- Template-only tooling confirmation: `<CONFIRM_ONLY_TEMPLATE_TOOLING_USED>`
- Fresh helper tools created under `<ANIMATION>/tools/`, if any: `<LIST_PATHS_OR_NONE>`
- Frame uniqueness confirmation: `<CONFIRM_DISTINCT_NEW_POSES_EACH_FRAME>`
- Rejected source attempts, if any: `<LIST_REJECTED_ATTEMPTS_AND_REASONS_OR_NONE>`
- Other tools or references explicitly approved by user, if any: `<LIST_OR_NONE>`

## Required Before Approval

- `$game-studio:sprite-pipeline` was used throughout source generation, normalization, preview rendering, GIF creation, and QA.
- Only reusable template files, copied subject pipeline files, and user-approved tools/references were used.
- No existing project animation tooling, old pipeline scripts, prior generated strips, prior normalized frames, hidden automation, or another subject pipeline was searched for or reused.
- Any freshly created helper scripts, configs, checklists, or temporary processing tools are stored under `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/tools/`, named/scoped to the active animation or `<JOB_ID>`, and listed in this QA note.
- No helper tools were created or modified in the project root, project `scripts/`, reusable template folder, another subject folder, or another animation folder without explicit user approval.
- One-job-at-a-time answer was blank/yes, or a user-approved alternate workflow was documented before generation.
- Job was processed as one animation plus one direction only.
- Source image contains exactly one horizontal strip for the active direction and no other directions, rows, panels, turnarounds, comparison grids, or grouped direction sheets.
- Base folder exists and contains `north.png`, `south.png`, `east.png`, and `west.png`.
- Correct mapped cardinal base file or adjacent cardinal base pair was used as the required source reference.
- Animation queue contains every required direction for the selected direction set.
- Generated one fresh `<FRAME_COUNT>`-frame `<JOB_ID>` strip for `<ANIMATION> + <DIRECTION>`.
- A numbered frame-by-frame pose plan exists for the requested frame count.
- Every source frame is a distinct newly drawn animation pose for its planned beat.
- No duplicated, near-duplicated, shifted, rotated, scaled, smeared, shadow-only, effect-only, or idle-body-copy frames were accepted.
- Selected subject size is respected: default about character size, medium about 2 times character size, or large about 3 times character size.
- Source was not created by rotating, skewing, warping, scaling, or drawing effects over an existing animation frame.
- Initial generated source strip has at least one full frame of empty flat `#ff00ff` space between neighboring visible poses before cleanup/repack.
- If the spacing requirement needed more room, the source canvas width, lane width, and gutters were expanded instead of shrinking the subject, reducing animation scale, or cropping effects.
- For monster jobs, every neighboring visible source-pose gap was measured before cleanup/repack/normalization and is at least one selected-frame width: `256px` medium gameplay, `384px` large gameplay, `768px` medium action/effect, or `1152px` large action/effect.
- For monster jobs, no limb, tail, wing, weapon, shadow, glow, slash, particle, alpha haze, or effect pixel enters a neighboring pose lane or reduces the empty gutter below one selected-frame width.
- Direction is correct in every frame.
- Body/creature anatomy visibly moves and does not read as a static pose with effects pasted on top.
- Character item, clothing, skin, hair, fur, scale, armor, and equipment colors remain consistent with the directional base set unless the user specified changes.
- Required items/weapons/features are present in every appropriate frame.
- No unrequested item, weapon, shield, prop, limb, head, tail, wing, or unrelated object was added.
- No source sword tip, wing tip, tail tip, slash arc, impact flash, shadow, spark, haze, loose pixel, or body part is cropped by the source image edge or crosses into another pose lane.
- Repacked with transparent padding wide enough for body, items, limbs, weapons, tail, wings, scarf, shadow, and effect pixels.
- Normalized to the selected size-aware frame profile with shared bottom-center anchoring.
- Exported standard preview, enlarged `4x` preview, focused QA preview, and looping review GIF.
- No frame-edge contact, no inter-frame bleed, and no cropped effect/body pixels.

Final QA status: `pending_generation`
