import { useState } from "react";
import { useMusic } from "@/contexts/music-context";

export function VolumeControl() {
  const { volume, setVolume, isMuted, toggleMute } = useMusic();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        {/* Volume Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200 
                     shadow-sm hover:shadow-md transition-all flex items-center justify-center
                     hover:bg-white"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? (
            <svg
              className="w-5 h-5 text-stone-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
              />
            </svg>
          ) : volume < 0.5 ? (
            <svg
              className="w-5 h-5 text-stone-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-mint-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
              />
            </svg>
          )}
        </button>

        {/* Volume Slider Popup */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

            {/* Slider Card */}
            <div className="absolute top-12 right-0 bg-white rounded-2xl shadow-lg border border-stone-200 p-4 w-48">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-stone-700">
                  Volume
                </span>
                <button
                  onClick={toggleMute}
                  className="text-xs text-mint-600 hover:text-mint-700"
                >
                  {isMuted ? "Unmute" : "Mute"}
                </button>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  if (isMuted && newVolume > 0) {
                    toggleMute();
                  }
                }}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-4
                           [&::-webkit-slider-thumb]:h-4
                           [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:bg-mint-500
                           [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-webkit-slider-thumb]:shadow-md
                           [&::-webkit-slider-thumb]:hover:bg-mint-600"
              />

              {/* Volume percentage */}
              <div className="text-center mt-2">
                <span className="text-xs text-stone-400">
                  {isMuted
                    ? "Muted"
                    : `${Math.round((isMuted ? 0 : volume) * 100)}%`}
                </span>
              </div>

              {/* Music note indicator */}
              <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-stone-100">
                <span className="text-mint-500 text-sm">♪</span>
                <span className="text-xs text-stone-400">Background Piano</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
