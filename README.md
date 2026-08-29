# My-Portfolio

My portfolio.

## Server environment

The server-side `/api/class-pricing` route should receive the existing pricing service through a server-only Vercel variable:

```text
CLASS_PRICING_SOURCE_URL
```

This variable must not use the `VITE_` prefix. As an alternative, the route can query the shared database with `SUPABASE_URL` and either `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY`.
