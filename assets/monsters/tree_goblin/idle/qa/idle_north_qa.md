# idle_north QA

Status: `approved`

## Inputs

- Queue row: `idle_north`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling; base image pulled into prompt context before generation
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\north.png`
- Earlier direction sequencing: `south, southeast, east, northeast approved`
- Frame count: `5`
- Subject size: `default`
- Frame profile: `default_128`
- Required initial source-strip spacing: `384px` minimum; prompt requests `768px` when possible

## Output QA

- Accepted generated candidate: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_north_generated_candidate_01.png`
- Raw strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_north_raw.png`
- Repacked source gaps: `768px, 768px, 768px, 768px`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\frames\idle_north_01.png` through `idle_north_05.png`
- Frame bounds: `(24, 15, 104, 120); (24, 12, 104, 120); (29, 21, 99, 120); (25, 23, 103, 120); (28, 21, 100, 120)`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_north_preview.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_north_focused_qa_4x.png`
- GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\gif\idle_north.gif`
- Local tool: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\tools\idle_process_generated_candidate.py`

Final QA status: `approved`
