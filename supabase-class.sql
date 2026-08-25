-- Run this once in the Supabase SQL editor used by Qing's TV.

create table if not exists public.class_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  whatsapp text not null,
  email text,
  reason text not null,
  reason_category text not null default 'Other',
  mentorship_interest text not null default 'Not answered',
  receipt_path text not null,
  receipt_name text not null,
  receipt_size integer not null,
  payment_status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.class_registrations enable row level security;

drop policy if exists "Anyone can submit a class registration" on public.class_registrations;
create policy "Anyone can submit a class registration"
on public.class_registrations for insert
to anon, authenticated
with check (
  char_length(full_name) between 3 and 120
  and char_length(whatsapp) between 10 and 20
  and char_length(reason) between 20 and 2000
  and receipt_size > 0
  and receipt_size <= 10485760
  and payment_status = 'pending'
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('class-receipts', 'class-receipts', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];

drop policy if exists "Anyone can upload a class receipt PDF" on storage.objects;
drop policy if exists "Anyone can upload a class receipt file" on storage.objects;
create policy "Anyone can upload a class receipt file"
on storage.objects for insert
to anon, authenticated
with check (
  bucket_id = 'class-receipts'
  and (storage.foldername(name))[1] = 'receipts'
  and lower(storage.extension(name)) in ('pdf', 'jpg', 'jpeg', 'png', 'heic', 'heif', 'webp')
);

create index if not exists class_registrations_created_at_idx
on public.class_registrations (created_at desc);

create index if not exists class_registrations_category_idx
on public.class_registrations (reason_category);
