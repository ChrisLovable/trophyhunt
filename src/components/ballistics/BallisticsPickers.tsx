"use client";

import Link from "next/link";
import { useMemo } from "react";
import { SPECIES } from "@/lib/types/species";
import type { SavedRifle } from "@/lib/rifle/storage";
import type { Species } from "@/lib/types/species";
import type { Lang } from "@/lib/app/use-lang";
import { C, D, G, M } from "@/lib/app/brand";
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
  onSelectRifle, onDeleteRifle, speciesId, onSelectSpeciesId,
}: Props) {
  const speciesByWeight = useMemo(
    () => [...SPECIES].sort((a, b) => a.weight_kg - b.weight_kg || a.name_en.localeCompare(b.name_en)),
    [],
  );

  function speciesLabel(sp: Species) {
    const primary   = lang === "en" ? sp.name_en : sp.name_af;
    const secondary = lang === "en" ? sp.name_af : sp.name_en;
    const warn = sp.vital_zone_special ? " ⚠" : "";
    return `${primary} · ${sp.weight_kg} kg — ${secondary}${warn}`;
  }

  function rifleLabel(r: SavedRifle) {
    return `${r.name} — ${r.caliber}`;
  }

  return (
    <>
      {/* Rifle selector */}
      <Field label={t.selectRifle}>
        {savedRifles.length === 0 ? (
          <div>
            <p style={{ fontSize: "0.8rem", color: M, margin: "0 0 10px", lineHeight: 1.5, fontStyle: "italic" }}>
              {t.saveRifleFirst}
            </p>
            <Link
              href="/rifle"
              style={{ fontSize: "0.8rem", color: G, fontFamily: "Rajdhani,sans-serif", fontWeight: 700, textDecoration: "none" }}
            >
              {t.goToRifle} →
            </Link>
          </div>
        ) : (
          <>
            {/* Dropdown */}
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

            {/* Selected rifle detail line */}
            {aimRifle && (
              <div style={{
                marginTop: 6, padding: "6px 10px", background: D, borderRadius: 7,
                border: `1px solid ${G}40`, fontSize: "0.72rem", color: C, lineHeight: 1.45,
                display: "flex", flexWrap: "wrap", gap: "0 10px",
              }}>
                <span>BC {aimRifle.bc.toFixed(3)}</span>
                <span style={{ color: M }}>·</span>
                <span>{Math.round(aimRifle.mv * 3.28084)} fps</span>
                <span style={{ color: M }}>·</span>
                <span>{aimRifle.zeroDist}m {lang === "en" ? "zero" : "nul"}</span>
              </div>
            )}

            <div style={{ marginTop: 6 }}>
              <Link
                href="/rifle"
                style={{
                  fontSize: "0.72rem",
                  color: "#5A6040",
                  fontFamily: "Rajdhani,sans-serif",
                  textDecoration: "none",
                  letterSpacing: "0.06em",
                }}
              >
                {lang === "en" ? "→ Manage rifles" : "→ Bestuur gewere"}
              </Link>
            </div>
          </>
        )}
      </Field>

      {/* Species selector */}
      <Field label={t.species}>
        <select
          value={speciesId}
          onChange={e => onSelectSpeciesId(e.target.value)}
          style={selectSt}
        >
          {speciesByWeight.map(sp => (
            <option key={sp.id} value={sp.id}>{speciesLabel(sp)}</option>
          ))}
        </select>
      </Field>
    </>
  );
}
