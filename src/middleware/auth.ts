/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken, JwtUserPayload } from '../lib/jwt.ts';
import { adminAuth } from '../lib/firebase-admin.ts';
import { isAuthorizedAdminEmail } from '../utils/authHelper.ts';

export interface AuthRequest extends Request {
  user?: JwtUserPayload;
}

export const authenticateToken = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) return next();

  // 1. Verify custom JWT token
  const decodedJwt = verifyJwtToken(token);
  if (decodedJwt) {
    req.user = decodedJwt;
    return next();
  }

  // 2. Fallback to Firebase ID Token
  try {
    const fbUser = await adminAuth.verifyIdToken(token);
    const email = (fbUser.email || '').toLowerCase().trim();
    const isAdmin = isAuthorizedAdminEmail(email);

    req.user = {
      uid: fbUser.uid,
      email,
      name: fbUser.name,
      phone: (fbUser as any).phone_number,
      role: isAdmin ? 'admin' : ((fbUser as any).role || 'customer'),
      department: (fbUser as any).department || (isAdmin ? 'manager' : undefined),
    };
  } catch {
    // ignore expired or invalid
  }

  next();
};

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required. Please sign in or register to continue.',
      code: 'AUTH_REQUIRED',
    });
  }
  next();
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required. Please log in as an administrator.',
      code: 'AUTH_REQUIRED',
    });
  }

  const role = req.user.role?.toLowerCase() || '';
  const email = req.user.email?.toLowerCase() || '';

  const isStaffOrAdmin =
    ['admin', 'manager', 'kitchen', 'waiter', 'booking_menu', 'delivery'].includes(role) ||
    isAuthorizedAdminEmail(email) ||
    email.startsWith('admin@');

  if (!isStaffOrAdmin) {
    return res.status(403).json({
      error: 'Access denied: Administrative privileges required.',
      code: 'FORBIDDEN',
    });
  }

  next();
};
