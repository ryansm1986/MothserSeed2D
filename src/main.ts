import "./style.css";
import rpgAssetsUrl from "../assets/RPGAssets.png?url";
import titleImageUrl from "../assets/Title.png?url";
import titleMusicUrl from "../assets/Music/Mothertree_Intro_Short.mp3?url";
import overworldMusicUrl from "../assets/Music/Mothertree_Chill_Overworld.mp3?url";
import largeGrassTerrainUrl from "../assets/world/terrain/large_grass.png?url";
import magicMissileUrl from "../assets/characters/purple_mage/projectiles/magic_missile/magic_missile.png?url";
import moonfallUrl from "../assets/characters/purple_mage/spells/moonfall/moonfall.png?url";
import moonfallCrashUrl from "../assets/characters/purple_mage/spells/moonfall/sound_effects/Crashing.mp3?url";
import moonfallPortalUrl from "../assets/characters/purple_mage/spells/moonfall/sound_effects/Portal.mp3?url";
import moonfallVoiceUrl from "../assets/characters/purple_mage/spells/moonfall/voiceline/Moonfall.mp3?url";
import golemRockSlamCrashUrl from "../assets/sound_effects/Crashing.mp3?url";
import { characterClasses, characterOrder } from "./game/content/classes";
import { gameplayActionForCode, movementFromActions, type GameplayAction } from "./game/input-actions";
import { clamp, directionFromVector, distance, dot, length, lengthSq, normalize } from "./game/math";
import type {
  AnimationName,
  ClassId,
  CombatState,
  DirectionName,
  FrameRect,
  GearDrop,
  MonsterAnimationName,
  PlayerLifeState,
  SpriteBounds,
  SpriteFrame,
  TelegraphKind,
  Vec2,
  WorldAssetName,
} from "./game/types";

const warriorFrameUrls = import.meta.glob([
  "../assets/characters/green_warrior_v3/idle/frames/idle_*_[0-9][0-9].png",
  "../assets/characters/green_warrior_v3/walk/frames/walk_*_[0-9][0-9].png",
  "../assets/characters/green_warrior_v3/sprint/frames/sprint_*_[0-9][0-9].png",
  "../assets/characters/green_warrior_v3/dodge/frames/dodge_*_[0-9][0-9].png",
  "../assets/characters/green_warrior_v3/attack/frames/attack_*_[0-9][0-9].png",
  "../assets/characters/green_warrior_v3/special/frames/special_*_[0-9][0-9].png",
], {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;
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
const mossGolemFrameUrls = import.meta.glob([
  "../assets/monsters/moss_golem_v2/*/frames/*.png",
], {
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
const warriorSpriteDraw = {
  standard: {
    scale: 0.92,
    anchorX: 64,
    anchorY: 120,
    baselineOffset: 28,
  },
  wideAction: {
    scale: 0.54,
    anchorX: 192,
    anchorY: 376,
    baselineOffset: 28,
  },
};
const purpleMageSpriteDraw = {
  standard: {
    scale: 0.98,
    anchorX: 64,
    anchorY: 118,
    baselineOffset: 28,
    targetContentHeight: 120,
  },
  wideAction: {
    scale: 0.98,
    anchorX: 96,
    anchorY: 140,
    baselineOffset: 28,
    targetContentHeight: 120,
  },
  dodge: {
    scale: 0.54,
    anchorX: 128,
    anchorY: 241,
    baselineOffset: 28,
    targetContentHeight: 112,
  },
  specialCast: {
    scale: 0.68,
    anchorX: 160,
    anchorY: 298,
    baselineOffset: 28,
  },
};
const warriorAttackDirectionScale: Partial<Record<DirectionName, number>> = {
  up: 1.08,
  left: 1.14,
  right: 1.14,
};
const warriorDirections = ["down", "down_right", "right", "up_right", "up", "up_left", "left", "down_left"] as const satisfies readonly DirectionName[];
const monsterDirections = warriorDirections;
const purpleMageDirectionAssets: Record<DirectionName, string> = {
  down: "south",
  down_right: "southeast",
  right: "east",
  up_right: "northeast",
  up: "north",
  up_left: "northwest",
  left: "west",
  down_left: "southwest",
};
const purpleMageIdleDirectionFallbackAssets: Record<DirectionName, "south" | "east" | "north" | "west"> = {
  down: "south",
  down_right: "south",
  right: "east",
  up_right: "north",
  up: "north",
  up_left: "north",
  left: "west",
  down_left: "south",
};
const warriorAnimationPaths = {
  idle: "idle",
  walk: "walk",
  run: "sprint",
  sprint: "sprint",
  dodge_roll: "dodge",
  attack1: "attack",
  attack2: "special",
} as const satisfies Record<Exclude<AnimationName, "damage" | "victory">, string>;
const mossGolemSpriteDraw = {
  v2Standard: {
    scale: 0.74,
    anchorX: 192,
    anchorY: 360,
    baselineOffset: 34,
  },
  v2Action: {
    scale: 0.48,
    anchorX: 576,
    anchorY: 1128,
    baselineOffset: 34,
  },
};
const enemyAttackTimings = {
  rock_spray: {
    windup: 1.2,
    active: 0.4,
    recovery: 0.9,
  },
  rock_slam: {
    windup: 1.35,
    active: 0.45,
    recovery: 0.9,
  },
} as const satisfies Record<TelegraphKind, { windup: number; active: number; recovery: number }>;
const magicMissileCastTiming = {
  releaseDelay: 0.28,
  attackFlash: 0.7,
} as const;
const magicMissileLifetime = 1.4;
const magicMissileAnimationRate = 0.075;
// Source missile frames are authored with the left side as the forward edge.
const magicMissileForwardRotation = Math.PI;
const moonfallCastTiming = {
  releaseDelay: 0.62,
  specialFlash: 1.08,
} as const;
const moonfallStrikeDuration = 1.64;
const moonfallImpactDuration = 0.68;
const moonfallFrameScale = 0.864;
const moonfallAudio = {
  voiceVolume: 0.8,
  portalVolume: 0.62,
  crashVolume: 0.82,
} as const;
const golemAudio = {
  rockSlamCrashVolume: 0.82,
} as const;
const titleMusicVolume = 0.54;
const defaultAttackCooldown = 3;
const audioSettingsStorageKey = "motherseed-audio-settings";
const defaultAudioSettings = {
  music: 0.8,
  sfx: 0.8,
};

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app root");
}

app.innerHTML = `
  <div class="game-shell"></div>
  <section class="title-screen" style="--title-image: url('${titleImageUrl}')">
    <nav class="title-menu" aria-label="Main menu">
      <button class="title-menu-option start-button" type="button">Start</button>
      <button class="title-menu-option title-controls-button" type="button">Controls</button>
      <button class="title-menu-option title-sound-button" type="button">Sound</button>
    </nav>
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
        <div class="select-hint">Five paths. Three awaken in this build.</div>
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
  <section class="pause-menu is-hidden" role="dialog" aria-modal="true" aria-labelledby="pause-title">
    <div class="pause-frame" tabindex="-1">
      <header class="pause-header">
        <div>
          <p class="pause-kicker">Grove suspended</p>
          <h1 id="pause-title">Paused</h1>
        </div>
        <button class="menu-button resume-button" type="button">Resume</button>
      </header>
      <div class="pause-layout">
        <nav class="pause-tabs" aria-label="Pause menu">
          <button class="pause-tab is-active" type="button" data-pause-tab="controls">Controls</button>
          <button class="pause-tab" type="button" data-pause-tab="sound">Sound</button>
        </nav>
        <div class="pause-content">
          <section class="pause-panel" data-pause-panel="controls" aria-label="Controls">
            <div class="control-list">
              <div><kbd>WASD</kbd><span>Move</span></div>
              <div><kbd>Shift</kbd><span>Sprint</span></div>
              <div><kbd>Space</kbd><span>Dodge</span></div>
              <div><kbd>Mouse</kbd><span>Target</span></div>
              <div><kbd>Tab</kbd><span>Lock target</span></div>
              <div><kbd>1</kbd><span>First special</span></div>
              <div><kbd>2</kbd><span>Second special</span></div>
              <div><kbd>3</kbd><span>Third special</span></div>
              <div><kbd>E</kbd><span>Equip drop</span></div>
              <div><kbd>Esc</kbd><span>Pause</span></div>
            </div>
          </section>
          <section class="pause-panel is-hidden" data-pause-panel="sound" aria-label="Sound">
            <div class="sound-controls">
              <label class="sound-control" for="music-volume">
                <span>Music</span>
                <input id="music-volume" type="range" min="0" max="100" step="1" />
                <strong id="music-volume-value">80%</strong>
              </label>
              <label class="sound-control" for="sfx-volume">
                <span>Sound effects</span>
                <input id="sfx-volume" type="range" min="0" max="100" step="1" />
                <strong id="sfx-volume-value">80%</strong>
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  </section>
`;

const shell = document.querySelector<HTMLDivElement>(".game-shell")!;
const titleScreen = document.querySelector<HTMLElement>(".title-screen")!;
const startButton = document.querySelector<HTMLButtonElement>(".start-button")!;
const titleControlsButton = document.querySelector<HTMLButtonElement>(".title-controls-button")!;
const titleSoundButton = document.querySelector<HTMLButtonElement>(".title-sound-button")!;
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
const pauseMenu = document.querySelector<HTMLElement>(".pause-menu")!;
const pauseFrame = document.querySelector<HTMLDivElement>(".pause-frame")!;
const pauseKicker = document.querySelector<HTMLElement>(".pause-kicker")!;
const pauseTitle = document.querySelector<HTMLElement>("#pause-title")!;
const resumeButton = document.querySelector<HTMLButtonElement>(".resume-button")!;
const pauseTabs = Array.from(document.querySelectorAll<HTMLButtonElement>(".pause-tab"));
const pausePanels = Array.from(document.querySelectorAll<HTMLElement>(".pause-panel"));
const musicVolumeInput = document.querySelector<HTMLInputElement>("#music-volume")!;
const sfxVolumeInput = document.querySelector<HTMLInputElement>("#sfx-volume")!;
const musicVolumeValue = document.querySelector<HTMLElement>("#music-volume-value")!;
const sfxVolumeValue = document.querySelector<HTMLElement>("#sfx-volume-value")!;

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
  dodgeAnimTime: 0,
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
  currentAttack: "rock_spray" as TelegraphKind,
  attackForward: { x: 0, y: 1 },
  hasHitPlayer: false,
  rockSlamCrashPlayed: false,
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
type PlayerSpriteSet = Record<DirectionName, Record<AnimationName, SpriteFrame[]>>;
type DrawProfile = { scale: number; anchorX: number; anchorY: number; baselineOffset: number; targetContentHeight?: number; minScale?: number };
type MagicMissileProjectile = {
  x: number;
  y: number;
  rotation: number;
  speed: number;
  damage: number;
  ttl: number;
};
type MoonfallStrike = {
  x: number;
  startY: number;
  targetY: number;
  timer: number;
  duration: number;
  damage: number;
  radius: number;
  impacted: boolean;
  crashPlayed: boolean;
};
type PendingMagicMissileCast = {
  damage: number;
  timer: number;
};
type PendingMoonfallCast = {
  x: number;
  y: number;
  damage: number;
  radius: number;
  timer: number;
};
type FrameUrlResolution = {
  urls: string[];
  mirrorX?: boolean;
};

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

const groveClearings = [
  { x: world.center.x - 20, y: world.center.y + 40, rx: 500, ry: 315, rotation: -0.08, alpha: 0.18 },
  { x: world.center.x - 430, y: world.center.y + 260, rx: 245, ry: 130, rotation: -0.28, alpha: 0.13 },
  { x: world.center.x + 420, y: world.center.y - 155, rx: 280, ry: 150, rotation: 0.18, alpha: 0.12 },
];

const grovePathRoutes: Vec2[][] = [
  [
    { x: -140, y: world.center.y + 310 },
    { x: world.center.x - 520, y: world.center.y + 255 },
    { x: world.center.x - 150, y: world.center.y + 120 },
    { x: world.center.x + 285, y: world.center.y - 15 },
    { x: world.width + 140, y: world.center.y - 145 },
  ],
  [
    { x: world.center.x - 60, y: -120 },
    { x: world.center.x - 100, y: world.center.y - 365 },
    { x: world.center.x + 40, y: world.center.y - 40 },
    { x: world.center.x + 170, y: world.center.y + 315 },
    { x: world.center.x + 230, y: world.height + 120 },
  ],
];

const pressedActions = new Set<GameplayAction>();
let sprintExhaustedUntilRelease = false;
const cooldowns = new Map<string, number>();
let playerSprites: Partial<Record<ClassId, PlayerSpriteSet>> = {};
let monsterSprites: Record<DirectionName, Record<MonsterAnimationName, SpriteFrame[]>> | null = null;
let worldAssets: Partial<Record<WorldAssetName, SpriteFrame>> = {};
let grassTerrainTile: SpriteFrame | null = null;
let grassTerrainProps: Record<string, SpriteFrame> = {};
let animatedGrassFrames: SpriteFrame[] = [];
let magicMissileFrames: SpriteFrame[] = [];
let moonfallFrames: SpriteFrame[] = [];
const magicMissiles: MagicMissileProjectile[] = [];
const moonfallStrikes: MoonfallStrike[] = [];
let pendingMagicMissileCast: PendingMagicMissileCast | null = null;
let pendingMoonfallCast: PendingMoonfallCast | null = null;
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
let isPaused = false;
let pauseMenuSource: "gameplay" | "title" | null = null;
let lastFrame = performance.now();
let titleMusic: HTMLAudioElement | null = null;
let gameplayMusic: HTMLAudioElement | null = null;
let audioSettings = loadAudioSettings();

function isGameplayActive() {
  return !isTitleActive && !isCharacterSelectActive && !isPaused;
}

function isGameplayVisible() {
  return !isTitleActive && !isCharacterSelectActive;
}

function loadAudioSettings() {
  try {
    const stored = localStorage.getItem(audioSettingsStorageKey);
    if (!stored) return { ...defaultAudioSettings };
    const parsed = JSON.parse(stored) as Partial<typeof defaultAudioSettings>;
    return {
      music: clamp(Number(parsed.music ?? defaultAudioSettings.music), 0, 1),
      sfx: clamp(Number(parsed.sfx ?? defaultAudioSettings.sfx), 0, 1),
    };
  } catch {
    return { ...defaultAudioSettings };
  }
}

function saveAudioSettings() {
  localStorage.setItem(audioSettingsStorageKey, JSON.stringify(audioSettings));
}

function scaledVolume(baseVolume: number, categoryVolume: number) {
  return clamp(baseVolume, 0, 1) * clamp(categoryVolume, 0, 1);
}

function updateAudioSettingsUi() {
  const musicPercent = Math.round(audioSettings.music * 100);
  const sfxPercent = Math.round(audioSettings.sfx * 100);
  musicVolumeInput.value = String(musicPercent);
  sfxVolumeInput.value = String(sfxPercent);
  musicVolumeValue.textContent = `${musicPercent}%`;
  sfxVolumeValue.textContent = `${sfxPercent}%`;
}

function applyMusicVolume() {
  if (titleMusic) {
    titleMusic.volume = scaledVolume(titleMusicVolume, audioSettings.music);
  }
  if (gameplayMusic) {
    gameplayMusic.volume = scaledVolume(0.48, audioSettings.music);
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load ${url}`));
    image.src = url;
  });
}

function playSound(url: string, volume = 1) {
  if (!isGameplayActive()) return;
  const sound = new Audio(url);
  sound.volume = scaledVolume(volume, audioSettings.sfx);
  sound.play().catch(() => {
    // Browsers may block audio until the first trusted interaction; gameplay continues silently.
  });
}

function ensureTitleMusic() {
  if (titleMusic) return titleMusic;
  titleMusic = new Audio(titleMusicUrl);
  titleMusic.loop = true;
  applyMusicVolume();
  return titleMusic;
}

function ensureGameplayMusic() {
  if (gameplayMusic) return gameplayMusic;
  gameplayMusic = new Audio(overworldMusicUrl);
  gameplayMusic.loop = true;
  applyMusicVolume();
  return gameplayMusic;
}

function playTitleMusic() {
  if (isGameplayActive()) return;
  const music = ensureTitleMusic();
  music.play().catch(() => {
    // Menu music waits for the first trusted interaction if autoplay is blocked.
  });
}

function stopTitleMusic() {
  if (!titleMusic) return;
  titleMusic.pause();
  titleMusic.currentTime = 0;
}

function playGameplayMusic() {
  if (!isGameplayVisible()) return;
  const music = ensureGameplayMusic();
  music.play().catch(() => {
    // Gameplay continues if the browser defers music until another interaction.
  });
}

function stopGameplayMusic() {
  if (!gameplayMusic) return;
  gameplayMusic.pause();
  gameplayMusic.currentTime = 0;
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
    return makeSpriteFrame(buffer);
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

  return makeSpriteFrame(trimmed);
}

function makeGreenScreenFrame(image: HTMLImageElement): SpriteFrame {
  const buffer = document.createElement("canvas");
  buffer.width = image.naturalWidth;
  buffer.height = image.naturalHeight;
  const frameCtx = buffer.getContext("2d")!;
  frameCtx.drawImage(image, 0, 0);

  const pixels = frameCtx.getImageData(0, 0, buffer.width, buffer.height);
  let minX = buffer.width;
  let minY = buffer.height;
  let maxX = -1;
  let maxY = -1;

  for (let index = 0; index < pixels.data.length; index += 4) {
    const r = pixels.data[index];
    const g = pixels.data[index + 1];
    const b = pixels.data[index + 2];
    const isGreenScreen = g > 150 && r < 100 && b < 120;
    if (isGreenScreen) {
      pixels.data[index + 3] = 0;
    } else {
      const pixelIndex = index / 4;
      const x = pixelIndex % buffer.width;
      const y = Math.floor(pixelIndex / buffer.width);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  frameCtx.putImageData(pixels, 0, 0);

  if (maxX < minX || maxY < minY) {
    return makeSpriteFrame(buffer);
  }

  const padding = 2;
  const trimmedX = Math.max(0, minX - padding);
  const trimmedY = Math.max(0, minY - padding);
  const trimmedW = Math.min(buffer.width - trimmedX, maxX - trimmedX + 1 + padding);
  const trimmedH = Math.min(buffer.height - trimmedY, maxY - trimmedY + 1 + padding);
  const trimmed = document.createElement("canvas");
  trimmed.width = trimmedW;
  trimmed.height = trimmedH;
  trimmed.getContext("2d")!.drawImage(buffer, trimmedX, trimmedY, trimmedW, trimmedH, 0, 0, trimmedW, trimmedH);

  return makeSpriteFrame(trimmed);
}

function makeImageFrame(image: HTMLImageElement): SpriteFrame {
  const buffer = document.createElement("canvas");
  buffer.width = image.naturalWidth;
  buffer.height = image.naturalHeight;
  buffer.getContext("2d")!.drawImage(image, 0, 0);
  return makeSpriteFrame(buffer);
}

function makeSpriteFrame(canvas: HTMLCanvasElement): SpriteFrame {
  return { canvas, w: canvas.width, h: canvas.height, bounds: measureOpaqueBounds(canvas) };
}

function measureOpaqueBounds(canvas: HTMLCanvasElement, alphaThreshold = 8): SpriteBounds | undefined {
  const frameCtx = canvas.getContext("2d")!;
  const pixels = frameCtx.getImageData(0, 0, canvas.width, canvas.height);
  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = -1;
  let maxY = -1;

  for (let index = 0; index < pixels.data.length; index += 4) {
    if (pixels.data[index + 3] <= alphaThreshold) continue;
    const pixelIndex = index / 4;
    const x = pixelIndex % canvas.width;
    const y = Math.floor(pixelIndex / canvas.width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  if (maxX < minX || maxY < minY) return undefined;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

function makeMoonfallFrame(image: HTMLImageElement): SpriteFrame {
  const frame = makeImageFrame(image);
  const frameCtx = frame.canvas.getContext("2d")!;
  const pixels = frameCtx.getImageData(0, 0, frame.w, frame.h);

  for (let index = 0; index < pixels.data.length; index += 4) {
    const pixelIndex = index / 4;
    const y = Math.floor(pixelIndex / frame.w);
    const inGuideBand = y < 80 || y > frame.h - 80;
    const isWhiteGuide = pixels.data[index] > 220 && pixels.data[index + 1] > 220 && pixels.data[index + 2] > 220;

    if (inGuideBand && isWhiteGuide) {
      pixels.data[index + 3] = 0;
    }
  }

  frameCtx.putImageData(pixels, 0, 0);
  return makeSpriteFrame(frame.canvas);
}

function mirrorFrameHorizontally(frame: SpriteFrame): SpriteFrame {
  const buffer = document.createElement("canvas");
  buffer.width = frame.w;
  buffer.height = frame.h;
  const bufferCtx = buffer.getContext("2d")!;
  bufferCtx.translate(frame.w, 0);
  bufferCtx.scale(-1, 1);
  bufferCtx.drawImage(frame.canvas, 0, 0);
  return makeSpriteFrame(buffer);
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
  const [warriorSprites, mageSprites] = await Promise.all([
    loadWarriorSprites(),
    loadPurpleMageSprites(),
  ]);
  playerSprites = {
    warrior: warriorSprites,
    cleric: warriorSprites,
    mage: mageSprites,
  };
}

async function loadWarriorSprites(): Promise<PlayerSpriteSet> {
  const output = {} as PlayerSpriteSet;
  const animations = ["idle", "walk", "sprint", "dodge_roll", "attack1", "attack2"] as const satisfies readonly AnimationName[];

  await Promise.all(warriorDirections.map(async (direction) => {
    output[direction] = {} as Record<AnimationName, SpriteFrame[]>;
    await Promise.all(animations.map(async (animation) => {
      const urls = getWarriorFrameUrls(direction, animation);
      const frames = await Promise.all(urls.map(async (url) => makeImageFrame(await loadImage(url))));
      output[direction][animation] = animation === "idle" ? makePingPongFrames(frames) : frames;
    }));
    output[direction].run = output[direction].sprint;
    output[direction].damage = output[direction].idle;
    output[direction].victory = output[direction].idle;
  }));

  return output;
}

async function loadPurpleMageSprites(): Promise<PlayerSpriteSet> {
  const output = {} as PlayerSpriteSet;
  const animations = ["idle", "walk", "sprint", "dodge_roll", "attack1", "attack2"] as const satisfies readonly AnimationName[];

  await Promise.all(warriorDirections.map(async (direction) => {
    output[direction] = {} as Record<AnimationName, SpriteFrame[]>;
    await Promise.all(animations.map(async (animation) => {
      const source = getPurpleMageFrameSource(direction, animation);
      const frames = await Promise.all(source.urls.map(async (url) => makeImageFrame(await loadImage(url))));
      const resolvedFrames = source.mirrorX ? frames.map(mirrorFrameHorizontally) : frames;
      output[direction][animation] = resolvedFrames;
    }));
    output[direction].run = output[direction].sprint;
    output[direction].damage = output[direction].idle;
    output[direction].victory = output[direction].idle;
  }));

  return output;
}

function makePingPongFrames<T>(frames: T[]): T[] {
  if (frames.length <= 2) return frames;
  return [...frames, ...frames.slice(1, -1).reverse()];
}

function getWarriorFrameUrls(direction: DirectionName, animation: AnimationName): string[] {
  if (animation === "damage" || animation === "victory") return [];

  const assetAnimation = warriorAnimationPaths[animation];
  const urls = findWarriorFrameUrls(assetAnimation, direction);

  if (urls.length > 0) return urls;

  if (animation === "sprint" || animation === "run") {
    const fallbackUrls = findWarriorFrameUrls("walk", direction);
    if (fallbackUrls.length > 0) {
      console.warn(`Missing green_warrior_v3 ${assetAnimation}/${direction}; using walk frames until that sprint direction is exported.`);
      return fallbackUrls;
    }
  }

  if (animation === "attack2") {
    const fallbackUrls = findWarriorFrameUrls("attack", direction);
    if (fallbackUrls.length > 0) {
      console.warn(`Missing green_warrior_v3 ${assetAnimation}/${direction}; using attack frames until that special direction is exported.`);
      return fallbackUrls;
    }
  }

  throw new Error(`Missing green_warrior_v3 frames for ${direction}/${animation}. Expected canonical ${assetAnimation}_${direction}_NN.png files.`);
}

function findWarriorFrameUrls(assetAnimation: string, direction: DirectionName): string[] {
  const prefix = `../assets/characters/green_warrior_v3/${assetAnimation}/frames/${assetAnimation}_${direction}_`;
  const urls = Object.entries(warriorFrameUrls)
    .filter(([path]) => path.startsWith(prefix) && /^\d{2}\.png$/.test(path.slice(prefix.length)))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, url]) => url);

  return urls;
}

function getPurpleMageFrameSource(direction: DirectionName, animation: AnimationName): FrameUrlResolution {
  const assetDirection = purpleMageDirectionAssets[direction];

  if (animation === "idle" || animation === "damage" || animation === "victory") {
    const directionalIdleUrls = findPurpleMageFrameUrls("idle", assetDirection);
    if (directionalIdleUrls.length > 0) return { urls: directionalIdleUrls };
    return { urls: findPurpleMageFrameUrls("idle", purpleMageIdleDirectionFallbackAssets[direction]) };
  }

  if (animation === "walk") {
    const walkV2Urls = findPurpleMageFrameUrls("walk_v2", assetDirection);
    if (walkV2Urls.length > 0) return { urls: walkV2Urls };
    return { urls: findPurpleMageFrameUrls("walk", assetDirection) };
  }

  if (animation === "sprint" || animation === "run") {
    const sprintUrls = findPurpleMageFrameUrls("sprint", assetDirection);
    if (sprintUrls.length > 0) return { urls: sprintUrls };
    if (assetDirection === "southwest") {
      const mirroredSoutheastUrls = findPurpleMageFrameUrls("sprint", "southeast");
      if (mirroredSoutheastUrls.length > 0) return { urls: mirroredSoutheastUrls, mirrorX: true };
    }
    const walkV2Urls = findPurpleMageFrameUrls("walk_v2", assetDirection);
    if (walkV2Urls.length > 0) return { urls: walkV2Urls };
    return { urls: findPurpleMageFrameUrls("walk", assetDirection) };
  }

  if (animation === "dodge_roll") {
    const dodgeUrls = findPurpleMageFrameUrls("dodge", assetDirection);
    if (dodgeUrls.length > 0) return { urls: dodgeUrls };
    return { urls: findPurpleMageFrameUrls("sprint", assetDirection) };
  }

  if (animation === "attack1") {
    return { urls: findPurpleMageFrameUrls("attack", assetDirection) };
  }

  if (animation === "attack2") {
    const specialCastUrls = findPurpleMageFrameUrls("special_cast", assetDirection);
    if (specialCastUrls.length > 0) return { urls: specialCastUrls };
    return { urls: findPurpleMageFrameUrls("attack", assetDirection) };
  }

  throw new Error(`Missing purple_mage frames for ${direction}/${animation}.`);
}

function findPurpleMageFrameUrls(assetAnimation: "idle" | "walk" | "walk_v2" | "sprint" | "dodge" | "attack" | "special_cast", assetDirection: string): string[] {
  const prefix = `../assets/characters/purple_mage/${assetAnimation}/frames/${assetAnimation}_${assetDirection}_`;
  return Object.entries(purpleMageFrameUrls)
    .filter(([path]) => path.startsWith(prefix) && /^\d{2}\.png$/.test(path.slice(prefix.length)))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, url]) => url);
}

function activePlayerSpriteSet(): PlayerSpriteSet | null {
  return playerSprites[selectedClassId] ?? playerSprites.warrior ?? null;
}

function getMossGolemFrameUrls(direction: DirectionName, animation: MonsterAnimationName): string[] {
  const v2Urls = findMossGolemV2FrameUrls(animation, direction);
  if (v2Urls.length > 0) return v2Urls;

  if (animation === "idle") {
    const walkUrls = findMossGolemV2FrameUrls("walk", direction);
    if (walkUrls.length > 0) return [walkUrls[0]];
  }

  if (animation === "run") {
    const walkUrls = findMossGolemV2FrameUrls("walk", direction);
    if (walkUrls.length > 0) return walkUrls;
  }

  throw new Error(`Missing exported moss_golem_v2 frames for ${direction}/${animation}.`);
}

function findMossGolemV2FrameUrls(animation: string, direction: DirectionName): string[] {
  const candidates = animation === "rock_spray"
    ? [compassDirectionFor(direction), direction]
    : [direction, compassDirectionFor(direction)];

  for (const candidate of new Set(candidates)) {
    const urls = findMossGolemFrameUrls("moss_golem_v2", animation, candidate);
    if (urls.length > 0) return urls;
  }

  return [];
}

function findMossGolemFrameUrls(
  subject: "moss_golem_v2",
  animation: string,
  direction: string,
): string[] {
  const prefix = `../assets/monsters/${subject}/${animation}/frames/${animation}_${direction}_`;
  return Object.entries(mossGolemFrameUrls)
    .filter(([path]) => path.startsWith(prefix) && /^\d{2}\.png$/.test(path.slice(prefix.length)))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, url]) => url);
}

function compassDirectionFor(direction: DirectionName): string {
  if (direction === "down") return "south";
  if (direction === "down_right") return "southeast";
  if (direction === "right") return "east";
  if (direction === "up_right") return "northeast";
  if (direction === "up") return "north";
  if (direction === "up_left") return "northwest";
  if (direction === "left") return "west";
  return "southwest";
}

async function loadMonsterSprites() {
  const output = {} as Record<DirectionName, Record<MonsterAnimationName, SpriteFrame[]>>;
  const animations = ["idle", "walk", "run", "rock_slam", "rock_spray"] as const satisfies readonly MonsterAnimationName[];

  await Promise.all(monsterDirections.map(async (direction) => {
    output[direction] = {} as Record<MonsterAnimationName, SpriteFrame[]>;
    await Promise.all(animations.map(async (animation) => {
      const urls = getMossGolemFrameUrls(direction, animation);
      output[direction][animation] = await Promise.all(urls.map(async (url) => makeImageFrame(await loadImage(url))));
    }));
  }));

  monsterSprites = output;
}

async function loadWorldAssets() {
  const image = await loadImage(rpgAssetsUrl);
  const grassImage = await loadImage(largeGrassTerrainUrl);
  const output: Partial<Record<WorldAssetName, SpriteFrame>> = {};

  (Object.keys(worldAssetRects) as WorldAssetName[]).forEach((name) => {
    output[name] = makeTransparentFrame(image, worldAssetRects[name]);
  });

  grassTerrainTile = makeImageFrame(grassImage);
  grassTerrainProps = await loadFrameMap(grassTerrainPropUrls);
  animatedGrassFrames = (await Promise.all(
    Object.entries(animatedGrassFrameUrls)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(async ([, url]) => makeImageFrame(await loadImage(url))),
  ));
  const magicMissileEntries = Object.entries(magicMissileFrameUrls)
    .sort(([left], [right]) => left.localeCompare(right));
  const moonfallEntries = Object.entries(moonfallFrameUrls)
    .sort(([left], [right]) => left.localeCompare(right));

  [magicMissileFrames, moonfallFrames] = await Promise.all([
    magicMissileEntries.length > 0
      ? Promise.all(magicMissileEntries.map(([, url]) => loadImage(url).then(makeImageFrame)))
      : loadImage(magicMissileUrl).then(makeGreenScreenFrame).then((frame) => [frame]),
    moonfallEntries.length > 0
      ? Promise.all(moonfallEntries.map(([, url]) => loadImage(url).then(makeMoonfallFrame)))
      : loadImage(moonfallUrl).then(makeGreenScreenFrame).then((frame) => [frame]),
  ]);
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
    player.dodgeAnimTime = 0;
    player.invulnerableTime = 0;
    player.attackFlash = 0;
    player.specialFlash = 0;
    updateSpriteAnimation("damage", delta);
    return;
  }

  player.dodgeTime = Math.max(0, player.dodgeTime - delta);
  player.dodgeAnimTime = Math.max(0, player.dodgeAnimTime - delta);
  player.invulnerableTime = Math.max(0, player.invulnerableTime - delta);
  player.attackFlash = Math.max(0, player.attackFlash - delta);
  player.specialFlash = Math.max(0, player.specialFlash - delta);
  player.autoTimer = Math.max(0, player.autoTimer - delta);

  const input = movementFromActions(pressedActions);

  const moving = lengthSq(input) > 0;
  if (moving) {
    normalize(input);
    player.direction = directionFromVector(input);
    player.facing = { ...input };
  }

  const sprinting = moving
    && pressedActions.has("sprint")
    && !sprintExhaustedUntilRelease
    && player.stamina > 0
    && player.dodgeTime <= 0;

  if (sprinting) {
    player.stamina = Math.max(0, player.stamina - player.sprintStaminaCost * delta);
    if (player.stamina <= 0) {
      sprintExhaustedUntilRelease = true;
    }
  } else {
    player.stamina = Math.min(player.maxStamina, player.stamina + player.staminaRegen * delta);
  }

  if (pressedActions.has("dodge") && player.stamina >= 28 && player.dodgeTime <= 0) {
    player.stamina -= 28;
    player.dodgeTime = 0.24;
    player.dodgeAnimTime = 0.44;
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
  if (!sprinting && player.dodgeTime <= 0) {
    updateTargetFacing();
  }

  const nextAnim: AnimationName =
    player.specialFlash > 0
      ? "attack2"
      : player.attackFlash > 0
        ? "attack1"
        : player.dodgeAnimTime > 0
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

function lockTarget() {
  if (enemy.state === "dead" || !enemy.visible) return;
  targetLocked = true;
  pushLog("Target locked", "Rootbound Elite");
}

function clearTarget() {
  if (!targetLocked && !pendingMagicMissileCast) return;
  targetLocked = false;
  pendingMagicMissileCast = null;
  pushLog("Target cleared", "Movement controls facing");
}

function screenToWorld(clientX: number, clientY: number): Vec2 {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) / camera.scale + camera.x,
    y: (clientY - rect.top) / camera.scale + camera.y,
  };
}

function isEnemyAtWorldPoint(point: Vec2) {
  if (enemy.state === "dead" || !enemy.visible) return false;
  const dx = (point.x - enemy.x) / 72;
  const dy = (point.y - (enemy.y + 12)) / 48;
  return dx * dx + dy * dy <= 1;
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
        ? 0.12
        : player.anim === "attack2"
          ? 0.13
          : player.anim === "dodge_roll"
            ? 0.125
            : player.anim === "sprint"
              ? 0.075
              : 0.105;
  const frames = activePlayerSpriteSet()?.[player.direction][player.anim];
  if (frames && player.animTimer >= rate) {
    player.animTimer = 0;
    const oneShot = player.anim === "attack1" || player.anim === "attack2" || player.anim === "dodge_roll";
    const nextFrame = player.animFrame + 1;
    player.animFrame = oneShot && nextFrame >= frames.length ? frames.length - 1 : nextFrame % frames.length;
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
    pendingMagicMissileCast = null;
    pendingMoonfallCast = null;
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
  updatePendingMagicMissileCast(delta);
  updateMagicMissiles(delta);
  updatePendingMoonfallCast(delta);
  updateMoonfallStrikes(delta);

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
  const isMage = selectedClassId === "mage";
  const autoRange = isMage ? 520 : 120;
  if (distance(player, enemy) > autoRange || player.autoTimer > 0) return;

  player.autoTimer = defaultAttackCooldown;
  player.autoCount += 1;

  if (isMage) {
    player.attackFlash = magicMissileCastTiming.attackFlash;
    const damage = 10 + Math.ceil(equippedGear.power * 0.6) + (player.autoCount % 3 === 0 ? 5 : 0);
    pendingMagicMissileCast = {
      damage,
      timer: magicMissileCastTiming.releaseDelay,
    };
    return;
  }

  player.attackFlash = 1.05;
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

function updatePendingMagicMissileCast(delta: number) {
  if (!pendingMagicMissileCast) return;
  pendingMagicMissileCast.timer -= delta;

  if (pendingMagicMissileCast.timer > 0) return;

  const damage = pendingMagicMissileCast.damage;
  pendingMagicMissileCast = null;
  if (!targetLocked || player.lifeState !== "alive" || enemy.health <= 0 || enemy.state === "dead") return;
  spawnMagicMissile(damage);
}

function spawnMagicMissile(damage: number) {
  const castDirection = { x: enemy.x - player.x, y: enemy.y - player.y };
  if (lengthSq(castDirection) > 0.001) {
    normalize(castDirection);
  } else {
    castDirection.x = player.facing.x;
    castDirection.y = player.facing.y;
  }
  const castOffset = {
    x: castDirection.x * 24,
    y: castDirection.y * 18 - 26,
  };

  magicMissiles.push({
    x: player.x + castOffset.x,
    y: player.y + castOffset.y,
    rotation: Math.atan2(castDirection.y, castDirection.x),
    speed: 640,
    damage,
    ttl: magicMissileLifetime,
  });
}

function updateMagicMissiles(delta: number) {
  for (let index = magicMissiles.length - 1; index >= 0; index -= 1) {
    const missile = magicMissiles[index];
    missile.ttl -= delta;

    if (enemy.state !== "dead" && enemy.visible) {
      const toEnemy = { x: enemy.x - missile.x, y: enemy.y - missile.y };
      if (lengthSq(toEnemy) > 0.001) {
        normalize(toEnemy);
        missile.rotation = Math.atan2(toEnemy.y, toEnemy.x);
        missile.x += toEnemy.x * missile.speed * delta;
        missile.y += toEnemy.y * missile.speed * delta;
      }

      if (distance(missile, enemy) <= enemy.radius + 18) {
        magicMissiles.splice(index, 1);
        dealEnemyDamage(missile.damage, "Magic Missile");
        player.meter = Math.min(player.maxMeter, player.meter + 7);
        continue;
      }
    }

    if (missile.ttl <= 0) {
      magicMissiles.splice(index, 1);
    }
  }
}

function updateMoonfallStrikes(delta: number) {
  for (let index = moonfallStrikes.length - 1; index >= 0; index -= 1) {
    const strike = moonfallStrikes[index];
    strike.timer += delta;
    const progress = Math.min(strike.timer / strike.duration, 1);
    const finalFrameStart = moonfallFrames.length > 1 ? (moonfallFrames.length - 1) / moonfallFrames.length : 0.78;

    if (!strike.impacted && progress >= 0.78) {
      strike.impacted = true;
      if (enemy.state !== "dead" && distance({ x: strike.x, y: strike.targetY }, enemy) <= strike.radius) {
        dealEnemyDamage(strike.damage, "Moonfall");
        applyChain("Moonstruck", 5);
      } else {
        pushLog("Moonfall missed", "The target slipped away");
      }
    }

    if (!strike.crashPlayed && progress >= finalFrameStart) {
      strike.crashPlayed = true;
      playSound(moonfallCrashUrl, moonfallAudio.crashVolume);
    }

    if (strike.timer >= strike.duration + moonfallImpactDuration) {
      moonfallStrikes.splice(index, 1);
    }
  }
}

function updatePendingMoonfallCast(delta: number) {
  if (!pendingMoonfallCast) return;
  pendingMoonfallCast.timer -= delta;

  if (pendingMoonfallCast.timer > 0) return;

  const cast = pendingMoonfallCast;
  pendingMoonfallCast = null;
  if (player.lifeState !== "alive" || enemy.health <= 0 || enemy.state === "dead") return;

  moonfallStrikes.push({
    x: cast.x,
    startY: cast.y - 430,
    targetY: cast.y,
    timer: 0,
    duration: moonfallStrikeDuration,
    damage: cast.damage,
    radius: cast.radius,
    impacted: false,
    crashPlayed: false,
  });
}

function updateEnemy(delta: number) {
  if (player.lifeState !== "alive") {
    updateMonsterAnimation("idle", delta);
    return;
  }

  const toPlayer = { x: player.x - enemy.x, y: player.y - enemy.y };
  const distanceToPlayer = length(toPlayer);
  if (distanceToPlayer > 0.001) normalize(toPlayer);

  if (enemy.state === "idle") {
    if (distanceToPlayer > 0.001) enemy.direction = directionFromVector(toPlayer);

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
  updateMonsterAnimation(enemy.state === "windup" || enemy.state === "active" ? getEnemyAttackAnimation() : "idle", delta);

  if (enemy.state === "windup" && enemy.stateTimer <= 0) {
    enemy.state = "active";
    enemy.stateTimer = enemyAttackTimings[enemy.currentAttack].active;
    enemy.hasHitPlayer = false;
  } else if (enemy.state === "active") {
    resolveEnemyHit();
    if (enemy.stateTimer <= 0) {
      enemy.state = "recovery";
      enemy.stateTimer = enemyAttackTimings[enemy.currentAttack].recovery;
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
  const frames = monsterSprites?.[enemy.direction][enemy.anim];
  const isAttackAnimation = enemy.anim === "rock_slam" || enemy.anim === "rock_spray";
  const attackDuration = enemyAttackTimings[enemy.currentAttack].windup + enemyAttackTimings[enemy.currentAttack].active;
  const rate = isAttackAnimation && frames
    ? attackDuration / frames.length
    : enemy.anim === "idle"
      ? 0.22
      : 0.13;
  if (frames && enemy.animTimer >= rate) {
    enemy.animTimer = 0;
    const nextFrame = enemy.animFrame + 1;
    enemy.animFrame = isAttackAnimation && nextFrame >= frames.length ? frames.length - 1 : nextFrame % frames.length;
    if (enemy.anim === "rock_slam" && !enemy.rockSlamCrashPlayed && enemy.animFrame >= Math.max(0, frames.length - 2)) {
      enemy.rockSlamCrashPlayed = true;
      playSound(golemRockSlamCrashUrl, golemAudio.rockSlamCrashVolume);
    }
  }
}

function getEnemyAttackAnimation(): MonsterAnimationName {
  return enemy.currentAttack;
}

function beginEnemyAttack() {
  const toPlayer = { x: player.x - enemy.x, y: player.y - enemy.y };
  if (lengthSq(toPlayer) > 0.001) normalize(toPlayer);
  enemy.attackForward = toPlayer;
  enemy.currentAttack = enemy.attackIndex % 2 === 0 ? "rock_spray" : "rock_slam";
  enemy.attackIndex += 1;
  enemy.direction = directionFromVector(enemy.attackForward);
  enemy.state = "windup";
  enemy.stateTimer = enemyAttackTimings[enemy.currentAttack].windup;
  enemy.hasHitPlayer = false;
  enemy.rockSlamCrashPlayed = false;
}

function resolveEnemyHit() {
  if (enemy.hasHitPlayer || player.invulnerableTime > 0) return;

  const distanceToPlayer = distance(player, enemy);
  let hit = false;
  let damage = 0;

  if (enemy.currentAttack === "rock_slam") {
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
  player.specialFlash = 1.18;

  if (ability.id === "moonfall") {
    player.specialFlash = moonfallCastTiming.specialFlash;
    playSound(moonfallVoiceUrl, moonfallAudio.voiceVolume);
    playSound(moonfallPortalUrl, moonfallAudio.portalVolume);
    const toEnemy = { x: enemy.x - player.x, y: enemy.y - player.y };
    if (lengthSq(toEnemy) > 0.001) player.direction = directionFromVector(toEnemy);
    pendingMoonfallCast = {
      x: enemy.x,
      y: enemy.y,
      damage: 48 + Math.ceil(equippedGear.power * 0.75),
      radius: 132,
      timer: moonfallCastTiming.releaseDelay,
    };
    pushLog("Moonfall called", "The spell gathers overhead");
  }

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
    pendingMagicMissileCast = null;
    pendingMoonfallCast = null;
    magicMissiles.length = 0;
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
  pendingMagicMissileCast = null;
  pendingMoonfallCast = null;
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
  player.dodgeTime = 0;
  player.dodgeAnimTime = 0;
  player.invulnerableTime = 1.2;
  player.direction = "down";
  player.facing = { x: 0, y: -1 };
  player.anim = "idle";
  player.animFrame = 0;
  player.animTimer = 0;
  pendingMagicMissileCast = null;
  pendingMoonfallCast = null;
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
  enemy.rockSlamCrashPlayed = false;
  enemy.x = world.center.x + (Math.random() - 0.5) * 520;
  enemy.y = world.center.y - 260 - Math.random() * 120;
  enemy.visible = true;
  pendingMagicMissileCast = null;
  pendingMoonfallCast = null;
  magicMissiles.length = 0;
  moonfallStrikes.length = 0;
  pushLog("New elite enters the grove", "");
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.save();
  ctx.scale(camera.scale, camera.scale);
  ctx.translate(-camera.x, -camera.y);

  drawWorld();
  drawTelegraph();
  drawMagicMissiles();

  const drawables = [
    { y: enemy.y, draw: drawEnemy },
    { y: player.y, draw: drawPlayer },
  ].sort((a, b) => a.y - b.y);

  drawables.forEach((item) => item.draw());
  drawMoonfallStrikes();
  drawLoot();

  ctx.restore();
}

function drawWorld() {
  drawTileGround();
}

function drawTileGround() {
  const grassTexture = grassTerrainTile ?? worldAssets.grassTile;
  if (!grassTexture) {
    ctx.fillStyle = "#6b8f32";
    ctx.fillRect(0, 0, world.width, world.height);
    return;
  }

  drawLargeGrassLayer(grassTexture);
  drawGroveClearings();
  drawGrassPathNetwork();
  drawTerrainPropLayer();
  drawAnimatedGrassLayer();
  drawArenaBoundaryShade();
}

function drawLargeGrassLayer(grassTexture: SpriteFrame) {
  ctx.save();
  ctx.fillStyle = "#7fac38";
  ctx.fillRect(0, 0, world.width, world.height);

  for (let y = 0; y < world.height; y += grassTexture.h) {
    for (let x = 0; x < world.width; x += grassTexture.w) {
      ctx.drawImage(grassTexture.canvas, x, y, grassTexture.w + 1, grassTexture.h + 1);
    }
  }

  ctx.globalAlpha = 0.18;
  ctx.globalCompositeOperation = "multiply";
  for (let index = 0; index < 20; index += 1) {
    const angle = index * 2.399963;
    const radius = 130 + ((index * 127) % 620);
    const x = world.center.x + Math.cos(angle) * radius;
    const y = world.center.y + Math.sin(angle) * radius * 0.72;
    ctx.fillStyle = index % 3 === 0 ? "#5e7330" : "#446038";
    ctx.beginPath();
    ctx.ellipse(x, y, 95 + (index % 4) * 25, 44 + (index % 5) * 14, angle * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawGroveClearings() {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  groveClearings.forEach((clearing) => {
    ctx.globalAlpha = clearing.alpha;
    ctx.fillStyle = "#b7c95a";
    ctx.beginPath();
    ctx.ellipse(clearing.x, clearing.y, clearing.rx, clearing.ry, clearing.rotation, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawGrassPathNetwork() {
  grovePathRoutes.forEach((route, index) => {
    drawSoftRoute(route, 118 - index * 12, "rgba(55, 72, 28, 0.24)");
    drawSoftRoute(route, 72 - index * 8, "rgba(151, 164, 68, 0.19)");
    drawSoftRoute(route, 22, "rgba(232, 221, 126, 0.09)");
  });
}

function drawSoftRoute(points: Vec2[], width: number, strokeStyle: string) {
  if (points.length < 2) return;

  ctx.save();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    ctx.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
  }

  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
  ctx.stroke();
  ctx.restore();
}

function drawArenaBoundaryShade() {
  ctx.save();
  ctx.fillStyle = "rgba(6, 16, 11, 0.32)";
  ctx.beginPath();
  ctx.rect(0, 0, world.width, world.height);
  ctx.ellipse(world.center.x, world.center.y, world.safeRadius, world.safeRadius * 0.74, 0, 0, Math.PI * 2);
  ctx.fill("evenodd");

  ctx.strokeStyle = "rgba(223, 215, 127, 0.2)";
  ctx.lineWidth = 7;
  ctx.setLineDash([28, 24]);
  ctx.beginPath();
  ctx.ellipse(world.center.x, world.center.y, world.safeRadius - 10, (world.safeRadius - 10) * 0.74, 0, 0, Math.PI * 2);
  ctx.stroke();
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

  if (enemy.currentAttack === "rock_slam") {
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

function drawMagicMissiles() {
  magicMissiles.forEach((missile) => {
    ctx.save();
    ctx.translate(missile.x, missile.y);
    ctx.rotate(missile.rotation + magicMissileForwardRotation);

    const animationAge = magicMissileLifetime - missile.ttl;
    const frame = magicMissileFrames[Math.floor(animationAge / magicMissileAnimationRate) % magicMissileFrames.length];
    if (frame) {
      const scale = 58 / Math.max(frame.w, 1);
      const width = frame.w * scale;
      const height = frame.h * scale;
      ctx.shadowColor = "rgba(127, 200, 255, 0.72)";
      ctx.shadowBlur = 18;
      ctx.drawImage(frame.canvas, -width * 0.5, -height * 0.5, width, height);
    } else {
      ctx.fillStyle = "#7fc8ff";
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });
}

function drawMoonfallStrikes() {
  moonfallStrikes.forEach((strike) => {
    const progress = Math.min(strike.timer / strike.duration, 1);
    const eased = progress * progress * (3 - 2 * progress);
    const moonY = strike.startY + (strike.targetY - 38 - strike.startY) * eased;
    const impactProgress = strike.impacted ? Math.min((strike.timer - strike.duration * 0.78) / moonfallImpactDuration, 1) : 0;

    ctx.save();
    ctx.globalAlpha = 0.2 + progress * 0.34;
    ctx.strokeStyle = "#d9bbff";
    ctx.lineWidth = 4;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.ellipse(strike.x, strike.targetY + 8, strike.radius, strike.radius * 0.38, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    if (impactProgress > 0) {
      ctx.save();
      ctx.globalAlpha = 1 - impactProgress;
      ctx.strokeStyle = "#fff0a8";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(strike.x, strike.targetY + 8, strike.radius * impactProgress, strike.radius * 0.38 * impactProgress, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (moonfallFrames.length > 1) {
      const frameIndex = Math.min(moonfallFrames.length - 1, Math.floor(progress * moonfallFrames.length));
      const frame = moonfallFrames[frameIndex];
      const scale = moonfallFrameScale;
      const width = frame.w * scale;
      const height = frame.h * scale;
      const anchorX = frame.w / 2;
      const anchorY = frame.h * 0.68;
      ctx.save();
      ctx.translate(strike.x, strike.targetY);
      ctx.shadowColor = "rgba(217, 187, 255, 0.82)";
      ctx.shadowBlur = 26;
      ctx.drawImage(frame.canvas, -anchorX * scale, -anchorY * scale, width, height);
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.translate(strike.x, moonY);
    ctx.rotate(-0.18 + progress * 0.46);
    if (moonfallFrames[0]) {
      const frame = moonfallFrames[0];
      const scale = ((150 + progress * 18) * 1.2) / Math.max(frame.w, 1);
      const width = frame.w * scale;
      const height = frame.h * scale;
      ctx.shadowColor = "rgba(217, 187, 255, 0.82)";
      ctx.shadowBlur = 26;
      ctx.drawImage(frame.canvas, -width / 2, -height / 2, width, height);
    } else {
      ctx.fillStyle = "#d9bbff";
      ctx.beginPath();
      ctx.arc(0, 0, 54, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
}

function drawPlayer() {
  drawShadow(player.x, player.y + 18, 52, 20, 0.34);

  const frames = activePlayerSpriteSet()?.[player.direction][player.anim];
  const frame = frames?.[player.animFrame % frames.length];
  if (!frame) return;

  const drawProfile = getPlayerDrawProfile(player.anim);
  const directionScale = getPlayerDirectionScale(player.anim, player.direction);
  const bounds = frame.bounds ?? { x: 0, y: 0, w: frame.w, h: frame.h };
  const normalizedScale = drawProfile.targetContentHeight
    ? drawProfile.targetContentHeight / Math.max(bounds.h, 1)
    : drawProfile.scale;
  const scale = Math.max(normalizedScale, drawProfile.minScale ?? 0) * directionScale;
  const width = frame.w * scale;
  const height = frame.h * scale;
  const flash = player.invulnerableTime > 0 && Math.floor(performance.now() / 75) % 2 === 0;
  const anchorX = drawProfile.targetContentHeight ? bounds.x + bounds.w / 2 : drawProfile.anchorX;
  const anchorY = drawProfile.targetContentHeight ? bounds.y + bounds.h : drawProfile.anchorY;
  const drawX = player.x - anchorX * scale;
  const drawY = player.y + drawProfile.baselineOffset - anchorY * scale;

  ctx.save();
  ctx.globalAlpha = flash ? 0.54 : 1;
  ctx.drawImage(frame.canvas, drawX, drawY, width, height);
  ctx.restore();
}

function getPlayerDrawProfile(animation: AnimationName): DrawProfile {
  if (selectedClassId === "mage") {
    if (animation === "dodge_roll") return purpleMageSpriteDraw.dodge;
    if (animation === "attack2") return purpleMageSpriteDraw.specialCast;
    if (animation === "attack1") return purpleMageSpriteDraw.wideAction;
    return purpleMageSpriteDraw.standard;
  }

  return animation === "attack1" || animation === "attack2"
    ? warriorSpriteDraw.wideAction
    : warriorSpriteDraw.standard;
}

function getPlayerDirectionScale(animation: AnimationName, direction: DirectionName) {
  if (selectedClassId === "mage") return 1;
  return animation === "attack1" ? warriorAttackDirectionScale[direction] ?? 1 : 1;
}

function drawEnemy() {
  if (!enemy.visible) return;
  drawShadow(enemy.x, enemy.y + 20, 96, 34, 0.4);

  const frames = monsterSprites?.[enemy.direction][enemy.anim];
  const frame = frames?.[enemy.animFrame % frames.length];
  if (frame) {
    const drawProfile = getMossGolemDrawProfile(enemy.anim);
    const scale = drawProfile.scale;
    const width = frame.w * scale;
    const height = frame.h * scale;
    const drawX = enemy.x - drawProfile.anchorX * scale;
    const drawY = enemy.y + drawProfile.baselineOffset - drawProfile.anchorY * scale;
    ctx.save();
    ctx.filter = enemy.flashTimer > 0 ? "brightness(1.55) saturate(1.35)" : "none";
    ctx.drawImage(frame.canvas, drawX, drawY, width, height);
    ctx.restore();
  }

  if (targetLocked) {
    ctx.save();
    ctx.strokeStyle = "#f2d36b";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.ellipse(enemy.x, enemy.y + 12, 72, 40, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function getMossGolemDrawProfile(animation: MonsterAnimationName) {
  if (animation === "rock_slam" || animation === "rock_spray") return mossGolemSpriteDraw.v2Action;
  return mossGolemSpriteDraw.v2Standard;
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
  targetPanel.innerHTML = targetLocked
    ? `
      <div class="label-row"><strong>Rootbound Elite</strong><span>${enemy.state === "dead" ? "Respawning" : `${Math.ceil(enemy.health)} / ${enemy.maxHealth}`}</span></div>
      <div class="bar"><div class="fill target-health" style="--value:${targetValue}"></div></div>
      <div class="label-row"><span>Chain</span><span>${enemy.chainTag || "None"}</span></div>
      <div class="label-row"><span>Gear</span><span>${equippedGear.rarity}</span></div>
      <div class="${droppedGear ? "loot" : ""}">${droppedGear ? `${droppedGear.name}: ${droppedGear.ability}` : equippedGear.ability}</div>
    `
    : `
      <div class="label-row"><strong>No Target</strong><span>Free facing</span></div>
      <div class="bar"><div class="fill target-health" style="--value:0"></div></div>
      <div class="label-row"><span>Chain</span><span>None</span></div>
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
  isPaused = false;
  pauseMenuSource = null;
  pressedActions.clear();
  sprintExhaustedUntilRelease = false;
  stopGameplayMusic();
  playTitleMusic();
  pauseMenu.classList.add("is-hidden");
  titleScreen.classList.add("is-hidden");
  characterSelect.classList.remove("is-hidden");
  renderCharacterSelect();
}

function showTitleScreen() {
  isTitleActive = true;
  isCharacterSelectActive = false;
  isPaused = false;
  pauseMenuSource = null;
  pressedActions.clear();
  sprintExhaustedUntilRelease = false;
  stopGameplayMusic();
  playTitleMusic();
  pauseMenu.classList.add("is-hidden");
  hud.classList.add("is-hidden");
  characterSelect.classList.add("is-hidden");
  titleScreen.classList.remove("is-hidden");
}

function selectPauseTab(tabName: string) {
  pauseTabs.forEach((tab) => {
    const active = tab.dataset.pauseTab === tabName;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  pausePanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.pausePanel !== tabName);
  });
}

function setPauseMenuCopy(source: "gameplay" | "title") {
  const isTitleMenu = source === "title";
  pauseKicker.textContent = isTitleMenu ? "Motherseed" : "Grove suspended";
  pauseTitle.textContent = isTitleMenu ? "Menu" : "Paused";
  resumeButton.textContent = isTitleMenu ? "Back" : "Resume";
}

function openPauseMenu(tabName = "controls", source: "gameplay" | "title" = "gameplay") {
  if (source === "gameplay" && (!isGameplayVisible() || isPaused)) return;
  if (source === "title" && !isTitleActive) return;
  isPaused = source === "gameplay";
  pauseMenuSource = source;
  pressedActions.clear();
  sprintExhaustedUntilRelease = false;
  setPauseMenuCopy(source);
  updateAudioSettingsUi();
  selectPauseTab(tabName);
  pauseMenu.classList.remove("is-hidden");
  requestAnimationFrame(() => pauseFrame.focus());
}

function closePauseMenu() {
  if (!pauseMenuSource) return;
  isPaused = false;
  pauseMenuSource = null;
  pressedActions.clear();
  sprintExhaustedUntilRelease = false;
  pauseMenu.classList.add("is-hidden");
}

function togglePauseMenu() {
  if (isPaused) {
    closePauseMenu();
  } else {
    openPauseMenu();
  }
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
  isPaused = false;
  pauseMenuSource = null;
  stopTitleMusic();
  playGameplayMusic();
  characterSelect.classList.add("is-hidden");
  pauseMenu.classList.add("is-hidden");
  hud.classList.remove("is-hidden");
  pushLog(`${selectedClass().name} enters the grove`, selectedClass().weapon);
}

function animate(now: number) {
  const delta = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;

  if (isGameplayActive()) {
    updateCooldowns(delta);
    updatePlayer(delta);
    updateCombat(delta);
    updateCamera(delta);
    updateHud();
  }

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
titleControlsButton.addEventListener("click", () => openPauseMenu("controls", "title"));
titleSoundButton.addEventListener("click", () => openPauseMenu("sound", "title"));
titleScreen.addEventListener("pointerdown", playTitleMusic);
backButton.addEventListener("click", showTitleScreen);
continueButton.addEventListener("click", startGame);
resumeButton.addEventListener("click", closePauseMenu);

pauseTabs.forEach((tab) => {
  tab.setAttribute("role", "tab");
  tab.addEventListener("click", () => selectPauseTab(tab.dataset.pauseTab ?? "controls"));
});

musicVolumeInput.addEventListener("input", () => {
  audioSettings = {
    ...audioSettings,
    music: clamp(Number(musicVolumeInput.value) / 100, 0, 1),
  };
  applyMusicVolume();
  updateAudioSettingsUi();
  saveAudioSettings();
});

sfxVolumeInput.addEventListener("input", () => {
  audioSettings = {
    ...audioSettings,
    sfx: clamp(Number(sfxVolumeInput.value) / 100, 0, 1),
  };
  updateAudioSettingsUi();
  saveAudioSettings();
});

canvas.addEventListener("click", (event) => {
  if (event.button !== 0 || !isGameplayActive()) return;
  const worldPoint = screenToWorld(event.clientX, event.clientY);
  if (isEnemyAtWorldPoint(worldPoint)) {
    lockTarget();
  } else {
    clearTarget();
  }
});

characterGrid.addEventListener("click", (event) => {
  const card = (event.target as HTMLElement).closest<HTMLButtonElement>(".character-card");
  const classId = card?.dataset.classId as ClassId | undefined;
  if (!classId || !characterClasses[classId]) return;
  selectedClassId = classId;
  renderCharacterSelect();
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Escape" && pauseMenuSource === "title") {
    event.preventDefault();
    closePauseMenu();
    return;
  }

  if (pauseMenuSource === "title") return;

  if (event.code === "Escape" && isGameplayVisible()) {
    event.preventDefault();
    togglePauseMenu();
    return;
  }

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

  if (isPaused) return;

  const action = gameplayActionForCode(event.code);
  if (!action) return;

  pressedActions.add(action);

  if (action === "target-next") {
    event.preventDefault();
    lockTarget();
  }
  if (action === "special-1") castSpecial(0);
  if (action === "special-2") castSpecial(1);
  if (action === "special-3") castSpecial(2);
  if (action === "equip") equipDrop();
});

window.addEventListener("keyup", (event) => {
  const action = gameplayActionForCode(event.code);
  if (action) {
    pressedActions.delete(action);
    if (action === "sprint") {
      sprintExhaustedUntilRelease = false;
    }
  }
});
window.addEventListener("resize", resizeCanvas);

updateAudioSettingsUi();
resizeCanvas();
Promise.all([loadSprites(), loadMonsterSprites(), loadWorldAssets()]).then(() => {
  pushLog("MotherSeed prototype ready", "Close for melee, dodge the red telegraphs");
  requestAnimationFrame((now) => {
    lastFrame = now;
    animate(now);
  });
});
