"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { bakeAnimalLines } from "@/lib/animals/bake-lines";
import { animalImageCandidates, bakedImageFilename } from "@/lib/animals/animal-image";
import { drawShoulderHoofLines } from "@/lib/ballistics/draw-canvas";
import {
  LS_CAL, LINE_Y_GAP, LINE_Y_MAX, LINE_Y_MIN,
  clampGroundY, clampLineY, clampShoulderY,
  mergeCal, speciesCal, saveStoredCal, type CalData,
} from "@/lib/ballistics/calibration";
import { calculateLadder } from "@/lib/ballistics/engine";
import { getSpeciesById } from "@/lib/types/species";
import { supabase } from "@/lib/supabase";
import { CmStepper } from "@/components/ballistics/ui";

const G = "#C8A96E", P = "#131510", B = "#2A2D1E", M = "#5A6040", C = "#E8E2D4";
const VITAL_GREEN = "#50C878";

// ─── Preview ladder (.270 Win 130gr Partition, fixed reference load) ─────────
const PREVIEW_LADDER = calculateLadder(0.416, 930, 100, 500, 100);

interface Props {
  speciesId: string;
  name: string;
  imagePath: string;
  shoulderY: number;
  groundY: number;
  shoulderHeightCm: number;
}

type LineDrag = "shoulder" | "hoof";
type VitalDrag = "vital_center" | "vital_edge";

// Save both line and vital calibration to localStorage
function saveAllLocal(
  speciesId: string,
  lines: Pick<CalData, "shoulder_y" | "ground_y" | "shoulder_height_cm">,
  vital: Pick<CalData, "vital_x" | "vital_y" | "vital_radius_pct">,
) {
  const sp = getSpeciesById(speciesId);
  if (!sp) return;
  try {
    const raw = localStorage.getItem(LS_CAL);
    const map: Record<string, CalData> = raw ? JSON.parse(raw) : {};
    map[speciesId] = mergeCal(speciesCal(sp), { ...lines, ...vital });
    localStorage.setItem(LS_CAL, JSON.stringify(map));
  } catch { /* ignore */ }
}

export default function HorizontalImageMarker({
  speciesId, name, imagePath, shoulderY, groundY, shoulderHeightCm,
}: Props) {
  const sp = useMemo(() => getSpeciesById(speciesId), [speciesId]);

  const lineDefaults = useMemo(() => ({
    shoulder_y: shoulderY,
    ground_y: groundY,
    shoulder_height_cm: shoulderHeightCm,
  }), [shoulderY, groundY, shoulderHeightCm]);

  const vitalDefaults = useMemo(() => ({
    vital_x: sp?.vital_x ?? 0.40,
    vital_y: sp?.vital_y ?? 0.60,
    vital_radius_pct: sp?.vital_radius_pct ?? 0.07,
  }), [sp]);

  const [cal, setCal]               = useState(lineDefaults);
  const [vital, setVital]           = useState(vitalDefaults);
  const [hydrated, setHydrated]     = useState(false);
  const [imgLoaded, setImgLoaded]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [msg, setMsg]               = useState("");
  const [cacheBust, setCacheBust]   = useState(0);
  const [lineDragging, setLineDragging]   = useState<LineDrag | null>(null);
  const [vitalDragging, setVitalDragging] = useState<VitalDrag | null>(null);

  const candidates = useMemo(() => animalImageCandidates(imagePath), [imagePath]);
  const [activeSrc, setActiveSrc]   = useState(candidates[0]);
  const boxRef    = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const outFilename = bakedImageFilename(imagePath);

  // ── Load from localStorage on mount ───────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_CAL);
      if (raw) {
        const map = JSON.parse(raw) as Record<string, Partial<CalData>>;
        const stored = map[speciesId];
        if (stored) {
          if (
            stored.shoulder_y != null && stored.ground_y != null
            && stored.ground_y > stored.shoulder_y + LINE_Y_GAP
            && stored.shoulder_y >= LINE_Y_MIN
            && stored.ground_y <= LINE_Y_MAX
          ) {
            setCal({
              shoulder_y: stored.shoulder_y,
              ground_y: stored.ground_y,
              shoulder_height_cm: stored.shoulder_height_cm ?? shoulderHeightCm,
            });
          }
          if (stored.vital_x != null && stored.vital_y != null) {
            setVital({
              vital_x: stored.vital_x,
              vital_y: stored.vital_y,
              vital_radius_pct: stored.vital_radius_pct ?? vitalDefaults.vital_radius_pct,
            });
          }
        }
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, [speciesId, shoulderHeightCm, vitalDefaults.vital_radius_pct]);

  // ── Canvas redraw ─────────────────────────────────────────────────────────
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const el = boxRef.current;
    if (!canvas || !el || !imgLoaded) return;
    const W = el.offsetWidth;
    const H = el.offsetHeight;
    if (W <= 0 || H <= 0) return;

    // 1. Shoulder + hoof lines (clears canvas, sets DPR transform)
    drawShoulderHoofLines(canvas, W, H, cal.shoulder_y, cal.ground_y, cal.shoulder_height_cm);

    // 2. Vital circle + preview dots on top (same ctx, same DPR transform)
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const vX = vital.vital_x * W;
    const vY = vital.vital_y * H;
    const vR = vital.vital_radius_pct * H;
    const gY = cal.ground_y * H;
    const shY = cal.shoulder_y * H;
    const ppc = cal.shoulder_height_cm > 0 ? (gY - shY) / cal.shoulder_height_cm : 1;
    const fSz = Math.max(9, H * 0.025);

    ctx.save();

    // Outer dashed circle
    ctx.setLineDash([8, 5]);
    ctx.strokeStyle = VITAL_GREEN;
    ctx.lineWidth = vitalDragging ? 3 : 1.8;
    ctx.beginPath(); ctx.arc(vX, vY, vR, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    // Translucent fill
    ctx.beginPath(); ctx.arc(vX, vY, vR, 0, Math.PI * 2);
    ctx.fillStyle = "#50C87818"; ctx.fill();

    // Center drag handle
    ctx.beginPath(); ctx.arc(vX, vY, vitalDragging === "vital_center" ? 10 : 8, 0, Math.PI * 2);
    ctx.fillStyle = VITAL_GREEN; ctx.fill();
    ctx.strokeStyle = "#0D0F0A"; ctx.lineWidth = 1.5; ctx.stroke();

    // Edge resize handle (right side of circle)
    ctx.beginPath(); ctx.arc(vX + vR, vY, vitalDragging === "vital_edge" ? 10 : 7, 0, Math.PI * 2);
    ctx.fillStyle = "#50C878bb"; ctx.fill();
    ctx.strokeStyle = "#0D0F0A"; ctx.lineWidth = 1.5; ctx.stroke();

    // Preview holdover dots (.270 Win 130gr, gold colour)
    ctx.font = `600 ${fSz}px Rajdhani,sans-serif`;
    PREVIEW_LADDER.forEach((row, i) => {
      if (row.distance_m === 100) return; // skip zero dot
      const dy = Math.max(8, vY - row.holdover_cm * ppc);
      ctx.beginPath(); ctx.arc(vX, dy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#C8A96E99"; ctx.fill();
      ctx.strokeStyle = "#C8A96Ecc"; ctx.lineWidth = 1.2; ctx.stroke();
      const lbl = `${row.distance_m}m`;
      if (i % 2 === 0) {
        ctx.textAlign = "left"; ctx.fillStyle = "#C8A96E99";
        ctx.fillText(lbl, vX + 12, dy + fSz * 0.38);
      } else {
        ctx.textAlign = "right"; ctx.fillStyle = "#C8A96E99";
        ctx.fillText(lbl, vX - 12, dy + fSz * 0.38);
      }
    });

    ctx.restore();
  }, [cal, vital, vitalDragging, imgLoaded]);

  useEffect(() => { redraw(); }, [redraw]);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(redraw);
    ro.observe(el);
    return () => ro.disconnect();
  }, [redraw]);

  // ── Pointer hit testing ───────────────────────────────────────────────────
  function hitLine(cy: number, H: number): LineDrag | null {
    const shY = cal.shoulder_y * H;
    const gY  = cal.ground_y * H;
    const tol = Math.max(22, H * 0.05);
    if (Math.abs(cy - shY) < tol) return "shoulder";
    if (Math.abs(cy - gY)  < tol) return "hoof";
    return null;
  }

  function hitVital(cx: number, cy: number, W: number, H: number): VitalDrag | null {
    const vX = vital.vital_x * W;
    const vY = vital.vital_y * H;
    const vR = vital.vital_radius_pct * H;
    // Edge handle (right side)
    if (Math.hypot(cx - (vX + vR), cy - vY) < 18) return "vital_edge";
    // Center handle
    if (Math.hypot(cx - vX, cy - vY) < 18) return "vital_center";
    return null;
  }

  // ── Pointer events ────────────────────────────────────────────────────────
  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    // Vital handles have priority over line handles
    const vhit = hitVital(cx, cy, rect.width, rect.height);
    if (vhit) {
      setVitalDragging(vhit);
      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
      return;
    }

    const lhit = hitLine(cy, rect.height);
    if (lhit) {
      setLineDragging(lhit);
      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const W  = rect.width;
    const H  = rect.height;

    if (lineDragging) {
      const py = clampLineY(cy / H);
      setCal(prev => {
        const next = lineDragging === "shoulder"
          ? { ...prev, shoulder_y: clampShoulderY(py, prev.ground_y) }
          : { ...prev, ground_y:   clampGroundY(py, prev.shoulder_y) };
        saveAllLocal(speciesId, next, vital);
        return next;
      });
    }

    if (vitalDragging === "vital_center") {
      const next = {
        ...vital,
        vital_x: Math.max(0.05, Math.min(0.95, cx / W)),
        vital_y: Math.max(0.05, Math.min(0.95, cy / H)),
      };
      setVital(next);
      saveAllLocal(speciesId, cal, next);
    }

    if (vitalDragging === "vital_edge") {
      const vX = vital.vital_x * W;
      const vY = vital.vital_y * H;
      const r  = Math.hypot(cx - vX, cy - vY);
      const next = {
        ...vital,
        vital_radius_pct: Math.max(0.025, Math.min(0.30, r / H)),
      };
      setVital(next);
      saveAllLocal(speciesId, cal, next);
    }
  }

  function handlePointerUp() {
    setLineDragging(null);
    setVitalDragging(null);
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    setMsg("");

    const calPayload: Partial<CalData> = {
      ground_y:           cal.ground_y,
      shoulder_y:         cal.shoulder_y,
      shoulder_height_cm: cal.shoulder_height_cm,
      spine_y:            sp?.spine_y ?? cal.shoulder_y - 0.06,
      vital_x:            vital.vital_x,
      vital_y:            vital.vital_y,
      vital_radius_pct:   vital.vital_radius_pct,
    };

    console.log("SAVING CAL:", { speciesId, ...calPayload });
    console.log("Saving to localStorage key:", LS_CAL);

    // ── Step 1: Save to localStorage FIRST — always, unconditionally ──────────
    saveStoredCal(speciesId, calPayload);

    // ── Step 2: Save to Supabase — independently, don't block on failure ──────
    if (supabase) {
      supabase.from("animal_calibrations").upsert({
        species_id:         speciesId,
        image_path:         imagePath,
        ground_y:           cal.ground_y,
        shoulder_y:         cal.shoulder_y,
        spine_y:            sp?.spine_y ?? cal.shoulder_y - 0.06,
        vital_x:            vital.vital_x,
        vital_y:            vital.vital_y,
        vital_radius_pct:   vital.vital_radius_pct,
        shoulder_height_cm: cal.shoulder_height_cm,
      }, { onConflict: "species_id" }).then(({ error }) => {
        if (error) console.error("Supabase save error:", error);
        else console.log("Saved to Supabase for", speciesId);
      });
    }

    // ── Step 3: Bake lines into PNG — optional, don't let failure block saves ─
    try {
      const dataUrl = await bakeAnimalLines(activeSrc, {
        shoulderPct:      cal.shoulder_y * 100,
        hoofPct:          cal.ground_y * 100,
        shoulderHeightCm: cal.shoulder_height_cm,
      });
      const res = await fetch("/api/animals/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: outFilename, image: dataUrl }),
      });
      const data = await res.json() as { error?: string; path?: string };
      if (res.ok && data.path) {
        setActiveSrc(data.path);
        setCacheBust(n => n + 1);
      } else {
        console.warn("PNG bake failed (calibration still saved):", data.error);
      }
    } catch (err) {
      console.warn("PNG bake error (calibration still saved):", err);
    }

    setMsg("✓ Saved");
    setSaving(false);
    setTimeout(() => setMsg(""), 4000);
  }

  function handleImgError() {
    const idx = candidates.indexOf(activeSrc);
    const next = candidates[idx + 1];
    if (next) { setActiveSrc(next); setImgLoaded(false); }
  }

  const spanPct = ((cal.ground_y - cal.shoulder_y) * 100).toFixed(1);
  const isDragging = lineDragging !== null || vitalDragging !== null;

  return (
    <div style={{ background: P, border: `1px solid ${B}`, borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>

      {/* Header */}
      <div style={{ padding: "10px 12px", borderBottom: `1px solid ${B}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 700, color: C, fontSize: "0.9rem" }}>
          {name}
        </span>
        <span style={{ fontSize: "0.62rem", color: M }}>{outFilename}</span>
      </div>

      {/* Canvas over image */}
      <div ref={boxRef} style={{ position: "relative", lineHeight: 0, borderBottom: `1px solid ${B}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${activeSrc}${cacheBust ? `?v=${cacheBust}` : ""}`}
          alt={name}
          style={{ width: "100%", display: "block" }}
          onLoad={() => setImgLoaded(true)}
          onError={handleImgError}
        />
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            cursor: isDragging ? (vitalDragging ? "move" : "ns-resize") : "grab",
            touchAction: "none",
          }}
        />
      </div>

      {/* Controls */}
      <div style={{ padding: "12px" }}>
        <p style={{ fontSize: "0.72rem", color: M, margin: "0 0 12px", lineHeight: 1.5 }}>
          Drag the <span style={{ color: G, fontWeight: 700 }}>gold shoulder</span>,{" "}
          <span style={{ color: "#4A9EFF", fontWeight: 700 }}>blue hoof</span> lines,{" "}
          and the <span style={{ color: VITAL_GREEN, fontWeight: 700 }}>green vital circle</span>{" "}
          (center or edge). Gold dots = .270 Win preview holdover.
        </p>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: "0.62rem", color: M, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
            Shoulder height / Skouerhoogte
          </div>
          <CmStepper
            value={cal.shoulder_height_cm}
            onChange={v => {
              const next = { ...cal, shoulder_height_cm: v };
              setCal(next);
              saveAllLocal(speciesId, next, vital);
            }}
            min={30}
            max={350}
            step={1}
          />
        </div>

        {hydrated && (
          <p style={{ fontSize: "0.58rem", color: M, textAlign: "center", margin: "0 0 12px", lineHeight: 1.5 }}>
            Sh {(cal.shoulder_y * 100).toFixed(1)}% · Hoof {(cal.ground_y * 100).toFixed(1)}% ·{" "}
            Span <span style={{ color: G, fontWeight: 600 }}>{spanPct}%</span>
            {" | "}
            <span style={{ color: VITAL_GREEN }}>
              Vital ({(vital.vital_x * 100).toFixed(0)}%,{(vital.vital_y * 100).toFixed(0)}%) r={vital.vital_radius_pct.toFixed(3)}
            </span>
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !imgLoaded}
          style={{
            width: "100%", minHeight: 48, borderRadius: 8,
            border: `1px solid ${G}`, background: G + "1a", color: G,
            fontFamily: "Rajdhani,sans-serif", fontSize: "0.9rem", fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Saving…" : "Save Calibration"}
        </button>
        {msg && (
          <p style={{
            fontSize: "0.72rem", margin: "8px 0 0", textAlign: "center",
            color: msg.startsWith("✓") ? "#50C878" : "#FF4444",
          }}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
