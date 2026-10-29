-- Neon migration for the Classroom receipt-verification flow.
-- The API stores the private receipt file in Vercel Blob and stores its
-- fingerprint, extracted transaction reference and review data in Neon.

begin;

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
