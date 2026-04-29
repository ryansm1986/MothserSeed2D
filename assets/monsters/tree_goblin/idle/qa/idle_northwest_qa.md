# idle_northwest QA

Status: `approved`

## Inputs

- Queue row: `idle_northwest`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling; base images pulled into prompt context before generation
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\north.png`; `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\west.png`
- Earlier direction sequencing: `south, southeast, east, northeast, north approved`
- Frame count: `5`
- Subject size: `default`
- Frame profile: `default_128`
- Required initial source-strip spacing: `384px` minimum; prompt requests `768px` when possible

## Output QA

- Accepted generated candidate: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_northwest_generated_candidate_01.png`
- Raw strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_northwest_raw.png`
- Repacked source gaps: `768px, 768px, 768px, 768px`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\frames\idle_northwest_01.png` through `idle_northwest_05.png`
- Frame bounds: `(29, 12, 99, 120); (28, 13, 100, 120); (27, 15, 102, 120); (27, 15, 102, 120); (28, 14, 101, 120)`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_northwest_preview.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_northwest_focused_qa_4x.png`
- GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\gif\idle_northwest.gif`
- Local tool: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\tools\idle_process_generated_candidate.py`

Final QA status: `approved`
