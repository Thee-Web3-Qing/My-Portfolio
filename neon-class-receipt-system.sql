-- Neon migration for the Classroom receipt-verification flow.
-- The API stores the private receipt, its fingerprint, extracted transaction
-- reference and review data together in Neon.

begin;

alter table public.class_registrations
add column if not exists receipt_mime text,
add column if not exists receipt_data bytea;

create unique index if not exists class_registrations_receipt_hash_unique
on public.class_registrations (payment_reference)
where payment_reference is not null;

create unique index if not exists class_registrations_transaction_reference_unique
on public.class_registrations (transaction_reference)
where transaction_reference is not null;

create unique index if not exists class_registrations_email_unique
on public.class_registrations (lower(btrim(email)))
where email is not null and btrim(email) <> '';

create unique index if not exists class_registrations_whatsapp_unique
on public.class_registrations (whatsapp)
where whatsapp is not null and btrim(whatsapp) <> '';

commit;
