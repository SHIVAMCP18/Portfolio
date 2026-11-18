"""Voice text with Kokoro. Usage: tts.py <text_file> <out.wav> [voice] [speed]
Text file: paragraphs separated by blank lines; each is synthesized and joined with a pause."""
import sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
src, out = sys.argv[1], sys.argv[2]
voice = sys.argv[3] if len(sys.argv) > 3 else "bm_george"
speed = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
paras = [p.strip().replace("\n", " ") for p in open(src).read().split("\n\n") if p.strip()]
chunks, sr = [], 24000
for i, p in enumerate(paras):
    a, sr = k.create(p, voice=voice, speed=speed, lang="en-us")
    chunks += [a, np.zeros(int(sr * 0.55), dtype=a.dtype)]
    print(f"{i+1}/{len(paras)}", flush=True)
sf.write(out, np.concatenate(chunks), sr)
