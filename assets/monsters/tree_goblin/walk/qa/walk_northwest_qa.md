# walk_northwest QA

Status: `approved`

## Inputs

- Queue row: `walk_northwest`
- Required skill: `$game-studio:sprite-pipeline`
- Animation/direction: `walk + northwest`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\north.png;D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\west.png`
- Direction set: `8_directional`
- Frame count: `8`
- Subject size: `default`
- Frame profile: `default_128`
- Raw generated attempt: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\raw\walk_northwest_generated_attempt_01.png`
- Accepted source strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\raw\walk_northwest_raw.png`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\frames\walk_northwest_01.png` through `walk_northwest_08.png`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_northwest_preview.png`
- 4x preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_northwest_preview_4x.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_northwest_focused_qa.png`
- Review GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\gif\walk_northwest.gif`

## Frame-by-frame pose plan

1. Up-left rear root foot reaches forward, trunk leans into the diagonal step, opposite branch arm swings.
2. Passing step, body rises, root feet draw beneath trunk, canopy bobs upward.
3. Opposite root foot reaches up-left, shoulders counter-rotate, hanging moss trails.
4. Passing dip, trailing roots lift, vine bands lag behind the diagonal motion.
5. Strong forward plant, trunk compresses slightly, branch antlers bob.
6. Mid-stride recovery, rear roots pull through, back-quarter silhouette stays northwest.
7. Next forward plant, body weight shifts, moss swings.
8. Loop-ready passing pose preparing to return to frame 1.

## Source Provenance

- Fresh source generated from the mapped adjacent cardinal base references.
- Eight pose groups were extracted and repacked onto a clean flat `#ff00ff` strip with 128px gutters before normalization.

## QA Results

- Eight distinct walk poses detected and normalized.
- Final frames are exactly `128x128`, transparent, and use shared bottom-center anchor `{ x: 64, y: 120 }`.
- No edge contact detected.
- No magenta-like fringe pixels detected.
- Preview, 4x preview, focused QA preview, and looping GIF exist.

Final QA status: `approved`
