# General 2D Sprite Animation Pipeline

Use this template for characters, monsters, bosses, NPCs, and other 2D animated subjects.

## Required Source

Every pipeline requires a base image.

- The base image is the source of truth for identity, silhouette, palette, proportions, body shape, outfit, anatomy, and default items.
- Character item, clothing, skin, hair, fur, scale, armor, and equipment colors must remain consistent with the base image unless the user explicitly specifies a color change.
- If the base image is missing, stop and ask for it before generating animations.
- Do not use other characters, monsters, older animation sheets, or unrelated asset folders as source material unless the user explicitly approves that reference.

## Intake Questions

Ask these questions before starting a new animation pass.

Only question 1 is required. Use the defaults below for blank answers to questions 2 through 5.

1. What animation do you want to work on?
2. Do you have any direction on how the animation should look?
3. Is there a number of frames you'd like the animation to be?
4. Do you want 8 directional or 4 directional set of animations?
5. Are there any required items/weapons the character should have on them or in their hands?

## Defaults

Animation direction/default style:

- Use readable production animation at game scale.
- Body motion should be clear and purposeful.
- Do not create a static pose with effects pasted on top.
- For action animations, include anticipation, contact/action, follow-through, and recovery.

Frame counts:

- `idle`: 5 frames
- `walk`: 8 frames
- `run` or `sprint`: 8 frames
- `dodge`, `hurt`, `block`, `interact`: 5 frames
- `attack`, `cast`, `special`, `skill`: 8 frames
- `death`: 8 frames
- Unknown animation: 8 frames unless the user specifies otherwise

Direction set:

- Default is 8-directional.
- 8-direction order: `down`, `down_right`, `right`, `up_right`, `up`, `up_left`, `left`, `down_left`.
- 4-direction order: `down`, `right`, `up`, `left`.

Items/equipment:

- Default: preserve items, weapons, clothing, props, horns, tails, wings, armor, or held objects visible in the base image.
- Preserve base-image colors for items, clothing, skin, hair, fur, scales, armor, and equipment unless the user specifically asks for a color change.
- Do not add new weapons, shields, items, or props unless the user asks for them.
- For monsters or creatures without hands, interpret this as required visible body features or carried/attached objects.

## Frame Profiles

Use `frame_profiles.csv` as the starting point.

- Default gameplay profile: `128x128`, anchor `{ x: 64, y: 120 }`.
- Expanded action profile: `384x384`, anchor `{ x: 192, y: 376 }`.

Use the expanded action profile for large attacks, spells, special effects, long weapons, wings, tails, leaps, or any animation where the full silhouette needs more room.

## Source Strip Rules

Generate one full horizontal source strip for one animation/direction job.

- Generate the strip from the base image and the current prompt, not by rotating, warping, scaling, or drawing over an existing animation frame.
- Keep all poses on a flat `#ff00ff` chroma-key background or transparent background.
- The initial generated strip must leave at least one full frame of empty flat `#ff00ff` space between neighboring visible pose bounds before cleanup, segmentation, repack, or normalization.
- Full-frame spacing means at least `128px` for default `128x128` rows and at least `384px` for expanded `384x384` rows.
- No body part, weapon, tail, wing, scarf, glow, slash, shadow, particle, alpha haze, or loose pixels may enter a neighboring pose lane.

If source poses overlap or effects bridge pose lanes, reject and regenerate the source. Do not try to salvage visibly contaminated sources by equal-slot slicing.

## Normalization Rules

- Remove chroma key or preserve alpha.
- Segment by visible pose groups after cleanup before cropping.
- Repack poses into wide transparent slots.
- Normalize all frames in one job to one shared frame profile.
- Use one shared scale across the whole job.
- Align frames to one shared anchor, usually bottom-center.
- Do not shrink individual frames to fit effects. Use a larger frame profile instead.

## Directory Layout

Each animation should use this structure:

```text
<animation>/
  raw/        generated strips, chromakey sources, edit canvases, grouped/repacked intermediates
  frames/     normalized final frames named <job_id>_01.png, <job_id>_02.png, ...
  preview/    preview PNGs, 4x previews, focused QA sheets, overlays
  gif/        one looping GIF per direction/job named <job_id>.gif
  qa/         per-job QA notes
  assembled/  full sheets and metadata after all directions are approved
```

Do not assemble a full animation sheet while any direction for that animation is still `in_progress` or `needs_revision`.

## QA Gates

Before approval, confirm:

- The base image was used as the required source reference.
- The row was generated as the requested animation plus direction.
- The frame count matches the requested or default frame count.
- The direction is correct in every frame, including recovery frames.
- The body or creature anatomy visibly moves; it is not a static base pose with effects pasted on top.
- Character item, clothing, skin, hair, fur, scale, armor, and equipment colors stay consistent with the base image unless the user specified changes.
- Required items/weapons/features are present, and unrequested items were not added.
- Initial source strip spacing passes the full-frame spacing gate.
- Final frames match the selected profile exactly.
- Transparent background is preserved.
- No final-frame edge contact or cropped effects.
- No inter-frame bleed in standard, enlarged, focused, or GIF previews.
- A looping GIF exists in `<animation>/gif/<job_id>.gif`.

## Assembly

Only assemble full sheets after all required directions for the animation are approved.

For 8-direction sheets, use row order:

```text
down
down_right
right
up_right
up
up_left
left
down_left
```

For 4-direction sheets, use row order:

```text
down
right
up
left
```
