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
        brand: {
          50: "#E3F2FD",
          100: "#BBDEFB",
          200: "#90CAF9",
          300: "#64B5F6",
          400: "#42A5F5",
          500: "#2196F3", // Primary User Color
          600: "#1E88E5",
          700: "#1976D2",
          800: "#1565C0",
          900: "#0D47A1", // Secondary Deep Blue
          accent: "#00E5FF", // Third Vibrant Cyan
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
    },
  },
  plugins: [],
};
export default config;
