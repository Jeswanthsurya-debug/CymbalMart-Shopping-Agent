import React, { useState } from 'react';
import { 
  Sparkles, 
  Users, 
  Clock, 
  MapPin, 
  DollarSign, 
  Utensils, 
  Flame, 
  PartyPopper, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { PartyCriteria, PartyPlan } from '../types';
import { PRESET_PARTIES } from '../data/presets';

interface PartySetupWizardProps {
  onGeneratePlan: (criteria: PartyCriteria) => void;
  onSelectPreset: (preset: PartyPlan) => void;
  isLoading: boolean;
}

const EVENT_TYPES = [
  "Birthday Party",
  "Casual Dinner & Gathering",
  "Backyard BBQ & Cookout",
  "Cocktail Soirée & Bar",
  "Game Night & Snacks",
  "Kids Theme Party",
  "Baby / Bridal Shower",
  "Holiday Celebration",
  "Custom Event"
];

const VENUE_OPTIONS = [
  "Indoor Living Room & Dining",
  "Backyard Patio & Lawn",
  "Park Pavilion",
  "Poolside",
  "Rented Venue / Hall",
  "Rooftop"
];

const DIETARY_OPTIONS = [
  "Vegetarian Options",
  "Vegan Options",
  "Gluten-Free Options",
  "Nut Allergy Friendly",
  "Dairy-Free",
  "Halal Certified",
  "Kosher"
];

export const PartySetupWizard: React.FC<PartySetupWizardProps> = ({
  onGeneratePlan,
  onSelectPreset,
  isLoading
}) => {
  const [criteria, setCriteria] = useState<PartyCriteria>({
    title: "Saturday Fiesta & Game Night",
    eventType: "Casual Dinner & Gathering",
    theme: "Taco Tuesday & Margaritas",
    adultCount: 12,
    kidCount: 3,
    durationHours: 3,
    venue: "Backyard Patio & Lawn",
    budgetLevel: "Moderate",
    customBudgetAmount: 250,
    dietaryRestrictions: ["Gluten-Free Options"],
    additionalNotes: "Include mocktail option for kids and a fun party game."
  });

  const toggleDietary = (tag: string) => {
    setCriteria(prev => {
      const exists = prev.dietaryRestrictions.includes(tag);
      return {
        ...prev,
        dietaryRestrictions: exists
          ? prev.dietaryRestrictions.filter(t => t !== tag)
          : [...prev.dietaryRestrictions, tag]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePlan(criteria);
  };

  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      {/* Intro Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Powered by Gemini 3.6 AI Shopping Engine
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          What kind of party are we crafting?
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
          Set your guest numbers, theme, and budget. Our AI agent will calculate exact food, drink, decor, and tableware quantities with store department aisle tips!
        </p>
      </div>

      {/* Quick Starter Presets */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> One-Click Starter Templates
          </span>
          <span className="text-[11px] text-slate-500">Instant AI Preview</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESET_PARTIES.map(preset => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="group text-left p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 transition-all duration-200 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-white text-sm group-hover:text-indigo-300 transition">
                    {preset.criteria.title}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-700 text-slate-300 border border-slate-600">
                    ~${preset.estimatedTotalBudget}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {preset.themeVibeSummary}
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-700/60 pt-2 mt-1">
                <span>👥 {preset.criteria.adultCount + preset.criteria.kidCount} Guests</span>
                <span className="text-indigo-400 font-semibold group-hover:underline flex items-center gap-1">
                  Load Party <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Custom Form */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow backdrop decor */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-indigo-400" />
              Configure Your Event Details
            </h3>
            <p className="text-xs text-slate-400">Fill out your parameters to let the agent calculate scaled shopping items.</p>
          </div>

          {/* Row 1: Party Title & Event Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                Party Title
              </label>
              <input
                type="text"
                value={criteria.title}
                onChange={e => setCriteria({ ...criteria, title: e.target.value })}
                placeholder="e.g. Mia's 30th Birthday Bash"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                Event Category
              </label>
              <select
                value={criteria.eventType}
                onChange={e => setCriteria({ ...criteria, eventType: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {EVENT_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Theme & Vibe input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
              Theme / Vibe Concept
            </label>
            <input
              type="text"
              value={criteria.theme}
              onChange={e => setCriteria({ ...criteria, theme: e.target.value })}
              placeholder="e.g. 80s Neon Arcade, Luau Sunset, Game Night & Pizza, Hollywood Glam"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Row 2: Guests & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            {/* Adult Count */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> Adults (18+)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCriteria({ ...criteria, adultCount: Math.max(1, criteria.adultCount - 1) })}
                  className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={criteria.adultCount}
                  onChange={e => setCriteria({ ...criteria, adultCount: parseInt(e.target.value) || 1 })}
                  className="w-14 text-center bg-slate-900 border border-slate-700 rounded-lg py-1 text-sm text-white font-bold"
                />
                <button
                  type="button"
                  onClick={() => setCriteria({ ...criteria, adultCount: criteria.adultCount + 1 })}
                  className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Kid Count */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-pink-400" /> Kids
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCriteria({ ...criteria, kidCount: Math.max(0, criteria.kidCount - 1) })}
                  className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={criteria.kidCount}
                  onChange={e => setCriteria({ ...criteria, kidCount: parseInt(e.target.value) || 0 })}
                  className="w-14 text-center bg-slate-900 border border-slate-700 rounded-lg py-1 text-sm text-white font-bold"
                />
                <button
                  type="button"
                  onClick={() => setCriteria({ ...criteria, kidCount: criteria.kidCount + 1 })}
                  className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Duration (Hours)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={criteria.durationHours}
                  onChange={e => setCriteria({ ...criteria, durationHours: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
                <span className="text-sm font-bold text-white whitespace-nowrap min-w-[3rem]">
                  {criteria.durationHours} hrs
                </span>
              </div>
            </div>
          </div>

          {/* Row 3: Venue & Budget Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Venue / Location
              </label>
              <select
                value={criteria.venue}
                onChange={e => setCriteria({ ...criteria, venue: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              >
                {VENUE_OPTIONS.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Target Budget
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={criteria.budgetLevel}
                  onChange={e => setCriteria({ ...criteria, budgetLevel: e.target.value as any })}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="Budget">Budget Friendly</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Premium">Premium / Deluxe</option>
                </select>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    value={criteria.customBudgetAmount || ''}
                    onChange={e => setCriteria({ ...criteria, customBudgetAmount: parseInt(e.target.value) || 0 })}
                    placeholder="250"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-sm text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-purple-400" /> Dietary Restrictions & Preferences
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map(diet => {
                const isSelected = criteria.dietaryRestrictions.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleDietary(diet)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{diet}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special wish notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
              Special Wishes or Notes
            </label>
            <textarea
              rows={2}
              value={criteria.additionalNotes}
              onChange={e => setCriteria({ ...criteria, additionalNotes: e.target.value })}
              placeholder="e.g. Include a signature cocktail, need extra ice, kids games, or easy cleanup ideas..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-500 text-white font-extrabold text-base tracking-wide shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Calculating Shopping Quantities & Timeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Shopping List & Party Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
