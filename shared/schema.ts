import { pgTable, text, serial, integer, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  ingredients: jsonb("ingredients").notNull(), // Array of strings
  instructions: jsonb("instructions").notNull(), // Array of strings
  summary: text("summary"), // Short description
  servings: text("servings"),
  cookTime: text("cook_time"),
  userIngredients: text("user_ingredients"), // What the user input
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({ id: true });

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
