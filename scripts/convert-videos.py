#!/usr/bin/env python3
"""Convert videos (.mov, HEVC, ...) to web-friendly H.264 MP4 with ffmpeg.

Every browser plays the output: H.264 High profile, yuv420p, AAC audio,
and the moov atom at the front (+faststart) so playback starts before the
whole file has downloaded. Each output goes next to its source with a
.mp4 extension, or into --out-dir. An .mp4 source is re-encoded only when
--out-dir points somewhere else.

Usage:
    python3 scripts/convert-videos.py images/projects/shortform-poc/*.mov
    python3 scripts/convert-videos.py images/projects --crf 26 --force
    python3 scripts/convert-videos.py big/demo.mp4 --out-dir images/projects/x --crf 28
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

SOURCE_EXTS = {".mov", ".m4v", ".mkv", ".avi", ".webm"}


def find_sources(paths, include_mp4=False):
    exts = SOURCE_EXTS | ({".mp4"} if include_mp4 else set())
    for p in map(Path, paths):
        if p.is_dir():
            yield from sorted(f for f in p.rglob("*") if f.suffix.lower() in exts)
        elif p.is_file():
            yield p
        else:
            print(f"skip: {p} not found", file=sys.stderr)


def convert(src: Path, crf: int, max_side: int, force: bool, out_dir: Path = None) -> bool:
    dst = (out_dir / src.name if out_dir else src).with_suffix(".mp4")
    if dst.resolve() == src.resolve():
        print(f"skip: {src} is already .mp4 (use --out-dir to re-encode it)")
        return True
    if dst.exists() and not force and dst.stat().st_mtime >= src.stat().st_mtime:
        print(f"skip: {dst} is up to date (use --force to redo)")
        return True

    # Fit the long side within max_side, never upscale, keep even dimensions.
    scale = (
        f"scale='if(gte(iw,ih),min(iw,{max_side}),-2)':'if(gte(iw,ih),-2,min(ih,{max_side}))'"
    )
    cmd = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-i", str(src),
        "-map", "0:v:0", "-map", "0:a:0?",
        "-vf", scale,
        "-c:v", "libx264", "-preset", "slow", "-crf", str(crf),
        "-profile:v", "high", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart",
        "-map_metadata", "-1",
        str(dst),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"FAIL: {src}\n{result.stderr.strip()}", file=sys.stderr)
        dst.unlink(missing_ok=True)
        return False

    before, after = src.stat().st_size, dst.stat().st_size
    print(f"ok:   {src.name} -> {dst.name}  {before / 1e6:.1f} MB -> {after / 1e6:.1f} MB")
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("paths", nargs="+", help="video files or folders to search")
    parser.add_argument("--crf", type=int, default=23, help="x264 quality, lower is better (default 23)")
    parser.add_argument("--max-side", type=int, default=1280, help="max width/height in px (default 1280)")
    parser.add_argument("--force", action="store_true", help="overwrite existing .mp4 files")
    parser.add_argument("--out-dir", type=Path, help="write outputs here instead of next to the sources")
    args = parser.parse_args()

    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg not found. Install it with: brew install ffmpeg")

    sources = list(find_sources(args.paths, include_mp4=bool(args.out_dir)))
    if not sources:
        sys.exit("no videos found")

    if args.out_dir:
        args.out_dir.mkdir(parents=True, exist_ok=True)
    ok = all([convert(s, args.crf, args.max_side, args.force, args.out_dir) for s in sources])
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
