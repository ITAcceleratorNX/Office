#!/usr/bin/env python3
"""Import office galleries from a local Google Drive folder download."""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = Path("/tmp/tmk-drive-full")
OUT = ROOT / "public" / "assets" / "offices"

FOLDER_SLUGS = {
    "Almarty Residence": "almaty-residence",
    "Almaty Plaza": "almaty-plaza",
    "Avenue City": "avenue-city",
    "Baykonyr": "baykonyr",
    "BNC plaza": "bnc-plaza",
    "Capital Tower": "capital-tower",
    "D-43": "d-43",
    "Element Tower": "element-tower",
    "Esentai Tower": "esentai-tower",
    "Fortis": "fortis",
    "Green Tower": "green-tower",
    "Kazat": "rams",
    "Ken Dala": "ken-dala",
    "Koktem-Towers": "koktem-towers",
    "Premium": "premium",
    "Prime business park": "prime",
    "Saba Plaza": "saba-plaza",
    "Star": "star",
    "Time square": "time-square",
    "Venus": "venus",
    "Абылай Хан плаза": "abylai-khan-plaza",
    "Аврора": "avrora",
    "Алатау Гранд": "alatau-grand",
    "Станица": "stanitsa",
}

IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".heic"}
MAX_PHOTOS = 7
MAX_W = 2560
QUALITY = 92
MIN_BYTES = 40_000


def is_real_photo(path: Path) -> bool:
    name = path.name.lower()
    if "chatgpt" in name or name.startswith("."):
        return False
    if path.suffix.lower() not in IMAGE_EXT:
        return False
    try:
        return path.stat().st_size >= MIN_BYTES
    except OSError:
        return False


def score_photo(path: Path) -> tuple:
    text = str(path).lower()
    if any(k in text for k in ("снаруж", "внешн", "фасад", "fasad", "facade", "greentower_fasad")):
        tier = 3
    elif any(k in text for k in ("офис", "office", "кв.м", "кв.м")):
        tier = 2
    elif "моп" in text:
        tier = 1
    else:
        tier = 2
    ext = 1 if path.suffix.lower() in {".jpg", ".jpeg"} else 0
    return (tier, path.stat().st_size, ext, path.name)


def pick_photos(folder: Path) -> list[Path]:
    photos = [p for p in folder.rglob("*") if p.is_file() and is_real_photo(p)]
    photos.sort(key=score_photo, reverse=True)

    chosen: list[Path] = []
    used_names: set[str] = set()

    for p in photos:
        if p.name in used_names:
            continue
        chosen.append(p)
        used_names.add(p.name)
        if len(chosen) >= MAX_PHOTOS:
            break

    return chosen


def to_rgb(img: Image.Image) -> Image.Image:
    if img.mode in ("RGBA", "P"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        bg.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
        return bg
    if img.mode != "RGB":
        return img.convert("RGB")
    return img


def save_jpg(src: Path, dest: Path) -> None:
    img = to_rgb(Image.open(src))
    w, h = img.size
    if w > MAX_W:
        img = img.resize((MAX_W, int(h * MAX_W / w)), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "JPEG", quality=QUALITY, optimize=True, progressive=True)


def import_slug(slug: str, folder: Path) -> int:
    picks = pick_photos(folder)
    if not picks:
        return 0

    out_dir = OUT / slug
    if out_dir.exists():
        for old in out_dir.glob("*.jpg"):
            old.unlink()

    for i, src in enumerate(picks, 1):
        save_jpg(src, out_dir / f"{slug}-{i:02d}.jpg")

    return len(picks)


def write_office_photos_js() -> None:
    entries = []
    for slug_dir in sorted(OUT.iterdir()):
        if not slug_dir.is_dir():
            continue
        count = len(list(slug_dir.glob("*.jpg")))
        if count:
            entries.append((slug_dir.name, count))

    lines = [
        "/** Пути к интерьерным фото офисов для карусели на странице объекта. */",
        "",
        "function galleryPaths(slug, count) {",
        "  return Array.from({ length: count }, (_, i) => {",
        '    const n = String(i + 1).padStart(2, "0");',
        "    return `/assets/offices/${slug}/${slug}-${n}.jpg`;",
        "  });",
        "}",
        "",
        "const OFFICE_PHOTOS = {",
    ]
    for slug, count in entries:
        lines.append(f'  "{slug}": galleryPaths("{slug}", {count}),')
    lines += [
        "};",
        "",
        "export function getOfficePhotos(slug) {",
        "  return OFFICE_PHOTOS[slug] ?? null;",
        "}",
        "",
    ]

    target = ROOT / "src" / "lib" / "office-photos.js"
    target.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else SRC
    if not src.exists():
        raise FileNotFoundError(f"Drive folder not found: {src}")

    summary: dict[str, int] = {}
    skipped: list[str] = []

    for folder_name, slug in FOLDER_SLUGS.items():
        folder = src / folder_name
        if not folder.exists():
            skipped.append(f"{slug} (missing folder)")
            continue
        count = import_slug(slug, folder)
        if count:
            summary[slug] = count
            print(f"  {slug}: {count} photos")
        else:
            skipped.append(slug)

    # Keep galleries sourced outside this Drive folder.
    for extra_slug in ("koktem-grand", "nurly-tau"):
        extra_dir = OUT / extra_slug
        if extra_dir.exists():
            count = len(list(extra_dir.glob("*.jpg")))
            if count:
                summary[extra_slug] = count

    write_office_photos_js()

    print(f"\nImported: {len(summary)} objects, {sum(summary.values())} photos")
    if skipped:
        print("Skipped (no real photos on Drive):")
        for s in skipped:
            print(f"  - {s}")


if __name__ == "__main__":
    main()
