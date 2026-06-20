import { NextRequest, NextResponse } from "next/server";
import { SPECIES } from "@/lib/types/species";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { species_id, species_name } = body as { species_id?: string; species_name?: string };

  const species = SPECIES.find(s => s.id === species_id);
  if (!species) {
    return NextResponse.json({ error: "Species not found" }, { status: 404 });
  }

  const imagePath   = species.image_path; // e.g. "/animals/kudu.png"
  const ext         = path.extname(imagePath).toLowerCase();
  const mediaType   = (ext === ".jpg" || ext === ".jpeg") ? "image/jpeg" : "image/png";
  const absPath     = path.join(process.cwd(), "public", imagePath);

  let imageBase64: string;
  try {
    imageBase64 = fs.readFileSync(absPath).toString("base64");
  } catch {
    return NextResponse.json({ error: "Image file not found", path: imagePath }, { status: 404 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const prompt = `This is a side-profile hunting photo of a ${species_name ?? species.name_en}.
Analyze carefully and return ONLY valid JSON with no other text:
{
  "ground_y": 0.0,
  "shoulder_y": 0.0,
  "spine_y": 0.0,
  "vital_x": 0.0,
  "vital_y": 0.0,
  "vital_radius": 0.0
}
ground_y = y fraction (0-1) where hooves touch the ground
shoulder_y = y fraction of top of shoulder/withers
spine_y = y fraction of top of back/spine line
vital_x = x fraction of heart/lung centre (behind front leg)
vital_y = y fraction of heart/lung centre
vital_radius = radius of vital zone as fraction of image height
Vital zone is behind the front leg, 1/3 up from belly to spine.
Return only the JSON object.`;

  let aiText = "";
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 512,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
            { type: "text", text: prompt },
          ],
        }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: "Anthropic API error", details: errText }, { status: 502 });
    }

    const data = await res.json();
    aiText = (data.content?.[0]?.text ?? "") as string;
  } catch (err) {
    return NextResponse.json({ error: "Network error calling Anthropic", details: String(err) }, { status: 502 });
  }

  try {
    const match = aiText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    const parsed = JSON.parse(match[0]);
    // Validate and clamp all values
    const clamp = (v: unknown, lo: number, hi: number, fallback: number) =>
      typeof v === "number" && isFinite(v) ? Math.min(hi, Math.max(lo, v)) : fallback;
    return NextResponse.json({
      ground_y:       clamp(parsed.ground_y,      0.5, 0.98, 0.90),
      shoulder_y:     clamp(parsed.shoulder_y,    0.05, 0.70, 0.32),
      spine_y:        clamp(parsed.spine_y,       0.03, 0.60, 0.25),
      vital_x:        clamp(parsed.vital_x,       0.05, 0.90, 0.40),
      vital_y:        clamp(parsed.vital_y,       0.20, 0.85, 0.60),
      vital_radius:   clamp(parsed.vital_radius,  0.02, 0.20, 0.07),
    });
  } catch {
    return NextResponse.json({ error: "Could not parse AI response", raw: aiText }, { status: 500 });
  }
}
