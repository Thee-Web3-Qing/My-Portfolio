# My-Portfolio

My portfolio.

## Server environment

The server-side `/api/class-pricing` route requires the shared class database URL and one private Supabase server key in Vercel:

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
```

`SUPABASE_SERVICE_ROLE_KEY` is also supported for projects still using the legacy key name. Private Supabase keys must never use the `VITE_` prefix.
