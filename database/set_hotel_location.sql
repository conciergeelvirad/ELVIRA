-- Set the correct location for Centro Hotel Mondial (Frankfurt, Germany)
-- Coordinates: 50.110924, 8.682127 (latitude, longitude)

UPDATE hotels 
SET location = ST_SetSRID(ST_MakePoint(8.682127, 50.110924), 4326)::geography
WHERE id = '086e11e4-4775-4327-8448-3fa0ee7be0a5';

-- Verify the update
SELECT 
  id, 
  name,
  ST_AsText(location::geometry) as location_text,
  ST_X(location::geometry) as longitude,
  ST_Y(location::geometry) as latitude
FROM hotels 
WHERE id = '086e11e4-4775-4327-8448-3fa0ee7be0a5';

-- Expected result:
-- longitude: 8.682127
-- latitude: 50.110924
-- location_text: POINT(8.682127 50.110924)
