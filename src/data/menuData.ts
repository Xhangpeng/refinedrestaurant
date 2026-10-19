import {
  MenuItem,
  GalleryItem,
  FAQItem,
  JobPosition,
  AllergenRow
} from '../types/restaurant';

// High-fidelity image assets generated for Shankar Restaurant
import heroImage from '../assets/images/hero_shankar_restaurant_1792103747564.jpg';
import butterChickenImg from '../assets/images/dish_butter_chicken_curry_1792103747214.jpg';
import biryaniImg from '../assets/images/dish_royal_dum_biryani_1792103749027.jpg';
import paneerTikkaImg from '../assets/images/dish_paneer_tikka_tandoor_1792103749208.jpg';
import royalThaliImg from '../assets/images/dish_royal_indian_thali_1792105318297.jpg';
import barCocktailImg from '../assets/images/bar_cocktail_indian_botanical_1792105332237.jpg';

export const RESTAURANT_HERO_IMAGE = heroImage;
export const THALI_IMAGE = royalThaliImg;
export const BAR_IMAGE = barCocktailImg;

export const MENU_ITEMS: MenuItem[] = [
  // ===================== ALL DAY MENU =====================
  {
    id: 'shankar_butter_chicken',
    name: 'Shankar Murgh Makhani (Butter Chicken)',
    hindiName: 'शंकर मुर्ग मखनी',
    menuSection: 'all_day',
    category: 'curries',
    description:
      'Tandoor-smoked chicken simmered in a velvety reduction of sun-ripened vine tomatoes, churned butter, and fragrant fenugreek kasuri methi.',
    price: 495,
    halfPrice: 295,
    dietary: 'non-veg',
    spiceLevel: 1,
    rating: 4.9,
    reviewsCount: 382,
    isBestseller: true,
    isChefSpecial: true,
    image: butterChickenImg,
    prepTimeMinutes: 20,
    calories: 520,
    allergens: ['Dairy', 'Cashew nuts'],
    volumeOrServing: 'Serves 2'
  },
  {
    id: 'royal_dum_biryani',
    name: 'Royal Shankar Awadhi Dum Biryani',
    hindiName: 'रॉयल शंकर अवधी दम बिरयानी',
    menuSection: 'all_day',
    category: 'biryani',
    description:
      'Long grain aged basmati rice layered with succulent marinated chicken, saffron milk, caramelized shallots, cooked under sealed dough purdah in a terracotta handi.',
    price: 480,
    halfPrice: 290,
    dietary: 'non-veg',
    spiceLevel: 2,
    rating: 4.95,
    reviewsCount: 420,
    isBestseller: true,
    isChefSpecial: true,
    image: biryaniImg,
    prepTimeMinutes: 25,
    calories: 610,
    allergens: ['Dairy'],
    volumeOrServing: 'Handi portion'
  },
  {
    id: 'charcoal_paneer_tikka',
    name: 'Charcoal Tandoori Paneer Tikka',
    hindiName: 'तंदूरी पनीर टिक्का',
    menuSection: 'all_day',
    category: 'starters',
    description:
      'Fresh malai paneer cubes steeped in spiced hung curd, yellow mustard oil, and Kashmiri deghi mirch, skewered with bell peppers and tandoor roasted.',
    price: 385,
    halfPrice: 235,
    dietary: 'veg',
    spiceLevel: 2,
    rating: 4.85,
    reviewsCount: 294,
    isBestseller: true,
    image: paneerTikkaImg,
    prepTimeMinutes: 18,
    calories: 390,
    allergens: ['Dairy', 'Mustard'],
    volumeOrServing: '6 succulent pieces'
  },
  {
    id: 'dal_makhani_overnight',
    name: 'Dal Shankar (24-Hour Charcoal Dal Makhani)',
    hindiName: 'दाल शंकर मखनी',
    menuSection: 'all_day',
    category: 'curries',
    description:
      'Whole black urad lentils slow-simmered overnight over smoldering coal embers, infused with garlic, homemade churned white makhan, and fresh cream.',
    price: 360,
    halfPrice: 210,
    dietary: 'veg',
    spiceLevel: 1,
    rating: 4.9,
    reviewsCount: 365,
    isBestseller: true,
    isChefSpecial: true,
    image: butterChickenImg,
    prepTimeMinutes: 15,
    calories: 420,
    allergens: ['Dairy'],
    volumeOrServing: 'Serves 2'
  },
  {
    id: 'rogan_josh_kashmiri',
    name: 'Kashmiri Mutton Rogan Josh',
    hindiName: 'कश्मीरी मटन रोगन जोश',
    menuSection: 'all_day',
    category: 'curries',
    description:
      'Tender baby mutton braised on low fire with Kashmiri red chili, dried ginger saunth, fennel seed extract, and aromatic whole spices.',
    price: 545,
    halfPrice: 335,
    dietary: 'non-veg',
    spiceLevel: 3,
    rating: 4.8,
    reviewsCount: 198,
    image: butterChickenImg,
    prepTimeMinutes: 25,
    calories: 580,
    allergens: [],
    volumeOrServing: 'Serves 2'
  },
  {
    id: 'paneer_lababdar_royal',
    name: 'Shahi Paneer Lababdar',
    hindiName: 'शाही पनीर लबाबदार',
    menuSection: 'all_day',
    category: 'curries',
    description:
      'Soft cottage cheese simmered in coarse onion-tomato gravy with crushed green cardamom, grated paneer, and rich melon seed paste.',
    price: 395,
    halfPrice: 240,
    dietary: 'veg',
    spiceLevel: 1,
    rating: 4.75,
    reviewsCount: 185,
    image: paneerTikkaImg,
    prepTimeMinutes: 18,
    calories: 460,
    allergens: ['Dairy', 'Nuts'],
    volumeOrServing: 'Serves 2'
  },
  {
    id: 'subz_dum_biryani',
    name: 'Nizami Subz Tarkari Biryani',
    hindiName: 'निज़ामी सब्ज़ तरकारी बिरयानी',
    menuSection: 'all_day',
    category: 'biryani',
    description:
      'Medley of baby carrots, French beans, cauliflower, green peas, and fresh mint sealed with saffron-infused basmati rice in clay pot.',
    price: 390,
    halfPrice: 230,
    dietary: 'veg',
    spiceLevel: 1,
    rating: 4.7,
    reviewsCount: 152,
    image: biryaniImg,
    prepTimeMinutes: 20,
    calories: 450,
    allergens: ['Dairy'],
    volumeOrServing: 'Handi portion'
  },
  {
    id: 'dahi_ke_kebab',
    name: 'Awadhi Dahi Ke Kebab',
    hindiName: 'अवधी दही के कबाब',
    menuSection: 'all_day',
    category: 'starters',
    description:
      'Velvety hung curd patties laced with fresh coriander, roasted cumin, and green chilies, crisp-crusted and shallow fried to golden perfection.',
    price: 350,
    dietary: 'veg',
    spiceLevel: 1,
    rating: 4.85,
    reviewsCount: 167,
    image: paneerTikkaImg,
    prepTimeMinutes: 15,
    calories: 310,
    allergens: ['Dairy'],
    volumeOrServing: '5 medallions'
  },
  {
    id: 'garlic_butter_naan',
    name: 'Clay Oven Garlic Butter Naan',
    hindiName: 'लहसुनी बटर नान',
    menuSection: 'all_day',
    category: 'breads',
    description:
      'Leavened refined flour flatbread charred against the terracotta tandoor wall, glazed with roasted garlic chunks, fresh coriander, and melted butter.',
    price: 95,
    dietary: 'veg',
    spiceLevel: 0,
    rating: 4.9,
    reviewsCount: 512,
    isBestseller: true,
    image: butterChickenImg,
    prepTimeMinutes: 10,
    calories: 220,
    allergens: ['Gluten', 'Dairy']
  },
  {
    id: 'amritsari_chur_chur_naan',
    name: 'Amritsari Chur Chur Kulcha',
    hindiName: 'अमृतसरी चूर चूर कुलचा',
    menuSection: 'all_day',
    category: 'breads',
    description:
      'Multi-layered flaky bread stuffed with spiced mashed potatoes, crushed pomegranate seeds, and ajwain, crushed with pure desi ghee.',
    price: 135,
    dietary: 'veg',
    spiceLevel: 1,
    rating: 4.88,
    reviewsCount: 275,
    isBestseller: true,
    image: butterChickenImg,
    prepTimeMinutes: 12,
    calories: 280,
    allergens: ['Gluten', 'Dairy']
  },
  {
    id: 'kesar_mango_lassi',
    name: 'Kesariya Alphonso Mango Lassi',
    hindiName: 'केसरिया आम लस्सी',
    menuSection: 'all_day',
    category: 'beverages',
    description:
      'Thick hand-churned fresh yogurt blended with pure Ratnagiri Alphonso mango pulp, steeped Kashmir saffron strands, and slivered pistachios.',
    price: 165,
    dietary: 'veg',
    spiceLevel: 0,
    rating: 4.95,
    reviewsCount: 388,
    isBestseller: true,
    image: barCocktailImg,
    prepTimeMinutes: 8,
    calories: 240,
    allergens: ['Dairy', 'Nuts'],
    volumeOrServing: '350 ml'
  },
  {
    id: 'royal_gulab_jamun',
    name: 'Gulkand Stuffed Kesar Gulab Jamun (2 Pcs)',
    hindiName: 'गुलकंद केसर गुलाब जामुन',
    menuSection: 'all_day',
    category: 'desserts',
    description:
      'Warm, golden khoya mawa dumplings stuffed with organic Damask rose petal preserve (gulkand), soaked in green cardamom and rose syrup.',
    price: 175,
    dietary: 'veg',
    spiceLevel: 0,
    rating: 4.9,
    reviewsCount: 310,
    isBestseller: true,
    image: royalThaliImg,
    prepTimeMinutes: 5,
    calories: 320,
    allergens: ['Dairy'],
    volumeOrServing: '2 pieces with warm syrup'
  },

  // ===================== LUNCH MENU =====================
  {
    id: 'shankar_royal_veg_thali',
    name: 'The Shankar Grand Royal Vegetarian Thali',
    hindiName: 'शंकर महा राजसी शाकाहारी थाली',
    menuSection: 'lunch',
    category: 'lunch_thali',
    description:
      'An opulent bronze platter feast: 24-hr Dal Shankar, Paneer Lababdar, Subz Miloni, Jeera Pulao, 2 Butter Naans, Crisp Papadum, Boondi Raita, Salad & Gulkand Gulab Jamun.',
    price: 425,
    dietary: 'veg',
    spiceLevel: 1,
    rating: 4.95,
    reviewsCount: 460,
    isBestseller: true,
    isChefSpecial: true,
    image: royalThaliImg,
    prepTimeMinutes: 15,
    calories: 780,
    allergens: ['Dairy', 'Gluten', 'Nuts'],
    volumeOrServing: 'Complete 8-Course Platter'
  },
  {
    id: 'shankar_royal_nonveg_thali',
    name: 'The Maharaja Non-Veg Royal Lunch Thali',
    hindiName: 'महाराजा मांसाहारी थाली',
    menuSection: 'lunch',
    category: 'lunch_thali',
    description:
      'A majestic spread: Butter Chicken Murgh Makhani, Kashmiri Rogan Josh Mutton, Dal Shankar, Saffron Biryani Rice, Garlic Naan, Raita, Sirka Pyaz & Gulab Jamun.',
    price: 525,
    dietary: 'non-veg',
    spiceLevel: 2,
    rating: 4.98,
    reviewsCount: 512,
    isBestseller: true,
    isChefSpecial: true,
    image: royalThaliImg,
    prepTimeMinutes: 15,
    calories: 890,
    allergens: ['Dairy', 'Gluten', 'Cashew nuts'],
    volumeOrServing: 'Complete 8-Course Platter'
  },
  {
    id: 'tandoori_butter_chicken_bowl',
    name: 'Shankar Executive Butter Chicken Lunch Bowl',
    hindiName: 'बटर चिकन राइस बाउल',
    menuSection: 'lunch',
    category: 'lunch_bowls',
    description:
      'Tender clay-oven chicken tossed in luscious tomato butter sauce served over seasoned basmati jeera rice with pickled onion ribbons and mint raita.',
    price: 325,
    dietary: 'non-veg',
    spiceLevel: 1,
    rating: 4.88,
    reviewsCount: 220,
    isBestseller: true,
    image: butterChickenImg,
    prepTimeMinutes: 12,
    calories: 540,
    allergens: ['Dairy', 'Cashews'],
    volumeOrServing: 'Single Bowl Meal'
  },
  {
    id: 'paneer_tikka_lunch_bowl',
    name: 'Smoked Paneer Tikka Makhani Bowl',
    hindiName: 'पनीर टिक्का मखनी बाउल',
    menuSection: 'lunch',
    category: 'lunch_bowls',
    description:
      'Char-grilled cottage cheese tikka cubes nestled over fragrant saffron cumin rice, creamy makhani drizzle, laccha onions and crispy papad bits.',
    price: 295,
    dietary: 'veg',
    spiceLevel: 1,
    rating: 4.82,
    reviewsCount: 178,
    image: paneerTikkaImg,
    prepTimeMinutes: 12,
    calories: 490,
    allergens: ['Dairy'],
    volumeOrServing: 'Single Bowl Meal'
  },
  {
    id: 'lucknowi_chicken_kathi_wrap',
    name: 'Old Delhi Double Egg Chicken Kathi Roll',
    hindiName: 'काठी चिकन रोल',
    menuSection: 'lunch',
    category: 'kathi_wraps',
    description:
      'Flaky multi-layered paratha lined with cracked desi egg, packed with smoky tandoori chicken, mint chutney, lemon juice, and julienned sweet peppers.',
    price: 265,
    dietary: 'non-veg',
    spiceLevel: 2,
    rating: 4.9,
    reviewsCount: 310,
    isBestseller: true,
    image: paneerTikkaImg,
    prepTimeMinutes: 10,
    calories: 440,
    allergens: ['Gluten', 'Eggs'],
    volumeOrServing: 'Jumbo Roll with Dip'
  },
  {
    id: 'paneer_tikka_kathi_wrap',
    name: 'Tandoori Malai Paneer Kathi Roll',
    hindiName: 'मलाई पनीर काठी रोल',
    menuSection: 'lunch',
    category: 'kathi_wraps',
    description:
      'Rumali roti wrapped with spiced malai paneer skewers, mint coriander chutney, and pickled onions. Served warm with house spiced fries.',
    price: 235,
    dietary: 'veg',
    spiceLevel: 1,
    rating: 4.78,
    reviewsCount: 165,
    image: paneerTikkaImg,
    prepTimeMinutes: 10,
    calories: 410,
    allergens: ['Gluten', 'Dairy'],
    volumeOrServing: 'Jumbo Roll with Dip'
  },

  // ===================== BAR MENU =====================
  {
    id: 'golden_silk_smoked_cocktail',
    name: 'The Golden Silk (Signature Smoked Cocktail)',
    hindiName: 'द गोल्डन सिल्क कॉकटेल',
    menuSection: 'bar',
    category: 'craft_cocktails',
    description:
      'Single malt whisky infused with green cardamom pods and Kashmiri saffron syrup, presented under an aromatic wood smoke bubble with saffron rim.',
    price: 595,
    dietary: 'veg',
    spiceLevel: 0,
    rating: 4.98,
    reviewsCount: 234,
    isBestseller: true,
    isChefSpecial: true,
    image: barCocktailImg,
    prepTimeMinutes: 6,
    calories: 190,
    alcoholPercentage: '14.5% ABV',
    volumeOrServing: 'Coupe glass with smoke dome'
  },
  {
    id: 'spice_route_old_fashioned',
    name: 'Old Delhi Spice Route Old Fashioned',
    hindiName: 'स्पाइस रूट ओल्ड फैशन्ड',
    menuSection: 'bar',
    category: 'craft_cocktails',
    description:
      'Bourbon stirred with jaggery syrup, Angostura & house-blended clove-cinnamon bitters, flamed orange peel, and charred cinnamon stick.',
    price: 545,
    dietary: 'veg',
    spiceLevel: 1,
    rating: 4.92,
    reviewsCount: 189,
    isBestseller: true,
    image: barCocktailImg,
    prepTimeMinutes: 5,
    calories: 175,
    alcoholPercentage: '18% ABV',
    volumeOrServing: 'Hand-cut crystal rock'
  },
  {
    id: 'darjeeling_cardamom_gin_tonic',
    name: 'Darjeeling Botanist Gin & Tonic',
    hindiName: 'दार्जिलिंग जिन एंड टॉनिक',
    menuSection: 'bar',
    category: 'craft_cocktails',
    description:
      'Artisanal craft gin cold-steeped with first-flush Darjeeling black tea, pink peppercorns, star anise, and premium elderflower Indian tonic.',
    price: 495,
    dietary: 'veg',
    spiceLevel: 0,
    rating: 4.88,
    reviewsCount: 142,
    image: barCocktailImg,
    prepTimeMinutes: 4,
    calories: 150,
    alcoholPercentage: '11% ABV',
    volumeOrServing: 'Highball glass with botanicals'
  },
  {
    id: 'kingfisher_ultra_gold',
    name: 'Kingfisher Ultra Max Reserve Draught',
    hindiName: 'किंगफिशर अल्ट्रा ड्राफ्ट',
    menuSection: 'bar',
    category: 'indian_beers',
    description:
      'India’s legendary crisp golden malt lager, cold-filtered and pulled straight from our chilled draught taps with thick creamy foam.',
    price: 295,
    dietary: 'veg',
    spiceLevel: 0,
    rating: 4.85,
    reviewsCount: 320,
    isBestseller: true,
    image: barCocktailImg,
    prepTimeMinutes: 2,
    calories: 145,
    alcoholPercentage: '5.0% ABV',
    volumeOrServing: '500ml Pint'
  },
  {
    id: 'bira_white_wheat_ale',
    name: 'Bira 91 White Craft Wheat Ale',
    hindiName: 'बीरा 91 व्हाइट',
    menuSection: 'bar',
    category: 'indian_beers',
    description:
      'Low bitterness wheat ale brewed with orange peel and crushed coriander seeds. Unfiltered, cloudy, and exceptionally refreshing alongside spicy tandoor.',
    price: 320,
    dietary: 'veg',
    spiceLevel: 0,
    rating: 4.9,
    reviewsCount: 285,
    isBestseller: true,
    image: barCocktailImg,
    prepTimeMinutes: 2,
    calories: 160,
    alcoholPercentage: '4.9% ABV',
    volumeOrServing: '330ml Chilled Bottle'
  },
  {
    id: 'sula_dindori_reserve_shiraz',
    name: 'Sula Dindori Reserve Shiraz (Nashik Valley)',
    hindiName: 'सुला डिंडोरी शिराज़ वाइन',
    menuSection: 'bar',
    category: 'wines',
    description:
      'Full-bodied Indian red wine aged in French oak barrels. Aromas of ripe berries, vanilla, and cocoa that seamlessly complements mutton rogan josh.',
    price: 650,
    dietary: 'veg',
    spiceLevel: 0,
    rating: 4.86,
    reviewsCount: 110,
    image: barCocktailImg,
    prepTimeMinutes: 3,
    calories: 130,
    alcoholPercentage: '13.5% ABV',
    volumeOrServing: 'Glass (150ml) / Bottle available'
  },
  {
    id: 'mango_mint_botanical_spritzer',
    name: 'Ratnagiri Mango & Cardamom Spritzer (Zero-Proof)',
    hindiName: 'मैंगो मिंट स्पिट्ज़र (मॉकटेल)',
    menuSection: 'bar',
    category: 'mocktails',
    description:
      'Fresh Alphonso mango nectar muddled with garden mint leaves, freshly cracked green cardamom, lime juice, and effervescent sparkling soda.',
    price: 220,
    dietary: 'veg',
    spiceLevel: 0,
    rating: 4.95,
    reviewsCount: 340,
    isBestseller: true,
    image: barCocktailImg,
    prepTimeMinutes: 4,
    calories: 120,
    alcoholPercentage: 'Non-Alcoholic (0.0%)',
    volumeOrServing: 'Tall Stemmed Glass'
  }
];

export const ALL_DAY_CATEGORIES = [
  { id: 'all', name: 'All Dishes', hindi: 'संपूर्ण' },
  { id: 'starters', name: 'Starters & Tandoor', hindi: 'तंदूरी स्टार्टर्स' },
  { id: 'curries', name: 'Royal Curries', hindi: 'शाही सब्ज़ियाँ' },
  { id: 'biryani', name: 'Biryani & Rice', hindi: 'बिरयानी और चावल' },
  { id: 'breads', name: 'Clay Oven Breads', hindi: 'तंदूरी रोटियाँ' },
  { id: 'beverages', name: 'Beverages & Lassi', hindi: 'पेय पदार्थ' },
  { id: 'desserts', name: 'Mithai & Desserts', hindi: 'मीठा व मिष्ठान' }
];

export const LUNCH_CATEGORIES = [
  { id: 'all', name: 'All Lunch Specials', hindi: 'लंच स्पेशल' },
  { id: 'lunch_thali', name: 'Royal Thalis', hindi: 'राजसी थाली' },
  { id: 'lunch_bowls', name: 'Executive Bowls', hindi: 'राइस बाउल' },
  { id: 'kathi_wraps', name: 'Kathi Rolls & Wraps', hindi: 'काठी रोल' }
];

export const BAR_CATEGORIES = [
  { id: 'all', name: 'Full Bar Menu', hindi: 'बार मेनू' },
  { id: 'craft_cocktails', name: 'Signature Cocktails', hindi: 'हस्तनिर्मित कॉकटेल' },
  { id: 'indian_beers', name: 'Indian Beers & Ales', hindi: 'बीयर और एल्स' },
  { id: 'wines', name: 'Nashik Valley Wines', hindi: 'वाइन' },
  { id: 'mocktails', name: 'Artisan Mocktails', hindi: 'मॉकटेल (शून्य अल्कोहल)' }
];

// Explore: Gallery Images
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal_1',
    title: 'The Maharaja Grand Dining Hall',
    category: 'ambiance',
    image: heroImage,
    caption: 'Handcrafted teak wood arches and ambient brass chandeliers reminiscent of royal Delhi Havelis.'
  },
  {
    id: 'gal_2',
    title: 'Shankar Murgh Makhani in Hammered Copper Handi',
    category: 'dishes',
    image: butterChickenImg,
    caption: 'Slow-simmered 24 hours in ripe vine tomatoes, house-churned makhan and hand-rubbed kasuri methi.'
  },
  {
    id: 'gal_3',
    title: 'Clay Oven Tandoori Paneer Tikka Platter',
    category: 'tandoor',
    image: paneerTikkaImg,
    caption: 'High-heat terracotta tandoors fired with wood charcoal for that quintessential smoky char.'
  },
  {
    id: 'gal_4',
    title: 'Awadhi Purdah Dum Biryani in Terracotta Handi',
    category: 'dishes',
    image: biryaniImg,
    caption: 'Sealed dough purdah captures the pure steam of saffron, rose water, and aged basmati grains.'
  },
  {
    id: 'gal_5',
    title: 'The Grand Royal Thali Bronze Platter',
    category: 'dishes',
    image: royalThaliImg,
    caption: 'An Ayurvedic balance of all 6 rasas (tastes) served in traditional hammered bronze katoris.'
  },
  {
    id: 'gal_6',
    title: 'The Golden Silk Smoked Botanical Cocktail',
    category: 'bar',
    image: barCocktailImg,
    caption: 'Handcrafted mixology blending single malt, crushed green cardamom, and aromatic wood smoke.'
  }
];

// Explore: Buffet vs Thali Comparison Data
export const BUFFET_VS_THALI_DATA = {
  title: 'Buffet vs. Thali: The Culinary Philosophy',
  subtitle:
    'Understanding the ancient art of the Shankar Royal Thali versus our Grand Weekend Royal Buffet spread.',
  thali: {
    name: 'The Shankar Royal Thali',
    badge: 'Curated Ayurvedic Perfection',
    timing: 'Available Daily (12:00 PM - 4:00 PM)',
    pricing: 'Starting at ₹425 per person',
    philosophy:
      'In Vedic science, a balanced meal must represent all 6 Rasas (Sweet, Sour, Salty, Pungent, Bitter, Astringent). Each katori on our hammered bronze thali is portioned to optimize digestion, energy, and exquisite palate harmony.',
    features: [
      'Served fresh to your seat in heavy bronze katoris',
      'Unlimited refills of Dal Shankar, Pulao rice, and tandoori naans',
      'Specific sequence of dining: starting with cooling raita and concluding with warm gulab jamun',
      'Zero food wastage, curated gourmet presentation',
      'Ideal for executive business lunches and mindful dining'
    ],
    itemsIncluded: [
      'Dal Shankar (24-Hour Charcoal Dal)',
      'Signature Paneer Lababdar or Butter Chicken',
      'Subz Miloni / Kashmiri Rogan Josh',
      'Fragrant Saffron Jeera Rice',
      'Tandoori Garlic Naan & Tandoori Roti',
      'Crispy Roasted Cumin Papadum',
      'Mint Chutney & Spiced Sirka Onions',
      'Warm Gulkand Kesar Gulab Jamun'
    ]
  },
  buffet: {
    name: 'Grand Weekend Royal Heritage Buffet',
    badge: 'Unlimited Exploration Feast',
    timing: 'Saturdays & Sundays (12:30 PM - 4:30 PM)',
    pricing: '₹895 per guest (Kids under 7 dine complimentary)',
    philosophy:
      'Inspired by the legendary royal banquets of Delhi’s Mughal courts. Dine without boundaries across over 35 hot live-counter dishes, carving stations, and artisanal desserts.',
    features: [
      'Live Charcoal Sigri Station with made-to-order kebabs & tikkas',
      'Live Tandoor counter baking fresh piping-hot naans to your table',
      'Chaat Street live counter (Pani Puri, Dahi Bhalla, Papdi Chaat)',
      'Over 6 slow-cooked gravies and 3 styles of dum biryanis',
      'Expansive Mithai counter with live Jalebi with rabri',
      'Unlimited refills with no rush seating'
    ],
    itemsIncluded: [
      '4 Vegetarian Starters & 4 Non-Veg Kebabs',
      'Live Chaat & Golgappa Counter',
      'Awadhi Dum Biryani (Chicken, Mutton & Subz)',
      'Live Naan & Kulcha Basket Service',
      'Salad & Raita Bar with 8 artisanal chutneys',
      'Dessert Island: Kulfi Falooda, Gulab Jamun, Moong Dal Halwa'
    ]
  }
};

// Quick Links: Catering Packages
export const CATERING_PACKAGES = [
  {
    id: 'royal_banquet',
    name: 'The Royal Banquet Package',
    idealFor: 'Weddings, Receptions & Milestone Anniversaries',
    minGuests: 50,
    pricePerPerson: 1150,
    highlights: [
      'Live Charcoal Sigri & Tandoor station setup with master chefs',
      'Choice of 4 Starters, 5 Main Curries, 2 Dum Biryanis, and 3 Desserts',
      'Hammered brass chafing dish setup with royal linen & copperware',
      'Full service uniformed waitstaff and cleanup crew'
    ]
  },
  {
    id: 'corporate_executive',
    name: 'Corporate Executive Gala',
    idealFor: 'Corporate Dinners, Product Launches & VIP Gatherings',
    minGuests: 25,
    pricePerPerson: 850,
    highlights: [
      'Individual Executive Bento Thalis or Premium Buffet chafing spread',
      'Pre-portioned packaging or live food-warming service',
      'Choice of 3 Appetizers, 3 Royal Curries, Rice & Artisan Breads',
      'Signature Kesariya Mango Lassi or Botanical Mocktails included'
    ]
  },
  {
    id: 'cocktail_social',
    name: 'Maharaja Cocktail & Kebab Soiree',
    idealFor: 'Intimate House Parties, Terrace Gatherings & Engagements',
    minGuests: 20,
    pricePerPerson: 750,
    highlights: [
      'Continuous butler-passed skewers of smoky kebabs & chaat shots',
      'Artisanal dips, mint chutneys, and spiced pickled condiments',
      'Live Mini Naan Wrap / Slider bar with chef in attendance',
      'Pairing menu designed to complement craft cocktails & fine wines'
    ]
  }
];

// Help: FAQs
export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'Dining & Reservations',
    question: 'Do I need a reservation to dine at Shankar Restaurant?',
    answer:
      'While we warmly welcome walk-in guests whenever seating is available, we strongly recommend making an advance table reservation via our app or by phone—especially for dinner service and weekend buffet lunches, to guarantee your preferred seating area (Main Dining Hall, Courtyard, or Private Baithak).'
  },
  {
    id: 'faq_2',
    category: 'Food & Dietary',
    question: 'How do you handle spice levels and dietary restrictions?',
    answer:
      'Every dish is cooked fresh to order. You can select your heat preference (Mild, Medium, Spicy, or Desi Hot) directly in the app. We also offer dedicated Jain preparations (made strictly without onion and garlic), 100% vegetarian dishes, and clearly marked gluten-free selections.'
  },
  {
    id: 'faq_3',
    category: 'Online Orders & Delivery',
    question: 'What is the delivery radius and why is there a location check?',
    answer:
      'To guarantee that our tandoori breads remain crisp, curries maintain their delicate aromatics, and biryanis arrive piping hot, we enforce a strict 6.0km delivery perimeter from our Connaught Place kitchen. Orders placed outside this radius are gently guided to table reservations or takeaway pickup.'
  },
  {
    id: 'faq_4',
    category: 'Events & Catering',
    question: 'Do you offer private dining rooms or on-site outdoor catering?',
    answer:
      'Yes! We feature the Private Maharaja Baithak for private celebrations of up to 24 guests, as well as full-scale off-site catering with live clay tandoor ovens and copperware setups for gatherings between 20 and 500 guests across Delhi NCR.'
  },
  {
    id: 'faq_5',
    category: 'Dining & Reservations',
    question: 'Is valet parking available at Shankar Restaurant?',
    answer:
      'Yes, complimentary valet parking is available right at our main entrance on Outer Circle, Connaught Place, New Delhi. Dedicated parking attendants ensure seamless arrival.'
  }
];

// Help: Careers Positions
export const CAREERS_POSITIONS: JobPosition[] = [
  {
    id: 'job_tandoor_master',
    title: 'Master Tandoor & Sigri Chef',
    department: 'Culinary',
    location: 'Connaught Place, New Delhi',
    type: 'Full-Time',
    experienceRequired: '5+ years in high-volume Indian fine dining',
    description:
      'We are looking for a veteran tandoor specialist passionate about artisanal clay oven cooking, traditional marinades, and live-flame mastery.',
    requirements: [
      'Mastery of clay tandoor heat management and wood charcoal preparation',
      'Expertise in skewered kebabs, tikka cuts, and flaky layered breads',
      'Dedication to food hygiene, kitchen teamwork, and authentic North Indian recipes'
    ]
  },
  {
    id: 'job_senior_mixologist',
    title: 'Senior Craft Mixologist',
    department: 'Bar & Mixology',
    location: 'Connaught Place, New Delhi',
    type: 'Full-Time',
    experienceRequired: '3+ years crafting signature cocktails',
    description:
      'Design and serve botanical Indian cocktails infused with native spices, teas, and saffron smoke. Champion exceptional bar guest experiences.',
    requirements: [
      'Deep knowledge of spirits, bitters, infusions, and presentation aesthetics',
      'Warm and charismatic guest interaction style',
      'Inventory control and modern bar safety standards'
    ]
  },
  {
    id: 'job_restaurant_captain',
    title: 'Restaurant Captain / Floor Host',
    department: 'Hospitality & Service',
    location: 'Connaught Place, New Delhi',
    type: 'Full-Time',
    experienceRequired: '2+ years in luxury dining hospitality',
    description:
      'Lead front-of-house dining flow, explain culinary heritage and tasting notes to guests, and ensure every guest feels royally attended.',
    requirements: [
      'Exceptional spoken English and Hindi communication skills',
      'Deep familiarity with Indian culinary traditions, dietary accommodations, and wines',
      'Calm, gracious attitude under busy dining rushes'
    ]
  }
];

// Help: Allergen Matrix
export const ALLERGEN_MATRIX: AllergenRow[] = [
  {
    dishName: 'Shankar Murgh Makhani',
    menuSection: 'all_day',
    dietary: 'non-veg',
    glutenFree: true,
    dairyFree: false,
    nutFree: false,
    vegan: false,
    jainFriendly: false,
    notes: 'Contains butter, cream, and ground cashew paste'
  },
  {
    dishName: 'Dal Shankar (24-Hour Charcoal Dal)',
    menuSection: 'all_day',
    dietary: 'veg',
    glutenFree: true,
    dairyFree: false,
    nutFree: true,
    vegan: false,
    jainFriendly: true,
    notes: 'Can be requested without garlic for Jain diners'
  },
  {
    dishName: 'Charcoal Tandoori Paneer Tikka',
    menuSection: 'all_day',
    dietary: 'veg',
    glutenFree: true,
    dairyFree: false,
    nutFree: true,
    vegan: false,
    jainFriendly: true,
    notes: 'Contains mustard oil and hung yogurt'
  },
  {
    dishName: 'Clay Oven Garlic Butter Naan',
    menuSection: 'all_day',
    dietary: 'veg',
    glutenFree: false,
    dairyFree: false,
    nutFree: true,
    vegan: false,
    jainFriendly: false,
    notes: 'Contains refined wheat flour and butter. Tandoori Roti can be made dairy-free vegan'
  },
  {
    dishName: 'Royal Shankar Awadhi Dum Biryani',
    menuSection: 'all_day',
    dietary: 'non-veg',
    glutenFree: true,
    dairyFree: false,
    nutFree: true,
    vegan: false,
    jainFriendly: false,
    notes: 'Prepared with desi ghee and saffron milk'
  },
  {
    dishName: 'Grand Royal Vegetarian Thali',
    menuSection: 'lunch',
    dietary: 'veg',
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
    vegan: false,
    jainFriendly: true,
    notes: 'Naan contains gluten; substitute with gluten-free rice papad & extra pulao'
  },
  {
    dishName: 'Ratnagiri Mango & Cardamom Spritzer',
    menuSection: 'bar',
    dietary: 'vegan',
    glutenFree: true,
    dairyFree: true,
    nutFree: true,
    vegan: true,
    jainFriendly: true,
    notes: '100% plant-based, natural fruit puree and sparkling water'
  }
];

export const RESTAURANT_CONTACT_INFO = {
  name: 'Shankar Restaurant',
  tagline: 'Royal Indian Bistro & Fine Dining',
  address: 'Plot 18, Block M, Outer Circle, Connaught Place, New Delhi, Delhi 110001',
  metroStop: 'Barakhamba Road / Rajiv Chowk Metro (Gate 7) - 3 min walk',
  phonePrimary: '+91 11 2334 5678',
  phoneDirect: '+91 98110 23456',
  phoneWhatsApp: '+91 98110 23456',
  email: 'concierge@shankarrestaurant.com',
  hours: {
    lunch: '12:00 PM – 4:00 PM (Daily)',
    dinner: '7:00 PM – 11:30 PM (Daily)',
    bar: '12:00 PM – 12:00 Midnight (Daily)',
    buffet: '12:30 PM – 4:30 PM (Sat & Sun)'
  }
};

export const INITIAL_MENU_ITEMS = MENU_ITEMS;

export const MENU_CATEGORIES = [
  { id: 'all', name: 'All Dishes', hindi: 'संपूर्ण', icon: '🍽️' },
  { id: 'starters', name: 'Starters & Tandoor', hindi: 'तंदूरी स्टार्टर्स', icon: '🍢' },
  { id: 'curries', name: 'Royal Curries', hindi: 'शाही सब्ज़ियाँ', icon: '🍛' },
  { id: 'biryani', name: 'Biryani & Rice', hindi: 'बिरयानी और चावल', icon: '🍚' },
  { id: 'breads', name: 'Clay Oven Breads', hindi: 'तंदूरी रोटियाँ', icon: '🫓' },
  { id: 'south_indian', name: 'South Indian', hindi: 'दक्षिण भारतीय', icon: '🥞' },
  { id: 'royal_thali', name: 'Thali & Buffet', hindi: 'राजसी थाली', icon: '👑' },
  { id: 'beverages', name: 'Beverages & Lassi', hindi: 'पेय पदार्थ', icon: '🍹' },
  { id: 'desserts', name: 'Mithai & Desserts', hindi: 'मीठा व मिष्ठान', icon: '🍨' },
];
