# walk_south QA

Status: `approved`

## Inputs

- Queue row: `walk_south`
- Required skill: `$game-studio:sprite-pipeline`
- Inferred project root: `D:\projects\MotherSeed2D`
- Inferred subject id: `tree_goblin`
- Inferred subject type: `monster`
- Animation/direction: `walk + south`
- Base folder location: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base`
- Required cardinal base files: `north.png`, `south.png`, `east.png`, `west.png`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\south.png`
- User animation direction: Natural walking motion, right foot forward > middle step > left foot forward repeat.
- Direction set: `8_directional`
- Required directions for selected set: `south;southeast;east;northeast;north;northwest;west;southwest`
- Frame count: `8`
- Subject size: `default`
- Required items/weapons/features: preserve visible base-set tree goblin features; no unrequested items.
- Frame profile: `default_128`
- Required source-strip spacing: `128px` empty `#ff00ff` between neighboring visible pose bounds.
- Current source strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\raw\walk_south_raw.png`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\frames\walk_south_01.png` through `walk_south_08.png`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_south_preview.png`
- 4x preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_south_preview_4x.png`
- Focused QA preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\preview\walk_south_focused_qa.png`
- Review GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\walk\gif\walk_south.gif`

## Frame-by-frame pose plan

1. Right root foot forward, torso leans slightly into the step, left claw arm swings forward, right claw arm drifts back, moss canopy subtly lags.
2. Passing step, body rises to middle height, feet closer beneath trunk, arms crossing through neutral, antlers bob up.
3. Left root foot forward, torso weight shifts to the other side, right claw arm swings forward, left claw arm drifts back.
4. Passing step, body dips slightly, trailing roots lift, vines and hanging moss sway downward and back.
5. Right root foot forward again with stronger planted contact, shoulders counter-rotate, claws open naturally, trunk compresses a little.
6. Mid-stride recovery, trunk centered, rear foot pulls through, hanging moss trails behind the movement.
7. Left root foot forward planted, glowing eyes and face stay front/south, arms counter-swing clearly.
8. Return/pass pose that loops cleanly back to frame 1, body centered with roots preparing the next right-foot step.

## Source Provenance

- Fresh source confirmation: regenerated from the updated `south.png` base on 2026-04-27.
- Rejected source attempts:
  - `walk_south_rejected_attempt_01_tight_gutters.png`: generated from the earlier incorrect south base and rejected.
  - `walk_south_rejected_attempt_02_updated_base_tight_gutters.png`: generated from the updated south base but rejected as the direct raw source because gutters were below the 128px source-spacing gate.
- Accepted source handling: extracted the eight true pose groups from attempt 02, repacked them onto a clean flat `#ff00ff` strip with exactly 128px gutters, and flattened chroma-key pixels to exact `#ff00ff`.

## QA Results

- `$game-studio:sprite-pipeline` used for intake, source generation, cleanup/repack, normalization, preview rendering, GIF creation, and QA.
- Base folder exists and contains `north.png`, `south.png`, `east.png`, and `west.png`.
- Correct mapped south base source was used after the user updated `south.png`.
- Queue contains all eight required directions for the selected 8-directional walk set.
- Source strip contains eight distinct south-facing walk poses.
- Source strip was repacked to at least 128px empty `#ff00ff` spacing between neighboring visible pose bounds.
- Normalized frame size is exactly `128x128` for all eight frames.
- Shared scale and bottom-center anchor used: profile `default_128`, anchor `{ x: 64, y: 120 }`.
- Transparent background preserved after chroma-key cleanup.
- No remaining magenta-like fringe pixels detected in normalized frames.
- No normalized frame edge contact detected; measured frame bounds stay inside the 128x128 frame.
- Standard preview, 4x preview, focused QA preview, and looping GIF exist.
- Visual review confirms correct south direction, preserved tree goblin features/colors, and readable body/root/arm motion.

Final QA status: `approved`
