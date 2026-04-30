import rpgAssetsUrl from "../../../assets/RPGAssets.png?url";
import largeGrassTerrainUrl from "../../../assets/world/terrain/large_grass.png?url";
import dungeonTreeRoomUrl from "../../../assets/world/dungeon/tree/tree_base.png?url";
import magicMissileUrl from "../../../assets/characters/purple_mage/projectiles/magic_missile/magic_missile.png?url";
import moonfallUrl from "../../../assets/characters/purple_mage/spells/moonfall/moonfall.png?url";
import { worldAssetRects } from "../../game/content/world-assets";
import type { CardinalDirectionName, FrameRect, WorldAssetName } from "../../game/types";
import { loadMonsterSprites } from "./monster-sprites";
import { loadPlayerSprites } from "./character-sprites";
import type { AnimationFrameLookup, RenderAssets, SpriteBounds, SpriteFrame } from "./types";

const grassTerrainPropUrls = import.meta.glob("../../../assets/world/terrain/rpg_grass_source/props/*.png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const animatedGrassFrameUrls = import.meta.glob("../../../assets/world/grass/frames/*.png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const magicMissileFrameUrls = import.meta.glob("../../../assets/characters/purple_mage/projectiles/magic_missile/frames/magic_missile_left_[0-9][0-9].png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const moonfallFrameUrls = import.meta.glob("../../../assets/characters/purple_mage/spells/moonfall/frames/moonfall_[0-9][0-9].png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const enemyRockThrowFrameUrls = import.meta.glob("../../../assets/projectiles/boulder/boulder-rotate-[0-9].png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const poisonCloudFrameUrls = import.meta.glob("../../../assets/monsters/shroom_boy/projectiles/poison_cloud/frames/poison_cloud_[0-9][0-9].png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const shroomlingFrameUrls = import.meta.glob("../../../assets/monsters/shroom_boy/projectiles/tiny_waddle_chomp/frames/*/tiny_waddle_chomp_*_[0-9][0-9].png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const spinningHeadFrameUrls = import.meta.glob("../../../assets/monsters/tree_goblin/projectiles/spinning_head/frames/spinning_head_[0-9][0-9].png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const motherslashWaveFrameUrls = import.meta.glob(
  "../../../assets/characters/green_warrior_v4/special/special_effects/hollow_outer_pulse_padded_frames/circle_special_effect_hollow_outer_pulse_padded_[0-9][0-9].png",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
) as Record<string, string>;

export async function loadRenderAssets(): Promise<RenderAssets> {
  const [playerSprites, monsterSprites, worldFrames] = await Promise.all([
    loadPlayerSprites(),
    loadMonsterSprites(),
    loadWorldAndEffectAssets(),
  ]);

  return {
    playerSprites,
    monsterSprites,
    ...worldFrames,
  };
}

export function createAnimationFrameLookup(assets: RenderAssets): AnimationFrameLookup {
  return {
    playerFrameCount(classId, direction, animation) {
      return assets.playerSprites[classId]?.[direction][animation]?.length
        ?? assets.playerSprites.warrior?.[direction][animation]?.length
        ?? 1;
    },
    monsterFrameCount(monsterId, direction, animation) {
      return assets.monsterSprites[monsterId]?.[direction][animation]?.length
        ?? assets.monsterSprites.moss_golem?.[direction][animation]?.length
        ?? 1;
    },
    moonfallFrameCount() {
      return assets.moonfallFrames.length;
    },
  };
}

async function loadWorldAndEffectAssets(): Promise<Omit<RenderAssets, "playerSprites" | "monsterSprites">> {
  const image = await loadImage(rpgAssetsUrl);
  const grassImage = await loadImage(largeGrassTerrainUrl);
  const dungeonTreeRoomFrame = await loadImage(dungeonTreeRoomUrl).then(makeImageFrame);
  const worldAssets: Partial<Record<WorldAssetName, SpriteFrame>> = {};

  (Object.keys(worldAssetRects) as WorldAssetName[]).forEach((name) => {
    worldAssets[name] = makeTransparentFrame(image, worldAssetRects[name]);
  });

  const grassTerrainTile = makeImageFrame(grassImage);
  const grassTerrainProps = await loadFrameMap(grassTerrainPropUrls);
  const animatedGrassFrames = await Promise.all(
    Object.entries(animatedGrassFrameUrls)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(async ([, url]) => makeImageFrame(await loadImage(url))),
  );
  const magicMissileEntries = Object.entries(magicMissileFrameUrls)
    .sort(([left], [right]) => left.localeCompare(right));
  const moonfallEntries = Object.entries(moonfallFrameUrls)
    .sort(([left], [right]) => left.localeCompare(right));
  const enemyRockThrowEntries = Object.entries(enemyRockThrowFrameUrls)
    .sort(([left], [right]) => left.localeCompare(right));
  const poisonCloudEntries = Object.entries(poisonCloudFrameUrls)
    .sort(([left], [right]) => left.localeCompare(right));
  const shroomlingEntries = Object.entries(shroomlingFrameUrls)
    .sort(([left], [right]) => left.localeCompare(right));
  const spinningHeadEntries = Object.entries(spinningHeadFrameUrls)
    .sort(([left], [right]) => left.localeCompare(right));
  const motherslashWaveEntries = Object.entries(motherslashWaveFrameUrls)
    .sort(([left], [right]) => left.localeCompare(right));

  const [magicMissileFrames, moonfallFrames, enemyRockThrowFrames, poisonCloudFrames, shroomlingFrames, spinningHeadFrames, motherslashWaveFrames] = await Promise.all([
    magicMissileEntries.length > 0
      ? Promise.all(magicMissileEntries.map(([, url]) => loadImage(url).then(makeImageFrame)))
      : loadImage(magicMissileUrl).then(makeGreenScreenFrame).then((frame) => [frame]),
    moonfallEntries.length > 0
      ? Promise.all(moonfallEntries.map(([, url]) => loadImage(url).then(makeMoonfallFrame)))
      : loadImage(moonfallUrl).then(makeGreenScreenFrame).then((frame) => [frame]),
    Promise.all(enemyRockThrowEntries.map(([, url]) => loadImage(url).then(makeImageFrame))),
    Promise.all(poisonCloudEntries.map(([, url]) => loadImage(url).then(makeImageFrame))),
    loadDirectionalFrameMap(shroomlingEntries),
    Promise.all(spinningHeadEntries.map(([, url]) => loadImage(url).then(makeImageFrame))),
    Promise.all(motherslashWaveEntries.map(([, url]) => loadImage(url).then(makeImageFrame))),
  ]);

  return {
    worldAssets,
    dungeonTreeRoomFrame,
    grassTerrainTile,
    grassTerrainProps,
    animatedGrassFrames,
    magicMissileFrames,
    enemyRockThrowFrames,
    poisonCloudFrames,
    shroomlingFrames,
    spinningHeadFrames,
    moonfallFrames,
    motherslashWaveFrames,
  };
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load ${url}`));
    image.src = url;
  });
}

export function makeTransparentFrame(image: HTMLImageElement, frame: FrameRect): SpriteFrame {
  const buffer = document.createElement("canvas");
  buffer.width = frame.w;
  buffer.height = frame.h;
  const frameCtx = buffer.getContext("2d")!;

  frameCtx.drawImage(image, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);
  const pixels = frameCtx.getImageData(0, 0, frame.w, frame.h);
  let minX = frame.w;
  let minY = frame.h;
  let maxX = -1;
  let maxY = -1;

  for (let index = 0; index < pixels.data.length; index += 4) {
    const r = pixels.data[index];
    const g = pixels.data[index + 1];
    const b = pixels.data[index + 2];
    if (r > 242 && g > 242 && b > 242) {
      pixels.data[index + 3] = 0;
    } else {
      const pixelIndex = index / 4;
      const x = pixelIndex % frame.w;
      const y = Math.floor(pixelIndex / frame.w);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  frameCtx.putImageData(pixels, 0, 0);

  if (maxX < minX || maxY < minY) {
    return makeSpriteFrame(buffer);
  }

  const padding = 2;
  const trimmedX = Math.max(0, minX - padding);
  const trimmedY = Math.max(0, minY - padding);
  const trimmedW = Math.min(frame.w - trimmedX, maxX - trimmedX + 1 + padding);
  const trimmedH = Math.min(frame.h - trimmedY, maxY - trimmedY + 1 + padding);
  const trimmed = document.createElement("canvas");
  trimmed.width = trimmedW;
  trimmed.height = trimmedH;
  trimmed.getContext("2d")!.drawImage(buffer, trimmedX, trimmedY, trimmedW, trimmedH, 0, 0, trimmedW, trimmedH);

  return makeSpriteFrame(trimmed);
}

export function makeGreenScreenFrame(image: HTMLImageElement): SpriteFrame {
  const buffer = document.createElement("canvas");
  buffer.width = image.naturalWidth;
  buffer.height = image.naturalHeight;
  const frameCtx = buffer.getContext("2d")!;

  frameCtx.drawImage(image, 0, 0);
  const pixels = frameCtx.getImageData(0, 0, buffer.width, buffer.height);
  let minX = buffer.width;
  let minY = buffer.height;
  let maxX = -1;
  let maxY = -1;

  for (let index = 0; index < pixels.data.length; index += 4) {
    const r = pixels.data[index];
    const g = pixels.data[index + 1];
    const b = pixels.data[index + 2];
    const isGreenScreen = g > 150 && r < 100 && b < 120;
    if (isGreenScreen) {
      pixels.data[index + 3] = 0;
    } else {
      const pixelIndex = index / 4;
      const x = pixelIndex % buffer.width;
      const y = Math.floor(pixelIndex / buffer.width);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  frameCtx.putImageData(pixels, 0, 0);

  if (maxX < minX || maxY < minY) {
    return makeSpriteFrame(buffer);
  }

  const padding = 2;
  const trimmedX = Math.max(0, minX - padding);
  const trimmedY = Math.max(0, minY - padding);
  const trimmedW = Math.min(buffer.width - trimmedX, maxX - trimmedX + 1 + padding);
  const trimmedH = Math.min(buffer.height - trimmedY, maxY - trimmedY + 1 + padding);
  const trimmed = document.createElement("canvas");
  trimmed.width = trimmedW;
  trimmed.height = trimmedH;
  trimmed.getContext("2d")!.drawImage(buffer, trimmedX, trimmedY, trimmedW, trimmedH, 0, 0, trimmedW, trimmedH);

  return makeSpriteFrame(trimmed);
}

export function makeImageFrame(image: HTMLImageElement): SpriteFrame {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const frameCtx = canvas.getContext("2d")!;
  frameCtx.drawImage(image, 0, 0);
  return makeSpriteFrame(canvas);
}

export function makeSpriteFrame(canvas: HTMLCanvasElement): SpriteFrame {
  return { canvas, w: canvas.width, h: canvas.height, bounds: measureOpaqueBounds(canvas) };
}

export function measureOpaqueBounds(canvas: HTMLCanvasElement, alphaThreshold = 8): SpriteBounds | undefined {
  const frameCtx = canvas.getContext("2d", { willReadFrequently: true });
  if (!frameCtx) return undefined;
  const pixels = frameCtx.getImageData(0, 0, canvas.width, canvas.height);
  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const alpha = pixels.data[(y * canvas.width + x) * 4 + 3];
      if (alpha <= alphaThreshold) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) return undefined;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

export function makeMoonfallFrame(image: HTMLImageElement): SpriteFrame {
  const frame = makeImageFrame(image);
  const frameCtx = frame.canvas.getContext("2d")!;

  const pixels = frameCtx.getImageData(0, 0, frame.w, frame.h);

  for (let index = 0; index < pixels.data.length; index += 4) {
    const pixelIndex = index / 4;
    const y = Math.floor(pixelIndex / frame.w);
    const inGuideBand = y < 80 || y > frame.h - 80;
    const isWhiteGuide = pixels.data[index] > 220 && pixels.data[index + 1] > 220 && pixels.data[index + 2] > 220;

    if (inGuideBand && isWhiteGuide) {
      pixels.data[index + 3] = 0;
    }
  }

  frameCtx.putImageData(pixels, 0, 0);
  return makeSpriteFrame(frame.canvas);
}

export function mirrorFrameHorizontally(frame: SpriteFrame): SpriteFrame {
  const buffer = document.createElement("canvas");
  buffer.width = frame.w;
  buffer.height = frame.h;
  const bufferCtx = buffer.getContext("2d")!;
  bufferCtx.translate(frame.w, 0);
  bufferCtx.scale(-1, 1);
  bufferCtx.drawImage(frame.canvas, 0, 0);
  return makeSpriteFrame(buffer);
}

function assetNameFromPath(path: string): string {
  return path.split("/").pop()?.replace(/\.png$/, "") ?? path;
}

async function loadFrameMap(urls: Record<string, string>): Promise<Record<string, SpriteFrame>> {
  const frames: Record<string, SpriteFrame> = {};
  await Promise.all(Object.entries(urls).map(async ([path, url]) => {
    frames[assetNameFromPath(path)] = makeImageFrame(await loadImage(url));
  }));
  return frames;
}

async function loadDirectionalFrameMap(entries: [string, string][]): Promise<Partial<Record<CardinalDirectionName, SpriteFrame[]>>> {
  const groupedEntries: Partial<Record<CardinalDirectionName, [string, string][]>> = {};

  entries.forEach(([path, url]) => {
    const direction = path.match(/\/frames\/(south|north|east|west)\//)?.[1];
    if (!direction) return;
    const cardinalDirection = direction === "south"
      ? "down"
      : direction === "north"
        ? "up"
        : direction === "east"
          ? "right"
          : "left";
    groupedEntries[cardinalDirection] ??= [];
    groupedEntries[cardinalDirection]!.push([path, url]);
  });

  const frames: Partial<Record<CardinalDirectionName, SpriteFrame[]>> = {};
  await Promise.all((Object.keys(groupedEntries) as CardinalDirectionName[]).map(async (direction) => {
    const directionEntries = groupedEntries[direction]!.sort(([left], [right]) => left.localeCompare(right));
    frames[direction] = await Promise.all(directionEntries.map(([, url]) => loadImage(url).then(makeImageFrame)));
  }));

  return frames;
}
