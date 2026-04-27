# rock_spray_west QA

Status: `needs_revision`

## Inputs

- Queue row: `rock_spray_west`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling plus fresh helper tools under this animation's `tools/` folder
- Inferred project root: `D:\projects\MotherSeed2D`
- Inferred subject id: `moss_golem_v2`
- Inferred subject type: `monster`
- Animation/direction: `rock_spray + west`
- One-direction-only source: `confirmed west-only source strip`
- Base folder location: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\base`
- Required cardinal base files: `north.png`, `south.png`, `east.png`, `west.png`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\base\west.png`
- User animation direction: green center circle opens, golem sprays rocks in a 90-degree arc, and rotates while spraying; core stays open until the last couple frames
- Direction set: `8_directional`
- Required directions for selected set: `south;southeast;east;northeast;north;northwest;west;southwest`
- Frame count: `8`
- Frame-by-frame pose plan: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\rock_spray\raw\rock_spray_west_pose_plan.md`
- Subject size: `large`
- Required items/weapons/features: preserve visible moss, stone body, vine wraps, green eyes, and green center core from the base set; no unrequested weapons or props
- Frame profile: `monster_large_action_1152`
- Required initial source-strip spacing: `1152` empty pixels between neighboring visible pose bounds before cleanup/repack
- Expected raw strip: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\rock_spray\raw\rock_spray_west_raw.png`
- Expected normalized frames: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\rock_spray\frames\rock_spray_west_01.png` through `rock_spray_west_08.png`
- Expected preview: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\rock_spray\preview\rock_spray_west_preview.png`
- Expected review GIF: `D:\projects\MotherSeed2D\assets\monsters\moss_golem_v2\rock_spray\gif\rock_spray_west.gif`
- Local tools: `assets/monsters/moss_golem_v2/rock_spray/tools/rock_spray_west_process.py;assets/monsters/moss_golem_v2/rock_spray/tools/rock_spray_queue_finalize_tool.py`

## Source Provenance

- Fresh source confirmation: generated fresh from the mapped directional base source(s) through `$game-studio:sprite-pipeline` workflow
- Template-only tooling confirmation: no existing project animation tooling, old strips, old normalized frames, hidden automation, or another subject pipeline was searched for or reused
- Fresh helper tools created under `<animation>/tools/`: `assets/monsters/moss_golem_v2/rock_spray/tools/rock_spray_west_process.py;assets/monsters/moss_golem_v2/rock_spray/tools/rock_spray_queue_finalize_tool.py`
- Frame uniqueness confirmation: source frames show distinct body/torso and spray beats
- Rejected source attempts, if any: none for this row
- Other tools or references explicitly approved by user: none

## QA Checks

- `$game-studio:sprite-pipeline` was used throughout source generation, normalization, preview rendering, GIF creation, and QA.
- Job was processed as one animation plus one direction only.
- Source image contains one horizontal strip for `west` only.
- Base folder exists and contains `north.png`, `south.png`, `east.png`, and `west.png`.
- Correct mapped base file or adjacent cardinal pair was used as the required source reference.
- Animation queue contains every required direction for the selected 8-direction set.
- Generated one fresh 8-frame `rock_spray_west` strip.
- Numbered frame-by-frame pose plan exists.
- Normalized frames match the selected `1152x1152` profile.
- Transparent output frames were created.
- Standard preview, enlarged preview, focused QA preview, and looping GIF exist.
- Final normalized frames have no frame-edge contact.

## Result

Generated and normalized successfully as a one-direction strip with reduced visible lane bleed, but the initial source strip still does not provide the strict 1152px full-frame empty spacing required by PIPELINE_TEMPLATE.md.

Final QA status: `needs_revision`
## Size Rescale

- Post-processed normalized frames with `assets/monsters/moss_golem_v2/rock_spray/tools/rock_spray_rescale_to_slam_size.py`.
- Rescaled visible `rock_spray` content by `2.6x` inside the existing `1152x1152` action profile to match the `rock_slam` in-game footprint.
- Original smaller normalized frames are backed up under `assets/monsters/moss_golem_v2/rock_spray/frames/backup_before_slam_scale/`.
- Rebuilt standard previews, 4x previews, focused QA previews, and GIFs after rescaling.

