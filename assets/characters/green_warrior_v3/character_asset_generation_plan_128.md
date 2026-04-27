# Parallel-Safe 8-Direction Animation Pipeline For green_warrior_v3

## Summary

This is the fresh `green_warrior_v3` run derived from the approved base and adjusted for padded 128-frame production. Older generated animation strips are historical reference only; every v3 animation job must generate a fresh source strip.

Generate 48 total jobs: 6 animations x 8 directions. Each job is exactly one animation plus one direction. Multiple agents may work at once only when they claim different `job_id` rows and write only files with that row's prefix.

## Base Sprite Preparation

The approved `green_warrior_v2` base has been copied into this folder as the v3 source:

- `assets/characters/green_warrior_v3/warrior_base_v3.png`
- `assets/characters/green_warrior_v3/base/warrior_base_v3_original.png`
- `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`
- `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png`

Use only these `green_warrior_v3` reference assets plus already-approved outputs generated during this v3 pipeline. Do not reference or blend in other character folders during generation.

## Fresh-Source Policy

Each job must create a new raw animation source for its own animation/direction row.

- Do not generate v3 rows by reusing `green_warrior_v2` animation strips, normalized frames, repaired frames, or raw sheets.
- Do not use older generated animation rows as normalization sources.
- The canonical v3 base, the padded v3 seed, and approved v3 outputs may be used as visual references for body proportions, facing direction, palette, costume details, and foot anchoring.
- Current-pipeline reference frames are guides only. They do not replace the required fresh raw strip for the job.
- Attack and special rows must be newly image-generated from the base/reference prompt for the requested action and direction. Do not create action source strips by rotating, skewing, warping, scaling, or drawing over idle/current-pipeline frames.
- If an existing v3 row shows bleed, cutoff, stray sword/effect fragments, alpha haze, or character scale artifacts, regenerate the source strip from scratch instead of only changing padding.
- Record source provenance in QA: list the base/seed/current-pipeline references used and confirm no older animation strip was used as source.

## Creative Animation Policy

Generated animations must be expressive production animation, not static reference frames with moving overlays.

- Attack and special rows need clear body acting: anticipation, crouch or coil, launch/lunge, contact, follow-through, and recovery.
- Attack and special body poses must be newly drawn/generated, not procedural transforms of idle poses.
- The character body should visibly move: torso lean/twist, head and shoulder change, sword-arm action, scarf response, foot/weight shift, and recovery.
- Effects must reinforce the motion. Do not let sword arcs, glows, or particles be the only moving part.
- Use the approved current-pipeline references to preserve identity and proportions, but allow dynamic pose variation. The row should read as animated at game scale.
- Reject rows that look idle, stiff, or like a pasted effect over a standing pose.
- Reject rows that show rotated, skewed, stretched, or otherwise mechanically transformed idle/current-pipeline frames instead of newly generated action poses.

## Job Queue

Use `assets/characters/green_warrior_v3/animation_queue.csv`.

Allowed statuses:

- `pending`
- `in_progress`
- `needs_revision`
- `approved`
- `rejected`

Every `in_progress` row must include an owner note in `qa_notes`, for example: `Owner: Codex thread <name>; claimed: 2026-04-26 10:30 CT; scope: walk_down only`.

## Direction And Animation Order

Directions: `down`, `down_right`, `right`, `up_right`, `up`, `up_left`, `left`, `down_left`.

Animations:

- `idle`: 5 frames
- `walk`: 8 frames
- `sprint`: 8 frames
- `dodge`: 5 frames
- `attack`: 8 frames
- `special`: 8 frames

## Frame Profiles

Use `assets/characters/green_warrior_v3/frame_profiles.csv` as the profile source of truth.

- Default profile: `128x128`, anchor `{ x: 64, y: 120 }`. Use for `idle`, `walk`, `sprint`, and `dodge`.
- Expanded action profile: `384x384`, anchor `{ x: 192, y: 376 }`. Use for `attack` and `special`; this oversized square canvas is mandatory so weapon arcs, impact flashes, detached effect islands, special effects, and the full sprite silhouette have clear room inside each final frame.
- Action scale policy: use one fixed character/source scale across the whole action animation. Do not shrink individual frames to fit larger sword arcs or effects; the expanded canvas and gutters must absorb those extremes.

All frames in one job must share one profile. Do not mix 128 and expanded frames inside the same animation/direction row.

## Padding And Bleed Prevention

Bleed prevention is mandatory.

- The initial image-generated source strip must leave at least one full frame of empty flat `#ff00ff` space between the visible bounding boxes of neighboring poses before any chroma cleanup, segmentation, repack, or normalization.
- Minimum initial source-strip spacing is `128px` for default `128x128` rows and `384px` for expanded `384x384` attack/special rows.
- Prompt for at least two full frame-widths of flat `#ff00ff` gutter between neighboring poses: `256px` for 128-wide rows and `3072px` for expanded action rows.
- No body part, sword, scarf, shadow, glow, particle, loose pixel cluster, or alpha haze may cross into another pose's gutter.
- After chroma removal, segment the full strip by alpha component groups before cropping. Do not begin with `image_width / frame_count` slicing.
- Repack each grouped pose into dynamic transparent slots with generous padding: `slot_w = max(max_group_width + 512, ceil(original_width / frame_count) + 384)` for default rows; use at least `max(max_group_width + 3072, ceil(original_width / frame_count) + 2048)` for expanded action rows.
- Reject or regenerate any strip where standard, 4x, or focused QA previews show vertical slivers, sword fragments, effect haze, or neighboring-frame bleed.

## Per-Job Workflow

1. Re-read `animation_queue.csv`.
2. Claim one `pending` or explicitly released `needs_revision` row.
3. Set only that row to `in_progress` and add an owner note.
4. Confirm the active `animation`, `direction`, `frame_count`, and frame profile.
5. Select references from the v3 base/seed and any approved current-pipeline frames needed for consistency.
6. Generate one fresh full horizontal source strip for that job only. For attack and special rows, prompt the image generator with the requested `<animation> + <direction>` and require newly drawn poses.
7. Save raw/chromakey files under `assets/characters/green_warrior_v3/<animation>/raw/` using the `job_id` prefix.
8. Remove chroma key, group alpha components into poses, repack with wide transparent gutters, then normalize to the selected profile.
9. Save frames under `assets/characters/green_warrior_v3/<animation>/frames/<job_id>_01.png` through the final frame.
10. Render standard, 4x, and focused weapon/no-shield QA preview PNGs.
11. Render one looping review GIF under `assets/characters/green_warrior_v3/<animation>/gif/<job_id>.gif`.
12. Write `assets/characters/green_warrior_v3/<animation>/qa/<job_id>_qa.md`.
13. Mark the queue row `approved`, `needs_revision`, or `rejected` with a specific QA note.

## QA Gates

- Frame size matches the selected profile exactly.
- Visible character has meaningful transparent padding and does not touch frame bounds. Default rows target at least `12px` top/side padding and `8px` floor padding; expanded action rows target at least `96px` top/side padding and `8px` floor padding.
- Attack and special rows have explicit side-padding and no-cropping checks for sword arcs and effects.
- Initial generated source strips pass the full-frame spacing check before repack: at least `128px` empty space between visible poses for default rows, or `384px` for expanded action rows.
- Attack and special rows must pass a scale-consistency check: the character body should remain visually stable across all frames even when the action effect grows larger.
- Attack and special rows must pass a creative motion check: the body pose changes clearly across anticipation, contact, follow-through, and recovery, and does not read as idle.
- Attack and special rows must pass a source-authenticity check: the body poses are newly generated action drawings, not procedural rotations/warps of idle frames.
- QA confirms the raw source was freshly generated for this job and did not reuse an older animation strip as source.
- Transparent background is preserved after chroma cleanup.
- Facing direction is correct.
- Feet/ground contact stays aligned to the selected anchor.
- Sword remains visibly held in the character's right hand in every frame.
- Left hand remains empty in every frame; no shield, buckler, off-hand weapon, or held object.
- No scenery, labels, UI, poster composition, or unrelated objects.
- Standard and enlarged previews show clean gutters between frames.
- The job has a looping direction GIF in `assets/characters/green_warrior_v3/<animation>/gif/<job_id>.gif`.
- Looping animations loop cleanly: `idle`, `walk`, and `sprint`.
- One-shot animations have clear anticipation/contact/recovery: `dodge`, `attack`, and `special`.
