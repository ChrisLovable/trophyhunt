"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { BULLET_PRESETS, CALIBER_GROUPS } from "@/lib/ballistics/bullet-presets";
import { calculateTrajectory, calculateLadder } from "@/lib/ballistics/engine";
import { MAX_HOLDOVER_M } from "@/lib/ballistics/calibration";
import { LADDER_STEP_M } from "@/lib/ballistics/holdover-math";
import { RIFLE_T } from "@/lib/ballistics/i18n";
import { BARREL_OFFSETS, solveMV } from "@/lib/ballistics/holdover-math";
import { sbSaveRifle } from "@/lib/rifle/supabase";
import {
  saveSavedRifles, saveAimRifleId,
  rifleAmmoType, type SavedRifle, type AmmoType, type BulletTip,
} from "@/lib/rifle/storage";
import { useSavedRifles } from "@/hooks/use-saved-rifles";
import { useLang } from "@/lib/app/use-lang";
import { C, D, G, M, P, B } from "@/lib/app/brand";
import { HoldoverLadderTable } from "@/components/ballistics/HoldoverLadderTable";
import {
  Btn, Card, DistSlider, Field, PageHeader, SliderStyles,
  Stat, Tabs, Tog, CmStepper, inputSt, selectSt,
} from "@/components/ballistics/ui";

const TIP_TYPES: { id: BulletTip; en: string; af: string; color: string }[] = [
  { id: "lead", en: "Lead tip", af: "Loodpunt", color: "#c8a96e" },
  { id: "polymer", en: "Polymer tip", af: "Polimeerpunt", color: "#ff6b35" },
  { id: "hollow", en: "Hollow point", af: "Holpunt", color: "#7ab0e0" },
  { id: "solid", en: "Monolithic", af: "Monolities", color: "#c87040" },
];

function ladderPastZero(ladder: ReturnType<typeof calculateLadder>, zeroDist: number) {
  return ladder.filter(r => r.distance_m > zeroDist);
}

function defaultForm() {
  const caliber = "6.5 Creedmoor";
  const bulletId = BULLET_PRESETS.find(b => b.caliber === caliber)?.id ?? "";
  const preset = BULLET_PRESETS.find(b => b.id === bulletId);
  return {
    rifleName: "My Rifle",
    caliber,
    ammoType: "factory" as AmmoType,
    bulletId,
    tipType: "polymer" as BulletTip,
    reloadName: "",
    maker: "",
    grains: "",
    bcManual: "",
    zeroDist: 100,
    mvTab: "drop" as const,
    dropCm: 0,
    dropDistM: 200,
    mvFps: String(preset ? Math.round(preset.muzzle_velocity_fps + BARREL_OFFSETS["24"]) : 2710),
    barrelLength: "24" as const,
  };
}

export default function RiflePage() {
  const { lang, toggleLang } = useLang();
  const t = RIFLE_T[lang];

  const { savedRifles, aimRifleId, selectAimRifle } = useSavedRifles();
  const [storageReady, setStorageReady] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"view" | "form">("view");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState("");

  const [rifleName, setRifleName] = useState(defaultForm().rifleName);
  const [caliber, setCaliber] = useState(defaultForm().caliber);
  const [ammoType, setAmmoType] = useState<AmmoType>("factory");
  const [bulletId, setBulletId] = useState(defaultForm().bulletId);
  const [tipType, setTipType] = useState<BulletTip>("polymer");
  const [reloadName, setReloadName] = useState("");
  const [maker, setMaker] = useState("");
  const [grains, setGrains] = useState("");
  const [bcManual, setBcManual] = useState("");
  const [zeroDist, setZeroDist] = useState(100);
  const [mvTab, setMvTab] = useState<"drop" | "manual">("drop");
  const [dropCm, setDropCm] = useState(0);
  const [dropDistM, setDropDistM] = useState(200);
  const [mvFps, setMvFps] = useState(defaultForm().mvFps);
  const [barrelLength, setBarrelLength] = useState<"20" | "22" | "24" | "26">("24");
  const [mvTouched, setMvTouched] = useState(false);

  const loadFormFromRifle = useCallback((r: SavedRifle) => {
    const type = rifleAmmoType(r);
    setRifleName(r.name);
    setCaliber(r.caliber);
    setAmmoType(type);
    setZeroDist(r.zeroDist);
    setMvTab("manual");
    setMvFps(String(Math.round(r.mv * 3.28084)));
    setMvTouched(true);

    if (type === "factory") {
      const preset = BULLET_PRESETS.find(b => b.id === r.bulletPresetId && b.caliber === r.caliber)
        ?? BULLET_PRESETS.find(b => b.caliber === r.caliber);
      setBulletId(preset?.id ?? "");
      setBcManual("");
      setReloadName("");
      setMaker("");
      setGrains("");
      setTipType(preset?.tip_type ?? "polymer");
    } else {
      setBulletId("");
      setBcManual(String(r.bc));
      setReloadName(r.bulletName);
      setMaker(r.maker ?? "");
      setGrains(r.grains ? String(r.grains) : "");
      setTipType(r.tipType ?? "polymer");
    }
  }, []);

  const resetForm = useCallback(() => {
    const d = defaultForm();
    setRifleName(d.rifleName);
    setCaliber(d.caliber);
    setAmmoType(d.ammoType);
    setBulletId(d.bulletId);
    setTipType(d.tipType);
    setReloadName(d.reloadName);
    setMaker(d.maker);
    setGrains(d.grains);
    setBcManual(d.bcManual);
    setZeroDist(d.zeroDist);
    setMvTab(d.mvTab);
    setDropCm(d.dropCm);
    setDropDistM(d.dropDistM);
    setMvFps(d.mvFps);
    setBarrelLength(d.barrelLength);
    setEditingId(null);
    setMvTouched(false);
  }, []);

  useEffect(() => {
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;

    if (savedRifles.length === 0) {
      if (selectedId !== null) setSelectedId(null);
      if (mode !== "form") {
        resetForm();
        setMode("form");
      }
      return;
    }

    // User is adding a new rifle — don't snap back to the dropdown selection.
    if (mode === "form" && !editingId) return;

    const pick = aimRifleId && savedRifles.some(r => r.id === aimRifleId)
      ? aimRifleId
      : savedRifles[0].id;

    if (!selectedId || !savedRifles.some(r => r.id === selectedId)) {
      setSelectedId(pick);
      setMode("view");
    }
  }, [savedRifles, aimRifleId, selectedId, mode, editingId, resetForm, storageReady]);

  useEffect(() => {
    if (ammoType !== "factory" || mvTouched || mvTab === "manual") return;
    const preset = BULLET_PRESETS.find(b => b.id === bulletId);
    if (!preset) return;
    setMvFps(String(Math.round(preset.muzzle_velocity_fps + BARREL_OFFSETS[barrelLength])));
  }, [bulletId, barrelLength, ammoType, mvTouched, mvTab]);

  useEffect(() => {
    if (dropDistM <= zeroDist) setDropDistM(Math.min(MAX_HOLDOVER_M, zeroDist + LADDER_STEP_M));
  }, [zeroDist]); // eslint-disable-line react-hooks/exhaustive-deps

  const viewedRifle = savedRifles.find(r => r.id === selectedId) ?? null;
  const bulletsForCal = BULLET_PRESETS.filter(b => b.caliber === caliber);
  const selectedPreset = BULLET_PRESETS.find(b => b.id === bulletId);

  useEffect(() => {
    if (ammoType !== "factory") return;
    if (bulletsForCal.length === 0) return;
    if (!bulletsForCal.some(b => b.id === bulletId)) {
      setBulletId(bulletsForCal[0].id);
    }
  }, [caliber, ammoType, bulletId, bulletsForCal]);

  const activeBc = ammoType === "factory"
    ? (selectedPreset?.bc_g1 ?? 0)
    : (parseFloat(bcManual) || 0);

  const catalogMv = useMemo(() => {
    if (ammoType === "factory" && selectedPreset) {
      return Math.round((selectedPreset.muzzle_velocity_fps + BARREL_OFFSETS[barrelLength]) * 0.3048);
    }
    return 0;
  }, [ammoType, selectedPreset, barrelLength]);

  const catalogDropCm = useMemo(() => {
    if (activeBc <= 0.05 || catalogMv <= 100 || dropDistM <= zeroDist) return null;
    return calculateTrajectory(activeBc, catalogMv, zeroDist, dropDistM).holdover_cm;
  }, [activeBc, catalogMv, zeroDist, dropDistM]);

  const calculatedMvMs = useMemo(() => {
    if (mode !== "form" || activeBc <= 0.05) return null;
    const effectiveDrop = dropCm > 0 ? dropCm : (catalogDropCm ?? 0);
    if (effectiveDrop <= 0 || dropDistM <= zeroDist) return catalogMv > 100 ? catalogMv : null;
    return solveMV(activeBc, zeroDist, effectiveDrop, dropDistM) ?? (catalogMv > 100 ? catalogMv : null);
  }, [mode, activeBc, dropCm, catalogDropCm, dropDistM, zeroDist, catalogMv]);

  useEffect(() => {
    if (mode !== "form" || mvTab !== "drop" || catalogDropCm === null) return;
    setDropCm(Math.max(0.5, Math.round(catalogDropCm * 2) / 2));
  }, [mode, bulletId, barrelLength, zeroDist, dropDistM, ammoType, activeBc, catalogMv, mvTab, catalogDropCm]);

  useEffect(() => {
    setMvTouched(false);
  }, [bulletId, barrelLength, zeroDist, dropDistM, dropCm, mvTab, ammoType, caliber]);

  useEffect(() => {
    if (mode !== "form" || mvTouched) return;
    if (mvTab === "drop" && calculatedMvMs && calculatedMvMs > 100) {
      setMvFps(String(Math.round(calculatedMvMs * 3.28084)));
      return;
    }
    if (mvTab === "manual" && catalogMv > 100) {
      setMvFps(String(Math.round(catalogMv * 3.28084)));
    }
  }, [mode, mvTab, calculatedMvMs, catalogMv, mvTouched]);

  const dropWarning = useMemo(() => {
    if (mode !== "form" || mvTab !== "drop" || activeBc <= 0.05) return "";
    const effectiveDrop = dropCm > 0 ? dropCm : (catalogDropCm ?? 0);
    if (effectiveDrop <= 0) return t.dropAmountError;
    if (dropDistM <= zeroDist) return `${t.dropDistError} (${zeroDist}m)`;
    const solved = solveMV(activeBc, zeroDist, effectiveDrop, dropDistM);
    if (solved === null && catalogMv <= 100) return t.noSolution;
    if (solved === null) return t.dropUsingCatalog;
    return "";
  }, [mode, mvTab, dropCm, catalogDropCm, dropDistM, zeroDist, activeBc, catalogMv, t]);

  const activeMv = Math.round((parseFloat(mvFps) || 0) * 0.3048);
  const reloadGrains = parseInt(grains, 10) || 0;
  const isRifleConfigured = activeBc > 0.05 && activeMv > 100
    && (ammoType === "factory" ? !!selectedPreset : reloadGrains > 0);

  const mvHint = mvTab === "manual"
    ? t.mvManual
    : dropWarning === t.dropUsingCatalog
      ? t.dropUsingCatalog
      : calculatedMvMs && !mvTouched
        ? t.mvFromDrop
        : mvTouched
          ? t.mvCatalog
          : catalogMv > 100
            ? t.mvCatalog
            : t.dropMvHint;

  const viewLadder = useMemo(() => {
    if (!viewedRifle) return [];
    const full = calculateLadder(viewedRifle.bc, viewedRifle.mv, viewedRifle.zeroDist, MAX_HOLDOVER_M, LADDER_STEP_M);
    return ladderPastZero(full, viewedRifle.zeroDist);
  }, [viewedRifle]);

  const draftLadder = useMemo(() => {
    if (mode !== "form" || !isRifleConfigured) return [];
    const full = calculateLadder(activeBc, activeMv, zeroDist, MAX_HOLDOVER_M, LADDER_STEP_M);
    return ladderPastZero(full, zeroDist);
  }, [mode, isRifleConfigured, activeBc, activeMv, zeroDist]);

  const tableLabels = {
    holdoverTable: t.holdoverTable,
    distance: t.distance,
    holdoverCm: t.holdoverCm,
    holdoverIn: t.holdoverIn,
    moa: t.moa,
    clicks: t.clicks,
    velocity: t.velocity,
  };

  function handleCaliberChange(cal: string) {
    setCaliber(cal);
    if (ammoType === "factory") {
      const first = BULLET_PRESETS.find(b => b.caliber === cal);
      if (first) setBulletId(first.id);
    }
  }

  function selectRifle(id: string) {
    setSelectedId(id);
    setMode("view");
    setEditingId(null);
    selectAimRifle(id);
  }

  function startNew() {
    resetForm();
    setSelectedId(null);
    setMode("form");
  }

  function startEdit() {
    if (!viewedRifle) return;
    loadFormFromRifle(viewedRifle);
    setEditingId(viewedRifle.id);
    setMode("form");
  }

  function handleDelete() {
    if (!viewedRifle) return;
    const updated = savedRifles.filter(r => r.id !== viewedRifle.id);
    saveSavedRifles(updated);
    if (updated.length > 0) {
      setSelectedId(updated[0].id);
      setMode("view");
      selectAimRifle(updated[0].id);
    } else {
      setSelectedId(null);
      resetForm();
      setMode("form");
    }
  }

  async function handleSave() {
    if (!isRifleConfigured) return;
    const isFactory = ammoType === "factory";
    const rifle: SavedRifle = {
      id: editingId ?? crypto.randomUUID(),
      name: rifleName.trim() || "Rifle",
      caliber,
      ammoType,
      bulletPresetId: isFactory ? bulletId : "",
      bulletName: isFactory
        ? (selectedPreset?.name ?? `BC ${activeBc.toFixed(3)}`)
        : (reloadName.trim() || `${reloadGrains}gr ${tipType}`),
      bc: activeBc,
      mv: activeMv,
      zeroDist,
      savedAt: new Date().toISOString(),
      ...(isFactory ? {} : {
        tipType,
        grains: reloadGrains,
        maker: maker.trim() || undefined,
      }),
    };
    const without = savedRifles.filter(r => r.id !== rifle.id);
    const updated = [rifle, ...without].slice(0, 12);
    saveSavedRifles(updated);
    selectAimRifle(rifle.id);
    setSelectedId(rifle.id);
    setEditingId(null);
    setMode("view");
    const synced = await sbSaveRifle(rifle);
    setSaveMsg(synced ? "✓ Synced" : `✓ ${t.savedLocally}`);
    setTimeout(() => setSaveMsg(""), 2500);
  }

  const mvSection = (
    <Field label={t.muzzleVelocity}>
      <Tabs
        options={[t.calcFromDrop, t.enterManual]}
        active={mvTab === "drop" ? 0 : 1}
        onSelect={i => { setMvTab(i === 0 ? "drop" : "manual"); setMvTouched(false); }}
      />
      {mvTab === "drop" && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label={t.atDistance}>
            <DistSlider
              min={Math.max(LADDER_STEP_M, zeroDist + LADDER_STEP_M)}
              max={MAX_HOLDOVER_M}
              step={LADDER_STEP_M}
              value={dropDistM}
              onChange={v => { setDropDistM(v); setMvTouched(false); }}
              ticks={[100, 200, 300, 400, 500, 600, 800, 1000]}
            />
          </Field>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#E8E2D4", lineHeight: 1.45, marginBottom: 10, fontFamily: "Inter,sans-serif" }}>
              {t.dropAtDistance.replace("{dist}", String(dropDistM))}
              <span style={{ color: M }}> … </span>
              <span style={{ color: G, fontFamily: "Rajdhani,sans-serif", fontWeight: 700 }}>cm</span>
            </div>
            <CmStepper value={dropCm} onChange={v => { setDropCm(v); setMvTouched(false); }} min={0} max={120} step={0.5} />
            {catalogDropCm !== null && ammoType === "factory" && (
              <p style={{ fontSize: "0.68rem", color: M, margin: "8px 0 0", lineHeight: 1.45, fontStyle: "italic" }}>{t.dropCatalogHint}</p>
            )}
          </div>
          {dropWarning && dropWarning !== t.dropUsingCatalog && (
            <div style={{ fontSize: "0.75rem", color: "#FF4444" }}>{dropWarning}</div>
          )}
          {dropWarning === t.dropUsingCatalog && (
            <div style={{ fontSize: "0.75rem", color: "#FF8844" }}>{dropWarning}</div>
          )}
        </div>
      )}
      <div style={{ marginTop: 12, padding: "12px 14px", background: D, borderRadius: 10, border: `1px solid ${G}50` }}>
        <div style={{ fontSize: "0.68rem", color: M, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
          {t.muzzleVelocity}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <input
            type="number"
            min={500}
            max={4500}
            step={10}
            value={mvFps}
            onChange={e => { setMvFps(e.target.value); setMvTouched(true); }}
            style={{ ...inputSt, width: 130, fontFamily: "Rajdhani,sans-serif", fontSize: "1.35rem", fontWeight: 700, color: G }}
          />
          <span style={{ fontSize: "1rem", color: G, fontWeight: 700, fontFamily: "Rajdhani,sans-serif" }}>fps</span>
          {activeMv > 0 && (
            <span style={{ fontSize: "0.85rem", color: M, fontFamily: "Rajdhani,sans-serif" }}>
              = {activeMv} m/s
            </span>
          )}
        </div>
        <p style={{ fontSize: "0.68rem", color: dropWarning === t.dropUsingCatalog ? "#FF8844" : M, margin: "8px 0 0", lineHeight: 1.45, fontStyle: "italic" }}>
          {mvHint}
        </p>
      </div>
    </Field>
  );

  return (
    <div style={{ background: D, minHeight: "100%", overflowX: "hidden" }}>
      <SliderStyles />
      <PageHeader title={t.title} lang={lang} onToggleLang={toggleLang} />

      <Card>
        <div style={{ padding: "14px 16px 16px" }}>
          <Field label={t.myRifles}>
            {savedRifles.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: M, fontStyle: "italic", lineHeight: 1.6, marginBottom: 10 }}>
                {t.noRiflesSaved}
              </p>
            ) : (
              <select
                value={mode === "view" && selectedId ? selectedId : ""}
                onChange={e => { if (e.target.value) selectRifle(e.target.value); }}
                style={selectSt}
              >
                <option value="" disabled>{t.emptyPlaceholder}</option>
                {savedRifles.map(r => (
                  <option key={r.id} value={r.id}>
                    {`${r.name} — ${r.caliber} · ${rifleAmmoType(r) === "factory" ? (lang === "en" ? "Factory" : "Fabriek") : (lang === "en" ? "Reload" : "Herlaai")}`}
                  </option>
                ))}
              </select>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button type="button" className="th-btn3d" disabled={!viewedRifle} onClick={startEdit}>
                {t.edit}
              </button>
              <button type="button" className="th-btn3d th-btn3d-delete" disabled={!viewedRifle} onClick={handleDelete}>
                {t.delete}
              </button>
              <button type="button" className="th-btn3d th-btn3d-add" onClick={startNew}>
                {t.add}
              </button>
            </div>
          </Field>

          {mode === "view" && viewedRifle && (
            <>
              <div style={{ padding: "10px 12px", background: D, borderRadius: 8, border: `1px solid ${G}40`, margin: "12px 0 4px" }}>
                <div style={{ fontSize: "0.62rem", color: M, marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>{t.ballisticProfile}</div>
                <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "0.95rem", color: C, lineHeight: 1.5 }}>
                  <span style={{ color: G, fontWeight: 700 }}>{viewedRifle.name}</span>
                  <span style={{ color: M }}> · </span>
                  <span>{viewedRifle.caliber}</span>
                  <span style={{ color: M }}> · </span>
                  <span style={{ color: M, fontSize: "0.8rem" }}>
                    {rifleAmmoType(viewedRifle) === "factory" ? t.boughtAmmo : t.reloadedAmmo}
                  </span>
                </div>
                <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "0.88rem", color: C, lineHeight: 1.5, marginTop: 4 }}>
                  <span>{viewedRifle.bulletName}</span>
                  <span style={{ color: M }}> · </span>
                  <span style={{ color: G, fontWeight: 700 }}>{viewedRifle.bc.toFixed(3)} G1</span>
                  <span style={{ color: M }}> · </span>
                  <span style={{ color: G, fontWeight: 700 }}>{Math.round(viewedRifle.mv * 3.28084)} fps</span>
                  <span style={{ color: M }}> ({Math.round(viewedRifle.mv)} m/s)</span>
                  <span style={{ color: M }}> · </span>
                  <span>{viewedRifle.zeroDist}m {t.zero}</span>
                </div>
              </div>
              <HoldoverLadderTable ladder={viewLadder} labels={tableLabels} />
            </>
          )}

          {mode === "form" && (
            <>
              <Field label={t.rifleName}>
                <input type="text" value={rifleName} onChange={e => setRifleName(e.target.value)} placeholder="My Rem 700 .308" style={inputSt} />
              </Field>

              <Field label={t.caliber}>
                <select value={caliber} onChange={e => handleCaliberChange(e.target.value)} style={selectSt}>
                  {Object.entries(CALIBER_GROUPS).map(([grp, cals]) => (
                    <optgroup key={grp} label={grp}>
                      {(cals as string[]).map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                  ))}
                </select>
              </Field>

              <Field label={t.ammoType}>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setAmmoType("factory")}
                    style={{
                      flex: 1, padding: "12px 10px", minHeight: 52, borderRadius: 10, cursor: "pointer",
                      border: `2px solid ${ammoType === "factory" ? G : B}`,
                      background: ammoType === "factory" ? G + "20" : P,
                      color: ammoType === "factory" ? G : C,
                      fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "0.9rem",
                    }}
                  >
                    {t.boughtAmmo}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmmoType("reload")}
                    style={{
                      flex: 1, padding: "12px 10px", minHeight: 52, borderRadius: 10, cursor: "pointer",
                      border: `2px solid ${ammoType === "reload" ? G : B}`,
                      background: ammoType === "reload" ? G + "20" : P,
                      color: ammoType === "reload" ? G : C,
                      fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "0.9rem",
                    }}
                  >
                    {t.reloadedAmmo}
                  </button>
                </div>
                <p style={{ fontSize: "0.72rem", color: M, margin: "8px 0 0", lineHeight: 1.45, fontStyle: "italic" }}>
                  {ammoType === "factory" ? t.boughtAmmoHint : t.reloadedAmmoHint}
                </p>
              </Field>

              {ammoType === "factory" ? (
                <>
                  <Field label={t.bullet}>
                    <select key={caliber} value={bulletId} onChange={e => setBulletId(e.target.value)} style={selectSt}>
                      {bulletsForCal.map(b => (
                        <option key={b.id} value={b.id}>{b.name} · {b.grains}gr · BC {b.bc_g1.toFixed(3)}</option>
                      ))}
                    </select>
                    {selectedPreset && (
                      <div style={{ display: "flex", gap: 12, marginTop: 7, padding: "7px 10px", background: D, borderRadius: 7, border: `1px solid ${B}`, flexWrap: "wrap" }}>
                        <Stat label="BC G1" value={selectedPreset.bc_g1.toFixed(3)} />
                        <Stat label={t.grain} value={`${selectedPreset.grains}gr`} />
                        <Stat label={t.mvPreset} value={`${selectedPreset.muzzle_velocity_ms}m/s`} />
                        <Stat label={t.use} value={selectedPreset.use_case} />
                      </div>
                    )}
                  </Field>
                  <Field label={t.barrelLength}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {(["20", "22", "24", "26"] as const).map(bl => (
                        <Tog key={bl} active={barrelLength === bl} onClick={() => setBarrelLength(bl)}>{bl}&quot;</Tog>
                      ))}
                    </div>
                  </Field>
                </>
              ) : (
                <>
                  <Field label={t.bulletTip}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {TIP_TYPES.map(tip => (
                        <button
                          key={tip.id}
                          type="button"
                          onClick={() => setTipType(tip.id)}
                          style={{
                            flex: "1 1 calc(50% - 3px)",
                            minHeight: 44,
                            padding: "8px 10px",
                            borderRadius: 8,
                            border: `2px solid ${tipType === tip.id ? tip.color : B}`,
                            background: tipType === tip.id ? tip.color + "22" : P,
                            color: tipType === tip.id ? tip.color : C,
                            fontFamily: "Rajdhani,sans-serif",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: tip.color, flexShrink: 0 }} />
                          {lang === "en" ? tip.en : tip.af}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label={t.bulletName}>
                    <input type="text" value={reloadName} onChange={e => setReloadName(e.target.value)} placeholder={lang === "en" ? "e.g. 140gr ELD-X handload" : "bv. 140gr ELD-X handlading"} style={inputSt} />
                  </Field>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <Field label={t.maker}>
                      <input type="text" value={maker} onChange={e => setMaker(e.target.value)} placeholder="Hornady" style={inputSt} />
                    </Field>
                    <Field label={t.grain}>
                      <input type="number" min={20} max={1000} step={1} value={grains} onChange={e => setGrains(e.target.value)} placeholder="140" style={inputSt} />
                    </Field>
                  </div>
                  <Field label="BC G1">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="number" min={0.05} max={1.5} step={0.001} value={bcManual} onChange={e => setBcManual(e.target.value)} placeholder="0.610" style={{ ...inputSt, width: 140 }} />
                      <span style={{ fontSize: "0.75rem", color: M }}>G1 ballistic coefficient</span>
                    </div>
                  </Field>
                </>
              )}

              <Field label={t.zeroDistance}>
                <DistSlider min={50} max={300} step={50} value={zeroDist} onChange={setZeroDist} ticks={[50, 100, 150, 200, 250, 300]} />
              </Field>

              {mvSection}

              <Btn onClick={handleSave} disabled={!isRifleConfigured} gold>
                {saveMsg || (editingId ? t.updateRifle : t.saveRifle)}
              </Btn>
              {!isRifleConfigured && (
                <p style={{ fontSize: "0.75rem", color: M, fontStyle: "italic", margin: "8px 0 0" }}>{t.configureFirst}</p>
              )}
              <p style={{ fontSize: "0.68rem", color: M, margin: "10px 0 0", opacity: 0.8 }}>{t.signInSync}</p>

              {isRifleConfigured && draftLadder.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <HoldoverLadderTable ladder={draftLadder} labels={tableLabels} />
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
