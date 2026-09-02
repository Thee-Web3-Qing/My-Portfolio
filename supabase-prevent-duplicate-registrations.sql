-- Run once in the shared class Supabase project's SQL editor.
-- Prevents a person from registering again with the same email or WhatsApp number.
-- Existing records are preserved. Failed submissions that never created a registration
-- remain safe to retry.

begin;

create or replace function public.normalise_class_phone(value text)
returns text
language sql
immutable
strict
set search_path = ''
as $$
  select case
    when length(regexp_replace(value, '[^0-9]', '', 'g')) = 11
      and regexp_replace(value, '[^0-9]', '', 'g') like '0%'
      then '234' || substring(regexp_replace(value, '[^0-9]', '', 'g') from 2)
    when length(regexp_replace(value, '[^0-9]', '', 'g')) = 10
      then '234' || regexp_replace(value, '[^0-9]', '', 'g')
    else regexp_replace(value, '[^0-9]', '', 'g')
  end
$$;

create table if not exists public.class_registration_identities (
  identity text primary key,
  registration_id uuid not null references public.class_registrations(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.class_registration_identities enable row level security;
revoke all on public.class_registration_identities from anon, authenticated;

-- Reserve the email and phone identities already used by existing students.
-- If older duplicate records exist, the earliest record owns that identity.
insert into public.class_registration_identities (identity, registration_id, created_at)
select distinct on (identity) identity, registration_id, created_at
from (
  select
    'email:' || lower(btrim(email)) as identity,
    id as registration_id,
    created_at
  from public.class_registrations
  where email is not null and btrim(email) <> ''

  union all

  select
    'phone:' || public.normalise_class_phone(whatsapp) as identity,
    id as registration_id,
    created_at
  from public.class_registrations
  where whatsapp is not null and public.normalise_class_phone(whatsapp) <> ''
) existing_identities
order by identity, created_at asc
on conflict (identity) do nothing;

create or replace function public.reserve_class_registration_identities()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is not null and btrim(new.email) <> '' then
    insert into public.class_registration_identities (identity, registration_id)
    values ('email:' || lower(btrim(new.email)), new.id);
  end if;

  if new.whatsapp is not null and public.normalise_class_phone(new.whatsapp) <> '' then
    insert into public.class_registration_identities (identity, registration_id)
    values ('phone:' || public.normalise_class_phone(new.whatsapp), new.id);
  end if;

  return new;
exception
  when unique_violation then
    raise exception 'This email address or WhatsApp number is already registered.'
      using errcode = '23505', constraint = 'class_registration_identity_unique';
end;
$$;

drop trigger if exists reserve_class_registration_identities
on public.class_registrations;

create trigger reserve_class_registration_identities
after insert on public.class_registrations
for each row execute function public.reserve_class_registration_identities();

create or replace function public.check_class_registration(
  p_email text,
  p_whatsapp text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  found_status text;
begin
  select registrations.payment_status
  into found_status
  from public.class_registration_identities identities
  join public.class_registrations registrations
    on registrations.id = identities.registration_id
  where identities.identity in (
    'email:' || lower(btrim(coalesce(p_email, ''))),
    'phone:' || public.normalise_class_phone(coalesce(p_whatsapp, ''))
  )
  limit 1;

  return jsonb_build_object(
    'exists', found_status is not null,
    'payment_status', found_status
  );
end;
$$;

revoke all on function public.check_class_registration(text, text) from public;
grant execute on function public.check_class_registration(text, text) to anon, authenticated;

commit;
