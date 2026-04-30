import { enemyAttackTimings, getEnemyDefinition } from "../content/enemies";
import { directionFromVector, distance, dot, length, lengthSq, normalize } from "../math";
import { allEnemies, type EnemyState, logEvent, type GameEvent, type GameState } from "../state";
import type { MonsterAnimationName, TelegraphKind } from "../types";
import { clampToArena, resolveObstacleCollision } from "../world/collision";
import { defeatPlayer } from "./damage";
import { spawnEnemyRockThrow, spawnShroomlingToss, spawnShroomSporeCloud, spawnTreeGoblinHeadThrow } from "./projectiles";

const closeAttackSequence: TelegraphKind[] = ["rock_spray", "rock_slam"];
const rockSprayRange = 260;
const shroomMeleeRange = 110;
const treeGoblinArmRange = 168;
const treeGoblinHeadThrowRange = 620;

export function updateEnemy(state: GameState, delta: number, events: GameEvent[]) {
  allEnemies(state).forEach((enemy) => updateOneEnemy(state, enemy, delta, events));
}

function updateOneEnemy(state: GameState, enemy: EnemyState, delta: number, events: GameEvent[]) {
  const { player } = state;
  if (enemy.state === "dead" || !enemy.visible) return;

  if (player.lifeState !== "alive") {
    setMonsterAnimation(enemy, "idle");
    return;
  }

  const toPlayer = { x: player.x - enemy.x, y: player.y - enemy.y };
  const distanceToPlayer = length(toPlayer);
  const enemyDefinition = getEnemyDefinition(enemy.monsterId);
  if (distanceToPlayer > 0.001) normalize(toPlayer);
  updateEnemyAttackCooldowns(enemy, delta);

  if (enemy.state === "idle") {
    if (distanceToPlayer > 0.001) enemy.direction = directionFromVector(toPlayer);

    const desiredDistance = enemy.monsterId === "tree_goblin" ? treeGoblinArmRange : shroomMeleeRange;
    if (distanceToPlayer > desiredDistance) {
      enemy.x += toPlayer.x * enemyDefinition.moveSpeed * delta;
      enemy.y += toPlayer.y * enemyDefinition.moveSpeed * delta;
      clampToArena(enemy);
      resolveObstacleCollision(enemy, enemy.radius, state.obstacles);
      setMonsterAnimation(enemy, "walk");
    } else {
      setMonsterAnimation(enemy, "idle");
    }

    enemy.stateTimer -= delta;
    const attackCheckRange = enemy.monsterId === "shroom_boy" || enemy.monsterId === "tree_goblin" ? treeGoblinHeadThrowRange : 420;
    if (enemy.stateTimer <= 0 && distanceToPlayer < attackCheckRange) {
      if (!beginEnemyAttack(state, enemy, distanceToPlayer)) {
        enemy.stateTimer = 0.18;
      }
    }
    return;
  }

  enemy.stateTimer -= delta;
  const holdHeadThrowAnimation = enemy.currentAttack === "head_throw" && enemy.state === "recovery";
  setMonsterAnimation(enemy, enemy.state === "windup" || enemy.state === "active" || holdHeadThrowAnimation ? getEnemyAttackAnimation(enemy) : "idle");

  if (enemy.state === "windup" && enemy.stateTimer <= 0) {
    enemy.state = "active";
    enemy.stateTimer = enemyAttackTimings[enemy.currentAttack].active;
    enemy.hasHitPlayer = false;
    if (!isProjectileAttack(enemy.currentAttack)) {
      resolveEnemyHit(state, enemy, events);
    }
  } else if (enemy.state === "active") {
    resolveEnemyHit(state, enemy, events);
    if (isProjectileAttack(enemy.currentAttack) && enemy.hasHitPlayer) {
      enemy.state = "recovery";
      enemy.stateTimer = enemyAttackTimings[enemy.currentAttack].recovery;
      if (enemy.currentAttack !== "head_throw") setMonsterAnimation(enemy, "idle");
      return;
    }

    if (enemy.stateTimer <= 0) {
      enemy.state = "recovery";
      enemy.stateTimer = enemyAttackTimings[enemy.currentAttack].recovery;
    }
  } else if (enemy.state === "recovery" && enemy.stateTimer <= 0) {
    enemy.state = "idle";
    enemy.stateTimer = 1.25 + Math.random() * 0.45;
  }
}

export function getEnemyAttackAnimation(enemy: EnemyState): MonsterAnimationName {
  return getEnemyDefinition(enemy.monsterId).attackMap[enemy.currentAttack];
}

function beginEnemyAttack(state: GameState, enemy: EnemyState, distanceToPlayer: number) {
  const nextAttack = chooseEnemyAttack(enemy, distanceToPlayer);
  if (!nextAttack) return false;

  const toPlayer = { x: state.player.x - enemy.x, y: state.player.y - enemy.y };
  if (lengthSq(toPlayer) > 0.001) normalize(toPlayer);
  enemy.attackForward = toPlayer;
  enemy.currentAttack = nextAttack;
  applyEnemyAttackCooldown(enemy, nextAttack);
  enemy.direction = directionFromVector(enemy.attackForward);
  enemy.state = "windup";
  enemy.stateTimer = enemyAttackTimings[enemy.currentAttack].windup;
  enemy.hasHitPlayer = false;
  enemy.rockSlamCrashPlayed = false;
  return true;
}

function chooseEnemyAttack(enemy: EnemyState, distanceToPlayer: number): TelegraphKind | null {
  if (enemy.monsterId === "shroom_boy") {
    if (enemy.attackCooldowns.spore_cloud <= 0) return "spore_cloud";
    if (distanceToPlayer <= shroomMeleeRange && enemy.attackCooldowns.bite <= 0) return "bite";
    if (distanceToPlayer > shroomMeleeRange && enemy.attackCooldowns.shroom_toss <= 0) return "shroom_toss";
    return null;
  }

  if (enemy.monsterId === "tree_goblin") {
    if (enemy.attackCooldowns.head_throw <= 0) return "head_throw";
    if (distanceToPlayer <= treeGoblinArmRange && enemy.attackCooldowns.arm_attack <= 0) return "arm_attack";
    return null;
  }

  if (distanceToPlayer > rockSprayRange) return "rock_throw";

  const nextAttack = closeAttackSequence[enemy.attackIndex % closeAttackSequence.length];
  enemy.attackIndex += 1;
  return nextAttack;
}

function applyEnemyAttackCooldown(enemy: EnemyState, attack: TelegraphKind) {
  if (enemy.monsterId === "shroom_boy") {
    if (attack === "spore_cloud") enemy.attackCooldowns.spore_cloud = 12;
    if (attack === "shroom_toss") enemy.attackCooldowns.shroom_toss = 6;
    if (attack === "bite") enemy.attackCooldowns.bite = 3;
  }

  if (enemy.monsterId === "tree_goblin") {
    if (attack === "head_throw") enemy.attackCooldowns.head_throw = 15;
    if (attack === "arm_attack") enemy.attackCooldowns.arm_attack = 2.6;
  }
}

function isProjectileAttack(attack: TelegraphKind) {
  return attack === "rock_throw" || attack === "spore_cloud" || attack === "shroom_toss" || attack === "head_throw";
}

function updateEnemyAttackCooldowns(enemy: EnemyState, delta: number) {
  Object.keys(enemy.attackCooldowns).forEach((key) => {
    const attack = key as TelegraphKind;
    enemy.attackCooldowns[attack] = Math.max(0, enemy.attackCooldowns[attack] - delta);
  });
}

function resolveEnemyHit(state: GameState, enemy: EnemyState, events: GameEvent[]) {
  if (enemy.hasHitPlayer) return;

  if (enemy.currentAttack === "rock_throw") {
    spawnEnemyRockThrow(state, enemy);
    enemy.hasHitPlayer = true;
    return;
  }

  if (enemy.currentAttack === "spore_cloud") {
    spawnShroomSporeCloud(state, enemy);
    enemy.hasHitPlayer = true;
    events.push(logEvent("Spore cloud", "The cloud drifts toward you"));
    return;
  }

  if (enemy.currentAttack === "shroom_toss") {
    spawnShroomlingToss(state, enemy);
    enemy.hasHitPlayer = true;
    events.push(logEvent("Shroom toss", "A little cap hits the floor running"));
    return;
  }

  if (enemy.currentAttack === "head_throw") {
    spawnTreeGoblinHeadThrow(state, enemy);
    enemy.hasHitPlayer = true;
    events.push(logEvent("Head throw", "The head whirls in widening circles"));
    return;
  }

  if (state.player.invulnerableTime > 0) return;

  const distanceToPlayer = distance(state.player, enemy);
  let hit = false;
  let damage = 0;

  if (enemy.currentAttack === "rock_slam") {
    hit = distanceToPlayer <= 155;
    damage = 24;
  } else if (enemy.currentAttack === "bite") {
    damage = 12;
    if (distanceToPlayer <= 96) {
      const toPlayer = { x: state.player.x - enemy.x, y: state.player.y - enemy.y };
      normalize(toPlayer);
      hit = dot(enemy.attackForward, toPlayer) > Math.cos(Math.PI * 0.28);
    }
  } else if (enemy.currentAttack === "arm_attack") {
    damage = 17;
    if (distanceToPlayer <= treeGoblinArmRange) {
      const toPlayer = { x: state.player.x - enemy.x, y: state.player.y - enemy.y };
      normalize(toPlayer);
      hit = dot(enemy.attackForward, toPlayer) > Math.cos(Math.PI * 0.36);
    }
  } else {
    damage = 18;
    if (distanceToPlayer <= 260) {
      const toPlayer = { x: state.player.x - enemy.x, y: state.player.y - enemy.y };
      normalize(toPlayer);
      hit = dot(enemy.attackForward, toPlayer) > Math.cos(Math.PI * 0.34);
    }
  }

  if (hit) {
    enemy.hasHitPlayer = true;
    state.player.health = Math.max(0, state.player.health - damage);
    state.player.anim = "damage";
    events.push(logEvent(`Hit for ${damage}`, "Watch the telegraph timing"));
    if (state.player.health <= 0) defeatPlayer(state, events);
  }
}

export function setMonsterAnimation(enemy: EnemyState, nextAnim: MonsterAnimationName) {
  if (enemy.anim !== nextAnim) {
    enemy.anim = nextAnim;
    enemy.animFrame = 0;
    enemy.animTimer = 0;
  }
}
