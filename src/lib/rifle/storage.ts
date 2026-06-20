export type AmmoType = "factory" | "reload";
export type BulletTip = "lead" | "polymer" | "hollow" | "solid";

export interface SavedRifle {
  id: string;
  name: string;
  caliber: string;
  ammoType?: AmmoType;
  bulletPresetId: string;
  bulletName: string;
  bc: number;
  mv: number;
  zeroDist: number;
  savedAt: string;
  tipType?: BulletTip;
  grains?: number;
  maker?: string;
}

export function rifleAmmoType(r: SavedRifle): AmmoType {
  if (r.ammoType) return r.ammoType;
  return r.bulletPresetId ? "factory" : "reload";
}

export const LS_RIFLES = "trophyhunt_rifles_v3";
export const LS_AIM_RIFLE = "trophyhunt_aim_rifle_v1";
export const RIFLES_CHANGED_EVENT = "trophyhunt-rifles-changed";

const LEGACY_RIFLE_KEYS = [
  "trophyhunt_rifles_v2",
  "trophyhunt_rifles_v1",
  "trophyhunt_rifles",
];

function normalizeRifle(raw: SavedRifle): SavedRifle {
  return {
    ...raw,
    bc: Number(raw.bc) || 0,
    mv: Number(raw.mv) || 0,
    zeroDist: Number(raw.zeroDist) || 100,
    grains: raw.grains ? Number(raw.grains) : undefined,
  };
}

function isRifleLike(obj: unknown): obj is SavedRifle {
  if (!obj || typeof obj !== "object") return false;
  const r = obj as Record<string, unknown>;
  return typeof r.id === "string"
    && typeof r.name === "string"
    && typeof r.caliber === "string"
    && (typeof r.bc === "number" || typeof r.bc === "string")
    && (typeof r.mv === "number" || typeof r.mv === "string");
}

function parseRifleList(raw: string | null): SavedRifle[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRifleLike).map(normalizeRifle);
  } catch {
    return [];
  }
}

function mergeRifleLists(...lists: SavedRifle[][]): SavedRifle[] {
  const byId = new Map<string, SavedRifle>();
  for (const list of lists) {
    for (const r of list) {
      const prev = byId.get(r.id);
      if (!prev || (r.savedAt && (!prev.savedAt || r.savedAt > prev.savedAt))) {
        byId.set(r.id, r);
      }
    }
  }
  return Array.from(byId.values()).sort(
    (a, b) => (b.savedAt || "").localeCompare(a.savedAt || ""),
  );
}

function allRifleStorageKeys(): string[] {
  if (typeof window === "undefined") return [LS_RIFLES, ...LEGACY_RIFLE_KEYS];
  const keys = new Set<string>([LS_RIFLES, ...LEGACY_RIFLE_KEYS]);
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && /trophyhunt.*rifle|rifle.*trophyhunt/i.test(key)) {
        keys.add(key);
      }
    }
  } catch { /* ignore */ }
  return Array.from(keys);
}

/** Bust the in-memory snapshot cache (useSyncExternalStore). */
export function invalidateRifleStoreCache() {
  riflesSnapshotKey = "__stale__";
  aimRifleSnapshotKey = "__stale__";
}

export function notifyRiflesChanged() {
  invalidateRifleStoreCache();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(RIFLES_CHANGED_EVENT));
  }
}

/** Full scan + merge — call once on app load, not every render. */
export function repairRifleStorage(): SavedRifle[] {
  if (typeof window === "undefined") return EMPTY_RIFLES;

  const lists: SavedRifle[][] = [];
  for (const key of allRifleStorageKeys()) {
    try {
      const list = parseRifleList(localStorage.getItem(key));
      if (list.length > 0) lists.push(list);
    } catch { /* ignore */ }
  }

  const merged = mergeRifleLists(...lists);
  if (merged.length > 0) {
    try {
      localStorage.setItem(LS_RIFLES, JSON.stringify(merged));
    } catch { /* ignore */ }
  }

  invalidateRifleStoreCache();
  return merged;
}

function readRiflesFromStorage(): SavedRifle[] {
  if (typeof window === "undefined") return EMPTY_RIFLES;
  try {
    const fromV3 = parseRifleList(localStorage.getItem(LS_RIFLES));
    if (fromV3.length > 0) return fromV3;

    for (const key of LEGACY_RIFLE_KEYS) {
      const legacy = parseRifleList(localStorage.getItem(key));
      if (legacy.length > 0) {
        localStorage.setItem(LS_RIFLES, JSON.stringify(legacy));
        return legacy;
      }
    }
  } catch { /* ignore */ }
  return EMPTY_RIFLES;
}

export function loadSavedRifles(): SavedRifle[] {
  return readRiflesFromStorage();
}

// Referentially-stable snapshots for useSyncExternalStore.
const EMPTY_RIFLES: SavedRifle[] = [];
let riflesSnapshotCache: SavedRifle[] = EMPTY_RIFLES;
let riflesSnapshotKey = "__init__";
let aimRifleSnapshotCache: string | null = null;
let aimRifleSnapshotKey = "__init__";

export function riflesStoreSnapshot(): SavedRifle[] {
  const rifles = readRiflesFromStorage();
  const key = JSON.stringify(rifles);
  if (key !== riflesSnapshotKey) {
    riflesSnapshotKey = key;
    riflesSnapshotCache = rifles.length > 0 ? rifles : EMPTY_RIFLES;
    aimRifleSnapshotKey = "__stale__";
  }
  return riflesSnapshotCache;
}

export function aimRifleIdStoreSnapshot(): string | null {
  const rifles = riflesStoreSnapshot();
  const riflesKey = riflesSnapshotKey;
  const stored = loadAimRifleId();
  const resolved = stored && rifles.some(r => r.id === stored)
    ? stored
    : rifles[0]?.id ?? null;
  const key = `${riflesKey}|${resolved ?? ""}`;
  if (key !== aimRifleSnapshotKey) {
    aimRifleSnapshotKey = key;
    aimRifleSnapshotCache = resolved;
  }
  return aimRifleSnapshotCache;
}

export function saveSavedRifles(rifles: SavedRifle[]) {
  try {
    localStorage.setItem(LS_RIFLES, JSON.stringify(rifles));
    notifyRiflesChanged();
  } catch { /* ignore */ }
}

export function loadAimRifleId(): string | null {
  try {
    return localStorage.getItem(LS_AIM_RIFLE);
  } catch {
    return null;
  }
}

export function saveAimRifleId(id: string | null) {
  try {
    const prev = loadAimRifleId();
    if (prev === id) return;
    if (id) localStorage.setItem(LS_AIM_RIFLE, id);
    else localStorage.removeItem(LS_AIM_RIFLE);
    notifyRiflesChanged();
  } catch { /* ignore */ }
}

export function deleteRifle(id: string) {
  const updated = loadSavedRifles().filter(r => r.id !== id);
  saveSavedRifles(updated);
  if (loadAimRifleId() === id) saveAimRifleId(updated[0]?.id ?? null);
}
