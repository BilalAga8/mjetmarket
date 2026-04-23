-- ============================================================
-- SUPABASE STORAGE — bucket për imazhet e makinave
-- ============================================================

-- 1. Krijo bucket publik
insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do nothing;

-- 2. Storage RLS policies

-- Lexim publik (bucket është public, por e shtojmë explicit)
create policy "vehicle images public read"
  on storage.objects for select
  using (bucket_id = 'vehicle-images');

-- Upload: vetëm userët e autentikuar
create policy "vehicle images authenticated upload"
  on storage.objects for insert
  with check (
    bucket_id = 'vehicle-images'
    and auth.role() = 'authenticated'
  );

-- Fshij: vetëm pronari i skedarit (owner) ose admini
create policy "vehicle images delete own"
  on storage.objects for delete
  using (
    bucket_id = 'vehicle-images'
    and (
      owner = auth.uid()
      or exists (
        select 1 from profiles where id = auth.uid() and role = 'admin'
      )
    )
  );
