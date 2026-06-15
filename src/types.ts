/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Listing {
  id: number;
  title: string;
  description: string;
  location: string;
  country: string;
  distance: string;
  dateRange: string;
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  category: string;
  images: string[];
  hostName: string;
  hostAvatar: string;
  maxGuests: number;
  beds: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  coordinates: { lat: number; lng: number };
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
}

export interface SearchFilters {
  destination: string;
  startDate: string;
  endDate: string;
  guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
}

export interface FilterOptions {
  maxPrice: number;
  minRating: number;
  propertyType: string;
  hasWifi: boolean;
  hasPool: boolean;
  hasAirConditioning: boolean;
}

export interface Booking {
  id: string;
  listingId: number;
  listingTitle: string;
  listingLocation: string;
  listingImage: string;
  startDate: string;
  endDate: string;
  guestsCount: number;
  totalPaid: number;
  checkInCode: string; // 6-digit access PIN
  wifiPassword?: string;
  status: 'active' | 'completed' | 'cancelled';
  bookedAt: string;
}

