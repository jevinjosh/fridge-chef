import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Recipe Generation
  app.post(api.recipes.generate.path, async (req, res) => {
    try {
      const { ingredients } = api.recipes.generate.input.parse(req.body);

      const prompt = `
        You are a creative chef at a high-end retro diner. 
        Create a delicious recipe using these ingredients: ${ingredients}.
        You can assume common pantry staples (salt, pepper, oil, flour, etc.) are available.
        
        Return a JSON object with the following fields:
        - title: Creative name for the dish
        - ingredients: Array of strings (ingredients with measurements)
        - instructions: Array of strings (step-by-step instructions)
        - summary: A short, appetizing description (2-3 sentences)
        - servings: e.g. "2-4 people"
        - cookTime: e.g. "45 minutes"

        Do not include any markdown formatting, just raw JSON.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("Failed to generate recipe");
      }

      const recipeData = JSON.parse(content);
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
    const id = parseInt(req.params.id);
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
