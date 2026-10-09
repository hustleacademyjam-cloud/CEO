"""Cut the CEO photo out of its white background and add a sticker outline.

Usage: python3 scripts/cutout.py source/ceo-photo-original.png build/ceo-cutout.png
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.int16)

# Near-white, low-saturation pixels are background candidates.
mn, mx = a.min(axis=2), a.max(axis=2)
white = (mn > 238) & ((mx - mn) < 14)

# Keep only the white region connected to the image border (pearls, highlights stay).
cand = Image.fromarray(np.where(white, 255, 0).astype(np.uint8)).copy()
w, h = cand.size
border = [(x, 0) for x in range(0, w, 8)] + [(x, h - 1) for x in range(0, w, 8)]
border += [(0, y) for y in range(0, h, 8)] + [(w - 1, y) for y in range(0, h, 8)]
for seed in border:
    if cand.getpixel(seed) == 255:
        ImageDraw.floodfill(cand, seed, 128)
bg = np.asarray(cand) == 128

alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8))
# Close pinholes, then soften the edge by a couple of pixels.
alpha = alpha.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(3))
alpha = alpha.filter(ImageFilter.GaussianBlur(1.6))

rgba = im.copy()
rgba.putalpha(alpha)
bbox = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
rgba = rgba.crop(bbox)
rgba.save(out)
print("saved", out, rgba.size, "bbox", bbox)
