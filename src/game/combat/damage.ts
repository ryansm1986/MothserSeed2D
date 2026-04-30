import { world } from "../world/arena";
import { generateGear } from "./gear";
import {
  allEnemies,
  livingEnemies,
  logEvent,
  promoteEnemy,
  type EnemyState,
  type GameEvent,
  type GameState,
} from "../state";
import { clearRoomProjectiles, spawnRoomEnemy } from "../world/rooms";

export function dealEnemyDamage(state: GameState, amount: number, source: string, events: GameEvent[]) {
  dealSpecificEnemyDamage(state, state.enemy, amount, source, events);
}

export function dealSpecificEnemyDamage(state: GameState, enemy: EnemyState, amount: number, source: string, events: GameEvent[]) {
  if (enemy.state === "dead" || !enemy.visible) return;
  enemy.health = Math.max(0, enemy.health - amount);
  enemy.flashTimer = 0.12;
  events.push(logEvent(`${source}: ${amount}`, enemy.chainTag ? `${enemy.name} chain: ${enemy.chainTag}` : enemy.name));

  if (enemy.health <= 0) {
    enemy.state = "dead";
    enemy.visible = false;
    state.combat.pendingMagicMissileCast = null;
    state.combat.pendingMoonfallCast = null;
    state.combat.magicMissiles.length = 0;

    const remainingEnemies = livingEnemies(state);
    if (enemy === state.enemy && remainingEnemies.length > 0) {
      promoteEnemy(state, remainingEnemies[0]);
    }

    if (remainingEnemies.length === 0) {
      state.combat.motherslashWaves.length = 0;
      state.combat.enemyRockThrows.length = 0;
      state.combat.shroomSporeClouds.length = 0;
      state.combat.shroomlings.length = 0;
      state.combat.treeGoblinHeads.length = 0;
      state.combat.droppedGear = generateGear();
      state.combat.respawnTimer = 5.2;
      events.push(logEvent(`${state.combat.droppedGear.rarity} drop: ${state.combat.droppedGear.name}`, "Press E to equip"));
    }
  }
}

export function applyChain(state: GameState, tag: string, seconds: number) {
  applyEnemyChain(state.enemy, tag, seconds);
}

export function applyEnemyChain(enemy: EnemyState, tag: string, seconds: number) {
  enemy.chainTag = tag;
  enemy.chainTimer = seconds;
}

export function updateBleed(state: GameState, delta: number, events: GameEvent[]) {
  allEnemies(state).forEach((enemy) => {
    if (enemy.bleedTimer <= 0 || enemy.state === "dead") return;
    enemy.bleedTimer -= delta;
    enemy.bleedTick -= delta;
    if (enemy.bleedTick <= 0) {
      enemy.bleedTick = 1;
      dealSpecificEnemyDamage(state, enemy, 4, "Bleed", events);
    }
  });
}

export function defeatPlayer(state: GameState, events: GameEvent[]) {
  if (state.player.lifeState === "dead") return;
  state.player.lifeState = "dead";
  state.player.health = 0;
  state.player.stamina = 0;
  state.player.meter = 0;
  state.player.dodgeTime = 0;
  state.player.invulnerableTime = 0;
  state.combat.pendingMagicMissileCast = null;
  state.combat.pendingMoonfallCast = null;
  state.combat.motherslashWaves.length = 0;
  state.combat.enemyRockThrows.length = 0;
  state.combat.shroomSporeClouds.length = 0;
  state.combat.shroomlings.length = 0;
  state.combat.treeGoblinHeads.length = 0;
  state.combat.playerRespawnTimer = 3.2;
  events.push(logEvent("You fall", "Regrowing at the grove heart"));
}

export function respawnPlayer(state: GameState, events: GameEvent[]) {
  state.player.lifeState = "alive";
  state.player.x = world.playerSpawn.x;
  state.player.y = world.playerSpawn.y;
  state.player.health = state.player.maxHealth;
  state.player.stamina = state.player.maxStamina;
  state.player.meter = 0;
  state.player.dodgeTime = 0;
  state.player.dodgeAnimTime = 0;
  state.player.invulnerableTime = 1.2;
  state.player.direction = "down";
  state.player.facing = { x: 0, y: -1 };
  state.player.anim = "idle";
  state.player.animFrame = 0;
  state.player.animTimer = 0;
  state.combat.pendingMagicMissileCast = null;
  state.combat.pendingMoonfallCast = null;
  state.combat.cooldowns = {};
  state.combat.motherslashWaves.length = 0;
  state.combat.enemyRockThrows.length = 0;
  state.combat.shroomSporeClouds.length = 0;
  state.combat.shroomlings.length = 0;
  state.combat.treeGoblinHeads.length = 0;
  events.push(logEvent("Regrown", "Back in the fight"));
}

export function respawnEnemy(state: GameState, events: GameEvent[]) {
  spawnRoomEnemy(state);
  clearRoomProjectiles(state);
  const encounterNames = [state.enemy, ...state.extraEnemies].map((enemy) => enemy.name).join(" and ");
  events.push(logEvent(`${encounterNames} enter the circle`, ""));
}
