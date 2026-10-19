import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp
} from 'drizzle-orm/pg-core';

// 1. Users Table with Role-Based Access Control (RBAC)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  phone: text('phone'),
  role: text('role').notNull().default('customer'), // 'admin' | 'manager' | 'kitchen' | 'captain' | 'customer'
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Orders Table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull(),
  userId: text('user_id').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  bookingType: text('booking_type').notNull().default('delivery'), // 'delivery' | 'dine_in' | 'takeaway'
  items: text('items').notNull(), // JSON stringified array of ordered dishes
  subtotal: real('subtotal').notNull(),
  gstAmount: real('gst_amount').notNull(),
  deliveryFee: real('delivery_fee').notNull().default(0),
  discountAmount: real('discount_amount').notNull().default(0),
  discountCode: text('discount_code'),
  grandTotal: real('grand_total').notNull(),
  paymentMethod: text('payment_method').notNull().default('upi'), // 'upi' | 'card' | 'cod'
  paymentStatus: text('payment_status').notNull().default('paid'), // 'paid' | 'pending' | 'refunded'
  orderStatus: text('order_status').notNull().default('placed'), // 'placed' | 'confirmed' | 'cooking' | 'out_for_delivery' | 'completed' | 'cancelled'
  deliveryAddress: text('delivery_address'),
  tableNumber: text('table_number'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 3. Table Reservations Table
export const reservations = pgTable('reservations', {
  id: text('id').primaryKey(),
  bookingNumber: text('booking_number').notNull(),
  userId: text('user_id').notNull(),
  guestName: text('guest_name').notNull(),
  guestPhone: text('guest_phone').notNull(),
  guestEmail: text('guest_email'),
  reservationDate: text('reservation_date').notNull(),
  timeSlot: text('time_slot').notNull(),
  guestCount: integer('guest_count').notNull().default(2),
  seatingArea: text('seating_area').notNull().default('Main Dining Hall'), // 'Main Dining Hall' | 'Courtyard' | 'Maharaja Baithak'
  status: text('status').notNull().default('confirmed'), // 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled'
  specialRequests: text('special_requests'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Menu Items Table (for dynamic menu management from Admin Panel)
export const menuItems = pgTable('menu_items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  hindiName: text('hindi_name'),
  category: text('category').notNull(),
  menuSection: text('menu_section').notNull().default('all_day'),
  description: text('description').notNull(),
  price: real('price').notNull(),
  halfPrice: real('half_price'),
  dietary: text('dietary').notNull().default('veg'),
  spiceLevel: integer('spice_level').notNull().default(1),
  isBestseller: boolean('is_bestseller').default(false),
  isChefSpecial: boolean('is_chef_special').default(false),
  isAvailable: boolean('is_available').default(true),
  prepTimeMinutes: integer('prep_time_minutes').default(15),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Restaurant Configuration & Kitchen Controls
export const restaurantSettings = pgTable('restaurant_settings', {
  id: text('id').primaryKey().default('config'),
  isKitchenAcceptingOrders: boolean('is_kitchen_accepting_orders').default(true),
  estimatedDeliveryMinutes: integer('estimated_delivery_minutes').default(30),
  announcementBanner: text('announcement_banner'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  reservations: many(reservations),
}));
