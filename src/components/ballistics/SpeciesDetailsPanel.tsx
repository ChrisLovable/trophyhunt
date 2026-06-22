"use client";

import { useEffect, useMemo, useState } from "react";
import { getSpeciesInfoById } from "@/lib/types/species-info";
import { getSpeciesById, SPECIES } from "@/lib/types/species";
import type { Lang } from "@/lib/app/use-lang";
import { B, D, M } from "@/lib/app/brand";
import { Stat } from "@/components/ballistics/ui";
import SpeciesInfoCard from "@/components/ballistics/SpeciesInfoCard";

interface Props {
  lang: Lang;
  t: Record<string, string>;
  speciesId: string;
  selectedCaliber?: string;
}

export function SpeciesDetailsPanel({ lang, t, speciesId, selectedCaliber }: Props) {
  const [infoOpen, setInfoOpen] = useState(true);
  const species = useMemo(() => getSpeciesById(speciesId) ?? SPECIES[0], [speciesId]);
  const speciesInfo = useMemo(() => getSpeciesInfoById(speciesId), [speciesId]);

  useEffect(() => { setInfoOpen(true); }, [speciesId]);

  const weightLabel = lang === "en" ? "Weight" : "Gewig";
  const shoulderLabel = lang === "en" ? "Avg. shoulder height" : "Gem. skouerhoogte";
  const maleLabel = lang === "en" ? "Male" : "Mannetjie";
  const femaleLabel = lang === "en" ? "Female" : "Wyfie";

  // Weight ranges from species-info if available, else fall back to single value
  const weightValue = speciesInfo
    ? `♂ ${maleLabel}: ${speciesInfo.live_weight_kg.min}–${speciesInfo.live_weight_kg.max}kg`
    : `${species.weight_kg} kg`;

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ padding: "12px", background: D, borderRadius: 8, border: `1px solid ${B}` }}>
        <div style={{ fontSize: "0.68rem", color: M, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, fontFamily: "Rajdhani,sans-serif", fontWeight: 700 }}>
          {t.anatomyStats}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 12px" }}>
          <Stat label={weightLabel} value={weightValue} />
          <Stat label={shoulderLabel} value={`${species.shoulder_height_cm} cm`} />
        </div>
        {species.notes && !species.vital_zone_special && (
          <p style={{ margin: "10px 0 0", fontSize: "0.75rem", color: M, lineHeight: 1.45, fontStyle: "italic" }}>{species.notes}</p>
        )}
      </div>

      {species.vital_zone_special && species.notes && (
        <div style={{ marginTop: 8, padding: "8px 12px", background: "#FF884420", borderRadius: 7, border: "1px solid #FF884440", fontSize: "0.75rem", color: "#FF8844" }}>
          ⚠ {species.notes}
        </div>
      )}

      {speciesInfo && (
        <SpeciesInfoCard
          key={speciesId}
          species={species}
          info={speciesInfo}
          lang={lang}
          open={infoOpen}
          onToggle={() => setInfoOpen(o => !o)}
          selectedCaliber={selectedCaliber}
          embedded
        />
      )}
    </div>
  );
}