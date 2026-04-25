from __future__ import annotations

import json
import math
import shutil
from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "characters" / "green_warrior_v2"
BASE_PATH = ASSET_DIR / "Green_Warrior_Base.png"
SOURCE_DIR = ASSET_DIR / "source"
FRAME_SIZE = 64
ANCHOR = {"x": 32, "y": 60}

DIRECTIONS = ("down", "down_right", "right", "up_right", "up", "up_left", "left", "down_left")
ANIMATIONS = {
    "idle": 6,
    "walk": 8,
    "attack": 8,
    "special": 8,
    "dodge": 6,
    "sprint": 10,
}


def ensure_clean_dir(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)


def bg_candidate(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, a = pixel
    if a == 0:
        return True
    high_value = r > 224 and g > 224 and b > 224
    low_saturation = max(r, g, b) - min(r, g, b) < 18
    checker_tint = abs(r - g) < 8 and abs(g - b) < 8
    return high_value and low_saturation and checker_tint


def extract_character(source: Image.Image) -> Image.Image:
    rgba = source.convert("RGBA")
    w, h = rgba.size
    pixels = rgba.load()
    seen: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in seen or not (0 <= x < w and 0 <= y < h):
            continue
        if not bg_candidate(pixels[x, y]):
            continue
        seen.add((x, y))
        queue.append((x + 1, y))
        queue.append((x - 1, y))
        queue.append((x, y + 1))
        queue.append((x, y - 1))

    alpha = Image.new("L", rgba.size, 255)
    alpha_pixels = alpha.load()
    for x, y in seen:
        alpha_pixels[x, y] = 0

    # Remove checkerboard pinholes that are still visibly white and connected
    # through sub-pixel gaps after the first flood pass.
    subject = Image.new("RGBA", rgba.size)
    subject.paste(rgba, (0, 0), alpha)
    bbox = subject.getchannel("A").getbbox()
    if bbox is None:
        raise RuntimeError("Unable to extract a character silhouette from the base image")

    cropped = subject.crop(bbox)
    cropped_alpha = cropped.getchannel("A")
    cropped_alpha = cropped_alpha.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    cropped.putalpha(cropped_alpha)
    return cropped


def resize_base(cutout: Image.Image) -> Image.Image:
    bbox = cutout.getchannel("A").getbbox()
    if bbox is None:
        raise RuntimeError("Base cutout has no visible pixels")
    trimmed = cutout.crop(bbox)
    target_h = 59
    scale = target_h / trimmed.height
    target_w = max(1, round(trimmed.width * scale))
    if target_w > 61:
        scale = 61 / trimmed.width
        target_w = 61
        target_h = max(1, round(trimmed.height * scale))
    return trimmed.resize((target_w, target_h), Image.Resampling.LANCZOS)


def nontransparent_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    bbox = image.getchannel("A").getbbox()
    if bbox is None:
        return (0, 0, 0, 0)
    return bbox


def recolor(image: Image.Image, brightness: float = 1.0, contrast: float = 1.0) -> Image.Image:
    out = ImageEnhance.Brightness(image).enhance(brightness)
    out = ImageEnhance.Contrast(out).enhance(contrast)
    return out


def direction_variant(base: Image.Image, direction: str) -> Image.Image:
    out = base.copy()
    if direction in {"left", "up_left", "down_left"}:
        out = out.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    shear = {
        "down": 0.0,
        "down_right": 0.06,
        "right": 0.12,
        "up_right": 0.08,
        "up": 0.0,
        "up_left": -0.08,
        "left": -0.12,
        "down_left": -0.06,
    }[direction]
    if shear:
        out = out.transform(out.size, Image.Transform.AFFINE, (1.0, shear, -shear * 25, 0, 1, 0), Image.Resampling.BICUBIC)
    if direction in {"up", "up_left", "up_right"}:
        out = recolor(out, 0.78 if direction == "up" else 0.84, 1.05)
        shade = Image.new("RGBA", out.size, (23, 44, 23, 0))
        mask = out.getchannel("A").filter(ImageFilter.GaussianBlur(1.0))
        shade.putalpha(mask.point(lambda p: int(p * (0.22 if direction == "up" else 0.16))))
        out = Image.alpha_composite(out, shade)
    elif direction in {"down_left", "down_right"}:
        out = recolor(out, 0.96, 1.03)
    return out


def squash(image: Image.Image, sx: float, sy: float) -> Image.Image:
    w, h = image.size
    nw = max(1, round(w * sx))
    nh = max(1, round(h * sy))
    return image.resize((nw, nh), Image.Resampling.LANCZOS)


def rotate(image: Image.Image, angle: float) -> Image.Image:
    return image.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)


def paste_bottom_center(canvas: Image.Image, sprite: Image.Image, foot_x: int, foot_y: int) -> None:
    bbox = nontransparent_bbox(sprite)
    visible = sprite.crop(bbox)
    x = foot_x - visible.width // 2
    y = foot_y - visible.height
    canvas.alpha_composite(visible, (round(x), round(y)))


def add_shadow(canvas: Image.Image, ox: int, oy: int, scale: float = 1.0) -> None:
    shadow = Image.new("RGBA", canvas.size)
    draw = ImageDraw.Draw(shadow)
    rx = round(11 * scale)
    ry = round(4 * scale)
    draw.ellipse((ANCHOR["x"] + ox - rx, ANCHOR["y"] + oy - ry, ANCHOR["x"] + ox + rx, ANCHOR["y"] + oy + ry), fill=(0, 0, 0, 42))
    canvas.alpha_composite(shadow)


def slash_layer(direction: str, frame: int, color: tuple[int, int, int, int]) -> Image.Image:
    layer = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE))
    draw = ImageDraw.Draw(layer)
    if direction in {"right", "down_right", "down"}:
        pts = [(36, 27), (55, 16), (59, 20), (40, 32)]
    elif direction in {"left", "down_left"}:
        pts = [(28, 27), (9, 16), (5, 20), (24, 32)]
    elif direction in {"up_right", "up"}:
        pts = [(31, 23), (48, 11), (52, 15), (35, 28)]
    else:
        pts = [(33, 23), (16, 11), (12, 15), (29, 28)]
    alpha = max(0, color[3] - frame * 24)
    draw.line(pts, fill=(color[0], color[1], color[2], alpha), width=2, joint="curve")
    draw.line([(x, y + 2) for x, y in pts], fill=(255, 255, 255, max(0, alpha - 36)), width=1, joint="curve")
    return layer.filter(ImageFilter.GaussianBlur(0.25))


def glow_layer(frame: int) -> Image.Image:
    layer = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE))
    draw = ImageDraw.Draw(layer)
    pulse = math.sin((frame / 8) * math.tau)
    radius = 14 + round(3 * pulse)
    alpha = 64 + round(26 * pulse)
    draw.ellipse((ANCHOR["x"] - radius, 24 - radius, ANCHOR["x"] + radius, 24 + radius), fill=(112, 230, 91, max(35, alpha)))
    draw.arc((ANCHOR["x"] - 18, 15, ANCHOR["x"] + 18, 51), 205 + frame * 22, 290 + frame * 22, fill=(244, 205, 72, 150), width=2)
    draw.arc((ANCHOR["x"] - 22, 12, ANCHOR["x"] + 22, 54), 24 + frame * 18, 88 + frame * 18, fill=(113, 237, 95, 120), width=2)
    return layer.filter(ImageFilter.GaussianBlur(0.45))


def motion_streak(direction: str, frame: int) -> Image.Image:
    layer = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE))
    draw = ImageDraw.Draw(layer)
    alpha = 70 if frame % 2 == 0 else 46
    if direction in {"right", "down_right", "up_right"}:
        lines = [((18, 34), (5, 37)), ((20, 42), (7, 46))]
    elif direction in {"left", "down_left", "up_left"}:
        lines = [((46, 34), (59, 37)), ((44, 42), (57, 46))]
    elif direction == "up":
        lines = [((25, 47), (18, 58)), ((39, 47), (46, 58))]
    else:
        lines = [((25, 28), (18, 18)), ((39, 28), (46, 18))]
    for start, end in lines:
        draw.line((start, end), fill=(242, 215, 99, alpha), width=1)
    return layer


def frame_for(base: Image.Image, animation: str, direction: str, frame: int, total: int) -> Image.Image:
    t = frame / total
    wave = math.sin(t * math.tau)
    double = math.sin(t * math.tau * 2)
    sprite = direction_variant(base, direction)
    ox = 0
    oy = 0
    shadow_scale = 1.0
    dir_x = {
        "down": 0,
        "down_right": 1,
        "right": 1,
        "up_right": 1,
        "up": 0,
        "up_left": -1,
        "left": -1,
        "down_left": -1,
    }[direction]
    dir_y = {
        "down": 1,
        "down_right": 1,
        "right": 0,
        "up_right": -1,
        "up": -1,
        "up_left": -1,
        "left": 0,
        "down_left": 1,
    }[direction]

    if animation == "idle":
        oy = round(-1.2 - 1.2 * wave)
        sprite = squash(sprite, 1.0 + 0.012 * wave, 1.0 - 0.012 * wave)
    elif animation == "walk":
        ox = round(dir_x * (1.5 * wave))
        oy = round(-1 - abs(double) * 1.4)
        sprite = rotate(squash(sprite, 1.0 + 0.018 * double, 1.0 - 0.018 * double), 1.8 * wave)
        shadow_scale = 0.96 + 0.05 * abs(double)
    elif animation == "sprint":
        lean = (dir_x * 7) + (dir_y * -3)
        ox = round(dir_x * 2 * (1 + wave))
        oy = round(-2 - abs(double) * 2.2)
        sprite = rotate(squash(sprite, 1.05, 0.97), lean + 2.0 * wave)
        shadow_scale = 1.05
    elif animation == "dodge":
        progress = math.sin(math.pi * t)
        lean = (dir_x * 18) + (dir_y * -10)
        ox = round(dir_x * 7 * progress)
        oy = round(-2 - 6 * progress)
        sprite = rotate(squash(sprite, 1.10, 0.80), lean * progress)
        shadow_scale = 1.0 + 0.20 * progress
    elif animation == "attack":
        phases = [-8, -15, -8, 9, 17, 8, -2, 0]
        lean = phases[frame % len(phases)]
        if dir_x < 0:
            lean *= -1
        ox = round(dir_x * 2 * max(0, math.sin(math.pi * t)))
        oy = round(-1 - 1.5 * math.sin(math.pi * t))
        sprite = rotate(squash(sprite, 1.04, 0.98), lean)
    elif animation == "special":
        lean = 4 * wave
        sprite = rotate(squash(recolor(sprite, 1.08, 1.08), 1.02 + 0.02 * wave, 1.0), lean)
        oy = round(-3 - 2 * math.sin(math.pi * t))

    canvas = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE))
    add_shadow(canvas, ox, 0, shadow_scale)
    paste_bottom_center(canvas, sprite, ANCHOR["x"] + ox, ANCHOR["y"] + oy)

    if animation == "attack" and 2 <= frame <= 5:
        canvas.alpha_composite(slash_layer(direction, frame - 2, (235, 230, 190, 168)))
    if animation == "special":
        glow = glow_layer(frame)
        canvas = Image.alpha_composite(glow, canvas)
        if frame in {3, 4, 5}:
            canvas.alpha_composite(slash_layer(direction, frame - 3, (119, 236, 91, 185)))
    if animation in {"sprint", "dodge"} and frame not in {0, total - 1}:
        canvas.alpha_composite(motion_streak(direction, frame))

    return canvas


def make_sheet(frames: list[Image.Image], columns: int) -> Image.Image:
    rows = math.ceil(len(frames) / columns)
    sheet = Image.new("RGBA", (columns * FRAME_SIZE, rows * FRAME_SIZE))
    for index, frame in enumerate(frames):
        x = index % columns * FRAME_SIZE
        y = index // columns * FRAME_SIZE
        sheet.alpha_composite(frame, (x, y))
    return sheet


def make_preview(frames: list[Image.Image], columns: int) -> Image.Image:
    scale = 3
    pad = 8
    rows = math.ceil(len(frames) / columns)
    cell = FRAME_SIZE * scale
    preview = Image.new("RGBA", (columns * cell + (columns + 1) * pad, rows * cell + (rows + 1) * pad), (28, 34, 34, 255))
    checker = Image.new("RGBA", (cell, cell), (210, 217, 210, 255))
    cdraw = ImageDraw.Draw(checker)
    tile = 12
    for y in range(0, cell, tile):
        for x in range(0, cell, tile):
            if (x // tile + y // tile) % 2 == 0:
                cdraw.rectangle((x, y, x + tile - 1, y + tile - 1), fill=(236, 240, 233, 255))
    for index, frame in enumerate(frames):
        x = pad + index % columns * (cell + pad)
        y = pad + index // columns * (cell + pad)
        preview.alpha_composite(checker, (x, y))
        preview.alpha_composite(frame.resize((cell, cell), Image.Resampling.NEAREST), (x, y))
    return preview


def write_animation(base: Image.Image, animation: str, total: int) -> dict:
    out_dir = ASSET_DIR / animation
    frames_dir = out_dir / "frames"
    ensure_clean_dir(frames_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    all_frames: list[Image.Image] = []
    meta_frames = []

    for direction in DIRECTIONS:
        direction_frames = []
        for index in range(total):
            frame = frame_for(base, animation, direction, index, total)
            frame_name = f"{animation}_{direction}_{index + 1:02d}.png"
            frame_path = frames_dir / frame_name
            frame.save(frame_path)
            direction_frames.append(frame)
            all_frames.append(frame)
            meta_frames.append(
                {
                    "direction": direction,
                    "frame": index + 1,
                    "path": str(frame_path.relative_to(ROOT)).replace("\\", "/"),
                    "durationMs": round(1000 / {"idle": 6, "walk": 10, "attack": 14, "special": 11, "dodge": 18, "sprint": 14}[animation]),
                }
            )

        strip = make_sheet(direction_frames, total)
        strip.save(out_dir / f"green_warrior_v2_{animation}_{direction}_64.png")

    sheet = make_sheet(all_frames, total)
    sheet_path = out_dir / f"green_warrior_v2_{animation}_4dir_64.png"
    sheet.save(sheet_path)
    preview_path = out_dir / f"green_warrior_v2_{animation}_4dir_64_preview.png"
    make_preview(all_frames, total).save(preview_path)
    metadata = {
        "name": f"green_warrior_v2_{animation}",
        "source": str(BASE_PATH.relative_to(ROOT)).replace("\\", "/"),
        "frameWidth": FRAME_SIZE,
        "frameHeight": FRAME_SIZE,
        "anchor": ANCHOR,
        "directions": list(DIRECTIONS),
        "framesPerDirection": total,
        "sheet": str(sheet_path.relative_to(ROOT)).replace("\\", "/"),
        "preview": str(preview_path.relative_to(ROOT)).replace("\\", "/"),
        "frames": meta_frames,
    }
    json_path = out_dir / f"green_warrior_v2_{animation}_4dir_64.json"
    json_path.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    return metadata


def main() -> None:
    if not BASE_PATH.exists():
        raise FileNotFoundError(BASE_PATH)

    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    base = Image.open(BASE_PATH)
    cutout = extract_character(base)
    cutout.save(SOURCE_DIR / "green_warrior_v2_base_cutout.png")
    normalized = resize_base(cutout)
    normalized.save(SOURCE_DIR / "green_warrior_v2_base_normalized.png")

    manifest = {
        "name": "green_warrior_v2",
        "source": str(BASE_PATH.relative_to(ROOT)).replace("\\", "/"),
        "cutout": str((SOURCE_DIR / "green_warrior_v2_base_cutout.png").relative_to(ROOT)).replace("\\", "/"),
        "normalizedBase": str((SOURCE_DIR / "green_warrior_v2_base_normalized.png").relative_to(ROOT)).replace("\\", "/"),
        "frameWidth": FRAME_SIZE,
        "frameHeight": FRAME_SIZE,
        "anchor": ANCHOR,
        "directions": list(DIRECTIONS),
        "animations": {},
        "notes": "Generated from Green_Warrior_Base.png only. No assets outside green_warrior_v2 are used as references.",
    }
    for animation, total in ANIMATIONS.items():
        manifest["animations"][animation] = write_animation(normalized, animation, total)

    (ASSET_DIR / "green_warrior_v2_manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote green_warrior_v2 sprite set to {ASSET_DIR}")


if __name__ == "__main__":
    main()
