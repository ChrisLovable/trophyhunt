"use client";

import type { BallisticsResult } from "@/lib/types/ballistics";
import { D, G, M, P, B } from "@/lib/app/brand";
import { SL } from "@/components/ballistics/ui";
import { calcMOA, calcClicks, formatVelocity } from "@/lib/ballistics/holdover-math";

const LADDER_COLS = "minmax(34px,0.5fr) minmax(0,1fr) minmax(0,0.72fr) minmax(0,0.58fr) minmax(0,0.5fr) minmax(0,0.95fr)";
const cellNum: React.CSSProperties = { fontFamily: "Rajdhani,sans-serif", fontWeight: 700, lineHeight: 1.15, minWidth: 0 };
const cellMuted: React.CSSProperties = { ...cellNum, fontWeight: 600, fontSize: "0.72rem", color: M };

export interface HoldoverTableLabels {
  holdoverTable: string;
  distance: string;
  holdoverCm: string;
  holdoverIn: string;
  moa: string;
  clicks: string;
  velocity: string;
}

interface Props {
  ladder: BallisticsResult[];
  labels: HoldoverTableLabels;
  highlightDist?: number;
  onSelectDistance?: (d: number) => void;
  compact?: boolean;
}

export function HoldoverLadderTable({ ladder, labels, highlightDist, onSelectDistance, compact }: Props) {
  if (!ladder.length) return null;

  return (
    <div style={{ marginTop: compact ? 8 : 12 }}>
      {!compact && <SL label={labels.holdoverTable} />}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", margin: "0 -2px" }}>
        <div style={{ minWidth: 0, width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: LADDER_COLS, columnGap: 4, padding: "4px 2px", borderBottom: `1px solid ${B}` }}>
            {[labels.distance, labels.holdoverCm, labels.holdoverIn, labels.moa, labels.clicks, labels.velocity].map(h => (
              <div key={h} style={{ fontSize: "0.58rem", color: M, letterSpacing: "0.03em", textTransform: "uppercase", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h}</div>
            ))}
          </div>
          {ladder.map((row, i) => {
            const sel = row.distance_m === highlightDist;
            const moa = calcMOA(row.holdover_cm, row.distance_m);
            const clicks = calcClicks(row.holdover_cm, row.distance_m);
            const vel = formatVelocity(row.velocity_ms);
            const ho = row.holdover_cm < 0.5 ? null : Math.round(row.holdover_cm);
            const hoSz = ho !== null && ho >= 1000 ? "0.72rem" : ho !== null && ho >= 100 ? "0.8rem" : "0.88rem";
            const rowStyle: React.CSSProperties = {
              display: "grid", gridTemplateColumns: LADDER_COLS, columnGap: 4, alignItems: "center",
              width: "100%", padding: "8px 2px", minHeight: 44,
              background: sel ? G + "18" : i % 2 === 0 ? P : D,
              border: "none", borderLeft: `3px solid ${row.zone_color}`, borderBottom: `1px solid ${B}`,
              textAlign: "left",
            };
            const cells = (
              <>
                <span style={{ ...cellNum, fontSize: "0.82rem", color: sel ? G : "#E8E2D4" }}>{row.distance_m}</span>
                <span style={{ ...cellNum, fontSize: hoSz, color: row.zone_color }}>{ho ?? "–"}</span>
                <span style={cellMuted}>{ho === null ? "–" : (row.holdover_cm / 2.54).toFixed(0)}</span>
                <span style={cellMuted}>{moa < 0.05 ? "–" : moa.toFixed(1)}</span>
                <span style={{ ...cellNum, fontSize: "0.82rem", color: clicks > 0 ? G : M }}>{clicks > 0 ? clicks : "–"}</span>
                <div style={{ minWidth: 0, lineHeight: 1.15 }}>
                  <div style={{ ...cellNum, fontSize: "0.72rem", color: M }}>{vel.ms}</div>
                  <div style={{ fontSize: "0.55rem", color: M, opacity: 0.8, fontFamily: "Rajdhani,sans-serif" }}>{vel.fps}</div>
                </div>
              </>
            );
            if (onSelectDistance) {
              return (
                <button key={row.distance_m} type="button" onClick={() => onSelectDistance(row.distance_m)} style={{ ...rowStyle, cursor: "pointer" }}>
                  {cells}
                </button>
              );
            }
            return <div key={row.distance_m} style={rowStyle}>{cells}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
