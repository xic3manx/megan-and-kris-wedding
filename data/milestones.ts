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
export const PIN_EUREKA = { x: 78, y: 110 };
export const PIN_IRVINE = { x: 268, y: 482 };
export const PIN_NEWPORT = { x: 286, y: 494 }; // on the OC coast bump

export const MILESTONES: Milestone[] = [
  // ---- Megan's path: Eureka → Newport ----
  {
    id: "megan-1",
    side: "megan",
    city: "Eureka",
    year: "Where it began",
    title: "Megan grew up here",
    body: "On the foggy north coast — redwoods to the east, the cold Pacific to the west. (Edit me in data/milestones.ts.)",
    ...PIN_EUREKA,
  },
  {
    id: "megan-2",
    side: "megan",
    city: "On the way south",
    year: "Add year",
    title: "A waypoint along the way",
    body: "Replace this with a milestone — a school, a first apartment, a place that mattered. (Edit me.)",
    x: 132,
    y: 230,
  },
  {
    id: "megan-3",
    side: "megan",
    city: "Add a city",
    year: "Add year",
    title: "Another milestone",
    body: "Add or remove milestones in data/milestones.ts to reshape the path.",
    x: 196,
    y: 360,
  },

  // ---- Kris's path: Irvine → Newport ----
  {
    id: "kris-1",
    side: "kris",
    city: "Irvine",
    year: "Home base",
    title: "Kris lives here",
    body: "Just inland of the Pacific, twenty minutes from the ceremony. (Edit me in data/milestones.ts.)",
    ...PIN_IRVINE,
  },
  {
    id: "kris-2",
    side: "kris",
    city: "Add a city",
    year: "Add year",
    title: "A meaningful place",
    body: "Where you grew up, schools, jobs, anywhere worth remembering on the way to here.",
    x: 240,
    y: 420,
  },

  // ---- Shared: where they met / where they're getting married ----
  {
    id: "shared-met",
    side: "shared",
    city: "Where you met",
    year: "Add year",
    title: "The day everything changed",
    body: "The story of how you met — replace this in data/milestones.ts. The dot can move anywhere on the map.",
    x: 250,
    y: 440,
  },
  {
    id: "shared-wedding",
    side: "shared",
    city: "Newport Coast",
    year: "07.14.2026",
    title: "We're getting married here",
    body: "The Resort at Pelican Hill, by the sea. Ceremony at noon, then everything that comes after.",
    ...PIN_NEWPORT,
  },
];

/**
 * Path geometry for the two animated lines. Cubic bezier curves through
 * a handful of waypoints to feel like a hand-drawn route on an old map.
 */
export const MEGAN_PATH = `M ${PIN_EUREKA.x} ${PIN_EUREKA.y}
  C ${PIN_EUREKA.x + 10} ${PIN_EUREKA.y + 80}, 100 200, 130 240
  C 160 280, 175 320, 200 360
  C 220 395, 240 430, ${PIN_NEWPORT.x} ${PIN_NEWPORT.y}`;

export const KRIS_PATH = `M ${PIN_IRVINE.x} ${PIN_IRVINE.y}
  C ${PIN_IRVINE.x - 4} ${PIN_IRVINE.y + 4}, ${PIN_IRVINE.x - 6} ${PIN_IRVINE.y + 6}, ${PIN_NEWPORT.x} ${PIN_NEWPORT.y}`;
