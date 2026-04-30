import { activeAbilities, logEvent, soundEvent, type GameEvent, type GameState } from "../state";
import { directionFromVector, distance, lengthSq } from "../math";
import { applyChain, dealEnemyDamage } from "./damage";
import { magicMissileCastTiming, moonfallCastTiming, motherslashCastTiming, spawnMotherslashWaves } from "./projectiles";

const defaultAttackCooldown = 3;

export function castSpecial(state: GameState, index: number): GameEvent[] {
  const events: GameEvent[] = [];
  const { player, enemy, combat } = state;
  if (player.lifeState !== "alive") return events;
  const ability = activeAbilities(state)[index];
  if (!ability || enemy.state === "dead") return events;
  const cooldown = combat.cooldowns[ability.id] ?? 0;
  const distanceToEnemy = distance(player, enemy);

  if (cooldown > 0 || player.meter < ability.cost) return events;
  if (distanceToEnemy > ability.range && ability.id !== "motherslash" && ability.id !== "ward-pulse") {
    events.push(logEvent(`${ability.name} out of range`, ""));
    return events;
  }

  player.meter -= ability.cost;
  combat.cooldowns[ability.id] = ability.cooldown;
  player.specialFlash = 1.18;

  if (ability.id === "moonfall") {
    player.specialFlash = moonfallCastTiming.specialFlash;
    events.push(soundEvent("moonfallVoice"), soundEvent("moonfallPortal"));
    const toEnemy = { x: enemy.x - player.x, y: enemy.y - player.y };
    if (lengthSq(toEnemy) > 0.001) player.direction = directionFromVector(toEnemy);
    combat.pendingMoonfallCast = {
      x: enemy.x,
      y: enemy.y,
      damage: 48 + Math.ceil(combat.equippedGear.power * 0.75),
      radius: 132,
      timer: moonfallCastTiming.releaseDelay,
    };
    events.push(logEvent("Moonfall called", "The spell gathers overhead"));
  }

  if (ability.id === "motherslash") {
    const toEnemy = { x: enemy.x - player.x, y: enemy.y - player.y };
    if (lengthSq(toEnemy) > 0.001) player.direction = directionFromVector(toEnemy);
    player.specialFlash = motherslashCastTiming.specialFlash;
    player.invulnerableTime = Math.max(player.invulnerableTime, 0.28);
    spawnMotherslashWaves(state, 50 + Math.ceil(combat.equippedGear.power * 1.2), ability.range);
    applyChain(state, "Cyclone", 4.5);
    events.push(
      soundEvent("warriorByMothertree"),
      soundEvent("motherslashPulseWave"),
      logEvent("Motherslash", "Cyclone waves pulse outward"),
    );
  }

  if (ability.id === "radiant-brand") {
    dealEnemyDamage(state, 17 + combat.equippedGear.power, "Radiant Brand", events);
    applyChain(state, "Radiant", 8);
    events.push(logEvent("Radiant primer applied", "Judgment can detonate it"));
  }

  if (ability.id === "ward-pulse") {
    player.invulnerableTime = 0.5;
    player.health = Math.min(player.maxHealth, player.health + 18);
    events.push(logEvent("Ward Pulse", "Recovered health and steadied your guard"));
    if (distanceToEnemy <= ability.range) {
      dealEnemyDamage(state, 10 + combat.equippedGear.power, "Ward Pulse", events);
    }
  }

  if (ability.id === "judgment") {
    let damage = 25 + combat.equippedGear.power;
    if (enemy.chainTag === "Radiant") {
      damage += 24;
      player.health = Math.min(player.maxHealth, player.health + 12);
      applyChain(state, "Consecrated", 5);
      events.push(logEvent("Consecrated chain", "Radiant detonated by Judgment"));
    }
    dealEnemyDamage(state, damage, "Judgment", events);
  }

  return events;
}

export function updateAutoAttack(state: GameState, events: GameEvent[]) {
  const { player, enemy, combat } = state;
  if (player.lifeState !== "alive") return;
  if (!combat.targetLocked || enemy.health <= 0) return;
  const isMage = state.selectedClassId === "mage";
  const autoRange = isMage ? 520 : 120;
  if (distance(player, enemy) > autoRange || player.autoTimer > 0) return;

  player.autoTimer = defaultAttackCooldown;
  player.autoCount += 1;

  if (isMage) {
    player.attackFlash = magicMissileCastTiming.attackFlash;
    const damage = 10 + Math.ceil(combat.equippedGear.power * 0.6) + (player.autoCount % 3 === 0 ? 5 : 0);
    combat.pendingMagicMissileCast = {
      damage,
      timer: magicMissileCastTiming.releaseDelay,
    };
    return;
  }

  player.attackFlash = 0.82;
  const isHeavySwing = player.autoCount % 3 === 0;
  events.push(soundEvent("warriorSwordSwish"));
  if (isHeavySwing) events.push(soundEvent("warriorHyah"));

  let damage = 8 + combat.equippedGear.power;
  if (isHeavySwing) {
    damage += 5;
    if (combat.equippedGear.rarity !== "Common") {
      enemy.bleedTimer = 5;
      enemy.bleedTick = 1;
      applyChain(state, "Bleed", 5);
    }
  }

  dealEnemyDamage(state, damage, "Sword Slash", events);
  events.push(soundEvent("warriorSwordThump"));
  player.meter = Math.min(player.maxMeter, player.meter + 8);
}

export function updateCooldowns(state: GameState, delta: number) {
  activeAbilities(state).forEach((ability) => {
    state.combat.cooldowns[ability.id] = Math.max(0, (state.combat.cooldowns[ability.id] ?? 0) - delta);
  });
}
