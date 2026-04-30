import type { GameEvent, GameState } from "../state";
import { logEvent } from "../state";
import type { GearDrop } from "../types";

export function generateGear(): GearDrop {
  const roll = Math.random();
  const rarity: GearDrop["rarity"] = roll > 0.78 ? "Rare" : roll > 0.36 ? "Uncommon" : "Common";
  const names = {
    Common: ["Verdant Edge", "Copper Guard", "Field-Born Blade"],
    Uncommon: ["Thornlit Sabre", "Mender's Ward", "Amberbite Sword"],
    Rare: ["Oathroot Cleaver", "Dawnvein Aegis", "Stormleaf Brand"],
  };
  const list = names[rarity];
  const power = rarity === "Rare" ? 8 : rarity === "Uncommon" ? 4 : 2;
  const ability =
    rarity === "Rare"
      ? "Every third auto-attack applies Bleed and grants +8 meter."
      : rarity === "Uncommon"
        ? "Every third auto-attack applies Bleed."
        : "Every third auto-attack deals +5 damage.";
  return {
    name: list[Math.floor(Math.random() * list.length)],
    rarity,
    power,
    ability,
  };
}

export function equipDrop(state: GameState): GameEvent[] {
  if (state.player.lifeState !== "alive") return [];
  if (!state.combat.droppedGear) return [];
  state.combat.equippedGear = state.combat.droppedGear;
  state.combat.droppedGear = null;
  return [logEvent(`Equipped ${state.combat.equippedGear.name}`, state.combat.equippedGear.ability)];
}
