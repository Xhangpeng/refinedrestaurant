import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Search,
  Send,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Utensils
} from 'lucide-react';
import {
  FAQ_DATA,
  CAREERS_POSITIONS,
  ALLERGEN_MATRIX,
  RESTAURANT_CONTACT_INFO
} from '../data/menuData';
import { FAQItem, JobPosition } from '../types/restaurant';

export type HelpTabType = 'faqs' | 'contact' | 'careers' | 'allergen_guide';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: HelpTabType;
  onOpenCallToOrder: () => void;
}

export const HelpModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTab = 'faqs',
  onOpenCallToOrder
}) => {
  const [activeTab, setActiveTab] = useState<HelpTabType>(initialTab);
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(FAQ_DATA[0].id);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Careers application modal state
  const [applyingJob, setApplyingJob] = useState<JobPosition | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantExp, setApplicantExp] = useState('');
  const [applicantSuccess, setApplicantSuccess] = useState(false);

  // Allergen filter
  const [allergenFilter, setAllergenFilter] = useState<'all' | 'glutenFree' | 'dairyFree' | 'nutFree' | 'vegan' | 'jainFriendly'>('all');

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const filteredFaqs = FAQ_DATA.filter(
    (item) =>
      item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const filteredAllergens = ALLERGEN_MATRIX.filter((item) => {
    if (allergenFilter === 'all') return true;
    return item[allergenFilter] === true;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplicantSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 my-auto flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950/80 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 block">
                Customer Support & Resources
              </span>
              <h2 className="text-lg font-serif-display font-bold text-amber-100">
                {activeTab === 'faqs' && 'Frequently Asked Questions'}
                {activeTab === 'contact' && 'Contact Concierge'}
                {activeTab === 'careers' && 'Join the Shankar Team'}
                {activeTab === 'allergen_guide' && 'Allergen & Dietary Matrix'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1 p-2 bg-stone-950 border-b border-stone-800/80 overflow-x-auto scrollbar-none shrink-0">
          {[
            { id: 'faqs', label: 'FAQs' },
            { id: 'contact', label: 'Contact Us' },
            { id: 'careers', label: 'Careers' },
            { id: 'allergen_guide', label: 'Allergen Guide' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as HelpTabType)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* ================= 1. FAQS ================= */}
          {activeTab === 'faqs' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions (e.g., parking, reservations, spice, delivery radius)..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-2.5">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="bg-stone-800/60 border border-stone-700/60 rounded-xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                        className="w-full p-4 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-stone-800 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                            {faq.category}
                          </span>
                          <h4 className="text-sm font-semibold text-white">{faq.question}</h4>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-stone-400 transition-transform ${
                            isExpanded ? 'rotate-180 text-amber-400' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 text-xs text-stone-300 leading-relaxed border-t border-stone-700/40">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= 2. CONTACT US ================= */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact information card */}
                <div className="space-y-4">
                  <div className="bg-stone-800/80 rounded-2xl border border-stone-700/60 p-5 space-y-4">
                    <h3 className="text-base font-serif-display font-bold text-amber-100">
                      Reach Shankar Restaurant
                    </h3>

                    <div className="space-y-3 text-xs text-stone-300">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-medium">Flagship Address</strong>
                          <span>{RESTAURANT_CONTACT_INFO.address}</span>
                          <span className="text-stone-400 block text-[11px] mt-0.5">
                            {RESTAURANT_CONTACT_INFO.metroStop}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-medium">Direct Telephone</strong>
                          <a
                            href={`tel:${RESTAURANT_CONTACT_INFO.phonePrimary.replace(/\s+/g, '')}`}
                            className="text-amber-400 hover:underline font-mono"
                          >
                            {RESTAURANT_CONTACT_INFO.phonePrimary}
                          </a>
                          <span className="text-stone-400 block text-[11px]">
                            Alternate: {RESTAURANT_CONTACT_INFO.phoneDirect}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-medium">Email Inquiries</strong>
                          <span className="text-stone-300 font-mono">
                            {RESTAURANT_CONTACT_INFO.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={onOpenCallToOrder}
                        className="w-full py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call Restaurant Reception Now</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct message form */}
                <div className="bg-stone-800/80 rounded-2xl border border-stone-700/60 p-5 space-y-4">
                  <h3 className="text-base font-serif-display font-bold text-amber-100">
                    Send a Message to Guest Relations
                  </h3>

                  {contactSent ? (
                    <div className="text-center py-8 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-white">Message Dispatched</h4>
                      <p className="text-xs text-stone-300">
                        Thank you! Our manager will respond via phone or email shortly.
                      </p>
                      <button
                        onClick={() => setContactSent(false)}
                        className="text-xs text-amber-400 hover:underline font-semibold"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div>
                        <label className="text-[11px] font-medium text-stone-300 block mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Full name"
                          className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-stone-300 block mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="Phone number"
                          className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-stone-300 block mb-1">
                          How can we assist you?
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Questions about reservations, feedback, or special events..."
                          className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Direct Message</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. CAREERS ================= */}
          {activeTab === 'careers' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-950/40 via-stone-800/60 to-stone-900 border border-amber-500/20 rounded-2xl p-5">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  Culinary & Hospitality Careers
                </span>
                <h3 className="text-xl font-serif-display font-bold text-amber-100">
                  Build Your Legacy at Shankar Restaurant
                </h3>
                <p className="text-xs text-stone-300 mt-1.5 max-w-2xl leading-relaxed">
                  We take immense pride in preserving culinary heritage while cultivating modern hospitality leadership. Explore our open positions below.
                </p>
              </div>

              {applicantSuccess ? (
                <div className="bg-stone-800 rounded-xl p-8 text-center space-y-3 border border-emerald-500/40">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Application Submitted!</h4>
                  <p className="text-xs text-stone-300 max-w-sm mx-auto">
                    Thank you for applying for the {applyingJob?.title} position. Our HR culinary team will review your credentials and contact you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setApplicantSuccess(false);
                      setApplyingJob(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors"
                  >
                    View Other Positions
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {CAREERS_POSITIONS.map((job) => (
                    <div
                      key={job.id}
                      className="bg-stone-800/80 border border-stone-700/60 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-500/30 transition-colors"
                    >
                      <div className="space-y-2 max-w-xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                            {job.department}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {job.location} • {job.type}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{job.title}</h4>
                        <p className="text-xs text-stone-300 leading-relaxed">{job.description}</p>
                        <div className="text-[11px] text-amber-400/90 font-medium">
                          Experience: {job.experienceRequired}
                        </div>
                      </div>

                      <button
                        onClick={() => setApplyingJob(job)}
                        className="py-2.5 px-5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors shrink-0 cursor-pointer self-start md:self-center"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Application Modal within Careers */}
              {applyingJob && !applicantSuccess && (
                <div className="fixed inset-0 z-60 bg-stone-950/80 flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 text-stone-100 space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          Application Form
                        </span>
                        <h3 className="text-base font-bold text-white">{applyingJob.title}</h3>
                      </div>
                      <button
                        onClick={() => setApplyingJob(null)}
                        className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleJobSubmit} className="space-y-3">
                      <div>
                        <label className="text-[11px] font-medium text-stone-300 block mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          placeholder="Your full name"
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
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          placeholder="Phone number"
                          className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-stone-300 block mb-1">
                          Years of Relevant Experience *
                        </label>
                        <input
                          type="text"
                          required
                          value={applicantExp}
                          onChange={(e) => setApplicantExp(e.target.value)}
                          placeholder="e.g. 4 years in tandoor at fine dining"
                          className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setApplyingJob(null)}
                          className="flex-1 py-2.5 rounded-xl border border-stone-700 text-stone-300 text-xs font-semibold hover:bg-stone-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300"
                        >
                          Submit Profile
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 4. ALLERGEN GUIDE ================= */}
          {activeTab === 'allergen_guide' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-800/80 p-4 rounded-xl border border-stone-700/60">
                <div>
                  <h4 className="text-sm font-bold text-white">Dietary & Allergen Filtering</h4>
                  <p className="text-[11px] text-stone-300 mt-0.5">
                    Select a dietary preference to filter dishes across all menus.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'all', label: 'All Items' },
                    { id: 'glutenFree', label: 'Gluten-Free' },
                    { id: 'dairyFree', label: 'Dairy-Free' },
                    { id: 'nutFree', label: 'Nut-Free' },
                    { id: 'vegan', label: 'Vegan' },
                    { id: 'jainFriendly', label: 'Jain-Friendly' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setAllergenFilter(filter.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        allergenFilter === filter.id
                          ? 'bg-amber-400 text-stone-950 font-bold'
                          : 'bg-stone-700/60 text-stone-300 hover:text-white'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table / Cards */}
              <div className="overflow-x-auto border border-stone-700/60 rounded-xl bg-stone-800/40">
                <table className="w-full text-left text-xs text-stone-200">
                  <thead className="bg-stone-950/80 text-[10px] uppercase font-bold text-stone-400 border-b border-stone-700/80">
                    <tr>
                      <th className="py-3 px-4">Dish Name</th>
                      <th className="py-3 px-3">Dietary</th>
                      <th className="py-3 px-3">Gluten-Free</th>
                      <th className="py-3 px-3">Dairy-Free</th>
                      <th className="py-3 px-3">Nut-Free</th>
                      <th className="py-3 px-3">Vegan</th>
                      <th className="py-3 px-3">Jain Friendly</th>
                      <th className="py-3 px-4">Chef Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {filteredAllergens.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-800/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                          {item.dishName}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.dietary === 'veg'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : item.dietary === 'vegan'
                                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {item.dietary}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {item.glutenFree ? (
                            <span className="text-emerald-400 font-bold">Yes</span>
                          ) : (
                            <span className="text-stone-500">Contains Gluten</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {item.dairyFree ? (
                            <span className="text-emerald-400 font-bold">Yes</span>
                          ) : (
                            <span className="text-stone-500">Contains Dairy</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {item.nutFree ? (
                            <span className="text-emerald-400 font-bold">Yes</span>
                          ) : (
                            <span className="text-amber-400">Contains Nuts</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {item.vegan ? (
                            <span className="text-emerald-400 font-bold">Yes</span>
                          ) : (
                            <span className="text-stone-500">No</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {item.jainFriendly ? (
                            <span className="text-emerald-400 font-bold">Yes (No Onion/Garlic)</span>
                          ) : (
                            <span className="text-stone-500">No</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-stone-400 text-[11px] max-w-xs">
                          {item.notes || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
