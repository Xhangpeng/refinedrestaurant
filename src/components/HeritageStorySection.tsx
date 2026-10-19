import React from 'react';
import { ShieldCheck, Flame, Award, HeartHandshake } from 'lucide-react';
import butterChickenImg from '../assets/images/dish_butter_chicken_curry_1792103747214.jpg';

interface Props {
  onOpenGeofenceRadar?: () => void;
  onOpenReservations: () => void;
}

export const HeritageStorySection: React.FC<Props> = ({
  onOpenGeofenceRadar,
  onOpenReservations
}) => {
  return (
    <section id="heritage" className="py-20 bg-stone-900 text-stone-100 overflow-hidden font-sans-body">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 shadow-2xl aspect-4/3">
              <img
                src={butterChickenImg}
                alt="Shankar Restaurant Handcrafted Copper Handi Murgh Makhani"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-stone-100">
                <span className="text-[11px] font-mono tracking-wider uppercase text-amber-400 block mb-1">
                  Heritage Copper Handi
                </span>
                <p className="font-serif-display text-lg font-semibold">
                  24-Hour Slow Simmered Butter Gravy over Smoldering Coal
                </p>
              </div>
            </div>

            {/* Adjacent Trust Badge */}
            <div className="mt-4 p-4 rounded-xl bg-stone-950/80 border border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-300">
                Piping hot dispatched straight from our clay tandoor oven
              </span>
              <span className="text-amber-400 font-medium">Connaught Place</span>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400">
              <span>The Shankar Creed</span>
              <span aria-hidden="true">·</span>
              <span>Connaught Place, New Delhi</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif-display font-bold text-white tracking-tight leading-tight text-balance">
              Where Ancient Charcoal Smoldering Meets Pure Culinary Discipline
            </h2>

            <p className="text-sm text-stone-300 leading-relaxed">
              Founded over five decades ago in the historic arches of Connaught Place, Shankar
              Restaurant was created with an uncompromising standard: food must never be
              reheated, gravies must never be rushed, and tandoori breads must meet the guest’s
              table steaming within moments of leaving the clay embers.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Authentic Hand-Pounded Spices</h4>
                  <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                    Every morning, whole spices from Kerala and Kashmir are dry-roasted on cast
                    iron tawas and stone-ground by hand to preserve the volatile essential oils.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Uncompromising Quality & Freshness</h4>
                  <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                    From 24-hour slow-cooked Dal Makhani to saffron-layered Awadhi Dum Biryanis,
                    every dish is cooked fresh to order with pure desi ghee and artisanal butter.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={onOpenReservations}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Reserve Shankar Dining Table
              </button>
            </div>
          </div>
        </div>

        {/* Quantified Adjacency Strip */}
        <div className="mt-16 pt-8 border-t border-stone-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-serif-display font-bold text-amber-400 tabular-nums">
              50+ Years
            </div>
            <p className="text-xs text-stone-400 mt-1">Culinary Heritage in Delhi</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif-display font-bold text-amber-400 tabular-nums">
              100%
            </div>
            <p className="text-xs text-stone-400 mt-1">Pure Desi Makhan & Ghee</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif-display font-bold text-amber-400 tabular-nums">
              40+
            </div>
            <p className="text-xs text-stone-400 mt-1">Royal Family Recipes</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif-display font-bold text-amber-400 tabular-nums">
              4.92 ★
            </div>
            <p className="text-xs text-stone-400 mt-1">Over 2,400 Verified Reviews</p>
          </div>
        </div>
      </div>
    </section>
  );
};
