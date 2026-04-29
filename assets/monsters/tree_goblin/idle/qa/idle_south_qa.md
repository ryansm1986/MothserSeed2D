# idle_south QA

Status: `approved`

## Inputs

- Queue row: `idle_south`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling; no unapproved existing project animation tools
- Inferred project root: `D:\projects\MotherSeed2D`
- Inferred subject id: `tree_goblin`
- Inferred subject type: `monster`
- Animation/direction: `idle + south`
- One-direction-only source: `required`
- Base folder location: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base`
- Required cardinal base files: `north.png`, `south.png`, `east.png`, `west.png`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\south.png`
- User animation direction: `standing idle with subtle movement of branches and head`
- Direction set: `8_directional`
- Required directions for selected set: `south;southeast;east;northeast;north;northwest;west;southwest`
- One-job-at-a-time answer: `Yes, strictly follow the templates`
- Frame count: `5`
- Frame-by-frame pose plan: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\qa\idle_south_pose_plan.md`
- Subject size: `default`
- Required items/weapons/features: `preserve visible base-set monster features; do not add unrequested items`
- Frame profile: `default_128`
- Required initial source-strip spacing: `384px` empty pixels between neighboring visible pose bounds before cleanup/repack (`default_128` profile minimum plus user-requested additional `128px`)
- Initial strip request included extended-width canvas instruction: `yes`
- Raw strip spacing QA result before cleanup/repack/normalization: `accepted generated candidate 03 measured gaps 63px, 66px, 74px, 78px and was visually approved by user; accepted poses were repacked unchanged into final raw strip with measured gaps 768px, 768px, 768px, 768px`
- Medium/large model whitespace and occupancy QA: `not_applicable`
- Action/attack full-envelope whitespace QA: `not_applicable`
- Monster spacing measurement, if subject type is monster: `final repacked raw strip gaps 768px, 768px, 768px, 768px`
- Source canvas/gutter handling: `prompt requires wider canvas/gutters instead of shrinking the subject`
- Expected raw strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_south_raw.png`
- Expected normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\frames\idle_south_01.png` through `idle_south_05.png`
- Expected preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_south_preview.png`
- Expected review GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\gif\idle_south.gif`
- Expected local tools folder, if needed: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\tools`
- Direction sequencing check: `first direction`

## Source Provenance

- Fresh source confirmation: `pass; user visually approved idle_south_generated_candidate_03_base_locked.png as the fresh generated source poses derived from the south base`
- Template-only tooling confirmation: `only listed reusable template files, copied subject pipeline files, and base folder used so far`
- Fresh helper tools created under `<ANIMATION>/tools/`, if any: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\tools\idle_south_build_assets.py; D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\tools\idle_south_process_accepted_candidate.py`
- Frame uniqueness confirmation: `pass; accepted generated candidate has five unique idle poses with head, branch, torso, arm, and root-feet variation`
- Rejected source attempts, if any: `procedural warped idle_south attempt rejected because the pipeline requires one fresh generated source strip with 5 distinct newly drawn frames; idle_south_generated_candidate_01.png rejected because it changes the approved tree-goblin identity into a humanoid goblin, adds unrequested skull/belt/clothing details, changes body proportions, and loses the base branch-heavy silhouette; idle_south_generated_candidate_02_wide.png rejected because even with wider spacing it still drifts from the approved south base into a different hunched humanoid tree monster and does not preserve the original face, broad branch arms, vine belt, root feet, and branch-heavy silhouette tightly enough; idle_south_generated_candidate_03_base_locked.png rejected because measured source gaps were only 63px, 66px, 74px, and 78px, below the required 384px hard minimum`
- Other tools or references explicitly approved by user, if any: `none`

## Output QA

- Raw strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_south_raw.png`
- Transparent raw strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_south_raw_transparent.png`
- Accepted generated candidate: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_south_generated_candidate_03_base_locked.png`
- Raw canvas size: `6358x1007`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\frames\idle_south_01.png` through `idle_south_05.png`
- Normalized frame size: `128x128`
- Frame visible bounds:
  - `idle_south_01.png`: `(23, 14, 105, 120)`
  - `idle_south_02.png`: `(26, 12, 102, 120)`
  - `idle_south_03.png`: `(27, 19, 102, 120)`
  - `idle_south_04.png`: `(28, 26, 100, 120)`
  - `idle_south_05.png`: `(25, 19, 103, 120)`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_south_preview.png`
- 4x preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_south_preview_4x.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_south_focused_qa_4x.png`
- GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\gif\idle_south.gif`

## Revision Required

Regenerate `idle_south` as one fresh horizontal source strip with exactly 5 newly drawn idle frames for the south direction only. The request must use the mapped `south.png` base source, require an extended-width horizontal canvas, and preserve at least `384px` empty flat `#ff00ff` or transparent spacing between neighboring visible pose bounds before cleanup/repack/normalization.

User follow-up: next regeneration should make the canvas wider to help with identity preservation. Use a much wider source canvas and prefer `768px` or more empty spacing between neighboring visible pose bounds while still requiring the hard minimum of `384px`.

Final QA status: `approved`
