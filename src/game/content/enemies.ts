import type { MonsterAnimationName, MonsterId, TelegraphKind } from "../types";
import type { DrawProfile } from "../../render/canvas2d/types";

export const rootboundEliteName = "Rootbound Elite";

export type EnemyDefinition = {
  id: MonsterId;
  name: string;
  maxHealth: number;
  radius: number;
  moveSpeed: number;
  attackMap: Record<TelegraphKind, MonsterAnimationName>;
};

export const enemyRoster = [
  {
    id: "shroom_boy",
    name: "Deepcap Sporeling",
    maxHealth: 145,
    radius: 26,
    moveSpeed: 128,
    attackMap: {
      rock_slam: "rock_slam",
      rock_spray: "rock_spray",
      rock_throw: "rock_throw",
      spore_cloud: "rock_spray",
      shroom_toss: "rock_throw",
      bite: "bite",
      head_throw: "rock_throw",
      arm_attack: "rock_slam",
    },
  },
  {
    id: "tree_goblin",
    name: "Barkjaw Goblin",
    maxHealth: 165,
    radius: 28,
    moveSpeed: 150,
    attackMap: {
      rock_slam: "rock_slam",
      rock_spray: "rock_spray",
      rock_throw: "rock_throw",
      spore_cloud: "rock_spray",
      shroom_toss: "rock_throw",
      bite: "rock_slam",
      head_throw: "rock_throw",
      arm_attack: "rock_slam",
    },
  },
  {
    id: "moss_golem",
    name: rootboundEliteName,
    maxHealth: 220,
    radius: 34,
    moveSpeed: 108,
    attackMap: {
      rock_slam: "rock_slam",
      rock_spray: "rock_spray",
      rock_throw: "rock_throw",
      spore_cloud: "rock_spray",
      shroom_toss: "rock_throw",
      bite: "rock_slam",
      head_throw: "rock_throw",
      arm_attack: "rock_slam",
    },
  },
] as const satisfies readonly EnemyDefinition[];

export function enemyForRoom(roomIndex: number): EnemyDefinition {
  return enemyRoster[((roomIndex % enemyRoster.length) + enemyRoster.length) % enemyRoster.length];
}

export function enemiesForRoom(roomIndex: number): EnemyDefinition[] {
  if (roomIndex < enemyRoster.length) return [enemyRoster[Math.max(0, roomIndex)]];

  const pairIndex = roomIndex - enemyRoster.length;
  const first = pairIndex % enemyRoster.length;
  const second = (first + 1) % enemyRoster.length;
  return [enemyRoster[first], enemyRoster[second]];
}

export function getEnemyDefinition(id: MonsterId): EnemyDefinition {
  return enemyRoster.find((enemy) => enemy.id === id) ?? enemyRoster[0];
}

export const enemyAttackTimings = {
  rock_spray: {
    windup: 1.2,
    active: 0.4,
    recovery: 0.9,
  },
  rock_slam: {
    windup: 1.35,
    active: 0.45,
    recovery: 0.9,
  },
  rock_throw: {
    windup: 0.5,
    active: 0.02,
    recovery: 0.4,
  },
  spore_cloud: {
    windup: 0.65,
    active: 0.08,
    recovery: 0.45,
  },
  shroom_toss: {
    windup: 0.48,
    active: 0.08,
    recovery: 0.55,
  },
  bite: {
    windup: 0.28,
    active: 0.16,
    recovery: 0.38,
  },
  head_throw: {
    windup: 0.78,
    active: 0.08,
    recovery: 5.65,
  },
  arm_attack: {
    windup: 0.46,
    active: 0.18,
    recovery: 0.46,
  },
} as const satisfies Record<TelegraphKind, { windup: number; active: number; recovery: number }>;

export const mossGolemSpriteDraw = {
  v2Standard: {
    scale: 0.74,
    anchorX: 192,
    anchorY: 360,
    baselineOffset: 34,
  },
  v2Action: {
    scale: 0.48,
    anchorX: 576,
    anchorY: 1128,
    baselineOffset: 34,
  },
} as const satisfies Record<string, DrawProfile>;

export const enemySpriteDraw = {
  moss_golem: mossGolemSpriteDraw,
  tree_goblin: {
    standard: {
      scale: 1.46,
      anchorX: 64,
      anchorY: 120,
      baselineOffset: 22,
    },
    action: {
      scale: 0.5,
      anchorX: 192,
      anchorY: 360,
      baselineOffset: 22,
    },
  },
  shroom_boy: {
    standard: {
      scale: 1.5,
      anchorX: 64,
      anchorY: 120,
      baselineOffset: 22,
    },
    sprayAction: {
      scale: 0.96,
      anchorX: 192,
      anchorY: 375,
      baselineOffset: 22,
    },
    throwAction: {
      scale: 1.38,
      anchorX: 64,
      anchorY: 122,
      baselineOffset: 22,
    },
    biteAction: {
      scale: 1.5,
      anchorX: 64,
      anchorY: 120,
      baselineOffset: 22,
    },
  },
} as const satisfies Record<MonsterId, Record<string, DrawProfile>>;

export function getEnemyDrawProfile(monsterId: MonsterId, animation: MonsterAnimationName): DrawProfile {
  if (monsterId === "moss_golem") {
    return animation === "idle" || animation === "rock_slam" || animation === "rock_spray" || animation === "rock_throw"
      ? mossGolemSpriteDraw.v2Action
      : mossGolemSpriteDraw.v2Standard;
  }

  if (monsterId === "shroom_boy") {
    if (animation === "rock_spray" || animation === "rock_slam") return enemySpriteDraw.shroom_boy.sprayAction;
    if (animation === "rock_throw") return enemySpriteDraw.shroom_boy.throwAction;
    if (animation === "bite") return enemySpriteDraw.shroom_boy.biteAction;
    return enemySpriteDraw.shroom_boy.standard;
  }

  return animation === "rock_slam" || animation === "rock_spray" || animation === "rock_throw" || animation === "bite"
    ? enemySpriteDraw[monsterId].action
    : enemySpriteDraw[monsterId].standard;
}

export const golemAudio = {
  rockSlamCrashVolume: 0.82,
} as const;
