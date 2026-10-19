import React, { useState } from 'react';
import {
  X,
  Flame,
  UtensilsCrossed,
  Calendar,
  Bike,
  Clock,
  CheckCircle2,
  AlertCircle,
  Printer,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  ShieldCheck,
  ChefHat,
  Bell,
  RefreshCw,
  LogOut,
  Store,
  Tag,
  ArrowRight,
  Layers,
} from 'lucide-react';
import {
  Order,
  MenuItem,
  DiningTable,
  TableBookingDetails,
  DepartmentType,
  CartItem,
  SpiceLevel,
} from '../types/restaurant';
import { WaiterDesk } from './WaiterDesk';
import { DeliveryFleetDesk } from './DeliveryFleetDesk';
import { PalaceLogo } from './PalaceLogo';

export interface StaffMemberInfo {
  id: string;
  name: string;
  role: string;
  department: DepartmentType;
  station: string;
  phone: string;
  shiftStatus: 'on_shift' | 'off_duty';
  pin?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMemberInfo;
  orders: Order[];
  menuItems: MenuItem[];
  diningTables: DiningTable[];
  reservations: TableBookingDetails[];
  lang: 'hi' | 'en';
  onChefMarkPrepared: (order: Order) => void;
  onChefStartCooking: (orderId: string) => void;
  onWaiterMarkServed: (orderId: string) => void;
  onWaiterHandoverDelivery: (orderId: string) => void;
  onRiderStartDelivery: (orderId: string) => void;
  onRiderCompleteDelivery: (orderId: string) => void;
  onWaiterPunchOrder: (newOrder: Partial<Order>) => void;
  onUpdateReservationStatus: (resId: string, status: TableBookingDetails['status'], tableNum?: string) => void;
  onToggleDishAvailability: (dishId: string) => void;
  onSaveDish?: (dish: MenuItem) => void;
  onDeleteDish?: (dishId: string) => void;
  showNotification: (msg: string) => void;
}

export const StaffDepartmentPortal: React.FC<Props> = ({
  isOpen,
  onClose,
  staff,
  orders,
  menuItems,
  diningTables,
  reservations,
  lang,
  onChefMarkPrepared,
  onChefStartCooking,
  onWaiterMarkServed,
  onWaiterHandoverDelivery,
  onRiderStartDelivery,
  onRiderCompleteDelivery,
  onWaiterPunchOrder,
  onUpdateReservationStatus,
  onToggleDishAvailability,
  onSaveDish,
  onDeleteDish,
  showNotification,
}) => {
  // Booking & Menu sub-tab state (Only used when department is booking_menu)
  const [bookingMenuTab, setBookingMenuTab] = useState<'reservations' | 'menu'>('reservations');
  const [orderSearch, setOrderSearch] = useState('');
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategory, setMenuCategory] = useState('all');

  if (!isOpen) return null;

  const department = staff.department || 'kitchen';

  // Filter kitchen orders: kitchen sees placed, confirmed, cooking, and ready
  const kitchenOrders = orders.filter((o) =>
    ['placed', 'confirmed', 'cooking', 'ready_at_table', 'ready_for_dispatch'].includes(o.orderStatus)
  ).filter((o) =>
    orderSearch.trim() === '' ||
    (o.orderNumber && o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase())) ||
    (o.tableNumber && o.tableNumber.toLowerCase().includes(orderSearch.toLowerCase())) ||
    (o.customerName && o.customerName.toLowerCase().includes(orderSearch.toLowerCase()))
  );

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCat = menuCategory === 'all' ? true : item.category === menuCategory;
    const matchesSearch =
      menuSearch.trim() === '' ||
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      (item.hindiName && item.hindiName.includes(menuSearch));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-2 md:p-4 bg-stone-950/95 backdrop-blur-md animate-fadeIn overflow-hidden font-sans-body">
      <div className="relative w-full max-w-7xl h-full sm:h-[95vh] bg-stone-900 border-0 sm:border sm:border-stone-800 rounded-none sm:rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col">
        
        {/* ========================================================================= */}
        {/* SPECIFIC DEPARTMENT HEADER */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-stone-950 border-b border-stone-800 shrink-0 gap-2">
          {/* Left: Department Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <PalaceLogo size="responsive" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm md:text-base font-serif-display font-bold text-amber-200 truncate">
                  MAHESWARI MULTI CUISINE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {staff.shiftStatus === 'on_shift' ? '● Live Shift' : '○ Off Duty'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-stone-400 font-mono truncate">
                <span className="font-bold text-amber-400">{staff.name}</span>
                <span>·</span>
                <span className="text-stone-300">{staff.station}</span>
              </div>
            </div>
          </div>

          {/* Department Role Badge */}
          <div className="flex items-center gap-2 shrink-0">
            {department === 'kitchen' && (
              <span className="px-2.5 py-1 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'रसोई विभाग (हेड शेफ)' : 'Kitchen Department'}</span>
                <span className="sm:hidden">Kitchen</span>
              </span>
            )}

            {department === 'waiter' && (
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'वेटर विभाग (फ्लोर कैप्टन)' : 'Waiter Department'}</span>
                <span className="sm:hidden">Waiters</span>
              </span>
            )}

            {department === 'booking_menu' && (
              <span className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'बुकिंग व मेन्यू आपूर्ति विभाग' : 'Booking & Menu Supply'}</span>
                <span className="sm:hidden">Booking & Menu</span>
              </span>
            )}

            {department === 'delivery' && (
              <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'डिलीवरी बॉय सेक्शन' : 'Delivery Fleet'}</span>
                <span className="sm:hidden">Delivery</span>
              </span>
            )}

            {/* Exit/Close back to main view */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              title="Close Portal"
              aria-label="Close Portal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUB-HEADER / TAB NAVIGATION FOR BOOKING & MENU SUPPLY */}
        {/* ========================================================================= */}
        {department === 'booking_menu' && (
          <div className="flex items-center justify-between px-3 sm:px-6 py-2 bg-stone-950/80 border-b border-stone-800 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBookingMenuTab('reservations')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  bookingMenuTab === 'reservations'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'टेबल आरक्षण (Bookings)' : 'Table Bookings'}</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-stone-950/40 font-mono">
                  {reservations.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBookingMenuTab('menu')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  bookingMenuTab === 'menu'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'मेन्यू आपूर्ति व स्टॉक (Supply Editing)' : 'Menu Supply & Stock'}</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-stone-950/40 font-mono">
                  {menuItems.length}
                </span>
              </button>
            </div>
            <div className="text-[11px] font-mono text-stone-400 hidden sm:block">
              {lang === 'hi' ? 'केवल बुकिंग व मेन्यू आपूर्ति अनुभाग' : 'Strict Desk Access: Bookings & Menu Catalog Only'}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN BODY: STRICT DEPARTMENT CONTENT ONLY */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
          {/* ======================================================================= */}
          {/* 1. KITCHEN DEPARTMENT (CHEF) — STRICT ACCESS TO KITCHEN ITEMS ONLY */}
          {/* ======================================================================= */}
          {department === 'kitchen' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-1">
                <div>
                  <h3 className="text-sm sm:text-base font-serif-display font-bold text-amber-200 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>{lang === 'hi' ? 'रसोई लाइव ऑर्डर और पकाने की सूची' : 'Kitchen Display System (KDS)'}</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    {lang === 'hi'
                      ? 'नए आए ऑर्डर देखें, पकाना शुरू करें और खाना तैयार होने पर वेटर/डिलीवरी को सूचित करें'
                      : 'Orders that have come in, what to make, taking orders and marking food prepared'}
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={lang === 'hi' ? 'टेबल या ऑर्डर नंबर खोजें...' : 'Search table or order #...'}
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-orange-400"
                  />
                </div>
              </div>

              {kitchenOrders.length === 0 ? (
                <div className="p-8 rounded-2xl bg-stone-950 border border-stone-800 text-center py-16 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
                  <h4 className="text-sm font-bold text-stone-200">
                    {lang === 'hi' ? 'सभी ऑर्डर तैयार हैं!' : 'All Kitchen Orders Fulfilled!'}
                  </h4>
                  <p className="text-xs text-stone-400">
                    {lang === 'hi'
                      ? 'डाइनिंग टेबल या ऑनलाइन से नए ऑर्डर आने पर वे सीधे इस स्क्रीन पर दिखेंगे।'
                      : 'New incoming orders from tables or online will automatically appear on this station.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {kitchenOrders.map((order) => {
                    let parsedItems: CartItem[] = [];
                    try {
                      parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || [];
                    } catch {
                      parsedItems = [];
                    }

                    const isPlaced = order.orderStatus === 'placed';
                    const isConfirmed = order.orderStatus === 'confirmed';
                    const isCooking = order.orderStatus === 'cooking';
                    const isReady = order.orderStatus === 'ready_at_table' || order.orderStatus === 'ready_for_dispatch';
                    const isDineIn = order.bookingType === 'dine_in';

                    return (
                      <div
                        key={order.id}
                        className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                          isCooking
                            ? 'bg-amber-950/25 border-orange-500/60 shadow-lg ring-1 ring-orange-500/30'
                            : isPlaced
                            ? 'bg-rose-950/25 border-rose-500/60 shadow-md animate-pulse ring-1 ring-rose-500/30'
                            : isReady
                            ? 'bg-emerald-950/20 border-emerald-500/50'
                            : 'bg-stone-950 border-stone-800'
                        }`}
                      >
                        <div>
                          {/* Order header */}
                          <div className="flex items-start justify-between pb-2 border-b border-stone-800/80 gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-mono font-bold text-amber-400">
                                  #{order.orderNumber || order.id.slice(-6)}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                                  isDineIn
                                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                }`}>
                                  {isDineIn ? `🍽️ ${order.tableNumber || 'Dine-in'}` : '🛵 Delivery'}
                                </span>
                              </div>
                              <div className="text-[10px] text-stone-400 font-mono mt-0.5 flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-stone-500" />
                                <span>{order.createdAt}</span>
                                {order.preparedAt && (
                                  <span className="text-emerald-400">· Ready at {order.preparedAt}</span>
                                )}
                              </div>
                            </div>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono shrink-0 ${
                              isPlaced
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : isCooking
                                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                                : isReady
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-stone-800 text-stone-300'
                            }`}>
                              {order.orderStatus.replace('_', ' ')}
                            </span>
                          </div>

                          {/* Customer & Notes */}
                          <div className="py-2 border-b border-stone-800/60 text-xs">
                            <span className="font-bold text-stone-200">
                              {order.customerName || order.customer?.name || 'Walk-in Guest'}
                            </span>
                            {order.notes && (
                              <p className="text-[11px] text-amber-300/90 italic mt-0.5">
                                📝 Note: "{order.notes}"
                              </p>
                            )}
                          </div>

                          {/* Dishes Checklist (What to make) */}
                          <div className="pt-2 space-y-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block">
                              {lang === 'hi' ? 'व्यंजन सूची (Items to Prepare):' : 'Items to Prepare:'}
                            </span>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {parsedItems.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs gap-2"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-300 font-mono font-bold flex items-center justify-center text-xs shrink-0 border border-orange-500/30">
                                      {item.quantity || 1}x
                                    </span>
                                    <div className="min-w-0">
                                      <span className="font-bold text-white block truncate">
                                        {item.menuItem?.name || (item as any).name || 'Dish'}
                                      </span>
                                      <div className="text-[10px] text-stone-400 flex items-center gap-2 font-mono">
                                        <span>{item.portion === 'half' ? 'Half' : 'Full'}</span>
                                        <span>·</span>
                                        <span className="text-orange-400">
                                          {item.spiceLevel === 3
                                            ? '🔥 Desi Hot'
                                            : item.spiceLevel === 2
                                            ? '🌶️ Spicy'
                                            : item.spiceLevel === 1
                                            ? 'Medium'
                                            : 'Mild'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Chef Actions */}
                        <div className="pt-3 border-t border-stone-800 flex items-center gap-2">
                          {(isPlaced || isConfirmed) && (
                            <button
                              type="button"
                              onClick={() => onChefStartCooking(order.id)}
                              className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Flame className="w-3.5 h-3.5" />
                              <span>{lang === 'hi' ? 'पकाना शुरू करें (Start Cooking)' : 'Start Cooking 🔥'}</span>
                            </button>
                          )}

                          {isCooking && (
                            <button
                              type="button"
                              onClick={() => onChefMarkPrepared(order)}
                              className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>
                                {isDineIn
                                  ? (lang === 'hi' ? 'खाना तैयार है (वेटर को बुलाएं) 🍽️' : 'Food Ready (Alert Waiter) 🍽️')
                                  : (lang === 'hi' ? 'पार्सल तैयार (राइडर को दें) 🛵' : 'Ready for Dispatch 🛵')}
                              </span>
                            </button>
                          )}

                          {isReady && (
                            <div className="w-full py-1.5 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-center text-xs font-bold text-emerald-300">
                              {isDineIn
                                ? (lang === 'hi' ? '✓ वेटर को सूचित किया गया — टेबल परोसें' : '✓ Waiter Alerted — Serving to Table')
                                : (lang === 'hi' ? '✓ डिलीवरी राइडर को सूचित किया गया' : '✓ Ready at Counter for Rider')}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================================= */}
          {/* 2. WAITER DEPARTMENT (WAITER DESK ONLY) */}
          {/* ======================================================================= */}
          {department === 'waiter' && (
            <div>
              <WaiterDesk
                orders={orders}
                menuItems={menuItems}
                diningTables={diningTables}
                lang={lang}
                waiterName={staff.name}
                onOrderPunched={onWaiterPunchOrder}
                onMarkServed={onWaiterMarkServed}
                onHandoverDelivery={onWaiterHandoverDelivery}
                showNotification={showNotification}
              />
            </div>
          )}

          {/* ======================================================================= */}
          {/* 3. BOOKING MANAGING & MENU SUPPLY MANAGING ONLY */}
          {/* ======================================================================= */}
          {department === 'booking_menu' && (
            <div className="space-y-4">
              {bookingMenuTab === 'reservations' ? (
                /* Table Bookings view */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-1">
                    <div>
                      <h3 className="text-sm sm:text-base font-serif-display font-bold text-white">
                        {lang === 'hi' ? 'टेबल बुकिंग और आरक्षण प्रबंधन' : 'Table Bookings & Guest Reservations'}
                      </h3>
                      <p className="text-xs text-stone-400">
                        {lang === 'hi'
                          ? 'शाही बैठक, आंगन और मुख्य हॉल के अग्रिम आरक्षण देखें व मेहमान बैठाएं'
                          : 'Manage table bookings, guest allocations & seating status.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {reservations.map((res) => (
                      <div
                        key={res.id}
                        className="p-4 rounded-2xl border border-stone-800 bg-stone-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-blue-400">
                              #{res.bookingNumber || res.id}
                            </span>
                            <span className="font-bold text-white text-sm">
                              {res.guestName}
                            </span>
                            <a
                              href={`tel:${res.guestPhone}`}
                              className="text-xs font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-stone-900 px-2 py-0.5 rounded border border-stone-800"
                            >
                              <Phone className="w-3 h-3 text-amber-400" />
                              <span>{res.guestPhone}</span>
                            </a>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40">
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
                              onClick={() => onUpdateReservationStatus(res.id!, 'seated', 'Table 4')}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                              {lang === 'hi' ? 'मेहमान बैठाएं (Seat)' : 'Seat Guests'}
                            </button>
                          )}
                          {res.status === 'seated' && (
                            <button
                              type="button"
                              onClick={() => onUpdateReservationStatus(res.id!, 'completed')}
                              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                              {lang === 'hi' ? 'पूरा हुआ (Complete)' : 'Mark Finished'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Menu Section & Supply Editing view */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-1">
                    <div>
                      <h3 className="text-sm sm:text-base font-serif-display font-bold text-white">
                        {lang === 'hi' ? 'मेन्यू आपूर्ति और स्टॉक उपलब्धता' : 'Menu Supply & Inventory Management'}
                      </h3>
                      <p className="text-xs text-stone-400">
                        {lang === 'hi'
                          ? 'व्यंजन उपलब्धता टॉगल (स्टॉक / 86 सोल्ड आउट) व मूल्य एडिट करें'
                          : 'Edit dish availability (In Stock / Sold Out 86) and pricing.'}
                      </p>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={lang === 'hi' ? 'व्यंजन खोजें...' : 'Search dish...'}
                        value={menuSearch}
                        onChange={(e) => setMenuSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredMenuItems.map((dish) => (
                      <div
                        key={dish.id}
                        className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                          dish.isAvailable !== false
                            ? 'bg-stone-950 border-stone-800'
                            : 'bg-rose-950/20 border-rose-500/40 opacity-75'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={dish.image || '/src/assets/images/dish_butter_chicken_curry_1792103747214.webp'}
                            alt={dish.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-800"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{dish.name}</h4>
                            {dish.hindiName && (
                              <div className="text-[11px] text-amber-300 font-sans-body truncate">{dish.hindiName}</div>
                            )}
                            <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                              ₹{dish.price} {dish.halfPrice ? `· Half: ₹${dish.halfPrice}` : ''}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => onToggleDishAvailability(dish.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              dish.isAvailable !== false
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                            }`}
                          >
                            {dish.isAvailable !== false
                              ? (lang === 'hi' ? '✓ उपलब्ध (In Stock)' : '✓ In Stock')
                              : (lang === 'hi' ? '✕ समाप्त (Sold Out 86)' : '✕ Sold Out (86)')}
                          </button>

                          <span className="text-[10px] text-stone-400 font-mono">
                            ⏱️ {dish.prepTimeMinutes || 15}m prep
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================================= */}
          {/* 4. DELIVERY BOY SECTION (DELIVERY FLEET DESK ONLY) */}
          {/* ======================================================================= */}
          {department === 'delivery' && (
            <div>
              <DeliveryFleetDesk
                orders={orders}
                riderName={staff.name}
                lang={lang}
                onStartDelivery={onRiderStartDelivery}
                onCompleteDelivery={onRiderCompleteDelivery}
                showNotification={showNotification}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
