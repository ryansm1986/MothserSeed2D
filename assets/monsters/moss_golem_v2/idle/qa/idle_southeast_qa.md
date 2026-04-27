# idle_southeast QA

Status: `approved`

- Queue row: `idle_southeast`
- Required skill: `$game-studio:sprite-pipeline`
- Animation/direction: `idle + southeast`
- Legacy alias: `down_right`
- Base sources: `assets/monsters/moss_golem_v2/base/south.png`, `assets/monsters/moss_golem_v2/base/east.png`
- Pose plan: `assets/monsters/moss_golem_v2/idle/raw/idle_southeast_pose_plan.md`
- Accepted source: `assets/monsters/moss_golem_v2/idle/raw/idle_southeast_raw.png`
- Generated source before expansion: `assets/monsters/moss_golem_v2/idle/raw/idle_southeast_generated_raw.png`
- Rejected source attempt: `assets/monsters/moss_golem_v2/idle/raw/idle_southeast_rejected_attempt1_raw.png` and expanded intermediate `idle_southeast_rejected_attempt1_expanded_raw.png`, rejected for visible purple color drift on the arm.
- Frames: `assets/monsters/moss_golem_v2/idle/frames/idle_southeast_01.png` through `idle_southeast_05.png`
- Preview: `assets/monsters/moss_golem_v2/idle/preview/idle_southeast_preview.png`
- GIF: `assets/monsters/moss_golem_v2/idle/gif/idle_southeast.gif`
- Helper tool: `assets/monsters/moss_golem_v2/idle/tools/idle_southeast_process.py`

QA checks:

- One animation plus one direction only.
- Source canvas was expanded without shrinking sprites to meet the large monster spacing gate.
- Expanded source measured `384, 384, 384, 384 px` gutters; required `384 px`.
- Five distinct southeast-facing idle poses were exported.
- Final frames are `384x384` with transparent backgrounds.
- Standard preview, 4x preview, focused QA preview, and looping GIF exist.
- Base-set stone, moss, vine, green eye, and green core colors are preserved with no requested equipment changes.

Final QA status: `approved`
