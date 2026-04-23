-- Tabelat për ShitetMakina

-- Porositë e pjesëve këmbimi
create table if not exists part_requests (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  phone         text not null,
  vin           text not null,
  vehicle_make  text not null,
  vehicle_model text not null,
  vehicle_year  text not null,
  part_description text not null,
  product_quality  text,
  extra_notes   text,
  status        text not null default 'pritje',
  assigned_partner text,
  admin_notes   text,
  client_price  text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Partnerët e pjesëve këmbimi
create table if not exists part_partners (
  id        text primary key,
  name      text not null,
  city      text not null,
  discount  int not null default 0,
  phone     text,
  logo      text,
  type      text not null default 'dropshipping'
);

-- Kategoritë e pjesëve këmbimi
create table if not exists part_categories (
  id           text primary key,
  name         text not null,
  name_en      text,
  icon         text,
  description  text,
  display_order int default 0,
  active       boolean default true
);

-- Mesazhet e kontaktit
create table if not exists contact_messages (
  id        uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone     text not null,
  message   text not null,
  seen      boolean default false,
  created_at timestamptz default now()
);

-- RLS policies — lejon lexim/shkrim publik për tani (do shtrëngojmë më vonë me auth)
alter table part_requests enable row level security;
alter table part_partners enable row level security;
alter table part_categories enable row level security;
alter table contact_messages enable row level security;

create policy "allow all" on part_requests for all using (true) with check (true);
create policy "allow all" on part_partners for all using (true) with check (true);
create policy "allow all" on part_categories for all using (true) with check (true);
create policy "allow all" on contact_messages for all using (true) with check (true);
