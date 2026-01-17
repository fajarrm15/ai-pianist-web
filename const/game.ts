// ============== GAME TIMING CONSTANTS ==============
export const FALL_DURATION = 2500; // Time for note to fall from top to hit zone (ms)
export const HIT_WINDOW_PERFECT = 100; // ±100ms for perfect hit
export const HIT_WINDOW_GOOD = 180; // ±180ms for good hit
export const HIT_WINDOW_MISS = 280; // ±280ms to still register as a hit attempt

// ============== SCORING ==============
export const SCORE_PERFECT = 100;
export const SCORE_GOOD = 50;
export const SCORE_MISS = 0;

// Combo multiplier increases every 10 combos, max 2x
export const COMBO_MULTIPLIER_INTERVAL = 10;
export const COMBO_MULTIPLIER_MAX = 2;

export const getComboMultiplier = (combo: number): number => {
  return Math.min(
    1 + Math.floor(combo / COMBO_MULTIPLIER_INTERVAL) * 0.1,
    COMBO_MULTIPLIER_MAX
  );
};

// ============== GAME TYPES ==============
export interface GameNote {
  id: string;
  note: string;
  time: number;
  duration: number;
  status: "pending" | "hit" | "missed";
  hitRating?: "perfect" | "good";
}

export type HitRating = "perfect" | "good" | "miss";

export type GameState = "idle" | "countdown" | "playing" | "paused" | "ended";

export interface GameStats {
  perfect: number;
  good: number;
  miss: number;
}

export const initialGameStats: GameStats = {
  perfect: 0,
  good: 0,
  miss: 0,
};

// ============== HIT EFFECT ==============
export interface HitEffect {
  id: string;
  x: number;
  rating: HitRating;
  timestamp: number;
}
