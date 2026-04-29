# idle_west QA

Status: `approved`

## Inputs

- Queue row: `idle_west`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling; base image pulled into prompt context before generation
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\west.png`
- Earlier direction sequencing: `south, southeast, east, northeast, north, northwest approved`
- Frame count: `5`
- Subject size: `default`
- Frame profile: `default_128`
- Required initial source-strip spacing: `384px` minimum; prompt requests `768px` when possible
- Rejected source attempts: `idle_west_generated_candidate_01.png rejected because it produced a mushroom creature instead of the west-facing tree goblin base`
- Accepted generated candidate: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_west_generated_candidate_02.png`
- Raw strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_west_raw.png`
- Repacked source gaps: `768px, 768px, 768px, 768px`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\frames\idle_west_01.png` through `idle_west_05.png`
- Frame bounds: `(29, 18, 100, 120); (30, 12, 99, 120); (23, 16, 106, 120); (25, 28, 104, 120); (29, 18, 100, 120)`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_west_preview.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_west_focused_qa_4x.png`
- GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\gif\idle_west.gif`
- Local tool: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\tools\idle_process_generated_candidate.py`

Final QA status: `approved`
