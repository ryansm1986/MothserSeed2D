import type { DirectionName, MonsterAnimationName, MonsterId } from "../../game/types";
import { loadImage, makeImageFrame } from "./sprite-loader";
import type { MonsterSpriteCatalog, MonsterSpriteSet } from "./types";
import { warriorDirections } from "./character-sprites";

const monsterFrameUrls = import.meta.glob([
  "../../../assets/monsters/moss_golem_v2/*/frames/*.png",
  "../../../assets/monsters/tree_goblin/*/frames/*.png",
  "../../../assets/monsters/tree_goblin/*/frames/*/*.png",
  "../../../assets/monsters/shroom_boy/*/frames/*.png",
], {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const monsterSubjects = {
  moss_golem: "moss_golem_v2",
  tree_goblin: "tree_goblin",
  shroom_boy: "shroom_boy",
} as const satisfies Record<MonsterId, string>;

export async function loadMonsterSprites(): Promise<MonsterSpriteCatalog> {
  const catalog = {} as MonsterSpriteCatalog;
  const animations = ["idle", "walk", "run", "rock_slam", "rock_spray", "rock_throw", "bite"] as const satisfies readonly MonsterAnimationName[];

  await Promise.all((Object.keys(monsterSubjects) as MonsterId[]).map(async (monsterId) => {
    const output = {} as MonsterSpriteSet;
    await Promise.all(warriorDirections.map(async (direction) => {
      output[direction] = {} as Record<MonsterAnimationName, ReturnType<typeof makeImageFrame>[]>;
      await Promise.all(animations.map(async (animation) => {
        const urls = getMonsterFrameUrls(monsterId, direction, animation);
        output[direction][animation] = await Promise.all(urls.map(async (url) => makeImageFrame(await loadImage(url))));
      }));
    }));
    catalog[monsterId] = output;
  }));

  return catalog;
}

function getMonsterFrameUrls(monsterId: MonsterId, direction: DirectionName, animation: MonsterAnimationName): string[] {
  if (monsterId === "moss_golem") return getMossGolemFrameUrls(direction, animation);

  const animationCandidates = monsterAnimationCandidates(monsterId, animation);
  for (const assetAnimation of animationCandidates) {
    const urls = findMonsterV2FrameUrls(monsterSubjects[monsterId], assetAnimation, direction);
    if (urls.length > 0) return urls;
  }

  return getMossGolemFrameUrls(direction, animation);
}

function getMossGolemFrameUrls(direction: DirectionName, animation: MonsterAnimationName): string[] {
  const animationCandidates = animation === "idle"
    ? ["idle_v2"]
    : animation === "run"
      ? ["run", "walk"]
      : animation === "bite"
        ? ["rock_slam"]
      : [animation];

  for (const assetAnimation of animationCandidates) {
    const urls = findMonsterV2FrameUrls("moss_golem_v2", assetAnimation, direction);
    if (urls.length > 0) return urls;
  }

  throw new Error(`Missing exported moss_golem_v2 frames for ${direction}/${animation}.`);
}

function monsterAnimationCandidates(monsterId: MonsterId, animation: MonsterAnimationName): string[] {
  if (animation === "idle") return ["idle"];
  if (animation === "walk" || animation === "run") return ["walk", "idle"];
  if (monsterId === "tree_goblin") {
    if (animation === "rock_throw") return ["head_throw", "attack"];
    return ["attack"];
  }
  if (monsterId === "shroom_boy" && animation === "rock_throw") return ["mouth_throw", "poison_spray"];
  if (monsterId === "shroom_boy" && animation === "bite") return ["bite", "poison_spray"];
  if (animation === "rock_spray") return ["poison_spray"];
  return ["poison_spray", "walk", "idle"];
}

function findMonsterV2FrameUrls(subject: string, animation: string, direction: DirectionName): string[] {
  const candidates = animation === "rock_spray"
    ? [compassDirectionFor(direction), direction]
    : animation === "rock_throw" || animation === "mouth_throw"
      ? [direction, compassDirectionFor(direction), cardinalCompassDirectionFor(direction)]
      : animation === "bite"
        ? [direction, compassDirectionFor(direction), cardinalCompassDirectionFor(direction)]
    : [direction, compassDirectionFor(direction)];

  for (const candidate of new Set(candidates)) {
    const urls = findMonsterFrameUrls(subject, animation, candidate);
    if (urls.length > 0) return urls;
  }

  return [];
}

function findMonsterFrameUrls(subject: string, animation: string, direction: string): string[] {
  const prefixes = [
    `/assets/monsters/${subject}/${animation}/frames/${animation}_${direction}_`,
    `/assets/monsters/${subject}/${animation}/frames/${animation}_v2_${direction}_`,
    `/assets/monsters/${subject}/${animation}/frames/${direction}/${animation}_${direction}_`,
    `/assets/monsters/${subject}/${animation}/frames/${direction}/${animation}_v2_${direction}_`,
  ];
  return Object.entries(monsterFrameUrls)
    .filter(([path]) => prefixes.some((prefix) => path.includes(prefix)) && /^\d{2}\.png$/.test(path.slice(path.lastIndexOf("_") + 1)))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, url]) => url);
}

export function compassDirectionFor(direction: DirectionName): string {
  if (direction === "down") return "south";
  if (direction === "down_right") return "southeast";
  if (direction === "right") return "east";
  if (direction === "up_right") return "northeast";
  if (direction === "up") return "north";
  if (direction === "up_left") return "northwest";
  if (direction === "left") return "west";
  return "southwest";
}

function cardinalCompassDirectionFor(direction: DirectionName): string {
  if (direction === "left") return "west";
  if (direction === "right") return "east";
  if (direction === "up" || direction === "up_left" || direction === "up_right") return "north";
  return "south";
}
