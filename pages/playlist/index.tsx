import Head from "next/head";
import { useState, useEffect } from "react";
import {
  PageLayout,
  Header,
  Badge,
  Button,
  Card,
  LoadingSpinner,
  SectionLabel,
} from "@/components";
import {
  MOODS,
  SITUATIONS,
  getMoodById,
  getRandomMood,
  type Mood,
} from "@/const";

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

// Icons
const HeartIcon = () => (
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
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const ClockIcon = () => (
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const PlayIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
  </svg>
);

const RefreshIcon = () => (
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
);

const YouTubeIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
  </svg>
);

export default function PlaylistPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedSituation, setSelectedSituation] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlaylistResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWarmedUp, setIsWarmedUp] = useState(false);

  // Pre-warm the LLM when page loads
  useEffect(() => {
    const warmUp = async () => {
      try {
        await fetch("/api/playlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood: "happy", warmup: true }),
        });
        setIsWarmedUp(true);
      } catch {
        // Ignore errors, warmup is best-effort
      }
    };

    warmUp();
  }, []);

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

  const getMoodData = (id: string): Mood | undefined => getMoodById(id);

  return (
    <>
      <Head>
        <title>Mood Playlist — Piano Companion</title>
      </Head>

      <PageLayout>
        <Header
          title="Mood Playlist"
          subtitle="AI-powered recommendations"
          icon={<span className="text-lg">🎵</span>}
        />

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
                  <Card key={index} className="p-5">
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
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(piece.youtubeSearch)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-mint-600 hover:text-mint-700 transition-colors cursor-pointer font-medium"
                      >
                        <YouTubeIcon />
                        Listen on YouTube
                      </a>
                    )}
                  </Card>
                ))}
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <Button
                  onClick={generatePlaylist}
                  disabled={isLoading}
                  variant="secondary"
                >
                  {isLoading ? "Generating..." : "🔄 Regenerate"}
                </Button>
                <Button onClick={reset} variant="primary">
                  ✨ New Playlist
                </Button>
              </div>
            </div>
          ) : (
            // Selection View
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <Badge>AI Playlist Generator</Badge>
                <h2 className="font-display text-3xl font-semibold text-stone-800 mb-2 mt-4">
                  How are you feeling?
                </h2>
                <p className="text-stone-500">
                  Select a mood and we&apos;ll find the perfect piano pieces for
                  you
                </p>
              </div>

              {/* Mood Grid */}
              <div>
                <SectionLabel icon={<HeartIcon />}>
                  Choose your mood
                </SectionLabel>
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
                <SectionLabel icon={<ClockIcon />}>
                  What are you doing?{" "}
                  <span className="text-stone-400 font-normal">(optional)</span>
                </SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {SITUATIONS.map((situation) => (
                    <button
                      key={situation.id}
                      onClick={() =>
                        setSelectedSituation(
                          selectedSituation === situation.id
                            ? null
                            : situation.id,
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
                <Button
                  onClick={generatePlaylist}
                  disabled={!selectedMood || isLoading}
                  variant="primary"
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner />
                      Creating your playlist...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <PlayIcon />
                      Generate Playlist
                    </span>
                  )}
                </Button>

                <button
                  onClick={() => setSelectedMood(getRandomMood().id)}
                  disabled={isLoading}
                  className="flex items-center gap-2 mx-auto mt-4 text-sm text-stone-400 hover:text-mint-600 
                           transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <RefreshIcon />
                  Surprise me
                </button>
              </div>
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
}
