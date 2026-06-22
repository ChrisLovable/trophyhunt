"use client";

import Link from "next/link";
import { useMemo } from "react";
import { SPECIES } from "@/lib/types/species";
import type { SavedRifle } from "@/lib/rifle/storage";
import type { Species } from "@/lib/types/species";
import type { Lang } from "@/lib/app/use-lang";
import { D, G, M } from "@/lib/app/brand";
import { Field, selectSt } from "@/components/ballistics/ui";

interface Props {
  lang: Lang;
  t: Record<string, string>;
  savedRifles: SavedRifle[];
  aimRifleId: string | null;
  aimRifle: SavedRifle | null;
  onSelectRifle: (id: string) => void;
  onDeleteRifle?: (id: string) => void;
  speciesId: string;
  onSelectSpeciesId: (id: string) => void;
}

export function BallisticsPickers({
  lang, t, savedRifles, aimRifleId, aimRifle,
  onSelectRifle, speciesId, onSelectSpeciesId,
}: Props) {
  const speciesSorted = useMemo(
    () => [...SPECIES].sort((a, b) => a.name_en.localeCompare(b.name_en)),
    [],
  );

  function speciesLabel(sp: Species) {
    const primary   = lang === "en" ? sp.name_en : sp.name_af;
    const secondary = lang === "en" ? sp.name_af : sp.name_en;
    const warn = sp.vital_zone_special ? " ⚠" : "";
    return `${primary} — ${secondary}${warn}`;
  }

  function rifleLabel(r: SavedRifle) {
    return `${r.name} — ${r.caliber}`;
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>

      {/* Rifle selector */}
      <div style={{ flex: 1 }}>
        <Field label={t.selectRifle}>
          {savedRifles.length === 0 ? (
            <Link
              href="/rifle"
              style={{ fontSize: "0.8rem", color: G, fontFamily: "Rajdhani,sans-serif", fontWeight: 700, textDecoration: "none" }}
            >
              {t.goToRifle} →
            </Link>
          ) : (
            <>
              <select
                value={aimRifleId ?? ""}
                onChange={e => onSelectRifle(e.target.value)}
                style={selectSt}
              >
                {!aimRifleId && (
                  <option value="" disabled>
                    {lang === "en" ? "Select rifle…" : "Kies geweer…"}
                  </option>
                )}
                {savedRifles.map(r => (
                  <option key={r.id} value={r.id}>{rifleLabel(r)}</option>
                ))}
              </select>

            </>
          )}
        </Field>
      </div>

      {/* Species selector */}
      <div style={{ flex: 1 }}>
        <Field label={t.species}>
          <select
            value={speciesId}
            onChange={e => onSelectSpeciesId(e.target.value)}
            style={selectSt}
          >
            {speciesSorted.map(sp => (
              <option key={sp.id} value={sp.id}>{speciesLabel(sp)}</option>
            ))}
          </select>
        </Field>
      </div>

    </div>
  );
}