/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { identifyTableFromScan, getLocalRegisteredTables } from '../services/tableService';

/**
 * Normalizes any table input from external camera apps or QR reader strings.
 */
export function normalizeTableIdentifier(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const result = identifyTableFromScan(raw);
  if (result.success && result.table) {
    return result.table.name;
  }
  let clean = decodeURIComponent(raw).trim();
  clean = clean.replace(/^["']|["']$/g, '').trim();
  if (!clean) return null;
  // Pure digits: "5", "05", "12"
  if (/^\d+$/.test(clean)) {
    return `Table ${parseInt(clean, 10)}`;
  }
  if (/^table\s+\d+/i.test(clean)) {
    const num = clean.replace(/^table\s+/i, '').trim();
    return `Table ${parseInt(num, 10)}`;
  }
  if (/^t-?\d+/i.test(clean)) {
    const num = clean.replace(/^t-?/i, '').trim();
    return `Table ${parseInt(num, 10)}`;
  }
  return clean.startsWith('Table ') ? clean : `Table ${clean}`;
}

/**
 * Auto-detects table parameter from any external app scan or browser link:
 * Validates against active registered tables and checks security tokens.
 */
export function detectTableFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const fullHref = window.location.href;
    const result = identifyTableFromScan(fullHref);
    if (result.success && result.table) {
      saveActiveTableToStorage(result.table.name);
      return result.table.name;
    }
    // Check storage persistence
    const stored =
      sessionStorage.getItem('maheswari_hotel_table') ||
      localStorage.getItem('maheswari_hotel_table');
    if (stored) {
      const storedResult = identifyTableFromScan(stored);
      if (storedResult.success && storedResult.table) {
        return storedResult.table.name;
      }
    }
  } catch (e) {
    console.warn('Table auto-detection notice:', e);
  }
  return null;
}

export function saveActiveTableToStorage(tableName: string) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('maheswari_hotel_table', tableName);
    localStorage.setItem('maheswari_hotel_table', tableName);
  } catch {}
}

export function clearActiveTableFromStorage() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem('maheswari_hotel_table');
    localStorage.removeItem('maheswari_hotel_table');
  } catch {}
}
