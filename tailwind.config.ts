import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030303",
        surface: "#0a0a0a",
        "surface-elevated": "#111111",
        accent: {
          DEFAULT: "#ff5a4d",
          hover: "#ff7a6e",
          muted: "#5c221d",
        },
        "accent-cyan": "#ff5a4d",
        foreground: "#f2f2f0",
        muted: "#7a7a76",
        border: "#232320",
      },
      fontFamily: {
        sans: ["var(--font-mono)", "ui-monospace", "monospace"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "var(--font-mono)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(255, 90, 77, 0.25)",
        "glow-cyan": "0 0 30px rgba(255, 90, 77, 0.25)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
