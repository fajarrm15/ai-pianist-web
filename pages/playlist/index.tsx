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

      <main className="min-h-screen bg-gradient-to-b from-stone-100 via-sage-50 to-stone-100">
        {/* Header */}
        <header className="glass border-b border-sage-100/50 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-stone-400 hover:text-forest-600 transition-colors"
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
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-mint-400 to-sage-400" />
              <h1 className="font-display font-semibold text-forest-800">
                Mood Playlist
              </h1>
            </div>

            <div className="w-16" />
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-10">
          {result ? (
            // Results View
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <span className="text-5xl mb-4 block">
                  {getMoodData(result.mood)?.emoji}
                </span>
                <h2 className="font-display text-2xl font-semibold text-forest-800 mb-2">
                  Your {getMoodData(result.mood)?.label} Playlist
                </h2>
                <p className="text-stone-500">{result.intro}</p>
              </div>

              <div className="space-y-3">
                {result.pieces.map((piece, index) => (
                  <div
                    key={index}
                    className="bg-white border border-stone-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-display font-semibold text-forest-800">
                          {piece.title}
                        </h3>
                        <p className="text-stone-400 text-sm">
                          {piece.composer}
                        </p>
                      </div>
                      {piece.difficulty && (
                        <span className="text-xs bg-sage-100/50 text-sage-600 px-2.5 py-1 rounded-full">
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
                        className="inline-flex items-center gap-1.5 text-sm text-mint-600 hover:text-mint-500 transition-colors cursor-pointer"
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
                  className="px-5 py-2.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 
                           rounded-full text-sm font-medium transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isLoading ? "Generating..." : "🔄 Regenerate"}
                </button>
                <button
                  onClick={reset}
                  className="px-5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white 
                           rounded-full text-sm font-medium transition-all shadow-soft cursor-pointer"
                >
                  New Playlist
                </button>
              </div>
            </div>
          ) : (
            // Selection View
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <h2 className="font-display text-2xl font-semibold text-forest-800 mb-2">
                  How are you feeling?
                </h2>
                <p className="text-stone-500">
                  Select a mood and we&apos;ll find the perfect piano pieces for
                  you
                </p>
              </div>

              {/* Mood Grid */}
              <div>
                <p className="text-sm font-medium text-stone-400 mb-3">
                  Choose your mood
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`
                        p-4 rounded-2xl border-2 transition-all text-center cursor-pointer
                        bg-gradient-to-br ${mood.bg}
                        ${
                          selectedMood === mood.id
                            ? "border-mint-400 shadow-md scale-[1.02] bg-white"
                            : "border-stone-200 hover:border-mint-300 bg-white"
                        }
                      `}
                    >
                      <span className="text-2xl block mb-1">{mood.emoji}</span>
                      <span className="text-xs font-medium text-forest-700">
                        {mood.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Situation Tags */}
              <div>
                <p className="text-sm font-medium text-stone-400 mb-3">
                  What are you doing?{" "}
                  <span className="text-stone-300">(optional)</span>
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
                        px-4 py-2 rounded-full text-sm transition-all cursor-pointer
                        ${
                          selectedSituation === situation.id
                            ? "bg-stone-800 text-white shadow-soft"
                            : "bg-white text-stone-600 border border-stone-200 hover:border-mint-300"
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
                <div className="text-center text-red-600 bg-red-50/50 backdrop-blur-sm py-3 px-4 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <div className="text-center pt-4">
                <button
                  onClick={generatePlaylist}
                  disabled={!selectedMood || isLoading}
                  className="px-8 py-3.5 bg-stone-800 hover:bg-stone-900 text-white 
                           rounded-full font-medium transition-all shadow-soft cursor-pointer
                           disabled:opacity-50 disabled:cursor-not-allowed"
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
                      Creating playlist...
                    </span>
                  ) : (
                    "✨ Generate Playlist"
                  )}
                </button>

                <button
                  onClick={() => {
                    const randomMood =
                      MOODS[Math.floor(Math.random() * MOODS.length)].id;
                    setSelectedMood(randomMood);
                  }}
                  disabled={isLoading}
                  className="block mx-auto mt-4 text-sm text-stone-400 hover:text-mint-600 
                           transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  🎲 Surprise me
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
