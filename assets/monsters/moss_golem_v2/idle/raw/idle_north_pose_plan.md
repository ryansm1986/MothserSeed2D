# idle_north Pose Plan

Use `$game-studio:sprite-pipeline`.

Job: `idle_north`
Animation: `idle`
Direction: `north`
Frame count: `5`
Subject: `moss_golem_v2`, monster, large
Frame profile: `monster_large_384`
Mapped base source: `assets/monsters/moss_golem_v2/base/north.png`

1. Grounded north-facing neutral stance with broad moss-covered back, feet planted, heavy arms low at the sides.
2. Slow inhale: back and shoulders rise slightly, moss lifts along the upper ridge, arms ease outward.
3. Weight settles left: back tilts, left shoulder lowers, right arm counters subtly, moss drapes shift.
4. Weight rolls right: torso passes through center, right shoulder lowers, left arm relaxes back down.
5. Return loop pose close to frame 1 but not identical, with a soft exhale and settled back mass.

Source strip requirement: one horizontal `idle_north` strip only, exactly 5 distinct newly drawn north-facing poses, flat `#ff00ff` background, at least 384 px empty `#ff00ff` gutter between neighboring visible pose bounds before normalization.
