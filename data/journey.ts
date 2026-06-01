/**
 * Real-world coordinates for the journey map. Drives the Leaflet
 * map on the home page (<CaliforniaJourneyMap />). Replaces the
 * SVG-viewBox coordinates the old SVG tracker used.
 */

export type LatLng = [number, number]; // [lat, lng]
export type Side = "megan" | "kris" | "shared" | "reception";

export interface Place {
  id: string;
  side: Side;
  name: string;
  subtitle?: string;
  latlng: LatLng;
}

export const PLACES: Place[] = [
  {
    id: "eureka",
    side: "megan",
    name: "Eureka",
    subtitle: "Where Megan grew up",
    latlng: [40.8021, -124.1637],
  },
  {
    id: "irvine",
    side: "kris",
    name: "Irvine",
    subtitle: "Where Kris lives now",
    latlng: [33.6846, -117.8265],
  },
  {
    id: "pelican",
    side: "shared",
    name: "Pelican Hill",
    subtitle: "07.14.2026",
    latlng: [33.5856, -117.8347],
  },
  {
    id: "mastros",
    side: "reception",
    name: "Mastro's Ocean Club",
    subtitle: "Reception · 5:00 PM",
    latlng: [33.5994, -117.8729],
  },
];

/** Inland route from Eureka south to Newport via I-5 (approximate). */
export const MEGAN_ROUTE: LatLng[] = [
  [40.8021, -124.1637], // Eureka
  [40.5865, -122.3917], // Redding
  [38.5816, -121.4944], // Sacramento
  [37.5485, -121.9886], // Bay area edge
  [36.7378, -119.7871], // Fresno
  [35.3733, -119.0187], // Bakersfield
  [34.0522, -118.2437], // Los Angeles
  [33.5856, -117.8347], // Pelican Hill
];

/** Short hop from Irvine SW to Newport (15 minutes by car). */
export const KRIS_ROUTE: LatLng[] = [
  [33.6846, -117.8265], // Irvine
  [33.5856, -117.8347], // Pelican Hill
];

/** Ceremony to reception — Pelican Hill to Mastro's, ~5 minutes across PCH. */
export const MASTROS_ROUTE: LatLng[] = [
  [33.5856, -117.8347], // Pelican Hill
  [33.5994, -117.8729], // Mastro's Ocean Club
];

/**
 * California state outline — clockwise from the NW corner. Simplified
 * to ~45 vertices, enough to be clearly recognizable as California
 * without dragging the bundle down.
 */
export const CALIFORNIA_OUTLINE: LatLng[] = [
  [42.00, -124.21], // NW corner (Crescent City)
  [42.00, -120.00], // NE corner (OR/NV)
  [39.00, -120.00], // Tahoe kink
  [35.00, -114.63], // NV/AZ corner near Lake Mead
  [34.45, -114.13],
  [33.10, -114.66], // Colorado River
  [32.72, -114.72], // AZ/Mexico corner
  [32.61, -115.66],
  [32.54, -117.13], // SD / Tijuana coast
  [32.85, -117.27],
  [33.10, -117.31], // Camp Pendleton coast
  [33.45, -117.71], // San Clemente
  [33.59, -117.83], // OC bump
  [33.71, -118.10], // Huntington Beach
  [33.74, -118.39], // Palos Verdes
  [34.02, -118.50], // Santa Monica
  [34.04, -118.81], // Malibu
  [34.13, -119.21], // Pt Mugu
  [34.18, -119.30], // Oxnard
  [34.41, -120.05], // Santa Barbara
  [34.46, -120.47], // Point Conception (elbow)
  [34.59, -120.65],
  [34.90, -120.65], // Vandenberg
  [35.18, -120.74], // Pismo Beach
  [35.66, -121.27], // Cambria
  [35.85, -121.39],
  [36.16, -121.66], // Big Sur
  [36.31, -121.90],
  [36.51, -121.94], // Pt Sur
  [36.61, -121.90], // Monterey
  [36.79, -121.79], // Moss Landing
  [36.97, -122.03], // Santa Cruz
  [37.18, -122.40], // Half Moon Bay
  [37.80, -122.51], // Golden Gate
  [37.99, -123.02], // Pt Reyes
  [38.30, -123.05], // Bodega Bay
  [38.68, -123.39], // Sea Ranch
  [39.30, -123.78], // Mendocino
  [39.78, -123.83],
  [40.18, -124.16], // Shelter Cove
  [40.44, -124.40], // Cape Mendocino (westernmost)
  [40.65, -124.27],
  [40.80, -124.16], // Eureka coast
  [41.05, -124.13], // Trinidad
  [41.55, -124.08], // Klamath
  [41.75, -124.20], // Crescent City
];
