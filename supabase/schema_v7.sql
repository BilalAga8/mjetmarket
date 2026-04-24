-- ============================================================
-- FIX: infinite recursion në policies të profiles
-- Politika "admin reads all profiles" bënte query te profiles
-- brenda policies të profiles — recursion e pafund.
-- Zgjidhja: lexo rolin nga JWT (app_metadata) jo nga DB.
-- ============================================================

-- Hiq policën rekursive
drop policy if exists "admin reads all profiles" on profiles;

-- Zëvendëso me kontroll nga JWT — nuk bën query te DB
create policy "admin reads all profiles" on profiles for select using (
  auth.uid() = id
  or (auth.jwt()->'app_metadata'->>'role') = 'admin'
);
