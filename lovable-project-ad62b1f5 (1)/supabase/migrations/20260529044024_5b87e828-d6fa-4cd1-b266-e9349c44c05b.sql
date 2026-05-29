
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop policy "Anyone can place an order" on public.orders;
create policy "Place order (self or guest)"
on public.orders for insert to anon, authenticated
with check (user_id is null or user_id = auth.uid());
