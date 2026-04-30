import warriorPortraitUrl from "../../../assets/characters/green_warrior_v4/portrait.png?url";
import purpleMagePortraitUrl from "../../../assets/characters/purple_mage/portrait.png?url";
import type { CharacterClass, ClassId } from "../types";

export const characterClasses: Record<ClassId, CharacterClass> = {
  warrior: {
    id: "warrior",
    name: "Warrior",
    title: "Oathbound Vanguard",
    weapon: "Sword and Shield",
    role: "Spin through close range and send cyclone waves across the grove.",
    status: "Implemented",
    implemented: true,
    accent: "#f2d36b",
    portraitUrl: warriorPortraitUrl,
    glyph: "W",
    stats: { health: 140, stamina: 100, meter: 100 },
    abilities: [
      { key: "1", id: "motherslash", name: "Motherslash", cost: 50, cooldown: 8.5, range: 520 },
    ],
  },
  ranger: {
    id: "ranger",
    name: "Ranger",
    title: "Greenwood Marksman",
    weapon: "Bow",
    role: "Kite enemies, place traps, detonate chain windows from range.",
    status: "Planned",
    implemented: false,
    accent: "#74d47d",
    glyph: "R",
    stats: { health: 110, stamina: 120, meter: 100 },
    abilities: [
      { key: "1", id: "piercing-shot", name: "Piercing Shot", cost: 30, cooldown: 4.5, range: 420 },
      { key: "2", id: "snare-trap", name: "Snare Trap", cost: 35, cooldown: 8, range: 260 },
      { key: "3", id: "volley-mark", name: "Volley Mark", cost: 60, cooldown: 9, range: 480 },
    ],
  },
  mage: {
    id: "mage",
    name: "Purple Mage",
    title: "Moonveil Arcanist",
    weapon: "Lunar Staff",
    role: "Pressure enemies from range with magic missiles and lunar burst damage.",
    status: "Implemented",
    implemented: true,
    accent: "#b274e4",
    portraitUrl: purpleMagePortraitUrl,
    glyph: "M",
    stats: { health: 95, stamina: 95, meter: 120 },
    abilities: [
      { key: "1", id: "moonfall", name: "Moonfall", cost: 45, cooldown: 8.5, range: 560 },
    ],
  },
  thief: {
    id: "thief",
    name: "Thief",
    title: "Shadowglass Cutpurse",
    weapon: "Twin Daggers",
    role: "Stack bleed, evade through danger, expose weak points.",
    status: "Planned",
    implemented: false,
    accent: "#d28dff",
    glyph: "T",
    stats: { health: 105, stamina: 135, meter: 100 },
    abilities: [
      { key: "1", id: "hamstring", name: "Hamstring", cost: 25, cooldown: 3.8, range: 105 },
      { key: "2", id: "shadowstep", name: "Shadowstep", cost: 35, cooldown: 6.8, range: 300 },
      { key: "3", id: "expose-weakness", name: "Expose Weakness", cost: 55, cooldown: 8.5, range: 120 },
    ],
  },
  cleric: {
    id: "cleric",
    name: "Cleric",
    title: "Dawnroot Keeper",
    weapon: "Mace and Focus",
    role: "Apply radiant chains, recover through mistakes, protect long fights.",
    status: "Implemented",
    implemented: true,
    accent: "#fff0a8",
    glyph: "C",
    stats: { health: 125, stamina: 95, meter: 110 },
    abilities: [
      { key: "1", id: "radiant-brand", name: "Radiant Brand", cost: 25, cooldown: 3.8, range: 190 },
      { key: "2", id: "ward-pulse", name: "Ward Pulse", cost: 35, cooldown: 6.2, range: 220 },
      { key: "3", id: "judgment", name: "Judgment", cost: 55, cooldown: 7.8, range: 230 },
    ],
  },
};

export const characterOrder: ClassId[] = ["warrior", "ranger", "mage", "thief", "cleric"];
