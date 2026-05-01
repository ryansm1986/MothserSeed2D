import "./style.css";
import { createAudioManager } from "./app/audio";
import { castSpecial } from "./game/combat/abilities";
import { equipDrop } from "./game/combat/gear";
import { clearTarget, isEnemyAtWorldPoint, lockTarget } from "./game/combat/player";
import { characterClasses, characterOrder } from "./game/content/classes";
import { clearInputState, createInputState, gameplayActionForCode } from "./game/input-actions";
import { updateSimulation } from "./game/simulation";
import {
  applySelectedClass,
  createAutoAttackLoopState,
  createInitialGameState,
  isGameplayActive,
  isGameplayVisible,
  logEvent,
  selectedClass,
  type GameEvent,
} from "./game/state";
import type { ClassId } from "./game/types";
import { screenToWorld } from "./render/canvas2d/camera";
import { createCanvasRenderer } from "./render/canvas2d/renderer";
import { createAnimationFrameLookup, loadRenderAssets } from "./render/canvas2d/sprite-loader";
import type { AnimationFrameLookup, CanvasRenderer } from "./render/canvas2d/types";
import { createAppShell } from "./ui/app-shell";
import { applyBranchLattice, renderBranchLattice } from "./ui/branch-lattice";
import { applyCharacterSelect, renderCharacterSelect } from "./ui/character-select";
import { pushGameEvents, pushLog } from "./ui/event-log";
import { applyHud, renderHud } from "./ui/hud";
import { applyInventory, renderInventory } from "./ui/inventory";
import { createMobileControls } from "./ui/mobile-controls";
import { initializePauseTabs, selectPauseTab, setPauseMenuCopy } from "./ui/pause-menu";
import { createTitleIntroController } from "./ui/title-screen";

const shell = createAppShell();
const titleIntro = createTitleIntroController({
  titleScreen: shell.titleScreen,
  titleBackgroundImage: shell.titleBackgroundImage,
  titleLogoImage: shell.titleLogoImage,
});
const state = createInitialGameState("warrior");
const inputState = createInputState();
const audio = createAudioManager({
  musicVolumeInput: shell.musicVolumeInput,
  sfxVolumeInput: shell.sfxVolumeInput,
  musicVolumeValue: shell.musicVolumeValue,
  sfxVolumeValue: shell.sfxVolumeValue,
});
const mobileControls = createMobileControls({
  elements: {
    root: shell.mobileControls,
    movePad: shell.mobileMovePad,
    moveThumb: shell.mobileMoveThumb,
    dodgeButton: shell.mobileDodgeButton,
    targetButton: shell.mobileTargetButton,
    specialButtons: shell.mobileSpecialButtons,
    equipButton: shell.mobileEquipButton,
    inventoryButton: shell.mobileInventoryButton,
    branchLatticeButton: shell.mobileBranchLatticeButton,
    pauseButton: shell.mobilePauseButton,
    rotatePrompt: shell.mobileRotatePrompt,
  },
  inputState,
  canUseGameplayInput: () => isGameplayActive(state),
  onTarget: () => handleEvents(lockTarget(state)),
  onSpecial: (index) => handleEvents(castSpecial(state, index)),
  onEquip: () => handleEvents(equipDrop(state)),
  onInventory: () => toggleInventory(),
  onBranchLattice: () => toggleBranchLattice(),
  onPause: () => togglePauseMenu(),
});

let renderer: CanvasRenderer | null = null;
let frameLookup: AnimationFrameLookup | undefined;
let lastFrame = performance.now();
let isStartingGame = false;
const branchDragMime = "application/x-motherseed-branch-lattice";

type BranchDragKind = "ability" | "modifier";
type BranchDragPayload = {
  kind: BranchDragKind;
  optionId: string;
  source: "option" | "slot";
  fromSlot: number | null;
};

let activeBranchDrag: BranchDragPayload | null = null;
let suppressBranchClick = false;

function handleEvents(events: readonly GameEvent[]) {
  pushGameEvents(shell.eventLog, events, (event) => {
    if (event.kind === "sound") audio.playEventSound(event.id);
  });
}

function clearAllInput() {
  clearInputState(inputState);
  mobileControls.clear();
}

function syncMobileControls() {
  mobileControls.setActive(isGameplayVisible(state));
  mobileControls.setGameplayInputActive(isGameplayActive(state));
  mobileControls.setGameplayVisible(isGameplayVisible(state));
}

function updateHud() {
  applyHud({
    playerPanel: shell.playerPanel,
    targetPanel: shell.targetPanel,
    abilityPanel: shell.abilityPanel,
  }, renderHud(state));
}

function updateInventory() {
  applyInventory({
    hero: shell.inventoryHero,
    equipment: shell.inventoryEquipment,
    pack: shell.inventoryPack,
    potions: shell.inventoryPotions,
    details: shell.inventoryDetails,
  }, renderInventory(state));
}

function updateBranchLattice() {
  applyBranchLattice({
    abilities: shell.branchLatticeAbilities,
    modifiers: shell.branchLatticeModifiers,
    lattice: shell.branchLatticeSockets,
    details: shell.branchLatticeDetails,
  }, renderBranchLattice(state));
}

function renderCharacterSelectScreen() {
  applyCharacterSelect({
    characterGrid: shell.characterGrid,
    characterDetail: shell.characterDetail,
    continueButton: shell.continueButton,
  }, renderCharacterSelect(state.selectedClassId));
}

function showCharacterSelect() {
  if (!state.ui.isTitleActive) return;
  titleIntro.reset();
  state.ui.isTitleActive = false;
  state.ui.isCharacterSelectActive = true;
  state.ui.isPaused = false;
  state.ui.isInventoryOpen = false;
  state.ui.isBranchLatticeOpen = false;
  state.ui.pauseMenuSource = null;
  clearAllInput();
  audio.stopGameplayMusic();
  audio.playTitleMusic();
  shell.inventoryMenu.classList.add("is-hidden");
  shell.branchLatticeMenu.classList.add("is-hidden");
  shell.pauseMenu.classList.add("is-hidden");
  shell.loadingScreen.classList.add("is-hidden");
  shell.titleScreen.classList.add("is-hidden");
  shell.characterSelect.classList.remove("is-hidden");
  renderCharacterSelectScreen();
}

function showTitleScreen() {
  state.ui.isTitleActive = true;
  state.ui.isCharacterSelectActive = false;
  state.ui.isPaused = false;
  state.ui.isInventoryOpen = false;
  state.ui.isBranchLatticeOpen = false;
  state.ui.pauseMenuSource = null;
  clearAllInput();
  audio.stopGameplayMusic();
  audio.playTitleMusic();
  shell.inventoryMenu.classList.add("is-hidden");
  shell.branchLatticeMenu.classList.add("is-hidden");
  shell.pauseMenu.classList.add("is-hidden");
  shell.loadingScreen.classList.add("is-hidden");
  shell.hud.classList.add("is-hidden");
  shell.characterSelect.classList.add("is-hidden");
  shell.titleScreen.classList.remove("is-hidden");
  void titleIntro.start();
}

function openPauseMenu(tabName = "controls", source: "gameplay" | "title" = "gameplay") {
  if (source === "gameplay" && (!isGameplayVisible(state) || state.ui.isPaused)) return;
  if (source === "title" && !state.ui.isTitleActive) return;
  state.ui.isPaused = source === "gameplay";
  state.ui.isInventoryOpen = false;
  state.ui.isBranchLatticeOpen = false;
  state.ui.pauseMenuSource = source;
  clearAllInput();
  setPauseMenuCopy(shell, source);
  audio.updateAudioSettingsUi();
  selectPauseTab(shell, tabName);
  shell.inventoryMenu.classList.add("is-hidden");
  shell.branchLatticeMenu.classList.add("is-hidden");
  shell.pauseMenu.classList.remove("is-hidden");
  requestAnimationFrame(() => shell.pauseFrame.focus());
}

function closePauseMenu() {
  if (!state.ui.pauseMenuSource) return;
  state.ui.isPaused = false;
  state.ui.pauseMenuSource = null;
  clearAllInput();
  shell.pauseMenu.classList.add("is-hidden");
}

function togglePauseMenu() {
  if (state.ui.isPaused) {
    closePauseMenu();
  } else {
    openPauseMenu();
  }
}

function openInventory() {
  if (!isGameplayVisible(state) || state.ui.isPaused || state.ui.pauseMenuSource || state.ui.isBranchLatticeOpen) return;
  state.ui.isInventoryOpen = true;
  clearAllInput();
  updateInventory();
  shell.inventoryMenu.classList.remove("is-hidden");
  requestAnimationFrame(() => shell.inventoryFrame.focus());
}

function closeInventory() {
  if (!state.ui.isInventoryOpen) return;
  state.ui.isInventoryOpen = false;
  clearAllInput();
  shell.inventoryMenu.classList.add("is-hidden");
}

function toggleInventory() {
  if (state.ui.isInventoryOpen) {
    closeInventory();
  } else {
    openInventory();
  }
}

function openBranchLattice() {
  if (!isGameplayVisible(state) || state.ui.pauseMenuSource === "title") return;
  state.ui.isBranchLatticeOpen = true;
  state.ui.isPaused = false;
  state.ui.isInventoryOpen = false;
  state.ui.pauseMenuSource = null;
  clearAllInput();
  updateBranchLattice();
  shell.inventoryMenu.classList.add("is-hidden");
  shell.pauseMenu.classList.add("is-hidden");
  shell.branchLatticeMenu.classList.remove("is-hidden");
  requestAnimationFrame(() => shell.branchLatticeFrame.focus());
}

function closeBranchLattice() {
  if (!state.ui.isBranchLatticeOpen) return;
  state.ui.isBranchLatticeOpen = false;
  clearAllInput();
  shell.branchLatticeMenu.classList.add("is-hidden");
  updateHud();
}

function toggleBranchLattice() {
  if (state.ui.isBranchLatticeOpen) {
    closeBranchLattice();
  } else {
    openBranchLattice();
  }
}

function firstOpenSlot(slots: Array<string | null>) {
  const index = slots.findIndex((slot) => !slot);
  return index >= 0 ? index : 0;
}

function branchSlots(kind: BranchDragKind) {
  return kind === "ability"
    ? state.combat.branchLattice.abilitySlotIds
    : state.combat.branchLattice.modifierSlotIds;
}

function hasBranchOption(kind: BranchDragKind, optionId: string) {
  return kind === "ability"
    ? state.combat.equippedGear.frame.latticeAbilityOptions.some((option) => option.id === optionId)
    : state.combat.equippedGear.frame.modifierOptions.some((option) => option.id === optionId);
}

function selectBranchSlot(kind: BranchDragKind, slotIndex: number) {
  if (kind === "ability") {
    state.combat.branchLattice.selectedAbilitySlot = slotIndex;
    state.combat.branchLattice.selectedModifierSlot = null;
  } else {
    state.combat.branchLattice.selectedModifierSlot = slotIndex;
    state.combat.branchLattice.selectedAbilitySlot = null;
  }
}

function commitBranchLatticeChange() {
  state.combat.autoLoop = createAutoAttackLoopState();
  updateBranchLattice();
  updateHud();
}

function assignBranchOption(kind: BranchDragKind, optionId: string, targetSlot?: number) {
  if (!hasBranchOption(kind, optionId)) return;
  const slots = branchSlots(kind);
  const selectedSlot = kind === "ability"
    ? state.combat.branchLattice.selectedAbilitySlot
    : state.combat.branchLattice.selectedModifierSlot;
  const slotIndex = targetSlot ?? selectedSlot ?? firstOpenSlot(slots);
  slots.forEach((slotOptionId, index) => {
    if (index !== slotIndex && slotOptionId === optionId) slots[index] = null;
  });
  slots[slotIndex] = optionId;
  selectBranchSlot(kind, slotIndex);
  commitBranchLatticeChange();
}

function moveBranchSlot(kind: BranchDragKind, fromSlot: number, toSlot: number) {
  const slots = branchSlots(kind);
  if (!slots[fromSlot]) return;
  if (fromSlot !== toSlot) {
    const heldOptionId = slots[fromSlot];
    slots[fromSlot] = slots[toSlot];
    slots[toSlot] = heldOptionId;
  }
  selectBranchSlot(kind, toSlot);
  commitBranchLatticeChange();
}

function clearBranchSlot(kind: BranchDragKind, slotIndex: number) {
  const slots = branchSlots(kind);
  if (!slots[slotIndex]) return;
  slots[slotIndex] = null;
  selectBranchSlot(kind, slotIndex);
  commitBranchLatticeChange();
}

function assignBranchAbility(optionId: string) {
  assignBranchOption("ability", optionId);
}

function assignBranchModifier(optionId: string) {
  assignBranchOption("modifier", optionId);
}

function clearSelectedBranchModifier() {
  const selectedSlot = state.combat.branchLattice.selectedModifierSlot;
  if (selectedSlot === null) return;
  clearBranchSlot("modifier", selectedSlot);
}

function clearBranchLatticeAssignments() {
  state.combat.branchLattice.abilitySlotIds = state.combat.branchLattice.abilitySlotIds.map(() => null);
  state.combat.branchLattice.modifierSlotIds = state.combat.branchLattice.modifierSlotIds.map(() => null);
  state.combat.autoLoop = createAutoAttackLoopState();
  updateBranchLattice();
  updateHud();
}

function moveCharacterSelection(direction: number) {
  const currentIndex = characterOrder.indexOf(state.selectedClassId);
  const nextIndex = (currentIndex + direction + characterOrder.length) % characterOrder.length;
  state.selectedClassId = characterOrder[nextIndex];
  renderCharacterSelectScreen();
}

async function startGame() {
  if (isStartingGame || !state.ui.isCharacterSelectActive || !applySelectedClass(state)) return;
  isStartingGame = true;
  shell.loadingScreen.classList.remove("is-hidden");
  shell.characterSelect.classList.add("is-hidden");
  await Promise.all([
    renderAssetsReady,
    new Promise((resolve) => window.setTimeout(resolve, 650)),
  ]);

  state.ui.isCharacterSelectActive = false;
  state.ui.isPaused = false;
  state.ui.isInventoryOpen = false;
  state.ui.isBranchLatticeOpen = false;
  state.ui.pauseMenuSource = null;
  audio.stopTitleMusic();
  audio.playGameplayMusic();
  shell.inventoryMenu.classList.add("is-hidden");
  shell.branchLatticeMenu.classList.add("is-hidden");
  shell.characterSelect.classList.add("is-hidden");
  shell.loadingScreen.classList.add("is-hidden");
  shell.pauseMenu.classList.add("is-hidden");
  shell.hud.classList.remove("is-hidden");
  handleEvents([logEvent(`${selectedClass(state).name} enters the grove`, selectedClass(state).weapon)]);
  isStartingGame = false;
}

function animate(now: number) {
  const delta = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;

  if (isGameplayActive(state)) {
    handleEvents(updateSimulation(state, inputState, delta, frameLookup));
    updateHud();
  }
  syncMobileControls();

  renderer?.draw(state, delta);

  requestAnimationFrame(animate);
}

function handleClassCardClick(event: Event) {
  const card = (event.target as HTMLElement).closest<HTMLButtonElement>(".character-card");
  const classId = card?.dataset.classId as ClassId | undefined;
  if (!classId || !characterClasses[classId]) return;
  state.selectedClassId = classId;
  renderCharacterSelectScreen();
}

function handleKeyDown(event: KeyboardEvent) {
  if (state.ui.isBranchLatticeOpen) {
    if (event.code === "Escape" || event.code === "KeyO") {
      event.preventDefault();
      if (!event.repeat) closeBranchLattice();
    }
    if (event.code === "KeyR") {
      event.preventDefault();
      if (!event.repeat) clearSelectedBranchModifier();
    }
    if (event.code === "KeyC") {
      event.preventDefault();
      if (!event.repeat) clearBranchLatticeAssignments();
    }
    if (event.code === "KeyP") {
      event.preventDefault();
      if (!event.repeat) {
        state.combat.branchLattice.isPreviewOpen = !state.combat.branchLattice.isPreviewOpen;
        updateBranchLattice();
      }
    }
    return;
  }

  if (state.ui.isInventoryOpen) {
    if (event.code === "KeyO") {
      event.preventDefault();
      if (!event.repeat) {
        closeInventory();
        openBranchLattice();
      }
    }
    if (event.code === "Escape" || event.code === "KeyI") {
      event.preventDefault();
      if (!event.repeat) closeInventory();
    }
    return;
  }

  if (event.code === "Escape" && state.ui.pauseMenuSource === "title") {
    event.preventDefault();
    closePauseMenu();
    return;
  }

  if (state.ui.pauseMenuSource === "title") return;

  if (event.code === "Escape" && isGameplayVisible(state)) {
    event.preventDefault();
    togglePauseMenu();
    return;
  }

  if (event.code === "KeyO" && isGameplayVisible(state)) {
    event.preventDefault();
    if (!event.repeat) toggleBranchLattice();
    return;
  }

  if (state.ui.isTitleActive) {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      if (shell.titleScreen.classList.contains("is-title-menu-ready")) showCharacterSelect();
    }
    return;
  }

  if (state.ui.isCharacterSelectActive) {
    if (event.code === "ArrowRight" || event.code === "ArrowDown") {
      event.preventDefault();
      moveCharacterSelection(1);
    }
    if (event.code === "ArrowLeft" || event.code === "ArrowUp") {
      event.preventDefault();
      moveCharacterSelection(-1);
    }
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      void startGame();
    }
    if (event.code === "Escape") {
      event.preventDefault();
      showTitleScreen();
    }
    return;
  }

  if (state.ui.isPaused) return;

  if (event.code === "KeyI" && isGameplayVisible(state)) {
    event.preventDefault();
    if (!event.repeat) toggleInventory();
    return;
  }

  const action = gameplayActionForCode(event.code);
  if (!action) return;

  inputState.pressedActions.add(action);

  if (action === "target-next") {
    event.preventDefault();
    handleEvents(lockTarget(state));
  }
  if (action === "special-1") handleEvents(castSpecial(state, 0));
  if (action === "special-2") handleEvents(castSpecial(state, 1));
  if (action === "special-3") handleEvents(castSpecial(state, 2));
  if (action === "equip") handleEvents(equipDrop(state));
}

function handleKeyUp(event: KeyboardEvent) {
  const action = gameplayActionForCode(event.code);
  if (action) {
    inputState.pressedActions.delete(action);
    if (action === "sprint") {
      inputState.sprintExhaustedUntilRelease = false;
    }
  }
}

function branchDragPayloadFromEvent(event: DragEvent): BranchDragPayload | null {
  if (activeBranchDrag) return activeBranchDrag;
  const rawPayload = event.dataTransfer?.getData(branchDragMime);
  if (!rawPayload) return null;
  try {
    const payload = JSON.parse(rawPayload) as BranchDragPayload;
    if ((payload.kind === "ability" || payload.kind === "modifier") && payload.optionId) return payload;
  } catch {
    return null;
  }
  return null;
}

function setBranchDragPayload(event: DragEvent, payload: BranchDragPayload) {
  activeBranchDrag = payload;
  event.dataTransfer?.setData(branchDragMime, JSON.stringify(payload));
  event.dataTransfer?.setData("text/plain", payload.optionId);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
}

function branchDropTarget(target: HTMLElement) {
  const abilitySlot = target.closest<HTMLElement>("[data-branch-ability-slot]");
  if (abilitySlot?.dataset.branchAbilitySlot) {
    return { kind: "ability" as const, slot: Number(abilitySlot.dataset.branchAbilitySlot), element: abilitySlot };
  }
  const modifierSlot = target.closest<HTMLElement>("[data-branch-modifier-slot]");
  if (modifierSlot?.dataset.branchModifierSlot) {
    return { kind: "modifier" as const, slot: Number(modifierSlot.dataset.branchModifierSlot), element: modifierSlot };
  }
  const abilityPane = target.closest<HTMLElement>(".branch-abilities-panel, .branch-ability-list");
  if (abilityPane) return { kind: "ability" as const, slot: null, element: abilityPane };
  const modifierPane = target.closest<HTMLElement>(".branch-modifiers-panel, .branch-modifier-list");
  if (modifierPane) return { kind: "modifier" as const, slot: null, element: modifierPane };
  return null;
}

function clearBranchDragStyles() {
  shell.branchLatticeMenu.querySelectorAll(".is-dragging, .is-drag-target").forEach((element) => {
    element.classList.remove("is-dragging", "is-drag-target");
  });
}

function clearBranchDropTargets() {
  shell.branchLatticeMenu.querySelectorAll(".is-drag-target").forEach((element) => {
    element.classList.remove("is-drag-target");
  });
}

function handleBranchDragStart(event: DragEvent) {
  const target = event.target as HTMLElement;
  const abilityOption = target.closest<HTMLElement>("[data-branch-ability-option]");
  if (abilityOption?.dataset.branchAbilityOption) {
    setBranchDragPayload(event, {
      kind: "ability",
      optionId: abilityOption.dataset.branchAbilityOption,
      source: "option",
      fromSlot: null,
    });
    abilityOption.classList.add("is-dragging");
    return;
  }

  const modifierOption = target.closest<HTMLElement>("[data-branch-modifier-option]");
  if (modifierOption?.dataset.branchModifierOption) {
    setBranchDragPayload(event, {
      kind: "modifier",
      optionId: modifierOption.dataset.branchModifierOption,
      source: "option",
      fromSlot: null,
    });
    modifierOption.classList.add("is-dragging");
    return;
  }

  const abilitySlot = target.closest<HTMLElement>("[data-branch-ability-slot]");
  if (abilitySlot?.dataset.branchAbilitySlot) {
    const fromSlot = Number(abilitySlot.dataset.branchAbilitySlot);
    const optionId = state.combat.branchLattice.abilitySlotIds[fromSlot];
    if (!optionId) return;
    setBranchDragPayload(event, { kind: "ability", optionId, source: "slot", fromSlot });
    abilitySlot.classList.add("is-dragging");
    return;
  }

  const modifierSlot = target.closest<HTMLElement>("[data-branch-modifier-slot]");
  if (modifierSlot?.dataset.branchModifierSlot) {
    const fromSlot = Number(modifierSlot.dataset.branchModifierSlot);
    const optionId = state.combat.branchLattice.modifierSlotIds[fromSlot];
    if (!optionId) return;
    setBranchDragPayload(event, { kind: "modifier", optionId, source: "slot", fromSlot });
    modifierSlot.classList.add("is-dragging");
  }
}

function handleBranchDragOver(event: DragEvent) {
  const payload = branchDragPayloadFromEvent(event);
  if (!payload) return;
  const target = branchDropTarget(event.target as HTMLElement);
  if (!target || target.kind !== payload.kind) return;
  if (target.slot === null && payload.source !== "slot") return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  clearBranchDropTargets();
  target.element.classList.add("is-drag-target");
}

function handleBranchDrop(event: DragEvent) {
  const payload = branchDragPayloadFromEvent(event);
  if (!payload) return;
  const target = branchDropTarget(event.target as HTMLElement);
  if (!target || target.kind !== payload.kind) return;
  event.preventDefault();

  if (target.slot === null) {
    if (payload.source === "slot" && payload.fromSlot !== null) clearBranchSlot(payload.kind, payload.fromSlot);
  } else if (payload.source === "slot" && payload.fromSlot !== null) {
    moveBranchSlot(payload.kind, payload.fromSlot, target.slot);
  } else {
    assignBranchOption(payload.kind, payload.optionId, target.slot);
  }

  activeBranchDrag = null;
  suppressBranchClick = true;
  clearBranchDragStyles();
  window.setTimeout(() => {
    suppressBranchClick = false;
  }, 0);
}

function handleBranchDragEnd() {
  activeBranchDrag = null;
  suppressBranchClick = true;
  clearBranchDragStyles();
  window.setTimeout(() => {
    suppressBranchClick = false;
  }, 0);
}

shell.startButton.addEventListener("click", showCharacterSelect);
shell.titleControlsButton.addEventListener("click", () => openPauseMenu("controls", "title"));
shell.titleSoundButton.addEventListener("click", () => openPauseMenu("sound", "title"));
shell.titleScreen.addEventListener("pointerdown", audio.playTitleMusic);
audio.playTitleMusic();
void titleIntro.start();
shell.backButton.addEventListener("click", showTitleScreen);
shell.continueButton.addEventListener("click", () => void startGame());
shell.resumeButton.addEventListener("click", closePauseMenu);
shell.inventoryCloseButton.addEventListener("click", closeInventory);
shell.branchLatticeCloseButton.addEventListener("click", closeBranchLattice);
initializePauseTabs(shell, (tabName) => selectPauseTab(shell, tabName));
shell.characterGrid.addEventListener("click", handleClassCardClick);
shell.branchLatticeMenu.addEventListener("dragstart", handleBranchDragStart);
shell.branchLatticeMenu.addEventListener("dragover", handleBranchDragOver);
shell.branchLatticeMenu.addEventListener("dragleave", (event) => {
  if (!(event.relatedTarget instanceof Node) || !shell.branchLatticeMenu.contains(event.relatedTarget)) clearBranchDropTargets();
});
shell.branchLatticeMenu.addEventListener("drop", handleBranchDrop);
shell.branchLatticeMenu.addEventListener("dragend", handleBranchDragEnd);
shell.branchLatticeMenu.addEventListener("click", (event) => {
  if (suppressBranchClick) {
    event.preventDefault();
    return;
  }
  const target = event.target as HTMLElement;
  const abilityOption = target.closest<HTMLElement>("[data-branch-ability-option]");
  if (abilityOption?.dataset.branchAbilityOption) {
    assignBranchAbility(abilityOption.dataset.branchAbilityOption);
    return;
  }
  const modifierOption = target.closest<HTMLElement>("[data-branch-modifier-option]");
  if (modifierOption?.dataset.branchModifierOption) {
    assignBranchModifier(modifierOption.dataset.branchModifierOption);
    return;
  }
  const abilitySlot = target.closest<HTMLElement>("[data-branch-ability-slot]");
  if (abilitySlot?.dataset.branchAbilitySlot) {
    state.combat.branchLattice.selectedAbilitySlot = Number(abilitySlot.dataset.branchAbilitySlot);
    state.combat.branchLattice.selectedModifierSlot = null;
    updateBranchLattice();
    return;
  }
  const modifierSlot = target.closest<HTMLElement>("[data-branch-modifier-slot]");
  if (modifierSlot?.dataset.branchModifierSlot) {
    state.combat.branchLattice.selectedModifierSlot = Number(modifierSlot.dataset.branchModifierSlot);
    state.combat.branchLattice.selectedAbilitySlot = null;
    updateBranchLattice();
  }
});
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

const renderAssetsReady = loadRenderAssets().then((assets) => {
  renderer = createCanvasRenderer(shell.canvas, assets);
  frameLookup = createAnimationFrameLookup(assets);
  renderer.resize();
  window.addEventListener("resize", () => renderer?.resize());

  shell.canvas.addEventListener("click", (event) => {
    if (event.button !== 0 || !renderer || !isGameplayActive(state)) return;
    const worldPoint = screenToWorld(shell.canvas, renderer.camera, event.clientX, event.clientY);
    handleEvents(isEnemyAtWorldPoint(state, worldPoint) ? lockTarget(state) : clearTarget(state));
  });

  pushLog(shell.eventLog, "MotherSeed prototype ready", "Close for melee, dodge the red telegraphs");
  requestAnimationFrame((now) => {
    lastFrame = now;
    animate(now);
  });
});
