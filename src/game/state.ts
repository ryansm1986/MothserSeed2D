import { characterClasses } from "./content/classes";
import { world } from "./world/arena";
import type {
  AnimationName,
  AutoAttackLoopState,
  BranchLatticeState,
  CardinalDirectionName,
  ClassId,
  CombatState,
  DirectionName,
  GearDrop,
  MonsterId,
  MonsterAnimationName,
  PlayerLifeState,
  TelegraphKind,
  Vec2,
  WorldAssetName,
} from "./types";

export type Obstacle = { x: number; y: number; rx: number; ry: number; asset: WorldAssetName; scale: number };

export type PlayerState = Vec2 & {
  lifeState: PlayerLifeState;
  radius: number;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  meter: number;
  maxMeter: number;
  speed: number;
  sprintSpeed: number;
  sprintStaminaCost: number;
  staminaRegen: number;
  dodgeSpeed: number;
  dodgeTime: number;
  dodgeAnimTime: number;
  invulnerableTime: number;
  facing: Vec2;
  anim: AnimationName;
  direction: DirectionName;
  animTimer: number;
  animFrame: number;
  attackFlash: number;
  specialFlash: number;
  autoTimer: number;
  autoCount: number;
};

export type EnemyState = Vec2 & {
  instanceId: string;
  monsterId: MonsterId;
  name: string;
  radius: number;
  health: number;
  maxHealth: number;
  state: CombatState;
  stateTimer: number;
  attackIndex: number;
  currentAttack: TelegraphKind;
  attackForward: Vec2;
  attackCooldowns: Record<TelegraphKind, number>;
  hasHitPlayer: boolean;
  rockSlamCrashPlayed: boolean;
  chainTag: string;
  chainTimer: number;
  bleedTimer: number;
  bleedTick: number;
  flashTimer: number;
  anim: MonsterAnimationName;
  direction: DirectionName;
  animTimer: number;
  animFrame: number;
  visible: boolean;
};

export type MagicMissileProjectile = Vec2 & {
  rotation: number;
  speed: number;
  damage: number;
  ttl: number;
};

export type MoonfallStrike = {
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

export type MotherslashWave = Vec2 & {
  timer: number;
  delay: number;
  duration: number;
  maxRadius: number;
  damage: number;
  hitEnemyIds: string[];
};

export type EnemyRockThrowProjectile = Vec2 & {
  vx: number;
  vy: number;
  damage: number;
  radius: number;
  timer: number;
  duration: number;
  rotation: number;
  spin: number;
};

export type ShroomSporeCloud = Vec2 & {
  radius: number;
  timer: number;
  duration: number;
  damage: number;
  hitTimer: number;
};

export type ShroomlingProjectile = Vec2 & {
  vx: number;
  vy: number;
  direction: CardinalDirectionName;
  radius: number;
  timer: number;
  tossDuration: number;
  duration: number;
  damage: number;
  attackTimer: number;
};

export type TreeGoblinHeadProjectile = Vec2 & {
  ownerId: string;
  originX: number;
  originY: number;
  baseAngle: number;
  radius: number;
  timer: number;
  duration: number;
  damage: number;
  hitTimer: number;
};

export type PendingMagicMissileCast = {
  damage: number;
  timer: number;
};

export type PendingMoonfallCast = {
  x: number;
  y: number;
  damage: number;
  radius: number;
  timer: number;
};

export type CombatRuntimeState = {
  cooldowns: Record<string, number>;
  magicMissiles: MagicMissileProjectile[];
  moonfallStrikes: MoonfallStrike[];
  motherslashWaves: MotherslashWave[];
  enemyRockThrows: EnemyRockThrowProjectile[];
  shroomSporeClouds: ShroomSporeCloud[];
  shroomlings: ShroomlingProjectile[];
  treeGoblinHeads: TreeGoblinHeadProjectile[];
  pendingMagicMissileCast: PendingMagicMissileCast | null;
  pendingMoonfallCast: PendingMoonfallCast | null;
  targetLocked: boolean;
  droppedGear: GearDrop | null;
  equippedGear: GearDrop;
  branchLattice: BranchLatticeState;
  autoLoop: AutoAttackLoopState;
  playerRespawnTimer: number;
  respawnTimer: number;
  roomIndex: number;
  roomTransitionCooldown: number;
};

export type UiFlowState = {
  isTitleActive: boolean;
  isCharacterSelectActive: boolean;
  isPaused: boolean;
  isInventoryOpen: boolean;
  isBranchLatticeOpen: boolean;
  pauseMenuSource: "gameplay" | "title" | null;
};

export type SoundEventId =
  | "moonfallVoice"
  | "moonfallPortal"
  | "moonfallCrash"
  | "golemRockSlamCrash"
  | "warriorSwordSwish"
  | "warriorSwordThump"
  | "warriorHyah"
  | "warriorByMothertree"
  | "motherslashPulseWave";

export type GameEvent =
  | { kind: "log"; message: string; detail: string }
  | { kind: "sound"; id: SoundEventId };

export type GameState = {
  selectedClassId: ClassId;
  player: PlayerState;
  enemy: EnemyState;
  extraEnemies: EnemyState[];
  obstacles: Obstacle[];
  combat: CombatRuntimeState;
  ui: UiFlowState;
};

export function createInitialGameState(selectedClassId: ClassId = "warrior"): GameState {
  return {
    selectedClassId,
    player: {
      lifeState: "alive",
      x: world.playerSpawn.x,
      y: world.playerSpawn.y,
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
      anim: "idle",
      direction: "down",
      animTimer: 0,
      animFrame: 0,
      attackFlash: 0,
      specialFlash: 0,
      autoTimer: 0,
      autoCount: 0,
    },
    enemy: {
      instanceId: "room-0-enemy-0",
      monsterId: "shroom_boy",
      name: "Deepcap Sporeling",
      x: world.enemySpawn.x,
      y: world.enemySpawn.y,
      radius: 26,
      health: 145,
      maxHealth: 145,
      state: "idle",
      stateTimer: 1.8,
      attackIndex: 0,
      currentAttack: "rock_spray",
      attackForward: { x: 0, y: 1 },
      attackCooldowns: createEnemyAttackCooldowns(),
      hasHitPlayer: false,
      rockSlamCrashPlayed: false,
      chainTag: "",
      chainTimer: 0,
      bleedTimer: 0,
      bleedTick: 0,
      flashTimer: 0,
      anim: "idle",
      direction: "down",
      animTimer: 0,
      animFrame: 0,
      visible: true,
    },
    extraEnemies: [],
    obstacles: [],
    combat: {
      cooldowns: {},
      magicMissiles: [],
      moonfallStrikes: [],
      motherslashWaves: [],
      enemyRockThrows: [],
      shroomSporeClouds: [],
      shroomlings: [],
      treeGoblinHeads: [],
      pendingMagicMissileCast: null,
      pendingMoonfallCast: null,
      targetLocked: true,
      droppedGear: null,
      equippedGear: {
        name: "Recruit's Greatsword",
        rarity: "Common",
        power: 0,
        ability: "Every third auto-attack deals +5 damage.",
        frame: createFrameGear(selectedClassId, "Common"),
      },
      branchLattice: createBranchLatticeState(selectedClassId, "Common"),
      autoLoop: createAutoAttackLoopState(),
      playerRespawnTimer: 0,
      respawnTimer: 0,
      roomIndex: 0,
      roomTransitionCooldown: 0,
    },
    ui: {
      isTitleActive: true,
      isCharacterSelectActive: false,
      isPaused: false,
      isInventoryOpen: false,
      isBranchLatticeOpen: false,
      pauseMenuSource: null,
    },
  };
}

export function selectedClass(state: GameState) {
  return characterClasses[state.selectedClassId];
}

export function activeWeaponSpecials(state: GameState) {
  const specials = state.combat.equippedGear.frame.weaponSpecials.length > 0
    ? state.combat.equippedGear.frame.weaponSpecials
    : selectedClass(state).abilities;

  return specials.map((special, index) => ({ ...special, key: String(index + 1) }));
}

export function activeLatticeSequence(state: GameState) {
  const options = state.combat.equippedGear.frame.latticeAbilityOptions;
  return state.combat.branchLattice.abilitySlotIds.map((optionId) =>
    optionId ? options.find((candidate) => candidate.id === optionId) ?? null : null,
  );
}

export function allEnemies(state: GameState): EnemyState[] {
  return [state.enemy, ...state.extraEnemies];
}

export function livingEnemies(state: GameState): EnemyState[] {
  return allEnemies(state).filter((enemy) => enemy.visible && enemy.state !== "dead" && enemy.health > 0);
}

export function promoteEnemy(state: GameState, nextTarget: EnemyState) {
  if (state.enemy === nextTarget) return;

  const nextIndex = state.extraEnemies.indexOf(nextTarget);
  if (nextIndex < 0) return;

  const previousTarget = state.enemy;
  state.enemy = nextTarget;
  state.extraEnemies.splice(nextIndex, 1);
  if (previousTarget.visible && previousTarget.state !== "dead" && previousTarget.health > 0) {
    state.extraEnemies.unshift(previousTarget);
  }
}

export function createEnemyAttackCooldowns(): Record<TelegraphKind, number> {
  return {
    rock_slam: 0,
    rock_spray: 0,
    rock_throw: 0,
    spore_cloud: 0,
    shroom_toss: 0,
    bite: 0,
    head_throw: 0,
    arm_attack: 0,
  };
}

export function isGameplayActive(state: GameState) {
  return (
    !state.ui.isTitleActive &&
    !state.ui.isCharacterSelectActive &&
    !state.ui.isPaused &&
    !state.ui.isInventoryOpen &&
    !state.ui.isBranchLatticeOpen
  );
}

export function isGameplayVisible(state: GameState) {
  return !state.ui.isTitleActive && !state.ui.isCharacterSelectActive;
}

export function applySelectedClass(state: GameState, classId: ClassId = state.selectedClassId) {
  const currentClass = characterClasses[classId];
  if (!currentClass.implemented) return false;

  state.selectedClassId = classId;
  state.player.maxHealth = currentClass.stats.health;
  state.player.health = currentClass.stats.health;
  state.player.maxStamina = currentClass.stats.stamina;
  state.player.stamina = currentClass.stats.stamina;
  state.player.maxMeter = currentClass.stats.meter;
  state.player.meter = 0;
  state.combat.cooldowns = {};
  state.combat.equippedGear.frame = createFrameGear(classId, state.combat.equippedGear.rarity);
  state.combat.branchLattice = createBranchLatticeState(classId, state.combat.equippedGear.rarity);
  state.combat.autoLoop = createAutoAttackLoopState();
  return true;
}

export function logEvent(message: string, detail = ""): GameEvent {
  return { kind: "log", message, detail };
}

export function soundEvent(id: SoundEventId): GameEvent {
  return { kind: "sound", id };
}

export function createBranchLatticeState(classId: ClassId, rarity: GearDrop["rarity"]): BranchLatticeState {
  const frame = createFrameGear(classId, rarity);
  return {
    abilitySlotIds: [frame.latticeAbilityOptions[0]?.id ?? null, null, null, null],
    modifierSlotIds: [null, null, null, null],
    selectedAbilitySlot: 0,
    selectedModifierSlot: 0,
    isPreviewOpen: false,
  };
}

export function createAutoAttackLoopState(): AutoAttackLoopState {
  return {
    currentSlotIndex: 0,
    slotTimer: 0,
    restartTimer: 0,
    hasteTimer: 0,
    hasteMultiplier: 1,
    lastResolvedKind: null,
  };
}

export function createFrameGear(classId: ClassId, rarity: GearDrop["rarity"]) {
  const weaponSpecials = characterClasses[classId].abilities.map((ability, index) => ({ ...ability, key: String(index + 1) }));
  const isMage = classId === "mage";
  const weaponRange = isMage ? 520 : 120;
  const latticeAbilityOptions = [
    {
      id: "lattice:basic-attack-1",
      kind: "basic_attack_1" as const,
      name: "Basic Attack 1",
      detail: "Weapon auto strike. Feeds later combo abilities.",
      glyph: "A1",
      range: weaponRange,
      baseCooldown: 0.82,
    },
    {
      id: "lattice:haste-1s",
      kind: "haste" as const,
      name: "Haste",
      detail: "Speeds up the rest of the auto sequence for 1 second.",
      glyph: "HS",
      range: 999,
      baseCooldown: 0.28,
      duration: 1,
    },
    {
      id: "lattice:combo-attack",
      kind: "combo_attack" as const,
      name: "Combo Attack",
      detail: "Chains after Basic Attack 1 for an extra weapon hit.",
      glyph: "CA",
      range: weaponRange,
      baseCooldown: 0.74,
    },
  ];

  const commonModifiers = [
    {
      id: "mod:fire",
      name: "Fire Modifier",
      detail: "Adds a small fire hit to compatible auto abilities.",
      glyph: "FI",
      tone: "common" as const,
    },
    {
      id: "mod:sap-fed",
      name: "Sap Fed",
      detail: "Preview: slightly improves meter economy.",
      glyph: "SF",
      tone: "common" as const,
    },
  ];
  const uncommonModifiers = [
    {
      id: "mod:quickroot",
      name: "Quickroot",
      detail: "Preview: trims recovery windows.",
      glyph: "QR",
      tone: "uncommon" as const,
    },
    {
      id: "mod:amber-vein",
      name: "Amber Vein",
      detail: "Preview: increases burst potential.",
      glyph: "AV",
      tone: "uncommon" as const,
    },
  ];
  const rareModifiers = [
    {
      id: "mod:motherseed-echo",
      name: "Motherseed Echo",
      detail: "Preview: repeats a portion of the linked effect.",
      glyph: "ME",
      tone: "rare" as const,
    },
    {
      id: "mod:star-bloom",
      name: "Star Bloom",
      detail: "Preview: widens the linked branch's area.",
      glyph: "SB",
      tone: "rare" as const,
    },
  ];

  const modifierOptions =
    rarity === "Rare"
      ? [...commonModifiers, ...uncommonModifiers, ...rareModifiers]
      : rarity === "Uncommon"
        ? [...commonModifiers, ...uncommonModifiers]
        : commonModifiers;

  return { weaponSpecials, latticeAbilityOptions, modifierOptions };
}
