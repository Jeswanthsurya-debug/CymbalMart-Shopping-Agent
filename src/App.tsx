import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Calendar, 
  ChefHat, 
  Sparkles, 
  RotateCcw, 
  AlertCircle,
  ShoppingCart
} from 'lucide-react';
import { PartyCriteria, PartyPlan, ShoppingItem, PartyTimelineTask, CymbalOrderDetails } from './types';
import { Header } from './components/Header';
import { PartySetupWizard } from './components/PartySetupWizard';
import { PlanOverviewHeader } from './components/PlanOverviewHeader';
import { ShoppingListManager } from './components/ShoppingListManager';
import { TimelineView } from './components/TimelineView';
import { RecipesView } from './components/RecipesView';
import { AddItemModal } from './components/AddItemModal';
import { AgentChatDrawer } from './components/AgentChatDrawer';
import { SavedPlansDrawer } from './components/SavedPlansDrawer';
import { ExportModal } from './components/ExportModal';
import { CheckoutModal } from './components/CheckoutModal';
import { scaleShoppingList } from './utils/helpers';

export default function App() {
  const [currentPlan, setCurrentPlan] = useState<PartyPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<PartyPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'shopping' | 'timeline' | 'recipes'>('shopping');
  const [guestMultiplier, setGuestMultiplier] = useState<number>(1.0);
  
  // UI States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<CymbalOrderDetails | null>(null);

  // Load saved plans from localStorage on boot
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cymbalmart_party_plans');
      if (stored) {
        setSavedPlans(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to read localStorage:", e);
    }
  }, []);

  // Save plans to localStorage
  const persistSavedPlans = (plans: PartyPlan[]) => {
    setSavedPlans(plans);
    try {
      localStorage.setItem('cymbalmart_party_plans', JSON.stringify(plans));
    } catch (e) {
      console.warn("Failed to write localStorage:", e);
    }
  };

  // Generate Party Plan via API
  const handleGeneratePlan = async (criteria: PartyCriteria) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/plan-party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criteria })
      });

      const data = await response.json();
      if (data.success && data.plan) {
        setCurrentPlan(data.plan);
        setGuestMultiplier(1.0);
        setActiveTab('shopping');
      } else {
        throw new Error(data.error || "Failed to generate party plan");
      }
    } catch (err: any) {
      console.error("Plan Generation Error:", err);
      setErrorMessage(err.message || "Failed to generate party plan. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // AI Budget Optimizer Endpoint Call
  const handleOptimizeBudget = async () => {
    if (!currentPlan) return;
    setIsOptimizing(true);
    setErrorMessage(null);

    try {
      const targetBudget = currentPlan.criteria.customBudgetAmount || currentPlan.estimatedTotalBudget || 200;
      const response = await fetch('/api/optimize-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shoppingList: currentPlan.shoppingList,
          targetBudget,
          criteria: currentPlan.criteria
        })
      });

      const data = await response.json();
      if (data.success && data.optimizedList) {
        const formattedList = data.optimizedList.map((item: any, idx: number) => ({
          ...item,
          id: item.id || `opt-${Date.now()}-${idx}`,
          isPurchased: false
        }));

        setCurrentPlan(prev => {
          if (!prev) return null;
          return {
            ...prev,
            shoppingList: formattedList,
            estimatedTotalBudget: data.totalNewBudget || targetBudget
          };
        });
      } else {
        throw new Error(data.error || "Failed to optimize budget");
      }
    } catch (err: any) {
      console.error("Budget Optimization Error:", err);
      setErrorMessage(err.message || "Could not optimize budget. Try reducing item quantities manually.");
    } finally {
      setIsOptimizing(false);
    }
  };

  // Select Preset Party
  const handleSelectPreset = (preset: PartyPlan) => {
    setCurrentPlan(JSON.parse(JSON.stringify(preset)));
    setGuestMultiplier(1.0);
    setActiveTab('shopping');
  };

  // Multiplier scaling
  const handleMultiplierChange = (newMult: number) => {
    if (!currentPlan) return;
    const oldMult = guestMultiplier;
    const ratio = newMult / oldMult;
    
    setGuestMultiplier(newMult);
    setCurrentPlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        shoppingList: scaleShoppingList(prev.shoppingList, ratio)
      };
    });
  };

  // Shopping list item handlers
  const handleToggleItem = (id: string) => {
    if (!currentPlan) return;
    setCurrentPlan({
      ...currentPlan,
      shoppingList: currentPlan.shoppingList.map(item =>
        item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
      )
    });
  };

  const handleUpdateItemCost = (id: string, cost: number) => {
    if (!currentPlan) return;
    setCurrentPlan({
      ...currentPlan,
      shoppingList: currentPlan.shoppingList.map(item =>
        item.id === id ? { ...item, actualCost: cost } : item
      )
    });
  };

  const handleUpdateQuantity = (id: string, change: number) => {
    if (!currentPlan) return;
    setCurrentPlan({
      ...currentPlan,
      shoppingList: currentPlan.shoppingList.map(item => {
        if (item.id === id) {
          const newNum = Math.max(1, item.numericQuantity + change);
          const newCost = Math.round((item.estimatedCost / item.numericQuantity) * newNum * 100) / 100;
          return {
            ...item,
            numericQuantity: newNum,
            quantity: `${newNum} ${item.unit}`,
            estimatedCost: newCost
          };
        }
        return item;
      })
    });
  };

  const handleDeleteItem = (id: string) => {
    if (!currentPlan) return;
    setCurrentPlan({
      ...currentPlan,
      shoppingList: currentPlan.shoppingList.filter(item => item.id !== id)
    });
  };

  const handleAddItem = (newItem: Omit<ShoppingItem, 'id' | 'isPurchased'>) => {
    if (!currentPlan) return;
    const item: ShoppingItem = {
      ...newItem,
      id: `custom-${Date.now()}`,
      isPurchased: false,
      isCymbalBrand: newItem.name.toLowerCase().includes('cymbal')
    };
    setCurrentPlan({
      ...currentPlan,
      shoppingList: [item, ...currentPlan.shoppingList]
    });
  };

  const handleCheckAll = (check: boolean) => {
    if (!currentPlan) return;
    setCurrentPlan({
      ...currentPlan,
      shoppingList: currentPlan.shoppingList.map(item => ({ ...item, isPurchased: check }))
    });
  };

  // Timeline task handlers
  const handleToggleTimelineTask = (id: string) => {
    if (!currentPlan) return;
    setCurrentPlan({
      ...currentPlan,
      timeline: currentPlan.timeline.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    });
  };

  const handleAddTimelineTask = (newTask: Omit<PartyTimelineTask, 'id' | 'completed'>) => {
    if (!currentPlan) return;
    const task: PartyTimelineTask = {
      ...newTask,
      id: `task-${Date.now()}`,
      completed: false
    };
    setCurrentPlan({
      ...currentPlan,
      timeline: [...currentPlan.timeline, task]
    });
  };

  // Save party plan to library
  const handleSaveCurrentPlan = () => {
    if (!currentPlan) return;
    const exists = savedPlans.some(p => p.id === currentPlan.id);
    let updated: PartyPlan[];
    if (exists) {
      updated = savedPlans.map(p => (p.id === currentPlan.id ? currentPlan : p));
    } else {
      updated = [currentPlan, ...savedPlans];
    }
    persistSavedPlans(updated);
  };

  const handleDeleteSavedPlan = (id: string) => {
    const updated = savedPlans.filter(p => p.id !== id);
    persistSavedPlans(updated);
  };

  const isCurrentPlanSaved = currentPlan ? savedPlans.some(p => p.id === currentPlan.id) : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased">
      {/* Top Header */}
      <Header
        currentPlan={currentPlan}
        savedPlansCount={savedPlans.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onNewPartyClick={() => setCurrentPlan(null)}
        onToggleChat={() => setIsChatOpen(prev => !prev)}
        isChatOpen={isChatOpen}
        onOpenCheckoutModal={() => setIsCheckoutOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 font-bold hover:underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {!currentPlan ? (
          /* Step 1: Party Setup Form / Presets */
          <PartySetupWizard
            onGeneratePlan={handleGeneratePlan}
            onSelectPreset={handleSelectPreset}
            isLoading={isLoading}
          />
        ) : (
          /* Step 2: Active Plan Dashboard */
          <div className="space-y-6">
            {/* Top Overview & Guest Scaling Controls */}
            <PlanOverviewHeader
              plan={currentPlan}
              guestMultiplier={guestMultiplier}
              onMultiplierChange={handleMultiplierChange}
              onSavePlan={handleSaveCurrentPlan}
              onOpenExportModal={() => setIsExportOpen(true)}
              isSaved={isCurrentPlanSaved}
            />

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('shopping')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition border ${
                  activeTab === 'shopping'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border-slate-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>CymbalMart Shopping List ({currentPlan.shoppingList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition border ${
                  activeTab === 'timeline'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Prep Schedule & Timeline ({currentPlan.timeline?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('recipes')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition border ${
                  activeTab === 'recipes'
                    ? 'bg-pink-600 text-white border-pink-500 shadow-lg shadow-pink-600/30'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border-slate-800'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span>Batched Recipes ({currentPlan.recipes?.length || 0})</span>
              </button>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="ml-auto px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Checkout Order</span>
              </button>
            </div>

            {/* Active Tab View */}
            {activeTab === 'shopping' && (
              <ShoppingListManager
                items={currentPlan.shoppingList}
                onToggleItem={handleToggleItem}
                onUpdateItemCost={handleUpdateItemCost}
                onUpdateQuantity={handleUpdateQuantity}
                onDeleteItem={handleDeleteItem}
                onOpenAddItemModal={() => setIsAddItemOpen(true)}
                onCheckAll={handleCheckAll}
                onOptimizeBudget={handleOptimizeBudget}
                isOptimizing={isOptimizing}
                onOpenCheckoutModal={() => setIsCheckoutOpen(true)}
              />
            )}

            {activeTab === 'timeline' && (
              <TimelineView
                timeline={currentPlan.timeline || []}
                onToggleTask={handleToggleTimelineTask}
                onAddTask={handleAddTimelineTask}
              />
            )}

            {activeTab === 'recipes' && (
              <RecipesView
                recipes={currentPlan.recipes || []}
                guestCount={Math.round((currentPlan.criteria.adultCount + currentPlan.criteria.kidCount) * guestMultiplier)}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>CymbalMart Party Planner Shopping Agent • Smart Retail Shopping & Budget Optimization</p>
      </footer>

      {/* Drawers & Modals */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAddItem={handleAddItem}
      />

      <AgentChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentPlan={currentPlan}
      />

      <SavedPlansDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedPlans={savedPlans}
        onSelectPlan={handleSelectPreset}
        onDeletePlan={handleDeleteSavedPlan}
        currentPlanId={currentPlan?.id}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        plan={currentPlan}
      />

      {currentPlan && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          plan={currentPlan}
          onOptimizeBudget={handleOptimizeBudget}
          isOptimizing={isOptimizing}
          onOrderCompleted={(details) => setLastOrderDetails(details)}
        />
      )}
    </div>
  );
}

