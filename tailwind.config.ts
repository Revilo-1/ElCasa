import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        plaster: "#FAF7F2", // kalket væg – baggrund
        ink: "#2B2620", // mørkt træ – tekst
        terracotta: {
          DEFAULT: "#B5502E", // gulv-fliserne i køkken/entré
          light: "#D97D57",
          dark: "#8C3B20",
        },
        pine: "#A87F4F", // dørtræ
        sage: "#6B7A5E", // hæk/have
        stone: {
          DEFAULT: "#D9D0C3", // travertin-fliser i badeværelset
          dark: "#B3A791",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      backgroundImage: {
        blueprint:
          "repeating-linear-gradient(0deg, transparent, transparent 23px, #00000008 23px, #00000008 24px)",
      },
    },
  },
  plugins: [],
};
export default config;
