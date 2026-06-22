/**
 * Scans the loaded animal image for the small blue vital dot marker.
 * Returns centre as {x,y} fractions (0-1), or null if not found.
 *
 * Actual dot colour observed across species: R=0-30, G=80-150, B=150-220
 * The hoof/ground line has R=74+ so r<35 excludes it.
 * Bottom 15% skipped to avoid any ground-line pixels.
 * Compact cluster required to exclude scattered sky/background blue.
 */
export function detectVitalDot(img: HTMLImageElement): { x: number; y: number } | null {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh) return null;

  const scale = Math.min(1, 360 / nw);
  const w = Math.max(1, Math.round(nw * scale));
  const h = Math.max(1, Math.round(nh * scale));

  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, w, h);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, w, h).data;
  } catch (e) { console.warn("detectVitalDot: canvas tainted", e); return null; }

  const yLimit = Math.floor(h * 0.85);
  const qualifying: Array<{ x: number; y: number }> = [];

  for (let y = 0; y < yLimit; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 200) continue;
      // Match actual dot: R<35, G:70-155, B:140-225, B>R+100, B>G+50
      // Excludes hoof line (R=74), sky (high R+G), and general background
      if (r < 35 && g >= 70 && g <= 155 && b >= 140 && b <= 225
          && b - r > 100 && b - g > 50) {
        qualifying.push({ x, y });
      }
    }
  }

  if (qualifying.length < 3) return null;

  // Centroid of all qualifying pixels
  const cx = qualifying.reduce((s, p) => s + p.x, 0) / qualifying.length;
  const cy = qualifying.reduce((s, p) => s + p.y, 0) / qualifying.length;

  // Keep only pixels within 20px of centroid — rejects scattered background blue
  const clustered = qualifying.filter(p => Math.hypot(p.x - cx, p.y - cy) <= 20);
  if (clustered.length < 3) return null;

  const fx = clustered.reduce((s, p) => s + p.x, 0) / clustered.length;
  const fy = clustered.reduce((s, p) => s + p.y, 0) / clustered.length;

  const result = { x: fx / w, y: fy / h };
  console.log("detectVitalDot found:", result, `clustered=${clustered.length}`);
  return result;
}