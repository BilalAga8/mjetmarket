-- ============================================================
-- SLUG — URL të pastra për makinat
-- ============================================================

-- 1. Shto kolonën slug
alter table vehicles
  add column if not exists slug text unique;

-- 2. Funksion për gjenerimin e slug-ut
create or replace function generate_vehicle_slug(
  p_brand text, p_model text, p_year int, p_id uuid
) returns text language sql as $$
  select lower(
    regexp_replace(
      regexp_replace(
        p_brand || '-' || p_model || '-' || p_year::text || '-' || left(p_id::text, 8),
        '[^a-z0-9-]', '-', 'gi'
      ),
      '-+', '-', 'g'
    )
  )
$$;

-- 3. Gjenero slug për makinat ekzistuese
update vehicles
set slug = generate_vehicle_slug(brand, model, year, id)
where slug is null;

-- 4. Trigger — çdo makinë e re merr slug automatikisht
create or replace function set_vehicle_slug()
returns trigger language plpgsql as $$
begin
  if new.slug is null then
    new.slug := generate_vehicle_slug(new.brand, new.model, new.year, new.id);
  end if;
  return new;
end;
$$;

create or replace trigger vehicle_slug_before_insert
  before insert on vehicles
  for each row execute function set_vehicle_slug();
