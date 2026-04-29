# idle_northeast QA

Status: `approved`

## Inputs

- Queue row: `idle_northeast`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling; base images pulled into prompt context before generation
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\north.png`; `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\east.png`
- Earlier direction sequencing: `idle_south approved; idle_southeast approved; idle_east approved`
- Frame count: `5`
- Subject size: `default`
- Frame profile: `default_128`
- Required initial source-strip spacing: `384px` minimum; prompt requests `768px` when possible

## Output QA

- Accepted generated candidate: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_northeast_generated_candidate_01.png`
- Raw strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_northeast_raw.png`
- Repacked source gaps: `768px, 768px, 768px, 768px`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\frames\idle_northeast_01.png` through `idle_northeast_05.png`
- Frame bounds: `(26, 12, 103, 120); (26, 13, 103, 120); (26, 14, 102, 120); (27, 18, 101, 120); (29, 15, 100, 120)`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_northeast_preview.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_northeast_focused_qa_4x.png`
- GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\gif\idle_northeast.gif`
- Local tool: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\tools\idle_process_generated_candidate.py`

Final QA status: `approved`
