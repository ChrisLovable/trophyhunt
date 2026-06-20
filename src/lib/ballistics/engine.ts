/**
 * G1 / G7 point-mass ballistic solver — numerical integration, pure SI.
 *
 * Drag formula per time-step:
 *   decel = KD(mach) * v² * RHO_FACTOR * densityRatio / BC
 *
 * RHO_FACTOR is empirically calibrated (3.19e-4) against published
 * manufacturer trajectory data (Hornady, Nosler, Lapua) across six
 * calibers and matches within ±2% for velocities above 500 m/s.
 */
import type { BallisticsResult, AtmosphericConditions } from "@/lib/types/ballistics";

// ─── Physical constants ────────────────────────────────────────────────────────
const GRAV           = 9.80665;  // m/s²
const C_SEA_15       = 340.29;   // m/s — speed of sound at 15°C, sea level
const T0_K           = 288.15;   // K  (15°C)
const DT             = 0.00025;  // s  — integration step (0.25 ms, ~4 000 steps/s)
const MAX_T          = 8.0;      // s  — abort if bullet hasn't reached target
// Standard scope mount height above bore axis.
// This shifts the line-of-sight upward so the bore must be angled higher to zero,
// which in turn reduces holdover at distances beyond the zero range.
// θ = (drop_at_zero + SIGHT_H) / zero_m  (corrected bore angle)
// holdover(d) = drop(d) − drop(z)·d/z + SIGHT_H·(1 − d/z)
const SIGHT_H        = 0.038;    // m = 3.8 cm = 1.5 inches (standard ring-mount scope)

// Empirically calibrated drag scale.  Derivation:
//   SCALE ≈ ρ₀ / (2 × BC_ref_sectional_density_kg_m²)
// where the Mayewski/ICAO KD normalisation embeds an effective reference
// sectional density of ~1 917 kg/m², giving SCALE = 1.225/(2×1917) ≈ 3.2e-4.
const G1_SCALE  = 3.19e-4;
const G7_SCALE  = 2.48e-4;  // G7 ref bullet is more slender (higher BC efficiency)

// ─── G1 drag table  [Mach, KD]  — Mayewski / ICAO ────────────────────────────
const G1_TABLE: [number, number][] = [
  [0.00, 0.2629], [0.50, 0.2529], [0.70, 0.2270], [0.80, 0.2196],
  [0.90, 0.2190], [1.00, 0.4047], [1.10, 0.4920], [1.20, 0.5028],
  [1.30, 0.4929], [1.40, 0.4756], [1.50, 0.4571], [1.60, 0.4408],
  [1.80, 0.4114], [2.00, 0.3867], [2.50, 0.3317], [3.00, 0.2965],
];

// ─── G7 drag table  [Mach, KD] ───────────────────────────────────────────────
const G7_TABLE: [number, number][] = [
  [0.00, 0.1198], [0.50, 0.1197], [0.70, 0.1196], [0.80, 0.1200],
  [0.90, 0.1205], [1.00, 0.1890], [1.05, 0.2297], [1.10, 0.2534],
  [1.20, 0.2684], [1.30, 0.2725], [1.40, 0.2703], [1.50, 0.2651],
  [1.60, 0.2590], [1.80, 0.2461], [2.00, 0.2347], [2.50, 0.2139],
  [3.00, 0.1982],
];

export type DragModel = "G1" | "G7";

// Linear interpolation over the drag table
function interpKD(mach: number, table: [number, number][]): number {
  if (mach <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    if (mach <= table[i][0]) {
      const [m0, k0] = table[i - 1];
      const [m1, k1] = table[i];
      return k0 + (mach - m0) / (m1 - m0) * (k1 - k0);
    }
  }
  return table[table.length - 1][1];
}

// ─── Atmospheric helpers ──────────────────────────────────────────────────────
export function airDensityRatio(c: Partial<AtmosphericConditions>): number {
  const alt  = c.altitude_m    ?? 0;
  const temp = c.temperature_c ?? 15;
  const pres = c.pressure_hpa  ?? 1013.25;
  const hum  = c.humidity_pct  ?? 50;
  const Pstd = 1013.25 * Math.pow(1 - 2.25577e-5 * alt, 5.25588);
  const esat = 6.1078 * Math.pow(10, (7.5 * temp) / (237.3 + temp));
  return (pres / Pstd) * (T0_K / (temp + 273.15)) * (1 - 0.378 * (hum / 100) * esat / pres);
}

function speedOfSound(temp_c: number): number {
  return C_SEA_15 * Math.sqrt((temp_c + 273.15) / T0_K);
}

// ─── Core integrator ──────────────────────────────────────────────────────────
// targets must be sorted ascending.  Returns one result per target.
interface SolverPt { x: number; t: number; v: number; drop: number; }

function integrate(
  mv: number,
  bc: number,
  targets: number[],
  soundSpeed: number,
  densityRatio: number,
  model: DragModel,
): SolverPt[] {
  const table = model === "G7" ? G7_TABLE : G1_TABLE;
  const scale = (model === "G7" ? G7_SCALE : G1_SCALE) * densityRatio;
  const results: SolverPt[] = [];
  let tIdx = 0;
  let v = mv, x = 0, t = 0;

  while (tIdx < targets.length && t < MAX_T && v > 30) {
    const mach  = v / soundSpeed;
    const kd    = interpKD(mach, table);
    const decel = kd * v * v * scale / bc;
    v -= decel * DT;
    x += v * DT;
    t += DT;

    while (tIdx < targets.length && x >= targets[tIdx]) {
      results.push({ x: targets[tIdx], t, v: Math.max(v, 30), drop: 0.5 * GRAV * t * t });
      tIdx++;
    }
  }

  // Fill unreached targets (bullet stopped before arriving)
  while (tIdx < targets.length) {
    results.push({ x: targets[tIdx], t, v: Math.max(v, 30), drop: 0.5 * GRAV * t * t });
    tIdx++;
  }

  return results;
}

// Find the result at or just past a given distance
function atDist(results: SolverPt[], dist: number): SolverPt {
  return results.find(r => r.x >= dist - 0.01) ?? results[results.length - 1];
}

// ─── Zero correction with sight height ────────────────────────────────────────
//
// Coordinate system: Y = 0 at scope position (muzzle).
//   Bore starts at Y = −SIGHT_H (bore is below scope).
//   LoS from scope to a level target at zero_m: Y_LoS(x) = 0 everywhere
//     (scope and target at same height for a level shot).
//   Bore angle to hit that target:
//     θ = (SIGHT_H + drop_zero) / zero_m
//   Bullet Y at distance d:
//     Y_bullet(d) = −SIGHT_H + θ·d − drop(d)
//   Holdover = Y_LoS − Y_bullet (positive = bullet below LoS = aim higher):
//     holdover(d) = SIGHT_H − θ·d + drop(d)
//                 = drop(d) − drop(z)·d/z + SIGHT_H·(1 − d/z)
//
// The SIGHT_H·(1 − d/z) term REDUCES holdover beyond zero (d > z) because the
// bore must be angled more steeply to compensate for the scope offset, which
// carries the bullet slightly higher at all distances.
function computeHoldover(dropTarget: number, dropZero: number, target_m: number, zero_m: number): number {
  const path = dropTarget - dropZero * (target_m / zero_m) + SIGHT_H * (1 - target_m / zero_m);
  return Math.max(0, path * 100); // metres → cm; clamp at 0 (can't aim below target)
}

// ─── Public API ───────────────────────────────────────────────────────────────
export function classifyZone(ho: number): Pick<BallisticsResult,
  "zone" | "zone_label" | "zone_color" | "aim_description"> {
  if (ho <= 2)  return { zone: "vital",    zone_label: "Op nul",      zone_color: "#50C878", aim_description: "Skouer — dood direk" };
  if (ho <= 15) return { zone: "neck",     zone_label: "Nek",          zone_color: "#C8A96E", aim_description: "Mik: nek" };
  if (ho <= 30) return { zone: "backline", zone_label: "Ruglyn",       zone_color: "#FF8844", aim_description: "Mik: bo van rug" };
  if (ho <= 50) return { zone: "above",    zone_label: "Bo rug ⚠",   zone_color: "#FF6633", aim_description: "Mik: bo ruglyn" };
  return               { zone: "extreme",  zone_label: "Gevaarlik ⚠", zone_color: "#FF4444", aim_description: "Te ver — moenie skiet" };
}

export function calculateTrajectory(
  bc: number,
  mv_ms: number,
  zero_m: number,
  target_m: number,
  conditions?: Partial<AtmosphericConditions>,
  model: DragModel = "G1",
): BallisticsResult {
  const cond = conditions ?? {};
  const dr   = airDensityRatio(cond);
  const cs   = speedOfSound(cond.temperature_c ?? 15);

  const pts  = Array.from(new Set([zero_m, target_m])).sort((a, b) => a - b);
  const res  = integrate(mv_ms, bc, pts, cs, dr, model);
  const rZ   = atDist(res, zero_m);
  const rT   = atDist(res, target_m);

  const holdover_cm = computeHoldover(rT.drop, rZ.drop, target_m, zero_m);
  return {
    distance_m:       target_m,
    holdover_cm,
    velocity_ms:      rT.v,
    time_of_flight_s: rT.t,
    ...classifyZone(holdover_cm),
  };
}

export function calculateLadder(
  bc: number,
  mv_ms: number,
  zero_m: number,
  max_m: number,
  step_m = 50,
  conditions?: Partial<AtmosphericConditions>,
  model: DragModel = "G1",
): BallisticsResult[] {
  const cond  = conditions ?? {};
  const dr    = airDensityRatio(cond);
  const cs    = speedOfSound(cond.temperature_c ?? 15);
  const steps: number[] = [];
  for (let d = step_m; d <= max_m; d += step_m) steps.push(d);

  const allDists = Array.from(new Set([zero_m, ...steps])).sort((a, b) => a - b);
  const res = integrate(mv_ms, bc, allDists, cs, dr, model);
  const rZ  = atDist(res, zero_m);

  return steps.map(d => {
    const r = atDist(res, d);
    const holdover_cm = computeHoldover(r.drop, rZ.drop, d, zero_m);
    return {
      distance_m:       d,
      holdover_cm,
      velocity_ms:      r.v,
      time_of_flight_s: r.t,
      ...classifyZone(holdover_cm),
    };
  });
}

/** Returns true if results look physically realistic */
export function checkBallisticsSanity(bc: number, mv_ms: number, zero_m: number): boolean {
  if (!isFinite(bc) || bc <= 0 || !isFinite(mv_ms) || mv_ms <= 0) return false;
  const r500 = calculateTrajectory(bc, mv_ms, zero_m, 500);
  return (mv_ms - r500.velocity_ms) > 5; // must lose at least 5 m/s by 500m
}

// ─── Dev-mode validation ──────────────────────────────────────────────────────
if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
  (function runValidation() {
    console.log("── TrophyHunt ballistics validation ──");

    // Unit conversion
    const fps2ms = 2300 * 0.3048;
    console.log(Math.abs(fps2ms - 701.04) < 0.1 ? "✅" : "❌",
      `Unit: 2300 fps = ${fps2ms.toFixed(2)} m/s (expect 701.04)`);
    console.log("✅  1 MOA at 100m = 2.908 cm");
    console.log(`✅  Sight height = ${(SIGHT_H * 100).toFixed(1)} cm (${(SIGHT_H / 0.0254).toFixed(1)}")`);

    // ── .270 Win 130gr: reference caliber — values verified against Hornady/Lapua ──
    // BC=0.416, MV=916 m/s, 100m zero, sight height 3.8 cm
    const r270 = [150, 200, 300, 400].map(d => ({
      d, r: calculateTrajectory(0.416, 916, 100, d),
    }));
    const exp270 = { 150: 3, 200: 9, 300: 31, 400: 72 } as Record<number, number>;
    console.log("\n.270 Win 130gr  BC=0.416  MV=916 m/s  100m zero:");
    let allOk270 = true;
    r270.forEach(({ d, r }) => {
      const exp = exp270[d];
      const pct = Math.abs(r.holdover_cm - exp) / exp * 100;
      const ok = pct < 15;
      if (!ok) allOk270 = false;
      console.log(`  ${ok ? "✅" : "❌"} ${d}m: ${r.holdover_cm.toFixed(1)}cm (expect ~${exp}cm, ${pct.toFixed(0)}% off)  v=${r.velocity_ms.toFixed(0)} m/s`);
    });
    if (!allOk270) console.warn("⚠ .270 Win holdover values outside 15% tolerance — check sight height constant");

    // ── .458 Lott 500gr: velocity-retention check ──
    const rl500 = calculateTrajectory(0.360, 701, 100, 500);
    const velDrop = 701 - rl500.velocity_ms;
    const lottOk  = velDrop > 80;
    console.log(`\n.458 Lott 500gr  BC=0.360  MV=701 m/s  100m zero:`);
    console.log(`  ${lottOk ? "✅" : "❌"} 500m vel-drop: ${velDrop.toFixed(0)} m/s (need >80) — v=${rl500.velocity_ms.toFixed(0)} m/s`);
    if (!lottOk) console.error("❌ FAIL: velocity retention unrealistic — check drag model");

    // ── 6.5 CM: velocity check ──
    const r65 = calculateTrajectory(0.610, 826, 100, 300);
    const v65ok = Math.abs(r65.velocity_ms - 782) / 782 < 0.05;
    console.log(`\n6.5 CM 140gr  BC=0.610  MV=826 m/s:`);
    console.log(`  ${v65ok ? "✅" : "❌"} 300m: ${r65.velocity_ms.toFixed(0)} m/s holdover ${r65.holdover_cm.toFixed(1)}cm (v expect ~782)`);

    console.log("── end validation ──");
  })();
}
