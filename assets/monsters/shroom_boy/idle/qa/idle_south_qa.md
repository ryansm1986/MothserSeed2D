# idle_south QA

Status: `approved`

## Inputs

- Queue row: `idle_south`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling; no unapproved existing project animation tools
- Inferred project root: `D:\projects\MotherSeed2D`
- Inferred subject id: `shroom_boy`
- Inferred subject type: `monster`
- Animation/direction: `idle + south`
- One-direction-only source: `required`
- Base folder location: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\base`
- Required cardinal base files: `north.png`, `south.png`, `east.png`, `west.png`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\base\south.png`
- Initial strip prompt directly referenced exact base picture path(s): `yes`
- User animation direction: `The monster should stand and only move its face, head, or hands in the 5 generated frames.`
- Direction set: `8_directional`
- Required directions for selected set: `south; southeast; east; northeast; north; northwest; west; southwest`
- One-job-at-a-time answer: `Yes, strictly follow the templates`
- Frame count: `5`
- Frame-by-frame pose plan: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\idle_south_job_prompt.md`
- Subject size: `default`
- Required items/weapons/features: `preserve visible base-set shroom features, colors, face, cap/head silhouette, hands, body shape, and proportions; no unrequested items or weapons`
- Frame profile: `default_128`
- Required initial source-strip spacing: `256px empty pixels between neighboring visible pose bounds before cleanup/repack`
- Initial strip request included extended-width canvas instruction: `yes`
- Initial strip frame-pose uniqueness QA before cleanup/repack/normalization: `pass - five distinct idle beats with visible face, head/cap, and hand changes`
- Raw strip spacing QA result before cleanup/repack/normalization: `first generated source failed at 102, 94, 86, 75px; accepted widened source passes at 320, 320, 320, 320px`
- Medium/large model whitespace and occupancy QA: `not_applicable_default_size`
- Action/attack full-envelope whitespace QA: `not_applicable_idle`
- Monster spacing measurement, if subject type is monster: `320px between every neighboring visible source pose after source-canvas widening`
- Source canvas/gutter handling: `failed generated compact spacing was rebuilt onto a 3656x724 flat #ff00ff source canvas with 320px gutters at the same pose scale`
- Expected raw strip: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\raw\idle_south_raw.png`
- Expected normalized frames: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\frames\idle_south_01.png` through `idle_south_05.png`
- Expected preview: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\preview\idle_south_preview.png`
- Expected review GIF: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\gif\idle_south.gif`
- Expected local tools folder, if needed: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\tools`
- Direction sequencing check: `first_direction`

## Source Provenance

- Fresh source confirmation: `generated fresh from mapped base source; rebuilt only to widen gutters and flatten chroma background`
- Template-only tooling confirmation: `README.md, PIPELINE_TEMPLATE.md, frame_profiles.csv, animation_queue_template.csv, agent_job_prompt_template.md, job_qa_template.md, and active base folder only`
- Fresh helper tools created under `<animation>/tools/`, if any: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\tools\idle_south_measure_source.py; D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\tools\idle_south_rebuild_wide_source.py; D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\tools\idle_south_normalize_preview_gif.py`
- Frame uniqueness confirmation: `pass - no duplicated frame slots; pose changes are restricted to face, cap/head, and hands`
- Rejected source attempts, if any: `initial generated strip copied from C:\Users\there\.codex\generated_images\019dd1c9-7dc7-78e2-8c9c-f5491ca2528b\ig_0baef36abfd929eb0169f013c9bb488197a001aab7620d8c56.png failed source spacing with gaps 102, 94, 86, 75px; accepted after widening source canvas without shrinking poses`
- Other tools or references explicitly approved by user, if any: `none`

## Required Before Approval

- `$game-studio:sprite-pipeline` was used throughout source generation, normalization, preview rendering, GIF creation, and QA.
- Only reusable template files, copied subject pipeline files, and user-approved tools/references were used.
- No existing project animation tooling, old pipeline scripts, prior generated strips, prior normalized frames, hidden automation, or another subject pipeline was searched for or reused.
- Any freshly created helper scripts, configs, checklists, or temporary processing tools are stored under `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\tools`, named/scoped to the active animation or `idle_south`, and listed in this QA note.
- Job was processed as one animation plus one direction only.
- No later direction work began before this direction completed raw output, normalized frames, previews, GIF, QA note, queue row update, and final approval.
- Source image contains exactly one horizontal strip for `south` and no other directions, rows, panels, turnarounds, comparison grids, or grouped direction sheets.
- Base folder exists and contains `north.png`, `south.png`, `east.png`, and `west.png`.
- Correct mapped cardinal base file was used as the required source reference.
- The initial source-generation prompt directly named the exact mapped base picture path.
- Animation queue contains every required direction for the selected direction set.
- Generated one fresh 5-frame `idle_south` strip for `idle + south`.
- A numbered frame-by-frame pose plan exists for the requested frame count.
- The initial generated source strip was reviewed frame by frame before cleanup, slicing, repack, normalization, or preview rendering.
- Every frame in the initial generated source strip is a distinct newly drawn animation pose for its planned beat.
- Initial source-generation request explicitly required an extended-width horizontal canvas with expanded empty distance between frame lanes.
- Initial generated source strip has at least `256px` of empty flat `#ff00ff` space between neighboring visible poses before cleanup/repack.
- Raw strip spacing was reviewed immediately after generation and before cleanup/repack/normalization.
- Direction is correct in every frame.
- Body/creature anatomy visibly moves and does not read as a static pose with effects pasted on top.
- Character item, clothing, skin, hair, fur, scale, armor, and equipment colors remain consistent with the directional base set unless the user specified changes.
- Required items/weapons/features are present in every appropriate frame.
- No unrequested item, weapon, shield, prop, limb, head, tail, wing, or unrelated object was added.
- Repacked with transparent padding wide enough for body, items, limbs, shadow, and loose pixels.
- Normalized to `default_128` with shared bottom-center anchoring.
- Exported standard preview, enlarged `4x` preview, focused QA preview, and looping review GIF.
- No frame-edge contact, no inter-frame bleed, and no cropped body pixels.

## Final Outputs

- Raw source strip: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\raw\idle_south_raw.png`
- Widened source copy: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\raw\idle_south_raw_wide.png`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\frames\idle_south_01.png` through `idle_south_05.png`
- Preview sheet: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\preview\idle_south_preview.png`
- 4x preview sheet: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\preview\idle_south_preview_4x.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\preview\idle_south_focus_4x.png`
- Looping GIF: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\gif\idle_south.gif`

Final QA status: `approved`
