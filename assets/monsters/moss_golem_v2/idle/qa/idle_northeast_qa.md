# idle_northeast QA

Status: `approved`

- Queue row: `idle_northeast`
- Legacy alias: `up_right`
- Required skill: `$game-studio:sprite-pipeline`
- Animation/direction: `idle + northeast`
- Base sources: `assets/monsters/moss_golem_v2/base/north.png`, `assets/monsters/moss_golem_v2/base/east.png`
- Pose plan: `assets/monsters/moss_golem_v2/idle/raw/idle_northeast_pose_plan.md`
- Accepted source: `assets/monsters/moss_golem_v2/idle/raw/idle_northeast_raw.png`
- Generated source before expansion: `assets/monsters/moss_golem_v2/idle/raw/idle_northeast_generated_raw.png`
- Frames: `assets/monsters/moss_golem_v2/idle/frames/idle_northeast_01.png` through `idle_northeast_05.png`
- Preview: `assets/monsters/moss_golem_v2/idle/preview/idle_northeast_preview.png`
- GIF: `assets/monsters/moss_golem_v2/idle/gif/idle_northeast.gif`
- Helper tool: `assets/monsters/moss_golem_v2/idle/tools/idle_northeast_process.py`

QA checks:

- One animation plus one direction only.
- Source canvas was expanded without shrinking sprites to meet the large monster spacing gate.
- Expanded source measured `384, 384, 384, 384 px` gutters; required `384 px`.
- Five distinct northeast-facing idle poses were exported.
- Final frames are `384x384` with transparent backgrounds.
- Standard preview, 4x preview, focused QA preview, and looping GIF exist.
- Base-set stone, moss, vine, heavy arm, and rear-facing silhouette features are preserved.

Final QA status: `approved`
