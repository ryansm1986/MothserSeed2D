import { activeLatticeSequence, selectedClass, type GameState } from "../game/state";
import type { FrameModifierOption, LatticeAbilityOption } from "../game/types";

export type BranchLatticeViewModel = {
  abilityListHtml: string;
  modifierListHtml: string;
  latticeHtml: string;
  detailsHtml: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderAbilityOption(option: LatticeAbilityOption) {
  return `
    <button class="branch-option ability-option" type="button" draggable="true" data-branch-ability-option="${escapeHtml(option.id)}">
      <span>${escapeHtml(option.glyph)}</span>
      <strong>${escapeHtml(option.name)}</strong>
      <em>${escapeHtml(option.detail)}</em>
    </button>
  `;
}

function renderModifierOption(option: FrameModifierOption) {
  return `
    <button class="branch-option modifier-option ${option.tone}" type="button" draggable="true" data-branch-modifier-option="${escapeHtml(option.id)}">
      <span>${escapeHtml(option.glyph)}</span>
      <strong>${escapeHtml(option.name)}</strong>
      <em>${escapeHtml(option.detail)}</em>
    </button>
  `;
}

export function renderBranchLattice(state: GameState): BranchLatticeViewModel {
  const currentClass = selectedClass(state);
  const gear = state.combat.equippedGear;
  const { branchLattice } = state.combat;
  const abilityOptions = gear.frame.latticeAbilityOptions;
  const modifierOptions = gear.frame.modifierOptions;
  const assignedAbilityIds = new Set(branchLattice.abilitySlotIds.filter(Boolean));
  const assignedModifierIds = new Set(branchLattice.modifierSlotIds.filter(Boolean));
  const availableAbilityOptions = abilityOptions.filter((option) => !assignedAbilityIds.has(option.id));
  const availableModifierOptions = modifierOptions.filter((option) => !assignedModifierIds.has(option.id));

  const abilityListHtml = availableAbilityOptions.length
    ? availableAbilityOptions.map((option) => renderAbilityOption(option)).join("")
    : `<p class="branch-empty-copy">All auto abilities are slotted.</p>`;
  const modifierListHtml = availableModifierOptions.length
    ? availableModifierOptions.map((option) => renderModifierOption(option)).join("")
    : `<p class="branch-empty-copy">All modifiers are slotted.</p>`;

  const rows = branchLattice.abilitySlotIds.flatMap((abilityOptionId, index) => {
    const abilityOption = abilityOptionId ? abilityOptions.find((option) => option.id === abilityOptionId) : null;
    const abilityNode = `
      <button class="branch-socket ability-socket ${abilityOption ? "is-filled" : ""} ${branchLattice.selectedAbilitySlot === index ? "is-selected" : ""}" type="button" draggable="${abilityOption ? "true" : "false"}" data-branch-ability-slot="${index}">
        <span>${abilityOption ? escapeHtml(abilityOption.glyph) : String(index + 1)}</span>
        <strong>${abilityOption ? escapeHtml(abilityOption.name) : "Auto Slot"}</strong>
      </button>
    `;
    if (index >= branchLattice.modifierSlotIds.length) return [abilityNode];

    const modifierOptionId = branchLattice.modifierSlotIds[index];
    const modifierOption = modifierOptionId ? modifierOptions.find((option) => option.id === modifierOptionId) : null;
    const modifierNode = `
      <button class="branch-socket modifier-socket ${modifierOption ? `is-filled ${modifierOption.tone}` : ""} ${branchLattice.selectedModifierSlot === index ? "is-selected" : ""}" type="button" draggable="${modifierOption ? "true" : "false"}" data-branch-modifier-slot="${index}">
        <span>${modifierOption ? escapeHtml(modifierOption.glyph) : "+"}</span>
      </button>
    `;
    return [abilityNode, modifierNode];
  });

  const tailModifierIndex = branchLattice.modifierSlotIds.length - 1;
  if (tailModifierIndex >= branchLattice.abilitySlotIds.length) {
    const modifierOptionId = branchLattice.modifierSlotIds[tailModifierIndex];
    const modifierOption = modifierOptionId ? modifierOptions.find((option) => option.id === modifierOptionId) : null;
    rows.push(`
      <button class="branch-socket modifier-socket ${modifierOption ? `is-filled ${modifierOption.tone}` : ""} ${branchLattice.selectedModifierSlot === tailModifierIndex ? "is-selected" : ""}" type="button" draggable="${modifierOption ? "true" : "false"}" data-branch-modifier-slot="${tailModifierIndex}">
        <span>${modifierOption ? escapeHtml(modifierOption.glyph) : "+"}</span>
      </button>
    `);
  }

  const latticeHtml = rows.join("");
  const active = activeLatticeSequence(state).filter((ability): ability is LatticeAbilityOption => Boolean(ability));
  const selectedAbilityId =
    branchLattice.selectedAbilitySlot === null ? null : branchLattice.abilitySlotIds[branchLattice.selectedAbilitySlot];
  const selectedModifierId =
    branchLattice.selectedModifierSlot === null ? null : branchLattice.modifierSlotIds[branchLattice.selectedModifierSlot];
  const selectedAbilityOption = selectedAbilityId
    ? abilityOptions.find((option) => option.id === selectedAbilityId)
    : null;
  const selectedModifierOption = selectedModifierId
    ? modifierOptions.find((option) => option.id === selectedModifierId)
    : null;

  const detailsHtml = `
    <span>${escapeHtml(gear.rarity)} Frame Gear</span>
    <strong>${escapeHtml(gear.name)}</strong>
    <p>${escapeHtml(gear.ability)}</p>
    <div class="branch-detail-grid">
      <div><em>Class</em><b>${escapeHtml(currentClass.name)}</b></div>
      <div><em>Auto Loop</em><b>${active.map((ability) => escapeHtml(ability.name)).join(", ") || "None"}</b></div>
      <div><em>Auto Slot</em><b>${selectedAbilityOption ? escapeHtml(selectedAbilityOption.name) : "Empty"}</b></div>
      <div><em>Modifier Slot</em><b>${selectedModifierOption ? escapeHtml(selectedModifierOption.name) : "Empty"}</b></div>
    </div>
    ${branchLattice.isPreviewOpen ? `<p class="branch-preview-copy">Auto abilities run top to bottom, then wait 3 seconds before restarting. Haste speeds sequence timers while active.</p>` : ""}
  `;

  return { abilityListHtml, modifierListHtml, latticeHtml, detailsHtml };
}

export function applyBranchLattice(
  targets: {
    abilities: HTMLElement;
    modifiers: HTMLElement;
    lattice: HTMLElement;
    details: HTMLElement;
  },
  view: BranchLatticeViewModel,
) {
  targets.abilities.innerHTML = view.abilityListHtml;
  targets.modifiers.innerHTML = view.modifierListHtml;
  targets.lattice.innerHTML = view.latticeHtml;
  targets.details.innerHTML = view.detailsHtml;
}
