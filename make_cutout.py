"""Cut Jolly (hatch.jpg) out of its white background -> transparent PNG."""
from PIL import Image, ImageFilter
from collections import deque

SRC = "/home/hatch/assets/avatar/reference/hatch.jpg"
DST = "/home/hatch/workspace/study-timer-desktop/jolly.png"

im = Image.open(SRC).convert("RGB")
W, H = im.size
px = im.load()

# A pixel counts as "background-like" if it is bright and nearly grey.
def is_bg(r, g, b):
    return min(r, g, b) > 232 and (max(r, g, b) - min(r, g, b)) < 14

# Flood fill from all four borders through background-like pixels.
mask = bytearray(W * H)  # 1 = background
q = deque()
for x in range(W):
    for y in (0, H - 1):
        if is_bg(*px[x, y]) and not mask[y * W + x]:
            mask[y * W + x] = 1
            q.append((x, y))
for y in range(H):
    for x in (0, W - 1):
        if is_bg(*px[x, y]) and not mask[y * W + x]:
            mask[y * W + x] = 1
            q.append((x, y))
while q:
    x, y = q.popleft()
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < W and 0 <= ny < H and not mask[ny * W + nx]:
            r, g, b = px[nx, ny]
            if is_bg(r, g, b):
                mask[ny * W + nx] = 1
                q.append((nx, ny))

# Build alpha: background -> 0, character -> 255, then soften the edge.
alpha = Image.new("L", (W, H), 0)
ap = alpha.load()
for y in range(H):
    for x in range(W):
        if not mask[y * W + x]:
            ap[x, y] = 255
alpha = alpha.filter(ImageFilter.GaussianBlur(1.2))

out = Image.new("RGBA", (W, H))
out.paste(im, (0, 0))
out.putalpha(alpha)

# Crop off the floor shadow band at the bottom (feet end ~94% down).
out = out.crop((0, 0, W, int(H * 0.945)))
out = out.resize((800, 756), Image.LANCZOS)
out.save(DST)
print("saved", DST, out.size)
