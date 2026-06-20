import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { SPECIES } from "@/lib/types/species";

const ALLOWED = new Set(
  SPECIES.flatMap((s) => {
    const f = s.image_path.replace(/^\/animals\//, "");
    return [f, f.replace(/\.jpe?g$/i, ".png"), f.replace(/\.png$/i, ".jpg")];
  }),
);

export async function POST(req: Request) {
  try {
    const body = await req.json() as { filename?: string; image?: string };
    const { filename, image } = body;

    if (!filename || !image) {
      return Response.json({ error: "filename and image required" }, { status: 400 });
    }

    if (!ALLOWED.has(filename)) {
      return Response.json({ error: "Unknown animal filename" }, { status: 400 });
    }

    const base64 = image.replace(/^data:image\/png;base64,/, "");
    if (!base64 || base64.length < 100) {
      return Response.json({ error: "Invalid image data" }, { status: 400 });
    }

    const buf = Buffer.from(base64, "base64");
    const dir = path.join(process.cwd(), "public", "animals");
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, filename);
    await writeFile(filePath, buf);

    return Response.json({ ok: true, path: `/animals/${filename}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Write failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
