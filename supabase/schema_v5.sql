-- ============================================================
-- SHOPS — dyqanet sponsor (gold / silver / bronze)
-- ============================================================
create table if not exists shops (
  id          serial primary key,
  name        text    not null,
  city        text    not null,
  address     text    not null default '',
  phone       text    not null default '',
  website     text    not null default '',
  verified    boolean not null default false,
  logo        text    not null default '',
  package     text    not null default 'bronze', -- 'bronze' | 'silver' | 'gold'
  created_at  timestamptz default now()
);

alter table shops enable row level security;

create policy "anyone reads shops"  on shops for select using (true);
create policy "admin manages shops" on shops for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Migro të dhënat statike nga data/shops.ts
insert into shops (name, city, address, phone, website, verified, logo, package) values
  ('AutoParts Tirana', 'Tiranë',  'Rruga e Kavajës, nr. 142',      '069 123 4567', 'autoparts-tirana.al', true,  'AP', 'gold'),
  ('EuroPieces',       'Durrës',  'Bulevardi Epidamn, nr. 34',      '068 234 5678', 'europieces.al',       true,  'EP', 'silver'),
  ('Motor Shop',       'Shkodër', 'Rruga 13 Dhjetori, nr. 8',       '067 345 6789', '',                    false, 'MS', 'bronze'),
  ('AlbaParts',        'Vlorë',   'Rruga Sadik Zotaj, nr. 21',      '066 456 7890', 'albaparts.al',        true,  'AL', 'silver')
on conflict do nothing;
