/**
 * Menus for the day. Edit freely — the Menu page re-renders.
 *
 * Mastro's Ocean Club Newport will provide the actual reception menu
 * closer to the date; what's here are placeholders that respect their
 * style. Replace before the wedding.
 */

export interface MenuSection {
  title: string;
  description?: string;
  items: { name: string; description?: string }[];
}

export interface MenuCard {
  id: string;
  venue: string;
  occasion: string;
  date: string;
  time: string;
  notes?: string;
  sections: MenuSection[];
  wines?: { name: string; description?: string }[];
}

export const RECEPTION_MENU: MenuCard = {
  id: "reception",
  venue: "Mastro's Ocean Club · Newport Beach",
  occasion: "Reception Dinner",
  date: "July 14, 2026",
  time: "5:00 PM – 8:00 PM",
  notes:
    "A four-course dinner served family-style and plated. Final menu is being arranged with Mastro's; the below is the working draft.",
  sections: [
    {
      title: "First Course · The Tower",
      description: "Mastro's iconic seafood tower for the table",
      items: [
        { name: "Maine Lobster Tail" },
        { name: "Jumbo Shrimp Cocktail" },
        { name: "King Crab" },
        { name: "Oysters on the Half Shell" },
      ],
    },
    {
      title: "Second Course · A Garden",
      items: [
        { name: "Wedge Salad", description: "Iceberg, blue cheese, applewood bacon, heirloom tomato" },
        { name: "Caesar", description: "Romaine hearts, white anchovy, parmesan tuile" },
      ],
    },
    {
      title: "Third Course · From the Sea & The Land",
      description: "Choose one. Let us know in advance.",
      items: [
        { name: "Bone-In Filet Mignon", description: "16oz, USDA Prime, peppercorn cream" },
        { name: "Chilean Sea Bass", description: "Miso glaze, baby bok choy, ginger-soy reduction" },
        { name: "Vegetarian Risotto", description: "Wild mushroom, truffle, pecorino" },
      ],
    },
    {
      title: "Fourth Course · The Sweet Hour",
      items: [
        { name: "Wedding Cake", description: "Lavender-honey buttercream, Madagascar vanilla, blackberry compote" },
        { name: "Petit Fours", description: "Dark chocolate, raspberry, edible rose" },
      ],
    },
  ],
  wines: [
    { name: "Champagne", description: "For the toast — selection from the cellar" },
    { name: "California Pinot Noir", description: "Sonoma Coast" },
    { name: "Burgundy Chardonnay", description: "Côte de Beaune" },
  ],
};

export const BREAKFAST_MENU: MenuCard = {
  id: "breakfast",
  venue: "The Resort at Pelican Hill · Private Villa",
  occasion: "Breakfast with the Couple",
  date: "July 15, 2026",
  time: "8:00 AM – 10:00 AM",
  notes:
    "A relaxed buffet on the patio. Drop by any time in the window — coffee will be hot, the ocean will be there.",
  sections: [
    {
      title: "From the Bakery",
      items: [
        { name: "Almond Croissants", description: "Warm from the resort kitchen" },
        { name: "Pain au Chocolat" },
        { name: "Lavender Scones", description: "Clotted cream and berry preserves" },
      ],
    },
    {
      title: "From the Stove",
      items: [
        { name: "Soft Scrambled Eggs", description: "Crème fraîche, chives" },
        { name: "Frittata of the Morning", description: "Seasonal vegetables, goat cheese" },
        { name: "Applewood Bacon · Chicken Apple Sausage" },
      ],
    },
    {
      title: "From the Garden",
      items: [
        { name: "Fresh Fruit", description: "Stone fruit, berries, melon" },
        { name: "Avocado Toast", description: "Sourdough, lemon, sea salt, espelette" },
      ],
    },
  ],
  wines: [
    { name: "Coffee", description: "Stumptown · pour-over and espresso" },
    { name: "Mimosa Bar", description: "Champagne, fresh-pressed juices" },
    { name: "Loose-Leaf Tea", description: "Earl Grey, English Breakfast, Chamomile" },
  ],
};
