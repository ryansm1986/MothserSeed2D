# idle_south Pose Plan

Use `$game-studio:sprite-pipeline`.

Job: `idle_south`
Animation: `idle`
Direction: `south`
Frame count: `5`
Subject: `moss_golem_v2`, monster, large
Frame profile: `monster_large_384`
Mapped base source: `assets/monsters/moss_golem_v2/base/south.png`

1. Grounded neutral stance: feet planted, heavy shoulders low, head facing south, arms hanging with a slight forward bend, chest core steady.
2. Slow inhale: torso rises a few pixels, shoulders lift outward, moss over the brow and shoulders lifts subtly, hands loosen and separate slightly from the legs.
3. Weight settles left: head dips a little, left shoulder and arm sink, right arm counters upward, chest core glow pulses slightly brighter without adding new effects.
4. Weight rolls right: torso shifts back toward center and a little right, right shoulder lowers, left fist relaxes, moss strands sway back down.
5. Return loop pose: body settles close to frame 1 but not identical, chest and head finish a small exhale, arms return with a softer bend for a smooth loop.

Source strip requirement: one horizontal `idle_south` strip only, exactly 5 distinct newly drawn south-facing poses, flat `#ff00ff` background, at least 384 px empty `#ff00ff` gutter between neighboring visible pose bounds before cleanup or normalization.
