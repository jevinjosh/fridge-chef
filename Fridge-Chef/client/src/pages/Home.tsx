import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { VintageCard } from "@/components/VintageCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateRecipe, useSaveRecipe } from "@/hooks/use-recipes";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { Sparkles, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type InsertRecipe } from "@shared/schema";

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState<InsertRecipe | null>(null);
  
  const generateMutation = useGenerateRecipe();
  const saveMutation = useSaveRecipe();

  const handleGenerate = () => {
    if (!ingredients.trim()) return;
    
    generateMutation.mutate(ingredients, {
      onSuccess: (data) => {
        // Transform the response to match InsertRecipe
        // The API returns typed strings inside arrays, but our schema expects arrays of strings
        setGeneratedRecipe({
          ...data,
          userIngredients: ingredients,
          // ensure arrays are proper
          ingredients: data.ingredients, 
          instructions: data.instructions,
        });
      }
    });
  };

  const handleSave = () => {
    if (!generatedRecipe) return;
    saveMutation.mutate(generatedRecipe);
  };

  const handleReset = () => {
    setGeneratedRecipe(null);
    setIngredients("");
  };

  return (
    <div className="min-h-screen pb-20">
      <Navigation />

      <main className="container mx-auto px-4 pt-12">
        <AnimatePresence mode="wait">
          {!generatedRecipe ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl text-primary mb-6 drop-shadow-sm">
                  The Chef's Table
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground font-body italic max-w-lg mx-auto leading-relaxed">
                  Tell us what's in your pantry, and our AI sous-chef will craft a bespoke daily special just for you.
                </p>
              </div>

              <VintageCard className="bg-[#FFFBF0]/90 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="relative">
                    <label 
                      htmlFor="ingredients" 
                      className="block font-display text-xl font-bold text-foreground mb-3 flex items-center gap-2"
                    >
                      <ChefHat className="w-5 h-5 text-secondary" />
                      Available Ingredients
                    </label>
                    <Textarea
                      id="ingredients"
                      placeholder="e.g., 2 eggs, leftover roasted chicken, spinach, heavy cream, parmesan cheese..."
                      className="min-h-[160px] text-lg p-6 bg-background border-2 border-primary/10 focus-visible:ring-secondary/50 focus-visible:border-secondary font-typewriter resize-none shadow-inner rounded-lg transition-all"
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                    />
                    <div className="absolute top-4 right-4 text-xs font-typewriter text-muted-foreground/50 pointer-events-none">
                      AI POWERED
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      size="lg"
                      onClick={handleGenerate}
                      disabled={generateMutation.isPending || !ingredients.trim()}
                      className="
                        w-full sm:w-auto px-8 py-6 text-lg font-display font-bold tracking-wider uppercase
                        bg-primary hover:bg-primary/90 text-primary-foreground 
                        shadow-[0_4px_0_0_rgba(44,24,16,0.3)] hover:shadow-[0_2px_0_0_rgba(44,24,16,0.3)] hover:translate-y-[2px]
                        active:shadow-none active:translate-y-[4px]
                        transition-all duration-150 rounded-lg
                      "
                    >
                      {generateMutation.isPending ? (
                        <span className="flex items-center gap-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                          Consulting the Chef...
                        </span>
                      ) : (
                        <span className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5" />
                          Generate Daily Special
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </VintageCard>
              
              <div className="mt-12 text-center text-sm font-typewriter text-muted-foreground/60">
                <p>Est. 2025 • Bon Appétit</p>
              </div>
            </motion.div>
          ) : (
            <RecipeDisplay
              key="result"
              recipe={generatedRecipe}
              onSave={handleSave}
              isSaving={saveMutation.isPending}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
