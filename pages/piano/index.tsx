import Link from "next/link";
import Head from "next/head";
import { useState, useEffect, useCallback, useRef } from "react";
import * as Tone from "tone";
import {
  PIANO_KEYS,
  WHITE_KEYS,
  SAMPLE_BASE_URL,
  PIANO_SAMPLES,
  KEY_TO_NOTE_MAP,
  SONGS,
  FALL_DURATION,
  HIT_WINDOW_PERFECT,
  HIT_WINDOW_GOOD,
  HIT_WINDOW_MISS,
  getComboMultiplier,
  initialGameStats,
  type PianoKey,
  type Song,
  type GameNote,
  type HitRating,
  type GameState,
  type HitEffect,
} from "@/const";

// ============== COMPONENT ==============
export default function PianoPage() {
  // Audio state
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const samplerRef = useRef<Tone.Sampler | null>(null);

  // Play mode state
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [keyFlash, setKeyFlash] = useState<Set<string>>(new Set());

  // Game mode state
  const [mode, setMode] = useState<"freeplay" | "game">("freeplay");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [countdown, setCountdown] = useState(3);
  const [gameNotes, setGameNotes] = useState<GameNote[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [stats, setStats] = useState(initialGameStats);
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const [showBirthdayPopup, setShowBirthdayPopup] = useState(false);

  // Timing refs
  const gameStartTime = useRef(0);
  const pausedAt = useRef(0);
  const animationRef = useRef<number>(0);
  const gameNotesRef = useRef<GameNote[]>([]);
  const currentTimeRef = useRef(0);

  // For smooth rendering
  const [, forceUpdate] = useState(0);

  // ============== AUDIO SETUP ==============
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
      }).toDestination();

      const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.15 }).toDestination();
      sampler.connect(reverb);
      samplerRef.current = sampler;

      let progress = 0;
      const interval = setInterval(() => {
        if (progress < 90 && isMounted) {
          progress += Math.random() * 20;
          setLoadingProgress(Math.min(progress, 90));
        }
      }, 150);

      return () => clearInterval(interval);
    };

    initPiano();
    return () => {
      isMounted = false;
      samplerRef.current?.dispose();
    };
  }, []);

  const startAudio = useCallback(async () => {
    if (Tone.context.state !== "running") await Tone.start();
  }, []);

  // ============== NOTE PLAYING ==============
  const playNote = useCallback(
    async (note: string) => {
      await startAudio();
      if (!samplerRef.current || !isLoaded) return;

      samplerRef.current.triggerAttack(note, Tone.now(), 0.8);
      setActiveKeys((prev) => new Set([...prev, note]));
      setKeyFlash((prev) => new Set([...prev, note]));

      setTimeout(
        () =>
          setKeyFlash((prev) => {
            const next = new Set(prev);
            next.delete(note);
            return next;
          }),
        150,
      );
    },
    [isLoaded, startAudio],
  );

  const stopNote = useCallback((note: string) => {
    if (!samplerRef.current) return;
    samplerRef.current.triggerRelease(note, Tone.now());
    setActiveKeys((prev) => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });
  }, []);

  // ============== GAME HELPERS ==============
  const getKeyPosition = useCallback((note: string): number => {
    const keyIndex = PIANO_KEYS.findIndex((k) => k.fullNote === note);
    if (keyIndex === -1) return 50;

    // Count white keys before this note
    let whiteCount = 0;
    for (let i = 0; i <= keyIndex; i++) {
      if (PIANO_KEYS[i].type === "white") whiteCount++;
    }

    const isBlack = note.includes("#");
    if (isBlack) {
      return ((whiteCount - 0.5) / WHITE_KEYS.length) * 100;
    }
    return ((whiteCount - 0.5) / WHITE_KEYS.length) * 100;
  }, []);

  const addHitEffect = useCallback((x: number, rating: HitRating) => {
    const effect: HitEffect = {
      id: `${Date.now()}-${Math.random()}`,
      x,
      rating,
      timestamp: Date.now(),
    };
    setHitEffects((prev) => [...prev, effect]);
    setTimeout(() => {
      setHitEffects((prev) => prev.filter((e) => e.id !== effect.id));
    }, 600);
  }, []);

  const triggerScreenShake = useCallback(() => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 200);
  }, []);

  // ============== GAME LOGIC ==============
  const startCountdown = useCallback(() => {
    if (!selectedSong) return;
    setGameState("countdown");
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          startGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [selectedSong]);

  const startGame = useCallback(() => {
    if (!selectedSong) return;

    const notes: GameNote[] = selectedSong.notes.map((n, i) => ({
      id: `note-${i}-${n.note}-${n.time}`,
      note: n.note,
      time: n.time,
      duration: n.duration,
      status: "pending",
    }));

    gameNotesRef.current = notes;
    setGameNotes(notes);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setStats(initialGameStats);
    setHitEffects([]);
    currentTimeRef.current = 0;

    gameStartTime.current = performance.now();
    setGameState("playing");
  }, [selectedSong]);

  const pauseGame = useCallback(() => {
    if (gameState !== "playing") return;
    pausedAt.current = performance.now() - gameStartTime.current;
    setGameState("paused");
    cancelAnimationFrame(animationRef.current);
  }, [gameState]);

  const resumeGame = useCallback(() => {
    if (gameState !== "paused") return;
    gameStartTime.current = performance.now() - pausedAt.current;
    setGameState("playing");
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState("idle");
    setGameNotes([]);
    gameNotesRef.current = [];
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setStats(initialGameStats);
    setHitEffects([]);
    setCountdown(3);
    cancelAnimationFrame(animationRef.current);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing" || !selectedSong) return;

    const gameLoop = () => {
      const elapsed = performance.now() - gameStartTime.current;
      currentTimeRef.current = elapsed;

      // Check for missed notes
      let missedCount = 0;
      const updatedNotes = gameNotesRef.current.map((note) => {
        if (note.status === "pending") {
          const hitTime = note.time + FALL_DURATION;
          if (elapsed > hitTime + HIT_WINDOW_MISS) {
            missedCount++;
            return { ...note, status: "missed" as const };
          }
        }
        return note;
      });

      if (missedCount > 0) {
        gameNotesRef.current = updatedNotes;
        setGameNotes([...updatedNotes]);
        setCombo(0);
        setStats((prev) => ({ ...prev, miss: prev.miss + missedCount }));
        triggerScreenShake();
      }

      // Check if song ended
      const lastNoteTime = Math.max(...selectedSong.notes.map((n) => n.time));
      if (elapsed > lastNoteTime + FALL_DURATION + 1000) {
        if (selectedSong?.id === "happy-birthday") {
          setShowBirthdayPopup(true);
        } else {
          setGameState("ended");
          return;
        }
      }

      // Force re-render for smooth animation
      forceUpdate((n) => n + 1);
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameState, selectedSong, triggerScreenShake]);

  // Handle key press in game mode
  const handleGameKeyPress = useCallback(
    (note: string) => {
      if (gameState !== "playing") return;

      // Play the sound (will sustain until release)
      playNote(note);

      const elapsed = currentTimeRef.current;

      // Find the closest pending note for this specific key
      let bestNote: GameNote | null = null;
      let bestDiff = Infinity;

      for (const gn of gameNotesRef.current) {
        if (gn.note === note && gn.status === "pending") {
          const hitTime = gn.time + FALL_DURATION;
          const diff = Math.abs(elapsed - hitTime);
          if (diff < bestDiff && diff < HIT_WINDOW_MISS) {
            bestDiff = diff;
            bestNote = gn;
          }
        }
      }

      if (bestNote) {
        const noteId = bestNote.id;
        let rating: HitRating;
        let points: number;

        if (bestDiff <= HIT_WINDOW_PERFECT) {
          rating = "perfect";
          points = 100;
        } else if (bestDiff <= HIT_WINDOW_GOOD) {
          rating = "good";
          points = 50;
        } else {
          rating = "miss";
          points = 0;
        }

        // Update only the specific note that was hit
        gameNotesRef.current = gameNotesRef.current.map((n) =>
          n.id === noteId
            ? {
                ...n,
                status: "hit" as const,
                hitRating: rating !== "miss" ? rating : undefined,
              }
            : n,
        );
        setGameNotes([...gameNotesRef.current]);

        // Visual effect
        const x = getKeyPosition(note);
        addHitEffect(x, rating);

        if (rating !== "miss") {
          const newCombo = combo + 1;
          const multiplier = getComboMultiplier(newCombo);

          setScore((prev) => prev + Math.round(points * multiplier));
          setCombo(newCombo);
          setMaxCombo((prev) => Math.max(prev, newCombo));
          setStats((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));
        }
      }
    },
    [gameState, combo, playNote, getKeyPosition, addHitEffect],
  );

  // ============== KEYBOARD HANDLERS ==============
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (mode === "game") {
        if (e.key === " ") {
          e.preventDefault();
          if (gameState === "idle" && selectedSong) startCountdown();
          else if (gameState === "playing") pauseGame();
          else if (gameState === "paused") resumeGame();
          else if (gameState === "ended") resetGame();
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          if (selectedSong) {
            setSelectedSong(null);
            resetGame();
          }
          return;
        }
      }

      const note = KEY_TO_NOTE_MAP.get(e.key.toLowerCase());
      if (note) {
        e.preventDefault();
        if (mode === "freeplay") {
          playNote(note);
        } else if (gameState === "playing") {
          handleGameKeyPress(note);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = KEY_TO_NOTE_MAP.get(e.key.toLowerCase());
      if (note) {
        e.preventDefault();
        stopNote(note); // Release note in both freeplay and game mode
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    mode,
    gameState,
    selectedSong,
    playNote,
    stopNote,
    handleGameKeyPress,
    startCountdown,
    pauseGame,
    resumeGame,
    resetGame,
  ]);

  // ============== RENDER HELPERS ==============
  const isBlackKey = (note: string) => note.includes("#");

  const getNoteStyle = (note: GameNote) => {
    const elapsed =
      gameState === "paused" ? pausedAt.current : currentTimeRef.current;
    const timeSinceStart = elapsed - note.time;
    const progress = timeSinceStart / FALL_DURATION;
    const leftPos = getKeyPosition(note.note);
    const noteHeight = Math.max(45, note.duration / 10);

    // When progress = 1, the BOTTOM of the note should be at the hit line (bottom of game field)
    // So we position the TOP of the note at (progress * 100 - noteHeightPercent)
    // But we'll use bottom positioning instead for simpler math
    // At progress = 0: note is above screen
    // At progress = 1: bottom of note is at bottom of container (the hit line)
    const bottomPercent = (1 - progress) * 100;

    return {
      left: `${leftPos}%`,
      bottom: `${bottomPercent}%`,
      transform: "translateX(-50%)",
      height: `${noteHeight}px`,
    };
  };

  const shouldRenderNote = (note: GameNote) => {
    if (note.status === "hit") return false;
    const elapsed =
      gameState === "paused" ? pausedAt.current : currentTimeRef.current;
    const timeSinceStart = elapsed - note.time;
    const progress = timeSinceStart / FALL_DURATION;
    return progress > -0.1 && progress < 1.2;
  };

  // ============== RENDER ==============
  return (
    <>
      <Head>
        <title>Play Piano | Piano Companion</title>
      </Head>

      <style jsx global>{`
        @keyframes hitPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        @keyframes ratingFloat {
          0% {
            transform: translate(-50%, 0) scale(0.5);
            opacity: 0;
          }
          20% {
            transform: translate(-50%, -10px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -40px) scale(1);
            opacity: 0;
          }
        }
        @keyframes noteGlow {
          0%,
          100% {
            box-shadow: 0 0 10px currentColor;
          }
          50% {
            box-shadow:
              0 0 20px currentColor,
              0 0 30px currentColor;
          }
        }
        @keyframes countdownPulse {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .hit-effect {
          animation: hitPulse 0.4s ease-out forwards;
        }
        .rating-float {
          animation: ratingFloat 0.6s ease-out forwards;
        }
        .note-glow {
          animation: noteGlow 1s ease-in-out infinite;
        }
        .countdown-num {
          animation: countdownPulse 0.5s ease-out;
        }
        .screen-shake {
          animation: shake 0.15s ease-in-out;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          75% {
            transform: translateX(2px);
          }
        }
      `}</style>

      <main
        className={`min-h-screen bg-gradient-to-b from-stone-50 via-mint-50/30 to-stone-50 flex flex-col ${screenShake ? "screen-shake" : ""}`}
      >
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-mint-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-sage-200/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-mint-100/30 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-mint-100 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-1 md:gap-2 text-stone-400 hover:text-mint-600 transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
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
              <span className="text-xs md:text-sm font-medium">Back</span>
            </Link>

            {/* Mode Toggle - Compact on mobile */}
            <div className="flex items-center gap-1 md:gap-2 bg-mint-50 border border-mint-200 p-1 md:p-1.5 rounded-xl md:rounded-2xl">
              <button
                onClick={() => {
                  setMode("freeplay");
                  resetGame();
                  setSelectedSong(null);
                }}
                className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-lg md:rounded-xl transition-all cursor-pointer ${
                  mode === "freeplay"
                    ? "bg-white text-stone-800 shadow-sm border border-mint-200"
                    : "text-stone-500 hover:text-stone-700 hover:bg-white/50"
                }`}
              >
                <svg
                  className="w-3 h-3 md:w-4 md:h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                <span className="hidden sm:inline">Free Play</span>
                <span className="sm:hidden">Play</span>
              </button>
              <button
                onClick={() => {
                  setMode("game");
                  resetGame();
                }}
                className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-lg md:rounded-xl transition-all cursor-pointer ${
                  mode === "game"
                    ? "bg-white text-stone-800 shadow-sm border border-mint-200"
                    : "text-stone-500 hover:text-stone-700 hover:bg-white/50"
                }`}
              >
                <svg
                  className="w-3 h-3 md:w-4 md:h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="hidden sm:inline">Game Mode</span>
                <span className="sm:hidden">Game</span>
              </button>
            </div>

            {/* Spacer / Volume button placeholder */}
            <div className="w-8 md:w-20" />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative z-0">
          {mode === "freeplay" ? (
            // ============== FREE PLAY MODE ==============
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden">
              {/* Title Section */}
              <div className="text-center mb-4 md:mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-mint-100 rounded-full mb-4">
                  <div className="w-2 h-2 rounded-full bg-mint-500 animate-pulse" />
                  <span className="text-sm font-medium text-mint-700">
                    Free Play Mode
                  </span>
                </div>
                <h1 className="font-display text-xl md:text-2xl font-semibold text-stone-800 mb-2">
                  Play the Piano
                </h1>
                <p className="text-stone-500 text-sm md:text-base">
                  Click the keys or use your keyboard to play
                </p>
              </div>

              {/* Keyboard hints - Hidden on mobile, shown on desktop */}
              <div className="hidden md:flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-stone-400">White keys:</span>
                  <div className="flex gap-1">
                    {["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"].map(
                      (key) => (
                        <span
                          key={key}
                          className="w-6 h-6 bg-white border border-stone-200 rounded text-xs flex items-center justify-center text-stone-600 font-mono shadow-sm"
                        >
                          {key}
                        </span>
                      ),
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-stone-400">Black keys:</span>
                  <div className="flex gap-1">
                    {["W", "E", "T", "Y", "U", "O", "P"].map((key) => (
                      <span
                        key={key}
                        className="w-6 h-6 bg-stone-800 border border-stone-700 rounded text-xs flex items-center justify-center text-stone-300 font-mono shadow-sm"
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile keyboard hint - Simple version */}
              <p className="md:hidden text-xs text-stone-400 mb-4">
                Use keyboard keys A-L for white, W-P for black
              </p>

              {/* Piano - with responsive wrapper */}
              <div className="w-full max-w-4xl px-2 md:px-0">
                <PianoKeyboard
                  isLoaded={isLoaded}
                  loadingProgress={loadingProgress}
                  activeKeys={activeKeys}
                  flashKeys={keyFlash}
                  onKeyDown={playNote}
                  onKeyUp={stopNote}
                />
              </div>

              {/* Tips - Stack on mobile, row on desktop */}
              <div className="mt-4 md:mt-8 flex flex-col md:flex-row items-center gap-3 md:gap-6 text-sm text-stone-400">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-mint-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Hold keys for sustained notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-mint-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <span>Try Game Mode to practice songs!</span>
                </div>
              </div>
            </div>
          ) : (
            // ============== GAME MODE ==============
            <div className="flex-1 flex flex-col">
              {!selectedSong ? (
                // Song Selection
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                  <div className="text-center mb-8">
                    <h2 className="font-display text-2xl font-semibold text-stone-800 mb-2">
                      Choose a Song
                    </h2>
                    <p className="text-stone-500">Select a song to practice</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
                    {SONGS.map((song) => (
                      <button
                        key={song.id}
                        onClick={() => setSelectedSong(song)}
                        className="group p-5 bg-white border border-stone-200 rounded-2xl text-left hover:border-mint-400 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-display font-semibold text-stone-800 group-hover:text-mint-600 transition-colors">
                            {song.title}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              song.difficulty === "Easy"
                                ? "bg-mint-100 text-mint-700"
                                : song.difficulty === "Medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {song.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-stone-400">{song.artist}</p>
                        <p className="text-xs text-stone-300 mt-2">
                          {song.notes.length} notes
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : gameState === "ended" ? (
                // Results Screen
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                  <div className="bg-white border border-stone-200 rounded-3xl p-8 w-full max-w-md shadow-xl">
                    <div className="text-center mb-8">
                      <div className="text-6xl mb-4">
                        {stats.perfect > stats.good + stats.miss
                          ? "🌟"
                          : stats.miss > stats.perfect + stats.good
                            ? "💪"
                            : "🎉"}
                      </div>
                      <h2 className="font-display text-3xl font-bold text-stone-800">
                        {stats.perfect > stats.good + stats.miss
                          ? "Amazing!"
                          : stats.miss > stats.perfect + stats.good
                            ? "Keep Practicing!"
                            : "Well Done!"}
                      </h2>
                      <p className="text-stone-500">{selectedSong.title}</p>
                    </div>

                    <div className="text-center mb-8 py-6 bg-gradient-to-r from-mint-50 to-sage-50 rounded-2xl">
                      <p className="text-sm text-stone-500 mb-1">Final Score</p>
                      <p className="text-5xl font-bold text-stone-800">
                        {score.toLocaleString()}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="text-center p-4 bg-mint-50 rounded-xl">
                        <p className="text-3xl font-bold text-mint-600">
                          {stats.perfect}
                        </p>
                        <p className="text-sm text-mint-600">Perfect</p>
                      </div>
                      <div className="text-center p-4 bg-amber-50 rounded-xl">
                        <p className="text-3xl font-bold text-amber-600">
                          {stats.good}
                        </p>
                        <p className="text-sm text-amber-600">Good</p>
                      </div>
                      <div className="text-center p-4 bg-stone-100 rounded-xl">
                        <p className="text-3xl font-bold text-stone-500">
                          {stats.miss}
                        </p>
                        <p className="text-sm text-stone-500">Miss</p>
                      </div>
                    </div>

                    <div className="text-center mb-8">
                      <p className="text-sm text-stone-500">Max Combo</p>
                      <p className="text-2xl font-bold text-stone-700">
                        {maxCombo}x
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={startCountdown}
                        className="flex-1 py-3.5 bg-stone-800 text-white rounded-xl font-semibold hover:bg-stone-900 transition-all cursor-pointer"
                      >
                        🔄 Retry
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSong(null);
                          resetGame();
                        }}
                        className="flex-1 py-3.5 bg-white border border-stone-200 text-stone-700 rounded-xl font-semibold hover:bg-stone-50 transition-all cursor-pointer"
                      >
                        🎵 Songs
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Game Play Screen
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* HUD */}
                  <div className="flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur border-b border-stone-200">
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide">
                          Score
                        </p>
                        <p className="text-2xl font-bold text-stone-800">
                          {score.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide">
                          Combo
                        </p>
                        <p
                          className={`text-2xl font-bold transition-colors ${
                            combo >= 20
                              ? "text-mint-500"
                              : combo >= 10
                                ? "text-amber-500"
                                : "text-stone-800"
                          }`}
                        >
                          {combo}x
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="font-display font-semibold text-stone-700">
                        {selectedSong.title}
                      </p>
                      {gameState === "idle" && (
                        <p className="text-xs text-stone-400">
                          Press Space to start
                        </p>
                      )}
                      {gameState === "paused" && (
                        <p className="text-xs text-mint-500 font-medium">
                          ⏸ Paused
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {gameState === "playing" && (
                        <button
                          onClick={pauseGame}
                          className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-all cursor-pointer"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedSong(null);
                          resetGame();
                        }}
                        className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-all cursor-pointer"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Game Field - notes fall into piano */}
                  <div className="flex-1 relative bg-gradient-to-b from-stone-900 via-stone-950 to-black overflow-hidden">
                    {/* Lane guides - extend to bottom */}
                    <div className="absolute inset-0 flex">
                      {WHITE_KEYS.map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 border-r border-stone-700/40"
                        />
                      ))}
                    </div>

                    {/* Hit effects - appear above piano */}
                    {hitEffects.map((effect) => (
                      <div
                        key={effect.id}
                        className="absolute pointer-events-none"
                        style={{ left: `${effect.x}%`, bottom: "0px" }}
                      >
                        {/* Pulse ring */}
                        <div
                          className={`hit-effect absolute w-16 h-16 rounded-full border-4 ${
                            effect.rating === "perfect"
                              ? "border-emerald-400"
                              : effect.rating === "good"
                                ? "border-amber-400"
                                : "border-rose-400"
                          }`}
                          style={{ transform: "translate(-50%, -50%)" }}
                        />

                        {/* Rating text */}
                        <div
                          className="rating-float absolute whitespace-nowrap"
                          style={{
                            transform: "translateX(-50%)",
                            bottom: "20px",
                          }}
                        >
                          <span
                            className={`text-xl font-bold drop-shadow-lg ${
                              effect.rating === "perfect"
                                ? "text-emerald-400"
                                : effect.rating === "good"
                                  ? "text-amber-400"
                                  : "text-rose-400"
                            }`}
                          >
                            {effect.rating === "perfect"
                              ? "PERFECT!"
                              : effect.rating === "good"
                                ? "GOOD!"
                                : "MISS"}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Falling notes */}
                    {(gameState === "playing" || gameState === "paused") &&
                      gameNotes.map((note) => {
                        if (!shouldRenderNote(note)) return null;
                        const style = getNoteStyle(note);
                        const isBlack = isBlackKey(note.note);

                        return (
                          <div
                            key={note.id}
                            className={`absolute transition-opacity duration-100 ${note.status === "missed" ? "opacity-30" : ""}`}
                            style={style}
                          >
                            <div
                              className={`w-12 rounded-lg ${
                                isBlack
                                  ? "bg-gradient-to-b from-fuchsia-400 to-violet-500"
                                  : "bg-gradient-to-b from-emerald-300 to-teal-400"
                              }`}
                              style={{
                                height: style.height,
                                boxShadow: isBlack
                                  ? "0 0 15px rgba(217, 70, 239, 0.7), 0 0 30px rgba(217, 70, 239, 0.3)"
                                  : "0 0 15px rgba(52, 211, 153, 0.7), 0 0 30px rgba(52, 211, 153, 0.3)",
                              }}
                            />
                          </div>
                        );
                      })}

                    {/* Countdown overlay */}
                    {gameState === "countdown" && (
                      <div className="absolute inset-0 bg-stone-900/80 flex items-center justify-center">
                        <div
                          key={countdown}
                          className="countdown-num text-9xl font-bold text-white"
                        >
                          {countdown}
                        </div>
                      </div>
                    )}

                    {/* Start/Pause overlay */}
                    {(gameState === "idle" || gameState === "paused") && (
                      <div className="absolute inset-0 bg-stone-900/80 flex flex-col items-center justify-center gap-4">
                        <button
                          onClick={
                            gameState === "idle" ? startCountdown : resumeGame
                          }
                          className="px-10 py-5 bg-emerald-500 text-white rounded-2xl font-bold text-xl shadow-xl hover:bg-emerald-600 hover:scale-105 transition-all cursor-pointer"
                          style={{
                            boxShadow: "0 0 30px rgba(52, 211, 153, 0.5)",
                          }}
                        >
                          {gameState === "idle" ? "▶ START" : "▶ RESUME"}
                        </button>
                        <p className="text-stone-400 text-sm">or press Space</p>
                      </div>
                    )}
                  </div>

                  {/* Hit zone glow - sits between game field and piano */}
                  <div
                    className="h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 relative z-10"
                    style={{
                      boxShadow:
                        "0 0 20px rgba(52, 211, 153, 0.8), 0 -10px 30px rgba(52, 211, 153, 0.4), 0 10px 30px rgba(52, 211, 153, 0.4)",
                    }}
                  />

                  {/* Game Piano - larger and more prominent */}
                  <div className="bg-gradient-to-b from-stone-800 to-stone-900 pt-1 pb-3 px-2">
                    <GamePiano
                      activeKeys={activeKeys}
                      flashKeys={keyFlash}
                      onKeyPress={handleGameKeyPress}
                      onKeyRelease={stopNote}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      {showBirthdayPopup && (
        <BirthdayPopup
          onClose={() => {
            setShowBirthdayPopup(false);
            setGameState("ended");
          }}
        />
      )}
    </>
  );
}

// ============== PIANO KEYBOARD COMPONENT ==============
function PianoKeyboard({
  isLoaded,
  loadingProgress,
  activeKeys,
  flashKeys,
  onKeyDown,
  onKeyUp,
}: {
  isLoaded: boolean;
  loadingProgress: number;
  activeKeys: Set<string>;
  flashKeys: Set<string>;
  onKeyDown: (note: string) => void;
  onKeyUp: (note: string) => void;
}) {
  const whiteKeys = PIANO_KEYS.filter((k) => k.type === "white");
  const blackKeys = PIANO_KEYS.filter((k) => k.type === "black");

  const getBlackKeyPos = (note: string, octave: number) => {
    const w = 100 / whiteKeys.length;
    let idx = 0;
    for (const k of PIANO_KEYS) {
      if (k.fullNote === `${note}${octave}`) break;
      if (k.type === "white") idx++;
    }
    return `${idx * w - w * 0.3}%`;
  };

  return (
    <div className="w-full">
      <div
        className="relative bg-stone-800 p-2 md:p-3 pb-3 md:pb-4 rounded-2xl md:rounded-3xl shadow-xl border border-stone-700"
        style={{ minHeight: "180px" }}
      >
        {!isLoaded && (
          <div className="absolute inset-0 bg-stone-800/95 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center z-20">
            <div className="w-8 h-8 border-2 border-mint-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-stone-400 text-sm mb-3">Loading piano...</p>
            <div className="w-48 h-1.5 bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-mint-400 to-mint-500 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* White keys */}
        <div className="relative flex h-36 md:h-52">
          {whiteKeys.map((key) => (
            <button
              key={key.fullNote}
              onMouseDown={() => onKeyDown(key.fullNote)}
              onMouseUp={() => onKeyUp(key.fullNote)}
              onMouseLeave={() =>
                activeKeys.has(key.fullNote) && onKeyUp(key.fullNote)
              }
              onTouchStart={(e) => {
                e.preventDefault();
                onKeyDown(key.fullNote);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                onKeyUp(key.fullNote);
              }}
              disabled={!isLoaded}
              className={`relative flex-1 mx-px md:mx-0.5 rounded-b-lg md:rounded-b-xl flex flex-col justify-end items-center pb-2 md:pb-3 border border-stone-200
                ${flashKeys.has(key.fullNote) ? "scale-[0.98]" : ""}
                ${
                  activeKeys.has(key.fullNote)
                    ? "bg-mint-200 border-mint-300"
                    : "bg-gradient-to-b from-white to-stone-100 shadow-key hover:from-stone-50"
                } transition-all disabled:cursor-not-allowed`}
            >
              <span className="text-[8px] md:text-[10px] text-stone-500 font-medium uppercase">
                {key.keyboardKey}
              </span>
            </button>
          ))}
        </div>

        {/* Black keys */}
        <div className="absolute top-2 md:top-3 left-2 md:left-3 right-2 md:right-3 h-20 md:h-32 pointer-events-none">
          {blackKeys.map((key) => (
            <button
              key={key.fullNote}
              onMouseDown={() => onKeyDown(key.fullNote)}
              onMouseUp={() => onKeyUp(key.fullNote)}
              onMouseLeave={() =>
                activeKeys.has(key.fullNote) && onKeyUp(key.fullNote)
              }
              onTouchStart={(e) => {
                e.preventDefault();
                onKeyDown(key.fullNote);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                onKeyUp(key.fullNote);
              }}
              disabled={!isLoaded}
              style={{
                left: getBlackKeyPos(key.note, key.octave),
                width: `${60 / whiteKeys.length}%`,
              }}
              className={`absolute h-full rounded-b-md md:rounded-b-lg pointer-events-auto flex flex-col justify-end items-center pb-1 md:pb-2
                ${flashKeys.has(key.fullNote) ? "scale-[0.98]" : ""}
                ${
                  activeKeys.has(key.fullNote)
                    ? "bg-stone-500"
                    : "bg-gradient-to-b from-stone-700 to-stone-900 shadow-key hover:from-stone-600"
                } transition-all disabled:cursor-not-allowed`}
            >
              <span className="text-[7px] md:text-[10px] text-stone-300 font-medium uppercase">
                {key.keyboardKey}
              </span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-center text-stone-400 text-xs mt-2 md:mt-3">
        Salamander Grand Piano
      </p>
    </div>
  );
}

// ============== GAME PIANO - Larger with glow effects ==============
function GamePiano({
  activeKeys,
  flashKeys,
  onKeyPress,
  onKeyRelease,
}: {
  activeKeys: Set<string>;
  flashKeys: Set<string>;
  onKeyPress: (note: string) => void;
  onKeyRelease: (note: string) => void;
}) {
  const whiteKeys = PIANO_KEYS.filter((k) => k.type === "white");
  const blackKeys = PIANO_KEYS.filter((k) => k.type === "black");

  const getBlackKeyPos = (note: string, octave: number) => {
    const w = 100 / whiteKeys.length;
    let idx = 0;
    for (const k of PIANO_KEYS) {
      if (k.fullNote === `${note}${octave}`) break;
      if (k.type === "white") idx++;
    }
    return `${idx * w - w * 0.3}%`;
  };

  return (
    <div className="relative h-32 md:h-36 select-none">
      {/* White Keys */}
      <div className="relative flex h-full">
        {whiteKeys.map((key) => {
          const isActive = activeKeys.has(key.fullNote);
          const isFlashing = flashKeys.has(key.fullNote);
          return (
            <button
              key={key.fullNote}
              onMouseDown={() => onKeyPress(key.fullNote)}
              onMouseUp={() => onKeyRelease(key.fullNote)}
              onMouseLeave={() => isActive && onKeyRelease(key.fullNote)}
              onTouchStart={(e) => {
                e.preventDefault();
                onKeyPress(key.fullNote);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                onKeyRelease(key.fullNote);
              }}
              className={`
                relative flex-1 mx-[1px] md:mx-[2px] rounded-b-lg md:rounded-b-xl 
                flex flex-col items-center justify-end pb-2 md:pb-3
                transition-all duration-75 cursor-pointer
                ${isFlashing ? "scale-[0.97]" : ""}
                ${
                  isActive
                    ? "bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-500"
                    : "bg-gradient-to-b from-white via-stone-50 to-stone-100 hover:from-stone-50"
                }
              `}
              style={{
                boxShadow: isActive
                  ? "0 0 20px rgba(52, 211, 153, 0.8), 0 0 40px rgba(52, 211, 153, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.5)"
                  : "inset 0 -3px 6px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Key letter indicator */}
              <span
                className={`
                text-[10px] md:text-xs font-semibold uppercase tracking-wide
                ${isActive ? "text-white drop-shadow-sm" : "text-stone-400"}
              `}
              >
                {key.keyboardKey}
              </span>
            </button>
          );
        })}
      </div>

      {/* Black Keys */}
      <div className="absolute top-0 left-0 right-0 h-[60%] md:h-[65%] pointer-events-none">
        {blackKeys.map((key) => {
          const isActive = activeKeys.has(key.fullNote);
          const isFlashing = flashKeys.has(key.fullNote);
          return (
            <button
              key={key.fullNote}
              onMouseDown={() => onKeyPress(key.fullNote)}
              onMouseUp={() => onKeyRelease(key.fullNote)}
              onMouseLeave={() => isActive && onKeyRelease(key.fullNote)}
              onTouchStart={(e) => {
                e.preventDefault();
                onKeyPress(key.fullNote);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                onKeyRelease(key.fullNote);
              }}
              style={{
                left: getBlackKeyPos(key.note, key.octave),
                width: `${58 / whiteKeys.length}%`,
                boxShadow: isActive
                  ? "0 0 20px rgba(99, 102, 241, 0.9), 0 0 40px rgba(99, 102, 241, 0.5)"
                  : "0 4px 8px rgba(0, 0, 0, 0.5), inset 0 -2px 4px rgba(0, 0, 0, 0.3)",
              }}
              className={`
                absolute h-full rounded-b-md md:rounded-b-lg pointer-events-auto 
                flex flex-col items-center justify-end pb-1 md:pb-2
                transition-all duration-75 cursor-pointer
                ${isFlashing ? "scale-[0.97]" : ""}
                ${
                  isActive
                    ? "bg-gradient-to-b from-indigo-400 via-indigo-500 to-indigo-600"
                    : "bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 hover:from-stone-600"
                }
              `}
            >
              {/* Key letter indicator */}
              <span
                className={`
                text-[8px] md:text-[10px] font-semibold uppercase
                ${isActive ? "text-white drop-shadow-sm" : "text-stone-400"}
              `}
              >
                {key.keyboardKey}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reflection effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
    </div>
  );
}

// ============== BIRTHDAY POPUP COMPONENT ==============

function BirthdayPopup({ onClose }: { onClose: () => void }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const CONFETTI_PIECES = [
    { id: 0, left: 5, delay: 0.2, duration: 3.5, color: "#86efac" }, // mint
    { id: 1, left: 12, delay: 0.8, duration: 4.2, color: "#a7f3d0" }, // light mint
    { id: 2, left: 18, delay: 0.1, duration: 3.8, color: "#6ee7b7" }, // sage
    { id: 3, left: 25, delay: 1.2, duration: 4.5, color: "#d1d5db" }, // stone
    { id: 4, left: 32, delay: 0.5, duration: 3.2, color: "#86efac" },
    { id: 5, left: 38, delay: 1.8, duration: 4.8, color: "#a7f3d0" },
    { id: 6, left: 45, delay: 0.3, duration: 3.6, color: "#6ee7b7" },
    { id: 7, left: 52, delay: 1.5, duration: 4.1, color: "#d1d5db" },
    { id: 8, left: 58, delay: 0.7, duration: 3.9, color: "#86efac" },
    { id: 9, left: 65, delay: 1.1, duration: 4.4, color: "#a7f3d0" },
    { id: 10, left: 72, delay: 0.4, duration: 3.3, color: "#6ee7b7" },
    { id: 11, left: 78, delay: 1.6, duration: 4.7, color: "#d1d5db" },
    { id: 12, left: 85, delay: 0.9, duration: 3.7, color: "#86efac" },
    { id: 13, left: 92, delay: 1.3, duration: 4.3, color: "#a7f3d0" },
    { id: 14, left: 8, delay: 0.6, duration: 4.0, color: "#6ee7b7" },
    { id: 15, left: 15, delay: 1.9, duration: 3.4, color: "#d1d5db" },
    { id: 16, left: 22, delay: 0.2, duration: 4.6, color: "#86efac" },
    { id: 17, left: 28, delay: 1.4, duration: 3.1, color: "#a7f3d0" },
    { id: 18, left: 35, delay: 0.8, duration: 4.9, color: "#6ee7b7" },
    { id: 19, left: 42, delay: 1.7, duration: 3.5, color: "#d1d5db" },
    { id: 20, left: 48, delay: 0.3, duration: 4.2, color: "#86efac" },
    { id: 21, left: 55, delay: 1.0, duration: 3.8, color: "#a7f3d0" },
    { id: 22, left: 62, delay: 0.5, duration: 4.5, color: "#6ee7b7" },
    { id: 23, left: 68, delay: 1.2, duration: 3.2, color: "#d1d5db" },
    { id: 24, left: 75, delay: 0.7, duration: 4.8, color: "#86efac" },
    { id: 25, left: 82, delay: 1.5, duration: 3.6, color: "#a7f3d0" },
    { id: 26, left: 88, delay: 0.1, duration: 4.1, color: "#6ee7b7" },
    { id: 27, left: 95, delay: 1.8, duration: 3.9, color: "#d1d5db" },
    { id: 28, left: 3, delay: 0.4, duration: 4.4, color: "#86efac" },
    { id: 29, left: 10, delay: 1.6, duration: 3.3, color: "#a7f3d0" },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      {/* Confetti Effect - Music notes style */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {CONFETTI_PIECES.map((piece) => (
            <div
              key={piece.id}
              className="absolute animate-confetti text-xl"
              style={{
                left: `${piece.left}%`,
                top: `-20px`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                color: piece.color,
              }}
            >
              {piece.id % 3 === 0 ? "♪" : piece.id % 3 === 1 ? "♫" : "♬"}
            </div>
          ))}
        </div>
      )}

      {/* Popup Card */}
      <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl animate-bounce-in relative overflow-hidden border border-mint-100">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-mint-50/50 via-transparent to-sage-50/50 pointer-events-none" />

        {/* Decorative corners */}
        <div className="absolute top-3 left-3 text-mint-300 opacity-40">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
        <div className="absolute top-3 right-3 text-sage-300 opacity-40">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-mint-400 to-sage-500 flex items-center justify-center shadow-lg">
            <span className="text-3xl">🎂</span>
          </div>

          {/* Message */}
          <h2 className="font-display text-2xl font-semibold text-stone-800 mb-2">
            Happy Birthday!
          </h2>

          <p className="text-stone-500 mb-4">
            Wishing you a wonderful day filled with joy and beautiful melodies
          </p>

          {/* Decorative line with notes */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-mint-200 to-transparent" />
            <span className="text-mint-400 text-sm">♪ ♫ ♪</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-mint-200 to-transparent" />
          </div>

          <p className="text-stone-400 text-sm mb-6 italic">
            May your year be filled with beautiful things, good health, and all
            the happiness you deserved!!!
          </p>
          <p className="text-stone-400 text-sm mb-6 italic">
            I hope you&apos;ll achieve everything that you ever desired, Wishing
            you nothing but the best always
          </p>

          {/* Decorative line with notes */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-mint-200 to-transparent" />
            <span className="text-mint-400 text-sm">♪ ♫ ♪</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-mint-200 to-transparent" />
          </div>

          {/* Continue Button */}
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-mint-500 to-sage-500 
                       text-white font-medium rounded-xl shadow-md
                       hover:shadow-lg hover:scale-[1.02] transition-all
                       cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
