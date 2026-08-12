import React, { useState } from 'react';
import { X, Plus, Tag, ShoppingBag } from 'lucide-react';
import { CategoryType, PriorityType, ShoppingItem } from '../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<ShoppingItem, 'id' | 'isPurchased'>) => void;
}

const CATEGORIES: CategoryType[] = [
  'Food & Menu',
  'Beverages & Bar',
  'Decor & Vibe',
  'Tableware & Supplies',
  'Favors & Games'
];

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('Food & Menu');
  const [quantity, setQuantity] = useState('1 pack');
  const [numericQuantity, setNumericQuantity] = useState(1);
  const [unit, setUnit] = useState('pack');
  const [estimatedCost, setEstimatedCost] = useState(10);
  const [priority, setPriority] = useState<PriorityType>('Essential');
  const [aisleTip, setAisleTip] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddItem({
      name,
      category,
      quantity,
      numericQuantity,
      unit,
      estimatedCost,
      priority,
      aisleTip,
      notes
    });

    setName('');
    setQuantity('1 pack');
    setNumericQuantity(1);
    setEstimatedCost(10);
    setAisleTip('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" /> Add Custom Shopping Item
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Extra Bags of Ice"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CategoryType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                <option value="Essential">Essential</option>
                <option value="Recommended">Recommended</option>
                <option value="Optional">Optional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Quantity Description</label>
              <input
                type="text"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="e.g. 2 large bags"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Estimated Cost ($)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={estimatedCost}
                onChange={e => setEstimatedCost(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none font-bold text-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Supermarket Aisle Tip (Optional)</label>
            <input
              type="text"
              value={aisleTip}
              onChange={e => setAisleTip(e.target.value)}
              placeholder="e.g. Frozen Foods Section / Aisle 4"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Notes / Brand Preference</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Buy sugar-free version if available"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
