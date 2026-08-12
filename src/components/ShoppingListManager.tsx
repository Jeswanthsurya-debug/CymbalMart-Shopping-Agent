import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Layers, 
  Building2, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  ShoppingBag,
  Sparkles,
  ShoppingCart,
  RefreshCw,
  Store
} from 'lucide-react';
import { ShoppingItem, CategoryType } from '../types';
import { formatCurrency, guessDepartment } from '../utils/helpers';

interface ShoppingListManagerProps {
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onUpdateItemCost: (id: string, cost: number) => void;
  onUpdateQuantity: (id: string, change: number) => void;
  onDeleteItem: (id: string) => void;
  onOpenAddItemModal: () => void;
  onCheckAll: (check: boolean) => void;
  onOptimizeBudget?: () => void;
  isOptimizing?: boolean;
  onOpenCheckoutModal?: () => void;
}

const CATEGORIES: CategoryType[] = [
  'Food & Menu',
  'Beverages & Bar',
  'Decor & Vibe',
  'Tableware & Supplies',
  'Favors & Games'
];

export const ShoppingListManager: React.FC<ShoppingListManagerProps> = ({
  items,
  onToggleItem,
  onUpdateItemCost,
  onUpdateQuantity,
  onDeleteItem,
  onOpenAddItemModal,
  onCheckAll,
  onOptimizeBudget,
  isOptimizing = false,
  onOpenCheckoutModal
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activePriority, setActivePriority] = useState<string>('All');
  const [groupBy, setGroupBy] = useState<'category' | 'department'>('category');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hidePurchased, setHidePurchased] = useState<boolean>(false);
  const [cymbalOnly, setCymbalOnly] = useState<boolean>(false);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (activeCategory !== 'All' && item.category !== activeCategory) return false;
      if (activePriority !== 'All' && item.priority !== activePriority) return false;
      if (hidePurchased && item.isPurchased) return false;
      if (cymbalOnly && !item.isCymbalBrand) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        const matchesAisle = (item.cymbalMartAisle || item.aisleTip || '').toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesAisle) return false;
      }
      return true;
    });
  }, [items, activeCategory, activePriority, hidePurchased, cymbalOnly, searchQuery]);

  // Group items
  const groupedSections = useMemo(() => {
    if (groupBy === 'category') {
      const map: Record<string, ShoppingItem[]> = {};
      filteredItems.forEach(item => {
        if (!map[item.category]) map[item.category] = [];
        map[item.category].push(item);
      });
      return map;
    } else {
      const map: Record<string, ShoppingItem[]> = {};
      filteredItems.forEach(item => {
        const dept = item.cymbalMartAisle || guessDepartment(item);
        if (!map[dept]) map[dept] = [];
        map[dept].push(item);
      });
      return map;
    }
  }, [filteredItems, groupBy]);

  const totalItemsCount = items.length;
  const purchasedCount = items.filter(i => i.isPurchased).length;
  const cymbalBrandCount = items.filter(i => i.isCymbalBrand).length;

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-400" /> CymbalMart Curated Shopping List
          </h3>
          <p className="text-xs text-slate-400">
            Aisle-sorted ingredients & supplies calculated for your guest count.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onOptimizeBudget && (
            <button
              onClick={onOptimizeBudget}
              disabled={isOptimizing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/30 text-xs font-bold transition disabled:opacity-50"
              title="Auto-adjust quantities or swap to Cymbal Brand to lower total cost"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Optimizing...' : 'AI Budget Optimizer'}</span>
            </button>
          )}

          {onOpenCheckoutModal && (
            <button
              onClick={onOpenCheckoutModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md shadow-emerald-500/20 transition"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Checkout Order</span>
            </button>
          )}

          <button
            onClick={onOpenAddItemModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Cymbal Brand Perk Banner */}
      <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <span>Shopping Progress ({purchasedCount} of {totalItemsCount} in cart)</span>
            {cymbalBrandCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 text-emerald-400" /> {cymbalBrandCount} Cymbal Brand Items (~15% Savings)
              </span>
            )}
          </div>
          <span className="text-emerald-400 font-extrabold">
            {totalItemsCount > 0 ? Math.round((purchasedCount / totalItemsCount) * 100) : 0}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-700">
          <div 
            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${totalItemsCount > 0 ? (purchasedCount / totalItemsCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search items, ingredients, or aisle..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Priority:
            </label>
            <select
              value={activePriority}
              onChange={e => setActivePriority(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Essential">Essential Only</option>
              <option value="Recommended">Recommended</option>
              <option value="Optional">Optional</option>
            </select>
          </div>

          {/* Grouping Mode */}
          <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setGroupBy('category')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
                groupBy === 'category'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Category
            </button>
            <button
              onClick={() => setGroupBy('department')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
                groupBy === 'department'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Cymbal Store Aisle
            </button>
          </div>
        </div>

        {/* Category Filter Chips & Cymbal Brand Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              activeCategory === 'All'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            All Categories ({items.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = items.filter(i => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}

          <div className="ml-auto flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={cymbalOnly}
                onChange={e => setCymbalOnly(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              Cymbal Brands Only
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={hidePurchased}
                onChange={e => setHidePurchased(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              Hide In-Cart
            </label>
          </div>
        </div>
      </div>

      {/* Main List Render */}
      {Object.keys(groupedSections).length === 0 ? (
        <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-800">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-400 font-medium">No shopping items match your filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSections).map(([groupTitle, groupItems]: [string, ShoppingItem[]]) => (
            <div key={groupTitle} className="bg-slate-800/40 rounded-2xl border border-slate-800/80 p-4">
              <div className="flex items-center justify-between mb-3 border-b border-slate-700/60 pb-2">
                <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  {groupTitle}
                  <span className="text-xs font-medium text-slate-400">({groupItems.length} items)</span>
                </h4>
                <span className="text-xs font-bold text-slate-300">
                  Subtotal: {formatCurrency(groupItems.reduce((acc, i) => acc + (i.actualCost ?? i.estimatedCost), 0))}
                </span>
              </div>

              <div className="space-y-2">
                {groupItems.map(item => (
                  <div
                    key={item.id}
                    className={`group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl transition border ${
                      item.isPurchased
                        ? 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-75'
                        : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    {/* Left: Checkbox + Name + Badges */}
                    <div className="flex items-start gap-3 flex-1 mb-2 sm:mb-0">
                      <button
                        onClick={() => onToggleItem(item.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-400 transition"
                      >
                        {item.isPurchased ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-500 group-hover:text-emerald-400" />
                        )}
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`font-bold text-sm ${item.isPurchased ? 'line-through text-slate-500' : 'text-white'}`}>
                            {item.name}
                          </span>

                          {/* Cymbal Brand Badge */}
                          {item.isCymbalBrand && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-400" /> Cymbal Choice
                            </span>
                          )}

                          {/* Priority Tag */}
                          {item.priority === 'Essential' && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              Essential
                            </span>
                          )}

                          {/* Dietary Tags */}
                          {item.dietaryTags?.map(tag => (
                            <span key={tag} className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Quantity & Department / Aisle Tip */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="font-medium text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                            Qty: {item.quantity}
                          </span>
                          
                          {(item.cymbalMartAisle || item.aisleTip) && (
                            <span className="text-[11px] text-emerald-300/90 font-medium">
                              📍 {item.cymbalMartAisle || item.aisleTip}
                            </span>
                          )}

                          {item.notes && (
                            <span className="text-[11px] text-slate-400">
                              💡 {item.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quantity Adjustment & Price Editing */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-slate-700/60 pt-2 sm:pt-0">
                      {/* Numeric Quantity Spinner */}
                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-white px-2">
                          {item.numericQuantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Price Field */}
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">$</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={item.actualCost !== undefined ? item.actualCost : item.estimatedCost}
                          onChange={e => onUpdateItemCost(item.id, parseFloat(e.target.value) || 0)}
                          className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-emerald-400 font-bold text-right"
                          title="Click to edit actual purchase price"
                        />
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
