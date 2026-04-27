# walk_east QA

Status: `approved`

## Inputs

- Queue row: `walk_east`
- Required skill: `$game-studio:sprite-pipeline`
- Inferred project root: `D:\projects\MotherSeed2D`
- Inferred subject id: `tree_goblin`
- Inferred subject type: `monster`
- Animation/direction: `walk + east`
- Base folder location: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\east.png`
- User animation direction: Natural walking motion, right foot forward > middle step > left foot forward repeat.
- Direction set: `8_directional`
- Required directions: `south;southeast;east;northeast;north;northwest;west;southwest`
- Frame count: `8`
- Subject size: `default`
- Frame profile: `default_128`
- Raw generated attempt: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\raw\walk_east_generated_attempt_01.png`
- Accepted source strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\raw\walk_east_raw.png`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\frames\walk_east_01.png` through `walk_east_08.png`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_east_preview.png`
- 4x preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_east_preview_4x.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_east_focused_qa.png`
- Review GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\gif\walk_east.gif`

## Frame-by-frame pose plan

1. Forward/right root foot reaches ahead, trunk leans slightly forward, rear claw arm swings forward in counterbalance.
2. Passing step, body rises, roots come closer under trunk, arms cross through neutral, canopy bobs upward.
3. Rear/left root swings underneath, torso twists subtly, hanging moss trails.
4. Opposite root foot plants forward, body dips into weight, front claw opens naturally.
5. Strong planted contact, shoulders counter-rotate, vine bands and moss lag.
6. Mid-stride recovery, rear roots pull through, head remains clearly right-facing.
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
