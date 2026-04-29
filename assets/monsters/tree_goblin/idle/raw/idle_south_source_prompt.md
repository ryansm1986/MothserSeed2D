Use `$game-studio:sprite-pipeline`.

Generate exactly one fresh horizontal source strip for exactly one animation and one direction: `idle/south`.

Required source reference: `D:\projects\MotherSeed2D\assets\monsters\tree_goblin\base\south.png`.

Subject: `tree_goblin`, a default-size monster. Preserve the south-facing base identity, silhouette family, branch/head structure, bark/leaf palette, proportions, visible features, and any base-set details. Do not add weapons, shields, props, extra limbs, extra heads, unrelated items, scenery, labels, UI, poster framing, comparison panels, turnarounds, extra directions, or multiple rows.

Create a 5-frame idle animation strip on a flat `#ff00ff` chroma-key background or transparent background. The image must be one single horizontal strip, `south` direction only, with exactly 5 frame lanes.

Use an extra-wide horizontal canvas with very large empty distance between every frame lane. Do not make a compact strip. Leave at least `384px` of empty flat `#ff00ff` or transparent space between neighboring visible pose bounds before cleanup, slicing, repack, or normalization, and prefer `768px` or more when possible. This includes the `default_128` profile spacing plus the user-requested additional `128px` padding, with extra width added to help preserve the original monster identity and silhouette. Prefer a much wider horizontal canvas over smaller or simplified poses when spacing is tight. If spacing is tight, make the source canvas and gutters wider; do not shrink the monster, reduce animation scale, crop branch tips, simplify the branch-heavy silhouette, or make the poses smaller.

Keep the monster at its selected default gameplay scale. Extra canvas width and frame-lane width are for empty gutters, identity preservation, and motion safety only. Do not enlarge the monster to fill the extra-wide canvas, frame lane, or empty space. Leave plenty of flat `#ff00ff` or transparent space around every pose.

Every frame slot must be a distinct newly drawn animation pose with visible body, head, and branch motion. Do not duplicate, near-duplicate, shift, rotate, scale, smear, or paste effects over the same body pose. The idle should be subtle but readable at game scale: standing, grounded, with branch and head movement and a tiny breathing/weight rhythm.

Numbered frame-by-frame pose plan:

1. Grounded front-facing idle base pose; roots planted, head centered, branches at their neutral spread.
2. Subtle inhale and lift; head rises a few pixels, branch tips flex upward, upper trunk expands slightly while roots stay planted.
3. Gentle sway to screen-left; head and crown tilt slightly, one branch lags behind, bark silhouette changes visibly without changing identity.
4. Exhale and settle; head dips, shoulders/branch joints lower, tiny leaf/branch motion trails back toward neutral.
5. Gentle sway to screen-right and return-ready pose; crown and head counter-sway with distinct branch positions, ending close enough to frame 1 for a smooth loop without duplicating it.

Output only the one horizontal strip for `idle/south`.
