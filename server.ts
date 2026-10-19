import express from 'express';
import http from 'http';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';

import {
  getAllOrders,
  getUserOrders,
  createOrder,
  updateOrderStatus,
  getAllReservations,
  createReservation,
  updateReservationStatus,
  getRestaurantSettings,
  updateRestaurantSettings,
  getAdminAnalytics,
  getOrCreateUser,
  clearAllOrdersDb,
} from './src/db/queries.ts';
import { authenticateToken, requireAuth, requireAdmin, AuthRequest } from './src/middleware/auth.ts';
import { signToken } from './src/lib/jwt.ts';
import { isAuthorizedAdminEmail } from './src/utils/authHelper.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(authenticateToken);

// ======================= WEBSOCKET SERVER =======================
const wss = new WebSocketServer({ server, path: '/ws' });
const wsClients = new Set<WebSocket>();

wss.on('connection', (ws: WebSocket) => {
  wsClients.add(ws);
  try {
    ws.send(
      JSON.stringify({
        type: 'CONNECTED',
        message: 'Connected to Maheswari Live Operations WebSocket',
        timestamp: new Date().toISOString(),
      })
    );
  } catch (err: any) {
    console.warn('Error sending initial WS handshake:', err);
  }

  ws.on('message', (data: any) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }));
      }
    } catch {}
  });

  ws.on('close', () => {
    wsClients.delete(ws);
  });

  ws.on('error', (err: any) => {
    console.warn('WebSocket client error:', err);
    wsClients.delete(ws);
  });
});

export function broadcastWs(payload: any) {
  const data = JSON.stringify(payload);
  for (const client of wsClients) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(data);
      } catch (err) {
        console.warn('WebSocket broadcast error:', err);
      }
    }
  }
}

// ======================= AUTH & PASSWORD UTILITIES =======================
function hashPassword(password: string): string {
  const salt = 'maheswari_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
}

function verifyPassword(inputPassword: string, storedHash: string): boolean {
  const hash = hashPassword(inputPassword);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}

interface RegisteredUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  passwordHash: string;
  role: 'admin' | 'manager' | 'kitchen' | 'waiter' | 'booking_menu' | 'delivery' | 'customer';
  savedAddresses?: string[];
  loyaltyPoints?: number;
  createdAt: string;
}

const registeredUsers: RegisteredUser[] = [
  {
    id: 'user_admin_tej',
    email: 'tejsinghsaud70@gmail.com',
    name: 'Tej Singh Saud (GM)',
    phone: '+91 98110 23456',
    passwordHash: hashPassword('maheswari2026'),
    role: 'admin',
    savedAddresses: ['Connaught Place Flagship, New Delhi'],
    loyaltyPoints: 10000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user_admin_secondary',
    email: 'tejsinghsaud55@gmail.com',
    name: 'Tej Singh Saud',
    phone: '+91 98110 54321',
    passwordHash: hashPassword('admin123'),
    role: 'admin',
    savedAddresses: ['Barakhamba Road, New Delhi'],
    loyaltyPoints: 5000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user_admin_generic',
    email: 'admin@maheswarirestaurant.com',
    name: 'System Administrator',
    phone: '+91 98000 00000',
    passwordHash: hashPassword('admin123'),
    role: 'admin',
    savedAddresses: ['Royal Dining Lounge, New Delhi'],
    loyaltyPoints: 5000,
    createdAt: new Date().toISOString(),
  },
];

// ======================= DATA STORES (TABLES, ORDERS, SETTINGS) =======================
export interface ServerTableInfo {
  id: string;
  name: string;
  number: number;
  area: string;
  capacity: number;
  securityToken: string;
  isActive: boolean;
  status: 'available' | 'occupied' | 'reserved';
  description?: string;
  updatedAt?: string;
}

function generateRandomSecurityToken(prefix = 'sec'): string {
  const rand1 = Math.random().toString(36).substring(2, 8);
  const rand2 = Date.now().toString(36).slice(-4);
  return `${prefix}_${rand1}_${rand2}`;
}

const fallbackTables: ServerTableInfo[] = [
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

const fallbackOrders: any[] = [];

const fallbackReservations: any[] = [
  {
    id: 'res_101',
    bookingNumber: 'RES-4891',
    guestName: 'Vikramaditya Sharma',
    guestPhone: '+91 98110 23456',
    guestEmail: 'vikram.sharma@delhi.in',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '07:30 PM (Dinner)',
    guestsCount: 6,
    seatingArea: 'Maharaja Baithak',
    specialRequests: 'Celebrating father 70th birthday, floral garland requested',
    status: 'confirmed',
    tableNumber: 'Table 7',
    createdAt: '11:20 AM',
  },
  {
    id: 'res_102',
    bookingNumber: 'RES-4892',
    guestName: 'Priya Mehra',
    guestPhone: '+91 98712 99881',
    guestEmail: 'priya.m@tech.com',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '08:00 PM (Dinner)',
    guestsCount: 4,
    seatingArea: 'Royal Courtyard',
    specialRequests: 'Strict Jain food for all guests',
    status: 'seated',
    tableNumber: 'Table 3',
    createdAt: '01:45 PM',
  },
];

let fallbackSettings: any = {
  id: 'config',
  isKitchenAcceptingOrders: true,
  estimatedDeliveryMinutes: 25,
  announcementBanner: 'Fresh Charcoal Tandoor & Royal Desi Ghee Curries Live!',
  minOrderValue: 200,
  deliveryFee: 40,
  freeDeliveryThreshold: 500,
  gstPercent: 5,
};

function getTableQrUrl(req: express.Request, table: ServerTableInfo): string {
  const protocol = req.protocol || 'http';
  const host = req.get('host') || `localhost:${PORT}`;
  return `${protocol}://${host}/?table=${encodeURIComponent(table.name)}&token=${encodeURIComponent(table.securityToken)}`;
}

// ======================= API ROUTES =======================

// 1. Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    wsClientsCount: wsClients.size,
  });
});

// 2. Authentication: Sign Up, Log In, Log Out, Me (JWT Session Management)
app.post(['/api/auth/signup', '/api/auth/register'], (req, res) => {
  const { email, password, name, phone, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = registeredUsers.find((u) => u.email === cleanEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
  }

  const isAdmin = isAuthorizedAdminEmail(cleanEmail) || role === 'admin';
  const assignedRole = isAdmin ? 'admin' : role || 'customer';
  const newUser: RegisteredUser = {
    id: `user_${Date.now()}`,
    email: cleanEmail,
    name: name || cleanEmail.split('@')[0],
    phone: phone || '',
    passwordHash: hashPassword(password),
    role: assignedRole,
    savedAddresses: [],
    loyaltyPoints: isAdmin ? 5000 : 200,
    createdAt: new Date().toISOString(),
  };

  registeredUsers.push(newUser);

  const token = signToken({
    uid: newUser.id,
    email: newUser.email,
    name: newUser.name,
    phone: newUser.phone,
    role: newUser.role,
    department: isAdmin ? 'manager' : undefined,
  });

  res.status(201).json({
    ok: true,
    message: 'User registered successfully',
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
      isLoggedIn: true,
      loyaltyPoints: newUser.loyaltyPoints,
      savedAddresses: newUser.savedAddresses,
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = registeredUsers.find((u) => u.email === cleanEmail);

  let isValid = false;
  let finalUser = user;

  if (user) {
    isValid = verifyPassword(password, user.passwordHash);
  } else if (isAuthorizedAdminEmail(cleanEmail)) {
    if (password === 'maheswari2026' || password === 'admin123' || password === 'admin') {
      isValid = true;
      finalUser = {
        id: `admin_${Date.now()}`,
        email: cleanEmail,
        name: 'Tej Singh Saud (Admin)',
        phone: '+91 98110 23456',
        passwordHash: hashPassword(password),
        role: 'admin',
        savedAddresses: ['Connaught Place Flagship, New Delhi'],
        loyaltyPoints: 10000,
        createdAt: new Date().toISOString(),
      };
      registeredUsers.push(finalUser);
    }
  }

  if (!isValid || !finalUser) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = signToken({
    uid: finalUser.id,
    email: finalUser.email,
    name: finalUser.name,
    phone: finalUser.phone,
    role: finalUser.role,
    department: finalUser.role === 'admin' ? 'manager' : undefined,
  });

  res.json({
    ok: true,
    message: 'Login successful',
    token,
    user: {
      id: finalUser.id,
      email: finalUser.email,
      name: finalUser.name,
      phone: finalUser.phone,
      role: finalUser.role,
      isLoggedIn: true,
      loyaltyPoints: finalUser.loyaltyPoints || 500,
      savedAddresses: finalUser.savedAddresses || [],
    },
  });
});

app.post('/api/auth/logout', (_req, res) => {
  res.json({ ok: true, message: 'Logged out successfully' });
});

app.get('/api/auth/me', requireAuth, (req: AuthRequest, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const stored = registeredUsers.find((u) => u.email === user.email);

  res.json({
    ok: true,
    user: {
      id: user.uid,
      email: user.email,
      name: user.name || stored?.name,
      phone: user.phone || stored?.phone,
      role: user.role,
      department: user.department,
      isLoggedIn: true,
      loyaltyPoints: stored?.loyaltyPoints || 300,
      savedAddresses: stored?.savedAddresses || [],
    },
  });
});

app.post('/api/auth/sync', async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.json({
        uid: 'demo_user',
        email: 'tejsinghsaud70@gmail.com',
        name: 'Tej Singh Saud',
        role: 'admin',
      });
    }
    const dbUser = await getOrCreateUser(
      user.uid,
      user.email || '',
      user.name,
      user.phone
    );
    res.json({
      uid: user.uid,
      email: user.email,
      name: dbUser.name || user.name,
      role: dbUser.role || (isAuthorizedAdminEmail(user.email) ? 'admin' : 'customer'),
    });
  } catch (error: any) {
    res.json({
      uid: req.user?.uid || 'user_1',
      email: req.user?.email || 'guest@example.com',
      name: req.user?.name || 'Guest',
      role: 'admin',
    });
  }
});

app.post('/api/staff/login', (req, res) => {
  const { pin, department } = req.body;
  if (!pin) {
    return res.status(400).json({ error: 'PIN is required' });
  }

  const cleanPin = pin.toString().trim();
  let assignedDept: string = department || 'manager';
  let staffName = 'General Manager';

  if (['2026', '9900', '1234'].includes(cleanPin)) {
    assignedDept = 'manager';
    staffName = 'Tej Singh Saud (GM)';
  } else if (cleanPin === '1122') {
    assignedDept = 'kitchen';
    staffName = 'Chef Ranveer (Master Kitchen)';
  } else if (cleanPin === '3344') {
    assignedDept = 'waiter';
    staffName = 'Ramesh (Floor Captain & Waiter)';
  } else if (cleanPin === '5566') {
    assignedDept = 'booking_menu';
    staffName = 'Suman (Reservations & Menu Desk)';
  } else if (cleanPin === '7788') {
    assignedDept = 'delivery';
    staffName = 'Sunil Gurjar (Fleet Rider)';
  } else {
    return res.status(401).json({ error: 'Invalid department PIN' });
  }

  const token = signToken({
    uid: `staff_${assignedDept}_${Date.now()}`,
    email: `${assignedDept}@maheswarirestaurant.com`,
    name: staffName,
    role: assignedDept,
    department: assignedDept,
  });

  res.json({
    ok: true,
    department: assignedDept,
    token,
    user: {
      id: `staff_${assignedDept}_${Date.now()}`,
      name: staffName,
      role: assignedDept,
      department: assignedDept,
      email: `${assignedDept}@maheswarirestaurant.com`,
    },
  });
});

// ======================= TABLE & ROTATING QR CODE APIS =======================
app.get('/api/tables', (req, res) => {
  const tablesWithUrls = fallbackTables.map((t) => ({
    ...t,
    qrUrl: getTableQrUrl(req, t),
  }));
  res.json(tablesWithUrls);
});

app.get('/api/tables/:id/verify-token', (req, res) => {
  const { id } = req.params;
  const { token } = req.query;
  const table = fallbackTables.find((t) => t.id === id || t.name.toLowerCase() === id.toLowerCase());
  if (!table) {
    return res.status(404).json({ valid: false, error: 'Table not found' });
  }
  if (!table.isActive) {
    return res.status(403).json({ valid: false, error: `${table.name} is currently inactive` });
  }
  if (!token || token !== table.securityToken) {
    return res.status(401).json({
      valid: false,
      error: `Security token mismatch. This QR code may have been regenerated. Please scan the current acrylic stand.`,
    });
  }
  res.json({ valid: true, table });
});

// Protected: Get all tables
app.get('/api/admin/tables', requireAdmin, (req, res) => {
  const tablesWithUrls = fallbackTables.map((t) => ({
    ...t,
    qrUrl: getTableQrUrl(req, t),
  }));
  res.json(tablesWithUrls);
});

// Protected: Add new table
app.post('/api/admin/tables', requireAdmin, (req: AuthRequest, res) => {
  const { name, number, area, capacity, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Table name is required' });

  const nextNum = number || fallbackTables.length + 1;
  const newTable: ServerTableInfo = {
    id: `tbl_${Date.now()}`,
    name: name.trim(),
    number: nextNum,
    area: area || 'Main Dining Hall',
    capacity: capacity || 4,
    securityToken: generateRandomSecurityToken(`t${nextNum}`),
    isActive: true,
    status: 'available',
    description: description || `Seating for ${capacity || 4} guests`,
    updatedAt: new Date().toISOString(),
  };

  fallbackTables.push(newTable);

  broadcastWs({
    type: 'TABLE_ADDED',
    table: newTable,
    message: `${newTable.name} registered.`,
  });

  res.status(201).json({
    ok: true,
    table: {
      ...newTable,
      qrUrl: getTableQrUrl(req, newTable),
    },
  });
});

// Protected: Rotate Table QR Security Token
app.post('/api/admin/tables/:id/rotate', requireAdmin, (req: AuthRequest, res) => {
  const { id } = req.params;
  const table = fallbackTables.find((t) => t.id === id);
  if (!table) {
    return res.status(404).json({ error: 'Table not found' });
  }

  const newToken = generateRandomSecurityToken(`t${table.number}`);
  table.securityToken = newToken;
  table.updatedAt = new Date().toISOString();

  const updatedWithUrl = {
    ...table,
    qrUrl: getTableQrUrl(req, table),
  };

  broadcastWs({
    type: 'TABLE_ROTATED',
    table: updatedWithUrl,
    message: `QR Security Token for ${table.name} has been rotated. Previous QR code invalidated.`,
    timestamp: new Date().toISOString(),
  });

  res.json({
    ok: true,
    table: updatedWithUrl,
    message: `New QR code generated for ${table.name}! Stale scans will now be rejected.`,
  });
});

// Protected: Rotate ALL Tables QR Security Tokens
app.post('/api/admin/tables/rotate-all', requireAdmin, (req: AuthRequest, res) => {
  const rotated = fallbackTables.map((table) => {
    table.securityToken = generateRandomSecurityToken(`t${table.number}`);
    table.updatedAt = new Date().toISOString();
    return {
      ...table,
      qrUrl: getTableQrUrl(req, table),
    };
  });

  broadcastWs({
    type: 'ALL_TABLES_ROTATED',
    tables: rotated,
    message: 'All restaurant table QR security tokens have been rotated.',
    timestamp: new Date().toISOString(),
  });

  res.json({
    ok: true,
    tables: rotated,
    message: `All ${rotated.length} table QR codes rotated successfully.`,
  });
});

// Protected: Toggle or Update Table
app.patch('/api/admin/tables/:id', requireAdmin, (req: AuthRequest, res) => {
  const { id } = req.params;
  const table = fallbackTables.find((t) => t.id === id);
  if (!table) return res.status(404).json({ error: 'Table not found' });

  Object.assign(table, req.body, { updatedAt: new Date().toISOString() });

  const updatedWithUrl = { ...table, qrUrl: getTableQrUrl(req, table) };
  broadcastWs({ type: 'TABLE_UPDATED', table: updatedWithUrl });
  res.json({ ok: true, table: updatedWithUrl });
});

// Protected: Delete Table
app.delete('/api/admin/tables/:id', requireAdmin, (req: AuthRequest, res) => {
  const { id } = req.params;
  const idx = fallbackTables.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Table not found' });

  const removed = fallbackTables.splice(idx, 1)[0];
  broadcastWs({ type: 'TABLE_DELETED', tableId: id });
  res.json({ ok: true, removed });
});

// ======================= RESTAURANT SETTINGS =======================
app.get('/api/settings', async (_req, res) => {
  try {
    const settings = await getRestaurantSettings();
    if (settings) return res.json(settings);
  } catch {}
  res.json(fallbackSettings);
});

// Protected: Update Restaurant Settings
app.put('/api/admin/settings', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const updated = await updateRestaurantSettings(req.body);
    if (updated) {
      fallbackSettings = { ...fallbackSettings, ...updated };
      return res.json(fallbackSettings);
    }
  } catch {}
  fallbackSettings = { ...fallbackSettings, ...req.body };
  res.json(fallbackSettings);
});

// Protected: Admin Analytics
app.get('/api/admin/analytics', requireAdmin, async (_req: AuthRequest, res) => {
  try {
    const analytics = await getAdminAnalytics();
    if (analytics) return res.json(analytics);
  } catch {}

  const totalOrders = fallbackOrders.length;
  const totalRevenue = fallbackOrders.reduce((acc, o) => acc + (o.grandTotal || 0), 0);
  const pendingOrders = fallbackOrders.filter((o) => o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled').length;
  const completedOrders = fallbackOrders.filter((o) => o.orderStatus === 'completed').length;
  const totalReservations = fallbackReservations.length;
  const confirmedReservations = fallbackReservations.filter((r) => r.status === 'confirmed' || r.status === 'seated').length;

  res.json({
    totalOrders,
    totalRevenue: Math.round(totalRevenue),
    pendingOrders,
    completedOrders,
    totalReservations,
    confirmedReservations,
    totalCustomers: registeredUsers.length + 15,
    avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 620,
  });
});

// ======================= ORDERS API WITH REALTIME WEBSOCKET PUSH =======================
app.get('/api/orders', async (req: AuthRequest, res) => {
  const department = req.query.department as string | undefined;
  const status = req.query.status as string | undefined;

  let allList = fallbackOrders;
  try {
    const ordersFromDb = await getAllOrders();
    if (ordersFromDb && ordersFromDb.length > 0) {
      allList = ordersFromDb;
    }
  } catch {}

  if (department === 'kitchen') {
    return res.json(
      allList.filter((o) =>
        ['placed', 'confirmed', 'cooking', 'ready_at_table', 'ready_for_dispatch'].includes(o.orderStatus)
      )
    );
  }

  if (department === 'waiter') {
    return res.json(
      allList.filter(
        (o) =>
          o.bookingType === 'dine_in' ||
          o.orderStatus === 'ready_at_table' ||
          o.orderStatus === 'ready_for_dispatch'
      )
    );
  }

  if (department === 'delivery') {
    return res.json(
      allList.filter(
        (o) =>
          o.bookingType === 'delivery' &&
          ['ready_for_dispatch', 'out_for_delivery', 'completed'].includes(o.orderStatus)
      )
    );
  }

  if (department === 'booking_menu') {
    return res.json(allList.filter((o) => o.bookingType === 'dine_in'));
  }

  if (status && status !== 'all') {
    return res.json(allList.filter((o) => o.orderStatus === status));
  }
  res.json(allList);
});

// Punch order from dining floor (Waiter)
app.post('/api/waiter/feed-order', async (req, res) => {
  const { tableNumber, items, customerName, customerPhone, notes, waiterName } = req.body;
  if (!tableNumber || !items || !items.length) {
    return res.status(400).json({ error: 'Table number and items are required' });
  }

  const subtotal = items.reduce((sum: number, it: any) => sum + (it.itemTotal || it.unitPrice * it.quantity), 0);
  const gstAmount = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = Math.round((subtotal + gstAmount) * 100) / 100;

  const orderNum = `MAH-${Math.floor(100000 + Math.random() * 900000)}`;
  const newOrder = {
    id: `ord_${Date.now()}`,
    orderNumber: orderNum,
    userId: 'waiter_punch',
    customerName: customerName || `Table ${tableNumber} Guest`,
    customerPhone: customerPhone || '+91 98000 00000',
    bookingType: 'dine_in',
    tableNumber,
    items,
    subtotal,
    gstAmount,
    deliveryFee: 0,
    discountAmount: 0,
    grandTotal,
    paymentMethod: 'pay_at_counter',
    paymentStatus: 'pending',
    orderStatus: 'placed',
    notes: notes || `Order punched by ${waiterName || 'Floor Waiter'}`,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    estimatedDeliveryMinutes: 15,
  };

  fallbackOrders.unshift(newOrder);

  try {
    await createOrder(newOrder);
  } catch {}

  broadcastWs({
    type: 'NEW_ORDER',
    order: newOrder,
    message: `New Order #${newOrder.orderNumber} placed for ${newOrder.tableNumber || 'Dine-In'}!`,
    timestamp: new Date().toISOString(),
  });

  res.status(201).json({
    ok: true,
    order: newOrder,
    message: `Order #${orderNum} punched for Table ${tableNumber} and dispatched to kitchen!`,
  });
});

// Place customer order (from QR Table Scan / Web Menu)
app.post('/api/orders', async (req, res) => {
  const newOrder = {
    ...req.body,
    id: req.body.id || `ord_${Date.now()}`,
    orderNumber: req.body.orderNumber || `MAH-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: req.body.createdAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  fallbackOrders.unshift(newOrder);

  try {
    await createOrder(newOrder);
  } catch {}

  broadcastWs({
    type: 'NEW_ORDER',
    order: newOrder,
    message: `Incoming Order #${newOrder.orderNumber} (${newOrder.bookingType === 'dine_in' ? newOrder.tableNumber || 'Table' : 'Takeaway/Delivery'})`,
    timestamp: new Date().toISOString(),
  });

  res.status(201).json(newOrder);
});

// Clear all orders (removes fake/sample/completed orders)
app.delete('/api/orders', async (_req, res) => {
  fallbackOrders.length = 0;
  try {
    await clearAllOrdersDb();
  } catch (err) {
    console.warn('DB clear warning:', err);
  }
  broadcastWs({
    type: 'ORDERS_CLEARED',
    message: 'All orders have been cleared.',
    timestamp: new Date().toISOString(),
  });
  res.json({ ok: true, message: 'All orders cleared successfully' });
});

app.post('/api/orders/clear', async (_req, res) => {
  fallbackOrders.length = 0;
  try {
    await clearAllOrdersDb();
  } catch (err) {
    console.warn('DB clear warning:', err);
  }
  broadcastWs({
    type: 'ORDERS_CLEARED',
    message: 'All orders have been cleared.',
    timestamp: new Date().toISOString(),
  });
  res.json({ ok: true, message: 'All orders cleared successfully' });
});

app.patch('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  try {
    await updateOrderStatus(id, status);
  } catch {}

  const order = fallbackOrders.find((o) => o.id === id);
  if (order) {
    order.orderStatus = status;
    broadcastWs({
      type: 'ORDER_UPDATED',
      order,
      timestamp: new Date().toISOString(),
    });
    return res.json(order);
  }

  broadcastWs({
    type: 'ORDER_UPDATED',
    order: { id, orderStatus: status },
    timestamp: new Date().toISOString(),
  });
  res.json({ id, orderStatus: status });
});

app.post('/api/orders/:id/prepare', async (req, res) => {
  const { id } = req.params;
  const { chefName } = req.body;

  const order = fallbackOrders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const nextStatus = order.bookingType === 'dine_in' ? 'ready_at_table' : 'ready_for_dispatch';
  order.orderStatus = nextStatus;
  order.preparedByChef = chefName || 'Executive Chef';
  order.preparedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  try {
    await updateOrderStatus(id, nextStatus);
  } catch {}

  broadcastWs({
    type: 'ORDER_UPDATED',
    order,
    timestamp: new Date().toISOString(),
  });

  res.json({
    ok: true,
    order,
    message:
      order.bookingType === 'dine_in'
        ? `Order #${order.orderNumber} prepared! Waiter alerted for Table ${order.tableNumber || 'Dine-in'}.`
        : `Order #${order.orderNumber} prepared! Delivery boy alerted for dispatch.`,
  });
});

app.post('/api/orders/:id/serve', async (req, res) => {
  const { id } = req.params;
  const { waiterName } = req.body;

  const order = fallbackOrders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.orderStatus = 'completed';
  order.servedByWaiter = waiterName || 'Floor Captain';
  order.servedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  try {
    await updateOrderStatus(id, 'completed');
  } catch {}

  broadcastWs({
    type: 'ORDER_UPDATED',
    order,
    timestamp: new Date().toISOString(),
  });

  res.json({
    ok: true,
    order,
    message: `Table ${order.tableNumber || ''} served! Order completed.`,
  });
});

app.post('/api/orders/:id/handover-delivery', async (req, res) => {
  const { id } = req.params;
  const { riderName } = req.body;

  const order = fallbackOrders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.orderStatus = 'out_for_delivery';
  order.assignedRider = riderName || 'Express Fleet Rider';

  try {
    await updateOrderStatus(id, 'out_for_delivery');
  } catch {}

  broadcastWs({
    type: 'ORDER_UPDATED',
    order,
    timestamp: new Date().toISOString(),
  });

  res.json({
    ok: true,
    order,
    message: `Order #${order.orderNumber} handed to ${order.assignedRider}! Out for delivery.`,
  });
});

app.post('/api/orders/:id/deliver', async (req, res) => {
  const { id } = req.params;
  const order = fallbackOrders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.orderStatus = 'completed';
  order.paymentStatus = 'paid';
  order.deliveredAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  try {
    await updateOrderStatus(id, 'completed');
  } catch {}

  broadcastWs({
    type: 'ORDER_UPDATED',
    order,
    timestamp: new Date().toISOString(),
  });

  res.json({
    ok: true,
    order,
    message: `Order #${order.orderNumber} delivered successfully to ${order.customerName || 'customer'}!`,
  });
});

// ======================= RESERVATIONS API =======================
app.get('/api/reservations', async (_req, res) => {
  try {
    const all = await getAllReservations();
    if (all && all.length > 0) return res.json(all);
  } catch {}
  res.json(fallbackReservations);
});

app.post('/api/reservations', async (req, res) => {
  const newRes = {
    ...req.body,
    id: req.body.id || `res_${Date.now()}`,
    status: req.body.status || 'confirmed',
    createdAt: req.body.createdAt || new Date().toLocaleTimeString(),
  };
  fallbackReservations.unshift(newRes);

  try {
    await createReservation(newRes);
  } catch {}

  broadcastWs({
    type: 'RESERVATION_CREATED',
    reservation: newRes,
    timestamp: new Date().toISOString(),
  });

  res.status(201).json(newRes);
});

app.patch('/api/reservations/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await updateReservationStatus(id, status);
  } catch {}

  const resItem = fallbackReservations.find((r) => r.id === id);
  if (resItem) {
    resItem.status = status;
    broadcastWs({
      type: 'RESERVATION_UPDATED',
      reservation: resItem,
      timestamp: new Date().toISOString(),
    });
    return res.json(resItem);
  }
  res.json({ id, status });
});

// ======================= FRONTEND SERVING & START =======================
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (${isProd ? 'production' : 'development'})`);
    console.log(`WebSocket server mounted on ws://0.0.0.0:${PORT}/ws`);
  });
}

startServer();
