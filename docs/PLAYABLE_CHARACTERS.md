# Playable Characters

This guide documents how playable characters are currently added and tuned in MotherSeed 2D.

The game is a custom Canvas 2D and TypeScript prototype. Character select and HUD are DOM overlays, while the world, sprites, projectiles, and spell effects are drawn on the canvas. The current code is intentionally prototype-shaped: class data lives in content files, but some runtime behavior still lives in `src/main.ts`. When adding a character, keep edits narrow and follow the existing boundaries until the character runtime is extracted into smaller systems.

## Core Files

- `src/game/types.ts`
  Defines `ClassId`, `CharacterClass`, `Ability`, animation names, and shared gameplay types.
- `src/game/content/classes.ts`
  Defines character select data, stats, ability metadata, portraits, and character order.
- `src/game/input-actions.ts`
  Maps physical keys to gameplay actions such as `special-1`, `special-2`, and `special-3`.
- `src/main.ts`
  Loads character sprite assets, owns the player state, runs combat rules, draws sprites and effects, updates HUD, and handles character select.
- `assets/characters/<character_id>/`
  Stores character portraits, sprites, generated frames, projectiles, spells, previews, and QA files.
- `docs/SPRITE_GIF_FRAME_EXTRACTION.md`
  Documents the reusable GIF-to-PNG frame extraction and normalization tool.

## Current Runtime Shape

The current playable character path has these stages:

1. `characterClasses` and `characterOrder` render character select.
2. `applySelectedClass()` copies class stats into the shared `player` state.
3. `loadSprites()` loads a `PlayerSpriteSet` for implemented classes.
4. `activePlayerSpriteSet()` chooses the current class sprite set for animation and drawing.
5. `updatePlayer()` chooses the current animation from movement, dodge, auto attack, and special state.
6. `updateAutoAttack()` runs the default attack behavior for the selected class.
7. `castSpecial()` dispatches ability behavior by `ability.id`.
8. `drawPlayer()`, projectile draw functions, and spell draw functions render the player-facing visuals.
9. `updateHud()` reads the active class and ability metadata for the panels.

Longer term, class-specific combat and asset manifests should move out of `src/main.ts`, but today that file is the integration point.

## Add A Playable Character

### 1. Add Or Reuse A Class Id

Edit `src/game/types.ts` if the character needs a new id:

```ts
export type ClassId = "warrior" | "ranger" | "mage" | "thief" | "cleric";
```

Keep ids lowercase and stable. The id becomes the key used by character select, sprite loading, behavior dispatch, and later save data.

### 2. Add Character Select Data

Edit `src/game/content/classes.ts`.

Import the portrait with Vite's `?url` loader:

```ts
import purpleMagePortraitUrl from "../../../assets/characters/purple_mage/portrait.png?url";
```

Then add or update the `CharacterClass` entry:

```ts
mage: {
  id: "mage",
  name: "Purple Mage",
  title: "Moonveil Arcanist",
  weapon: "Lunar Staff",
  role: "Pressure enemies from range with magic missiles and lunar burst damage.",
  status: "Implemented",
  implemented: true,
  accent: "#b274e4",
  portraitUrl: purpleMagePortraitUrl,
  glyph: "M",
  stats: { health: 95, stamina: 95, meter: 120 },
  abilities: [
    { key: "1", id: "moonfall", name: "Moonfall", cost: 45, cooldown: 8.5, range: 560 },
  ],
}
```

Add the id to `characterOrder` if it is new:

```ts
export const characterOrder: ClassId[] = ["warrior", "ranger", "mage", "thief", "cleric"];
```

Use `implemented: false` for a visible planned slot. Use `implemented: true` only when the sprite set and runtime behavior are both wired.

### 3. Place Character Assets

Use this folder shape for new playable characters:

```text
assets/characters/<character_id>/
  portrait.png
  base/
  idle/
  walk/
    frames/
  sprint/
    frames/
  dodge/
    frames/
  attack/
    frames/
  special/
    frames/
  special_cast/
    frames/
  projectiles/
  spells/
```

The current runtime expects canonical frame filenames that can be discovered with `import.meta.glob()`.

For the warrior, frame names are in gameplay direction form:

```text
idle_down_01.png
walk_down_right_01.png
attack_up_left_01.png
```

For the purple mage, frame names are in compass direction form:

```text
down-idle.gif
walk_south_01.png
walk_southeast_01.png
attack_northwest_01.png
sprint_east_01.png
idle_south_01.png
special_cast_northeast_01.png
```

If a character uses compass names, add a direction mapping like `purpleMageDirectionAssets` in `src/main.ts`. GIFs can be useful as source exports, but runtime animations should be extracted into normalized PNG frame sequences so the game loop controls timing and each animation family has a consistent canvas and baseline. Use `tools/extract_gif_frames.py`; the workflow is documented in `docs/SPRITE_GIF_FRAME_EXTRACTION.md`.

### 4. Load Sprite Frames

In `src/main.ts`, add an asset glob for the character frames:

```ts
const purpleMageFrameUrls = import.meta.glob([
  "../assets/characters/purple_mage/idle/frames/idle_*_[0-9][0-9].png",
  "../assets/characters/purple_mage/walk/frames/walk_*_[0-9][0-9].png",
  "../assets/characters/purple_mage/walk_v2/frames/walk_v2_*_[0-9][0-9].png",
  "../assets/characters/purple_mage/sprint/frames/sprint_*_[0-9][0-9].png",
  "../assets/characters/purple_mage/dodge/frames/dodge_*_[0-9][0-9].png",
  "../assets/characters/purple_mage/attack/frames/attack_*_[0-9][0-9].png",
  "../assets/characters/purple_mage/special_cast/frames/special_cast_*_[0-9][0-9].png",
], {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;
```

Add a loader that returns a complete `PlayerSpriteSet`. Every direction should provide these animation keys:

- `idle`
- `walk`
- `sprint`
- `run`
- `dodge_roll`
- `attack1`
- `attack2`
- `damage`
- `victory`

Fallbacks are fine during prototyping. For example, the purple mage currently uses normalized cardinal idle frames, `walk_v2/frames` for walking, dedicated dodge frames for dodge rolls, sprint frames for sprint/run, `attack/frames` for Magic Missile, and `special_cast/frames` for Moonfall casting. If one sprint direction is missing during asset production, prefer an explicit fallback such as mirroring the opposite diagonal over silently dropping back to walk frames.

Register the sprite set in `loadSprites()`:

```ts
playerSprites = {
  warrior: warriorSprites,
  cleric: warriorSprites,
  mage: mageSprites,
};
```

Do not register a class as implemented unless `activePlayerSpriteSet()` can return a valid sprite set for it.

### 5. Set The Draw Profile

Each character needs a draw profile so its sprite baseline lands on the same ground position as collision and shadows.

```ts
const purpleMageSpriteDraw = {
  standard: {
    scale: 0.98,
    anchorX: 64,
    anchorY: 118,
    baselineOffset: 28,
    targetContentHeight: 120,
  },
};
```

Tune this by running the game and checking:

- Feet sit on the shadow.
- Movement does not make the character appear to float.
- Attack frames do not jump wildly from idle.
- Large action frames do not cover the enemy or HUD.

If a character has oversized attack or special frames, add an action draw profile like the warrior or purple mage `wideAction` profiles. This keeps wider action canvases planted on the same ground point as idle and movement frames.

When a character mixes source canvas sizes, prefer `targetContentHeight` on its draw profiles. The runtime measures each frame's opaque bounds, scales the visible sprite to that target height, centers it on the bounds, and bottom-aligns it to the character baseline. This keeps high-resolution or oversized exports, such as `walk_v2`, usable without destructively resizing the source PNGs.

### 6. Implement The Default Attack

Default attacks currently live in `updateAutoAttack()`.

For melee classes, use short range and direct damage:

```ts
if (distance(player, enemy) > 120 || player.autoTimer > 0) return;
player.autoTimer = defaultAttackCooldown;
dealEnemyDamage(damage, "Sword Slash");
```

For ranged classes, use a longer range and spawn a projectile:

```ts
const isMage = selectedClassId === "mage";
const autoRange = isMage ? 520 : 120;

if (isMage) {
  player.autoTimer = defaultAttackCooldown;
  player.attackFlash = magicMissileCastTiming.attackFlash;
  pendingMagicMissileCast = {
    damage,
    timer: magicMissileCastTiming.releaseDelay,
  };
  return;
}
```

When a projectile should leave the character during an attack animation, queue the cast instead of spawning immediately. Tune `releaseDelay` to the frame where the staff, hand, or weapon visually releases the attack. The purple mage uses the `attack/frames` sequence for Magic Missile, then releases the projectile after a short delay so the shot lines up with the cast pose.

Projectile behavior should be split into three small functions:

- `spawnX()`: create projectile state.
- `updateX(delta)`: move, hit test, apply damage, remove expired projectiles.
- `drawX()`: draw the projectile or fallback shape.

Keep projectile state serializable where possible. Do not store canvas contexts, DOM nodes, or loaded images in projectile instances.

### 7. Implement Specials

Special metadata lives in `classes.ts`, but behavior is dispatched by `ability.id` in `castSpecial()`.

Use the ability metadata for:

- `key`: HUD label and physical special slot.
- `id`: behavior dispatch key.
- `name`: HUD and event log label.
- `cost`: meter cost.
- `cooldown`: cooldown timer.
- `range`: range gate.

Then add behavior:

```ts
if (ability.id === "moonfall") {
  pendingMoonfallCast = {
    x: enemy.x,
    y: enemy.y,
    damage: 48,
    radius: 132,
    timer: moonfallCastTiming.releaseDelay,
  };
  pushLog("Moonfall called", "The spell gathers overhead");
}
```

For delayed effects, use a state object and update it each frame. Apply damage once at a clear impact point, then remove the effect after its visual recovery. Moonfall uses `attack2` as the special animation state, maps the purple mage to `special_cast/frames`, and queues the falling moon after `moonfallCastTiming.releaseDelay` so the spell effect lines up with the cast pose.

### 8. Add Effect Assets

Import single effect images directly:

```ts
import magicMissileUrl from "../assets/characters/purple_mage/projectiles/magic_missile/magic_missile.png?url";
import moonfallUrl from "../assets/characters/purple_mage/spells/moonfall/moonfall.png?url";
import moonfallCrashUrl from "../assets/characters/purple_mage/spells/moonfall/sound_effects/Crashing.mp3?url";
import moonfallPortalUrl from "../assets/characters/purple_mage/spells/moonfall/sound_effects/Portal.mp3?url";
import moonfallVoiceUrl from "../assets/characters/purple_mage/spells/moonfall/voiceline/Moonfall.mp3?url";
```

Import animated effect frames with `import.meta.glob()`:

```ts
const magicMissileFrameUrls = import.meta.glob("../assets/characters/purple_mage/projectiles/magic_missile/frames/magic_missile_left_[0-9][0-9].png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const moonfallFrameUrls = import.meta.glob("../assets/characters/purple_mage/spells/moonfall/frames/moonfall_[0-9][0-9].png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;
```

Load them in `loadWorldAssets()` or a future dedicated effect loader:

```ts
[magicMissileFrames, moonfallFrames] = await Promise.all([
  magicMissileEntries.length > 0
    ? Promise.all(magicMissileEntries.map(([, url]) => loadImage(url).then(makeImageFrame)))
    : loadImage(magicMissileUrl).then(makeGreenScreenFrame).then((frame) => [frame]),
  moonfallEntries.length > 0
    ? Promise.all(moonfallEntries.map(([, url]) => loadImage(url).then(makeMoonfallFrame)))
    : loadImage(moonfallUrl).then(makeGreenScreenFrame).then((frame) => [frame]),
]);
```

Use `makeImageFrame()` for transparent PNGs. Use `makeGreenScreenFrame()` only for green-keyed generated images that need runtime cleanup. Prefer normalized transparent PNG assets when possible. For fixed-canvas effect animations, preserve the shared canvas so every frame anchors consistently; use a specialized cleanup loader such as `makeMoonfallFrame()` only when generated guide artifacts need to be hidden at runtime.

Spell audio should be dispatched from gameplay timing, not draw code. For example, Moonfall plays its voice line and portal sound in `castSpecial()` when the cast succeeds, then plays the crash sound from `updateMoonfallStrikes()` when the animation enters its final frame.

### 9. Update HUD And Character Select Text

Most HUD and character select UI updates automatically from `CharacterClass` data:

- Character name and stats.
- Ability names, keys, costs, cooldowns.
- Portrait and accent color.
- Implemented or planned state.

If the number of implemented classes changes, update static copy such as:

```html
Five paths. Three awaken in this build.
```

If a class uses fewer than three abilities, the action bar will render fewer slots. That is fine for the prototype, but if the layout later assumes exactly three slots, update CSS and smoke tests together.

## Adjust An Existing Character

Use this table for common changes.

| Goal | File or function |
| --- | --- |
| Rename class, title, weapon, role | `src/game/content/classes.ts` |
| Change health, stamina, or max meter | `stats` in `classes.ts` |
| Change special cost, cooldown, or range | `abilities` in `classes.ts` |
| Change special behavior or damage | `castSpecial()` in `src/main.ts` |
| Change default attack range, cadence, or damage | `updateAutoAttack()` in `src/main.ts` |
| Change projectile speed or lifetime | The class projectile state/update functions |
| Change sprite scale or baseline | Character draw profile in `src/main.ts` |
| Change portrait | `portraitUrl` import and asset file |
| Change keyboard mapping | `src/game/input-actions.ts` |
| Change target lock or click-to-clear targeting | `lockTarget()`, `clearTarget()`, and canvas click handling in `src/main.ts` |
| Change character select order | `characterOrder` in `classes.ts` |

Balance changes should usually be made in one pass, then verified with a short fight. Watch time-to-kill, meter gain speed, cooldown uptime, and whether enemy telegraphs stay readable.

## Asset Quality Checklist

Before marking a character implemented:

- Portrait exists and loads in character select.
- Every required direction has at least one valid frame for idle, movement, and casting or attack.
- Frames are transparent or use a known cleanup path.
- Sprite scale matches the arena and enemy size.
- Feet stay anchored during idle and movement.
- Attack frames face the target direction.
- Projectiles or spell effects are not huge raw source images at runtime scale.
- Special effects do not hide enemy telegraphs for too long.
- The class has a meaningful default attack and at least one special.
- Empty left-click clears target lock so movement-facing and auto-attack gating still feel intentional.

## Smoke Test Checklist

Run the production build first:

```powershell
npm run build
```

Then run locally:

```powershell
npm run dev
```

Manual smoke test:

1. Open the app.
2. Start from the title screen.
3. Select the character.
4. Confirm the portrait, class name, stats, and ability list.
5. Enter the grove.
6. Move in all directions.
7. Sprint and dodge.
8. Let the default attack fire.
9. Use each implemented special.
10. Confirm event log messages, enemy health changes, cooldowns, and meter changes.
11. Die or defeat the enemy once if the change touched reset, death, loot, or respawn.

Browser automation can also verify the happy path: select the class, enter the grove, wait for auto attacks, trigger a special, and check that no page errors were logged.

## Good Defaults

Use these as starting points for new classes:

| Archetype | Health | Stamina | Meter | Auto range | Auto cadence | Special range |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Melee tank | 130-150 | 90-110 | 100 | 100-140 | 1.2-1.5s | 100-220 |
| Mobile melee | 100-120 | 120-140 | 100 | 90-125 | 0.8-1.2s | 100-300 |
| Ranged caster | 85-105 | 85-105 | 110-130 | 420-560 | 0.8-1.1s | 360-600 |
| Support | 110-130 | 85-110 | 100-120 | 140-240 | 1.1-1.4s | 180-360 |

These are not rules. They are safe first values for a prototype fight against the current Rootbound Elite.

## Refactor Direction

As playable classes grow, avoid adding too much more class logic directly to `src/main.ts`. The next good extraction is:

```text
src/game/content/classes.ts
src/game/content/player-assets.ts
src/game/combat/player-attacks.ts
src/game/combat/player-specials.ts
src/game/render/player-render.ts
src/game/render/effects-render.ts
```

Keep the same rule from the game foundations: simulation owns state and rules; rendering owns sprites, draw order, camera, and visual effects; DOM owns character select and HUD text.
