-- Create approved_third_party_places table
-- This table stores the approval status of restaurants, bars, and tour agencies from Google Places

CREATE TABLE IF NOT EXISTS approved_third_party_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  place_id VARCHAR(255) NOT NULL, -- Google Places ID
  name VARCHAR(500) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('restaurant', 'bar', 'cafe', 'night_club', 'tour_agency')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  recommended BOOLEAN NOT NULL DEFAULT FALSE, -- Hotel's recommended/highlighted places
  google_data JSONB NOT NULL, -- Store full Google Places data for later use
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hotel_id, place_id) -- Prevent duplicate approvals for the same place
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_approved_places_hotel_id ON approved_third_party_places(hotel_id);
CREATE INDEX IF NOT EXISTS idx_approved_places_status ON approved_third_party_places(status);
CREATE INDEX IF NOT EXISTS idx_approved_places_type ON approved_third_party_places(type);
CREATE INDEX IF NOT EXISTS idx_approved_places_hotel_status ON approved_third_party_places(hotel_id, status);
CREATE INDEX IF NOT EXISTS idx_approved_places_recommended ON approved_third_party_places(recommended);
CREATE INDEX IF NOT EXISTS idx_approved_places_hotel_recommended ON approved_third_party_places(hotel_id, recommended);

-- Add RLS policies
ALTER TABLE approved_third_party_places ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their hotel's approved places
CREATE POLICY "Users can view their hotel's approved third party places"
  ON approved_third_party_places
  FOR SELECT
  USING (
    hotel_id IN (
      SELECT id FROM hotels WHERE id = hotel_id
    )
  );

-- Policy: Authenticated users can insert for their hotel
CREATE POLICY "Authenticated users can add third party places"
  ON approved_third_party_places
  FOR INSERT
  TO authenticated
  WITH CHECK (
    hotel_id IN (
      SELECT id FROM hotels WHERE id = hotel_id
    )
  );

-- Policy: Authenticated users can update their hotel's places
CREATE POLICY "Authenticated users can update their hotel's third party places"
  ON approved_third_party_places
  FOR UPDATE
  TO authenticated
  USING (
    hotel_id IN (
      SELECT id FROM hotels WHERE id = hotel_id
    )
  )
  WITH CHECK (
    hotel_id IN (
      SELECT id FROM hotels WHERE id = hotel_id
    )
  );

-- Policy: Authenticated users can delete their hotel's places
CREATE POLICY "Authenticated users can delete their hotel's third party places"
  ON approved_third_party_places
  FOR DELETE
  TO authenticated
  USING (
    hotel_id IN (
      SELECT id FROM hotels WHERE id = hotel_id
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_approved_third_party_places_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
CREATE TRIGGER trigger_update_approved_third_party_places_updated_at
  BEFORE UPDATE ON approved_third_party_places
  FOR EACH ROW
  EXECUTE FUNCTION update_approved_third_party_places_updated_at();

-- Comment on table
COMMENT ON TABLE approved_third_party_places IS 'Stores approved/rejected restaurants, bars, and tour agencies from Google Places for each hotel';
