#!/usr/bin/env python3
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
paths = sorted(
    path
    for path in (ROOT / "tmp" / "pdf-renders").glob("*.png")
    if not path.stem.endswith("-1")
)
if not paths:
    raise SystemExit("No rendered PDF pages found")

cell_w, cell_h = 340, 520
cols = 4
rows = (len(paths) + cols - 1) // cols
sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), "#d9e0e6")
draw = ImageDraw.Draw(sheet)
font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 15)

for index, path in enumerate(paths):
    image = Image.open(path).convert("RGB")
    image.thumbnail((cell_w - 24, cell_h - 54))
    x = (index % cols) * cell_w + (cell_w - image.width) // 2
    y = (index // cols) * cell_h + 10
    sheet.paste(image, (x, y))
    label = path.stem.removesuffix("-1")
    draw.text(((index % cols) * cell_w + 12, (index // cols) * cell_h + cell_h - 34), label, fill="#102a43", font=font)

output = ROOT / "tmp" / "pdf-contact-sheet.png"
sheet.save(output, optimize=True)
print(output)
