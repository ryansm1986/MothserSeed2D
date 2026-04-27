# walk_down_right QA

Status: `needs_revision`

## Inputs

- Queue row: `walk_down_right`
- Required skill: `$game-studio:sprite-pipeline`
- Inferred project root: `D:\projects\MotherSeed2D`
- Inferred subject id: `moss_golem_v2`
- Inferred subject type: `monster`
- Animation/direction: `walk + down_right`
- Base image location: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\base\moss_golem_base.png`
- User correction: `Regenerate down-right walk because the prior row looked like a different monster; base it off the base model.`
- Direction set: `8 directional`
- Frame count: `8`
- Subject size: `large`
- Required items/weapons/features: `Preserve base model: moss mantle, tan stone plates, vine wraps, huge fists, glowing eyes, circular green chest core.`
- Frame profile: `monster_large_384`
- Required initial source-strip spacing: `384` empty pixels between neighboring visible pose bounds before cleanup/repack
- Expected raw strip: `assets/monsters/moss_golem_v2/walk/raw/walk_down_right_raw.png`
- Expected normalized frames: `assets/monsters/moss_golem_v2/walk/frames/walk_down_right_01.png` through `walk_down_right_08.png`
- Expected preview: `assets/monsters/moss_golem_v2/walk/preview/walk_down_right_preview.png`
- Expected 4x preview: `assets/monsters/moss_golem_v2/walk/preview/walk_down_right_preview_4x.png`
- Expected focused QA preview: `assets/monsters/moss_golem_v2/walk/preview/walk_down_right_focused_qa.png`
- Expected review GIF: `assets/monsters/moss_golem_v2/walk/gif/walk_down_right.gif`

## Source Provenance

- Fresh source confirmation: `Regenerated on 2026-04-27 08:00 CT from the base-image reference with built-in image generation through the sprite-pipeline workflow.`
- Generated source candidate: `assets/monsters/moss_golem_v2/walk/raw/walk_down_right_imagegen_source_chromakey.png`
- Backed up previous row: `raw/backup_20260427_080022`, `frames/backup_20260427_080022`, `preview/backup_20260427_080022`, `gif/backup_20260427_080022`, `qa/backup_20260427_080022`
- Other references explicitly approved by user, if any: `None`

## Automated QA

- Source pose groups detected: `8` / `8`
- Generated source minimum visible-pose gutter: `97px`
- Initial source spacing gate: `FAIL`
- Normalized frame size: `384x384`
- Shared normalization scale: `1.367`
- Frame-edge contact: `PASS`
- Frame 01: edge padding left/top/right/bottom = (66, 43, 65, 24)
- Frame 02: edge padding left/top/right/bottom = (68, 37, 69, 24)
- Frame 03: edge padding left/top/right/bottom = (70, 40, 69, 24)
- Frame 04: edge padding left/top/right/bottom = (73, 36, 73, 24)
- Frame 05: edge padding left/top/right/bottom = (74, 37, 75, 24)
- Frame 06: edge padding left/top/right/bottom = (75, 39, 75, 24)
- Frame 07: edge padding left/top/right/bottom = (74, 40, 75, 24)
- Frame 08: edge padding left/top/right/bottom = (74, 44, 73, 24)

## Visual QA Notes

- This replacement is intentionally closer to the front base model: broader torso, centered circular core, matching moss mantle, heavy fists, and vine-wrapped arms.
- Direction is a subtle down-right/front-right read rather than the previous redesigned side/top-down creature.

## Blocking QA Items

- Initial generated source-strip spacing is still below the formal 384px empty `#ff00ff` source gutter. The cleaned/repacked raw strip has wide gutters, but the original generation does not satisfy the strict source-spacing gate.
- Manual direction review is still required before approval.

Final QA status: `needs_revision`
