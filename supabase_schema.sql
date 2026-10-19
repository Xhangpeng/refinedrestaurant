-- =========================================================================
-- MAHESWARI MULTI CUISINE RESTAURANT — SUPABASE RELATIONAL SCHEMA
-- Multi-Department Strict Role-Based Database (PostgreSQL / Supabase)
-- =========================================================================

-- 1. Create Department Enum
CREATE TYPE department_type AS ENUM (
  'manager',
  'kitchen',
  'waiter',
  'booking_menu',
  'delivery'
);

-- 2. Create Order Status Enum
CREATE TYPE order_status_type AS ENUM (
  'placed',
  'confirmed',
  'cooking',
  'ready_at_table',
  'ready_for_dispatch',
  'out_for_delivery',
  'completed',
  'cancelled'
);

-- 3. Staff & Department Members Table
CREATE TABLE IF NOT EXISTS public.staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department department_type NOT NULL DEFAULT 'waiter',
  station TEXT NOT NULL,
  phone TEXT NOT NULL,
  shift_status TEXT NOT NULL DEFAULT 'on_shift',
  pin TEXT NOT NULL DEFAULT '0000',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Orders Table (With inter-department pipeline tracking)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id TEXT DEFAULT 'guest',
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  booking_type TEXT NOT NULL DEFAULT 'dine_in',
  table_number TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  order_status order_status_type NOT NULL DEFAULT 'placed',
  payment_method TEXT NOT NULL DEFAULT 'pay_at_counter',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  prepared_by_chef TEXT,
  prepared_at TEXT,
  served_by_waiter TEXT,
  served_at TEXT,
  assigned_rider TEXT,
  delivered_at TEXT,
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Table Reservations Table (Managed by Booking Managing Department)
CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY,
  booking_number TEXT NOT NULL UNIQUE,
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guest_email TEXT,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 2,
  seating_area TEXT NOT NULL,
  table_number TEXT,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Menu Items & Supply Stock (Managed by Menu Supply Managing Department)
CREATE TABLE IF NOT EXISTS public.menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hindi_name TEXT,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  half_price NUMERIC(10,2),
  is_available BOOLEAN NOT NULL DEFAULT true,
  prep_time_minutes INTEGER NOT NULL DEFAULT 15,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- INITIAL SEED DATA FOR STAFF ROSTER & 4 DEPARTMENTS
-- =========================================================================
INSERT INTO public.staff (id, name, role, department, station, phone, shift_status, pin)
VALUES
  ('s1', 'Chef Ranveer', 'head_chef', 'kitchen', 'Tandoor & Dum Deg', '+91 98110 11223', 'on_shift', '1122'),
  ('s2', 'Chef Arvind Mathur', 'sous_chef', 'kitchen', 'Makhani & Gravies', '+91 98114 44556', 'on_shift', '1122'),
  ('s3', 'Ramesh Rawat', 'floor_captain', 'waiter', 'Courtyard & Baithak', '+91 98711 77889', 'on_shift', '3344'),
  ('s4', 'Suman Sharma', 'desk_manager', 'booking_menu', 'Reservations & Supply Desk', '+91 99100 22334', 'on_shift', '5566'),
  ('s5', 'Sunil Gurjar', 'rider_lead', 'delivery', 'Express Fleet Dispatch', '+91 98101 99887', 'on_shift', '7788'),
  ('s6', 'Tej Singh Saud', 'general_manager', 'manager', 'Executive Operations Suite', '+91 98100 00001', 'on_shift', '2026')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Allow public read for menu items
CREATE POLICY "Public can view available menu"
  ON public.menu_items FOR SELECT USING (true);

-- Allow public and waiter to insert orders
CREATE POLICY "Public and waiter can insert orders"
  ON public.orders FOR INSERT WITH CHECK (true);

-- Allow read of orders
CREATE POLICY "Staff can read orders"
  ON public.orders FOR SELECT USING (true);

-- Allow update of orders
CREATE POLICY "Staff can update orders"
  ON public.orders FOR UPDATE USING (true);

-- Allow reservations read & write
CREATE POLICY "Reservations access"
  ON public.reservations FOR ALL USING (true);

-- Allow staff read & write
CREATE POLICY "Staff access"
  ON public.staff FOR ALL USING (true);
