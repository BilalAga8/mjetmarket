-- schema_v10: real-time chat

create table if not exists chats (
  id          uuid default gen_random_uuid() primary key,
  vehicle_id  uuid references vehicles on delete cascade not null,
  buyer_id    uuid references auth.users on delete cascade not null,
  seller_id   uuid references auth.users on delete cascade not null,
  created_at  timestamptz default now(),
  unique(vehicle_id, buyer_id)
);

alter table chats enable row level security;

create policy "participants_read_chat" on chats
  for select using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "buyer_create_chat" on chats
  for insert with check (auth.uid() = buyer_id);

create table if not exists chat_messages (
  id        uuid default gen_random_uuid() primary key,
  chat_id   uuid references chats on delete cascade not null,
  sender_id uuid references auth.users on delete cascade not null,
  body      text not null,
  read      boolean not null default false,
  created_at timestamptz default now()
);

alter table chat_messages enable row level security;

create policy "participants_read_messages" on chat_messages
  for select using (
    exists (
      select 1 from chats
      where chats.id = chat_id
        and (chats.buyer_id = auth.uid() or chats.seller_id = auth.uid())
    )
  );

create policy "participants_insert_messages" on chat_messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from chats
      where chats.id = chat_id
        and (chats.buyer_id = auth.uid() or chats.seller_id = auth.uid())
    )
  );

create policy "participants_update_messages" on chat_messages
  for update using (
    exists (
      select 1 from chats
      where chats.id = chat_id
        and (chats.buyer_id = auth.uid() or chats.seller_id = auth.uid())
    )
  );

alter publication supabase_realtime add table chat_messages;
