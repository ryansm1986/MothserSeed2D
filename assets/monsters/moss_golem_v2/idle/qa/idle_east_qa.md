# idle_east QA

Status: `approved`

- Queue row: `idle_east`
- Required skill: `$game-studio:sprite-pipeline`
- Animation/direction: `idle + east`
- Legacy alias: `right`
- Base source: `assets/monsters/moss_golem_v2/base/east.png`
- Pose plan: `assets/monsters/moss_golem_v2/idle/raw/idle_east_pose_plan.md`
- Accepted source: `assets/monsters/moss_golem_v2/idle/raw/idle_east_raw.png`
- Generated source before expansion: `assets/monsters/moss_golem_v2/idle/raw/idle_east_generated_raw.png`
- Rejected source attempt: `assets/monsters/moss_golem_v2/idle/raw/idle_east_rejected_attempt1_raw.png`, rejected for wrong subject and invalid pose grouping.
- Frames: `assets/monsters/moss_golem_v2/idle/frames/idle_east_01.png` through `idle_east_05.png`
- Preview: `assets/monsters/moss_golem_v2/idle/preview/idle_east_preview.png`
- GIF: `assets/monsters/moss_golem_v2/idle/gif/idle_east.gif`
- Helper tool: `assets/monsters/moss_golem_v2/idle/tools/idle_east_process.py`

QA checks:

- One animation plus one direction only.
- Source canvas was expanded without shrinking sprites to meet the large monster spacing gate.
- Expanded source measured `384, 384, 384, 384 px` gutters; required `384 px`.
- Five distinct east-facing idle poses were exported.
- Final frames are `384x384` with transparent backgrounds.
- Standard preview, 4x preview, focused QA preview, and looping GIF exist.
- Base-set stone, moss, vine, green eye, and green core colors are preserved with no requested equipment changes.

Final QA status: `approved`
