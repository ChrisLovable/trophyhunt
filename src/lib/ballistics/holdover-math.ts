import { calculateTrajectory } from "@/lib/ballistics/engine";
import { MAX_HOLDOVER_M } from "@/lib/ballistics/calibration";
import type { BallisticsResult } from "@/lib/types/ballistics";
import type { Lang } from "@/lib/app/use-lang";

export const LADDER_STEP_M = 25;

/** Snap any distance to the nearest ladder rung (25 m). */
export function snapDist50(dist: number): number {
  return Math.round(dist / LADDER_STEP_M) * LADDER_STEP_M;
}

/** First ladder distance strictly beyond the rifle zero. */
export function minDistAfterZero(zeroM: number): number {
  const next = Math.floor(zeroM / LADDER_STEP_M) * LADDER_STEP_M + LADDER_STEP_M;
  return Math.min(MAX_HOLDOVER_M, Math.max(LADDER_STEP_M, next));
}

export function clampLadderDist(dist: number, zeroM: number): number {
  const snapped = snapDist50(dist);
  const minD = minDistAfterZero(zeroM);
  return Math.max(minD, Math.min(MAX_HOLDOVER_M, snapped));
}

export function ladderRowAt(ladder: BallisticsResult[], dist: number): BallisticsResult | null {
  const snapped = snapDist50(dist);
  return ladder.find(r => r.distance_m === snapped) ?? null;
}

const ZONE_TARGET: Record<Lang, Record<string, string>> = {
  en: { neck: "neck", backline: "backline", above: "spine" },
  af: { neck: "nek", backline: "ruglyn", above: "rug" },
};

export function formatFps(fps: number): string {
  return Math.round(fps).toLocaleString("en-US");
}

export function formatVelocity(vMs: number): { ms: number; fps: number } {
  const ms = Math.round(vMs);
  return { ms, fps: Math.round(vMs * 3.28084) };
}

export function calcMOA(ho: number, d: number): number {
  return d > 0 && ho > 0 ? (ho / 2.908) * (100 / d) : 0;
}

export function calcClicks(ho: number, d: number): number {
  return Math.round(calcMOA(ho, d) * 4);
}

export function summaryBigText(row: BallisticsResult, lang: Lang): string {
  const ho = Math.round(row.holdover_cm);
  if (row.zone === "vital") return lang === "en" ? "Aim on the vitals" : "Mik op die lewensone";
  if (row.zone === "extreme") return lang === "en" ? "Too far — don't shoot" : "Te ver — moenie skiet nie";
  const target = ZONE_TARGET[lang][row.zone] ?? (lang === "en" ? "shoulder" : "skouer");
  return lang === "en" ? `Aim ${ho}cm above the ${target}` : `Mik ${ho}cm bo die ${target}`;
}

export function holdoverCallout(dist: number, row: BallisticsResult, lang: Lang): string {
  const ho = Math.round(row.holdover_cm);
  const clicks = calcClicks(row.holdover_cm, dist);
  if (row.zone === "vital") {
    return lang === "en"
      ? `${dist}m — Aim on the vitals — ${clicks} clicks`
      : `${dist}m — Mik op die lewensone — ${clicks} klieke`;
  }
  if (row.zone === "extreme") {
    return lang === "en"
      ? `${dist}m — Too far — don't shoot`
      : `${dist}m — Te ver — moenie skiet nie`;
  }
  const target = ZONE_TARGET[lang][row.zone] ?? (lang === "en" ? "shoulder" : "skouer");
  return lang === "en"
    ? `${dist}m — Aim ${ho}cm above ${target} — ${clicks} clicks`
    : `${dist}m — Mik ${ho}cm bo ${target} — ${clicks} klieke`;
}

export function solveMV(bc: number, zd: number, drop: number, dist: number): number | null {
  if (bc <= 0 || drop <= 0 || dist <= zd) return null;
  let lo = 150;
  let hi = 2500;
  const aLo = calculateTrajectory(bc, lo, zd, dist).holdover_cm;
  const aHi = calculateTrajectory(bc, hi, zd, dist).holdover_cm;
  if (drop > aLo + 0.1 || drop < aHi - 0.1) return null;
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2;
    calculateTrajectory(bc, m, zd, dist).holdover_cm > drop ? (lo = m) : (hi = m);
  }
  return Math.round((lo + hi) / 2);
}

export const BARREL_OFFSETS: Record<string, number> = { "20": -100, "22": -50, "24": 0, "26": 50 };
