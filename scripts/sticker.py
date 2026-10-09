"""Scale the cutout and give it a sticker outline like the reference post.

Usage: python3 scripts/sticker.py build/ceo-cutout.png <height> <out.png>
Outline: solid light ring + a soft translucent halo, both from the brand's light surface (#ebf5f7).
The bottom edge is left open so the photo can bleed off the bottom of the canvas.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

src, height, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
RING, HALO = 12, 30  # px at output size
RING_RGB = (235, 245, 247)

im = Image.open(src).convert("RGBA")
w = round(im.width * height / im.height)
im = im.resize((w, height), Image.LANCZOS)

pad = RING + HALO + 4
canvas = Image.new("RGBA", (w + 2 * pad, height + pad), (0, 0, 0, 0))
canvas.alpha_composite(im, (pad, pad))
alpha = canvas.getchannel("A")

def grow(mask, r):
    m = np.asarray(mask.filter(ImageFilter.GaussianBlur(r / 2))).astype(float)
    m = np.clip((m - 10) * 4, 0, 255)  # threshold low so the shape grows ~r px, keep a soft edge
    return Image.fromarray(m.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))

ring = grow(alpha, RING * 1.6)
halo = grow(alpha, (RING + HALO) * 1.6)

result = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
halo_layer = Image.new("RGBA", canvas.size, RING_RGB + (0,))
halo_layer.putalpha(halo.point(lambda v: int(v * 0.22)))
result.alpha_composite(halo_layer)
ring_layer = Image.new("RGBA", canvas.size, RING_RGB + (0,))
ring_layer.putalpha(ring)
result.alpha_composite(ring_layer)
result.alpha_composite(canvas)
result.save(out)
print("saved", out, result.size, "pad", pad)
