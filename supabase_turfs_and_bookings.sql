-- ============================================================================
-- TURFIFY SUPABASE SCHEMA: TURFS & BOOKINGS TABLES
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/fksdanhjdhqbpijoolzf/sql
-- ============================================================================

-- 1. CREATE TURFS TABLE (Registered Facilities)
CREATE TABLE IF NOT EXISTS public.turfs (
  id TEXT PRIMARY KEY,
  owner_id TEXT,
  owner_name TEXT,
  owner_email TEXT,
  owner_phone TEXT,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  category TEXT,
  location TEXT NOT NULL,
  city TEXT,
  price_per_hour INTEGER NOT NULL DEFAULT 1200,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 1,
  dimensions TEXT,
  surface TEXT,
  environment TEXT DEFAULT 'outdoor',
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  amenities JSONB DEFAULT '[]'::jsonb,
  operating_slots JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE BOOKINGS TABLE (Match Reservations)
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  turf_id TEXT NOT NULL,
  turf_name TEXT NOT NULL,
  sport TEXT NOT NULL,
  player_id TEXT,
  player_name TEXT NOT NULL,
  player_email TEXT,
  player_phone TEXT,
  owner_id TEXT,
  owner_name TEXT,
  owner_email TEXT,
  owner_phone TEXT,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  time_slots JSONB DEFAULT '[]'::jsonb,
  field_name TEXT,
  amount INTEGER NOT NULL DEFAULT 1200,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  payment_status TEXT NOT NULL DEFAULT 'Paid Online',
  booking_time TEXT,
  cancelled_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist even if tables were previously created
ALTER TABLE public.turfs ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.turfs ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.turfs ADD COLUMN IF NOT EXISTS operating_slots JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.turfs ADD COLUMN IF NOT EXISTS dimensions TEXT;
ALTER TABLE public.turfs ADD COLUMN IF NOT EXISTS surface TEXT;
ALTER TABLE public.turfs ADD COLUMN IF NOT EXISTS environment TEXT DEFAULT 'outdoor';
ALTER TABLE public.turfs ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.turfs ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.turfs ADD COLUMN IF NOT EXISTS owner_phone TEXT;

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS owner_id TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS owner_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS owner_email TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS owner_phone TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS time_slots JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS field_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_time TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancelled_at TEXT;

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.turfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES FOR TURFS (Allow Real-time Global Sync)
DROP POLICY IF EXISTS "Public can view turfs" ON public.turfs;
CREATE POLICY "Public can view turfs" ON public.turfs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert turfs" ON public.turfs;
CREATE POLICY "Public can insert turfs" ON public.turfs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update turfs" ON public.turfs;
CREATE POLICY "Public can update turfs" ON public.turfs FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can delete turfs" ON public.turfs;
CREATE POLICY "Public can delete turfs" ON public.turfs FOR DELETE USING (true);

-- 5. POLICIES FOR BOOKINGS (Allow Real-time Global Sync Across Admin, Owner, Player)
DROP POLICY IF EXISTS "Public can view bookings" ON public.bookings;
CREATE POLICY "Public can view bookings" ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
CREATE POLICY "Public can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update bookings" ON public.bookings;
CREATE POLICY "Public can update bookings" ON public.bookings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can delete bookings" ON public.bookings;
CREATE POLICY "Public can delete bookings" ON public.bookings FOR DELETE USING (true);

-- 6. ENABLE SUPABASE REALTIME REPLICATION (Instant cross-window updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.turfs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

