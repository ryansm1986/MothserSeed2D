# <JOB_ID> QA

Status: `pending_generation`

## Inputs

- Queue row: `<JOB_ID>`
- Subject id: `<SUBJECT_ID>`
- Subject type: `<character|monster|npc|boss|object>`
- Animation/direction: `<ANIMATION> + <DIRECTION>`
- Base image: `<BASE_IMAGE_PATH>`
- User animation direction: `<USER_ANIMATION_DIRECTION_OR_DEFAULT>`
- Direction set: `<4_DIRECTIONAL_OR_8_DIRECTIONAL>`
- Frame count: `<FRAME_COUNT>`
- Required items/weapons/features: `<REQUIRED_ITEMS_OR_DEFAULT_FROM_BASE>`
- Frame profile: `<PROFILE>`
- Required initial source-strip spacing: `<FRAME_WIDTH>` empty pixels between neighboring visible pose bounds before cleanup/repack
- Expected raw strip: `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/raw/<JOB_ID>_raw.png`
- Expected normalized frames: `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/frames/<JOB_ID>_01.png` through `<JOB_ID>_<FRAME_COUNT>.png`
- Expected preview: `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/preview/<JOB_ID>_preview.png`
- Expected review GIF: `<SUBJECT_PIPELINE_FOLDER>/<ANIMATION>/gif/<JOB_ID>.gif`

## Source Provenance

- Fresh source confirmation: `<CONFIRM_BASE_IMAGE_USED>`
- Rejected source attempts, if any: `<LIST_REJECTED_ATTEMPTS_AND_REASONS_OR_NONE>`
- Other references explicitly approved by user, if any: `<LIST_OR_NONE>`

## Required Before Approval

- Base image exists and was used as the required source reference.
- Generated one fresh `<FRAME_COUNT>`-frame `<JOB_ID>` strip for `<ANIMATION> + <DIRECTION>`.
- Source was not created by rotating, skewing, warping, scaling, or drawing effects over an existing animation frame.
- Initial generated source strip has at least one full frame of empty flat `#ff00ff` space between neighboring visible poses before cleanup/repack.
- Direction is correct in every frame.
- Body/creature anatomy visibly moves and does not read as a static pose with effects pasted on top.
- Character item, clothing, skin, hair, fur, scale, armor, and equipment colors remain consistent with the base image unless the user specified changes.
- Required items/weapons/features are present in every appropriate frame.
- No unrequested item, weapon, shield, prop, limb, head, tail, wing, or unrelated object was added.
- No source sword tip, wing tip, tail tip, slash arc, impact flash, shadow, spark, haze, loose pixel, or body part is cropped by the source image edge or crosses into another pose lane.
- Repacked with transparent padding wide enough for body, items, limbs, weapons, tail, wings, scarf, shadow, and effect pixels.
- Normalized to the selected frame profile with shared bottom-center anchoring.
- Exported standard preview, enlarged `4x` preview, focused QA preview, and looping review GIF.
- No frame-edge contact, no inter-frame bleed, and no cropped effect/body pixels.

Final QA status: `pending_generation`
