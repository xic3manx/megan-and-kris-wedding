/**
 * Menus for the day.
 *
 * RECEPTION_MENU is the standard Mastro's Ocean Club Newport Beach menu
 * (sourced from their public menu page). The wedding-night selection
 * will be a curated subset of these; the full carte is shown here so
 * guests can preview the room's style. Replace with the final wedding-
 * specific menu closer to the date.
 *
 * BREAKFAST_MENU is a minimal placeholder. Pelican Hill's "Villa
 * Clubhouse" PDF link Kris sent turned out to be the Villa Pool
 * all-day lunch menu, not a breakfast menu. Real in-villa breakfast
 * selection TBD.
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
    "Shown below is Mastro's full carte. The wedding-night selection will be a curated subset, finalized closer to the date.",
  sections: [
    {
      title: "Appetizers",
      items: [
        { name: "Caviar Topped Oysters" },
        { name: "Shrimp Cocktail" },
        { name: "Chilled Crab Cocktail" },
        { name: "Lobster Cocktail" },
        { name: "Chilled Red King Crab Legs" },
        { name: "Fried Calamari" },
        { name: "Jumbo Lump Crab Cakes" },
        { name: "Roasted Garlic Jumbo Black Tiger Prawn" },
        { name: "Wagyu Meatballs", description: "Melted burrata cheese" },
        { name: "Caviar" },
        { name: "Sautéed Shrimp" },
        { name: "Sautéed Sea Scallops" },
        { name: "Bigeye Tuna Tartare" },
        { name: "Seared Bigeye Tuna" },
        { name: "Nueske's Maple Glazed Bacon Steak" },
        { name: "Roasted Bone Marrow" },
        { name: "A5 Wagyu Beef Carpaccio" },
      ],
    },
    {
      title: "Sushi Selections",
      description:
        "Developed exclusively for Mastro's by Chef Angel Carbajal of Nick-San, Cabo San Lucas.",
      items: [
        { name: "Hamachi with Crispy Onions" },
        { name: "Crispy Garlic Bigeye Tuna Sashimi" },
        { name: "Bigeye Tuna Tostada" },
        { name: "Hamachi with Ponzu & Kaffir Lime" },
        { name: "Veggie Roll" },
        { name: "Maguro Lime Roll" },
        { name: "A5 Wagyu Beef Roll" },
        { name: "Spiny Lobster Roll" },
      ],
    },
    {
      title: "Soups & Salads",
      items: [
        { name: "Lobster Bisque" },
        { name: "New England Clam Chowder" },
        { name: "Chopped Salad" },
        { name: "Spicy Mambo Salad" },
        { name: "Mastro's House Salad" },
        { name: "Chopped Iceberg Wedge" },
        { name: "Spanish White Anchovy Caesar Salad" },
        { name: "Burrata", description: "Heirloom tomato and fig" },
      ],
    },
    {
      title: "Seafood",
      items: [
        { name: "Chilean Sea Bass" },
        { name: "Alaskan Halibut" },
        { name: "Norwegian Cold Water Salmon" },
        { name: "Bigeye Tuna Sashimi Style" },
        { name: "Herb Roasted Branzino" },
        { name: "Twin Lobster Tails" },
        { name: "Jumbo Lobster Tail" },
        { name: "Roasted Garlic Red King Crab Legs" },
        { name: "Roasted Garlic Jumbo Black Tiger Prawns" },
      ],
    },
    {
      title: "Steaks & Chops",
      items: [
        { name: "Petite Filet" },
        { name: "Filet", description: "Multiple sizes available" },
        { name: "Bone-In Filet" },
        { name: "New York Strip" },
        { name: "Bone-In Kansas City Strip" },
        { name: "Brunson 35-Day Dry-Aged Kansas City Strip" },
        { name: "Bone-In Ribeye" },
        { name: 'Chef\'s Cut Ribeye Chop' },
        { name: "Porterhouse" },
        { name: "Rack of Lamb" },
        { name: "Double Cut Pork Chop" },
        { name: "Organic Lemon Pepper Chicken" },
      ],
    },
    {
      title: "Premium Wagyu",
      items: [
        { name: "American Wagyu", description: "WinterFrost Halal" },
        { name: "Australian Wagyu", description: "Westholme Cross Cattle" },
        { name: "Japanese A5 Wagyu", description: "Miyazaki Prefecture" },
        { name: "A5 Kobe Beef", description: "100% Tajima Cattle, Hyōgo Prefecture" },
      ],
    },
    {
      title: "Signature Butters & Sauces",
      items: [
        { name: "Butters", description: "Black truffle · bone marrow · lemon Calabrese" },
        { name: "Sauces", description: "Sautéed blue cheese · peppercorn · béarnaise · garlic herb · spicy garlic" },
      ],
    },
    {
      title: "Potatoes & Vegetables",
      items: [
        { name: "Lobster Mashed Potatoes" },
        { name: "Scalloped Potatoes" },
        { name: "Garlic Mashed Potatoes" },
        { name: "Baked Potato" },
        { name: "French-Fried Potatoes" },
        { name: "White Cheddar Mac & Cheese" },
        { name: "White Cheddar Lobster Mac & Cheese" },
        { name: "Caviar Twice Baked Potato" },
        { name: "Wild Mushroom & Black Truffle Gnocchi" },
        { name: "Roasted Brussels Sprouts" },
        { name: "Rosemary Garlic Wild Mushrooms" },
        { name: "Garlic Truffle Cauliflower" },
        { name: "Asparagus", description: "Steamed or sautéed" },
        { name: "Corn", description: "Creamed or sautéed" },
        { name: "Spinach", description: "Steamed, sautéed, or creamed" },
        { name: "Green Beans with Sliced Almonds" },
        { name: "Sautéed Broccolini" },
      ],
    },
  ],
};

export const BREAKFAST_MENU: MenuCard = {
  id: "breakfast",
  venue: "The Resort at Pelican Hill · Private Villa",
  occasion: "Breakfast with the Couple",
  date: "July 15, 2026",
  time: "8:00 AM – 10:00 AM",
  notes:
    "A relaxed breakfast in the villa. Final menu to be confirmed with Pelican Hill closer to the date.",
  sections: [
    {
      title: "Coming soon",
      description:
        "Coffee and the morning light are confirmed. The rest will land here as we firm up the in-villa breakfast plan with the resort.",
      items: [],
    },
  ],
};
