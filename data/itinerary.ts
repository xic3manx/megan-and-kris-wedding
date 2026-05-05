/**
 * Day-of itinerary. Edit times/copy here; the page re-flows automatically.
 */

export interface Stop {
  id: string;
  date: string; // pretty format
  time: string;
  title: string;
  venue: string;
  address: string;
  blurb: string;
  mapUrl: string;
  websiteUrl?: string;
  /** image path under /public/images/venues/, or null for placeholder */
  image?: string;
  attire?: string;
}

export const STOPS: Stop[] = [
  {
    id: "ceremony",
    date: "Tuesday · July 14, 2026",
    time: "12:00 PM",
    title: "The Ceremony",
    venue: "The Resort at Pelican Hill — Private Villa",
    address: "22701 Pelican Hill Road S, Newport Coast, CA 92657",
    blurb:
      "We say I do at noon, on the bluff above the Pacific. Light lunch and conversation to follow at the villa. Plan to arrive by 11:30; the ceremony begins at twelve sharp.",
    mapUrl: "https://maps.apple.com/?q=The+Resort+at+Pelican+Hill,+Newport+Coast",
    websiteUrl: "https://www.pelicanhill.com",
    image: "/images/venues/pelican-hill.jpg",
    attire: "Garden formal · Lavender, plum, dusty rose welcome.",
  },
  {
    id: "reception",
    date: "Tuesday · July 14, 2026",
    time: "5:00 PM – 8:00 PM",
    title: "The Reception",
    venue: "Mastro's Ocean Club — Newport Beach",
    address: "8112 East Coast Highway, Newport Coast, CA 92657",
    blurb:
      "Dinner with the thirteen of you, by the dark glass and candlelight at Mastro's. Steak, oysters, the works — and toasts that we hope are not too long.",
    mapUrl: "https://maps.apple.com/?q=Mastro%27s+Ocean+Club+Newport",
    websiteUrl: "https://www.mastrosrestaurants.com/MastrosOceanClubNewportBeach.aspx",
    image: "/images/venues/mastros.jpg",
    attire: "Cocktail attire · Wear what you'd wear to dinner with us.",
  },
  {
    id: "breakfast",
    date: "Wednesday · July 15, 2026",
    time: "8:00 AM – 10:00 AM",
    title: "Breakfast With the Couple",
    venue: "The Resort at Pelican Hill — Private Villa",
    address: "22701 Pelican Hill Road S, Newport Coast, CA 92657",
    blurb:
      "Coffee, pastries, eggs, and the first morning of the rest of it. A slow goodbye before everyone scatters — drop by anytime in the window.",
    mapUrl: "https://maps.apple.com/?q=The+Resort+at+Pelican+Hill,+Newport+Coast",
    websiteUrl: "https://www.pelicanhill.com",
    image: "/images/venues/pelican-hill-breakfast.jpg",
    attire: "Comfortable. Beach robes acceptable.",
  },
];
