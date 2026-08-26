import type { Metadata, Viewport } from "next";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://verde-whatsapp-ai-production.up.railway.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Verde AI — WhatsApp Boekingsengine voor praktijken en salons",
    template: "%s • Verde AI",
  },
  description:
    "Verde AI zet websitebezoekers 24/7 autonoom om in bevestigde afspraken in uw Google Agenda, via WhatsApp. Aangedreven door DeepSeek Flash V4.",
  applicationName: "Verde AI",
  keywords: [
    "WhatsApp AI",
    "afspraken automatiseren",
    "Google Agenda koppeling",
    "AI receptionist",
    "boekingsengine",
  ],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Verde AI",
    title: "Verde AI — WhatsApp Boekingsengine",
    description:
      "Zet websitebezoekers 24/7 om in bevestigde agenda-afspraken via WhatsApp. Binnen 2 minuten live.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#07090E" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="antialiased selection:bg-[#2196F3] selection:text-white">
        {children}
      </body>
    </html>
  );
}
