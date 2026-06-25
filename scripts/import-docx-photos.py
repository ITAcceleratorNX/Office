#!/usr/bin/env python3
"""Extract object cover photos embedded in objects.docx."""
import io
import sys
import zipfile
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DOCX = Path.home() / "Downloads" / "обьекты.docx"
OUT = ROOT / "public" / "assets" / "objects"

IMAGE_MAP = {
    "word/media/image4.png": "jenis.jpg",
    "word/media/image1.png": "saba-plaza.jpg",
    "word/media/image3.png": "eurostandart.jpg",
    "word/media/image5.png": "a-plaza.jpg",
    "word/media/image2.png": "almaty-towers.jpg",
}

MIN_W = 1400
QUALITY = 92


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


def save_jpg(data: bytes, dest: Path) -> None:
    img = Image.open(io.BytesIO(data))
    img = to_rgb(img)
    w, h = img.size
    if w < MIN_W:
        img = img.resize((MIN_W, int(h * MIN_W / w)), Image.Resampling.LANCZOS)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=110, threshold=2))
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "JPEG", quality=QUALITY, optimize=True, progressive=True)


def main() -> None:
    docx = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_DOCX
    if not docx.exists():
        raise FileNotFoundError(f"Missing docx: {docx}")

    with zipfile.ZipFile(docx) as zf:
        for src, name in IMAGE_MAP.items():
            save_jpg(zf.read(src), OUT / name)
            print(f"  {name} <- {src}")


if __name__ == "__main__":
    main()
