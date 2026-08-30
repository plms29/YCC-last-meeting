# -*- coding: utf-8 -*-
"""
Quan sat vien (The Observer) - pixel art generator.
Ve o do phan giai goc roi phong to bang NEAREST => pixel sac canh, khong khu rang cua.
Palette bam dung design system trong SPEC muc 4.
"""
import random
from PIL import Image, ImageDraw

# ---- Palette (SPEC muc 4) ----
VOID    = (5, 6, 14)
ORBIT   = (14, 20, 48)
HELMET  = (232, 236, 245)
HELM_SH = (183, 191, 212)
SUIT    = (43, 74, 155)
SUIT_D  = (24, 41, 97)
NAVY    = (13, 20, 52)
FACE    = (170, 177, 206)
FACE_L  = (208, 214, 231)
BODY    = (169, 175, 219)
BODY_SH = (139, 146, 195)
SIGNAL  = (79, 209, 197)
ALARM   = (228, 87, 46)
DUST    = (107, 117, 148)
YEL     = (242, 194, 48)
RED     = (228, 87, 46)
GRN     = (63, 169, 107)
BLU     = (43, 74, 155)
YCC4    = [YEL, RED, GRN, BLU]

SW, SH = 44, 52  # kich thuoc sprite goc


def _sparkle_eye(d, cx, cy):
    """Mat hinh oval navy voi tia sang 4 canh o giua."""
    d.ellipse([cx - 2, cy - 3, cx + 2, cy + 3], fill=NAVY)
    for px, py in [(cx, cy), (cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)]:
        d.point((px, py), fill=HELMET)


def observer(pose="idle"):
    """Sprite 44x52 RGBA. pose: idle | up | cake"""
    im = Image.new("RGBA", (SW, SH), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    # --- tay (ve truoc de nam sau than) ---
    if pose == "up":
        arms = [(2, 24, 12, 36), (32, 24, 42, 36)]
        cuffs = [(3, 33, 11, 36), (33, 33, 41, 36)]
    elif pose == "cake":
        arms = [(5, 36, 14, 47), (30, 36, 39, 47)]
        cuffs = [(6, 36, 13, 39), (31, 36, 38, 39)]
    else:
        arms = [(1, 32, 13, 48), (31, 32, 43, 48)]
        cuffs = [(2, 33, 12, 36), (32, 33, 42, 36)]
    for a in arms:
        d.ellipse(a, fill=BODY, outline=NAVY)
    for c in cuffs:
        d.rectangle(c, fill=SUIT)

    # --- than ---
    d.ellipse([9, 28, 35, 51], fill=BODY, outline=NAVY)
    d.ellipse([17, 37, 27, 46], fill=SUIT, outline=NAVY)     # tam nguc
    d.rectangle([21, 40, 23, 42], fill=SIGNAL)               # den tin hieu

    # --- ang ten + hop dieu khien ---
    d.rectangle([6, 8, 7, 19], fill=HELM_SH)
    d.rectangle([5, 5, 8, 8], fill=HELMET, outline=NAVY)
    d.rectangle([34, 14, 38, 24], fill=HELM_SH, outline=NAVY)
    d.rectangle([35, 16, 37, 17], fill=SIGNAL)
    d.rectangle([35, 20, 37, 21], fill=ALARM)

    # --- mu phi hanh gia ---
    d.ellipse([8, 2, 36, 33], fill=HELMET, outline=NAVY)
    d.ellipse([11, 6, 33, 30], fill=SUIT_D, outline=NAVY)    # mu trum navy trong kinh
    d.arc([10, 4, 24, 20], 140, 250, fill=(255, 255, 255))   # bat sang tren kinh

    # --- mat ---
    d.ellipse([14, 11, 30, 29], fill=FACE)
    d.ellipse([14, 20, 30, 29], fill=FACE_L)
    _sparkle_eye(d, 19, 18)
    _sparkle_eye(d, 26, 18)
    mouth = [21, 22, 23, 26] if pose == "idle" else [21, 22, 23, 25]
    d.ellipse(mouth, fill=NAVY)

    # --- co ao ---
    d.rectangle([16, 31, 28, 33], fill=SUIT, outline=NAVY)
    return im


def cake():
    """Banh sinh nhat 18x14."""
    im = Image.new("RGBA", (18, 16), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle([1, 7, 16, 15], fill=HELMET, outline=NAVY)
    d.rectangle([1, 10, 16, 12], fill=YEL)
    d.rectangle([5, 3, 6, 7], fill=RED)      # nen 1
    d.rectangle([11, 3, 12, 7], fill=BLU)    # nen 8
    for x in (5, 11):
        d.point((x, 2), fill=YEL)
        d.point((x, 1), fill=(255, 236, 170))
    return im


# ---------------- nen ----------------

def starfield(im, seed=7, density=0.00035, px=2, colors=None):
    colors = colors or [HELMET, HELMET, DUST, SIGNAL]
    rnd = random.Random(seed)
    d = ImageDraw.Draw(im)
    w, h = im.size
    for _ in range(int(w * h * density)):
        x, y = rnd.randrange(0, w - px), rnd.randrange(0, h - px)
        c = rnd.choice(colors)
        a = rnd.choice([70, 110, 160, 220, 255])
        d.rectangle([x, y, x + px - 1, y + px - 1],
                    fill=tuple(int(VOID[i] + (c[i] - VOID[i]) * a / 255) for i in range(3)))
    return im


def gradient_bg(w, h, top=VOID, bottom=ORBIT, bands=14):
    im = Image.new("RGB", (w, h), top)
    d = ImageDraw.Draw(im)
    for i in range(bands):  # chia dai mau thanh bang => cam giac 8-bit
        y0, y1 = h * i // bands, h * (i + 1) // bands
        t = i / max(1, bands - 1)
        d.rectangle([0, y0, w, y1], fill=tuple(int(top[j] + (bottom[j] - top[j]) * t) for j in range(3)))
    return im


def paste_sprite(bg, sprite, scale, cx, cy):
    s = sprite.resize((sprite.width * scale, sprite.height * scale), Image.NEAREST)
    bg.paste(s, (cx - s.width // 2, cy - s.height // 2), s)
    return bg
