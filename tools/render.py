# -*- coding: utf-8 -*-
"""Sinh toan bo bo anh Quan sat vien vao art/ ."""
import math, os, random, sys
sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image, ImageDraw, ImageChops
from mascot import *

OUT = os.path.join(os.path.dirname(__file__), "..", "art")
os.makedirs(OUT, exist_ok=True)
def save(im, name):
    im.convert("RGB").save(os.path.join(OUT, name)); print("->", name, im.size)

def pixelate(im, factor):
    w, h = im.size
    return im.resize((w // factor, h // factor), Image.BILINEAR).resize((w, h), Image.NEAREST)

def moon(bg, cx, cy, r, seed=11):
    d = ImageDraw.Draw(bg); rnd = random.Random(seed)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(58, 63, 82))
    for _ in range(46):
        a, dist = rnd.uniform(0, 6.28), rnd.uniform(0, r * .88)
        cr = rnd.randrange(r // 26 + 2, r // 9 + 4)
        x, y = cx + math.cos(a) * dist, cy + math.sin(a) * dist
        d.ellipse([x - cr, y - cr, x + cr, y + cr], fill=(46, 51, 69))
    d.arc([cx - r, cy - r, cx + r, cy + r], 0, 360, fill=(78, 84, 106), width=3)

def earth_limb(bg, w, h):
    d = ImageDraw.Draw(bg)
    r = int(w * 1.05); cx, cy = w // 2, h + int(r * 0.55)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(17, 44, 72))
    d.arc([cx - r, cy - r, cx + r, cy + r], 180, 360, fill=SIGNAL, width=4)
    d.arc([cx - r - 10, cy - r - 10, cx + r + 10, cy + r + 10], 195, 345, fill=(34, 86, 110), width=3)

# ---------- 1. astronaut.png ----------
def hero():
    W = 640
    bg = gradient_bg(W, W); starfield(bg, seed=3, density=0.00045)
    moon(bg, 120, 70, 105)
    paste_sprite(bg, observer("idle"), 11, W // 2, W // 2 + 20)
    save(pixelate(bg, 2), "astronaut.png")

# ---------- 2. astronaut-small.png ----------
def small():
    W = 160
    bg = gradient_bg(W, W, bands=6); starfield(bg, seed=9, density=0.0006, px=2)
    head = observer("idle").crop((4, 0, 40, 33))
    paste_sprite(bg, head, 4, W // 2, W // 2 + 4)
    save(bg, "astronaut-small.png")

# ---------- 3. slide-boi-canh.png ----------
def boi_canh():
    W, H = 1920, 1080
    bg = gradient_bg(W, H); starfield(bg, seed=21, density=0.00040)
    earth_limb(bg, W, H)
    d = ImageDraw.Draw(bg)
    for i in range(0, 640, 16):                        # day noi keo dai ve goc toi
        x = 1400 - i; y = 400 + int(math.sin(i / 90) * 26) + i // 6
        d.rectangle([x, y, x + 7, y + 7], fill=(74, 84, 118))
    paste_sprite(bg, observer("idle"), 12, 1420, 380)
    save(pixelate(bg, 2), "slide-boi-canh.png")

# ---------- 4. slide-nhieu.png ----------
def nhieu():
    W, H = 1920, 1080
    bg = gradient_bg(W, H, bands=8); starfield(bg, seed=33, density=0.00025)
    paste_sprite(bg, observer("idle"), 15, W // 2, H // 2)
    bg = pixelate(bg, 2)
    rnd = random.Random(4)

    r, g, b = bg.split()                                # lech kenh mau
    r = ImageChops.offset(r, 9, 0); b = ImageChops.offset(b, -7, 2)
    bg = Image.merge("RGB", (r, g, b))

    for _ in range(13):                                 # xe ngang tung dai
        y = rnd.randrange(0, H - 30); hh = rnd.randrange(5, 18)
        band = bg.crop((0, y, W, y + hh))
        bg.paste(ImageChops.offset(band, rnd.choice([-52, -26, -12, 14, 30, 62]), 0), (0, y))

    d = ImageDraw.Draw(bg)
    for _ in range(16):                                 # khoi pixel bi mat
        x, y = rnd.randrange(560, 1360), rnd.randrange(180, 900)
        d.rectangle([x, y, x + rnd.randrange(18, 90), y + rnd.randrange(8, 26)],
                    fill=rnd.choice([VOID, ORBIT, ALARM, SIGNAL]))
    for _ in range(190):                                # manh vo troi ra
        x, y = rnd.randrange(0, W), rnd.randrange(0, H)
        d.rectangle([x, y, x + 6, y + 6], fill=rnd.choice([BODY, HELMET, SUIT, ALARM]))
    for y in range(0, H, 8):                            # scanline
        d.line([(0, y), (W, y)], fill=(2, 3, 8))
    save(bg, "slide-nhieu.png")

# ---------- 5. slide-phep-tinh.png ----------
def phep_tinh():
    W, H = 1920, 1080
    bg = gradient_bg(W, H); starfield(bg, seed=44, density=0.00038)
    d = ImageDraw.Draw(bg)
    def plus(cx, cy, arm, s):                           # mot chom sao hinh dau cong
        pts = [(cx, cy), (cx - arm, cy), (cx + arm, cy), (cx, cy - arm), (cx, cy + arm)]
        for p in pts[1:]:
            d.line([pts[0], p], fill=(38, 92, 96), width=3)
        for (x, y) in pts:
            d.rectangle([x - s - 4, y - s - 4, x + s + 4, y + s + 4], fill=(24, 74, 80))
            d.rectangle([x - s, y - s, x + s, y + s], fill=SIGNAL)
    plus(1330, 235, 96, 9); plus(1520, 545, 112, 10); plus(1330, 855, 96, 9)
    paste_sprite(bg, observer("idle"), 13, 560, 560)
    save(pixelate(bg, 2), "slide-phep-tinh.png")

# ---------- 6. slide-reveal.png ----------
def reveal():
    W, H = 1920, 1080
    bg = gradient_bg(W, H, bands=8); starfield(bg, seed=55, density=0.00030)
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
    cx, cy = W // 2, H // 2
    for i in range(48):                                 # tia sang 4 mau logo YCC
        a0 = i * 7.5; c = YCC4[i % 4]
        od.pieslice([cx - 1500, cy - 1500, cx + 1500, cy + 1500], a0, a0 + 3.6, fill=c + (125,))
    bg = Image.alpha_composite(bg.convert("RGBA"), ov).convert("RGB")
    d = ImageDraw.Draw(bg)
    rnd = random.Random(6)
    for _ in range(150):                                # dom pixel 4 mau
        a, dist = rnd.uniform(0, 6.28), rnd.uniform(300, 900)
        x, y = cx + math.cos(a) * dist * 1.5, cy + math.sin(a) * dist
        s = rnd.choice([6, 8, 12])
        d.rectangle([x, y, x + s, y + s], fill=rnd.choice(YCC4))
    paste_sprite(bg, observer("up"), 13, cx, cy + 20)
    save(pixelate(bg, 2), "slide-reveal.png")

# ---------- 7. mascot-birthday.png ----------
def birthday():
    W = 640
    bg = gradient_bg(W, W); starfield(bg, seed=77, density=0.00045)
    d = ImageDraw.Draw(bg)
    rnd = random.Random(8)
    for _ in range(40):                                 # tan lua bay len
        x, y = rnd.randrange(180, 470), rnd.randrange(40, 330)
        d.rectangle([x, y, x + 4, y + 4], fill=rnd.choice([YEL, (255, 236, 170), ALARM]))
    sp = observer("cake")
    paste_sprite(bg, sp, 10, W // 2, W // 2 + 10)
    paste_sprite(bg, cake(), 10, W // 2, W - 160)
    save(pixelate(bg, 2), "mascot-birthday.png")

if __name__ == "__main__":
    hero(); small(); boi_canh(); nhieu(); phep_tinh(); reveal(); birthday()
