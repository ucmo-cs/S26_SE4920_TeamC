type MusicState = {
  context: AudioContext;
  masterGain: GainNode;
  stepTimer: number;
  stepIndex: number;
  activeNoteNodes: Set<OscillatorNode>;
};

const MUSIC_STORAGE_KEY = 'roc-game-music-muted';
const MUSIC_ORIGIN = '__rocGameMusicState';
const STEP_INTERVAL_MS = 220;
const TEMPLE_PATTERN = [
  220,
  262,
  196,
  247,
  220,
  174,
  196,
  165,
  220,
  262,
  311,
  247,
  220,
  174,
  196,
  147,
];

function getWindowWithMusicState(): Window & { __rocGameMusicState?: MusicState } {
  return window as Window & { __rocGameMusicState?: MusicState };
}

function getAudioContextCtor(): typeof AudioContext | undefined {
  return window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
}

function getMusicState(): MusicState | undefined {
  return getWindowWithMusicState()[MUSIC_ORIGIN];
}

function setMusicState(state?: MusicState): void {
  const musicWindow = getWindowWithMusicState();

  if (state) {
    musicWindow[MUSIC_ORIGIN] = state;
  } else {
    delete musicWindow[MUSIC_ORIGIN];
  }
}

function playPulse(context: AudioContext, masterGain: GainNode, frequency: number, stepIndex: number): OscillatorNode {
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  const octave = stepIndex % 8 === 0 ? 1 : stepIndex % 4 === 0 ? 2 : 0;
  const noteFrequency = frequency * (octave === 1 ? 0.5 : octave === 2 ? 0.25 : 1);

  oscillator.type = stepIndex % 2 === 0 ? 'triangle' : 'sawtooth';
  oscillator.frequency.setValueAtTime(noteFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(noteFrequency * 0.97, now + 0.12);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, now);
  filter.Q.setValueAtTime(0.8, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(stepIndex % 4 === 0 ? 0.07 : 0.045, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  oscillator.start(now);
  oscillator.stop(now + 0.22);

  return oscillator;
}

function startLoopingPattern(state: MusicState): void {
  const droneLow = state.context.createOscillator();
  const droneHigh = state.context.createOscillator();
  const droneLowGain = state.context.createGain();
  const droneHighGain = state.context.createGain();
  const droneFilter = state.context.createBiquadFilter();

  const now = state.context.currentTime;

  droneFilter.type = 'lowpass';
  droneFilter.frequency.setValueAtTime(600, now);
  droneFilter.Q.setValueAtTime(0.7, now);

  droneLow.type = 'sine';
  droneLow.frequency.setValueAtTime(55, now);
  droneLowGain.gain.setValueAtTime(0.025, now);

  droneHigh.type = 'triangle';
  droneHigh.frequency.setValueAtTime(110, now);
  droneHighGain.gain.setValueAtTime(0.012, now);

  droneLow.connect(droneFilter);
  droneHigh.connect(droneFilter);
  droneFilter.connect(droneLowGain);
  droneFilter.connect(droneHighGain);
  droneLowGain.connect(state.masterGain);
  droneHighGain.connect(state.masterGain);

  droneLow.start(now);
  droneHigh.start(now);

  const scheduleStep = () => {
    const frequency = TEMPLE_PATTERN[state.stepIndex % TEMPLE_PATTERN.length];
    const noteNode = playPulse(state.context, state.masterGain, frequency, state.stepIndex);
    state.activeNoteNodes.add(noteNode);

    noteNode.onended = () => {
      state.activeNoteNodes.delete(noteNode);
    };

    state.stepIndex += 1;
  };

  scheduleStep();
  state.stepTimer = window.setInterval(scheduleStep, STEP_INTERVAL_MS);
}

export async function ensureTempleMusicStarted(): Promise<void> {
  if (isMusicMuted()) {
    return;
  }

  const existingState = getMusicState();
  if (existingState) {
    if (existingState.context.state === 'suspended') {
      await existingState.context.resume();
    }
    return;
  }

  const AudioContextCtor = getAudioContextCtor();
  if (!AudioContextCtor) {
    return;
  }

  try {
    const context = new AudioContextCtor();
    const masterGain = context.createGain();
    masterGain.gain.setValueAtTime(0.22, context.currentTime);
    masterGain.connect(context.destination);

    const state: MusicState = {
      context,
      masterGain,
      stepTimer: 0,
      stepIndex: 0,
      activeNoteNodes: new Set<OscillatorNode>(),
    };

    setMusicState(state);
    startLoopingPattern(state);

    if (context.state === 'suspended') {
      await context.resume();
    }
  } catch {
    stopTempleMusic();
  }
}

export function stopTempleMusic(): void {
  const state = getMusicState();
  if (!state) {
    return;
  }

  window.clearInterval(state.stepTimer);
  state.activeNoteNodes.forEach((node) => {
    try {
      node.stop();
    } catch {
      // Ignore nodes that already stopped.
    }
  });

  state.activeNoteNodes.clear();
  void state.context.close();
  setMusicState(undefined);
}

export function isMusicMuted(): boolean {
  return localStorage.getItem(MUSIC_STORAGE_KEY) === 'true';
}

export async function setMusicMuted(nextMuted: boolean): Promise<void> {
  localStorage.setItem(MUSIC_STORAGE_KEY, nextMuted ? 'true' : 'false');

  if (nextMuted) {
    stopTempleMusic();
  }
}

export async function toggleMusic(): Promise<boolean> {
  const nextMuted = !isMusicMuted();
  await setMusicMuted(nextMuted);
  return nextMuted;
}

export function getMusicLabel(prefix = 'Music'): string {
  return isMusicMuted() ? `${prefix} Off (N)` : `${prefix} On (N)`;
}
