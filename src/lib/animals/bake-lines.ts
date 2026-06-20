import { loadAnimalImageElement } from "@/lib/animals/animal-image";

const G = "#C8A96E";
const HOOF = "#4A9EFF";

export interface BakeLineOptions {
  shoulderPct: number;
  hoofPct: number;
  shoulderHeightCm: number;
}

/** Bake shoulder/hoof lines + height bracket label into a PNG data URL. */
export async function bakeAnimalLines(
  imagePath: string,
  { shoulderPct, hoofPct, shoulderHeightCm }: BakeLineOptions,
): Promise<string> {
  const { img } = await loadAnimalImageElement(imagePath);

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  ctx.drawImage(img, 0, 0);

  const shY = (shoulderPct / 100) * canvas.height;
  const gY = (hoofPct / 100) * canvas.height;
  const dashLw = Math.max(2, Math.round(canvas.height * 0.004));
  const solidLw = Math.max(2, Math.round(canvas.height * 0.003));
  const tick = Math.max(4, Math.round(canvas.height * 0.006));
  const BX = Math.max(44, Math.round(canvas.width * 0.06));

  ctx.lineWidth = dashLw;
  ctx.setLineDash([12, 8]);
  for (const { y, color } of [{ y: shY, color: G }, { y: gY, color: HOOF }]) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  ctx.lineWidth = solidLw;
  ctx.strokeStyle = G;
  ctx.beginPath();
  ctx.moveTo(BX, shY);
  ctx.lineTo(BX, gY);
  ctx.stroke();
  for (const y of [shY, gY]) {
    ctx.beginPath();
    ctx.moveTo(BX - tick, y);
    ctx.lineTo(BX + tick, y);
    ctx.stroke();
  }

  const fSz = Math.max(14, Math.round(canvas.height * 0.027));
  ctx.font = `700 ${fSz}px Rajdhani,sans-serif`;
  ctx.fillStyle = G;
  ctx.textAlign = "right";
  ctx.shadowColor = "rgba(0,0,0,0.85)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.fillText(`${shoulderHeightCm}cm`, BX - tick * 2, (shY + gY) / 2 + fSz * 0.35);
  ctx.shadowBlur = 0;

  return canvas.toDataURL("image/png");
}
