import { castSpecial, updateAutoAttack } from "../src/game/combat/abilities";
import { equipDrop, generateGear } from "../src/game/combat/gear";
import { clampToArena } from "../src/game/world/collision";
import { world } from "../src/game/world/arena";
import { distance } from "../src/game/math";
import { createInputState } from "../src/game/input-actions";
import { updateSimulation } from "../src/game/simulation";
import { activeLatticeSequence, activeWeaponSpecials, applySelectedClass, createInitialGameState, type GameEvent } from "../src/game/state";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const state = createInitialGameState("warrior");
const serializedState = JSON.stringify(state);
assert(serializedState.includes("Recruit's Greatsword"), "initial state should be JSON serializable");
assert(serializedState.includes("branchLattice"), "initial state should include Branch Lattice data");
assert(state.combat.equippedGear.frame.weaponSpecials.length > 0, "initial gear should include weapon specials");
assert(state.combat.equippedGear.frame.latticeAbilityOptions.length > 0, "initial gear should include lattice ability options");
assert(state.combat.equippedGear.frame.modifierOptions.length > 0, "initial gear should include frame modifier options");

assert(applySelectedClass(state, "mage"), "implemented mage class should apply");
assert(state.player.maxHealth === 95, "mage health should be copied into player state");

const farPoint = { x: world.center.x + 5000, y: world.center.y + 5000 };
clampToArena(farPoint);
assert(distance(farPoint, world.center) < world.safeRadius * 1.1, "arena clamp should pull far point near safe radius");

state.player.stamina = 100;
const input = createInputState();
input.pressedActions.add("dodge");
const dodgeEvents = updateSimulation(state, input, 0.016);
assert(state.player.invulnerableTime > 0, "dodge should grant invulnerability time");
assert(dodgeEvents.some((event) => event.kind === "log" && event.message === "Dodge window"), "dodge should emit a log event");

state.selectedClassId = "mage";
state.player.lifeState = "alive";
state.player.meter = 120;
state.enemy.state = "idle";
state.enemy.health = state.enemy.maxHealth;
state.enemy.x = state.player.x + 80;
state.enemy.y = state.player.y;
const specialEvents = castSpecial(state, 0);
assert(activeWeaponSpecials(state)[0].id === "moonfall", "mage starting weapon special should be Moonfall");
assert(state.combat.cooldowns.moonfall > 0, "moonfall should set a cooldown");
assert(state.combat.pendingMoonfallCast, "moonfall should queue a pending cast");
assert(specialEvents.some((event) => event.kind === "sound" && event.id === "moonfallVoice"), "moonfall should emit sound events");

state.player.invulnerableTime = 0;
state.enemy.state = "active";
state.enemy.currentAttack = "rock_slam";
state.enemy.stateTimer = 0.2;
state.enemy.x = state.player.x;
state.enemy.y = state.player.y;
const healthBeforeHit = state.player.health;
updateSimulation(state, createInputState(), 0.016);
assert(state.player.health < healthBeforeHit, "active rock slam should damage a nearby non-invulnerable player");

state.player.health = state.player.maxHealth;
state.player.invulnerableTime = 0;
state.enemy.state = "windup";
state.enemy.currentAttack = "rock_slam";
state.enemy.anim = "rock_slam";
state.enemy.animFrame = 0;
state.enemy.animTimer = 0;
state.enemy.stateTimer = 0.01;
state.enemy.hasHitPlayer = false;
state.enemy.rockSlamCrashPlayed = false;
state.enemy.x = state.player.x;
state.enemy.y = state.player.y;
const healthBeforeSyncedSlam = state.player.health;
const syncedSlamEvents = updateSimulation(state, createInputState(), 0.016, {
  playerFrameCount: () => 1,
  monsterFrameCount: () => 8,
  moonfallFrameCount: () => 1,
});
assert(state.enemy.state === "active", "rock slam should become active after windup expires");
assert(state.enemy.animFrame === 7, "rock slam should reach its final frame when damage is dealt");
assert(state.player.health < healthBeforeSyncedSlam, "rock slam should deal damage on the final frame transition");
assert(syncedSlamEvents.some((event) => event.kind === "sound" && event.id === "golemRockSlamCrash"), "rock slam final frame should emit crash sound");

state.player.health = state.player.maxHealth;
state.player.invulnerableTime = 0;
state.enemy.state = "windup";
state.enemy.currentAttack = "rock_spray";
state.enemy.anim = "rock_spray";
state.enemy.animFrame = 0;
state.enemy.animTimer = 0;
state.enemy.stateTimer = 0.01;
state.enemy.hasHitPlayer = false;
state.enemy.attackForward = { x: 1, y: 0 };
state.enemy.x = state.player.x - 80;
state.enemy.y = state.player.y;
const healthBeforeSyncedSpray = state.player.health;
updateSimulation(state, createInputState(), 0.016, {
  playerFrameCount: () => 1,
  monsterFrameCount: () => 8,
  moonfallFrameCount: () => 1,
});
assert(state.enemy.state === "active", "rock spray should become active after windup expires");
assert(state.enemy.animFrame === 7, "rock spray should reach its final frame when damage is dealt");
assert(state.player.health < healthBeforeSyncedSpray, "rock spray should deal damage on the final frame transition");

for (let index = 0; index < 25; index += 1) {
  const gear = generateGear(state.selectedClassId);
  assert(["Common", "Uncommon", "Rare"].includes(gear.rarity), "gear rarity should be known");
  assert(gear.power >= 2 && gear.power <= 8, "gear power should stay in expected bounds");
  assert(gear.frame.weaponSpecials.length > 0, "generated gear should include weapon specials");
  assert(gear.frame.latticeAbilityOptions.length > 0, "generated gear should include lattice ability options");
  assert(gear.frame.modifierOptions.length > 0, "generated gear should include frame modifier options");
}

const latticeState = createInitialGameState("warrior");
assert(latticeState.combat.branchLattice.abilitySlotIds.length === 4, "Branch Lattice should initialize four ability slots");
const basic = latticeState.combat.equippedGear.frame.latticeAbilityOptions.find((option) => option.kind === "basic_attack_1");
const haste = latticeState.combat.equippedGear.frame.latticeAbilityOptions.find((option) => option.kind === "haste");
const combo = latticeState.combat.equippedGear.frame.latticeAbilityOptions.find((option) => option.kind === "combo_attack");
const fire = latticeState.combat.equippedGear.frame.modifierOptions.find((option) => option.id === "mod:fire");
assert(basic && haste && combo && fire, "starting frame should expose basic, haste, combo, and fire options");
latticeState.combat.branchLattice.abilitySlotIds = [haste.id, basic.id, combo.id, null];
latticeState.combat.branchLattice.modifierSlotIds = [null, fire.id, fire.id, null];
latticeState.player.lifeState = "alive";
latticeState.enemy.state = "idle";
latticeState.enemy.health = latticeState.enemy.maxHealth;
latticeState.enemy.x = latticeState.player.x + 80;
latticeState.enemy.y = latticeState.player.y;
const loopEvents: GameEvent[] = [];
updateAutoAttack(latticeState, 0.016, loopEvents);
assert(latticeState.combat.autoLoop.hasteTimer > 0, "haste should apply a temporary speed buff");
assert(latticeState.combat.autoLoop.currentSlotIndex === 1, "auto loop should advance from haste to the next filled slot");
const hastedSlotTimer = latticeState.combat.autoLoop.slotTimer;
updateAutoAttack(latticeState, 0.1, loopEvents);
assert(latticeState.combat.autoLoop.slotTimer < hastedSlotTimer - 0.1, "haste should speed up subsequent sequence timing");
updateAutoAttack(latticeState, 1, loopEvents);
assert(latticeState.combat.autoLoop.currentSlotIndex === 2, "auto loop should execute Basic Attack before Combo Attack");
updateAutoAttack(latticeState, 1, loopEvents);
assert(latticeState.combat.autoLoop.restartTimer > 0, "auto loop should wait before restarting after the last filled slot");
assert(loopEvents.some((event) => event.kind === "log" && event.message.includes("Combo Attack")), "Combo Attack should execute after Basic Attack");
assert(activeLatticeSequence(latticeState).filter(Boolean).length === 3, "active lattice sequence should expose slotted auto abilities");

latticeState.combat.branchLattice.abilitySlotIds[1] = "lattice:not-on-frame";
latticeState.combat.branchLattice.abilitySlotIds[2] = haste.id;
latticeState.combat.branchLattice.modifierSlotIds[0] = "mod:not-on-frame";
latticeState.combat.branchLattice.modifierSlotIds[2] = fire.id;
latticeState.combat.droppedGear = generateGear("warrior");
equipDrop(latticeState);
assert(
  latticeState.combat.branchLattice.abilitySlotIds.every((optionId) =>
    !optionId || latticeState.combat.equippedGear.frame.latticeAbilityOptions.some((option) => option.id === optionId),
  ),
  "equipping gear should clear incompatible lattice ability assignments",
);
assert(
  new Set(latticeState.combat.branchLattice.abilitySlotIds.filter(Boolean)).size ===
    latticeState.combat.branchLattice.abilitySlotIds.filter(Boolean).length,
  "equipping gear should clear duplicate lattice ability assignments",
);
assert(
  latticeState.combat.branchLattice.modifierSlotIds.every((optionId) =>
    !optionId || latticeState.combat.equippedGear.frame.modifierOptions.some((option) => option.id === optionId),
  ),
  "equipping gear should clear incompatible lattice modifier assignments",
);
assert(
  new Set(latticeState.combat.branchLattice.modifierSlotIds.filter(Boolean)).size ===
    latticeState.combat.branchLattice.modifierSlotIds.filter(Boolean).length,
  "equipping gear should clear duplicate lattice modifier assignments",
);

console.log("simulation smoke passed");
