create table if not exists public.reservations (
  id text primary key,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'confirmed', 'declined')),
  guest_name text not null,
  phone text not null,
  party_size text not null default '2 guests',
  preferred_time text not null default 'Tonight',
  note text
);

create index if not exists reservations_created_at_idx on public.reservations(created_at desc);

alter table public.reservations enable row level security;

drop policy if exists public_reservations_insert on public.reservations;
create policy public_reservations_insert
  on public.reservations
  for insert
  with check (true);

drop policy if exists public_reservations_read on public.reservations;
create policy public_reservations_read
  on public.reservations
  for select
  using (true);

drop policy if exists public_reservations_update_status on public.reservations;
create policy public_reservations_update_status
  on public.reservations
  for update
  using (true)
  with check (status in ('new', 'confirmed', 'declined'));
