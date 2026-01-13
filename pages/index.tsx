import Link from "next/link";
import Head from "next/head";

const features = [
  {
    title: "Piano Buddy",
    description:
      "Your friendly AI companion for practice tips, warm-ups, and motivation. Ask anything piano-related!",
    href: "/companion",
    icon: "💬",
    gradient: "from-rose-100 to-rose-200",
  },
  {
    title: "Play Piano",
    description:
      "A simple, beautiful piano you can play right in your browser. No setup needed—just start playing.",
    href: "/piano",
    icon: "🎹",
    gradient: "from-cream-200 to-cream-300",
  },
  {
    title: "Mood Playlist",
    description:
      "Tell us how you're feeling, and we'll suggest the perfect piano pieces to match your mood.",
    href: "/playlist",
    icon: "🎵",
    gradient: "from-warm-100 to-warm-200",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Piano Companion</title>
        <meta
          name="description"
          content="Your cozy corner for piano practice and discovery"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-warm-50">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-6 pt-20 pb-16">
          <div className="text-center max-w-2xl">
            <h1 className="font-serif text-5xl md:text-6xl text-charcoal-900 mb-4">
              Piano Companion
            </h1>
            <p className="text-lg text-charcoal-700 leading-relaxed">
              Your cozy corner for piano. Practice, play, and discover new
              pieces — all in one place.
            </p>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group block"
              >
                <div
                  className={`
                    h-full p-8 rounded-2xl 
                    bg-gradient-to-br ${feature.gradient}
                    border border-warm-200
                    transition-all duration-300
                    hover:shadow-lg hover:shadow-warm-200/50
                    hover:-translate-y-1
                  `}
                >
                  <span className="text-4xl mb-4 block">{feature.icon}</span>
                  <h2 className="font-serif text-2xl text-charcoal-900 mb-2">
                    {feature.title}
                  </h2>
                  <p className="text-charcoal-700 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center text-rose-600 font-medium">
                    <span className="group-hover:mr-2 transition-all duration-300">
                      Explore
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-warm-500 text-sm">
          <p> Happy Pianing </p>
        </footer>
      </main>
    </>
  );
}
