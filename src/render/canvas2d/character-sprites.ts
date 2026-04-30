import type { AnimationName, ClassId, DirectionName } from "../../game/types";
import type { PlayerSpriteSet, SpriteFrame } from "./types";
import { loadImage, makeImageFrame, mirrorFrameHorizontally } from "./sprite-loader";

const warriorFrameUrls = import.meta.glob([
  "../../../assets/characters/green_warrior_v4/idle/frames/idle_*_[0-9][0-9].png",
  "../../../assets/characters/green_warrior_v4/walk/frames/walk_*_[0-9][0-9].png",
  "../../../assets/characters/green_warrior_v4/sprint/frames/sprint_*_[0-9][0-9].png",
  "../../../assets/characters/green_warrior_v4/dodge/frames/dodge_*_[0-9][0-9].png",
  "../../../assets/characters/green_warrior_v4/attack/frames/attack_*_[0-9][0-9].png",
  "../../../assets/characters/green_warrior_v4/special/frames/special_*_[0-9][0-9].png",
], {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const purpleMageFrameUrls = import.meta.glob([
  "../../../assets/characters/purple_mage/idle/frames/idle_*_[0-9][0-9].png",
  "../../../assets/characters/purple_mage/walk/frames/walk_*_[0-9][0-9].png",
  "../../../assets/characters/purple_mage/walk_v2/frames/walk_v2_*_[0-9][0-9].png",
  "../../../assets/characters/purple_mage/sprint/frames/sprint_*_[0-9][0-9].png",
  "../../../assets/characters/purple_mage/dodge/frames/dodge_*_[0-9][0-9].png",
  "../../../assets/characters/purple_mage/attack/frames/attack_*_[0-9][0-9].png",
  "../../../assets/characters/purple_mage/special_cast/frames/special_cast_*_[0-9][0-9].png",
], {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

export const warriorDirections = ["down", "down_right", "right", "up_right", "up", "up_left", "left", "down_left"] as const satisfies readonly DirectionName[];

type FrameUrlResolution = {
  urls: string[];
  mirrorX?: boolean;
};

const purpleMageDirectionAssets: Record<DirectionName, string> = {
  down: "south",
  down_right: "southeast",
  right: "east",
  up_right: "northeast",
  up: "north",
  up_left: "northwest",
  left: "west",
  down_left: "southwest",
};

const purpleMageIdleDirectionFallbackAssets: Record<DirectionName, "south" | "east" | "north" | "west"> = {
  down: "south",
  down_right: "south",
  right: "east",
  up_right: "north",
  up: "north",
  up_left: "north",
  left: "west",
  down_left: "south",
};

const warriorAnimationPaths = {
  idle: "idle",
  walk: "walk",
  run: "sprint",
  sprint: "sprint",
  dodge_roll: "dodge",
  attack1: "attack",
  attack2: "special",
} as const satisfies Record<Exclude<AnimationName, "damage" | "victory">, string>;

const warriorSpecialDirectionFallbacks: Partial<Record<DirectionName, DirectionName>> = {
  down_left: "down",
  down_right: "down",
  up_left: "up",
  up_right: "up",
};

const warriorCardinalDirectionFallbacks: Partial<Record<DirectionName, DirectionName>> = {
  down_left: "down",
  down_right: "down",
  up_left: "up",
  up_right: "up",
};

export async function loadPlayerSprites(): Promise<Partial<Record<ClassId, PlayerSpriteSet>>> {
  const [warriorSprites, mageSprites] = await Promise.all([
    loadWarriorSprites(),
    loadPurpleMageSprites(),
  ]);

  return {
    warrior: warriorSprites,
    cleric: warriorSprites,
    mage: mageSprites,
  };
}

async function loadWarriorSprites(): Promise<PlayerSpriteSet> {
  const output = {} as PlayerSpriteSet;
  const animations = ["idle", "walk", "sprint", "dodge_roll", "attack1", "attack2"] as const satisfies readonly AnimationName[];

  await Promise.all(warriorDirections.map(async (direction) => {
    output[direction] = {} as Record<AnimationName, SpriteFrame[]>;
    await Promise.all(animations.map(async (animation) => {
      const urls = getWarriorFrameUrls(direction, animation);
      const frames = await Promise.all(urls.map(async (url) => makeImageFrame(await loadImage(url))));
      output[direction][animation] = animation === "idle" ? makePingPongFrames(frames) : frames;
    }));
    output[direction].run = output[direction].sprint;
    output[direction].damage = output[direction].idle;
    output[direction].victory = output[direction].idle;
  }));

  return output;
}

async function loadPurpleMageSprites(): Promise<PlayerSpriteSet> {
  const output = {} as PlayerSpriteSet;
  const animations = ["idle", "walk", "sprint", "dodge_roll", "attack1", "attack2"] as const satisfies readonly AnimationName[];

  await Promise.all(warriorDirections.map(async (direction) => {
    output[direction] = {} as Record<AnimationName, SpriteFrame[]>;
    await Promise.all(animations.map(async (animation) => {
      const source = getPurpleMageFrameSource(direction, animation);
      const frames = await Promise.all(source.urls.map(async (url) => makeImageFrame(await loadImage(url))));
      output[direction][animation] = source.mirrorX ? frames.map(mirrorFrameHorizontally) : frames;
    }));
    output[direction].run = output[direction].sprint;
    output[direction].damage = output[direction].idle;
    output[direction].victory = output[direction].idle;
  }));

  return output;
}

function makePingPongFrames<T>(frames: T[]): T[] {
  if (frames.length <= 2) return frames;
  return [...frames, ...frames.slice(1, -1).reverse()];
}

function getWarriorFrameUrls(direction: DirectionName, animation: AnimationName): string[] {
  if (animation === "damage" || animation === "victory") return [];

  const assetAnimation = warriorAnimationPaths[animation];
  const urls = findWarriorFrameUrls(assetAnimation, direction);

  if (urls.length > 0) return urls;

  if (animation === "walk") {
    const walkDirection = warriorCardinalDirectionFallbacks[direction];
    const walkFallbackUrls = walkDirection ? findWarriorFrameUrls("walk", walkDirection) : [];
    if (walkFallbackUrls.length > 0) {
      console.warn(`Missing green_warrior_v4 walk/${direction}; using ${walkDirection} four-direction walk frames.`);
      return walkFallbackUrls;
    }

    const sprintFallbackUrls = findWarriorFrameUrls("sprint", direction);
    if (sprintFallbackUrls.length > 0) {
      console.warn(`Missing green_warrior_v4 walk/${direction}; using sprint frames until that four-direction walk direction is exported.`);
      return sprintFallbackUrls;
    }
  }

  if (animation === "dodge_roll") {
    const dodgeDirection = warriorCardinalDirectionFallbacks[direction];
    const dodgeFallbackUrls = dodgeDirection ? findWarriorFrameUrls("dodge", dodgeDirection) : [];
    if (dodgeFallbackUrls.length > 0) {
      console.warn(`Missing green_warrior_v4 ${assetAnimation}/${direction}; using ${dodgeDirection} four-direction dodge frames.`);
      return dodgeFallbackUrls;
    }

    const fallbackUrls = findWarriorFrameUrls("sprint", direction);
    if (fallbackUrls.length > 0) {
      console.warn(`Missing green_warrior_v4 ${assetAnimation}/${direction}; using sprint frames until v4 dodge is exported.`);
      return fallbackUrls;
    }
  }

  if (animation === "attack1") {
    const attackDirection = warriorCardinalDirectionFallbacks[direction];
    const attackFallbackUrls = attackDirection ? findWarriorFrameUrls("attack", attackDirection) : [];
    if (attackFallbackUrls.length > 0) {
      console.warn(`Missing green_warrior_v4 ${assetAnimation}/${direction}; using ${attackDirection} four-direction attack frames.`);
      return attackFallbackUrls;
    }
  }

  if (animation === "sprint" || animation === "run") {
    const fallbackUrls = findWarriorFrameUrls("walk", direction);
    if (fallbackUrls.length > 0) {
      console.warn(`Missing green_warrior_v4 ${assetAnimation}/${direction}; using walk frames until that sprint direction is exported.`);
      return fallbackUrls;
    }
  }

  if (animation === "attack2") {
    const specialDirection = warriorSpecialDirectionFallbacks[direction];
    const specialFallbackUrls = specialDirection ? findWarriorFrameUrls("special", specialDirection) : [];
    if (specialFallbackUrls.length > 0) {
      console.warn(`Missing green_warrior_v4 ${assetAnimation}/${direction}; using ${specialDirection} special frames.`);
      return specialFallbackUrls;
    }

    const downSpecialUrls = findWarriorFrameUrls("special", "down");
    if (downSpecialUrls.length > 0) {
      console.warn(`Missing green_warrior_v4 ${assetAnimation}/${direction}; using down spinning special frames.`);
      return downSpecialUrls;
    }

    const fallbackUrls = findWarriorFrameUrls("attack", direction);
    if (fallbackUrls.length > 0) {
      console.warn(`Missing green_warrior_v4 ${assetAnimation}/${direction}; using attack frames until that special direction is exported.`);
      return fallbackUrls;
    }
  }

  throw new Error(`Missing green_warrior_v4 frames for ${direction}/${animation}. Expected canonical ${assetAnimation}_${direction}_NN.png files.`);
}

function findWarriorFrameUrls(assetAnimation: string, direction: DirectionName): string[] {
  const prefix = `/assets/characters/green_warrior_v4/${assetAnimation}/frames/${assetAnimation}_${direction}_`;
  return Object.entries(warriorFrameUrls)
    .filter(([path]) => path.includes(prefix) && /^\d{2}\.png$/.test(path.slice(path.lastIndexOf("_") + 1)))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, url]) => url);
}

function getPurpleMageFrameSource(direction: DirectionName, animation: AnimationName): FrameUrlResolution {
  const assetDirection = purpleMageDirectionAssets[direction];

  if (animation === "idle" || animation === "damage" || animation === "victory") {
    const directionalIdleUrls = findPurpleMageFrameUrls("idle", assetDirection);
    if (directionalIdleUrls.length > 0) return { urls: directionalIdleUrls };
    return { urls: findPurpleMageFrameUrls("idle", purpleMageIdleDirectionFallbackAssets[direction]) };
  }

  if (animation === "walk") {
    const walkV2Urls = findPurpleMageFrameUrls("walk_v2", assetDirection);
    if (walkV2Urls.length > 0) return { urls: walkV2Urls };
    return { urls: findPurpleMageFrameUrls("walk", assetDirection) };
  }

  if (animation === "sprint" || animation === "run") {
    const sprintUrls = findPurpleMageFrameUrls("sprint", assetDirection);
    if (sprintUrls.length > 0) return { urls: sprintUrls };
    if (assetDirection === "southwest") {
      const mirroredSoutheastUrls = findPurpleMageFrameUrls("sprint", "southeast");
      if (mirroredSoutheastUrls.length > 0) return { urls: mirroredSoutheastUrls, mirrorX: true };
    }
    const walkV2Urls = findPurpleMageFrameUrls("walk_v2", assetDirection);
    if (walkV2Urls.length > 0) return { urls: walkV2Urls };
    return { urls: findPurpleMageFrameUrls("walk", assetDirection) };
  }

  if (animation === "dodge_roll") {
    const dodgeUrls = findPurpleMageFrameUrls("dodge", assetDirection);
    if (dodgeUrls.length > 0) return { urls: dodgeUrls };
    return { urls: findPurpleMageFrameUrls("sprint", assetDirection) };
  }

  if (animation === "attack1") {
    return { urls: findPurpleMageFrameUrls("attack", assetDirection) };
  }

  if (animation === "attack2") {
    const specialCastUrls = findPurpleMageFrameUrls("special_cast", assetDirection);
    if (specialCastUrls.length > 0) return { urls: specialCastUrls };
    return { urls: findPurpleMageFrameUrls("attack", assetDirection) };
  }

  throw new Error(`Missing purple_mage frames for ${direction}/${animation}.`);
}

function findPurpleMageFrameUrls(assetAnimation: "idle" | "walk" | "walk_v2" | "sprint" | "dodge" | "attack" | "special_cast", assetDirection: string): string[] {
  const prefix = `/assets/characters/purple_mage/${assetAnimation}/frames/${assetAnimation}_${assetDirection}_`;
  return Object.entries(purpleMageFrameUrls)
    .filter(([path]) => path.includes(prefix) && /^\d{2}\.png$/.test(path.slice(path.lastIndexOf("_") + 1)))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, url]) => url);
}
