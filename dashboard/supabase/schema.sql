-- Run in Supabase Dashboard → SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  source_type text not null check (source_type in ('pdf', 'youtube', 'article', 'text')),
  source_data text,
  created_at timestamptz not null default now()
);

create table if not exists public.study_outputs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  summary text,
  key_concepts jsonb not null default '[]'::jsonb,
  flashcards jsonb not null default '[]'::jsonb,
  quiz jsonb not null default '[]'::jsonb,
  mindmap jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists sessions_user_id_created_at_idx
  on public.sessions (user_id, created_at desc);

create unique index if not exists study_outputs_session_id_idx
  on public.study_outputs (session_id);

alter table public.sessions enable row level security;
alter table public.study_outputs enable row level security;

create policy "Users read own sessions"
  on public.sessions for select
  using (auth.uid() = user_id);

create policy "Users insert own sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id);

create policy "Users delete own sessions"
  on public.sessions for delete
  using (auth.uid() = user_id);

create policy "Users read own study outputs"
  on public.study_outputs for select
  using (
    exists (
      select 1 from public.sessions s
      where s.id = study_outputs.session_id and s.user_id = auth.uid()
    )
  );

create policy "Users insert own study outputs"
  on public.study_outputs for insert
  with check (
    exists (
      select 1 from public.sessions s
      where s.id = study_outputs.session_id and s.user_id = auth.uid()
    )
  );

create policy "Users delete own study outputs"
  on public.study_outputs for delete
  using (
    exists (
      select 1 from public.sessions s
      where s.id = study_outputs.session_id and s.user_id = auth.uid()
    )
  );
