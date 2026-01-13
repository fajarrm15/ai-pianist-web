import Link from "next/link";
import Head from "next/head";

export default function PianoPage() {
  return (
    <>
      <Head>
        <title>Play Piano | Piano Companion</title>
      </Head>

      <main className="min-h-screen bg-warm-50 p-6">
        <Link
          href="/"
          className="text-warm-500 hover:text-rose-600 transition-colors"
        >
          ← Back home
        </Link>
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <h1 className="font-serif text-4xl text-charcoal-900 mb-4">
            Play Piano
          </h1>
          <p className="text-charcoal-700">Piano feature coming soon...</p>
        </div>
      </main>
    </>
  );
}
