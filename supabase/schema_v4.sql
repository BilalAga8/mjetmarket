-- ============================================================
-- VEHICLES — shto user_id (pronari i postimit) + RLS reale
-- ============================================================

-- 1. Shto kolonën user_id (nullable — makinat ekzistuese/admin mbeten null)
alter table vehicles
  add column if not exists user_id uuid references auth.users(id) on delete set null;

-- 2. Hiq policën e vjetër "allow all"
drop policy if exists "allow all" on vehicles;

-- 3. Politika të reja

-- Lexim publik — kushdo mund të shohë makina
create policy "vehicles_select_public"
  on vehicles for select
  using (true);

-- Insert: user i autentikuar me user_id = auth.uid(), OSE admini (user_id mund të jetë null)
create policy "vehicles_insert"
  on vehicles for insert
  with check (
    auth.uid() = user_id
    or exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Update: vetëm pronari ose admini
create policy "vehicles_update"
  on vehicles for update
  using (
    auth.uid() = user_id
    or exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Delete: vetëm pronari ose admini
create policy "vehicles_delete"
  on vehicles for delete
  using (
    auth.uid() = user_id
    or exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );
