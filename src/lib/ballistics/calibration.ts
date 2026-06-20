import type { Species } from "@/lib/types/species";

export const MAX_HOLDOVER_M = 1000;
export const LS_CAL = "trophyhunt_calibrations_v1";

/** Fraction from top of image (0–1) — hoof line can sit near the bottom edge. */
export const LINE_Y_MIN = 0.02;
export const LINE_Y_MAX = 0.99;
export const LINE_Y_GAP = 0.02;

export function clampShoulderY(y: number, groundY: number) {
  return Math.max(LINE_Y_MIN, Math.min(y, groundY - LINE_Y_GAP));
}

export function clampGroundY(y: number, shoulderY: number) {
  return Math.max(shoulderY + LINE_Y_GAP, Math.min(y, LINE_Y_MAX));
}

export function clampLineY(y: number) {
  return Math.max(LINE_Y_MIN, Math.min(y, LINE_Y_MAX));
}

export interface CalData {
  ground_y: number;
  shoulder_y: number;
  spine_y: number;
  vital_x: number;
  vital_y: number;
  vital_radius_pct: number;
  shoulder_height_cm: number;
}

export function speciesCal(sp: Species): CalData {
  return {
    ground_y: sp.ground_y,
    shoulder_y: sp.shoulder_y,
    spine_y: sp.spine_y,
    vital_x: sp.vital_x,
    vital_y: sp.vital_y,
    vital_radius_pct: sp.vital_radius_pct,
    shoulder_height_cm: sp.shoulder_height_cm,
  };
}

export function isValidLineCal(shoulderY: number, groundY: number) {
  return (
    shoulderY >= LINE_Y_MIN
    && groundY <= LINE_Y_MAX
    && groundY > shoulderY + LINE_Y_GAP
  );
}

export function mergeCal(base: CalData, stored: Partial<CalData>): CalData {
  const shoulder_y = stored.shoulder_y ?? base.shoulder_y;
  const ground_y = stored.ground_y ?? base.ground_y;
  if (!isValidLineCal(shoulder_y, ground_y)) return base;
  return {
    ground_y,
    shoulder_y,
    spine_y: stored.spine_y ?? base.spine_y,
    vital_x: stored.vital_x ?? base.vital_x,
    vital_y: stored.vital_y ?? base.vital_y,
    vital_radius_pct: stored.vital_radius_pct ?? base.vital_radius_pct,
    shoulder_height_cm: stored.shoulder_height_cm ?? base.shoulder_height_cm,
  };
}

export function saveStoredCal(speciesId: string, data: Partial<CalData>): void {
  try {
    const raw = localStorage.getItem(LS_CAL);
    const map: Record<string, Partial<CalData>> = raw ? JSON.parse(raw) as Record<string, Partial<CalData>> : {};
    map[speciesId] = { ...map[speciesId], ...data };
    localStorage.setItem(LS_CAL, JSON.stringify(map));
    console.log("Saved calibration for", speciesId, map[speciesId]);
  } catch (e) {
    console.error("Failed to save calibration:", e);
  }
}

export function loadStoredCal(speciesId: string, base: CalData): CalData {
  try {
    const raw = localStorage.getItem(LS_CAL);
    if (!raw) return base;
    const map = JSON.parse(raw) as Record<string, Partial<CalData>>;
    const stored = map[speciesId];
    if (!stored) return base;
    return mergeCal(base, stored);
  } catch {
    return base;
  }
}

export function hasStoredCal(speciesId: string): boolean {
  try {
    const raw = localStorage.getItem(LS_CAL);
    if (!raw) return false;
    const map = JSON.parse(raw) as Record<string, Partial<CalData>>;
    const stored = map[speciesId];
    if (!stored?.shoulder_y || !stored?.ground_y) return false;
    return isValidLineCal(stored.shoulder_y, stored.ground_y);
  } catch {
    return false;
  }
}
