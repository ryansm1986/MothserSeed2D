import { directionFromVector, distance, lengthSq, normalize } from "../math";
import { applyEnemyChain, dealEnemyDamage, dealSpecificEnemyDamage, defeatPlayer } from "./damage";
import { allEnemies, livingEnemies, logEvent, soundEvent, type EnemyState, type GameEvent, type GameState } from "../state";
import type { CardinalDirectionName, Vec2 } from "../types";

export const magicMissileCastTiming = {
  releaseDelay: 0.28,
  attackFlash: 0.7,
} as const;

export const magicMissileLifetime = 1.4;
export const magicMissileAnimationRate = 0.075;
export const magicMissileForwardRotation = Math.PI;
export const enemyRockThrowAnimationRate = 0.08;
export const shroomlingAnimationRate = 0.095;
export const treeGoblinHeadAnimationRate = 0.1;
export const moonfallCastTiming = {
  releaseDelay: 0.62,
  specialFlash: 1.08,
} as const;
export const moonfallStrikeDuration = 1.64;
export const moonfallImpactDuration = 0.68;
export const moonfallFrameScale = 0.864;
export const motherslashCastTiming = {
  specialFlash: 1.6,
} as const;
export const motherslashWaveAnimationRate = 0.085;
export const motherslashWaveHitBand = 30;
const shroomSporeCloudSpeed = 62;
const shroomlingCrawlSpeed = 185;
const treeGoblinHeadDuration = 5.4;
const treeGoblinHeadReturnStart = 4.35;

export function motherslashWaveRadius(wave: { timer: number; duration: number; maxRadius: number }) {
  const progress = Math.min(Math.max(wave.timer / wave.duration, 0), 1);
  const eased = progress * progress * (3 - 2 * progress);
  return wave.maxRadius * eased;
}

export function updatePendingMagicMissileCast(state: GameState, delta: number) {
  const pendingCast = state.combat.pendingMagicMissileCast;
  if (!pendingCast) return;
  pendingCast.timer -= delta;

  if (pendingCast.timer > 0) return;

  const { damage } = pendingCast;
  state.combat.pendingMagicMissileCast = null;
  if (!state.combat.targetLocked || state.player.lifeState !== "alive" || state.enemy.health <= 0 || state.enemy.state === "dead") return;
  spawnMagicMissile(state, damage);
}

export function spawnMagicMissile(state: GameState, damage: number) {
  const castDirection = { x: state.enemy.x - state.player.x, y: state.enemy.y - state.player.y };
  if (lengthSq(castDirection) > 0.001) {
    normalize(castDirection);
  } else {
    castDirection.x = state.player.facing.x;
    castDirection.y = state.player.facing.y;
  }
  const castOffset = {
    x: castDirection.x * 24,
    y: castDirection.y * 18 - 26,
  };

  state.combat.magicMissiles.push({
    x: state.player.x + castOffset.x,
    y: state.player.y + castOffset.y,
    rotation: Math.atan2(castDirection.y, castDirection.x),
    speed: 640,
    damage,
    ttl: magicMissileLifetime,
  });
}

export function updateMagicMissiles(state: GameState, delta: number, events: GameEvent[]) {
  for (let index = state.combat.magicMissiles.length - 1; index >= 0; index -= 1) {
    const missile = state.combat.magicMissiles[index];
    missile.ttl -= delta;

    if (state.enemy.state !== "dead" && state.enemy.visible) {
      const toEnemy = { x: state.enemy.x - missile.x, y: state.enemy.y - missile.y };
      if (lengthSq(toEnemy) > 0.001) {
        normalize(toEnemy);
        missile.rotation = Math.atan2(toEnemy.y, toEnemy.x);
        missile.x += toEnemy.x * missile.speed * delta;
        missile.y += toEnemy.y * missile.speed * delta;
      }

      if (distance(missile, state.enemy) <= state.enemy.radius + 18) {
        state.combat.magicMissiles.splice(index, 1);
        dealEnemyDamage(state, missile.damage, "Magic Missile", events);
        state.player.meter = Math.min(state.player.maxMeter, state.player.meter + 7);
        continue;
      }
    }

    if (missile.ttl <= 0) {
      state.combat.magicMissiles.splice(index, 1);
    }
  }
}

export function spawnEnemyRockThrow(state: GameState, enemy: EnemyState = state.enemy) {
  const throwDirection = { ...enemy.attackForward };
  if (lengthSq(throwDirection) > 0.001) {
    normalize(throwDirection);
  } else {
    throwDirection.x = 0;
    throwDirection.y = 1;
  }

  const start = {
    x: enemy.x + throwDirection.x * 58,
    y: enemy.y + throwDirection.y * 42,
  };
  const target = {
    x: state.player.x,
    y: state.player.y,
  };
  const toTarget = { x: target.x - start.x, y: target.y - start.y };
  const travelDistance = Math.max(Math.hypot(toTarget.x, toTarget.y), 1);
  const duration = Math.min(0.72, Math.max(0.28, travelDistance / 820));

  state.combat.enemyRockThrows.push({
    x: start.x,
    y: start.y,
    vx: toTarget.x / duration,
    vy: toTarget.y / duration,
    damage: 22,
    radius: 24,
    timer: 0,
    duration,
    rotation: Math.atan2(throwDirection.y, throwDirection.x),
    spin: throwDirection.x >= 0 ? 13 : -13,
  });
}

export function updateEnemyRockThrows(state: GameState, delta: number, events: GameEvent[]) {
  for (let index = state.combat.enemyRockThrows.length - 1; index >= 0; index -= 1) {
    const projectile = state.combat.enemyRockThrows[index];
    projectile.timer += delta;
    projectile.x += projectile.vx * delta;
    projectile.y += projectile.vy * delta;
    projectile.rotation += projectile.spin * delta;

    if (
      state.player.lifeState === "alive"
      && state.player.invulnerableTime <= 0
      && distance(projectile, state.player) <= state.player.radius + projectile.radius
    ) {
      state.combat.enemyRockThrows.splice(index, 1);
      state.player.health = Math.max(0, state.player.health - projectile.damage);
      state.player.anim = "damage";
      events.push(logEvent(`Rock throw: ${projectile.damage}`, "The boulder found its mark"));
      if (state.player.health <= 0) defeatPlayer(state, events);
      continue;
    }

    if (projectile.timer >= projectile.duration + 0.25) {
      state.combat.enemyRockThrows.splice(index, 1);
    }
  }
}

export function spawnShroomSporeCloud(state: GameState, enemy: EnemyState) {
  const castDirection = { ...enemy.attackForward };
  if (lengthSq(castDirection) > 0.001) {
    normalize(castDirection);
  } else {
    castDirection.x = 0;
    castDirection.y = 1;
  }

  state.combat.shroomSporeClouds.push({
    x: enemy.x + castDirection.x * 64,
    y: enemy.y + castDirection.y * 44,
    radius: 72,
    timer: 0,
    duration: 10,
    damage: 5,
    hitTimer: 0,
  });
}

export function updateShroomSporeClouds(state: GameState, delta: number, events: GameEvent[]) {
  for (let index = state.combat.shroomSporeClouds.length - 1; index >= 0; index -= 1) {
    const cloud = state.combat.shroomSporeClouds[index];
    cloud.timer += delta;
    cloud.hitTimer = Math.max(0, cloud.hitTimer - delta);

    const toPlayer = { x: state.player.x - cloud.x, y: state.player.y - cloud.y };
    if (lengthSq(toPlayer) > 0.001) {
      normalize(toPlayer);
      cloud.x += toPlayer.x * shroomSporeCloudSpeed * delta;
      cloud.y += toPlayer.y * shroomSporeCloudSpeed * delta;
    }

    if (
      state.player.lifeState === "alive"
      && state.player.invulnerableTime <= 0
      && cloud.hitTimer <= 0
      && distance(cloud, state.player) <= state.player.radius + cloud.radius * 0.72
    ) {
      cloud.hitTimer = 0.8;
      state.player.health = Math.max(0, state.player.health - cloud.damage);
      state.player.anim = "damage";
      events.push(logEvent(`Poison spores: ${cloud.damage}`, "The cloud clings to you"));
      if (state.player.health <= 0) defeatPlayer(state, events);
    }

    if (cloud.timer >= cloud.duration) {
      state.combat.shroomSporeClouds.splice(index, 1);
    }
  }
}

export function spawnShroomlingToss(state: GameState, enemy: EnemyState) {
  const throwDirection = { ...enemy.attackForward };
  if (lengthSq(throwDirection) > 0.001) {
    normalize(throwDirection);
  } else {
    throwDirection.x = 0;
    throwDirection.y = 1;
  }

  const start = {
    x: enemy.x + throwDirection.x * 42,
    y: enemy.y + throwDirection.y * 28,
  };
  const target = {
    x: state.player.x,
    y: state.player.y,
  };
  const tossDuration = 0.46;

  state.combat.shroomlings.push({
    x: start.x,
    y: start.y,
    vx: (target.x - start.x) / tossDuration,
    vy: (target.y - start.y) / tossDuration,
    direction: cardinalDirectionFromVector(throwDirection),
    radius: 18,
    timer: 0,
    tossDuration,
    duration: 5,
    damage: 9,
    attackTimer: 0,
  });
}

export function updateShroomlings(state: GameState, delta: number, events: GameEvent[]) {
  for (let index = state.combat.shroomlings.length - 1; index >= 0; index -= 1) {
    const shroomling = state.combat.shroomlings[index];
    shroomling.timer += delta;
    shroomling.attackTimer = Math.max(0, shroomling.attackTimer - delta);

    if (shroomling.timer < shroomling.tossDuration) {
      shroomling.x += shroomling.vx * delta;
      shroomling.y += shroomling.vy * delta;
      shroomling.direction = cardinalDirectionFromVector({ x: shroomling.vx, y: shroomling.vy });
    } else {
      const toPlayer = { x: state.player.x - shroomling.x, y: state.player.y - shroomling.y };
      if (lengthSq(toPlayer) > 0.001) {
        normalize(toPlayer);
        shroomling.x += toPlayer.x * shroomlingCrawlSpeed * delta;
        shroomling.y += toPlayer.y * shroomlingCrawlSpeed * delta;
        shroomling.direction = cardinalDirectionFromVector(toPlayer);
      }
    }

    if (
      state.player.lifeState === "alive"
      && state.player.invulnerableTime <= 0
      && shroomling.attackTimer <= 0
      && distance(shroomling, state.player) <= state.player.radius + shroomling.radius
    ) {
      shroomling.attackTimer = 0.7;
      state.player.health = Math.max(0, state.player.health - shroomling.damage);
      state.player.anim = "damage";
      events.push(logEvent(`Shroomling bite: ${shroomling.damage}`, "The tossed cap snaps at your heels"));
      if (state.player.health <= 0) defeatPlayer(state, events);
    }

    if (shroomling.timer >= shroomling.duration) {
      state.combat.shroomlings.splice(index, 1);
    }
  }
}

function cardinalDirectionFromVector(vector: Vec2): CardinalDirectionName {
  const direction = directionFromVector(vector);
  if (direction === "left" || direction === "up" || direction === "right" || direction === "down") return direction;
  if (direction === "up_left" || direction === "up_right") return "up";
  return "down";
}

export function spawnTreeGoblinHeadThrow(state: GameState, enemy: EnemyState) {
  const throwDirection = { ...enemy.attackForward };
  if (lengthSq(throwDirection) > 0.001) {
    normalize(throwDirection);
  } else {
    throwDirection.x = 0;
    throwDirection.y = 1;
  }

  const start = {
    x: enemy.x + throwDirection.x * 52,
    y: enemy.y + throwDirection.y * 36 - 24,
  };

  state.combat.treeGoblinHeads.push({
    ownerId: enemy.instanceId,
    originX: start.x,
    originY: start.y,
    x: start.x,
    y: start.y,
    baseAngle: Math.atan2(state.player.y - start.y, state.player.x - start.x),
    radius: 26,
    timer: 0,
    duration: treeGoblinHeadDuration,
    damage: 13,
    hitTimer: 0,
  });
}

export function updateTreeGoblinHeads(state: GameState, delta: number, events: GameEvent[]) {
  for (let index = state.combat.treeGoblinHeads.length - 1; index >= 0; index -= 1) {
    const head = state.combat.treeGoblinHeads[index];
    const owner = allEnemies(state).find((enemy) => enemy.instanceId === head.ownerId);
    if (!owner || owner.state === "dead" || !owner.visible) {
      state.combat.treeGoblinHeads.splice(index, 1);
      continue;
    }

    head.timer += delta;
    head.hitTimer = Math.max(0, head.hitTimer - delta);

    const activeProgress = Math.min(head.timer / treeGoblinHeadReturnStart, 1);
    const easedProgress = activeProgress * activeProgress * (3 - 2 * activeProgress);
    const forward = {
      x: Math.cos(head.baseAngle),
      y: Math.sin(head.baseAngle),
    };
    const side = {
      x: -forward.y,
      y: forward.x,
    };
    const travel = 42 + easedProgress * 286;
    const spiralRadius = 18 + easedProgress * 92;
    const spinAngle = head.timer * (2.45 + activeProgress * 1.25);
    const orbitPoint = {
      x: head.originX + forward.x * travel + side.x * Math.cos(spinAngle) * spiralRadius + forward.x * Math.sin(spinAngle) * spiralRadius * 0.34,
      y: head.originY + forward.y * travel + side.y * Math.cos(spinAngle) * spiralRadius * 0.72 + forward.y * Math.sin(spinAngle) * spiralRadius * 0.24,
    };

    if (head.timer < treeGoblinHeadReturnStart) {
      head.x = orbitPoint.x;
      head.y = orbitPoint.y;
    } else {
      const returnProgress = Math.min((head.timer - treeGoblinHeadReturnStart) / (head.duration - treeGoblinHeadReturnStart), 1);
      const eased = returnProgress * returnProgress * (3 - 2 * returnProgress);
      head.x = orbitPoint.x + (owner.x - orbitPoint.x) * eased;
      head.y = orbitPoint.y + (owner.y - 48 - orbitPoint.y) * eased;
    }

    if (
      head.timer < treeGoblinHeadReturnStart
      && state.player.lifeState === "alive"
      && state.player.invulnerableTime <= 0
      && head.hitTimer <= 0
      && distance(head, state.player) <= state.player.radius + head.radius
    ) {
      head.hitTimer = 0.52;
      state.player.health = Math.max(0, state.player.health - head.damage);
      state.player.anim = "damage";
      events.push(logEvent(`Flying head: ${head.damage}`, "The spinning head clips you"));
      if (state.player.health <= 0) defeatPlayer(state, events);
    }

    if (head.timer >= head.duration) {
      state.combat.treeGoblinHeads.splice(index, 1);
    }
  }
}

export function spawnMotherslashWaves(state: GameState, damage: number, maxRadius: number) {
  const center = {
    x: state.player.x,
    y: state.player.y + 8,
  };
  const pulseWeights = [0.42, 0.34, 0.24];
  const pulseDelays = [0.1, 0.3, 0.5];

  state.combat.motherslashWaves.length = 0;
  pulseWeights.forEach((weight, index) => {
    state.combat.motherslashWaves.push({
      ...center,
      timer: -pulseDelays[index],
      delay: pulseDelays[index],
      duration: 0.74 + index * 0.08,
      maxRadius,
      damage: Math.max(1, Math.round(damage * weight)),
      hitEnemyIds: [],
    });
  });
}

export function updateMotherslashWaves(state: GameState, delta: number, events: GameEvent[]) {
  for (let index = state.combat.motherslashWaves.length - 1; index >= 0; index -= 1) {
    const wave = state.combat.motherslashWaves[index];
    if (!wave) continue;
    wave.timer += delta;

    if (wave.timer < 0) continue;

    const progress = Math.min(wave.timer / wave.duration, 1);
    const radius = motherslashWaveRadius(wave);
    livingEnemies(state).forEach((enemy) => {
      const enemyDistance = distance(wave, enemy);
      const hasReachedEnemy = Math.abs(enemyDistance - radius) <= enemy.radius + motherslashWaveHitBand;

      if (wave.hitEnemyIds.includes(enemy.instanceId) || progress < 0.1 || !hasReachedEnemy) return;

      wave.hitEnemyIds.push(enemy.instanceId);
      dealSpecificEnemyDamage(state, enemy, wave.damage, "Motherslash", events);
      if (enemy.health > 0 && enemy.visible) {
        state.player.meter = Math.min(state.player.maxMeter, state.player.meter + 5);
        applyEnemyChain(enemy, "Cyclone", 4.5);
      }
    });

    if (wave.timer >= wave.duration + 0.18) {
      state.combat.motherslashWaves.splice(index, 1);
    }
  }
}

export function updateMoonfallStrikes(state: GameState, delta: number, events: GameEvent[], moonfallFrameCount: number) {
  for (let index = state.combat.moonfallStrikes.length - 1; index >= 0; index -= 1) {
    const strike = state.combat.moonfallStrikes[index];
    strike.timer += delta;
    const progress = Math.min(strike.timer / strike.duration, 1);
    const finalFrameStart = moonfallFrameCount > 1 ? (moonfallFrameCount - 1) / moonfallFrameCount : 0.78;

    if (!strike.impacted && progress >= 0.78) {
      strike.impacted = true;
      const hitEnemies = livingEnemies(state).filter((enemy) => distance({ x: strike.x, y: strike.targetY }, enemy) <= strike.radius);
      if (hitEnemies.length > 0) {
        hitEnemies.forEach((enemy) => {
          dealSpecificEnemyDamage(state, enemy, strike.damage, "Moonfall", events);
          applyEnemyChain(enemy, "Moonstruck", 5);
        });
      } else {
        events.push(logEvent("Moonfall missed", "The target slipped away"));
      }
    }

    if (!strike.crashPlayed && progress >= finalFrameStart) {
      strike.crashPlayed = true;
      events.push(soundEvent("moonfallCrash"));
    }

    if (strike.timer >= strike.duration + moonfallImpactDuration) {
      state.combat.moonfallStrikes.splice(index, 1);
    }
  }
}

export function updatePendingMoonfallCast(state: GameState, delta: number) {
  const pendingCast = state.combat.pendingMoonfallCast;
  if (!pendingCast) return;
  pendingCast.timer -= delta;

  if (pendingCast.timer > 0) return;

  state.combat.pendingMoonfallCast = null;
  if (state.player.lifeState !== "alive" || state.enemy.health <= 0 || state.enemy.state === "dead") return;

  state.combat.moonfallStrikes.push({
    x: pendingCast.x,
    startY: pendingCast.y - 430,
    targetY: pendingCast.y,
    timer: 0,
    duration: moonfallStrikeDuration,
    damage: pendingCast.damage,
    radius: pendingCast.radius,
    impacted: false,
    crashPlayed: false,
  });
}
