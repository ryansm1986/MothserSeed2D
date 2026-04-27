# attack_south QA

Status: `approved`

## Inputs

- Queue row: `attack_south`
- Required skill: `$game-studio:sprite-pipeline`
- Tooling scope: one-by-one template flow plus fresh helper under the active animation tools folder
- Inferred project root: `D:\projects\MotherSeed2D`
- Inferred subject id: `tree_goblin`
- Inferred subject type: `monster`
- Animation/direction: `attack + south`
- One-direction-only source: `yes`
- Base folder location: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base`
- Required cardinal base files: `north.png`, `south.png`, `east.png`, `west.png`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\south.png`
- User animation direction: `rips its left arm off and uses it to attack`
- Direction set: `8_directional`
- Required directions for selected set: `south;southeast;east;northeast;north;northwest;west;southwest`
- One-job-at-a-time answer: `Yes, strictly follow the templates`
- Frame count: `8`
- Frame-by-frame pose plan: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\attack\qa\attack_south_plan.json`
- Subject size: `default`
- Required items/weapons/features: `preserve detailed tree goblin base: bark body, twig horns, claws, root feet, moss/leaves/vines, green eyes/sap; torn left arm becomes the attack club`
- Frame profile: `expanded_action_384`
- Generated one-by-one source attempt: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\attack\raw\attack_south_generated_attempt_04_base_style.png`
- Generated attempt source spacing measurement: `[78, 50, 74, 31, 0, 0, 74]`
- Repacked raw source-strip spacing measurement: `[384, 384, 384, 384, 384, 384, 384]`
- Expected raw strip: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\attack\raw\attack_south_raw.png`
- Expected normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\attack\frames\attack_south_01.png` through `attack_south_08.png`
- Expected preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\attack\preview\attack_south_preview.png`
- Expected review GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\attack\gif\attack_south.gif`

## Frame-by-frame pose plan

1. Wind-up: south-facing hunch toward the left shoulder, left arm still attached.
2. Grip/tear: right claw digs into the left shoulder joint, torso twists, bark cracks, sap starts.
3. Rip free: left arm tears loose as a wooden limb-club, splintered shoulder stump visible.
4. Draw back: remaining hand pulls the severed arm-club back while the missing shoulder stays readable.
5. Strike/contact: wide front-facing club swing, trunk leans into impact, root feet brace.
6. Follow-through: club passes across the body, torso twisted with leaves and bark chips trailing.
7. Recovery: arm-club lowers, one arm missing, shoulder stump still visible.
8. Loop-ready reset: crouched south-facing ready pose holding the arm-club close.

## Source Provenance

- Fresh source confirmation: `generated as a fresh one-direction source strip from the active direction base reference`
- Template-only tooling confirmation: `used copied subject pipeline files, base folder, and the fresh helper listed below`
- Fresh helper tools created under `attack/tools/`: `attack_finish_base_style_sources.py`
- Frame uniqueness confirmation: `all eight source frames use separate attack pose beats`
- Rejected source attempts, if any: `simplified helper-generated outputs were rejected by the user and overwritten`
- Note: the built-in image generator still returned a compact 2172px-wide source canvas; the detailed base-style pose islands were widened into the accepted raw strip before normalization so the working raw strip has the required 384px-plus gutters.

## QA Results

- `$game-studio:sprite-pipeline` was used throughout the serial source generation, cleanup, normalization, preview rendering, GIF creation, QA, and queue update.
- Job was processed as one animation plus one direction only.
- Source attempt contains one horizontal strip for this direction only, with no rows, labels, turnarounds, or other facings.
- Base folder exists and contains `north.png`, `south.png`, `east.png`, and `west.png`.
- Correct direction base reference was loaded before source generation.
- Animation queue contains every required 8-direction attack row.
- Repacked raw gaps are `[384, 384, 384, 384, 384, 384, 384]`, all at least `384px`.
- Direction is correct in every frame.
- Every frame is a distinct detailed base-style attack pose with visible body, arm, shoulder, stump, club, and root-foot progression.
- Required left-arm rip and arm-club attack are present; no unrequested weapon was added.
- Final frames are exactly `384x384`, transparent, and use shared bottom-center anchor `{ x: 192, y: 376 }`.
- No final-frame edge contact detected.
- Standard preview, 4x preview, focused QA preview, and looping GIF exist.

Final QA status: `approved`
