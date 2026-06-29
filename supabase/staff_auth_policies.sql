drop policy if exists public_orders_read on public.orders;
drop policy if exists public_orders_update_status on public.orders;

create policy authenticated_orders_read
  on public.orders
  for select
  to authenticated
  using (true);

create policy authenticated_orders_update_status
  on public.orders
  for update
  to authenticated
  using (true)
  with check (status in ('new', 'accepted', 'preparing', 'completed', 'canceled'));

drop policy if exists public_order_items_read on public.order_items;

create policy authenticated_order_items_read
  on public.order_items
  for select
  to authenticated
  using (true);

drop policy if exists public_reservations_read on public.reservations;
drop policy if exists public_reservations_update_status on public.reservations;

create policy authenticated_reservations_read
  on public.reservations
  for select
  to authenticated
  using (true);

create policy authenticated_reservations_update_status
  on public.reservations
  for update
  to authenticated
  using (true)
  with check (status in ('new', 'confirmed', 'declined'));
