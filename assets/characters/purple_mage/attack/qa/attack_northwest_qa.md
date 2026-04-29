# Purple Mage Attack QA - northwest

- Frames: 6
- Frame size: 128x128
- Background: transparent frames / green preview only
- Re-extraction: full pose bounds from wide source strip to preserve thin staff shaft and blue tip effect
- Source strip: `D:\projects\MotherSeed2D\assets\characters\purple_mage\generated\northwest_attack_staff_tip_blue_source_strip_6f.png`
- Raw source runs: [(133, 318), (841, 1144), (1667, 1999), (2522, 2861), (3384, 3598), (4121, 4302)]
- Frame bboxes: [(32, 14, 95, 125), (13, 38, 115, 125), (8, 32, 120, 125), (7, 28, 121, 125), (28, 14, 100, 125), (33, 14, 94, 125)]

Review points:
- Staff remains continuous and visible through the pointing frames.
- Tip has the blue effect only during the pointing beat and no projectile/spell trail is added.
- Character returns to neutral by frame 6.
