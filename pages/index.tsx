import Link from "next/link";
import Head from "next/head";

const features = [
  {
    title: "Piano Buddy",
    description: "Your AI companion for practice tips and motivation",
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
    color: "bg-sage-50 text-sage-600",
    hoverColor: "group-hover:bg-sage-100",
  },
  {
    title: "Play Piano",
    description: "A beautiful piano you can play right in your browser",
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
    color: "bg-sky-50 text-sky-600",
    hoverColor: "group-hover:bg-sky-100",
  },
  {
    title: "Mood Playlist",
    description: "Get personalized piano piece recommendations",
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
    color: "bg-gradient-to-br from-sage-50 to-sky-50 text-sage-600",
    hoverColor: "group-hover:from-sage-100 group-hover:to-sky-100",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Piano Companion</title>
        <meta name="description" content="Your cozy corner for piano" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-linear-to-br from-sage-50/50 via-white to-sky-50/50" />

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-sage-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20">
            <div className="text-center">
              {/* Small badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-200 text-neutral-600 text-sm mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-400" />
                Your personal piano space
              </div>

              <h1 className="font-display text-5xl md:text-6xl font-semibold text-neutral-900 tracking-tight mb-4">
                Piano Companion
              </h1>
              <p className="text-lg text-neutral-500 max-w-md mx-auto leading-relaxed">
                Practice, play, and discover new pieces — all in one beautiful
                place.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group block"
              >
                <div className="h-full p-6 rounded-2xl bg-white border border-base-300 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.color} ${feature.hoverColor} flex items-center justify-center mb-4 transition-colors`}
                  >
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h2 className="font-display text-lg font-semibold text-neutral-800 mb-1">
                    {feature.title}
                  </h2>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Arrow */}
                  <div className="mt-4 flex items-center text-sm font-medium text-neutral-400 group-hover:text-sage-600 transition-colors">
                    <span>Get started</span>
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-base-200">
          <p className="text-sm text-neutral-400">Happy Pianing</p>
        </footer>
      </main>
    </>
  );
}
