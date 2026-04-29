# walk_east QA

Status: `approved`

## Inputs

- Queue row: `walk_east`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling plus fresh animation-scoped helper under `walk/tools`
- Inferred project root: `D:\projects\MotherSeed2D`
- Inferred subject id: `shroom_boy`
- Inferred subject type: `monster`
- Animation/direction: `walk + east`
- One-direction-only source: `pass`
- Base folder location: `D:\projects\MotherSeed2Dssets\monsters\shroom_boyase`
- Required cardinal base files: `north.png`, `south.png`, `east.png`, `west.png`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\shroom_boy\base\east.png`
- Initial strip prompt directly referenced exact base picture path(s): `yes`
- User animation direction: `waddle walking animation`
- Direction set: `8_directional`
- Required directions for selected set: `south; southeast; east; northeast; north; northwest; west; southwest`
- One-job-at-a-time answer: `Yes, strictly follow the templates`
- Frame count: `8`
- Frame-by-frame pose plan: `D:\projects\MotherSeed2Dssets\monsters\shroom_boy\walk\walk_east_job_prompt.md`
- Subject size: `default`
- Frame profile: `default_128`
- Required initial source-strip spacing: `256px`
- Initial strip request included extended-width canvas instruction: `yes`
- Initial strip frame-pose uniqueness QA before cleanup/repack/normalization: `pass - eight distinct waddle walk beats`
- Raw strip spacing QA result before cleanup/repack/normalization: `raw generated source failed spacing and was rebuilt wider at same pose scale; initial gaps [67, 60, 62, 67, 56, 62, 60]; accepted gaps [320, 320, 320, 320, 320, 320, 320]`
- Medium/large model whitespace and occupancy QA: `not_applicable_default_size`
- Action/attack full-envelope whitespace QA: `not_applicable_walk`
- Monster spacing measurement, if subject type is monster: `[320, 320, 320, 320, 320, 320, 320]`
- Source canvas/gutter handling: `spacing satisfied by source canvas/gutter width, not by shrinking subject scale`
- Expected raw strip: `D:\projects\MotherSeed2Dssets\monsters\shroom_boy\walkaw\walk_east_raw.png`
- Expected normalized frames: `D:\projects\MotherSeed2Dssets\monsters\shroom_boy\walkrames\walk_east_01.png` through `walk_east_08.png`
- Expected preview: `D:\projects\MotherSeed2Dssets\monsters\shroom_boy\walk\preview\walk_east_preview.png`
- Expected review GIF: `D:\projects\MotherSeed2Dssets\monsters\shroom_boy\walk\gif\walk_east.gif`
- Direction sequencing check: `all earlier canonical walk directions approved before this row`

## Source Provenance

- Fresh source confirmation: `generated fresh from mapped base source(s)`
- Template-only tooling confirmation: `copied subject pipeline files and active base folder only`
- Fresh helper tools created under `<animation>/tools/`, if any: `D:\projects\MotherSeed2Dssets\monsters\shroom_boy\walk	ools\walk_pipeline_helper.py`
- Frame uniqueness confirmation: `pass`
- Other tools or references explicitly approved by user, if any: `none`

## Final Outputs

- Raw source strip: `D:\projects\MotherSeed2Dssets\monsters\shroom_boy\walkaw\walk_east_raw.png`
- Normalized frames: `D:\projects\MotherSeed2Dssets\monsters\shroom_boy\walkrames\walk_east_01.png` through `walk_east_08.png`
- Preview sheet: `D:\projects\MotherSeed2Dssets\monsters\shroom_boy\walk\preview\walk_east_preview.png`
- 4x preview sheet: `D:\projects\MotherSeed2Dssets\monsters\shroom_boy\walk\preview\walk_east_preview_4x.png`
- Focused QA preview: `D:\projects\MotherSeed2Dssets\monsters\shroom_boy\walk\preview\walk_east_focus_4x.png`
- Looping GIF: `D:\projects\MotherSeed2Dssets\monsters\shroom_boy\walk\gif\walk_east.gif`
- Shared normalization scale: `0.3564`

Final QA status: `approved`
