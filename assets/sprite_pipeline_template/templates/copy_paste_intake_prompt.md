# Copy/Paste Sprite Pipeline Intake Prompt

Use `$game-studio:sprite-pipeline`.

I want to start a reusable 2D sprite animation pipeline for a character or monster.

Project: `<PROJECT_PATH>`
Subject id: `<SUBJECT_ID>`
Base image path: `<BASE_IMAGE_PATH_REQUIRED>`
Destination folder: `<assets/characters/SUBJECT_ID or assets/monsters/SUBJECT_ID>`

The base image is required. If the base image path is missing or the file does not exist, ask me for the base image before starting generation.

Before generating or editing assets, ask me these questions:

1. What animation do you want to work on? Required.
2. Do you have any direction on how the animation should look? Optional. Default: readable production animation with clear body motion, grounded weight, and no static pose with effects pasted on top.
3. Is there a number of frames you'd like the animation to be? Optional. Defaults: idle 5, walk 8, run/sprint 8, dodge/hurt/block/interact 5, attack/cast/special/skill 8, death 8, unknown animation 8.
4. Do you want 8 directional or 4 directional set of animations? Optional. Default: 8 directional. 8 directions are down, down_right, right, up_right, up, up_left, left, down_left. 4 directions are down, right, up, left.
5. Are there any required items/weapons the character should have on them or in their hands? Optional. Default: preserve visible base-image equipment/features and do not add unrequested items. For monsters, treat this as required visible features such as horns, claws, wings, tail, armor, glow, or carried objects.

After I answer:

- Create or update the subject pipeline folder.
- Generate a queue for the selected animation and direction set.
- Use the base image as the required source reference.
- Preserve base-image colors for character items, clothes, skin, hair, fur, scales, armor, and equipment unless I specifically ask for changes.
- Generate one fresh full horizontal source strip per animation/direction job.
- Require at least one full frame of empty flat `#ff00ff` space between neighboring visible pose bounds in the initial generated source strip before cleanup/repack.
- Normalize to the chosen profile using one shared scale and bottom-center anchor.
- Save normalized frames under `<animation>/frames/`.
- Save preview PNGs under `<animation>/preview/`.
- Save one looping GIF per direction under `<animation>/gif/<job_id>.gif`.
- Save QA notes under `<animation>/qa/`.
- Do not approve rows with frame-edge contact, inter-frame bleed, wrong direction, color drift, missing required items/features, unrequested items, or static body motion.
