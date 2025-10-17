-- Create RPC function to extract coordinates from hotel geography
-- This function is used by the Tours page to get hotel location dynamically

CREATE OR REPLACE FUNCTION get_coordinates_from_geography(hotel_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'latitude', ST_Y(location::geometry),
    'longitude', ST_X(location::geometry)
  )
  INTO result
  FROM hotels
  WHERE id = hotel_id;
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_coordinates_from_geography(UUID) TO authenticated;

-- Test the function
SELECT get_coordinates_from_geography('086e11e4-4775-4327-8448-3fa0ee7be0a5');

-- Expected result: {"latitude": 50.110924, "longitude": 8.682127}
