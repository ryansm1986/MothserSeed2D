import type { GameEvent, GameState } from "../state";
import { createFrameGear, logEvent } from "../state";
import type { ClassId, GearDrop } from "../types";

export function generateGear(classId: ClassId = "warrior"): GearDrop {
  const roll = Math.random();
  const rarity: GearDrop["rarity"] = roll > 0.78 ? "Rare" : roll > 0.36 ? "Uncommon" : "Common";
  const names = {
    Common: ["Verdant Edge", "Copper Greatblade", "Field-Born Blade"],
    Uncommon: ["Thornlit Sabre", "Mender's Brand", "Amberbite Sword"],
    Rare: ["Oathroot Cleaver", "Dawnvein Greatsword", "Stormleaf Brand"],
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
    frame: createFrameGear(classId, rarity),
  };
}

export function equipDrop(state: GameState): GameEvent[] {
  if (state.player.lifeState !== "alive") return [];
  if (!state.combat.droppedGear) return [];
  state.combat.equippedGear = state.combat.droppedGear;
  state.combat.droppedGear = null;
  normalizeBranchLattice(state);
  return [logEvent(`Equipped ${state.combat.equippedGear.name}`, state.combat.equippedGear.ability)];
}

export function normalizeBranchLattice(state: GameState) {
  const abilityOptionIds = new Set(state.combat.equippedGear.frame.latticeAbilityOptions.map((option) => option.id));
  const modifierOptionIds = new Set(state.combat.equippedGear.frame.modifierOptions.map((option) => option.id));
  const usedAbilityIds = new Set<string>();
  const usedModifierIds = new Set<string>();

  state.combat.branchLattice.abilitySlotIds = state.combat.branchLattice.abilitySlotIds.map((optionId) => {
    if (!optionId || !abilityOptionIds.has(optionId) || usedAbilityIds.has(optionId)) return null;
    usedAbilityIds.add(optionId);
    return optionId;
  });
  state.combat.branchLattice.modifierSlotIds = state.combat.branchLattice.modifierSlotIds.map((optionId) => {
    if (!optionId || !modifierOptionIds.has(optionId) || usedModifierIds.has(optionId)) return null;
    usedModifierIds.add(optionId);
    return optionId;
  });

  if (!state.combat.branchLattice.abilitySlotIds.some(Boolean)) {
    state.combat.branchLattice.abilitySlotIds[0] = state.combat.equippedGear.frame.latticeAbilityOptions[0]?.id ?? null;
  }
  state.combat.autoLoop.currentSlotIndex = 0;
  state.combat.autoLoop.slotTimer = 0;
  state.combat.autoLoop.restartTimer = 0;
  state.combat.autoLoop.hasteTimer = 0;
  state.combat.autoLoop.hasteMultiplier = 1;
  state.combat.autoLoop.lastResolvedKind = null;
  if (
    state.combat.branchLattice.selectedAbilitySlot !== null &&
    !state.combat.branchLattice.abilitySlotIds[state.combat.branchLattice.selectedAbilitySlot]
  ) {
    state.combat.branchLattice.selectedAbilitySlot = 0;
  }
  if (
    state.combat.branchLattice.selectedModifierSlot !== null &&
    state.combat.branchLattice.selectedModifierSlot >= state.combat.branchLattice.modifierSlotIds.length
  ) {
    state.combat.branchLattice.selectedModifierSlot = 0;
  }
}
