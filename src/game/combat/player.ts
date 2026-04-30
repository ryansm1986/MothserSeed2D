import { movementFromActions, type InputState } from "../input-actions";
import { directionFromVector, distance, lengthSq, normalize } from "../math";
import { livingEnemies, logEvent, promoteEnemy, type GameEvent, type GameState } from "../state";
import type { AnimationName, Vec2 } from "../types";
import { clampToArena, resolveObstacleCollision } from "../world/collision";

export function updatePlayer(state: GameState, inputState: InputState, delta: number, events: GameEvent[]) {
  const { player } = state;
  if (player.lifeState === "dead") {
    player.dodgeTime = 0;
    player.dodgeAnimTime = 0;
    player.invulnerableTime = 0;
    player.attackFlash = 0;
    player.specialFlash = 0;
    setPlayerAnimation(state, "damage");
    return;
  }

  player.dodgeTime = Math.max(0, player.dodgeTime - delta);
  player.dodgeAnimTime = Math.max(0, player.dodgeAnimTime - delta);
  player.invulnerableTime = Math.max(0, player.invulnerableTime - delta);
  player.attackFlash = Math.max(0, player.attackFlash - delta);
  player.specialFlash = Math.max(0, player.specialFlash - delta);
  player.autoTimer = Math.max(0, player.autoTimer - delta);

  const input = movementFromActions(inputState.pressedActions);

  const moving = lengthSq(input) > 0;
  if (moving) {
    normalize(input);
    player.direction = directionFromVector(input);
    player.facing = { ...input };
  }

  const sprinting = moving
    && inputState.pressedActions.has("sprint")
    && !inputState.sprintExhaustedUntilRelease
    && player.stamina > 0
    && player.dodgeTime <= 0;

  if (sprinting) {
    player.stamina = Math.max(0, player.stamina - player.sprintStaminaCost * delta);
    if (player.stamina <= 0) {
      inputState.sprintExhaustedUntilRelease = true;
    }
  } else {
    player.stamina = Math.min(player.maxStamina, player.stamina + player.staminaRegen * delta);
  }

  if (inputState.pressedActions.has("dodge") && player.stamina >= 28 && player.dodgeTime <= 0) {
    player.stamina -= 28;
    player.dodgeTime = 0.24;
    player.dodgeAnimTime = 0.44;
    player.invulnerableTime = 0.38;
    events.push(logEvent("Dodge window", ""));
  }

  const speed = player.dodgeTime > 0 ? player.dodgeSpeed : sprinting ? player.sprintSpeed : player.speed;
  const direction = moving ? input : player.dodgeTime > 0 ? player.facing : null;
  if (direction) {
    player.x += direction.x * speed * delta;
    player.y += direction.y * speed * delta;
  }

  clampToArena(player);
  resolveObstacleCollision(player, player.radius, state.obstacles);
  if (!sprinting && player.dodgeTime <= 0) {
    updateTargetFacing(state);
  }

  const nextAnim: AnimationName =
    player.specialFlash > 0
      ? "attack2"
      : player.attackFlash > 0
        ? "attack1"
        : player.dodgeAnimTime > 0
          ? "dodge_roll"
          : sprinting
            ? "sprint"
            : moving
              ? "walk"
              : "idle";
  setPlayerAnimation(state, nextAnim);
}

export function updateTargetFacing(state: GameState) {
  if (!state.combat.targetLocked || state.enemy.state === "dead" || !state.enemy.visible) {
    const nextTarget = nearestLivingEnemy(state);
    if (!nextTarget) return;
    promoteEnemy(state, nextTarget);
  }

  const toEnemy = { x: state.enemy.x - state.player.x, y: state.enemy.y - state.player.y };
  if (lengthSq(toEnemy) <= 0.001) return;
  state.player.direction = directionFromVector(toEnemy);
}

export function lockTarget(state: GameState): GameEvent[] {
  const nextTarget = nearestLivingEnemy(state);
  if (!nextTarget) return [];
  promoteEnemy(state, nextTarget);
  state.combat.targetLocked = true;
  return [logEvent("Target locked", state.enemy.name)];
}

export function clearTarget(state: GameState): GameEvent[] {
  if (!state.combat.targetLocked && !state.combat.pendingMagicMissileCast) return [];
  state.combat.targetLocked = false;
  state.combat.pendingMagicMissileCast = null;
  return [logEvent("Target cleared", "Movement controls facing")];
}

export function isEnemyAtWorldPoint(state: GameState, point: Vec2) {
  const clickedEnemy = livingEnemies(state).find((enemy) => {
    const dx = (point.x - enemy.x) / 72;
    const dy = (point.y - (enemy.y + 12)) / 48;
    return dx * dx + dy * dy <= 1;
  });

  if (!clickedEnemy) return false;
  promoteEnemy(state, clickedEnemy);
  return true;
}

export function setPlayerAnimation(state: GameState, nextAnim: AnimationName) {
  if (state.player.anim !== nextAnim) {
    state.player.anim = nextAnim;
    state.player.animFrame = 0;
    state.player.animTimer = 0;
  }
}

function nearestLivingEnemy(state: GameState) {
  return livingEnemies(state)
    .sort((a, b) => distance(state.player, a) - distance(state.player, b))[0] ?? null;
}
