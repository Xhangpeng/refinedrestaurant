/**
 * Dynamic SEO & OpenGraph updater for SPA routing
 */
export function updatePageSEO(route: string) {
  const titles: Record<string, string> = {
    home: 'Shankar Pure Heritage Multi-Cuisine | Royal Dining in Connaught Place',
    menu: 'Royal Menu & Delicacies | Shankar Pure Heritage Cuisine',
    reservations: 'Table Booking & Palace Seating | Shankar Multi-Cuisine',
    catering: 'Royal Palace Banquet & Catering Orders | Shankar Multi-Cuisine',
    gallery: 'Ambience & Royal Heritage Gallery | Shankar Multi-Cuisine',
    buffet: 'Royal Buffet vs Maharaja Thali Experience | Shankar',
    faqs: 'Frequently Asked Questions & Customer Support | Shankar',
    allergens: 'Jain, Vegan & Allergen Information | Shankar Cuisine',
    careers: 'Join Shankar Royal Hospitality Team | Careers',
    contact: 'Contact Shankar Royal Palace Restaurant | Connaught Place',
    location: 'Location & Delivery Geofence Radar | Shankar Cuisine',
    about: 'Our Heritage, Royal Kitchen Legacy | Shankar Cuisine',
    cart: 'Your Royal Bag | Shankar Multi-Cuisine',
    orders: 'Live Order Tracker & Receipts | Shankar Multi-Cuisine',
    call: 'Instant Phone Order Desk | Shankar Multi-Cuisine',
    heritage: 'Our Culinary Heritage | Shankar Multi-Cuisine',
    admin: 'Command Center & Department Desks | Shankar Multi-Cuisine',
  };

  const title = titles[route] || 'Shankar Pure Heritage Multi-Cuisine';
  document.title = title;

  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) {
    descMeta.setAttribute(
      'content',
      `${title} - Authentic North & South Indian, Royal Mughal, Tandoor & Street Delicacies delivered hot or served in Connaught Place.`
    );
  }
}
