-- schema_v9: vehicle_inquiries + notifications + trigger

create table if not exists vehicle_inquiries (
  id          uuid default gen_random_uuid() primary key,
  vehicle_id  uuid references vehicles on delete cascade not null,
  name        text not null,
  phone       text,
  message     text,
  created_at  timestamptz default now()
);

alter table vehicle_inquiries enable row level security;

create policy "anyone_insert_inquiry" on vehicle_inquiries
  for insert with check (true);

create policy "owner_read_inquiry" on vehicle_inquiries
  for select using (
    exists (
      select 1 from vehicles
      where vehicles.id = vehicle_id
        and vehicles.user_id = auth.uid()
    )
  );

create table if not exists notifications (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  vehicle_id  uuid references vehicles on delete cascade,
  body        text not null,
  read        boolean not null default false,
  created_at  timestamptz default now()
);

alter table notifications enable row level security;

create policy "owner_read_notification" on notifications
  for select using (auth.uid() = user_id);

create policy "owner_update_notification" on notifications
  for update using (auth.uid() = user_id);

create or replace function notify_on_inquiry()
returns trigger language plpgsql security definer as $$
declare
  owner_id   uuid;
  veh_brand  text;
  veh_model  text;
begin
  select user_id, brand, model
    into owner_id, veh_brand, veh_model
    from vehicles
   where id = NEW.vehicle_id;

  if owner_id is not null then
    insert into notifications (user_id, vehicle_id, body)
    values (
      owner_id,
      NEW.vehicle_id,
      NEW.name || ' u interesua për ' || veh_brand || ' ' || veh_model
    );
  end if;
  return NEW;
end;
$$;

create trigger on_vehicle_inquiry
  after insert on vehicle_inquiries
  for each row execute function notify_on_inquiry();
