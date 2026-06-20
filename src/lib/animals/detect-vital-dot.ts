/**
 * Each baked animal image has a small solid blue dot marking the vital
 * impact point. This scans the loaded image for that marker and returns its
 * centre as {x, y} fractions (0–1). Returns null if no marker is found.
 *
 * The blue dashed *hoof* line (same colour) sits near the bottom of the image,
 * so the bottom ~15% is ignored to isolate the compact body marker.
 */
export function detectVitalDot(img: HTMLImageElement): { x: number; y: number } | null {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh) return null;

  // Downscale for speed; the centroid stays accurate.
  const scale = Math.min(1, 360 / nw);
  const w = Math.max(1, Math.round(nw * scale));
  const h = Math.max(1, Math.round(nh * scale));

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(img, 0, 0, w, h);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, w, h).data;
  } catch {
    return null; // tainted canvas — give up gracefully
  }

  const yLimit = Math.floor(h * 0.85); // skip the blue hoof line near the base
  let sx = 0;
  let sy = 0;
  let n = 0;

  for (let y = 0; y < yLimit; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 200) continue;
      // Marker is ~rgb(74,158,255): blue strongly dominant, not pale sky.
      if (b > 150 && b > r + 60 && b > g + 40 && r < 150) {
        sx += x;
        sy += y;
        n++;
      }
    }
  }

  if (n < 3) return null;
  return { x: sx / n / w, y: sy / n / h };
}
