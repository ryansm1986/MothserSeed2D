# idle_north QA

Status: `approved`

- Queue row: `idle_north`
- Legacy alias: `up`
- Required skill: `$game-studio:sprite-pipeline`
- Animation/direction: `idle + north`
- Base source: `assets/monsters/moss_golem_v2/base/north.png`
- Pose plan: `assets/monsters/moss_golem_v2/idle/raw/idle_north_pose_plan.md`
- Accepted source: `assets/monsters/moss_golem_v2/idle/raw/idle_north_raw.png`
- Generated source before expansion: `assets/monsters/moss_golem_v2/idle/raw/idle_north_generated_raw.png`
- Frames: `assets/monsters/moss_golem_v2/idle/frames/idle_north_01.png` through `idle_north_05.png`
- Preview: `assets/monsters/moss_golem_v2/idle/preview/idle_north_preview.png`
- GIF: `assets/monsters/moss_golem_v2/idle/gif/idle_north.gif`
- Helper tool: `assets/monsters/moss_golem_v2/idle/tools/idle_north_process.py`

QA checks:

- One animation plus one direction only.
- Source canvas was expanded without shrinking sprites to meet the large monster spacing gate.
- Expanded source measured `384, 384, 384, 384 px` gutters; required `384 px`.
- Five distinct north-facing idle poses were exported.
- Final frames are `384x384` with transparent backgrounds.
- Standard preview, 4x preview, focused QA preview, and looping GIF exist.
- Base-set rear-facing stone, moss, vine, and heavy arm silhouette features are preserved.

Final QA status: `approved`
