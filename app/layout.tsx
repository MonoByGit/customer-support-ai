import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhatsApp AI Booking Engine & Live Demo Platform",
  description: "Converteer websitebezoekers en WhatsApp leads direct in geautomatiseerde agenda-afspraken met Google Calendar & Gemini AI.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💬</text></svg>",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="antialiased bg-[#0c1317] text-white selection:bg-[#00A884] selection:text-white">
        {children}
      </body>
    </html>
  );
}
