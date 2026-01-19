import Link from "next/link";
import Head from "next/head";
import { useState, useEffect, useRef, useCallback } from "react";

// ============== QUOTES ==============
const MUSIC_QUOTES = [
  {
    text: "Music is the universal language of mankind.",
    author: "Henry Wadsworth Longfellow",
  },
  {
    text: "Where words fail, music speaks.",
    author: "Hans Christian Andersen",
  },
  {
    text: "The piano keys are black and white, but they sound like a million colors in your mind.",
    author: "Maria Cristina Mena",
  },
  {
    text: "Music gives a soul to the universe, wings to the mind, flight to the imagination.",
    author: "Plato",
  },
  {
    text: "One good thing about music, when it hits you, you feel no pain.",
    author: "Bob Marley",
  },
  {
    text: "Without music, life would be a mistake.",
    author: "Friedrich Nietzsche",
  },
  { text: "Music is the strongest form of magic.", author: "Marilyn Manson" },
  { text: "The only truth is music.", author: "Jack Kerouac" },
  {
    text: "Music expresses that which cannot be put into words.",
    author: "Victor Hugo",
  },
  {
    text: "Life is like a piano. What you get out of it depends on how you play it.",
    author: "Tom Lehrer",
  },
];

// ============== FEATURES ==============
const features = [
  {
    title: "Piano Buddy",
    description: "Your AI companion for tips, motivation & practice guidance",
    href: "/companion",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
    ),
    gradient: "from-mint-400/20 to-mint-500/10",
    iconBg: "bg-mint-500/10 text-mint-600",
  },
  {
    title: "Play Piano",
    description: "Beautiful virtual piano with realistic sounds & game mode",
    href: "/piano",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
        />
      </svg>
    ),
    gradient: "from-sage-300/30 to-sage-400/10",
    iconBg: "bg-sage-500/10 text-sage-600",
  },
  {
    title: "Mood Playlist",
    description: "AI-curated piano pieces matched to your current mood",
    href: "/playlist",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    ),
    gradient: "from-mint-300/20 via-sage-200/20 to-ivory-200/30",
    iconBg: "bg-gradient-to-br from-mint-500/10 to-sage-500/10 text-forest-600",
  },
];

// ============== FLOATING MUSIC NOTES ==============
const NOTE_SYMBOLS = ["♪", "♫", "♬", "𝄞"];

// Pre-generate notes data (static, no randomness needed at runtime)
const FLOATING_NOTES = [
  { id: 0, x: 10, delay: 0, duration: 10, symbol: "♪" },
  { id: 1, x: 25, delay: 2, duration: 12, symbol: "♫" },
  { id: 2, x: 40, delay: 1, duration: 9, symbol: "♬" },
  { id: 3, x: 55, delay: 3, duration: 11, symbol: "𝄞" },
  { id: 4, x: 70, delay: 0.5, duration: 10, symbol: "♪" },
  { id: 5, x: 85, delay: 4, duration: 8, symbol: "♫" },
  { id: 6, x: 15, delay: 2.5, duration: 12, symbol: "♬" },
  { id: 7, x: 90, delay: 1.5, duration: 9, symbol: "𝄞" },
];

function FloatingNotes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {FLOATING_NOTES.map((note) => (
        <div
          key={note.id}
          className="absolute text-mint-300/30 text-2xl animate-float-up"
          style={{
            left: `${note.x}%`,
            animationDelay: `${note.delay}s`,
            animationDuration: `${note.duration}s`,
          }}
        >
          {note.symbol}
        </div>
      ))}
    </div>
  );
}

// ============== PIANO DECORATION ==============
function PianoDecoration() {
  return (
    <div className="flex items-end justify-center gap-[2px] h-8 opacity-40">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="relative">
          <div className="w-4 h-8 bg-stone-200 rounded-b-sm" />
          {i !== 2 && i !== 6 && (
            <div className="absolute -right-[5px] top-0 w-3 h-5 bg-stone-400 rounded-b-sm z-10" />
          )}
        </div>
      ))}
    </div>
  );
}

// ============== QUOTE HOOK ==============
function useRotatingQuote() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isQuoteFading, setIsQuoteFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsQuoteFading(true);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % MUSIC_QUOTES.length);
        setIsQuoteFading(false);
      }, 500);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  return { quote: MUSIC_QUOTES[quoteIndex], isQuoteFading };
}

// ============== MAIN COMPONENT ==============
export default function Home() {
  const { quote, isQuoteFading } = useRotatingQuote();

  return (
    <>
      <Head>
        <title>Piano Companion — Your Personal Piano Space</title>
        <meta
          name="description"
          content="Practice, play, and discover piano pieces in one beautiful place"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen relative overflow-hidden">
        {/* Floating music notes */}
        <FloatingNotes />

        {/* Background decorations */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-mint-200/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sage-200/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-ivory-200/50 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Hero */}
          <section className="max-w-5xl mx-auto px-6 pt-16 pb-8 md:pt-24 md:pb-12">
            <div className="text-center animate-fade-in">
              {/* Piano decoration */}
              <div className="mb-6">
                <PianoDecoration />
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 text-sm text-stone-600 mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-mint-500 animate-pulse-soft" />
                Your personal piano space
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-stone-800 tracking-tight mb-4">
                Piano
                <span className="text-gradient"> Companion</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-stone-500 max-w-lg mx-auto leading-relaxed mb-8">
                Practice, play, and discover beautiful piano pieces — all in one
                elegant place.
              </p>

              {/* Quote */}
              <div
                className={`max-w-md mx-auto transition-opacity duration-500 ${isQuoteFading ? "opacity-0" : "opacity-100"}`}
              >
                <blockquote className="text-stone-400 italic text-sm">
                  &quot;{quote.text}&quot;
                </blockquote>
                <p className="text-mint-600 text-xs mt-1">— {quote.author}</p>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="max-w-5xl mx-auto px-6 pb-20">
            <div className="grid md:grid-cols-3 gap-5">
              {features.map((feature, i) => (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div
                    className={`
                    relative h-full p-6 rounded-3xl
                    bg-white
                    border border-stone-200
                    shadow-card hover:shadow-card-hover
                    transition-all duration-300
                    hover:-translate-y-2 hover:scale-[1.02]
                    active:scale-[0.98]
                  `}
                  >
                    {/* Icon */}
                    <div
                      className={`
                      w-12 h-12 rounded-2xl ${feature.iconBg}
                      flex items-center justify-center mb-4
                      group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
                    `}
                    >
                      {feature.icon}
                    </div>

                    {/* Content */}
                    <h2 className="font-display text-xl font-semibold text-stone-800 mb-2 group-hover:text-mint-700 transition-colors">
                      {feature.title}
                    </h2>
                    <p className="text-stone-500 text-sm leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-1 text-sm font-medium text-mint-600 group-hover:text-mint-500">
                      <span>Explore</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>

                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-mint-100/0 to-mint-100/0 group-hover:from-mint-50 group-hover:to-transparent transition-all duration-300 -z-10" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center py-8 border-t border-sage-100/50">
            <p className="text-sm text-stone-400">
              <span className="text-mint-500 animate-pulse">♫</span>
              Happy Pianing{" "}
              <span className="text-mint-500 animate-pulse">♫</span>
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
