import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        figma: {
          teal: "#0ACF83",
          blue: "#18A0FB",
          purple: "#A259FF",
          coral: "#F24E1E",
          yellow: "#FFC700",
          black: "#1E1E1E",
          darkBg: "#18181B",
          darkPanel: "#27272A",
          darkBorder: "rgba(255, 255, 255, 0.12)",
          lightBg: "#F8F9FA",
          lightPanel: "#FFFFFF",
          lightBorder: "#E4E4E7",
        },
        verde: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          accent: "#0ACF83",
        },
        wa: {
          teal: "#075E54",
          tealDark: "#054c44",
          tealLight: "#128C7E",
          green: "#25D366",
          greenDark: "#1EBE5D",
          userBubble: "#DCF8C6",
          agentBubble: "#FFFFFF",
          bg: "#EFEAE2",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        heading: ["var(--font-heading)", "Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
