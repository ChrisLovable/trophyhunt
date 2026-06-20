"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from "react";
import { animalImageCandidates } from "@/lib/animals/animal-image";
import { detectVitalDot } from "@/lib/animals/detect-vital-dot";
import { useLang } from "@/lib/app/use-lang";
import { D, G, M, B } from "@/lib/app/brand";
import { MAX_HOLDOVER_M, type CalData } from "@/lib/ballistics/calibration";
import { BALLISTICS_T } from "@/lib/ballistics/i18n";
import { drawCanvas } from "@/lib/ballistics/draw-canvas";
import {
  ladderRowAt, LADDER_STEP_M,
} from "@/lib/ballistics/holdover-math";
import type { BallisticsResult } from "@/lib/types/ballistics";
import { deleteRifle } from "@/lib/rifle/storage";
import { useAimSession } from "@/hooks/use-aim-session";
import { BallisticsPickers } from "@/components/ballistics/BallisticsPickers";
import { SpeciesDetailsPanel } from "@/components/ballistics/SpeciesDetailsPanel";
import {
  Card, DistSlider, PageHeader, SliderStyles,
} from "@/components/ballistics/ui";

function calWithVitalDot(calData: CalData, vital: { x: number; y: number } | null): CalData {
  if (!vital) return calData;
  if (
    Math.abs(vital.x - calData.vital_x) < 0.0005
    && Math.abs(vital.y - calData.vital_y) < 0.0005
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

  const [sliderPulse, setSliderPulse] = useState(false);
  const [aimDragging, setAimDragging] = useState(false);
  const [fallbackIdx, setFallbackIdx] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const vitalDotRef = useRef<{ x: number; y: number } | null>(null);
  const calRef = useRef<CalData>(calData);

  calRef.current = calWithVitalDot(calData, vitalDotRef.current);

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

  function handleSliderDist(v: number) {
    setHighlightDist(v);
    setSliderPulse(true);
    window.setTimeout(() => setSliderPulse(false), 180);
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawRef = useRef({
    ladder: [] as BallisticsResult[],
    highlightDist: 0,
    highlightRow: null as BallisticsResult | null,
    isAimReady: false,
    aimZero: 100,
  });
  drawRef.current = { ladder, highlightDist, highlightRow, isAimReady, aimZero };

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const el = containerRef.current;
    const { ladder: L, highlightDist: hd, highlightRow: hr, isAimReady: ready, aimZero: z } = drawRef.current;
    if (!canvas || !el || !ready || L.length === 0) return;
    const W = el.offsetWidth;
    const H = el.offsetHeight;
    if (W > 0 && H > 0) {
      drawCanvas(canvas, W, H, L, hd, hr, z, calRef.current, false, false);
    }
  }, []);

  const runDetection = useCallback(() => {
    const img = imgRef.current;
    if (!img || !img.complete || img.naturalWidth === 0) return false;
    const next = detectVitalDot(img);
    const prev = vitalDotRef.current;
    if (!next && !prev) return false;
    if (next && prev
      && Math.abs(next.x - prev.x) < 0.0005
      && Math.abs(next.y - prev.y) < 0.0005) return false;
    vitalDotRef.current = next;
    calRef.current = calWithVitalDot(calData, next);
    return true;
  }, [calData]);

  useEffect(() => { redraw(); }, [ladder, highlightDist, highlightRow, isAimReady, aimZero, calData, redraw]);

  useEffect(() => {
    setFallbackIdx(0);
    vitalDotRef.current = null;
    calRef.current = calData;
  }, [speciesId, calData]);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0 && runDetection()) redraw();
  }, [displaySrc, speciesId, fallbackIdx, runDetection, redraw]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => redraw());
    ro.observe(el);
    return () => ro.disconnect();
  }, [redraw]);

  function onSelectSpeciesId(id: string) {
    setSpeciesId(id);
  }

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
      if (diff < bestDiff) {
        bestDiff = diff;
        best = candidates[i];
      }
    }
    return best.distance_m;
  }

  function hitRadius(H: number) {
    return Math.max(22, H * 0.045);
  }

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
    if (ladderHit !== null) {
      setHighlightDist(ladderHit);
      return;
    }

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

  function handleCanvasPointerUp() {
    setAimDragging(false);
  }

  const canvasCursor = isAimReady ? (aimDragging ? "grabbing" : "grab") : "default";

  return (
    <div style={{ background: D, minHeight: "100%", overflowX: "hidden" }}>
      <SliderStyles />
      <PageHeader title={t.title} lang={lang} onToggleLang={toggleLang} />

      <Card>
        <div style={{ padding: "14px 16px 16px" }}>
          <BallisticsPickers
            lang={lang}
            t={t}
            savedRifles={savedRifles}
            aimRifleId={aimRifleId}
            aimRifle={aimRifle}
            onSelectRifle={selectAimRifle}
            onDeleteRifle={deleteRifle}
            speciesId={speciesId}
            onSelectSpeciesId={onSelectSpeciesId}
          />

          {isAimReady && highlightRow && (
            <div style={{ padding: "12px 0" }}>
              <DistSlider min={minDist} max={MAX_HOLDOVER_M} step={LADDER_STEP_M} value={highlightDist} onChange={handleSliderDist} ticks={sliderTicks} giant pulse={sliderPulse} showValue />
            </div>
          )}

          {process.env.NODE_ENV === "development" && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
              <a
                href={`/calibration?species=${speciesId}`}
                style={{
                  fontSize: "0.62rem", color: M, textDecoration: "none",
                  padding: "3px 8px", borderRadius: 4,
                  border: `1px solid ${B}`, background: "rgba(19,21,16,0.9)",
                }}
              >
                ⚙ Kalibreer
              </a>
            </div>
          )}

          <div ref={containerRef} style={{ position: "relative", width: "100%", lineHeight: 0, userSelect: "none", borderRadius: 8, overflow: "hidden", border: `1px solid ${B}`, background: D }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              key={`${speciesId}-${fallbackIdx}`}
              src={displaySrc}
              alt={lang === "en" ? species.name_en : species.name_af}
              style={{ width: "100%", display: "block", height: "auto" }}
              onLoad={() => {
                if (runDetection()) redraw();
                else requestAnimationFrame(() => redraw());
              }}
              onError={() => {
                if (fallbackIdx + 1 < imageCandidates.length) {
                  setFallbackIdx(i => i + 1);
                }
              }}
            />
            <canvas
              ref={canvasRef}
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              onPointerCancel={handleCanvasPointerUp}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", cursor: canvasCursor, touchAction: "none" }}
            />
          </div>

          {!isAimReady && savedRifles.length > 0 && aimRifle && (
            <p style={{ fontSize: "0.8rem", color: "#FF8844", margin: "10px 0 0", lineHeight: 1.5 }}>
              {lang === "en"
                ? `Rifle "${aimRifle.name}" needs a valid BC and muzzle velocity — edit it on the Rifle tab.`
                : `Geweer "${aimRifle.name}" benodig geldige BC en mondingsnelheid — wysig op Geweer-oortjie.`}
            </p>
          )}

          <SpeciesDetailsPanel
            key={speciesId}
            lang={lang}
            t={t}
            speciesId={speciesId}
            selectedCaliber={savedRifles.find(r => r.id === aimRifleId)?.caliber}
          />
        </div>
      </Card>
    </div>
  );
}
