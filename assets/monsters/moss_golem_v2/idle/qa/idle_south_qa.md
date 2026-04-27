# idle_south QA

Status: `approved`

## Inputs

- Queue row: `idle_south`
- Legacy alias: `down`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling; no unapproved existing project animation tools
- Inferred project root: `D:/projects/MotherSeed2D`
- Inferred subject id: `moss_golem_v2`
- Inferred subject type: `monster`
- Animation/direction: `idle + south`
- One-direction-only source: `confirmed`
- Base folder location: `D:/projects/MotherSeed2D/assets/monsters/moss_golem_v2/base`
- Required cardinal base files: `north.png`, `south.png`, `east.png`, `west.png`
- Mapped base source(s): `assets/monsters/moss_golem_v2/base/south.png`
- User animation direction: `standing animation with subtle body, head and arm movements`
- Direction set: `8_directional`
- Required directions for selected set: `south;southeast;east;northeast;north;northwest;west;southwest`
- One-job-at-a-time answer: `Yes, strictly follow the templates`
- Frame count: `5`
- Frame-by-frame pose plan: `assets/monsters/moss_golem_v2/idle/raw/idle_south_pose_plan.md`
- Subject size: `large`
- Required items/weapons/features: `preserve visible base-set moss, stone body, vines, green eyes, green chest core, heavy arms, and no unrequested weapons/items`
- Frame profile: `monster_large_384`
- Required initial source-strip spacing: `384` empty pixels between neighboring visible pose bounds before cleanup/repack
- Accepted raw strip: `assets/monsters/moss_golem_v2/idle/raw/idle_south_raw.png`
- Normalized frames: `assets/monsters/moss_golem_v2/idle/frames/idle_south_01.png` through `idle_south_05.png`
- Preview: `assets/monsters/moss_golem_v2/idle/preview/idle_south_preview.png`
- Preview 4x: `assets/monsters/moss_golem_v2/idle/preview/idle_south_preview_4x.png`
- Focused QA preview: `assets/monsters/moss_golem_v2/idle/preview/idle_south_focused_qa.png`
- Review GIF: `assets/monsters/moss_golem_v2/idle/gif/idle_south.gif`
- Local tools folder: `assets/monsters/moss_golem_v2/idle/tools/`

## Source Provenance

- Fresh source confirmation: user selected `assets/monsters/moss_golem_v2/idle/raw/idle_south_rejected_attempt1_raw.png` as the preferred source strip.
- Canvas expansion confirmation: per user instruction, the selected strip was expanded onto a wider `#ff00ff` canvas without shrinking the sprites for spacing.
- Expanded source measurement: `384, 384, 384, 384 px` gutters; required `384 px`; pass.
- Original generated source measurement before expansion: `93, 58, 72, 77 px`; this did not pass the spacing gate and is preserved for provenance.
- Template-only tooling confirmation: used only the reusable template files, copied subject pipeline files, the required base folder, `$game-studio:sprite-pipeline`, built-in image generation, and the job-scoped helper listed below.
- Fresh helper tools created under `<ANIMATION>/tools/`: `assets/monsters/moss_golem_v2/idle/tools/idle_south_process.py`
- Frame uniqueness confirmation: source contains five visibly distinct south-facing idle poses with body/head/arm motion.
- Other tools or references explicitly approved by user: user approved using the first generated strip and expanding canvas rather than shrinking sprites.

## QA Checks

- `$game-studio:sprite-pipeline` was used throughout source generation, canvas expansion, normalization, preview rendering, GIF creation, and QA.
- Job was processed as one animation plus one direction only.
- Base folder exists and contains `north.png`, `south.png`, `east.png`, and `west.png`.
- Correct mapped cardinal base file was used as the required source reference.
- Animation queue contains every required direction for the selected direction set.
- A numbered frame-by-frame pose plan exists for the requested frame count.
- Expanded source contains exactly one horizontal strip for `south` and no other directions, rows, panels, turnarounds, comparison grids, or grouped direction sheets.
- Expanded source spacing passes the full-frame spacing gate with `384 px` between every neighboring visible pose bound.
- Normalized frames are exactly `384x384`.
- Transparent background is preserved in normalized frames.
- Standard preview, enlarged `4x` preview, focused QA preview, and looping GIF were exported.
- Direction reads as south/down in every frame.
- Body/creature anatomy visibly moves and does not read as a static pose with only effects pasted on top.
- Base-set moss, stone, vines, green eyes, and green core are preserved.
- No unrequested weapons, shields, props, limbs, heads, tails, wings, or unrelated objects were added.

Final QA status: `approved`
