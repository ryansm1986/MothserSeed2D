# green_warrior_v3 Base Cleanup QA

Status: `ready_for_fresh_run`

## Source Copies

- Source pipeline: `assets/characters/green_warrior_v2`
- Original base copy: `assets/characters/green_warrior_v3/base/warrior_base_v3_original.png`
- Canonical transparent base: `assets/characters/green_warrior_v3/base/warrior_base_v3_transparent.png`
- Padded 128 seed frame: `assets/characters/green_warrior_v3/base/warrior_base_v3_seed_128.png`

## 128 Seed Frame

- Frame size: `128x128`
- Anchor: `{ x: 64, y: 120 }`
- Visible base footprint: about `73x104` pixels
- Placement offset: `{ x: 28, y: 16 }`

The seed intentionally leaves substantial transparent padding on all sides. Treat this as the baseline size target for `idle`, `walk`, `sprint`, and `dodge`; do not enlarge the body until it risks touching frame edges during motion.
