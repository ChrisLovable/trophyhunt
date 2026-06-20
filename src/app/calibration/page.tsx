"use client";

import { useEffect, useMemo, useState } from "react";
import { SPECIES } from "@/lib/types/species";
import HorizontalImageMarker from "@/components/ballistics/HorizontalImageMarker";

const G = "#C8A96E", B = "#2A2D1E", M = "#5A6040", D = "#0D0F0A", P = "#131510", C = "#E8E2D4";

export default function CalibrationPage() {
  const [filter, setFilter] = useState("");

  // Pre-filter to a species when arriving via /calibration?species=kudu
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("species");
    if (s) setFilter(s);
  }, []);

  const speciesList = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const sorted = [...SPECIES].sort((a, b) => a.name_en.localeCompare(b.name_en));
    if (!q) return sorted;
    return sorted.filter(sp =>
      sp.name_en.toLowerCase().includes(q)
      || sp.name_af.toLowerCase().includes(q)
      || sp.id.includes(q),
    );
  }, [filter]);

  return (
    <div style={{ background: D, minHeight: "100vh", paddingBottom: 100 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px 10px", borderBottom: `1px solid ${B}`,
      }}>
        <a href="/ballistics" style={{ color: M, fontSize: "0.9rem", textDecoration: "none" }}>←</a>
        <h1 style={{
          fontFamily: "Rajdhani,sans-serif", color: G, fontSize: "1.2rem",
          fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0,
        }}>
          Line Calibration
        </h1>
        <span style={{
          marginLeft: "auto", fontSize: "0.6rem", color: M,
          background: P, border: `1px solid ${B}`, padding: "2px 8px", borderRadius: 4,
        }}>
          DEV TOOL
        </span>
      </div>

      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontSize: "0.8rem", color: M, lineHeight: 1.55, margin: "0 0 12px" }}>
          Set the <strong style={{ color: G }}>shoulder</strong> and <strong style={{ color: "#4A9EFF" }}>hoof</strong>{" "}
          lines per species. Drag lines on the image, then press <strong style={{ color: G }}>Save Lines</strong> to bake into the PNG.
        </p>

        <input
          type="search"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter species…"
          style={{
            width: "100%", padding: "10px 12px", marginBottom: 16, background: P,
            border: `1px solid ${B}`, color: C, borderRadius: 8, fontSize: "0.9rem",
            fontFamily: "Rajdhani,sans-serif", minHeight: 44, boxSizing: "border-box",
          }}
        />

        {speciesList.map(sp => (
          <HorizontalImageMarker
            key={sp.id}
            speciesId={sp.id}
            name={`${sp.name_en} · ${sp.name_af}`}
            imagePath={sp.image_path}
            shoulderY={sp.shoulder_y}
            groundY={sp.ground_y}
            shoulderHeightCm={sp.shoulder_height_cm}
          />
        ))}
      </div>
    </div>
  );
}
