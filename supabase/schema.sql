create table public.batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('student','trainer','admin')),
  batch_id uuid references public.batches(id),
  created_at timestamptz default now()
);

alter table public.batches enable row level security;
alter table public.profiles enable row level security;

create policy "read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

create policy "update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "read batches" on public.batches
  for select to authenticated using (true);

-- users may change only their name, never their own role
revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();