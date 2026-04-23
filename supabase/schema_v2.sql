-- Tabela e makinave/mjeteve
create table if not exists vehicles (
  id            uuid primary key default gen_random_uuid(),
  category      text not null default 'Makinë',
  brand         text not null,
  model         text not null,
  year          int not null,
  price         int not null,
  km            int not null default 0,
  fuel          text not null default 'Naftë',
  transmission  text not null default 'Automatik',
  hp            int default 0,
  engine_cc     int default 0,
  consumption   numeric(4,1) default 0,
  origin        text default '',
  color         text default '',
  doors         int,
  tire_condition int,
  city          text,
  exchange      text,
  sponsored     boolean default false,
  featured      boolean default false,
  images        text[] default '{}',
  features      text[] default '{}',
  description   text,
  created_at    timestamptz default now()
);

-- Fut partnerët fillestarë
insert into part_partners (id, name, city, discount, phone, logo, type) values
  ('A', 'AutoParts Tirana',   'Tiranë',  10, '+355 69 111 1111', 'AP', 'dropshipping'),
  ('B', 'SpeedParts Albania', 'Durrës',  5,  '+355 68 222 2222', 'SP', 'dropshipping'),
  ('C', 'Mekanik Pro',        'Tiranë',  15, '+355 67 333 3333', 'MP', 'direct'),
  ('D', 'AL Auto Spare',      'Shkodër', 20, '+355 69 444 4444', 'AA', 'direct')
on conflict (id) do nothing;

-- RLS për vehicles
alter table vehicles enable row level security;
create policy "allow all" on vehicles for all using (true) with check (true);
