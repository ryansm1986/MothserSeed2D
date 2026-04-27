# <JOB_ID> QA

Status: `pending_generation`

## Inputs

- Queue row: `<JOB_ID>`
- Base sprite: `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`
- 128 seed: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png`
- Current-pipeline references used: `<LIST_APPROVED_V3_REFERENCES_OR_NONE>`
- Fresh source confirmation: `<CONFIRM_NO_OLDER_ANIMATION_STRIP_USED>`
- Rejected source attempts, if any: `<LIST_REJECTED_ATTEMPTS_AND_REASONS_OR_NONE>`
- Frame profile: `<PROFILE>`
- Expected pose output: `assets/characters/green_warrior_v3/<ANIMATION>/raw/<JOB_ID>_pose.png`
- Expected raw strip: `assets/characters/green_warrior_v3/<ANIMATION>/raw/<JOB_ID>_raw.png`
- Required initial source-strip spacing: `<FULL_FRAME_SPACING>` empty pixels between neighboring visible pose bounds before cleanup/repack
- Expected normalized frames: `assets/characters/green_warrior_v3/<ANIMATION>/frames/<JOB_ID>_01.png` through `<JOB_ID>_<FRAME_COUNT>.png`
- Expected preview: `assets/characters/green_warrior_v3/<ANIMATION>/preview/<JOB_ID>_preview.png`
- Expected review GIF: `assets/characters/green_warrior_v3/<ANIMATION>/gif/<JOB_ID>.gif`

## Required Before Approval

- Generate one fresh `<FRAME_COUNT>`-frame `<JOB_ID>` strip from the canonical `green_warrior_v3` base/seed and approved current-pipeline v3 references only.
- Confirm no older animation strip, normalized frame set, repaired frame, or raw sheet was used as source.
- For attack/special rows, confirm the source strip was image-generated as `<ANIMATION> + <DIRECTION>` from the base/reference and was not created by rotating, skewing, warping, scaling, or drawing effects over idle/current-pipeline frames.
- For attack/special rows, confirm every frame keeps the requested direction, including follow-through and recovery frames.
- Confirm creative motion: the character body visibly changes through anticipation, action/contact, follow-through, and recovery.
- Confirm the row does not read as an idle pose with only sword/effect motion.
- Confirm the initial generated source strip has at least one full frame of empty flat `#ff00ff` space between neighboring visible poses before cleanup/repack: `128px` minimum for default rows, `384px` minimum for expanded action rows.
- Confirm no generated-source sword tip, slash arc, impact flash, scarf, shadow, spark, haze, or loose pixel is cropped by the source image edge or crosses into another pose lane.
- Confirm any use of equal-slot slicing was only for a visually clean source where alpha grouping was confused by harmless antialiasing; do not approve equal-slot salvage of visibly contaminated effects.
- Repack with transparent padding wide enough for body, sword, scarf, shadow, and effect pixels.
- Normalize to the selected frame profile with shared bottom-center anchoring.
- Export standard preview, enlarged `4x` preview, focused weapon/no-shield preview, and looping review GIF under the animation's `gif/` folder.
- Confirm there is no frame-edge contact, no inter-frame bleed, and no cropped weapon/effect pixels.
- Confirm sword is in the character's right hand and left hand is empty in every frame.

Final QA status: `pending_generation`
