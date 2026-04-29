# walk_south QA

- Source strip: `assets/characters/purple_mage/walk/raw/walk_south_6frame_staff_right_hand_green_strip.png`
- Alpha strip: `assets/characters/purple_mage/walk/raw/walk_south_raw.png`
- Normalized strip: `assets/characters/purple_mage/walk/raw/walk_south_normalized_strip.png`
- Normalized frames: `assets/characters/purple_mage/walk/frames/walk_south_01.png` through `walk_south_06.png`
- Preview: `assets/characters/purple_mage/walk/preview/walk_south_preview.png`
- 4x preview: `assets/characters/purple_mage/walk/preview/walk_south_preview_4x.png`
- Green 4x preview: `assets/characters/purple_mage/walk/preview/walk_south_green_preview_4x.png`
- GIF: `assets/characters/purple_mage/walk/gif/walk_south.gif`
- Mapped base source(s): `assets/characters/purple_mage/base/south.png`
- Local tool: `assets/characters/purple_mage/walk/tools/walk_normalize_strip.py`

Checks performed:

- Six south-facing frames exported at 128x128 RGBA.
- Source was segmented by six visible sprite groups because generated strips may not use exact equal-width slots.
- Staff remains in the character's right hand side across the cycle.
- Foot cadence follows alternating walk beats: right/near foot forward, both feet middle, left/far foot forward, both feet middle, right/near foot forward, both feet middle.
- Shared max crop scale and bottom anchor used for stable frame registration.
- Green chroma background removed from normalized frames, then edge despill and premultiplied-alpha resizing were applied to prevent green fringe pixels on sprite edges.
