import React from 'react';
import { Sparkles, ShoppingCart, Bookmark, PlusCircle, ShoppingBag, Bot, Store, MapPin } from 'lucide-react';
import { PartyPlan } from '../types';
import { formatCurrency } from '../utils/helpers';

interface HeaderProps {
  currentPlan: PartyPlan | null;
  savedPlansCount: number;
  onOpenSavedDrawer: () => void;
  onNewPartyClick: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  onOpenCheckoutModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPlan,
  savedPlansCount,
  onOpenSavedDrawer,
  onNewPartyClick,
  onToggleChat,
  isChatOpen,
  onOpenCheckoutModal
}) => {
  const totalPurchased = currentPlan?.shoppingList
    .filter(i => i.isPurchased)
    .reduce((acc, i) => acc + (i.actualCost ?? i.estimatedCost), 0) || 0;

  const totalEstBudget = currentPlan?.estimatedTotalBudget || 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 lg:px-8 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Store Badge */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewPartyClick}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 font-black text-white text-lg tracking-tighter">
            CM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                CymbalMart <span className="text-emerald-400 font-semibold text-sm">Party Agent</span>
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-emerald-400" /> Event Concierge
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>CymbalMart Store #402 • Downtown Metro</span>
            </div>
          </div>
        </div>

        {/* Current Plan Quick Stats (if active plan) */}
        {currentPlan && (
          <div className="hidden md:flex items-center gap-4 bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>In Cart: <strong className="text-white">{currentPlan.shoppingList.filter(i => i.isPurchased).length}/{currentPlan.shoppingList.length}</strong></span>
            </div>
            <div className="h-3 w-[1px] bg-slate-700" />
            <div className="text-slate-300">
              List Spend: <strong className="text-emerald-400">{formatCurrency(totalPurchased > 0 ? totalPurchased : totalEstBudget)}</strong>
            </div>
            {onOpenCheckoutModal && (
              <button
                onClick={onOpenCheckoutModal}
                className="ml-1 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] flex items-center gap-1 shadow transition"
              >
                <ShoppingCart className="w-3 h-3" /> Checkout
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Saved Parties Button */}
          <button
            onClick={onOpenSavedDrawer}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title="View Saved CymbalMart Parties"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Saved Parties</span>
            {savedPlansCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                {savedPlansCount}
              </span>
            )}
          </button>

          {/* New Plan Button */}
          <button
            onClick={onNewPartyClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Party</span>
          </button>

          {/* AI Agent Drawer Toggle */}
          <button
            onClick={onToggleChat}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
              isChatOpen
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border-purple-500/30'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-300" />
            <span className="hidden sm:inline">Cymbal AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
