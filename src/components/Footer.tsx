import React from 'react';
import { MapPin, Phone, Clock, Calendar, ExternalLink } from 'lucide-react';
import { RESTAURANT_CONTACT_INFO } from '../data/menuData';
import { MenuSectionType } from '../types/restaurant';
import { PalaceLogo } from './PalaceLogo';

interface Props {
  onSelectMenuSection: (section: MenuSectionType) => void;
  onOpenExplore: (tab: 'gallery' | 'buffet_vs_thali') => void;
  onOpenCatering: () => void;
  onOpenVisitUs: (tab: 'location' | 'about_us') => void;
  onOpenHelp: (tab: 'faqs' | 'contact' | 'careers' | 'allergen_guide') => void;
  onOpenReservations: () => void;
  onOpenCallToOrder: () => void;
  onOpenAdmin?: () => void;
  user?: any;
}

export const Footer: React.FC<Props> = ({
  onSelectMenuSection,
  onOpenExplore,
  onOpenCatering,
  onOpenVisitUs,
  onOpenHelp,
  onOpenReservations,
  onOpenCallToOrder,
  onOpenAdmin,
  user
}) => {
  const handleMenuClick = (sec: MenuSectionType) => {
    onSelectMenuSection(sec);
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-stone-950 text-stone-300 border-t border-stone-800/80 font-sans-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Top Brand & Quick Actions Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800/80">
          <div className="flex items-center gap-2.5">
            <PalaceLogo size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base md:text-lg font-serif-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300 truncate">
                MAHESWARI MULTI CUISINE RESTAURANT
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>100% Pure Vegetarian · Since 1974</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons - Balanced grid with proper padding & margins */}
          <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={onOpenReservations}
              className="py-2 px-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 truncate"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-950 shrink-0" />
              <span className="truncate">Reserve Table</span>
            </button>

            <button
              type="button"
              onClick={onOpenCallToOrder}
              className="py-2 px-3.5 bg-stone-900 hover:bg-stone-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 truncate"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Call to Order</span>
            </button>
          </div>
        </div>

        {/* Essential Contact Strips - Single line & perfectly aligned */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-4 border-b border-stone-800/80 text-xs text-stone-300">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-900/50 border border-stone-800/60">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px] truncate">Block M, Connaught Place, New Delhi</span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-900/50 border border-stone-800/60">
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <a
              href={`tel:${RESTAURANT_CONTACT_INFO.phonePrimary.replace(/\s+/g, '')}`}
              className="text-[11px] font-mono hover:text-amber-300 truncate"
            >
              {RESTAURANT_CONTACT_INFO.phonePrimary}
            </a>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-900/50 border border-stone-800/60">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px] truncate">Daily: 12:00 PM – 11:30 PM</span>
          </div>
        </div>

        {/* Optimized Link Columns - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 py-6 text-xs">
          {/* Col 1: Menus */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider text-amber-400/90">
              Menus
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => handleMenuClick('all_day')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  All Day Menu
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleMenuClick('lunch')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Royal Thalis & Lunch
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleMenuClick('bar')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Bar & Mocktails
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Dining & Booking */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider text-amber-400/90">
              Services
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenReservations}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Table Reservations
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenCatering}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Catering Packages
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenVisitUs('location')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Location & Directions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Explore */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider text-amber-400/90">
              Discover
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenExplore('gallery')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Photo Gallery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenExplore('buffet_vs_thali')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Buffet vs. Thali
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenVisitUs('about_us')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Our Heritage Story
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Help & Support */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider text-amber-400/90">
              Support
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenHelp('faqs')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenHelp('allergen_guide')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Allergen Matrix Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenHelp('contact')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Contact Concierge
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Clean Copyright & Regulatory Row */}
        <div className="pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} MAHESWARI MULTI CUISINE RESTAURANT. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>FSSAI Lic: 13320001000842</span>
            <span>·</span>
            <span>Connaught Place, New Delhi</span>
            {onOpenAdmin && (
              <>
                <span>·</span>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-stone-500 hover:underline"
                  title="Staff Portal (PostgreSQL & Kitchen Orders)"
                >
                  Staff Portal
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
