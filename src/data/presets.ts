import { PartyPlan } from '../types';

export const PRESET_PARTIES: PartyPlan[] = [
  {
    id: 'preset-cymbal-bbq',
    criteria: {
      title: "CymbalMart Backyard Summer BBQ Bash",
      eventType: "Outdoor Grill & Pool Party",
      theme: "Smokey Summer BBQ & Lemonade Stand",
      adultCount: 16,
      kidCount: 6,
      durationHours: 4,
      venue: "Backyard Patio & Lawn",
      budgetLevel: "Moderate",
      customBudgetAmount: 260,
      dietaryRestrictions: ["Gluten-Free Options", "Nut Free"],
      additionalNotes: "CymbalMart Choice Angus burgers, grilled corn, fresh watermelon, and craft lemonade."
    },
    themeVibeSummary: "A relaxed, sunny outdoor gathering centered around CymbalMart Choice meats, crisp summer produce, ice-cold lemonades, and backyard games.",
    colorPalette: ["#10B981", "#F59E0B", "#EF4444", "#3B82F6"],
    estimatedTotalBudget: 248,
    createdDate: new Date().toISOString(),
    decorTips: [
      "Set out gingham red & white tablecloths with CymbalMart mason jar flower centerpieces.",
      "Hang string bistro lights along the fence for evening ambiance.",
      "Set up a galvanized ice bucket with CymbalMart craft sodas and sparkling waters."
    ],
    gamesAndPlaylist: {
      games: ["Cornhole Tournament", "Water Balloon Toss for Kids", "BBQ Master Grill Trivia"],
      playlistStyle: "Upbeat Classic Rock, Country Hits, Summer Acoustic Jams"
    },
    shoppingList: [
      {
        id: 'bbq-1',
        name: 'CymbalMart Angus Beef Patties & Veggie Burgers',
        category: 'Food & Menu',
        quantity: '24 patties (3 packs)',
        numericQuantity: 24,
        unit: 'patties',
        estimatedCost: 38,
        isPurchased: false,
        priority: 'Essential',
        isCymbalBrand: true,
        cymbalMartAisle: 'Aisle 4 - Meat, Seafood & Poultry',
        dietaryTags: ['Gluten-Free Options']
      },
      {
        id: 'bbq-2',
        name: 'CymbalMart Bakery Brioche Hamburger Buns',
        category: 'Food & Menu',
        quantity: '3 packs (24 buns total)',
        numericQuantity: 3,
        unit: 'packs',
        estimatedCost: 12,
        isPurchased: false,
        priority: 'Essential',
        isCymbalBrand: true,
        cymbalMartAisle: 'Aisle 3 - Fresh Bakery & Artisan Breads'
      },
      {
        id: 'bbq-3',
        name: 'CymbalMart Fresh Sweet Corn on the Cob & Seedless Watermelon',
        category: 'Food & Menu',
        quantity: '12 corn ears + 1 whole watermelon',
        numericQuantity: 12,
        unit: 'ears',
        estimatedCost: 18,
        isPurchased: true,
        priority: 'Essential',
        isCymbalBrand: true,
        cymbalMartAisle: 'Aisle 1 - Fresh Produce & Salads',
        dietaryTags: ['Gluten-Free Options', 'Vegetarian']
      },
      {
        id: 'bbq-4',
        name: 'CymbalMart Deli Potato Salad & Coleslaw Tubs',
        category: 'Food & Menu',
        quantity: '2 large 32oz tubs',
        numericQuantity: 2,
        unit: 'tubs',
        estimatedCost: 16,
        isPurchased: false,
        priority: 'Essential',
        isCymbalBrand: true,
        cymbalMartAisle: 'Aisle 2 - CymbalMart Deli & Prepared Foods'
      },
      {
        id: 'bbq-5',
        name: 'CymbalMart Fresh Squeezed Old-Fashioned Lemonade',
        category: 'Beverages & Bar',
        quantity: '3 jugs (1 gallon total)',
        numericQuantity: 3,
        unit: 'jugs',
        estimatedCost: 14,
        isPurchased: false,
        priority: 'Essential',
        isCymbalBrand: true,
        cymbalMartAisle: 'Aisle 5 - Dairy, Cheese & Chilled Juices'
      },
      {
        id: 'bbq-6',
        name: 'CymbalMart Select IPA & Summer Wheat Craft Beer 12-Packs',
        category: 'Beverages & Bar',
        quantity: '2 12-packs',
        numericQuantity: 2,
        unit: 'packs',
        estimatedCost: 32,
        isPurchased: false,
        priority: 'Essential',
        isCymbalBrand: true,
        cymbalMartAisle: 'Aisle 8 - Beverages, Craft Beer & Wines'
      },
      {
        id: 'bbq-7',
        name: 'CymbalMart Kettle Chips & House Dip Flight',
        category: 'Food & Menu',
        quantity: '3 family bags + 2 dips',
        numericQuantity: 3,
        unit: 'bags',
        estimatedCost: 15,
        isPurchased: false,
        priority: 'Recommended',
        isCymbalBrand: true,
        cymbalMartAisle: 'Aisle 7 - Snacks, Chips & Dips'
      },
      {
        id: 'bbq-8',
        name: 'CymbalMart Eco-Friendly Compostable Plates, Cups & Cutlery',
        category: 'Tableware & Supplies',
        quantity: '50-count party combo pack',
        numericQuantity: 1,
        unit: 'pack',
        estimatedCost: 18,
        isPurchased: false,
        priority: 'Essential',
        isCymbalBrand: true,
        cymbalMartAisle: 'Aisle 12 - CymbalMart Party Supplies & Paper Goods'
      },
      {
        id: 'bbq-9',
        name: 'Summer Gingham Checkered Tablecloths & Bistro Banners',
        category: 'Decor & Vibe',
        quantity: '3 tablecloths + 1 banner',
        numericQuantity: 3,
        unit: 'items',
        estimatedCost: 22,
        isPurchased: false,
        priority: 'Recommended',
        cymbalMartAisle: 'Aisle 12 - CymbalMart Party Supplies & Paper Goods'
      },
      {
        id: 'bbq-10',
        name: 'CymbalMart Bakery Berry Sheet Cake',
        category: 'Food & Menu',
        quantity: 'Half-sheet cake (serves 24)',
        numericQuantity: 1,
        unit: 'cake',
        estimatedCost: 28,
        isPurchased: false,
        priority: 'Essential',
        isCymbalBrand: true,
        cymbalMartAisle: 'Aisle 3 - Fresh Bakery & Artisan Breads'
      }
    ],
    timeline: [
      { id: 'bt-1', timeframe: '1 Week Before', task: 'Confirm guest count and reserve CymbalMart Curbside Pickup window.', completed: true },
      { id: 'bt-2', timeframe: '2 Days Before', task: 'Pick up dry goods, paper tableware, and craft sodas at CymbalMart.', completed: false },
      { id: 'bt-3', timeframe: 'Day Before', task: 'Marinate meats, slice watermelon, and chill beers in cooler.', completed: false },
      { id: 'bt-4', timeframe: 'Party Morning', task: 'Set up backyard tables, cornhole boards, and outdoor speakers.', completed: false },
      { id: 'bt-5', timeframe: '1 Hour Before', task: 'Fired up the grill, set out chips and fresh salsa, fill ice bucket.', completed: false }
    ],
    recipes: [
      {
        id: 'br-1',
        title: 'CymbalMart Fresh Honey-Lime Glazed Corn (Serves 16)',
        category: 'Grill Side',
        servings: 16,
        prepTime: '15 minutes',
        ingredients: [
          '16 ears CymbalMart Sweet Corn, husked',
          '1/2 cup CymbalMart Unsalted Butter, melted',
          '3 tbsp CymbalMart Pure Clover Honey',
          '2 Fresh Limes, juiced and zested',
          '1 tbsp Smoked Paprika & Cilantro for garnish'
        ],
        instructions: [
          'Whisk together melted butter, honey, fresh lime juice, and smoked paprika.',
          'Grill corn ears over medium-high heat for 10-12 minutes until lightly charred.',
          'Brush generously with honey-lime glaze during the final 3 minutes of grilling.',
          'Garnish with chopped cilantro and extra lime wedges before serving.'
        ]
      }
    ]
  },
  {
    id: 'preset-taco-fiesta',
    criteria: {
      title: "CymbalMart Sizzling Taco Fiesta",
      eventType: "Casual Dinner & Gathering",
      theme: "Mexican Fiesta & Margarita Bar",
      adultCount: 15,
      kidCount: 5,
      durationHours: 3,
      venue: "Backyard Patio",
      budgetLevel: "Moderate",
      customBudgetAmount: 220,
      dietaryRestrictions: ["Gluten-Free Options", "Vegetarian Options"],
      additionalNotes: "Build-your-own taco bar with CymbalMart organic salsas."
    },
    themeVibeSummary: "A festive backyard taco bar with fresh CymbalMart guacamole, sizzling carnitas, fresh lime margaritas, and vibrant fiesta decor.",
    colorPalette: ["#FF3B30", "#FF9500", "#34C759", "#007AFF"],
    estimatedTotalBudget: 215,
    createdDate: new Date().toISOString(),
    decorTips: [
      "Set out vibrant Papel Picado banner flags across the patio overhang.",
      "Use terracotta pots with small succulents as table runners.",
      "Provide colorful sombreros and maracas for photo accessories."
    ],
    gamesAndPlaylist: {
      games: ["Piñata Break for Kids & Adults", "Lotería Bingo Game", "Salsa Tasting Voting"],
      playlistStyle: "Upbeat Cumbia, Mariachi Classics, Spanish Pop & Latin Acoustic Guitars"
    },
    shoppingList: [
      {
        id: 'tf-1',
        name: 'CymbalMart Organic Corn Tortillas (GF) & Flour Tortillas',
        category: 'Food & Menu',
        quantity: '4 packs (approx 60 tortillas)',
        numericQuantity: 4,
        unit: 'packs',
        estimatedCost: 11,
        isPurchased: false,
        priority: 'Essential',
        isCymbalBrand: true,
        cymbalMartAisle: 'Aisle 10 - International & Specialty Foods',
        dietaryTags: ['Gluten-Free Options']
      },
      {
        id: 'tf-2',
        name: 'CymbalMart Fresh Seasoned Carnitas & Lean Ground Beef',
        category: 'Food & Menu',
        quantity: '5 lbs combined',
        numericQuantity: 5,
        unit: 'lbs',
        estimatedCost: 35,
        isPurchased: false,
        priority: 'Essential',
        isCymbalBrand: true,
        cymbalMartAisle: 'Aisle 4 - Meat, Seafood & Poultry'
      },
      {
        id: 'tf-3',
        name: 'CymbalMart Black Beans & Fajita Peppers/Onions (Veggie Filling)',
        category: 'Food & Menu',
        quantity: '3 cans beans + 4 peppers / 2 onions',
        numericQuantity: 3,
        unit: 'cans',
        estimatedCost: 12,
        isPurchased: false,
        priority: 'Essential',
        isCymbalBrand: true,
        cymbalMartAisle: 'Aisle 1 - Fresh Produce & Salads',
        dietaryTags: ['Vegetarian Options', 'Gluten-Free Options']
      },
      {
        id: 'tf-4',
        name: 'CymbalMart Fresh Guacamole, Pico de Gallo & Queso Dip',
        category: 'Food & Menu',
        quantity: '3 tubs + 2 large tortilla chip bags',
        numericQuantity: 3,
        unit: 'tubs',
        estimatedCost: 24,
        isPurchased: false,
        priority: 'Essential',
        isCymbalBrand: true,
        cymbalMartAisle: 'Aisle 2 - CymbalMart Deli & Prepared Foods'
      },
      {
        id: 'tf-5',
        name: 'CymbalMart Shredded Mexican Cheese, Sour Cream & Limes',
        category: 'Food & Menu',
        quantity: 'Variety set',
        numericQuantity: 1,
        unit: 'set',
        estimatedCost: 18,
        isPurchased: false,
        priority: 'Essential',
        isCymbalBrand: true,
        cymbalMartAisle: 'Aisle 5 - Dairy, Cheese & Chilled Juices'
      },
      {
        id: 'tf-6',
        name: 'CymbalMart Fresh Lime Margarita Pitcher Batch (Tequila + Mix)',
        category: 'Beverages & Bar',
        quantity: '1 bottle Tequila + 2 bottles Triple Sec/Mix',
        numericQuantity: 3,
        unit: 'bottles',
        estimatedCost: 42,
        isPurchased: false,
        priority: 'Essential',
        cymbalMartAisle: 'Aisle 8 - Beverages, Craft Beer & Wines'
      },
      {
        id: 'tf-7',
        name: 'Mexican Sodas (Jarritos) & Horchata for Kids',
        category: 'Beverages & Bar',
        quantity: '12 Jarritos bottles + 1 gallon Horchata',
        numericQuantity: 12,
        unit: 'bottles',
        estimatedCost: 20,
        isPurchased: false,
        priority: 'Essential',
        cymbalMartAisle: 'Aisle 8 - Beverages, Craft Beer & Wines'
      },
      {
        id: 'tf-8',
        name: 'Papel Picado Banners & Fiesta Tablecloths',
        category: 'Decor & Vibe',
        quantity: '3 banner strands + 2 tablecloths',
        numericQuantity: 3,
        unit: 'banners',
        estimatedCost: 16,
        isPurchased: false,
        priority: 'Essential',
        cymbalMartAisle: 'Aisle 12 - CymbalMart Party Supplies & Paper Goods'
      },
      {
        id: 'tf-9',
        name: 'Burrito & Taco Paper Trays + Fiesta Napkins',
        category: 'Tableware & Supplies',
        quantity: 'Pack of 50 trays',
        numericQuantity: 1,
        unit: 'pack',
        estimatedCost: 15,
        isPurchased: false,
        priority: 'Essential',
        cymbalMartAisle: 'Aisle 12 - CymbalMart Party Supplies & Paper Goods'
      },
      {
        id: 'tf-10',
        name: 'Donkey Piñata filled with Mexican Candies',
        category: 'Favors & Games',
        quantity: '1 Piñata + 2 lbs candy',
        numericQuantity: 1,
        unit: 'item',
        estimatedCost: 22,
        isPurchased: false,
        priority: 'Recommended',
        cymbalMartAisle: 'Aisle 12 - CymbalMart Party Supplies & Paper Goods'
      }
    ],
    timeline: [
      { id: 'tt-1', timeframe: '1 Week Before', task: 'Buy Papel Picado decor and piñata.', completed: true },
      { id: 'tt-2', timeframe: '2 Days Before', task: 'Schedule CymbalMart Express Pickup for fresh carnitas and produce.', completed: false },
      { id: 'tt-3', timeframe: 'Day Before', task: 'Slow cook carnitas, prepare Horchata mix, chop limes and onions.', completed: false },
      { id: 'tt-4', timeframe: 'Party Morning', task: 'Set up taco warming station, outdoor tables, and decorate patio.', completed: false },
      { id: 'tt-5', timeframe: '1 Hour Before', task: 'Batch fresh margaritas with ice, warm tortillas, set out salsa flight.', completed: false }
    ],
    recipes: [
      {
        id: 'tr-1',
        title: 'Master Pitcher Fresh Lime Margaritas (Serves 10)',
        category: 'Cocktail',
        servings: 10,
        prepTime: '8 minutes',
        ingredients: [
          '2 cups Blanco Tequila',
          '1 cup Orange Liqueur (Cointreau or Triple Sec)',
          '1.5 cups Freshly Squeezed Lime Juice',
          '1/2 cup Agave Nectar',
          'Margarita Salt & Lime Wedges for rim'
        ],
        instructions: [
          'Combine tequila, orange liqueur, fresh lime juice, and agave nectar in a large pitcher.',
          'Stir vigorously until agave is fully dissolved.',
          'Rub lime wedge around glass rims and dip into coarse sea salt.',
          'Fill glasses with fresh ice and pour margarita mixture over top.'
        ]
      }
    ]
  }
];

