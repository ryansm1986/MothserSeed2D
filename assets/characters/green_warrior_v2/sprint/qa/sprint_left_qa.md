# sprint_left QA

Job: `sprint_left`
Animation: `sprint`
Direction: `left`
Frames: 12

## Source

- Canonical base/reference: `assets/characters/green_warrior_v2/base/warrior_base_v2_transparent.png`
- Edit canvas: `assets/characters/green_warrior_v2/sprint/raw/sprint_left_edit_canvas.png`
- Chroma-key strip: `assets/characters/green_warrior_v2/sprint/raw/sprint_left_chromakey.png`
- Transparent raw strip: `assets/characters/green_warrior_v2/sprint/raw/sprint_left_raw.png`

The previous sprint preview was used only as motion inspiration. The generated strip was anchored to the canonical `green_warrior_v2` base/reference.

## Mechanical QA

- Frame count: pass, 12 frames.
- Frame dimensions: pass, every normalized frame is 64x64.
- Transparency: pass, chroma key removed and normalized frames retain alpha.
- Magenta residue: pass, no visible magenta-like pixels detected in normalized frames.
- Alpha content: pass, every frame has non-empty sprite pixels.
- Crop check: pass, top and side padding are present after margin normalization; feet are bottom-aligned for the shared anchor.

## Visual QA

- Direction: pass, left-facing sprint.
- Character consistency: pass, green hair, green tunic, brown armor, boots, gloves, and gold scarf remain in the same palette family.
- Sprint read: pass, strong forward lean with pumping legs and trailing scarf.
- Weapon: pass, sword is visibly held in the character's right hand in every frame.
- Left hand: pass, left hand remains empty; no shield, buckler, off-hand weapon, or held object.
- Background/content: pass, no scenery, labels, UI, poster layout, watermark, or unrelated objects.

## Preview Outputs

- Standard preview: `assets/characters/green_warrior_v2/sprint/preview/sprint_left_preview.png`
- 4x preview: `assets/characters/green_warrior_v2/sprint/preview/sprint_left_preview_4x.png`
- Focused weapon/no-shield QA preview: `assets/characters/green_warrior_v2/sprint/preview/sprint_left_weapon_no_shield_check_8x.png`

## Bleed Repair

- Reprocessed on 2026-04-26 after sprint preview bleed feedback.
- Rebuilt the transparent raw strip from full-strip alpha component masks instead of equal-width slicing.
- Repacked with wide transparent gutters before normalization; the 4x preview no longer shows neighboring-frame body, sword, or scarf slivers.
- Source strip contained 11 isolated primary poses, so one pose was repeated to preserve the required 12 normalized frames.
