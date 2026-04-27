# idle_northwest Pose Plan

Use `$game-studio:sprite-pipeline`.

Job: `idle_northwest`
Animation: `idle`
Direction: `northwest`
Frame count: `5`
Subject: `moss_golem_v2`, monster, large
Frame profile: `monster_large_384`
Mapped base sources: `assets/monsters/moss_golem_v2/base/north.png`, `assets/monsters/moss_golem_v2/base/west.png`

1. Grounded northwest-facing neutral stance showing the back/side mass, heavy arms low, head turned northwest, moss blanket steady.
2. Slow inhale: upper back rises slightly, near shoulder lifts, rear moss ridges lift and separate subtly.
3. Weight settles onto the near leg: head dips, near arm sinks, far arm counters, back moss shifts with the torso.
4. Weight rolls back toward center: torso eases to the far side, shoulders reverse their height, moss strands settle.
5. Return loop pose close to frame 1 but not identical, with a small exhale and relaxed arm bend.

Source strip requirement: one horizontal `idle_northwest` strip only, exactly 5 distinct newly drawn northwest-facing poses, flat `#ff00ff` background, at least 384 px empty `#ff00ff` gutter between neighboring visible pose bounds before normalization.
