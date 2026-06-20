"use client";

import type { SavedRifle } from "@/lib/rifle/storage";
import { rifleAmmoType } from "@/lib/rifle/storage";
import { G, M, B, P, C } from "@/lib/app/brand";

interface Props {
  rifles: SavedRifle[];
  selectedId: string | null;
  addingNew: boolean;
  addLabel: string;
  factoryLabel: string;
  reloadLabel: string;
  onSelect: (id: string) => void;
  onAddNew?: () => void;
  showAdd?: boolean;
}

const btnBase: React.CSSProperties = {
  padding: "10px 12px",
  minHeight: 48,
  borderRadius: 10,
  border: `1px solid ${B}`,
  background: P,
  color: C,
  fontFamily: "Rajdhani,sans-serif",
  fontSize: "0.82rem",
  fontWeight: 600,
  lineHeight: 1.25,
  cursor: "pointer",
  textAlign: "left",
  flex: "1 1 calc(50% - 4px)",
  minWidth: 0,
};

export function RifleGunBar({
  rifles, selectedId, addingNew, addLabel, factoryLabel, reloadLabel,
  onSelect, onAddNew, showAdd = true,
}: Props) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {rifles.map(r => {
        const active = !addingNew && r.id === selectedId;
        const ammo = rifleAmmoType(r);
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelect(r.id)}
            style={{
              ...btnBase,
              borderColor: active ? G : B,
              background: active ? G + "22" : P,
              boxShadow: active ? `inset 0 0 0 1px ${G}55` : "none",
            }}
          >
            <div style={{ color: active ? G : C, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.name}
            </div>
            <div style={{ fontSize: "0.68rem", color: M, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.caliber} · {ammo === "factory" ? factoryLabel : reloadLabel}
            </div>
          </button>
        );
      })}
      {showAdd && onAddNew && (
      <button
        type="button"
        onClick={onAddNew}
        style={{
          ...btnBase,
          flex: "1 1 100%",
          borderStyle: "dashed",
          borderColor: addingNew ? G : B,
          background: addingNew ? G + "18" : "transparent",
          color: G,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {addLabel}
      </button>
      )}
    </div>
  );
}
