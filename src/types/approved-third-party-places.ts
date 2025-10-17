/**
 * Approved Third Party Places Types
 *
 * Types for managing approved/rejected restaurants, bars, and tour agencies
 */

import { Restaurant } from "../services/googlePlaces.service";

export type ThirdPartyPlaceType =
  | "restaurant"
  | "bar"
  | "cafe"
  | "night_club"
  | "tour_agency"
  | "gym";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ApprovedThirdPartyPlace {
  id: string;
  hotel_id: string;
  place_id: string; // Google Places ID
  name: string;
  type: ThirdPartyPlaceType;
  status: ApprovalStatus;
  recommended: boolean; // Hotel's recommended/highlighted places
  google_data: Restaurant; // Full Google Places data
  created_at: string;
  updated_at: string;
}

export interface CreateApprovedPlaceInput {
  hotel_id: string;
  place_id: string;
  name: string;
  type: ThirdPartyPlaceType;
  status: ApprovalStatus;
  recommended?: boolean;
  google_data: Restaurant;
}

export interface UpdateApprovedPlaceInput {
  id: string;
  status?: ApprovalStatus;
  recommended?: boolean;
  google_data?: Restaurant;
}
