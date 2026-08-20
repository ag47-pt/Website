// Web Audio API Synthesizer (Zero external mp3/wav files required)
let audioCtx: AudioContext | null = null;
const STORAGE_KEY = "ag47_alt_radar_audio_muted_v1";

function getStoredMute(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : false;
  } catch {
    return false;
  }
}

let isAudioMuted = getStoredMute();

export function getAudioMuted(): boolean {
  return isAudioMuted;
}

export function toggleAudioMuted(): boolean {
  isAudioMuted = !isAudioMuted;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isAudioMuted));
    } catch {
      // Ignore
    }
  }
  return isAudioMuted;
}

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Som sutil de clique/seleção de token na tabela ou atalho de navegação
 */
export function playTokenSelectSound(): void {
  if (isAudioMuted) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    const duration = 0.04;

    osc.type = "sine";
    osc.frequency.setValueAtTime(840, now);
    osc.frequency.exponentialRampToValueAtTime(1120, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Safely ignore autoplay policy errors
  }
}

/**
 * Som de alerta sonar para novas oportunidades ou detecções
 */
export function playTacticalAlertSound(
  frequencyStart = 520,
  frequencyEnd = 880,
  duration = 0.16,
): void {
  if (isAudioMuted) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequencyStart, now);
    osc.frequency.exponentialRampToValueAtTime(frequencyEnd, now + duration * 0.7);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Safely ignore
  }
}

/**
 * Som de alerta crítico duplo (para score alto ou severidade extrema)
 */
export function playCriticalAlertSound(): void {
  if (isAudioMuted) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    playTacticalAlertSound(880, 1320, 0.12);
    setTimeout(() => {
      playTacticalAlertSound(1100, 1760, 0.15);
    }, 140);
  } catch {
    // Safely ignore
  }
}

/**
 * Som harmônico sutil ao alternar o tema com a tecla [T]
 */
export function playThemeSwitchSound(): void {
  if (isAudioMuted) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const duration = 0.12;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "triangle";
    osc2.type = "sine";

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + duration); // G5

    osc2.frequency.setValueAtTime(659.25, now); // E5
    osc2.frequency.exponentialRampToValueAtTime(1046.5, now + duration); // C6

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  } catch {
    // Safely ignore
  }
}
