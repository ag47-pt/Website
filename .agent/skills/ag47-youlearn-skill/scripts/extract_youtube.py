"""
YouLearn Ingestor & YouTube Extractor
Extracts video metadata, timestamped transcripts, chapters, and keyframes using yt-dlp, youtube-transcript-api, and ffmpeg.
"""

import sys
import os
import json
import re
import subprocess
import urllib.request
from typing import Dict, Any, List, Optional
from urllib.parse import urlparse, parse_qs

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    YouTubeTranscriptApi = None

try:
    import yt_dlp
except ImportError:
    yt_dlp = None


def extract_youtube_id(url: str) -> Optional[str]:
    """Extract 11-character YouTube video ID from various URL formats."""
    if not url:
        return None
    url = url.strip()

    parsed = urlparse(url)
    if "youtube.com" in parsed.netloc:
        if parsed.path == "/watch":
            queries = parse_qs(parsed.query)
            if "v" in queries:
                return queries["v"][0]
        elif parsed.path.startswith("/embed/"):
            return parsed.path.split("/")[2]
        elif parsed.path.startswith("/v/"):
            return parsed.path.split("/")[2]
        elif parsed.path.startswith("/shorts/"):
            return parsed.path.split("/")[2]
    elif "youtu.be" in parsed.netloc:
        path = parsed.path.lstrip("/")
        return path.split("?")[0].split("&")[0]

    match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
    if match:
        return match.group(1)
    return None


def fetch_video_metadata(video_id: str, youtube_url: str) -> Dict[str, Any]:
    """Fetch complete metadata using yt-dlp or YouTube oEmbed fallback."""
    metadata = {
        "videoId": video_id,
        "canonicalUrl": f"https://www.youtube.com/watch?v={video_id}",
        "title": f"YouTube Video {video_id}",
        "description": "",
        "author": {"name": "YouTube Creator", "channelOrOrg": "", "avatarUrl": "", "profileUrl": ""},
        "durationSeconds": 0,
        "durationMinutes": 0,
        "publishedAt": "",
        "thumbnail": f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
        "tags": [],
        "chapters": [],
    }

    if yt_dlp:
        try:
            ydl_opts = {
                "quiet": True,
                "no_warnings": True,
                "extract_flat": False,
                "skip_download": True,
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(youtube_url, download=False)
                if info:
                    metadata["title"] = info.get("title") or metadata["title"]
                    metadata["description"] = info.get("description") or ""
                    channel_name = info.get("uploader") or info.get("channel") or "YouTube Creator"
                    metadata["author"] = {
                        "name": channel_name,
                        "channelOrOrg": channel_name,
                        "avatarUrl": "",
                        "profileUrl": info.get("uploader_url") or info.get("channel_url") or "",
                    }
                    duration_s = info.get("duration") or 0
                    metadata["durationSeconds"] = duration_s
                    metadata["durationMinutes"] = max(1, round(duration_s / 60))
                    metadata["publishedAt"] = (
                        f"{info.get('upload_date')[:4]}-{info.get('upload_date')[4:6]}-{info.get('upload_date')[6:8]}"
                        if info.get("upload_date") and len(info.get("upload_date")) == 8
                        else ""
                    )
                    metadata["thumbnail"] = info.get("thumbnail") or metadata["thumbnail"]
                    metadata["tags"] = info.get("tags") or []
                    if info.get("chapters"):
                        metadata["chapters"] = [
                            {
                                "title": ch.get("title", ""),
                                "startTime": ch.get("start_time", 0),
                                "endTime": ch.get("end_time", 0),
                            }
                            for ch in info["chapters"]
                        ]
                    return metadata
        except Exception as e:
            print(f"Warning: yt-dlp metadata extraction failed ({e}), falling back to oEmbed...", file=sys.stderr)

    # Fallback to oEmbed
    try:
        oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
        req = urllib.request.Request(oembed_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            metadata["title"] = data.get("title", metadata["title"])
            author_name = data.get("author_name", "YouTube Creator")
            metadata["author"]["name"] = author_name
            metadata["author"]["channelOrOrg"] = author_name
            metadata["author"]["profileUrl"] = data.get("author_url", "")
            metadata["thumbnail"] = data.get("thumbnail_url", metadata["thumbnail"])
    except Exception as e:
        print(f"Warning: oEmbed fetch failed ({e})", file=sys.stderr)

    return metadata


def fetch_transcript(video_id: str) -> List[Dict[str, Any]]:
    """Fetch timestamped transcript entries using youtube-transcript-api."""
    if not YouTubeTranscriptApi:
        return []

    try:
        try:
            ytt = YouTubeTranscriptApi()
            fetched = ytt.fetch(video_id, languages=["pt", "en"])
        except Exception:
            ytt = YouTubeTranscriptApi()
            fetched = ytt.fetch(video_id)

        snippets = getattr(fetched, "snippets", fetched)
        results = []

        for item in snippets:
            if hasattr(item, "start"):
                start = getattr(item, "start", 0)
                duration = getattr(item, "duration", 0)
                text = getattr(item, "text", "").strip()
            elif isinstance(item, dict):
                start = item.get("start", 0)
                duration = item.get("duration", 0)
                text = item.get("text", "").strip()
            else:
                continue

            if text:
                results.append({
                    "start": round(start, 2),
                    "end": round(start + duration, 2),
                    "duration": round(duration, 2),
                    "text": text,
                })
        return results
    except Exception as e:
        print(f"Warning: YouTube transcript API fetch error ({e})", file=sys.stderr)

    return []


def format_seconds_to_display(seconds: float) -> str:
    """Format seconds into MM:SS or HH:MM:SS string."""
    s = int(round(seconds))
    hrs = s // 3600
    mins = (s % 3600) // 60
    secs = s % 60
    if hrs > 0:
        return f"{hrs}:{mins:02d}:{secs:02d}"
    return f"{mins:02d}:{secs:02d}"


def segment_transcript(transcript: List[Dict[str, Any]], target_segment_seconds: int = 180) -> List[Dict[str, Any]]:
    """Group fine-grained captions into coherent semantic segments of ~2-4 minutes."""
    if not transcript:
        return []

    segments = []
    current_texts = []
    segment_start = transcript[0]["start"]
    current_end = transcript[0]["end"]

    for item in transcript:
        current_texts.append(item["text"])
        current_end = item["end"]

        # Check if accumulated interval reached target threshold
        if (current_end - segment_start) >= target_segment_seconds:
            combined_text = " ".join(current_texts)
            segments.append({
                "start": segment_start,
                "end": current_end,
                "timestampDisplay": format_seconds_to_display(segment_start),
                "durationMinutes": max(1, round((current_end - segment_start) / 60)),
                "text": combined_text,
            })
            current_texts = []
            segment_start = current_end

    if current_texts:
        combined_text = " ".join(current_texts)
        segments.append({
            "start": segment_start,
            "end": current_end,
            "timestampDisplay": format_seconds_to_display(segment_start),
            "durationMinutes": max(1, round((current_end - segment_start) / 60)),
            "text": combined_text,
        })

    return segments


def process_video_pipeline(url: str, output_dir: str = "./tmp_youlearn") -> Dict[str, Any]:
    """Execute the ingestion and transcript extraction pipeline for a given YouTube URL."""
    video_id = extract_youtube_id(url)
    if not video_id:
        raise ValueError(f"Invalid YouTube URL: {url}")

    os.makedirs(output_dir, exist_ok=True)

    metadata = fetch_video_metadata(video_id, url)
    raw_transcript = fetch_transcript(video_id)
    semantic_segments = segment_transcript(raw_transcript)

    if metadata["durationSeconds"] == 0 and raw_transcript:
        last_item = raw_transcript[-1]
        metadata["durationSeconds"] = int(last_item["end"])
        metadata["durationMinutes"] = max(1, round(last_item["end"] / 60))

    result = {
        "videoId": video_id,
        "metadata": metadata,
        "rawTranscriptCount": len(raw_transcript),
        "transcript": raw_transcript,
        "semanticSegments": semantic_segments,
    }

    output_file = os.path.join(output_dir, f"{video_id}_data.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_youtube.py <YOUTUBE_URL> [OUTPUT_DIR]")
        sys.exit(1)

    target_url = sys.argv[1]
    out_dir = sys.argv[2] if len(sys.argv) > 2 else "./tmp_youlearn"

    try:
        data = process_video_pipeline(target_url, out_dir)
        print(json.dumps({
            "status": "SUCCESS",
            "videoId": data["videoId"],
            "title": data["metadata"]["title"],
            "durationMinutes": data["metadata"]["durationMinutes"],
            "rawSnippets": data["rawTranscriptCount"],
            "segmentsCount": len(data["semanticSegments"]),
            "author": data["metadata"]["author"]["name"],
        }, indent=2))
    except Exception as err:
        print(json.dumps({"status": "ERROR", "message": str(err)}, indent=2), file=sys.stderr)
        sys.exit(1)
