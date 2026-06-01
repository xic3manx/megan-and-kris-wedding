/**
 * Newport Coast travel notes for guests. A short, self-checkout
 * guide of nearby Marriotts, a handful of restaurants we'd send
 * you to ourselves, and a few things to do for anyone with an
 * afternoon to wander. Edit freely; the Itinerary page re-renders.
 */

export interface TravelItem {
  name: string;
  blurb: string;
  /** Optional postal address shown below the blurb. */
  address?: string;
  /** Maps link — used for the "open in maps" button. */
  mapUrl?: string;
  /** Hotel / restaurant / venue site for booking or details. */
  websiteUrl?: string;
  /** Short callout chip, e.g. "for our east-coast guests". */
  tag?: string;
}

export const STAY: TravelItem[] = [
  {
    name: "Marriott's Newport Coast Villas",
    blurb:
      "Across the road from Pelican Hill. The closest possible stay — villa-style suites.",
    address: "23000 Newport Coast Drive, Newport Beach, CA 92657",
    mapUrl: "https://maps.apple.com/?q=Marriott%27s+Newport+Coast+Villas",
  },
  {
    name: "Newport Beach Marriott Hotel & Spa",
    blurb:
      "Five minutes away on Newport Center, with Fashion Island shopping across the street.",
    address: "900 Newport Center Drive, Newport Beach, CA 92660",
    mapUrl: "https://maps.apple.com/?q=Newport+Beach+Marriott+Hotel+%26+Spa",
  },
  {
    name: "Marriott Irvine Spectrum",
    blurb:
      "Fifteen minutes inland, closest to John Wayne Airport (SNA) and the Spectrum shops.",
    address: "7905 Gateway Boulevard, Irvine, CA 92618",
    mapUrl: "https://maps.apple.com/?q=Marriott+Irvine+Spectrum",
  },
];

export const EAT: TravelItem[] = [
  {
    name: "Din Tai Fung",
    blurb:
      "Xiao long bao at South Coast Plaza, ten minutes from the resort. Walk-ins wait an hour or more — book the reservation online, or have it delivered to your hotel.",
    address: "3333 Bristol Street, Costa Mesa, CA 92626",
    mapUrl: "https://maps.apple.com/?q=Din+Tai+Fung+South+Coast+Plaza",
    websiteUrl: "https://dintaifungusa.com/",
  },
  {
    name: "In-N-Out Burger",
    blurb:
      "For our east-coast guests who have never had one. Order a Double-Double, Animal Style. Multiple locations within ten minutes.",
    mapUrl: "https://maps.apple.com/?q=In+N+Out+Burger+Newport+Beach",
    websiteUrl: "https://www.in-n-out.com/locations",
    tag: "for our east-coast guests",
  },
  {
    name: "Javier's at Crystal Cove",
    blurb:
      "Mexican at the Crystal Cove Promenade, five minutes from the resort. The room is the show. Reservations recommended.",
    address: "7832 East Coast Highway, Newport Beach, CA 92657",
    mapUrl: "https://maps.apple.com/?q=Javier%27s+Crystal+Cove",
    websiteUrl: "https://javiers.com/",
  },
  {
    name: "Bear Flag Fish Co.",
    blurb:
      "Fish tacos at the Newport Pier. Walk-up counter, casual, brilliant.",
    address: "407 31st Street, Newport Beach, CA 92663",
    mapUrl: "https://maps.apple.com/?q=Bear+Flag+Fish+Co",
    websiteUrl: "https://bearflagfishco.com/",
  },
];

export const SEE: TravelItem[] = [
  {
    name: "Crystal Cove State Park",
    blurb:
      "Three and a half miles of coast, tidepools, 1930s historic cottages, and hiking trails up Moro Canyon. Where the ceremony is — but the rest of the park is worth a morning of its own.",
    address: "8471 N Coast Highway, Laguna Beach, CA 92651",
    mapUrl: "https://maps.apple.com/?q=Crystal+Cove+State+Park",
    websiteUrl: "https://www.parks.ca.gov/?page_id=644",
    tag: "scenery · landscapes",
  },
  {
    name: "Laguna Beach galleries & Art Museum",
    blurb:
      "Downtown Laguna packs dozens of small galleries within a walkable few blocks, plus the Laguna Art Museum on the cliff above Main Beach.",
    address: "307 Cliff Drive, Laguna Beach, CA 92651",
    mapUrl: "https://maps.apple.com/?q=Laguna+Art+Museum",
    websiteUrl: "https://lagunaartmuseum.org/",
    tag: "art",
  },
  {
    name: "Sawdust Art Festival",
    blurb:
      "An outdoor art market in Laguna Canyon — local makers, glass-blowing, ceramics, painting. Runs through the summer.",
    address: "935 Laguna Canyon Road, Laguna Beach, CA 92651",
    mapUrl: "https://maps.apple.com/?q=Sawdust+Art+Festival+Laguna",
    websiteUrl: "https://www.sawdustartfestival.org/",
    tag: "art",
  },
  {
    name: "Pageant of the Masters",
    blurb:
      "Live tableau-vivants of famous paintings — one of those rare, one-of-a-kind things you only see in Laguna. Runs July through August.",
    address: "650 Laguna Canyon Road, Laguna Beach, CA 92651",
    mapUrl: "https://maps.apple.com/?q=Festival+of+Arts+Laguna",
    websiteUrl: "https://www.foapom.com/",
    tag: "art",
  },
  {
    name: "Balboa Island & the Fun Zone Ferry",
    blurb:
      "A three-minute ferry across Newport Harbor onto Balboa Island. Frozen bananas, candy shops, and a glimpse of old-school OC.",
    address: "410 S Bayfront, Newport Beach, CA 92662",
    mapUrl: "https://maps.apple.com/?q=Balboa+Island+Ferry",
    tag: "scenery",
  },
];
