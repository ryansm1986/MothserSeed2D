import titleImageUrl from "../../assets/Title.png?url";
import inventoryPanelUrl from "../../assets/ui/inventory-panel-drawer-v2.png?url";

export type AppShell = {
  shell: HTMLDivElement;
  titleScreen: HTMLElement;
  startButton: HTMLButtonElement;
  titleControlsButton: HTMLButtonElement;
  titleSoundButton: HTMLButtonElement;
  characterSelect: HTMLElement;
  characterGrid: HTMLDivElement;
  characterDetail: HTMLElement;
  backButton: HTMLButtonElement;
  continueButton: HTMLButtonElement;
  loadingScreen: HTMLElement;
  hud: HTMLDivElement;
  playerPanel: HTMLDivElement;
  targetPanel: HTMLDivElement;
  abilityPanel: HTMLDivElement;
  eventLog: HTMLDivElement;
  inventoryMenu: HTMLElement;
  inventoryFrame: HTMLDivElement;
  inventoryCloseButton: HTMLButtonElement;
  inventoryHero: HTMLElement;
  inventoryEquipment: HTMLElement;
  inventoryPack: HTMLElement;
  inventoryPotions: HTMLElement;
  inventoryDetails: HTMLElement;
  pauseMenu: HTMLElement;
  pauseFrame: HTMLDivElement;
  pauseKicker: HTMLElement;
  pauseTitle: HTMLElement;
  resumeButton: HTMLButtonElement;
  pauseTabs: HTMLButtonElement[];
  pausePanels: HTMLElement[];
  musicVolumeInput: HTMLInputElement;
  sfxVolumeInput: HTMLInputElement;
  musicVolumeValue: HTMLElement;
  sfxVolumeValue: HTMLElement;
  mobileControls: HTMLElement;
  mobileMovePad: HTMLElement;
  mobileMoveThumb: HTMLElement;
  mobileDodgeButton: HTMLButtonElement;
  mobileTargetButton: HTMLButtonElement;
  mobileSpecialButtons: HTMLButtonElement[];
  mobileEquipButton: HTMLButtonElement;
  mobileInventoryButton: HTMLButtonElement;
  mobilePauseButton: HTMLButtonElement;
  mobileRotatePrompt: HTMLElement;
  canvas: HTMLCanvasElement;
};

export function createAppShell(): AppShell {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    throw new Error("Missing #app root");
  }

  app.innerHTML = `
    <div class="game-shell"></div>
    <section class="title-screen" style="--title-image: url('${titleImageUrl}')">
      <nav class="title-menu" aria-label="Main menu">
        <button class="title-menu-option start-button" type="button">Start</button>
        <button class="title-menu-option title-controls-button" type="button">Controls</button>
        <button class="title-menu-option title-sound-button" type="button">Sound</button>
      </nav>
    </section>
    <section class="character-select is-hidden" aria-labelledby="character-select-title" style="--title-image: url('${titleImageUrl}')">
      <div class="select-frame">
        <div class="select-header">
          <div>
            <p class="select-kicker">Choose your seedbound path</p>
            <h1 id="character-select-title">Character Select</h1>
          </div>
          <button class="menu-button back-button" type="button">Back</button>
        </div>
        <div class="character-layout">
          <div class="character-grid" id="character-grid"></div>
          <aside class="character-detail" id="character-detail"></aside>
        </div>
        <div class="select-footer">
          <div class="select-hint">Five paths. Three awaken in this build.</div>
          <button class="menu-button continue-button" type="button">Enter Grove</button>
        </div>
      </div>
    </section>
    <section class="loading-screen is-hidden" aria-live="polite" aria-label="Loading">
      <div class="loading-frame">
        <p>Loading</p>
        <strong>Root chamber waking</strong>
        <div class="loading-bar"><span></span></div>
      </div>
    </section>
    <div class="hud is-hidden">
      <div class="hud-top">
        <section class="hud-panel vitals-panel" id="player-panel"></section>
        <section class="hud-panel target-panel" id="target-panel"></section>
      </div>
      <div class="hud-bottom">
        <div class="event-log" id="event-log"></div>
        <section class="action-bar">
          <div class="ability-row" id="abilities"></div>
        </section>
        <section class="control-guide" aria-label="Controls">
          <div><kbd>WASD</kbd><span>Move</span></div>
          <div><kbd>Shift</kbd><span>Sprint</span></div>
          <div><kbd>Space</kbd><span>Dodge</span></div>
          <div><kbd>Tab</kbd><span>Target</span></div>
          <div><kbd>1-3</kbd><span>Specials</span></div>
          <div><kbd>E</kbd><span>Equip</span></div>
          <div><kbd>I</kbd><span>Inventory</span></div>
        </section>
      </div>
    </div>
    <section class="inventory-menu is-hidden" role="dialog" aria-modal="true" aria-labelledby="inventory-title" style="--inventory-art: url('${inventoryPanelUrl}')">
      <div class="inventory-frame" tabindex="-1">
        <header class="inventory-header">
          <div>
            <p class="inventory-kicker">Motherseed reliquary</p>
            <h1 id="inventory-title">Inventory</h1>
          </div>
          <button class="inventory-close-button" type="button" aria-label="Close inventory">Close</button>
        </header>
        <div class="inventory-content">
          <aside class="inventory-hero" id="inventory-hero"></aside>
          <section class="inventory-equipment" id="inventory-equipment" aria-label="Equipment"></section>
          <section class="inventory-pack" id="inventory-pack" aria-label="Backpack"></section>
          <section class="inventory-potions" id="inventory-potions" aria-label="Quick items"></section>
          <aside class="inventory-details" id="inventory-details"></aside>
        </div>
      </div>
    </section>
    <section class="pause-menu is-hidden" role="dialog" aria-modal="true" aria-labelledby="pause-title">
      <div class="pause-frame" tabindex="-1">
        <header class="pause-header">
          <div>
            <p class="pause-kicker">Grove suspended</p>
            <h1 id="pause-title">Paused</h1>
          </div>
          <button class="menu-button resume-button" type="button">Resume</button>
        </header>
        <div class="pause-layout">
          <nav class="pause-tabs" aria-label="Pause menu">
            <button class="pause-tab is-active" type="button" data-pause-tab="controls">Controls</button>
            <button class="pause-tab" type="button" data-pause-tab="sound">Sound</button>
          </nav>
          <div class="pause-content">
            <section class="pause-panel" data-pause-panel="controls" aria-label="Controls">
              <div class="control-list desktop-control-list">
                <div><kbd>WASD</kbd><span>Move</span></div>
                <div><kbd>Shift</kbd><span>Sprint</span></div>
                <div><kbd>Space</kbd><span>Dodge</span></div>
                <div><kbd>Mouse</kbd><span>Target</span></div>
                <div><kbd>Tab</kbd><span>Lock target</span></div>
                <div><kbd>1</kbd><span>First special</span></div>
                <div><kbd>2</kbd><span>Second special</span></div>
                <div><kbd>3</kbd><span>Third special</span></div>
                <div><kbd>E</kbd><span>Equip drop</span></div>
                <div><kbd>I</kbd><span>Inventory</span></div>
                <div><kbd>Esc</kbd><span>Pause</span></div>
              </div>
              <div class="control-list mobile-control-list" aria-label="Phone controls">
                <div><kbd>Pad</kbd><span>Move</span></div>
                <div><kbd>Edge</kbd><span>Sprint</span></div>
                <div><kbd>Dodge</kbd><span>Roll through danger</span></div>
                <div><kbd>Target</kbd><span>Lock nearest enemy</span></div>
                <div><kbd>1-3</kbd><span>Specials</span></div>
                <div><kbd>Equip</kbd><span>Equip drop</span></div>
                <div><kbd>Bag</kbd><span>Inventory</span></div>
                <div><kbd>Menu</kbd><span>Pause</span></div>
              </div>
            </section>
            <section class="pause-panel is-hidden" data-pause-panel="sound" aria-label="Sound">
              <div class="sound-controls">
                <label class="sound-control" for="music-volume">
                  <span>Music</span>
                  <input id="music-volume" type="range" min="0" max="100" step="1" />
                  <strong id="music-volume-value">80%</strong>
                </label>
                <label class="sound-control" for="sfx-volume">
                  <span>Sound effects</span>
                  <input id="sfx-volume" type="range" min="0" max="100" step="1" />
                  <strong id="sfx-volume-value">80%</strong>
                </label>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
    <section class="mobile-controls" aria-label="Phone gameplay controls">
      <div class="mobile-top-actions" aria-label="Phone menu controls">
        <button class="mobile-button mobile-inventory-button" type="button" aria-label="Open inventory">Bag</button>
        <button class="mobile-button mobile-pause-button" type="button" aria-label="Pause game">Menu</button>
      </div>
      <div class="mobile-move-pad" role="application" aria-label="Move">
        <div class="mobile-move-ring">
          <div class="mobile-move-thumb"></div>
        </div>
        <span>Move</span>
      </div>
      <div class="mobile-action-cluster" aria-label="Phone action controls">
        <button class="mobile-button mobile-target-button" type="button" aria-label="Lock target">Target</button>
        <button class="mobile-button mobile-dodge-button" type="button" aria-label="Dodge">Dodge</button>
        <button class="mobile-button mobile-special-button" type="button" data-mobile-special="0" aria-label="Use special 1">1</button>
        <button class="mobile-button mobile-special-button" type="button" data-mobile-special="1" aria-label="Use special 2">2</button>
        <button class="mobile-button mobile-special-button" type="button" data-mobile-special="2" aria-label="Use special 3">3</button>
        <button class="mobile-button mobile-equip-button" type="button" aria-label="Equip drop">Equip</button>
      </div>
    </section>
    <section class="mobile-rotate-prompt" aria-label="Rotate phone">
      <div>
        <strong>Rotate phone</strong>
        <span>Landscape mode keeps the grove and controls playable.</span>
      </div>
    </section>
  `;

  const shell = document.querySelector<HTMLDivElement>(".game-shell")!;
  const canvas = document.createElement("canvas");
  shell.appendChild(canvas);

  return {
    shell,
    titleScreen: document.querySelector<HTMLElement>(".title-screen")!,
    startButton: document.querySelector<HTMLButtonElement>(".start-button")!,
    titleControlsButton: document.querySelector<HTMLButtonElement>(".title-controls-button")!,
    titleSoundButton: document.querySelector<HTMLButtonElement>(".title-sound-button")!,
    characterSelect: document.querySelector<HTMLElement>(".character-select")!,
    characterGrid: document.querySelector<HTMLDivElement>("#character-grid")!,
    characterDetail: document.querySelector<HTMLElement>("#character-detail")!,
    backButton: document.querySelector<HTMLButtonElement>(".back-button")!,
    continueButton: document.querySelector<HTMLButtonElement>(".continue-button")!,
    loadingScreen: document.querySelector<HTMLElement>(".loading-screen")!,
    hud: document.querySelector<HTMLDivElement>(".hud")!,
    playerPanel: document.querySelector<HTMLDivElement>("#player-panel")!,
    targetPanel: document.querySelector<HTMLDivElement>("#target-panel")!,
    abilityPanel: document.querySelector<HTMLDivElement>("#abilities")!,
    eventLog: document.querySelector<HTMLDivElement>("#event-log")!,
    inventoryMenu: document.querySelector<HTMLElement>(".inventory-menu")!,
    inventoryFrame: document.querySelector<HTMLDivElement>(".inventory-frame")!,
    inventoryCloseButton: document.querySelector<HTMLButtonElement>(".inventory-close-button")!,
    inventoryHero: document.querySelector<HTMLElement>("#inventory-hero")!,
    inventoryEquipment: document.querySelector<HTMLElement>("#inventory-equipment")!,
    inventoryPack: document.querySelector<HTMLElement>("#inventory-pack")!,
    inventoryPotions: document.querySelector<HTMLElement>("#inventory-potions")!,
    inventoryDetails: document.querySelector<HTMLElement>("#inventory-details")!,
    pauseMenu: document.querySelector<HTMLElement>(".pause-menu")!,
    pauseFrame: document.querySelector<HTMLDivElement>(".pause-frame")!,
    pauseKicker: document.querySelector<HTMLElement>(".pause-kicker")!,
    pauseTitle: document.querySelector<HTMLElement>("#pause-title")!,
    resumeButton: document.querySelector<HTMLButtonElement>(".resume-button")!,
    pauseTabs: Array.from(document.querySelectorAll<HTMLButtonElement>(".pause-tab")),
    pausePanels: Array.from(document.querySelectorAll<HTMLElement>(".pause-panel")),
    musicVolumeInput: document.querySelector<HTMLInputElement>("#music-volume")!,
    sfxVolumeInput: document.querySelector<HTMLInputElement>("#sfx-volume")!,
    musicVolumeValue: document.querySelector<HTMLElement>("#music-volume-value")!,
    sfxVolumeValue: document.querySelector<HTMLElement>("#sfx-volume-value")!,
    mobileControls: document.querySelector<HTMLElement>(".mobile-controls")!,
    mobileMovePad: document.querySelector<HTMLElement>(".mobile-move-pad")!,
    mobileMoveThumb: document.querySelector<HTMLElement>(".mobile-move-thumb")!,
    mobileDodgeButton: document.querySelector<HTMLButtonElement>(".mobile-dodge-button")!,
    mobileTargetButton: document.querySelector<HTMLButtonElement>(".mobile-target-button")!,
    mobileSpecialButtons: Array.from(document.querySelectorAll<HTMLButtonElement>(".mobile-special-button")),
    mobileEquipButton: document.querySelector<HTMLButtonElement>(".mobile-equip-button")!,
    mobileInventoryButton: document.querySelector<HTMLButtonElement>(".mobile-inventory-button")!,
    mobilePauseButton: document.querySelector<HTMLButtonElement>(".mobile-pause-button")!,
    mobileRotatePrompt: document.querySelector<HTMLElement>(".mobile-rotate-prompt")!,
    canvas,
  };
}
