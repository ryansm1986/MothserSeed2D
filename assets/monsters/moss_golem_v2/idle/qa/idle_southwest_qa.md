# idle_southwest QA

Status: approved

Source references: `assets/monsters/moss_golem_v2/base/south.png`, `assets/monsters/moss_golem_v2/base/west.png`

Generated with the local `generate2dsprite` workflow using the visible moss golem references. The raw image is preserved at `idle/raw/idle_southwest_generated_raw.png`; the expanded processing source is `idle/raw/idle_southwest_raw.png`.

Checks:
- Exactly 5 detected southwest-facing poses.
- Expanded source gutters pass at 384 px between neighboring pose bounds.
- Normalized to the large monster idle profile: 384x384 frames, anchor x=192, y=360.
- Output GIF created at `idle/gif/idle_southwest.gif`.
- Preview, 4x preview, and focused QA strip created under `idle/preview/`.

Notes:
- The row keeps the bulky moss-over-stone silhouette, glowing eyes, chest core, vine wraps, and tan-gray/green palette from the source.
- Motion is a subtle idle loop: inhale rise, near-leg weight settle, rollback, and soft return.
