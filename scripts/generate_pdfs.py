#!/usr/bin/env python3
"""Generate the Delirium Downloads PDF collection from the reviewed Markdown masters."""

from __future__ import annotations

import html
import re
import shutil
from dataclasses import dataclass
from pathlib import Path

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    Frame,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
PUBLIC_DIR = ROOT / "public" / "downloads"

NAVY = colors.HexColor("#102A43")
NAVY_SOFT = colors.HexColor("#334E68")
PAPER = colors.HexColor("#FFFDF8")
CORAL = colors.HexColor("#FF6B5D")
CORAL_PALE = colors.HexColor("#FFD9D4")
BLUE = colors.HexColor("#4F77FF")
BLUE_PALE = colors.HexColor("#DFE7FF")
LIME = colors.HexColor("#C9F45B")
LIME_PALE = colors.HexColor("#EFFBCF")
VIOLET = colors.HexColor("#9366E5")
VIOLET_PALE = colors.HexColor("#EADDFF")
GREY = colors.HexColor("#6A7D8C")
LIGHT_LINE = colors.HexColor("#C7D0D8")

SLUGS = {
    "family": [
        "what-is-delirium",
        "signs-and-urgent-action",
        "finding-triggers-family",
        "how-delirium-is-treated",
        "preventing-delirium",
        "family-help-at-bedside",
        "delirium-or-dementia",
        "what-to-say-to-staff",
        "after-delirium",
        "frightening-beliefs-and-hallucinations",
    ],
    "professional": [
        "recognising-delirium-at-the-bedside",
        "positive-4at-next-steps",
        "structured-cause-sweep",
        "daily-multidomain-review",
        "shift-by-shift-non-drug-care",
        "agitation-or-unmet-need",
        "preventing-delirium-clinical",
        "delirium-discharge-summary",
        "delirium-sensitive-hospital",
        "audit-delirium-detection",
    ],
    "additional": [
        "multidomain-treatment",
        "hypoactive-delirium",
        "medicines-and-delirium",
        "allied-health-function-recovery",
        "care-home-community-response",
    ],
}

AUDIENCE = {
    "what-is-delirium": "Patient & family handout",
    "signs-and-urgent-action": "Patient & family handout",
    "finding-triggers-family": "Patient & family handout",
    "how-delirium-is-treated": "Patient & family handout",
    "preventing-delirium": "Patient & family handout",
    "family-help-at-bedside": "Patient & family handout",
    "delirium-or-dementia": "Patient & family handout",
    "what-to-say-to-staff": "Patient & family handout",
    "after-delirium": "Patient & family handout",
    "frightening-beliefs-and-hallucinations": "Patient & family handout",
    "recognising-delirium-at-the-bedside": "Clinical teams",
    "positive-4at-next-steps": "Clinical teams",
    "structured-cause-sweep": "Assessing clinicians",
    "daily-multidomain-review": "Ward-round teams",
    "shift-by-shift-non-drug-care": "Nurses & care staff",
    "agitation-or-unmet-need": "Clinical teams",
    "preventing-delirium-clinical": "Clinical teams",
    "delirium-discharge-summary": "Discharge teams",
    "delirium-sensitive-hospital": "Managers & leaders",
    "audit-delirium-detection": "QI & service managers",
    "multidomain-treatment": "Clinical teams",
    "hypoactive-delirium": "Health & care staff",
    "medicines-and-delirium": "Prescribers & pharmacists",
    "allied-health-function-recovery": "Allied health professionals",
    "care-home-community-response": "Community & care-home teams",
}

TOPIC_ICONS = {
    "what-is-delirium": "brain",
    "signs-and-urgent-action": "warning",
    "finding-triggers-family": "question",
    "how-delirium-is-treated": "heart",
    "preventing-delirium": "clock",
    "family-help-at-bedside": "people",
    "delirium-or-dementia": "question",
    "what-to-say-to-staff": "speech",
    "after-delirium": "home",
    "frightening-beliefs-and-hallucinations": "eye",
    "recognising-delirium-at-the-bedside": "brain",
    "positive-4at-next-steps": "document",
    "structured-cause-sweep": "question",
    "daily-multidomain-review": "calendar",
    "shift-by-shift-non-drug-care": "bed",
    "agitation-or-unmet-need": "speech",
    "preventing-delirium-clinical": "clock",
    "delirium-discharge-summary": "home",
    "delirium-sensitive-hospital": "hospital",
    "audit-delirium-detection": "document",
    "multidomain-treatment": "heart",
    "hypoactive-delirium": "brain",
    "medicines-and-delirium": "pill",
    "allied-health-function-recovery": "walking",
    "care-home-community-response": "home",
}

ACCENTS = [CORAL, BLUE, LIME, VIOLET]
PALES = [CORAL_PALE, BLUE_PALE, LIME_PALE, VIOLET_PALE]


def register_fonts() -> None:
    fonts = {
        "Arial": "/System/Library/Fonts/Supplemental/Arial.ttf",
        "Arial-Bold": "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "Arial-Italic": "/System/Library/Fonts/Supplemental/Arial Italic.ttf",
        "Georgia": "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "Georgia-Bold": "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
        "Georgia-Italic": "/System/Library/Fonts/Supplemental/Georgia Italic.ttf",
    }
    for name, path in fonts.items():
        pdfmetrics.registerFont(TTFont(name, path))


def ascii_hyphens(value: str) -> str:
    return (
        value.replace("\u2014", " - ")
        .replace("\u2013", "-")
        .replace("\u2011", "-")
        .replace("\u2212", "-")
    )


def inline_markup(value: str) -> str:
    """Convert conservative Markdown inline markup to ReportLab XML."""
    value = ascii_hyphens(value.strip())
    links: list[tuple[str, str]] = []

    def hold_link(match: re.Match[str]) -> str:
        links.append((match.group(1), match.group(2)))
        return f"@@LINK{len(links) - 1}@@"

    value = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)", hold_link, value)
    value = html.escape(value, quote=False)
    value = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", value)
    value = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", value)
    for index, (label, url) in enumerate(links):
        replacement = f'<link href="{html.escape(url, quote=True)}" color="#244FC5"><u>{html.escape(label)}</u></link>'
        value = value.replace(f"@@LINK{index}@@", replacement)
    return value


@dataclass
class Section:
    heading: str
    blocks: list[tuple[str, object]]


@dataclass
class Sheet:
    index: int
    kind: str
    slug: str
    title: str
    audience: str
    purpose: str
    sections: list[Section]


def parse_master(path: Path, kind: str) -> list[Sheet]:
    text = path.read_text(encoding="utf-8")
    matches = list(re.finditer(r"^##\s+(\d+)\.\s+(.+)$", text, flags=re.MULTILINE))
    sheets: list[Sheet] = []
    for position, match in enumerate(matches):
        number = int(match.group(1))
        if number > len(SLUGS[kind]):
            continue
        body_end = matches[position + 1].start() if position + 1 < len(matches) else len(text)
        body = text[match.end():body_end].strip()
        title = ascii_hyphens(match.group(2).strip())
        purpose_match = re.search(r"^\*\*Purpose:\*\*\s*(.+)$", body, flags=re.MULTILINE)
        purpose = ascii_hyphens(purpose_match.group(1).strip()) if purpose_match else "A practical delirium guide."
        body = re.sub(r"^\*\*Purpose:\*\*.*$", "", body, flags=re.MULTILINE)
        body = re.sub(r"^\*\*(Status|Clinical review status):\*\*.*$", "", body, flags=re.MULTILINE)
        body = re.split(r"^##\s+Publication control note\s*$", body, maxsplit=1, flags=re.MULTILINE)[0]
        body = body.replace("\n---\n", "\n")
        sections = parse_sections(body)
        slug = SLUGS[kind][number - 1]
        sheets.append(
            Sheet(
                index=number,
                kind=kind,
                slug=slug,
                title=title,
                audience=AUDIENCE[slug],
                purpose=purpose,
                sections=sections,
            )
        )
    return sheets


def parse_sections(body: str) -> list[Section]:
    lines = body.splitlines()
    sections: list[Section] = []
    current = Section("", [])
    paragraph: list[str] = []
    bullets: list[str] = []
    quote: list[str] = []

    def flush_paragraph() -> None:
        nonlocal paragraph
        if paragraph:
            joined = " ".join(line.strip() for line in paragraph if line.strip())
            if joined:
                current.blocks.append(("paragraph", joined))
        paragraph = []

    def flush_bullets() -> None:
        nonlocal bullets
        if bullets:
            current.blocks.append(("bullets", bullets[:]))
        bullets = []

    def flush_quote() -> None:
        nonlocal quote
        if quote:
            joined = " ".join(line.strip() for line in quote if line.strip())
            if joined:
                current.blocks.append(("safety", joined))
        quote = []

    def flush_all() -> None:
        flush_paragraph()
        flush_bullets()
        flush_quote()

    for raw in lines:
        line = raw.rstrip()
        if line.startswith("### "):
            flush_all()
            if current.heading or current.blocks:
                sections.append(current)
            current = Section(ascii_hyphens(line[4:].strip()), [])
        elif line.startswith(">"):
            flush_paragraph()
            flush_bullets()
            quote.append(line[1:].strip())
        elif line.startswith("- "):
            flush_paragraph()
            flush_quote()
            bullets.append(line[2:].strip())
        elif not line.strip():
            flush_all()
        elif line.startswith("**Clinical review status:") or line.startswith("**Status:"):
            continue
        elif line.startswith("## ") or line == "---":
            continue
        else:
            flush_bullets()
            flush_quote()
            paragraph.append(line)
    flush_all()
    if current.heading or current.blocks:
        sections.append(current)
    return [section for section in sections if section.heading.lower() != "publication control note"]


class NumberedBullet(Flowable):
    def __init__(self, number: int, accent: colors.Color, size: float = 17):
        super().__init__()
        self.number = number
        self.accent = accent
        self.width = size
        self.height = size

    def draw(self) -> None:
        canvas = self.canv
        canvas.setFillColor(self.accent)
        canvas.circle(self.width / 2, self.height / 2, self.width / 2, fill=1, stroke=0)
        canvas.setFillColor(NAVY)
        canvas.setFont("Arial-Bold", 7.5)
        canvas.drawCentredString(self.width / 2, self.height / 2 - 2.5, str(self.number))


class SheetDocTemplate(BaseDocTemplate):
    def __init__(self, filename: str, sheet: Sheet, accent: colors.Color, pale: colors.Color):
        self.sheet = sheet
        self.accent = accent
        self.pale = pale
        width, height = A4
        margin_x = 16 * mm
        gutter = 7 * mm
        body_top = height - 53 * mm
        body_bottom = 20 * mm
        frame_width = (width - 2 * margin_x - gutter) / 2
        if sheet.kind == "family":
            frames = [
                Frame(
                    margin_x,
                    body_bottom,
                    width - 2 * margin_x,
                    body_top - body_bottom,
                    id="single",
                    leftPadding=0,
                    rightPadding=0,
                    topPadding=0,
                    bottomPadding=0,
                )
            ]
        else:
            frames = [
                Frame(margin_x, body_bottom, frame_width, body_top - body_bottom, id="left", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0),
                Frame(margin_x + frame_width + gutter, body_bottom, frame_width, body_top - body_bottom, id="right", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0),
            ]
        super().__init__(
            filename,
            pagesize=A4,
            pageTemplates=[PageTemplate(id="two-column", frames=frames, onPage=self.draw_page)],
            title=sheet.title,
            author="Professor Alasdair MacLullich",
            subject="Delirium education resource - draft for human clinical review",
            creator="DeliriumDownloads.com",
            keywords=(
                "delirium, patient information, family information, staff handout"
                if sheet.kind == "family"
                else "delirium, clinical education, staff resource, quality improvement"
            ),
            leftMargin=margin_x,
            rightMargin=margin_x,
            topMargin=53 * mm,
            bottomMargin=20 * mm,
            allowSplitting=1,
        )

    def draw_page(self, canvas, doc) -> None:
        width, height = A4
        canvas.saveState()
        canvas.setFillColor(PAPER)
        canvas.rect(0, 0, width, height, fill=1, stroke=0)

        # Editorial rule and colour tab.
        canvas.setFillColor(NAVY)
        canvas.rect(16 * mm, height - 14 * mm, width - 32 * mm, 1.1, fill=1, stroke=0)
        canvas.setFillColor(self.accent)
        canvas.roundRect(16 * mm, height - 23 * mm, 42 * mm, 7.5 * mm, 1.5 * mm, fill=1, stroke=0)
        canvas.setFillColor(NAVY)
        canvas.setFont("Arial-Bold", 7.2)
        canvas.drawString(19 * mm, height - 20.4 * mm, self.sheet.audience.upper())

        canvas.setFillColor(NAVY)
        icon_x = width - 29 * mm
        icon_y = height - 30 * mm
        canvas.setFillColor(self.pale)
        canvas.circle(icon_x, icon_y, 12 * mm, fill=1, stroke=0)
        draw_topic_icon(canvas, icon_x, icon_y, 14 * mm, TOPIC_ICONS.get(self.sheet.slug, "brain"), NAVY)

        title_style = ParagraphStyle(
            "page-title",
            fontName="Georgia-Bold",
            fontSize=22 if len(self.sheet.title) < 45 else 19.5,
            leading=23,
            textColor=NAVY,
            spaceAfter=0,
        )
        title = Paragraph(html.escape(self.sheet.title), title_style)
        title.wrapOn(canvas, width - 69 * mm, 28 * mm)
        title.drawOn(canvas, 16 * mm, height - 39 * mm)

        purpose_style = ParagraphStyle(
            "purpose",
            fontName="Arial",
            fontSize=8.8,
            leading=11,
            textColor=NAVY_SOFT,
        )
        purpose = Paragraph(html.escape(self.sheet.purpose), purpose_style)
        purpose.wrapOn(canvas, width - 69 * mm, 18 * mm)
        purpose.drawOn(canvas, 16 * mm, height - 50 * mm)

        # Footer.
        canvas.setStrokeColor(LIGHT_LINE)
        canvas.line(16 * mm, 15 * mm, width - 16 * mm, 15 * mm)
        canvas.setFont("Arial", 6.8)
        canvas.setFillColor(NAVY_SOFT)
        canvas.drawString(16 * mm, 10.8 * mm, "DELIRIUMDOWNLOADS.COM · DRAFT v0.9 · 7 AUG 2026 · HUMAN CLINICAL REVIEW PENDING")
        canvas.drawRightString(width - 16 * mm, 10.8 * mm, f"{doc.page}")
        canvas.restoreState()


def draw_topic_icon(canvas, cx: float, cy: float, size: float, name: str, colour) -> None:
    """Draw a small line icon adapted from the project's original Social Media Hub icon system."""
    s = size
    left, right = cx - s / 2, cx + s / 2
    bottom, top = cy - s / 2, cy + s / 2
    line = max(1.5, s / 18)
    canvas.saveState()
    canvas.setStrokeColor(colour)
    canvas.setFillColor(colour)
    canvas.setLineWidth(line)
    canvas.setLineCap(1)
    canvas.setLineJoin(1)

    if name == "clock":
        canvas.circle(cx, cy, s / 2, fill=0, stroke=1)
        canvas.line(cx, cy, cx, cy + s * .25)
        canvas.line(cx, cy, cx + s * .22, cy - s * .12)
    elif name == "calendar":
        canvas.roundRect(left, bottom + s * .06, s, s * .83, s * .08, fill=0, stroke=1)
        canvas.line(left, cy + s * .16, right, cy + s * .16)
        canvas.line(cx - s * .22, top, cx - s * .22, top - s * .2)
        canvas.line(cx + s * .22, top, cx + s * .22, top - s * .2)
        for dx in (-.22, 0, .22):
            for dy in (-.08, -.28):
                canvas.circle(cx + s * dx, cy + s * dy, line * .65, fill=1, stroke=0)
    elif name == "eye":
        path = canvas.beginPath()
        path.moveTo(left, cy)
        path.curveTo(cx - s * .23, top - s * .05, cx + s * .23, top - s * .05, right, cy)
        path.curveTo(cx + s * .23, bottom + s * .05, cx - s * .23, bottom + s * .05, left, cy)
        canvas.drawPath(path, fill=0, stroke=1)
        canvas.circle(cx, cy, s * .13, fill=0, stroke=1)
    elif name == "speech":
        canvas.roundRect(left, cy - s * .18, s, s * .62, s * .13, fill=0, stroke=1)
        path = canvas.beginPath()
        path.moveTo(cx - s * .18, cy - s * .18)
        path.lineTo(cx - s * .30, bottom)
        path.lineTo(cx + s * .02, cy - s * .18)
        canvas.drawPath(path, fill=0, stroke=1)
        for dx in (-.22, 0, .22):
            canvas.circle(cx + s * dx, cy + s * .1, line * .7, fill=1, stroke=0)
    elif name == "heart":
        path = canvas.beginPath()
        path.moveTo(cx, bottom + s * .08)
        path.curveTo(left + s * .02, cy - s * .1, left + s * .03, top - s * .17, cx, cy + s * .16)
        path.curveTo(right - s * .03, top - s * .17, right - s * .02, cy - s * .1, cx, bottom + s * .08)
        canvas.drawPath(path, fill=0, stroke=1)
    elif name == "home":
        canvas.line(left, cy + s * .02, cx, top)
        canvas.line(cx, top, right, cy + s * .02)
        canvas.line(left + s * .12, cy + s * .02, left + s * .12, bottom)
        canvas.line(left + s * .12, bottom, right - s * .12, bottom)
        canvas.line(right - s * .12, bottom, right - s * .12, cy + s * .02)
        canvas.roundRect(cx - s * .10, bottom, s * .20, s * .35, s * .02, fill=0, stroke=1)
    elif name in {"hospital", "bed"}:
        canvas.line(left, bottom, left, cy + s * .12)
        canvas.line(left, cy + s * .12, right, cy + s * .12)
        canvas.line(right, cy + s * .12, right, bottom)
        canvas.roundRect(left + s * .07, cy + s * .12, s * .32, s * .20, s * .04, fill=0, stroke=1)
        canvas.line(left, cy + s * .38, left, bottom)
    elif name == "pill":
        canvas.roundRect(left + s * .08, cy - s * .18, s * .84, s * .36, s * .18, fill=0, stroke=1)
        canvas.line(cx, cy - s * .18, cx, cy + s * .18)
    elif name == "walking":
        canvas.circle(cx, top - s * .08, s * .09, fill=0, stroke=1)
        canvas.line(cx, top - s * .18, cx, cy)
        canvas.line(cx, cy, cx - s * .25, bottom)
        canvas.line(cx, cy, cx + s * .27, bottom)
        canvas.line(cx, cy + s * .12, cx - s * .28, cy)
        canvas.line(cx, cy + s * .12, cx + s * .27, cy + s * .25)
    elif name == "document":
        canvas.roundRect(left + s * .08, bottom, s * .84, s, s * .05, fill=0, stroke=1)
        for dy in (.22, 0, -.22):
            canvas.line(cx - s * .25, cy + s * dy, cx + s * .25, cy + s * dy)
    elif name == "people":
        for dx, scale in ((-.25, .75), (.25, .75), (0, 1.0)):
            canvas.circle(cx + s * dx, cy + s * .22, s * .10 * scale, fill=0, stroke=1)
            canvas.arc(cx + s * dx - s * .18 * scale, bottom, cx + s * dx + s * .18 * scale, cy + s * .18, 10, 160)
    elif name == "warning":
        path = canvas.beginPath()
        path.moveTo(cx, top)
        path.lineTo(left, bottom)
        path.lineTo(right, bottom)
        path.close()
        canvas.drawPath(path, fill=0, stroke=1)
        canvas.line(cx, cy + s * .18, cx, cy - s * .14)
        canvas.circle(cx, cy - s * .29, line * .7, fill=1, stroke=0)
    elif name == "question":
        canvas.setFont("Georgia-Bold", s * .82)
        canvas.drawCentredString(cx, cy - s * .28, "?")
    else:
        canvas.arc(left, bottom, right, top, 75, 210)
        points = [(-.12, .18), (.08, .27), (.22, .08), (.08, -.08), (-.13, -.06)]
        for ox, oy in points:
            canvas.circle(cx + s * ox, cy + s * oy, line * .68, fill=1, stroke=0)
        path = canvas.beginPath()
        path.moveTo(cx - s * .12, cy + s * .18)
        for ox, oy in points[1:]:
            path.lineTo(cx + s * ox, cy + s * oy)
        path.close()
        canvas.drawPath(path, fill=0, stroke=1)

    canvas.restoreState()


def build_styles(kind: str) -> dict[str, ParagraphStyle]:
    sample = getSampleStyleSheet()
    body_size = 12.0 if kind == "family" else 9.15
    leading = 14.4 if kind == "family" else 11.05
    return {
        "body": ParagraphStyle(
            "body",
            parent=sample["BodyText"],
            fontName="Arial",
            fontSize=body_size,
            leading=leading,
            textColor=NAVY,
            spaceAfter=4.5,
            alignment=TA_LEFT,
            allowWidows=0,
            allowOrphans=0,
        ),
        "section": ParagraphStyle(
            "section",
            fontName="Georgia-Bold",
            fontSize=13.6 if kind == "family" else 11.2,
            leading=15 if kind == "family" else 13.5,
            textColor=NAVY,
            spaceBefore=7,
            spaceAfter=4,
            keepWithNext=True,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            fontName="Arial",
            fontSize=body_size,
            leading=leading,
            textColor=NAVY,
            leftIndent=0,
            spaceAfter=1.4,
            allowWidows=0,
            allowOrphans=0,
        ),
        "safety": ParagraphStyle(
            "safety",
            fontName="Arial",
            fontSize=body_size - 0.2,
            leading=leading,
            textColor=NAVY,
            spaceAfter=0,
        ),
        "sources": ParagraphStyle(
            "sources",
            fontName="Arial",
            fontSize=8.0 if kind == "family" else 7.15,
            leading=9.4 if kind == "family" else 8.55,
            textColor=NAVY_SOFT,
            spaceAfter=1,
        ),
        "note": ParagraphStyle(
            "note",
            fontName="Arial",
            fontSize=7.8 if kind == "family" else 6.95,
            leading=9.2 if kind == "family" else 8.35,
            textColor=NAVY_SOFT,
        ),
    }


def safety_box(text: str, style: ParagraphStyle, pale: colors.Color) -> Table:
    content = Paragraph(inline_markup(text), style)
    table = Table([[content]], colWidths=[None], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), pale),
                ("BOX", (0, 0), (-1, -1), 1.2, NAVY),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    table.spaceBefore = 5
    table.spaceAfter = 6
    return table


def section_flowables(section: Section, styles: dict[str, ParagraphStyle], pale: colors.Color) -> list[Flowable]:
    flowables: list[Flowable] = []
    if section.heading:
        flowables.append(Paragraph(html.escape(section.heading), styles["section"]))
    is_sources = section.heading.lower().startswith("verified")
    for block_type, data in section.blocks:
        if block_type == "paragraph":
            style = styles["sources"] if is_sources else styles["body"]
            flowables.append(Paragraph(inline_markup(str(data)), style))
        elif block_type == "bullets":
            bullet_style = styles["sources"] if is_sources else styles["bullet"]
            items = [ListItem(Paragraph(inline_markup(item), bullet_style), leftIndent=7) for item in data]
            flowables.append(
                ListFlowable(
                    items,
                    bulletType="bullet",
                    start="circle",
                    bulletFontName="Arial-Bold",
                    bulletFontSize=5.5 if is_sources else 7,
                    bulletColor=BLUE,
                    leftIndent=11,
                    bulletOffsetY=1,
                    spaceAfter=3,
                )
            )
        elif block_type == "safety":
            flowables.append(safety_box(str(data), styles["safety"], pale))
    return flowables


def build_pdf(sheet: Sheet, output_path: Path) -> int:
    accent = ACCENTS[(sheet.index - 1) % len(ACCENTS)]
    pale = PALES[(sheet.index - 1) % len(PALES)]
    styles = build_styles(sheet.kind)
    doc = SheetDocTemplate(str(output_path), sheet, accent, pale)
    story: list[Flowable] = []
    for section in sheet.sections:
        section_items = section_flowables(section, styles, pale)
        if len(section_items) <= 3:
            story.append(KeepTogether(section_items))
        else:
            story.extend(section_items)
    disclosure = (
        "<b>Use and review:</b> UK-focused general education. This resource supports but does not replace "
        "clinical assessment, individual advice or current local guidance. Prepared from source materials curated "
        "by Professor Alasdair MacLullich, University of Edinburgh; AI-assisted production. Professor MacLullich "
        "led development of the 4AT and reports no financial interest in its uptake. Final named human clinical "
        "approval is required before use in patient care. Independent resource; not an official University of "
        "Edinburgh or NHS publication."
    )
    story.extend([Spacer(1, 4), Paragraph(disclosure, styles["note"])])
    doc.build(story)
    return len(PdfReader(str(output_path)).pages)


def main() -> None:
    register_fonts()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    all_sheets = parse_master(ROOT / "content" / "family-sheets.md", "family")
    all_sheets += parse_master(ROOT / "content" / "professional-sheets.md", "professional")
    all_sheets += parse_master(ROOT / "content" / "additional-sheets.md", "additional")
    if len(all_sheets) != 25:
        raise SystemExit(f"Expected 25 sheets, found {len(all_sheets)}")

    counts: list[tuple[str, int]] = []
    for sheet in all_sheets:
        output_path = OUTPUT_DIR / f"{sheet.slug}.pdf"
        page_count = build_pdf(sheet, output_path)
        shutil.copy2(output_path, PUBLIC_DIR / output_path.name)
        counts.append((sheet.slug, page_count))

    print(f"Generated {len(counts)} PDFs")
    for slug, page_count in counts:
        print(f"{slug}: {page_count} page{'s' if page_count != 1 else ''}")


if __name__ == "__main__":
    main()
