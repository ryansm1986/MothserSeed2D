import { castSpecial } from "../src/game/combat/abilities";
import { generateGear } from "../src/game/combat/gear";
import { clampToArena } from "../src/game/world/collision";
import { world } from "../src/game/world/arena";
import { distance } from "../src/game/math";
import { createInputState } from "../src/game/input-actions";
import { updateSimulation } from "../src/game/simulation";
import { applySelectedClass, createInitialGameState } from "../src/game/state";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const state = createInitialGameState("warrior");
assert(JSON.stringify(state).includes("Recruit's Buckler"), "initial state should be JSON serializable");

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
  const gear = generateGear();
  assert(["Common", "Uncommon", "Rare"].includes(gear.rarity), "gear rarity should be known");
  assert(gear.power >= 2 && gear.power <= 8, "gear power should stay in expected bounds");
}

console.log("simulation smoke passed");
