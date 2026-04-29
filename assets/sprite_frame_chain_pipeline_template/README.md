# Reusable Sprite Frame-Chain Pipeline Template

This folder is a generalized one-frame-at-a-time sprite animation pipeline for new characters and monsters.

Use this when strip generation is causing bleed, cutoff, tight spacing, or static repeated poses. This pipeline generates exactly one source frame at a time, then uses the approved previous frame as the primary source for the next frame.

## Required Skill

Use `$game-studio:sprite-pipeline` throughout the animation build. This is an explicit frame-by-frame mode requested by the user, so keep the skill active for consistency, normalization, preview rendering, GIF creation, QA, and assembly while following this template's frame-chain source-generation rules.

## Core Difference From Strip Pipeline

- Do not generate an initial horizontal source strip.
- Do not generate multiple frames in one image generation request.
- Generate frame 01 from the mapped directional base source.
- Generate frame 02 from approved frame 01 plus the original mapped directional base source.
- Generate frame 03 from approved frame 02 plus the original mapped directional base source.
- Continue until the requested frame count is complete.
- After every raw source frame is approved, normalize all frames together with one shared scale and bottom-center anchor.

The previous frame is the motion-continuity source. The original base remains the identity, palette, equipment, silhouette, and proportion reference for every frame so the chain does not drift.

## Required Input

- A four-directional base folder for the character or monster.
- The base folder must live at `assets/characters/<subject_id>/base/` or `assets/monsters/<subject_id>/base/`.
- The base folder must contain `north.png`, `south.png`, `east.png`, and `west.png`.
- Project root, subject type, subject id, and destination folder are inferred from that base folder location.
- For 8-directional work, diagonal frames use the two adjacent cardinal base sources as identity references.
- Character item, clothing, skin, hair, fur, scale, armor, equipment, and monster feature colors must remain consistent unless the prompt explicitly changes them.

## Frame-Chain Rules

- Process one animation, one direction, and one frame at a time.
- Do not move to frame `N+1` until frame `N` is approved.
- Do not move to the next direction until every frame for the active direction has raw output, QA, normalized output, previews, GIF, direction QA, queue update, and approved status.
- Each frame request must create a new complete image for the next planned pose beat. It must not be a shifted, rotated, scaled, or effect-only copy of the previous frame.
- Every frame request must include the original mapped base source as an identity/style reference, even when the previous approved frame is the primary motion source.
- If drift appears in color, proportions, equipment, size, anatomy, or direction, fail the frame and regenerate from the last approved stable frame plus the original base.
- Preserve generous transparent or flat `#ff00ff` empty space around each raw frame.
- Action/attack rows must preserve empty space around the full action envelope: body, weapon, slash/trail, spell glow, impact flash, particles, shadow, wings, tail, and recovery motion.

## Files

- `PIPELINE_TEMPLATE.md`: frame-chain source, normalization, directory, QA, GIF, and assembly rules.
- `frame_profiles.csv`: default frame-size profiles.
- `animation_queue_template.csv`: direction-level queue schema.
- `frame_chain_manifest_template.csv`: per-frame source-chain tracking schema.
- `templates/copy_paste_intake_prompt.md`: user-facing prompt to paste into Codex.
- `templates/agent_frame_job_prompt_template.md`: per-frame worker prompt.
- `templates/frame_qa_template.md`: per-frame QA note template.
- `templates/direction_qa_template.md`: final per-direction QA note template.

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
      <job_id>_frame_01_raw.png
      <job_id>_frame_02_raw.png
    frames/
      <job_id>_01.png
      <job_id>_02.png
    preview/
    gif/
    qa/
      <job_id>_frame_chain_manifest.csv
      <job_id>_frame_01_qa.md
      <job_id>_direction_qa.md
    tools/
    assembled/
```
