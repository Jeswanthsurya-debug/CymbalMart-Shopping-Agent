import React from 'react';
import { Bookmark, X, Trash2, ArrowRight, Calendar, Users, DollarSign } from 'lucide-react';
import { PartyPlan } from '../types';
import { formatCurrency } from '../utils/helpers';

interface SavedPlansDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: PartyPlan[];
  onSelectPlan: (plan: PartyPlan) => void;
  onDeletePlan: (id: string) => void;
  currentPlanId?: string;
}

export const SavedPlansDrawer: React.FC<SavedPlansDrawerProps> = ({
  isOpen,
  onClose,
  savedPlans,
  onSelectPlan,
  onDeletePlan,
  currentPlanId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[380px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slide-left">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white text-sm">Saved Parties ({savedPlans.length})</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {savedPlans.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <p className="font-semibold text-slate-300">No saved parties yet.</p>
            <p className="mt-1 text-slate-500">Click "Save Party" on any generated plan to store it here!</p>
          </div>
        ) : (
          savedPlans.map(plan => {
            const isCurrent = plan.id === currentPlanId;
            return (
              <div
                key={plan.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-extrabold text-white text-sm">{plan.criteria.title}</h4>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">{plan.themeVibeSummary}</p>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-slate-700/60 pt-2.5 mt-2">
                  <div className="flex items-center gap-3 text-slate-300 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-indigo-400" /> {plan.criteria.adultCount + plan.criteria.kidCount}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-emerald-400">
                      <DollarSign className="w-3 h-3" /> {formatCurrency(plan.estimatedTotalBudget)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDeletePlan(plan.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-700"
                      title="Delete saved party"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {!isCurrent && (
                      <button
                        onClick={() => {
                          onSelectPlan(plan);
                          onClose();
                        }}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                      >
                        Open <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
