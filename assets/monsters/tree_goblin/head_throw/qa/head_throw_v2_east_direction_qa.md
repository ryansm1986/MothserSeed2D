# head_throw_v2 east QA

Status: approved

Queue row: `head_throw_v2_east`

Direction: `east`

Frame count: 8

Frame profile: `expanded_action_384`

Outputs:

- Generated raw strip: `assets/monsters/tree_goblin/head_throw_v2/raw/head_throw_v2_east_raw.png`
- Spaced source strip: `assets/monsters/tree_goblin/head_throw_v2/raw/head_throw_v2_east_raw_spaced_768px.png`
- Normalized frames: `assets/monsters/tree_goblin/head_throw_v2/frames/east/`
- Preview: `assets/monsters/tree_goblin/head_throw_v2/preview/head_throw_v2_east_preview.png`
- GIF: `assets/monsters/tree_goblin/head_throw_v2/gif/head_throw_v2_east.gif`
- Local tool: `assets/monsters/tree_goblin/head_throw_v2/tools/head_throw_v2_normalize_direction.py`
- Metrics: `assets/monsters/tree_goblin/head_throw_v2/qa/head_throw_v2_east_normalization_metrics.txt`

QA notes:

- Only the active `east` direction was generated and processed.
- Eight distinct east-facing head throw poses are present.
- Frame 5 is the intentional no-head beat after the throw and before the catch.
- Spaced source strip uses enforced 768px gutters between pose envelopes.
- Normalized frames are anchored bottom-center into 384x384 transparent frames.
- Chroma-key despill cleanup matches the approved south cleanup pass.
