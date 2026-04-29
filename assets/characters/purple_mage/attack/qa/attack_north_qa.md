# attack_north QA

- Source strip: `assets/characters/purple_mage/attack/raw/attack_north_6frame_staff_tip_blue_green_strip.png`
- Alpha strip: `assets/characters/purple_mage/attack/raw/attack_north_raw.png`
- Normalized strip: `assets/characters/purple_mage/attack/raw/attack_north_normalized_strip.png`
- Normalized frames: `assets/characters/purple_mage/attack/frames/attack_north_01.png` through `attack_north_06.png`
- Preview: `assets/characters/purple_mage/attack/preview/attack_north_preview.png`
- 4x preview: `assets/characters/purple_mage/attack/preview/attack_north_preview_4x.png`
- Green 4x preview: `assets/characters/purple_mage/attack/preview/attack_north_green_preview_4x.png`
- GIF: `assets/characters/purple_mage/attack/gif/attack_north.gif`
- Mapped base source(s): `assets/characters/purple_mage/base/north.png`
- Local tool: `assets/characters/purple_mage/attack/tools/attack_normalize_strip.py`

Checks performed:

- Six north-facing staff attack frames exported at 128x128 RGBA.
- Staff lowers to about hip height, blue effect appears only at the staff tip, then disappears before the return pose.
- No projectile, loose spell bolt, scenery, labels, or extra external spell effects are intended in this animation.
- Shared max crop scale and bottom anchor used for stable frame registration.
- Green chroma background removed from normalized frames, then edge despill and premultiplied-alpha resizing were applied to prevent green fringe pixels on sprite edges.
