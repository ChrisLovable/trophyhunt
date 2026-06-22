import { G } from "@/lib/app/brand";
import { calcClicks, calcMOA } from "@/lib/ballistics/holdover-math";
import type { CalData } from "@/lib/ballistics/calibration";
import type { BallisticsResult } from "@/lib/types/ballistics";

const HOOF  = "#4A9EFF";
const RED   = "#E00000";
const WHITE = "#FFFFFF";

export function drawShoulderHoofLines(
  canvas: HTMLCanvasElement,
  W: number, H: number,
  shoulderY: number, groundY: number,
  shoulderHeightCm: number, labels = true,
) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  canvas.style.width = W + "px"; canvas.style.height = H + "px";
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const shY = shoulderY * H; const gY = groundY * H;
  const fSz = Math.max(10, H * 0.027);
  function sText(text: string, x: number, y: number, color: string, sz: number, bold = false) {
    ctx.save(); ctx.font = `${bold?"700":"600"} ${sz}px Rajdhani,sans-serif`;
    ctx.shadowColor="rgba(0,0,0,0.85)"; ctx.shadowBlur=4; ctx.shadowOffsetX=1; ctx.shadowOffsetY=1;
    ctx.fillStyle=color; ctx.fillText(text,x,y); ctx.restore();
  }
  ctx.setLineDash([10,8]); ctx.lineWidth=2.5; ctx.strokeStyle=G;
  ctx.beginPath(); ctx.moveTo(0,shY); ctx.lineTo(W,shY); ctx.stroke();
  ctx.strokeStyle=HOOF; ctx.beginPath(); ctx.moveTo(0,gY); ctx.lineTo(W,gY); ctx.stroke();
  ctx.setLineDash([]);
  if (labels) { ctx.textAlign="left"; sText("Shoulder · Skouer",8,shY-6,G,fSz*0.85,true); sText("Hoof/Base · Hoef",8,gY-6,HOOF,fSz*0.85,true); }
  const BX=44; ctx.strokeStyle=G; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(BX,shY); ctx.lineTo(BX,gY); ctx.stroke();
  [shY,gY].forEach(y=>{ctx.beginPath();ctx.moveTo(BX-4,y);ctx.lineTo(BX+4,y);ctx.stroke();});
  ctx.textAlign="right"; sText(`${shoulderHeightCm}cm`,BX-8,(shY+gY)/2+fSz*0.35,G,fSz,true);
  for (const {y,color} of [{y:shY,color:G},{y:gY,color:HOOF}]) {
    ctx.beginPath(); ctx.arc(W-16,y,8,0,Math.PI*2); ctx.fillStyle=color; ctx.fill();
    ctx.strokeStyle="#0D0F0A"; ctx.lineWidth=2; ctx.stroke();
  }
}

export function drawCanvas(
  canvas: HTMLCanvasElement,
  W: number, H: number,
  ladder: BallisticsResult[],
  highlightDist: number,
  highlightRow: BallisticsResult | null,
  zeroDist: number,
  cal: CalData,
  lineSetMode: boolean,
  showGuideLines = false,
  windage_cm = 0,
) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  canvas.style.width = W + "px"; canvas.style.height = H + "px";
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const gY  = cal.ground_y   * H;
  const shY = cal.shoulder_y * H;
  const vX  = cal.vital_x   * W;
  const vY  = cal.vital_y   * H;
  const ppc = (gY - shY) > 0 ? (gY - shY) / cal.shoulder_height_cm : 1;
  const windage_px = -windage_cm * ppc;
  const aboveZero = ladder.filter(r => r.distance_m > zeroDist);
  const fSz = Math.max(10, H * 0.027);

  function sText(text: string, x: number, y: number, color: string, sz: number, bold = false) {
    ctx.save(); ctx.font = `${bold?"700":"600"} ${sz}px Rajdhani,sans-serif`;
    ctx.shadowColor="rgba(0,0,0,0.85)"; ctx.shadowBlur=4; ctx.shadowOffsetX=1; ctx.shadowOffsetY=1;
    ctx.fillStyle=color; ctx.fillText(text,x,y); ctx.restore();
  }

  if (showGuideLines) {
    ctx.setLineDash([10,8]); ctx.lineWidth=lineSetMode?2.5:1.5; ctx.strokeStyle=G;
    ctx.beginPath(); ctx.moveTo(0,shY); ctx.lineTo(W,shY); ctx.stroke();
    ctx.strokeStyle=HOOF; ctx.beginPath(); ctx.moveTo(0,gY); ctx.lineTo(W,gY); ctx.stroke();
    ctx.setLineDash([]);
    if (lineSetMode) { ctx.textAlign="left"; sText("Shoulder · Skouer",8,shY-6,G,fSz*0.85,true); sText("Hoof/Base · Hoef",8,gY-6,HOOF,fSz*0.85,true); }
    const BX=44; ctx.strokeStyle=G; ctx.lineWidth=1.5; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(BX,shY); ctx.lineTo(BX,gY); ctx.stroke();
    [shY,gY].forEach(y=>{ctx.beginPath();ctx.moveTo(BX-4,y);ctx.lineTo(BX+4,y);ctx.stroke();});
    ctx.textAlign="right"; sText(`${cal.shoulder_height_cm}cm`,BX-8,(shY+gY)/2+fSz*0.35,G,fSz,true);
  }

  const DOT_R=7; const HIGHLIGHT_R=10; const TOP_MARGIN=DOT_R+10;
  function aimY(hoCm: number) { return vY - hoCm * ppc; }
  function dotY(hoCm: number) { return Math.max(TOP_MARGIN, aimY(hoCm)); }
  function fitsOnImage(hoCm: number) { return aimY(hoCm) >= TOP_MARGIN; }

  const fittingRows = aboveZero.filter(r => fitsOnImage(r.holdover_cm));
  const lastFitting = fittingRows.length > 0 ? fittingRows[fittingRows.length-1] : null;
  const hasClippedAbove = aboveZero.some(r => !fitsOnImage(r.holdover_cm));

  if (aboveZero.length > 0) {
    const topY = lastFitting ? aimY(lastFitting.holdover_cm) : dotY(aboveZero[aboveZero.length-1].holdover_cm);
    ctx.beginPath(); ctx.moveTo(vX,vY); ctx.lineTo(vX,topY);
    ctx.strokeStyle="rgba(255,255,255,0.18)"; ctx.lineWidth=1; ctx.setLineDash([]); ctx.stroke();
  }

  // Zero/vital dot — green
  ctx.beginPath(); ctx.arc(vX,vY,DOT_R,0,Math.PI*2); ctx.fillStyle="#50C878cc"; ctx.fill();
  ctx.strokeStyle="#50C878"; ctx.lineWidth=1.5; ctx.setLineDash([]); ctx.stroke();
  ctx.beginPath(); ctx.arc(vX,vY,2.5,0,Math.PI*2); ctx.fillStyle="#50C878"; ctx.fill();
  ctx.textAlign="left"; sText(`${zeroDist}m`,vX+DOT_R+7,vY+fSz*0.35,WHITE,fSz,true);

  const labelPositions: Array<{dist:number;dy:number}> = [];
  labelPositions.push({dist:zeroDist,dy:vY});
  aboveZero.forEach(row => { if (row.distance_m%100===0 && fitsOnImage(row.holdover_cm)) labelPositions.push({dist:row.distance_m,dy:aimY(row.holdover_cm)}); });
  const suppressed = new Set<number>();
  for (let i=0;i<labelPositions.length;i++) {
    if (suppressed.has(labelPositions[i].dist)) continue;
    for (let j=i+1;j<labelPositions.length;j++) {
      if (Math.abs(labelPositions[i].dy-labelPositions[j].dy)<15) suppressed.add(Math.min(labelPositions[i].dist,labelPositions[j].dist));
    }
  }

  aboveZero.forEach((row,i) => {
    if (row.distance_m===highlightDist) return;
    const isMajor=row.distance_m%100===0; const onImage=fitsOnImage(row.holdover_cm); const dy=dotY(row.holdover_cm);
    ctx.beginPath(); ctx.arc(vX,dy,DOT_R,0,Math.PI*2); ctx.fillStyle=row.zone_color+"cc"; ctx.fill();
    ctx.strokeStyle=row.zone_color; ctx.lineWidth=1.4; ctx.stroke();
    if (!isMajor||!onImage||suppressed.has(row.distance_m)) return;
    if (hasClippedAbove&&lastFitting&&row.distance_m===lastFitting.distance_m) return;
    const lbl=`${row.distance_m}m`; ctx.font=`600 ${fSz}px Rajdhani,sans-serif`;
    const lw=ctx.measureText(lbl).width; const wantRight=i%2===0;
    const rightOK=vX+DOT_R+8+lw+4<W-6; const leftOK=vX-DOT_R-8-lw-4>6;
    const onRight=wantRight?rightOK||!leftOK:leftOK?false:rightOK?true:!wantRight;
    const lx=onRight?vX+DOT_R+8:vX-DOT_R-8;
    ctx.textAlign=onRight?"left":"right"; sText(lbl,lx,dy+fSz*0.38,WHITE,fSz,true);
  });

  if (hasClippedAbove&&lastFitting) { ctx.textAlign="center"; sText(`▲ ${lastFitting.distance_m}m`,vX,TOP_MARGIN-2,WHITE,fSz,true); }

  if (highlightRow && highlightDist > zeroDist) {
    const dy  = dotY(highlightRow.holdover_cm);
    const wX  = vX + windage_px;
    const hasWind = Math.abs(windage_cm) > 0.3;

    // Horizontal windage ruler
    if (hasWind) {
      const minSpan  = Math.max(20, Math.abs(windage_cm)*2.5);
      const spanLeft  = Math.min(minSpan, (vX-8)/ppc);
      const spanRight = Math.min(minSpan, (W-vX-8)/ppc);
      const rulerLeft  = vX - spanLeft  * ppc;
      const rulerRight = vX + spanRight * ppc;
      const ry = dy;
      ctx.beginPath(); ctx.moveTo(rulerLeft,ry); ctx.lineTo(rulerRight,ry);
      ctx.strokeStyle=WHITE; ctx.lineWidth=2; ctx.setLineDash([]); ctx.stroke();
      const tL=Math.floor(spanLeft/10)*10; const tR=Math.floor(spanRight/10)*10;
      for (let c=-tL;c<=tR;c+=10) {
        const tx=vX+c*ppc;
        if (tx<rulerLeft-1||tx>rulerRight+1) continue;
        ctx.beginPath(); ctx.moveTo(tx,ry-10); ctx.lineTo(tx,ry+10);
        ctx.strokeStyle=WHITE; ctx.lineWidth=2; ctx.stroke();
        if (c!==0) { ctx.textAlign="center"; sText(`${Math.abs(c)}`,tx,ry-12,WHITE,fSz,true); }
      }
      ctx.beginPath(); ctx.moveTo(vX,ry-13); ctx.lineTo(vX,ry+13);
      ctx.strokeStyle="#50C878"; ctx.lineWidth=2.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(vX,ry); ctx.lineTo(wX,ry);
      ctx.strokeStyle=RED; ctx.lineWidth=2.5; ctx.stroke();
    }

    // Red highlight dot
    ctx.save(); ctx.shadowColor=RED; ctx.shadowBlur=10;
    ctx.beginPath(); ctx.arc(wX,dy,HIGHLIGHT_R,0,Math.PI*2); ctx.fillStyle=RED; ctx.fill();
    ctx.restore(); ctx.strokeStyle=WHITE; ctx.lineWidth=2; ctx.stroke();

    // Info box — top-left corner, white bg, black text
    const hoCm  = highlightRow.holdover_cm < 0.5 ? 0 : Math.round(highlightRow.holdover_cm);
    const hoMOA = calcMOA(highlightRow.holdover_cm, highlightDist);
    const hoClk = calcClicks(highlightRow.holdover_cm, highlightDist);
    const wCm   = Math.abs(windage_cm);
    const wMOA  = calcMOA(wCm, highlightDist);
    const wClk  = calcClicks(wCm, highlightDist);
    const wDir  = windage_cm > 0.3 ? "\u2190" : windage_cm < -0.3 ? "\u2192" : "";
    const line1 = `${Math.round(highlightDist)}m  \u2191${hoCm}cm  ${hoMOA.toFixed(1)}MOA  ${hoClk}clk`;
    const line2 = hasWind ? `${wDir} ${wCm.toFixed(1)}cm  ${wMOA.toFixed(1)}MOA  ${wClk}clk` : "";
    const lines = hasWind ? [line1, line2] : [line1];
    const bFsz  = Math.max(16, H * 0.040);
    ctx.font = `700 ${bFsz}px Rajdhani,sans-serif`;
    const boxW = Math.max(...lines.map(l => ctx.measureText(l).width)) + 14;
    const boxH = lines.length * bFsz * 1.4 + 8;
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.beginPath(); ctx.roundRect(6, 6, boxW, boxH, 4); ctx.fill();
    ctx.fillStyle = "#111111"; ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
    ctx.textAlign = "left";
    lines.forEach((line, i) => { ctx.fillText(line, 12, 6 + bFsz * 1.1 + i * bFsz * 1.4); });
  }
}