# Monster Fight Content

This folder is for authored monster fight definitions.

Use one file per monster fight:

```text
<monster_id>.fight.ts
```

Examples:

```text
moss-golem-v2.fight.ts
tree-goblin.fight.ts
```

Fight definitions should describe what the monster can do: abilities, timing, telegraph shapes, damage, projectiles, phase rules, asset keys, and AI selection rules.

Reusable mechanics should be implemented in:

```text
src/game/combat/monster-fights/
```

The reusable intake template lives at:

```text
assets/monster_fight_template/
```
