-- Per-species calibrated shoulder height (cm) for holdover scale
alter table if exists animal_calibrations
  add column if not exists shoulder_height_cm numeric;
