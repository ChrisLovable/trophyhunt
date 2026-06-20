export interface BulletPreset {
  id: string; name: string; maker: string; caliber: string;
  grains: number; bc_g1: number;
  muzzle_velocity_fps: number; muzzle_velocity_ms: number;
  use_case: string; tip_type: "lead"|"polymer"|"hollow"|"solid"; color: string;
}
export interface AtmosphericConditions {
  altitude_m: number; temperature_c: number; pressure_hpa: number;
  humidity_pct: number; wind_speed_ms: number; wind_direction_deg: number;
}
export interface BallisticsResult {
  distance_m: number; holdover_cm: number; velocity_ms: number;
  time_of_flight_s: number; zone: "vital"|"neck"|"backline"|"above"|"extreme";
  zone_label: string; zone_color: string; aim_description: string;
}
export interface RifleSetup {
  caliber: string; bullet: BulletPreset; zero_distance_m: number;
  atmospheric?: Partial<AtmosphericConditions>;
}