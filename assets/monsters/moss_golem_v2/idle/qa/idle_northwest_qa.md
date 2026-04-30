# idle_northwest QA

Status: `approved`

- Queue row: `idle_northwest`
- Legacy alias: `up_left`
- Required skill: `$game-studio:sprite-pipeline`
- Animation/direction: `idle + northwest`
- Base sources: `assets/monsters/moss_golem_v2/base/north.png`, `assets/monsters/moss_golem_v2/base/west.png`
- Pose plan: `assets/monsters/moss_golem_v2/idle/raw/idle_northwest_pose_plan.md`
- Accepted source: `assets/monsters/moss_golem_v2/idle/raw/idle_northwest_raw.png`
- Generated source before expansion: `assets/monsters/moss_golem_v2/idle/raw/idle_northwest_generated_raw.png`
- Frames: `assets/monsters/moss_golem_v2/idle/frames/idle_northwest_01.png` through `idle_northwest_05.png`
- Preview: `assets/monsters/moss_golem_v2/idle/preview/idle_northwest_preview.png`
- GIF: `assets/monsters/moss_golem_v2/idle/gif/idle_northwest.gif`
- Helper tool: `assets/monsters/moss_golem_v2/idle/tools/idle_northwest_process.py`

QA checks:

- One animation plus one direction only.
- Source canvas was expanded without shrinking sprites to meet the large monster spacing gate.
- Expanded source measured `384, 384, 384, 384 px` gutters; required `384 px`.
- Five distinct northwest-facing idle poses were exported.
- Final frames are `384x384` with transparent backgrounds.
- Standard preview, 4x preview, focused QA preview, and looping GIF exist.
- Base-set rear/side stone, moss, vine, and heavy arm silhouette features are preserved.
- Face consistency pass: source `northwest.png` head/mask details were overlaid on all 5 normalized frames so the face reads as glowing eye only, with no generated mouth, nose, snout, lips, or teeth.

Final QA status: `approved`
