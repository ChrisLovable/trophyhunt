"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  saveAimRifleId,
  RIFLES_CHANGED_EVENT,
  repairRifleStorage,
  notifyRiflesChanged,
  riflesStoreSnapshot,
  aimRifleIdStoreSnapshot,
  type SavedRifle,
} from "@/lib/rifle/storage";

// getServerSnapshot must return the same reference every call (React hydration).
const SERVER_RIFLES: SavedRifle[] = [];

function getServerRiflesSnapshot(): SavedRifle[] {
  return SERVER_RIFLES;
}

function getServerAimRifleIdSnapshot(): null {
  return null;
}

function subscribeRifles(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const refresh = () => onStoreChange();
  window.addEventListener(RIFLES_CHANGED_EVENT, refresh);
  window.addEventListener("storage", refresh);
  window.addEventListener("focus", refresh);
  window.addEventListener("pageshow", refresh);
  document.addEventListener("visibilitychange", refresh);
  return () => {
    window.removeEventListener(RIFLES_CHANGED_EVENT, refresh);
    window.removeEventListener("storage", refresh);
    window.removeEventListener("focus", refresh);
    window.removeEventListener("pageshow", refresh);
    document.removeEventListener("visibilitychange", refresh);
  };
}

export function useSavedRifles() {
  // After SSR hydration, scan localStorage and reload rifles from any legacy key.
  useEffect(() => {
    repairRifleStorage();
    notifyRiflesChanged();
  }, []);

  const savedRifles = useSyncExternalStore(subscribeRifles, riflesStoreSnapshot, getServerRiflesSnapshot);
  const aimRifleId = useSyncExternalStore(subscribeRifles, aimRifleIdStoreSnapshot, getServerAimRifleIdSnapshot);

  const selectAimRifle = useCallback((id: string) => {
    saveAimRifleId(id);
  }, []);

  const aimRifle = savedRifles.find(r => r.id === aimRifleId) ?? null;

  return { savedRifles, aimRifleId, aimRifle, selectAimRifle };
}
