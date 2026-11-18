"""Make the channel's newsprint paper texture (1920x1080) and a vignette overlay."""
import numpy as np
from PIL import Image, ImageFilter
rng = np.random.default_rng(7)
W, H = 1920, 1080
base = np.array([239, 228, 204], float)
n = rng.normal(0, 1, (H // 4, W // 4)); n = np.array(Image.fromarray(((n + 4) * 30).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(6)), float) / 255 - 0.5
fine = rng.normal(0, 1, (H, W)) * 0.035
fib = np.zeros((H, W))
for _ in range(900):
    x, y, l = rng.integers(0, W), rng.integers(0, H), rng.integers(10, 40)
    a = rng.uniform(0, np.pi); xs = (x + np.cos(a) * np.arange(l)).astype(int) % W; ys = (y + np.sin(a) * np.arange(l)).astype(int) % H
    fib[ys, xs] += rng.uniform(0.03, 0.08)
yy, xx = np.mgrid[0:H, 0:W]; d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
v = np.clip((d - 0.55) / 0.9, 0, 1) ** 1.6
tex = base[None, None, :] * (1 + n[..., None] * 0.10 + fine[..., None] - fib[..., None]) 
Image.fromarray(tex.clip(0, 255).astype(np.uint8)).save("lib/assets/paper.jpg", quality=92)
# overlay: grain + vignette as RGBA, multiplied on top of every scene
g = rng.normal(0, 1, (H, W)) * 10 + 128
alpha = np.clip(v * 150 + 10, 0, 255)
rgba = np.dstack([np.full((H, W), 43), np.full((H, W), 29), np.full((H, W), 20), alpha]).astype(np.uint8)
Image.fromarray(rgba, "RGBA").save("lib/assets/vignette.png")
grain = np.dstack([g, g, g, np.full((H, W), 22)]).clip(0, 255).astype(np.uint8)
Image.fromarray(grain, "RGBA").save("lib/assets/grain.png")
