import { G } from "@/lib/app/brand";
import { calcClicks } from "@/lib/ballistics/holdover-math";
import type { CalData } from "@/lib/ballistics/calibration";
import type { BallisticsResult } from "@/lib/types/ballistics";

const HOOF = "#4A9EFF";

/** Shoulder + hoof horizontal lines and height bracket — used on calibration tool. */
export function drawShoulderHoofLines(
  canvas: HTMLCanvasElement,
  W: number,
  H: number,
  shoulderY: number,
  groundY: number,
  shoulderHeightCm: number,
  labels = true,
) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const shY = shoulderY * H;
  const gY = groundY * H;
  const fSz = Math.max(10, H * 0.027);

  function sText(text: string, x: number, y: number, color: string, sz: number, bold = false) {
    ctx.save();
    ctx.font = `${bold ? "700" : "600"} ${sz}px Rajdhani,sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  ctx.setLineDash([10, 8]);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = G;
  ctx.beginPath();
  ctx.moveTo(0, shY);
  ctx.lineTo(W, shY);
  ctx.stroke();
  ctx.strokeStyle = HOOF;
  ctx.beginPath();
  ctx.moveTo(0, gY);
  ctx.lineTo(W, gY);
  ctx.stroke();
  ctx.setLineDash([]);

  if (labels) {
    ctx.textAlign = "left";
    sText("Shoulder · Skouer", 8, shY - 6, G, fSz * 0.85, true);
    sText("Hoof/Base · Hoef", 8, gY - 6, HOOF, fSz * 0.85, true);
  }

  const BX = 44;
  ctx.strokeStyle = G;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(BX, shY);
  ctx.lineTo(BX, gY);
  ctx.stroke();
  [shY, gY].forEach(y => {
    ctx.beginPath();
    ctx.moveTo(BX - 4, y);
    ctx.lineTo(BX + 4, y);
    ctx.stroke();
  });
  ctx.textAlign = "right";
  sText(`${shoulderHeightCm}cm`, BX - 8, (shY + gY) / 2 + fSz * 0.35, G, fSz, true);

  // Drag handles on the right
  for (const { y, color } of [{ y: shY, color: G }, { y: gY, color: HOOF }]) {
    ctx.beginPath();
    ctx.arc(W - 16, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#0D0F0A";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export function drawCanvas(
  canvas: HTMLCanvasElement,
  W: number,
  H: number,
  ladder: BallisticsResult[],
  highlightDist: number,
  highlightRow: BallisticsResult | null,
  zeroDist: number,
  cal: CalData,
  lineSetMode: boolean,
  showGuideLines = false,
) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const gY = cal.ground_y * H;
  const shY = cal.shoulder_y * H;
  const vX = cal.vital_x * W;
  const vY = cal.vital_y * H;
  const ppc = (gY - shY) > 0 ? (gY - shY) / cal.shoulder_height_cm : 1;
  const aboveZero = ladder.filter(r => r.distance_m > zeroDist);
  const fSz = Math.max(10, H * 0.027);

  function sText(text: string, x: number, y: number, color: string, sz: number, bold = false) {
    ctx.save();
    ctx.font = `${bold ? "700" : "600"} ${sz}px Rajdhani,sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  const HOOF_COLOR = "#4A9EFF";
  if (showGuideLines) {
    ctx.setLineDash([10, 8]);
    ctx.lineWidth = lineSetMode ? 2.5 : 1.5;
    ctx.strokeStyle = G;
    ctx.beginPath();
    ctx.moveTo(0, shY);
    ctx.lineTo(W, shY);
    ctx.stroke();
    ctx.strokeStyle = HOOF_COLOR;
    ctx.beginPath();
    ctx.moveTo(0, gY);
    ctx.lineTo(W, gY);
    ctx.stroke();
    ctx.setLineDash([]);
    if (lineSetMode) {
      ctx.textAlign = "left";
      sText("Shoulder · Skouer", 8, shY - 6, G, fSz * 0.85, true);
      sText("Hoof/Base · Hoef", 8, gY - 6, HOOF_COLOR, fSz * 0.85, true);
    }

    const BX = 44;
    ctx.strokeStyle = G;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(BX, shY);
    ctx.lineTo(BX, gY);
    ctx.stroke();
    [shY, gY].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(BX - 4, y);
      ctx.lineTo(BX + 4, y);
      ctx.stroke();
    });
    ctx.textAlign = "right";
    sText(`${cal.shoulder_height_cm}cm`, BX - 8, (shY + gY) / 2 + fSz * 0.35, G, fSz, true);
  }

  const DOT_R = 7;          // uniform radius for every distance dot
  const HIGHLIGHT_R = 10;   // selected distance dot
  const ORANGE = "#FF6B00";
  const TOP_MARGIN = DOT_R + 10;

  function aimY(hoCm: number) {
    return vY - hoCm * ppc;
  }

  function dotY(hoCm: number) {
    return Math.max(TOP_MARGIN, aimY(hoCm));
  }

  function fitsOnImage(hoCm: number) {
    return aimY(hoCm) >= TOP_MARGIN;
  }

  const fittingRows = aboveZero.filter(r => fitsOnImage(r.holdover_cm));
  const lastFitting = fittingRows.length > 0 ? fittingRows[fittingRows.length - 1] : null;
  const hasClippedAbove = aboveZero.some(r => !fitsOnImage(r.holdover_cm));

  if (aboveZero.length > 0) {
    const topY = lastFitting
      ? aimY(lastFitting.holdover_cm)
      : dotY(aboveZero[aboveZero.length - 1].holdover_cm);
    ctx.beginPath();
    ctx.moveTo(vX, vY);
    ctx.lineTo(vX, topY);
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(vX, vY, DOT_R, 0, Math.PI * 2);
  ctx.fillStyle = "#50C878cc";
  ctx.fill();
  ctx.strokeStyle = "#50C878";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(vX, vY, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = "#50C878";
  ctx.fill();
  ctx.textAlign = "left";
  sText(`${zeroDist}m`, vX + DOT_R + 7, vY + fSz * 0.35, "white", fSz, true);

  // Label 100 m rungs that actually fit on the image.
  const labelPositions: Array<{ dist: number; dy: number }> = [];
  labelPositions.push({ dist: zeroDist, dy: vY });
  aboveZero.forEach(row => {
    if (row.distance_m % 100 === 0 && fitsOnImage(row.holdover_cm))
      labelPositions.push({ dist: row.distance_m, dy: aimY(row.holdover_cm) });
  });
  const suppressed = new Set<number>();
  for (let i = 0; i < labelPositions.length; i++) {
    if (suppressed.has(labelPositions[i].dist)) continue;
    for (let j = i + 1; j < labelPositions.length; j++) {
      if (Math.abs(labelPositions[i].dy - labelPositions[j].dy) < 15)
        suppressed.add(Math.min(labelPositions[i].dist, labelPositions[j].dist));
    }
  }

  aboveZero.forEach((row, i) => {
    if (row.distance_m === highlightDist) return; // selected dot drawn separately

    const isMajor = row.distance_m % 100 === 0;
    const onImage = fitsOnImage(row.holdover_cm);
    const dy = dotY(row.holdover_cm);

    ctx.beginPath();
    ctx.arc(vX, dy, DOT_R, 0, Math.PI * 2);
    ctx.fillStyle = row.zone_color + "cc";
    ctx.fill();
    ctx.strokeStyle = row.zone_color;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    if (!isMajor || !onImage || suppressed.has(row.distance_m)) return;
    if (hasClippedAbove && lastFitting && row.distance_m === lastFitting.distance_m) return;

    const lbl = `${row.distance_m}m`;
    ctx.font = `600 ${fSz}px Rajdhani,sans-serif`;
    const lw = ctx.measureText(lbl).width;
    const wantRight = i % 2 === 0;
    const rightOK = vX + DOT_R + 8 + lw + 4 < W - 6;
    const leftOK = vX - DOT_R - 8 - lw - 4 > 6;
    const onRight = wantRight ? rightOK || !leftOK : leftOK ? false : rightOK ? true : !wantRight;
    const lx = onRight ? vX + DOT_R + 8 : vX - DOT_R - 8;
    ctx.textAlign = onRight ? "left" : "right";
    sText(lbl, lx, dy + fSz * 0.38, "white", fSz, true);
  });

  // One top cap label: furthest distance that still fits (not an off-screen 1000 m).
  if (hasClippedAbove && lastFitting) {
    ctx.textAlign = "center";
    sText(`▲ ${lastFitting.distance_m}m`, vX, TOP_MARGIN - 2, "white", fSz, true);
  }

  if (highlightRow && highlightDist > zeroDist) {
    const onImage = fitsOnImage(highlightRow.holdover_cm);
    const dy = dotY(highlightRow.holdover_cm);

    ctx.save();
    ctx.shadowColor = ORANGE;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(vX, dy, HIGHLIGHT_R, 0, Math.PI * 2);
    ctx.fillStyle = ORANGE;
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();

    const clicks = calcClicks(highlightRow.holdover_cm, highlightDist);
    const hoCm = highlightRow.holdover_cm < 0.5 ? 0 : Math.round(highlightRow.holdover_cm);
    const lbl = `${Math.round(highlightDist)}m  ${hoCm}cm  ${clicks} clicks`;
    ctx.font = `700 ${fSz}px Rajdhani,sans-serif`;
    const lw = ctx.measureText(lbl).width;
    const labelY = onImage ? dy + fSz * 0.38 : TOP_MARGIN + fSz * 0.9;
    const rightOK = vX + HIGHLIGHT_R + 8 + lw + 4 < W - 6;
    const lx = rightOK ? vX + HIGHLIGHT_R + 8 : vX - HIGHLIGHT_R - 8;
    ctx.textAlign = rightOK ? "left" : "right";
    sText(lbl, lx, labelY, ORANGE, fSz, true);
  }
}
