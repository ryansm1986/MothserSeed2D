# Green Warrior Runtime Animation Export

> Note: Active generation/QA for `green_warrior_v2` is tracked in `assets/characters/green_warrior_v2/PIPELINE_RESUME.md`.
> Use `npm run pipeline:green-warrior-v2:resume` before continuing that queue.

This folder contains the repeatable export step that prepares the player character frames used by the game.

## Source Of Truth

The source asset pipeline now lives under:

```text
assets/characters/green_warrior/
```

That folder provides fixed `64x64` frames and metadata with a shared bottom-center anchor:

```text
anchor.x = 32
anchor.y = 60
```

The runtime export script reads `assets/characters/green_warrior/green_warrior_manifest.json` and copies the approved generated frames into the game-facing folder:

```text
assets/characters/warrior/animated/
```

The Vite app bundles frames from `assets/characters/warrior/animated/`, so keep running this export step after regenerating `green_warrior`.

## Animation Mapping

The game still expects these animation names:

```text
idle
walk
run
sprint
dodge_roll
attack1
attack2
```

The new source pipeline currently maps to them like this:

```text
game idle    <- green_warrior idle
game walk    <- green_warrior walk
game run     <- green_warrior sprint
game sprint  <- green_warrior sprint
game dodge_roll <- green_warrior dodge_roll
game attack1 <- green_warrior attack
game attack2 <- green_warrior special_attack
```

The app uses `walk` for regular movement, `sprint` while Shift sprinting, and `dodge_roll` during the dodge window. `run` is kept as a compatibility export.

## Run Command

From the project root on Windows with Krita installed:

```powershell
.\tools\krita\run_animate_warrior_sprites.ps1
```

Cross-platform fallback (sync runtime frames; preview exports require `ffmpeg`):

```bash
npm run pipeline:warrior
```

The launcher still uses Krita's `kritarunner.com` so the existing desktop workflow remains stable:

```text
C:\Program Files\Krita (x64)\bin\kritarunner.com
```

The script itself is now lightweight: it syncs the already-normalized `green_warrior` frames and uses Krita's bundled `ffmpeg.exe` (or `MOTHERSEED_FFMPEG` / system `ffmpeg`) to emit preview animations.

## Output

Runtime frames are written to:

```text
assets/characters/warrior/animated/
```

Preview animations are written to:

```text
dist/sprite-previews/warrior/
```

Note: `npm run build` clears `dist/`, so preview files may disappear after a production build. The runtime frames under `assets/characters/warrior/animated/` are the important bundled game assets.

Expected output when `ffmpeg` is available:

```text
28 GIF previews
28 APNG previews
140 preview frame PNGs
140 game frame PNGs
```

## Game Rendering

The game draws these frames using the source manifest's `64x64` bottom-center anchor. The player draw constants live in `src/main.ts`:

```text
scale = 1.75
anchorX = 32
anchorY = 60
baselineOffset = 28
```

If the generated frame size or anchor changes in `green_warrior_manifest.json`, update those draw constants.

## Common Noise

Krita may print messages like:

```text
Fontconfig error: Cannot load default config file: No such file: (null)
Could not find platform independent libraries <prefix>
```

These messages have appeared during successful exports and are not blockers by themselves. Verify success by checking `dist/sprite-previews/kritarunner.log` and the generated frame counts.
