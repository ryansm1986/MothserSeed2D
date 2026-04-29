# walk_northeast QA

- Source strip: `assets/characters/purple_mage/walk/raw/walk_northeast_6frame_staff_right_hand_green_strip.png`
- Alpha strip: `assets/characters/purple_mage/walk/raw/walk_northeast_raw.png`
- Normalized strip: `assets/characters/purple_mage/walk/raw/walk_northeast_normalized_strip.png`
- Normalized frames: `assets/characters/purple_mage/walk/frames/walk_northeast_01.png` through `walk_northeast_06.png`
- Preview: `assets/characters/purple_mage/walk/preview/walk_northeast_preview.png`
- 4x preview: `assets/characters/purple_mage/walk/preview/walk_northeast_preview_4x.png`
- Green 4x preview: `assets/characters/purple_mage/walk/preview/walk_northeast_green_preview_4x.png`
- GIF: `assets/characters/purple_mage/walk/gif/walk_northeast.gif`
- Mapped base source(s): `assets/characters/purple_mage/base/north.png;assets/characters/purple_mage/base/east.png`
- Local tool: `assets/characters/purple_mage/walk/tools/walk_normalize_strip.py`

Checks performed:

- Six northeast-facing frames exported at 128x128 RGBA.
- Source was segmented by six visible sprite groups because generated strips may not use exact equal-width slots.
- Staff remains in the character's right hand side across the cycle.
- Foot cadence follows alternating walk beats: right/near foot forward, both feet middle, left/far foot forward, both feet middle, right/near foot forward, both feet middle.
- Shared max crop scale and bottom anchor used for stable frame registration.
- Green chroma background removed from normalized frames, then edge despill and premultiplied-alpha resizing were applied to prevent green fringe pixels on sprite edges.
