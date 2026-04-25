# MotherSeed 2D

MotherSeed 2D is a browser-based fantasy ARPG prototype with 2D animated characters in a 2D world.

The current prototype focuses on combat feel: movement, dodging, target lock, auto-attacks, meter, specials, enemy telegraphs, character selection, and simple procedural gear drops.

## Current Direction

- Renderer: Canvas 2D.
- App stack: Vite and TypeScript.
- UI: DOM overlays for title, character select, HUD, menus, and text-heavy surfaces.
- Characters: directional 2D sprite animation.
- World: 2D arena now, procedural 2D sectors later.
- Engine posture: stay custom Canvas 2D for now; consider Phaser later only if tilemaps, collision, animation, or scene tooling become expensive.

Three.js, 3D terrain, billboard sprites, and 3D asset shipping are not part of the current direction.

## Run Locally

Install dependencies:

```powershell
npm install
```

Start the dev server:

```powershell
npm run dev
```

Build:

```powershell
npm run build
```

Preview the production build:

```powershell
npm run preview
```

## Controls

- WASD: move
- Shift: sprint
- Space: dodge
- Tab: target lock
- 1-3: specials
- E: equip dropped gear
- Enter or Space: confirm menu actions
- Escape: back from character select

## Important Docs

- `GAME_PLAN.md`: 2D ARPG vision, mechanics, milestones, and technical direction.
- `FOUNDATION_REVIEW.md`: current architecture review and improvement plan.
- `tools/krita/README.md`: repeatable workflow for exporting warrior sprite animations.

## Architecture Rule Of Thumb

Simulation state should be owned outside the renderer. Canvas 2D should draw the playfield; DOM should handle text-heavy UI; input should map physical keys to explicit game actions; assets should be referenced through stable manifest keys rather than filenames scattered through gameplay code.
