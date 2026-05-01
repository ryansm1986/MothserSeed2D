import { activeLatticeSequence, activeWeaponSpecials, selectedClass, type GameState } from "../game/state";

type InventoryItem = {
  name: string;
  detail: string;
  glyph: string;
  tone: "common" | "uncommon" | "rare" | "class";
};

export type InventoryViewModel = {
  heroHtml: string;
  equipmentHtml: string;
  packHtml: string;
  potionsHtml: string;
  detailsHtml: string;
};

const emptySlots = 28;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderItem(item: InventoryItem, className = "") {
  return `
    <div class="inventory-item ${item.tone} ${className}" title="${escapeHtml(item.name)}">
      <span>${escapeHtml(item.glyph)}</span>
    </div>
  `;
}

export function renderInventory(state: GameState): InventoryViewModel {
  const currentClass = selectedClass(state);
  const specials = activeWeaponSpecials(state);
  const autoAbilities = activeLatticeSequence(state).filter((ability): ability is NonNullable<typeof ability> => Boolean(ability));
  const gear = state.combat.equippedGear;
  const droppedGear = state.combat.droppedGear;
  const accent = currentClass.accent;
  const gearTone = gear.rarity.toLowerCase() as InventoryItem["tone"];
  const droppedTone = droppedGear?.rarity.toLowerCase() as InventoryItem["tone"] | undefined;

  const heroHtml = `
    <div class="inventory-portrait" style="--class-accent:${accent}">
      ${currentClass.portraitUrl ? `<img src="${currentClass.portraitUrl}" alt="" />` : `<span>${escapeHtml(currentClass.glyph)}</span>`}
    </div>
    <div class="inventory-nameplate">
      <strong>${escapeHtml(currentClass.name)}</strong>
      <span>${escapeHtml(currentClass.title)}</span>
    </div>
    <div class="inventory-stat-list">
      <div><span>Life</span><strong>${Math.ceil(state.player.health)} / ${state.player.maxHealth}</strong></div>
      <div><span>Stamina</span><strong>${Math.floor(state.player.stamina)} / ${state.player.maxStamina}</strong></div>
      <div><span>Meter</span><strong>${Math.floor(state.player.meter)} / ${state.player.maxMeter}</strong></div>
      <div><span>Weapon</span><strong>${escapeHtml(currentClass.weapon)}</strong></div>
    </div>
  `;

  const equipment = [
    { label: "Weapon", item: { name: currentClass.weapon, detail: currentClass.role, glyph: currentClass.glyph, tone: "class" as const } },
    { label: "Gloves", item: { name: "Barkhide Gloves", detail: "Rootwrapped grip for long fights.", glyph: "GL", tone: "common" as const } },
    { label: "Head", item: { name: "Grove Cowl", detail: "A light helm grown from old bark.", glyph: "HD", tone: "common" as const } },
    { label: "Armor", item: { name: "Grove Harness", detail: "Worn close to the barkline.", glyph: "AR", tone: "common" as const } },
    { label: "Legs", item: { name: "Rootguard Greaves", detail: "Steady footing over roots and ruin.", glyph: "LG", tone: "common" as const } },
    { label: "Amulet", item: { name: "Seed Amulet", detail: "A living keepsake bound to the grove.", glyph: "AM", tone: "rare" as const } },
    { label: "Ring", item: { name: "Root Ring", detail: "A carved ring warm with saplight.", glyph: "R1", tone: "uncommon" as const } },
    { label: "Ring", item: specials[0] ? { name: `${specials[0].name} Signet`, detail: `${specials[0].cost} meter`, glyph: "R2", tone: "class" as const } : null },
    { label: "Feet", item: { name: "Trail Boots", detail: "Soft steps over roots and ruin.", glyph: "BT", tone: "common" as const } },
  ];

  const equipmentHtml = equipment
    .map(({ label, item }) => `
      <div class="equipment-slot">
        <span>${escapeHtml(label)}</span>
        ${item ? renderItem(item, "equipped") : `<div class="inventory-item empty"></div>`}
      </div>
    `)
    .join("");

  const packItems: InventoryItem[] = [
    { name: "Verdant Flask", detail: "Restores a small burst of life.", glyph: "LF", tone: "uncommon" },
    { name: "Bluecap Draught", detail: "Restores stamina after a sprint.", glyph: "ST", tone: "common" },
    { name: "Amber Seed", detail: "A warm seed for difficult fights.", glyph: "SD", tone: "rare" },
    ...specials.map((special) => ({
      name: special.name,
      detail: `Weapon special: ${special.cost} meter, ${special.cooldown}s recovery`,
      glyph: special.key,
      tone: "class" as const,
    })),
    ...autoAbilities.map((ability) => ({
      name: ability.name,
      detail: `Auto loop: ${ability.detail}`,
      glyph: ability.glyph,
      tone: "uncommon" as const,
    })),
    { name: gear.name, detail: gear.ability, glyph: gear.rarity[0], tone: gearTone },
  ];

  if (droppedGear) {
    packItems.unshift({
      name: droppedGear.name,
      detail: droppedGear.ability,
      glyph: droppedGear.rarity[0],
      tone: droppedTone ?? "common",
    });
  }

  const packHtml = [
    ...packItems.map((item, index) => renderItem(item, index === 0 && droppedGear ? "new-drop" : "")),
    ...Array.from({ length: Math.max(0, emptySlots - packItems.length) }, () => `<div class="inventory-item empty"></div>`),
  ].join("");

  const potionItems: InventoryItem[] = [
    { name: "Life Flask", detail: "Bound to the roots.", glyph: "L", tone: "uncommon" },
    { name: "Stamina Flask", detail: "For hard sprints.", glyph: "S", tone: "common" },
    { name: "Meter Flask", detail: "Held for burst windows.", glyph: "M", tone: "rare" },
    { name: "Ward Oil", detail: "A quiet ward against ruin.", glyph: "W", tone: "class" },
  ];

  const potionsHtml = potionItems.map((item) => renderItem(item, "quick")).join("");
  const featured = droppedGear
    ? { name: droppedGear.name, detail: droppedGear.ability, rarity: droppedGear.rarity, note: "New drop" }
    : {
        name: gear.name,
        detail: `${gear.ability} Specials: ${gear.frame.weaponSpecials.map((special) => special.name).join(", ") || "None"}. Auto: ${gear.frame.latticeAbilityOptions.map((ability) => ability.name).join(", ") || "None"}.`,
        rarity: gear.rarity,
        note: "Equipped gear",
      };
  const detailsHtml = `
    <span>${escapeHtml(featured.note)}</span>
    <strong>${escapeHtml(featured.name)}</strong>
    <em>${escapeHtml(featured.rarity)}</em>
    <p>${escapeHtml(featured.detail)}</p>
  `;

  return { heroHtml, equipmentHtml, packHtml, potionsHtml, detailsHtml };
}

export function applyInventory(
  targets: {
    hero: HTMLElement;
    equipment: HTMLElement;
    pack: HTMLElement;
    potions: HTMLElement;
    details: HTMLElement;
  },
  view: InventoryViewModel,
) {
  targets.hero.innerHTML = view.heroHtml;
  targets.equipment.innerHTML = view.equipmentHtml;
  targets.pack.innerHTML = view.packHtml;
  targets.potions.innerHTML = view.potionsHtml;
  targets.details.innerHTML = view.detailsHtml;
}
