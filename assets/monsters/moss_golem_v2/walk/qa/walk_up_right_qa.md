# walk_up_right QA

Status: `needs_revision`

## Inputs

- Queue row: `walk_up_right`
- Required skill: `$game-studio:sprite-pipeline`
- Inferred project root: `D:\projects\MotherSeed2D`
- Inferred subject id: `moss_golem_v2`
- Inferred subject type: `monster`
- Animation/direction: `walk + up_right`
- Base image location: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\base\moss_golem_base.png`
- User animation direction: `Alternating feet forward with passing frames where feet meet near center; heavy grounded walk.`
- Direction set: `8 directional`
- Frame count: `8`
- Subject size: `large`
- Required items/weapons/features: `Preserve moss, tan stone plates, vine/rope wraps, bulky fists, glowing green eyes/core where visible; no unrequested items.`
- Frame profile: `monster_large_384`
- Required initial source-strip spacing: `384` empty pixels between neighboring visible pose bounds before cleanup/repack
- Expected raw strip: `assets/monsters/moss_golem_v2/walk/raw/walk_up_right_raw.png`
- Expected normalized frames: `assets/monsters/moss_golem_v2/walk/frames/walk_up_right_01.png` through `walk_up_right_08.png`
- Expected preview: `assets/monsters/moss_golem_v2/walk/preview/walk_up_right_preview.png`
- Expected 4x preview: `assets/monsters/moss_golem_v2/walk/preview/walk_up_right_preview_4x.png`
- Expected focused QA preview: `assets/monsters/moss_golem_v2/walk/preview/walk_up_right_focused_qa.png`
- Expected review GIF: `assets/monsters/moss_golem_v2/walk/gif/walk_up_right.gif`

## Source Provenance

- Fresh source confirmation: `Generated from the base-image reference with built-in image generation through the sprite-pipeline workflow.`
- Generated source candidate: `assets/monsters/moss_golem_v2/walk/raw/walk_up_right_imagegen_source_chromakey.png`
- Rejected source attempts, if any: `The accepted candidate still fails the strict initial source spacing gate: measured minimum generated gutter 82px, required 384px. A grouped/repacked raw strip with 384px gutters was created for review, but the queue row is not approved.`
- Other references explicitly approved by user, if any: `None`

## Automated QA

- Source pose groups detected: `8` / `8`
- Generated source minimum visible-pose gutter: `82px`
- Initial source spacing gate: `FAIL`
- Normalized frame size: `384x384`
- Shared normalization scale: `1.204`
- Frame-edge contact: `PASS`
- Frame 01: edge padding left/top/right/bottom = (86, 41, 85, 24)
- Frame 02: edge padding left/top/right/bottom = (90, 41, 89, 24)
- Frame 03: edge padding left/top/right/bottom = (97, 59, 97, 24)
- Frame 04: edge padding left/top/right/bottom = (93, 40, 93, 24)
- Frame 05: edge padding left/top/right/bottom = (84, 42, 84, 24)
- Frame 06: edge padding left/top/right/bottom = (80, 36, 79, 24)
- Frame 07: edge padding left/top/right/bottom = (75, 40, 75, 24)
- Frame 08: edge padding left/top/right/bottom = (80, 41, 81, 24)

## Required Before Approval

- `$game-studio:sprite-pipeline` was used throughout source generation, normalization, preview rendering, GIF creation, and QA.
- Base image location exists and was used as the required source reference.
- Generated one fresh 8-frame `walk_up_right` strip for `walk + up_right`.
- Selected subject size is respected: `large`, about 3 times character size.
- Body/creature anatomy visibly moves in the generated source candidate.
- Normalized frames use shared bottom-center anchoring.
- Exported standard preview, enlarged `4x` preview, focused QA preview, and looping review GIF.

## Blocking QA Items

- Initial generated source-strip spacing does not meet the required 384px empty `#ff00ff` gutter. Do not approve this row until a regenerated source passes this gate.
- Manual direction review is still required before approval, especially for diagonal and back-facing rows generated from a front-facing base.

Final QA status: `needs_revision`
