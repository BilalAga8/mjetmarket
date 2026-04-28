-- schema_v12: add phone number to vehicles

alter table vehicles add column if not exists phone text;
