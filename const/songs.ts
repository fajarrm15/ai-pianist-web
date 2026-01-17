// ============== SONG TYPES ==============
export interface SongNote {
  note: string;
  time: number;
  duration: number;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: "Easy" | "Medium" | "Hard";
  notes: SongNote[];
}

// ============== SONGS ==============
export const SONGS: Song[] = [
  {
    id: "twinkle",
    title: "Twinkle Twinkle",
    artist: "Traditional",
    difficulty: "Easy",
    notes: [
      { note: "C4", time: 0, duration: 400 },
      { note: "C4", time: 500, duration: 400 },
      { note: "G4", time: 1000, duration: 400 },
      { note: "G4", time: 1500, duration: 400 },
      { note: "A4", time: 2000, duration: 400 },
      { note: "A4", time: 2500, duration: 400 },
      { note: "G4", time: 3000, duration: 800 },
      { note: "F4", time: 4000, duration: 400 },
      { note: "F4", time: 4500, duration: 400 },
      { note: "E4", time: 5000, duration: 400 },
      { note: "E4", time: 5500, duration: 400 },
      { note: "D4", time: 6000, duration: 400 },
      { note: "D4", time: 6500, duration: 400 },
      { note: "C4", time: 7000, duration: 800 },
      // Second verse
      { note: "G4", time: 8500, duration: 400 },
      { note: "G4", time: 9000, duration: 400 },
      { note: "F4", time: 9500, duration: 400 },
      { note: "F4", time: 10000, duration: 400 },
      { note: "E4", time: 10500, duration: 400 },
      { note: "E4", time: 11000, duration: 400 },
      { note: "D4", time: 11500, duration: 800 },
    ],
  },
  {
    id: "mary",
    title: "Mary Had a Little Lamb",
    artist: "Traditional",
    difficulty: "Easy",
    notes: [
      { note: "E4", time: 0, duration: 400 },
      { note: "D4", time: 500, duration: 400 },
      { note: "C4", time: 1000, duration: 400 },
      { note: "D4", time: 1500, duration: 400 },
      { note: "E4", time: 2000, duration: 400 },
      { note: "E4", time: 2500, duration: 400 },
      { note: "E4", time: 3000, duration: 800 },
      { note: "D4", time: 4000, duration: 400 },
      { note: "D4", time: 4500, duration: 400 },
      { note: "D4", time: 5000, duration: 800 },
      { note: "E4", time: 6000, duration: 400 },
      { note: "G4", time: 6500, duration: 400 },
      { note: "G4", time: 7000, duration: 800 },
      { note: "E4", time: 8500, duration: 400 },
      { note: "D4", time: 9000, duration: 400 },
      { note: "C4", time: 9500, duration: 400 },
      { note: "D4", time: 10000, duration: 400 },
      { note: "E4", time: 10500, duration: 400 },
      { note: "E4", time: 11000, duration: 400 },
      { note: "E4", time: 11500, duration: 400 },
      { note: "E4", time: 12000, duration: 400 },
      { note: "D4", time: 12500, duration: 400 },
      { note: "D4", time: 13000, duration: 400 },
      { note: "E4", time: 13500, duration: 400 },
      { note: "D4", time: 14000, duration: 400 },
      { note: "C4", time: 14500, duration: 800 },
    ],
  },
  {
    id: "ode",
    title: "Ode to Joy",
    artist: "Beethoven",
    difficulty: "Medium",
    notes: [
      { note: "E4", time: 0, duration: 400 },
      { note: "E4", time: 500, duration: 400 },
      { note: "F4", time: 1000, duration: 400 },
      { note: "G4", time: 1500, duration: 400 },
      { note: "G4", time: 2000, duration: 400 },
      { note: "F4", time: 2500, duration: 400 },
      { note: "E4", time: 3000, duration: 400 },
      { note: "D4", time: 3500, duration: 400 },
      { note: "C4", time: 4000, duration: 400 },
      { note: "C4", time: 4500, duration: 400 },
      { note: "D4", time: 5000, duration: 400 },
      { note: "E4", time: 5500, duration: 400 },
      { note: "E4", time: 6000, duration: 600 },
      { note: "D4", time: 6700, duration: 200 },
      { note: "D4", time: 7000, duration: 800 },
      // Second part
      { note: "E4", time: 8500, duration: 400 },
      { note: "E4", time: 9000, duration: 400 },
      { note: "F4", time: 9500, duration: 400 },
      { note: "G4", time: 10000, duration: 400 },
      { note: "G4", time: 10500, duration: 400 },
      { note: "F4", time: 11000, duration: 400 },
      { note: "E4", time: 11500, duration: 400 },
      { note: "D4", time: 12000, duration: 400 },
      { note: "C4", time: 12500, duration: 400 },
      { note: "C4", time: 13000, duration: 400 },
      { note: "D4", time: 13500, duration: 400 },
      { note: "E4", time: 14000, duration: 400 },
      { note: "D4", time: 14500, duration: 600 },
      { note: "C4", time: 15200, duration: 200 },
      { note: "C4", time: 15500, duration: 800 },
    ],
  },
  {
    id: "canon",
    title: "Canon in D (Simple)",
    artist: "Pachelbel",
    difficulty: "Medium",
    notes: [
      { note: "F4", time: 0, duration: 500 },
      { note: "E4", time: 600, duration: 500 },
      { note: "D4", time: 1200, duration: 500 },
      { note: "C4", time: 1800, duration: 500 },
      { note: "B4", time: 2400, duration: 500 },
      { note: "A4", time: 3000, duration: 500 },
      { note: "B4", time: 3600, duration: 500 },
      { note: "C5", time: 4200, duration: 500 },
      { note: "F4", time: 5000, duration: 500 },
      { note: "E4", time: 5600, duration: 500 },
      { note: "D4", time: 6200, duration: 500 },
      { note: "C4", time: 6800, duration: 500 },
      { note: "B4", time: 7400, duration: 500 },
      { note: "A4", time: 8000, duration: 500 },
      { note: "B4", time: 8600, duration: 500 },
      { note: "C5", time: 9200, duration: 500 },
    ],
  },
];

// Helper to get song by ID
export const getSongById = (id: string): Song | undefined => {
  return SONGS.find((song) => song.id === id);
};
