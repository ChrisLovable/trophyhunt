CREATE TABLE hunters (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL, club_name TEXT, province TEXT,
  language TEXT DEFAULT "en", created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE rifle_setups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunter_id UUID REFERENCES hunters(id) ON DELETE CASCADE,
  name TEXT NOT NULL, caliber TEXT NOT NULL, bullet_name TEXT NOT NULL,
  bc_g1 NUMERIC(5,3) NOT NULL, muzzle_vel_ms NUMERIC(6,1) NOT NULL,
  zero_dist_m INT DEFAULT 100, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE hunts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunter_id UUID REFERENCES hunters(id) ON DELETE CASCADE,
  rifle_setup_id UUID REFERENCES rifle_setups(id),
  species TEXT NOT NULL,
  shot_lat NUMERIC(10,6), shot_lng NUMERIC(10,6), shot_timestamp TIMESTAMPTZ DEFAULT NOW(),
  recovery_lat NUMERIC(10,6), recovery_lng NUMERIC(10,6), recovery_timestamp TIMESTAMPTZ,
  shot_to_recovery_m NUMERIC(8,1), estimated_shot_dist_m NUMERIC(6,1), holdover_used_cm NUMERIC(5,1),
  altitude_m INT, temperature_c NUMERIC(4,1), pressure_hpa NUMERIC(6,1),
  humidity_pct INT, wind_speed_ms NUMERIC(4,1), wind_dir_deg INT,
  status TEXT DEFAULT "shot" CHECK (status IN ("shot","recovered","lost")),
  notes TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE trophy_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID REFERENCES hunts(id) ON DELETE CASCADE,
  hunter_id UUID REFERENCES hunters(id),
  species TEXT NOT NULL, photo_url TEXT,
  horn_left_cm NUMERIC(5,1), horn_right_cm NUMERIC(5,1),
  base_circ_cm NUMERIC(5,1), sci_score NUMERIC(6,2),
  measurement_method TEXT CHECK (measurement_method IN ("vision_ai","manual","official")),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunter_id UUID REFERENCES hunters(id) ON DELETE CASCADE,
  hunt_id UUID REFERENCES hunts(id),
  photo_url TEXT, caption TEXT, species TEXT,
  shot_dist_m NUMERIC(6,1), horn_score NUMERIC(6,2),
  likes INT DEFAULT 0, is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE hunters ENABLE ROW LEVEL SECURITY;
ALTER TABLE rifle_setups ENABLE ROW LEVEL SECURITY;
ALTER TABLE hunts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trophy_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own hunters"  ON hunters             FOR ALL USING (auth.uid()=id);
CREATE POLICY "own rifles"   ON rifle_setups        FOR ALL USING (auth.uid()=hunter_id);
CREATE POLICY "own hunts"    ON hunts               FOR ALL USING (auth.uid()=hunter_id);
CREATE POLICY "own trophies" ON trophy_measurements FOR ALL USING (auth.uid()=hunter_id);
CREATE POLICY "public posts" ON community_posts     FOR SELECT USING (is_public=TRUE);
CREATE POLICY "own posts"    ON community_posts     FOR ALL USING (auth.uid()=hunter_id);