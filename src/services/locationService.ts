import { PresetLocation } from '../types/restaurant';

export const SHANKAR_RESTAURANT_LOCATION = {
  name: 'Shankar Pure Heritage Multi-Cuisine',
  address: 'Block M, Middle Circle, Connaught Place, New Delhi, 110001',
  center: {
    lat: 28.6328,
    lng: 77.2197,
  },
  maxDeliveryRadiusKm: 12,
  maxDineInRadiusMeters: 250,
};

export interface ExtendedPresetLocation extends PresetLocation {
  lat: number;
  lng: number;
  expectedStatus: 'inside_radius' | 'outside_radius' | 'dine_in_table';
}

export const PRESET_LOCATIONS: ExtendedPresetLocation[] = [
  {
    id: 'preset_table_1',
    name: 'Dining Table #4 (Inside Palace)',
    description: 'Inside dining hall (0.01 km)',
    lat: 28.63285,
    lng: 77.21975,
    expectedStatus: 'dine_in_table',
  },
  {
    id: 'preset_cp_barakhamba',
    name: 'Barakhamba Road, CP',
    description: 'Connaught Place core delivery zone (0.6 km)',
    lat: 28.6295,
    lng: 77.2245,
    expectedStatus: 'inside_radius',
  },
  {
    id: 'preset_bengali_market',
    name: 'Bengali Market, Mandi House',
    description: 'Central Delhi residential zone (1.8 km)',
    lat: 28.6247,
    lng: 77.2341,
    expectedStatus: 'inside_radius',
  },
  {
    id: 'preset_karol_bagh',
    name: 'Karol Bagh Market',
    description: 'West-Central Delhi delivery sector (4.5 km)',
    lat: 28.6517,
    lng: 77.1906,
    expectedStatus: 'inside_radius',
  },
  {
    id: 'preset_gurgaon_cyberhub',
    name: 'DLF Cyber City, Gurgaon',
    description: 'Outside delivery boundary (24.8 km - Simulated rejection)',
    lat: 28.4952,
    lng: 77.0895,
    expectedStatus: 'outside_radius',
  },
];

export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100;
}

export async function getLiveDeviceLocation(): Promise<{
  lat: number;
  lng: number;
  accuracy: number;
  accuracyMeters: number;
  addressLabel: string;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy || 15,
          accuracyMeters: Math.round(position.coords.accuracy || 15),
          addressLabel: 'Live GPS Location (Verified Device)',
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
