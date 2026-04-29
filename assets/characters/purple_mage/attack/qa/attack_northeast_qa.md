# Purple Mage Attack QA - northeast

- Frames: 6
- Frame size: 128x128
- Background: transparent frames / green preview only
- Re-extraction: full pose bounds from wide source strip to preserve thin staff shaft and blue tip effect
- Source strip: `D:\projects\MotherSeed2D\assets\characters\purple_mage\generated\northeast_attack_staff_tip_blue_source_strip_6f.png`
- Raw source runs: [(133, 291), (814, 1084), (1607, 1946), (2470, 2793), (3316, 3517), (4040, 4199)]
- Frame bboxes: [(37, 17, 91, 125), (18, 38, 109, 125), (7, 31, 121, 125), (9, 25, 118, 125), (30, 17, 98, 125), (37, 17, 91, 125)]

Review points:
- Staff remains continuous and visible through the pointing frames.
- Tip has the blue effect only during the pointing beat and no projectile/spell trail is added.
- Character returns to neutral by frame 6.
