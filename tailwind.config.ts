import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        happy: {
          coral: {
            50: "#FFF5F2",
            100: "#FFE8E3",
            200: "#FFD2C7",
            300: "#FFAC99",
            400: "#FF7B60",
            500: "#E05A47", // Primary brand coral
            600: "#CC4432",
            700: "#AB3324",
            800: "#8D2B20",
            900: "#74281E",
          },
          gold: {
            50: "#FFFBEB",
            100: "#FEF3C7",
            200: "#FDE68A",
            300: "#FCD34D",
            400: "#FBBF24",
            500: "#F59E0B", // Accent gold
            600: "#D97706",
            700: "#B45309",
            800: "#92400E",
            900: "#78350F",
          },
          sand: {
            50: "#FCFBF9",
            100: "#FAF8F5", // Warm linen background
            200: "#F3EFEA",
            300: "#E7DFD5",
            400: "#D3C6B6",
            500: "#B7A38E",
            600: "#9B856F",
            700: "#7E6A56",
            800: "#655444",
            900: "#514336",
          },
          ink: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            400: "#94A3B8",
            500: "#64748B",
            600: "#475569",
            700: "#334155",
            800: "#1E293B",
            900: "#0F172A", // Deep midnight slate
            950: "#070B14",
          },
          whatsapp: {
            light: "#DCF8C6",
            DEFAULT: "#25D366",
            dark: "#128C7E",
            teal: "#075E54",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(15, 23, 42, 0.07), 0 4px 6px -2px rgba(15, 23, 42, 0.04)",
        card: "0 10px 30px -5px rgba(15, 23, 42, 0.06), 0 4px 6px -2px rgba(15, 23, 42, 0.03)",
        glow: "0 0 25px -5px rgba(224, 90, 71, 0.35)",
        goldGlow: "0 0 25px -5px rgba(245, 158, 11, 0.35)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out forwards",
        pulseSubtle: "pulseSubtle 2s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
