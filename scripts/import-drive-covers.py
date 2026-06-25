#!/usr/bin/env python3
"""Replace object cover photos with best exterior shots from Google Drive download."""
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DRIVE = Path("/tmp/tmk-drive-full")
OUT = ROOT / "public" / "assets" / "objects"
META = ROOT / "scripts" / ".drive-covers.json"

FOLDER_SLUGS = {
    "Almaty Plaza": ("almaty-plaza", "Almaty plaza"),
    "Venus": ("venus", "venus"),
    "Алатау Гранд": ("alatau-grand", "Alatau Grand"),
    "Kazat": ("rams", "Rubenshtein 48"),
    "Star": ("star", "Star"),
    "Time square": ("time-square", "time-square"),
    "Станица": ("stanitsa", "Stancia"),
}

EXTERIOR_MARKERS = (
    "внешн", "снаруж", "фасад", "fasad", "facade", "greentower_fasad", "imthumb_1920",
)
INTERIOR_MARKERS = ("офис", "office", "кв.м", "этаж", "моп", "фото внутри")

QUALITY = 92


def is_real(path: Path) -> bool:
    return (
        path.is_file()
        and path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
        and "chatgpt" not in path.name.lower()
    )


def is_exterior(path: Path, folder: Path) -> bool:
    text = str(path).lower()
    if any(x in text for x in INTERIOR_MARKERS):
        return False
    if any(x in text for x in EXTERIOR_MARKERS):
        return True
    rel = path.relative_to(folder)
    return len(rel.parts) == 1 and path.stat().st_size > 500_000


def pick_exterior(folder: Path) -> Path | None:
    photos = [p for p in folder.rglob("*") if is_real(p)]
    exteriors = [p for p in photos if is_exterior(p, folder)]
    if not exteriors:
        return None

    def score(p: Path) -> tuple:
        img = Image.open(p)
        w, h = img.size
        landscape = 1 if w >= h else 0
        return (landscape, w * h, p.stat().st_size)

    best = max(exteriors, key=score)
    with Image.open(best) as img:
        if min(img.size) < 900:
            return None
    return best


def save_cover(src: Path, dest: Path) -> None:
    img = Image.open(src)
    if img.mode in ("RGBA", "P"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        bg.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
        img = bg
    elif img.mode != "RGB":
        img = img.convert("RGB")

    dest = dest.with_suffix(".jpg")
    img.save(dest, "JPEG", quality=QUALITY, optimize=True, progressive=True)

    old_png = dest.with_suffix(".png")
    if old_png.exists() and old_png != dest:
        old_png.unlink()

    return dest


def main() -> None:
    src_root = Path(sys.argv[1]) if len(sys.argv) > 1 else DRIVE
    if not src_root.exists():
        raise FileNotFoundError(f"Drive folder not found: {src_root}")

    updated: dict[str, str] = {}

    for folder_name, (slug, base_name) in FOLDER_SLUGS.items():
        folder = src_root / folder_name
        if not folder.exists():
            continue
        pick = pick_exterior(folder)
        if not pick:
            print(f"  skip {slug}: no exterior photo")
            continue

        dest = save_cover(pick, OUT / base_name)
        updated[slug] = f"/assets/objects/{dest.name.replace(' ', '%20')}"
        with Image.open(dest) as img:
            print(f"  {slug}: {img.size[0]}x{img.size[1]} <- {pick.name}")

    META.write_text(json.dumps(updated, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nUpdated {len(updated)} covers -> {META.name}")


if __name__ == "__main__":
    main()
