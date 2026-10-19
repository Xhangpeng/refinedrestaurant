/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'maheswari_royal_restaurant_jwt_secret_key_2026';
const JWT_EXPIRES_IN = '7d';

export interface JwtUserPayload {
  uid: string;
  email: string;
  name?: string;
  phone?: string;
  role: string;
  department?: string;
}

export function signToken(payload: JwtUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwtToken(token: string): JwtUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtUserPayload;
  } catch (error) {
    return null;
  }
}
