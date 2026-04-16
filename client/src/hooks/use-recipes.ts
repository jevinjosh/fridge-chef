import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertRecipe, type Recipe } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Response type for generation endpoint
type GeneratedRecipe = z.infer<typeof api.recipes.generate.responses[200]>;

export function useRecipes() {
  return useQuery({
    queryKey: [api.recipes.list.path],
    queryFn: async () => {
      const res = await fetch(api.recipes.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch recipes");
      return api.recipes.list.responses[200].parse(await res.json());
    },
  });
}

export function useGenerateRecipe() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (dishName: string) => {
      const validated = api.recipes.generate.input.parse({ dishName });
      
      const res = await fetch(api.recipes.generate.path, {
        method: api.recipes.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to generate recipe");
      }
      
      return api.recipes.generate.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        title: "Kitchen Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useSaveRecipe() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertRecipe) => {
      const validated = api.recipes.create.input.parse(data);
      
      const res = await fetch(api.recipes.create.path, {
        method: api.recipes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to save recipe");
      return api.recipes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.recipes.list.path] });
      toast({
        title: "Added to Menu",
        description: "This recipe has been saved to your cookbook.",
        className: "bg-background border-primary text-foreground font-display",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not save recipe to cookbook.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.recipes.delete.path, { id });
      const res = await fetch(url, { 
        method: api.recipes.delete.method,
        credentials: "include" 
      });
      
      if (!res.ok) throw new Error("Failed to delete recipe");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.recipes.list.path] });
      toast({
        title: "Recipe Removed",
        description: "The item has been 86'd from the menu.",
      });
    },
  });
}
