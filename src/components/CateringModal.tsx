import React, { useState } from 'react';
import {
  X,
  Users,
  Calendar,
  UtensilsCrossed,
  Sparkles,
  Phone,
  Mail,
  CheckCircle2,
  Send,
  Building,
  HeartHandshake
} from 'lucide-react';
import { CATERING_PACKAGES, RESTAURANT_CONTACT_INFO } from '../data/menuData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenCallToOrder: () => void;
}

export const CateringModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenCallToOrder
}) => {
  const [selectedPackage, setSelectedPackage] = useState(CATERING_PACKAGES[0].id);
  const [guestCount, setGuestCount] = useState<number>(50);
  const [eventDate, setEventDate] = useState<string>('');
  const [eventType, setEventType] = useState<'wedding' | 'corporate' | 'private_party' | 'puja_festival'>('corporate');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentPkg = CATERING_PACKAGES.find((p) => p.id === selectedPackage) || CATERING_PACKAGES[0];
  const estimatedTotal = guestCount * currentPkg.pricePerPerson;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-900/40 p-6 border-b border-amber-500/20 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Royal Outdoor & Banquet Catering</span>
            </div>
            <h2 className="text-2xl font-serif-display font-bold text-amber-100">
              Shankar Catering Services
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              Live charcoal sigris, high-heat clay tandoors, and imperial copperware banquet setups across Delhi NCR.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {submitted ? (
            <div className="text-center py-12 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif-display font-bold text-white">
                Catering Inquiry Received!
              </h3>
              <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-amber-400">{name}</strong>. Our Executive Catering Director will contact you at <strong className="text-amber-400">{phone}</strong> within 2 hours with a bespoke menu and official proposal.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Package Selector Cards */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Step 1: Select Catering Package
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {CATERING_PACKAGES.map((pkg) => {
                    const isSelected = selectedPackage === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-400/10 border-amber-400 shadow-md ring-1 ring-amber-400'
                            : 'bg-stone-800/60 border-stone-700/60 hover:border-stone-600'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                              Min {pkg.minGuests} Guests
                            </span>
                            <span className="text-xs font-mono font-bold text-white">
                              ₹{pkg.pricePerPerson} <span className="text-[10px] font-normal text-stone-400">/ guest</span>
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1.5">{pkg.name}</h4>
                          <p className="text-[11px] text-stone-400 mt-1">{pkg.idealFor}</p>

                          <ul className="mt-3 space-y-1.5 text-[11px] text-stone-300">
                            {pkg.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-400 text-xs">✓</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-700/40 flex items-center justify-between text-xs">
                          <span className={isSelected ? 'text-amber-300 font-bold' : 'text-stone-400'}>
                            {isSelected ? 'Selected' : 'Select'}
                          </span>
                          <span className="w-4 h-4 rounded-full border border-stone-600 flex items-center justify-center">
                            {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inquiry Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-stone-800">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Step 2: Event Details & Contact
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-stone-300 block mb-1">
                      Event Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as any)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="corporate">Corporate Gala / Dinner</option>
                      <option value="wedding">Wedding / Sangeet</option>
                      <option value="private_party">Private Anniversary / Birthday</option>
                      <option value="puja_festival">Puja & Festive Gathering</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-stone-300 block mb-1">
                      Guest Count ({guestCount} guests)
                    </label>
                    <input
                      type="range"
                      min={currentPkg.minGuests}
                      max={500}
                      step={10}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-stone-300 block mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-stone-300 block mb-1">
                      Estimated Budget
                    </label>
                    <div className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-amber-300">
                      ₹{estimatedTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-stone-300 block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Malhotra"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-stone-300 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98110 23456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-stone-300 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. vikram@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-stone-300 block mb-1">
                    Special Menu Preferences / Venue Location
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell us about live counter requirements, Jain preferences, venue address..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Submit action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-stone-400">
                    Need urgent catering within 48 hours?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenCallToOrder();
                      }}
                      className="text-amber-400 hover:underline font-bold"
                    >
                      Call Catering Concierge Directly
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Custom Proposal & Menu</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
