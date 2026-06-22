"use client";

import { useState, useEffect, useMemo } from "react";
import { SPECIES, getSpeciesById } from "@/lib/types/species";
import { calculateLadder } from "@/lib/ballistics/engine";
import { supabase } from "@/lib/supabase";
import type { Species } from "@/lib/types/species";
import { MAX_HOLDOVER_M, speciesCal, loadStoredCal, hasStoredCal, mergeCal, type CalData } from "@/lib/ballistics/calibration";
import { clampLadderDist, LADDER_STEP_M, minDistAfterZero, snapDist50 } from "@/lib/ballistics/holdover-math";
import { loadAimRifleId, saveAimRifleId } from "@/lib/rifle/storage";
import type { BallisticsResult } from "@/lib/types/ballistics";
import { useSavedRifles } from "@/hooks/use-saved-rifles";

const LS_SPECIES = "trophyhunt_species_v1";
const LS_AIM_DIST = "trophyhunt_aim_dist_v1";

export function useAimSession(altitude_m = 1500) {
  const { savedRifles, aimRifleId, aimRifle, selectAimRifle } = useSavedRifles();

  const [speciesId, setSpeciesIdState] = useState("kudu");
  const species = useMemo(
    () => getSpeciesById(speciesId) ?? SPECIES[0],
    [speciesId],
  );
  const [calData, setCalData] = useState<CalData>(() => speciesCal(getSpeciesById("kudu") ?? SPECIES[0]));
  const [sliderDist, setSliderDist] = useState(200);

  useEffect(() => {
    try {
      const spId = localStorage.getItem(LS_SPECIES);
      if (spId && getSpeciesById(spId)) setSpeciesIdState(spId);
      const d = localStorage.getItem(LS_AIM_DIST);
      if (d) setSliderDist(snapDist50(Number(d)));
    } catch { /* ignore */ }
  }, []);

  // Persist default aim rifle when rifles exist but none selected
  useEffect(() => {
    if (savedRifles.length > 0 && !aimRifleId) {
      saveAimRifleId(savedRifles[0].id);
    }
  }, [savedRifles, aimRifleId]);

  useEffect(() => {
    const sp = getSpeciesById(speciesId) ?? SPECIES[0];
    const base = speciesCal(sp);
    const next = loadStoredCal(speciesId, base);
    setCalData(prev => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));

    if (hasStoredCal(speciesId) || !supabase) return;

    let cancelled = false;
    supabase.from("animal_calibrations")
      .select("ground_y,shoulder_y,spine_y,vital_x,vital_y,vital_radius_pct,shoulder_height_cm")
      .eq("species_id", speciesId).maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        setCalData(prev => {
          const merged = mergeCal(prev, data);
          return JSON.stringify(prev) === JSON.stringify(merged) ? prev : merged;
        });
      });
    return () => { cancelled = true; };
  }, [speciesId]);

  const aimBc = aimRifle?.bc ?? 0;
  const aimMv = aimRifle?.mv ?? 0;
  const aimZero = aimRifle?.zeroDist ?? 100;
  const isAimReady = aimRifle !== null && aimBc > 0.05 && aimMv > 100;
  const highlightDist = clampLadderDist(sliderDist, aimZero);

  const ladder = useMemo<BallisticsResult[]>(() => {
    if (!isAimReady) return [];
    return calculateLadder(aimBc, aimMv, aimZero, MAX_HOLDOVER_M, LADDER_STEP_M, { altitude_m });
  }, [aimBc, aimMv, aimZero, isAimReady, altitude_m]);

  useEffect(() => {
    setSliderDist(d => {
      const clamped = clampLadderDist(d, aimZero);
      return clamped === d ? d : clamped;
    });
  }, [aimZero]);

  function setSpecies(sp: Species) {
    setSpeciesIdState(sp.id);
    try { localStorage.setItem(LS_SPECIES, sp.id); } catch { /* ignore */ }
  }

  function setSpeciesId(id: string) {
    if (!getSpeciesById(id)) return;
    setSpeciesIdState(id);
    try { localStorage.setItem(LS_SPECIES, id); } catch { /* ignore */ }
  }

  function setHighlightDist(v: number) {
    const clamped = clampLadderDist(v, aimZero);
    setSliderDist(clamped);
    try { localStorage.setItem(LS_AIM_DIST, String(clamped)); } catch { /* ignore */ }
    return clamped;
  }

  const minDist = minDistAfterZero(aimZero);

  return {
    savedRifles, aimRifleId, species, calData, setCalData,
    aimRifle, aimBc, aimMv, aimZero, isAimReady,
    sliderDist, highlightDist, minDist, ladder,
    speciesId, selectAimRifle, setSpecies, setSpeciesId, setHighlightDist,
  };
}
