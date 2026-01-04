-- Zero to Hero schema for Supabase (Postgres)
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1) Core user metrics
create table if not exists daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  weed_free boolean not null default false,
  smoke_free boolean not null default false,
  nuts_free boolean not null default false,
  meditation_minutes integer not null default 0,
  gym_done boolean not null default false,
  weight_kg numeric,
  sleep_hours numeric,
  notes text,
  created_at timestamp with time zone not null default now(),
  unique (user_id, date)
);

create table if not exists body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  weight_kg numeric,
  bodyfat_percent numeric,
  waist_cm numeric,
  notes text,
  created_at timestamp with time zone not null default now(),
  unique (user_id, date)
);

-- 2) Money
create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  checking_balance numeric not null default 0,
  savings_balance numeric not null default 0,
  currency text not null default 'USD',
  created_at timestamp with time zone not null default now(),
  unique (user_id)
);

create table if not exists account_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  account_type text not null check (account_type in ('checking', 'savings')),
  date date not null,
  amount numeric not null,
  label text,
  note text,
  created_at timestamp with time zone not null default now()
);

create table if not exists recurring_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  amount numeric not null,
  frequency text not null check (frequency in ('weekly', 'monthly')),
  due_day integer not null,
  active boolean not null default true,
  last_paid_date date,
  created_at timestamp with time zone not null default now()
);

create table if not exists recurring_payment_instances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  recurring_payment_id uuid references recurring_payments(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  due_date date not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'paid', 'skipped')),
  paid_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

-- 3) Goals & Bucket list
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('money', 'weight', 'streak', 'habit', 'custom')),
  target_value numeric not null,
  current_value numeric,
  unit text,
  start_date date not null default now(),
  deadline date,
  tracking_source text,
  notes text,
  created_at timestamp with time zone not null default now()
);

create table if not exists bucket_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'done')),
  created_at timestamp with time zone not null default now(),
  done_date date,
  notes text
);

create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  bucket_item_id uuid references bucket_items(id) on delete cascade,
  title text not null,
  completed_at date not null,
  photo_uri text not null,
  caption text,
  location text,
  created_at timestamp with time zone not null default now()
);

-- 4) Journaling
create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  entry_text text not null,
  mood_tag text,
  energy_tag text,
  tags text[],
  created_at timestamp with time zone not null default now(),
  unique (user_id, date)
);

create table if not exists journal_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  image_uri text not null,
  notes text,
  created_at timestamp with time zone not null default now(),
  unique (user_id, date)
);

-- 5) Gym
create table if not exists training_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  focus_tags text[],
  is_active boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  primary_muscles text[],
  equipment text,
  illustration_uri text,
  instructions jsonb,
  notes text,
  created_at timestamp with time zone not null default now()
);

create table if not exists program_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  program_id uuid references training_programs(id) on delete cascade,
  exercise_id uuid references exercises(id) on delete cascade,
  order_index integer not null,
  prescription_sets integer not null,
  prescription_reps_min integer,
  prescription_reps_max integer,
  prescription_rest_sec integer,
  notes text,
  created_at timestamp with time zone not null default now()
);

create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  program_id uuid references training_programs(id) on delete set null,
  started_at timestamp with time zone not null,
  ended_at timestamp with time zone,
  duration_sec integer,
  status text not null default 'completed' check (status in ('completed', 'abandoned')),
  notes text,
  created_at timestamp with time zone not null default now()
);

create table if not exists workout_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  workout_id uuid references workouts(id) on delete cascade,
  exercise_id uuid references exercises(id) on delete cascade,
  order_index integer not null,
  planned_sets integer not null,
  created_at timestamp with time zone not null default now()
);

create table if not exists workout_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  workout_exercise_id uuid references workout_exercises(id) on delete cascade,
  set_number integer not null,
  previous_kg numeric,
  previous_reps integer,
  weight_kg numeric,
  reps integer,
  is_done boolean not null default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

create table if not exists exercise_history_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  exercise_id uuid references exercises(id) on delete cascade,
  last_weight_kg numeric,
  last_reps integer,
  last_date date,
  created_at timestamp with time zone not null default now(),
  unique (user_id, exercise_id)
);

-- Row Level Security
alter table daily_checkins enable row level security;
alter table body_measurements enable row level security;
alter table accounts enable row level security;
alter table account_transactions enable row level security;
alter table recurring_payments enable row level security;
alter table recurring_payment_instances enable row level security;
alter table goals enable row level security;
alter table bucket_items enable row level security;
alter table memories enable row level security;
alter table journal_entries enable row level security;
alter table journal_scans enable row level security;
alter table training_programs enable row level security;
alter table exercises enable row level security;
alter table program_exercises enable row level security;
alter table workouts enable row level security;
alter table workout_exercises enable row level security;
alter table workout_sets enable row level security;
alter table exercise_history_cache enable row level security;

-- Simple owner-only policies
create policy "Users can read own rows" on daily_checkins for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on daily_checkins for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on daily_checkins for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on daily_checkins for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on body_measurements for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on body_measurements for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on body_measurements for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on body_measurements for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on accounts for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on accounts for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on accounts for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on accounts for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on account_transactions for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on account_transactions for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on account_transactions for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on account_transactions for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on recurring_payments for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on recurring_payments for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on recurring_payments for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on recurring_payments for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on recurring_payment_instances for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on recurring_payment_instances for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on recurring_payment_instances for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on recurring_payment_instances for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on goals for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on goals for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on goals for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on goals for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on bucket_items for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on bucket_items for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on bucket_items for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on bucket_items for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on memories for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on memories for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on memories for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on memories for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on journal_entries for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on journal_entries for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on journal_entries for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on journal_entries for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on journal_scans for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on journal_scans for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on journal_scans for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on journal_scans for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on training_programs for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on training_programs for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on training_programs for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on training_programs for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on exercises for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on exercises for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on exercises for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on exercises for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on program_exercises for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on program_exercises for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on program_exercises for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on program_exercises for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on workouts for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on workouts for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on workouts for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on workouts for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on workout_exercises for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on workout_exercises for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on workout_exercises for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on workout_exercises for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on workout_sets for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on workout_sets for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on workout_sets for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on workout_sets for delete using (auth.uid() = user_id);

create policy "Users can read own rows" on exercise_history_cache for select using (auth.uid() = user_id);
create policy "Users can insert own rows" on exercise_history_cache for insert with check (auth.uid() = user_id);
create policy "Users can update own rows" on exercise_history_cache for update using (auth.uid() = user_id);
create policy "Users can delete own rows" on exercise_history_cache for delete using (auth.uid() = user_id);
