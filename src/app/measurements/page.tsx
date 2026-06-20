"use client";

import { useState } from "react";
import { useLang } from "@/lib/app/use-lang";
import { PageHeader, SliderStyles } from "@/components/ballistics/ui";

const G = "#C8A96E", D = "#0D0F0A", P = "#131510", B = "#2A2D1E", M = "#5A6040", C = "#E8E2D4";

const TROPHIES = [
  { id:"steenbok",      name_en:"Steenbok",            name_af:"Steenbok",        horn:"Straight", rw:"4\"",      sci:"19",  good:"4.5\"",  exceptional:"5.5\"+",  world:"6 1/4\"",    min_cal:".222 Rem",   danger:"Safe",      difficulty:"Moderate" },
  { id:"duiker",        name_en:"Common Duiker",        name_af:"Duiker",          horn:"Straight", rw:"4\"",      sci:"20",  good:"4.5\"",  exceptional:"5.5\"+",  world:"7 3/8\"",    min_cal:".222 Rem",   danger:"Safe",      difficulty:"Hard" },
  { id:"warthog",       name_en:"Warthog",              name_af:"Vlakvark",        horn:"Curved",   rw:"12\"",     sci:"60",  good:"15\"",   exceptional:"20\"+",   world:"26\"",       min_cal:".243 Win",   danger:"Low",       difficulty:"Easy" },
  { id:"mountain-reed", name_en:"Mountain Reedbuck",    name_af:"Rooiribbok",      horn:"Curved",   rw:"8\"",      sci:"40",  good:"9\"",    exceptional:"11\"+",   world:"14 3/8\"",   min_cal:".243 Win",   danger:"Safe",      difficulty:"Hard" },
  { id:"springbok",     name_en:"Springbok",            name_af:"Springbok",       horn:"Curved",   rw:"14\"",     sci:"68",  good:"16\"",   exceptional:"18\"+",   world:"19 7/8\"",   min_cal:".243 Win",   danger:"Safe",      difficulty:"Moderate" },
  { id:"bushbuck",      name_en:"Bushbuck",             name_af:"Bosbok",          horn:"Spiral",   rw:"16\"",     sci:"75",  good:"17\"",   exceptional:"19\"+",   world:"22\"",       min_cal:".243 Win",   danger:"Moderate",  difficulty:"Hard" },
  { id:"impala",        name_en:"Impala",               name_af:"Rooibok",         horn:"Curved",   rw:"23 5/8\"", sci:"52",  good:"22\"",   exceptional:"25\"+",   world:"31 3/8\"",   min_cal:".243 Win",   danger:"Safe",      difficulty:"Easy" },
  { id:"fallow-deer",   name_en:"Fallow Deer",          name_af:"Damhert",         horn:"Palmated", rw:"24\" span",sci:"170", good:"Good palmation", exceptional:"28\"+ span", world:"N/A", min_cal:".243 Win", danger:"Safe",   difficulty:"Moderate" },
  { id:"blesbok",       name_en:"Blesbok",              name_af:"Blesbok",         horn:"Curved",   rw:"16\"",     sci:"80",  good:"17\"",   exceptional:"19\"+",   world:"22\"",       min_cal:".243 Win",   danger:"Safe",      difficulty:"Easy" },
  { id:"nyala",         name_en:"Nyala",                name_af:"Njala",           horn:"Spiral",   rw:"26\"",     sci:"115", good:"27\"",   exceptional:"30\"+",   world:"34 1/4\"",   min_cal:".270 Win",   danger:"Low",       difficulty:"Moderate" },
  { id:"black-wilde",   name_en:"Black Wildebeest",     name_af:"Swart Wildebees", horn:"Curved",   rw:"19\" spread",sci:"100",good:"21\"",  exceptional:"24\"+",   world:"28 5/8\"",   min_cal:".270 Win",   danger:"Moderate",  difficulty:"Moderate" },
  { id:"gemsbok",       name_en:"Gemsbok",              name_af:"Gemsbok",         horn:"Straight", rw:"38\"",     sci:"160", good:"40\"",   exceptional:"44\"+",   world:"47 1/4\"",   min_cal:".270 Win",   danger:"Moderate",  difficulty:"Moderate" },
  { id:"tsessebe",      name_en:"Tsessebe",             name_af:"Basterhartbees",  horn:"Curved",   rw:"14\"",     sci:"70",  good:"15\"",   exceptional:"17\"+",   world:"18 5/8\"",   min_cal:".270 Win",   danger:"Safe",      difficulty:"Moderate" },
  { id:"red-hartebeest",name_en:"Red Hartebeest",       name_af:"Rooihartbees",    horn:"Curved",   rw:"19\"",     sci:"95",  good:"22\"",   exceptional:"25\"+",   world:"28 1/8\"",   min_cal:".270 Win",   danger:"Safe",      difficulty:"Easy" },
  { id:"waterbuck",     name_en:"Waterbuck",            name_af:"Waterbok",        horn:"Curved",   rw:"27\"",     sci:"120", good:"28\"",   exceptional:"32\"+",   world:"38 3/4\"",   min_cal:".270 Win",   danger:"Low",       difficulty:"Moderate" },
  { id:"zebra",         name_en:"Plains Zebra",         name_af:"Bontsebra",       horn:"None",     rw:"Hide",     sci:"Hide",good:"Good stripes", exceptional:"Full hide", world:"N/A", min_cal:".308 Win",  danger:"Low",       difficulty:"Easy" },
  { id:"sable",         name_en:"Sable Antelope",       name_af:"Swartwitpens",    horn:"Curved",   rw:"39\"",     sci:"155", good:"43\"",   exceptional:"47\"+",   world:"65\"",       min_cal:".308 Win",   danger:"Moderate",  difficulty:"Hard" },
  { id:"blue-wilde",    name_en:"Blue Wildebeest",      name_af:"Blou Wildebees",  horn:"Curved",   rw:"27\" spread",sci:"120",good:"28\"",  exceptional:"32\"+",   world:"59 1/4\"",   min_cal:".270 Win",   danger:"Low",       difficulty:"Easy" },
  { id:"roan",          name_en:"Roan Antelope",        name_af:"Bastergemsbok",   horn:"Curved",   rw:"27\"",     sci:"118", good:"28\"",   exceptional:"30\"+",   world:"32 7/8\"",   min_cal:".308 Win",   danger:"Moderate",  difficulty:"Hard" },
  { id:"kudu",          name_en:"Greater Kudu",         name_af:"Koedoe",          horn:"Spiral",   rw:"53 7/8\"", sci:"121", good:"50\"",   exceptional:"55\"+",   world:"73 7/8\"",   min_cal:".270 Win",   danger:"Safe",      difficulty:"Hard" },
  { id:"buffalo",       name_en:"Cape Buffalo",         name_af:"Buffel",          horn:"Spread",   rw:"40\" spread",sci:"101",good:"40\"",  exceptional:"45\"+",   world:"64 1/4\"",   min_cal:".375 H&H",   danger:"Dangerous", difficulty:"Very Hard" },
  { id:"eland",         name_en:"Eland",                name_af:"Eland",           horn:"Spiral",   rw:"29\"",     sci:"165", good:"30\"",   exceptional:"35\"+",   world:"44\"",       min_cal:".308 Win",   danger:"Low",       difficulty:"Moderate" },
  { id:"ostrich",       name_en:"Ostrich",              name_af:"Volstruis",       horn:"None",     rw:"Hide",     sci:"Hide",good:"Mature cock", exceptional:"Full plumage", world:"N/A", min_cal:".270 Win", danger:"Moderate", difficulty:"Easy" },
  { id:"giraffe",       name_en:"Giraffe",              name_af:"Kameelperd",      horn:"None",     rw:"Skull",    sci:"Skull",good:"Old bull", exceptional:"Very old dark bull", world:"N/A", min_cal:".375 H&H", danger:"Moderate", difficulty:"Moderate" },
  { id:"baboon",        name_en:"Chacma Baboon",        name_af:"Bobbejaan",       horn:"None",     rw:"Skull",    sci:"Skull",good:"Large male", exceptional:"Old male", world:"N/A",    min_cal:".243 Win",   danger:"Moderate",  difficulty:"Moderate" },
];

const DANGER_COLOR: Record<string, string> = {
  Safe: "#50C878", Low: M, Moderate: "#FF8844", "High": "#FF6633", Dangerous: "#FF4444"
};

export default function TrophyPage() {
  const { lang, toggleLang } = useLang();
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<"name"|"rw"|"sci"|"world">("name");
  const [sortDir, setSortDir] = useState<1|-1>(1);
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = TROPHIES
    .filter(t => {
      const q = search.toLowerCase();
      return !q || t.name_en.toLowerCase().includes(q) || t.name_af.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const av = (sortCol === "name" ? (lang === "en" ? a.name_en : a.name_af) : a[sortCol]) ?? "";
      const bv = (sortCol === "name" ? (lang === "en" ? b.name_en : b.name_af) : b[sortCol]) ?? "";
      return av.localeCompare(bv) * sortDir;
    });

  function toggleSort(col: "name"|"rw"|"sci"|"world") {
    if (sortCol === col) setSortDir(d => d === 1 ? -1 : 1);
    else { setSortCol(col); setSortDir(1); }
  }

  const sel = selected ? TROPHIES.find(t => t.id === selected) : null;

  return (
    <div style={{ background: D, minHeight: "100%", overflowX: "hidden" }}>
      <SliderStyles />
      <PageHeader
        title={lang === "en" ? "Trophy Guide" : "Trofee Gids"}
        lang={lang}
        onToggleLang={toggleLang}
      />

      <div style={{ padding: "12px 16px 0" }}>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={lang === "en" ? "Search species..." : "Soek spesie..."}
          style={{
            width: "100%", padding: "10px 12px", background: P,
            border: `1px solid ${B}`, color: C, borderRadius: 8,
            fontSize: "0.9rem", fontFamily: "Rajdhani,sans-serif",
            minHeight: 44, boxSizing: "border-box" as const,
          }}
        />
      </div>

      {/* Detail panel */}
      {sel && (
        <div style={{ margin: "12px 16px 0", background: P, border: `1px solid ${G}55`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${B}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "1.1rem", fontWeight: 700, color: G }}>
                {lang === "en" ? sel.name_en : sel.name_af}
              </div>
              <div style={{ fontSize: "0.7rem", color: M, marginTop: 2 }}>
                {lang === "en" ? sel.name_af : sel.name_en}
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: M, fontSize: "1.2rem", cursor: "pointer", padding: 8 }}>✕</button>
          </div>
          <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
            {[
              { label: lang === "en" ? "Horn type" : "Horing tipe", value: sel.horn },
              { label: "RW minimum", value: sel.rw },
              { label: "SCI minimum", value: sel.sci + " pts" },
              { label: lang === "en" ? "Good trophy" : "Goeie trofee", value: sel.good },
              { label: lang === "en" ? "Exceptional" : "Uitsonderlik", value: sel.exceptional },
              { label: lang === "en" ? "World record" : "Wêreldrekord", value: sel.world },
              { label: lang === "en" ? "Min caliber" : "Min kaliber", value: sel.min_cal },
              { label: lang === "en" ? "Difficulty" : "Moeilikheid", value: sel.difficulty },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: "0.62rem", color: M, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "0.9rem", color: C, fontWeight: 600, marginTop: 2 }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "0 14px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.62rem", color: M, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {lang === "en" ? "Danger" : "Gevaar"}:
            </span>
            <span style={{
              padding: "2px 10px", borderRadius: 10, fontSize: "0.7rem", fontWeight: 600,
              fontFamily: "Rajdhani,sans-serif",
              background: (DANGER_COLOR[sel.danger] ?? M) + "22",
              border: `1px solid ${(DANGER_COLOR[sel.danger] ?? M)}55`,
              color: DANGER_COLOR[sel.danger] ?? M,
            }}>
              {sel.danger}
            </span>
          </div>
        </div>
      )}

      {/* Trophy table */}
      <div style={{ margin: "12px 16px 80px", background: P, border: `1px solid ${B}`, borderRadius: 12, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", columnGap: 4, padding: "8px 12px", borderBottom: `1px solid ${B}`, background: D }}>
          {([
            { key: "name", label: lang === "en" ? "Species" : "Spesie" },
            { key: "rw",   label: "RW min" },
            { key: "sci",  label: "SCI min" },
            { key: "world",label: lang === "en" ? "Record" : "Rekord" },
          ] as { key: "name"|"rw"|"sci"|"world"; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleSort(key)}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left",
                fontSize: "0.6rem", color: sortCol === key ? G : M,
                fontFamily: "Rajdhani,sans-serif", fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}
            >
              {label} {sortCol === key ? (sortDir === 1 ? "▲" : "▼") : ""}
            </button>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelected(selected === t.id ? null : t.id)}
            style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
              columnGap: 4, padding: "10px 12px", width: "100%",
              background: selected === t.id ? G + "15" : i % 2 === 0 ? P : D,
              border: "none", borderBottom: `1px solid ${B}`,
              borderLeft: `3px solid ${DANGER_COLOR[t.danger] ?? M}`,
              cursor: "pointer", textAlign: "left", minHeight: 44,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "0.85rem", fontWeight: 700, color: selected === t.id ? G : C, lineHeight: 1.2 }}>
                {lang === "en" ? t.name_en : t.name_af}
              </div>
              <div style={{ fontSize: "0.6rem", color: M, marginTop: 1 }}>
                {lang === "en" ? t.name_af : t.name_en}
              </div>
            </div>
            <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "0.78rem", color: G, fontWeight: 600 }}>{t.rw}</div>
            <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "0.78rem", color: C, fontWeight: 600 }}>{t.sci}</div>
            <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "0.78rem", color: M }}>{t.world}</div>
          </button>
        ))}
      </div>
    </div>
  );
}