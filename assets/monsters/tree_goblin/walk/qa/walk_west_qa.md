# walk_west QA

Status: `approved`

## Inputs

- Queue row: `walk_west`
- Required skill: `$game-studio:sprite-pipeline`
- Animation/direction: `walk + west`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\west.png`
- Direction set: `8_directional`
- Frame count: `8`
- Subject size: `default`
- Frame profile: `default_128`
- Raw generated attempt: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\raw\walk_west_generated_attempt_01.png`
- Accepted source strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\raw\walk_west_raw.png`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\frames\walk_west_01.png` through `walk_west_08.png`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_west_preview.png`
- 4x preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_west_preview_4x.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_west_focused_qa.png`
- Review GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\gif\walk_west.gif`

## Frame-by-frame pose plan

1. Forward/left root foot reaches ahead, trunk leans slightly forward, rear claw arm swings forward in counterbalance.
2. Passing step, body rises, roots come closer under trunk, arms cross through neutral, canopy bobs upward.
3. Rear/right root swings underneath, torso twists subtly, hanging moss trails.
4. Opposite root foot plants forward, body dips into weight, front claw opens naturally.
5. Strong planted contact, shoulders counter-rotate, vine bands and moss lag.
6. Mid-stride recovery, rear roots pull through, head remains clearly left-facing.
7. Next forward root plant, trunk compresses slightly, branch antlers bob.
8. Loop-ready passing pose preparing to return to frame 1.

## Source Provenance

- Fresh source generated from the mapped directional base reference.
- Direct generated spacing was below the 128px gate, so eight pose groups were extracted and repacked onto a clean flat `#ff00ff` strip with 128px gutters before normalization.

## QA Results

- Eight distinct walk poses detected and normalized.
- Final frames are exactly `128x128`, transparent, and use shared bottom-center anchor `{ x: 64, y: 120 }`.
- No edge contact detected.
- No magenta-like fringe pixels detected.
- Preview, 4x preview, focused QA preview, and looping GIF exist.

Final QA status: `approved`
