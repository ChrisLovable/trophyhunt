import { supabase } from "@/lib/supabase";
import type { SavedRifle } from "@/lib/rifle/storage";

export async function sbSaveRifle(r: SavedRifle): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { error } = await supabase.from("rifle_setups").insert({
      hunter_id: user.id,
      name: r.name,
      caliber: r.caliber,
      bullet_name: r.bulletName,
      bc_g1: r.bc,
      muzzle_vel_ms: r.mv,
      zero_dist_m: r.zeroDist,
    });
    return !error;
  } catch {
    return false;
  }
}
