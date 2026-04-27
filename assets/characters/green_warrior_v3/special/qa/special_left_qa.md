# special_left QA

Status: `needs_revision`
Fresh-source status: `fresh_v3_image_generation_attempted`

## Job

- Queue row: `special_left`
- Animation: `special`
- Direction: `left`
- Frame count: `8`
- Frame profile: `expanded_action_384` (`384x384`, anchor `{ x: 192, y: 376 }`)

## Source Provenance

- Base/reference assets used: `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`, approved v3 `attack_left_04.png`, approved v3 `special_up_left_05.png`, and approved v3 `special_right` visual references.
- No `green_warrior_v2` assets, older animation strips, repaired frames, raw sheets, assembled sheets, or normalized frames from another character folder were used as source.
- Source-authenticity check: fresh image generation was used for every attempt. No local rotation, warp, scale, pose transform, or draw-over pass was used to create the attempted sources.

## Rejected Source Attempts

- `assets/characters/green_warrior_v3/special/raw/special_left_rejected_01_wrong_direction_chromakey.png`: rejected because contact/lunge frames read screen-right.
- `assets/characters/green_warrior_v3/special/raw/special_left_rejected_02_mixed_direction_chromakey.png`: rejected because middle frames mixed left setup with rightward sword direction.
- `assets/characters/green_warrior_v3/special/raw/special_left_rejected_03_mixed_direction_chromakey.png`: rejected because the model again placed the blade/effect to the right in contact frames.
- `assets/characters/green_warrior_v3/special/raw/special_left_rejected_04_preview_direction_drift_chromakey.png`: rejected after normalized preview showed rightward lunge/contact drift.
- `assets/characters/green_warrior_v3/special/raw/special_left_rejected_05_direction_drift_chromakey.png`: rejected because the coordinate-composition prompt still produced rightward action.
- `assets/characters/green_warrior_v3/special/raw/special_left_rejected_06_mirror_failed_chromakey.png`: rejected because right-reference mirroring still produced rightward middle frames.

## Current State

- No approved `special_left` normalized frames are present.
- Invalid normalized derivatives from rejected attempts were removed to prevent accidental use.
- Required next step: regenerate a fresh `special + left` source where every frame keeps screen-left side profile, with sword tip left of hilt and blue/cyan impact left of the body through contact, follow-through, and recovery.

Final QA status: `needs_revision`.
