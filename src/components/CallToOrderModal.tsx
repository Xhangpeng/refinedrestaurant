import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Clock,
  Copy,
  Check,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { RESTAURANT_CONTACT_INFO } from '../data/menuData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenReservations: () => void;
  onOpenOnlineOrder: () => void;
}

export const CallToOrderModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenReservations,
  onOpenOnlineOrder
}) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (num: string) => {
    navigator.clipboard?.writeText(num.replace(/\s+/g, ''));
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in font-sans-body">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-stone-100 max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-950/90 via-stone-900 to-amber-900/60 p-5 sm:p-6 border-b border-amber-500/20 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800/80 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Direct Concierge & Orders</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif-display font-bold text-amber-100">
            Call MAHESWARI MULTI CUISINE RESTAURANT
          </h2>
          <p className="text-xs text-stone-300 mt-1 leading-relaxed">
            Speak directly with our captains for table reservations, takeaway orders, or banquet queries.
          </p>
        </div>

        {/* Body content with precision alignment */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Card 1: Main Calling Line */}
          <div className="bg-stone-850 rounded-2xl p-4 sm:p-5 border border-stone-750 hover:border-amber-500/40 transition-colors space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                    Main Calling Line
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Direct Takeaway & Dining Line
                  </span>
                </div>
              </div>

              {/* Action buttons aligned */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(RESTAURANT_CONTACT_INFO.phonePrimary)}
                  className="h-8.5 px-2.5 rounded-lg bg-stone-750 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                  title="Copy Phone Number"
                >
                  {copiedNumber === RESTAURANT_CONTACT_INFO.phonePrimary ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={`tel:${RESTAURANT_CONTACT_INFO.phonePrimary.replace(/\s+/g, '')}`}
                  className="h-8.5 px-3.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>

            {/* Prominent Aligned Phone Number */}
            <div className="pt-1">
              <a
                href={`tel:${RESTAURANT_CONTACT_INFO.phonePrimary.replace(/\s+/g, '')}`}
                className="text-xl sm:text-2xl font-mono font-bold text-white hover:text-amber-300 transition-colors tracking-wide block tabular-nums"
              >
                {RESTAURANT_CONTACT_INFO.phonePrimary}
              </a>
            </div>
          </div>

          {/* Card 2: WhatsApp Direct Line */}
          <div className="bg-stone-850 rounded-2xl p-4 sm:p-5 border border-stone-750 hover:border-emerald-500/40 transition-colors space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                    WhatsApp Concierge
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Instant Menu Chat & Direct Ordering
                  </span>
                </div>
              </div>

              {/* Action buttons aligned */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(RESTAURANT_CONTACT_INFO.phoneDirect)}
                  className="h-8.5 px-2.5 rounded-lg bg-stone-750 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                  title="Copy Phone Number"
                >
                  {copiedNumber === RESTAURANT_CONTACT_INFO.phoneDirect ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/919811023456?text=Hello%20Maheswari%20Restaurant,%20I%20would%20like%20to%20place%20an%20order`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-8.5 px-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                </a>
              </div>
            </div>

            {/* Prominent Aligned Phone Number */}
            <div className="pt-1">
              <a
                href={`tel:${RESTAURANT_CONTACT_INFO.phoneDirect.replace(/\s+/g, '')}`}
                className="text-xl sm:text-2xl font-mono font-bold text-white hover:text-emerald-300 transition-colors tracking-wide block tabular-nums"
              >
                {RESTAURANT_CONTACT_INFO.phoneDirect}
              </a>
            </div>
          </div>

          {/* Grand Opening 2026 Announcement Box */}
          <div className="bg-stone-950/70 rounded-2xl p-4 border border-stone-800 text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-stone-300 font-bold">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-amber-300">Grand Opening 2026 · Flagship Dining</span>
            </div>

            <div className="pt-2 border-t border-stone-800 text-stone-400 text-[11px] space-y-1.5">
              <p className="text-stone-300">
                Opening in <strong>2026</strong> at Kasturba Gandhi Marg & Barakhamba Road, Connaught Place, New Delhi.
              </p>
              <p className="text-stone-400">
                Pre-opening reservations, imperial catering consultations, and corporate enquiries are currently active via phone concierge.
              </p>
            </div>
          </div>

          {/* Alternative Quick Actions with Matching Heights */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOnlineOrder();
              }}
              className="py-2.5 px-3 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 min-h-[42px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Order Online</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenReservations();
              }}
              className="py-2.5 px-3 rounded-xl border border-amber-500/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 min-h-[42px]"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Book Table</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
