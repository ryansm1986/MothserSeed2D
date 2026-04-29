export type Vec2 = { x: number; y: number };
export type FrameRect = { x: number; y: number; w: number; h: number };
export type SpriteBounds = { x: number; y: number; w: number; h: number };
export type SpriteFrame = { canvas: HTMLCanvasElement; w: number; h: number; bounds?: SpriteBounds };

export type DirectionName = "down" | "down_right" | "right" | "up_right" | "up" | "up_left" | "left" | "down_left";
export type CardinalDirectionName = "down" | "left" | "right" | "up";
export type AnimationName = "idle" | "walk" | "run" | "sprint" | "dodge_roll" | "attack1" | "attack2" | "damage" | "victory";
export type MonsterAnimationName = "idle" | "walk" | "run" | "rock_slam" | "rock_spray";
export type TelegraphKind = "rock_slam" | "rock_spray";
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
};

export type Ability = {
  key: string;
  id: string;
  name: string;
  cost: number;
  cooldown: number;
  range: number;
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
  abilities: Ability[];
};
