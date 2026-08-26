import type { Config } from "tailwindcss";

const config: Config = {
  // Volgt automatisch de systeemvoorkeur (prefers-color-scheme).
  // Geen handmatige toggle, geen class-juggling, geen UI-rommel.
  darkMode: "media",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#E3F2FD",
          100: "#BBDEFB",
          200: "#90CAF9",
          300: "#64B5F6",
          400: "#42A5F5",
          500: "#2196F3", // Primair Azure
          600: "#1E88E5",
          700: "#1976D2",
          800: "#1565C0",
          900: "#0D47A1", // Deep Sapphire
          ink: "#0A192F", // Deepest navy
          accent: "#FF9100", // Sunset Amber
        },
        wa: {
          userBubble: "#DCF8C6",
          agentBubble: "#FFFFFF",
          bg: "#EFEAE2",
          ink: "#111B21",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        heading: ["var(--font-heading)", "Plus Jakarta Sans", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      spacing: {
        "4.5": "1.125rem",
        "13": "3.25rem",
      },
      borderRadius: {
        // v4-stijl namen die het project al gebruikt
        xs: "0.125rem",
      },
      boxShadow: {
        // v4-stijl namen die het project al gebruikt (waren no-ops op v3)
        "2xs": "0 1px 1px 0 rgba(15, 23, 42, 0.04)",
        xs: "0 1px 2px 0 rgba(15, 23, 42, 0.06)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-up": {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-up": "scale-up 0.24s cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-up": "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
