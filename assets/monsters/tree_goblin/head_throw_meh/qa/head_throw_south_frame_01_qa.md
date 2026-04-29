# head_throw_south Frame 01 QA

Status: `approved`

## Inputs

- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling; no unapproved existing project animation tools
- Animation/direction/frame: `head_throw + south + frame 01 of 8`
- Planned frame beat: `The tree goblin faces south in a strong anticipation pose, both hands/claws gripping its own head, shoulders hunched, knees bent, head still attached but visibly being twisted loose.`
- Base folder location: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\south.png`
- Primary source for this frame: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\south.png`
- Previous approved frame: `not_applicable`
- Subject size: `default`
- Frame profile: `expanded_action_384`
- Required items/weapons/features: `preserve visible base-set monster features and do not add unrequested items`
- Expected raw frame: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\head_throw\raw\head_throw_south_frame_01_raw.png`
- Expected normalized frame after direction normalization: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\head_throw\frames\head_throw_south_01.png`
- Frame manifest row: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\head_throw\qa\head_throw_south_frame_chain_manifest.csv`
- Local tools folder, if needed: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\head_throw\tools`

## Source Provenance

- Fresh source confirmation: `Frame 01 used the mapped south base as primary source and identity/color/proportion/equipment reference.`
- Template-only tooling confirmation: `Only the reusable template files, copied subject pipeline files, the required base folder, $game-studio:sprite-pipeline, and built-in image generation via the imagegen skill were used.`
- Fresh helper tools created under `<ANIMATION>/tools/`, if any: `none`
- Rejected frame attempts, if any: `none`

## Required Before Frame Approval

- `$game-studio:sprite-pipeline` was used for the frame job: `pass`
- Only reusable template files, copied subject pipeline files, and user-approved tools/references were used: `pass`
- No full source strip, multi-frame source image, direction sheet, turnaround, comparison panel, or batch output was used: `pass`
- Frame 01 used the mapped base source as primary source: `pass`
- Original mapped base source was used as identity, color, proportion, silhouette, and equipment reference: `pass`
- All earlier frames for this job were already approved before this frame started: `pass; no earlier frames`
- No later frame was started before this frame was approved: `pass`
- Generated image contains exactly one complete sprite frame: `pass`
- Frame matches the requested animation, direction, frame index, and planned beat: `pass`
- Frame is a distinct newly generated pose, not a duplicate or near-duplicate of the previous frame: `pass`
- Body/creature anatomy visibly moves in the planned way: `pass`
- Previous frame was used for continuity, not copied in place with only a shift, rotation, scale, smear, shadow, or effect change: `pass; not applicable for frame 01`
- No identity drift from base: colors, proportions, silhouette, equipment, anatomy, size, and facing direction remain consistent: `pass`
- Character item, clothing, skin, hair, fur, scale, armor, and equipment colors remain consistent with the directional base set unless the user specified changes: `pass`
- Required items/weapons/features are present: `pass`
- No unrequested item, weapon, shield, prop, limb, head, tail, wing, or unrelated object was added: `pass`
- Raw frame has transparent or flat `#ff00ff` background: `pass`
- Raw frame has generous empty padding around the full sprite: `pass`
- For action/attack rows, the full action envelope retained generous empty `#ff00ff` or transparent space: `pass`
- No body, weapon, slash/trail, spell glow, impact flash, particles, shadow, wings, tail, recovery motion, or loose effect pixels touch the source edge: `pass`

Final frame QA status: `approved`
