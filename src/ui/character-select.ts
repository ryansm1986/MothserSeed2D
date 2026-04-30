import { characterClasses, characterOrder } from "../game/content/classes";
import type { ClassId } from "../game/types";

export type CharacterSelectViewModel = {
  gridHtml: string;
  detailHtml: string;
  detailAccent: string;
  canContinue: boolean;
};

export function renderCharacterSelect(selectedClassId: ClassId): CharacterSelectViewModel {
  const gridHtml = characterOrder
    .map((id) => {
      const option = characterClasses[id];
      const selected = option.id === selectedClassId;
      const portrait = option.portraitUrl
        ? `<img src="${option.portraitUrl}" alt="" />`
        : `<span>${option.glyph}</span>`;
      return `
        <button
          class="character-card ${selected ? "is-selected" : ""} ${option.implemented ? "" : "is-planned"}"
          data-class-id="${option.id}"
          type="button"
          style="--class-accent: ${option.accent}"
          aria-pressed="${selected}"
        >
          <div class="portrait ${option.portraitUrl ? "has-art" : ""}">${portrait}</div>
          <div class="card-copy">
            <span>${option.status}</span>
            <strong>${option.name}</strong>
          </div>
        </button>
      `;
    })
    .join("");

  const currentClass = characterClasses[selectedClassId];
  const detailHtml = `
    <div class="detail-status">${currentClass.status}</div>
    <div class="detail-portrait ${currentClass.portraitUrl ? "has-art" : ""}">
      ${currentClass.portraitUrl ? `<img src="${currentClass.portraitUrl}" alt="" />` : `<span>${currentClass.glyph}</span>`}
    </div>
    <h2>${currentClass.name}</h2>
    <h3>${currentClass.title}</h3>
    <p>${currentClass.role}</p>
    <div class="detail-stat-grid">
      <div><span>Weapon</span><strong>${currentClass.weapon}</strong></div>
      <div><span>Health</span><strong>${currentClass.stats.health}</strong></div>
      <div><span>Stamina</span><strong>${currentClass.stats.stamina}</strong></div>
      <div><span>Meter</span><strong>${currentClass.stats.meter}</strong></div>
    </div>
    <div class="detail-abilities">
      ${currentClass.abilities
        .map((ability) => `<div><kbd>${ability.key}</kbd><span>${ability.name}</span><em>${ability.cost} meter</em></div>`)
        .join("")}
    </div>
    <div class="detail-note">
      ${currentClass.implemented ? "Ready for the current prototype." : "Class slot planned; combat kit is a placeholder."}
    </div>
  `;

  return {
    gridHtml,
    detailHtml,
    detailAccent: currentClass.accent,
    canContinue: currentClass.implemented,
  };
}

export function applyCharacterSelect(
  targets: { characterGrid: HTMLElement; characterDetail: HTMLElement; continueButton: HTMLButtonElement },
  view: CharacterSelectViewModel,
) {
  targets.characterGrid.innerHTML = view.gridHtml;
  targets.continueButton.disabled = !view.canContinue;
  targets.characterDetail.style.setProperty("--class-accent", view.detailAccent);
  targets.characterDetail.innerHTML = view.detailHtml;
}
