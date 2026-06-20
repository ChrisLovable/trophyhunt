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

function hornLabel(lang: Lang, t: Record<string, string>, horn: "spiral" | "straight" | "curved" | "none") {
  return { spiral: t.hornSpiral, straight: t.hornStraight, curved: t.hornCurved, none: t.hornNone }[horn];
}

export function SpeciesDetailsPanel({ lang, t, speciesId, selectedCaliber }: Props) {
  const [infoOpen, setInfoOpen] = useState(true);
  const species = useMemo(
    () => getSpeciesById(speciesId) ?? SPECIES[0],
    [speciesId],
  );
  const speciesInfo = useMemo(() => getSpeciesInfoById(speciesId), [speciesId]);

  useEffect(() => { setInfoOpen(true); }, [speciesId]);

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ padding: "12px", background: D, borderRadius: 8, border: `1px solid ${B}` }}>
        <div style={{ fontSize: "0.68rem", color: M, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, fontFamily: "Rajdhani,sans-serif", fontWeight: 700 }}>
          {t.anatomyStats}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 12px" }}>
          <Stat label={t.statWeight} value={`${species.weight_kg} kg`} />
          <Stat label={t.statShoulder} value={`${species.shoulder_height_cm} cm`} />
          <Stat label={t.statBodyLength} value={`${species.body_length_cm} cm`} />
          <Stat label={t.statVitalHeight} value={`${species.vital_zone_height_cm} cm`} />
          <Stat label={t.statVitalRadius} value={`${species.vital_zone_radius_cm} cm`} />
          <Stat label={t.statHorn} value={hornLabel(lang, t, species.horn_measure)} />
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
