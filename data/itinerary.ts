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
  /** image path under /public/images/, or null for placeholder */
  image?: string;
  attire?: string;
}

export const STOPS: Stop[] = [
  {
    id: "welcome",
    date: "Tuesday · July 14, 2026",
    time: "12:00 PM",
    title: "Gather at the Villa",
    venue: "The Resort at Pelican Hill — Private Villa",
    address: "22701 Pelican Hill Road S, Newport Coast, CA 92657",
    blurb:
      "An hour to find each other before the ceremony — say hello, settle in, the first photos. At one o'clock we cross the road together.",
    mapUrl:
      "https://maps.apple.com/?q=The+Resort+at+Pelican+Hill,+Newport+Coast",
    websiteUrl: "https://www.pelicanhill.com",
    image: "/images/pelican-hill.jpg",
    attire: "Formal — photos will be taken throughout.",
  },
  {
    id: "ceremony",
    date: "Tuesday · July 14, 2026",
    time: "1:00 PM",
    title: "The Ceremony",
    venue: "Crystal Cove State Park",
    address: "Pelican Point · Newport Coast, CA 92657",
    blurb:
      "A one-minute drive across PCH to the bluff above the cove. Our photographer ordains us by the ocean. After, we head back to the villa to settle in and snack through the afternoon before dinner.",
    mapUrl:
      "https://maps.apple.com/?q=Crystal+Cove+State+Park,+Newport+Coast,+CA",
    image: "/images/crystal-cove.jpg",
  },
  {
    id: "reception",
    date: "Tuesday · July 14, 2026",
    time: "5:00 PM – 8:00 PM",
    title: "The Reception",
    venue: "Mastro's Ocean Club — Newport Beach",
    address: "8112 East Coast Highway, Newport Coast, CA 92657",
    blurb:
      "Dinner at Mastro's, by the dark glass and candlelight. Steak, oysters, the works — and toasts that we hope are not too long.",
    mapUrl: "https://maps.apple.com/?q=Mastro%27s+Ocean+Club+Newport",
    websiteUrl:
      "https://www.mastrosrestaurants.com/MastrosOceanClubNewportBeach.aspx",
    image: "/images/mastros.jpg",
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
    mapUrl:
      "https://maps.apple.com/?q=The+Resort+at+Pelican+Hill,+Newport+Coast",
    websiteUrl: "https://www.pelicanhill.com",
    image: "/images/pelican-hill-breakfast.jpg",
    attire: "Normal breakfast attire.",
  },
];
