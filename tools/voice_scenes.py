"""Voice every scene with Kokoro, sentence by sentence, and record timings.
Sentence timings are exact (measured from the synthesized audio); word timings are
interpolated inside each sentence by character count. Whisper alignment would replace
this when its model can be downloaded.
Usage: voice_scenes.py <project_dir> [voice] [speed]"""
import sys, re, json, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
proj = sys.argv[1]; voice = sys.argv[2] if len(sys.argv) > 2 else "bm_george"
speed = float(sys.argv[3]) if len(sys.argv) > 3 else 0.95
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
scenes = json.load(open(f"{proj}/scenes.json"))
import os
# optional pronunciation fixes: {"Written": "Spoken"} applied only to the TTS input, never to captions
PRON = json.load(open(f"{proj}/pron.json")) if os.path.exists(f"{proj}/pron.json") else {}
def say(t):
    for k, v in PRON.items(): t = re.sub(rf"\b{re.escape(k)}\b", v, t)
    return t
SR = 24000
def trim(a, thr=0.004):
    idx = np.where(np.abs(a) > thr)[0]
    return a[max(0, idx[0] - 600): idx[-1] + 2400] if len(idx) else a
for sc in scenes:
    sents = [s for s in re.split(r'(?<=[.?!])\s+', sc["text"]) if s]
    parts, t, words, sinfo = [np.zeros(int(SR * 0.3), np.float32)], 0.3, [], []
    for s in sents:
        a, _ = k.create(say(s), voice=voice, speed=speed, lang="en-us"); a = trim(a)
        d = len(a) / SR; sinfo.append({"text": s, "s": round(t, 2), "e": round(t + d, 2)})
        toks = s.split(); total = sum(len(x) + 1 for x in toks); c = 0
        for x in toks:
            ws = t + d * 0.04 + d * 0.92 * c / total; c += len(x) + 1
            words.append({"w": re.sub(r"[^\w'-]", "", x), "s": round(ws, 2), "e": round(t + d * 0.04 + d * 0.92 * c / total, 2)})
        gap = 0.45 if s.endswith("?") else 0.32
        parts += [a, np.zeros(int(SR * gap), np.float32)]; t += d + gap
    audio = np.concatenate(parts + [np.zeros(int(SR * 0.4), np.float32)])
    sf.write(f"{proj}/audio/{sc['id']}.wav", audio, SR)
    sc.update(audio_dur=round(len(audio) / SR, 3), sentences=sinfo, words=words)
    print(sc["id"], sc["audio_dur"], flush=True)
json.dump(scenes, open(f"{proj}/scenes.json", "w"), indent=1)
print("total", round(sum(s["audio_dur"] for s in scenes), 1), "s")
