# head_throw_v2 south QA

Status: approved

Queue row: `head_throw_v2_south`

Direction: `south`

Frame count: 8

Frame profile: `expanded_action_384`

Outputs:

- Generated raw strip: `assets/monsters/tree_goblin/head_throw_v2/raw/head_throw_v2_south_raw.png`
- Spaced source strip: `assets/monsters/tree_goblin/head_throw_v2/raw/head_throw_v2_south_raw_spaced_768px.png`
- Normalized frames: `assets/monsters/tree_goblin/head_throw_v2/frames/south/`
- Preview: `assets/monsters/tree_goblin/head_throw_v2/preview/head_throw_v2_south_preview.png`
- GIF: `assets/monsters/tree_goblin/head_throw_v2/gif/head_throw_v2_south.gif`
- Local tool: `assets/monsters/tree_goblin/head_throw_v2/tools/head_throw_v2_south_normalize.py`
- Metrics: `assets/monsters/tree_goblin/head_throw_v2/qa/head_throw_v2_south_normalization_metrics.txt`

Spacing:

- Template minimum for `expanded_action_384`: 512px between neighboring action envelopes.
- User requested extra whitespace: +256px.
- Enforced source spacing: 768px empty flat `#ff00ff` gutter between repacked pose envelopes.
- Spaced strip size: 7694x724.
- Latest regenerated spaced strip size: 7607x724.

QA notes:

- Only the active `south` direction was generated and processed.
- Eight distinct south-facing head throw poses are present.
- Frame 5 is the intentional no-head beat after the throw and before the catch. The latest delivered normalized frame has no head visible in-frame.
- The spaced source strip was repacked into 768px-gutter production spacing from the regenerated one-row source strip.
- The normalized frames are anchored bottom-center into 384x384 transparent frames.
- Chroma-key cleanup was tightened after approval to remove magenta fringe from the normalized transparent frames and rebuilt preview/GIF. A second stricter despill pass reduced remaining purple/magenta edge pixels to zero under the QA color scan.
- A final light tightening pass reduced softer purple cast thresholds while preserving sprite edges.
- The row is approved by user direction after preview review.
- Next direction remains pending until it is started as its own one-direction job.
