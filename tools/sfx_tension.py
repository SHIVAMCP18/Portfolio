"""Extra original SFX for tense documentaries (numpy only).
Usage: sfx_tension.py <out_dir>  -> heartbeat.wav, tick.wav, siren.wav, bell.wav"""
import sys, numpy as np, soundfile as sf
out = sys.argv[1]; SR = 44100; rng = np.random.default_rng(5)
def env(n, a, d): x = np.arange(n) / SR; return np.minimum(1, x / a) * np.exp(-x / d)
# heartbeat: lub-dub every 1.1 s, 30 s
d = 30; hb = np.zeros(d * SR)
for k in np.arange(0.3, d - 1, 1.1):
    for off, amp in [(0, 1.0), (0.24, 0.7)]:
        st = int((k + off) * SR); n = int(0.25 * SR); x = np.arange(n) / SR
        hb[st:st + n] += amp * np.sin(2 * np.pi * 48 * x * (1 - 0.3 * x)) * env(n, 0.005, 0.07)
sf.write(f"{out}/heartbeat.wav", (hb / np.abs(hb).max() * 0.8).astype(np.float32), SR)
# clock tick, 30 s
tk = np.zeros(d * SR)
for k in np.arange(0.2, d - 0.5, 1.0):
    st = int(k * SR); n = int(0.03 * SR)
    tk[st:st + n] += rng.normal(0, 1, n) * env(n, 0.0005, 0.006)
    st2 = int((k + 0.5) * SR); tk[st2:st2 + n] += 0.6 * rng.normal(0, 1, n) * env(n, 0.0005, 0.005)
tk = np.convolve(tk, [1, -0.6], 'same')
sf.write(f"{out}/tick.wav", (tk / np.abs(tk).max() * 0.6).astype(np.float32), SR)
# distant siren (two-tone, filtered, far away), 20 s
d = 20; t = np.arange(d * SR) / SR
fq = np.where((t % 1.4) < 0.7, 660, 880); ph = 2 * np.pi * np.cumsum(fq) / SR
s = np.sin(ph) + 0.3 * np.sin(2 * ph)
acc = 0.0; y = np.empty_like(s)
for i in range(len(s)): acc += 0.08 * (s[i] - acc); y[i] = acc
y *= np.minimum(1, t / 3) * np.minimum(1, (d - t) / 3)
sf.write(f"{out}/siren.wav", (y / np.abs(y).max() * 0.5).astype(np.float32), SR)
# memorial bell, 8 s
d = 8; t = np.arange(d * SR) / SR
b = sum(a * np.sin(2 * np.pi * 220 * r * t) * np.exp(-t / (2.5 / r ** 0.5)) for r, a in [(1, 1), (2.0, 0.5), (2.76, 0.35), (5.4, 0.2)])
sf.write(f"{out}/bell.wav", (b / np.abs(b).max() * 0.7).astype(np.float32), SR)
print("sfx ok")
