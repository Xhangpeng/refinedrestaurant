/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Flame,
  Plus,
  Minus,
  Check,
  QrCode,
  Utensils,
  Leaf,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  MenuItem,
  CartItem,
  BookingType,
  MenuSectionType,
  SpiceLevel
} from '../types/restaurant';
import { MENU_ITEMS, MENU_CATEGORIES } from '../data/menuData';

interface Props {
  bookingType: BookingType;
  onChangeBookingType: (type: BookingType) => void;
  activeTable?: string | null;
  onOpenQrScanner: () => void;
  onClearActiveTable: () => void;
  activeMenuSection: MenuSectionType;
  onChangeMenuSection: (section: MenuSectionType) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onAddToCart: (item: MenuItem, portion: 'full' | 'half', spice: SpiceLevel) => void;
  onOpenItemModal: (item: MenuItem) => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
}

export const MenuSection: React.FC<Props> = ({
  bookingType,
  onChangeBookingType,
  activeTable,
  onOpenQrScanner,
  onClearActiveTable,
  activeMenuSection,
  onChangeMenuSection,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  onOpenItemModal,
  cartItems,
  onUpdateQuantity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJainOnly, setFilterJainOnly] = useState(false);

  // Filter items based on active section, category, search, and dietary badges
  const filteredDishes = useMemo(() => {
    return MENU_ITEMS.filter((dish) => {
      // Section filter
      if (activeMenuSection !== 'all_day' && dish.section !== activeMenuSection) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && dish.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesHindi = dish.hindiName?.toLowerCase().includes(query);
        const matchesDesc = dish.description.toLowerCase().includes(query);
        const matchesTags = dish.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesHindi && !matchesDesc && !matchesTags) {
          return false;
        }
      }
      // Jain filter
      if (filterJainOnly && !dish.isJainAvailable) {
        return false;
      }
      return true;
    });
  }, [activeMenuSection, selectedCategory, searchQuery, filterJainOnly]);

  const sectionsList: { id: MenuSectionType; label: string; icon: string; badge?: string }[] = [
    { id: 'all_day', label: 'All Day Menu', icon: '🍽️' },
    { id: 'royal_thali', label: 'Maharaja Thali', icon: '👑', badge: 'Special' },
    { id: 'lunch_buffet', label: 'Lunch Buffet', icon: '🥘', badge: '12-4 PM' },
    { id: 'desserts_beverages', label: 'Desserts & Drinks', icon: '🍨' },
  ];

  return (
    <section id="menu" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* QR Order Flow Banner (Highlights the Automatic Acceptance Model) */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-950 to-amber-950 border border-amber-500/30 text-stone-100 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase font-bold border border-emerald-500/40">
                ✨ Auto Kitchen Acceptance
              </span>
              <span className="text-amber-400 text-xs font-semibold">Direct to Chef KDS</span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif-display font-bold text-white">
              {activeTable ? `Connected to ${activeTable}` : 'Order Directly From Your Table'}
            </h2>
            <p className="text-xs text-stone-300 max-w-xl">
              {activeTable
                ? 'Your table is verified. Items added and confirmed go straight to the kitchen tandoor & curries station. Your waiter will serve directly to your seat.'
                : 'Scan the official acrylic QR stand on your dining table to automatically link your seat and dispatch orders directly to the kitchen.'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {activeTable ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenQrScanner}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan New QR</span>
                </button>
                <button
                  type="button"
                  onClick={onClearActiveTable}
                  className="px-2.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                  title="Switch to takeaway"
                >
                  Takeaway
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenQrScanner}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <QrCode className="w-4 h-4 stroke-[2.5]" />
                <span>Scan Table QR Code</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu Sections Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
        {sectionsList.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => onChangeMenuSection(sec.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeMenuSection === sec.id
                ? 'bg-amber-500 text-stone-950 shadow-sm shadow-amber-500/20'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            <span>{sec.icon}</span>
            <span>{sec.label}</span>
            {sec.badge && (
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase font-mono font-bold ${
                  activeMenuSection === sec.id
                    ? 'bg-stone-950 text-amber-300'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {sec.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search Bar & Category Filter Bar */}
      <div className="mt-4 space-y-3">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes (Dal, Naan, Paneer, Dosa)..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-amber-300 font-bold shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span className="text-sm leading-none">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="mt-4 sm:mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-500 font-mono">
            Available Dishes ({filteredDishes.length})
          </h3>
          <span className="text-xs text-stone-500">
            {activeTable ? `Serving to: ${activeTable}` : 'Takeaway / In-Restaurant'}
          </span>
        </div>

        {filteredDishes.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
            <Utensils className="w-10 h-10 text-stone-300 mx-auto" />
            <h4 className="font-serif-display text-base font-bold text-stone-800">
              No dishes found matching your search
            </h4>
            <p className="text-xs text-stone-500">Try adjusting your query or resetting category filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
                onChangeMenuSection('all_day');
              }}
              className="px-4 py-2 bg-amber-400 text-stone-950 rounded-xl text-xs font-bold hover:bg-amber-300 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {filteredDishes.map((dish) => {
              const inCartItems = cartItems.filter((ci) => ci.menuItem.id === dish.id);
              const totalQuantityInCart = inCartItems.reduce((acc, ci) => acc + ci.quantity, 0);
              const prepMinutes = dish.preparationTimeMinutes || (dish as any).prepTimeMinutes;

              return (
                <div
                  key={dish.id}
                  className="bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-400/50 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Dish Image + Badges */}
                    <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                        {dish.isBestseller && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-stone-950 text-[9px] font-extrabold uppercase tracking-wide shadow-2xs">
                            Top
                          </span>
                        )}
                        {dish.isChefSpecial && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wide shadow-2xs">
                            Special
                          </span>
                        )}
                      </div>

                      {/* Pure Veg / Dietary Green Dot */}
                      <div className="absolute top-1.5 right-1.5 bg-white/95 p-0.5 rounded shadow-2xs flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-emerald-600 rounded-xs flex items-center justify-center p-0.5">
                          <div className="w-1 h-1 bg-emerald-600 rounded-full" />
                        </div>
                      </div>

                      {/* Prep time badge */}
                      {prepMinutes && (
                        <div className="absolute bottom-1 right-1.5 text-[9px] text-stone-100 flex items-center gap-0.5 bg-stone-950/80 px-1.5 py-0.5 rounded font-mono backdrop-blur-2xs">
                          <Clock className="w-2.5 h-2.5 text-amber-400" />
                          <span>{prepMinutes}m</span>
                        </div>
                      )}
                    </div>

                    {/* Dish Text Details - Compact, Clean & Well-Proportioned */}
                    <div className="p-2 sm:p-2.5 pb-1 space-y-0.5">
                      <h4 className="font-serif-display font-bold text-stone-900 text-xs sm:text-[13px] leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors">
                        {dish.name}
                      </h4>
                      {dish.hindiName && (
                        <span className="text-[10px] text-stone-500 font-medium truncate block leading-tight">
                          {dish.hindiName}
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-700 font-semibold pt-0.5">
                        <span className="flex items-center gap-0.5 text-amber-600">
                          <span>★</span>
                          <span>4.9</span>
                        </span>
                        <span className="text-stone-400 text-[9px] font-normal">(100+)</span>
                        {dish.isJainAvailable && (
                          <span className="ml-auto text-[9px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-medium border border-emerald-200/60">
                            Jain
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price Bar - Sleek, Balanced, Attractive Add Icon */}
                  <div className="p-2 pt-1.5 sm:p-2.5 sm:pt-1.5 flex items-center justify-between gap-1.5 border-t border-stone-100 bg-stone-50/50">
                    <div>
                      <div className="font-mono font-bold text-xs sm:text-[13px] text-stone-950 leading-none">
                        ₹{dish.price}
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenItemModal(dish)}
                        className="text-[9.5px] text-stone-500 hover:text-amber-800 font-medium block mt-0.5 cursor-pointer leading-tight transition-colors"
                      >
                        Customise ›
                      </button>
                    </div>

                    {totalQuantityInCart > 0 ? (
                      <div className="flex items-center bg-stone-950 text-white rounded-lg shadow-2xs overflow-hidden h-6 border border-stone-800">
                        <button
                          type="button"
                          onClick={() => {
                            const first = inCartItems[0];
                            if (first) {
                              onUpdateQuantity(first.cartItemId, first.quantity - 1);
                            }
                          }}
                          className="w-5 h-6 flex items-center justify-center hover:bg-stone-800 text-amber-400 active:scale-90 transition-transform cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-4.5 text-center text-[10.5px] font-mono font-bold text-amber-300">
                          {totalQuantityInCart}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const first = inCartItems[0];
                            if (first) {
                              onUpdateQuantity(first.cartItemId, first.quantity + 1);
                            } else {
                              onAddToCart(dish, 'full', 1);
                            }
                          }}
                          className="w-5 h-6 flex items-center justify-center hover:bg-stone-800 text-amber-400 active:scale-90 transition-transform cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddToCart(dish, 'full', 1)}
                        className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
