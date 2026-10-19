import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Utensils,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  Coins,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { GALLERY_ITEMS, BUFFET_VS_THALI_DATA, THALI_IMAGE } from '../data/menuData';
import { GalleryItem } from '../types/restaurant';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'gallery' | 'buffet_vs_thali';
  onOpenReservations: () => void;
  onOpenMenu: () => void;
}

export const ExploreModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTab = 'gallery',
  onOpenReservations,
  onOpenMenu
}) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'buffet_vs_thali'>(initialTab);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  // Sync initial tab when changed from props
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const filteredGallery =
    selectedGalleryCategory === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedGalleryCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 my-auto flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950/80 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 block">
                Explore Shankar Heritage
              </span>
              <h2 className="text-lg font-serif-display font-bold text-amber-100">
                {activeTab === 'gallery' ? 'Visual Gallery' : 'Buffet vs. Thali'}
              </h2>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-stone-800/80 rounded-xl border border-stone-700">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-amber-400 text-stone-950 shadow-sm'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Gallery
              </button>
              <button
                onClick={() => setActiveTab('buffet_vs_thali')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'buffet_vs_thali'
                    ? 'bg-amber-400 text-stone-950 shadow-sm'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Buffet vs. Thali
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

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* ================= TAB 1: GALLERY ================= */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[
                  { id: 'all', label: 'All Photos' },
                  { id: 'dishes', label: 'Signature Dishes' },
                  { id: 'ambiance', label: 'Dining Ambiance' },
                  { id: 'tandoor', label: 'Clay Tandoors' },
                  { id: 'bar', label: 'Botanical Bar' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedGalleryCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedGalleryCategory === cat.id
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-stone-800/60 text-stone-300 border border-stone-700/60 hover:border-stone-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredGallery.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedImage(item)}
                    className="group relative rounded-xl overflow-hidden bg-stone-950 border border-stone-800 aspect-[4/3] cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                          {item.category}
                        </span>
                        <Maximize2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-400 transition-colors" />
                      </div>
                      <h4 className="text-xs font-bold text-stone-100 line-clamp-1 mt-0.5">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 2: BUFFET VS THALI ================= */}
          {activeTab === 'buffet_vs_thali' && (
            <div className="space-y-6">
              {/* Introduction Banner */}
              <div className="bg-gradient-to-r from-amber-950/40 via-stone-800/60 to-stone-900 border border-amber-500/20 rounded-2xl p-6">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  Culinary Guide & Comparison
                </span>
                <h3 className="text-xl md:text-2xl font-serif-display font-bold text-amber-100">
                  {BUFFET_VS_THALI_DATA.title}
                </h3>
                <p className="text-xs text-stone-300 mt-2 max-w-2xl leading-relaxed">
                  {BUFFET_VS_THALI_DATA.subtitle} Both reflect centuries of imperial hospitality, but offer fundamentally distinct dining rhythms.
                </p>
              </div>

              {/* Side-by-Side Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. The Shankar Royal Thali */}
                <div className="bg-stone-800/80 rounded-2xl border border-amber-500/30 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                        {BUFFET_VS_THALI_DATA.thali.badge}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {BUFFET_VS_THALI_DATA.thali.pricing}
                      </span>
                    </div>

                    <h4 className="text-lg font-serif-display font-bold text-white">
                      {BUFFET_VS_THALI_DATA.thali.name}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{BUFFET_VS_THALI_DATA.thali.timing}</span>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed italic border-l-2 border-amber-500/60 pl-3 py-1">
                      "{BUFFET_VS_THALI_DATA.thali.philosophy}"
                    </p>

                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                        Experience Highlights:
                      </span>
                      <ul className="space-y-1.5 text-xs text-stone-300">
                        {BUFFET_VS_THALI_DATA.thali.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 block">
                        Included in the Bronze Thali:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {BUFFET_VS_THALI_DATA.thali.itemsIncluded.map((item, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-1 rounded-md bg-stone-900 border border-stone-700 text-stone-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenMenu();
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Utensils className="w-4 h-4" />
                      <span>View & Order Royal Thalis</span>
                    </button>
                  </div>
                </div>

                {/* 2. Grand Weekend Royal Buffet */}
                <div className="bg-stone-800/80 rounded-2xl border border-stone-700 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                        {BUFFET_VS_THALI_DATA.buffet.badge}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-300">
                        {BUFFET_VS_THALI_DATA.buffet.pricing}
                      </span>
                    </div>

                    <h4 className="text-lg font-serif-display font-bold text-white">
                      {BUFFET_VS_THALI_DATA.buffet.name}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{BUFFET_VS_THALI_DATA.buffet.timing}</span>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed italic border-l-2 border-emerald-500/60 pl-3 py-1">
                      "{BUFFET_VS_THALI_DATA.buffet.philosophy}"
                    </p>

                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                        Experience Highlights:
                      </span>
                      <ul className="space-y-1.5 text-xs text-stone-300">
                        {BUFFET_VS_THALI_DATA.buffet.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 block">
                        Live Counters & Offerings:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {BUFFET_VS_THALI_DATA.buffet.itemsIncluded.map((item, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-1 rounded-md bg-stone-900 border border-stone-700 text-stone-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenReservations();
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-700 hover:bg-stone-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span>Reserve for Weekend Buffet</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lightbox Modal when image clicked */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-60 bg-stone-950/95 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-stone-900 rounded-2xl overflow-hidden border border-stone-700 shadow-2xl"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-stone-900/80 rounded-full text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full max-h-[70vh] object-cover"
              />
              <div className="p-5 bg-stone-900 text-stone-100">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  {selectedImage.category}
                </span>
                <h3 className="text-lg font-serif-display font-bold text-white">
                  {selectedImage.title}
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  {selectedImage.caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
