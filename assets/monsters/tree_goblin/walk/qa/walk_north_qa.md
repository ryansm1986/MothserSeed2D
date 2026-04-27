# walk_north QA

Status: `approved`

## Inputs

- Queue row: `walk_north`
- Required skill: `$game-studio:sprite-pipeline`
- Animation/direction: `walk + north`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\north.png`
- Direction set: `8_directional`
- Frame count: `8`
- Subject size: `default`
- Frame profile: `default_128`
- Raw generated attempt: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\raw\walk_north_generated_attempt_01.png`
- Accepted source strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\raw\walk_north_raw.png`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\frames\walk_north_01.png` through `walk_north_08.png`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_north_preview.png`
- 4x preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_north_preview_4x.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_north_focused_qa.png`
- Review GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\gif\walk_north.gif`

## Frame-by-frame pose plan

1. Right rear root foot reaches forward/up-screen, trunk leans into the step, opposite branch arm swings.
2. Passing step, body rises, root feet closer beneath trunk, canopy bobs upward.
3. Left rear root foot reaches forward/up-screen, shoulders counter-rotate, hanging moss trails.
4. Passing dip, trailing roots lift, vine bands lag.
5. Strong right-foot plant, trunk compresses slightly, branch antlers bob.
6. Mid-stride recovery, arms cross through neutral, moss swings back.
7. Strong left-foot plant, body weight shifts, root toes spread.
8. Loop-ready passing pose preparing to return to frame 1.

## Source Provenance

- Fresh source generated from the mapped directional base reference.
- Eight pose groups were extracted and repacked onto a clean flat `#ff00ff` strip with 128px gutters before normalization.

## QA Results

- Eight distinct walk poses detected and normalized.
- Final frames are exactly `128x128`, transparent, and use shared bottom-center anchor `{ x: 64, y: 120 }`.
- No edge contact detected.
- No magenta-like fringe pixels detected.
- Preview, 4x preview, focused QA preview, and looping GIF exist.

Final QA status: `approved`
