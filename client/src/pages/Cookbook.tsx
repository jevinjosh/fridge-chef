import { Navigation } from "@/components/Navigation";
import { useRecipes, useDeleteRecipe } from "@/hooks/use-recipes";
import { VintageCard } from "@/components/VintageCard";
import { Trash2, Loader2, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { type Recipe } from "@shared/schema";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Cookbook() {
  const { data: recipes, isLoading, error } = useRecipes();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center gap-4 text-primary">
            <Loader2 className="h-12 w-12 animate-spin" />
            <span className="font-display text-xl animate-pulse">Opening the Cookbook...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-destructive font-display text-2xl">The kitchen is closed.</div>
          <p className="text-muted-foreground mt-2 font-typewriter">Error loading recipes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl text-primary drop-shadow-sm">
            The Cookbook
          </h1>
          <div className="h-1 w-24 bg-secondary mx-auto rounded-full" />
          <p className="text-lg text-muted-foreground font-body italic">
            A curated collection of your generated favorites.
          </p>
        </div>

        {!recipes || recipes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-8">
            {recipes.map((recipe, index) => (
              <CookbookItem key={recipe.id} recipe={recipe} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <VintageCard className="text-center py-20">
      <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
        <Clock className="w-10 h-10 text-primary/40" />
      </div>
      <h3 className="font-display text-2xl text-primary mb-3">No Recipes Yet</h3>
      <p className="text-muted-foreground font-typewriter max-w-xs mx-auto mb-8">
        Your cookbook is waiting for its first entry. Visit the Chef's Table to start cooking.
      </p>
      <Button asChild variant="outline" className="font-display">
        <a href="/">Go to Chef's Table</a>
      </Button>
    </VintageCard>
  );
}

function CookbookItem({ recipe, index }: { recipe: Recipe; index: number }) {
  const deleteMutation = useDeleteRecipe();
  const [isOpen, setIsOpen] = useState(false);

  // Parse JSON data safely
  const ingredients = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients as string[]
    : JSON.parse(recipe.ingredients as unknown as string);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <VintageCard className="group transition-all duration-300 hover:shadow-2xl hover:border-primary/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
              {recipe.title}
            </h3>
            <div className="flex gap-4 mt-2 text-xs font-typewriter text-muted-foreground uppercase tracking-wider">
              {recipe.cookTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {recipe.cookTime}
                </span>
              )}
              {recipe.servings && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {recipe.servings}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="font-display text-primary border-primary/20 hover:bg-primary/5">
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#FFFBF0] border-4 border-double border-primary/20">
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl text-primary text-center pb-4 border-b border-primary/10">
                    {recipe.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-6 space-y-6">
                  <p className="italic text-center text-muted-foreground font-body">
                    "{recipe.summary}"
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold font-display text-lg mb-2 text-foreground">Ingredients</h4>
                      <ul className="space-y-1 font-typewriter text-sm">
                        {ingredients.map((ing: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-secondary">•</span> {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold font-display text-lg mb-2 text-foreground">Overview</h4>
                      <div className="space-y-2 font-typewriter text-sm">
                         <p>Cook Time: {recipe.cookTime}</p>
                         <p>Servings: {recipe.servings}</p>
                         <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-dashed border-primary/20">
                           Created from: {recipe.userIngredients}
                         </p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              onClick={() => deleteMutation.mutate(recipe.id)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground font-body italic leading-relaxed line-clamp-2 md:line-clamp-none border-l-2 border-secondary/50 pl-4">
          {recipe.summary}
        </p>
      </VintageCard>
    </motion.div>
  );
}
