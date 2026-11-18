# History Studio — animated history documentaries

Studio for an animated US-history YouTube channel, set up following the "Animated History Documentaries" guide.
House style: **Ink & Amber**. Cut-paper illustrations on newsprint, with an ink-brown, cream and molasses-amber palette. All art is drawn in code, so every video looks the same.

## What's installed (all inside this folder)
| Tool | What it does | How to run |
|---|---|---|
| HyperFrames 0.9.63 (`node_modules`) | Renders the HTML scenes to MP4 | `npx hyperframes render <project>/build -o out.mp4` |
| GSAP 3 | Scene animation (timelines are paused and seeked by HyperFrames) | bundled into each build |
| Kokoro TTS (`.venv`, `models/`) | Narration voice, local and free (`bm_george`) | `.venv/bin/python tools/voice_scenes.py <project>` |
| faster-whisper (`.venv`) | Word timings. Its model is downloaded from Hugging Face, which this cloud sandbox blocks, so `voice_scenes.py` takes sentence timings straight from the synthesized audio instead | — |
| ffmpeg | Audio and video helpers | system |
| Fonts | Playfair Display, Oswald, Special Elite (`@fontsource`) | bundled into each build |

Setup on a new machine:
```
npm install
python3 -m venv .venv && .venv/bin/pip install kokoro-onnx==0.6.1 soundfile faster-whisper pillow
mkdir -p models && cd models && for f in kokoro-v1.0.onnx voices-v1.0.bin; do curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f; done
```

## Layout
- `lib/inkamber.mjs` — the channel's illustration library: rowhouses, skyline, tank, elevated railway, people, ships, waves, maps, documents, stamps, chapter cards. Reuse it in every video.
- `lib/build.mjs` — turns `scenes.json` (narration plus timings) and `scenes.mjs` (the scene builders) into a HyperFrames composition. It inserts the chapter cards and writes `captions.srt`, `chapters.txt` and `timeline.json`.
- `lib/assets/` — paper texture, grain and vignette (made by `tools/paper.py`).
- `tools/voice_scenes.py` — voices each scene sentence by sentence and records the timings.
- `tools/music.py` — generates an original ambient music bed, the chapter sting and the sound effects with numpy.
- `<video>/` — one folder per video: `script.md`, `scenes.mjs`, `audio/`, `build/`, `output/`, `thumbnail/`, `youtube-package.md`.

## Making a video
1. Write `<video>/script.md`, with one `## sNN name` block per scene and a sources section at the end.
2. Split it into `scenes.json`; see how `molasses-flood` was split.
3. `.venv/bin/python tools/voice_scenes.py <video> bm_george 0.95`
4. `.venv/bin/python tools/music.py <video>/audio <seconds>`
5. Write `<video>/scenes.mjs`. Use `A.cue('word')` to time animations to the narration.
6. `node lib/build.mjs <video>`, then storyboard it with `npx hyperframes snapshot <video>/build --at ...`
7. `npx hyperframes render <video>/build -o <video>/output/film.mp4 -q looks -w 4`
