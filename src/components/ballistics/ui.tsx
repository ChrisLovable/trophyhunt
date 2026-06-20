"use client";

import { B, D, G, M, P, C } from "@/lib/app/brand";

export function SliderStyles() {
  return (
    <style>{`
      /* ── 3D action buttons ─────────────────────────────────────────────── */
      .th-btn3d {
        flex: 1;
        min-height: 44px;
        padding: 0 12px;
        border-radius: 4px;
        font-family: Rajdhani, sans-serif;
        font-size: 0.9rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        user-select: none;
        border: 1px solid #8a6020;
        background: linear-gradient(180deg, #D4A843 0%, #A07830 100%);
        color: #0D0F0A;
        box-shadow: 0 3px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.18);
        transition: transform 0.06s ease, box-shadow 0.06s ease;
      }
      .th-btn3d:active:not([disabled]):not(:disabled) {
        transform: translateY(1px);
        box-shadow: 0 1px 3px rgba(0,0,0,0.4), inset 0 2px 4px rgba(0,0,0,0.2);
      }
      .th-btn3d[disabled], .th-btn3d:disabled {
        opacity: 0.40;
        cursor: not-allowed;
      }
      /* Delete — dark red */
      .th-btn3d-delete {
        background: linear-gradient(180deg, #C02424 0%, #8B1A1A 100%);
        border-color: #6B0A0A;
        color: #fff;
      }
      /* Add — dark green */
      .th-btn3d-add {
        background: linear-gradient(180deg, #2A962A 0%, #1A5C1A 100%);
        border-color: #0A4A0A;
        color: #fff;
      }
      /* select focus gold border */
      select:focus { outline: none; border-color: ${G} !important; }

      /* ── Range slider ──────────────────────────────────────────────────── */
      .th-slider{
        -webkit-appearance:none;appearance:none;width:100%;height:8px;
        border-radius:4px;outline:none;cursor:pointer;display:block;
        background:linear-gradient(to right,${G} var(--pct,0%),${B} var(--pct,0%));
      }
      .th-slider::-webkit-slider-thumb{
        -webkit-appearance:none;width:44px;height:44px;border-radius:50%;
        background:${G};cursor:pointer;border:3px solid ${D};
        box-shadow:0 2px 14px rgba(0,0,0,0.7),0 0 0 3px rgba(200,169,110,0.28);
        margin-top:-18px;
      }
      .th-slider::-moz-range-thumb{
        width:44px;height:44px;border-radius:50%;background:${G};
        cursor:pointer;border:3px solid ${D};
        box-shadow:0 2px 14px rgba(0,0,0,0.7),0 0 0 3px rgba(200,169,110,0.28);
      }
      .th-slider::-webkit-slider-runnable-track{height:8px;border-radius:4px;}
      .th-slider::-moz-range-track{height:8px;border-radius:4px;background:${B};}
      .th-slider-giant{height:10px;}
      .th-slider-giant::-webkit-slider-runnable-track{height:10px;border-radius:5px;}
      .th-slider-giant::-moz-range-track{height:10px;border-radius:5px;}
      .th-slider-giant::-webkit-slider-thumb{
        width:44px;height:44px;margin-top:-17px;
        box-shadow:0 3px 18px rgba(0,0,0,0.75),0 0 0 4px rgba(200,169,110,0.35);
      }
      .th-slider-giant::-moz-range-thumb{
        width:44px;height:44px;
        box-shadow:0 3px 18px rgba(0,0,0,0.75),0 0 0 4px rgba(200,169,110,0.35);
      }
      .th-slider-pulse::-webkit-slider-thumb{
        box-shadow:0 0 0 6px rgba(200,169,110,0.55),0 3px 18px rgba(0,0,0,0.75);
      }
      .th-slider-pulse::-moz-range-thumb{
        box-shadow:0 0 0 6px rgba(200,169,110,0.55),0 3px 18px rgba(0,0,0,0.75);
      }
      @keyframes sum-glow{
        0%,100%{box-shadow:0 4px 20px rgba(200,169,110,0.15);}
        50%    {box-shadow:0 4px 36px rgba(200,169,110,0.50);}
      }
      .sum-pulse{animation:sum-glow 2.4s ease-in-out infinite;}
      .sp-scroll::-webkit-scrollbar{display:none;}
    `}</style>
  );
}

export function PageHeader({ title, lang, onToggleLang }: { title: string; lang: "en" | "af"; onToggleLang: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px 10px", borderBottom: `1px solid ${B}` }}>
      <h1 style={{ fontFamily: "Rajdhani,sans-serif", color: G, fontSize: "1.3rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0, lineHeight: 1.2 }}>
        {title}
      </h1>
      <button
        onClick={onToggleLang}
        style={{ padding: "0 14px", minHeight: 44, borderRadius: 20, border: `1px solid ${B}`, background: P, color: G, fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.1em", cursor: "pointer" }}
      >
        {lang === "en" ? "AF" : "EN"}
      </button>
    </div>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ margin: "12px 16px 0", background: P, border: `1px solid ${B}`, borderRadius: 12, overflow: "hidden" }}>
      {children}
    </section>
  );
}

export function SL({ label }: { label: string }) {
  return (
    <div style={{ fontSize: "1rem", fontFamily: "Rajdhani,sans-serif", fontWeight: 700, color: C, letterSpacing: "0.04em", marginBottom: 12, borderLeft: `3px solid ${G}`, paddingLeft: 8 }}>
      {label}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: "0.7rem", color: M, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

export function Tabs({ options, active, onSelect }: { options: string[]; active: number; onSelect: (i: number) => void }) {
  return (
    <div style={{ display: "flex", background: D, borderRadius: 8, padding: 3, border: `1px solid ${B}`, gap: 3 }}>
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          style={{ flex: 1, padding: "8px", minHeight: 40, borderRadius: 6, border: "none", background: active === i ? P : "transparent", color: active === i ? G : M, fontFamily: "Rajdhani,sans-serif", fontSize: "0.78rem", fontWeight: active === i ? 700 : 400, cursor: "pointer", lineHeight: 1.3, textAlign: "center" }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function Tog({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{ flex: 1, padding: "0 8px", minHeight: 44, borderRadius: 8, border: `1px solid ${active ? G : B}`, background: active ? G + "22" : P, color: active ? G : M, fontFamily: "Rajdhani,sans-serif", fontSize: "0.95rem", fontWeight: active ? 700 : 400, cursor: "pointer" }}
    >
      {children}
    </button>
  );
}

export function Btn({ onClick, children, disabled, gold }: { onClick: () => void; children: React.ReactNode; disabled?: boolean; gold?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ width: "100%", padding: "0 16px", minHeight: 48, borderRadius: 8, border: `1px solid ${disabled ? B : gold ? G : B}`, background: disabled ? P : gold ? G + "1a" : P, color: disabled ? M : gold ? G : C, fontFamily: "Rajdhani,sans-serif", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.06em", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
    >
      {children}
    </button>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: "0.62rem", color: M, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "0.85rem", color: C, fontWeight: 600, marginTop: 1 }}>{value}</div>
    </div>
  );
}

export function Dot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: "0.7rem", color: M }}>{label}</span>
    </div>
  );
}

function sliderPct(value: number, min: number, max: number): string {
  return `${((value - min) / (max - min)) * 100}%`;
}

export function DistSlider({
  min, max, step, value, onChange, ticks, giant, pulse, showValue = true,
}: {
  min: number; max: number; step: number; value: number;
  onChange: (v: number) => void; ticks: number[];
  giant?: boolean; pulse?: boolean; showValue?: boolean;
}) {
  const pct = sliderPct(value, min, max);
  const cls = ["th-slider", giant ? "th-slider-giant" : "", pulse ? "th-slider-pulse" : ""].filter(Boolean).join(" ");
  return (
    <div>
      {showValue && (
        <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: giant ? "clamp(2rem,8vw,3rem)" : "clamp(1.6rem,6vw,2.2rem)", fontWeight: 700, color: G, textAlign: "center", lineHeight: 1, marginBottom: giant ? 14 : 10, letterSpacing: "-0.01em" }}>
          {value}m
        </div>
      )}
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className={cls} style={{ "--pct": pct } as React.CSSProperties} />
      <div style={{ position: "relative", height: 32, marginTop: 6 }}>
        {ticks.filter(t => t >= min && t <= max).map(t => (
          <div key={t} style={{ position: "absolute", left: sliderPct(t, min, max), transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
            <div style={{ width: 2, height: 8, background: M, borderRadius: 1 }} />
            <span style={{ fontSize: "0.65rem", color: "#fff", fontFamily: "Rajdhani,sans-serif", marginTop: 3, fontWeight: 500 }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CmStepper({ value, onChange, min, max, step }: { value: number; onChange: (v: number) => void; min: number; max: number; step: number }) {
  const dec = () => onChange(Math.max(min, Math.round((value - step) * 2) / 2));
  const inc = () => onChange(Math.min(max, Math.round((value + step) * 2) / 2));
  const btnSt: React.CSSProperties = { width: 56, minHeight: 56, minWidth: 56, borderRadius: 10, border: `2px solid ${B}`, background: P, color: G, fontFamily: "Rajdhani,sans-serif", fontSize: "1.8rem", fontWeight: 700, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, padding: 0 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
      <button type="button" onClick={dec} disabled={value <= min} style={{ ...btnSt, opacity: value <= min ? 0.35 : 1, cursor: value <= min ? "not-allowed" : "pointer" }}>−</button>
      <div style={{ flex: 1, textAlign: "center", fontFamily: "Rajdhani,sans-serif", fontSize: "clamp(1.5rem,5vw,2rem)", fontWeight: 700, color: G, padding: "10px 8px", background: D, borderRadius: 10, border: `1px solid ${B}`, minHeight: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {value.toFixed(1)} cm
      </div>
      <button type="button" onClick={inc} disabled={value >= max} style={{ ...btnSt, opacity: value >= max ? 0.35 : 1, cursor: value >= max ? "not-allowed" : "pointer" }}>+</button>
    </div>
  );
}

export const inputSt: React.CSSProperties = { padding: "10px 12px", background: P, border: `1px solid ${B}`, color: C, borderRadius: 8, fontSize: "1rem", fontFamily: "Rajdhani,sans-serif", width: "100%", minHeight: 44, boxSizing: "border-box" };
export const selectSt: React.CSSProperties = { width: "100%", padding: "10px 12px", background: P, border: `1px solid ${B}`, color: C, borderRadius: 8, fontSize: "1rem", fontFamily: "Rajdhani,sans-serif", minHeight: 44 };
