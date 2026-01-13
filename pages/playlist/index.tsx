import Link from "next/link";
import Head from "next/head";

export default function PlaylistPage() {
  return (
    <>
      <Head>
        <title>Mood Playlist | Piano Companion</title>
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
            Mood Playlist
          </h1>
          <p className="text-charcoal-700">Playlist feature coming soon...</p>
        </div>
      </main>
    </>
  );
}
