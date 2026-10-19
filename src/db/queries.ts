import { eq, desc, sql } from 'drizzle-orm';
import { db } from './index.ts';
import {
  users,
  orders,
  reservations,
  menuItems,
  restaurantSettings
} from './schema.ts';

// 1. User Management (Get or Create with Role Sync)
export async function getOrCreateUser(
  uid: string,
  email: string,
  name?: string,
  phone?: string
) {
  try {
    const isOwnerAdmin = email === 'tejsinghsaud70@gmail.com';
    const initialRole = isOwnerAdmin ? 'admin' : 'customer';

    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        name: name || email.split('@')[0],
        phone: phone || null,
        role: initialRole,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(name ? { name } : {}),
          ...(phone ? { phone } : {}),
          ...(isOwnerAdmin ? { role: 'admin' } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('getOrCreateUser error:', error);
    throw new Error('User sync failed', { cause: error });
  }
}

// 2. Orders Queries
export async function getAllOrders(statusFilter?: string) {
  try {
    if (statusFilter && statusFilter !== 'all') {
      return await db
        .select()
        .from(orders)
        .where(eq(orders.orderStatus, statusFilter))
        .orderBy(desc(orders.createdAt));
    }
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('getAllOrders query failed:', error);
    throw new Error('Failed to fetch orders from database', { cause: error });
  }
}

export async function getUserOrders(userId: string) {
  try {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('getUserOrders query failed:', error);
    throw new Error('Failed to fetch user orders', { cause: error });
  }
}

export async function createOrder(orderPayload: any) {
  try {
    const itemsJson =
      typeof orderPayload.items === 'string'
        ? orderPayload.items
        : JSON.stringify(orderPayload.items || []);

    const result = await db
      .insert(orders)
      .values({
        id: orderPayload.id,
        orderNumber: orderPayload.orderNumber,
        userId: orderPayload.userId,
        customerName: orderPayload.customerName,
        customerPhone: orderPayload.customerPhone,
        bookingType: orderPayload.bookingType || 'delivery',
        items: itemsJson,
        subtotal: orderPayload.subtotal,
        gstAmount: orderPayload.gstAmount,
        deliveryFee: orderPayload.deliveryFee || 0,
        discountAmount: orderPayload.discountAmount || 0,
        discountCode: orderPayload.discountCode || null,
        grandTotal: orderPayload.grandTotal,
        paymentMethod: orderPayload.paymentMethod || 'upi',
        paymentStatus: orderPayload.paymentStatus || 'paid',
        orderStatus: orderPayload.orderStatus || 'placed',
        deliveryAddress: orderPayload.deliveryAddress || null,
        tableNumber: orderPayload.tableNumber || null,
        notes: orderPayload.notes || null,
      })
      .onConflictDoUpdate({
        target: orders.id,
        set: {
          orderStatus: orderPayload.orderStatus || 'placed',
          paymentStatus: orderPayload.paymentStatus || 'paid',
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('createOrder query failed:', error);
    throw new Error('Failed to insert order', { cause: error });
  }
}

export async function updateOrderStatus(orderId: string, orderStatus: string) {
  try {
    const result = await db
      .update(orders)
      .set({
        orderStatus,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    return result[0];
  } catch (error) {
    console.error('updateOrderStatus failed:', error);
    throw new Error('Failed to update order status', { cause: error });
  }
}

export async function clearAllOrdersDb() {
  try {
    await db.delete(orders);
    return true;
  } catch (error) {
    console.warn('clearAllOrdersDb warning:', error);
    return false;
  }
}

// 3. Reservations Queries
export async function getAllReservations() {
  try {
    return await db.select().from(reservations).orderBy(desc(reservations.createdAt));
  } catch (error) {
    console.error('getAllReservations failed:', error);
    throw new Error('Failed to fetch reservations', { cause: error });
  }
}

export async function createReservation(resPayload: any) {
  try {
    const result = await db
      .insert(reservations)
      .values({
        id: resPayload.id,
        bookingNumber: resPayload.bookingNumber,
        userId: resPayload.userId,
        guestName: resPayload.guestName,
        guestPhone: resPayload.guestPhone,
        guestEmail: resPayload.guestEmail || null,
        reservationDate: resPayload.reservationDate,
        timeSlot: resPayload.timeSlot,
        guestCount: resPayload.guestCount || 2,
        seatingArea: resPayload.seatingArea || 'Main Dining Hall',
        status: resPayload.status || 'confirmed',
        specialRequests: resPayload.specialRequests || null,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('createReservation failed:', error);
    throw new Error('Failed to insert reservation', { cause: error });
  }
}

export async function updateReservationStatus(reservationId: string, status: string) {
  try {
    const result = await db
      .update(reservations)
      .set({ status })
      .where(eq(reservations.id, reservationId))
      .returning();

    return result[0];
  } catch (error) {
    console.error('updateReservationStatus failed:', error);
    throw new Error('Failed to update reservation status', { cause: error });
  }
}

// 4. Restaurant Settings
export async function getRestaurantSettings() {
  try {
    const result = await db
      .select()
      .from(restaurantSettings)
      .where(eq(restaurantSettings.id, 'config'));
    if (result.length > 0) return result[0];

    // Seed default if empty
    const created = await db
      .insert(restaurantSettings)
      .values({
        id: 'config',
        isKitchenAcceptingOrders: true,
        estimatedDeliveryMinutes: 25,
        announcementBanner:
          'Fresh Charcoal Tandoor & Royal Desi Ghee Curries Live!',
      })
      .returning();
    return created[0];
  } catch (error) {
    console.error('getRestaurantSettings failed:', error);
    return {
      id: 'config',
      isKitchenAcceptingOrders: true,
      estimatedDeliveryMinutes: 25,
      announcementBanner: 'Fresh Charcoal Tandoor & Royal Desi Ghee Curries Live!',
      updatedAt: new Date(),
    };
  }
}

export async function updateRestaurantSettings(updates: {
  isKitchenAcceptingOrders?: boolean;
  estimatedDeliveryMinutes?: number;
  announcementBanner?: string;
}) {
  try {
    const result = await db
      .update(restaurantSettings)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(restaurantSettings.id, 'config'))
      .returning();

    return result[0];
  } catch (error) {
    console.error('updateRestaurantSettings failed:', error);
    throw new Error('Failed to update restaurant settings', { cause: error });
  }
}

// 5. Admin Analytics
export async function getAdminAnalytics() {
  try {
    const allOrdersList = await db.select().from(orders);
    const allReservationsList = await db.select().from(reservations);
    const allUsersList = await db.select().from(users);

    const totalOrders = allOrdersList.length;
    const totalRevenue = allOrdersList.reduce((acc, o) => acc + (o.grandTotal || 0), 0);
    const pendingOrders = allOrdersList.filter(
      (o) => o.orderStatus === 'placed' || o.orderStatus === 'cooking'
    ).length;
    const completedOrders = allOrdersList.filter((o) => o.orderStatus === 'completed').length;

    const totalReservations = allReservationsList.length;
    const confirmedReservations = allReservationsList.filter(
      (r) => r.status === 'confirmed' || r.status === 'seated'
    ).length;

    return {
      totalOrders,
      totalRevenue: Math.round(totalRevenue),
      pendingOrders,
      completedOrders,
      totalReservations,
      confirmedReservations,
      totalCustomers: allUsersList.length,
    };
  } catch (error) {
    console.error('getAdminAnalytics failed:', error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalReservations: 0,
      confirmedReservations: 0,
      totalCustomers: 0,
    };
  }
}
