export interface AmadeusLocation {
  latitude: number;
  longitude: number;
}

export interface AmadeusActivity {
  id: string;
  name: string;
  shortDescription?: string;
  geoCode: AmadeusLocation;
  rating?: number;
  bookingLink?: string;
  pictures?: string[];
  price?: {
    amount: number;
    currency: string;
  };
  business_hours?: {
    days: string[];
    timeRanges: string[];
  };
  category?: string;
  tags?: string[];
}

export interface AmadeusSearchParams {
  latitude: number;
  longitude: number;
  radius?: number; // in kilometers
  offset?: number;
  limit?: number;
  categories?: string[];
}

export interface AmadeusSearchResponse {
  data: AmadeusActivity[];
  meta: {
    count: number;
    offset: number;
  };
}
