# Reusable Sprite Pipeline Template

This folder is a generalized version of the `green_warrior_v3` animation pipeline for new characters and monsters.

## Required Skill

Use `$game-studio:sprite-pipeline` throughout the animation build. Keep the skill active for intake, source-strip generation, normalization, preview rendering, GIF creation, QA, and assembly.

## Template-Only Tooling

Use only the tooling and workflow files in this reusable template folder unless the user explicitly approves an additional tool.

- Do not search the project for existing animation tools, prior pipeline scripts, old job folders, old generated sheets, or animation-specific automation.
- Do not infer workflow from any existing character or monster pipeline.
- The allowed local workflow sources are `README.md`, `PIPELINE_TEMPLATE.md`, `frame_profiles.csv`, `animation_queue_template.csv`, `templates/copy_paste_intake_prompt.md`, `templates/agent_job_prompt_template.md`, and `templates/job_qa_template.md`.
- If the process requires a freshly created helper script, config, checklist, or temporary processing tool, create it inside the current animation folder under `<animation>/tools/` and name it with the active `<job_id>` when it is job-specific.
- Do not create or modify shared tools in the project root, project `scripts/`, reusable template folder, another subject folder, or another animation folder unless the user explicitly approves it.
- Create every source strip, normalized frame, preview, GIF, and QA note fresh for the current subject and active queue job.

Copy this folder into a new asset folder, then provide a base folder path under the correct project asset location.

## Required Input

- A four-directional base folder for the character or monster. The base set must define the subject identity, silhouette, palette, proportions, outfit/body details, skin/hair/body colors, and any default equipment from all cardinal facings.
- The base folder must live at `assets/characters/<subject_id>/base/` or `assets/monsters/<subject_id>/base/`.
- The base folder must contain `north.png`, `south.png`, `east.png`, and `west.png`.
- Project root, subject type, subject id, and destination folder are inferred from that base folder location.
- Monster size is optional during intake. Default is about character size, medium is about 2 times character size, and large is about 3 times character size.
- Medium and large monsters must use the matching size-aware profiles in `frame_profiles.csv` instead of being shrunk into character-sized frames.
- Medium and large monsters must also follow the large-model whitespace standard: extra-wide canvas space is reserved for empty margins, gutters, motion, and effects. It is not permission to scale the model up until it fills the frame lane.
- For medium and large gameplay frames, keep the core body/model around 70-75% of the selected frame width/height, with 80% as a hard maximum before effects. If the model grows beyond that, reject it and regenerate at the same model scale with more empty canvas space.
- For expanded action frames, keep the core body/model at its gameplay-size footprint inside the larger action canvas. Effects may extend farther, but the body itself must not grow just because the canvas is extra wide or the frame profile is larger.
- Action/attack rows are extra-special whitespace rows: `attack`, `cast`, `special`, `skill`, `death`, and `large_effect` must preserve empty `#ff00ff` or transparent space around the full action envelope, including body, weapon, slash/trail, spell glow, particles, shadow, wings, tail, and recovery motion.
- If an action/attack body, weapon, trail, glow, particle, shadow, or effect comes close to the frame edge, source edge, or neighboring pose lane, use a wider source canvas, larger gutters, or a larger expanded action profile. Do not scale up the body/effect to fill the lane, and do not crop the action envelope.
- Source strips must be checked for the selected profile's spacing requirement between neighboring visible pose bounds before cleanup, slicing, repack, or normalization. The default/medium/large source whitespace padding has been increased by `128px`: `256px` for `default_128`, `384px` for `monster_medium_256`, `512px` for `expanded_action_384` and `monster_large_384`, `896px` for `monster_medium_action_768`, and `1280px` for `monster_large_action_1152`.
- If the strip needs more room to satisfy spacing, expand the horizontal source canvas width and gutters. Do not generate smaller monster poses, shrink the animation, reduce the selected monster scale, or crop effects to make the strip fit.
- The initial strip request must ask for an extended-width horizontal canvas with expanded empty distance between every frame lane. Do not request a compact strip.
- After generation, QA must inspect the raw strip before cleanup/repack/normalization. If the selected profile spacing requirement is not met, fail the strip and specify that the source strip must be regenerated on a wider horizontal canvas with larger gutters.
- If a source strip has less than the selected profile's required empty space between poses, or if any limb, tail, wing, weapon, shadow, glow, particle, or effect enters the neighboring pose lane, reject and regenerate the strip to prevent bleed and cutoff.
- Character item, clothing, skin, hair, fur, scale, armor, and equipment colors must remain consistent across all four base files unless a prompt explicitly changes them.
- If 8-directional animations are selected, all eight canonical directions are required: `south`, `southeast`, `east`, `northeast`, `north`, `northwest`, `west`, and `southwest`.
- If 4-directional animations are selected, all four canonical directions are required: `south`, `east`, `north`, and `west`.
- Every generated strip must contain distinct newly drawn animation poses for each frame. Do not accept strips where the same base pose is copied across frames with only tiny shifts, shadows, effects, or placement changes.
- Process one animation/direction job at a time. Each source-generation request must produce exactly one horizontal strip for one direction only.
- During intake, ask whether to follow the one-job-at-a-time pipeline from these templates. The default is `Yes, strictly follow the templates`.
- If the answer is blank or yes, process one queue row at a time from full start to full finish. For example, finish `south`/`down` raw strip, normalized frames, previews, GIF, QA note, queue update, and approval before starting any other direction.
- If a direction needs revision, stay on that same direction until it is approved or the user explicitly pauses/skips it. Do not move on by generating strips for other directions.
- If the answer is no, stop before generation and require explicit approval for the alternate workflow.
- Do not generate multiple directions in one image, one sheet, one canvas, one prompt, or one source strip.

Do not start generation without an animation name and the location of an existing base folder containing all four required directional base files.

## Files

- `PIPELINE_TEMPLATE.md`: generalized pipeline rules and workflow.
- `frame_profiles.csv`: default frame-size profiles.
- `animation_queue_template.csv`: queue schema and example placeholder rows.
- `templates/copy_paste_intake_prompt.md`: user-facing prompt to paste into Codex.
- `templates/agent_job_prompt_template.md`: per-job worker prompt.
- `templates/job_qa_template.md`: QA note template.

## Recommended Destination

Characters:

```text
assets/characters/<subject_id>/
```

Monsters:

```text
assets/monsters/<subject_id>/
```

Every generated animation should use this folder structure:

```text
<subject_id>/
  base/
    north.png
    south.png
    east.png
    west.png
  <animation>/
    raw/
    frames/
    preview/
    gif/
    qa/
    tools/
    assembled/
```
