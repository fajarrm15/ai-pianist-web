import Link from "next/link";
import Head from "next/head";
import { useState } from "react";

const MOODS = [
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "sad", label: "Sad", emoji: "😢" },
  { id: "relaxed", label: "Relaxed", emoji: "😌" },
  { id: "energetic", label: "Energetic", emoji: "⚡" },
  { id: "romantic", label: "Romantic", emoji: "💕" },
  { id: "melancholy", label: "Melancholy", emoji: "🌧️" },
  { id: "focused", label: "Focused", emoji: "🎯" },
  { id: "dreamy", label: "Dreamy", emoji: "✨" },
];

const SITUATIONS = [
  { id: "studying", label: "Studying" },
  { id: "sleeping", label: "Falling asleep" },
  { id: "morning", label: "Morning coffee" },
  { id: "rainy", label: "Rainy day" },
  { id: "working", label: "Working" },
  { id: "unwinding", label: "Unwinding" },
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
  situation?: string;
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
        <title>Mood Playlist | Piano Companion</title>
      </Head>

      <main className="min-h-screen bg-base-100">
        {/* Header */}
        <header className="border-b border-base-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
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
              <div className="w-2 h-2 rounded-full bg-linear-to-r from-sage-400 to-sky-400" />
              <h1 className="font-display font-semibold text-neutral-800">
                Mood Playlist
              </h1>
            </div>
            <div className="w-16" />
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-10">
          {/* Result View */}
          {result ? (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">
                  {getMoodData(result.mood)?.emoji}
                </span>
                <h2 className="font-display text-2xl font-semibold text-neutral-800 mb-2">
                  Your {getMoodData(result.mood)?.label} Playlist
                </h2>
                <p className="text-neutral-500">{result.intro}</p>
              </div>

              <div className="space-y-3">
                {result.pieces.map((piece, index) => (
                  <div
                    key={index}
                    className="bg-white border border-base-200 rounded-xl p-5 shadow-card hover:shadow-hover transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-display font-semibold text-neutral-800">
                          {piece.title}
                        </h3>
                        <p className="text-neutral-400 text-sm">
                          {piece.composer}
                        </p>
                      </div>
                      {piece.difficulty && (
                        <span className="text-xs bg-base-200 text-neutral-500 px-2.5 py-1 rounded-full">
                          {piece.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      {piece.why}
                    </p>
                    {piece.youtubeSearch && (
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          piece.youtubeSearch
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-sm text-sky-600 hover:text-sky-700"
                      >
                        Listen on YouTube
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
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={generatePlaylist}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-base-200 hover:bg-base-300 text-neutral-700 
                           rounded-full text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Generating..." : "Regenerate"}
                </button>
                <button
                  onClick={reset}
                  className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-900 text-white 
                           rounded-full text-sm font-medium transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          ) : (
            /* Selection View */
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="font-display text-2xl font-semibold text-neutral-800 mb-2">
                  How are you feeling?
                </h2>
                <p className="text-neutral-500">
                  Pick a mood and we&apos;ll suggest perfect piano pieces for
                  you.
                </p>
              </div>

              {/* Mood Selection */}
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-3">
                  Select a mood
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`
                        p-4 rounded-xl border-2 transition-all text-center
                        ${
                          selectedMood === mood.id
                            ? "border-sage-400 bg-sage-50"
                            : "border-base-200 bg-white hover:border-base-300 hover:bg-base-100"
                        }
                      `}
                    >
                      <span className="text-2xl block mb-1">{mood.emoji}</span>
                      <span className="text-xs text-neutral-600">
                        {mood.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Situation Selection */}
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-3">
                  What are you doing?{" "}
                  <span className="text-neutral-400">(optional)</span>
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
                        px-4 py-2 rounded-full text-sm transition-all
                        ${
                          selectedSituation === situation.id
                            ? "bg-neutral-800 text-white"
                            : "bg-base-200 text-neutral-600 hover:bg-base-300"
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
                <div className="text-center text-red-600 bg-red-50 py-3 px-4 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <div className="text-center pt-2">
                <button
                  onClick={generatePlaylist}
                  disabled={!selectedMood || isLoading}
                  className="px-8 py-3 bg-neutral-800 hover:bg-neutral-900 text-white 
                           rounded-full font-medium transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating playlist...
                    </span>
                  ) : (
                    "Generate Playlist"
                  )}
                </button>

                <button
                  onClick={() => {
                    const randomMood =
                      MOODS[Math.floor(Math.random() * MOODS.length)].id;
                    setSelectedMood(randomMood);
                  }}
                  disabled={isLoading}
                  className="block mx-auto mt-4 text-sm text-neutral-400 hover:text-neutral-600 
                           transition-colors disabled:opacity-50"
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
