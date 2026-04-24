# StandbyHealth MVP

Starter implementation for a physician-supervised, AI-assisted second-opinion platform built with Next.js, Supabase, Supabase Storage, and Supabase Edge Functions.

## What is included

- Next.js App Router scaffold with public, patient, and physician routes
- Tailwind-based premium healthcare UI starter
- Case intake flow with Zod + React Hook Form
- Supabase client helpers for browser, server, and admin contexts
- Supabase SQL migration for tables, triggers, RLS, and private storage policies
- Supabase Edge Functions for `submit-case`, `generate-case-summary`, and `deliver-review`
- `.env.example` with the required variables

## Important HIPAA note

This repo is built with a HIPAA-minded architecture, not a guarantee of HIPAA compliance by itself.

For an actual HIPAA rollout, you still need:

- Signed BAAs with every vendor involved
- A legal/compliance review of physician scope, state licensing, and cross-border operations
- Audit logging, incident response, access reviews, backup/retention policies, and workforce training
- A verified PHI data flow review before enabling AI processing on live patient records
- Careful review of whether any AI vendor is allowed to receive PHI under your contractual setup

Do not market the product as HIPAA compliant until those operational and legal controls are in place.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add your Supabase project values.

4. Start the app:

```bash
npm run dev
```

## Supabase setup

1. Create a Supabase project.
2. Apply the migration in [supabase/migrations/202604240001_init_standbyhealth.sql](/Users/jagshetty/src/drroshanmvp/supabase/migrations/202604240001_init_standbyhealth.sql).
3. Deploy the edge functions in [supabase/functions](/Users/jagshetty/src/drroshanmvp/supabase/functions).
4. Confirm the private storage bucket `case-documents` exists.
5. Create at least one `physician` or `admin` profile row for dashboard testing.

## Vercel deployment

1. Import the repo into Vercel.
2. Add the same environment variables from `.env.local`.
3. Keep the frontend on Vercel and backend services on Supabase.
4. If you enable AI summarization in production, route it through a reviewed PHI-safe configuration and verify your vendor agreements first.

## Recommended next build steps

- Replace the auth placeholders with Supabase auth actions and session-aware layouts
- Wire the patient and physician pages from `mockCases` to live data queries
- Add a real upload widget that inserts into `case_documents` after storage upload
- Add audit logging for case status changes and review delivery
- Add structured physician templates and notification delivery

## Current limitations

- The UI still uses fallback mock data when Supabase is not configured
- Uploads are represented with a placeholder component, not a finished uploader
- The edge function AI path is optional and falls back to a deterministic summary when no API key is configured
- No payment flow has been added yet
# secondlymvp
