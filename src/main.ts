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
import { applyCharacterSelect, renderCharacterSelect } from "./ui/character-select";
import { pushGameEvents, pushLog } from "./ui/event-log";
import { applyHud, renderHud } from "./ui/hud";
import { applyInventory, renderInventory } from "./ui/inventory";
import { initializePauseTabs, selectPauseTab, setPauseMenuCopy } from "./ui/pause-menu";

const shell = createAppShell();
const state = createInitialGameState("warrior");
const inputState = createInputState();
const audio = createAudioManager({
  musicVolumeInput: shell.musicVolumeInput,
  sfxVolumeInput: shell.sfxVolumeInput,
  musicVolumeValue: shell.musicVolumeValue,
  sfxVolumeValue: shell.sfxVolumeValue,
});

let renderer: CanvasRenderer | null = null;
let frameLookup: AnimationFrameLookup | undefined;
let lastFrame = performance.now();
let isStartingGame = false;

function handleEvents(events: readonly GameEvent[]) {
  pushGameEvents(shell.eventLog, events, (event) => {
    if (event.kind === "sound") audio.playEventSound(event.id);
  });
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

function renderCharacterSelectScreen() {
  applyCharacterSelect({
    characterGrid: shell.characterGrid,
    characterDetail: shell.characterDetail,
    continueButton: shell.continueButton,
  }, renderCharacterSelect(state.selectedClassId));
}

function showCharacterSelect() {
  if (!state.ui.isTitleActive) return;
  state.ui.isTitleActive = false;
  state.ui.isCharacterSelectActive = true;
  state.ui.isPaused = false;
  state.ui.isInventoryOpen = false;
  state.ui.pauseMenuSource = null;
  clearInputState(inputState);
  audio.stopGameplayMusic();
  audio.playTitleMusic();
  shell.inventoryMenu.classList.add("is-hidden");
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
  state.ui.pauseMenuSource = null;
  clearInputState(inputState);
  audio.stopGameplayMusic();
  audio.playTitleMusic();
  shell.inventoryMenu.classList.add("is-hidden");
  shell.pauseMenu.classList.add("is-hidden");
  shell.loadingScreen.classList.add("is-hidden");
  shell.hud.classList.add("is-hidden");
  shell.characterSelect.classList.add("is-hidden");
  shell.titleScreen.classList.remove("is-hidden");
}

function openPauseMenu(tabName = "controls", source: "gameplay" | "title" = "gameplay") {
  if (source === "gameplay" && (!isGameplayVisible(state) || state.ui.isPaused)) return;
  if (source === "title" && !state.ui.isTitleActive) return;
  state.ui.isPaused = source === "gameplay";
  state.ui.isInventoryOpen = false;
  state.ui.pauseMenuSource = source;
  clearInputState(inputState);
  setPauseMenuCopy(shell, source);
  audio.updateAudioSettingsUi();
  selectPauseTab(shell, tabName);
  shell.inventoryMenu.classList.add("is-hidden");
  shell.pauseMenu.classList.remove("is-hidden");
  requestAnimationFrame(() => shell.pauseFrame.focus());
}

function closePauseMenu() {
  if (!state.ui.pauseMenuSource) return;
  state.ui.isPaused = false;
  state.ui.pauseMenuSource = null;
  clearInputState(inputState);
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
  if (!isGameplayVisible(state) || state.ui.isPaused || state.ui.pauseMenuSource) return;
  state.ui.isInventoryOpen = true;
  clearInputState(inputState);
  updateInventory();
  shell.inventoryMenu.classList.remove("is-hidden");
  requestAnimationFrame(() => shell.inventoryFrame.focus());
}

function closeInventory() {
  if (!state.ui.isInventoryOpen) return;
  state.ui.isInventoryOpen = false;
  clearInputState(inputState);
  shell.inventoryMenu.classList.add("is-hidden");
}

function toggleInventory() {
  if (state.ui.isInventoryOpen) {
    closeInventory();
  } else {
    openInventory();
  }
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
  state.ui.pauseMenuSource = null;
  audio.stopTitleMusic();
  audio.playGameplayMusic();
  shell.inventoryMenu.classList.add("is-hidden");
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
  if (state.ui.isInventoryOpen) {
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

  if (state.ui.isTitleActive) {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      showCharacterSelect();
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

shell.startButton.addEventListener("click", showCharacterSelect);
shell.titleControlsButton.addEventListener("click", () => openPauseMenu("controls", "title"));
shell.titleSoundButton.addEventListener("click", () => openPauseMenu("sound", "title"));
shell.titleScreen.addEventListener("pointerdown", audio.playTitleMusic);
shell.backButton.addEventListener("click", showTitleScreen);
shell.continueButton.addEventListener("click", () => void startGame());
shell.resumeButton.addEventListener("click", closePauseMenu);
shell.inventoryCloseButton.addEventListener("click", closeInventory);
initializePauseTabs(shell, (tabName) => selectPauseTab(shell, tabName));
shell.characterGrid.addEventListener("click", handleClassCardClick);
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
