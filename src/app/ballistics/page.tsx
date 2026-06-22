"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from "react";
import { animalImageCandidates } from "@/lib/animals/animal-image";
import { detectVitalDot } from "@/lib/animals/detect-vital-dot";
import { useLang } from "@/lib/app/use-lang";
import { D, G, M, B } from "@/lib/app/brand";
import { MAX_HOLDOVER_M, type CalData } from "@/lib/ballistics/calibration";
import { BALLISTICS_T } from "@/lib/ballistics/i18n";
import { drawCanvas } from "@/lib/ballistics/draw-canvas";
import { calculateWindage } from "@/lib/ballistics/engine";
import { ladderRowAt, LADDER_STEP_M } from "@/lib/ballistics/holdover-math";
import type { BallisticsResult } from "@/lib/types/ballistics";
import { deleteRifle } from "@/lib/rifle/storage";
import { useAimSession } from "@/hooks/use-aim-session";
import { BallisticsPickers } from "@/components/ballistics/BallisticsPickers";
import { SpeciesDetailsPanel } from "@/components/ballistics/SpeciesDetailsPanel";
import { Card, DistSlider, PageHeader, SliderStyles } from "@/components/ballistics/ui";

function calWithVitalDot(calData: CalData, vital: { x: number; y: number } | null): CalData {
  if (!vital) return calData;
  if (
    Math.abs(vital.x - calData.vital_x) < 0.0005 &&
    Math.abs(vital.y - calData.vital_y) < 0.0005
  ) return calData;
  return { ...calData, vital_x: vital.x, vital_y: vital.y };
}

export default function BallisticsPage() {
  const { lang, toggleLang } = useLang();
  const t = BALLISTICS_T[lang];

  const {
    savedRifles, aimRifleId, aimRifle, speciesId, species, calData,
    aimBc, aimMv, aimZero, isAimReady, highlightDist, minDist, ladder,
    selectAimRifle, setSpeciesId, setHighlightDist,
  } = useAimSession();

  const [sliderPulse, setSliderPulse]   = useState(false);
  const [aimDragging, setAimDragging]   = useState(false);
  const [fallbackIdx, setFallbackIdx]   = useState(0);
  const [windSpeed,   setWindSpeed]     = useState(0);
  const [windDir,     setWindDir]       = useState(90);
  const [dialActive,  setDialActive]    = useState(false);

  const imgRef        = useRef<HTMLImageElement>(null);
  const vitalDotRef   = useRef<{ x: number; y: number } | null>(null);
  const calRef        = useRef<CalData>(calData);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const windage_cmRef = useRef(0);

  // calRef is updated only in runDetection() and species change effect — never on render
  const imageCandidates = useMemo(
    () => animalImageCandidates(species.image_path),
    [species.image_path],
  );
  const displaySrc = imageCandidates[Math.min(fallbackIdx, imageCandidates.length - 1)] ?? species.image_path;

  const highlightRow = useMemo(() => {
    if (!isAimReady || ladder.length === 0) return null;
    return ladderRowAt(ladder, highlightDist)
      ?? ladder.find(r => r.distance_m > aimZero)
      ?? ladder[ladder.length - 1];
  }, [isAimReady, ladder, highlightDist, aimZero]);

  const sliderTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let d = 100; d <= MAX_HOLDOVER_M; d += 100) ticks.push(d);
    return ticks;
  }, []);

  const windage_cm = useMemo(() => {
    if (!isAimReady || windSpeed <= 0 || !highlightRow) return 0;
    return calculateWindage(aimBc, aimMv, aimZero, highlightDist, windSpeed, windDir);
  }, [isAimReady, windSpeed, windDir, aimBc, aimMv, aimZero, highlightDist, highlightRow]);

  function handleSliderDist(v: number) {
    setHighlightDist(v);
    setSliderPulse(true);
    window.setTimeout(() => setSliderPulse(false), 180);
  }

  const drawRef = useRef({
    ladder: [] as BallisticsResult[],
    highlightDist: 0,
    highlightRow: null as BallisticsResult | null,
    isAimReady: false,
    aimZero: 100,
  });
  drawRef.current = { ladder, highlightDist, highlightRow, isAimReady, aimZero };

  const redraw = useCallback((windCm = 0) => {
    const canvas = canvasRef.current;
    const el = containerRef.current;
    const { ladder: L, highlightDist: hd, highlightRow: hr, isAimReady: ready, aimZero: z } = drawRef.current;
    if (!canvas || !el || !ready || L.length === 0) return;
    const W = el.offsetWidth;
    const H = el.offsetHeight;
    if (W > 0 && H > 0) {
      drawCanvas(canvas, W, H, L, hd, hr, z, calRef.current, false, false, windCm);
    }
  }, []);

  const runDetection = useCallback(() => {
    const img = imgRef.current;
    if (!img || !img.complete || img.naturalWidth === 0) return false;
    const next = detectVitalDot(img);
    const prev = vitalDotRef.current;
    if (!next && !prev) return false;
    if (next && prev &&
      Math.abs(next.x - prev.x) < 0.0005 &&
      Math.abs(next.y - prev.y) < 0.0005) return false;
    vitalDotRef.current = next;
    // Lock calRef to detected position — never allow render to overwrite this
    calRef.current = { ...calData, ...(next ? { vital_x: next.x, vital_y: next.y } : {}) };
    return true;
  }, [calData]);

  useEffect(() => {
    windage_cmRef.current = windage_cm;
    redraw(windage_cm);
  }, [ladder, highlightDist, highlightRow, isAimReady, aimZero, calData, redraw, windage_cm]);

  useEffect(() => {
    setFallbackIdx(0);
    vitalDotRef.current = null;
    calRef.current = calData; // species.ts default until image loads and detection runs
  }, [speciesId, calData]);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0 && runDetection()) redraw();
  }, [displaySrc, speciesId, fallbackIdx, runDetection, redraw]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => redraw(windage_cmRef.current));
    ro.observe(el);
    return () => ro.disconnect();
  }, [redraw]);

  function onSelectSpeciesId(id: string) { setSpeciesId(id); }

  function ppc(H: number) {
    const c = calRef.current;
    return (c.ground_y - c.shoulder_y) * H / c.shoulder_height_cm;
  }

  function highlightDotY(H: number): number | null {
    if (!highlightRow) return null;
    const c = calRef.current;
    const vY = c.vital_y * H;
    return Math.max(8, vY - highlightRow.holdover_cm * ppc(H));
  }

  function distFromAimLineY(cy: number, H: number): number {
    const c = calRef.current;
    const vY = c.vital_y * H;
    const p = ppc(H);
    if (p <= 0) return highlightDist;
    const hoCm = Math.max(0, (vY - cy) / p);
    const candidates = ladder.filter(r => r.distance_m > aimZero);
    if (candidates.length === 0) return highlightDist;
    let best = candidates[0];
    let bestDiff = Math.abs(best.holdover_cm - hoCm);
    for (let i = 1; i < candidates.length; i++) {
      const diff = Math.abs(candidates[i].holdover_cm - hoCm);
      if (diff < bestDiff) { bestDiff = diff; best = candidates[i]; }
    }
    return best.distance_m;
  }

  function hitRadius(H: number) { return Math.max(22, H * 0.045); }

  function hitLadderDot(cx: number, cy: number, W: number, H: number): number | null {
    const c = calRef.current;
    const vX = c.vital_x * W;
    const dr = hitRadius(H);
    for (const row of ladder.filter(r => r.distance_m > aimZero)) {
      const dy = Math.max(8, c.vital_y * H - row.holdover_cm * ppc(H));
      if (Math.hypot(cx - vX, cy - dy) < dr) return row.distance_m;
    }
    return null;
  }

  function handleCanvasPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isAimReady || !highlightRow) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const W = rect.width;
    const H = rect.height;
    const c = calRef.current;
    const vX = c.vital_x * W;
    const hy = highlightDotY(H);
    const dr = hitRadius(H);
    const ladderHit = hitLadderDot(cx, cy, W, H);
    if (ladderHit !== null) { setHighlightDist(ladderHit); return; }
    const onAimLine = Math.abs(cx - vX) < dr;
    const onGoldDot = hy !== null && Math.hypot(cx - vX, cy - hy) < dr * 1.2;
    if (onGoldDot || onAimLine) {
      setAimDragging(true);
      setHighlightDist(distFromAimLineY(cy, H));
      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
    }
  }

  function handleCanvasPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!aimDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHighlightDist(distFromAimLineY(e.clientY - rect.top, rect.height));
  }

  function handleCanvasPointerUp() { setAimDragging(false); }

  function handleDialPointer(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    let a = Math.round(Math.atan2(dx, -dy) * 180 / Math.PI);
    if (a < 0) a += 360;
    const snapped = Math.round(a / 45) * 45;
    setWindDir(Math.abs(snapped - a) < 15 ? snapped % 360 : a);
  }

  function windSpeedLabel(ms: number): string {
    if (ms === 0)  return lang === "en" ? "No wind"           : "Geen wind";
    if (ms <= 1)   return lang === "en" ? "Smoke drift"       : "Rookdryf";
    if (ms <= 3)   return lang === "en" ? "Light breeze"      : "Ligte bries";
    if (ms <= 5)   return lang === "en" ? "Gentle breeze"     : "Sagte bries";
    if (ms <= 7)   return lang === "en" ? "Moderate breeze"   : "Matige bries";
    if (ms <= 9)   return lang === "en" ? "Fresh breeze"      : "Fris bries";
    if (ms <= 11)  return lang === "en" ? "Strong breeze"     : "Sterk bries";
    if (ms <= 13)  return lang === "en" ? "Near gale"         : "Byna stormwind";
    return           lang === "en" ? "Gale \u2014 tough shot" : "Storm \u2014 moeilik";
  }

  function windDirLabel(): string {
    const dirs = lang === "en"
      ? ["Head", "", "Right", "", "Tail", "", "Left", ""]
      : ["Voor",  "", "Regs",  "", "Agter","", "Links",""];
    const idx = Math.round(((windDir % 360) + 360) % 360 / 45) % 8;
    return dirs[idx] || `${windDir}\u00b0`;
  }

  const canvasCursor = isAimReady ? (aimDragging ? "grabbing" : "grab") : "default";

  return (
    <div style={{ background: D, minHeight: "100%", overflowX: "hidden" }}>
      <SliderStyles />
      <PageHeader title={t.title} lang={lang} onToggleLang={toggleLang} />

      <Card>
        <div style={{ padding: "14px 16px 16px" }}>
          <BallisticsPickers
            lang={lang} t={t}
            savedRifles={savedRifles}
            aimRifleId={aimRifleId}
            aimRifle={aimRifle}
            onSelectRifle={selectAimRifle}
            onDeleteRifle={deleteRifle}
            speciesId={speciesId}
            onSelectSpeciesId={onSelectSpeciesId}
          />

          {isAimReady && highlightRow && (
            <div style={{ padding: "10px 0 8px" }}>
              <DistSlider min={minDist} max={MAX_HOLDOVER_M} step={LADDER_STEP_M} value={highlightDist} onChange={handleSliderDist} ticks={sliderTicks} giant pulse={sliderPulse} showValue />

              {/* Wind row */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>

                {/* Wind speed */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: "0.7rem", color: "#888", fontFamily: "Rajdhani,sans-serif", fontWeight: 700, letterSpacing: "0.06em" }}>WIND</span>
                    <span style={{ fontSize: "0.7rem", color: G, fontFamily: "Rajdhani,sans-serif", fontWeight: 700 }}>
                      {windSpeedLabel(windSpeed)}{windSpeed > 0 ? `  \u00b7  ${windSpeed} m/s` : ""}
                    </span>
                  </div>
                  <input
                    type="range" min={0} max={15} step={1}
                    value={windSpeed}
                    onChange={e => setWindSpeed(Number(e.target.value))}
                    className="th-slider"
                    style={{ "--pct": `${(windSpeed / 15) * 100}%` } as React.CSSProperties}
                  />
                </div>

                {/* Direction dial */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, opacity: windSpeed === 0 ? 0.3 : 1, transition: "opacity 0.2s" }}>
                  <span style={{ fontSize: "0.65rem", color: G, fontFamily: "Rajdhani,sans-serif", fontWeight: 700, minHeight: 14 }}>
                    {windSpeed > 0 ? windDirLabel() : ""}
                  </span>
                  <div
                    style={{ width: 110, height: 110, borderRadius: "50%", background: "#0D0F0A", border: `3px solid ${windSpeed > 0 ? G : "#333"}`, position: "relative", cursor: windSpeed > 0 ? "grab" : "default", touchAction: "none", userSelect: "none", transition: "border-color 0.2s" }}
                    onPointerDown={e => { if (windSpeed === 0) return; setDialActive(true); e.currentTarget.setPointerCapture(e.pointerId); handleDialPointer(e); }}
                    onPointerMove={e => { if (dialActive && windSpeed > 0) handleDialPointer(e); }}
                    onPointerUp={() => setDialActive(false)}
                    onPointerCancel={() => setDialActive(false)}
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                      <div key={a} style={{ position: "absolute", top: "50%", left: "50%", width: a % 90 === 0 ? 2 : 1, height: a % 90 === 0 ? 10 : 6, background: a % 90 === 0 ? "#666" : "#444", transformOrigin: "top center", transform: `translate(-50%,0) rotate(${a}deg) translateY(-46px)` }} />
                    ))}
                    <div style={{ position: "absolute", top: "50%", left: "50%", width: 3, height: 38, background: G, transformOrigin: "50% 100%", transform: `translate(-50%,-100%) rotate(${windDir}deg)`, borderRadius: 2 }} />
                    <div style={{ position: "absolute", top: "50%", left: "50%", width: 10, height: 10, borderRadius: "50%", background: G, transform: "translate(-50%,-50%)" }} />
                  </div>
                  {windSpeed > 0 && (
                    <div style={{ marginTop: 4, fontSize: "0.75rem", color: G, fontFamily: "Rajdhani,sans-serif", fontWeight: 700, textAlign: "center" }}>
                      {windDirLabel()}{Math.abs(windage_cm) > 0.5 ? `  ${Math.abs(Math.round(windage_cm))}cm ${windage_cm > 0 ? "\u2190" : "\u2192"}` : ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}



          <div ref={containerRef} style={{ position: "relative", width: "100%", lineHeight: 0, userSelect: "none", borderRadius: 8, overflow: "hidden", border: `1px solid ${B}`, background: D }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              key={`${speciesId}-${fallbackIdx}`}
              src={displaySrc}
              alt={lang === "en" ? species.name_en : species.name_af}
              crossOrigin="anonymous"
              style={{ width: "100%", display: "block", height: "auto" }}
              onLoad={() => { if (runDetection()) redraw(windage_cmRef.current); else requestAnimationFrame(() => redraw(windage_cmRef.current)); }}
              onError={() => { if (fallbackIdx + 1 < imageCandidates.length) setFallbackIdx(i => i + 1); }}
            />
            <canvas
              ref={canvasRef}
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              onPointerCancel={handleCanvasPointerUp}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", cursor: canvasCursor, touchAction: aimDragging ? "none" : "pan-y" }}
            />
          </div>

          {!isAimReady && savedRifles.length > 0 && aimRifle && (
            <p style={{ fontSize: "0.8rem", color: "#FF8844", margin: "10px 0 0", lineHeight: 1.5 }}>
              {lang === "en"
                ? `Rifle "${aimRifle.name}" needs a valid BC and muzzle velocity — edit it on the Rifle tab.`
                : `Geweer "${aimRifle.name}" benodig geldige BC en mondingsnelheid — wysig op Geweer-oortjie.`}
            </p>
          )}

          <SpeciesDetailsPanel key={speciesId} lang={lang} t={t} speciesId={speciesId} selectedCaliber={savedRifles.find(r => r.id === aimRifleId)?.caliber} />
        </div>
      </Card>
    </div>
  );
}