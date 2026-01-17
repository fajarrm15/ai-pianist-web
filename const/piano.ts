// ============== PIANO KEY TYPES ==============
export interface PianoKey {
  note: string;
  type: "white" | "black";
  keyboardKey: string;
  octave: number;
  fullNote: string;
}

// ============== PIANO KEY CONFIG ==============
const OCTAVE_KEYS = [
  { note: "C", type: "white", keyboardKey: "a" },
  { note: "C#", type: "black", keyboardKey: "w" },
  { note: "D", type: "white", keyboardKey: "s" },
  { note: "D#", type: "black", keyboardKey: "e" },
  { note: "E", type: "white", keyboardKey: "d" },
  { note: "F", type: "white", keyboardKey: "f" },
  { note: "F#", type: "black", keyboardKey: "t" },
  { note: "G", type: "white", keyboardKey: "g" },
  { note: "G#", type: "black", keyboardKey: "y" },
  { note: "A", type: "white", keyboardKey: "h" },
  { note: "A#", type: "black", keyboardKey: "u" },
  { note: "B", type: "white", keyboardKey: "j" },
] as const;

const OCTAVE_2_KEYS = [
  { note: "C", type: "white", keyboardKey: "k" },
  { note: "C#", type: "black", keyboardKey: "o" },
  { note: "D", type: "white", keyboardKey: "l" },
  { note: "D#", type: "black", keyboardKey: "p" },
  { note: "E", type: "white", keyboardKey: ";" },
] as const;

export const PIANO_KEYS: PianoKey[] = [
  ...OCTAVE_KEYS.map((k) => ({ ...k, octave: 4, fullNote: `${k.note}4` })),
  ...OCTAVE_2_KEYS.map((k) => ({ ...k, octave: 5, fullNote: `${k.note}5` })),
] as PianoKey[];

export const WHITE_KEYS = PIANO_KEYS.filter((k) => k.type === "white");
export const BLACK_KEYS = PIANO_KEYS.filter((k) => k.type === "black");

// ============== SAMPLER CONFIG ==============
export const SAMPLE_BASE_URL = "https://tonejs.github.io/audio/salamander/";

export const PIANO_SAMPLES: { [key: string]: string } = {
  A0: "A0.mp3",
  C1: "C1.mp3",
  "D#1": "Ds1.mp3",
  "F#1": "Fs1.mp3",
  A1: "A1.mp3",
  C2: "C2.mp3",
  "D#2": "Ds2.mp3",
  "F#2": "Fs2.mp3",
  A2: "A2.mp3",
  C3: "C3.mp3",
  "D#3": "Ds3.mp3",
  "F#3": "Fs3.mp3",
  A3: "A3.mp3",
  C4: "C4.mp3",
  "D#4": "Ds4.mp3",
  "F#4": "Fs4.mp3",
  A4: "A4.mp3",
  C5: "C5.mp3",
  "D#5": "Ds5.mp3",
  "F#5": "Fs5.mp3",
  A5: "A5.mp3",
  C6: "C6.mp3",
  "D#6": "Ds6.mp3",
  "F#6": "Fs6.mp3",
  A6: "A6.mp3",
  C7: "C7.mp3",
  "D#7": "Ds7.mp3",
  "F#7": "Fs7.mp3",
  A7: "A7.mp3",
  C8: "C8.mp3",
};

// ============== KEYBOARD MAPPING ==============
export const KEY_TO_NOTE_MAP = new Map(
  PIANO_KEYS.map((k) => [k.keyboardKey.toLowerCase(), k.fullNote])
);
