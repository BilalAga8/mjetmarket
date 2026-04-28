-- schema_v11: libri i shënimeve për makina

create table if not exists libri_makina (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users on delete cascade not null,
  marka         text not null,
  modeli        text not null,
  viti          int not null,
  vin           text,
  ngjyra        text,
  targa         text,
  blere_me      date,
  km_fillestare int,
  shenime       text,
  created_at    timestamptz default now()
);

alter table libri_makina enable row level security;

create policy "owner_all_libri_makina" on libri_makina
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists libri_shenime (
  id          uuid default gen_random_uuid() primary key,
  makina_id   uuid references libri_makina on delete cascade not null,
  user_id     uuid references auth.users on delete cascade not null,
  data        date not null default current_date,
  kategoria   text not null check (kategoria in (
    'Mirëmbajtje', 'Karburant', 'Riparim', 'Kontroll Teknik',
    'Larje', 'Dokumentacion', 'Aksident', 'Tjetër'
  )),
  titulli     text not null,
  pershkrimi  text,
  cmimi       numeric(10,2),
  kilometrat  int,
  created_at  timestamptz default now()
);

alter table libri_shenime enable row level security;

create policy "owner_all_libri_shenime" on libri_shenime
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
