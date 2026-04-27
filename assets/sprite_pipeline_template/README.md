# Reusable Sprite Pipeline Template

This folder is a generalized version of the `green_warrior_v3` animation pipeline for new characters and monsters.

Copy this folder into a new asset folder, then replace the placeholders with the new subject name and base image path.

## Required Input

- A base image for the character or monster. The base must define the subject identity, silhouette, palette, proportions, outfit/body details, skin/hair/body colors, and any default equipment.
- Character item, clothing, skin, hair, fur, scale, armor, and equipment colors must remain consistent with the base image unless a prompt explicitly changes them.

Do not start generation without a base image and an animation name.

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
  <animation>/
    raw/
    frames/
    preview/
    gif/
    qa/
    assembled/
```
