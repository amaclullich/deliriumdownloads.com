#!/usr/bin/env python3
"""Build labelled contact sheets for visual QA of every rendered DOCX page."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
RENDER_ROOT = ROOT / "tmp" / "docx-renders-12pt"
OUTPUT_ROOT = ROOT / "tmp" / "docx-contact-sheets"
PAGES_PER_SHEET = 16
COLS = 4
CELL_W, CELL_H = 340, 470


def main() -> None:
    paths = sorted(RENDER_ROOT.glob("*/*.png"), key=lambda path: (path.parent.name, path.name))
    if not paths:
        raise SystemExit("No rendered DOCX pages found")
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 13)

    for group_index in range(0, len(paths), PAGES_PER_SHEET):
        group = paths[group_index:group_index + PAGES_PER_SHEET]
        rows = (len(group) + COLS - 1) // COLS
        sheet = Image.new("RGB", (COLS * CELL_W, rows * CELL_H), "#d9e0e6")
        draw = ImageDraw.Draw(sheet)
        for index, path in enumerate(group):
            page = Image.open(path).convert("RGB")
            page.thumbnail((CELL_W - 24, CELL_H - 48))
            col, row = index % COLS, index // COLS
            x = col * CELL_W + (CELL_W - page.width) // 2
            y = row * CELL_H + 8
            sheet.paste(page, (x, y))
            label = f"{path.parent.name} · {path.stem}"
            draw.text((col * CELL_W + 10, row * CELL_H + CELL_H - 31), label, fill="#102a43", font=font)
        output = OUTPUT_ROOT / f"docx-contact-{group_index // PAGES_PER_SHEET + 1:02d}.png"
        sheet.save(output, optimize=True)
        print(output)


if __name__ == "__main__":
    main()
