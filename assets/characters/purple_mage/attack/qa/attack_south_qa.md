# attack_south QA

- Source strip: `assets/characters/purple_mage/attack/raw/attack_south_6frame_staff_tip_blue_green_strip.png`
- Alpha strip: `assets/characters/purple_mage/attack/raw/attack_south_raw.png`
- Normalized strip: `assets/characters/purple_mage/attack/raw/attack_south_normalized_strip.png`
- Normalized frames: `assets/characters/purple_mage/attack/frames/attack_south_01.png` through `attack_south_06.png`
- Preview: `assets/characters/purple_mage/attack/preview/attack_south_preview.png`
- 4x preview: `assets/characters/purple_mage/attack/preview/attack_south_preview_4x.png`
- Green 4x preview: `assets/characters/purple_mage/attack/preview/attack_south_green_preview_4x.png`
- GIF: `assets/characters/purple_mage/attack/gif/attack_south.gif`
- Mapped base source(s): `assets/characters/purple_mage/base/south.png`
- Local tool: `assets/characters/purple_mage/attack/tools/attack_normalize_strip.py`

Checks performed:

- Six south-facing staff attack frames exported at 128x128 RGBA.
- Staff lowers to about hip height, blue effect appears only at the staff tip, then disappears before the return pose.
- No projectile, loose spell bolt, scenery, labels, or extra external spell effects are intended in this animation.
- Shared max crop scale and bottom anchor used for stable frame registration.
- Green chroma background removed from normalized frames, then edge despill and premultiplied-alpha resizing were applied to prevent green fringe pixels on sprite edges.
