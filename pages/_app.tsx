import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MusicProvider } from "@/contexts/music-context";
import { VolumeControl } from "@/components";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MusicProvider>
      <VolumeControl />
      <Component {...pageProps} />
    </MusicProvider>
  );
}
