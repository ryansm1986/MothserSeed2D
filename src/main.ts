import "./style.css";
import monsterSheetUrl from "../assets/Monsters.png?url";
import rpgAssetsUrl from "../assets/RPGAssets.png?url";
import titleImageUrl from "../assets/Title.png?url";
import grassTerrainUrl from "../assets/world/terrain/rpg_grass_source/base_tiles_opaque/grass_plain.png?url";
import { characterClasses, characterOrder } from "./game/content/classes";
import { gameplayActionForCode, movementFromActions, type GameplayAction } from "./game/input-actions";
import { clamp, directionFromVector, distance, dot, length, lengthSq, normalize, rects } from "./game/math";
import type {
  AnimationName,
  ClassId,
  CombatState,
  DirectionName,
  FrameRect,
  GearDrop,
  MonsterAnimationName,
  PlayerLifeState,
  SpriteFrame,
  TelegraphKind,
  Vec2,
  WorldAssetName,
} from "./game/types";

const warriorFrameUrls = import.meta.glob("../assets/characters/warrior/animated/*/*/frame_*.png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;
const grassTerrainVariantUrls = import.meta.glob("../assets/world/terrain/rpg_grass_source/tiles/*.png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;
const grassTerrainPropUrls = import.meta.glob("../assets/world/terrain/rpg_grass_source/props/*.png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;
const animatedGrassFrameUrls = import.meta.glob("../assets/world/grass/frames/*.png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;
const warriorSpriteDraw = {
  scale: 1.75,
  anchorX: 32,
  anchorY: 60,
  baselineOffset: 28,
};

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app root");
}

app.innerHTML = `
  <div class="game-shell"></div>
  <section class="title-screen" style="--title-image: url('${titleImageUrl}')">
    <button class="start-button" type="button">Start</button>
  </section>
  <section class="character-select is-hidden" aria-labelledby="character-select-title" style="--title-image: url('${titleImageUrl}')">
    <div class="select-frame">
      <div class="select-header">
        <div>
          <p class="select-kicker">Choose your seedbound path</p>
          <h1 id="character-select-title">Character Select</h1>
        </div>
        <button class="menu-button back-button" type="button">Back</button>
      </div>
      <div class="character-layout">
        <div class="character-grid" id="character-grid"></div>
        <aside class="character-detail" id="character-detail"></aside>
      </div>
      <div class="select-footer">
        <div class="select-hint">Five paths. Two awaken in this build.</div>
        <button class="menu-button continue-button" type="button">Enter Grove</button>
      </div>
    </div>
  </section>
  <div class="hud is-hidden">
    <div class="hud-top">
      <section class="hud-panel vitals-panel" id="player-panel"></section>
      <section class="hud-panel target-panel" id="target-panel"></section>
    </div>
    <div class="hud-bottom">
      <div class="event-log" id="event-log"></div>
      <section class="action-bar">
        <div class="ability-row" id="abilities"></div>
      </section>
      <section class="control-guide" aria-label="Controls">
        <div><kbd>WASD</kbd><span>Move</span></div>
        <div><kbd>Shift</kbd><span>Sprint</span></div>
        <div><kbd>Space</kbd><span>Dodge</span></div>
        <div><kbd>Tab</kbd><span>Target</span></div>
        <div><kbd>1-3</kbd><span>Specials</span></div>
        <div><kbd>E</kbd><span>Equip</span></div>
      </section>
    </div>
  </div>
`;

const shell = document.querySelector<HTMLDivElement>(".game-shell")!;
const titleScreen = document.querySelector<HTMLElement>(".title-screen")!;
const startButton = document.querySelector<HTMLButtonElement>(".start-button")!;
const characterSelect = document.querySelector<HTMLElement>(".character-select")!;
const characterGrid = document.querySelector<HTMLDivElement>("#character-grid")!;
const characterDetail = document.querySelector<HTMLElement>("#character-detail")!;
const backButton = document.querySelector<HTMLButtonElement>(".back-button")!;
const continueButton = document.querySelector<HTMLButtonElement>(".continue-button")!;
const hud = document.querySelector<HTMLDivElement>(".hud")!;
const playerPanel = document.querySelector<HTMLDivElement>("#player-panel")!;
const targetPanel = document.querySelector<HTMLDivElement>("#target-panel")!;
const abilityPanel = document.querySelector<HTMLDivElement>("#abilities")!;
const eventLog = document.querySelector<HTMLDivElement>("#event-log")!;

const canvas = document.createElement("canvas");
const canvasContext = canvas.getContext("2d", { alpha: false });

if (!canvasContext) {
  throw new Error("Canvas 2D rendering is unavailable");
}

const ctx: CanvasRenderingContext2D = canvasContext;
shell.appendChild(canvas);

const world = {
  width: 2200,
  height: 1500,
  center: { x: 1100, y: 750 },
  safeRadius: 680,
};

const terrainTileSize = 48;

const camera = {
  x: 0,
  y: 0,
  scale: 1,
};

const mossGolemFrameRects: Record<DirectionName, Record<MonsterAnimationName, FrameRect[]>> = {
  down: {
    idle: rects([
      [264, 802, 55, 74],
      [338, 802, 53, 74],
      [409, 802, 50, 74],
    ]),
    walk: rects([
      [504, 802, 57, 78],
      [571, 802, 74, 78],
      [641, 802, 56, 78],
      [711, 802, 55, 78],
    ]),
    run: rects([
      [817, 802, 60, 80],
      [889, 802, 56, 80],
      [958, 802, 76, 80],
      [1026, 802, 48, 80],
    ]),
    attack: rects([
      [1116, 802, 86, 86],
      [1196, 802, 113, 86],
      [1301, 802, 108, 86],
      [1401, 803, 71, 85],
    ]),
  },
  left: {
    idle: rects([
      [273, 874, 46, 74],
      [345, 874, 44, 74],
      [414, 874, 43, 74],
    ]),
    walk: rects([
      [505, 874, 53, 75],
      [571, 874, 55, 75],
      [641, 874, 52, 75],
      [711, 874, 54, 75],
    ]),
    run: rects([
      [818, 874, 58, 76],
      [886, 874, 59, 76],
      [956, 874, 78, 75],
      [1026, 874, 48, 75],
    ]),
    attack: rects([
      [1116, 874, 86, 75],
      [1196, 874, 113, 86],
      [1301, 874, 108, 86],
      [1401, 874, 80, 76],
    ]),
  },
  right: {
    idle: rects([
      [269, 951, 50, 59],
      [340, 951, 51, 58],
      [409, 951, 50, 58],
    ]),
    walk: rects([
      [505, 951, 53, 59],
      [571, 951, 53, 59],
      [641, 950, 51, 60],
      [711, 950, 53, 60],
    ]),
    run: rects([
      [816, 950, 60, 60],
      [887, 951, 57, 59],
      [956, 950, 78, 60],
      [1026, 951, 51, 59],
    ]),
    attack: rects([
      [1116, 952, 60, 58],
      [1201, 950, 108, 65],
      [1301, 950, 48, 60],
      [1201, 950, 108, 65],
    ]),
  },
  up: {
    idle: rects([
      [273, 955, 50, 51],
      [344, 955, 50, 50],
      [413, 955, 48, 50],
    ]),
    walk: rects([
      [509, 955, 45, 51],
      [574, 955, 46, 51],
      [643, 954, 45, 52],
      [712, 954, 48, 52],
    ]),
    run: rects([
      [819, 954, 53, 52],
      [891, 955, 49, 51],
      [960, 954, 48, 52],
      [1027, 955, 46, 51],
    ]),
    attack: rects([
      [1116, 956, 56, 50],
      [1205, 959, 114, 52],
      [1116, 956, 56, 50],
      [1205, 959, 114, 52],
    ]),
  },
};

let selectedClassId: ClassId = "warrior";

function selectedClass() {
  return characterClasses[selectedClassId];
}

function activeAbilities() {
  return selectedClass().abilities;
}

const player = {
  lifeState: "alive" as PlayerLifeState,
  x: world.center.x,
  y: world.center.y + 230,
  radius: 26,
  health: 140,
  maxHealth: 140,
  stamina: 100,
  maxStamina: 100,
  meter: 0,
  maxMeter: 100,
  speed: 235,
  sprintSpeed: 345,
  sprintStaminaCost: 22,
  staminaRegen: 18,
  dodgeSpeed: 680,
  dodgeTime: 0,
  invulnerableTime: 0,
  facing: { x: 0, y: -1 },
  anim: "idle" as AnimationName,
  direction: "down" as DirectionName,
  animTimer: 0,
  animFrame: 0,
  attackFlash: 0,
  specialFlash: 0,
  autoTimer: 0,
  autoCount: 0,
};

const enemy = {
  x: world.center.x,
  y: world.center.y - 210,
  radius: 34,
  health: 220,
  maxHealth: 220,
  state: "idle" as CombatState,
  stateTimer: 1.8,
  attackIndex: 0,
  currentAttack: "cone" as TelegraphKind,
  attackForward: { x: 0, y: 1 },
  hasHitPlayer: false,
  chainTag: "",
  chainTimer: 0,
  bleedTimer: 0,
  bleedTick: 0,
  flashTimer: 0,
  anim: "idle" as MonsterAnimationName,
  direction: "down" as DirectionName,
  animTimer: 0,
  animFrame: 0,
  visible: true,
};

type Obstacle = { x: number; y: number; rx: number; ry: number; asset: WorldAssetName; scale: number };

const obstacles: Obstacle[] = [];

const terrainOverlays = Array.from({ length: 130 }, (_, index) => {
  const angle = index * 2.399963;
  const radius = 80 + ((index * 67) % 640);
  return {
    x: world.center.x + Math.cos(angle) * radius,
    y: world.center.y + Math.sin(angle) * radius * 0.82,
    kind: index % 17 === 0 ? "white_wildflower" : index % 13 === 0 ? "yellow_wildflower" : index % 7 === 0 ? "small_rock_cluster" : "flat_grass_patch",
    scale: 0.72 + ((index * 19) % 7) * 0.055,
    alpha: 0.28 + ((index * 11) % 5) * 0.055,
  };
});

const animatedGrassTufts = Array.from({ length: 34 }, (_, index) => {
  const angle = index * 2.399963;
  const radius = 130 + ((index * 91) % 560);
  return {
    x: world.center.x + Math.cos(angle) * radius,
    y: world.center.y + Math.sin(angle) * radius * 0.78,
    scale: 0.64 + ((index * 23) % 6) * 0.045,
    phase: index % 8,
  };
});

const pressedActions = new Set<GameplayAction>();
const cooldowns = new Map<string, number>();
let sprites: Record<DirectionName, Record<AnimationName, SpriteFrame[]>> | null = null;
let monsterSprites: Record<DirectionName, Record<MonsterAnimationName, SpriteFrame[]>> | null = null;
let worldAssets: Partial<Record<WorldAssetName, SpriteFrame>> = {};
let grassTerrainTile: SpriteFrame | null = null;
let grassTerrainVariants: Record<string, SpriteFrame> = {};
let grassTerrainProps: Record<string, SpriteFrame> = {};
let animatedGrassFrames: SpriteFrame[] = [];
let targetLocked = true;
let droppedGear: GearDrop | null = null;
let equippedGear: GearDrop = {
  name: "Recruit's Buckler",
  rarity: "Common",
  power: 0,
  ability: "Every third auto-attack deals +5 damage.",
};
let playerRespawnTimer = 0;
let respawnTimer = 0;
let isTitleActive = true;
let isCharacterSelectActive = false;
let lastFrame = performance.now();

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load ${url}`));
    image.src = url;
  });
}

function makeTransparentFrame(image: HTMLImageElement, frame: FrameRect): SpriteFrame {
  const buffer = document.createElement("canvas");
  buffer.width = frame.w;
  buffer.height = frame.h;
  const frameCtx = buffer.getContext("2d")!;
  frameCtx.drawImage(image, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);

  const pixels = frameCtx.getImageData(0, 0, frame.w, frame.h);
  let minX = frame.w;
  let minY = frame.h;
  let maxX = -1;
  let maxY = -1;

  for (let index = 0; index < pixels.data.length; index += 4) {
    const r = pixels.data[index];
    const g = pixels.data[index + 1];
    const b = pixels.data[index + 2];
    if (r > 242 && g > 242 && b > 242) {
      pixels.data[index + 3] = 0;
    } else {
      const pixelIndex = index / 4;
      const x = pixelIndex % frame.w;
      const y = Math.floor(pixelIndex / frame.w);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  frameCtx.putImageData(pixels, 0, 0);

  if (maxX < minX || maxY < minY) {
    return { canvas: buffer, w: frame.w, h: frame.h };
  }

  const padding = 2;
  const trimmedX = Math.max(0, minX - padding);
  const trimmedY = Math.max(0, minY - padding);
  const trimmedW = Math.min(frame.w - trimmedX, maxX - trimmedX + 1 + padding);
  const trimmedH = Math.min(frame.h - trimmedY, maxY - trimmedY + 1 + padding);
  const trimmed = document.createElement("canvas");
  trimmed.width = trimmedW;
  trimmed.height = trimmedH;
  trimmed.getContext("2d")!.drawImage(buffer, trimmedX, trimmedY, trimmedW, trimmedH, 0, 0, trimmedW, trimmedH);

  return { canvas: trimmed, w: trimmedW, h: trimmedH };
}

function makeImageFrame(image: HTMLImageElement): SpriteFrame {
  const buffer = document.createElement("canvas");
  buffer.width = image.naturalWidth;
  buffer.height = image.naturalHeight;
  buffer.getContext("2d")!.drawImage(image, 0, 0);
  return { canvas: buffer, w: buffer.width, h: buffer.height };
}

function assetNameFromPath(path: string): string {
  return path.split("/").pop()?.replace(/\.png$/, "") ?? path;
}

const worldAssetRects: Record<WorldAssetName, FrameRect> = {
  grassTile: { x: 17, y: 70, w: 48, h: 48 },
  mossTile: { x: 182, y: 70, w: 48, h: 48 },
  stoneTile: { x: 238, y: 70, w: 48, h: 48 },
  waterTile: { x: 292, y: 70, w: 48, h: 48 },
  oakTree: { x: 388, y: 70, w: 104, h: 126 },
  pineTree: { x: 617, y: 70, w: 76, h: 126 },
  bush: { x: 398, y: 204, w: 66, h: 58 },
  flowers: { x: 503, y: 278, w: 66, h: 55 },
  log: { x: 512, y: 342, w: 105, h: 53 },
  stump: { x: 620, y: 342, w: 68, h: 70 },
  rock: { x: 392, y: 344, w: 68, h: 56 },
  banner: { x: 250, y: 272, w: 53, h: 94 },
  tent: { x: 247, y: 544, w: 114, h: 104 },
  house: { x: 194, y: 538, w: 168, h: 132 },
  treeHouse: { x: 20, y: 526, w: 164, h: 224 },
  chest: { x: 419, y: 556, w: 42, h: 38 },
  barrel: { x: 490, y: 704, w: 38, h: 48 },
  crate: { x: 583, y: 554, w: 42, h: 42 },
  coin: { x: 794, y: 889, w: 35, h: 35 },
};

async function loadSprites() {
  const output = {} as Record<DirectionName, Record<AnimationName, SpriteFrame[]>>;
  const animations = ["idle", "walk", "run", "sprint", "dodge_roll", "attack1", "attack2"] as const satisfies readonly AnimationName[];

  await Promise.all((["down", "left", "right", "up"] as DirectionName[]).map(async (direction) => {
    output[direction] = {} as Record<AnimationName, SpriteFrame[]>;
    await Promise.all(animations.map(async (animation) => {
      const urls = getWarriorFrameUrls(direction, animation);
      const frames = await Promise.all(urls.map(async (url) => makeImageFrame(await loadImage(url))));
      output[direction][animation] = animation === "idle" ? makePingPongFrames(frames) : frames;
    }));
    output[direction].damage = output[direction].idle;
    output[direction].victory = output[direction].idle;
  }));

  sprites = output;
}

function makePingPongFrames<T>(frames: T[]): T[] {
  if (frames.length <= 2) return frames;
  return [...frames, ...frames.slice(1, -1).reverse()];
}

function getWarriorFrameUrls(direction: DirectionName, animation: AnimationName): string[] {
  const prefix = `../assets/characters/warrior/animated/${direction}/${animation}/`;
  const urls = Object.entries(warriorFrameUrls)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, url]) => url);

  if (urls.length === 0) {
    throw new Error(`Missing exported warrior frames for ${direction}/${animation}. Run tools/krita/run_animate_warrior_sprites.ps1.`);
  }

  return urls;
}

async function loadMonsterSprites() {
  const image = await loadImage(monsterSheetUrl);
  const output = {} as Record<DirectionName, Record<MonsterAnimationName, SpriteFrame[]>>;

  (Object.keys(mossGolemFrameRects) as DirectionName[]).forEach((direction) => {
    output[direction] = {} as Record<MonsterAnimationName, SpriteFrame[]>;
    (Object.keys(mossGolemFrameRects[direction]) as MonsterAnimationName[]).forEach((animation) => {
      output[direction][animation] = mossGolemFrameRects[direction][animation].map((frame) => makeTransparentFrame(image, frame));
    });
  });

  monsterSprites = output;
}

async function loadWorldAssets() {
  const image = await loadImage(rpgAssetsUrl);
  const grassImage = await loadImage(grassTerrainUrl);
  const output: Partial<Record<WorldAssetName, SpriteFrame>> = {};

  (Object.keys(worldAssetRects) as WorldAssetName[]).forEach((name) => {
    output[name] = makeTransparentFrame(image, worldAssetRects[name]);
  });

  grassTerrainTile = makeImageFrame(grassImage);
  grassTerrainVariants = await loadFrameMap(grassTerrainVariantUrls);
  grassTerrainProps = await loadFrameMap(grassTerrainPropUrls);
  animatedGrassFrames = (await Promise.all(
    Object.entries(animatedGrassFrameUrls)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(async ([, url]) => makeImageFrame(await loadImage(url))),
  ));
  worldAssets = output;
}

async function loadFrameMap(urls: Record<string, string>): Promise<Record<string, SpriteFrame>> {
  const frames: Record<string, SpriteFrame> = {};
  await Promise.all(Object.entries(urls).map(async ([path, url]) => {
    frames[assetNameFromPath(path)] = makeImageFrame(await loadImage(url));
  }));
  return frames;
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  camera.scale = Math.max(0.72, Math.min(1.08, Math.min(width / 1120, height / 740)));
}

function updatePlayer(delta: number) {
  if (player.lifeState === "dead") {
    player.dodgeTime = 0;
    player.invulnerableTime = 0;
    player.attackFlash = 0;
    player.specialFlash = 0;
    updateSpriteAnimation("damage", delta);
    return;
  }

  player.dodgeTime = Math.max(0, player.dodgeTime - delta);
  player.invulnerableTime = Math.max(0, player.invulnerableTime - delta);
  player.attackFlash = Math.max(0, player.attackFlash - delta);
  player.specialFlash = Math.max(0, player.specialFlash - delta);
  player.autoTimer = Math.max(0, player.autoTimer - delta);

  const input = movementFromActions(pressedActions);

  const moving = lengthSq(input) > 0;
  if (moving) {
    normalize(input);
    if (Math.abs(input.x) > Math.abs(input.y)) {
      player.direction = input.x > 0 ? "right" : "left";
    } else {
      player.direction = input.y > 0 ? "down" : "up";
    }
    player.facing = { ...input };
  }

  const sprinting = moving && pressedActions.has("sprint") && player.stamina > 0 && player.dodgeTime <= 0;

  if (sprinting) {
    player.stamina = Math.max(0, player.stamina - player.sprintStaminaCost * delta);
  } else {
    player.stamina = Math.min(player.maxStamina, player.stamina + player.staminaRegen * delta);
  }

  if (pressedActions.has("dodge") && player.stamina >= 28 && player.dodgeTime <= 0) {
    player.stamina -= 28;
    player.dodgeTime = 0.24;
    player.invulnerableTime = 0.38;
    pushLog("Dodge window", "");
  }

  const speed = player.dodgeTime > 0 ? player.dodgeSpeed : sprinting ? player.sprintSpeed : player.speed;
  const direction = moving ? input : player.dodgeTime > 0 ? player.facing : null;
  if (direction) {
    player.x += direction.x * speed * delta;
    player.y += direction.y * speed * delta;
  }

  clampToArena(player);
  resolveObstacleCollision(player, player.radius);
  updateTargetFacing();

  const nextAnim: AnimationName =
    player.specialFlash > 0
      ? "attack2"
      : player.attackFlash > 0
        ? "attack1"
        : player.dodgeTime > 0
          ? "dodge_roll"
          : sprinting
          ? "sprint"
          : moving
            ? "walk"
            : "idle";
  updateSpriteAnimation(nextAnim, delta);
}

function updateTargetFacing() {
  if (!targetLocked || enemy.state === "dead" || !enemy.visible) return;

  const toEnemy = { x: enemy.x - player.x, y: enemy.y - player.y };
  if (lengthSq(toEnemy) <= 0.001) return;
  player.direction = directionFromVector(toEnemy);
}

function updateSpriteAnimation(nextAnim: AnimationName, delta: number) {
  if (player.anim !== nextAnim) {
    player.anim = nextAnim;
    player.animFrame = 0;
    player.animTimer = 0;
  }

  player.animTimer += delta;
  const rate =
    player.anim === "idle"
      ? 0.22
      : player.anim === "attack1"
        ? 0.06
        : player.anim === "attack2"
          ? 0.075
          : player.anim === "dodge_roll"
            ? 0.048
            : player.anim === "sprint"
              ? 0.075
              : 0.105;
  const frames = sprites?.[player.direction][player.anim];
  if (frames && player.animTimer >= rate) {
    player.animTimer = 0;
    player.animFrame = (player.animFrame + 1) % frames.length;
  }
}

function updateCamera(delta: number) {
  const viewWidth = window.innerWidth / camera.scale;
  const viewHeight = window.innerHeight / camera.scale;
  const targetX = clamp(player.x - viewWidth / 2, 0, world.width - viewWidth);
  const targetY = clamp(player.y - viewHeight / 2, 0, world.height - viewHeight);
  camera.x += (targetX - camera.x) * (1 - Math.exp(-delta * 8));
  camera.y += (targetY - camera.y) * (1 - Math.exp(-delta * 8));
}

function updateCombat(delta: number) {
  if (player.lifeState === "dead") {
    playerRespawnTimer -= delta;
    if (playerRespawnTimer <= 0) respawnPlayer();
    return;
  }

  if (enemy.state === "dead") {
    respawnTimer -= delta;
    if (respawnTimer <= 0) respawnEnemy();
    return;
  }

  enemy.flashTimer = Math.max(0, enemy.flashTimer - delta);

  if (enemy.chainTimer > 0) {
    enemy.chainTimer -= delta;
    if (enemy.chainTimer <= 0) enemy.chainTag = "";
  }

  updateBleed(delta);
  updateAutoAttack();
  updateEnemy(delta);
}

function updateAutoAttack() {
  if (player.lifeState !== "alive") return;
  if (!targetLocked || enemy.health <= 0) return;
  if (distance(player, enemy) > 120 || player.autoTimer > 0) return;

  player.autoTimer = 1.35;
  player.attackFlash = 0.5;
  player.autoCount += 1;

  let damage = 8 + equippedGear.power;
  if (player.autoCount % 3 === 0) {
    damage += 5;
    if (equippedGear.rarity !== "Common") {
      enemy.bleedTimer = 5;
      enemy.bleedTick = 1;
      applyChain("Bleed", 5);
    }
  }

  dealEnemyDamage(damage, "Sword Slash");
  player.meter = Math.min(player.maxMeter, player.meter + 8);
}

function updateEnemy(delta: number) {
  if (player.lifeState !== "alive") {
    updateMonsterAnimation("idle", delta);
    return;
  }

  const toPlayer = { x: player.x - enemy.x, y: player.y - enemy.y };
  const distanceToPlayer = length(toPlayer);
  if (distanceToPlayer > 0.001) normalize(toPlayer);
  if (distanceToPlayer > 0.001) enemy.direction = directionFromVector(toPlayer);

  if (enemy.state === "idle") {
    if (distanceToPlayer > 110) {
      enemy.x += toPlayer.x * 108 * delta;
      enemy.y += toPlayer.y * 108 * delta;
      clampToArena(enemy);
      resolveObstacleCollision(enemy, enemy.radius);
      updateMonsterAnimation("walk", delta);
    } else {
      updateMonsterAnimation("idle", delta);
    }

    enemy.stateTimer -= delta;
    if (enemy.stateTimer <= 0 && distanceToPlayer < 420) {
      beginEnemyAttack();
    }
    return;
  }

  enemy.stateTimer -= delta;
  updateMonsterAnimation(enemy.state === "windup" || enemy.state === "active" ? "attack" : "idle", delta);

  if (enemy.state === "windup" && enemy.stateTimer <= 0) {
    enemy.state = "active";
    enemy.stateTimer = enemy.currentAttack === "cone" ? 0.28 : 0.4;
    enemy.hasHitPlayer = false;
  } else if (enemy.state === "active") {
    resolveEnemyHit();
    if (enemy.stateTimer <= 0) {
      enemy.state = "recovery";
      enemy.stateTimer = 0.82;
    }
  } else if (enemy.state === "recovery" && enemy.stateTimer <= 0) {
    enemy.state = "idle";
    enemy.stateTimer = 1.25 + Math.random() * 0.45;
  }
}

function updateMonsterAnimation(nextAnim: MonsterAnimationName, delta: number) {
  if (enemy.anim !== nextAnim) {
    enemy.anim = nextAnim;
    enemy.animFrame = 0;
    enemy.animTimer = 0;
  }

  enemy.animTimer += delta;
  const rate = enemy.anim === "attack" ? 0.11 : enemy.anim === "idle" ? 0.22 : 0.13;
  const frames = monsterSprites?.[enemy.direction][enemy.anim];
  if (frames && enemy.animTimer >= rate) {
    enemy.animTimer = 0;
    enemy.animFrame = (enemy.animFrame + 1) % frames.length;
  }
}

function beginEnemyAttack() {
  const toPlayer = { x: player.x - enemy.x, y: player.y - enemy.y };
  if (lengthSq(toPlayer) > 0.001) normalize(toPlayer);
  enemy.attackForward = toPlayer;
  enemy.currentAttack = enemy.attackIndex % 2 === 0 ? "cone" : "slam";
  enemy.attackIndex += 1;
  enemy.state = "windup";
  enemy.stateTimer = enemy.currentAttack === "cone" ? 0.92 : 1.12;
  enemy.hasHitPlayer = false;
}

function resolveEnemyHit() {
  if (enemy.hasHitPlayer || player.invulnerableTime > 0) return;

  const distanceToPlayer = distance(player, enemy);
  let hit = false;
  let damage = 0;

  if (enemy.currentAttack === "slam") {
    hit = distanceToPlayer <= 155;
    damage = 24;
  } else {
    damage = 18;
    if (distanceToPlayer <= 260) {
      const toPlayer = { x: player.x - enemy.x, y: player.y - enemy.y };
      normalize(toPlayer);
      hit = dot(enemy.attackForward, toPlayer) > Math.cos(Math.PI * 0.34);
    }
  }

  if (hit) {
    enemy.hasHitPlayer = true;
    player.health = Math.max(0, player.health - damage);
    player.anim = "damage";
    pushLog(`Hit for ${damage}`, "Watch the telegraph timing");
    if (player.health <= 0) defeatPlayer();
  }
}

function castSpecial(index: number) {
  if (player.lifeState !== "alive") return;
  const ability = activeAbilities()[index];
  if (!ability || enemy.state === "dead") return;
  const cooldown = cooldowns.get(ability.id) ?? 0;
  const distanceToEnemy = distance(player, enemy);

  if (cooldown > 0 || player.meter < ability.cost) return;
  if (distanceToEnemy > ability.range && ability.id !== "guarded-rush" && ability.id !== "ward-pulse") {
    pushLog(`${ability.name} out of range`, "");
    return;
  }

  player.meter -= ability.cost;
  cooldowns.set(ability.id, ability.cooldown);
  player.specialFlash = 0.64;

  if (ability.id === "shield-break") {
    dealEnemyDamage(20 + equippedGear.power, "Shield Break");
    applyChain("Break", 8);
    pushLog("Break primer applied", "Cleaving Arc can detonate it");
  }

  if (ability.id === "guarded-rush") {
    const toEnemy = { x: enemy.x - player.x, y: enemy.y - player.y };
    const rushDistance = Math.min(Math.max(distanceToEnemy - 82, 0), 270);
    if (lengthSq(toEnemy) > 0.001) {
      normalize(toEnemy);
      player.x += toEnemy.x * rushDistance;
      player.y += toEnemy.y * rushDistance;
      player.direction = directionFromVector(toEnemy);
    }
    player.invulnerableTime = 0.42;
    dealEnemyDamage(14 + equippedGear.power, "Guarded Rush");
    player.health = Math.min(player.maxHealth, player.health + 8);
  }

  if (ability.id === "cleaving-arc") {
    let damage = 28 + equippedGear.power;
    if (enemy.chainTag === "Break") {
      damage += 22;
      applyChain("Sundered", 5);
      pushLog("Sundered chain", "Break detonated by Cleaving Arc");
    }
    dealEnemyDamage(damage, "Cleaving Arc");
  }

  if (ability.id === "radiant-brand") {
    dealEnemyDamage(17 + equippedGear.power, "Radiant Brand");
    applyChain("Radiant", 8);
    pushLog("Radiant primer applied", "Judgment can detonate it");
  }

  if (ability.id === "ward-pulse") {
    player.invulnerableTime = 0.5;
    player.health = Math.min(player.maxHealth, player.health + 18);
    pushLog("Ward Pulse", "Recovered health and steadied your guard");
    if (distanceToEnemy <= ability.range) {
      dealEnemyDamage(10 + equippedGear.power, "Ward Pulse");
    }
  }

  if (ability.id === "judgment") {
    let damage = 25 + equippedGear.power;
    if (enemy.chainTag === "Radiant") {
      damage += 24;
      player.health = Math.min(player.maxHealth, player.health + 12);
      applyChain("Consecrated", 5);
      pushLog("Consecrated chain", "Radiant detonated by Judgment");
    }
    dealEnemyDamage(damage, "Judgment");
  }
}

function updateCooldowns(delta: number) {
  activeAbilities().forEach((ability) => {
    cooldowns.set(ability.id, Math.max(0, (cooldowns.get(ability.id) ?? 0) - delta));
  });
}

function dealEnemyDamage(amount: number, source: string) {
  if (enemy.state === "dead") return;
  enemy.health = Math.max(0, enemy.health - amount);
  enemy.flashTimer = 0.12;
  pushLog(`${source}: ${amount}`, enemy.chainTag ? `Chain: ${enemy.chainTag}` : "");

  if (enemy.health <= 0) {
    enemy.state = "dead";
    enemy.visible = false;
    droppedGear = generateGear();
    respawnTimer = 5.2;
    pushLog(`${droppedGear.rarity} drop: ${droppedGear.name}`, "Press E to equip");
  }
}

function applyChain(tag: string, seconds: number) {
  enemy.chainTag = tag;
  enemy.chainTimer = seconds;
}

function updateBleed(delta: number) {
  if (enemy.bleedTimer <= 0) return;
  enemy.bleedTimer -= delta;
  enemy.bleedTick -= delta;
  if (enemy.bleedTick <= 0) {
    enemy.bleedTick = 1;
    dealEnemyDamage(4, "Bleed");
  }
}

function generateGear(): GearDrop {
  const roll = Math.random();
  const rarity: GearDrop["rarity"] = roll > 0.78 ? "Rare" : roll > 0.36 ? "Uncommon" : "Common";
  const names = {
    Common: ["Verdant Edge", "Copper Guard", "Field-Born Blade"],
    Uncommon: ["Thornlit Sabre", "Mender's Ward", "Amberbite Sword"],
    Rare: ["Oathroot Cleaver", "Dawnvein Aegis", "Stormleaf Brand"],
  };
  const list = names[rarity];
  const power = rarity === "Rare" ? 8 : rarity === "Uncommon" ? 4 : 2;
  const ability =
    rarity === "Rare"
      ? "Every third auto-attack applies Bleed and grants +8 meter."
      : rarity === "Uncommon"
        ? "Every third auto-attack applies Bleed."
        : "Every third auto-attack deals +5 damage.";
  return {
    name: list[Math.floor(Math.random() * list.length)],
    rarity,
    power,
    ability,
  };
}

function equipDrop() {
  if (player.lifeState !== "alive") return;
  if (!droppedGear) return;
  equippedGear = droppedGear;
  droppedGear = null;
  pushLog(`Equipped ${equippedGear.name}`, equippedGear.ability);
}

function defeatPlayer() {
  if (player.lifeState === "dead") return;
  player.lifeState = "dead";
  player.health = 0;
  player.stamina = 0;
  player.meter = 0;
  player.dodgeTime = 0;
  player.invulnerableTime = 0;
  playerRespawnTimer = 3.2;
  pushLog("You fall", "Regrowing at the grove heart");
}

function respawnPlayer() {
  player.lifeState = "alive";
  player.x = world.center.x;
  player.y = world.center.y + 230;
  player.health = player.maxHealth;
  player.stamina = player.maxStamina;
  player.meter = 0;
  player.invulnerableTime = 1.2;
  player.direction = "down";
  player.facing = { x: 0, y: -1 };
  player.anim = "idle";
  player.animFrame = 0;
  player.animTimer = 0;
  cooldowns.clear();
  pushLog("Regrown", "Back in the fight");
}

function respawnEnemy() {
  enemy.health = enemy.maxHealth;
  enemy.state = "idle";
  enemy.stateTimer = 1.2;
  enemy.chainTag = "";
  enemy.chainTimer = 0;
  enemy.bleedTimer = 0;
  enemy.x = world.center.x + (Math.random() - 0.5) * 520;
  enemy.y = world.center.y - 260 - Math.random() * 120;
  enemy.visible = true;
  pushLog("New elite enters the grove", "");
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.save();
  ctx.scale(camera.scale, camera.scale);
  ctx.translate(-camera.x, -camera.y);

  drawWorld();
  drawTelegraph();

  const drawables = [
    { y: enemy.y, draw: drawEnemy },
    { y: player.y, draw: drawPlayer },
  ].sort((a, b) => a.y - b.y);

  drawables.forEach((item) => item.draw());
  drawLoot();

  ctx.restore();
}

function drawWorld() {
  drawTileGround();
}

function drawTileGround() {
  const grassTile = grassTerrainTile ?? worldAssets.grassTile;
  if (!grassTile) {
    ctx.fillStyle = "#6b8f32";
    ctx.fillRect(0, 0, world.width, world.height);
    return;
  }

  drawBaseGrassLayer(grassTile);
  drawGrassVariantLayer();
  drawTerrainPropLayer();
  drawAnimatedGrassLayer();
}

function drawBaseGrassLayer(grassTile: SpriteFrame) {
  for (let y = 0; y < world.height; y += terrainTileSize) {
    for (let x = 0; x < world.width; x += terrainTileSize) {
      const col = x / terrainTileSize;
      const row = y / terrainTileSize;
      drawTileImage(grassTile, x, y, terrainTileSize + 1, terrainTileSize + 1, terrainNoise(col, row, 4) > 0.5, terrainNoise(col, row, 8) > 0.5);
    }
  }
}

function drawGrassVariantLayer() {
  const moss = grassTerrainVariants.moss_grass_plain;
  const dirt = grassTerrainVariants.grass_dirt_transition;
  const path = grassTerrainVariants.dirt_path_grass_edges;
  if (!moss && !dirt && !path) return;

  ctx.save();
  for (let y = 0; y < world.height; y += terrainTileSize) {
    for (let x = 0; x < world.width; x += terrainTileSize) {
      const col = x / terrainTileSize;
      const row = y / terrainTileSize;
      const roll = terrainNoise(col, row, 18);
      const tile =
        roll < 0.075 ? moss :
        roll < 0.105 ? dirt :
        roll < 0.128 ? path :
        null;
      if (!tile) continue;

      ctx.globalAlpha = roll < 0.075 ? 0.36 : 0.24;
      drawTileImage(tile, x, y, terrainTileSize + 1, terrainTileSize + 1, terrainNoise(col, row, 27) > 0.5, terrainNoise(col, row, 31) > 0.5);
    }
  }
  ctx.restore();
}

function drawTerrainPropLayer() {
  terrainOverlays.forEach((overlay) => {
    const prop = grassTerrainProps[overlay.kind];
    if (!prop) return;
    drawTerrainProp(prop, overlay.x, overlay.y, overlay.scale, overlay.alpha);
  });
}

function drawAnimatedGrassLayer() {
  if (animatedGrassFrames.length === 0) return;
  const currentFrame = Math.floor(performance.now() / 120);
  animatedGrassTufts.forEach((tuft) => {
    const frame = animatedGrassFrames[(currentFrame + tuft.phase) % animatedGrassFrames.length];
    drawTerrainProp(frame, tuft.x, tuft.y, tuft.scale, 0.5);
  });
}

function drawTileImage(tile: SpriteFrame, x: number, y: number, width: number, height: number, flipX: boolean, flipY: boolean) {
  ctx.save();
  ctx.translate(x + (flipX ? width : 0), y + (flipY ? height : 0));
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  ctx.drawImage(tile.canvas, 0, 0, width, height);
  ctx.restore();
}

function drawTerrainProp(prop: SpriteFrame, x: number, y: number, scale: number, alpha: number) {
  const width = prop.w * scale;
  const height = prop.h * scale;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(prop.canvas, x - width / 2, y - height, width, height);
  ctx.restore();
}

function terrainNoise(x: number, y: number, salt: number) {
  let value = Math.imul(x + 101, 374761393) ^ Math.imul(y + 59, 668265263) ^ Math.imul(salt + 17, 2246822519);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function drawPatch(asset: SpriteFrame, x: number, y: number, cols: number, rows: number, size: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      ctx.drawImage(asset.canvas, x + col * size, y + row * size, size + 1, size + 1);
    }
  }
  ctx.restore();
}

function drawTelegraph() {
  if (enemy.state !== "windup" && enemy.state !== "active") return;

  const active = enemy.state === "active";
  ctx.save();
  ctx.globalAlpha = active ? 0.58 : 0.34;
  ctx.fillStyle = active ? "#ff4f3e" : "#f2d36b";
  ctx.strokeStyle = active ? "#ffd0c8" : "#fff0a8";
  ctx.lineWidth = 3;

  if (enemy.currentAttack === "slam") {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 155, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    const angle = Math.atan2(enemy.attackForward.y, enemy.attackForward.x);
    const spread = Math.PI * 0.68;
    ctx.beginPath();
    ctx.moveTo(enemy.x, enemy.y);
    ctx.arc(enemy.x, enemy.y, 260, angle - spread / 2, angle + spread / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawPlayer() {
  drawShadow(player.x, player.y + 18, 52, 20, 0.34);

  const frames = sprites?.[player.direction][player.anim];
  const frame = frames?.[player.animFrame % frames.length];
  if (!frame) return;

  const scale = warriorSpriteDraw.scale;
  const width = frame.w * scale;
  const height = frame.h * scale;
  const flash = player.invulnerableTime > 0 && Math.floor(performance.now() / 75) % 2 === 0;
  const drawX = player.x - warriorSpriteDraw.anchorX * scale;
  const drawY = player.y + warriorSpriteDraw.baselineOffset - warriorSpriteDraw.anchorY * scale;

  ctx.save();
  ctx.globalAlpha = flash ? 0.54 : 1;
  ctx.drawImage(frame.canvas, drawX, drawY, width, height);
  ctx.restore();
}

function drawEnemy() {
  if (!enemy.visible) return;
  drawShadow(enemy.x, enemy.y + 20, 74, 28, 0.38);

  const frames = monsterSprites?.[enemy.direction][enemy.anim];
  const frame = frames?.[enemy.animFrame % frames.length];
  if (frame) {
    const scale = enemy.anim === "attack" ? 1.85 : 1.78;
    const width = frame.w * scale;
    const height = frame.h * scale;
    ctx.save();
    ctx.filter = enemy.flashTimer > 0 ? "brightness(1.55) saturate(1.35)" : "none";
    ctx.drawImage(frame.canvas, enemy.x - width / 2, enemy.y - height + 34, width, height);
    ctx.restore();
  }

  if (targetLocked) {
    ctx.save();
    ctx.strokeStyle = "#f2d36b";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.ellipse(enemy.x, enemy.y + 12, 58, 34, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawRock(obstacle: (typeof obstacles)[number]) {
  const asset = worldAssets[obstacle.asset];
  if (asset) {
    drawShadow(obstacle.x, obstacle.y + obstacle.ry * 0.55, obstacle.rx * 1.35, obstacle.ry * 0.72, 0.28);
    drawWorldAsset(obstacle.asset, obstacle.x, obstacle.y + obstacle.ry, obstacle.scale);
    return;
  }

  drawShadow(obstacle.x, obstacle.y + obstacle.ry * 0.55, obstacle.rx * 1.4, obstacle.ry * 0.72, 0.3);

  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  ctx.fillStyle = "#4e6041";
  ctx.strokeStyle = "#1c2a1e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-obstacle.rx, -8);
  ctx.lineTo(-obstacle.rx * 0.4, -obstacle.ry);
  ctx.lineTo(obstacle.rx * 0.35, -obstacle.ry * 0.84);
  ctx.lineTo(obstacle.rx, -obstacle.ry * 0.14);
  ctx.lineTo(obstacle.rx * 0.64, obstacle.ry);
  ctx.lineTo(-obstacle.rx * 0.52, obstacle.ry * 0.82);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.moveTo(-obstacle.rx * 0.35, -obstacle.ry * 0.7);
  ctx.lineTo(obstacle.rx * 0.35, -obstacle.ry * 0.84);
  ctx.lineTo(obstacle.rx * 0.2, -obstacle.ry * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawWorldAsset(assetName: WorldAssetName, x: number, y: number, scale: number) {
  const asset = worldAssets[assetName];
  if (!asset) return;

  const width = asset.w * scale;
  const height = asset.h * scale;
  const shouldShadow = assetName !== "grassTile" && assetName !== "mossTile" && assetName !== "waterTile" && assetName !== "stoneTile";

  if (shouldShadow) {
    drawShadow(x, y - Math.min(12, height * 0.08), Math.max(18, width * 0.34), Math.max(8, height * 0.1), 0.22);
  }

  ctx.drawImage(asset.canvas, x - width / 2, y - height, width, height);
}

function drawLoot() {
  if (!droppedGear) return;
  const x = enemy.x + 42;
  const y = enemy.y + 28;
  if (worldAssets.coin) {
    drawWorldAsset("coin", x, y + 16, 1.05);
    return;
  }

  ctx.save();
  ctx.fillStyle = "#f2d36b";
  ctx.strokeStyle = "#513812";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(x - 16, y - 12, 32, 24, 4);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawShadow(x: number, y: number, rx: number, ry: number, alpha: number) {
  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function updateHud() {
  const currentClass = selectedClass();
  const healthValue = player.health / player.maxHealth;
  const staminaValue = player.stamina / player.maxStamina;
  const meterValue = player.meter / player.maxMeter;
  playerPanel.innerHTML = `
    <div class="label-row"><strong>${currentClass.name}</strong><span>${Math.ceil(player.health)} / ${player.maxHealth}</span></div>
    <div class="bar"><div class="fill health" style="--value:${healthValue}"></div></div>
    <div class="label-row"><span>Stamina</span><span>${Math.floor(player.stamina)}</span></div>
    <div class="bar"><div class="fill stamina" style="--value:${staminaValue}"></div></div>
    <div class="label-row"><span>Meter</span><span>${Math.floor(player.meter)}</span></div>
    <div class="bar"><div class="fill meter" style="--value:${meterValue}"></div></div>
  `;

  const targetValue = enemy.health / enemy.maxHealth;
  targetPanel.innerHTML = `
    <div class="label-row"><strong>Rootbound Elite</strong><span>${enemy.state === "dead" ? "Respawning" : `${Math.ceil(enemy.health)} / ${enemy.maxHealth}`}</span></div>
    <div class="bar"><div class="fill target-health" style="--value:${targetValue}"></div></div>
    <div class="label-row"><span>Chain</span><span>${enemy.chainTag || "None"}</span></div>
    <div class="label-row"><span>Gear</span><span>${equippedGear.rarity}</span></div>
    <div class="${droppedGear ? "loot" : ""}">${droppedGear ? `${droppedGear.name}: ${droppedGear.ability}` : equippedGear.ability}</div>
  `;

  abilityPanel.innerHTML = activeAbilities()
    .map((ability) => {
      const cooldown = cooldowns.get(ability.id) ?? 0;
      const ready = cooldown <= 0 && player.meter >= ability.cost;
      const status = cooldown > 0 ? `${cooldown.toFixed(1)}s` : `${ability.cost} meter`;
      return `
        <div class="ability ${ready ? "ready" : ""}">
          <div class="ability-key">${ability.key}</div>
          <div class="ability-name">${ability.name}</div>
          <div class="ability-cost">${status}</div>
        </div>
      `;
    })
    .join("");
}

function pushLog(message: string, detail: string) {
  const line = document.createElement("div");
  line.innerHTML = detail ? `<strong>${message}</strong> ${detail}` : `<strong>${message}</strong>`;
  eventLog.prepend(line);
  while (eventLog.children.length > 5) {
    eventLog.lastElementChild?.remove();
  }
}

function renderCharacterSelect() {
  characterGrid.innerHTML = characterOrder
    .map((id) => {
      const option = characterClasses[id];
      const selected = option.id === selectedClassId;
      const portrait = option.portraitUrl
        ? `<img src="${option.portraitUrl}" alt="" />`
        : `<span>${option.glyph}</span>`;
      return `
        <button
          class="character-card ${selected ? "is-selected" : ""} ${option.implemented ? "" : "is-planned"}"
          data-class-id="${option.id}"
          type="button"
          style="--class-accent: ${option.accent}"
          aria-pressed="${selected}"
        >
          <div class="portrait ${option.portraitUrl ? "has-art" : ""}">${portrait}</div>
          <div class="card-copy">
            <span>${option.status}</span>
            <strong>${option.name}</strong>
          </div>
        </button>
      `;
    })
    .join("");

  const currentClass = selectedClass();
  continueButton.disabled = !currentClass.implemented;
  characterDetail.style.setProperty("--class-accent", currentClass.accent);
  characterDetail.innerHTML = `
    <div class="detail-status">${currentClass.status}</div>
    <div class="detail-portrait ${currentClass.portraitUrl ? "has-art" : ""}">
      ${currentClass.portraitUrl ? `<img src="${currentClass.portraitUrl}" alt="" />` : `<span>${currentClass.glyph}</span>`}
    </div>
    <h2>${currentClass.name}</h2>
    <h3>${currentClass.title}</h3>
    <p>${currentClass.role}</p>
    <div class="detail-stat-grid">
      <div><span>Weapon</span><strong>${currentClass.weapon}</strong></div>
      <div><span>Health</span><strong>${currentClass.stats.health}</strong></div>
      <div><span>Stamina</span><strong>${currentClass.stats.stamina}</strong></div>
      <div><span>Meter</span><strong>${currentClass.stats.meter}</strong></div>
    </div>
    <div class="detail-abilities">
      ${currentClass.abilities
        .map((ability) => `<div><kbd>${ability.key}</kbd><span>${ability.name}</span><em>${ability.cost} meter</em></div>`)
        .join("")}
    </div>
    <div class="detail-note">
      ${currentClass.implemented ? "Ready for the current prototype." : "Class slot planned; combat kit is a placeholder."}
    </div>
  `;
}

function showCharacterSelect() {
  if (!isTitleActive) return;
  isTitleActive = false;
  isCharacterSelectActive = true;
  titleScreen.classList.add("is-hidden");
  characterSelect.classList.remove("is-hidden");
  renderCharacterSelect();
}

function showTitleScreen() {
  isTitleActive = true;
  isCharacterSelectActive = false;
  characterSelect.classList.add("is-hidden");
  titleScreen.classList.remove("is-hidden");
}

function moveCharacterSelection(direction: number) {
  const currentIndex = characterOrder.indexOf(selectedClassId);
  const nextIndex = (currentIndex + direction + characterOrder.length) % characterOrder.length;
  selectedClassId = characterOrder[nextIndex];
  renderCharacterSelect();
}

function applySelectedClass() {
  const currentClass = selectedClass();
  if (!currentClass.implemented) return false;

  player.maxHealth = currentClass.stats.health;
  player.health = currentClass.stats.health;
  player.maxStamina = currentClass.stats.stamina;
  player.stamina = currentClass.stats.stamina;
  player.maxMeter = currentClass.stats.meter;
  player.meter = 0;
  cooldowns.clear();
  return true;
}

function startGame() {
  if (!isCharacterSelectActive || !applySelectedClass()) return;
  isCharacterSelectActive = false;
  characterSelect.classList.add("is-hidden");
  hud.classList.remove("is-hidden");
  pushLog(`${selectedClass().name} enters the grove`, selectedClass().weapon);
}

function animate(now: number) {
  const delta = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;

  updateCooldowns(delta);
  updatePlayer(delta);
  updateCombat(delta);
  updateCamera(delta);
  updateHud();
  draw();

  requestAnimationFrame(animate);
}

function clampToArena(entity: Vec2) {
  const offset = { x: entity.x - world.center.x, y: (entity.y - world.center.y) / 0.74 };
  const current = length(offset);
  if (current > world.safeRadius - 24) {
    normalize(offset);
    entity.x = world.center.x + offset.x * (world.safeRadius - 24);
    entity.y = world.center.y + offset.y * (world.safeRadius - 24) * 0.74;
  }
}

function resolveObstacleCollision(entity: Vec2, radius: number) {
  obstacles.forEach((obstacle) => {
    const dx = entity.x - obstacle.x;
    const dy = entity.y - obstacle.y;
    const nx = dx / (obstacle.rx + radius);
    const ny = dy / (obstacle.ry + radius);
    const overlap = nx * nx + ny * ny;
    if (overlap > 0 && overlap < 1) {
      const angle = Math.atan2(ny, nx);
      entity.x = obstacle.x + Math.cos(angle) * (obstacle.rx + radius);
      entity.y = obstacle.y + Math.sin(angle) * (obstacle.ry + radius);
    }
  });
}

startButton.addEventListener("click", showCharacterSelect);
backButton.addEventListener("click", showTitleScreen);
continueButton.addEventListener("click", startGame);

characterGrid.addEventListener("click", (event) => {
  const card = (event.target as HTMLElement).closest<HTMLButtonElement>(".character-card");
  const classId = card?.dataset.classId as ClassId | undefined;
  if (!classId || !characterClasses[classId]) return;
  selectedClassId = classId;
  renderCharacterSelect();
});

window.addEventListener("keydown", (event) => {
  if (isTitleActive) {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      showCharacterSelect();
    }
    return;
  }

  if (isCharacterSelectActive) {
    if (event.code === "ArrowRight" || event.code === "ArrowDown") {
      event.preventDefault();
      moveCharacterSelection(1);
    }
    if (event.code === "ArrowLeft" || event.code === "ArrowUp") {
      event.preventDefault();
      moveCharacterSelection(-1);
    }
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      startGame();
    }
    if (event.code === "Escape") {
      event.preventDefault();
      showTitleScreen();
    }
    return;
  }

  const action = gameplayActionForCode(event.code);
  if (!action) return;

  pressedActions.add(action);

  if (action === "target-next") {
    event.preventDefault();
    targetLocked = true;
    pushLog("Target locked", "Rootbound Elite");
  }
  if (action === "special-1") castSpecial(0);
  if (action === "special-2") castSpecial(1);
  if (action === "special-3") castSpecial(2);
  if (action === "equip") equipDrop();
});

window.addEventListener("keyup", (event) => {
  const action = gameplayActionForCode(event.code);
  if (action) pressedActions.delete(action);
});
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
Promise.all([loadSprites(), loadMonsterSprites(), loadWorldAssets()]).then(() => {
  pushLog("MotherSeed prototype ready", "Close for melee, dodge the red telegraphs");
  requestAnimationFrame((now) => {
    lastFrame = now;
    animate(now);
  });
});
