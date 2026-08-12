export type CategoryType = 
  | 'Food & Menu' 
  | 'Beverages & Bar' 
  | 'Decor & Vibe' 
  | 'Tableware & Supplies' 
  | 'Favors & Games';

export type PriorityType = 'Essential' | 'Recommended' | 'Optional';

export interface PartyCriteria {
  title: string;
  eventType: string;
  theme: string;
  adultCount: number;
  kidCount: number;
  durationHours: number;
  venue: string;
  budgetLevel: 'Budget' | 'Moderate' | 'Premium';
  customBudgetAmount?: number;
  dietaryRestrictions: string[];
  additionalNotes: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: CategoryType;
  quantity: string;
  numericQuantity: number;
  unit: string;
  estimatedCost: number;
  actualCost?: number;
  isPurchased: boolean;
  priority: PriorityType;
  dietaryTags?: string[];
  aisleTip?: string;
  cymbalMartAisle?: string;
  isCymbalBrand?: boolean;
  notes?: string;
}

export interface PartyTimelineTask {
  id: string;
  timeframe: '1 Week Before' | '2 Days Before' | 'Day Before' | 'Party Morning' | '1 Hour Before';
  task: string;
  completed: boolean;
}

export interface PartyRecipe {
  id: string;
  title: string;
  category: string;
  servings: number;
  prepTime: string;
  ingredients: string[];
  instructions: string[];
}

export interface PartyPlan {
  id: string;
  criteria: PartyCriteria;
  themeVibeSummary: string;
  colorPalette: string[];
  shoppingList: ShoppingItem[];
  estimatedTotalBudget: number;
  timeline: PartyTimelineTask[];
  recipes: PartyRecipe[];
  decorTips: string[];
  gamesAndPlaylist: {
    games: string[];
    playlistStyle: string;
  };
  createdDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface CymbalOrderDetails {
  orderId: string;
  fulfillmentMethod: 'curbside' | 'delivery' | 'instore';
  selectedStore: string;
  pickupTimeSlot: string;
  totalItems: number;
  subtotal: number;
  tax: number;
  savings: number;
  finalAmount: number;
  paymentStatus: string;
  orderDate: string;
}
