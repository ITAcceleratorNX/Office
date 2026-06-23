#!/usr/bin/env python3
"""Import & compress office photos from Google Drive download."""
from pathlib import Path
from PIL import Image

SRC = Path("/tmp/tmk-drive")
OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "offices"

SELECTIONS = {
    "almaty-plaza": [
        "Almaty Plaza/Снаружи-внутри/внешнее фото/WhatsApp Image 2026-06-19 at 12.22.19.jpeg",
        "Almaty Plaza/Снаружи-внутри/внешнее фото/WhatsApp Image 2026-06-19 at 12.22.19 (1).jpeg",
        "Almaty Plaza/Снаружи-внутри/Офис 8 этаж - 240 кв.м/1d200d2d-64e4-4158-9966-11f0eafc2b7f.jpg",
        "Almaty Plaza/Снаружи-внутри/Офис 8 этаж - 240 кв.м/6b73d1ad-0a02-4b32-ae27-8284c7e9ec7e.jpg",
        "Almaty Plaza/Снаружи-внутри/Офис 8 этаж - 240 кв.м/17d8e093-4d76-4672-84c6-c8836c2cad30.jpg",
        "Almaty Plaza/Снаружи-внутри/Офис 8 этаж - 240 кв.м/cd8e8080-5ae6-491e-a064-992cb6199988.jpg",
        "Almaty Plaza/Снаружи-внутри/Офис 8 этаж - 240 кв.м/d5e26525-d939-43b7-826e-c202ea39038b.jpg",
    ],
    "venus": [
        "Venus/Снаружи-внутри/Внешнее фото/WhatsApp Image 2026-06-19 at 12.31.31.jpeg",
        "Venus/Снаружи-внутри/Внешнее фото/WhatsApp Image 2026-06-19 at 12.31.33.jpeg",
        "Venus/Снаружи-внутри/Офис 70 кв.м на 1 этаже (1 блок)/WhatsApp Image 2026-06-19 at 12.31.30 (1).jpeg",
        "Venus/Снаружи-внутри/Офис 70 кв.м на 1 этаже (1 блок)/WhatsApp Image 2026-06-19 at 12.31.30 (2).jpeg",
        "Venus/Снаружи-внутри/Фото внутри (МОПы)/1 Блок/WhatsApp Image 2026-06-19 at 12.31.31 (2).jpeg",
        "Venus/Снаружи-внутри/Фото внутри (МОПы)/2 Блок/WhatsApp Image 2026-06-19 at 12.31.32 (1).jpeg",
        "Venus/Снаружи-внутри/Фото внутри (МОПы)/2 Блок/WhatsApp Image 2026-06-19 at 12.31.33 (2).jpeg",
    ],
    "abylai-khan-plaza": [
        "Абылай Хан плаза/Снаружи - внутри/внешняя часть/WhatsApp Image 2026-06-19 at 11.56.22.jpeg",
        "Абылай Хан плаза/Снаружи - внутри/внешняя часть/WhatsApp Image 2026-06-19 at 12.50.59.jpeg",
        "Абылай Хан плаза/Снаружи - внутри/Офис 6 этаж - 152 кв.м/1.jpg",
        "Абылай Хан плаза/Снаружи - внутри/Офис 6 этаж - 152 кв.м/2.jpg",
        "Абылай Хан плаза/Снаружи - внутри/Офис 6 этаж - 152 кв.м/3.jpg",
        "Абылай Хан плаза/Снаружи - внутри/Офис 6 этаж - 152 кв.м/4.jpg",
        "Абылай Хан плаза/Снаружи - внутри/Офис 6 этаж - 152 кв.м/5.jpg",
    ],
    "alatau-grand": [
        "Алатау Гранд/Снаружи-внутри/внешнее фото/9808c542-b1ba-46c3-b0a7-083ceb17b6f9.jpg",
        "Алатау Гранд/Снаружи-внутри/внешнее фото/WhatsApp Image 2026-06-19 at 12.53.37.jpeg",
        "Алатау Гранд/Снаружи-внутри/Офис 3- этаж 298 кв.м/57753a1e-0f6d-4416-bb54-8a0ad9c67fa9.jpg",
        "Алатау Гранд/Снаружи-внутри/Офис 3- этаж 298 кв.м/a0c2288e-6ee3-4f9c-b9f6-e8dec95d48af.jpg",
        "Алатау Гранд/Снаружи-внутри/Офис 4-этаж 485 кв.м/WhatsApp Image 2026-06-19 at 12.26.49.jpeg",
        "Алатау Гранд/Снаружи-внутри/Офис 4-этаж 485 кв.м/WhatsApp Image 2026-06-19 at 12.26.51.jpeg",
        "Алатау Гранд/Снаружи-внутри/фото внутри (МОПы)/WhatsApp Image 2026-06-19 at 12.53.37 (3).jpeg",
    ],
    "stanitsa": [
        "Станица/Снаружи-внутри/Офисы от 100 до 1000 кв.м/WhatsApp Image 2026-06-19 at 12.42.19 (1).jpeg",
    ],
}

MAX_W = 1920
QUALITY = 82


def save_jpg(src: Path, dest: Path) -> None:
    img = Image.open(src)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    elif img.mode != "RGB":
        img = img.convert("RGB")
    w, h = img.size
    if w > MAX_W:
        img = img.resize((MAX_W, int(h * MAX_W / w)), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "JPEG", quality=QUALITY, optimize=True)


def main():
    for slug, paths in SELECTIONS.items():
        out_dir = OUT / slug
        if out_dir.exists():
            for old in out_dir.glob("*"):
                old.unlink()
        for i, rel in enumerate(paths, 1):
            src = SRC / rel
            if not src.exists():
                # try fuzzy match by filename
                name = Path(rel).name
                matches = list(SRC.rglob(name))
                if not matches:
                    raise FileNotFoundError(f"Missing: {rel}")
                src = matches[0]
            dest = out_dir / f"{slug}-{i:02d}.jpg"
            save_jpg(src, dest)
            print(f"  {dest.name} <- {src.name}")
        print(f"{slug}: {len(paths)} photos")


if __name__ == "__main__":
    main()
