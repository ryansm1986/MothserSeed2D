import { enemiesForRoom, type EnemyDefinition } from "../content/enemies";
import { createEnemyAttackCooldowns, logEvent, type EnemyState, type GameEvent, type GameState } from "../state";
import { world } from "./arena";
import { isInStairZone } from "./collision";

export function updateRoomTransition(state: GameState, delta: number, events: GameEvent[]) {
  state.combat.roomTransitionCooldown = Math.max(0, state.combat.roomTransitionCooldown - delta);
  if (state.combat.roomTransitionCooldown > 0 || !isInStairZone(state.player)) return;

  state.combat.roomIndex += 1;
  state.combat.roomTransitionCooldown = 1.2;
  state.combat.droppedGear = null;
  state.combat.targetLocked = true;
  state.player.x = world.playerSpawn.x;
  state.player.y = world.playerSpawn.y;
  state.player.facing = { x: 0, y: -1 };
  state.player.direction = "up";
  state.player.attackFlash = 0;
  state.player.specialFlash = 0;
  spawnRoomEnemy(state);
  const encounterNames = [state.enemy, ...state.extraEnemies].map((enemy) => enemy.name).join(" and ");
  events.push(logEvent("Tree chamber shifted", `${encounterNames} step into the circle`));
}

export function spawnRoomEnemy(state: GameState) {
  const encounter = enemiesForRoom(state.combat.roomIndex);
  const spacing = encounter.length > 1 ? 180 : 0;
  resetEnemyState(state.enemy, encounter[0], state.combat.roomIndex, 0, -spacing * 0.5);
  state.extraEnemies = encounter.slice(1).map((enemy, index) =>
    createRoomEnemy(enemy, state.combat.roomIndex, index + 1, spacing * (index + 0.5)),
  );
  clearRoomProjectiles(state);
}

function createRoomEnemy(enemy: EnemyDefinition, roomIndex: number, enemyIndex: number, offsetX: number): EnemyState {
  return resetEnemyState({
    instanceId: "",
    monsterId: enemy.id,
    name: enemy.name,
    x: world.enemySpawn.x,
    y: world.enemySpawn.y,
    radius: enemy.radius,
    health: enemy.maxHealth,
    maxHealth: enemy.maxHealth,
    state: "idle",
    stateTimer: 1.1,
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
  }, enemy, roomIndex, enemyIndex, offsetX);
}

function resetEnemyState(enemyState: EnemyState, enemy: EnemyDefinition, roomIndex: number, enemyIndex: number, offsetX: number): EnemyState {
  enemyState.instanceId = `room-${roomIndex}-enemy-${enemyIndex}`;
  enemyState.monsterId = enemy.id;
  enemyState.name = enemy.name;
  enemyState.maxHealth = enemy.maxHealth;
  enemyState.health = enemy.maxHealth;
  enemyState.radius = enemy.radius;
  enemyState.state = "idle";
  enemyState.stateTimer = 1.1 + enemyIndex * 0.24;
  enemyState.attackIndex = 0;
  enemyState.currentAttack = "rock_spray";
  enemyState.attackForward = { x: 0, y: 1 };
  enemyState.attackCooldowns = createEnemyAttackCooldowns();
  enemyState.hasHitPlayer = false;
  enemyState.rockSlamCrashPlayed = false;
  enemyState.chainTag = "";
  enemyState.chainTimer = 0;
  enemyState.bleedTimer = 0;
  enemyState.bleedTick = 0;
  enemyState.flashTimer = 0;
  enemyState.anim = "idle";
  enemyState.direction = "down";
  enemyState.animTimer = 0;
  enemyState.animFrame = 0;
  enemyState.visible = true;
  enemyState.x = world.enemySpawn.x + offsetX + (Math.random() - 0.5) * 80;
  enemyState.y = world.enemySpawn.y + (Math.random() - 0.5) * 140;
  return enemyState;
}

export function clearRoomProjectiles(state: GameState) {
  state.combat.pendingMagicMissileCast = null;
  state.combat.pendingMoonfallCast = null;
  state.combat.magicMissiles.length = 0;
  state.combat.moonfallStrikes.length = 0;
  state.combat.motherslashWaves.length = 0;
  state.combat.enemyRockThrows.length = 0;
  state.combat.shroomSporeClouds.length = 0;
  state.combat.shroomlings.length = 0;
  state.combat.treeGoblinHeads.length = 0;
}
