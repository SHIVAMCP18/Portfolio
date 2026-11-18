"""Generate an original ambient score bed + simple SFX with numpy (no samples, no downloads).
Usage: music.py <out_dir> <seconds>"""
import sys, numpy as np, soundfile as sf
out, secs = sys.argv[1], float(sys.argv[2]); SR = 44100
rng = np.random.default_rng(3)
def lp(x, a):  # one-pole low-pass
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
def note(f, d, amp=1.0):
    t = np.arange(int(d * SR)) / SR
    w = sum(np.sin(2 * np.pi * f * h * t * (1 + 0.0007 * k)) / h for k, h in enumerate([1, 2, 3, 4, 5])) + 0.5 * np.sin(2 * np.pi * f * 0.5 * t)
    env = np.minimum(1, t / 2.5) * np.minimum(1, (d - t) / 2.5)
    return w * env * amp
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
prog = [[50, 57, 62, 65], [46, 53, 58, 62], [41, 53, 57, 60], [48, 55, 60, 64]]  # Dm Bb F C
seg = 9.0; n = int(secs * SR) + SR * 4
bed = np.zeros(n)
i = 0; pos = 0
while pos < n:
    ch = prog[i % 4]; buf = sum(note(hz(m), seg + 3, 0.22 if m > 55 else 0.35) for m in ch)
    end = min(n, pos + len(buf)); bed[pos:end] += buf[:end - pos]; pos += int(seg * SR); i += 1
bed = np.convolve(bed, np.ones(40) / 40, mode='same')
# slow swell + soft high shimmer
t = np.arange(n) / SR
bed *= 0.75 + 0.25 * np.sin(2 * np.pi * t / 23)
bed += 0.02 * lp(rng.normal(0, 1, n), 0.02)
bed = bed / np.max(np.abs(bed)) * 0.5
fade = int(4 * SR); bed[:fade] *= np.linspace(0, 1, fade); bed[-fade:] *= np.linspace(1, 0, fade)
sf.write(f"{out}/music.wav", np.stack([bed, np.roll(bed, 300)], 1).astype(np.float32), SR)
# chapter sting: low boom + bell
d = 2.8; tt = np.arange(int(d * SR)) / SR
boom = np.sin(2 * np.pi * 55 * tt * (1 - 0.15 * tt)) * np.exp(-tt * 2.2)
bell = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) for f, k in [(hz(74), 1.6), (hz(81), 2.0), (hz(86) * 1.003, 2.6)]) * 0.25
s = (boom * 0.8 + bell) ; s = s / np.max(np.abs(s)) * 0.8
sf.write(f"{out}/sting.wav", s.astype(np.float32), SR)
# rivets popping: accelerating clicks, then deep rumble
d = 7.0; tt = np.arange(int(d * SR)) / SR; x = np.zeros_like(tt)
times = np.cumsum(np.geomspace(0.28, 0.035, 34)); times = times[times < 2.6]
for tm in times:
    k = int(tm * SR); L = int(0.03 * SR); c = rng.normal(0, 1, L) * np.exp(-np.arange(L) / (0.004 * SR)); x[k:k + L] += c * 0.9
rum = lp(rng.normal(0, 1, len(tt)), 0.01) * 6
env = np.clip((tt - 2.2) / 0.4, 0, 1) * np.exp(-np.clip(tt - 2.6, 0, None) * 0.55)
x += rum * env + np.sin(2 * np.pi * 38 * tt) * env * 0.5
x = x / np.max(np.abs(x)) * 0.9
sf.write(f"{out}/collapse.wav", x.astype(np.float32), SR)
# wave rush: filtered noise swell
d = 6.0; tt = np.arange(int(d * SR)) / SR
w = lp(rng.normal(0, 1, len(tt)), 0.05) * np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 0.7
sf.write(f"{out}/rush.wav", (w / np.max(np.abs(w)) * 0.7).astype(np.float32), SR)
print("ok")
