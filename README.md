# CymbalMart-Shopping-Agent

An AI-powered party planning and shopping assistant built using **Google AI Studio** and **Gemini 3.6 Flash**. 

This application automates party planning by converting high-level event details into curated, budget-conscious shopping lists organized by store departments, along with real-time budget tracking and customization.

---

## Features

- **Event Customization:** Define party themes, guest counts, target budgets, and dietary restrictions.
- **Dynamic Quantity Scaling:** Automatically scales ingredient, tableware, and decor quantities based on guest headcounts.
- **Budget Optimization:** Real-time budget recalculations and store department aisle recommendations (Food & Beverage, Decor, Favors & Games).
- **Interactive UI:** Built-in starter templates, printable views, and CSV export capabilities.

---

## Critical User Journey (CUJ)

1. **Define Event:** Host specifies party type, theme, total budget, and guest count.
2. **Review List:** Gemini generates a department-grouped shopping list aligned with budget constraints.
3. **Refine & Finalize:** Host adjusts constraints, updates item preferences, and finalizes the party plan.

---

## Tech Stack

- **Framework:** React / TypeScript / Vite
- **AI Engine:** Google Gemini 3.6 Flash (via Google AI Studio)
- **Styling:** Tailwind CSS

---

## How to Run Locally

1. Download or clone this repository.
2. Open your terminal in the project directory.
3. Install dependencies:
   ```bash
   npm install
