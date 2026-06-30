drop policy if exists authenticated_menu_items_read on public.menu_items;
create policy authenticated_menu_items_read
  on public.menu_items
  for select
  to authenticated
  using (true);

drop policy if exists authenticated_menu_items_insert on public.menu_items;
create policy authenticated_menu_items_insert
  on public.menu_items
  for insert
  to authenticated
  with check (true);

drop policy if exists authenticated_menu_items_update on public.menu_items;
create policy authenticated_menu_items_update
  on public.menu_items
  for update
  to authenticated
  using (true)
  with check (true);
