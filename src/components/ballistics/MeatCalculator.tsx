"use client";

import { useState } from "react";
import { getSpeciesInfoById } from "@/lib/types/species-info";

const G = "#C8A96E", P = "#131510", B = "#2A2D1E", M = "#5A6040", C = "#E8E2D4", D = "#0D0F0A";
const RED = "#FF4444", GREEN = "#50C878";

type Lang = "en" | "af";

const L: Record<Lang, Record<string, string>> = {
  en: {
    title: "MEAT YIELD",
    sub: "Calculate your meat yield",
    weightLabel: "Live weight",
    reset: "Reset",
    carcass: "Carcass",
    bone: "Bone",
    fatLabel: "Fat & offal",
    wetMeat: "WET MEAT",
    shoulderLoss: "Shoulder shot loss",
    netMeat: "NET MEAT",
    whatYouGet: "What you get",
    biltongSub: "±3kg meat = 1kg biltong",
    boerewors: "Boerewors",
    boereworsSub: "70% of wet meat",
    droewors: "Droëwors",
    droeworsSub: "85% of biltong weight",
    shoulderToggle: "Shoulder shot",
    source: "Based on Stellenbosch University game meat research (Hoffman et al.)",
    avg: "Avg", minLabel: "Min", maxLabel: "Max",
  },
  af: {
    title: "VLEISOPBRENGS",
    sub: "Bereken jou vleis opbrengs",
    weightLabel: "Lewendige gewig",
    reset: "Terugstel",
    carcass: "Slaghuis gewig",
    bone: "Been",
    fatLabel: "Vet & afval",
    wetMeat: "NAT VLEIS",
    shoulderLoss: "Skouer skoot verlies",
    netMeat: "NETTO VLEIS",
    whatYouGet: "Wat kry jy",
    biltongSub: "±3kg vleis = 1kg biltong",
    boerewors: "Boerewors",
    boereworsSub: "70% van nat vleis",
    droewors: "Droëwors",
    droeworsSub: "85% van biltong gewig",
    shoulderToggle: "Skouer skoot",
    source: "Gebaseer op Stellenbosch Universiteit navorsing (Hoffman et al.)",
    avg: "Gem", minLabel: "Min", maxLabel: "Maks",
  },
};

interface Props {
  speciesId: string;
  lang: Lang;
}

export default function MeatCalculator({ speciesId, lang }: Props) {
  const info = getSpeciesInfoById(speciesId);
  const t = L[lang];

  const defaultWeight = info?.live_weight_kg.avg ?? 100;
  const [liveWeight, setLiveWeight] = useState(defaultWeight);
  const [shoulderShot, setShoulderShot] = useState(false);

  if (!info) return null;

  const minW = info.live_weight_kg.min;
  const maxW = Math.round(info.live_weight_kg.max * 1.3);
  const step = 5;

  function adj(delta: number) {
    setLiveWeight(w => Math.max(minW, Math.min(maxW, w + delta)));
  }

  // ── Calculations ────────────────────────────────────────────────────────────
  const carcass_kg        = liveWeight * (info.carcass_yield_pct / 100);
  const bone_kg           = carcass_kg * (info.bone_pct / 100);
  const fat_kg            = carcass_kg * (info.fat_pct / 100);
  const wet_meat_kg       = carcass_kg * (info.meat_pct / 100);
  const shoulder_loss_kg  = shoulderShot ? Math.min(3.5, wet_meat_kg * 0.04) : 0;
  const net_meat_kg       = wet_meat_kg - shoulder_loss_kg;
  const biltong_kg        = net_meat_kg * info.biltong_conversion;
  const boerewors_kg      = net_meat_kg * 0.70;
  const droewors_kg       = biltong_kg * 0.85;

  // ── Shared styles ────────────────────────────────────────────────────────────
  const rowSt: React.CSSProperties = {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "8px 0", borderBottom: `1px solid ${B}`,
  };
  const labelSt: React.CSSProperties = { fontSize: "0.78rem", color: M };
  const valSt: React.CSSProperties = {
    fontFamily: "Rajdhani,sans-serif", fontSize: "0.95rem", fontWeight: 700, color: C,
  };
  const transitionSt: React.CSSProperties = { transition: "all 0.2s ease" };

  return (
    <div style={{ padding: "4px 0 12px" }}>

      {/* ── Header ── */}
      <div style={{
        borderLeft: `4px solid ${G}`, paddingLeft: 10, marginBottom: 16,
      }}>
        <div style={{
          fontFamily: "Rajdhani,sans-serif", fontSize: "0.85rem", fontWeight: 700,
          color: G, letterSpacing: "0.1em", lineHeight: 1.2,
        }}>
          {t.title}
        </div>
        <div style={{ fontSize: "0.68rem", color: M, marginTop: 2 }}>{t.sub}</div>
      </div>

      {/* ── Live weight stepper ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: "0.68rem", color: M, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
          {t.weightLabel}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* − button */}
          <button
            onClick={() => adj(-step)}
            disabled={liveWeight <= minW}
            style={{
              width: 44, height: 44, borderRadius: 8, flexShrink: 0,
              border: `1px solid ${liveWeight <= minW ? B : G}`,
              background: D, color: liveWeight <= minW ? M : G,
              fontFamily: "Rajdhani,sans-serif", fontSize: "1.4rem", fontWeight: 700,
              cursor: liveWeight <= minW ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            −
          </button>

          {/* Weight display */}
          <div style={{
            flex: 1, textAlign: "center", background: P, borderRadius: 8,
            border: `1px solid ${B}`, padding: "8px 0",
            ...transitionSt,
          }}>
            <span style={{
              fontFamily: "Rajdhani,sans-serif", fontSize: "2rem", fontWeight: 700,
              color: G, lineHeight: 1, ...transitionSt,
            }}>
              {liveWeight}
            </span>
            <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "1rem", color: M, marginLeft: 4 }}>kg</span>
          </div>

          {/* + button */}
          <button
            onClick={() => adj(+step)}
            disabled={liveWeight >= maxW}
            style={{
              width: 44, height: 44, borderRadius: 8, flexShrink: 0,
              border: `1px solid ${liveWeight >= maxW ? B : G}`,
              background: D, color: liveWeight >= maxW ? M : G,
              fontFamily: "Rajdhani,sans-serif", fontSize: "1.4rem", fontWeight: 700,
              cursor: liveWeight >= maxW ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            +
          </button>
        </div>

        {/* Range hint + reset */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <span style={{ fontSize: "0.65rem", color: M }}>
            {t.avg}: {info.live_weight_kg.avg}kg · {t.minLabel}: {minW}kg · {t.maxLabel}: {info.live_weight_kg.max}kg
          </span>
          {liveWeight !== defaultWeight && (
            <button
              onClick={() => setLiveWeight(defaultWeight)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "0.65rem", color: G, padding: "2px 0",
                fontFamily: "Rajdhani,sans-serif", fontWeight: 600,
              }}
            >
              {t.reset}
            </button>
          )}
        </div>
      </div>

      {/* ── Breakdown table ── */}
      <div style={{ marginBottom: 16 }}>
        {/* Carcass */}
        <div style={rowSt}>
          <div>
            <div style={labelSt}>{t.carcass}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ ...valSt, ...transitionSt }}>{carcass_kg.toFixed(1)} kg</span>
            <span style={{ fontSize: "0.65rem", color: M, marginLeft: 6 }}>({info.carcass_yield_pct}%)</span>
          </div>
        </div>

        {/* Bone */}
        <div style={rowSt}>
          <div style={labelSt}>{t.bone}</div>
          <div style={{ textAlign: "right" }}>
            <span style={{ ...valSt, color: M, ...transitionSt }}>−{bone_kg.toFixed(1)} kg</span>
            <span style={{ fontSize: "0.65rem", color: M, marginLeft: 6 }}>({info.bone_pct}%)</span>
          </div>
        </div>

        {/* Fat */}
        <div style={{ ...rowSt, borderBottom: `1px solid ${G}44` }}>
          <div style={labelSt}>{t.fatLabel}</div>
          <div style={{ textAlign: "right" }}>
            <span style={{ ...valSt, color: M, ...transitionSt }}>−{fat_kg.toFixed(1)} kg</span>
            <span style={{ fontSize: "0.65rem", color: M, marginLeft: 6 }}>({info.fat_pct}%)</span>
          </div>
        </div>

        {/* Wet meat hero */}
        <div style={{ ...rowSt, padding: "12px 0", borderBottom: shoulderShot ? `1px solid ${B}` : "none" }}>
          <div style={{
            fontFamily: "Rajdhani,sans-serif", fontSize: "0.75rem", fontWeight: 700,
            color: G, letterSpacing: "0.08em",
          }}>
            {t.wetMeat}
          </div>
          <div style={{
            fontFamily: "Rajdhani,sans-serif", fontSize: "1.6rem", fontWeight: 700,
            color: G, ...transitionSt,
          }}>
            {wet_meat_kg.toFixed(1)} <span style={{ fontSize: "1rem" }}>kg</span>
          </div>
        </div>

        {/* Shoulder shot loss (visible only when toggled) */}
        {shoulderShot && (
          <>
            <div style={{ ...rowSt, borderBottom: `1px solid ${RED}44` }}>
              <div style={{ fontSize: "0.75rem", color: RED }}>{t.shoulderLoss}</div>
              <span style={{ ...valSt, color: RED, ...transitionSt }}>
                −{shoulder_loss_kg.toFixed(1)} kg
              </span>
            </div>
            <div style={{ ...rowSt, padding: "10px 0", borderBottom: "none" }}>
              <div style={{
                fontFamily: "Rajdhani,sans-serif", fontSize: "0.75rem", fontWeight: 700,
                color: G, letterSpacing: "0.08em",
              }}>
                {t.netMeat}
              </div>
              <div style={{
                fontFamily: "Rajdhani,sans-serif", fontSize: "1.4rem", fontWeight: 700,
                color: G, ...transitionSt,
              }}>
                {net_meat_kg.toFixed(1)} <span style={{ fontSize: "0.95rem" }}>kg</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Products header ── */}
      <div style={{
        fontSize: "0.68rem", color: M, letterSpacing: "0.08em",
        textTransform: "uppercase", marginBottom: 10,
        fontFamily: "Rajdhani,sans-serif", fontWeight: 700,
      }}>
        {t.whatYouGet}
      </div>

      {/* ── Product cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {/* Biltong */}
        <div style={{
          background: P, border: `1px solid ${G}55`, borderRadius: 10,
          padding: "12px 8px", textAlign: "center",
        }}>
          <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>🥩</div>
          <div style={{
            fontFamily: "Rajdhani,sans-serif", fontSize: "1.35rem", fontWeight: 700,
            color: G, lineHeight: 1, ...transitionSt,
          }}>
            ~{Math.round(biltong_kg)}
            <span style={{ fontSize: "0.8rem", fontWeight: 400, color: M }}> kg</span>
          </div>
          <div style={{ fontSize: "0.7rem", color: C, fontWeight: 600, marginTop: 3 }}>Biltong</div>
          <div style={{ fontSize: "0.58rem", color: M, marginTop: 2, lineHeight: 1.3 }}>{t.biltongSub}</div>
        </div>

        {/* Boerewors */}
        <div style={{
          background: P, border: `1px solid ${B}`, borderRadius: 10,
          padding: "12px 8px", textAlign: "center",
        }}>
          <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>🌭</div>
          <div style={{
            fontFamily: "Rajdhani,sans-serif", fontSize: "1.35rem", fontWeight: 700,
            color: C, lineHeight: 1, ...transitionSt,
          }}>
            ~{Math.round(boerewors_kg)}
            <span style={{ fontSize: "0.8rem", fontWeight: 400, color: M }}> kg</span>
          </div>
          <div style={{ fontSize: "0.7rem", color: C, fontWeight: 600, marginTop: 3 }}>{t.boerewors}</div>
          <div style={{ fontSize: "0.58rem", color: M, marginTop: 2, lineHeight: 1.3 }}>{t.boereworsSub}</div>
        </div>

        {/* Droëwors */}
        <div style={{
          background: P, border: `1px solid ${B}`, borderRadius: 10,
          padding: "12px 8px", textAlign: "center",
        }}>
          <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>🥖</div>
          <div style={{
            fontFamily: "Rajdhani,sans-serif", fontSize: "1.35rem", fontWeight: 700,
            color: C, lineHeight: 1, ...transitionSt,
          }}>
            ~{Math.round(droewors_kg)}
            <span style={{ fontSize: "0.8rem", fontWeight: 400, color: M }}> kg</span>
          </div>
          <div style={{ fontSize: "0.7rem", color: C, fontWeight: 600, marginTop: 3 }}>{t.droewors}</div>
          <div style={{ fontSize: "0.58rem", color: M, marginTop: 2, lineHeight: 1.3 }}>{t.droeworsSub}</div>
        </div>
      </div>

      {/* ── Shoulder shot toggle ── */}
      <label style={{
        display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
        padding: "10px 12px", background: P, borderRadius: 8,
        border: `1px solid ${shoulderShot ? RED + "55" : B}`,
        marginBottom: 12, minHeight: 44,
        transition: "border-color 0.2s ease",
      }}>
        <input
          type="checkbox"
          checked={shoulderShot}
          onChange={e => setShoulderShot(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: RED, cursor: "pointer", flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: "0.82rem", color: C }}>{t.shoulderToggle}</span>
          {shoulderShot && (
            <span style={{
              fontSize: "0.75rem", color: RED, marginLeft: 8,
              fontFamily: "Rajdhani,sans-serif", fontWeight: 600,
              transition: "all 0.2s ease",
            }}>
              −{shoulder_loss_kg.toFixed(1)}kg vleis
            </span>
          )}
        </div>
      </label>

      {/* ── Source note ── */}
      <div style={{ fontSize: "0.6rem", color: M, lineHeight: 1.5, opacity: 0.7 }}>
        🎓 {t.source}
      </div>
    </div>
  );
}
