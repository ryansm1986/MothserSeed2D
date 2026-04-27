# walk_southeast QA

Status: `approved`

## Inputs

- Queue row: `walk_southeast`
- Required skill: `$game-studio:sprite-pipeline`
- Animation/direction: `walk + southeast`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\south.png;D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\east.png`
- Direction set: `8_directional`
- Frame count: `8`
- Subject size: `default`
- Frame profile: `default_128`
- Raw generated attempt: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\raw\walk_southeast_generated_attempt_01.png`
- Accepted source strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\raw\walk_southeast_raw.png`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\frames\walk_southeast_01.png` through `walk_southeast_08.png`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_southeast_preview.png`
- 4x preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_southeast_preview_4x.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_southeast_focused_qa.png`
- Review GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\gif\walk_southeast.gif`

## Frame-by-frame pose plan

1. Down-right/front root foot reaches forward, trunk leans into the diagonal step, opposite claw arm swings forward.
2. Passing step, body rises, roots draw under trunk, antlers and canopy bob upward.
3. Opposite root foot reaches forward down-right, shoulders counter-rotate, moss trails.
4. Passing dip, trailing roots lift, vines lag behind the diagonal motion.
5. Strong forward plant, trunk compresses slightly, claws open naturally.
6. Mid-stride recovery, rear roots pull through, face remains clearly southeast.
7. Next forward plant, body weight shifts, hanging moss swings.
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
