"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/lib/app/use-lang";
import { PageHeader, SliderStyles } from "@/components/ballistics/ui";
import { SPECIES } from "@/lib/types/species";

const G = "#C8A96E", D = "#0D0F0A", P = "#131510", B = "#2A2D1E", M = "#5A6040", C = "#E8E2D4";
const RED = "#FF4444", GREEN = "#50C878";
const LS_KEY = "trophyhunt_hunt_log_v1";

interface HuntEntry {
  id: string;
  date: string;
  species: string;
  location: string;
  gps: string;
  distance_m: number;
  trophy_measurement: string;
  rifle: string;
  ammo: string;
  ph_name: string;
  notes: string;
  photo?: string;
  created_at: number;
}

function newEntry(): HuntEntry {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString().split("T")[0],
    species: "",
    location: "",
    gps: "",
    distance_m: 0,
    trophy_measurement: "",
    rifle: "",
    ammo: "",
    ph_name: "",
    notes: "",
    photo: undefined,
    created_at: Date.now(),
  };
}

const SORTED_SPECIES = [...SPECIES].sort((a, b) => a.name_en.localeCompare(b.name_en));

export default function HuntLogPage() {
  const { lang, toggleLang } = useLang();
  const [entries, setEntries] = useState<HuntEntry[]>([]);
  const [mode, setMode] = useState<"list"|"form"|"detail">("list");
  const [form, setForm] = useState<HuntEntry>(newEntry());
  const [selected, setSelected] = useState<HuntEntry | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  function save(list: HuntEntry[]) {
    setEntries(list);
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch { /* ignore */ }
  }

  function handleSave() {
    if (!form.species || !form.date) return;
    const exists = entries.find(e => e.id === form.id);
    const next = exists
      ? entries.map(e => e.id === form.id ? form : e)
      : [form, ...entries];
    save(next);
    setMode("list");
    setForm(newEntry());
  }

  function handleDelete(id: string) {
    if (!window.confirm(lang === "en" ? "Delete this entry?" : "Verwyder hierdie inskrywing?")) return;
    save(entries.filter(e => e.id !== id));
    setMode("list");
    setSelected(null);
  }

  function getGPS() {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
        setForm(f => ({ ...f, gps: coords }));
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, photo: ev.target?.result as string }));
    reader.readAsDataURL(file);
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "10px 12px", background: D,
    border: `1px solid ${B}`, color: C, borderRadius: 8,
    fontSize: "0.9rem", fontFamily: "Rajdhani,sans-serif",
    minHeight: 44, boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = {
    fontSize: "0.65rem", color: M, textTransform: "uppercase",
    letterSpacing: "0.06em", marginBottom: 6, display: "block",
  };
  const field = (label: string, children: React.ReactNode) => (
    <div style={{ marginBottom: 14 }}>
      <span style={lbl}>{label}</span>
      {children}
    </div>
  );

  // ── LIST VIEW ──
  if (mode === "list") return (
    <div style={{ background: D, minHeight: "100%", overflowX: "hidden" }}>
      <SliderStyles />
      <PageHeader title={lang === "en" ? "Hunt Log" : "Jag Log"} lang={lang} onToggleLang={toggleLang} />
      <div style={{ padding: "12px 16px 80px" }}>
        <button
          onClick={() => { setForm(newEntry()); setMode("form"); }}
          style={{
            width: "100%", minHeight: 48, borderRadius: 8,
            background: `linear-gradient(180deg, #2A962A 0%, #1A5C1A 100%)`,
            border: "1px solid #0A4A0A", color: "#fff",
            fontFamily: "Rajdhani,sans-serif", fontSize: "1rem",
            fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer",
            marginBottom: 16,
          }}
        >
          + {lang === "en" ? "Log New Hunt" : "Nuwe Jag Inskrywing"}
        </button>

        {entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: M, fontSize: "0.85rem", fontStyle: "italic" }}>
            {lang === "en" ? "No hunts logged yet. Tap + to add your first entry." : "Geen jagtogte gestoor nie. Tik + om jou eerste inskrywing by te voeg."}
          </div>
        ) : entries.map(e => {
          const sp = SORTED_SPECIES.find(s => s.id === e.species);
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => { setSelected(e); setMode("detail"); }}
              style={{
                width: "100%", background: P, border: `1px solid ${B}`,
                borderLeft: `4px solid ${G}`, borderRadius: 10,
                padding: "12px 14px", marginBottom: 10,
                cursor: "pointer", textAlign: "left",
                display: "flex", gap: 12, alignItems: "flex-start",
              }}
            >
              {e.photo && (
                <img src={e.photo} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "1rem", fontWeight: 700, color: G }}>
                  {sp ? (lang === "en" ? sp.name_en : sp.name_af) : e.species}
                </div>
                <div style={{ fontSize: "0.75rem", color: C, marginTop: 2 }}>{e.date} · {e.location || (lang === "en" ? "No location" : "Geen plek")}</div>
                {e.trophy_measurement && (
                  <div style={{ fontSize: "0.72rem", color: G, marginTop: 3 }}>🏆 {e.trophy_measurement}</div>
                )}
                {e.distance_m > 0 && (
                  <div style={{ fontSize: "0.72rem", color: M, marginTop: 2 }}>🎯 {e.distance_m}m · {e.rifle}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ── DETAIL VIEW ──
  if (mode === "detail" && selected) {
    const sp = SORTED_SPECIES.find(s => s.id === selected.species);
    return (
      <div style={{ background: D, minHeight: "100%", overflowX: "hidden" }}>
        <SliderStyles />
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px 10px", borderBottom: `1px solid ${B}` }}>
          <button onClick={() => setMode("list")} style={{ background: "none", border: "none", color: M, fontSize: "1.2rem", cursor: "pointer" }}>←</button>
          <h1 style={{ fontFamily: "Rajdhani,sans-serif", color: G, fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0, flex: 1 }}>
            {sp ? (lang === "en" ? sp.name_en : sp.name_af) : selected.species}
          </h1>
          <button
            onClick={() => { setForm({ ...selected }); setMode("form"); }}
            style={{ background: "none", border: `1px solid ${G}`, color: G, borderRadius: 6, padding: "4px 12px", fontFamily: "Rajdhani,sans-serif", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
          >
            {lang === "en" ? "Edit" : "Wysig"}
          </button>
        </div>

        <div style={{ padding: "14px 16px 80px" }}>
          {selected.photo && (
            <img src={selected.photo} alt="" style={{ width: "100%", borderRadius: 10, marginBottom: 14, objectFit: "cover", maxHeight: 250 }} />
          )}

          <div style={{ background: P, border: `1px solid ${B}`, borderRadius: 10, padding: "14px", marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" }}>
              {[
                { label: lang === "en" ? "Date" : "Datum", value: selected.date },
                { label: lang === "en" ? "Location" : "Plek", value: selected.location || "—" },
                { label: "GPS", value: selected.gps || "—" },
                { label: lang === "en" ? "Shot distance" : "Skootafstand", value: selected.distance_m ? `${selected.distance_m}m` : "—" },
                { label: lang === "en" ? "Trophy" : "Trofee", value: selected.trophy_measurement || "—" },
                { label: lang === "en" ? "Rifle" : "Geweer", value: selected.rifle || "—" },
                { label: lang === "en" ? "Ammo" : "Ammunisie", value: selected.ammo || "—" },
                { label: "PH", value: selected.ph_name || "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: "0.6rem", color: M, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                  <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "0.88rem", color: C, fontWeight: 600, marginTop: 2 }}>{value}</div>
                </div>
              ))}
            </div>
            {selected.notes && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${B}` }}>
                <div style={{ fontSize: "0.6rem", color: M, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{lang === "en" ? "Notes" : "Notas"}</div>
                <div style={{ fontSize: "0.82rem", color: C, lineHeight: 1.55 }}>{selected.notes}</div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleDelete(selected.id)}
            style={{
              width: "100%", minHeight: 44, borderRadius: 8,
              background: "linear-gradient(180deg, #C02424 0%, #8B1A1A 100%)",
              border: "1px solid #6B0A0A", color: "#fff",
              fontFamily: "Rajdhani,sans-serif", fontSize: "0.9rem",
              fontWeight: 700, cursor: "pointer",
            }}
          >
            {lang === "en" ? "Delete Entry" : "Verwyder Inskrywing"}
          </button>
        </div>
      </div>
    );
  }

  // ── FORM VIEW ──
  return (
    <div style={{ background: D, minHeight: "100%", overflowX: "hidden" }}>
      <SliderStyles />
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px 10px", borderBottom: `1px solid ${B}` }}>
        <button onClick={() => setMode("list")} style={{ background: "none", border: "none", color: M, fontSize: "1.2rem", cursor: "pointer" }}>←</button>
        <h1 style={{ fontFamily: "Rajdhani,sans-serif", color: G, fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
          {lang === "en" ? "Log Hunt" : "Stoor Jag"}
        </h1>
      </div>

      <div style={{ padding: "14px 16px 80px" }}>

        {/* Photo */}
        <div style={{ marginBottom: 14 }}>
          <span style={lbl}>{lang === "en" ? "Photo" : "Foto"}</span>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: "none" }} />
          {form.photo ? (
            <div style={{ position: "relative" }}>
              <img src={form.photo} alt="" style={{ width: "100%", borderRadius: 8, objectFit: "cover", maxHeight: 200 }} />
              <button
                onClick={() => setForm(f => ({ ...f, photo: undefined }))}
                style={{ position: "absolute", top: 8, right: 8, background: RED, border: "none", borderRadius: "50%", width: 28, height: 28, color: "#fff", cursor: "pointer", fontSize: "0.8rem" }}
              >✕</button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              style={{ ...inp, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: M, cursor: "pointer", background: P }}
            >
              📷 {lang === "en" ? "Add Photo" : "Voeg Foto By"}
            </button>
          )}
        </div>

        {/* Species */}
        {field(lang === "en" ? "Species" : "Spesie",
          <select value={form.species} onChange={e => setForm(f => ({ ...f, species: e.target.value }))} style={inp}>
            <option value="">{lang === "en" ? "Select species..." : "Kies spesie..."}</option>
            {SORTED_SPECIES.map(sp => (
              <option key={sp.id} value={sp.id}>{lang === "en" ? sp.name_en : sp.name_af}</option>
            ))}
          </select>
        )}

        {/* Date */}
        {field(lang === "en" ? "Date" : "Datum",
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inp} />
        )}

        {/* Location */}
        {field(lang === "en" ? "Farm / Location" : "Plaas / Plek",
          <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            placeholder={lang === "en" ? "Farm name or area" : "Plaasnaam of area"} style={inp} />
        )}

        {/* GPS */}
        {field("GPS",
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" value={form.gps} onChange={e => setForm(f => ({ ...f, gps: e.target.value }))}
              placeholder="-29.123456, 26.123456" style={{ ...inp, flex: 1 }} />
            <button
              onClick={getGPS}
              disabled={gpsLoading}
              style={{ minHeight: 44, padding: "0 14px", borderRadius: 8, border: `1px solid ${G}`, background: G + "1a", color: G, fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
            >
              {gpsLoading ? "..." : "📍 GPS"}
            </button>
          </div>
        )}

        {/* Shot distance */}
        {field(lang === "en" ? "Shot Distance (m)" : "Skootafstand (m)",
          <input type="number" value={form.distance_m || ""} onChange={e => setForm(f => ({ ...f, distance_m: Number(e.target.value) }))}
            placeholder="0" min="0" max="2000" style={inp} />
        )}

        {/* Trophy measurement */}
        {field(lang === "en" ? "Trophy Measurement" : "Trofee Meting",
          <input type="text" value={form.trophy_measurement} onChange={e => setForm(f => ({ ...f, trophy_measurement: e.target.value }))}
            placeholder={lang === "en" ? 'e.g. 54" spiral, 42cm spread' : 'bv. 54" spiraal, 42cm breedte'} style={inp} />
        )}

        {/* Rifle */}
        {field(lang === "en" ? "Rifle" : "Geweer",
          <input type="text" value={form.rifle} onChange={e => setForm(f => ({ ...f, rifle: e.target.value }))}
            placeholder={lang === "en" ? "e.g. Rem 700 .270 Win" : "bv. Rem 700 .270 Win"} style={inp} />
        )}

        {/* Ammo */}
        {field(lang === "en" ? "Ammunition" : "Ammunisie",
          <input type="text" value={form.ammo} onChange={e => setForm(f => ({ ...f, ammo: e.target.value }))}
            placeholder={lang === "en" ? "e.g. PMP 130gr ProAmm" : "bv. PMP 130gr ProAmm"} style={inp} />
        )}

        {/* PH */}
        {field(lang === "en" ? "Professional Hunter" : "Professionele Jagter",
          <input type="text" value={form.ph_name} onChange={e => setForm(f => ({ ...f, ph_name: e.target.value }))}
            placeholder={lang === "en" ? "PH name" : "PH naam"} style={inp} />
        )}

        {/* Notes */}
        {field(lang === "en" ? "Notes" : "Notas",
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder={lang === "en" ? "Wind conditions, shot details, memorable moments..." : "Windtoestande, skoot besonderhede, onvergeetlike oomblikke..."}
            rows={4}
            style={{ ...inp, height: "auto", resize: "vertical" as const }} />
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!form.species || !form.date}
          style={{
            width: "100%", minHeight: 52, borderRadius: 8,
            background: form.species && form.date
              ? `linear-gradient(180deg, #D4A843 0%, #A07830 100%)`
              : P,
            border: `1px solid ${form.species && form.date ? "#8a6020" : B}`,
            color: form.species && form.date ? "#0D0F0A" : M,
            fontFamily: "Rajdhani,sans-serif", fontSize: "1rem",
            fontWeight: 700, letterSpacing: "0.08em",
            cursor: form.species && form.date ? "pointer" : "not-allowed",
            boxShadow: form.species && form.date ? "0 3px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)" : "none",
          }}
        >
          {lang === "en" ? "Save Hunt Entry" : "Stoor Jag Inskrywing"}
        </button>
      </div>
    </div>
  );
}