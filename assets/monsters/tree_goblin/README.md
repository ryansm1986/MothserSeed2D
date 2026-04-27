# Reusable Sprite Pipeline Template

This folder is a generalized version of the `green_warrior_v3` animation pipeline for new characters and monsters.

## Required Skill

Use `$game-studio:sprite-pipeline` throughout the animation build. Keep the skill active for intake, source-strip generation, normalization, preview rendering, GIF creation, QA, and assembly.

Copy this folder into a new asset folder, then provide a base folder path under the correct project asset location.

## Required Input

- A four-directional base folder for the character or monster. The base set must define the subject identity, silhouette, palette, proportions, outfit/body details, skin/hair/body colors, and any default equipment from all cardinal facings.
- The base folder must live at `assets/characters/<subject_id>/base/` or `assets/monsters/<subject_id>/base/`.
- The base folder must contain `north.png`, `south.png`, `east.png`, and `west.png`.
- Project root, subject type, subject id, and destination folder are inferred from that base folder location.
- Monster size is optional during intake. Default is about character size, medium is about 2 times character size, and large is about 3 times character size.
- Medium and large monsters must use the matching size-aware profiles in `frame_profiles.csv` instead of being shrunk into character-sized frames.
- Character item, clothing, skin, hair, fur, scale, armor, and equipment colors must remain consistent across all four base files unless a prompt explicitly changes them.
- If 8-directional animations are selected, all eight canonical directions are required: `south`, `southeast`, `east`, `northeast`, `north`, `northwest`, `west`, and `southwest`.
- If 4-directional animations are selected, all four canonical directions are required: `south`, `east`, `north`, and `west`.
- Every generated strip must contain distinct newly drawn animation poses for each frame. Do not accept strips where the same base pose is copied across frames with only tiny shifts, shadows, effects, or placement changes.

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
    assembled/
```
