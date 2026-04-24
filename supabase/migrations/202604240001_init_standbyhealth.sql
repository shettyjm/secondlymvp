create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'patient' check (role in ('patient', 'physician', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  patient_name text not null,
  patient_age int,
  patient_country text,
  relationship_to_patient text,
  main_issue text not null,
  diagnosis text,
  current_symptoms text,
  current_medications text,
  timeline text,
  top_questions text[] not null default '{}',
  preferred_turnaround text,
  status text not null default 'draft' check (
    status in ('draft', 'submitted', 'ai_processing', 'physician_review', 'delivered', 'cancelled')
  ),
  urgency_score int,
  urgency_label text,
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.case_documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_type text,
  file_size bigint,
  document_category text,
  created_at timestamptz not null default now()
);

create table if not exists public.case_ai_summaries (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  summary text,
  key_findings text[] not null default '{}',
  risk_flags text[] not null default '{}',
  suggested_questions text[] not null default '{}',
  triage_rationale text,
  model_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.physician_reviews (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null unique references public.cases(id) on delete cascade,
  physician_id uuid references auth.users(id) on delete set null,
  case_summary text,
  key_concerns text,
  recommendations text,
  questions_for_local_doctor text,
  red_flags text,
  limitations text,
  final_opinion text,
  status text not null default 'draft' check (status in ('draft', 'delivered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  delivered_at timestamptz
);

create index if not exists cases_user_id_idx on public.cases(user_id);
create index if not exists cases_status_idx on public.cases(status);
create index if not exists case_documents_case_id_idx on public.case_documents(case_id);
create index if not exists case_ai_summaries_case_id_idx on public.case_ai_summaries(case_id);
create index if not exists physician_reviews_case_id_idx on public.physician_reviews(case_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_cases_updated_at on public.cases;
create trigger set_cases_updated_at
before update on public.cases
for each row execute function public.set_updated_at();

drop trigger if exists set_physician_reviews_updated_at on public.physician_reviews;
create trigger set_physician_reviews_updated_at
before update on public.physician_reviews
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_staff(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = uid
      and role in ('physician', 'admin')
  );
$$;

create or replace function public.owns_case(target_case_id uuid, uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.cases
    where id = target_case_id
      and user_id = uid
  );
$$;

alter table public.profiles enable row level security;
alter table public.cases enable row level security;
alter table public.case_documents enable row level security;
alter table public.case_ai_summaries enable row level security;
alter table public.physician_reviews enable row level security;

drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read"
on public.profiles
for select
using (auth.uid() = id or public.is_staff(auth.uid()));

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "cases own read" on public.cases;
create policy "cases own read"
on public.cases
for select
using (
  auth.uid() = user_id
  or public.is_staff(auth.uid())
);

drop policy if exists "cases own insert" on public.cases;
create policy "cases own insert"
on public.cases
for insert
with check (auth.uid() = user_id);

drop policy if exists "cases own update" on public.cases;
create policy "cases own update"
on public.cases
for update
using (
  auth.uid() = user_id
  or public.is_staff(auth.uid())
)
with check (
  auth.uid() = user_id
  or public.is_staff(auth.uid())
);

drop policy if exists "case documents own read or staff" on public.case_documents;
create policy "case documents own read or staff"
on public.case_documents
for select
using (
  auth.uid() = user_id
  or public.is_staff(auth.uid())
);

drop policy if exists "case documents own insert" on public.case_documents;
create policy "case documents own insert"
on public.case_documents
for insert
with check (
  auth.uid() = user_id
  and public.owns_case(case_id, auth.uid())
);

drop policy if exists "case documents own delete" on public.case_documents;
create policy "case documents own delete"
on public.case_documents
for delete
using (
  auth.uid() = user_id
  or public.is_staff(auth.uid())
);

drop policy if exists "ai summaries own or staff read" on public.case_ai_summaries;
create policy "ai summaries own or staff read"
on public.case_ai_summaries
for select
using (
  public.is_staff(auth.uid())
  or exists (
    select 1
    from public.cases
    where cases.id = case_ai_summaries.case_id
      and cases.user_id = auth.uid()
  )
);

drop policy if exists "ai summaries staff write" on public.case_ai_summaries;
create policy "ai summaries staff write"
on public.case_ai_summaries
for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

drop policy if exists "reviews own delivered read" on public.physician_reviews;
create policy "reviews own delivered read"
on public.physician_reviews
for select
using (
  public.is_staff(auth.uid())
  or (
    status = 'delivered'
    and exists (
      select 1
      from public.cases
      where cases.id = physician_reviews.case_id
        and cases.user_id = auth.uid()
    )
  )
);

drop policy if exists "reviews staff write" on public.physician_reviews;
create policy "reviews staff write"
on public.physician_reviews
for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

insert into storage.buckets (id, name, public)
values ('case-documents', 'case-documents', false)
on conflict (id) do nothing;

drop policy if exists "storage own uploads" on storage.objects;
create policy "storage own uploads"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'case-documents'
  and auth.uid()::text = split_part(name, '/', 1)
);

drop policy if exists "storage own read or staff" on storage.objects;
create policy "storage own read or staff"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'case-documents'
  and (
    auth.uid()::text = split_part(name, '/', 1)
    or public.is_staff(auth.uid())
  )
);

drop policy if exists "storage own delete or staff" on storage.objects;
create policy "storage own delete or staff"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'case-documents'
  and (
    auth.uid()::text = split_part(name, '/', 1)
    or public.is_staff(auth.uid())
  )
);
