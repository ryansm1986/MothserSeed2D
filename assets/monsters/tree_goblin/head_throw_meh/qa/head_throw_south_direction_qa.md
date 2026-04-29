# head_throw_south Direction QA

Status: `approved`

## Inputs

- Required skill: `$game-studio:sprite-pipeline`
- Animation/direction: `head_throw + south`
- Frame count: `6`
- Direction set: `8_directional`
- Required directions for selected set: `south;southeast;east;northeast;north;northwest;west;southwest`
- Base folder location: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base`
- Mapped base source(s): `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\south.png`
- Frame chain manifest: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\head_throw\qa\head_throw_south_frame_chain_manifest.csv`
- Raw frame directory: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\head_throw\raw`
- Normalized frames: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\head_throw\frames\head_throw_south_01.png` through `head_throw_south_06.png`
- Preview: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\head_throw\preview\head_throw_south_preview.png`
- Review GIF: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\head_throw\gif\head_throw_south.gif`
- Local tools folder: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\head_throw\tools`

## Required Before Direction Approval

- `$game-studio:sprite-pipeline` was used throughout source generation, normalization, preview rendering, GIF creation, and QA: `pass`
- Only reusable template files, copied subject pipeline files, and user-approved tools/references were used: `pass`
- No existing project animation tooling, old pipeline scripts, prior generated strips, prior normalized frames, hidden automation, or another subject pipeline was searched for or reused: `pass`
- Fresh helper scripts are stored under the animation tools folder: `pass; tools/head_throw_south_normalize_preview.py`
- No full source strip or multi-frame generated source was used: `pass`
- Every raw source frame was generated one frame at a time in frame-index order: `pass`
- No frame `N+1` was started before frame `N` was approved: `pass`
- Frame 01 used the mapped base source as primary source: `pass`
- Every frame 02+ used the approved previous frame as primary source and original mapped base source as identity reference: `pass`
- Every frame has a passing per-frame QA note: `pass`
- Frame chain manifest has exactly `6` rows for this job and every row is `approved`: `pass`
- Every raw frame is a distinct newly generated pose for its planned beat: `pass`
- The frame chain did not drift in identity, colors, proportions, scale, equipment, anatomy, or direction: `pass`
- Body/creature anatomy visibly moves and does not read as a static pose with effects pasted on top: `pass`
- Action/attack full-envelope whitespace passed when applicable: `pass`
- Normalized frames use one shared scale and bottom-center anchor: `pass`
- Final frames match the selected frame profile exactly: `pass; 384x384`
- Transparent background is preserved: `pass; verified alpha in all PNG frames`
- No opaque `#ff00ff` remains in normalized frames, preview, or transparent GIF frames: `pass`
- No final-frame edge contact or cropped effect/body pixels: `pass`
- Standard preview, enlarged preview, and looping review GIF were exported: `pass`

Final direction QA status: `approved`
