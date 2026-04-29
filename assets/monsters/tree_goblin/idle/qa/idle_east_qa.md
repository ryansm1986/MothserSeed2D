# idle_east QA

Status: `approved`

## Inputs

- Queue row: `idle_east`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling; base image pulled into prompt context before generation
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\east.png`
- Earlier direction sequencing: `idle_south approved; idle_southeast approved`
- Frame count: `5`
- Subject size: `default`
- Frame profile: `default_128`
- Required initial source-strip spacing: `384px` minimum; prompt requests `768px` when possible

## Output QA

- Accepted generated candidate: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_east_generated_candidate_01.png`
- Raw strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_east_raw.png`
- Repacked source gaps: `768px, 768px, 768px, 768px`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\frames\idle_east_01.png` through `idle_east_05.png`
- Frame bounds: `(32, 18, 97, 120); (30, 12, 99, 120); (30, 22, 99, 120); (33, 27, 96, 120); (32, 20, 97, 120)`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_east_preview.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_east_focused_qa_4x.png`
- GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\gif\idle_east.gif`
- Local tool: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\tools\idle_process_generated_candidate.py`

Final QA status: `approved`
