/** Try .png / .jpg alternates — giraffe was .jpg while assets are usually .png */
export function animalImageCandidates(imagePath: string): string[] {
  const out = [imagePath];
  if (/\.jpe?g$/i.test(imagePath)) {
    out.push(imagePath.replace(/\.jpe?g$/i, ".png"));
  } else if (/\.png$/i.test(imagePath)) {
    out.push(imagePath.replace(/\.png$/i, ".jpg"));
  }
  return Array.from(new Set(out));
}

export function bakedImageFilename(imagePath: string): string {
  const base = imagePath.replace(/^\/animals\//, "");
  return base.replace(/\.jpe?g$/i, ".png");
}

export function loadAnimalImageElement(
  imagePath: string,
  cacheBust = 0,
): Promise<{ img: HTMLImageElement; resolvedPath: string }> {
  const candidates = animalImageCandidates(imagePath);
  const suffix = cacheBust ? `?v=${cacheBust}` : `?t=${Date.now()}`;

  function tryLoad(index: number): Promise<{ img: HTMLImageElement; resolvedPath: string }> {
    if (index >= candidates.length) {
      return Promise.reject(new Error(`Could not load animal image: ${imagePath}`));
    }
    const path = candidates[index];
    const img = new Image();
    img.crossOrigin = "anonymous";
    return new Promise((resolve, reject) => {
      img.onload = () => resolve({ img, resolvedPath: path });
      img.onerror = () => {
        tryLoad(index + 1).then(resolve).catch(reject);
      };
      img.src = `${path}${suffix}`;
    });
  }

  return tryLoad(0);
}
