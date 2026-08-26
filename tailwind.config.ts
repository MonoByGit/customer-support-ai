import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wa: {
          teal: "#075E54",
          tealDark: "#054c44",
          tealLight: "#128C7E",
          green: "#25D366",
          greenDark: "#1EBE5D",
          userBubble: "#DCF8C6",
          userBubbleDark: "#E1FFC7",
          agentBubble: "#FFFFFF",
          bg: "#EFEAE2",
          bgDark: "#ECE5DD",
          chatBar: "#F0F2F5",
          header: "#075E54",
          textPrimary: "#111B21",
          textSecondary: "#667781",
          border: "#E9EDEF",
          blueCheck: "#53BDEB",
          grayCheck: "#8696A0",
        },
      },
      backgroundImage: {
        "whatsapp-pattern": "url('/whatsapp-pattern.png')",
      },
    },
  },
  plugins: [],
};
export default config;
