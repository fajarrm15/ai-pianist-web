import Link from "next/link";
import Head from "next/head";
import { useState } from "react";

const MOODS = [
  {
    id: "happy",
    label: "Happy",
    emoji: "☀️",
    bg: "from-amber-100/50 to-orange-50/30",
  },
  {
    id: "sad",
    label: "Sad",
    emoji: "🌧️",
    bg: "from-blue-100/50 to-slate-50/30",
  },
  {
    id: "relaxed",
    label: "Relaxed",
    emoji: "🍃",
    bg: "from-mint-100/50 to-sage-50/30",
  },
  {
    id: "energetic",
    label: "Energetic",
    emoji: "⚡",
    bg: "from-yellow-100/50 to-amber-50/30",
  },
  {
    id: "romantic",
    label: "Romantic",
    emoji: "🌸",
    bg: "from-pink-100/50 to-rose-50/30",
  },
  {
    id: "melancholy",
    label: "Melancholy",
    emoji: "🌙",
    bg: "from-indigo-100/50 to-purple-50/30",
  },
  {
    id: "focused",
    label: "Focused",
    emoji: "🎯",
    bg: "from-cyan-100/50 to-sky-50/30",
  },
  {
    id: "dreamy",
    label: "Dreamy",
    emoji: "✨",
    bg: "from-violet-100/50 to-fuchsia-50/30",
  },
];

const SITUATIONS = [
  { id: "studying", label: "📚 Studying" },
  { id: "sleeping", label: "😴 Falling asleep" },
  { id: "morning", label: "☕ Morning coffee" },
  { id: "rainy", label: "🌧️ Rainy day" },
  { id: "working", label: "💼 Working" },
  { id: "unwinding", label: "🛋️ Unwinding" },
];

interface PieceRecommendation {
  title: string;
  composer: string;
  why: string;
  difficulty?: string;
  youtubeSearch?: string;
}

interface PlaylistResult {
  mood: string;
  intro: string;
  pieces: PieceRecommendation[];
}

export default function PlaylistPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedSituation, setSelectedSituation] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlaylistResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePlaylist = async () => {
    if (!selectedMood) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood,
          situation: selectedSituation,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate playlist");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
      setError("Couldn't generate your playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSelectedMood(null);
    setSelectedSituation(null);
    setResult(null);
    setError(null);
  };

  const getMoodData = (id: string) => MOODS.find((m) => m.id === id);

  return (
    <>
      <Head>
        <title>Mood Playlist — Piano Companion</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-stone-50 via-mint-50/30 to-stone-50">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-mint-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-sage-200/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-mint-100/20 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-mint-100 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-stone-400 hover:text-mint-600 transition-colors cursor-pointer"
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

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-mint-400 to-sage-500 flex items-center justify-center shadow-md">
                <span className="text-lg">🎵</span>
              </div>
              <div>
                <h1 className="font-display font-semibold text-stone-800">
                  Mood Playlist
                </h1>
                <p className="text-xs text-mint-600">
                  AI-powered recommendations
                </p>
              </div>
            </div>

            <div className="w-16" />
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-10 relative z-0">
          {result ? (
            // Results View
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-mint-100 to-sage-100 mb-4 shadow-sm">
                  <span className="text-4xl">
                    {getMoodData(result.mood)?.emoji}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-semibold text-stone-800 mb-2">
                  Your {getMoodData(result.mood)?.label} Playlist
                </h2>
                <p className="text-stone-500">{result.intro}</p>
              </div>

              <div className="space-y-3">
                {result.pieces.map((piece, index) => (
                  <div
                    key={index}
                    className="bg-white border border-mint-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-mint-200 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-display font-semibold text-stone-800">
                          {piece.title}
                        </h3>
                        <p className="text-stone-400 text-sm">
                          {piece.composer}
                        </p>
                      </div>
                      {piece.difficulty && (
                        <span className="text-xs bg-mint-50 text-mint-700 px-2.5 py-1 rounded-full border border-mint-200">
                          {piece.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600 text-sm leading-relaxed mb-3">
                      {piece.why}
                    </p>
                    {piece.youtubeSearch && (
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          piece.youtubeSearch
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-mint-600 hover:text-mint-700 transition-colors cursor-pointer font-medium"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                        Listen on YouTube
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={generatePlaylist}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-white hover:bg-mint-50 border border-mint-200 text-stone-700 
                           rounded-xl text-sm font-medium transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed
                           hover:border-mint-300"
                >
                  {isLoading ? "Generating..." : "🔄 Regenerate"}
                </button>
                <button
                  onClick={reset}
                  className="px-5 py-2.5 bg-gradient-to-r from-mint-500 to-sage-500 hover:from-mint-600 hover:to-sage-600 text-white 
                           rounded-xl text-sm font-medium transition-all shadow-md cursor-pointer hover:shadow-lg"
                >
                  ✨ New Playlist
                </button>
              </div>
            </div>
          ) : (
            // Selection View
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <h2 className="font-display text-3xl font-semibold text-stone-800 mb-2">
                  How are you feeling?
                </h2>
                <p className="text-stone-500">
                  Select a mood and we&apos;ll find the perfect piano pieces for
                  you
                </p>
              </div>

              {/* Mood Grid */}
              <div>
                <p className="text-sm font-medium text-stone-500 mb-3 flex items-center gap-2">
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Choose your mood
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`
                        p-4 rounded-2xl border-2 transition-all text-center cursor-pointer
                        bg-gradient-to-br ${mood.bg}
                        ${
                          selectedMood === mood.id
                            ? "border-mint-400 shadow-md scale-[1.02] ring-2 ring-mint-200"
                            : "border-transparent hover:border-mint-200 hover:shadow-sm"
                        }
                      `}
                    >
                      <span className="text-2xl block mb-1">{mood.emoji}</span>
                      <span className="text-xs font-medium text-stone-700">
                        {mood.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Situation Tags */}
              <div>
                <p className="text-sm font-medium text-stone-500 mb-3 flex items-center gap-2">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  What are you doing?{" "}
                  <span className="text-stone-400 font-normal">(optional)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {SITUATIONS.map((situation) => (
                    <button
                      key={situation.id}
                      onClick={() =>
                        setSelectedSituation(
                          selectedSituation === situation.id
                            ? null
                            : situation.id
                        )
                      }
                      className={`
                        px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer
                        ${
                          selectedSituation === situation.id
                            ? "bg-gradient-to-r from-mint-500 to-sage-500 text-white shadow-md"
                            : "bg-white text-stone-600 border border-mint-100 hover:border-mint-300 hover:bg-mint-50"
                        }
                      `}
                    >
                      {situation.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="text-center text-red-600 bg-red-50 py-3 px-4 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <div className="text-center pt-4">
                <button
                  onClick={generatePlaylist}
                  disabled={!selectedMood || isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-mint-500 to-sage-500 hover:from-mint-600 hover:to-sage-600 text-white 
                           rounded-2xl font-medium transition-all shadow-lg cursor-pointer
                           disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-105 active:scale-100"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating your playlist...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 3l14 9-14 9V3z"
                        />
                      </svg>
                      Generate Playlist
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    const randomMood =
                      MOODS[Math.floor(Math.random() * MOODS.length)].id;
                    setSelectedMood(randomMood);
                  }}
                  disabled={isLoading}
                  className="flex items-center gap-2 mx-auto mt-4 text-sm text-stone-400 hover:text-mint-600 
                           transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Surprise me
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
