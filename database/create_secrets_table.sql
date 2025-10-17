-- Create a secrets table to store API keys accessible from the application
-- Note: This is different from Edge Function secrets shown in Supabase dashboard

CREATE TABLE IF NOT EXISTS public.secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.secrets ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read secrets
CREATE POLICY "Allow authenticated users to read secrets"
  ON public.secrets
  FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can insert/update/delete secrets (for admin operations)
CREATE POLICY "Only service role can modify secrets"
  ON public.secrets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert the Google Places API key
-- Replace 'YOUR_ACTUAL_API_KEY' with your real Google Places API key
INSERT INTO public.secrets (key, value, description)
VALUES (
  'PLACES_GOOGLE_API',
  'YOUR_ACTUAL_API_KEY_HERE',
  'Google Places API key for fetching nearby restaurants and places'
)
ON CONFLICT (key) 
DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- Add an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_secrets_key ON public.secrets(key);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_secrets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER secrets_updated_at
  BEFORE UPDATE ON public.secrets
  FOR EACH ROW
  EXECUTE FUNCTION update_secrets_updated_at();
