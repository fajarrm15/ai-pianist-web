// ============== QUICK PROMPT TYPES ==============
export interface QuickPrompt {
  label: string;
  prompt: string;
}

// ============== QUICK PROMPTS ==============
export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    label: "🎯 10 min warm-up",
    prompt: "Give me a quick 10 minute piano warm-up routine",
  },
  {
    label: "💪 Motivate me",
    prompt: "I'm not feeling motivated to practice today. Can you help?",
  },
  {
    label: "🌱 Beginner tips",
    prompt: "What are some essential tips for a beginner piano player?",
  },
  {
    label: "🎹 Left hand drills",
    prompt: "Give me some exercises to improve my left hand independence",
  },
  {
    label: "📚 Music theory",
    prompt: "Explain a music theory concept that will help my piano playing",
  },
  {
    label: "🎵 Song suggestion",
    prompt: "Suggest a beautiful piano piece for an intermediate player",
  },
];

// ============== MESSAGE TYPES ==============
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ============== INITIAL MESSAGES ==============
export const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey there! 🎹 I'm your Piano Buddy — here to help with practice tips, warm-ups, motivation, or anything piano-related. What's on your mind today?",
};
