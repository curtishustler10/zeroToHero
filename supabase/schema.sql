-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enable Row Level Security
alter default privileges revoke execute on functions from public;
alter default privileges in schema public revoke execute on functions from anon, authenticated;

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tz text default 'Australia/Brisbane'::text not null,
  display_name text,
  goal_desc text
);

-- Enable RLS
alter table profiles enable row level security;

-- Profiles policies
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Days table for daily logs
create table days (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  mood integer check (mood >= 1 and mood <= 5),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

alter table days enable row level security;

create policy "Users can manage own days" on days
  for all using (auth.uid() = user_id);

-- Habits table
create table habits (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  target integer not null default 1,
  unit text not null default 'count',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table habits enable row level security;

create policy "Users can manage own habits" on habits
  for all using (auth.uid() = user_id);

-- Habit logs table
create table habit_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  habit_id bigint references habits(id) on delete cascade not null,
  date date not null,
  value integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, habit_id, date)
);

alter table habit_logs enable row level security;

create policy "Users can manage own habit logs" on habit_logs
  for all using (auth.uid() = user_id);

-- Content logs table
create table content_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  kind text not null, -- 'post', 'video', 'article', etc.
  url text,
  caption text,
  minutes_spent integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table content_logs enable row level security;

create policy "Users can manage own content logs" on content_logs
  for all using (auth.uid() = user_id);

-- Deep work logs table
create table deepwork_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  start_time timestamp with time zone not null,
  minutes integer not null,
  tag text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table deepwork_logs enable row level security;

create policy "Users can manage own deepwork logs" on deepwork_logs
  for all using (auth.uid() = user_id);

-- Social reps table
create table social_reps (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  count integer not null default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

alter table social_reps enable row level security;

create policy "Users can manage own social reps" on social_reps
  for all using (auth.uid() = user_id);

-- Workouts table
create table workouts (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  type text not null,
  duration_min integer,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table workouts enable row level security;

create policy "Users can manage own workouts" on workouts
  for all using (auth.uid() = user_id);

-- Sleep logs table
create table sleep_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  hours numeric(3,1) not null,
  quality integer check (quality >= 1 and quality <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

alter table sleep_logs enable row level security;

create policy "Users can manage own sleep logs" on sleep_logs
  for all using (auth.uid() = user_id);

-- Leads table
create table leads (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  business text,
  niche text,
  source text,
  status text not null default 'New', -- 'New', 'Contacted', 'Booked', 'Won', 'Lost'
  priority integer not null default 3 check (priority >= 1 and priority <= 5),
  next_action_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table leads enable row level security;

create policy "Users can manage own leads" on leads
  for all using (auth.uid() = user_id);

-- Outreach logs table
create table outreach_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  lead_id bigint references leads(id) on delete cascade,
  date date not null,
  channel text not null, -- 'email', 'linkedin', 'phone', etc.
  notes text,
  outcome text, -- 'sent', 'reply', 'booked', 'declined', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table outreach_logs enable row level security;

create policy "Users can manage own outreach logs" on outreach_logs
  for all using (auth.uid() = user_id);

-- Deals table
create table deals (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  lead_id bigint references leads(id) on delete set null,
  amount numeric(10,2) not null,
  cogs numeric(10,2) default 0,
  date date not null,
  source text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table deals enable row level security;

create policy "Users can manage own deals" on deals
  for all using (auth.uid() = user_id);

-- Stories table
create table stories (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  archetype text not null, -- 'contrast', 'tiny_win', 'failure', 'vow'
  sensory_detail text,
  conflict text,
  turning_point text,
  lesson text,
  draft text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table stories enable row level security;

create policy "Users can manage own stories" on stories
  for all using (auth.uid() = user_id);

-- Events table for analytics
create table events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  time timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  payload jsonb
);

alter table events enable row level security;

create policy "Users can manage own events" on events
  for all using (auth.uid() = user_id);

-- Prompts table for motivational content
create table prompts (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  kind text not null, -- 'motivational', 'ai_system', etc.
  text text not null,
  weight integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table prompts enable row level security;

create policy "Users can view prompts" on prompts
  for select using (user_id is null or auth.uid() = user_id);

create policy "Users can manage own prompts" on prompts
  for all using (auth.uid() = user_id);

-- Views for analytics

-- Daily score view
create or replace view v_daily_score as
select 
  user_id,
  date,
  (
    -- Content score (30 points)
    coalesce((select 30 where exists(select 1 from content_logs cl where cl.user_id = d.user_id and cl.date = d.date)), 0) +
    
    -- Deep work score (30 points, proportional to target)
    coalesce((
      select least(30, (sum(dw.minutes)::float / 120) * 30)
      from deepwork_logs dw 
      where dw.user_id = d.user_id 
      and dw.start_time::date = d.date
    ), 0) +
    
    -- Social reps score (20 points, proportional to target of 10)
    coalesce((
      select least(20, (sr.count::float / 10) * 20)
      from social_reps sr 
      where sr.user_id = d.user_id 
      and sr.date = d.date
    ), 0) +
    
    -- Workout + sleep score (20 points, 10 each)
    coalesce((select 10 where exists(select 1 from workouts w where w.user_id = d.user_id and w.date = d.date)), 0) +
    coalesce((select 10 where exists(select 1 from sleep_logs sl where sl.user_id = d.user_id and sl.date = d.date)), 0)
  )::integer as score
from days d;

-- Funnel conversion view
create or replace view v_funnel as
select 
  user_id,
  date_trunc('week', ol.date) as week,
  count(distinct ol.id) as outreach_count,
  count(distinct case when ol.outcome in ('reply', 'booked') then ol.lead_id end) as responses,
  count(distinct case when ol.outcome = 'booked' then ol.lead_id end) as bookings,
  count(distinct d.lead_id) as deals
from outreach_logs ol
left join deals d on d.lead_id = ol.lead_id and d.date >= ol.date and d.date <= ol.date + interval '30 days'
group by user_id, date_trunc('week', ol.date);

-- Create indexes for performance
create index idx_days_user_date on days(user_id, date);
create index idx_habit_logs_user_date on habit_logs(user_id, date);
create index idx_content_logs_user_date on content_logs(user_id, date);
create index idx_deepwork_logs_user_date on deepwork_logs(user_id, start_time::date);
create index idx_social_reps_user_date on social_reps(user_id, date);
create index idx_workouts_user_date on workouts(user_id, date);
create index idx_sleep_logs_user_date on sleep_logs(user_id, date);
create index idx_leads_user_status on leads(user_id, status);
create index idx_outreach_logs_user_date on outreach_logs(user_id, date);
create index idx_deals_user_date on deals(user_id, date);
create index idx_stories_user_date on stories(user_id, date);

-- Function to create default habits for new users
create or replace function create_default_habits(user_uuid uuid)
returns void as $$
begin
  insert into habits (user_id, name, target, unit, sort_order) values
    (user_uuid, 'Content Creation', 1, 'posts', 1),
    (user_uuid, 'Deep Work', 120, 'minutes', 2),
    (user_uuid, 'Social Reps', 10, 'conversations', 3),
    (user_uuid, 'Workout', 1, 'sessions', 4),
    (user_uuid, 'Sleep', 7, 'hours', 5);
end;
$$ language plpgsql;

-- Function to insert default prompts
create or replace function insert_default_prompts()
returns void as $$
begin
  insert into prompts (user_id, kind, text, weight) values
    (null, 'motivational', 'Every small step forward is progress. Keep building.', 1),
    (null, 'motivational', 'Consistency beats perfection. Show up today.', 1),
    (null, 'motivational', 'Your future self is counting on what you do right now.', 1),
    (null, 'motivational', 'The gap between where you are and where you want to be is bridged by action.', 1),
    (null, 'motivational', 'Success is the sum of small efforts repeated day in and day out.', 1),
    (null, 'motivational', 'You are building something bigger than today. Trust the process.', 1),
    (null, 'motivational', 'Every expert was once a beginner. Every pro was once an amateur.', 1),
    (null, 'motivational', 'The best time to plant a tree was 20 years ago. The second best time is now.', 1),
    (null, 'motivational', 'Discipline is choosing between what you want now and what you want most.', 1),
    (null, 'motivational', 'Progress, not perfection. Growth, not comfort.', 1);
end;
$$ language plpgsql;

-- Trigger to create default habits when a user profile is created
create or replace function handle_new_user()
returns trigger as $$
begin
  perform create_default_habits(new.id);
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
  after insert on profiles
  for each row execute procedure handle_new_user();

-- Insert default prompts
select insert_default_prompts();