/**
 * Provenance & Timestamp utilities for YouLearn
 * Handles source attribution, timestamp formatting, and video link builders.
 */

export function parseTimestampToSeconds(timestamp: string): number {
  if (!timestamp) return 0;
  const parts = timestamp.trim().split(':').map(Number);
  if (parts.some(isNaN)) return 0;

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }
  if (parts.length === 1) {
    return parts[0];
  }
  return 0;
}

export function formatSecondsToTimestamp(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function formatDurationHuman(minutes: number): string {
  if (isNaN(minutes) || minutes <= 0) return '0 min';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = Math.round(minutes % 60);
  if (remainingMins === 0) return `${hours}h`;
  return `${hours}h ${remainingMins}min`;
}

export function buildTimestampedSourceUrl(sourceUrl: string, secondsOrDisplay?: number | string): string {
  if (!sourceUrl) return '#';
  if (secondsOrDisplay === undefined || secondsOrDisplay === null || secondsOrDisplay === '') {
    return sourceUrl;
  }

  const seconds =
    typeof secondsOrDisplay === 'number'
      ? secondsOrDisplay
      : parseTimestampToSeconds(secondsOrDisplay);

  if (seconds <= 0) return sourceUrl;

  try {
    const url = new URL(sourceUrl);
    // YouTube link handling
    if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
      url.searchParams.set('t', `${Math.floor(seconds)}s`);
      return url.toString();
    }
    // Generic anchor hash fallback for timestamps
    return `${sourceUrl}#t=${Math.floor(seconds)}`;
  } catch {
    // Return with simple param if not standard URL
    const separator = sourceUrl.includes('?') ? '&' : '?';
    return `${sourceUrl}${separator}t=${Math.floor(seconds)}s`;
  }
}

export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}
