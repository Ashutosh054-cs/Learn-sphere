# Supabase Integration Guide

## Setup Instructions

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details and create

### 2. Get Your API Keys
1. Go to Project Settings → API
2. Copy your project URL
3. Copy your `anon` public key

### 3. Configure Environment Variables
Update `.env.local` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Create Database Tables
Run these SQL commands in Supabase SQL Editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  avatar text,
  score integer default 0,
  coins integer default 0,
  gems integer default 0,
  rank integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Focus sessions table
create table focus_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  duration integer not null,
  completed boolean default false,
  session_type text default 'work',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Streaks table
create table streaks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null unique,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_activity_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activity/Contributions table
create table activities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  activity_date date not null,
  activity_count integer default 0,
  activity_level integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, activity_date)
);

-- Create indexes for better performance
create index profiles_score_idx on profiles(score desc);
create index focus_sessions_user_id_idx on focus_sessions(user_id);
create index activities_user_date_idx on activities(user_id, activity_date);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table focus_sessions enable row level security;
alter table streaks enable row level security;
alter table activities enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Focus sessions policies
create policy "Users can view own focus sessions"
  on focus_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own focus sessions"
  on focus_sessions for insert
  with check (auth.uid() = user_id);

-- Streaks policies
create policy "Users can view own streaks"
  on streaks for select
  using (auth.uid() = user_id);

create policy "Users can update own streaks"
  on streaks for all
  using (auth.uid() = user_id);

-- Activities policies
create policy "Users can view own activities"
  on activities for select
  using (auth.uid() = user_id);

create policy "Users can insert own activities"
  on activities for insert
  with check (auth.uid() = user_id);

-- Function to get user rank
create or replace function get_user_rank(user_id uuid)
returns integer as $$
  select rank from (
    select id, row_number() over (order by score desc) as rank
    from profiles
  ) as ranked
  where id = user_id;
$$ language sql stable;

-- Trigger to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 5. Usage Examples

#### Authentication
```javascript
import { useAuthStore } from './stores/authStore'

function LoginComponent() {
  const { signIn, user } = useAuthStore()
  
  const handleLogin = async () => {
    const { data, error } = await signIn('user@example.com', 'password')
    if (error) console.error(error)
  }
}
```

#### Fetch Data
```javascript
import { userService } from './services/supabaseService'

const { data: profile } = await userService.getProfile(userId)
```

#### Initialize Auth on App Start
```javascript
// In App.jsx
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'

function App() {
  const initialize = useAuthStore(state => state.initialize)
  
  useEffect(() => {
    initialize()
  }, [])
  
  return <YourApp />
}
```

## Available Services

- **authStore**: Authentication state management
- **userService**: User profile operations
- **focusService**: Focus session tracking
- **streakService**: Streak management
- **leaderboardService**: Leaderboard and rankings

## Security Notes

- Never commit `.env.local` to git
- The `anon` key is safe for client-side use
- Row Level Security (RLS) protects your data
- Service role key should only be used server-side
