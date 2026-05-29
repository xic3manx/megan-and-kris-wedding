/**
 * Menus for the day. The Menu page embeds the venue PDFs (or links out
 * to a hosted menu) — no transcribed items. Final wedding-day
 * selections from each venue will be a curated subset.
 */

export interface MenuCard {
  id: string;
  venue: string;
  occasion: string;
  date: string;
  time: string;
  notes?: string;
  /** Public PDF URL — embedded in an iframe on the Menu page. */
  pdfUrl?: string;
  /** External HTML menu URL — used when no PDF exists. */
  linkUrl?: string;
  linkLabel?: string;
}

export const RECEPTION_MENU: MenuCard = {
  id: "reception",
  venue: "Mastro's Ocean Club · Newport Beach",
  occasion: "Reception Dinner",
  date: "July 14, 2026",
  time: "5:00 PM – 8:00 PM",
  notes:
    "Mastro's hosts the reception. Their full menu is below — the wedding-night selection will be a curated subset, finalized closer to the date.",
  linkUrl:
    "https://www.mastrosrestaurants.com/location/mastros-ocean-club-newport-beach/#menus",
  linkLabel: "View Mastro's menus",
};

export const BREAKFAST_MENU: MenuCard = {
  id: "breakfast",
  venue: "The Resort at Pelican Hill",
  occasion: "Breakfast with the Couple",
  date: "July 15, 2026",
  time: "8:00 AM – 10:00 AM",
  notes:
    "The morning-after breakfast at Pelican Hill. Their Coliseum breakfast menu — what we'll be drawing the final selection from.",
  pdfUrl: "https://pelicanhill.com/images/ColiseumBreakfastMenu_May2023.pdf",
};
