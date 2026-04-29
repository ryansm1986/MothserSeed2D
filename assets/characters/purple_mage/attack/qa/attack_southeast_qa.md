# Purple Mage Attack QA - southeast

- Frames: 6
- Frame size: 128x128
- Background: transparent frames / green preview only
- Re-extraction: full pose bounds from wide source strip to preserve thin staff shaft and blue tip effect
- Source strip: `D:\projects\MotherSeed2D\assets\characters\purple_mage\generated\southeast_attack_staff_tip_blue_source_strip_6f.png`
- Raw source runs: [(133, 303), (826, 1118), (1641, 1992), (2516, 2876), (3399, 3593), (4116, 4286)]
- Frame bboxes: [(37, 27, 91, 125), (17, 43, 110, 125), (8, 49, 119, 125), (7, 47, 121, 125), (33, 39, 95, 125), (37, 27, 91, 125)]

Review points:
- Staff remains continuous and visible through the pointing frames.
- Tip has the blue effect only during the pointing beat and no projectile/spell trail is added.
- Character returns to neutral by frame 6.
