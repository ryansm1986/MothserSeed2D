import { activeLatticeSequence, activeWeaponSpecials, logEvent, soundEvent, type GameEvent, type GameState } from "../state";
import { directionFromVector, distance, lengthSq } from "../math";
import { applyChain, dealEnemyDamage } from "./damage";
import { magicMissileCastTiming, moonfallCastTiming, motherslashCastTiming, spawnMotherslashWaves } from "./projectiles";

const autoLoopRestartCooldown = 3;
const hasteMultiplier = 1.8;

export function castSpecial(state: GameState, index: number): GameEvent[] {
  const events: GameEvent[] = [];
  const { player, enemy, combat } = state;
  if (player.lifeState !== "alive") return events;
  const ability = activeWeaponSpecials(state)[index];
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

export function updateAutoAttack(state: GameState, delta: number, events: GameEvent[]) {
  const { player, enemy, combat } = state;
  if (player.lifeState !== "alive") return;
  if (!combat.targetLocked || enemy.health <= 0) return;
  if (enemy.state === "dead" || !enemy.visible) return;

  const loop = combat.autoLoop;
  loop.hasteTimer = Math.max(0, loop.hasteTimer - delta);
  loop.hasteMultiplier = loop.hasteTimer > 0 ? hasteMultiplier : 1;
  const adjustedDelta = delta * loop.hasteMultiplier;

  if (loop.restartTimer > 0) {
    loop.restartTimer = Math.max(0, loop.restartTimer - adjustedDelta);
    if (loop.restartTimer > 0) return;
    loop.currentSlotIndex = 0;
    loop.lastResolvedKind = null;
  }

  if (loop.slotTimer > 0) {
    loop.slotTimer = Math.max(0, loop.slotTimer - adjustedDelta);
    if (loop.slotTimer > 0) return;
  }

  const sequence = activeLatticeSequence(state);
  const nextSlotIndex = nextFilledSlotIndex(sequence, loop.currentSlotIndex);
  if (nextSlotIndex < 0) {
    loop.currentSlotIndex = 0;
    loop.restartTimer = autoLoopRestartCooldown;
    loop.lastResolvedKind = null;
    return;
  }

  const ability = sequence[nextSlotIndex];
  if (!ability) return;
  if (ability.kind !== "haste" && distance(player, enemy) > ability.range) return;

  const didExecute = executeLatticeAbility(state, nextSlotIndex, events);
  if (!didExecute) return;

  const laterSlotIndex = nextFilledSlotIndex(sequence, nextSlotIndex + 1);
  if (laterSlotIndex < 0) {
    loop.currentSlotIndex = 0;
    loop.restartTimer = autoLoopRestartCooldown;
    loop.slotTimer = 0;
  } else {
    loop.currentSlotIndex = laterSlotIndex;
    loop.slotTimer = ability.baseCooldown;
  }
}

export function updateCooldowns(state: GameState, delta: number) {
  activeWeaponSpecials(state).forEach((ability) => {
    state.combat.cooldowns[ability.id] = Math.max(0, (state.combat.cooldowns[ability.id] ?? 0) - delta);
  });
}

function nextFilledSlotIndex<T>(slots: Array<T | null>, startIndex: number) {
  for (let index = startIndex; index < slots.length; index += 1) {
    if (slots[index]) return index;
  }
  return -1;
}

function executeLatticeAbility(state: GameState, slotIndex: number, events: GameEvent[]) {
  const ability = activeLatticeSequence(state)[slotIndex];
  if (!ability) return false;

  if (ability.kind === "haste") {
    state.combat.autoLoop.hasteTimer = ability.duration ?? 1;
    state.combat.autoLoop.hasteMultiplier = hasteMultiplier;
    state.combat.autoLoop.lastResolvedKind = ability.kind;
    events.push(logEvent("Lattice Haste", "Auto sequence quickened for 1 second"));
    return true;
  }

  if (ability.kind === "combo_attack" && state.combat.autoLoop.lastResolvedKind !== "basic_attack_1") {
    state.combat.autoLoop.lastResolvedKind = ability.kind;
    events.push(logEvent("Combo Attack skipped", "Needs Basic Attack 1 earlier in the sequence"));
    return true;
  }

  const damage = ability.kind === "combo_attack"
    ? Math.max(1, Math.round(basicWeaponDamage(state) * 0.8))
    : basicWeaponDamage(state);
  dealBasicWeaponAttack(state, damage, ability.kind === "combo_attack" ? "Combo Attack" : "Basic Attack 1", slotIndex, events);
  state.combat.autoLoop.lastResolvedKind = ability.kind;
  return true;
}

function basicWeaponDamage(state: GameState) {
  const isMage = state.selectedClassId === "mage";
  const base = isMage ? 10 + Math.ceil(state.combat.equippedGear.power * 0.6) : 8 + state.combat.equippedGear.power;
  return base + (state.player.autoCount % 3 === 2 ? 5 : 0);
}

function dealBasicWeaponAttack(state: GameState, damage: number, source: string, slotIndex: number, events: GameEvent[]) {
  const { player, enemy, combat } = state;
  player.autoCount += 1;

  const fireDamage = modifierForSlot(state, slotIndex)?.id === "mod:fire" ? 4 + Math.ceil(combat.equippedGear.power * 0.25) : 0;
  const totalDamage = damage + fireDamage;

  if (state.selectedClassId === "mage") {
    player.attackFlash = magicMissileCastTiming.attackFlash;
    combat.pendingMagicMissileCast = {
      damage: totalDamage,
      timer: magicMissileCastTiming.releaseDelay,
    };
    if (fireDamage > 0) events.push(logEvent("Fire Modifier", `Next missile carries +${fireDamage} fire`));
    return;
  }

  player.attackFlash = 0.82;
  events.push(soundEvent("warriorSwordSwish"));
  if (player.autoCount % 3 === 0) events.push(soundEvent("warriorHyah"));
  dealEnemyDamage(state, totalDamage, fireDamage > 0 ? `${source} + Fire` : source, events);
  if (fireDamage > 0) applyChain(state, "Fire", 3);
  if (source === "Basic Attack 1" && player.autoCount % 3 === 0 && combat.equippedGear.rarity !== "Common") {
    enemy.bleedTimer = 5;
    enemy.bleedTick = 1;
    applyChain(state, "Bleed", 5);
  }
  events.push(soundEvent("warriorSwordThump"));
  player.meter = Math.min(player.maxMeter, player.meter + 8);
}

function modifierForSlot(state: GameState, slotIndex: number) {
  const modifierId = state.combat.branchLattice.modifierSlotIds[slotIndex];
  if (!modifierId) return null;
  return state.combat.equippedGear.frame.modifierOptions.find((option) => option.id === modifierId) ?? null;
}
