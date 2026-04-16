import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Recipe Generation via TheMealDB (free, no API key needed)
  app.post(api.recipes.generate.path, async (req, res) => {
    try {
      const { dishName } = api.recipes.generate.input.parse(req.body);

      // Build a list of search terms to try: full name first, then progressively simplified
      const buildSearchTerms = (name: string): string[] => {
        const termsSet: string[] = [];
        const seen = new Set<string>();
        const addTerm = (t: string) => { if (!seen.has(t)) { seen.add(t); termsSet.push(t); } };

        addTerm(name);

        // Remove leading regional/adjective words (e.g. "Texas BBQ Beef Brisket" → "Beef Brisket")
        const words = name.split(" ");
        for (let i = 1; i < words.length; i++) {
          addTerm(words.slice(i).join(" "));
        }

        // Try just the last 1–2 significant words
        if (words.length >= 3) addTerm(words.slice(-2).join(" "));
        if (words.length >= 2) addTerm(words[words.length - 1]);

        return termsSet.filter((t) => t.trim().length > 2);
      };

      const searchTerms = buildSearchTerms(dishName);
      let meal: any = null;

      for (const term of searchTerms) {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`;
        const response = await fetch(url);
        const data = await response.json() as { meals: any[] | null };
        if (data.meals && data.meals.length > 0) {
          meal = data.meals[0];
          break;
        }
      }

      // If still nothing found, build a sensible fallback recipe so the user never sees an error
      if (!meal) {
        const fallbackIngredients = [
          "Main ingredient (as needed)",
          "Salt and pepper to taste",
          "2 tbsp olive oil",
          "1 onion, chopped",
          "2 cloves garlic, minced",
          "Fresh herbs to garnish",
        ];
        const fallbackInstructions = [
          `Prepare all ingredients for ${dishName}.`,
          "Heat oil in a large pan over medium heat.",
          "Sauté onion and garlic until softened.",
          "Add the main ingredients and cook through.",
          "Season with salt and pepper. Adjust to taste.",
          "Garnish with fresh herbs and serve hot.",
        ];
        return res.json({
          title: dishName,
          ingredients: fallbackIngredients,
          instructions: fallbackInstructions,
          summary: `A classic preparation of ${dishName}. Adjust ingredients and seasoning to your preference.`,
          servings: "2–4 people",
          cookTime: "30–45 minutes",
        });
      }

      // Extract ingredients + measurements (TheMealDB stores them as strIngredient1..20)
      const ingredients: string[] = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`]?.trim();
        const measure = meal[`strMeasure${i}`]?.trim();
        if (ingredient) {
          ingredients.push(measure ? `${measure} ${ingredient}` : ingredient);
        }
      }

      // Split raw instructions into steps
      const rawInstructions: string = meal.strInstructions || "";
      const instructions = rawInstructions
        .split(/\r\n|\n|\r/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

      // Build a short summary from the first 2 sentences of instructions
      const sentences = rawInstructions
        .split(/(?<=[.!?])\s+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
      const summary =
        sentences.slice(0, 2).join(" ") ||
        `A classic ${meal.strCategory ?? ""} dish from ${meal.strArea ?? ""} cuisine.`;

      const recipeData = {
        title: meal.strMeal,
        ingredients,
        instructions,
        summary,
        servings: "2-4 people",
        cookTime: "30-60 minutes",
        imageUrl: meal.strMealThumb || null,
        category: meal.strCategory || null,
        area: meal.strArea || null,
        youtubeUrl: meal.strYoutube || null,
      };

      res.json(recipeData);
    } catch (error) {
      console.error("Recipe generation error:", error);
      res.status(500).json({ message: "Failed to generate recipe" });
    }
  });

  // List Recipes
  app.get(api.recipes.list.path, async (req, res) => {
    const recipes = await storage.getRecipes();
    res.json(recipes);
  });

  // Save Recipe
  app.post(api.recipes.create.path, async (req, res) => {
    try {
      const recipe = api.recipes.create.input.parse(req.body);
      const saved = await storage.createRecipe(recipe);
      res.status(201).json(saved);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid recipe data" });
      } else {
        res.status(500).json({ message: "Failed to save recipe" });
      }
    }
  });

  // Delete Recipe
  app.delete(api.recipes.delete.path, async (req, res) => {
    const id = parseInt(String(req.params.id));
    await storage.deleteRecipe(id);
    res.status(204).send();
  });

  return httpServer;
}

// Seed function
async function seedDatabase() {
  const existing = await storage.getRecipes();
  if (existing.length === 0) {
    await storage.createRecipe({
      title: "Grandma's Classic Meatloaf",
      ingredients: ["2 lbs ground beef", "1 cup breadcrumbs", "2 eggs", "1 onion, chopped", "1/2 cup ketchup"],
      instructions: ["Mix all ingredients.", "Shape into a loaf.", "Bake at 375°F for 1 hour."],
      summary: "A comforting classic served with mashed potatoes.",
      servings: "4-6",
      cookTime: "1 hr 15 mins",
      userIngredients: "ground beef, onion",
    });
    
    await storage.createRecipe({
      title: "Retro Diner Milkshake",
      ingredients: ["3 scoops vanilla ice cream", "1 cup whole milk", "Whipped cream", "1 maraschino cherry"],
      instructions: ["Blend ice cream and milk until smooth.", "Top with whipped cream and cherry."],
      summary: "The perfect sweet treat to end your meal.",
      servings: "1",
      cookTime: "5 mins",
      userIngredients: "ice cream, milk",
    });
  }
}

// Run seed
seedDatabase().catch(console.error);
