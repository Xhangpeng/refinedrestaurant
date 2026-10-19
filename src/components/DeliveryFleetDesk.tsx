import React, { useState } from 'react';
import {
  Bike,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Navigation,
  DollarSign,
  PackageCheck,
  Search,
  AlertCircle,
  Receipt,
  User,
} from 'lucide-react';
import { Order } from '../types/restaurant';

interface Props {
  orders: Order[];
  riderName: string;
  lang: 'en' | 'hi';
  onStartDelivery: (orderId: string) => void;
  onCompleteDelivery: (orderId: string) => void;
  showNotification: (msg: string) => void;
}

export const DeliveryFleetDesk: React.FC<Props> = ({
  orders,
  riderName,
  lang,
  onStartDelivery,
  onCompleteDelivery,
  showNotification,
}) => {
  const [filterTab, setFilterTab] = useState<'active' | 'ready' | 'transit' | 'completed'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Delivery orders only
  const deliveryOrders = orders.filter((o) => o.bookingType === 'delivery');

  const readyOrders = deliveryOrders.filter((o) => o.orderStatus === 'ready_for_dispatch');
  const inTransitOrders = deliveryOrders.filter((o) => o.orderStatus === 'out_for_delivery');
  const deliveredOrders = deliveryOrders.filter((o) => o.orderStatus === 'completed');

  const activeOrders = [...readyOrders, ...inTransitOrders];

  const displayedOrders = (
    filterTab === 'active'
      ? activeOrders
      : filterTab === 'ready'
      ? readyOrders
      : filterTab === 'transit'
      ? inTransitOrders
      : deliveredOrders
  ).filter((o) =>
    searchQuery
      ? o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (o.deliveryAddress && o.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  );

  const totalDeliveredToday = deliveredOrders.length;
  const totalCashToCollect = activeOrders
    .filter((o) => o.paymentMethod === 'cod' && o.paymentStatus !== 'paid')
    .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

  return (
    <div className="space-y-5">
      {/* Top Rider Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-stone-900 border border-purple-500/30">
          <div className="flex items-center gap-2 text-purple-400 text-xs mb-1">
            <Bike className="w-4 h-4" />
            <span>Ready at Counter</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-white">
            {readyOrders.length}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-900 border border-blue-500/30">
          <div className="flex items-center gap-2 text-blue-400 text-xs mb-1">
            <Navigation className="w-4 h-4" />
            <span>On the Road</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-white">
            {inTransitOrders.length}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-900 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-400 text-xs mb-1">
            <PackageCheck className="w-4 h-4" />
            <span>Delivered Today</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-300">
            {totalDeliveredToday}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-900 border border-amber-500/30">
          <div className="flex items-center gap-2 text-amber-400 text-xs mb-1">
            <DollarSign className="w-4 h-4" />
            <span>COD to Collect</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-amber-300">
            ₹{totalCashToCollect}
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'active', labelHi: '🔥 चालू डिलीवरी (Active)', labelEn: `🔥 Active (${activeOrders.length})` },
            { id: 'ready', labelHi: '📦 तैयार (Ready)', labelEn: `Ready for Pickup (${readyOrders.length})` },
            { id: 'transit', labelHi: '🛵 रास्ते में (On Road)', labelEn: `On Road (${inTransitOrders.length})` },
            { id: 'completed', labelHi: '✅ पूर्ण (Done)', labelEn: `Delivered (${deliveredOrders.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {lang === 'hi' ? tab.labelHi : tab.labelEn}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address or order #..."
            className="pl-8 pr-3 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-purple-400"
          />
        </div>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-stone-950/70 border border-stone-800 space-y-2">
          <Bike className="w-8 h-8 text-stone-600 mx-auto" />
          <div className="text-xs text-stone-400 font-medium">
            {lang === 'hi' ? 'कोई डिलीवरी ऑर्डर नहीं मिला' : 'No delivery orders in this status'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayedOrders.map((order) => {
            const isReady = order.orderStatus === 'ready_for_dispatch';
            const isInTransit = order.orderStatus === 'out_for_delivery';
            const isDelivered = order.orderStatus === 'completed';

            const isCod = order.paymentMethod === 'cod';

            return (
              <div
                key={order.id}
                className={`p-4 rounded-2xl border shadow-xl flex flex-col justify-between gap-3.5 transition-all ${
                  isReady
                    ? 'bg-stone-900/95 border-amber-500/50 ring-1 ring-amber-400/30'
                    : isInTransit
                    ? 'bg-stone-900/95 border-blue-500/50 ring-1 ring-blue-400/30'
                    : 'bg-stone-950/70 border-stone-800/80 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-xs">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase ${
                          isReady
                            ? 'bg-amber-400 text-stone-950'
                            : isInTransit
                            ? 'bg-blue-500 text-white animate-pulse'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {isReady ? 'Packed & Ready' : isInTransit ? 'In Transit' : 'Delivered'}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-stone-400">
                      ₹{order.grandTotal} • {isCod ? '💵 COD' : '✅ Paid UPI'}
                    </div>
                  </div>

                  {/* Customer & Address */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span className="text-xs font-bold text-white">{order.customerName}</span>
                      </div>

                      {order.customerPhone && (
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-start gap-2 text-xs text-stone-300 bg-stone-950 p-2.5 rounded-xl border border-stone-800/80">
                      <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="font-medium text-stone-200">
                          {order.deliveryAddress || 'Connaught Place, Central Delhi, 110001'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Line items brief */}
                  <div className="text-[11px] text-stone-400 font-mono border-t border-stone-800/60 pt-2 flex items-center justify-between">
                    <span>
                      {order.items.length} dishes: {order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).slice(0, 2).join(', ')}
                      {order.items.length > 2 && '...'}
                    </span>
                    <span className="font-bold text-amber-300">
                      ₹{order.grandTotal}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-1">
                  {isReady && (
                    <button
                      type="button"
                      onClick={() => onStartDelivery(order.id)}
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 cursor-pointer active:scale-98 transition-all"
                    >
                      <Bike className="w-4 h-4" />
                      <span>{lang === 'hi' ? '🛵 पार्सल पिक करें व निकलें' : '🛵 Pick Up & Start Delivery'}</span>
                    </button>
                  )}

                  {isInTransit && (
                    <button
                      type="button"
                      onClick={() => onCompleteDelivery(order.id)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-98 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {isCod
                          ? (lang === 'hi' ? `✅ डिलीवर हुआ व ₹${order.grandTotal} कैश प्राप्त` : `✅ Mark Delivered & Cash Collected (₹${order.grandTotal})`)
                          : (lang === 'hi' ? '✅ सफलतापूर्वक डिलीवर हुआ' : '✅ Mark Delivered')}
                      </span>
                    </button>
                  )}

                  {isDelivered && (
                    <div className="w-full py-1.5 text-center text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      Delivered by {order.assignedRider || riderName}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
