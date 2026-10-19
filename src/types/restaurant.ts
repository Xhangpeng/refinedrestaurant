/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DietaryType = 'veg' | 'non-veg' | 'jain' | 'vegan';
export type SpiceLevel = 0 | 1 | 2 | 3; // 0: Mild, 1: Medium, 2: Spicy, 3: Desi Hot
export type MenuSectionType =
  | 'all_day'
  | 'lunch_buffet'
  | 'royal_thali'
  | 'desserts_beverages'
  | 'lunch'
  | 'bar';

export type MenuCategoryType =
  | 'all'
  | 'starters'
  | 'tandoor'
  | 'main_course'
  | 'curries'
  | 'dal_rice'
  | 'biryani'
  | 'breads'
  | 'south_indian'
  | 'royal_thali'
  | 'desserts'
  | 'beverages'
  | 'lunch_thali'
  | 'lunch_bowls'
  | 'kathi_wraps'
  | 'craft_cocktails'
  | 'indian_beers'
  | 'wines'
  | 'mocktails'
  | string;

export interface MenuItem {
  id: string;
  name: string;
  hindiName?: string;
  description: string;
  price: number;
  halfPrice?: number;
  category: MenuCategoryType;
  section?: MenuSectionType;
  menuSection?: MenuSectionType;
  image: string;
  isPureVeg?: boolean;
  dietary?: DietaryType;
  isChefSpecial?: boolean;
  isBestseller?: boolean;
  isJainAvailable?: boolean;
  isGlutenFree?: boolean;
  isAvailable?: boolean;
  spiceLevel?: SpiceLevel;
  spiceLevels?: SpiceLevel[];
  preparationTimeMinutes?: number;
  prepTimeMinutes?: number;
  calories?: number;
  tags?: string[];
  allergens?: string[];
  rating?: number;
  reviewsCount?: number;
  volumeOrServing?: string;
  alcoholPercentage?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'dishes' | 'ambiance' | 'tandoor' | 'bar';
  image: string;
  caption: string;
}

export interface CateringInquiry {
  id?: string;
  name?: string;
  fullName?: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  packageType?: string;
  budgetRange?: string;
  quotedAmount?: number;
  specialRequirements?: string;
  customNotes?: string;
  createdAt?: string;
  status?: 'new' | 'contacted' | 'confirmed' | 'completed' | string;
}

export interface JobPosition {
  id: string;
  title: string;
  department: 'Culinary' | 'Hospitality & Service' | 'Bar & Mixology' | 'Operations';
  location: string;
  type: 'Full-Time' | 'Part-Time';
  experienceRequired: string;
  description: string;
  requirements: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Dining & Reservations' | 'Online Orders & Delivery' | 'Food & Dietary' | 'Events & Catering';
}

export interface AllergenRow {
  dishName: string;
  menuSection: MenuSectionType;
  dietary: DietaryType;
  glutenFree: boolean;
  dairyFree: boolean;
  nutFree: boolean;
  vegan: boolean;
  jainFriendly: boolean;
  notes?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  portion: 'full' | 'half';
  spiceLevel: SpiceLevel;
  specialInstructions?: string;
  unitPrice?: number;
  itemTotal: number;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
  addressLabel: string;
  accuracyMeters?: number;
}

export interface PresetLocation {
  id: string;
  name: string;
  description: string;
  coords?: LocationCoordinates;
  lat?: number;
  lng?: number;
}

export interface GeofenceConfig {
  restaurantName: string;
  restaurantAddress: string;
  center: LocationCoordinates;
  maxDeliveryRadiusKm: number;
  maxDineInRadiusMeters: number;
}

export interface GeofenceState {
  userCoords: LocationCoordinates | null;
  distanceKm: number | null;
  distanceMeters: number | null;
  isInsideDeliveryRadius: boolean;
  isInsideDineInRadius: boolean;
  status: 'idle' | 'requesting' | 'granted' | 'denied' | 'simulated';
  errorMessage: string | null;
  lastCheckedAt: string | null;
}

export interface CloudflareTurnstileState {
  status: 'unverified' | 'verifying' | 'verified' | 'challenge_required' | 'failed';
  token: string | null;
  cfRayId: string | null;
  botScore: number;
  verifiedAt: string | null;
  challengeType: 'managed' | 'interactive' | 'invisible';
}

export type BookingType = 'dine_in' | 'takeaway' | 'delivery';

export interface TableBookingDetails {
  id?: string;
  bookingNumber?: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  guestsCount: number;
  date: string;
  timeSlot: string;
  seatingArea: string;
  specialRequest?: string;
  specialRequests?: string;
  status?: 'confirmed' | 'pending' | 'cancelled' | 'seated' | 'completed' | string;
  tableNumber?: string | number;
  createdAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  createdAt: string;
  bookingType: BookingType;
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  deliveryFee: number;
  discountAmount: number;
  discountCode?: string;
  grandTotal: number;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  notes?: string;
  customer?: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    tableNumber?: string;
  };
  tableDetails?: TableBookingDetails;
  tableNumber?: string;
  paymentMethod: 'upi' | 'card' | 'cash' | 'cod' | 'pay_at_counter';
  paymentStatus: 'paid' | 'pending';
  orderStatus:
    | 'placed'
    | 'confirmed'
    | 'cooking'
    | 'ready_at_table'
    | 'ready_for_dispatch'
    | 'out_for_delivery'
    | 'completed'
    | 'cancelled';
  preparedByChef?: string;
  preparedAt?: string;
  servedByWaiter?: string;
  servedAt?: string;
  assignedRider?: string;
  geofenceVerification?: {
    verified: boolean;
    distanceKm: number;
    userLocationLabel: string;
  };
  turnstileToken?: string;
  estimatedTimeMinutes?: number;
  estimatedDeliveryMinutes?: number;
  autoAcceptedAtKitchen?: boolean;
}

export type DepartmentType =
  | 'manager'
  | 'kitchen'
  | 'waiter'
  | 'booking_menu'
  | 'delivery';

export type UserRole =
  | 'customer'
  | 'admin'
  | 'staff'
  | 'manager'
  | 'kitchen'
  | 'waiter'
  | 'captain'
  | 'booking_menu'
  | 'delivery'
  | 'user';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  photoURL?: string;
  authProvider?: 'google' | 'phone' | 'guest' | 'email';
  isLoggedIn: boolean;
  role?: UserRole | string;
  department?: DepartmentType;
  savedAddresses: string[];
  loyaltyPoints: number;
  recentOrdersCount: number;
  staffPin?: string;
  station?: string;
}

export interface DiningTable {
  id: string;
  tableNumber: string;
  capacity: number;
  area: string;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentGuestName?: string;
  occupiedSince?: string;
  securityToken?: string;
  isActive?: boolean;
}

export interface HotelTableInfo {
  id: string;
  name: string;
  number: number;
  area: string;
  capacity: number;
  securityToken: string;
  isActive: boolean;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  description?: string;
  updatedAt?: string;
  currentGuestName?: string;
  occupiedSince?: string;
}

export interface PromoCoupon {
  id: string;
  code: string;
  discountPercent?: number;
  discountPercentage?: number;
  discountFlat?: number;
  flatDiscount?: number;
  minOrderValue: number;
  maxDiscount?: number;
  isActive: boolean;
  description: string;
}

export interface GuestReview {
  id: string;
  guestName: string;
  rating: number;
  date: string;
  comment: string;
  dishMentioned?: string;
  dishRecommended?: string;
  verifiedDining?: boolean;
  isVerifiedDineIn?: boolean;
  adminReply?: string;
  status?: 'approved' | 'pending' | string;
}
