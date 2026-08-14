// Web Audio API Synthesizer (Zero external mp3 files required)
let audioCtx: AudioContext | null = null;
let isAudioMuted = false;

export function getAudioMuted(): boolean {
  if (typeof window === "undefined") return false;
  return isAudioMuted;
}

export function toggleAudioMuted(): boolean {
  isAudioMuted = !isAudioMuted;
  return isAudioMuted;
}

export function playTacticalAlertSound(frequencyStart = 520, frequencyEnd = 880, duration = 0.18): void {
  if (typeof window === "undefined" || isAudioMuted) return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === "suspended") {
      void audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    const now = audioCtx.currentTime;

    osc.frequency.setValueAtTime(frequencyStart, now);
    osc.frequency.exponentialRampToValueAtTime(frequencyEnd, now + duration * 0.7);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch (_e) {
    // Ignore audio policy/autoplay restrictions safely
  }
}
