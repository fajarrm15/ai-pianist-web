import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/router";

// ============== TYPES ==============
interface MusicContextType {
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  isPlaying: boolean;
}

// ============== CONTEXT ==============
const MusicContext = createContext<MusicContextType | null>(null);

// ============== PROVIDER ==============
interface MusicProviderProps {
  children: ReactNode;
}

export function MusicProvider({ children }: MusicProviderProps) {
  const [volume, setVolumeState] = useState(0.3); // 30% default
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Initialize audio on mount
  useEffect(() => {
    const audio = new Audio("/audio/background-piano.mp3");
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    // Load saved preferences
    const savedVolume = localStorage.getItem("piano-music-volume");
    const savedMuted = localStorage.getItem("piano-music-muted");

    if (savedVolume) setVolumeState(parseFloat(savedVolume));
    if (savedMuted) setIsMuted(savedMuted === "true");

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Handle play on first user interaction
  useEffect(() => {
    const startAudio = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked, will try again on next interaction
          });
      }
    };

    // Try to play on any user interaction
    window.addEventListener("click", startAudio, { once: true });
    window.addEventListener("keydown", startAudio, { once: true });

    return () => {
      window.removeEventListener("click", startAudio);
      window.removeEventListener("keydown", startAudio);
    };
  }, [isPlaying]);

  // Fade function
  const fadeTo = useCallback(
    (targetVolume: number, duration: number = 1000) => {
      if (!audioRef.current) return;

      // Clear any existing fade
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      const startVolume = audioRef.current.volume;
      const volumeDiff = targetVolume - startVolume;
      const steps = 20;
      const stepDuration = duration / steps;
      const volumeStep = volumeDiff / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        if (audioRef.current) {
          audioRef.current.volume = Math.max(
            0,
            Math.min(1, startVolume + volumeStep * currentStep),
          );
        }

        if (currentStep >= steps) {
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
          }
        }
      }, stepDuration);
    },
    [],
  );

  // Handle route changes - fade out for piano page
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url.includes("/piano")) {
        // Entering piano page - fade out
        fadeTo(0, 1500);
      }
    };

    const handleRouteComplete = (url: string) => {
      if (!url.includes("/piano") && !isMuted) {
        // Left piano page - fade back in
        fadeTo(volume, 1500);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteComplete);
    };
  }, [router, fadeTo, volume, isMuted]);

  // Update volume when not on piano page
  useEffect(() => {
    if (audioRef.current && !router.pathname.includes("/piano") && !isMuted) {
      audioRef.current.volume = volume;
    }
  }, [volume, router.pathname, isMuted]);

  // Handle mute
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        fadeTo(0, 300);
      } else if (!router.pathname.includes("/piano")) {
        fadeTo(volume, 300);
      }
    }
    localStorage.setItem("piano-music-muted", String(isMuted));
  }, [isMuted, fadeTo, volume, router.pathname]);

  // Save volume preference
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem("piano-music-volume", String(newVolume));
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <MusicContext.Provider
      value={{ volume, setVolume, isMuted, toggleMute, isPlaying }}
    >
      {children}
    </MusicContext.Provider>
  );
}

// ============== HOOK ==============
export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
