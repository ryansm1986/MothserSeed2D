import type { InputState } from "./input-actions";
import { type AnimationFrameLookup } from "../render/canvas2d/types";
import { enemyAttackTimings } from "./content/enemies";
import { allEnemies, livingEnemies, soundEvent, type EnemyState, type GameEvent, type GameState } from "./state";
import { respawnEnemy, respawnPlayer, updateBleed } from "./combat/damage";
import { updateEnemy } from "./combat/enemy-ai";
import { updateAutoAttack, updateCooldowns } from "./combat/abilities";
import { updatePlayer } from "./combat/player";
import { updateRoomTransition } from "./world/rooms";
import {
  updateMagicMissiles,
  updateEnemyRockThrows,
  updateMotherslashWaves,
  updateMoonfallStrikes,
  updatePendingMagicMissileCast,
  updatePendingMoonfallCast,
  updateShroomlings,
  updateShroomSporeClouds,
  updateTreeGoblinHeads,
} from "./combat/projectiles";

export function updateSimulation(
  state: GameState,
  inputState: InputState,
  delta: number,
  frameLookup?: AnimationFrameLookup,
): GameEvent[] {
  const events: GameEvent[] = [];

  updateCooldowns(state, delta);
  updatePlayer(state, inputState, delta, events);
  updateRoomTransition(state, delta, events);
  updateCombat(state, delta, events, frameLookup);
  updateAnimations(state, delta, frameLookup, events);

  return events;
}

function updateCombat(state: GameState, delta: number, events: GameEvent[], frameLookup?: AnimationFrameLookup) {
  if (state.player.lifeState === "dead") {
    state.combat.pendingMagicMissileCast = null;
    state.combat.pendingMoonfallCast = null;
    state.combat.motherslashWaves.length = 0;
    state.combat.enemyRockThrows.length = 0;
    state.combat.shroomSporeClouds.length = 0;
    state.combat.shroomlings.length = 0;
    state.combat.treeGoblinHeads.length = 0;
    state.combat.playerRespawnTimer -= delta;
    if (state.combat.playerRespawnTimer <= 0) respawnPlayer(state, events);
    return;
  }

  if (livingEnemies(state).length === 0) {
    state.combat.respawnTimer -= delta;
    if (state.combat.respawnTimer <= 0) respawnEnemy(state, events);
    return;
  }

  allEnemies(state).forEach((enemy) => {
    enemy.flashTimer = Math.max(0, enemy.flashTimer - delta);
  });
  updatePendingMagicMissileCast(state, delta);
  updateMagicMissiles(state, delta, events);
  updateEnemyRockThrows(state, delta, events);
  updateShroomSporeClouds(state, delta, events);
  updateShroomlings(state, delta, events);
  updateTreeGoblinHeads(state, delta, events);
  updateMotherslashWaves(state, delta, events);
  updatePendingMoonfallCast(state, delta);
  updateMoonfallStrikes(state, delta, events, frameLookup?.moonfallFrameCount() ?? 1);

  allEnemies(state).forEach((enemy) => {
    if (enemy.chainTimer <= 0) return;
    enemy.chainTimer -= delta;
    if (enemy.chainTimer <= 0) enemy.chainTag = "";
  });

  updateBleed(state, delta, events);
  updateAutoAttack(state, events);
  updateEnemy(state, delta, events);
}

function updateAnimations(state: GameState, delta: number, frameLookup: AnimationFrameLookup | undefined, events: GameEvent[]) {
  state.player.animTimer += delta;
  const isWarrior = state.selectedClassId === "warrior";
  const playerRate =
    state.player.anim === "idle"
      ? 0.22
      : state.player.anim === "attack1"
        ? isWarrior ? 0.16 : 0.24
        : state.player.anim === "attack2"
          ? isWarrior ? 0.2 : 0.26
          : state.player.anim === "dodge_roll"
            ? 0.125
            : state.player.anim === "sprint"
              ? 0.075
              : 0.105;
  const playerFrameCount = frameLookup?.playerFrameCount(state.selectedClassId, state.player.direction, state.player.anim) ?? 1;
  if (state.player.animTimer >= playerRate) {
    state.player.animTimer = 0;
    const oneShot = state.player.anim === "attack1" || state.player.anim === "attack2" || state.player.anim === "dodge_roll";
    const nextFrame = state.player.animFrame + 1;
    state.player.animFrame = oneShot && nextFrame >= playerFrameCount ? playerFrameCount - 1 : nextFrame % playerFrameCount;
  }

  allEnemies(state).forEach((enemy) => updateEnemyAnimation(enemy, delta, frameLookup, events));
}

function updateEnemyAnimation(enemy: EnemyState, delta: number, frameLookup: AnimationFrameLookup | undefined, events: GameEvent[]) {
  if (!enemy.visible) return;
  enemy.animTimer += delta;
  const enemyFrameCount = frameLookup?.monsterFrameCount(enemy.monsterId, enemy.direction, enemy.anim) ?? 1;
  const isAttackAnimation = enemy.anim === "rock_slam" || enemy.anim === "rock_spray" || enemy.anim === "rock_throw" || enemy.anim === "bite";
  if (syncTreeGoblinHeadThrowAnimation(enemy, enemyFrameCount)) return;
  if (syncGolemStrikeAnimation(enemy, enemyFrameCount)) {
    maybePlayRockSlamCrash(enemy, enemyFrameCount, events);
    return;
  }
  const attackDuration = enemy.state === "windup" || enemy.state === "active"
    ? enemy.stateTimer
    : 1;
  const enemyRate = enemy.anim === "rock_throw"
    ? 0.08
    : isAttackAnimation
    ? Math.max(0.04, attackDuration / enemyFrameCount)
    : enemy.anim === "idle"
      ? 0.22
      : 0.13;
  if (enemy.animTimer >= enemyRate) {
    enemy.animTimer = 0;
    const nextFrame = enemy.animFrame + 1;
    enemy.animFrame = isAttackAnimation && nextFrame >= enemyFrameCount ? enemyFrameCount - 1 : nextFrame % enemyFrameCount;
  }

  maybePlayRockSlamCrash(enemy, enemyFrameCount, events);
}

function syncTreeGoblinHeadThrowAnimation(enemy: EnemyState, enemyFrameCount: number) {
  if (enemy.monsterId !== "tree_goblin" || enemy.currentAttack !== "head_throw" || enemy.anim !== "rock_throw" || enemyFrameCount <= 1) {
    return false;
  }

  const holdFrame = Math.min(enemyFrameCount - 1, 4);

  if (enemy.state === "windup") {
    const windup = enemyAttackTimings.head_throw.windup;
    const progress = Math.min(1, Math.max(0, (windup - enemy.stateTimer) / windup));
    enemy.animFrame = Math.min(holdFrame, Math.floor(progress * (holdFrame + 1)));
    enemy.animTimer = 0;
    return true;
  }

  if (enemy.state === "active") {
    enemy.animFrame = holdFrame;
    enemy.animTimer = 0;
    return true;
  }

  if (enemy.state === "recovery") {
    const resumeDuration = 0.82;
    if (enemy.stateTimer > resumeDuration) {
      enemy.animFrame = holdFrame;
    } else {
      const progress = Math.min(1, Math.max(0, (resumeDuration - enemy.stateTimer) / resumeDuration));
      enemy.animFrame = Math.min(enemyFrameCount - 1, holdFrame + Math.floor(progress * (enemyFrameCount - holdFrame)));
    }
    enemy.animTimer = 0;
    return true;
  }

  return false;
}

function syncGolemStrikeAnimation(enemy: EnemyState, enemyFrameCount: number) {
  if ((enemy.anim !== "rock_slam" && enemy.anim !== "rock_spray") || enemyFrameCount <= 0) return false;

  if (enemy.state === "windup") {
    const windup = enemyAttackTimings[enemy.anim].windup;
    const progress = Math.min(1, Math.max(0, (windup - enemy.stateTimer) / windup));
    enemy.animFrame = Math.min(Math.max(0, enemyFrameCount - 2), Math.floor(progress * Math.max(1, enemyFrameCount - 1)));
    enemy.animTimer = 0;
    return true;
  }

  if (enemy.state === "active") {
    enemy.animFrame = Math.max(0, enemyFrameCount - 1);
    enemy.animTimer = 0;
    return true;
  }

  return false;
}

function maybePlayRockSlamCrash(enemy: EnemyState, enemyFrameCount: number, events: GameEvent[]) {
  if (
    enemy.anim === "rock_slam"
    && !enemy.rockSlamCrashPlayed
    && enemy.animFrame >= Math.max(0, enemyFrameCount - 1)
  ) {
    enemy.rockSlamCrashPlayed = true;
    events.push(soundEvent("golemRockSlamCrash"));
  }
}
