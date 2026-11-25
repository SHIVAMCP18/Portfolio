#!/usr/bin/env bash
# Make a YouTube-safe MP4 under 95 MB, verify it, push it to the history-studio branch, print the download link.
# Usage: tools/finalize.sh <master.mp4> <name-without-ext>
set -euo pipefail
IN="$1"; NAME="$2"; BR=/home/user/studio-branch; OUT="$BR/videos/$NAME.mp4"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
# video bitrate so that video+audio stays under ~90 MB
VB=$(python3 -c "print(int(min(6000, (90*8*1024)/float('$DUR') - 140)))")
echo "duration ${DUR}s → video ${VB}k"
mkdir -p "$BR/videos"; T=$(mktemp -d)
ffmpeg -v error -y -i "$IN" -c:v libx264 -preset slow -b:v ${VB}k -pass 1 -passlogfile "$T/p" -profile:v high -level 4.1 -pix_fmt yuv420p -r 30 -g 60 -an -f mp4 /dev/null
ffmpeg -v error -y -i "$IN" -c:v libx264 -preset slow -b:v ${VB}k -maxrate $((VB*2))k -bufsize $((VB*4))k -pass 2 -passlogfile "$T/p" -profile:v high -level 4.1 -pix_fmt yuv420p -r 30 -g 60 \
  -c:a aac -b:a 128k -ar 44100 -ac 2 -movflags +faststart -brand mp42 "$OUT"
rm -rf "$T"
ffmpeg -v error -i "$OUT" -f null - 2>&1 | head -3
SZ=$(stat -c %s "$OUT"); echo "size $((SZ/1048576)) MB, decode OK"
[ "$SZ" -lt 99000000 ] || { echo "too big for GitHub"; exit 1; }
cd "$BR"; git add -f "videos/$NAME.mp4"
git -c user.name="$(git -C /home/user/Portfolio log -1 --format=%an)" -c user.email="$(git -C /home/user/Portfolio log -1 --format=%ae)" commit -q -m "Add video: $NAME

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KDZkABbvSyZ1txBPiEYEwz"
for i in 1 2 3 4; do git push -q origin history-studio 2>/dev/null && break || sleep $((i*3)); done
git fetch -q origin history-studio && [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/history-studio)" ] && echo "PUSHED"
echo "DOWNLOAD: https://github.com/SHIVAMCP18/Portfolio/raw/history-studio/videos/$NAME.mp4"
echo "PAGE:     https://github.com/SHIVAMCP18/Portfolio/blob/history-studio/videos/$NAME.mp4"
