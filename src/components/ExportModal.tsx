import React, { useState } from 'react';
import { X, Copy, Download, Printer, Check, FileText } from 'lucide-react';
import { PartyPlan } from '../types';
import { formatCurrency } from '../utils/helpers';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen || !plan) return null;

  const generateTextChecklist = () => {
    let text = `========================================\n`;
    text += `PARTY SHOPPING LIST: ${plan.criteria.title}\n`;
    text += `Theme: ${plan.criteria.theme}\n`;
    text += `Guests: ${plan.criteria.adultCount} Adults, ${plan.criteria.kidCount} Kids (${plan.criteria.durationHours} hrs)\n`;
    text += `Target Budget: ${formatCurrency(plan.estimatedTotalBudget)}\n`;
    text += `========================================\n\n`;

    const categories = Array.from(new Set(plan.shoppingList.map(i => i.category)));
    categories.forEach((cat: string) => {
      text += `--- ${cat.toUpperCase()} ---\n`;
      const catItems = plan.shoppingList.filter(i => i.category === cat);
      catItems.forEach(i => {
        text += `[${i.isPurchased ? 'X' : ' '}] ${i.name} (${i.quantity}) - ~$${i.estimatedCost}\n`;
        if (i.aisleTip) text += `    📍 Aisle: ${i.aisleTip}\n`;
      });
      text += `\n`;
    });

    if (plan.timeline && plan.timeline.length > 0) {
      text += `--- PREPARATION TIMELINE ---\n`;
      plan.timeline.forEach(t => {
        text += `[${t.completed ? 'X' : ' '}] (${t.timeframe}) ${t.task}\n`;
      });
    }

    return text;
  };

  const handleCopyText = () => {
    const text = generateTextChecklist();
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadCSV = () => {
    let csv = "Item Name,Category,Quantity,Estimated Cost ($),Purchased,Priority,Aisle Tip\n";
    plan.shoppingList.forEach(i => {
      const nameEscaped = `"${i.name.replace(/"/g, '""')}"`;
      const qtyEscaped = `"${i.quantity.replace(/"/g, '""')}"`;
      const aisleEscaped = `"${(i.aisleTip || '').replace(/"/g, '""')}"`;
      csv += `${nameEscaped},${i.category},${qtyEscaped},${i.estimatedCost},${i.isPurchased ? 'Yes' : 'No'},${i.priority},${aisleEscaped}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${plan.criteria.title.replace(/\s+/g, '_')}_Shopping_List.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-400" /> Export & Print Party Shopping List
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <button
            onClick={handleCopyText}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
          >
            {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedText ? 'Copied to Clipboard!' : 'Copy Text Checklist'}</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download CSV Spreadsheet</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print View</span>
          </button>
        </div>

        {/* Text Preview Box */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">
          {generateTextChecklist()}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
