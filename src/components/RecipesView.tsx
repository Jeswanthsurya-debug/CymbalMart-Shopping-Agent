import React, { useState } from 'react';
import { ChefHat, Clock, Users, UtensilsCrossed, Check } from 'lucide-react';
import { PartyRecipe } from '../types';

interface RecipesViewProps {
  recipes: PartyRecipe[];
  guestCount: number;
}

export const RecipesView: React.FC<RecipesViewProps> = ({
  recipes,
  guestCount
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const toggleIngredient = (id: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!recipes || recipes.length === 0) {
    return (
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-8 text-center text-slate-400">
        <ChefHat className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium">No custom recipes generated for this party yet.</p>
        <p className="text-xs text-slate-500 mt-1">Use the AI Agent on the right to request a punch, dip, or cocktail recipe!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      <div className="mb-6 pb-4 border-b border-slate-800">
        <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-pink-400" /> Signature Party Recipes & Batched Drinks
        </h3>
        <p className="text-xs text-slate-400">
          Tailored recipe scaling for {guestCount} guests with step-by-step prep instructions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map(recipe => (
          <div key={recipe.id} className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-5 space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-700/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {recipe.category || 'Party Batch Recipe'}
                </span>
                <h4 className="font-extrabold text-white text-base mt-1">{recipe.title}</h4>
              </div>
              <div className="text-right text-xs text-slate-400 shrink-0">
                <div className="flex items-center gap-1 font-semibold text-slate-300">
                  <Users className="w-3.5 h-3.5 text-indigo-400" /> Serves {recipe.servings}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                  <Clock className="w-3 h-3 text-amber-400" /> {recipe.prepTime}
                </div>
              </div>
            </div>

            {/* Ingredients Checklist */}
            <div>
              <h5 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-2 flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-pink-400" /> Ingredients Checklist
              </h5>
              <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {recipe.ingredients.map((ing, idx) => {
                  const ingKey = `${recipe.id}-ing-${idx}`;
                  const isDone = checkedIngredients[ingKey];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleIngredient(ingKey)}
                      className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none"
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${isDone ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600 bg-slate-800'}`}>
                        {isDone && <Check className="w-3 h-3 font-bold" />}
                      </div>
                      <span className={isDone ? 'line-through text-slate-500' : ''}>{ing}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h5 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-2">
                Preparation Steps
              </h5>
              <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside pl-1">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="leading-relaxed bg-slate-900/40 p-2 rounded-lg border border-slate-800/80">
                    <span className="font-medium text-slate-200">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
