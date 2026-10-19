import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order, MenuItem, TableBookingDetails, DepartmentType } from '../types/restaurant';

export interface SupabaseStaffRecord {
  id: string;
  name: string;
  role: string;
  department: DepartmentType;
  station: string;
  phone: string;
  shift_status: 'on_shift' | 'off_duty';
  pin?: string;
  created_at?: string;
}

/**
 * Fetch staff roster from Supabase if configured
 */
export async function fetchStaffFromSupabase(): Promise<SupabaseStaffRecord[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('staff').select('*').order('name', { ascending: true });
    if (error) {
      console.warn('Supabase fetch staff notice:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase staff query error:', err);
    return null;
  }
}

/**
 * Update staff department assignment in Supabase
 */
export async function updateStaffDepartmentInSupabase(
  staffId: string,
  department: DepartmentType
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('staff')
      .update({ department, updated_at: new Date().toISOString() })
      .eq('id', staffId);
    if (error) {
      console.warn('Supabase update staff department error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase update staff error:', err);
    return false;
  }
}

/**
 * Sync Order to Supabase database
 */
export async function syncOrderToSupabase(order: Order): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: order.id,
      order_number: order.orderNumber,
      user_id: order.userId || 'guest',
      customer_name: order.customerName || order.customer?.name || 'Guest',
      customer_phone: order.customerPhone || order.customer?.phone || '',
      booking_type: order.bookingType,
      table_number: order.tableNumber || null,
      items: order.items,
      subtotal: order.subtotal,
      grand_total: order.grandTotal,
      order_status: order.orderStatus,
      prepared_by_chef: order.preparedByChef || null,
      prepared_at: order.preparedAt || null,
      served_by_waiter: order.servedByWaiter || null,
      assigned_rider: order.assignedRider || null,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('orders').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase sync order notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase order sync error:', err);
    return false;
  }
}

/**
 * Update Order status in Supabase (e.g. prepared, served, out for delivery, completed)
 */
export async function updateOrderStatusInSupabase(
  orderId: string,
  orderStatus: Order['orderStatus'],
  extraFields?: {
    preparedByChef?: string;
    preparedAt?: string;
    servedByWaiter?: string;
    assignedRider?: string;
    paymentStatus?: 'paid' | 'pending';
  }
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const payload: any = {
      order_status: orderStatus,
      updated_at: new Date().toISOString(),
    };
    if (extraFields?.preparedByChef) payload.prepared_by_chef = extraFields.preparedByChef;
    if (extraFields?.preparedAt) payload.prepared_at = extraFields.preparedAt;
    if (extraFields?.servedByWaiter) payload.served_by_waiter = extraFields.servedByWaiter;
    if (extraFields?.assignedRider) payload.assigned_rider = extraFields.assignedRider;
    if (extraFields?.paymentStatus) payload.payment_status = extraFields.paymentStatus;

    const { error } = await supabase.from('orders').update(payload).eq('id', orderId);
    if (error) {
      console.warn('Supabase update order status error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase status update error:', err);
    return false;
  }
}

/**
 * Sync Table Reservation to Supabase
 */
export async function syncReservationToSupabase(res: TableBookingDetails): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: res.id,
      booking_number: res.bookingNumber,
      guest_name: res.guestName,
      guest_phone: res.guestPhone,
      guest_email: res.guestEmail || '',
      date: res.date,
      time_slot: res.timeSlot,
      guests_count: res.guestsCount,
      seating_area: res.seatingArea,
      table_number: res.tableNumber || null,
      special_requests: res.specialRequests || '',
      status: res.status,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('reservations').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase reservation notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase reservation sync error:', err);
    return false;
  }
}

/**
 * Update Menu Item availability or price in Supabase
 */
export async function updateMenuItemInSupabase(
  item: MenuItem
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: item.id,
      name: item.name,
      hindi_name: item.hindiName || null,
      category: item.category,
      price: item.price,
      half_price: item.halfPrice || null,
      is_available: item.isAvailable !== false,
      prep_time_minutes: item.prepTimeMinutes || 15,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('menu_items').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase menu item error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase menu sync error:', err);
    return false;
  }
}
