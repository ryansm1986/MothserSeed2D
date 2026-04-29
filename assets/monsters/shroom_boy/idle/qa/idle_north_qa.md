# idle_north QA

Status: `approved`

## Inputs

- Queue row: `idle_north`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling plus fresh animation-scoped helper under `idle/tools`
- Inferred project root: `D:\projects\MotherSeed2D`
- Inferred subject id: `shroom_boy`
- Inferred subject type: `monster`
- Animation/direction: `idle + north`
- One-direction-only source: `pass`
- Base folder location: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\base`
- Required cardinal base files: `north.png`, `south.png`, `east.png`, `west.png`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\base\north.png`
- Initial strip prompt directly referenced exact base picture path(s): `yes`
- User animation direction: `The monster should stand and only move its face, head, or hands in the 5 generated frames.`
- Direction set: `8_directional`
- Required directions for selected set: `south; southeast; east; northeast; north; northwest; west; southwest`
- One-job-at-a-time answer: `Yes, strictly follow the templates`
- Frame count: `5`
- Frame-by-frame pose plan: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\idle_north_job_prompt.md`
- Subject size: `default`
- Frame profile: `default_128`
- Required initial source-strip spacing: `256px`
- Initial strip request included extended-width canvas instruction: `yes`
- Initial strip frame-pose uniqueness QA before cleanup/repack/normalization: `pass - five distinct idle beats with face, head/cap, and hand changes`
- Raw strip spacing QA result before cleanup/repack/normalization: `raw generated source failed spacing and was rebuilt wider at same pose scale; initial gaps [128, 111, 131, 120]; accepted gaps [320, 320, 320, 320]`
- Medium/large model whitespace and occupancy QA: `not_applicable_default_size`
- Action/attack full-envelope whitespace QA: `not_applicable_idle`
- Monster spacing measurement, if subject type is monster: `[320, 320, 320, 320]`
- Source canvas/gutter handling: `spacing satisfied by source canvas/gutter width, not by shrinking subject scale`
- Expected raw strip: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\raw\idle_north_raw.png`
- Expected normalized frames: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\frames\idle_north_01.png` through `idle_north_05.png`
- Expected preview: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\preview\idle_north_preview.png`
- Expected review GIF: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\gif\idle_north.gif`
- Direction sequencing check: `all earlier canonical directions approved before this row`

## Source Provenance

- Fresh source confirmation: `generated fresh from mapped base source(s)`
- Template-only tooling confirmation: `copied subject pipeline files and active base folder only`
- Fresh helper tools created under `<animation>/tools/`, if any: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\tools\idle_pipeline_helper.py`
- Frame uniqueness confirmation: `pass`
- Other tools or references explicitly approved by user, if any: `none`

## Final Outputs

- Raw source strip: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\raw\idle_north_raw.png`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\frames\idle_north_01.png` through `idle_north_05.png`
- Preview sheet: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\preview\idle_north_preview.png`
- 4x preview sheet: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\preview\idle_north_preview_4x.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\preview\idle_north_focus_4x.png`
- Looping GIF: `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\idle\gif\idle_north.gif`
- Shared normalization scale: `0.2660`

Final QA status: `approved`
