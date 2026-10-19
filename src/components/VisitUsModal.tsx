import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  Compass,
  Navigation,
  Car,
  Train,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { RESTAURANT_CONTACT_INFO, RESTAURANT_HERO_IMAGE } from '../data/menuData';
import { GeofenceState } from '../types/restaurant';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'location' | 'about_us';
  geofenceState: GeofenceState;
  onOpenGeofenceRadar?: () => void;
  onOpenReservations: () => void;
}

export const VisitUsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTab = 'location',
  geofenceState,
  onOpenGeofenceRadar,
  onOpenReservations
}) => {
  const [activeTab, setActiveTab] = useState<'location' | 'about_us'>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 my-auto flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950/80 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 block">
                Flagship Destination
              </span>
              <h2 className="text-lg font-serif-display font-bold text-amber-100">
                {activeTab === 'location' ? 'Location & Directions' : 'About Shankar Restaurant'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-stone-800/80 rounded-xl border border-stone-700">
              <button
                onClick={() => setActiveTab('location')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'location'
                    ? 'bg-amber-400 text-stone-950 shadow-sm'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Location & Transit
              </button>
              <button
                onClick={() => setActiveTab('about_us')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'about_us'
                    ? 'bg-amber-400 text-stone-950 shadow-sm'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                About Us
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* ================= LOCATION & DIRECTIONS ================= */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              {/* Address Hero */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <div className="bg-stone-800/80 rounded-2xl border border-stone-700/60 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                      Connaught Place Flagship
                    </span>
                    <h3 className="text-xl font-serif-display font-bold text-white">
                      {RESTAURANT_CONTACT_INFO.name}
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {RESTAURANT_CONTACT_INFO.address}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-stone-700/60 text-xs text-stone-300">
                      <div className="flex items-center gap-2">
                        <Train className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{RESTAURANT_CONTACT_INFO.metroStop}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Complimentary Valet Parking available at entrance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Direct Concierge: {RESTAURANT_CONTACT_INFO.phonePrimary}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href="https://maps.google.com/?q=Connaught+Place+New+Delhi"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Operating Hours & Radius Zone */}
                <div className="bg-stone-800/80 rounded-2xl border border-stone-700/60 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <Clock className="w-4 h-4" />
                    <span>Dining Room & Kitchen Hours</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-stone-700/60">
                      <span className="text-stone-300 font-medium">Lunch Service</span>
                      <span className="text-stone-100 font-mono">{RESTAURANT_CONTACT_INFO.hours.lunch}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-stone-700/60">
                      <span className="text-stone-300 font-medium">Dinner Service</span>
                      <span className="text-stone-100 font-mono">{RESTAURANT_CONTACT_INFO.hours.dinner}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-stone-700/60">
                      <span className="text-stone-300 font-medium">Cocktail Bar Lounge</span>
                      <span className="text-stone-100 font-mono">{RESTAURANT_CONTACT_INFO.hours.bar}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-stone-300 font-medium">Weekend Grand Buffet</span>
                      <span className="text-emerald-400 font-mono">{RESTAURANT_CONTACT_INFO.hours.buffet}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-700/60">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenReservations();
                      }}
                      className="w-full py-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Book a Table at Connaught Place</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= ABOUT US ================= */}
          {activeTab === 'about_us' && (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden aspect-[21/9] max-h-56">
                <img
                  src={RESTAURANT_HERO_IMAGE}
                  alt="Shankar Restaurant Ambiance"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex items-end p-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest block">
                      Established 1974
                    </span>
                    <h3 className="text-2xl font-serif-display font-bold text-white">
                      Fifty Years of Culinary Grandeur
                    </h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-300">
                <div className="bg-stone-800/60 p-4 rounded-xl border border-stone-700/60 space-y-2">
                  <span className="text-amber-400 font-bold block text-sm font-serif-display">
                    01. Hand-Pounded Masalas
                  </span>
                  <p className="leading-relaxed">
                    Whole spices roasted dry over iron tawas and stone-ground every dawn to unlock delicate essential oils without oxidation.
                  </p>
                </div>

                <div className="bg-stone-800/60 p-4 rounded-xl border border-stone-700/60 space-y-2">
                  <span className="text-amber-400 font-bold block text-sm font-serif-display">
                    02. Terracotta Clay Tandoor
                  </span>
                  <p className="leading-relaxed">
                    Centuries-old clay ovens stoked exclusively with dried sal wood and charcoal, producing that incomparable smoky charred crust.
                  </p>
                </div>

                <div className="bg-stone-800/60 p-4 rounded-xl border border-stone-700/60 space-y-2">
                  <span className="text-amber-400 font-bold block text-sm font-serif-display">
                    03. 24-Hour Embers Dal
                  </span>
                  <p className="leading-relaxed">
                    Our renowned Dal Shankar simmers continuously through the night with fresh churned white makhan, garlic, and slow-melted cream.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
