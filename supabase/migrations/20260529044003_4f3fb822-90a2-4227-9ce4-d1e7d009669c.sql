
-- ===== Roles =====
create type public.app_role as enum ('admin', 'customer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users view own roles"
on public.user_roles for select to authenticated
using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

-- ===== Profiles =====
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "View own profile or admin"
on public.profiles for select to authenticated
using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));

create policy "Update own profile"
on public.profiles for update to authenticated
using (auth.uid() = id);

-- ===== Signup trigger: create profile + assign role =====
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));

  if new.email = 'sohanjohn@wh1rlpool.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
    on conflict do nothing;
  else
    insert into public.user_roles (user_id, role) values (new.id, 'customer')
    on conflict do nothing;
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ===== Products =====
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  team text not null,
  category text not null,
  price integer not null,
  mrp integer not null,
  image_url text not null,
  badge text,
  best_seller boolean not null default false,
  new_arrival boolean not null default false,
  featured boolean not null default false,
  player text,
  description text not null default '',
  rating numeric(2,1) not null default 4.5,
  review_count integer not null default 0,
  in_stock boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.products to anon, authenticated;
grant all on public.products to service_role;

alter table public.products enable row level security;

create policy "Anyone can view products"
on public.products for select to anon, authenticated
using (true);

create policy "Admins manage products"
on public.products for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- ===== Orders =====
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  phone text not null,
  full_name text not null,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  payment_method text not null,
  subtotal integer not null,
  shipping integer not null default 0,
  total integer not null,
  status text not null default 'pending',
  items jsonb not null,
  created_at timestamptz not null default now()
);

grant select, insert on public.orders to authenticated;
grant select, insert on public.orders to anon;
grant all on public.orders to service_role;

alter table public.orders enable row level security;

create policy "Anyone can place an order"
on public.orders for insert to anon, authenticated
with check (true);

create policy "View own orders or admin"
on public.orders for select to anon, authenticated
using (
  (auth.uid() is not null and user_id = auth.uid())
  or public.has_role(auth.uid(), 'admin')
);

create policy "Admins update orders"
on public.orders for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));
