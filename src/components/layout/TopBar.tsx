"use client";
import Image from "next/image";
import { Settings } from "lucide-react";

export default function TopBar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: 56,
        background: "#0D0F0A",
        borderBottom: "1px solid #2A2D1E",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        overflow: "hidden",
      }}
    >
      {/* Left: logo + title */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <Image
          src="/animals/logo.png"
          alt="Safari Outdoor"
          width={100}
          height={40}
          priority
          style={{ height: 40, width: "auto", objectFit: "contain", flexShrink: 0 }}
        />
        <div style={{ minWidth: 0, lineHeight: 1.2 }}>
          <div style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8A96E", whiteSpace: "nowrap" }}>
            TrophyHunt
          </div>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#5A6040", whiteSpace: "nowrap" }}>
            by Safari Outdoor
          </div>
        </div>
      </div>

      {/* Right: settings icon */}
      <Settings size={18} style={{ color: "#5A6040", flexShrink: 0 }} />
    </header>
  );
}
