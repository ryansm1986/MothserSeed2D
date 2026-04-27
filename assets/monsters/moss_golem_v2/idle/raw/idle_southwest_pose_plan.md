# idle_southwest Pose Plan

Use `$game-studio:sprite-pipeline`.

Job: `idle_southwest`
Animation: `idle`
Direction: `southwest`
Frame count: `5`
Subject: `moss_golem_v2`, monster, large
Frame profile: `monster_large_384`
Mapped base sources: `assets/monsters/moss_golem_v2/base/south.png`, `assets/monsters/moss_golem_v2/base/west.png`

1. Grounded southwest-facing neutral stance with planted feet, heavy shoulders low, arms hanging with a slight forward bend, chest core steady.
2. Slow inhale: torso rises slightly, near shoulder lifts, far shoulder follows, moss over brow and shoulders lifts subtly.
3. Weight settles onto the near leg: head dips, near arm sinks, far arm counters upward, chest core pulses a touch brighter.
4. Weight rolls back toward center and slightly to the far leg: torso eases leftward in perspective, near fist relaxes, moss strands settle.
5. Return loop pose close to frame 1 but not identical, with a soft exhale and arms returning to a relaxed bend.

Source strip requirement: one horizontal `idle_southwest` strip only, exactly 5 distinct newly drawn southwest-facing poses, flat `#ff00ff` background, at least 384 px empty `#ff00ff` gutter between neighboring visible pose bounds before normalization.
