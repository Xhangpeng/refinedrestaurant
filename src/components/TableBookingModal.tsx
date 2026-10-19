import React, { useState } from 'react';
import { X, Calendar, Clock, Users } from 'lucide-react';
import { GeofenceState, TableBookingDetails } from '../types/restaurant';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  geofenceState: GeofenceState;
  onOpenGeofenceRadar?: () => void;
  onConfirmBooking: (details: TableBookingDetails) => void;
}

const TIME_SLOTS = [
  '12:30 PM',
  '01:15 PM',
  '02:00 PM',
  '07:00 PM',
  '07:45 PM',
  '08:30 PM',
  '09:15 PM',
  '10:00 PM'
];

export const TableBookingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  geofenceState,
  onOpenGeofenceRadar,
  onConfirmBooking
}) => {
  if (!isOpen) return null;

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[3]);
  const [guestsCount, setGuestsCount] = useState(2);
  const [seatingArea, setSeatingArea] = useState<
    'Main Dining Hall' | 'Royal Heritage Courtyard' | 'Private Maharaja Baithak' | 'Rooftop Terrace'
  >('Main Dining Hall');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('Please provide the reservation guest name.');
      return;
    }
    if (!guestPhone.trim() || guestPhone.length < 10) {
      setError('Please enter a valid 10-digit contact mobile number.');
      return;
    }

    onConfirmBooking({
      date,
      timeSlot,
      guestsCount,
      seatingArea,
      guestName,
      guestPhone,
      specialRequests
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans-body">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-stone-100">
          <div>
            <h2 className="text-lg font-serif-display font-semibold text-amber-300">
              Shankar Royal Table Reservation
            </h2>
            <p className="text-xs text-stone-400">
              Connaught Place Heritage Dining · Instant Confirmation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Table reservation intro note */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
            Reservations are held for 15 minutes past booking time. Instant table assignment upon arrival at Connaught Place.
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>Reservation Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-stone-500" />
                <span>Guests Count</span>
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'} (Dining Party)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Slot Chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>Select Seating Time</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                    timeSlot === slot
                      ? 'border-amber-900 bg-amber-900 text-white font-semibold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Dining Ambience Area */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 block">
              Seating Atmosphere Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Main Dining Hall', desc: 'Chandelier elegance & live sitar' },
                { name: 'Royal Heritage Courtyard', desc: 'Open-air marble fountain area' },
                { name: 'Private Maharaja Baithak', desc: 'Intimate royal silk seating' },
                { name: 'Rooftop Terrace', desc: 'Overlooking Connaught Place skyline' }
              ].map((area) => (
                <button
                  type="button"
                  key={area.name}
                  onClick={() => setSeatingArea(area.name as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    seatingArea === area.name
                      ? 'border-amber-900 bg-amber-50/60 text-stone-900'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="font-semibold text-xs block text-stone-900">{area.name}</span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">{area.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Guest Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Lead Guest Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Vikramaditya Sharma"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Mobile Phone</label>
              <input
                type="tel"
                required
                placeholder="e.g. 98110 23456"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
              />
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 block">
              Special Occasion or Dining Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Wedding anniversary, high chair needed, quiet booth..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-stone-500">Zero cancellation fee · Instant confirmation</span>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Reserve Table at Shankar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
