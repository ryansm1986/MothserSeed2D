# Moonfall Animation QA

- Required skill: `$game-studio:sprite-pipeline`
- Source strip: `assets/characters/purple_mage/spells/moonfall/raw/moonfall_imagegen_strip_green.png`
- Frame count: 8
- Frame size: 1024x1024
- Final strip: `assets/characters/purple_mage/spells/moonfall/moonfall_strip.png`
- Runtime frames: `assets/characters/purple_mage/spells/moonfall/frames/moonfall_01.png` through `moonfall_08.png`
- Preview: `assets/characters/purple_mage/spells/moonfall/preview/moonfall_preview.png`
- GIF: `assets/characters/purple_mage/spells/moonfall/gif/moonfall_anim.gif`

## Checks

- The source is a single imagegen strip, not independently generated frames.
- The eight frames read as portal opening, moon emerging, moon descending, impact, and recovery.
- Frames were edge-cleaned to remove generated slot dividers.
- Transparent frames preserve a shared 1024x1024 canvas for stable in-game anchoring.
- Matching green-screen copies are available under `frames_green/` for compatibility with older chroma-key loaders.
- Existing `moonfall.png` was preserved as the original single-frame reference.
