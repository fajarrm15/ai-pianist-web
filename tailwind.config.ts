import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft warm palette
        cream: {
          50: "#FFFEF9",
          100: "#FFF9F0",
          200: "#FFF3E0",
          300: "#FFE8CC",
          400: "#FFD9B3",
        },
        rose: {
          50: "#FFF5F5",
          100: "#FFE8E8",
          200: "#FFCCD2",
          300: "#FFB3BD",
          400: "#FF99A8",
          500: "#E88A96",
          600: "#D4707E",
        },
        warm: {
          50: "#FAF8F5",
          100: "#F5F0E8",
          200: "#E8DFD3",
          300: "#D4C4B0",
          400: "#BFA68A",
          500: "#A68A6D",
          600: "#8A7058",
        },
        charcoal: {
          700: "#4A4545",
          800: "#3A3535",
          900: "#2A2525",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
