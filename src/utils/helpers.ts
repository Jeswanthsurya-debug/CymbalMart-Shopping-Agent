import { ShoppingItem, CategoryType } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const AISLE_GROUPS: Record<string, string[]> = {
  'Produce Section': ['Fruit', 'Vegetables', 'Herbs', 'Limes', 'Lemon', 'Avocado', 'Salad', 'Guacamole', 'Cilantro', 'Produce'],
  'Meat & Seafood': ['Beef', 'Chicken', 'Pork', 'Carnitas', 'Patty', 'Burger', 'Steak', 'Fish', 'Shrimp', 'Meat', 'Bacon'],
  'Dairy & Refrigerated': ['Cheese', 'Butter', 'Cream', 'Milk', 'Dip', 'Sour Cream', 'Yogurt', 'Dairy'],
  'Bakery & Bread': ['Cake', 'Cupcakes', 'Tortilla', 'Bun', 'Bread', 'Bagel', 'Pastry', 'Bakery'],
  'Beverages & Alcohol': ['Beer', 'Wine', 'Seltzer', 'Juice', 'Soda', 'Punch', 'Tequila', 'Vodka', 'Liquor', 'Mixer', 'Sprite', 'Beverage'],
  'Salty Snacks & Candy': ['Chip', 'Doritos', 'Cheetos', 'Nuts', 'Popcorn', 'Candy', 'Salsa', 'Snack'],
  'Frozen Foods': ['Ice', 'Pizza', 'Bites', 'Ice Cream', 'Frozen'],
  'Party Goods & Decor': ['Plate', 'Napkin', 'Cup', 'Tablecloth', 'Banner', 'Glow', 'Balloon', 'Piñata', 'Decor', 'Favors', 'Paper', 'Cutlery']
};

export const guessDepartment = (item: ShoppingItem): string => {
  if (item.aisleTip) return item.aisleTip;
  const nameLower = item.name.toLowerCase();
  
  for (const [dept, keywords] of Object.entries(AISLE_GROUPS)) {
    if (keywords.some(k => nameLower.includes(k.toLowerCase()))) {
      return dept;
    }
  }
  
  if (item.category === 'Beverages & Bar') return 'Beverages & Alcohol';
  if (item.category === 'Decor & Vibe' || item.category === 'Tableware & Supplies') return 'Party Goods & Decor';
  if (item.category === 'Favors & Games') return 'Party Goods & Decor';
  
  return 'General Grocery';
};

export const scaleShoppingList = (items: ShoppingItem[], multiplier: number): ShoppingItem[] => {
  if (multiplier === 1) return items;
  
  return items.map(item => {
    const newNumeric = Math.ceil(item.numericQuantity * multiplier);
    const newCost = Math.round(item.estimatedCost * multiplier * 100) / 100;
    
    // Attempt to update quantity string if simple number
    let newQuantityStr = item.quantity;
    if (/^\d+\s*/.test(item.quantity)) {
      newQuantityStr = item.quantity.replace(/^\d+/, newNumeric.toString());
    } else {
      newQuantityStr = `${newNumeric} ${item.unit} (scaled for guests)`;
    }

    return {
      ...item,
      numericQuantity: newNumeric,
      quantity: newQuantityStr,
      estimatedCost: newCost,
    };
  });
};
