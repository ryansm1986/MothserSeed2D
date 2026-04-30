import type { AnimationName, CardinalDirectionName, ClassId, DirectionName, MonsterAnimationName, MonsterId, WorldAssetName } from "../../game/types";

export type SpriteBounds = { x: number; y: number; w: number; h: number };
export type SpriteFrame = { canvas: HTMLCanvasElement; w: number; h: number; bounds?: SpriteBounds };

export type DrawProfile = {
  scale: number;
  anchorX: number;
  anchorY: number;
  baselineOffset: number;
  targetContentHeight?: number;
  minScale?: number;
};

export type PlayerSpriteSet = Record<DirectionName, Record<AnimationName, SpriteFrame[]>>;
export type MonsterSpriteSet = Record<DirectionName, Record<MonsterAnimationName, SpriteFrame[]>>;
export type MonsterSpriteCatalog = Record<MonsterId, MonsterSpriteSet>;

export type CameraState = {
  x: number;
  y: number;
  scale: number;
};

export type RenderAssets = {
  playerSprites: Partial<Record<ClassId, PlayerSpriteSet>>;
  monsterSprites: MonsterSpriteCatalog;
  worldAssets: Partial<Record<WorldAssetName, SpriteFrame>>;
  dungeonTreeRoomFrame: SpriteFrame | null;
  grassTerrainTile: SpriteFrame | null;
  grassTerrainProps: Record<string, SpriteFrame>;
  animatedGrassFrames: SpriteFrame[];
  magicMissileFrames: SpriteFrame[];
  enemyRockThrowFrames: SpriteFrame[];
  poisonCloudFrames: SpriteFrame[];
  shroomlingFrames: Partial<Record<CardinalDirectionName, SpriteFrame[]>>;
  spinningHeadFrames: SpriteFrame[];
  moonfallFrames: SpriteFrame[];
  motherslashWaveFrames: SpriteFrame[];
};

export type AnimationFrameLookup = {
  playerFrameCount(classId: ClassId, direction: DirectionName, animation: AnimationName): number;
  monsterFrameCount(monsterId: MonsterId, direction: DirectionName, animation: MonsterAnimationName): number;
  moonfallFrameCount(): number;
};

export type CanvasRenderer = {
  camera: CameraState;
  resize(): void;
  draw(state: import("../../game/state").GameState, delta: number): void;
};
