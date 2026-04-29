# idle_west QA

Status: approved

Source reference: `assets/monsters/moss_golem_v2/base/west.png`

Generated with the local `generate2dsprite` workflow using the visible moss golem reference. The raw image is preserved at `idle/raw/idle_west_generated_raw.png`; the expanded processing source is `idle/raw/idle_west_raw.png`.

Checks:
- Exactly 5 detected west-facing poses.
- Expanded source gutters pass at 384 px between neighboring pose bounds.
- Normalized to the large monster idle profile: 384x384 frames, anchor x=192, y=360.
- Output GIF created at `idle/gif/idle_west.gif`.
- Preview, 4x preview, and focused QA strip created under `idle/preview/`.

Notes:
- The row keeps the west profile silhouette, moss cloak, stone plates, vine wraps, green eye, and visible chest core.
- Motion is a subtle idle loop: inhale rise, forward weight settle, rollback, and soft return.
