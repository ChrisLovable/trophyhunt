"use client";

import { useState } from "react";
import type { Species } from "@/lib/types/species";
import type { SpeciesInfo } from "@/lib/types/species-info";
import MeatCalculator from "@/components/ballistics/MeatCalculator";

const G = "#C8A96E", P = "#131510", B = "#2A2D1E", M = "#5A6040", C = "#E8E2D4", D = "#0D0F0A";

type Lang = "en" | "af";
type Tab = "hunt" | "trophy" | "meat";

const L: Record<Lang, Record<string, string>> = {
  en: {
    tabHunt: "🎯 Hunt",    tabTrophy: "🏆 Trophy",  tabMeat: "🥩 Meat",
    shot: "Shot placement", bestTime: "Best time",   method: "Method",
    rut: "Rut season",     habitat: "Habitat",       calibers: "Calibers",
    minimum: "Minimum",    danger: "Danger level",   difficulty: "Difficulty",
    rwMin: "RW minimum",   sciMin: "SCI minimum",    good: "Good trophy",
    exceptional: "Exceptional", worldRecord: "World record",
    live: "Live weight",   carcass: "Carcass",       biltong: "Biltong yield",
    avg: "avg",            nicknames: "Also known as",
    weight: "Weights",
    trophyAnimal: "Trophy animal", hideInfo: "Hide info", showInfo: "Species info",
  },
  af: {
    tabHunt: "🎯 Jag",    tabTrophy: "🏆 Trofee",   tabMeat: "🥩 Vleis",
    shot: "Skoot plek",   bestTime: "Beste tyd",     method: "Metode",
    rut: "Paartyd",       habitat: "Habitat",         calibers: "Kalibers",
    minimum: "Minimum",   danger: "Gevaar vlak",      difficulty: "Moeilikheid",
    rwMin: "RW minimum",  sciMin: "SCI minimum",      good: "Goede trofee",
    exceptional: "Uitsonderlik", worldRecord: "Wêreldrekord",
    live: "Lewendige gewig", carcass: "Karkas",       biltong: "Biltong opbrengs",
    avg: "gem",           nicknames: "Ook bekend as",
    weight: "Gewigs",
    trophyAnimal: "Trofeedier", hideInfo: "Versteek", showInfo: "Spesie info",
  },
};

const DANGER_LABEL: Record<Lang, Record<SpeciesInfo["danger_level"], string>> = {
  en: { safe: "Safe", low: "Low risk", moderate: "Moderate", high: "High risk", dangerous: "Dangerous" },
  af: { safe: "Veilig", low: "Lae risiko", moderate: "Matig", high: "Hoë risiko", dangerous: "Gevaarlik" },
};
const DIFF_LABEL: Record<Lang, Record<SpeciesInfo["difficulty"], string>> = {
  en: { easy: "Easy hunt", moderate: "Moderate", hard: "Hard hunt", "very hard": "Very hard" },
  af: { easy: "Maklike jag", moderate: "Matig", hard: "Moeilike jag", "very hard": "Baie moeilik" },
};
const DANGER_COLOR: Record<SpeciesInfo["danger_level"], string> = {
  safe: "#50C878", low: M, moderate: "#FF8844", high: "#FF6633", dangerous: "#FF4444",
};

interface Props {
  species: Species;
  info: SpeciesInfo;
  lang: Lang;
  open: boolean;
  onToggle: () => void;
  selectedCaliber?: string;
  embedded?: boolean;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 8, lineHeight: 1.45 }}>
      <span style={{ fontSize: "0.65rem", color: M, display: "block", marginBottom: 1 }}>{label}</span>
      <span style={{ fontSize: "0.82rem", color: C }}>{value}</span>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 12, fontSize: "0.68rem", fontWeight: 600,
      fontFamily: "Rajdhani,sans-serif", letterSpacing: "0.04em",
      background: color + "22", border: `1px solid ${color}55`, color,
    }}>
      {label}
    </span>
  );
}

export default function SpeciesInfoCard({
  species, info, lang, open, onToggle, selectedCaliber, embedded,
}: Props) {
  const t = L[lang];
  const [activeTab, setActiveTab] = useState<Tab>("hunt");
  const isDangerous = info.danger_level === "dangerous" || info.danger_level === "high";
  const caliberWarn = selectedCaliber
    && !info.best_calibers.some(c => c === selectedCaliber)
    && selectedCaliber !== info.min_caliber;
  const wrapPad = embedded ? "0 0 8px" : "0 16px 8px";

  if (!open) {
    return (
      <div style={{ padding: wrapPad }}>
        <button
          type="button"
          onClick={onToggle}
          style={{
            width: "100%", padding: "10px 14px", minHeight: 44, borderRadius: 8,
            border: `1px solid ${B}`, background: P, color: M,
            fontFamily: "Rajdhani,sans-serif", fontSize: "0.8rem", fontWeight: 600,
            cursor: "pointer", textAlign: "left",
          }}
        >
          ▶ {t.showInfo} — {lang === "en" ? species.name_en : species.name_af}
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: embedded ? "0 0 12px" : "0 16px 12px" }}>
      <div style={{
        background: P, border: `1px solid ${B}`, borderRadius: 12, overflow: "hidden",
        borderLeft: `4px solid ${isDangerous ? "#FF4444" : G}`,
      }}>

        {/* Header */}
        <button
          type="button"
          onClick={onToggle}
          style={{
            width: "100%", padding: "14px 14px 10px", background: "none", border: "none",
            borderBottom: `1px solid ${B}`, cursor: "pointer", textAlign: "left",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div>
              <div style={{
                fontFamily: "Rajdhani,sans-serif", fontSize: "1.1rem", fontWeight: 700,
                color: G, lineHeight: 1.2,
              }}>
                {species.name_en} · {info.af_name}
              </div>
              <div style={{ fontSize: "0.7rem", color: M, marginTop: 3 }}>
                {info.nicknames.slice(0, 2).join(" · ")}
              </div>
            </div>
            <span style={{ color: M, fontSize: "0.75rem", flexShrink: 0 }}>▼</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            <Badge label={t.trophyAnimal} color={G} />
            <Badge label={DANGER_LABEL[lang][info.danger_level]} color={DANGER_COLOR[info.danger_level]} />
            <Badge label={DIFF_LABEL[lang][info.difficulty]} color={M} />
          </div>
        </button>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 6, padding: "10px 14px 0", borderBottom: `1px solid ${B}` }}>
          {(["hunt", "trophy", "meat"] as Tab[]).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: "8px 6px", minHeight: 40, borderRadius: 6, border: "none",
                background: activeTab === tab ? G : D,
                color: activeTab === tab ? D : M,
                fontFamily: "Rajdhani,sans-serif", fontSize: "0.72rem", fontWeight: 700,
                letterSpacing: "0.04em", cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {tab === "hunt" ? t.tabHunt : tab === "trophy" ? t.tabTrophy : t.tabMeat}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: "14px 14px 4px" }}>

          {/* ── HUNT TAB ── */}
          {activeTab === "hunt" && (
            <>
              {/* Shot placement */}
              <div style={{
                padding: "10px 12px", background: D, borderRadius: 8,
                border: `1px solid ${isDangerous ? "#FF444440" : G + "30"}`,
                marginBottom: 14,
              }}>
                <div style={{
                  fontSize: "0.62rem", color: G, fontFamily: "Rajdhani,sans-serif",
                  fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5,
                }}>
                  🎯 {t.shot}
                </div>
                <div style={{ fontSize: "0.82rem", color: C, lineHeight: 1.55 }}>
                  {info.shot_placement}
                </div>
              </div>

              {/* Calibers */}
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: "0.62rem", color: M, letterSpacing: "0.07em",
                  textTransform: "uppercase", marginBottom: 6,
                }}>
                  {t.calibers}
                </div>
                <div style={{ fontSize: "0.85rem", color: C, lineHeight: 1.55, marginBottom: 6 }}>
                  {info.best_calibers.join(" · ")}
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
                  fontSize: "0.8rem",
                  color: isDangerous || caliberWarn ? "#FF8844" : M,
                }}>
                  {(isDangerous || caliberWarn) && <span>⚠</span>}
                  <span>
                    {t.minimum}: <strong style={{ color: isDangerous ? "#FF4444" : G }}>
                      {info.min_caliber}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Hunting info rows */}
              <div style={{ borderTop: `1px solid ${B}`, paddingTop: 10 }}>
                <Row label={t.bestTime} value={info.best_time} />
                <Row label={t.method}   value={info.hunting_method} />
                <Row label={t.rut}      value={info.rut_season} />
                <Row label={t.habitat}  value={info.habitat} />
              </div>

              {/* Fun fact */}
              <div style={{
                marginTop: 8, padding: "10px 12px", background: D, borderRadius: 8,
                border: `1px solid ${G}30`, fontSize: "0.8rem", color: C, lineHeight: 1.5,
              }}>
                <span style={{ marginRight: 6 }}>💡</span>
                {info.fun_fact}
              </div>
            </>
          )}

          {/* ── TROPHY TAB ── */}
          {activeTab === "trophy" && (
            <>
              {/* Weight context */}
              <div style={{
                padding: "10px 12px", background: D, borderRadius: 8,
                border: `1px solid ${B}`, marginBottom: 14,
              }}>
                <div style={{
                  fontSize: "0.62rem", color: M, letterSpacing: "0.07em",
                  textTransform: "uppercase", marginBottom: 6,
                }}>
                  {t.weight}
                </div>
                <Row
                  label={t.live}
                  value={`${info.live_weight_kg.min}–${info.live_weight_kg.max}kg (${t.avg} ${info.live_weight_kg.avg}kg)`}
                />
                <Row
                  label={t.carcass}
                  value={`${info.carcass_weight_kg.min}–${info.carcass_weight_kg.max}kg (${info.carcass_yield_pct}%)`}
                />
                <Row
                  label={t.biltong}
                  value={`${info.biltong_yield_kg.min}–${info.biltong_yield_kg.max}kg`}
                />
              </div>

              {/* Trophy scores */}
              <Row label={t.rwMin}       value={info.trophy_rw_minimum} />
              <Row label={t.sciMin}      value={info.trophy_sci_minimum} />
              <Row label={t.good}        value={info.trophy_good} />
              <Row label={t.exceptional} value={info.trophy_exceptional} />
              <Row label={t.worldRecord} value={info.world_record} />

              {/* Nicknames */}
              {info.nicknames.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <Row label={t.nicknames} value={info.nicknames.join(", ")} />
                </div>
              )}
            </>
          )}

          {/* ── MEAT TAB ── */}
          {activeTab === "meat" && (
            <MeatCalculator speciesId={species.id} lang={lang} />
          )}
        </div>
      </div>
    </div>
  );
}
