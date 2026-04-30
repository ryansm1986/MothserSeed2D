import { getEnemyDrawProfile } from "../../game/content/enemies";
import {
  animatedGrassTufts,
  groveClearings,
  grovePathRoutes,
  terrainOverlays,
  world,
} from "../../game/world/arena";
import { allEnemies, type EnemyState, type GameState, type Obstacle } from "../../game/state";
import type { AnimationName, DirectionName, MonsterAnimationName, Vec2, WorldAssetName } from "../../game/types";
import {
  magicMissileAnimationRate,
  magicMissileForwardRotation,
  magicMissileLifetime,
  enemyRockThrowAnimationRate,
  motherslashWaveAnimationRate,
  motherslashWaveRadius,
  moonfallFrameScale,
  moonfallImpactDuration,
  shroomlingAnimationRate,
  treeGoblinHeadAnimationRate,
} from "../../game/combat/projectiles";
import type { CanvasRenderer, DrawProfile, RenderAssets, SpriteFrame } from "./types";
import { createCamera, resizeCanvas, updateCamera } from "./camera";

const warriorSpriteDraw = {
  standard: {
    scale: 0.67,
    anchorX: 96,
    anchorY: 181,
    baselineOffset: 28,
  },
  wideAction: {
    scale: 0.8,
    anchorX: 96,
    anchorY: 181,
    baselineOffset: 28,
  },
};

const purpleMageSpriteDraw = {
  standard: {
    scale: 0.98,
    anchorX: 64,
    anchorY: 118,
    baselineOffset: 28,
    targetContentHeight: 120,
  },
  wideAction: {
    scale: 0.98,
    anchorX: 96,
    anchorY: 140,
    baselineOffset: 28,
    targetContentHeight: 120,
  },
  dodge: {
    scale: 0.54,
    anchorX: 128,
    anchorY: 241,
    baselineOffset: 28,
    targetContentHeight: 112,
  },
  specialCast: {
    scale: 0.68,
    anchorX: 160,
    anchorY: 298,
    baselineOffset: 28,
  },
};

export function createCanvasRenderer(canvas: HTMLCanvasElement, assets: RenderAssets): CanvasRenderer {
  const canvasContext = canvas.getContext("2d", { alpha: false });

  if (!canvasContext) {
    throw new Error("Canvas 2D rendering is unavailable");
  }

  const ctx: CanvasRenderingContext2D = canvasContext;
  const camera = createCamera();

  function resize() {
    resizeCanvas(canvas, ctx, camera);
  }

  function draw(state: GameState, delta: number) {
    updateCamera(camera, state, delta);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.save();
    ctx.scale(camera.scale, camera.scale);
    ctx.translate(-camera.x, -camera.y);

    drawWorld(ctx, assets);
    allEnemies(state).forEach((enemy) => drawTelegraph(ctx, enemy));
    drawMagicMissiles(ctx, state, assets);

    const drawables = [
      ...allEnemies(state).map((enemy) => ({
        y: enemy.y,
        draw: () => drawEnemy(ctx, state, enemy, assets, state.enemy === enemy),
      })),
      { y: state.player.y, draw: () => drawPlayer(ctx, state, assets) },
    ].sort((a, b) => a.y - b.y);

    drawables.forEach((item) => item.draw());
    drawEnemyRockThrows(ctx, state, assets);
    drawShroomSporeClouds(ctx, state, assets);
    drawShroomlings(ctx, state, assets);
    drawTreeGoblinHeads(ctx, state, assets);
    drawMotherslashWaves(ctx, state, assets);
    drawMoonfallStrikes(ctx, state, assets);
    drawLoot(ctx, state, assets);

    ctx.restore();
  }

  return {
    camera,
    resize,
    draw,
  };
}

function drawWorld(ctx: CanvasRenderingContext2D, assets: RenderAssets) {
  if (assets.dungeonTreeRoomFrame) {
    drawDungeonTreeRoom(ctx, assets.dungeonTreeRoomFrame);
    return;
  }

  drawTileGround(ctx, assets);
}

function drawDungeonTreeRoom(ctx: CanvasRenderingContext2D, frame: SpriteFrame) {
  ctx.save();
  ctx.fillStyle = "#050403";
  ctx.fillRect(0, 0, world.width, world.height);
  ctx.drawImage(frame.canvas, 0, 0, world.width, world.height);
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.beginPath();
  ctx.rect(0, 0, world.width, world.height);
  drawWalkableBoundaryPath(ctx, -8);
  ctx.fill("evenodd");
  ctx.restore();
}

function drawTileGround(ctx: CanvasRenderingContext2D, assets: RenderAssets) {
  const grassTexture = assets.grassTerrainTile ?? assets.worldAssets.grassTile;
  if (!grassTexture) {
    ctx.fillStyle = "#6b8f32";
    ctx.fillRect(0, 0, world.width, world.height);
    return;
  }

  drawLargeGrassLayer(ctx, grassTexture);
  drawGroveClearings(ctx);
  drawGrassPathNetwork(ctx);
  drawTerrainPropLayer(ctx, assets);
  drawAnimatedGrassLayer(ctx, assets);
  drawArenaBoundaryShade(ctx);
}

function drawLargeGrassLayer(ctx: CanvasRenderingContext2D, grassTexture: SpriteFrame) {
  ctx.save();
  ctx.fillStyle = "#7fac38";
  ctx.fillRect(0, 0, world.width, world.height);

  for (let y = 0; y < world.height; y += grassTexture.h) {
    for (let x = 0; x < world.width; x += grassTexture.w) {
      ctx.drawImage(grassTexture.canvas, x, y, grassTexture.w + 1, grassTexture.h + 1);
    }
  }

  ctx.globalAlpha = 0.18;
  ctx.globalCompositeOperation = "multiply";
  for (let index = 0; index < 20; index += 1) {
    const angle = index * 2.399963;
    const radius = 130 + ((index * 127) % 620);
    const x = world.center.x + Math.cos(angle) * radius;
    const y = world.center.y + Math.sin(angle) * radius * 0.72;
    ctx.fillStyle = index % 3 === 0 ? "#5e7330" : "#446038";
    ctx.beginPath();
    ctx.ellipse(x, y, 95 + (index % 4) * 25, 44 + (index % 5) * 14, angle * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawGroveClearings(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  groveClearings.forEach((clearing) => {
    ctx.globalAlpha = clearing.alpha;
    ctx.fillStyle = "#b7c95a";
    ctx.beginPath();
    ctx.ellipse(clearing.x, clearing.y, clearing.rx, clearing.ry, clearing.rotation, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawGrassPathNetwork(ctx: CanvasRenderingContext2D) {
  grovePathRoutes.forEach((route, index) => {
    drawSoftRoute(ctx, route, 118 - index * 12, "rgba(55, 72, 28, 0.24)");
    drawSoftRoute(ctx, route, 72 - index * 8, "rgba(151, 164, 68, 0.19)");
    drawSoftRoute(ctx, route, 22, "rgba(232, 221, 126, 0.09)");
  });
}

function drawSoftRoute(ctx: CanvasRenderingContext2D, points: Vec2[], width: number, strokeStyle: string) {
  if (points.length < 2) return;

  ctx.save();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    ctx.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
  }

  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
  ctx.stroke();
  ctx.restore();
}

function drawArenaBoundaryShade(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.fillStyle = "rgba(6, 16, 11, 0.32)";
  ctx.beginPath();
  ctx.rect(0, 0, world.width, world.height);
  drawWalkableBoundaryPath(ctx, -8);
  ctx.fill("evenodd");

  ctx.strokeStyle = "rgba(223, 215, 127, 0.2)";
  ctx.lineWidth = 7;
  ctx.setLineDash([28, 24]);
  ctx.beginPath();
  drawWalkableBoundaryPath(ctx, -18);
  ctx.stroke();
  ctx.restore();
}

function drawWalkableBoundaryPath(ctx: CanvasRenderingContext2D, inset = 0) {
  const points = world.walkableBoundary;
  if (points.length === 0) return;

  ctx.moveTo(points[0].x, points[0].y + inset);
  for (let index = 1; index < points.length; index += 1) {
    const current = points[index];
    const previous = points[index - 1];
    const midX = (previous.x + current.x) / 2;
    const midY = (previous.y + current.y) / 2 + inset;
    ctx.quadraticCurveTo(previous.x, previous.y + inset, midX, midY);
  }
  const last = points[points.length - 1];
  const first = points[0];
  ctx.quadraticCurveTo(last.x, last.y + inset, (last.x + first.x) / 2, (last.y + first.y) / 2 + inset);
  ctx.quadraticCurveTo(first.x, first.y + inset, first.x, first.y + inset);
  ctx.closePath();
}

function drawTerrainPropLayer(ctx: CanvasRenderingContext2D, assets: RenderAssets) {
  terrainOverlays.forEach((overlay) => {
    const prop = assets.grassTerrainProps[overlay.kind];
    if (!prop) return;
    drawTerrainProp(ctx, prop, overlay.x, overlay.y, overlay.scale, overlay.alpha);
  });
}

function drawAnimatedGrassLayer(ctx: CanvasRenderingContext2D, assets: RenderAssets) {
  if (assets.animatedGrassFrames.length === 0) return;
  const currentFrame = Math.floor(performance.now() / 120);
  animatedGrassTufts.forEach((tuft) => {
    const frame = assets.animatedGrassFrames[(currentFrame + tuft.phase) % assets.animatedGrassFrames.length];
    drawTerrainProp(ctx, frame, tuft.x, tuft.y, tuft.scale, 0.5);
  });
}

function drawTerrainProp(ctx: CanvasRenderingContext2D, prop: SpriteFrame, x: number, y: number, scale: number, alpha: number) {
  const width = prop.w * scale;
  const height = prop.h * scale;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(prop.canvas, x - width / 2, y - height, width, height);
  ctx.restore();
}

function drawTelegraph(ctx: CanvasRenderingContext2D, enemy: EnemyState) {
  if (enemy.state !== "windup" && enemy.state !== "active") return;

  const active = enemy.state === "active";
  ctx.save();
  ctx.globalAlpha = active ? 0.58 : 0.34;
  ctx.fillStyle = active ? "#ff4f3e" : "#f2d36b";
  ctx.strokeStyle = active ? "#ffd0c8" : "#fff0a8";
  ctx.lineWidth = 3;

  if (enemy.currentAttack === "spore_cloud") {
    ctx.fillStyle = active ? "rgba(126, 229, 101, 0.48)" : "rgba(188, 245, 112, 0.32)";
    ctx.strokeStyle = active ? "#d9ff90" : "#f4ffb8";
    ctx.beginPath();
    ctx.ellipse(enemy.x + enemy.attackForward.x * 78, enemy.y + enemy.attackForward.y * 52, 78, 46, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (enemy.currentAttack === "bite") {
    const angle = Math.atan2(enemy.attackForward.y, enemy.attackForward.x);
    const spread = Math.PI * 0.56;
    ctx.beginPath();
    ctx.moveTo(enemy.x, enemy.y);
    ctx.arc(enemy.x, enemy.y, 106, angle - spread / 2, angle + spread / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (enemy.currentAttack === "arm_attack") {
    const angle = Math.atan2(enemy.attackForward.y, enemy.attackForward.x);
    const spread = Math.PI * 0.72;
    ctx.beginPath();
    ctx.moveTo(enemy.x, enemy.y);
    ctx.arc(enemy.x, enemy.y, 168, angle - spread / 2, angle + spread / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (enemy.currentAttack === "head_throw") {
    ctx.fillStyle = active ? "rgba(244, 132, 82, 0.42)" : "rgba(242, 211, 107, 0.24)";
    ctx.strokeStyle = active ? "#ffd0c8" : "#fff0a8";
    ctx.setLineDash([12, 9]);
    ctx.beginPath();
    ctx.ellipse(enemy.x + enemy.attackForward.x * 96, enemy.y + enemy.attackForward.y * 58, 118, 58, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (enemy.currentAttack === "rock_slam") {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 155, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (enemy.currentAttack === "rock_spray") {
    const angle = Math.atan2(enemy.attackForward.y, enemy.attackForward.x);
    const spread = Math.PI * 0.68;
    ctx.beginPath();
    ctx.moveTo(enemy.x, enemy.y);
    ctx.arc(enemy.x, enemy.y, 260, angle - spread / 2, angle + spread / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    const angle = Math.atan2(enemy.attackForward.y, enemy.attackForward.x);
    ctx.translate(enemy.x + enemy.attackForward.x * 185, enemy.y + enemy.attackForward.y * 185);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.roundRect(-185, -18, 370, 36, 18);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawShroomSporeClouds(ctx: CanvasRenderingContext2D, state: GameState, assets: RenderAssets) {
  state.combat.shroomSporeClouds.forEach((cloud) => {
    const age = cloud.timer / cloud.duration;
    const wobble = Math.sin(cloud.timer * 5.2) * 6;
    const frame = assets.poisonCloudFrames[
      Math.floor(cloud.timer / 0.12) % Math.max(assets.poisonCloudFrames.length, 1)
    ];

    if (frame) {
      const bounds = frame.bounds ?? { x: 0, y: 0, w: frame.w, h: frame.h };
      const scale = ((cloud.radius + wobble) * 2.15) / Math.max(bounds.w, bounds.h, 1);
      const anchorX = bounds.x + bounds.w / 2;
      const anchorY = bounds.y + bounds.h / 2;

      ctx.save();
      ctx.globalAlpha = Math.max(0, 0.92 * (1 - age * 0.22));
      ctx.shadowColor = "rgba(196, 234, 84, 0.58)";
      ctx.shadowBlur = 16;
      ctx.drawImage(
        frame.canvas,
        cloud.x - anchorX * scale,
        cloud.y - 18 - anchorY * scale,
        frame.w * scale,
        frame.h * scale,
      );
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0, 0.48 * (1 - age * 0.35));
    ctx.fillStyle = "#7ee565";
    ctx.strokeStyle = "#d9ff90";
    ctx.lineWidth = 3;
    ctx.shadowColor = "rgba(126, 229, 101, 0.62)";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.ellipse(cloud.x, cloud.y - 18, cloud.radius + wobble, cloud.radius * 0.55, 0.12, 0, Math.PI * 2);
    ctx.ellipse(cloud.x - 28, cloud.y - 26, cloud.radius * 0.58, cloud.radius * 0.38, -0.34, 0, Math.PI * 2);
    ctx.ellipse(cloud.x + 30, cloud.y - 28, cloud.radius * 0.52, cloud.radius * 0.34, 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
}

function drawShroomlings(ctx: CanvasRenderingContext2D, state: GameState, assets: RenderAssets) {
  state.combat.shroomlings.forEach((shroomling) => {
    const tossProgress = Math.min(shroomling.timer / shroomling.tossDuration, 1);
    const lift = shroomling.timer < shroomling.tossDuration ? Math.sin(tossProgress * Math.PI) * 54 : 0;
    const frames = assets.shroomlingFrames[shroomling.direction] ?? assets.shroomlingFrames.down ?? [];
    const frame = frames[Math.floor(shroomling.timer / shroomlingAnimationRate) % Math.max(frames.length, 1)];
    drawShadow(ctx, shroomling.x, shroomling.y + 8, 18, 8, 0.24);

    if (frame) {
      const bounds = frame.bounds ?? { x: 0, y: 0, w: frame.w, h: frame.h };
      const scale = 48 / Math.max(bounds.w, bounds.h, 1);
      const anchorX = bounds.x + bounds.w / 2;
      const anchorY = bounds.y + bounds.h / 2;
      ctx.save();
      ctx.drawImage(
        frame.canvas,
        shroomling.x - anchorX * scale,
        shroomling.y - lift - 18 - anchorY * scale,
        frame.w * scale,
        frame.h * scale,
      );
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.translate(shroomling.x, shroomling.y - lift);
    ctx.fillStyle = "#c65579";
    ctx.strokeStyle = "#31141f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, -14, 20, 13, 0, Math.PI, Math.PI * 2);
    ctx.lineTo(15, -8);
    ctx.lineTo(-15, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#f1d6d1";
    ctx.strokeStyle = "#31141f";
    ctx.beginPath();
    ctx.roundRect(-8, -8, 16, 24, 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
}

function drawTreeGoblinHeads(ctx: CanvasRenderingContext2D, state: GameState, assets: RenderAssets) {
  state.combat.treeGoblinHeads.forEach((head) => {
    const progress = Math.min(head.timer / head.duration, 1);
    const frame = assets.spinningHeadFrames[
      Math.floor(head.timer / treeGoblinHeadAnimationRate) % Math.max(assets.spinningHeadFrames.length, 1)
    ];

    drawShadow(ctx, head.x, head.y + 18, 24, 9, 0.24);
    ctx.save();
    ctx.globalAlpha = Math.max(0.2, 1 - Math.max(0, progress - 0.86) / 0.14);
    ctx.translate(head.x, head.y - 20);
    ctx.rotate(head.timer * 5.25);

    if (frame) {
      const bounds = frame.bounds ?? { x: 0, y: 0, w: frame.w, h: frame.h };
      const scale = 62 / Math.max(bounds.w, bounds.h, 1);
      const anchorX = bounds.x + bounds.w / 2;
      const anchorY = bounds.y + bounds.h / 2;
      ctx.drawImage(frame.canvas, -anchorX * scale, -anchorY * scale, frame.w * scale, frame.h * scale);
    } else {
      ctx.fillStyle = "#815332";
      ctx.strokeStyle = "#2a1710";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, 20, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  });
}

function drawMagicMissiles(ctx: CanvasRenderingContext2D, state: GameState, assets: RenderAssets) {
  state.combat.magicMissiles.forEach((missile) => {
    ctx.save();
    ctx.translate(missile.x, missile.y);
    ctx.rotate(missile.rotation + magicMissileForwardRotation);

    const animationAge = magicMissileLifetime - missile.ttl;
    const frame = assets.magicMissileFrames[Math.floor(animationAge / magicMissileAnimationRate) % assets.magicMissileFrames.length];
    if (frame) {
      const scale = 58 / Math.max(frame.w, 1);
      const width = frame.w * scale;
      const height = frame.h * scale;
      ctx.shadowColor = "rgba(127, 200, 255, 0.72)";
      ctx.shadowBlur = 18;
      ctx.drawImage(frame.canvas, -width * 0.5, -height * 0.5, width, height);
    } else {
      ctx.fillStyle = "#7fc8ff";
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });
}

function drawEnemyRockThrows(ctx: CanvasRenderingContext2D, state: GameState, assets: RenderAssets) {
  state.combat.enemyRockThrows.forEach((projectile) => {
    const progress = Math.min(projectile.timer / projectile.duration, 1);
    const lift = Math.sin(progress * Math.PI) * 88;
    const frame = assets.enemyRockThrowFrames[
      Math.floor(projectile.timer / enemyRockThrowAnimationRate) % Math.max(assets.enemyRockThrowFrames.length, 1)
    ];

    drawShadow(ctx, projectile.x, projectile.y + 10, 26 - lift * 0.08, 10 - lift * 0.035, 0.25);

    ctx.save();
    ctx.translate(projectile.x, projectile.y - 34 - lift);
    ctx.rotate(projectile.rotation);

    if (frame) {
      const bounds = frame.bounds ?? { x: 0, y: 0, w: frame.w, h: frame.h };
      const scale = 60 / Math.max(bounds.w, bounds.h, 1);
      const width = frame.w * scale;
      const height = frame.h * scale;
      ctx.drawImage(frame.canvas, -width / 2, -height / 2, width, height);
    } else {
      ctx.fillStyle = "#6f644c";
      ctx.strokeStyle = "#2e291f";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 18, 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  });
}

function drawMotherslashWaves(ctx: CanvasRenderingContext2D, state: GameState, assets: RenderAssets) {
  state.combat.motherslashWaves.forEach((wave) => {
    if (wave.timer < 0) return;

    const progress = Math.min(wave.timer / wave.duration, 1);
    const radius = motherslashWaveRadius(wave);
    const frameCount = assets.motherslashWaveFrames.length;
    const frameIndex = frameCount > 0
      ? Math.min(frameCount - 1, Math.floor(wave.timer / motherslashWaveAnimationRate))
      : -1;
    const frame = frameIndex >= 0 ? assets.motherslashWaveFrames[frameIndex] : null;
    const fadeOut = progress > 0.72 ? 1 - (progress - 0.72) / 0.28 : 1;
    const pulseAlpha = Math.max(0, Math.min(1, fadeOut)) * 0.88;

    ctx.save();
    ctx.globalAlpha = pulseAlpha;
    ctx.translate(wave.x, wave.y + 8);

    if (frame) {
      const bounds = frame.bounds ?? { x: 0, y: 0, w: frame.w, h: frame.h };
      const scale = (radius * 2.06) / Math.max(bounds.w, 1);
      const anchorX = bounds.x + bounds.w / 2;
      const anchorY = bounds.y + bounds.h / 2;
      ctx.shadowColor = "rgba(110, 255, 185, 0.62)";
      ctx.shadowBlur = 18;
      ctx.drawImage(frame.canvas, -anchorX * scale, -anchorY * scale, frame.w * scale, frame.h * scale);
    } else {
      ctx.strokeStyle = "rgba(119, 255, 194, 0.82)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius, radius * 0.42, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  });
}

function drawMoonfallStrikes(ctx: CanvasRenderingContext2D, state: GameState, assets: RenderAssets) {
  state.combat.moonfallStrikes.forEach((strike) => {
    const progress = Math.min(strike.timer / strike.duration, 1);
    const eased = progress * progress * (3 - 2 * progress);
    const moonY = strike.startY + (strike.targetY - 38 - strike.startY) * eased;
    const impactProgress = strike.impacted ? Math.min((strike.timer - strike.duration * 0.78) / moonfallImpactDuration, 1) : 0;

    ctx.save();
    ctx.globalAlpha = 0.2 + progress * 0.34;
    ctx.strokeStyle = "#d9bbff";
    ctx.lineWidth = 4;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.ellipse(strike.x, strike.targetY + 8, strike.radius, strike.radius * 0.38, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    if (impactProgress > 0) {
      ctx.save();
      ctx.globalAlpha = 1 - impactProgress;
      ctx.strokeStyle = "#fff0a8";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(strike.x, strike.targetY + 8, strike.radius * impactProgress, strike.radius * 0.38 * impactProgress, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (assets.moonfallFrames.length > 1) {
      const frameIndex = Math.min(assets.moonfallFrames.length - 1, Math.floor(progress * assets.moonfallFrames.length));
      const frame = assets.moonfallFrames[frameIndex];
      const scale = moonfallFrameScale;
      const width = frame.w * scale;
      const height = frame.h * scale;
      const anchorX = frame.w / 2;
      const anchorY = frame.h * 0.68;
      ctx.save();
      ctx.translate(strike.x, strike.targetY);
      ctx.shadowColor = "rgba(217, 187, 255, 0.82)";
      ctx.shadowBlur = 26;
      ctx.drawImage(frame.canvas, -anchorX * scale, -anchorY * scale, width, height);
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.translate(strike.x, moonY);
    ctx.rotate(-0.18 + progress * 0.46);
    if (assets.moonfallFrames[0]) {
      const frame = assets.moonfallFrames[0];
      const scale = ((150 + progress * 18) * 1.2) / Math.max(frame.w, 1);
      const width = frame.w * scale;
      const height = frame.h * scale;
      ctx.shadowColor = "rgba(217, 187, 255, 0.82)";
      ctx.shadowBlur = 26;
      ctx.drawImage(frame.canvas, -width / 2, -height / 2, width, height);
    } else {
      ctx.fillStyle = "#d9bbff";
      ctx.beginPath();
      ctx.arc(0, 0, 54, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
}

function drawPlayer(ctx: CanvasRenderingContext2D, state: GameState, assets: RenderAssets) {
  drawShadow(ctx, state.player.x, state.player.y + 18, 52, 20, 0.34);

  const frames = activePlayerSpriteSet(state, assets)?.[state.player.direction][state.player.anim];
  const frame = frames?.[state.player.animFrame % frames.length];
  if (!frame) return;

  const drawProfile = getPlayerDrawProfile(state, state.player.anim);
  const directionScale = getPlayerDirectionScale(state, state.player.anim, state.player.direction);
  const bounds = frame.bounds ?? { x: 0, y: 0, w: frame.w, h: frame.h };
  const normalizedScale = drawProfile.targetContentHeight
    ? drawProfile.targetContentHeight / Math.max(bounds.h, 1)
    : drawProfile.scale;
  const scale = Math.max(normalizedScale, drawProfile.minScale ?? 0) * directionScale;
  const width = frame.w * scale;
  const height = frame.h * scale;
  const flash = state.player.invulnerableTime > 0 && Math.floor(performance.now() / 75) % 2 === 0;
  const anchorX = drawProfile.targetContentHeight ? bounds.x + bounds.w / 2 : drawProfile.anchorX;
  const anchorY = drawProfile.targetContentHeight ? bounds.y + bounds.h : drawProfile.anchorY;
  const drawX = state.player.x - anchorX * scale;
  const drawY = state.player.y + drawProfile.baselineOffset - anchorY * scale;

  ctx.save();
  ctx.globalAlpha = flash ? 0.54 : 1;
  ctx.drawImage(frame.canvas, drawX, drawY, width, height);
  ctx.restore();
}

function activePlayerSpriteSet(state: GameState, assets: RenderAssets) {
  return assets.playerSprites[state.selectedClassId] ?? assets.playerSprites.warrior ?? null;
}

function getPlayerDrawProfile(state: GameState, animation: AnimationName): DrawProfile {
  if (state.selectedClassId === "mage") {
    if (animation === "dodge_roll") return purpleMageSpriteDraw.dodge;
    if (animation === "attack2") return purpleMageSpriteDraw.specialCast;
    if (animation === "attack1") return purpleMageSpriteDraw.wideAction;
    return purpleMageSpriteDraw.standard;
  }

  return animation === "attack1" || animation === "attack2"
    ? warriorSpriteDraw.wideAction
    : warriorSpriteDraw.standard;
}

function getPlayerDirectionScale(state: GameState, animation: AnimationName, direction: DirectionName) {
  if (state.selectedClassId === "mage") return 1;
  return 1;
}

function drawEnemy(ctx: CanvasRenderingContext2D, state: GameState, enemy: EnemyState, assets: RenderAssets, isTarget: boolean) {
  if (!enemy.visible) return;
  drawShadow(ctx, enemy.x, enemy.y + 20, 96, 34, 0.4);

  const frames = assets.monsterSprites[enemy.monsterId]?.[enemy.direction][enemy.anim]
    ?? assets.monsterSprites.moss_golem[enemy.direction][enemy.anim];
  const frame = frames?.[enemy.animFrame % frames.length];
  if (frame) {
    const drawProfile = getEnemyDrawProfile(enemy.monsterId, enemy.anim);
    const scale = drawProfile.scale;
    const width = frame.w * scale;
    const height = frame.h * scale;
    const drawX = enemy.x - drawProfile.anchorX * scale;
    const drawY = enemy.y + drawProfile.baselineOffset - drawProfile.anchorY * scale;
    ctx.save();
    ctx.filter = enemy.flashTimer > 0 ? "brightness(1.55) saturate(1.35)" : "none";
    ctx.drawImage(frame.canvas, drawX, drawY, width, height);
    ctx.restore();
  }

  if (state.combat.targetLocked && isTarget) {
    ctx.save();
    ctx.strokeStyle = "#f2d36b";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.ellipse(enemy.x, enemy.y + 12, 72, 40, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawRock(ctx: CanvasRenderingContext2D, obstacle: Obstacle, assets: RenderAssets) {
  const asset = assets.worldAssets[obstacle.asset];
  if (asset) {
    drawShadow(ctx, obstacle.x, obstacle.y + obstacle.ry * 0.55, obstacle.rx * 1.35, obstacle.ry * 0.72, 0.28);
    drawWorldAsset(ctx, assets, obstacle.asset, obstacle.x, obstacle.y + obstacle.ry, obstacle.scale);
    return;
  }

  drawShadow(ctx, obstacle.x, obstacle.y + obstacle.ry * 0.55, obstacle.rx * 1.4, obstacle.ry * 0.72, 0.3);

  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  ctx.fillStyle = "#4e6041";
  ctx.strokeStyle = "#1c2a1e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-obstacle.rx, -8);
  ctx.lineTo(-obstacle.rx * 0.4, -obstacle.ry);
  ctx.lineTo(obstacle.rx * 0.35, -obstacle.ry * 0.84);
  ctx.lineTo(obstacle.rx, -obstacle.ry * 0.14);
  ctx.lineTo(obstacle.rx * 0.64, obstacle.ry);
  ctx.lineTo(-obstacle.rx * 0.52, obstacle.ry * 0.82);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.moveTo(-obstacle.rx * 0.35, -obstacle.ry * 0.7);
  ctx.lineTo(obstacle.rx * 0.35, -obstacle.ry * 0.84);
  ctx.lineTo(obstacle.rx * 0.2, -obstacle.ry * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawWorldAsset(ctx: CanvasRenderingContext2D, assets: RenderAssets, assetName: WorldAssetName, x: number, y: number, scale: number) {
  const asset = assets.worldAssets[assetName];
  if (!asset) return;

  const width = asset.w * scale;
  const height = asset.h * scale;
  const shouldShadow = assetName !== "grassTile" && assetName !== "mossTile" && assetName !== "waterTile" && assetName !== "stoneTile";

  if (shouldShadow) {
    drawShadow(ctx, x, y - Math.min(12, height * 0.08), Math.max(18, width * 0.34), Math.max(8, height * 0.1), 0.22);
  }

  ctx.drawImage(asset.canvas, x - width / 2, y - height, width, height);
}

function drawLoot(ctx: CanvasRenderingContext2D, state: GameState, assets: RenderAssets) {
  if (!state.combat.droppedGear) return;
  const x = state.enemy.x + 42;
  const y = state.enemy.y + 28;
  if (assets.worldAssets.coin) {
    drawWorldAsset(ctx, assets, "coin", x, y + 16, 1.05);
    return;
  }

  ctx.save();
  ctx.fillStyle = "#f2d36b";
  ctx.strokeStyle = "#513812";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(x - 16, y - 12, 32, 24, 4);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawShadow(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, alpha: number) {
  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
