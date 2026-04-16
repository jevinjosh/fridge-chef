import { users, recipes, type User, type InsertUser, type Recipe, type InsertRecipe } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  deleteRecipe(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private recipes: Map<number, Recipe>;
  private currentUserId: number;
  private currentRecipeId: number;

  constructor() {
    this.users = new Map();
    this.recipes = new Map();
    this.currentUserId = 1;
    this.currentRecipeId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const id = this.currentRecipeId++;
    const newRecipe: Recipe = { 
      ...recipe, 
      id, 
      summary: recipe.summary ?? null,
      servings: recipe.servings ?? null,
      cookTime: recipe.cookTime ?? null,
      userIngredients: recipe.userIngredients ?? null
    };
    this.recipes.set(id, newRecipe);
    return newRecipe;
  }

  async getRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async deleteRecipe(id: number): Promise<void> {
    this.recipes.delete(id);
  }
}

export const storage = new MemStorage();
