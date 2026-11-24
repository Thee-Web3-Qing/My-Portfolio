ALTER TABLE class_registrations
  ADD COLUMN IF NOT EXISTS welcome_email_claimed_at timestamptz,
  ADD COLUMN IF NOT EXISTS welcome_email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS welcome_email_id text,
  ADD COLUMN IF NOT EXISTS welcome_email_error text;
