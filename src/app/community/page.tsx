"use client";

import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/lib/app/use-lang";
import { PageHeader, SliderStyles } from "@/components/ballistics/ui";
import { SPECIES } from "@/lib/types/species";
import { getPosts, toggleLike, getLiked, type CommunityPost } from "@/lib/community/storage";

const G = "#C8A96E", D = "#0D0F0A", P = "#131510", B = "#2A2D1E", M = "#5A6040", C = "#E8E2D4";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function CommunityPage() {
  const { lang, toggleLang } = useLang();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<CommunityPost | null>(null);

  const load = useCallback(() => {
    setPosts(getPosts());
    setLiked(getLiked());
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleLike(postId: string) {
    toggleLike(postId);
    load();
  }

  const filtered = posts.filter(p => {
    if (!filter) return true;
    const sp = SPECIES.find(s => s.id === p.species);
    const name = sp ? (lang === "en" ? sp.name_en : sp.name_af) : p.species;
    return name.toLowerCase().includes(filter.toLowerCase()) ||
      p.hunter_name.toLowerCase().includes(filter.toLowerCase()) ||
      p.location.toLowerCase().includes(filter.toLowerCase());
  });

  if (selected) {
    const sp = SPECIES.find(s => s.id === selected.species);
    const speciesName = sp ? (lang === "en" ? sp.name_en : sp.name_af) : selected.species;
    const isLiked = liked.includes(selected.id);

    return (
      <div style={{ background: D, minHeight: "100%", overflowX: "hidden" }}>
        <SliderStyles />
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px 10px", borderBottom: `1px solid ${B}` }}>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: M, fontSize: "1.2rem", cursor: "pointer" }}>←</button>
          <h1 style={{ fontFamily: "Rajdhani,sans-serif", color: G, fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
            {speciesName}
          </h1>
        </div>

        <div style={{ padding: "14px 16px 80px" }}>
          {selected.photo && (
            <img src={selected.photo} alt="" style={{ width: "100%", borderRadius: 10, marginBottom: 14, objectFit: "cover", maxHeight: 300 }} />
          )}

          <div style={{ background: P, border: `1px solid ${B}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "1rem", fontWeight: 700, color: G }}>{selected.hunter_name}</div>
                <div style={{ fontSize: "0.7rem", color: M, marginTop: 2 }}>{selected.date} · {timeAgo(selected.posted_at)}</div>
              </div>
              <button
                onClick={() => handleLike(selected.id)}
                style={{ background: "none", border: `1px solid ${isLiked ? G : B}`, borderRadius: 20, padding: "4px 12px", color: isLiked ? G : M, fontFamily: "Rajdhani,sans-serif", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
              >
                ❤️ {selected.likes}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
              {[
                { label: lang === "en" ? "Location" : "Plek", value: selected.location || "—" },
                { label: lang === "en" ? "Shot distance" : "Afstand", value: selected.distance_m ? `${selected.distance_m}m` : "—" },
                { label: lang === "en" ? "Trophy" : "Trofee", value: selected.trophy_measurement || "—" },
                { label: lang === "en" ? "Rifle" : "Geweer", value: selected.rifle || "—" },
                { label: lang === "en" ? "Ammo" : "Ammo", value: selected.ammo || "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: "0.6rem", color: M, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                  <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "0.88rem", color: C, fontWeight: 600, marginTop: 2 }}>{value}</div>
                </div>
              ))}
            </div>

            {selected.notes && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${B}`, fontSize: "0.82rem", color: C, lineHeight: 1.55 }}>
                {selected.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: D, minHeight: "100%", overflowX: "hidden" }}>
      <SliderStyles />
      <PageHeader title={lang === "en" ? "Community" : "Gemeenskap"} lang={lang} onToggleLang={toggleLang} />

      <div style={{ padding: "12px 16px 0" }}>
        <input
          type="search"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder={lang === "en" ? "Search by species, hunter, location..." : "Soek spesie, jagter, plek..."}
          style={{ width: "100%", padding: "10px 12px", background: P, border: `1px solid ${B}`, color: C, borderRadius: 8, fontSize: "0.9rem", fontFamily: "Rajdhani,sans-serif", minHeight: 44, boxSizing: "border-box" as const, marginBottom: 12 }}
        />
      </div>

      <div style={{ padding: "0 16px 80px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: M }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🏆</div>
            <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "1rem", fontWeight: 700, color: C, marginBottom: 8 }}>
              {lang === "en" ? "No posts yet" : "Geen plasings nog"}
            </div>
            <div style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
              {lang === "en"
                ? "Log a hunt and post it to the community to see it here."
                : "Stoor 'n jag en plaas dit in die gemeenskap om dit hier te sien."}
            </div>
          </div>
        ) : filtered.map((post, i) => {
          const sp = SPECIES.find(s => s.id === post.species);
          const speciesName = sp ? (lang === "en" ? sp.name_en : sp.name_af) : post.species;
          const isLiked = liked.includes(post.id);

          return (
            <div
              key={post.id}
              style={{ background: P, border: `1px solid ${B}`, borderRadius: 12, marginBottom: 14, overflow: "hidden" }}
            >
              {/* Photo */}
              {post.photo && (
                <img
                  src={post.photo}
                  alt={speciesName}
                  onClick={() => setSelected(post)}
                  style={{ width: "100%", objectFit: "cover", maxHeight: 220, display: "block", cursor: "pointer" }}
                />
              )}

              {/* Card content */}
              <div style={{ padding: "12px 14px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "1.05rem", fontWeight: 700, color: G }}>
                      {speciesName}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: M, marginTop: 2 }}>
                      🎯 {post.hunter_name} · {post.date} · {timeAgo(post.posted_at)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleLike(post.id)}
                    style={{
                      background: isLiked ? G + "22" : "none",
                      border: `1px solid ${isLiked ? G : B}`,
                      borderRadius: 20, padding: "4px 12px",
                      color: isLiked ? G : M,
                      fontFamily: "Rajdhani,sans-serif", fontSize: "0.8rem",
                      fontWeight: 600, cursor: "pointer", flexShrink: 0,
                    }}
                  >
                    ❤️ {post.likes}
                  </button>
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: post.notes ? 8 : 0 }}>
                  {post.location && (
                    <span style={{ fontSize: "0.75rem", color: C }}>📍 {post.location}</span>
                  )}
                  {post.trophy_measurement && (
                    <span style={{ fontSize: "0.75rem", color: G, fontWeight: 600 }}>🏆 {post.trophy_measurement}</span>
                  )}
                  {post.distance_m > 0 && (
                    <span style={{ fontSize: "0.75rem", color: C }}>🎯 {post.distance_m}m</span>
                  )}
                </div>

                {post.notes && (
                  <div style={{ fontSize: "0.78rem", color: C, lineHeight: 1.5, marginBottom: 8, borderTop: `1px solid ${B}`, paddingTop: 8, marginTop: 8 }}>
                    {post.notes.length > 120 ? post.notes.substring(0, 120) + "..." : post.notes}
                  </div>
                )}

                <button
                  onClick={() => setSelected(post)}
                  style={{ background: "none", border: "none", color: G, fontFamily: "Rajdhani,sans-serif", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", padding: 0 }}
                >
                  {lang === "en" ? "View full post →" : "Sien volle plasing →"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}