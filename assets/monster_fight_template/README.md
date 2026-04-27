# Reusable Monster Fight Template

Use this folder when designing or implementing monster attacks, monster abilities, boss phases, and encounter-specific fight behavior.

This template is intentionally separate from the sprite animation pipeline. Sprite work answers "what does it look like?" Monster fight work answers "how does the encounter behave?"

## Template Files

- `MONSTER_FIGHT_TEMPLATE.md`: structured design and implementation checklist for one monster fight or monster ability pass.
- `templates/copy_paste_intake_prompt.md`: prompt to reference when starting a new monster fight or ability.

## Recommended Code Locations

Runtime combat logic should live under:

```text
src/game/combat/
```

Monster fight runtime helpers should use:

```text
src/game/combat/monster-fights/
```

Recommended runtime module names:

```text
src/game/combat/monster-fights/types.ts
src/game/combat/monster-fights/ability-resolution.ts
src/game/combat/monster-fights/area-shapes.ts
src/game/combat/monster-fights/projectiles.ts
src/game/combat/monster-fights/status-effects.ts
src/game/combat/monster-fights/telegraphs.ts
```

Authored fight definitions should live under:

```text
src/game/content/monster-fights/
```

Recommended authored fight naming:

```text
src/game/content/monster-fights/<monster_id>.fight.ts
```

Examples:

```text
src/game/content/monster-fights/moss-golem-v2.fight.ts
src/game/content/monster-fights/tree-goblin.fight.ts
```

Use kebab-case for monster ids and ability ids in file names and content ids. Use camelCase for exported TypeScript symbols.

Example:

```ts
// file: src/game/content/monster-fights/moss-golem-v2.fight.ts
export const mossGolemV2Fight = {
  monsterId: "moss-golem-v2",
  abilities: [
    { id: "rock-slam" },
    { id: "rock-spray" },
  ],
};
```

## Recommended Asset Locations

Monster ability assets should stay with the monster:

```text
assets/monsters/<monster_id>/<ability_id>/
```

Recommended subfolders:

```text
assets/monsters/<monster_id>/<ability_id>/
  frames/
  preview/
  gif/
  qa/
  assembled/
  vfx/
  projectiles/
  telegraphs/
```

Use an existing animation folder directly when the ability is backed by an existing monster animation, for example:

```text
assets/monsters/moss_golem_v2/rock_slam/
assets/monsters/moss_golem_v2/rock_spray/
```

When code ids need to reference existing underscored asset folders, keep the asset folder unchanged and map it from the kebab-case content id.

## Intake Rule

Before implementing a new monster fight ability, answer the intake questions in `templates/copy_paste_intake_prompt.md`. If an answer is unknown, record it as `TBD` instead of guessing. Unknowns should become implementation notes or explicit follow-up questions.

## Output Rule

Each completed monster fight pass should leave behind:

- An authored fight or ability definition in `src/game/content/monster-fights/`.
- Runtime helpers in `src/game/combat/monster-fights/` only when shared behavior is needed.
- Asset references that point to stable monster asset folders.
- A short implementation note or QA note when the behavior depends on timing, telegraph readability, or placeholder assets.
