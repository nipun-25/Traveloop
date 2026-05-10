-- ============================================================
-- Traveloop V1 — Phase 1: Database Schema & Security
-- ============================================================

-- 1. Create Tables
-- ------------------------------------------------------------

-- Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  photo_url TEXT,
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cities Catalog
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  cost_index SMALLINT,
  popularity_score SMALLINT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activities Catalog
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  estimated_cost NUMERIC(10,2) DEFAULT 0,
  duration_minutes INT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trips
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cover_photo_url TEXT,
  is_public BOOLEAN DEFAULT false,
  share_slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Trip Stops
CREATE TABLE IF NOT EXISTS public.trip_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES public.cities(id),
  stop_order INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT valid_stop_dates CHECK (end_date >= start_date)
);

-- Trip Stop Activities (Join Table)
CREATE TABLE IF NOT EXISTS public.trip_stop_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_stop_id UUID NOT NULL REFERENCES public.trip_stops(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES public.activities(id),
  activity_date DATE,
  activity_time TIME,
  custom_cost NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Packing Checklist
CREATE TABLE IF NOT EXISTS public.packing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  is_packed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Trip Notes
CREATE TABLE IF NOT EXISTS public.trip_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  trip_stop_id UUID REFERENCES public.trip_stops(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Share Links Control
CREATE TABLE IF NOT EXISTS public.share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ
);

-- 2. Security (RLS)
-- ------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stop_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;
-- Catalog tables (Public Read)
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Profiles: User can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trips: Owner CRUD + Public Read if is_public
CREATE POLICY "Owner can CRUD trips" ON public.trips FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public trips are readable" ON public.trips FOR SELECT USING (is_public = true);

-- Trip Stops: Owner CRUD + Public Read if Trip is public
CREATE POLICY "Owner can CRUD stops" ON public.trip_stops FOR ALL USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);
CREATE POLICY "Public trip stops readable" ON public.trip_stops FOR SELECT USING (
  trip_id IN (SELECT id FROM public.trips WHERE is_public = true)
);

-- Trip Stop Activities: Same pattern
CREATE POLICY "Owner can CRUD trip activities" ON public.trip_stop_activities FOR ALL USING (
  trip_stop_id IN (SELECT ts.id FROM public.trip_stops ts JOIN public.trips t ON ts.trip_id = t.id WHERE t.user_id = auth.uid())
);
CREATE POLICY "Public trip activities readable" ON public.trip_stop_activities FOR SELECT USING (
  trip_stop_id IN (SELECT ts.id FROM public.trip_stops ts JOIN public.trips t ON ts.trip_id = t.id WHERE t.is_public = true)
);

-- Packing Items: Owner only
CREATE POLICY "Owner can CRUD packing items" ON public.packing_items FOR ALL USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);

-- Trip Notes: Owner only
CREATE POLICY "Owner can CRUD notes" ON public.trip_notes FOR ALL USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);

-- Share Links: Owner only
CREATE POLICY "Owner can CRUD share links" ON public.share_links FOR ALL USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);

-- Catalog Tables: Public Read-Only
CREATE POLICY "Public read for cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public read for activities" ON public.activities FOR SELECT USING (true);


-- 3. Performance (Indexes)
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_order ON public.trip_stops(trip_id, stop_order);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_date ON public.trip_stops(trip_id, start_date);
CREATE INDEX IF NOT EXISTS idx_packing_trip ON public.packing_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_notes_trip ON public.trip_notes(trip_id);
CREATE INDEX IF NOT EXISTS idx_cities_country ON public.cities(country);
CREATE INDEX IF NOT EXISTS idx_activities_city ON public.activities(city_id);
CREATE INDEX IF NOT EXISTS idx_activities_category ON public.activities(category);


-- 4. Automation (Triggers)
-- ------------------------------------------------------------

-- Automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 5. Storage — trip-covers bucket
-- ============================================================

-- Create the bucket (run in Supabase dashboard SQL editor)
INSERT INTO storage.buckets (id, name, public) VALUES ('trip-covers', 'trip-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload trip covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'trip-covers' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update/delete their own files
CREATE POLICY "Users can manage own trip covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'trip-covers' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own trip covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'trip-covers' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read access (covers are shown on shared pages)
CREATE POLICY "Public read for trip covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'trip-covers');
