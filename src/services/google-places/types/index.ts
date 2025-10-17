export interface PlaceLocation {
  lat: number;
  lng: number;
}

export interface Restaurant {
  place_id: string;
  name: string;
  vicinity: string;
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  business_status?: string;
  geometry: {
    location: PlaceLocation;
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  photo_url?: string;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  types?: string[];
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  url?: string;
  wheelchair_accessible_entrance?: boolean;
  delivery?: boolean;
  dine_in?: boolean;
  takeout?: boolean;
  reservable?: boolean;
  serves_breakfast?: boolean;
  serves_lunch?: boolean;
  serves_dinner?: boolean;
  serves_beer?: boolean;
  serves_wine?: boolean;
  serves_vegetarian_food?: boolean;
}

export interface NearbyRestaurantsParams {
  location: PlaceLocation;
  radius: number;
  apiKey: string;
}

export interface NearbyRestaurantsResponse {
  results: Restaurant[];
  status: string;
  error_message?: string;
  next_page_token?: string;
}
