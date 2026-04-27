# rock_spray_south QA

Status: `needs_revision`

## Inputs

- Queue row: `rock_spray_south`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling plus one fresh job-scoped helper under the active animation folder
- Inferred project root: `D:\projects\MotherSeed2D`
- Inferred subject id: `moss_golem_v2`
- Inferred subject type: `monster`
- Animation/direction: `rock_spray + south`
- One-direction-only source: `confirmed south-only source strip`
- Base folder location: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\base`
- Required cardinal base files: `north.png`, `south.png`, `east.png`, `west.png`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\base\south.png`
- User animation direction: green center circle opens, golem sprays rocks in a 90-degree arc, and rotates while spraying; core should stay open until the last couple frames
- Direction set: `8_directional`
- Required directions for selected set: `south;southeast;east;northeast;north;northwest;west;southwest`
- Frame count: `8`
- Frame-by-frame pose plan: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\rock_spray\raw\rock_spray_south_pose_plan.md`
- Subject size: `large`
- Required items/weapons/features: preserve visible moss, stone body, vine wraps, green eyes, and green center core from the base set; no unrequested weapons or props
- Frame profile: `monster_large_action_1152`
- Required initial source-strip spacing: `1152` empty pixels between neighboring visible pose bounds before cleanup/repack
- Expected raw strip: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\rock_spray\raw\rock_spray_south_raw.png`
- Expected normalized frames: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\rock_spray\frames\rock_spray_south_01.png` through `rock_spray_south_08.png`
- Expected preview: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\rock_spray\preview\rock_spray_south_preview.png`
- Expected review GIF: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\rock_spray\gif\rock_spray_south.gif`
- Expected local tools folder: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\rock_spray\tools`

## Source Provenance

- Fresh source confirmation: generated fresh from the mapped `south.png` visual reference through `$game-studio:sprite-pipeline` workflow
- Template-only tooling confirmation: no existing project animation tooling, old strips, old normalized frames, hidden automation, or another subject pipeline was searched for or reused
- Fresh helper tools created under `<animation>/tools/`: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\rock_spray\tools\rock_spray_south_process.py`
- Frame uniqueness confirmation: source frames show distinct body/torso and spray beats
- Rejected source attempts:
  - Attempt 1 initially rejected for insufficient initial source spacing and rock particles crossing pose gutters.
  - Attempt 2 rejected after user clarified that attempt 1 was preferred.
  - Attempt 3 rejected for identity drift from the base.
- Other tools or references explicitly approved by user: none

## QA Checks

- `$game-studio:sprite-pipeline` was used throughout source generation, normalization, preview rendering, GIF creation, and QA.
- Job was processed as one animation plus one direction only.
- Source image contains one horizontal strip for `south` only.
- Base folder exists and contains `north.png`, `south.png`, `east.png`, and `west.png`.
- Correct mapped cardinal base file was used as the required source reference.
- Animation queue contains every required direction for the selected 8-direction set.
- Generated one fresh 8-frame `rock_spray_south` strip.
- Numbered frame-by-frame pose plan exists.
- Normalized frames match the selected `1152x1152` profile.
- Transparent output frames were created.
- Standard preview, enlarged preview, focused QA preview, and looping GIF exist.
- Final normalized frames have no frame-edge contact.

## Blocking Issues

- The active source is user-preferred attempt 1, but it does not pass the required initial source-strip spacing gate. Rock particles and spray effects cross or occupy the area that should be a full-frame empty `#ff00ff` gutter between pose lanes.
- Because the initial source spacing gate fails, this row cannot be marked `approved` under `PIPELINE_TEMPLATE.md`.

Final QA status: `needs_revision`
## Size Rescale

- Post-processed normalized frames with `assets/monsters/moss_golem_v2/rock_spray/tools/rock_spray_rescale_to_slam_size.py`.
- Rescaled visible `rock_spray` content by `2.6x` inside the existing `1152x1152` action profile to match the `rock_slam` in-game footprint.
- Original smaller normalized frames are backed up under `assets/monsters/moss_golem_v2/rock_spray/frames/backup_before_slam_scale/`.
- Rebuilt standard previews, 4x previews, focused QA previews, and GIFs after rescaling.

