# walk_east QA

- Source strip: `assets/characters/purple_mage/walk/raw/walk_east_6frame_staff_right_hand_green_strip.png`
- Alpha strip: `assets/characters/purple_mage/walk/raw/walk_east_raw.png`
- Normalized strip: `assets/characters/purple_mage/walk/raw/walk_east_normalized_strip.png`
- Normalized frames: `assets/characters/purple_mage/walk/frames/walk_east_01.png` through `walk_east_06.png`
- Preview: `assets/characters/purple_mage/walk/preview/walk_east_preview.png`
- 4x preview: `assets/characters/purple_mage/walk/preview/walk_east_preview_4x.png`
- Green 4x preview: `assets/characters/purple_mage/walk/preview/walk_east_green_preview_4x.png`
- GIF: `assets/characters/purple_mage/walk/gif/walk_east.gif`

Checks performed:

- Six east-facing frames exported at 128x128 RGBA.
- Source was segmented by six visible sprite groups because the generated strip did not use exact equal-width slots.
- Staff remains in the character's right hand side across the cycle.
- Foot cadence follows: right foot forward, both feet middle, left foot forward, both feet middle, right foot forward, both feet middle.
- Shared max crop scale and bottom anchor used for stable frame registration.
- Green chroma background removed from normalized frames, then edge despill and premultiplied-alpha resizing were applied to prevent green fringe pixels on sprite edges.
