import React from 'react';
import { 
  Users, 
  DollarSign, 
  Clock, 
  Sparkles, 
  MapPin, 
  Palette, 
  CheckCircle2, 
  Share2, 
  Printer, 
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import { PartyPlan } from '../types';
import { formatCurrency } from '../utils/helpers';

interface PlanOverviewHeaderProps {
  plan: PartyPlan;
  guestMultiplier: number;
  onMultiplierChange: (val: number) => void;
  onSavePlan: () => void;
  onOpenExportModal: () => void;
  isSaved: boolean;
}

export const PlanOverviewHeader: React.FC<PlanOverviewHeaderProps> = ({
  plan,
  guestMultiplier,
  onMultiplierChange,
  onSavePlan,
  onOpenExportModal,
  isSaved
}) => {
  const baseGuests = plan.criteria.adultCount + plan.criteria.kidCount;
  const scaledGuests = Math.round(baseGuests * guestMultiplier);

  const purchasedCount = plan.shoppingList.filter(i => i.isPurchased).length;
  const totalCount = plan.shoppingList.length;
  const percentPurchased = totalCount > 0 ? Math.round((purchasedCount / totalCount) * 100) : 0;

  const totalPurchasedCost = plan.shoppingList
    .filter(i => i.isPurchased)
    .reduce((acc, i) => acc + (i.actualCost ?? i.estimatedCost), 0);

  const totalEstCost = plan.shoppingList
    .reduce((acc, i) => acc + i.estimatedCost, 0);

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl mb-6 relative overflow-hidden backdrop-blur-md">
      {/* Dynamic Background Banner gradient using generated palette */}
      <div 
        className="absolute top-0 left-0 right-0 h-2 opacity-80"
        style={{
          background: `linear-gradient(to right, ${plan.colorPalette.join(', ') || '#6366F1, #EC4899'})`
        }}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
        {/* Left: Party Title & Vibe */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {plan.criteria.eventType}
            </span>
            <span className="text-xs text-slate-400">Created {new Date(plan.createdDate).toLocaleDateString()}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {plan.criteria.title}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-2xl border border-slate-800/80">
            ✨ <span className="font-semibold text-purple-300">Theme Vibe: </span>{plan.themeVibeSummary}
          </p>

          {/* Color Palette */}
          {plan.colorPalette && plan.colorPalette.length > 0 && (
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <span className="font-medium">Color Palette:</span>
              <div className="flex items-center gap-1.5">
                {plan.colorPalette.map((color, idx) => (
                  <div 
                    key={idx} 
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions & Guest Scaling Control */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 border-t lg:border-t-0 border-slate-800 pt-4 lg:pt-0">
          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onSavePlan}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                isSaved
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>{isSaved ? 'Saved to Library' : 'Save Party'}</span>
            </button>

            <button
              onClick={onOpenExportModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Export / Print</span>
            </button>
          </div>

          {/* Guest Count Scale Slider */}
          <div className="w-full bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" /> Guest Scaling:
              </span>
              <span className="font-extrabold text-indigo-300">
                {scaledGuests} Guests ({Math.round(guestMultiplier * 100)}%)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={guestMultiplier}
              onChange={e => onMultiplierChange(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">
              Drag to scale food & drink quantities automatically for more/fewer guests!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-800 text-xs">
        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
          <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" /> Guests
          </div>
          <div className="text-base font-bold text-white">
            {scaledGuests} Total <span className="text-xs font-normal text-slate-400">({plan.criteria.adultCount}A, {plan.criteria.kidCount}K)</span>
          </div>
        </div>

        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
          <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Budget Spent
          </div>
          <div className="text-base font-bold text-emerald-400">
            {formatCurrency(totalPurchasedCost)}
            <span className="text-xs text-slate-400 font-normal ml-1">/ {formatCurrency(totalEstCost)}</span>
          </div>
        </div>

        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
          <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Shopping Status
          </div>
          <div className="text-base font-bold text-white flex items-center gap-2">
            <span>{percentPurchased}% Done</span>
            <span className="text-xs text-slate-400 font-normal">({purchasedCount}/{totalCount})</span>
          </div>
        </div>

        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
          <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Duration & Venue
          </div>
          <div className="text-base font-bold text-white truncate">
            {plan.criteria.durationHours} hrs • {plan.criteria.venue.split(' ')[0]}
          </div>
        </div>
      </div>
    </div>
  );
};
