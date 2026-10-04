"""Generate the share card. Requires Pillow; the generated PNG is committed as a static asset."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "og-card.png"
FONT = Path("C:/Windows/Fonts/segoeui.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/segoeuib.ttf")


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT), size)


im = Image.new("RGB", (1200, 630), "#f7f8fa")
d = ImageDraw.Draw(im)
d.ellipse((680, -170, 1380, 530), outline="#e2e9fc", width=2)
d.ellipse((775, -75, 1285, 435), outline="#e2e9fc", width=2)
d.ellipse((870, 20, 1190, 340), outline="#e2e9fc", width=2)

# Brand mark and wordmark.
d.rounded_rectangle((71, 75, 78, 98), radius=3, fill="#3157e2")
d.rounded_rectangle((84, 64, 91, 98), radius=3, fill="#3157e2")
d.rounded_rectangle((97, 80, 104, 98), radius=3, fill="#3157e2")
d.text((120, 60), "altacod.", font=font(39, True), fill="#17213c")
d.line((70, 165, 99, 165), fill="#3157e2", width=3)
d.text((115, 151), "АВТОМАТИЗАЦИЯ ВОКРУГ 1С", font=font(19, True), fill="#3157e2")

headline = ["Меньше ручной", "работы. Больше", "контроля над", "бизнесом."]
for i, line in enumerate(headline):
    d.text((70, 205 + i * 68), line, font=font(60, True), fill="#15213a" if i < 3 else "#3157e2")
d.text((73, 510), "1С + интеграции + оперативная аналитика", font=font(21), fill="#56667f")

# A small product interface, built as vector shapes.
d.rounded_rectangle((790, 153, 1115, 492), radius=16, fill="#ffffff", outline="#dce4f1", width=2)
d.rounded_rectangle((790, 153, 1115, 211), radius=16, fill="#ffffff")
d.line((790, 211, 1115, 211), fill="#e8edf4", width=2)
d.rounded_rectangle((811, 171, 838, 198), radius=6, fill="#3157e2")
d.text((847, 170), "Altacod Radar", font=font(18, True), fill="#23314b")
d.text((813, 237), "ТРЕБУЕТ ВНИМАНИЯ", font=font(13, True), fill="#7788a4")
d.rounded_rectangle((811, 274, 1094, 340), radius=8, fill="#fff7ef", outline="#f1d9bd", width=1)
d.ellipse((826, 294, 843, 311), fill="#d48d50")
d.text((852, 284), "Заказ №731", font=font(18, True), fill="#26354f")
d.text((852, 311), "Маржа ниже цели", font=font(14), fill="#8e6a50")
d.rounded_rectangle((811, 350, 1094, 412), radius=8, fill="#f5f8ff", outline="#dce6fa", width=1)
d.ellipse((826, 373, 843, 390), fill="#4d73e3")
d.text((852, 360), "Товар AX-42", font=font(18, True), fill="#26354f")
d.text((852, 386), "Возможен дефицит", font=font(14), fill="#637a9c")
d.line((813, 440, 1092, 440), fill="#e8edf4", width=2)
d.ellipse((813, 459, 821, 467), fill="#48b37b")
d.text((833, 451), "Сигналы из текущих данных", font=font(14), fill="#6d7e93")

OUT.parent.mkdir(exist_ok=True)
im.save(OUT, optimize=True)
print(OUT)
