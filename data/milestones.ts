/**
 * Milestones plotted along the Bride & Groom Tracker.
 *
 * Coordinate system: matches the SVG viewBox 0 0 400 620 used in
 * <BrideGroomTracker />. The California outline is drawn in the same
 * coordinate space, so {x,y} for each milestone is its on-map position.
 *
 * "side" controls which color the dot uses:
 *   - megan  → lavender
 *   - kris   → rose
 *   - shared → gold (used for the wedding venue itself)
 *
 * EDIT FREELY. Add, remove, reorder. The tracker re-flows automatically.
 */

export type Side = "megan" | "kris" | "shared";

export interface Milestone {
  id: string;
  side: Side;
  city: string;
  year: string;
  title: string;
  body: string;
  /** SVG x in viewBox 0..400 */
  x: number;
  /** SVG y in viewBox 0..620 */
  y: number;
}

// City pins — anchor points for the two paths. Coordinates are in
// the BrideGroomTracker SVG viewBox (0..400 × 0..620) and were tuned
// to sit inside the California outline drawn there.
//   Eureka  — NW coast, just inland of the cape
//   Irvine  — inland (NE) of Newport Coast
//   Newport — on the OC bump of the south coast (the wedding venue)
export const PIN_EUREKA = { x: 78, y: 110 };
export const PIN_IRVINE = { x: 296, y: 478 };
export const PIN_NEWPORT = { x: 286, y: 494 };

export const MILESTONES: Milestone[] = [
  {
    id: "megan-1",
    side: "megan",
    city: "Eureka",
    year: "Where Megan grew up",
    title: "The north coast",
    body: "Redwoods, the cold Pacific, and the long road south.",
    ...PIN_EUREKA,
  },
  {
    id: "kris-1",
    side: "kris",
    city: "Irvine",
    year: "Where Kris lives now",
    title: "Twenty minutes inland",
    body: "Anduril by day, the bluff above the ocean by July.",
    ...PIN_IRVINE,
  },
  {
    id: "shared-wedding",
    side: "shared",
    city: "Newport Coast",
    year: "07.14.2026",
    title: "Where we'll say yes",
    body: "The Resort at Pelican Hill, above the long blue Pacific. Ceremony at noon.",
    ...PIN_NEWPORT,
  },
];

/**
 * Path geometry for the two animated lines. Routed through the interior
 * so they stay clearly inside the California outline drawn in
 * <BrideGroomTracker />.
 */
export const MEGAN_PATH = `M ${PIN_EUREKA.x} ${PIN_EUREKA.y}
  C 115 150, 150 185, 175 220
  C 205 265, 220 310, 220 355
  C 225 400, 250 445, ${PIN_NEWPORT.x} ${PIN_NEWPORT.y}`;

export const KRIS_PATH = `M ${PIN_IRVINE.x} ${PIN_IRVINE.y}
  C 292 484, 290 488, ${PIN_NEWPORT.x} ${PIN_NEWPORT.y}`;
