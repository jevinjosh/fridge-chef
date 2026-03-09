import { motion } from "framer-motion";
import { type InsertRecipe } from "@shared/schema";
import { Clock, Users, ChefHat, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecipeDisplayProps {
  recipe: InsertRecipe;
  onSave: () => void;
  isSaving: boolean;
  onReset: () => void;
}

export function RecipeDisplay({ recipe, onSave, isSaving, onReset }: RecipeDisplayProps) {
  // Safe parsing for JSON fields in case they come as strings
  const ingredients = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients 
    : JSON.parse(recipe.ingredients as unknown as string);
    
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : JSON.parse(recipe.instructions as unknown as string);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-3xl mx-auto"
    >
      <div className="paper-card p-8 md:p-12 relative">
        {/* Ribbon decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-secondary text-background px-6 py-2 shadow-lg rounded-sm font-typewriter font-bold text-sm tracking-widest uppercase border border-primary/20">
            Daily Special
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10 mt-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-primary mb-4 leading-tight">
            {recipe.title}
          </h1>
          <div className="flex justify-center gap-6 text-sm font-typewriter text-muted-foreground uppercase tracking-wider">
            {recipe.cookTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                {recipe.cookTime}
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-secondary" />
                {recipe.servings}
              </div>
            )}
          </div>
          <p className="mt-6 text-lg italic text-foreground/80 max-w-xl mx-auto leading-relaxed border-b-2 border-double border-primary/10 pb-6">
            "{recipe.summary}"
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr,1.5fr] gap-12">
          {/* Ingredients Column */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-primary/20 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Ingredients
            </h3>
            <ul className="space-y-3 font-typewriter text-sm md:text-base text-foreground/90">
              {ingredients.map((ing: string, i: number) => (
                <li key={i} className="flex gap-3 leading-relaxed">
                  <span className="text-secondary select-none">•</span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions Column */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-primary/20 pb-2 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-secondary" />
              Preparation
            </h3>
            <div className="space-y-6">
              {instructions.map((step: string, i: number) => (
                <div key={i} className="group">
                  <div className="flex gap-4">
                    <span className="font-display font-bold text-2xl text-primary/30 group-hover:text-secondary transition-colors">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <p className="text-foreground/90 leading-relaxed pt-1">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 pt-8 border-t border-dashed border-primary/20 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold tracking-wide text-lg shadow-lg hover:shadow-xl transition-all"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">Saving...</span>
            ) : (
              <span className="flex items-center gap-2"><Save className="w-5 h-5" /> Save to Cookbook</span>
            )}
          </Button>
          
          <Button
            onClick={onReset}
            variant="outline"
            className="h-12 px-8 border-2 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary font-display font-bold tracking-wide text-lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Create Another
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
