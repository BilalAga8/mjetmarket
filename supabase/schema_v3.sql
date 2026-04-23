-- ============================================================
-- PROFILES — lidhet me auth.users, ruan rolin e perdoruesit
-- ============================================================
create table if not exists profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  emri      text not null default '',
  mbiemri   text not null default '',
  telefoni  text not null default '',
  role      text not null default 'user', -- 'user' | 'admin'
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "user reads own profile"   on profiles for select using (auth.uid() = id);
create policy "user updates own profile" on profiles for update using (auth.uid() = id);
create policy "admin reads all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Trigger: krijon profile automatikisht kur regjistrohet perdoruesi i ri
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, emri, mbiemri, telefoni, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'emri',    ''),
    coalesce(new.raw_user_meta_data->>'mbiemri', ''),
    coalesce(new.raw_user_meta_data->>'telefoni',''),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- SERVICES — servise dhe partnerë
-- ============================================================
create table if not exists services (
  id          serial primary key,
  name        text    not null,
  category    text    not null,
  city        text    not null,
  address     text    not null default '',
  phone       text    not null default '',
  website     text    not null default '',
  verified    boolean not null default false,
  logo        text    not null default '',
  description text    not null default '',
  created_at  timestamptz default now()
);

alter table services enable row level security;

create policy "anyone reads services" on services for select using (true);
create policy "admin manages services" on services for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Fut të dhënat statike ekzistuese
insert into services (name, category, city, address, phone, website, verified, logo, description) values
  ('Servis A&B',              'Servis Mekanik',         'Tiranë',  'Rruga Dritan Hoxha, nr. 12',         '069 111 2233', 'servisab.al',    true,  'AB', 'Servis i përgjithshëm mekanik për të gjitha markat'),
  ('Xhenerike Juli Motorrist','Servis Mekanik',         'Durrës',  'Lagjia 1, Rruga Tregtare, nr. 45',   '068 222 3344', '',               true,  'JM', 'Specializuar në motor dhe transmision'),
  ('Xhenerik Edi Elektroauto','Elektrik & Elektronikë', 'Tiranë',  'Rruga e Kavajës, nr. 89',            '067 333 4455', 'elektroauto.al', true,  'EE', 'Sisteme elektrike, diagnozë kompjuterike, airbag'),
  ('ColorPro Bojaxhi',        'Bojaxhi',                'Tiranë',  'Autostrada Tiranë-Durrës, km 3',     '069 444 5566', 'colorpro.al',    true,  'CP', 'Rikolorim profesional, ndreqje karoserie dhe zingozim'),
  ('LederAuto Veshje',        'Veshje & Tapeçi',        'Tiranë',  'Rruga Myslym Shyri, nr. 34',         '066 555 6677', '',               false, 'LA', 'Veshje sedilje me lëkurë, tapeçi, plafone dhe dysheme'),
  ('ClearView Xhama',         'Xhama',                  'Shkodër', 'Rruga 28 Nëntorit, nr. 7',           '065 666 7788', '',               false, 'CV', 'Zëvendësim dhe ngjim xhamash, xhama të zinj profesional'),
  ('AutoStyle Aksesore',      'Aksesore',               'Tiranë',  'Qendra Tregtare TEG, kati 0',        '069 777 8899', 'autostyle.al',   true,  'AS', 'Aksesore makinash, sisteme audio, kamera, alarm dhe tuning')
on conflict do nothing;
