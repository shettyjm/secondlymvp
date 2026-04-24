# StandbyHealth MVP Build Spec

## Product Summary

StandbyHealth is a physician-supervised digital health platform for rapid, affordable medical second opinions. Patients upload medical records, labs, imaging references, and questions. AI helps summarize and triage the case, and a licensed US physician reviews, edits, and delivers a structured, patient-friendly written opinion.

The MVP should be polished, credible, and production-minded without being over-engineered. The target early wedge is adult children in the US helping aging parents abroad, especially families dealing with fragmented WhatsApp PDFs, lab reports, imaging reports, medications, and confusing care plans.

## MVP Positioning

Build the MVP as an educational physician-reviewed second-opinion workflow, not as emergency care or a replacement for local medical treatment.

Core promise:

> Upload records. Explain your concern. Receive a physician-reviewed written second opinion in plain English.

Primary audience:

- NRI / immigrant families in the US helping parents or relatives abroad
- Families facing serious diagnoses, surgeries, ICU/hospitalization confusion, or conflicting medical advice
- People who need clarity from a trusted physician without waiting weeks or paying enterprise-level second-opinion pricing

## Tech Stack

Use this stack:

- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- UI: shadcn/ui style components or clean custom Tailwind components
- Auth: Supabase Auth
- Database: Supabase Postgres
- File storage: Supabase Storage for medical document uploads
- Backend: Supabase Edge Functions for server-side case processing and AI orchestration
- Email notifications: provider abstraction, with placeholder implementation initially
- Payments: Stripe placeholder integration, but keep it optional for MVP
- Deployment: Vercel for frontend, Supabase for backend services

Keep the architecture simple and robust. Avoid unnecessary microservices for MVP.

## Design Direction

The UI should feel trustworthy, premium, calm, and medical-grade.

Style:

- Clean white background
- Deep navy, medical blue, muted teal, soft gray accents
- Large readable typography
- Rounded cards, subtle shadows, generous spacing
- Mobile-first responsive layout
- Professional but warm, avoiding hospital-clinic coldness

Avoid:

- Overly flashy gradients
- Too much text on the landing page
- Complex dashboard interactions
- Dark hacker-style UI

## Main User Roles

### 1. Patient / Family User

Can:

- Create account / sign in
- Start a new case
- Fill structured intake form
- Upload documents
- Add top concerns and questions
- Track case status
- Read final physician-reviewed opinion

### 2. Physician Reviewer / Admin

Can:

- Sign in to physician dashboard
- View case queue
- Open case detail
- Review patient intake
- View uploaded document metadata and links
- See AI-generated summary and triage fields
- Edit physician opinion draft
- Mark case as reviewed / delivered

For MVP, use a simple role field in the user profile table: `patient`, `physician`, `admin`.

## Core Pages

### Public Marketing Pages

#### `/`
Landing page with:

- Hero section
- Trust statement: physician-supervised, AI-assisted, patient-friendly
- Primary CTA: Get a second opinion
- Secondary CTA: See how it works
- Three-step workflow
  1. Upload records
  2. AI organizes the case
  3. US physician reviews and responds
- Use cases
  - Parent abroad
  - ICU/hospital confusion
  - New diagnosis
  - Surgery decision
  - Medication review
- Pricing preview card: placeholder pricing such as “Starting at $199” but make it configurable
- Compliance disclaimer
- FAQ

#### `/how-it-works`
Explain workflow in plain English.

#### `/pricing`
Simple pricing cards:

- Standard Written Review
- Expedited 24-48 Hour Review
- Optional Live Consult Add-on

These can be static initially.

#### `/legal/disclaimer`
Clear disclaimer:

- Not emergency care
- Not a replacement for local treating physician
- Educational second opinion / care navigation support
- Users should call local emergency services for urgent symptoms

### Auth Pages

#### `/login`
Supabase Auth login.

#### `/signup`
Supabase Auth signup.

### Patient App Pages

#### `/app`
Patient dashboard.

Show:

- Welcome card
- Start new case button
- Existing cases list
- Status chips: Draft, Submitted, AI Processing, Physician Review, Delivered

#### `/app/cases/new`
Multi-step case intake.

Steps:

1. Patient / family member details
2. Medical situation
3. Top concerns/questions
4. Upload records
5. Review and submit

Important fields:

- Patient name
- Patient age
- Patient location/country
- Relationship to user
- Diagnosis or main medical issue
- Current symptoms
- Current medications
- Treating hospital / doctor, optional
- Timeline of events
- Top 3 questions for physician
- Preferred turnaround
- Consent checkbox
- Disclaimer acknowledgement checkbox

#### `/app/cases/[id]`
Patient case detail page.

Show:

- Case status timeline
- Intake summary
- Uploaded documents list
- Physician final opinion when available
- Next steps / recommendation section

### Physician/Admin Pages

#### `/physician`
Physician case queue.

Show:

- Cases needing review
- Filters by status, urgency, submitted date
- Cards/table with patient age, issue, location, urgency score, submitted date

#### `/physician/cases/[id]`
Physician case review page.

Show:

- Patient intake
- Uploaded documents
- AI summary
- AI urgency / risk triage
- Editable physician opinion draft
- Structured final opinion sections:
  - Case summary
  - Key concerns
  - Questions to ask local doctor
  - Possible next steps
  - Red flags / when to seek urgent care
  - Medication / care-plan comments
  - Limitations of review
- Buttons:
  - Save draft
  - Mark under review
  - Deliver final opinion

## Database Schema

Create SQL migrations or Supabase-compatible schema for the following tables.

### `profiles`

- `id uuid primary key references auth.users(id)`
- `full_name text`
- `role text check role in ('patient', 'physician', 'admin') default 'patient'`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### `cases`

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid references auth.users(id) not null`
- `patient_name text not null`
- `patient_age int`
- `patient_country text`
- `relationship_to_patient text`
- `main_issue text not null`
- `diagnosis text`
- `current_symptoms text`
- `current_medications text`
- `timeline text`
- `top_questions text[]`
- `preferred_turnaround text`
- `status text check status in ('draft', 'submitted', 'ai_processing', 'physician_review', 'delivered', 'cancelled') default 'draft'`
- `urgency_score int`
- `urgency_label text`
- `created_at timestamptz default now()`
- `submitted_at timestamptz`
- `updated_at timestamptz default now()`

### `case_documents`

- `id uuid primary key default gen_random_uuid()`
- `case_id uuid references cases(id) on delete cascade not null`
- `user_id uuid references auth.users(id) not null`
- `file_name text not null`
- `file_path text not null`
- `file_type text`
- `file_size bigint`
- `document_category text`
- `created_at timestamptz default now()`

### `case_ai_summaries`

- `id uuid primary key default gen_random_uuid()`
- `case_id uuid references cases(id) on delete cascade not null`
- `summary text`
- `key_findings text[]`
- `risk_flags text[]`
- `suggested_questions text[]`
- `triage_rationale text`
- `model_name text`
- `created_at timestamptz default now()`

### `physician_reviews`

- `id uuid primary key default gen_random_uuid()`
- `case_id uuid references cases(id) on delete cascade not null`
- `physician_id uuid references auth.users(id)`
- `case_summary text`
- `key_concerns text`
- `recommendations text`
- `questions_for_local_doctor text`
- `red_flags text`
- `limitations text`
- `final_opinion text`
- `status text check status in ('draft', 'delivered') default 'draft'`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`
- `delivered_at timestamptz`

## Storage

Create a Supabase Storage bucket:

- Bucket name: `case-documents`
- Private bucket
- File path pattern: `{user_id}/{case_id}/{timestamp}-{filename}`

Use signed URLs for physician/admin review.

## Row Level Security

Enable RLS.

Rules:

- Patients can read/write their own profiles and cases.
- Patients can read/write documents only for their own cases.
- Physicians/admins can read submitted cases and related documents/summaries/reviews.
- Physicians/admins can update physician review records.
- Patients can read final delivered physician reviews for their own cases.

Do not expose all storage files publicly.

## Supabase Edge Functions

Create simple Edge Functions with clean interfaces.

### `submit-case`

Input:

- `case_id`

Behavior:

- Verify authenticated user owns the case
- Set status to `submitted`
- Set submitted_at
- Create placeholder AI summary job or call `generate-case-summary`

### `generate-case-summary`

Input:

- `case_id`

Behavior:

- Fetch case intake and document metadata
- Generate an AI-ready structured prompt
- For MVP, return a deterministic placeholder summary if no AI key is configured
- Store result in `case_ai_summaries`
- Update case status to `physician_review`
- Assign urgency score and label

### `deliver-review`

Input:

- `case_id`
- final review fields

Behavior:

- Verify user has physician/admin role
- Save review
- Mark review delivered
- Update case status to `delivered`
- Trigger placeholder email notification

## AI Prompt Used by Edge Function

Use this as the internal medical summarization prompt. Keep output cautious, structured, and non-diagnostic.

```
You are assisting a licensed physician reviewer. You are not making a diagnosis or final treatment decision. Summarize the patient-provided case information into a concise, clinically useful structure.

Return JSON with:
- one_paragraph_summary
- timeline
- current_medications
- key_findings
- missing_information
- red_flags
- suggested_questions_for_physician
- urgency_score_1_to_5
- urgency_rationale

Use plain English. Do not invent facts. If records are missing or unclear, say so.
```

## MVP Implementation Requirements

- Use TypeScript everywhere.
- Use server components where appropriate.
- Use client components only for forms, upload widgets, and interactive dashboards.
- Use Zod for form validation.
- Use React Hook Form for multi-step intake.
- Keep API/service logic in reusable modules.
- Add loading states, empty states, and basic error states.
- Use environment variables for Supabase URL, anon key, service role key where needed, and optional AI provider key.
- Avoid hardcoding secrets.
- Include a `.env.example`.
- Include README setup instructions.

## Suggested Folder Structure

```txt
app/
  page.tsx
  how-it-works/page.tsx
  pricing/page.tsx
  legal/disclaimer/page.tsx
  login/page.tsx
  signup/page.tsx
  app/page.tsx
  app/cases/new/page.tsx
  app/cases/[id]/page.tsx
  physician/page.tsx
  physician/cases/[id]/page.tsx
components/
  marketing/
  cases/
  physician/
  ui/
lib/
  supabase/
  auth/
  validators/
  storage/
  cases.ts
  reviews.ts
supabase/
  migrations/
  functions/
    submit-case/
    generate-case-summary/
    deliver-review/
```

## Seed Data

Create demo data for local development:

- One patient user
- One physician user
- Two sample cases
  - Parent abroad with cardiac concern
  - Cancer diagnosis second opinion
- One AI summary placeholder
- One draft physician review

## Acceptance Criteria

The MVP is complete when:

1. A user can sign up and create a patient profile.
2. A patient can create and submit a case.
3. A patient can upload documents to private storage.
4. A submitted case appears in the physician dashboard.
5. The system creates or displays an AI summary placeholder.
6. A physician/admin can draft and deliver a review.
7. The patient can view the delivered review.
8. The app has a polished, premium, mobile-responsive UI.
9. Legal/disclaimer language is visible before submission.
10. README explains setup, environment variables, Supabase migrations, and deployment.

## Important Safety and Legal UX Notes

Every patient-facing review page and intake submission should include:

- This is not emergency medical care.
- This is not a replacement for your local physician.
- For urgent symptoms, contact local emergency services immediately.
- The review is based only on uploaded/provided information.
- The physician may request more information before completing the review.

## Out of Scope for MVP

Do not build these yet:

- Native mobile app
- Full DICOM viewer
- Real-time chat
- Full claims/payment automation
- Complex physician matching
- Multi-region compliance automation
- Fine-tuned model pipeline
- Full EHR integration

