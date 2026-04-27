# walk_left QA

Status: `needs_revision`

## Inputs

- Queue row: `walk_left`
- Required skill: `$game-studio:sprite-pipeline`
- Inferred project root: `D:\projects\MotherSeed2D`
- Inferred subject id: `moss_golem_v2`
- Inferred subject type: `monster`
- Animation/direction: `walk + left`
- Base image location: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\base\moss_golem_base.png`
- User correction: `Regenerate left walk because the head/moss cap was too bulgy; base it off the base model.`
- Direction set: `8 directional`
- Frame count: `8`
- Subject size: `large`
- Required items/weapons/features: `Preserve base model: small tucked stone head, low broad moss mantle, tan stone plates, vine wraps, huge fists, green eyes/core where visible.`
- Frame profile: `monster_large_384`
- Required initial source-strip spacing: `384` empty pixels between neighboring visible pose bounds before cleanup/repack
- Expected raw strip: `assets/monsters/moss_golem_v2/walk/raw/walk_left_raw.png`
- Expected normalized frames: `assets/monsters/moss_golem_v2/walk/frames/walk_left_01.png` through `walk_left_08.png`
- Expected preview: `assets/monsters/moss_golem_v2/walk/preview/walk_left_preview.png`
- Expected 4x preview: `assets/monsters/moss_golem_v2/walk/preview/walk_left_preview_4x.png`
- Expected focused QA preview: `assets/monsters/moss_golem_v2/walk/preview/walk_left_focused_qa.png`
- Expected review GIF: `assets/monsters/moss_golem_v2/walk/gif/walk_left.gif`

## Source Provenance

- Fresh source confirmation: `Regenerated on 2026-04-27 08:09 CT from the base-image reference with built-in image generation through the sprite-pipeline workflow.`
- Generated source candidate: `assets/monsters/moss_golem_v2/walk/raw/walk_left_imagegen_source_chromakey.png`
- Backed up previous row: `raw/backup_20260427_080956`, `frames/backup_20260427_080956`, `preview/backup_20260427_080956`, `gif/backup_20260427_080956`, `qa/backup_20260427_080956`
- Other references explicitly approved by user, if any: `None`

## Automated QA

- Source pose groups detected: `8` / `8`
- Generated source minimum visible-pose gutter: `106px`
- Initial source spacing gate: `FAIL`
- Normalized frame size: `384x384`
- Shared normalization scale: `1.157`
- Frame-edge contact: `PASS`
- Frame 01: edge padding left/top/right/bottom = (112, 36, 112, 24)
- Frame 02: edge padding left/top/right/bottom = (110, 41, 110, 24)
- Frame 03: edge padding left/top/right/bottom = (92, 43, 91, 24)
- Frame 04: edge padding left/top/right/bottom = (108, 49, 109, 24)
- Frame 05: edge padding left/top/right/bottom = (110, 51, 111, 24)
- Frame 06: edge padding left/top/right/bottom = (102, 55, 103, 24)
- Frame 07: edge padding left/top/right/bottom = (110, 57, 110, 24)
- Frame 08: edge padding left/top/right/bottom = (98, 48, 97, 24)

## Visual QA Notes

- Replacement target: reduce bulgy/domed head and keep a small tucked head under a low, broad moss mantle derived from the base model.
- Manual direction review is still required before approval.

## Blocking QA Items

- Initial generated source-strip spacing is still below the formal 384px empty `#ff00ff` source gutter. The cleaned/repacked raw strip has wide gutters, but the original generation does not satisfy the strict source-spacing gate.

Final QA status: `needs_revision`
