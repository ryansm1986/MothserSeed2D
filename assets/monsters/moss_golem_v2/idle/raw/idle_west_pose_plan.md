# idle_west Pose Plan

Use `$game-studio:sprite-pipeline`.

Job: `idle_west`
Animation: `idle`
Direction: `west`
Frame count: `5`
Subject: `moss_golem_v2`, monster, large
Frame profile: `monster_large_384`
Mapped base source: `assets/monsters/moss_golem_v2/base/west.png`

1. Grounded west-facing neutral stance with feet planted, forward arm heavy, rear arm visible behind, head angled west, chest core steady if visible.
2. Slow inhale: torso rises slightly, shoulders broaden, moss lifts along the back and shoulder line, hands loosen.
3. Weight settles forward: head dips, front shoulder and fist lower, rear arm counters subtly, glow and moss motion remain contained.
4. Weight rolls back: torso shifts to the rear foot, front arm relaxes upward, moss strands sway back down.
5. Return loop pose close to frame 1 but not identical, with a soft exhale and a settled heavy stance.

Source strip requirement: one horizontal `idle_west` strip only, exactly 5 distinct newly drawn west-facing poses, flat `#ff00ff` background, at least 384 px empty `#ff00ff` gutter between neighboring visible pose bounds before normalization.
