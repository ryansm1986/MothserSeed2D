import { activeLatticeSequence, activeWeaponSpecials, allEnemies, livingEnemies, selectedClass, type GameState } from "../game/state";

export type HudViewModel = {
  playerHtml: string;
  targetHtml: string;
  abilitiesHtml: string;
};

export function renderHud(state: GameState): HudViewModel {
  const currentClass = selectedClass(state);
  const healthValue = state.player.health / state.player.maxHealth;
  const staminaValue = state.player.stamina / state.player.maxStamina;
  const meterValue = state.player.meter / state.player.maxMeter;
  const playerHtml = `
    <div class="label-row"><strong>${currentClass.name}</strong><span>${Math.ceil(state.player.health)} / ${state.player.maxHealth}</span></div>
    <div class="bar"><div class="fill health" style="--value:${healthValue}"></div></div>
    <div class="label-row"><span>Stamina</span><span>${Math.floor(state.player.stamina)}</span></div>
    <div class="bar"><div class="fill stamina" style="--value:${staminaValue}"></div></div>
    <div class="label-row"><span>Meter</span><span>${Math.floor(state.player.meter)}</span></div>
    <div class="bar"><div class="fill meter" style="--value:${meterValue}"></div></div>
  `;

  const targetValue = state.enemy.health / state.enemy.maxHealth;
  const encounterCount = allEnemies(state).length;
  const activeEnemyCount = livingEnemies(state).length;
  const gear = state.combat.equippedGear;
  const droppedGear = state.combat.droppedGear;
  const autoLoop = state.combat.autoLoop;
  const currentAutoAbility = activeLatticeSequence(state)[autoLoop.currentSlotIndex];
  const autoStatus = autoLoop.restartTimer > 0
    ? `Restart ${autoLoop.restartTimer.toFixed(1)}s`
    : currentAutoAbility
      ? `${currentAutoAbility.name}${autoLoop.slotTimer > 0 ? ` ${autoLoop.slotTimer.toFixed(1)}s` : ""}`
      : "No auto";
  const hasteStatus = autoLoop.hasteTimer > 0 ? `Haste ${autoLoop.hasteTimer.toFixed(1)}s` : "Normal";
  const targetHtml = state.combat.targetLocked
    ? `
      <div class="label-row"><strong>${state.enemy.name}</strong><span>${state.enemy.state === "dead" ? "Respawning" : `${Math.ceil(state.enemy.health)} / ${state.enemy.maxHealth}`}</span></div>
      <div class="bar"><div class="fill target-health" style="--value:${targetValue}"></div></div>
      <div class="label-row"><span>Chain</span><span>${state.enemy.chainTag || "None"}</span></div>
      <div class="label-row"><span>Encounter</span><span>${activeEnemyCount} / ${encounterCount}</span></div>
      <div class="label-row"><span>Gear</span><span>${gear.rarity}</span></div>
      <div class="label-row"><span>Auto Loop</span><span>${autoStatus}</span></div>
      <div class="label-row"><span>Tempo</span><span>${hasteStatus}</span></div>
      <div class="${droppedGear ? "loot" : ""}">${droppedGear ? `${droppedGear.name}: ${droppedGear.ability}` : gear.ability}</div>
    `
    : `
      <div class="label-row"><strong>No Target</strong><span>Free facing</span></div>
      <div class="bar"><div class="fill target-health" style="--value:0"></div></div>
      <div class="label-row"><span>Chain</span><span>None</span></div>
      <div class="label-row"><span>Gear</span><span>${gear.rarity}</span></div>
      <div class="label-row"><span>Auto Loop</span><span>${autoStatus}</span></div>
      <div class="${droppedGear ? "loot" : ""}">${droppedGear ? `${droppedGear.name}: ${droppedGear.ability}` : gear.ability}</div>
    `;

  const abilitiesHtml = activeWeaponSpecials(state)
    .map((ability) => {
      const cooldown = state.combat.cooldowns[ability.id] ?? 0;
      const ready = cooldown <= 0 && state.player.meter >= ability.cost;
      const status = cooldown > 0 ? `${cooldown.toFixed(1)}s` : `${ability.cost} meter`;
      return `
        <div class="ability ${ready ? "ready" : ""}">
          <div class="ability-key">${ability.key}</div>
          <div class="ability-name">${ability.name}</div>
          <div class="ability-cost">${status}</div>
        </div>
      `;
    })
    .join("");

  return { playerHtml, targetHtml, abilitiesHtml };
}

export function applyHud(targets: { playerPanel: HTMLElement; targetPanel: HTMLElement; abilityPanel: HTMLElement }, view: HudViewModel) {
  targets.playerPanel.innerHTML = view.playerHtml;
  targets.targetPanel.innerHTML = view.targetHtml;
  targets.abilityPanel.innerHTML = view.abilitiesHtml;
}
