# rock_slam_down QA

Status: `approved`

## Inputs

- Queue row: `rock_slam_down`
- Required skill: `$game-studio:sprite-pipeline`
- Inferred project root: `D:/projects/MotherSeed2D`
- Inferred subject id: `moss_golem_v2`
- Inferred subject type: `monster`
- Animation/direction: `rock_slam + down`
- Base image location: `assets/monsters/moss_golem_v2/base/moss_golem_base.png`
- User animation direction: golem reaches to the ground, pulls up a large boulder, and slams it on the ground in the direction it is facing.
- Direction set: `8 directional`
- Frame count: `8`
- Subject size: `large`
- Required items/weapons/features: preserve moss golem stone body, moss mats, vine bands, green glow where visible, heavy fists, large feet, and palette; no unrequested weapons/items.
- Frame profile: `monster_large_action_1152`
- Required initial source-strip spacing: `1152` empty pixels between neighboring visible pose bounds before normalization
- Expected raw strip: `assets/monsters/moss_golem_v2/rock_slam/raw/rock_slam_down_raw.png`
- Expected normalized frames: `assets/monsters/moss_golem_v2/rock_slam/frames/rock_slam_down_01.png` through `rock_slam_down_08.png`
- Expected preview: `assets/monsters/moss_golem_v2/rock_slam/preview/rock_slam_down_preview.png`
- Expected review GIF: `assets/monsters/moss_golem_v2/rock_slam/gif/rock_slam_down.gif`

## Source Provenance

- Fresh source confirmation: generated from the required moss golem base reference using `$game-studio:sprite-pipeline` + `imagegen`.
- Generated source path: `assets/monsters/moss_golem_v2/rock_slam/raw/rock_slam_down_imagegen_source_chromakey.png`
- Repacked raw path: `assets/monsters/moss_golem_v2/rock_slam/raw/rock_slam_down_raw.png`
- Rejected source attempts, if any: `assets/monsters/moss_golem_v2/rock_slam/raw/rock_slam_down_rejected_compact_10frame_attempt.png` failed pose grouping/spacing.
- Other references explicitly approved by user, if any: None

## Processing

- Detected pose groups: `8`
- Shared normalization scale for this row: `2.121`
- Anchor: `{ x: 576, y: 1128 }`
- Final frame size: `1152x1152`
- Edge contact detected: `False`

## Required Before Approval

- [x] `$game-studio:sprite-pipeline` was used throughout source generation, normalization, preview rendering, GIF creation, and QA.
- [x] Base image location exists and was used as the required source reference.
- [x] Generated one fresh `8`-frame `rock_slam_down` strip for `rock_slam + down`.
- [x] Source was not created by rotating, skewing, warping, scaling, or drawing effects over an existing animation frame.
- [x] Source poses were segmented and repacked into a raw strip with at least one full `1152px` flat `#ff00ff` gutter between neighboring visible pose bounds before normalization.
- [x] Direction was reviewed against the requested row direction.
- [x] Body/creature anatomy visibly moves and does not read as a static pose with effects pasted on top.
- [x] Moss, stone, glow, and equipment/body colors remain consistent with the base image at source scale.
- [x] Required visible features are present in the appropriate frames.
- [x] No unrequested item, weapon, shield, prop, limb, head, tail, wing, or unrelated object was added.
- [x] Repacked with transparent padding wide enough for body, boulder, limbs, debris, and effect pixels.
- [x] Normalized to `monster_large_action_1152` with shared bottom-center anchoring.
- [x] Exported standard preview, enlarged preview, focused QA preview, and looping review GIF.
- [x] No final-frame edge contact, no inter-frame bleed, and no cropped effect/body pixels.

Final QA status: `approved`

## Chroma Cleanup Verification

- Remaining magenta-key pixels in normalized frames: `0`
- Reprocessed with aggressive fuchsia key removal/despill after visual preview pass.
