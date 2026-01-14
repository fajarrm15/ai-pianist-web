import Link from "next/link";
import Head from "next/head";
import { useState, useEffect, useCallback, useRef } from "react";
import * as Tone from "tone";

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
];

const OCTAVE_2_KEYS = [
  { note: "C", type: "white", keyboardKey: "k" },
  { note: "C#", type: "black", keyboardKey: "o" },
  { note: "D", type: "white", keyboardKey: "l" },
  { note: "D#", type: "black", keyboardKey: "p" },
  { note: "E", type: "white", keyboardKey: ";" },
];

interface PianoKey {
  note: string;
  type: "white" | "black";
  keyboardKey: string;
  octave: number;
  fullNote: string;
}

const PIANO_KEYS: PianoKey[] = [
  ...OCTAVE_KEYS.map((k) => ({ ...k, octave: 4, fullNote: `${k.note}4` })),
  ...OCTAVE_2_KEYS.map((k) => ({ ...k, octave: 5, fullNote: `${k.note}5` })),
] as PianoKey[];

const SAMPLE_BASE_URL = "https://tonejs.github.io/audio/salamander/";

const PIANO_SAMPLES: { [key: string]: string } = {
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

export default function PianoPage() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const samplerRef = useRef<Tone.Sampler | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initPiano = async () => {
      const sampler = new Tone.Sampler({
        urls: PIANO_SAMPLES,
        baseUrl: SAMPLE_BASE_URL,
        onload: () => {
          if (isMounted) {
            setIsLoaded(true);
            setLoadingProgress(100);
          }
        },
        onerror: (error) => {
          console.error("Failed to load piano samples:", error);
        },
      }).toDestination();

      const reverb = new Tone.Reverb({ decay: 3, wet: 0.2 }).toDestination();
      sampler.connect(reverb);
      samplerRef.current = sampler;

      let progress = 0;
      const interval = setInterval(() => {
        if (progress < 90) {
          progress += Math.random() * 15;
          if (isMounted) setLoadingProgress(Math.min(progress, 90));
        }
      }, 200);

      return () => clearInterval(interval);
    };

    initPiano();

    return () => {
      isMounted = false;
      samplerRef.current?.dispose();
    };
  }, []);

  const startAudio = useCallback(async () => {
    if (Tone.context.state !== "running") {
      await Tone.start();
    }
  }, []);

  const playNote = useCallback(
    async (fullNote: string) => {
      await startAudio();
      if (!samplerRef.current || !isLoaded || activeKeys.has(fullNote)) return;
      samplerRef.current.triggerAttack(fullNote, Tone.now(), 0.8);
      setActiveKeys((prev) => new Set([...prev, fullNote]));
    },
    [activeKeys, isLoaded, startAudio]
  );

  const stopNote = useCallback((fullNote: string) => {
    if (!samplerRef.current) return;
    samplerRef.current.triggerRelease(fullNote, Tone.now());
    setActiveKeys((prev) => {
      const next = new Set(prev);
      next.delete(fullNote);
      return next;
    });
  }, []);

  useEffect(() => {
    const keyMap = new Map(
      PIANO_KEYS.map((k) => [k.keyboardKey.toLowerCase(), k.fullNote])
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = keyMap.get(e.key.toLowerCase());
      if (note) {
        e.preventDefault();
        playNote(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = keyMap.get(e.key.toLowerCase());
      if (note) {
        e.preventDefault();
        stopNote(note);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [playNote, stopNote]);

  const whiteKeys = PIANO_KEYS.filter((k) => k.type === "white");
  const blackKeys = PIANO_KEYS.filter((k) => k.type === "black");

  const getBlackKeyPosition = (note: string, octave: number) => {
    const whiteKeyWidth = 100 / whiteKeys.length;
    let whiteKeyIndex = 0;
    for (let i = 0; i < PIANO_KEYS.length; i++) {
      const key = PIANO_KEYS[i];
      if (key.fullNote === `${note}${octave}`) break;
      if (key.type === "white") whiteKeyIndex++;
    }
    return `${whiteKeyIndex * whiteKeyWidth - whiteKeyWidth * 0.3}%`;
  };

  return (
    <>
      <Head>
        <title>Play Piano | Piano Companion</title>
      </Head>

      <main className="min-h-screen bg-base-100 flex flex-col">
        {/* Header */}
        <header className="border-b border-base-200 bg-white/80 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sky-400" />
              <h1 className="font-display font-semibold text-neutral-800">
                Play Piano
              </h1>
            </div>
            <div className="w-16" />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center mb-8">
            <p className="text-neutral-600 mb-2">
              Click the keys or use your keyboard
            </p>
            <p className="text-sm text-neutral-400">
              A S D F G H J K L ; (white) &nbsp;·&nbsp; W E T Y U O P (black)
            </p>
          </div>

          {/* Piano Container */}
          <div className="w-full max-w-4xl">
            <div
              className="relative bg-neutral-800 p-3 pb-4 rounded-2xl shadow-soft"
              style={{ minHeight: "280px" }}
            >
              {/* Loading overlay */}
              {!isLoaded && (
                <div className="absolute inset-0 bg-neutral-800/95 rounded-2xl flex flex-col items-center justify-center z-20">
                  <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-neutral-400 text-sm mb-3">
                    Loading piano...
                  </p>
                  <div className="w-48 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-sage-400 to-sky-400 transition-all duration-300"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* White Keys */}
              <div className="relative flex h-56">
                {whiteKeys.map((key) => (
                  <button
                    key={key.fullNote}
                    onMouseDown={() => playNote(key.fullNote)}
                    onMouseUp={() => stopNote(key.fullNote)}
                    onMouseLeave={() => {
                      if (activeKeys.has(key.fullNote)) stopNote(key.fullNote);
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      playNote(key.fullNote);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      stopNote(key.fullNote);
                    }}
                    disabled={!isLoaded}
                    className={`
                      relative flex-1 mx-0.5 rounded-b-lg
                      flex flex-col justify-end items-center pb-3
                      disabled:cursor-not-allowed
                      ${
                        activeKeys.has(key.fullNote)
                          ? "bg-sage-100 shadow-inner translate-y-0.5"
                          : "bg-white hover:bg-base-100 shadow-md"
                      }
                    `}
                  >
                    <span className="text-[10px] text-neutral-400 font-medium uppercase">
                      {key.keyboardKey}
                    </span>
                  </button>
                ))}
              </div>

              {/* Black Keys */}
              <div className="absolute top-3 left-3 right-3 h-32 pointer-events-none">
                {blackKeys.map((key) => (
                  <button
                    key={key.fullNote}
                    onMouseDown={() => playNote(key.fullNote)}
                    onMouseUp={() => stopNote(key.fullNote)}
                    onMouseLeave={() => {
                      if (activeKeys.has(key.fullNote)) stopNote(key.fullNote);
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      playNote(key.fullNote);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      stopNote(key.fullNote);
                    }}
                    disabled={!isLoaded}
                    style={{
                      left: getBlackKeyPosition(key.note, key.octave),
                      width: `${60 / whiteKeys.length}%`,
                    }}
                    className={`
                      absolute h-full rounded-b-md pointer-events-auto
                      flex flex-col justify-end items-center pb-2
                      disabled:cursor-not-allowed
                      ${
                        activeKeys.has(key.fullNote)
                          ? "bg-neutral-600 shadow-inner translate-y-0.5"
                          : "bg-neutral-900 hover:bg-neutral-800 shadow-lg"
                      }
                    `}
                  >
                    <span className="text-[10px] text-neutral-500 font-medium uppercase">
                      {key.keyboardKey}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-neutral-400 text-xs mt-4">
              Salamander Grand Piano Samples
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
