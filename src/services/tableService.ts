/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HotelTableInfo } from '../types/restaurant';
import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  getDoc
} from 'firebase/firestore';

export const INITIAL_TABLES: HotelTableInfo[] = [
  { id: 't1', name: 'Table 1', number: 1, area: 'Window Gallery', capacity: 2, securityToken: 'sec_t1_4892fa', isActive: true, status: 'available', description: 'Quiet window view with Connaught Place lights' },
  { id: 't2', name: 'Table 2', number: 2, area: 'Royal Baithak Hall', capacity: 4, securityToken: 'sec_t2_1947cb', isActive: true, status: 'available', description: 'Plush velvet sofa seating for family dining' },
  { id: 't3', name: 'Table 3', number: 3, area: 'Heritage Alcove', capacity: 4, securityToken: 'sec_t3_7281ee', isActive: true, status: 'available', description: 'Intimate arched alcove dining' },
  { id: 't4', name: 'Table 4', number: 4, area: 'Center Grand Hall', capacity: 6, securityToken: 'sec_t4_9921aa', isActive: true, status: 'available', description: 'Spacious central dining table under crystal chandelier' },
  { id: 't5', name: 'Table 5', number: 5, area: 'Garden Courtyard', capacity: 4, securityToken: 'sec_t5_3810ff', isActive: true, status: 'available', description: 'Open-air green courtyard ambience' },
  { id: 't6', name: 'Table 6', number: 6, area: 'Executive Booth', capacity: 6, securityToken: 'sec_t6_6541dd', isActive: true, status: 'available', description: 'Private high-back booth for business luncheons' },
  { id: 't7', name: 'Table 7', number: 7, area: 'Maharaja Baithak VIP', capacity: 8, securityToken: 'sec_t7_8204bb', isActive: true, status: 'available', description: 'Grand heritage royal seating for celebrations' },
  { id: 't8', name: 'Table 8', number: 8, area: 'Royal Fountain Courtyard', capacity: 4, securityToken: 'sec_t8_5109cc', isActive: true, status: 'available', description: 'Beside the Rajasthani marble water fountain' },
  { id: 't9', name: 'Table 9', number: 9, area: 'Imperial Banquet Alcove', capacity: 10, securityToken: 'sec_t9_7742ab', isActive: true, status: 'available', description: 'Large table for groups and celebrations' },
  { id: 't10', name: 'Table 10', number: 10, area: 'Mezzanine Terrace', capacity: 4, securityToken: 'sec_t10_3391ba', isActive: true, status: 'available', description: 'Elevated mezzanine view overlooking central hall' },
  { id: 't11', name: 'Table 11', number: 11, area: 'Rooftop Gazebo', capacity: 4, securityToken: 'sec_t11_8410dc', isActive: true, status: 'available', description: 'Breezy rooftop canopy dining' },
  { id: 't12', name: 'Table 12', number: 12, area: 'Presidential Suite Table', capacity: 6, securityToken: 'sec_t12_9024fe', isActive: true, status: 'available', description: 'Exclusive VIP dining room table' },
];

const LOCAL_STORAGE_KEY = 'maheswari_registered_tables_v2';

export function generateRandomSecurityToken(prefix = 'sec'): string {
  const rand1 = Math.random().toString(36).substring(2, 8);
  const rand2 = Date.now().toString(36).slice(-4);
  return `${prefix}_${rand1}_${rand2}`;
}

export function getLocalRegisteredTables(): HotelTableInfo[] {
  if (typeof window === 'undefined') return INITIAL_TABLES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed: HotelTableInfo[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return INITIAL_TABLES;
}

export function saveLocalRegisteredTables(tables: HotelTableInfo[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tables));
    window.dispatchEvent(new CustomEvent('maheswari_tables_updated', { detail: tables }));
  } catch {}
}

export async function fetchAllRegisteredTables(): Promise<HotelTableInfo[]> {
  const localList = getLocalRegisteredTables();
  try {
    const colRef = collection(db, 'restaurant_tables');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const remoteList = snap.docs.map((d) => d.data() as HotelTableInfo);
      if (remoteList.length > 0) {
        saveLocalRegisteredTables(remoteList);
        return remoteList;
      }
    } else {
      // Seed initial tables in Firestore
      for (const t of localList) {
        try {
          await setDoc(doc(db, 'restaurant_tables', t.id), t);
        } catch {}
      }
    }
  } catch (err) {
    console.warn('Firestore tables notice (using local storage):', err);
  }
  return localList;
}

export async function addNewTable(data: {
  name: string;
  number?: number;
  area: string;
  capacity: number;
  description?: string;
}): Promise<HotelTableInfo> {
  const current = getLocalRegisteredTables();
  const nextNum = data.number || current.length + 1;
  const newId = `tbl_${Date.now()}`;
  const newTable: HotelTableInfo = {
    id: newId,
    name: data.name.trim(),
    number: nextNum,
    area: data.area.trim() || 'Main Dining Hall',
    capacity: data.capacity || 4,
    securityToken: generateRandomSecurityToken(`t${nextNum}`),
    isActive: true,
    status: 'available',
    description: data.description?.trim() || `Seating for ${data.capacity || 4} guests`,
    updatedAt: new Date().toISOString(),
  };

  const updatedList = [...current, newTable];
  saveLocalRegisteredTables(updatedList);
  try {
    await setDoc(doc(db, 'restaurant_tables', newTable.id), newTable);
  } catch (e) {
    console.warn('Saved table locally:', e);
  }
  return newTable;
}

export async function removeTable(tableId: string): Promise<void> {
  const current = getLocalRegisteredTables();
  const updatedList = current.filter((t) => t.id !== tableId);
  saveLocalRegisteredTables(updatedList);
  try {
    await deleteDoc(doc(db, 'restaurant_tables', tableId));
  } catch (e) {
    console.warn('Removed table locally:', e);
  }
}

export async function toggleTableActive(tableId: string, isActive: boolean): Promise<HotelTableInfo | null> {
  const current = getLocalRegisteredTables();
  let updatedTable: HotelTableInfo | null = null;
  const updatedList = current.map((t) => {
    if (t.id === tableId) {
      updatedTable = { ...t, isActive, updatedAt: new Date().toISOString() };
      return updatedTable;
    }
    return t;
  });
  if (updatedTable) {
    saveLocalRegisteredTables(updatedList);
    try {
      await setDoc(doc(db, 'restaurant_tables', tableId), updatedTable);
    } catch {}
  }
  return updatedTable;
}

export async function regenerateTableSecurityToken(tableId: string): Promise<HotelTableInfo | null> {
  const current = getLocalRegisteredTables();
  let updatedTable: HotelTableInfo | null = null;
  const updatedList = current.map((t) => {
    if (t.id === tableId) {
      const newToken = generateRandomSecurityToken(`t${t.number}`);
      updatedTable = {
        ...t,
        securityToken: newToken,
        updatedAt: new Date().toISOString(),
      };
      return updatedTable;
    }
    return t;
  });
  if (updatedTable) {
    saveLocalRegisteredTables(updatedList);
    try {
      await setDoc(doc(db, 'restaurant_tables', tableId), updatedTable);
    } catch (e) {
      console.warn('Updated token locally:', e);
    }
  }
  return updatedTable;
}

export function buildTableQrUrl(table: HotelTableInfo): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://maheswarirestaurant.com';
  const url = new URL(origin);
  url.searchParams.set('table', table.name);
  url.searchParams.set('token', table.securityToken);
  return url.toString();
}

/**
 * Validates any scanned text or camera QR result.
 * Checks against registered tables and verifies security token if provided.
 */
export function identifyTableFromScan(raw: string): {
  success: boolean;
  table?: HotelTableInfo;
  error?: string;
} {
  if (!raw || !raw.trim()) {
    return { success: false, error: 'Empty scan result.' };
  }
  const clean = raw.trim();
  const tables = getLocalRegisteredTables();

  let targetTableName: string | null = null;
  let targetToken: string | null = null;

  // Try parsing as full URL
  if (clean.includes('http://') || clean.includes('https://') || clean.includes('?') || clean.includes('#') || clean.includes('/table')) {
    try {
      const url = new URL(clean.startsWith('http') ? clean : `https://maheswarirestaurant.com/${clean.replace(/^\//, '')}`);
      const tableParam =
        url.searchParams.get('table') ||
        url.searchParams.get('t') ||
        url.searchParams.get('tbl') ||
        url.searchParams.get('tableno') ||
        url.searchParams.get('table_id') ||
        url.searchParams.get('tableNumber') ||
        url.searchParams.get('seat');
      const tokenParam =
        url.searchParams.get('token') ||
        url.searchParams.get('sec') ||
        url.searchParams.get('k') ||
        url.searchParams.get('key');

      if (tableParam) targetTableName = decodeURIComponent(tableParam).trim();
      if (tokenParam) targetToken = decodeURIComponent(tokenParam).trim();

      // Check URL pathname (e.g., /table/5 or /tables/5 or /table-5)
      if (!targetTableName && url.pathname) {
        const pathMatch = url.pathname.match(/\/(?:table|tables|tbl)[/-]?([a-zA-Z0-9_-]+)/i);
        if (pathMatch && pathMatch[1]) {
          targetTableName = decodeURIComponent(pathMatch[1]);
        }
      }

      if (!targetTableName && url.hash) {
        const hashMatch = url.hash.match(/(?:table|tbl|t)[=-]?([a-zA-Z0-9_\s%+-]+)/i);
        if (hashMatch && hashMatch[1]) targetTableName = decodeURIComponent(hashMatch[1]);
      }
    } catch {}
  }

  // If not a URL, raw table text or JSON format
  if (!targetTableName) {
    try {
      const parsed = JSON.parse(clean);
      if (parsed && typeof parsed === 'object') {
        if (parsed.table) targetTableName = String(parsed.table);
        if (parsed.token) targetToken = String(parsed.token);
      }
    } catch {}
  }

  if (!targetTableName) {
    targetTableName = clean;
  }

  // Normalize targetTableName
  const normalizedTarget = targetTableName.toLowerCase().replace(/[-_]/g, ' ').trim();

  // Find in registered tables
  const matchedTable = tables.find((t) => {
    const tNameLower = t.name.toLowerCase().trim();
    if (tNameLower === normalizedTarget) return true;
    if (tNameLower.replace(/\s+/g, '') === normalizedTarget.replace(/\s+/g, '')) return true;
    if (`table ${t.number}` === normalizedTarget) return true;
    if (String(t.number) === normalizedTarget) return true;
    if (t.id.toLowerCase() === normalizedTarget) return true;
    return false;
  });

  if (!matchedTable) {
    return {
      success: false,
      error: `Table "${targetTableName}" is not registered in our dining system.`,
    };
  }

  if (!matchedTable.isActive) {
    return {
      success: false,
      error: `${matchedTable.name} is currently marked inactive by the restaurant manager.`,
    };
  }

  // Security token check: If a token is provided in the QR code, ensure it matches the active token
  if (targetToken && matchedTable.securityToken) {
    if (targetToken !== matchedTable.securityToken) {
      return {
        success: false,
        error: `Security token mismatch for ${matchedTable.name}. The QR code on this table may have been regenerated by management. Please scan the latest acrylic stand.`,
      };
    }
  }

  return {
    success: true,
    table: matchedTable,
  };
}
