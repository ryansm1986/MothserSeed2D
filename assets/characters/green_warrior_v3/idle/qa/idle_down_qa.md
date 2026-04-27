# idle_down QA

Status: approved.

Generated: 2026-04-26 19:37:22 -0500

Animation/direction: `idle` + `down`.

Source provenance: fresh full horizontal idle source strip generated from the visible canonical base reference only: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png` / `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`. No old idle, walk, dodge, sprint, attack, special, v2, repaired strips, normalized historical frames, or other character folder were used as source or visual reference.

Profile: default_128, 5 frames, 128x128, anchor {x:64,y:120}.

QA checks:

- Identity: preserves spiky green hair, brown/gold armor, green cloth panels, sword design, and base v3 proportions.
- Direction: intended `down` for all five frames.
- Stance: simple natural standing stance, feet planted under body with modest spacing; not feet glued together and not a walking stride.
- Weapon/off-hand: sword remains in the character right hand; left hand remains empty; no shield/buckler/off-hand weapon added.
- Motion: subtle idle breathing/settle only, no walking step, attack, or magic effect.
- Height guard: per-frame visible heights [98, 98, 98, 99, 99]; drift 1 px.
- Padding/no-crop: worst normalized padding L/T/R/B = [27, 13, 26, 16]; no alpha touches frame edge.
- Raw gutters: 640px slots, estimated minimum transparent gutter 323 px; no inter-pose alpha bleed remains after repack.
