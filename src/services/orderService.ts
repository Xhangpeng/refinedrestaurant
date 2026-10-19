import { collection, doc, getDocs, query, setDoc, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Order } from '../types/restaurant';
import { syncOrderToSupabase } from './supabaseService';

export const INITIAL_REAL_ORDERS: Order[] = [];

export async function saveOrderToFirestore(order: Order, userId?: string): Promise<void> {
  const payload = {
    ...order,
    userId: userId || order.userId || 'guest',
    updatedAt: new Date().toISOString(),
  };

  // 1. Save to Firestore
  try {
    await setDoc(doc(db, 'orders', order.id), payload, { merge: true });
  } catch (err) {
    console.warn('Firestore direct write notice:', err);
  }

  // 2. Also sync to Supabase
  try {
    await syncOrderToSupabase(order);
  } catch (err) {
    console.warn('Supabase sync notice:', err);
  }
}

export async function fetchUserOrders(userId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((docSnap) => docSnap.data() as Order);
    }
  } catch (err) {
    console.warn('Could not query Firestore user orders:', err);
  }

  // Fallback to initial orders
  return INITIAL_REAL_ORDERS;
}
