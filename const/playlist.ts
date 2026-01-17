// ============== MOOD TYPES ==============
export interface Mood {
  id: string;
  label: string;
  emoji: string;
  bg: string;
}

export interface Situation {
  id: string;
  label: string;
}

// ============== MOODS ==============
export const MOODS: Mood[] = [
  {
    id: "happy",
    label: "Happy",
    emoji: "☀️",
    bg: "from-amber-100/50 to-orange-50/30",
  },
  {
    id: "sad",
    label: "Sad",
    emoji: "🌧️",
    bg: "from-blue-100/50 to-slate-50/30",
  },
  {
    id: "relaxed",
    label: "Relaxed",
    emoji: "🍃",
    bg: "from-mint-100/50 to-sage-50/30",
  },
  {
    id: "energetic",
    label: "Energetic",
    emoji: "⚡",
    bg: "from-yellow-100/50 to-amber-50/30",
  },
  {
    id: "romantic",
    label: "Romantic",
    emoji: "🌸",
    bg: "from-pink-100/50 to-rose-50/30",
  },
  {
    id: "melancholy",
    label: "Melancholy",
    emoji: "🌙",
    bg: "from-indigo-100/50 to-purple-50/30",
  },
  {
    id: "focused",
    label: "Focused",
    emoji: "🎯",
    bg: "from-cyan-100/50 to-sky-50/30",
  },
  {
    id: "dreamy",
    label: "Dreamy",
    emoji: "✨",
    bg: "from-violet-100/50 to-fuchsia-50/30",
  },
];

// ============== SITUATIONS ==============
export const SITUATIONS: Situation[] = [
  { id: "studying", label: "📚 Studying" },
  { id: "sleeping", label: "😴 Falling asleep" },
  { id: "morning", label: "☕ Morning coffee" },
  { id: "rainy", label: "🌧️ Rainy day" },
  { id: "working", label: "💼 Working" },
  { id: "unwinding", label: "🛋️ Unwinding" },
];

// ============== HELPERS ==============
export const getMoodById = (id: string): Mood | undefined => {
  return MOODS.find((mood) => mood.id === id);
};

export const getSituationById = (id: string): Situation | undefined => {
  return SITUATIONS.find((situation) => situation.id === id);
};

export const getRandomMood = (): Mood => {
  return MOODS[Math.floor(Math.random() * MOODS.length)];
};
