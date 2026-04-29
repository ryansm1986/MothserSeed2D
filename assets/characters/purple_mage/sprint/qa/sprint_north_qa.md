# sprint_north QA

- Source strip: `assets/characters/purple_mage/sprint/raw/sprint_north_8frame_staff_right_hand_green_strip.png`
- Alpha strip: `assets/characters/purple_mage/sprint/raw/sprint_north_raw.png`
- Normalized strip: `assets/characters/purple_mage/sprint/raw/sprint_north_normalized_strip.png`
- Normalized frames: `assets/characters/purple_mage/sprint/frames/sprint_north_01.png` through `sprint_north_08.png`
- Preview: `assets/characters/purple_mage/sprint/preview/sprint_north_preview.png`
- 4x preview: `assets/characters/purple_mage/sprint/preview/sprint_north_preview_4x.png`
- Green 4x preview: `assets/characters/purple_mage/sprint/preview/sprint_north_green_preview_4x.png`
- GIF: `assets/characters/purple_mage/sprint/gif/sprint_north.gif`
- Mapped base source(s): `assets/characters/purple_mage/base/north.png`
- Local tool: `assets/characters/purple_mage/sprint/tools/sprint_normalize_strip.py`

Checks performed:

- Eight north-facing sprint frames exported at 128x128 RGBA.
- Source was segmented by eight visible sprite groups because generated strips may not use exact equal-width slots.
- Staff remains in the character's right hand side across the cycle.
- Sprint cadence follows alternating contact, compression, drive, and airborne beats.
- Shared max crop scale and bottom anchor used for stable frame registration.
- Green chroma background removed from normalized frames, then edge despill and premultiplied-alpha resizing were applied to prevent green fringe pixels on sprite edges.
