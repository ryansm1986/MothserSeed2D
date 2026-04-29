# idle_southwest QA

Status: `approved`

## Inputs

- Queue row: `idle_southwest`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling; base images pulled into prompt context before generation
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\south.png`; `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\west.png`
- Earlier direction sequencing: `south, southeast, east, northeast, north, northwest, west approved`
- Frame count: `5`
- Subject size: `default`
- Frame profile: `default_128`
- Required initial source-strip spacing: `384px` minimum; prompt requests `768px` when possible

## Output QA

- Accepted generated candidate: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_southwest_generated_candidate_01.png`
- Raw strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_southwest_raw.png`
- Repacked source gaps: `768px, 768px, 768px, 768px`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\frames\idle_southwest_01.png` through `idle_southwest_05.png`
- Frame bounds: `(30, 22, 99, 120); (30, 12, 98, 120); (27, 19, 101, 120); (28, 30, 100, 120); (30, 20, 98, 120)`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_southwest_preview.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_southwest_focused_qa_4x.png`
- GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\gif\idle_southwest.gif`
- Local tool: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\tools\idle_process_generated_candidate.py`

Final QA status: `approved`
