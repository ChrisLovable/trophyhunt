import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import AdBanner from "@/components/layout/AdBanner";
import TopBar from "@/components/layout/TopBar";

export const metadata: Metadata = {
  title: "TrophyHunt",
  description: "SA Hunting App — Ballistics, Hunt Log, Horn Measurement, Community",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0D0F0A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <TopBar />
        <main className="th-main">{children}</main>
        <div className="th-bottom-chrome">
          <AdBanner />
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
