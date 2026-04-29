# idle_southeast QA

Status: `approved`

## Inputs

- Queue row: `idle_southeast`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: template-only tooling; base images pulled into prompt context before generation
- Inferred project root: `D:\projects\MotherSeed2D`
- Inferred subject id: `tree_goblin`
- Inferred subject type: `monster`
- Animation/direction: `idle + southeast`
- Base folder location: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\south.png`; `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\east.png`
- Direction set: `8_directional`
- Required directions for selected set: `south;southeast;east;northeast;north;northwest;west;southwest`
- Earlier direction sequencing: `idle_south approved`
- Frame count: `5`
- Subject size: `default`
- Frame profile: `default_128`
- Required initial source-strip spacing: `384px` minimum; prompt requests `768px` when possible

## Output QA

- Accepted generated candidate: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_southeast_generated_candidate_01.png`
- Raw strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_southeast_raw.png`
- Transparent raw strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\raw\idle_southeast_raw_transparent.png`
- Repacked source gaps: `768px, 768px, 768px, 768px`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\frames\idle_southeast_01.png` through `idle_southeast_05.png`
- Frame bounds: `(27, 15, 101, 120); (28, 12, 101, 120); (28, 18, 101, 120); (28, 27, 100, 120); (27, 15, 101, 120)`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_southeast_preview.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\preview\idle_southeast_focused_qa_4x.png`
- GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\gif\idle_southeast.gif`
- Local tool: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\idle\tools\idle_process_generated_candidate.py`

Final QA status: `approved`
