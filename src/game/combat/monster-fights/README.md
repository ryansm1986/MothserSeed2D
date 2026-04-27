# Monster Fight Runtime

This folder is the home for reusable monster fight logic: ability timing, area checks, telegraph resolution, projectiles, status effects, and shared AI selection helpers.

Authored monster fight definitions should live in:

```text
src/game/content/monster-fights/
```

Keep this folder focused on reusable behavior. If a rule only belongs to one monster, prefer putting the authored configuration in that monster's `.fight.ts` file and only add runtime code here when the behavior becomes shared.

## Naming

- Runtime helpers: kebab-case file names, descriptive nouns.
- Authored fight definitions: `<monster_id>.fight.ts`.
- Content ids: kebab-case.
- Exported TypeScript symbols: camelCase.

Examples:

```text
src/game/combat/monster-fights/area-shapes.ts
src/game/combat/monster-fights/projectiles.ts
src/game/combat/monster-fights/telegraphs.ts
src/game/content/monster-fights/moss-golem-v2.fight.ts
```
