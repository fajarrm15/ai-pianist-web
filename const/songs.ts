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
  bpm: number;
  notes: SongNote[];
}

// ============== AVAILABLE NOTES ==============
// Keyboard range: C4, C#4, D4, D#4, E4, F4, F#4, G4, G#4, A4, A#4, B4, C5, C#5, D5, D#5, E5
//
// White keys (10): C4, D4, E4, F4, G4, A4, B4, C5, D5, E5
// Black keys (7): C#4, D#4, F#4, G#4, A#4, C#5, D#5

// ============== SONGS ==============
export const SONGS: Song[] = [
  // ==================== EASY ====================
  {
    id: "happy-birthday",
    title: "Happy Birthday",
    artist: "Traditional",
    difficulty: "Easy",
    bpm: 100,
    notes: [
      // Line 1: "Happy birthday to you"
      // Hap-py birth-day to you
      { note: "G4", time: 0, duration: 250 },
      { note: "G4", time: 300, duration: 250 },
      { note: "A4", time: 600, duration: 500 },
      { note: "G4", time: 1200, duration: 500 },
      { note: "C5", time: 1800, duration: 500 },
      { note: "B4", time: 2400, duration: 800 },

      // Line 2: "Happy birthday to you"
      { note: "G4", time: 3600, duration: 250 },
      { note: "G4", time: 3900, duration: 250 },
      { note: "A4", time: 4200, duration: 500 },
      { note: "G4", time: 4800, duration: 500 },
      { note: "D5", time: 5400, duration: 500 },
      { note: "C5", time: 6000, duration: 800 },

      // Line 3: "Happy birthday dear [name]"
      { note: "G4", time: 7200, duration: 250 },
      { note: "G4", time: 7500, duration: 250 },
      { note: "E5", time: 7800, duration: 500 },
      { note: "C5", time: 8400, duration: 500 },
      { note: "B4", time: 9000, duration: 500 },
      { note: "A4", time: 9600, duration: 800 },

      // Line 4: "Happy birthday to you"
      { note: "D5", time: 10800, duration: 250 },
      { note: "D5", time: 11100, duration: 250 },
      { note: "C5", time: 11400, duration: 500 },
      { note: "A4", time: 12000, duration: 500 },
      { note: "B4", time: 12600, duration: 500 },
      { note: "C5", time: 13200, duration: 1000 },
    ],
  },
  {
    id: "twinkle",
    title: "Twinkle Twinkle Little Star",
    artist: "Traditional",
    difficulty: "Easy",
    bpm: 90,
    notes: [
      // "Twinkle twinkle little star" - C C G G A A G
      { note: "C4", time: 0, duration: 400 },
      { note: "C4", time: 500, duration: 400 },
      { note: "G4", time: 1000, duration: 400 },
      { note: "G4", time: 1500, duration: 400 },
      { note: "A4", time: 2000, duration: 400 },
      { note: "A4", time: 2500, duration: 400 },
      { note: "G4", time: 3000, duration: 800 },

      // "How I wonder what you are" - F F E E D D C
      { note: "F4", time: 4000, duration: 400 },
      { note: "F4", time: 4500, duration: 400 },
      { note: "E4", time: 5000, duration: 400 },
      { note: "E4", time: 5500, duration: 400 },
      { note: "D4", time: 6000, duration: 400 },
      { note: "D4", time: 6500, duration: 400 },
      { note: "C4", time: 7000, duration: 800 },

      // "Up above the world so high" - G G F F E E D
      { note: "G4", time: 8000, duration: 400 },
      { note: "G4", time: 8500, duration: 400 },
      { note: "F4", time: 9000, duration: 400 },
      { note: "F4", time: 9500, duration: 400 },
      { note: "E4", time: 10000, duration: 400 },
      { note: "E4", time: 10500, duration: 400 },
      { note: "D4", time: 11000, duration: 800 },

      // "Like a diamond in the sky" - G G F F E E D
      { note: "G4", time: 12000, duration: 400 },
      { note: "G4", time: 12500, duration: 400 },
      { note: "F4", time: 13000, duration: 400 },
      { note: "F4", time: 13500, duration: 400 },
      { note: "E4", time: 14000, duration: 400 },
      { note: "E4", time: 14500, duration: 400 },
      { note: "D4", time: 15000, duration: 800 },

      // "Twinkle twinkle little star" - C C G G A A G
      { note: "C4", time: 16000, duration: 400 },
      { note: "C4", time: 16500, duration: 400 },
      { note: "G4", time: 17000, duration: 400 },
      { note: "G4", time: 17500, duration: 400 },
      { note: "A4", time: 18000, duration: 400 },
      { note: "A4", time: 18500, duration: 400 },
      { note: "G4", time: 19000, duration: 800 },

      // "How I wonder what you are" - F F E E D D C
      { note: "F4", time: 20000, duration: 400 },
      { note: "F4", time: 20500, duration: 400 },
      { note: "E4", time: 21000, duration: 400 },
      { note: "E4", time: 21500, duration: 400 },
      { note: "D4", time: 22000, duration: 400 },
      { note: "D4", time: 22500, duration: 400 },
      { note: "C4", time: 23000, duration: 1000 },
    ],
  },
  {
    id: "mary",
    title: "Mary Had a Little Lamb",
    artist: "Traditional",
    difficulty: "Easy",
    bpm: 100,
    notes: [
      // "Mary had a little lamb" - E D C D E E E
      { note: "E4", time: 0, duration: 400 },
      { note: "D4", time: 500, duration: 400 },
      { note: "C4", time: 1000, duration: 400 },
      { note: "D4", time: 1500, duration: 400 },
      { note: "E4", time: 2000, duration: 400 },
      { note: "E4", time: 2500, duration: 400 },
      { note: "E4", time: 3000, duration: 800 },

      // "Little lamb, little lamb" - D D D, E G G
      { note: "D4", time: 4000, duration: 400 },
      { note: "D4", time: 4500, duration: 400 },
      { note: "D4", time: 5000, duration: 800 },
      { note: "E4", time: 6000, duration: 400 },
      { note: "G4", time: 6500, duration: 400 },
      { note: "G4", time: 7000, duration: 800 },

      // "Mary had a little lamb" - E D C D E E E
      { note: "E4", time: 8000, duration: 400 },
      { note: "D4", time: 8500, duration: 400 },
      { note: "C4", time: 9000, duration: 400 },
      { note: "D4", time: 9500, duration: 400 },
      { note: "E4", time: 10000, duration: 400 },
      { note: "E4", time: 10500, duration: 400 },
      { note: "E4", time: 11000, duration: 400 },
      { note: "E4", time: 11500, duration: 400 },

      // "Its fleece was white as snow" - D D E D C
      { note: "D4", time: 12000, duration: 400 },
      { note: "D4", time: 12500, duration: 400 },
      { note: "E4", time: 13000, duration: 400 },
      { note: "D4", time: 13500, duration: 400 },
      { note: "C4", time: 14000, duration: 1000 },
    ],
  },
  {
    id: "jingle-bells",
    title: "Jingle Bells",
    artist: "Traditional",
    difficulty: "Easy",
    bpm: 120,
    notes: [
      // "Jingle bells, jingle bells" - E E E, E E E
      { note: "E4", time: 0, duration: 300 },
      { note: "E4", time: 400, duration: 300 },
      { note: "E4", time: 800, duration: 600 },
      { note: "E4", time: 1600, duration: 300 },
      { note: "E4", time: 2000, duration: 300 },
      { note: "E4", time: 2400, duration: 600 },

      // "Jingle all the way" - E G C D E
      { note: "E4", time: 3200, duration: 300 },
      { note: "G4", time: 3600, duration: 300 },
      { note: "C4", time: 4000, duration: 400 },
      { note: "D4", time: 4500, duration: 300 },
      { note: "E4", time: 4900, duration: 800 },

      // "Oh what fun it is to ride" - F F F F F E E E
      { note: "F4", time: 6000, duration: 300 },
      { note: "F4", time: 6400, duration: 300 },
      { note: "F4", time: 6800, duration: 300 },
      { note: "F4", time: 7200, duration: 300 },
      { note: "F4", time: 7600, duration: 300 },
      { note: "E4", time: 8000, duration: 300 },
      { note: "E4", time: 8400, duration: 300 },
      { note: "E4", time: 8800, duration: 300 },

      // "In a one horse open sleigh" - E D D E D G
      { note: "E4", time: 9400, duration: 300 },
      { note: "D4", time: 9800, duration: 300 },
      { note: "D4", time: 10200, duration: 300 },
      { note: "E4", time: 10600, duration: 300 },
      { note: "D4", time: 11000, duration: 500 },
      { note: "G4", time: 11600, duration: 800 },

      // Repeat chorus: "Jingle bells, jingle bells"
      { note: "E4", time: 12800, duration: 300 },
      { note: "E4", time: 13200, duration: 300 },
      { note: "E4", time: 13600, duration: 600 },
      { note: "E4", time: 14400, duration: 300 },
      { note: "E4", time: 14800, duration: 300 },
      { note: "E4", time: 15200, duration: 600 },

      // "Jingle all the way" - E G C D E
      { note: "E4", time: 16000, duration: 300 },
      { note: "G4", time: 16400, duration: 300 },
      { note: "C4", time: 16800, duration: 400 },
      { note: "D4", time: 17300, duration: 300 },
      { note: "E4", time: 17700, duration: 800 },

      // "Oh what fun..." - F F F F F E E E
      { note: "F4", time: 18800, duration: 300 },
      { note: "F4", time: 19200, duration: 300 },
      { note: "F4", time: 19600, duration: 300 },
      { note: "F4", time: 20000, duration: 300 },
      { note: "F4", time: 20400, duration: 300 },
      { note: "E4", time: 20800, duration: 300 },
      { note: "E4", time: 21200, duration: 300 },
      { note: "E4", time: 21600, duration: 300 },

      // "In a one horse open sleigh" ending - G G F D C
      { note: "G4", time: 22200, duration: 300 },
      { note: "G4", time: 22600, duration: 300 },
      { note: "F4", time: 23000, duration: 300 },
      { note: "D4", time: 23400, duration: 300 },
      { note: "C4", time: 23800, duration: 1000 },
    ],
  },

  // ==================== MEDIUM ====================
  {
    id: "ode-to-joy",
    title: "Ode to Joy",
    artist: "Beethoven",
    difficulty: "Medium",
    bpm: 100,
    notes: [
      // Main theme: E E F G | G F E D | C C D E | E D D
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
      { note: "D4", time: 7000, duration: 700 },

      // Repeat: E E F G | G F E D | C C D E | D C C
      { note: "E4", time: 8000, duration: 400 },
      { note: "E4", time: 8500, duration: 400 },
      { note: "F4", time: 9000, duration: 400 },
      { note: "G4", time: 9500, duration: 400 },
      { note: "G4", time: 10000, duration: 400 },
      { note: "F4", time: 10500, duration: 400 },
      { note: "E4", time: 11000, duration: 400 },
      { note: "D4", time: 11500, duration: 400 },
      { note: "C4", time: 12000, duration: 400 },
      { note: "C4", time: 12500, duration: 400 },
      { note: "D4", time: 13000, duration: 400 },
      { note: "E4", time: 13500, duration: 400 },
      { note: "D4", time: 14000, duration: 600 },
      { note: "C4", time: 14700, duration: 200 },
      { note: "C4", time: 15000, duration: 700 },

      // Bridge: D D E C | D E F E C | D E F E D | C D G
      { note: "D4", time: 16000, duration: 400 },
      { note: "D4", time: 16500, duration: 400 },
      { note: "E4", time: 17000, duration: 400 },
      { note: "C4", time: 17500, duration: 400 },
      { note: "D4", time: 18000, duration: 400 },
      { note: "E4", time: 18400, duration: 200 },
      { note: "F4", time: 18700, duration: 200 },
      { note: "E4", time: 19000, duration: 400 },
      { note: "C4", time: 19500, duration: 400 },
      { note: "D4", time: 20000, duration: 400 },
      { note: "E4", time: 20400, duration: 200 },
      { note: "F4", time: 20700, duration: 200 },
      { note: "E4", time: 21000, duration: 400 },
      { note: "D4", time: 21500, duration: 400 },
      { note: "C4", time: 22000, duration: 400 },
      { note: "D4", time: 22500, duration: 400 },
      { note: "G4", time: 23000, duration: 700 },

      // Final: E E F G | G F E D | C C D E | D C C
      { note: "E4", time: 24000, duration: 400 },
      { note: "E4", time: 24500, duration: 400 },
      { note: "F4", time: 25000, duration: 400 },
      { note: "G4", time: 25500, duration: 400 },
      { note: "G4", time: 26000, duration: 400 },
      { note: "F4", time: 26500, duration: 400 },
      { note: "E4", time: 27000, duration: 400 },
      { note: "D4", time: 27500, duration: 400 },
      { note: "C4", time: 28000, duration: 400 },
      { note: "C4", time: 28500, duration: 400 },
      { note: "D4", time: 29000, duration: 400 },
      { note: "E4", time: 29500, duration: 400 },
      { note: "D4", time: 30000, duration: 600 },
      { note: "C4", time: 30700, duration: 200 },
      { note: "C4", time: 31000, duration: 1000 },
    ],
  },
  {
    id: "canon-in-d",
    title: "Canon in D",
    artist: "Pachelbel",
    difficulty: "Medium",
    bpm: 70,
    notes: [
      // Famous chord progression melody (simplified for our range)
      // D - A - B - F# - G - D - G - A
      { note: "D5", time: 0, duration: 700 },
      { note: "C#5", time: 800, duration: 700 },
      { note: "B4", time: 1600, duration: 700 },
      { note: "A4", time: 2400, duration: 700 },
      { note: "G4", time: 3200, duration: 700 },
      { note: "F#4", time: 4000, duration: 700 },
      { note: "G4", time: 4800, duration: 700 },
      { note: "A4", time: 5600, duration: 700 },

      // Second pass with more movement
      { note: "D5", time: 6400, duration: 350 },
      { note: "F#4", time: 6850, duration: 350 },
      { note: "A4", time: 7300, duration: 350 },
      { note: "D5", time: 7750, duration: 350 },
      { note: "B4", time: 8200, duration: 350 },
      { note: "D5", time: 8650, duration: 350 },
      { note: "A4", time: 9100, duration: 350 },
      { note: "B4", time: 9550, duration: 350 },

      { note: "G4", time: 10000, duration: 350 },
      { note: "B4", time: 10450, duration: 350 },
      { note: "D5", time: 10900, duration: 350 },
      { note: "B4", time: 11350, duration: 350 },
      { note: "A4", time: 11800, duration: 350 },
      { note: "D4", time: 12250, duration: 350 },
      { note: "F#4", time: 12700, duration: 350 },
      { note: "A4", time: 13150, duration: 350 },

      // Climax section
      { note: "G4", time: 13600, duration: 350 },
      { note: "A4", time: 14050, duration: 350 },
      { note: "B4", time: 14500, duration: 350 },
      { note: "C5", time: 14950, duration: 350 },
      { note: "D5", time: 15400, duration: 350 },
      { note: "E5", time: 15850, duration: 350 },
      { note: "D5", time: 16300, duration: 350 },
      { note: "C5", time: 16750, duration: 350 },

      { note: "B4", time: 17200, duration: 350 },
      { note: "C5", time: 17650, duration: 350 },
      { note: "B4", time: 18100, duration: 350 },
      { note: "A4", time: 18550, duration: 350 },
      { note: "G4", time: 19000, duration: 350 },
      { note: "A4", time: 19450, duration: 350 },
      { note: "G4", time: 19900, duration: 350 },
      { note: "F#4", time: 20350, duration: 350 },

      // Resolution
      { note: "G4", time: 20800, duration: 500 },
      { note: "A4", time: 21400, duration: 500 },
      { note: "B4", time: 22000, duration: 500 },
      { note: "A4", time: 22600, duration: 500 },
      { note: "G4", time: 23200, duration: 500 },
      { note: "F#4", time: 23800, duration: 500 },
      { note: "D4", time: 24400, duration: 1200 },
    ],
  },
  {
    id: "river-flows",
    title: "River Flows in You",
    artist: "Yiruma",
    difficulty: "Medium",
    bpm: 70,
    notes: [
      // Iconic opening motif: A B C B A E
      { note: "A4", time: 0, duration: 350 },
      { note: "B4", time: 400, duration: 350 },
      { note: "C5", time: 800, duration: 350 },
      { note: "B4", time: 1200, duration: 350 },
      { note: "A4", time: 1600, duration: 350 },
      { note: "E4", time: 2000, duration: 600 },

      // Repeat with variation
      { note: "A4", time: 2800, duration: 350 },
      { note: "B4", time: 3200, duration: 350 },
      { note: "C5", time: 3600, duration: 350 },
      { note: "B4", time: 4000, duration: 350 },
      { note: "A4", time: 4400, duration: 350 },
      { note: "G#4", time: 4800, duration: 600 },

      // Development
      { note: "A4", time: 5600, duration: 350 },
      { note: "C5", time: 6000, duration: 350 },
      { note: "E5", time: 6400, duration: 350 },
      { note: "D5", time: 6800, duration: 350 },
      { note: "C5", time: 7200, duration: 350 },
      { note: "B4", time: 7600, duration: 600 },

      // Descending
      { note: "C5", time: 8400, duration: 350 },
      { note: "B4", time: 8800, duration: 350 },
      { note: "A4", time: 9200, duration: 350 },
      { note: "G#4", time: 9600, duration: 350 },
      { note: "A4", time: 10000, duration: 600 },

      // Return to theme
      { note: "A4", time: 10800, duration: 350 },
      { note: "B4", time: 11200, duration: 350 },
      { note: "C5", time: 11600, duration: 350 },
      { note: "B4", time: 12000, duration: 350 },
      { note: "A4", time: 12400, duration: 350 },
      { note: "E4", time: 12800, duration: 600 },

      // Build up
      { note: "E4", time: 13600, duration: 350 },
      { note: "F#4", time: 14000, duration: 350 },
      { note: "G#4", time: 14400, duration: 350 },
      { note: "A4", time: 14800, duration: 350 },
      { note: "B4", time: 15200, duration: 350 },
      { note: "C5", time: 15600, duration: 350 },
      { note: "D5", time: 16000, duration: 350 },
      { note: "E5", time: 16400, duration: 600 },

      // Climax
      { note: "E5", time: 17200, duration: 350 },
      { note: "D5", time: 17600, duration: 350 },
      { note: "C5", time: 18000, duration: 350 },
      { note: "B4", time: 18400, duration: 350 },
      { note: "C5", time: 18800, duration: 350 },
      { note: "D5", time: 19200, duration: 350 },
      { note: "E5", time: 19600, duration: 600 },

      // Resolution
      { note: "D5", time: 20400, duration: 350 },
      { note: "C5", time: 20800, duration: 350 },
      { note: "B4", time: 21200, duration: 350 },
      { note: "A4", time: 21600, duration: 350 },
      { note: "G#4", time: 22000, duration: 350 },
      { note: "A4", time: 22400, duration: 1200 },
    ],
  },

  // ==================== HARD ====================
  {
    id: "fur-elise",
    title: "Für Elise",
    artist: "Beethoven",
    difficulty: "Hard",
    bpm: 125,
    notes: [
      // THE iconic motif: E D# E D# E B D C A (x3)
      // First time
      { note: "E5", time: 0, duration: 200 },
      { note: "D#5", time: 250, duration: 200 },
      { note: "E5", time: 500, duration: 200 },
      { note: "D#5", time: 750, duration: 200 },
      { note: "E5", time: 1000, duration: 200 },
      { note: "B4", time: 1250, duration: 200 },
      { note: "D5", time: 1500, duration: 200 },
      { note: "C5", time: 1750, duration: 200 },
      { note: "A4", time: 2000, duration: 400 },

      // Response: C E A B
      { note: "C4", time: 2500, duration: 200 },
      { note: "E4", time: 2750, duration: 200 },
      { note: "A4", time: 3000, duration: 200 },
      { note: "B4", time: 3250, duration: 400 },

      // E G# B C
      { note: "E4", time: 3750, duration: 200 },
      { note: "G#4", time: 4000, duration: 200 },
      { note: "B4", time: 4250, duration: 200 },
      { note: "C5", time: 4500, duration: 400 },

      // Second time - motif
      { note: "E5", time: 5000, duration: 200 },
      { note: "D#5", time: 5250, duration: 200 },
      { note: "E5", time: 5500, duration: 200 },
      { note: "D#5", time: 5750, duration: 200 },
      { note: "E5", time: 6000, duration: 200 },
      { note: "B4", time: 6250, duration: 200 },
      { note: "D5", time: 6500, duration: 200 },
      { note: "C5", time: 6750, duration: 200 },
      { note: "A4", time: 7000, duration: 400 },

      // Response 2
      { note: "C4", time: 7500, duration: 200 },
      { note: "E4", time: 7750, duration: 200 },
      { note: "A4", time: 8000, duration: 200 },
      { note: "B4", time: 8250, duration: 400 },

      // E C B A
      { note: "E4", time: 8750, duration: 200 },
      { note: "C5", time: 9000, duration: 200 },
      { note: "B4", time: 9250, duration: 200 },
      { note: "A4", time: 9500, duration: 600 },

      // Third time - motif
      { note: "E5", time: 10200, duration: 200 },
      { note: "D#5", time: 10450, duration: 200 },
      { note: "E5", time: 10700, duration: 200 },
      { note: "D#5", time: 10950, duration: 200 },
      { note: "E5", time: 11200, duration: 200 },
      { note: "B4", time: 11450, duration: 200 },
      { note: "D5", time: 11700, duration: 200 },
      { note: "C5", time: 11950, duration: 200 },
      { note: "A4", time: 12200, duration: 400 },

      // B section - different melody
      { note: "B4", time: 12800, duration: 200 },
      { note: "C5", time: 13050, duration: 200 },
      { note: "D5", time: 13300, duration: 200 },
      { note: "E5", time: 13550, duration: 400 },
      { note: "G4", time: 14050, duration: 200 },
      { note: "E5", time: 14300, duration: 200 },
      { note: "D5", time: 14550, duration: 200 },
      { note: "C5", time: 14800, duration: 400 },

      { note: "F4", time: 15300, duration: 200 },
      { note: "D5", time: 15550, duration: 200 },
      { note: "C5", time: 15800, duration: 200 },
      { note: "B4", time: 16050, duration: 400 },

      // Return to A - final statement
      { note: "E5", time: 16600, duration: 200 },
      { note: "D#5", time: 16850, duration: 200 },
      { note: "E5", time: 17100, duration: 200 },
      { note: "D#5", time: 17350, duration: 200 },
      { note: "E5", time: 17600, duration: 200 },
      { note: "B4", time: 17850, duration: 200 },
      { note: "D5", time: 18100, duration: 200 },
      { note: "C5", time: 18350, duration: 200 },
      { note: "A4", time: 18600, duration: 400 },

      // Final resolution
      { note: "C4", time: 19100, duration: 200 },
      { note: "E4", time: 19350, duration: 200 },
      { note: "A4", time: 19600, duration: 200 },
      { note: "B4", time: 19850, duration: 400 },
      { note: "E4", time: 20350, duration: 200 },
      { note: "C5", time: 20600, duration: 200 },
      { note: "B4", time: 20850, duration: 200 },
      { note: "A4", time: 21100, duration: 1000 },
    ],
  },
  {
    id: "moonlight",
    title: "Moonlight Sonata",
    artist: "Beethoven",
    difficulty: "Hard",
    bpm: 60,
    notes: [
      // Famous triplet arpeggios (simplified for range)
      // C# minor arpeggio pattern: G# C# E
      { note: "G#4", time: 0, duration: 300 },
      { note: "C#5", time: 350, duration: 300 },
      { note: "E5", time: 700, duration: 300 },
      { note: "G#4", time: 1050, duration: 300 },
      { note: "C#5", time: 1400, duration: 300 },
      { note: "E5", time: 1750, duration: 300 },

      // Move to different chord
      { note: "A4", time: 2100, duration: 300 },
      { note: "C#5", time: 2450, duration: 300 },
      { note: "E5", time: 2800, duration: 300 },
      { note: "A4", time: 3150, duration: 300 },
      { note: "C#5", time: 3500, duration: 300 },
      { note: "E5", time: 3850, duration: 300 },

      // Continue pattern
      { note: "G#4", time: 4200, duration: 300 },
      { note: "B4", time: 4550, duration: 300 },
      { note: "E5", time: 4900, duration: 300 },
      { note: "G#4", time: 5250, duration: 300 },
      { note: "B4", time: 5600, duration: 300 },
      { note: "E5", time: 5950, duration: 300 },

      // Add melody note on top
      { note: "G#4", time: 6300, duration: 300 },
      { note: "C#5", time: 6650, duration: 300 },
      { note: "E5", time: 7000, duration: 500 },
      { note: "D#5", time: 7600, duration: 200 },
      { note: "E5", time: 7900, duration: 500 },

      // Second phrase
      { note: "F#4", time: 8500, duration: 300 },
      { note: "B4", time: 8850, duration: 300 },
      { note: "D#5", time: 9200, duration: 300 },
      { note: "F#4", time: 9550, duration: 300 },
      { note: "B4", time: 9900, duration: 300 },
      { note: "D#5", time: 10250, duration: 300 },

      { note: "G#4", time: 10600, duration: 300 },
      { note: "C#5", time: 10950, duration: 300 },
      { note: "E5", time: 11300, duration: 300 },
      { note: "G#4", time: 11650, duration: 300 },
      { note: "C#5", time: 12000, duration: 300 },
      { note: "E5", time: 12350, duration: 300 },

      // Climax phrase
      { note: "A4", time: 12700, duration: 300 },
      { note: "D5", time: 13050, duration: 300 },
      { note: "E5", time: 13400, duration: 500 },
      { note: "D5", time: 14000, duration: 200 },
      { note: "C#5", time: 14300, duration: 200 },
      { note: "B4", time: 14600, duration: 200 },
      { note: "A4", time: 14900, duration: 500 },

      // Resolution
      { note: "G#4", time: 15500, duration: 300 },
      { note: "C#5", time: 15850, duration: 300 },
      { note: "E5", time: 16200, duration: 300 },
      { note: "G#4", time: 16550, duration: 300 },
      { note: "C#5", time: 16900, duration: 300 },
      { note: "E5", time: 17250, duration: 300 },

      { note: "G#4", time: 17600, duration: 300 },
      { note: "C#5", time: 17950, duration: 300 },
      { note: "E5", time: 18300, duration: 300 },
      { note: "C#5", time: 18650, duration: 500 },
      { note: "G#4", time: 19250, duration: 800 },
    ],
  },
];

// Helper to get song by ID
export const getSongById = (id: string): Song | undefined => {
  return SONGS.find((song) => song.id === id);
};

// Check if song is the birthday easter egg
export const isBirthdaySong = (id: string): boolean => {
  return id === "happy-birthday";
};

// Get songs by difficulty
export const getSongsByDifficulty = (
  difficulty: Song["difficulty"],
): Song[] => {
  return SONGS.filter((song) => song.difficulty === difficulty);
};
