import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI client with required User-Agent telemetry
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// API: Generate Party Plan
app.post("/api/plan-party", async (req, res) => {
  try {
    const { criteria } = req.body;
    if (!criteria) {
      return res.status(400).json({ error: "Missing party criteria parameter" });
    }

    const ai = getGenAIClient();
    const prompt = `You are CymbalMart's Master Party Planner & Event Shopping Agent.
Generate a comprehensive, budget-conscious, and creative party shopping plan for a busy host based on the following event criteria:

Event Title: ${criteria.title || 'Festive CymbalMart Celebration'}
Type of Event: ${criteria.eventType}
Theme/Vibe: ${criteria.theme}
Guests: ${criteria.adultCount} Adults, ${criteria.kidCount} Kids (Total: ${criteria.adultCount + criteria.kidCount})
Duration: ${criteria.durationHours} Hours
Venue: ${criteria.venue}
Budget Level: ${criteria.budgetLevel} ${criteria.customBudgetAmount ? `(Target ~$${criteria.customBudgetAmount})` : ''}
Dietary Restrictions: ${criteria.dietaryRestrictions ? criteria.dietaryRestrictions.join(', ') : 'None specified'}
Additional Notes / Special Requests: ${criteria.additionalNotes || 'None'}

Calculations & CymbalMart Store Guidelines:
- Calculate exact food and beverage quantities specifically tailored for ${criteria.adultCount} adults and ${criteria.kidCount} kids over ${criteria.durationHours} hours.
- Include a curated shopping list split across categories: 'Food & Menu', 'Beverages & Bar', 'Decor & Vibe', 'Tableware & Supplies', 'Favors & Games'.
- Prefer CymbalMart brand items (e.g., 'CymbalMart Organic Tortillas', 'CymbalMart Fresh Bakery Cupcakes', 'CymbalMart Select Soda 12-pack') for high quality at budget-friendly pricing.
- Assign each item to a specific CymbalMart Supermarket Department/Aisle, such as:
  'Aisle 1 - Fresh Produce & Salads',
  'Aisle 2 - CymbalMart Deli & Prepared Foods',
  'Aisle 3 - Fresh Bakery & Artisan Breads',
  'Aisle 4 - Meat, Seafood & Poultry',
  'Aisle 5 - Dairy, Cheese & Chilled Juices',
  'Aisle 6 - Frozen Foods & Desserts',
  'Aisle 7 - Snacks, Chips & Dips',
  'Aisle 8 - Beverages, Craft Beer & Wines',
  'Aisle 10 - International & Specialty Foods',
  'Aisle 12 - CymbalMart Party Supplies & Paper Goods'.
- Provide estimated costs per item in USD that sum up close to the specified target budget ($${criteria.customBudgetAmount || 250}).
- Label items with Priority ('Essential', 'Recommended', 'Optional') and assign dietary tags where applicable.
- Build a step-by-step timeline of preparation tasks (1 Week Before, 2 Days Before, Day Before, Party Morning, 1 Hour Before).
- Provide a signature recipe tailored to the guest count.
- Select a stylish color palette (3-4 hex color codes).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themeVibeSummary: { type: Type.STRING },
            colorPalette: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 4 hex color strings e.g. #FF0055"
            },
            estimatedTotalBudget: { type: Type.NUMBER },
            decorTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            gamesAndPlaylist: {
              type: Type.OBJECT,
              properties: {
                games: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                playlistStyle: { type: Type.STRING }
              },
              required: ["games", "playlistStyle"]
            },
            shoppingList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING, description: "One of: Food & Menu, Beverages & Bar, Decor & Vibe, Tableware & Supplies, Favors & Games" },
                  quantity: { type: Type.STRING, description: "e.g. 3 lbs or 2 packs of 24" },
                  numericQuantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  estimatedCost: { type: Type.NUMBER },
                  priority: { type: Type.STRING, description: "Essential, Recommended, or Optional" },
                  dietaryTags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  aisleTip: { type: Type.STRING },
                  cymbalMartAisle: { type: Type.STRING, description: "e.g. Aisle 1 - Fresh Produce & Salads" },
                  isCymbalBrand: { type: Type.BOOLEAN },
                  notes: { type: Type.STRING }
                },
                required: ["id", "name", "category", "quantity", "numericQuantity", "unit", "estimatedCost", "priority"]
              }
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  timeframe: { type: Type.STRING, description: "1 Week Before, 2 Days Before, Day Before, Party Morning, or 1 Hour Before" },
                  task: { type: Type.STRING },
                  completed: { type: Type.BOOLEAN }
                },
                required: ["id", "timeframe", "task", "completed"]
              }
            },
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  servings: { type: Type.NUMBER },
                  prepTime: { type: Type.STRING },
                  ingredients: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  instructions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["id", "title", "servings", "prepTime", "ingredients", "instructions"]
              }
            }
          },
          required: ["themeVibeSummary", "colorPalette", "estimatedTotalBudget", "shoppingList", "timeline", "decorTips", "gamesAndPlaylist", "recipes"]
        }
      }
    });

    const rawText = response.text || "{}";
    const planData = JSON.parse(rawText);

    // Format shopping list items properly with CymbalMart defaults
    const formattedShoppingList = (planData.shoppingList || []).map((item: any, idx: number) => ({
      ...item,
      id: item.id || `item-${Date.now()}-${idx}`,
      isPurchased: false,
      isCymbalBrand: item.isCymbalBrand ?? (item.name.toLowerCase().includes('cymbal') || idx % 2 === 0),
      cymbalMartAisle: item.cymbalMartAisle || item.aisleTip || 'Aisle 2 - CymbalMart Grocery',
      category: ['Food & Menu', 'Beverages & Bar', 'Decor & Vibe', 'Tableware & Supplies', 'Favors & Games'].includes(item.category) 
        ? item.category 
        : 'Food & Menu',
      priority: ['Essential', 'Recommended', 'Optional'].includes(item.priority) ? item.priority : 'Essential'
    }));

    const completePartyPlan = {
      id: `plan-${Date.now()}`,
      criteria,
      themeVibeSummary: planData.themeVibeSummary || "An unforgettable CymbalMart party plan tailored for your guests.",
      colorPalette: planData.colorPalette || ["#10B981", "#6366F1", "#EC4899"],
      shoppingList: formattedShoppingList,
      estimatedTotalBudget: planData.estimatedTotalBudget || formattedShoppingList.reduce((acc: number, item: any) => acc + (item.estimatedCost || 0), 0),
      timeline: (planData.timeline || []).map((t: any, idx: number) => ({ ...t, id: t.id || `t-${idx}`, completed: false })),
      recipes: planData.recipes || [],
      decorTips: planData.decorTips || [],
      gamesAndPlaylist: planData.gamesAndPlaylist || { games: [], playlistStyle: "CymbalMart Party Mix" },
      createdDate: new Date().toISOString()
    };

    return res.json({ success: true, plan: completePartyPlan });
  } catch (error: any) {
    console.error("Error in /api/plan-party:", error);
    return res.status(500).json({ 
      success: false, 
      error: error?.message || "Failed to generate party plan" 
    });
  }
});

// API: CymbalMart Smart Budget Optimizer
app.post("/api/optimize-budget", async (req, res) => {
  try {
    const { shoppingList, targetBudget, criteria } = req.body;
    if (!shoppingList || !targetBudget) {
      return res.status(400).json({ error: "Missing shoppingList or targetBudget" });
    }

    const ai = getGenAIClient();
    const prompt = `You are CymbalMart's Smart Budget Optimizer Agent.
The user wants to align their party shopping list strictly to stay under their target budget of $${targetBudget}.
Current party: "${criteria?.title || 'Party'}" for ${criteria?.adultCount || 10} adults and ${criteria?.kidCount || 0} kids.

Current items list:
${JSON.stringify(shoppingList.map((i: any) => ({
  id: i.id,
  name: i.name,
  category: i.category,
  quantity: i.quantity,
  numericQuantity: i.numericQuantity,
  unit: i.unit,
  estimatedCost: i.estimatedCost,
  priority: i.priority,
  isCymbalBrand: i.isCymbalBrand,
  cymbalMartAisle: i.cymbalMartAisle
})), null, 2)}

Instructions:
1. Adjust item quantities or swap name-brand items to CymbalMart Brand alternatives (e.g. 'CymbalMart Fresh', 'CymbalMart Select') to lower cost.
2. Reduce or remove non-essential optional decor items if necessary to get the total estimated cost equal to or below $${targetBudget}.
3. Maintain all essential food and core beverages so guests are fully taken care of.
4. Return the adjusted shopping list and an explanation of the savings applied.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizationSummary: { type: Type.STRING },
            totalNewBudget: { type: Type.NUMBER },
            savingsAmount: { type: Type.NUMBER },
            optimizedList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  numericQuantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  estimatedCost: { type: Type.NUMBER },
                  priority: { type: Type.STRING },
                  cymbalMartAisle: { type: Type.STRING },
                  isCymbalBrand: { type: Type.BOOLEAN },
                  notes: { type: Type.STRING }
                },
                required: ["id", "name", "category", "quantity", "numericQuantity", "unit", "estimatedCost", "priority"]
              }
            }
          },
          required: ["optimizationSummary", "totalNewBudget", "savingsAmount", "optimizedList"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return res.json({ success: true, ...data });
  } catch (error: any) {
    console.error("Error in /api/optimize-budget:", error);
    return res.status(500).json({ success: false, error: error?.message || "Failed to optimize budget" });
  }
});

// API: Party Agent Chat / Advice
app.post("/api/chat-agent", async (req, res) => {
  try {
    const { userMessage, partyPlan } = req.body;
    if (!userMessage) {
      return res.status(400).json({ error: "Missing userMessage" });
    }

    const ai = getGenAIClient();
    
    const contextPrompt = partyPlan ? `
The host is currently planning a CymbalMart party:
- Title: ${partyPlan.criteria.title}
- Theme: ${partyPlan.criteria.theme}
- Guests: ${partyPlan.criteria.adultCount} adults, ${partyPlan.criteria.kidCount} kids
- Target Budget: $${partyPlan.criteria.customBudgetAmount || partyPlan.estimatedTotalBudget}
- Current List Total: $${partyPlan.shoppingList.reduce((acc: number, i: any) => acc + (i.actualCost ?? i.estimatedCost), 0)}
- Items count: ${partyPlan.shoppingList.length} items
` : 'No party generated yet.';

    const prompt = `You are "CymbalMart Event Concierge", an expert retail shopping and party planning AI assistant for CymbalMart.
${contextPrompt}

User Question/Request: "${userMessage}"

Provide helpful, friendly, actionable advice. Suggest CymbalMart products, store aisle navigation, ingredient substitutions, budget optimizations, or event tips. Keep it concise with bullet points if applicable.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return res.json({ 
      success: true, 
      reply: response.text || "Welcome to CymbalMart! How can I assist with your party shopping list today?"
    });
  } catch (error: any) {
    console.error("Error in /api/chat-agent:", error);
    return res.status(500).json({ success: false, error: error?.message || "Failed to process agent message" });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Party Planner Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
