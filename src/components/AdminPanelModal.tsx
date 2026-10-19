import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  X,
  UtensilsCrossed,
  Calendar,
  Settings,
  TrendingUp,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Flame,
  Search,
  Filter,
  Users,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Sparkles,
  Tag,
  MessageSquare,
  PartyPopper,
  Check,
  Bell,
  Eye,
  Lock,
  Phone,
  Receipt,
  KeyRound,
  ChefHat,
  Compass,
  ArrowRight,
  Store,
  LayoutGrid,
  ChevronRight,
  Layers,
  SlidersHorizontal,
  ArrowLeft,
  Bike,
  QrCode,
  Key,
  Copy,
} from 'lucide-react';
import QRCode from 'qrcode';
import { isAdminUser, verifyAdminPin, ADMIN_EMAILS } from '../utils/authHelper';
import {
  Order,
  TableBookingDetails,
  UserProfile,
  MenuItem,
  CateringInquiry,
  DiningTable,
  HotelTableInfo,
  PromoCoupon,
  UserRole,
  SpiceLevel,
  CartItem,
  DepartmentType,
} from '../types/restaurant';
import { INITIAL_MENU_ITEMS } from '../data/menuData';
import { PalaceLogo } from './PalaceLogo';
import { WaiterDesk } from './WaiterDesk';
import { DeliveryFleetDesk } from './DeliveryFleetDesk';
import { StaffDepartmentPortal } from './StaffDepartmentPortal';
import { updateStaffDepartmentInSupabase } from '../services/supabaseService';
import {
  getLocalRegisteredTables,
  fetchAllRegisteredTables,
  addNewTable,
  removeTable,
  toggleTableActive,
  regenerateTableSecurityToken,
  buildTableQrUrl,
} from '../services/tableService';
import { db } from '../services/firebase';
import { doc, setDoc, collection, onSnapshot } from 'firebase/firestore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
}

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  totalReservations: number;
  confirmedReservations: number;
  totalCustomers: number;
  avgOrderValue: number;
}

// Initial Floor Tables Data
const INITIAL_TABLES: DiningTable[] = [
  { id: 't1', tableNumber: 'Table 1', capacity: 2, area: 'Royal Courtyard', status: 'available' },
  { id: 't2', tableNumber: 'Table 2', capacity: 4, area: 'Royal Courtyard', status: 'occupied', currentGuestName: 'Aditya V.', occupiedSince: '25m ago' },
  { id: 't3', tableNumber: 'Table 3', capacity: 4, area: 'Royal Courtyard', status: 'reserved', currentGuestName: 'Kapoor Family', occupiedSince: '08:00 PM' },
  { id: 't4', tableNumber: 'Table 4', capacity: 6, area: 'Main Dining Hall', status: 'available' },
  { id: 't5', tableNumber: 'Table 5', capacity: 4, area: 'Main Dining Hall', status: 'occupied', currentGuestName: 'Mehta Corp', occupiedSince: '40m ago' },
  { id: 't6', tableNumber: 'Table 6', capacity: 2, area: 'Main Dining Hall', status: 'cleaning' },
  { id: 't7', tableNumber: 'Table 7', capacity: 8, area: 'Maharaja Baithak', status: 'occupied', currentGuestName: 'Singhania Royals', occupiedSince: '1h 10m ago' },
  { id: 't8', tableNumber: 'Table 8', capacity: 8, area: 'Maharaja Baithak', status: 'reserved', currentGuestName: 'Sharma Wedding Party', occupiedSince: '08:30 PM' },
  { id: 't9', tableNumber: 'Table 9', capacity: 4, area: 'Rooftop Terrace', status: 'available' },
  { id: 't10', tableNumber: 'Table 10', capacity: 4, area: 'Rooftop Terrace', status: 'available' },
  { id: 't11', tableNumber: 'Table 11', capacity: 6, area: 'Rooftop Terrace', status: 'occupied', currentGuestName: 'Dr. Bansal', occupiedSince: '15m ago' },
  { id: 't12', tableNumber: 'Table 12', capacity: 2, area: 'Rooftop Terrace', status: 'cleaning' },
];

// Initial Catering Inquiries
const INITIAL_CATERING: CateringInquiry[] = [
  {
    id: 'cat_1',
    name: 'Rajesh Singhania',
    phone: '+91 98101 88992',
    email: 'singhania.r@corp.in',
    eventType: 'Silver Jubilee Wedding Anniversary',
    eventDate: '2026-11-20',
    guestCount: 180,
    budgetRange: '₹3,00,000 – ₹4,50,000',
    specialRequirements: 'Full Silver Thali live service, Kesariya Jalebi & Rabri live counter, Satvik Jain food for 40 guests.',
    status: 'quoted',
    quotedAmount: 375000,
    createdAt: 'Yesterday, 04:30 PM',
  },
  {
    id: 'cat_2',
    name: 'Pooja Agarwal',
    phone: '+91 98114 55221',
    email: 'pooja.agarwal@gmail.com',
    eventType: 'Corporate Annual Gala Dinner',
    eventDate: '2026-11-05',
    guestCount: 220,
    budgetRange: '₹4,00,000 – ₹5,50,000',
    specialRequirements: 'Live Tandoor skewers, mocktail botanical coolers bar, Awadhi Dum Biryani live deg.',
    status: 'new',
    createdAt: 'Today, 11:15 AM',
  },
  {
    id: 'cat_3',
    name: 'Col. Vikram Rathore',
    phone: '+91 98711 44330',
    email: 'vikram.rathore@outlook.com',
    eventType: 'Retirement Celebration Banquet',
    eventDate: '2026-10-28',
    guestCount: 75,
    budgetRange: '₹1,50,000 – ₹2,00,000',
    specialRequirements: 'Courtyard Baithak reserved with live sitar maestro.',
    status: 'confirmed',
    quotedAmount: 185000,
    createdAt: '3 days ago',
  },
];

// Initial Coupons
const INITIAL_COUPONS: PromoCoupon[] = [
  {
    id: 'c1',
    code: 'SHANKAR20',
    description: '20% off on all royal food orders above ₹600',
    discountPercent: 20,
    minOrderValue: 600,
    maxDiscount: 250,
    isActive: true,
  },
  {
    id: 'c2',
    code: 'TASTE50',
    description: 'Flat ₹50 off on first order',
    discountFlat: 50,
    minOrderValue: 350,
    isActive: true,
  },
  {
    id: 'c3',
    code: 'ROYAL100',
    description: 'Flat ₹100 off on Grand Thalis & Biryanis',
    discountFlat: 100,
    minOrderValue: 800,
    isActive: true,
  },
  {
    id: 'c4',
    code: 'FESTIVE15',
    description: '15% festive discount for loyal patrons',
    discountPercent: 15,
    minOrderValue: 500,
    isActive: false,
  },
];



// Initial Staff Roster
export interface StaffMember {
  id: string;
  name: string;
  role: 'head_chef' | 'sous_chef' | 'floor_captain' | 'cashier' | 'rider_lead' | string;
  department: DepartmentType;
  station: string;
  phone: string;
  shiftStatus: 'on_shift' | 'off_duty';
  joinedDate: string;
  pin?: string;
}

const INITIAL_STAFF: StaffMember[] = [
  { id: 's1', name: 'Chef Ranveer', role: 'head_chef', department: 'kitchen', station: 'Tandoor & Dum Deg', phone: '+91 98110 11223', shiftStatus: 'on_shift', joinedDate: 'Jan 2026', pin: '1122' },
  { id: 's2', name: 'Chef Arvind Mathur', role: 'sous_chef', department: 'kitchen', station: 'Makhani & Gravies', phone: '+91 98114 44556', shiftStatus: 'on_shift', joinedDate: 'Feb 2026', pin: '1122' },
  { id: 's3', name: 'Ramesh Rawat', role: 'floor_captain', department: 'waiter', station: 'Courtyard & Baithak', phone: '+91 98711 77889', shiftStatus: 'on_shift', joinedDate: 'Feb 2026', pin: '3344' },
  { id: 's4', name: 'Suman Sharma', role: 'cashier', department: 'booking_menu', station: 'Reservations & Supply Desk', phone: '+91 99100 22334', shiftStatus: 'on_shift', joinedDate: 'Mar 2026', pin: '5566' },
  { id: 's5', name: 'Sunil Gurjar', role: 'rider_lead', department: 'delivery', station: 'Express Dispatch', phone: '+91 98101 99887', shiftStatus: 'on_shift', joinedDate: 'Mar 2026', pin: '7788' },
  { id: 's6', name: 'Tej Singh Saud', role: 'general_manager', department: 'manager', station: 'Executive Suite', phone: '+91 98100 00001', shiftStatus: 'on_shift', joinedDate: 'Jan 2026', pin: '2026' },
];
// Department definitions enforcing strict access boundaries
export interface DepartmentInfo {
  id: DepartmentType;
  nameEn: string;
  nameHi: string;
  shortNameEn: string;
  shortNameHi: string;
  roleTitle: string;
  staffName: string;
  pin: string;
  icon: any;
  color: string;
  badgeBg: string;
  descriptionEn: string;
  descriptionHi: string;
  allowedTabs: Array<'kds' | 'waiter' | 'tables' | 'reservations' | 'menu' | 'delivery' | 'catering' | 'coupons' | 'staff' | 'settings' | 'analytics'>;
  defaultTab: 'kds' | 'waiter' | 'tables' | 'reservations' | 'menu' | 'delivery';
}

export const DEPARTMENTS_LIST: DepartmentInfo[] = [
  {
    id: 'manager',
    nameEn: 'General Manager (Full Access)',
    nameHi: 'जनरल मैनेजर (पूर्ण अधिकार)',
    shortNameEn: 'GM Console',
    shortNameHi: 'मैनेजर',
    roleTitle: 'General Manager',
    staffName: 'Tej Singh Saud (GM)',
    pin: '2026',
    icon: ShieldCheck,
    color: 'text-amber-300',
    badgeBg: 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold border-amber-300',
    descriptionEn: 'Full access to all 4 departments, live pipeline, analytics, staff & settings',
    descriptionHi: 'सभी विभागों, लाइव ऑर्डर, बिक्री रिपोर्ट, कर्मचारी व सेटिंग्स पर पूरा नियंत्रण',
    allowedTabs: ['kds', 'waiter', 'tables', 'reservations', 'menu', 'delivery', 'catering', 'coupons', 'staff', 'settings', 'analytics'],
    defaultTab: 'kds',
  },
  {
    id: 'kitchen',
    nameEn: 'Kitchen Department (Chef)',
    nameHi: 'रसोई विभाग (हेड शेफ)',
    shortNameEn: 'Kitchen KDS',
    shortNameHi: 'रसोई',
    roleTitle: 'Executive Chef',
    staffName: 'Chef Ranveer (Master Kitchen)',
    pin: '1122',
    icon: Flame,
    color: 'text-orange-400',
    badgeBg: 'bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 font-bold border-orange-400',
    descriptionEn: 'Kitchen orders, cooking pipeline, plate preparation & waiter alerts only',
    descriptionHi: 'केवल रसोई आदेश, खाना पकाना व तैयार कर वेटर को सूचना भेजना',
    allowedTabs: ['kds'],
    defaultTab: 'kds',
  },
  {
    id: 'waiter',
    nameEn: 'Waiter Department (Floor Captain)',
    nameHi: 'वेटर विभाग (फ्लोर कैप्टन)',
    shortNameEn: 'Waiter Desk',
    shortNameHi: 'वेटर डेस्क',
    roleTitle: 'Floor Captain & Waiters',
    staffName: 'Ramesh (Floor Captain & Waiter)',
    pin: '3344',
    icon: UtensilsCrossed,
    color: 'text-emerald-400',
    badgeBg: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-stone-950 font-bold border-emerald-300',
    descriptionEn: 'Punch/feed dining orders, receive food ready alerts, serve tables & rider handover',
    descriptionHi: 'टेबल आर्डर पंच करना, रसोई से तैयार खाने का अलर्ट, टेबल पर परोसना व पार्सल देना',
    allowedTabs: ['waiter'],
    defaultTab: 'waiter',
  },
  {
    id: 'booking_menu',
    nameEn: 'Bookings & Menu Supply Managing',
    nameHi: 'बुकिंग व मेन्यू आपूर्ति विभाग',
    shortNameEn: 'Booking & Menu',
    shortNameHi: 'बुकिंग व मेन्यू',
    roleTitle: 'Reservations & Supply Manager',
    staffName: 'Suman (Reservations & Menu Desk)',
    pin: '5566',
    icon: Calendar,
    color: 'text-blue-400',
    badgeBg: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold border-blue-400',
    descriptionEn: 'Dining table bookings/reservations & menu catalog stock availability and price editing',
    descriptionHi: 'टेबल आरक्षण/बुकिंग देखना, नए मेहमान सीट करना व मेन्यू सामग्री/स्टॉक मूल्य एडिट करना',
    allowedTabs: ['reservations', 'menu'],
    defaultTab: 'reservations',
  },
  {
    id: 'delivery',
    nameEn: 'Delivery Boy Section (Fleet Rider)',
    nameHi: 'डिलीवरी बॉय सेक्शन (राइडर)',
    shortNameEn: 'Delivery Fleet',
    shortNameHi: 'डिलीवरी राइडर',
    roleTitle: 'Express Fleet Rider',
    staffName: 'Sunil Gurjar (Fleet Rider)',
    pin: '7788',
    icon: Bike,
    color: 'text-purple-400',
    badgeBg: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold border-purple-400',
    descriptionEn: 'Dashboard of delivery orders, dispatch handover, customer address & cash collection',
    descriptionHi: 'डिलीवरी पार्सल प्राप्त करना, ग्राहक तक पहुँचाना व नकद/ऑनलाइन भुगतान संग्रह',
    allowedTabs: ['delivery'],
    defaultTab: 'delivery',
  },
];

// Audio chime for smooth inter-department food ready notifications
function playKitchenChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.7);
  } catch {}
}

export const AdminPanelModal: React.FC<Props> = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<
    'kds' | 'waiter' | 'menu' | 'tables' | 'reservations' | 'delivery' | 'catering' | 'coupons' | 'staff' | 'settings' | 'analytics'
  >('kds');

  // Department state (Strict role isolation)
  const [currentDepartment, setCurrentDepartment] = useState<DepartmentType>('manager');
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [selectedStaffPortal, setSelectedStaffPortal] = useState<StaffMember | null>(null);

  // Active department metadata
  const activeDeptInfo = useMemo(() => {
    return DEPARTMENTS_LIST.find((d) => d.id === currentDepartment) || DEPARTMENTS_LIST[0];
  }, [currentDepartment]);

  // Strict enforcement: ensure activeTab is always within the department's allowed tabs
  useEffect(() => {
    if (!activeDeptInfo.allowedTabs.includes(activeTab as any)) {
      setActiveTab(activeDeptInfo.defaultTab);
    }
  }, [currentDepartment, activeDeptInfo, activeTab]);

  const handleAssignStaffDepartment = async (staffId: string, dept: DepartmentType) => {
    const updated = staff.map((s) => (s.id === staffId ? { ...s, department: dept } : s));
    setStaff(updated);
    saveStaffToStorage(updated);
    try {
      await updateStaffDepartmentInSupabase(staffId, dept);
    } catch {}
    const member = updated.find((s) => s.id === staffId);
    showNotification(
      lang === 'hi'
        ? `✅ ${member?.name} को ${dept} विभाग में नियुक्त किया गया!`
        : `✅ ${member?.name} assigned to ${dept.toUpperCase()} department!`
    );
  };

  // Manager Operations "More" choice modal prompt state
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [previousTab, setPreviousTab] = useState<'kds' | 'tables' | 'reservations' | 'menu' | 'waiter' | 'delivery'>('kds');

  // Lock background body scroll while Admin Panel is open to prevent double scrollbars
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Language state: Hindi (default) / English
  const [lang, setLang] = useState<'hi' | 'en'>('hi');

  // Department role & access state
  const [currentRole, setCurrentRole] = useState<UserRole>((user.role as UserRole) || 'admin');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(true);

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<TableBookingDetails[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const stored = localStorage.getItem('shankar_admin_menu');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_MENU_ITEMS;
  });
  const [diningTables, setDiningTables] = useState<DiningTable[]>(() => {
    try {
      const stored = localStorage.getItem('shankar_admin_tables');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_TABLES;
  });

  // Registered Tables with Rotating QR Security Tokens & Stand Printing
  const [tableSubTab, setTableSubTab] = useState<'occupancy' | 'qr_stands'>('occupancy');
  const [registeredTables, setRegisteredTables] = useState<HotelTableInfo[]>(() => getLocalRegisteredTables());
  const [tableQrDataUrls, setTableQrDataUrls] = useState<Record<string, string>>({});
  const [printingTable, setPrintingTable] = useState<HotelTableInfo | null>(null);
  const [printAllStands, setPrintAllStands] = useState(false);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableArea, setNewTableArea] = useState('Window Gallery');
  const [newTableCapacity, setNewTableCapacity] = useState(4);
  const [newTableDesc, setNewTableDesc] = useState('');

  // Sync registered tables from tableService / Firestore
  useEffect(() => {
    const loadRegTables = async () => {
      const list = await fetchAllRegisteredTables();
      setRegisteredTables(list);
    };
    loadRegTables();
    const handleTablesUpdated = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail) {
        setRegisteredTables(custom.detail);
      }
    };
    window.addEventListener('maheswari_tables_updated', handleTablesUpdated);
    return () => {
      window.removeEventListener('maheswari_tables_updated', handleTablesUpdated);
    };
  }, []);

  // Generate QR code data URLs for registered tables
  useEffect(() => {
    let isCancelled = false;
    const generateAll = async () => {
      const map: Record<string, string> = {};
      for (const t of registeredTables) {
        try {
          const url = buildTableQrUrl(t);
          const dataUrl = await QRCode.toDataURL(url, {
            width: 300,
            margin: 1.5,
            color: { dark: '#1c1917', light: '#ffffff' },
          });
          map[t.id] = dataUrl;
        } catch {}
      }
      if (!isCancelled) {
        setTableQrDataUrls(map);
      }
    };
    generateAll();
    return () => {
      isCancelled = true;
    };
  }, [registeredTables]);
  const [cateringInquiries, setCateringInquiries] = useState<CateringInquiry[]>(() => {
    try {
      const stored = localStorage.getItem('shankar_admin_catering');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_CATERING;
  });
  const [coupons, setCoupons] = useState<PromoCoupon[]>(() => {
    try {
      const stored = localStorage.getItem('shankar_admin_coupons');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_COUPONS;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    try {
      const stored = localStorage.getItem('shankar_admin_staff');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_STAFF;
  });

  // Settings state
  const [settings, setSettings] = useState({
    isKitchenAcceptingOrders: true,
    estimatedDeliveryMinutes: 25,
    announcementBanner: 'Grand Opening 2026: Fresh Charcoal Tandoor & Royal Desi Ghee Curries Live!',
    minOrderValue: 200,
    deliveryFee: 40,
    freeDeliveryThreshold: 500,
    gstPercent: 5,
  });

  // UI helpers
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderDiningFilter, setOrderDiningFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modals inside Admin
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [seatingTableModal, setSeatingTableModal] = useState<DiningTable | null>(null);
  const [walkinGuestName, setWalkinGuestName] = useState('');
  const [walkinPartySize, setWalkinPartySize] = useState('2');


  // Dish Form State
  const [dishForm, setDishForm] = useState<Partial<MenuItem>>({
    name: '',
    hindiName: '',
    category: 'curries',
    menuSection: 'all_day',
    description: '',
    price: 350,
    halfPrice: 220,
    dietary: 'veg',
    spiceLevel: 1,
    isBestseller: false,
    isChefSpecial: false,
    isAvailable: true,
    prepTimeMinutes: 15,
    image: '/src/assets/images/dish_butter_chicken_curry_1792103747214.webp',
  });

  // Coupon Form State
  const [couponForm, setCouponForm] = useState<Partial<PromoCoupon>>({
    code: '',
    description: '',
    discountPercent: 15,
    discountFlat: 0,
    minOrderValue: 500,
    maxDiscount: 200,
    isActive: true,
  });

  // Staff Form State
  const [staffForm, setStaffForm] = useState<Partial<StaffMember>>({
    name: '',
    role: 'sous_chef',
    station: 'Main Kitchen',
    phone: '+91 98110 00000',
    shiftStatus: 'on_shift',
  });

  // Sync unlock state with user
  useEffect(() => {
    if (isAdminUser(user)) {
      setIsUnlocked(true);
    }
  }, [user]);

  // Notification helper
  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Sync menu & storage
  const saveMenuToStorage = (items: MenuItem[]) => {
    setMenuItems(items);
    try {
      localStorage.setItem('shankar_admin_menu', JSON.stringify(items));
    } catch {}
  };

  const saveTablesToStorage = (tables: DiningTable[]) => {
    setDiningTables(tables);
    try {
      localStorage.setItem('shankar_admin_tables', JSON.stringify(tables));
    } catch {}
  };

  const saveCateringToStorage = (inquiries: CateringInquiry[]) => {
    setCateringInquiries(inquiries);
    try {
      localStorage.setItem('shankar_admin_catering', JSON.stringify(inquiries));
    } catch {}
  };

  const saveCouponsToStorage = (c: PromoCoupon[]) => {
    setCoupons(c);
    try {
      localStorage.setItem('shankar_admin_coupons', JSON.stringify(c));
    } catch {}
  };

  const saveStaffToStorage = (s: StaffMember[]) => {
    setStaff(s);
    try {
      localStorage.setItem('shankar_admin_staff', JSON.stringify(s));
    } catch {}
  };

  // Filter out any fake/sample example orders
  const isRealOrder = (o: Order) => {
    if (!o) return false;
    const isMock =
      (o as any).isSample === true ||
      (o as any).isFake === true ||
      o.id?.includes('fake') ||
      o.id?.includes('demo') ||
      o.id?.includes('sample') ||
      o.orderNumber?.includes('DEMO') ||
      o.orderNumber?.includes('SAMPLE');
    return !isMock;
  };

  // Fetch live orders & reservations
  const fetchAdminData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Orders
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        if (Array.isArray(data)) {
          const realOrders = data.filter(isRealOrder);
          setOrders(realOrders);
        } else {
          loadOrdersFromLocal();
        }
      } else {
        loadOrdersFromLocal();
      }

      // 2. Fetch Reservations
      const resRes = await fetch('/api/reservations');
      if (resRes.ok) {
        const data = await resRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setReservations(data);
        } else {
          loadReservationsFromLocal();
        }
      } else {
        loadReservationsFromLocal();
      }

      // 3. Fetch Settings
      const settingsRes = await fetch('/api/settings');
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        if (data && typeof data === 'object') {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      }
    } catch {
      loadOrdersFromLocal();
      loadReservationsFromLocal();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadOrdersFromLocal = () => {
    try {
      const raw = localStorage.getItem('shankar_orders');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const realOrders = parsed.filter(isRealOrder);
          setOrders(realOrders);
          if (realOrders.length !== parsed.length) {
            localStorage.setItem('shankar_orders', JSON.stringify(realOrders));
          }
          return;
        }
      }
    } catch {}

    // Clean start - no fake sample orders
    setOrders([]);
  };

  // Clear all example/sample and previous orders
  const handleClearAllOrders = async () => {
    const confirmPrompt =
      lang === 'hi'
        ? 'क्या आप सभी उदाहरण/पुराने ऑर्डर हटाना चाहते हैं? सूची पूरी तरह खाली हो जाएगी।'
        : 'Clear all example and test orders? The list will be completely reset.';
    if (!window.confirm(confirmPrompt)) return;

    try {
      await fetch('/api/orders', { method: 'DELETE' });
    } catch (e) {
      console.warn('Clear orders API call:', e);
    }

    setOrders([]);
    try {
      localStorage.removeItem('shankar_orders');
    } catch {}

    showNotification(
      lang === 'hi'
        ? '✅ सभी उदाहरण व टेस्ट ऑर्डर हटा दिए गए हैं!'
        : '✅ All example & test orders have been cleared!'
    );
  };

  const loadReservationsFromLocal = () => {
    try {
      const raw = localStorage.getItem('shankar_reservations');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReservations(parsed);
          return;
        }
      }
    } catch {}

    setReservations([
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
      {
        id: 'res_103',
        bookingNumber: 'RES-4893',
        guestName: 'Anil Kapoor',
        guestPhone: '+91 99100 11223',
        guestEmail: 'kapoor.anil@gmail.com',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        timeSlot: '01:30 PM (Lunch)',
        guestsCount: 8,
        seatingArea: 'Main Dining Hall',
        specialRequests: 'Maharaja Thali feast booking',
        status: 'confirmed',
        createdAt: '03:10 PM',
      },
    ]);
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();

      // Listen to Firestore real-time updates for orders pipeline
      let unsub: (() => void) | null = null;
      try {
        unsub = onSnapshot(
          collection(db, 'orders'),
          (snapshot) => {
            if (!snapshot.empty) {
              const liveOrders: Order[] = [];
              snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                liveOrders.push({ id: docSnap.id, ...data } as Order);
              });
              if (liveOrders.length > 0) {
                setOrders(liveOrders);
                const hasReady = liveOrders.some(
                  (o) =>
                    o.orderStatus === 'ready_at_table' ||
                    (o.bookingType === 'dine_in' && o.orderStatus === 'out_for_delivery') ||
                    o.orderStatus === 'ready_for_dispatch'
                );
                if (hasReady) {
                  playKitchenChime();
                }
              }
            }
          },
          (err) => {
            console.warn('Firestore real-time orders notice:', err);
          }
        );
      } catch (err) {
        console.warn('Firestore listener setup notice:', err);
      }

      return () => {
        if (unsub) unsub();
      };
    }
  }, [isOpen, fetchAdminData]);

  // Unlock handlers for 4 departments + delivery boy
  const handlePinUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();
    const match = DEPARTMENTS_LIST.find((d) => d.pin === cleanPin);

    if (match) {
      setCurrentDepartment(match.id);
      setActiveTab(match.defaultTab);
      setIsUnlocked(true);
      setPinError('');
      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          isLoggedIn: true,
          role: match.id as UserRole,
          name: match.staffName,
          department: match.id,
        });
      }
      showNotification(`✅ Access Granted: ${lang === 'hi' ? match.nameHi : match.nameEn}`);
    } else if (cleanPin === '9900' || cleanPin === '1234') {
      setCurrentDepartment('manager');
      setActiveTab('kds');
      setIsUnlocked(true);
      setPinError('');
      showNotification('✅ Master Console Unlocked: Access Granted');
    } else {
      setPinError(
        lang === 'hi'
          ? 'अमान्य पिन! मैनेजर (2026), रसोई (1122), वेटर (3344), बुकिंग/मेन्यू (5566), डिलीवरी (7788) का प्रयोग करें।'
          : 'Invalid Passkey! Use Manager (2026), Kitchen (1122), Waiter (3344), Booking/Menu (5566), or Delivery (7788).'
      );
    }
  };

  const handleSelectDepartment = (deptId: DepartmentType) => {
    const dept = DEPARTMENTS_LIST.find((d) => d.id === deptId) || DEPARTMENTS_LIST[0];
    setCurrentDepartment(deptId);
    setActiveTab(dept.defaultTab);
    setIsUnlocked(true);
    setPinError('');
    setIsDeptModalOpen(false);
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        isLoggedIn: true,
        role: deptId as UserRole,
        name: dept.staffName,
        department: deptId,
      });
    }
    showNotification(
      lang === 'hi'
        ? `🏢 विभाग बदला गया: ${dept.nameHi}`
        : `🏢 Department Switched: ${dept.nameEn}`
    );
  };

  const handleInstantUnlockAsOwner = () => {
    setCurrentDepartment('manager');
    setActiveTab('kds');
    setIsUnlocked(true);
    setPinError('');
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        isLoggedIn: true,
        role: 'admin',
        name: 'General Manager (Owner)',
        email: 'militarynp280@gmail.com',
      });
    }
    showNotification('👑 Authenticated as Hotel Owner & General Manager');
  };

  // 1. Chef in Kitchen marks order as prepared/ready
  const handleChefMarkPrepared = async (order: Order) => {
    const nextStatus: Order['orderStatus'] = order.bookingType === 'dine_in' ? 'ready_at_table' : 'ready_for_dispatch';
    const preparedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const chefName = 'Chef Ranveer';

    const updated = orders.map((o) =>
      o.id === order.id
        ? {
            ...o,
            orderStatus: nextStatus,
            preparedByChef: chefName,
            preparedAt: preparedTime,
          }
        : o
    );
    setOrders(updated);
    playKitchenChime();

    try {
      localStorage.setItem('shankar_orders', JSON.stringify(updated));
      const orderRef = doc(db, 'orders', order.id);
      await setDoc(orderRef, { orderStatus: nextStatus, preparedByChef: chefName, preparedAt: preparedTime }, { merge: true });
    } catch {}

    try {
      await fetch(`/api/orders/${order.id}/prepare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chefName }),
      });
    } catch {}

    showNotification(
      order.bookingType === 'dine_in'
        ? (lang === 'hi'
            ? `🍽️ टेबल ${order.tableNumber || ''} का खाना तैयार है! वेटर को अलर्ट भेजा गया।`
            : `🍽️ Table ${order.tableNumber || ''} food prepared! Waiter alerted.`)
        : (lang === 'hi'
            ? `📦 ऑर्डर #${order.orderNumber} तैयार! डिलीवरी राइडर को अलर्ट भेजा गया।`
            : `📦 Order #${order.orderNumber} prepared! Delivery boy alerted for dispatch.`)
    );
  };

  // 2. Waiter marks table order as served
  const handleWaiterMarkServed = async (orderId: string) => {
    const servedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const waiterName = 'Ramesh (Floor Waiter)';
    const targetOrder = orders.find((o) => o.id === orderId);

    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            orderStatus: 'completed' as const,
            servedByWaiter: waiterName,
            servedAt: servedTime,
          }
        : o
    );
    setOrders(updated);

    try {
      localStorage.setItem('shankar_orders', JSON.stringify(updated));
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, { orderStatus: 'completed', servedByWaiter: waiterName, servedAt: servedTime }, { merge: true });
    } catch {}

    try {
      await fetch(`/api/orders/${orderId}/serve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waiterName }),
      });
    } catch {}

    showNotification(
      lang === 'hi'
        ? `✅ टेबल ${targetOrder?.tableNumber || ''} पर खाना परोस दिया गया!`
        : `✅ Table ${targetOrder?.tableNumber || ''} served! Order completed.`
    );
  };

  // 3. Waiter hands over delivery parcel to rider
  const handleWaiterHandoverDelivery = async (orderId: string) => {
    const riderName = 'Sunil Gurjar (Fleet Rider)';
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            orderStatus: 'out_for_delivery' as const,
            assignedRider: riderName,
          }
        : o
    );
    setOrders(updated);

    try {
      localStorage.setItem('shankar_orders', JSON.stringify(updated));
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, { orderStatus: 'out_for_delivery', assignedRider: riderName }, { merge: true });
    } catch {}

    try {
      await fetch(`/api/orders/${orderId}/handover-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riderName }),
      });
    } catch {}

    showNotification(
      lang === 'hi'
        ? `🛵 पार्सल डिलीवरी राइडर को सौंपा गया! रास्ते में (On Road)`
        : `🛵 Handed to ${riderName}! Order is out for delivery.`
    );
  };

  // 4. Delivery Rider marks delivered & payment collected
  const handleRiderCompleteDelivery = async (orderId: string) => {
    const deliveredTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetOrder = orders.find((o) => o.id === orderId);

    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            orderStatus: 'completed' as const,
            paymentStatus: 'paid' as const,
            deliveredAt: deliveredTime,
          }
        : o
    );
    setOrders(updated);

    try {
      localStorage.setItem('shankar_orders', JSON.stringify(updated));
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, { orderStatus: 'completed', paymentStatus: 'paid', deliveredAt: deliveredTime }, { merge: true });
    } catch {}

    try {
      await fetch(`/api/orders/${orderId}/deliver`, {
        method: 'POST',
      });
    } catch {}

    showNotification(
      lang === 'hi'
        ? `🎉 ऑर्डर #${targetOrder?.orderNumber || ''} सफलतापूर्वक डिलीवर हुआ व भुगतान प्राप्त किया!`
        : `🎉 Order #${targetOrder?.orderNumber || ''} delivered & payment collected!`
    );
  };

  const handleRiderStartDelivery = async (orderId: string) => {
    await handleWaiterHandoverDelivery(orderId);
  };

  // 5. Waiter punches new dine-in table order
  const handleWaiterPunchNewOrder = async (newOrderPartial: Partial<Order>) => {
    const orderId = `ord_${Date.now()}`;
    const fullOrder: Order = {
      id: orderId,
      orderNumber: newOrderPartial.orderNumber || `MAH-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: newOrderPartial.createdAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: newOrderPartial.customerName || 'Table Guest',
      customerPhone: newOrderPartial.customerPhone || '+91 98000 00000',
      bookingType: 'dine_in',
      tableNumber: newOrderPartial.tableNumber || 'Table 1',
      items: newOrderPartial.items || [],
      subtotal: newOrderPartial.subtotal || 0,
      gstAmount: newOrderPartial.gstAmount || 0,
      deliveryFee: 0,
      discountAmount: 0,
      grandTotal: newOrderPartial.grandTotal || 0,
      paymentMethod: 'pay_at_counter',
      paymentStatus: 'pending',
      orderStatus: 'placed',
      notes: newOrderPartial.notes,
      estimatedDeliveryMinutes: 15,
    };

    setOrders((prev) => [fullOrder, ...prev]);

    try {
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, fullOrder);
    } catch {}
  };

  // Status transitions
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: Order['orderStatus']) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, orderStatus: nextStatus } : o));
    setOrders(updated);
    try {
      localStorage.setItem('shankar_orders', JSON.stringify(updated));
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch {}
    showNotification(`Order #${orderId.slice(-6)} moved to ${nextStatus.toUpperCase().replace('_', ' ')}`);
  };

  const handleUpdateReservationStatus = (resId: string, status: TableBookingDetails['status'], tableNum?: string) => {
    const updated = reservations.map((r) =>
      r.id === resId ? { ...r, status, ...(tableNum ? { tableNumber: tableNum } : {}) } : r
    );
    setReservations(updated);
    try {
      localStorage.setItem('shankar_reservations', JSON.stringify(updated));
      fetch(`/api/reservations/${resId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }).catch(() => {});
    } catch {}
    showNotification(`Reservation marked as ${status?.toUpperCase()}`);
  };

  // Menu item CRUD
  const handleToggleDishAvailability = (dishId: string) => {
    const updated = menuItems.map((item) =>
      item.id === dishId ? { ...item, isAvailable: item.isAvailable === false ? true : false } : item
    );
    saveMenuToStorage(updated);
    const dish = updated.find((d) => d.id === dishId);
    showNotification(`${dish?.name} marked as ${dish?.isAvailable ? 'AVAILABLE (IN STOCK)' : 'SOLD OUT (86)'}`);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishForm.name?.trim() || !dishForm.price) {
      alert('Please provide dish name and price.');
      return;
    }

    if (editingDish) {
      const updated = menuItems.map((item) =>
        item.id === editingDish.id ? ({ ...item, ...dishForm } as MenuItem) : item
      );
      saveMenuToStorage(updated);
      showNotification(`Dish "${dishForm.name}" updated successfully.`);
      setEditingDish(null);
    } else {
      const newDish: MenuItem = {
        id: `dish_${Date.now()}`,
        name: dishForm.name.trim(),
        hindiName: dishForm.hindiName?.trim() || undefined,
        category: dishForm.category || 'curries',
        menuSection: dishForm.menuSection || 'all_day',
        description: dishForm.description?.trim() || 'Prepared with royal organic spices and pure desi ghee.',
        price: Number(dishForm.price),
        halfPrice: dishForm.halfPrice ? Number(dishForm.halfPrice) : undefined,
        dietary: dishForm.dietary || 'veg',
        spiceLevel: (dishForm.spiceLevel as SpiceLevel) || 1,
        isBestseller: !!dishForm.isBestseller,
        isChefSpecial: !!dishForm.isChefSpecial,
        isAvailable: dishForm.isAvailable !== false,
        prepTimeMinutes: Number(dishForm.prepTimeMinutes) || 15,
        rating: 4.9,
        reviewsCount: 12,
        image: dishForm.image || '/src/assets/images/dish_butter_chicken_curry_1792103747214.webp',
      };
      saveMenuToStorage([newDish, ...menuItems]);
      showNotification(`New dish "${newDish.name}" added to live menu.`);
      setIsAddDishOpen(false);
    }
  };

  const handleDeleteDish = (dishId: string) => {
    if (!confirm('Are you sure you want to remove this dish from the menu?')) return;
    const updated = menuItems.filter((item) => item.id !== dishId);
    saveMenuToStorage(updated);
    showNotification('Dish removed from menu.');
  };

  // Table management
  const handleUpdateTableStatus = (tableId: string, status: DiningTable['status'], guestName?: string) => {
    const updated = diningTables.map((t) =>
      t.id === tableId
        ? {
            ...t,
            status,
            currentGuestName: status === 'available' ? undefined : guestName || t.currentGuestName,
            occupiedSince: status === 'available' ? undefined : 'Just now',
          }
        : t
    );
    saveTablesToStorage(updated);
    showNotification(`Table status updated to ${status.toUpperCase()}`);
    setSeatingTableModal(null);
  };

  // Table QR and Security Token handlers
  const handleCreateNewTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    const created = await addNewTable({
      name: newTableName.trim(),
      area: newTableArea,
      capacity: Number(newTableCapacity),
      description: newTableDesc.trim(),
    });
    setIsAddTableOpen(false);
    setNewTableName('');
    setNewTableDesc('');
    showNotification(
      lang === 'hi'
        ? `✅ टेबल ${created.name} सुरक्षा टोकन के साथ बनाई गई!`
        : `✅ Created ${created.name} with secure QR token!`
    );
  };

  const handleRemoveRegisteredTable = async (tableId: string, tableName: string) => {
    if (!window.confirm(lang === 'hi' ? `क्या आप सचमुच ${tableName} को हटाना चाहते हैं?` : `Are you sure you want to remove ${tableName}?`)) {
      return;
    }
    await removeTable(tableId);
    showNotification(lang === 'hi' ? `🗑️ ${tableName} हटा दी गई।` : `🗑️ Removed ${tableName}.`);
  };

  const handleRegenerateSecurityToken = async (tableId: string, tableName: string) => {
    const updated = await regenerateTableSecurityToken(tableId);
    if (updated) {
      showNotification(
        lang === 'hi'
          ? `🔑 ${tableName} के लिए नया सुरक्षा QR टोकन जारी किया गया! पुराने प्रिंटेड स्टैंड समाप्त हो गए।`
          : `🔑 Regenerated new secure QR code for ${tableName}! Previous printed QR codes are now expired.`
      );
    }
  };

  const handleCopyTableLink = (tbl: HotelTableInfo) => {
    const url = buildTableQrUrl(tbl);
    navigator.clipboard?.writeText(url);
    setCopiedTokenId(tbl.id);
    setTimeout(() => setCopiedTokenId(null), 2000);
    showNotification(lang === 'hi' ? '📋 सीधा टेबल लिंक कॉपी किया गया!' : '📋 Table order URL copied to clipboard!');
  };

  // Catering inquiry status
  const handleUpdateCateringStatus = (inquiryId: string, status: CateringInquiry['status'], quote?: number) => {
    const updated = cateringInquiries.map((c) =>
      c.id === inquiryId ? { ...c, status, ...(quote ? { quotedAmount: quote } : {}) } : c
    );
    saveCateringToStorage(updated);
    showNotification(`Catering lead updated to ${(status || '').toUpperCase()}`);
  };

  // Coupon management
  const handleToggleCoupon = (couponId: string) => {
    const updated = coupons.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c));
    saveCouponsToStorage(updated);
    showNotification('Coupon status updated.');
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code?.trim()) return;
    const newCoupon: PromoCoupon = {
      id: `c_${Date.now()}`,
      code: couponForm.code.trim().toUpperCase(),
      description: couponForm.description || `${couponForm.discountPercent}% Off`,
      discountPercent: couponForm.discountPercent ? Number(couponForm.discountPercent) : undefined,
      discountFlat: couponForm.discountFlat ? Number(couponForm.discountFlat) : undefined,
      minOrderValue: Number(couponForm.minOrderValue) || 400,
      maxDiscount: Number(couponForm.maxDiscount) || 200,
      isActive: true,
    };
    saveCouponsToStorage([newCoupon, ...coupons]);
    showNotification(`Coupon ${newCoupon.code} created.`);
    setIsAddCouponOpen(false);
    setCouponForm({ code: '', description: '', discountPercent: 15, minOrderValue: 500 });
  };

  // Staff management
  const handleToggleStaffShift = (staffId: string) => {
    const updated = staff.map((s) =>
      s.id === staffId ? { ...s, shiftStatus: s.shiftStatus === 'on_shift' ? 'off_duty' : 'on_shift' } as StaffMember : s
    );
    saveStaffToStorage(updated);
    showNotification('Staff shift updated.');
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name?.trim()) return;
    const newStaff: StaffMember = {
      id: `staff_${Date.now()}`,
      name: staffForm.name.trim(),
      role: staffForm.role || 'sous_chef',
      department: (staffForm.role === 'general_manager'
        ? 'manager'
        : staffForm.role === 'floor_manager'
        ? 'waiter'
        : 'kitchen') as DepartmentType,
      station: staffForm.station || 'Main Kitchen',
      phone: staffForm.phone || '+91 98110 00000',
      shiftStatus: 'on_shift',
      joinedDate: 'Oct 2026',
    };
    saveStaffToStorage([...staff, newStaff]);
    showNotification(`Staff member ${newStaff.name} added to roster.`);
    setIsAddStaffOpen(false);
    setStaffForm({ name: '', role: 'sous_chef', station: 'Main Kitchen', phone: '+91 98110 00000' });
  };



  // Save Settings
  const handleSaveSettings = async () => {
    try {
      localStorage.setItem('shankar_admin_settings', JSON.stringify(settings));
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      showNotification('Kitchen & Operations settings updated successfully!');
    } catch {
      showNotification('Settings saved locally.');
    }
  };

  // Analytics
  const analytics: AnalyticsData = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, o) => acc + (o.grandTotal || 0), 0);
    const pendingOrders = orders.filter((o) => o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled').length;
    const completedOrders = orders.filter((o) => o.orderStatus === 'completed').length;
    const totalReservations = reservations.length;
    const confirmedReservations = reservations.filter((r) => r.status === 'confirmed' || r.status === 'seated').length;
    const totalCustomers = new Set(orders.map((o) => o.customerPhone || o.customerName)).size || 18;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 620;

    return {
      totalOrders,
      totalRevenue: Math.round(totalRevenue),
      pendingOrders,
      completedOrders,
      totalReservations,
      confirmedReservations,
      totalCustomers,
      avgOrderValue,
    };
  }, [orders, reservations]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        orderStatusFilter === 'all'
          ? true
          : orderStatusFilter === 'active'
          ? o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled'
          : o.orderStatus === orderStatusFilter;

      const matchesDining = orderDiningFilter === 'all' ? true : o.bookingType === orderDiningFilter;

      const matchesSearch =
        orderSearch.trim() === '' ||
        (o.customerName && o.customerName.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o.orderNumber && o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o.customerPhone && o.customerPhone.includes(orderSearch)) ||
        (o.tableNumber && o.tableNumber.toLowerCase().includes(orderSearch.toLowerCase()));

      return matchesStatus && matchesDining && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderDiningFilter, orderSearch]);

  // Filtered menu
  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCat = menuCategoryFilter === 'all' ? true : item.category === menuCategoryFilter;
      const matchesSearch =
        menuSearch.trim() === '' ||
        item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
        (item.hindiName && item.hindiName.includes(menuSearch));
      return matchesCat && matchesSearch;
    });
  }, [menuItems, menuCategoryFilter, menuSearch]);

  if (!isOpen) return null;

  // If user is not yet unlocked, render Master Security & Passkey Gate
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/95 backdrop-blur-md font-sans-body">
        <div className="max-w-md w-full bg-stone-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-stone-100 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <PalaceLogo size="lg" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                Maheswari Multi Cuisine Restaurant & Hotel
              </span>
              <h2 className="text-xl sm:text-2xl font-serif-display font-bold text-white mt-1">
                Executive Operations Gate
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Authorized restaurant management console. Grand Opening 2026 live control room.
              </p>
            </div>
          </div>

          <form onSubmit={handlePinUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-300 font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Enter Admin Master PIN / Passkey:</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter PIN (e.g. 2026)"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-center text-lg font-mono tracking-widest text-white placeholder-stone-600 focus:outline-hidden focus:border-amber-400"
                  autoFocus
                />
              </div>
              {pinError && (
                <p className="text-[11px] text-rose-400 font-medium">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-bold text-sm tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Unlock Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-stone-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Quick Owner Authentication:</span>
              <span className="font-mono text-amber-400/90 text-[11px]">Master PIN: 2026</span>
            </div>

            <button
              type="button"
              onClick={handleInstantUnlockAsOwner}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-stone-950" />
              <span>1-Click Launch • Manager Console</span>
            </button>

            {/* Quick Specific Department Staff Access */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                {lang === 'hi' ? 'विभाग कर्मचारी त्वरित लॉगिन:' : 'Department Staff Portals:'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const chef = staff.find((s) => s.department === 'kitchen') || staff[0];
                    setSelectedStaffPortal(chef);
                  }}
                  className="p-2 rounded-xl bg-[#111726] hover:bg-slate-800 border border-orange-500/30 hover:border-orange-400 text-orange-300 flex items-center gap-2 transition-all cursor-pointer text-left font-medium"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate text-[11px]">Chef Station</div>
                    <div className="text-[9px] text-slate-400 font-mono">PIN: 1122</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const waiter = staff.find((s) => s.department === 'waiter') || staff[2] || staff[0];
                    setSelectedStaffPortal(waiter);
                  }}
                  className="p-2 rounded-xl bg-[#111726] hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 flex items-center gap-2 transition-all cursor-pointer text-left font-medium"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate text-[11px]">Waiter Desk</div>
                    <div className="text-[9px] text-slate-400 font-mono">PIN: 3344</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const bookingStaff = staff.find((s) => s.department === 'booking_menu') || staff[3] || staff[0];
                    setSelectedStaffPortal(bookingStaff);
                  }}
                  className="p-2 rounded-xl bg-[#111726] hover:bg-slate-800 border border-blue-500/30 hover:border-blue-400 text-blue-300 flex items-center gap-2 transition-all cursor-pointer text-left font-medium"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate text-[11px]">Booking & Menu</div>
                    <div className="text-[9px] text-slate-400 font-mono">PIN: 5566</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const rider = staff.find((s) => s.department === 'delivery') || staff[4] || staff[0];
                    setSelectedStaffPortal(rider);
                  }}
                  className="p-2 rounded-xl bg-[#111726] hover:bg-slate-800 border border-purple-500/30 hover:border-purple-400 text-purple-300 flex items-center gap-2 transition-all cursor-pointer text-left font-medium"
                >
                  <Bike className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate text-[11px]">Delivery Fleet</div>
                    <div className="text-[9px] text-slate-400 font-mono">PIN: 7788</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-2 md:p-4 bg-slate-950/95 backdrop-blur-md animate-fadeIn overflow-hidden font-sans-body">
      <div className="relative w-full max-w-7xl h-full sm:h-[95vh] bg-[#0c1017] border-0 sm:border sm:border-slate-800/80 rounded-none sm:rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        
        {/* ========================================================================= */}
        {/* TOP HEADER STRIP - Mobile Optimized */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 bg-[#121722] border-b border-slate-800/80 shrink-0 gap-2">
          {/* Top Left: Logo & Wordmark (Only MAHESWARI MULTI CUISINE) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <PalaceLogo size="responsive" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm md:text-base font-serif-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-400 truncate">
                  MAHESWARI MULTI CUISINE
                </span>
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    settings.isKitchenAcceptingOrders ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                  }`}
                  title={settings.isKitchenAcceptingOrders ? 'Kitchen LIVE & Online' : 'Kitchen Temporarily Paused'}
                />
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-amber-400 font-mono truncate">
                Operations & Admin Console
              </div>
            </div>
          </div>

          {/* Quick Actions (Language Switcher, Refresh, Close) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Switcher Button (Hindi / English) */}
            <button
              type="button"
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer bg-slate-800/80 hover:bg-slate-750 text-amber-300 border-amber-500/30 flex items-center gap-1.5 shrink-0"
              title={lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
            >
              <span className="text-sm">🇮🇳</span>
              <span>{lang === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchAdminData}
              disabled={isLoading}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title={lang === 'hi' ? 'डेटा रीफ्रेश करें' : 'Refresh live data'}
              aria-label="Refresh live data"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title={lang === 'hi' ? 'बंद करें' : 'Close Admin Console'}
              aria-label="Close Admin Console"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Inter-Department Live Notification: When Kitchen completes cooking a Dine-in order */}
        {orders.some((o) => (o.orderStatus as string) === 'ready_at_table' || (o.bookingType === 'dine_in' && o.orderStatus === 'out_for_delivery')) && (
          <div className="bg-amber-400 text-stone-950 px-4 py-2 flex items-center justify-between font-bold text-xs shadow-md shrink-0 border-b border-amber-500">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-base shrink-0">🛎️</span>
              <span className="whitespace-nowrap">
                {lang === 'hi'
                  ? 'रसोई से खाना तैयार है! वेटर कृपया टेबल पर परोसें:'
                  : 'Food ready from kitchen! Server please deliver to table:'}
              </span>
              <span className="font-mono bg-stone-950 text-amber-300 px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap">
                {orders
                  .filter((o) => (o.orderStatus as string) === 'ready_at_table' || (o.bookingType === 'dine_in' && o.orderStatus === 'out_for_delivery'))
                  .map((o) => `${o.tableNumber || 'Table'} (#${o.orderNumber})`)
                  .join(', ')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const readyOrder = orders.find(
                  (o) => (o.orderStatus as string) === 'ready_at_table' || (o.bookingType === 'dine_in' && o.orderStatus === 'out_for_delivery')
                );
                if (readyOrder) {
                  handleUpdateOrderStatus(readyOrder.id, 'completed');
                  showNotification(
                    lang === 'hi'
                      ? `टेबल ${readyOrder.tableNumber || ''} पर खाना परोस दिया गया!`
                      : `Order #${readyOrder.orderNumber} served to table!`
                  );
                }
              }}
              className="ml-2 px-3 py-1 bg-stone-950 hover:bg-stone-900 text-amber-300 text-[11px] rounded-lg transition-colors cursor-pointer shrink-0 font-bold"
            >
              {lang === 'hi' ? '✅ टेबल पर परोस दिया' : '✅ Mark Served'}
            </button>
          </div>
        )}

        {/* Success / Alert Banner */}
        {actionSuccess && (
          <div className="bg-stone-900 border-b border-emerald-500/40 text-emerald-200 text-xs px-4 py-2.5 flex items-center justify-between font-medium animate-fadeIn shrink-0 shadow-sm">
            <span className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
              <span className="font-sans-body font-semibold text-white tracking-wide">{actionSuccess}</span>
            </span>
            <button
              type="button"
              onClick={() => setActionSuccess(null)}
              className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SINGLE STEP BACK ARROW BAR (For More Sections: Sales, Staff, Offers, Catering, Reviews, Settings) */}
        {/* ========================================================================= */}
        {['analytics', 'staff', 'coupons', 'catering', 'settings'].includes(activeTab) && (
          <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 bg-stone-950/95 border-b border-stone-800 shrink-0 animate-fadeIn">
            <button
              type="button"
              onClick={() => {
                // Single step back: reopen More Operations prompt
                setIsMoreMenuOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 group"
              title={lang === 'hi' ? 'अन्य विकल्पों पर एक कदम वापस जाएं' : 'Go one step back to More Options'}
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
              <span>{lang === 'hi' ? 'वापस (Back to More)' : 'Back to More Options'}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 font-mono">
                {activeTab === 'analytics' && (lang === 'hi' ? '📊 बिक्री रिपोर्ट' : '📊 Sales & Reports')}
                {activeTab === 'staff' && (lang === 'hi' ? '👥 स्टाफ ड्यूटी' : '👥 Staffs Duty')}
                {activeTab === 'coupons' && (lang === 'hi' ? '🏷️ ऑफर एडिट्स' : '🏷️ Offer Edits')}
                {activeTab === 'catering' && (lang === 'hi' ? '🎉 पार्टी व कैटरिंग' : '🎉 Party & Catering')}
                {activeTab === 'settings' && (lang === 'hi' ? '⚙️ सेटिंग्स' : '⚙️ Settings')}
              </span>
              <button
                type="button"
                onClick={() => setActiveTab(previousTab)}
                className="px-2.5 py-1 rounded-lg text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 border border-stone-800 text-[11px] font-medium transition-colors cursor-pointer"
                title="Return to primary view"
              >
                {lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN MODULE CONTENT */}
        {/* ========================================================================= */}
        <div className="overflow-y-auto flex-1 p-2.5 sm:p-6 space-y-4 sm:space-y-6 pb-24 overscroll-contain">
          {/* TAB 1: KITCHEN DISPLAY SYSTEM & LIVE ORDER PIPELINE */}
          {activeTab === 'kds' && (
            <div className="space-y-4">
              {/* Controls bar: search, filters & clear orders */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', labelHi: 'सभी', labelEn: 'All' },
                    { id: 'active', labelHi: '🔥 चालू', labelEn: '🔥 Active' },
                    { id: 'placed', labelHi: 'नया', labelEn: 'New' },
                    { id: 'confirmed', labelHi: 'स्वीकृत', labelEn: 'Confirmed' },
                    { id: 'cooking', labelHi: 'रसोई में', labelEn: 'Cooking' },
                    { id: 'out_for_delivery', labelHi: 'तैयार/डिस्पैच', labelEn: 'Dispatched' },
                    { id: 'completed', labelHi: 'पूरा', labelEn: 'Completed' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setOrderStatusFilter(f.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        orderStatusFilter === f.id
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-xs'
                          : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                      }`}
                    >
                      {lang === 'hi' ? f.labelHi : f.labelEn}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <select
                    value={orderDiningFilter}
                    onChange={(e) => setOrderDiningFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#121722] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="all">{lang === 'hi' ? 'सभी प्रकार (All)' : 'All Modes'}</option>
                    <option value="dine_in">{lang === 'hi' ? '🍽️ डाइन-इन' : '🍽️ Dine-in'}</option>
                    <option value="delivery">{lang === 'hi' ? '🛵 डिलीवरी' : '🛵 Delivery'}</option>
                    <option value="takeaway">{lang === 'hi' ? '🛍️ पार्सल' : '🛍️ Takeaway'}</option>
                  </select>

                  <div className="relative w-36 sm:w-48">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={lang === 'hi' ? 'खोजें...' : 'Search...'}
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-[#121722] border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Clear All Fake/Sample Orders Button */}
                  <button
                    type="button"
                    onClick={handleClearAllOrders}
                    className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs active:scale-95"
                    title={lang === 'hi' ? 'सभी उदाहरण व टेस्ट ऑर्डर हटाएं' : 'Clear all sample and example orders'}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>{lang === 'hi' ? 'ऑर्डर साफ करें' : 'Clear Orders'}</span>
                  </button>
                </div>
              </div>

              {/* Order Cards Grid */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-[#111726]/60 rounded-2xl border border-slate-800/80 p-8 space-y-3">
                  <UtensilsCrossed className="w-9 h-9 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">
                    {lang === 'hi' ? 'कोई सक्रिय ऑर्डर नहीं है।' : 'No active orders.'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {lang === 'hi'
                      ? 'ग्राहकों या डाइनिंग टेबल QR से आने वाले नए ऑर्डर यहाँ रियल-टाइम में दिखेंगे।'
                      : 'Live incoming orders from table QR scans or counter will appear here immediately.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredOrders.map((order) => {
                    let parsedItems: CartItem[] = [];
                    try {
                      parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || [];
                    } catch {
                      parsedItems = [];
                    }

                    const isPlaced = order.orderStatus === 'placed';
                    const isConfirmed = order.orderStatus === 'confirmed';
                    const isCooking = order.orderStatus === 'cooking';
                    const isOut = order.orderStatus === 'out_for_delivery';
                    const isCompleted = order.orderStatus === 'completed';
                    const isCancelled = order.orderStatus === 'cancelled';

                    return (
                      <div
                        key={order.id}
                        className={`rounded-xl border p-3 sm:p-3.5 flex flex-col justify-between space-y-2.5 transition-all ${
                          isCooking
                            ? 'bg-amber-950/25 border-amber-500/40 shadow-sm ring-1 ring-amber-500/20'
                            : isPlaced
                            ? 'bg-rose-950/25 border-rose-500/40 shadow-sm ring-1 ring-rose-500/20'
                            : isCompleted
                            ? 'bg-[#10141e] border-slate-800/80 opacity-80'
                            : 'bg-[#111726] border-slate-800'
                        }`}
                      >
                        {/* Header */}
                        <div>
                          <div className="flex items-start justify-between pb-2 border-b border-slate-800/80 gap-1">
                            <div className="min-w-0">
                              <span className="text-xs sm:text-[13px] font-mono font-bold text-amber-400 block truncate">
                                #{order.orderNumber || order.id.slice(-6)}
                              </span>
                              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>{order.createdAt}</span>
                              </div>
                            </div>

                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider font-mono shrink-0 ${
                                isPlaced
                                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                  : isCooking
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                  : isOut
                                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                                  : isCompleted
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {order.orderStatus.replace('_', ' ')}
                            </span>
                          </div>

                          {/* Customer Details */}
                          <div className="pt-2 text-xs space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-100 truncate pr-1">
                                {order.customerName || order.customer?.name || 'Walk-in Guest'}
                              </span>
                              {(order.customerPhone || order.customer?.phone) ? (
                                <a
                                  href={`tel:${order.customerPhone || order.customer?.phone}`}
                                  className="text-[10.5px] font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1 shrink-0 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700/60 transition-colors"
                                  title="Call Guest directly"
                                >
                                  <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span>{order.customerPhone || order.customer?.phone}</span>
                                </a>
                              ) : (
                                <span className="text-[10px] font-mono text-slate-500 shrink-0">—</span>
                              )}
                            </div>
                            <div className="text-[11px] text-amber-300 font-medium flex items-center gap-1.5">
                              <span>Mode: <strong className="uppercase font-mono text-white">{order.bookingType}</strong></span>
                              {order.tableNumber && (
                                <span className="bg-amber-400/15 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30 text-[10px] font-mono font-bold">
                                  Table {order.tableNumber}
                                </span>
                              )}
                            </div>
                            {order.deliveryAddress && (
                              <p className="text-[10px] text-slate-400 line-clamp-1">
                                📍 {order.deliveryAddress}
                              </p>
                            )}
                            {order.notes && (
                              <div className="p-1.5 rounded-md bg-amber-950/30 border border-amber-800/30 text-[10px] text-amber-200/90 line-clamp-1">
                                📝 {order.notes}
                              </div>
                            )}
                          </div>

                          {/* Ordered Dishes Grid */}
                          <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-mono">
                              Items ({parsedItems.length})
                            </span>

                            <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-0.5">
                              {parsedItems.map((item, idx) => {
                                const itemImg =
                                  item.menuItem?.image ||
                                  '/src/assets/images/dish_butter_chicken_curry_1792103747214.webp';

                                return (
                                  <div
                                    key={idx}
                                    className="p-1.5 rounded-lg border border-slate-800 bg-[#161d2d] flex flex-col justify-between space-y-1"
                                  >
                                    <div className="relative aspect-[4/3] w-full rounded overflow-hidden bg-slate-900">
                                      <img
                                        src={itemImg}
                                        alt={item.menuItem?.name || 'Dish'}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                      />
                                      <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-slate-950/90 text-amber-300 font-mono font-bold text-[9px]">
                                        {item.quantity || 1}x
                                      </span>
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-[11px] font-semibold text-slate-200 truncate">
                                        {item.menuItem?.name || (item as any).name || 'Dish'}
                                      </div>
                                      {item.portion === 'half' && (
                                        <span className="text-[9px] text-amber-400 block font-mono">Half</span>
                                      )}
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800/80 font-mono">
                                      <span className="text-slate-400">₹{item.unitPrice || 0}</span>
                                      <span className="text-amber-300 font-bold">
                                        ₹{item.itemTotal || (item.unitPrice || 0) * (item.quantity || 1)}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Order Total & Next Action Buttons */}
                        <div className="pt-2 border-t border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono font-bold">
                            <span className="text-slate-400 uppercase text-[10px]">
                              {order.paymentMethod} · {order.paymentStatus}
                            </span>
                            <span className="text-amber-400 text-sm">₹{order.grandTotal}</span>
                          </div>

                          <div className="flex items-center gap-1.5 pt-0.5">
                            <button
                              type="button"
                              onClick={() => setPrintingOrder(order)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors cursor-pointer shrink-0"
                              title="Print KOT / Bill Receipt"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {isPlaced && (
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                                className="flex-1 py-1.5 bg-rose-500 hover:bg-rose-400 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                {lang === 'hi' ? 'स्वीकारें • Accept' : 'Accept Order'}
                              </button>
                            )}

                            {isConfirmed && (
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(order.id, 'cooking')}
                                className="flex-1 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                {lang === 'hi' ? 'पकाना शुरू करें • Cook' : 'Start Cooking'}
                              </button>
                            )}

                            {isCooking && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleUpdateOrderStatus(order.id, 'out_for_delivery');
                                  if (order.bookingType === 'dine_in') {
                                    showNotification(lang === 'hi' ? `टेबल ${order.tableNumber || ''} का खाना तैयार है! वेटर को सूचित किया गया।` : `Table ${order.tableNumber || ''} food is ready! Floor staff alerted.`);
                                  }
                                }}
                                className="flex-1 py-1.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                {order.bookingType === 'dine_in'
                                  ? (lang === 'hi' ? 'खाना तैयार है • Food Ready' : 'Food Ready for Table')
                                  : (lang === 'hi' ? 'डिस्पैच करें • Dispatch' : 'Ready / Out for Delivery')}
                              </button>
                            )}

                            {isOut && (
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                {lang === 'hi' ? 'पूरा हुआ • Served' : 'Mark Completed'}
                              </button>
                            )}

                            {isCompleted && (
                              <span className="text-[10px] text-emerald-400 font-mono text-center flex-1 py-1 font-semibold">
                                {lang === 'hi' ? '✓ ऑर्डर पूरा हो चुका है' : '✓ Order Fulfilled'}
                              </span>
                            )}
                          </div>
                        </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MENU & DISH INVENTORY (LIVE 86 OUT-OF-STOCK CONTROL) */}
          {activeTab === 'menu' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: 'All Dishes' },
                    { id: 'curries', label: 'Curries' },
                    { id: 'tandoor', label: 'Tandoor' },
                    { id: 'biryani', label: 'Biryani' },
                    { id: 'thali', label: 'Thalis' },
                    { id: 'breads', label: 'Breads' },
                    { id: 'desserts', label: 'Desserts' },
                    { id: 'beverages', label: 'Beverages' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setMenuCategoryFilter(cat.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        menuCategoryFilter === cat.id
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                          : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 border border-stone-700/60'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-48 sm:w-56">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search dish name..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingDish(null);
                      setDishForm({
                        name: '',
                        hindiName: '',
                        category: 'curries',
                        menuSection: 'all_day',
                        description: '',
                        price: 350,
                        halfPrice: 220,
                        dietary: 'veg',
                        spiceLevel: 1,
                        isBestseller: false,
                        isChefSpecial: false,
                        isAvailable: true,
                        prepTimeMinutes: 15,
                        image: '/src/assets/images/dish_butter_chicken_curry_1792103747214.webp',
                      });
                      setIsAddDishOpen(true);
                    }}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Dish</span>
                  </button>
                </div>
              </div>

              {/* Menu items table / grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredMenu.map((dish) => {
                  const isAvailable = dish.isAvailable !== false;

                  return (
                    <div
                      key={dish.id}
                      className={`p-3 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 ${
                        isAvailable
                          ? 'bg-stone-950 border-stone-800'
                          : 'bg-stone-950/60 border-rose-900/40 opacity-75'
                      }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-800"
                          loading="lazy"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-white truncate" title={dish.name}>
                              {dish.name}
                            </h4>
                          </div>
                          {dish.hindiName && (
                            <span className="text-[10px] text-stone-400 font-hindi block truncate">
                              {dish.hindiName}
                            </span>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono font-bold text-amber-400">
                              ₹{dish.price}
                            </span>
                            {dish.halfPrice && (
                              <span className="text-[10px] font-mono text-stone-400">
                                Half: ₹{dish.halfPrice}
                              </span>
                            )}
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-stone-800 text-stone-300 font-mono">
                              {dish.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stock toggle and actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
                        <button
                          type="button"
                          onClick={() => handleToggleDishAvailability(dish.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isAvailable
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/30'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isAvailable ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                          <span>{isAvailable ? 'In Stock (Live)' : 'Sold Out (86)'}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDish(dish);
                              setDishForm(dish);
                              setIsAddDishOpen(true);
                            }}
                            className="p-1.5 text-stone-400 hover:text-amber-300 rounded hover:bg-stone-800 transition-colors cursor-pointer"
                            title="Edit Dish"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDish(dish.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-400 rounded hover:bg-stone-800 transition-colors cursor-pointer"
                            title="Remove Dish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: WAITER DESK */}
          {activeTab === 'waiter' && (
            <div className="space-y-4">
              <WaiterDesk
                orders={orders}
                menuItems={menuItems}
                diningTables={diningTables}
                lang={lang}
                waiterName={user.name || 'Floor Captain'}
                onOrderPunched={handleWaiterPunchNewOrder}
                onMarkServed={handleWaiterMarkServed}
                onHandoverDelivery={handleWaiterHandoverDelivery}
                showNotification={showNotification}
              />
            </div>
          )}

          {/* TAB: DELIVERY FLEET DESK */}
          {activeTab === 'delivery' && (
            <div className="space-y-4">
              <DeliveryFleetDesk
                orders={orders}
                riderName={user.name || 'Delivery Fleet Captain'}
                lang={lang}
                onStartDelivery={handleRiderStartDelivery}
                onCompleteDelivery={handleRiderCompleteDelivery}
                showNotification={showNotification}
              />
            </div>
          )}

          {/* TAB 3: FLOOR & TABLE MANAGEMENT WITH QR STANDS & ROTATING SECURITY */}
          {activeTab === 'tables' && (
            <div className="space-y-4">
              {/* Header and Sub-Tab Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-wrap gap-2 pb-2 border-b border-stone-800">
                <div>
                  <h3 className="text-sm sm:text-base font-serif-display font-bold text-white flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'hi' ? 'हॉल, डाइनिंग टेबल व QR स्टैंड प्रबंधन' : 'Dining Floors, VIP Tables & QR Stand Operations'}</span>
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {lang === 'hi'
                      ? 'टेबल ऑक्यूपेंसी, रोटेटिंग QR टोकन स्टैंड्स, और ऐक्रेलिक स्टैंड प्रिंटिंग'
                      : 'Live table occupancy, anti-spoofing rotating QR tokens, and acrylic stand printing.'}
                  </p>
                </div>

                {/* Sub-tab Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setTableSubTab('occupancy')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      tableSubTab === 'occupancy'
                        ? 'bg-amber-400 text-stone-950 shadow-xs'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'सीटिंग स्थिति' : 'Seating & Occupancy'}</span>
                    <span className="px-1.5 py-0.2 rounded bg-stone-900 text-amber-300 font-mono text-[10px]">
                      {diningTables.filter((t) => t.status === 'occupied').length}/{diningTables.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTableSubTab('qr_stands')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      tableSubTab === 'qr_stands'
                        ? 'bg-amber-400 text-stone-950 shadow-xs'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'QR स्टैंड व सुरक्षा टोकन' : 'QR Stands & Security'}</span>
                    <span className="px-1.5 py-0.2 rounded bg-stone-900 text-emerald-400 font-mono text-[10px]">
                      {registeredTables.filter((t) => t.isActive).length} Live
                    </span>
                  </button>
                </div>
              </div>

              {/* Sub-view 1: Floor Seating & Occupancy */}
              {tableSubTab === 'occupancy' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-stone-400 font-mono">
                      {lang === 'hi' ? 'कुल हॉल ऑक्यूपेंसी:' : 'Live Hall Occupancy:'}{' '}
                      <strong className="text-amber-400">
                        {diningTables.filter((t) => t.status === 'occupied').length} / {diningTables.length} Tables Active
                      </strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTableSubTab('qr_stands')}
                        className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5 text-amber-400" />
                        <span>Manage QR Stand Codes</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {diningTables.map((table) => {
                      const isAvailable = table.status === 'available';
                      const isOccupied = table.status === 'occupied';
                      const isReserved = table.status === 'reserved';
                      const isCleaning = table.status === 'cleaning';
                      const regMatch = registeredTables.find(
                        (rt) => rt.name.toLowerCase().trim() === table.tableNumber.toLowerCase().trim() ||
                                rt.number === parseInt(table.tableNumber.replace(/\D/g, ''), 10)
                      );
                      const qrThumb = regMatch ? tableQrDataUrls[regMatch.id] : undefined;

                      return (
                        <div
                          key={table.id}
                          className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                            isAvailable
                              ? 'bg-stone-950 border-emerald-500/30'
                              : isOccupied
                              ? 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                              : isReserved
                              ? 'bg-blue-950/20 border-blue-500/40'
                              : 'bg-stone-950 border-stone-800 opacity-70'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                                <span>{table.tableNumber}</span>
                                {qrThumb && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (regMatch) {
                                        setPrintingTable(regMatch);
                                        setPrintAllStands(false);
                                      }
                                    }}
                                    className="p-0.5 text-stone-500 hover:text-amber-400 cursor-pointer"
                                    title="View & Print Stand"
                                  >
                                    <QrCode className="w-3 h-3 text-amber-400" />
                                  </button>
                                )}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase font-mono ${
                                  isAvailable
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : isOccupied
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : isReserved
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : 'bg-stone-800 text-stone-400'
                                }`}
                              >
                                {lang === 'hi'
                                  ? isAvailable
                                    ? 'खाली'
                                    : isOccupied
                                    ? 'भरा'
                                    : isReserved
                                    ? 'आरक्षित'
                                    : 'सफाई'
                                  : table.status}
                              </span>
                            </div>
                            <div className="text-[10.5px] text-stone-400 font-medium mt-1">
                              {table.area} · {table.capacity} {lang === 'hi' ? 'सीटर' : 'Seater'}
                            </div>
                            {table.currentGuestName && (
                              <div className="mt-2 p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-amber-200">
                                {lang === 'hi' ? 'ग्राहक:' : 'Guest:'} <strong className="text-white">{table.currentGuestName}</strong>
                                {table.occupiedSince && (
                                  <span className="block text-[9.5px] text-stone-400 font-mono mt-0.5">
                                    {table.occupiedSince}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Quick seating and department actions */}
                          <div className="pt-2 border-t border-stone-800/80 flex items-center gap-1.5">
                            {isAvailable && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSeatingTableModal(table);
                                  setWalkinGuestName('');
                                  setWalkinPartySize(String(table.capacity));
                                }}
                                className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              >
                                {lang === 'hi' ? 'ग्राहक बैठाएं (Seat)' : 'Seat Walk-in Guest'}
                              </button>
                            )}
                            {isOccupied && (
                              <div className="flex items-center gap-1 w-full">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab('kds');
                                    setOrderSearch(table.tableNumber);
                                  }}
                                  className="px-2 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                                  title={lang === 'hi' ? 'रसोई का स्टेटस देखें' : 'View Kitchen Status'}
                                >
                                  {lang === 'hi' ? '👨‍🍳 रसोई' : '👨‍🍳 Kitchen'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateTableStatus(table.id, 'available')}
                                  className="flex-1 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                >
                                  {lang === 'hi' ? 'खाली करें (Settle)' : 'Vacate'}
                                </button>
                              </div>
                            )}
                            {isCleaning && (
                              <button
                                type="button"
                                onClick={() => handleUpdateTableStatus(table.id, 'available')}
                                className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              >
                                {lang === 'hi' ? 'सफाई पूरी - तैयार (Ready)' : 'Mark Ready & Clean'}
                              </button>
                            )}
                            {isReserved && (
                              <button
                                type="button"
                                onClick={() => handleUpdateTableStatus(table.id, 'occupied', table.currentGuestName)}
                                className="w-full py-1.5 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              >
                                {lang === 'hi' ? 'मेहमान आ गए - बैठाएं' : 'Guest Arrived: Seat'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-view 2: Table QR Stands & Rotating Security */}
              {tableSubTab === 'qr_stands' && (
                <div className="space-y-4">
                  {/* Top Bar for QR Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-stone-950 border border-stone-800">
                    <div>
                      <h4 className="font-serif-display font-bold text-base text-white flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'hi' ? 'टेबल QR स्टैंड व सुरक्षा टोकन रोटेशन' : 'Table QR Stands & Rotating Cryptographic Tokens'}</span>
                      </h4>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {lang === 'hi'
                          ? 'एंटी-स्पूफिंग टोकन रोटेशन, नए टेबल QR जोड़ें, और 4x6" या 5x7" ऐक्रेलिक स्टैंड प्रिंट करें।'
                          : 'Anti-spoofing rotating tokens, generate new table QRs, and print acrylic photo stands.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setPrintAllStands(true);
                          setPrintingTable(null);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-700 shadow-xs"
                      >
                        <Printer className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'hi' ? 'सभी सक्रिय स्टैंड प्रिंट करें' : 'Print All Active Stands'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsAddTableOpen(true)}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-400/20 active:scale-95"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>{lang === 'hi' ? 'नया टेबल QR जोड़ें' : 'Add New Table QR'}</span>
                      </button>
                    </div>
                  </div>

                  {/* QR Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {registeredTables.map((table) => {
                      const qrUrl = tableQrDataUrls[table.id];
                      return (
                        <div
                          key={table.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                            table.isActive
                              ? 'bg-stone-950 border-stone-800 hover:border-amber-500/40'
                              : 'bg-stone-950/40 border-stone-900 opacity-60'
                          }`}
                        >
                          <div className="space-y-3">
                            {/* Table Header */}
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-serif-display font-bold text-base text-white">
                                    {table.name}
                                  </h5>
                                  <span
                                    className={`px-2 py-0.2 rounded-full text-[9px] font-mono font-bold uppercase ${
                                      table.isActive
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-stone-800 text-stone-400'
                                    }`}
                                  >
                                    {table.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                <span className="text-xs text-stone-400 block mt-0.5">
                                  {table.area} • Capacity: {table.capacity} guests
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleTableActive(table.id, !table.isActive)}
                                className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                                  table.isActive
                                    ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                                }`}
                              >
                                {table.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </div>

                            {/* Scannable QR Code & Token Section */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-900 border border-stone-800">
                              <div className="w-20 h-20 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center">
                                {qrUrl ? (
                                  <img src={qrUrl} alt={table.name} className="w-full h-full object-contain" />
                                ) : (
                                  <QrCode className="w-8 h-8 text-stone-400" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1 space-y-1">
                                <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block">
                                  Rotating Security Token:
                                </span>
                                <div className="font-mono text-xs text-stone-300 truncate bg-stone-950 px-2 py-1 rounded border border-stone-800">
                                  {table.securityToken || 'No token'}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopyTableLink(table)}
                                  className="text-[10px] text-stone-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  {copiedTokenId === table.id ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-400 font-bold">Link Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy Direct Order URL</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Card Action Buttons */}
                          <div className="pt-3 mt-3 border-t border-stone-800/80 flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5">
                              {/* Print Acrylic Stand Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setPrintingTable(table);
                                  setPrintAllStands(false);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/40 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                title="Print Acrylic Stand (4x6 or 5x7)"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print Stand</span>
                              </button>

                              {/* Regenerate Token Button */}
                              <button
                                type="button"
                                onClick={() => handleRegenerateSecurityToken(table.id, table.name)}
                                className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                title="Regenerate new security token (rotates QR and expires old printed code)"
                              >
                                <Key className="w-3.5 h-3.5 text-amber-400" />
                                <span>Rotate Token</span>
                              </button>
                            </div>

                            {/* Remove Table Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveRegisteredTable(table.id, table.name)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title={`Delete ${table.name}`}
                              aria-label={`Delete ${table.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TABLE RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
                <div>
                  <h3 className="text-sm font-serif-display font-bold text-white">
                    Guest Table Reservations
                  </h3>
                  <p className="text-xs text-stone-400">
                    Advance dining bookings across Courtyard, Main Hall, and Baithaks.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-2xl border border-stone-800 bg-stone-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          #{res.bookingNumber || res.id}
                        </span>
                        <span className="font-bold text-white text-sm">
                          {res.guestName}
                        </span>
                        <a
                          href={`tel:${res.guestPhone}`}
                          className="text-xs font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800"
                          title="Call Guest directly from phone"
                        >
                          <Phone className="w-3 h-3 text-amber-400" />
                          <span>{res.guestPhone}</span>
                        </a>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-amber-400/20 text-amber-300 border border-amber-400/40">
                          {res.status}
                        </span>
                      </div>
                      <div className="text-xs text-stone-300 flex items-center gap-3 flex-wrap">
                        <span>📅 {res.date}</span>
                        <span>⏰ {res.timeSlot}</span>
                        <span>👥 {res.guestsCount} Guests</span>
                        <span>🏛️ {res.seatingArea}</span>
                        {res.tableNumber && (
                          <span className="text-amber-400 font-bold font-mono">
                            Assigned: {res.tableNumber}
                          </span>
                        )}
                      </div>
                      {res.specialRequests && (
                        <p className="text-[11px] text-amber-200/90 italic">
                          Special Request: "{res.specialRequests}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {res.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateReservationStatus(res.id!, 'seated', 'Table 7')}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          {lang === 'hi' ? 'मेहमान बैठाएं (Seat)' : 'Seat Guests'}
                        </button>
                      )}
                      {res.status === 'seated' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateReservationStatus(res.id!, 'completed')}
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          {lang === 'hi' ? 'भोजन पूरा (Complete)' : 'Complete Dining'}
                        </button>
                      )}
                      {res.status !== 'cancelled' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateReservationStatus(res.id!, 'cancelled')}
                          className="px-2.5 py-1.5 text-stone-400 hover:text-rose-400 rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ROYAL CATERING & BANQUET LEADS */}
          {activeTab === 'catering' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-sm font-serif-display font-bold text-white">
                    Royal Banquet & Catering Inquiries
                  </h3>
                  <p className="text-xs text-stone-400">
                    Inquiries for weddings, corporate galas, and silver jubilee celebrations.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {cateringInquiries.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-2xl border border-stone-800 bg-stone-950 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                          {cat.eventType}
                        </span>
                        <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {cat.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-stone-500 block text-[10px]">Contact</span>
                        <a
                          href={`tel:${cat.phone}`}
                          className="text-amber-300 hover:text-amber-200 font-mono flex items-center gap-1"
                          title="Call inquirer"
                        >
                          <Phone className="w-3 h-3 text-amber-400" />
                          <span>{cat.phone}</span>
                        </a>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Event Date</span>
                        <span className="text-stone-200">{cat.eventDate}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Guest Count</span>
                        <span className="text-stone-200">{cat.guestCount} Guests</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Budget</span>
                        <span className="text-amber-300 font-mono">{cat.budgetRange}</span>
                      </div>
                    </div>

                    {cat.specialRequirements && (
                      <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300">
                        <strong className="text-amber-400">Requirements:</strong> {cat.specialRequirements}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-stone-500 text-[11px] font-mono">Received: {cat.createdAt}</span>
                      <div className="flex items-center gap-2">
                        {cat.status === 'new' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateCateringStatus(cat.id || '', 'quoted', 350000)}
                            className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            {lang === 'hi' ? 'कोटेशन भेजें (₹3.5L)' : 'Send Quote (₹3.5L)'}
                          </button>
                        )}
                        {cat.status === 'quoted' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateCateringStatus(cat.id || '', 'confirmed')}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            {lang === 'hi' ? 'बुकिंग पक्की करें ✅' : 'Confirm Booking ✅'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROMO COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-sm font-serif-display font-bold text-white">
                    Promo Discounts & Loyalty Codes
                  </h3>
                  <p className="text-xs text-stone-400">
                    Active discount coupons applied by online diners during checkout.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddCouponOpen(true)}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'नया ऑफर कूपन बनाएं' : 'Create Coupon'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {coupons.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 ${
                      c.isActive ? 'bg-stone-950 border-stone-800' : 'bg-stone-950/60 border-stone-900 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                          {c.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleCoupon(c.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                            c.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {c.isActive ? (lang === 'hi' ? 'सक्रिय' : 'Active') : (lang === 'hi' ? 'बंद' : 'Inactive')}
                        </button>
                      </div>
                      <p className="text-xs text-stone-200 mt-2 font-medium">{c.description}</p>
                      <div className="text-[11px] text-stone-400 font-mono mt-1">
                        Min Order: ₹{c.minOrderValue}
                        {c.maxDiscount ? ` · Max Discount: ₹${c.maxDiscount}` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: STAFF ROSTER & SHIFT MANAGEMENT */}
          {activeTab === 'staff' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-sm font-serif-display font-bold text-white">
                    {lang === 'hi' ? 'रसोई और हॉल कर्मचारी रोस्टर' : 'Master Culinary & Service Crew'}
                  </h3>
                  <p className="text-xs text-stone-400">
                    {lang === 'hi'
                      ? 'रसोई उस्ताद, फ्लोर कैप्टन, कैशियर और डिलीवरी राइडर'
                      : 'Kitchen ustads, floor captains, cashiers, and express delivery riders.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(true)}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'कर्मचारी जोड़ें' : 'Add Crew Member'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {staff.map((s) => {
                  const dept = s.department || 'waiter';
                  return (
                    <div
                      key={s.id}
                      className="p-4 rounded-2xl border border-stone-800 bg-stone-950 flex flex-col justify-between space-y-3 shadow-md transition-all hover:border-stone-700"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{s.name}</span>
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleToggleStaffShift(s.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono transition-colors cursor-pointer ${
                              s.shiftStatus === 'on_shift'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-stone-800 text-stone-400 border border-stone-700'
                            }`}
                          >
                            {s.shiftStatus === 'on_shift'
                              ? (lang === 'hi' ? 'ड्यूटी पर (On Shift)' : 'On Shift')
                              : (lang === 'hi' ? 'छुट्टी (Off Duty)' : 'Off Duty')}
                          </button>
                        </div>
                        <div className="text-[11px] text-amber-300 font-medium mt-1 uppercase font-mono">
                          {s.role.replace('_', ' ')} · {s.station}
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                          📞 {s.phone} · Since {s.joinedDate}
                        </div>

                        {/* Assigned Department Badge & Quick Reassign Selector */}
                        <div className="mt-2.5 pt-2 border-t border-stone-800/80 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-stone-400 font-medium">
                              {lang === 'hi' ? 'नियुक्त विभाग:' : 'Assigned Department:'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono ${
                              dept === 'kitchen'
                                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                                : dept === 'waiter'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : dept === 'booking_menu'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                : dept === 'delivery'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            }`}>
                              {dept === 'kitchen' && '👨‍🍳 Kitchen (Chef)'}
                              {dept === 'waiter' && '🤵 Waiters Desk'}
                              {dept === 'booking_menu' && '📅 Booking & Menu'}
                              {dept === 'delivery' && '🛵 Delivery Fleet'}
                              {dept === 'manager' && '👑 General Manager'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-[10px] text-stone-400 shrink-0 font-mono">
                              {lang === 'hi' ? 'विभाग बदलें:' : 'Assign:'}
                            </label>
                            <select
                              value={dept}
                              onChange={(e) => handleAssignStaffDepartment(s.id, e.target.value as DepartmentType)}
                              className="flex-1 px-2 py-1 bg-stone-900 border border-stone-800 rounded-lg text-[11px] text-stone-200 focus:outline-hidden focus:border-amber-400 cursor-pointer"
                            >
                              <option value="kitchen">👨‍🍳 Kitchen Department (Chef)</option>
                              <option value="waiter">🤵 Waiter Department (Captain)</option>
                              <option value="booking_menu">📅 Booking & Menu Supply Managing</option>
                              <option value="delivery">🛵 Delivery Boy Section (Rider)</option>
                              <option value="manager">👑 General Manager (Full Admin)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Launch Dedicated Staff Department Portal */}
                      <button
                        type="button"
                        onClick={() => setSelectedStaffPortal(s)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 ${
                          dept === 'kitchen'
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950'
                            : dept === 'waiter'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950'
                            : dept === 'booking_menu'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white'
                            : dept === 'delivery'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white'
                            : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950'
                        }`}
                        title={`Open isolated ${dept} dashboard specifically for ${s.name}`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>
                          {lang === 'hi'
                            ? `पोर्टल खोलें: ${dept === 'kitchen' ? 'रसोई (Kitchen)' : dept === 'waiter' ? 'वेटर (Waiter)' : dept === 'booking_menu' ? 'बुकिंग व मेन्यू' : dept === 'delivery' ? 'डिलीवरी' : 'मैनेजर'}`
                            : `Open ${dept === 'kitchen' ? 'Kitchen' : dept === 'waiter' ? 'Waiter' : dept === 'booking_menu' ? 'Booking & Menu' : dept === 'delivery' ? 'Delivery' : 'Manager'} Portal`}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 8: FINANCIAL ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-sm font-serif-display font-bold text-white">
                    Operational Financial Analytics
                  </h3>
                  <p className="text-xs text-stone-400">
                    Live gross sales, average order value, and ticket fulfillment rate.
                  </p>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl border border-stone-800 bg-stone-950 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block font-bold">
                    Today's Gross Sales
                  </span>
                  <div className="text-xl sm:text-2xl font-serif-display font-bold text-amber-400">
                    ₹{analytics.totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">+18% vs yesterday</span>
                </div>

                <div className="p-4 rounded-2xl border border-stone-800 bg-stone-950 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block font-bold">
                    Total Orders Placed
                  </span>
                  <div className="text-xl sm:text-2xl font-serif-display font-bold text-white">
                    {analytics.totalOrders}
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono">
                    {analytics.pendingOrders} in active kitchen
                  </span>
                </div>

                <div className="p-4 rounded-2xl border border-stone-800 bg-stone-950 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block font-bold">
                    Average Ticket (AOV)
                  </span>
                  <div className="text-xl sm:text-2xl font-serif-display font-bold text-amber-400">
                    ₹{analytics.avgOrderValue}
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">Per customer order</span>
                </div>

                <div className="p-4 rounded-2xl border border-stone-800 bg-stone-950 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block font-bold">
                    Table Reservations
                  </span>
                  <div className="text-xl sm:text-2xl font-serif-display font-bold text-white">
                    {analytics.totalReservations}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {analytics.confirmedReservations} confirmed
                  </span>
                </div>
              </div>

              {/* Order breakdown */}
              <div className="p-4 rounded-2xl border border-stone-800 bg-stone-950 space-y-3">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Revenue Channels Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[11px] text-stone-400 block">🛵 Delivery Orders</span>
                    <span className="text-base font-bold text-amber-300 font-mono">
                      ₹{Math.round(analytics.totalRevenue * 0.65).toLocaleString('en-IN')} (65%)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[11px] text-stone-400 block">🍽️ Dine-in Baithaks</span>
                    <span className="text-base font-bold text-amber-300 font-mono">
                      ₹{Math.round(analytics.totalRevenue * 0.28).toLocaleString('en-IN')} (28%)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[11px] text-stone-400 block">🛍️ Takeaway Pickups</span>
                    <span className="text-base font-bold text-amber-300 font-mono">
                      ₹{Math.round(analytics.totalRevenue * 0.07).toLocaleString('en-IN')} (7%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* TAB 10: KITCHEN CONTROLS & OPERATIONS SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-sm font-serif-display font-bold text-white">
                    Operations & Kitchen Configuration
                  </h3>
                  <p className="text-xs text-stone-400">
                    Live switches for order intake, estimated prep times, and fees.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-stone-800 bg-stone-950 space-y-4">
                {/* Kitchen online toggle */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Kitchen Acceptance Status
                    </span>
                    <span className="text-[11px] text-stone-400">
                      When turned off, customers will be informed the kitchen is at peak capacity.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        isKitchenAcceptingOrders: !prev.isKitchenAcceptingOrders,
                      }))
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      settings.isKitchenAcceptingOrders
                        ? 'bg-emerald-500 text-stone-950'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {settings.isKitchenAcceptingOrders
                      ? (lang === 'hi' ? 'ऑर्डर चालू है' : 'Accepting Orders')
                      : (lang === 'hi' ? 'रोक दिया गया' : 'Paused')}
                  </button>
                </div>

                {/* Estimated delivery time */}
                <div className="space-y-1.5 pb-3 border-b border-stone-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">
                      {lang === 'hi' ? 'अनुमानित तैयारी व डिलीवरी समय' : 'Estimated Preparation & Delivery Time'}
                    </span>
                    <span className="font-mono text-amber-400 font-bold">
                      {settings.estimatedDeliveryMinutes} {lang === 'hi' ? 'मिनट' : 'Minutes'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={settings.estimatedDeliveryMinutes}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        estimatedDeliveryMinutes: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Marquee Banner */}
                <div className="space-y-1.5 pb-3 border-b border-stone-800">
                  <label className="text-xs font-bold text-white block">
                    {lang === 'hi' ? 'घोषणा पट्टी (Marquee Banner)' : 'Announcement Marquee Banner'}
                  </label>
                  <input
                    type="text"
                    value={settings.announcementBanner}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        announcementBanner: e.target.value,
                      }))
                    }
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                {/* Delivery fee & threshold */}
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-stone-800">
                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-400 block">
                      {lang === 'hi' ? 'डिलीवरी शुल्क (₹)' : 'Delivery Fee (₹)'}
                    </label>
                    <input
                      type="number"
                      value={settings.deliveryFee}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, deliveryFee: Number(e.target.value) }))
                      }
                      className="w-full p-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-400 block">
                      {lang === 'hi' ? 'मुफ्त डिलीवरी (न्यूनतम ₹)' : 'Free Delivery Above (₹)'}
                    </label>
                    <input
                      type="number"
                      value={settings.freeDeliveryThreshold}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          freeDeliveryThreshold: Number(e.target.value),
                        }))
                      }
                      className="w-full p-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  {lang === 'hi' ? 'सेटिंग्स सेव करें' : 'Save Operations Settings'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* NATIVE BOTTOM ANDROID NAVIGATION BAR (Genuine, Sleek, Compact & Easy) */}
        {/* ========================================================================= */}
        <div className="shrink-0 bg-[#121722]/95 backdrop-blur-md border-t border-slate-800/90 px-2 sm:px-6 py-2 sm:py-2.5 z-30 shadow-2xl">
          <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
            {/* 1. Orders */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('kds');
                setIsMoreMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
                activeTab === 'kds'
                  ? 'text-amber-400 font-bold bg-amber-400/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="relative">
                <Flame className="w-5 h-5" />
                {orders.filter((o) => o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled').length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-amber-400 text-stone-950 text-[9px] font-mono font-black px-1 rounded-full min-w-3.5 h-3.5 flex items-center justify-center shadow-xs">
                    {orders.filter((o) => o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled').length}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight truncate font-medium">
                {lang === 'hi' ? 'ऑर्डर' : 'Orders'}
              </span>
            </button>

            {/* 2. Tables */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('tables');
                setIsMoreMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
                activeTab === 'tables'
                  ? 'text-amber-400 font-bold bg-amber-400/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="relative">
                <Store className="w-5 h-5" />
                {diningTables.filter((t) => t.status === 'occupied').length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-mono font-bold px-1 rounded-full min-w-3.5 h-3.5 flex items-center justify-center shadow-xs">
                    {diningTables.filter((t) => t.status === 'occupied').length}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight truncate font-medium">
                {lang === 'hi' ? 'टेबल' : 'Tables'}
              </span>
            </button>

            {/* 3. Bookings */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('reservations');
                setIsMoreMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
                activeTab === 'reservations'
                  ? 'text-amber-400 font-bold bg-amber-400/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="relative">
                <Calendar className="w-5 h-5" />
                {reservations.filter((r) => r.status === 'confirmed').length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-sky-500 text-white text-[9px] font-mono font-bold px-1 rounded-full min-w-3.5 h-3.5 flex items-center justify-center shadow-xs">
                    {reservations.filter((r) => r.status === 'confirmed').length}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight truncate font-medium">
                {lang === 'hi' ? 'बुकिंग' : 'Bookings'}
              </span>
            </button>

            {/* 4. Menu */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('menu');
                setIsMoreMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
                activeTab === 'menu'
                  ? 'text-amber-400 font-bold bg-amber-400/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ChefHat className="w-5 h-5" />
              <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight truncate font-medium">
                {lang === 'hi' ? 'मेन्यू' : 'Menu'}
              </span>
            </button>

            {/* 5. The LAST EXTRA NAV AT DOWN: Shows ALL REMAINING OPTIONS in a prompt! */}
            <button
              type="button"
              onClick={() => setIsMoreMenuOpen(true)}
              className={`flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
                ['analytics', 'staff', 'coupons', 'catering', 'settings'].includes(activeTab) || isMoreMenuOpen
                  ? 'text-amber-400 font-bold bg-amber-400/15 ring-1 ring-amber-400/40 shadow-xs'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
              }`}
              title="View all remaining options: Sales, Staff Duty, Offers, Party & Catering"
            >
              <div className="relative">
                <LayoutGrid className="w-5 h-5" />
                {cateringInquiries.filter((c) => c.status === 'new').length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-amber-400 text-stone-950 text-[9px] font-bold px-1 rounded-full min-w-3.5 h-3.5 flex items-center justify-center animate-pulse">
                    {cateringInquiries.filter((c) => c.status === 'new').length}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight truncate flex items-center gap-0.5 font-medium">
                <span>{lang === 'hi' ? 'अन्य विकल्प' : 'More'}</span>
                <span className="text-[8px]">▾</span>
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MANAGER CHOICE PROMPT MODAL (Opens beautifully centered, not sticky from down) */}
        {/* ========================================================================= */}
        {isMoreMenuOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn"
            onClick={() => setIsMoreMenuOpen(false)}
          >
            <div
              className="relative w-full max-w-lg bg-stone-900/98 border border-amber-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/90 space-y-4 animate-fadeIn text-stone-100 max-h-[85vh] overflow-y-auto ring-1 ring-amber-400/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/15 text-amber-300 flex items-center justify-center border border-amber-400/30 shadow-xs">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-display font-bold text-base text-amber-200 tracking-wide">
                      {lang === 'hi' ? 'मैनेजर ऑप्शंस' : 'Manager Operations'}
                    </h3>
                    <p className="text-xs text-stone-400 font-sans-body">
                      {lang === 'hi' ? 'प्रबंधन हेतु विकल्प चुनें:' : 'Select an operations department:'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of All Remaining Options: Sales, Staffs Duty, Offer Edits, Party/Catering, Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'analytics',
                    icon: TrendingUp,
                    titleHi: 'आज की बिक्री (Sales)',
                    titleEn: 'Sales & Reports',
                    descHi: 'दैनिक कमाई व बिल हिसाब',
                    descEn: 'Revenue, orders & bill stats',
                    badge: `₹${(orders.filter(o => o.orderStatus === 'completed').reduce((sum, o) => sum + (o.grandTotal || 0), 0) + 12450).toLocaleString('en-IN')}`,
                  },
                  {
                    id: 'staff',
                    icon: Users,
                    titleHi: 'कर्मचारी ड्युटी (Staff)',
                    titleEn: 'Staffs Duty',
                    descHi: 'शिफ्ट, रोस्टर व हाजिरी स्थिति',
                    descEn: 'Duty shifts & active roster',
                    badge: `${staff.filter(s => s.shiftStatus === 'on_shift').length} On Duty`,
                  },
                  {
                    id: 'coupons',
                    icon: Tag,
                    titleHi: 'ऑफर एडिट्स (Offers)',
                    titleEn: 'Offer Edits',
                    descHi: 'डिस्काउंट कूपन और प्रोमो कोड',
                    descEn: 'Promos, discounts & codes',
                    badge: `${coupons.filter(c => c.isActive).length} Active`,
                  },
                  {
                    id: 'catering',
                    icon: PartyPopper,
                    titleHi: 'पार्टी या कैटरिंग',
                    titleEn: 'Party or Catering',
                    descHi: 'इवेंट बुकिंग और थोक पूछताछ',
                    descEn: 'Bulk dining, banquets & queries',
                    badge: cateringInquiries.filter(c => c.status === 'new').length > 0
                      ? `${cateringInquiries.filter(c => c.status === 'new').length} New`
                      : 'Live',
                  },
                  {
                    id: 'settings',
                    icon: Settings,
                    titleHi: 'दुकान सेटिंग्स (Settings)',
                    titleEn: 'Restaurant Settings',
                    descHi: 'रसोई चालू/बंद, समय और नियम',
                    descEn: 'Kitchen status & timings',
                    badge: settings.isKitchenAcceptingOrders ? 'Online' : 'Paused',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (['kds', 'tables', 'reservations', 'menu'].includes(activeTab)) {
                          setPreviousTab(activeTab as any);
                        }
                        setActiveTab(item.id as any);
                        setIsMoreMenuOpen(false);
                        // No green banner notification when opening from more section
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-98 ${
                        isActive
                          ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow-md ring-2 ring-amber-400/50'
                          : 'bg-stone-950/70 hover:bg-stone-800/80 border-stone-800 hover:border-amber-500/50 text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            isActive
                              ? 'bg-stone-950 text-amber-300 border-amber-400'
                              : 'bg-stone-900 border-stone-800 text-amber-400 group-hover:scale-105 transition-transform'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs font-bold font-sans-body truncate ${isActive ? 'text-stone-950' : 'text-stone-100 group-hover:text-amber-300'}`}>
                            {lang === 'hi' ? item.titleHi : item.titleEn}
                          </div>
                          <div className={`text-[11px] truncate ${isActive ? 'text-stone-800' : 'text-stone-400'}`}>
                            {lang === 'hi' ? item.descHi : item.descEn}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold whitespace-nowrap ${
                            isActive
                              ? 'bg-stone-950 text-amber-300'
                              : 'bg-stone-900 text-amber-300/90 border border-stone-700/60'
                          }`}
                        >
                          {item.badge}
                        </span>
                        <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-stone-950' : 'text-stone-500 group-hover:translate-x-0.5 transition-transform'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT DISH MODAL */}
      {/* ========================================================================= */}
      {isAddDishOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-stone-950/80 backdrop-blur-xs">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 text-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h3 className="text-sm font-bold text-white">
                {editingDish ? 'Edit Dish Details' : 'Add New Dish to Menu'}
              </h3>
              <button onClick={() => setIsAddDishOpen(false)} className="text-stone-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Dish Name (English) *</label>
                <input
                  type="text"
                  required
                  value={dishForm.name || ''}
                  onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                  placeholder="e.g. Royal Shahi Paneer"
                  className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Hindi Subtitle</label>
                <input
                  type="text"
                  value={dishForm.hindiName || ''}
                  onChange={(e) => setDishForm({ ...dishForm, hindiName: e.target.value })}
                  placeholder="e.g. रॉयल शाही पनीर"
                  className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-400 mb-1">Price Full (₹) *</label>
                  <input
                    type="number"
                    required
                    value={dishForm.price || ''}
                    onChange={(e) => setDishForm({ ...dishForm, price: Number(e.target.value) })}
                    className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Half Price (₹)</label>
                  <input
                    type="number"
                    value={dishForm.halfPrice || ''}
                    onChange={(e) => setDishForm({ ...dishForm, halfPrice: Number(e.target.value) })}
                    className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-400 mb-1">Category</label>
                  <select
                    value={dishForm.category || 'curries'}
                    onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                    className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                  >
                    <option value="curries">Curries</option>
                    <option value="tandoor">Tandoor</option>
                    <option value="biryani">Biryani</option>
                    <option value="thali">Thali</option>
                    <option value="breads">Breads</option>
                    <option value="desserts">Desserts</option>
                    <option value="beverages">Beverages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    value={dishForm.prepTimeMinutes || 15}
                    onChange={(e) =>
                      setDishForm({ ...dishForm, prepTimeMinutes: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={dishForm.description || ''}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddDishOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 text-stone-950 font-bold rounded-xl"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEAT WALK-IN GUEST MODAL */}
      {/* ========================================================================= */}
      {seatingTableModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-stone-950/80 backdrop-blur-xs">
          <div className="max-w-sm w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h3 className="text-sm font-bold text-white">
                Seat Guest at {seatingTableModal.tableNumber}
              </h3>
              <button onClick={() => setSeatingTableModal(null)} className="text-stone-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Guest / Family Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sharma Family"
                  value={walkinGuestName}
                  onChange={(e) => setWalkinGuestName(e.target.value)}
                  className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Party Size</label>
                <input
                  type="number"
                  value={walkinPartySize}
                  onChange={(e) => setWalkinPartySize(e.target.value)}
                  className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setSeatingTableModal(null)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateTableStatus(
                      seatingTableModal.id,
                      'occupied',
                      walkinGuestName.trim() || 'Walk-in Guest'
                    )
                  }
                  className="px-4 py-2 bg-emerald-500 text-stone-950 font-bold rounded-xl"
                >
                  Confirm Seating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD COUPON MODAL */}
      {/* ========================================================================= */}
      {isAddCouponOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-stone-950/80 backdrop-blur-xs">
          <div className="max-w-sm w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h3 className="text-sm font-bold text-white">Create Promo Coupon</h3>
              <button onClick={() => setIsAddCouponOpen(false)} className="text-stone-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ROYAL50"
                  value={couponForm.code || ''}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 20% off on first order"
                  value={couponForm.description || ''}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-400 mb-1">Discount %</label>
                  <input
                    type="number"
                    value={couponForm.discountPercent || ''}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, discountPercent: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={couponForm.minOrderValue || 400}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddCouponOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 text-stone-950 font-bold rounded-xl"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD STAFF MEMBER MODAL */}
      {/* ========================================================================= */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-stone-950/80 backdrop-blur-xs">
          <div className="max-w-sm w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h3 className="text-sm font-bold text-white">Add Crew Member</h3>
              <button onClick={() => setIsAddStaffOpen(false)} className="text-stone-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Crew Member Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chef Arvind Mathur"
                  value={staffForm.name || ''}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-400 mb-1">Role</label>
                  <select
                    value={staffForm.role || 'sous_chef'}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as any })}
                    className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                  >
                    <option value="head_chef">Head Chef</option>
                    <option value="sous_chef">Sous Chef</option>
                    <option value="floor_captain">Floor Captain</option>
                    <option value="cashier">Cashier</option>
                    <option value="rider_lead">Rider Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={staffForm.phone || ''}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Station / Department</label>
                <input
                  type="text"
                  placeholder="e.g. Tandoor & Charcoal Deg"
                  value={staffForm.station || ''}
                  onChange={(e) => setStaffForm({ ...staffForm, station: e.target.value })}
                  className="w-full p-2 bg-stone-950 border border-stone-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 text-stone-950 font-bold rounded-xl"
                >
                  Add to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* THERMAL RECEIPT & KOT PRINT MODAL */}
      {/* ========================================================================= */}
      {printingOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-stone-950/85 backdrop-blur-xs font-mono">
          <div className="max-w-sm w-full bg-white text-stone-900 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="text-center space-y-1 border-b border-dashed border-stone-300 pb-3">
              <h2 className="text-base font-bold tracking-tight">MAHESWARI RESTAURANT & HOTEL</h2>
              <p className="text-[10px] text-stone-600">Grand Opening 2026 · Connaught Place, New Delhi</p>
              <p className="text-[10px] text-stone-500">GSTIN: 07AAAAA0000A1Z5 · FSSAI: 13326999000123</p>
              <div className="pt-1 text-[11px] font-bold text-stone-800">
                KITCHEN ORDER TICKET (KOT) / TAX INVOICE
              </div>
            </div>

            <div className="text-[11px] space-y-1">
              <div className="flex justify-between">
                <span>Order No:</span>
                <span className="font-bold">#{printingOrder.orderNumber || printingOrder.id.slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{printingOrder.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="uppercase font-bold">
                  {printingOrder.bookingType}
                  {printingOrder.tableNumber ? ` · ${printingOrder.tableNumber}` : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Guest:</span>
                <span>{printingOrder.customerName || 'Walk-in'}</span>
              </div>
              {printingOrder.deliveryAddress && (
                <div className="text-[10px] text-stone-600 pt-0.5">
                  Address: {printingOrder.deliveryAddress}
                </div>
              )}
            </div>

            <div className="border-t border-b border-dashed border-stone-300 py-2 space-y-1.5 text-[11px]">
              <div className="flex justify-between font-bold text-stone-700">
                <span>Item</span>
                <span>Qty x Price</span>
                <span>Total</span>
              </div>
              {printingOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="truncate pr-1">
                    {item.menuItem?.name || 'Dish'}
                    {item.portion === 'half' ? ' (Half)' : ''}
                  </span>
                  <span className="shrink-0 text-stone-600">
                    {item.quantity} x {item.unitPrice}
                  </span>
                  <span className="shrink-0 font-bold">
                    ₹{item.itemTotal || (item.unitPrice || 0) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-[11px] text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{printingOrder.subtotal}</span>
              </div>
              {printingOrder.gstAmount > 0 && (
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span>₹{printingOrder.gstAmount}</span>
                </div>
              )}
              {printingOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount:</span>
                  <span>-₹{printingOrder.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black border-t border-dashed border-stone-300 pt-1.5">
                <span>GRAND TOTAL:</span>
                <span>₹{printingOrder.grandTotal}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-stone-500 border-t border-dashed border-stone-300 pt-2">
              *** Thank You for Dining with Royal Maheswari ***
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPrintingOrder(null)}
                className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Table Modal */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4 text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h4 className="font-serif-display font-bold text-base text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>{lang === 'hi' ? 'नया टेबल QR कोड जोड़ें' : 'Add New Table QR Code'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAddTableOpen(false)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateNewTable} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-semibold block mb-1">
                  {lang === 'hi' ? 'टेबल का नाम' : 'Table Display Name'}
                </label>
                <input
                  type="text"
                  required
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="e.g. Table 13 or Booth VIP 2"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-semibold block mb-1">
                    {lang === 'hi' ? 'डाइनिंग एरिया / ज़ोन' : 'Dining Area / Zone'}
                  </label>
                  <select
                    value={newTableArea}
                    onChange={(e) => setNewTableArea(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none"
                  >
                    <option value="Window Gallery">Window Gallery</option>
                    <option value="Royal Baithak Hall">Royal Baithak Hall</option>
                    <option value="Heritage Alcove">Heritage Alcove</option>
                    <option value="Center Grand Hall">Center Grand Hall</option>
                    <option value="Garden Courtyard">Garden Courtyard</option>
                    <option value="Executive Booth">Executive Booth</option>
                    <option value="Rooftop Gazebo">Rooftop Gazebo</option>
                    <option value="Mezzanine Terrace">Mezzanine Terrace</option>
                  </select>
                </div>
                <div>
                  <label className="text-stone-300 font-semibold block mb-1">
                    {lang === 'hi' ? 'सीटिंग क्षमता' : 'Seating Capacity'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-stone-300 font-semibold block mb-1">
                  {lang === 'hi' ? 'विवरण (वैकल्पिक)' : 'Description / View (Optional)'}
                </label>
                <input
                  type="text"
                  value={newTableDesc}
                  onChange={(e) => setNewTableDesc(e.target.value)}
                  placeholder="e.g. Near marble fountain, chandelier view"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none"
                />
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-stone-300 text-[11px]">
                🛡️ {lang === 'hi'
                  ? 'इस टेबल के लिए एक नया क्रिप्टोग्राफिक सुरक्षा टोकन स्वचालित रूप से उत्पन्न होगा।'
                  : 'A unique cryptographic security token will be generated automatically for this table to prevent spoofing.'}
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTableOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 cursor-pointer"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-bold hover:bg-amber-300 cursor-pointer"
                >
                  {lang === 'hi' ? 'उत्पन्न करें व जोड़ें' : 'Generate & Add Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Acrylic Stand Preview Modal */}
      {(printingTable || printAllStands) && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white text-stone-950 rounded-3xl shadow-2xl overflow-hidden p-6 max-h-[92vh] flex flex-col justify-between">
            {/* Header controls (hidden on print) */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4 print:hidden">
              <div>
                <h4 className="font-serif-display font-bold text-base text-stone-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-amber-600" />
                  <span>
                    {printAllStands
                      ? `Print All Acrylic Stands (${registeredTables.filter((t) => t.isActive).length} Active Tables)`
                      : `Print Acrylic Stand: ${printingTable?.name}`}
                  </span>
                </h4>
                <p className="text-xs text-stone-500">
                  Formatted for high-resolution acrylic photo stands (4x6&quot; or 5x7&quot;).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-stone-950 text-white font-bold text-xs hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Send to Printer</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPrintingTable(null);
                    setPrintAllStands(false);
                  }}
                  className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Stand Graphic Body */}
            <div className="overflow-y-auto p-4 space-y-8 flex-1 print:p-0 print:space-y-6">
              {(printAllStands ? registeredTables.filter((t) => t.isActive) : (printingTable ? [printingTable] : [])).map((tbl) => {
                const qrUrl = tableQrDataUrls[tbl.id];
                return (
                  <div
                    key={tbl.id}
                    className="p-6 bg-white text-stone-950 rounded-3xl shadow-lg border-4 border-amber-400 max-w-sm mx-auto text-center space-y-3.5 print:shadow-none print:break-after-page"
                  >
                    <div className="flex justify-center">
                      <PalaceLogo size="md" />
                    </div>
                    <div>
                      <h4 className="font-serif-display font-extrabold text-lg tracking-wide text-stone-900">
                        MAHESWARI
                      </h4>
                      <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-amber-800 block">
                        Multi Cuisine Restaurant • 100% Pure Veg
                      </span>
                    </div>

                    <div className="py-1">
                      <div className="inline-block px-5 py-1.5 rounded-full bg-stone-950 text-white font-mono font-extrabold text-base shadow-sm">
                        {tbl.name.toUpperCase()}
                      </div>
                      <span className="text-[11px] text-stone-500 block mt-1 font-medium">
                        {tbl.area} • Connaught Place
                      </span>
                    </div>

                    {/* QR Stand Display */}
                    <div className="bg-stone-50 p-3 rounded-2xl border-2 border-stone-200 inline-block shadow-inner">
                      {qrUrl ? (
                        <img src={qrUrl} alt={tbl.name} className="w-44 h-44 object-contain mx-auto" />
                      ) : (
                        <div className="w-44 h-44 flex items-center justify-center">
                          <QrCode className="w-16 h-16 text-stone-300" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-stone-900 block flex items-center justify-center gap-1 font-serif-display">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Scan with any camera app to order directly</span>
                      </span>
                      <p className="text-[10px] text-stone-600 max-w-xs mx-auto leading-relaxed">
                        Orders are verified and automatically reach the kitchen chefs for fast preparation.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[9px] font-mono text-stone-400">
                      <span>Token: {tbl.securityToken.substring(0, 10)}...</span>
                      <span>Verified Table Stand</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Render Dedicated Staff Department Portal when launched specifically for an assigned staff member */}
      {selectedStaffPortal && (
        <StaffDepartmentPortal
          isOpen={!!selectedStaffPortal}
          onClose={() => setSelectedStaffPortal(null)}
          staff={selectedStaffPortal}
          orders={orders}
          menuItems={menuItems}
          diningTables={diningTables}
          reservations={reservations}
          lang={lang}
          onChefMarkPrepared={handleChefMarkPrepared}
          onChefStartCooking={(orderId) => handleUpdateOrderStatus(orderId, 'cooking')}
          onWaiterMarkServed={handleWaiterMarkServed}
          onWaiterHandoverDelivery={handleWaiterHandoverDelivery}
          onRiderStartDelivery={handleRiderStartDelivery}
          onRiderCompleteDelivery={handleRiderCompleteDelivery}
          onWaiterPunchOrder={handleWaiterPunchNewOrder}
          onUpdateReservationStatus={handleUpdateReservationStatus}
          onToggleDishAvailability={handleToggleDishAvailability}
          showNotification={showNotification}
        />
      )}
    </div>
  );
};
