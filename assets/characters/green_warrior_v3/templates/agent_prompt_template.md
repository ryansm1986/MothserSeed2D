# Agent Prompt Template

Use `$game-studio:sprite-pipeline`.

Project: `D:/projects/MotherSeed2D`
Character: `green_warrior_v3`
Resume file: `assets/characters/green_warrior_v3/PIPELINE_RESUME.md`
Queue file: `assets/characters/green_warrior_v3/animation_queue.csv`
Frame profiles: `assets/characters/green_warrior_v3/frame_profiles.csv`

Task: Work only on `<JOB_ID>`, which is `<ANIMATION>/<DIRECTION>` with `<FRAME_COUNT>` frames.

Parallel coordination:

- Re-read `animation_queue.csv` before doing anything.
- If `<JOB_ID>` is owned by another `in_progress` row note, stop and report it.
- Claim only `<JOB_ID>` by setting `status=in_progress` and `qa_notes` to `Owner: <your thread name>; claimed: <date/time>; scope: <JOB_ID only>`.
- Do not edit files for other job IDs.
- Do not assemble animation sheets.

Sprite requirements:

- Use only the canonical `green_warrior_v3` base/reference assets and approved outputs generated during this v3 pipeline.
- Do not use older animation strips, repaired frames, raw sheets, or normalized frames from `green_warrior_v2` or any other character folder as source.
- Generate one fresh full horizontal source strip for `<JOB_ID>`, not separate unrelated frames and not a re-normalization of an older animation.
- You may reference approved current-pipeline v3 frames to preserve proportions, facing, palette, costume details, and anchoring, but the job still needs a new source strip.
- For `attack` and `special`, the source strip must be newly image-generated from the canonical base/reference with the guideline `<ANIMATION> + <DIRECTION>`. Do not rotate, skew, warp, scale, pose-transform, or draw effects over idle/current-pipeline frames to create the source.
- Same character, same facing direction, same silhouette, same outfit proportions, same palette family.
- Use direction-specific wording in prompts and QA, not only the direction slug:
  - `down`: down/front-facing.
  - `down_right`: down-right diagonal-forward, face/chest angled toward viewer and screen right.
  - `right`: screen-right side profile.
  - `up_right`: up-right away-facing back/side diagonal.
  - `up`: up/back-facing.
  - `up_left`: up-left away-facing back/side diagonal.
  - `left`: screen-left side profile.
  - `down_left`: down-left diagonal-forward, face/chest angled toward viewer and screen left.
- Direction must remain correct in every frame, including follow-through and recovery frames.
- Make the animation creative and readable: visible anticipation, crouch or coil, lunge/contact, follow-through, and recovery.
- The body must move, not just the effect layer: show torso lean/twist, head/shoulder change, sword-arm action, scarf response, and foot/weight shift where appropriate.
- Effects, slash arcs, and impact flashes must support the character motion and must not be the only animated element.
- For `attack` and `special`, request compact slash arcs/impact flashes that stay inside their own pose cell. Wide effects are acceptable only if they preserve clean source gutters and fit inside the final expanded frame.
- Reject the row if it reads as an idle pose with a slash pasted over it.
- Reject the row if it looks like a mechanically transformed idle pose instead of a newly generated action drawing.
- Reject the source and regenerate if any frame faces the wrong direction, even if the rest of the strip looks good.
- Reject the source and regenerate if a sword tip or effect is cropped at the source image edge.
- Reject the source and regenerate if a slash arc, impact flash, scarf, shadow, spark, haze, or loose pixel crosses into a neighboring pose lane or gutter. Do not salvage visibly contaminated sources by equal-slot slicing.
- Sword visibly held in the character's right hand in every frame.
- Left hand empty in every frame.
- No shield, buckler, off-hand weapon, or held object.
- Transparent or flat `#ff00ff` chroma-key background.
- Initial generated strip must have at least one full frame of empty flat `#ff00ff` space between the visible bounding boxes of neighboring poses before cleanup or slicing: `128px` minimum for default `128x128` rows, `384px` minimum for expanded `384x384` attack/special rows.
- At least two full frame-widths of empty flat `#ff00ff` gutter between each neighboring pose.
- No sword, scarf, shadow, glow, particle haze, alpha haze, loose pixels, scenery, labels, UI, poster composition, or unrelated objects in the gutters.

Prompting tips from successful attack rows:

- Ask for exactly this action beat structure when appropriate: frame 1 ready stance, frame 2 crouch/anticipation, frame 3 coil/windup, frame 4 lunge/contact, frame 5 impact, frame 6 follow-through, frame 7 recovery step, frame 8 ready recovery.
- Repeat the facing constraint with camera language and include `including recovery frames`.
- For up-facing rows, say `away from the viewer` and ask for the back of the head, back of tunic, rear scarf, shoulders, and boots from behind.
- For side rows, say `screen-left side profile` or `screen-right side profile`.
- For diagonal down rows, say `diagonal-forward` and mention face/chest angled toward the viewer.
- For diagonal up rows, say `away-facing back/side diagonal`.
- Log any rejected generated source attempts in QA when they explain the final source choice.

Workflow:

1. Build or verify the edit canvas from the approved seed/reference.
2. Pick any approved v3 current-pipeline reference frames needed for consistency.
3. Generate the fresh source strip. For `attack` and `special`, generate newly drawn action poses from the image model, not procedural transforms of existing frames.
4. Save raw/chromakey files under `assets/characters/green_warrior_v3/<ANIMATION>/raw/` using the `<JOB_ID>` prefix.
5. Verify the initial generated source strip has at least full-frame empty spacing between neighboring visible poses.
6. Reject and regenerate before normalization if the source has cropped sword/effect pixels, wrong-facing frames, shield/off-hand objects, or baked-in gutter contamination.
7. Remove chroma key, group full-strip alpha components into poses, repack with wide transparent padding, then normalize to the selected animation profile.
8. If alpha grouping finds the wrong number of pose groups, inspect the source visually. Equal-slot slicing is allowed only for visually clean strips where antialiasing confused grouping; do not use it to salvage visible cross-pose effects.
9. Save frames as `assets/characters/green_warrior_v3/<ANIMATION>/frames/<JOB_ID>_01.png` through the final frame.
10. Render standard, 4x, and focused weapon/no-shield QA preview PNGs.
11. Render one looping direction GIF at `assets/characters/green_warrior_v3/<ANIMATION>/gif/<JOB_ID>.gif`.
12. For `attack` and `special`, include an explicit direction check for every frame, including recovery.
13. For `attack` and `special`, include an explicit side-padding/no-cropping check for sword arcs and special effects.
14. For `attack` and `special`, include an explicit creative-motion check confirming the character body changes pose and does not remain idle.
15. For `attack` and `special`, include an explicit source-authenticity check confirming the row was image-generated as `<ANIMATION> + <DIRECTION>`, not made by rotating/warping/drawing over idle frames.
16. Write `assets/characters/green_warrior_v3/<ANIMATION>/qa/<JOB_ID>_qa.md` with source provenance.
17. Update only the `<JOB_ID>` queue row.
