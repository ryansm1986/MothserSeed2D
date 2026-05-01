export type Vec2 = { x: number; y: number };
export type FrameRect = { x: number; y: number; w: number; h: number };

export type DirectionName = "down" | "down_right" | "right" | "up_right" | "up" | "up_left" | "left" | "down_left";
export type CardinalDirectionName = "down" | "left" | "right" | "up";
export type AnimationName = "idle" | "walk" | "run" | "sprint" | "dodge_roll" | "attack1" | "attack2" | "damage" | "victory";
export type MonsterAnimationName = "idle" | "walk" | "run" | "rock_slam" | "rock_spray" | "rock_throw" | "bite";
export type MonsterId = "moss_golem" | "tree_goblin" | "shroom_boy";
export type TelegraphKind =
  | "rock_slam"
  | "rock_spray"
  | "rock_throw"
  | "spore_cloud"
  | "shroom_toss"
  | "bite"
  | "head_throw"
  | "arm_attack";
export type CombatState = "idle" | "windup" | "active" | "recovery" | "dead";
export type PlayerLifeState = "alive" | "dead";

export type WorldAssetName =
  | "grassTile"
  | "mossTile"
  | "stoneTile"
  | "waterTile"
  | "oakTree"
  | "pineTree"
  | "bush"
  | "flowers"
  | "log"
  | "stump"
  | "rock"
  | "banner"
  | "tent"
  | "house"
  | "treeHouse"
  | "chest"
  | "barrel"
  | "crate"
  | "coin";

export type GearDrop = {
  name: string;
  rarity: "Common" | "Uncommon" | "Rare";
  power: number;
  ability: string;
  frame: FrameGear;
};

export type SpecialAbility = {
  key: string;
  id: string;
  name: string;
  cost: number;
  cooldown: number;
  range: number;
};

export type LatticeAbilityKind = "basic_attack_1" | "combo_attack" | "haste";

export type LatticeAbilityOption = {
  id: string;
  kind: LatticeAbilityKind;
  name: string;
  detail: string;
  glyph: string;
  range: number;
  baseCooldown: number;
  duration?: number;
};

export type FrameModifierOption = {
  id: string;
  name: string;
  detail: string;
  glyph: string;
  tone: "common" | "uncommon" | "rare";
};

export type FrameGear = {
  weaponSpecials: SpecialAbility[];
  latticeAbilityOptions: LatticeAbilityOption[];
  modifierOptions: FrameModifierOption[];
};

export type BranchLatticeState = {
  abilitySlotIds: Array<string | null>;
  modifierSlotIds: Array<string | null>;
  selectedAbilitySlot: number | null;
  selectedModifierSlot: number | null;
  isPreviewOpen: boolean;
};

export type AutoAttackLoopState = {
  currentSlotIndex: number;
  slotTimer: number;
  restartTimer: number;
  hasteTimer: number;
  hasteMultiplier: number;
  lastResolvedKind: LatticeAbilityKind | null;
};

export type ClassId = "warrior" | "ranger" | "mage" | "thief" | "cleric";

export type CharacterClass = {
  id: ClassId;
  name: string;
  title: string;
  weapon: string;
  role: string;
  status: "Implemented" | "Planned";
  implemented: boolean;
  accent: string;
  portraitUrl?: string;
  glyph: string;
  stats: {
    health: number;
    stamina: number;
    meter: number;
  };
  abilities: SpecialAbility[];
};
