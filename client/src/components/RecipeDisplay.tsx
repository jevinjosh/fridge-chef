import { motion } from "framer-motion";
import { type InsertRecipe } from "@shared/schema";
import { Clock, Users, ChefHat, Save, RefreshCw, MapPin, Tag, Youtube, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecipeDisplayProps {
  recipe: InsertRecipe & {
    imageUrl?: string | null;
    category?: string | null;
    area?: string | null;
    youtubeUrl?: string | null;
  };
  onSave: () => void;
  isSaving: boolean;
  onReset: () => void;
}

export function RecipeDisplay({ recipe, onSave, isSaving, onReset }: RecipeDisplayProps) {
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
      className="max-w-4xl mx-auto pb-12"
    >
      {/* Hero Image + Title */}
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl" style={{ minHeight: 260 }}>
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full object-cover"
            style={{ maxHeight: 420, width: "100%", objectPosition: "center" }}
          />
        ) : (
          <div
            className="w-full flex items-center justify-center"
            style={{ height: 260, background: "linear-gradient(135deg, hsl(35,35%,93%), hsl(35,30%,88%))" }}
          >
            <ChefHat className="w-24 h-24" style={{ color: "hsla(18,75%,48%,0.25)" }} />
          </div>
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, hsla(20,25%,10%,0.85) 0%, hsla(20,25%,10%,0.35) 55%, transparent 100%)" }}
        />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {recipe.area && (
              <span
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: "hsla(18,75%,55%,0.85)", color: "white" }}
              >
                <MapPin className="w-3 h-3" /> {recipe.area} Cuisine
              </span>
            )}
            {recipe.category && (
              <span
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: "hsla(142,45%,42%,0.85)", color: "white" }}
              >
                <Tag className="w-3 h-3" /> {recipe.category}
              </span>
            )}
          </div>
          <h1
            className="text-3xl md:text-5xl font-bold leading-tight text-white"
            style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
          >
            {recipe.title}
          </h1>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-5 mb-6 px-1">
        {recipe.cookTime && (
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "hsl(20,15%,45%)" }}>
            <Clock className="w-4 h-4" style={{ color: "hsl(18,75%,48%)" }} />
            {recipe.cookTime}
          </div>
        )}
        {recipe.servings && (
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "hsl(20,15%,45%)" }}>
            <Users className="w-4 h-4" style={{ color: "hsl(18,75%,48%)" }} />
            {recipe.servings}
          </div>
        )}
        {recipe.youtubeUrl && (
          <a
            href={recipe.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold ml-auto px-4 py-1.5 rounded-full transition-all hover:opacity-90"
            style={{
              background: "hsla(0,85%,55%,0.1)",
              color: "hsl(0,72%,48%)",
              border: "1px solid hsla(0,72%,55%,0.25)",
            }}
          >
            <Youtube className="w-4 h-4" /> Watch on YouTube
          </a>
        )}
      </div>

      {/* Summary */}
      <div
        className="mb-8 p-5 rounded-2xl"
        style={{ background: "hsla(18,75%,48%,0.06)", border: "1px solid hsla(18,75%,48%,0.15)" }}
      >
        <p className="text-base md:text-lg italic leading-relaxed" style={{ color: "hsl(20,20%,38%)" }}>
          "{recipe.summary}"
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid md:grid-cols-[1fr,1.7fr] gap-6">

        {/* Ingredients */}
        <div className="paper-card p-6">
          <h3
            className="flex items-center gap-2 text-lg font-bold mb-5 pb-3"
            style={{
              color: "hsl(18,75%,42%)",
              borderBottom: "2px solid hsl(35,20%,90%)",
              fontFamily: "var(--font-display)",
            }}
          >
            <ChefHat className="w-5 h-5" />
            Ingredients
            <span
              className="ml-auto text-xs font-normal px-2 py-0.5 rounded-full"
              style={{ background: "hsl(35,30%,93%)", color: "hsl(20,15%,50%)" }}
            >
              {ingredients.length} items
            </span>
          </h3>
          <ul className="space-y-2.5">
            {ingredients.map((ing: string, i: number) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.035 }}
                className="flex items-start gap-3 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-typewriter)", color: "hsl(20,20%,30%)" }}
              >
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(142,45%,42%)" }} />
                {ing}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="paper-card p-6">
          <h3
            className="flex items-center gap-2 text-lg font-bold mb-5 pb-3"
            style={{
              color: "hsl(18,75%,42%)",
              borderBottom: "2px solid hsl(35,20%,90%)",
              fontFamily: "var(--font-display)",
            }}
          >
            Step-by-Step Preparation
            <span
              className="ml-auto text-xs font-normal px-2 py-0.5 rounded-full"
              style={{ background: "hsl(35,30%,93%)", color: "hsl(20,15%,50%)" }}
            >
              {instructions.length} steps
            </span>
          </h3>
          <div className="space-y-3">
            {instructions.map((step: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex gap-4 p-4 rounded-xl transition-all"
                style={{
                  background: "hsl(35,35%,97%)",
                  borderLeft: "3px solid hsl(18,75%,52%)",
                }}
              >
                <span
                  className="font-bold text-xl flex-shrink-0 leading-none mt-0.5"
                  style={{ color: "hsl(18,75%,52%)", minWidth: 28, fontFamily: "var(--font-display)" }}
                >
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: "hsl(20,20%,28%)" }}>
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="h-12 px-8 text-base font-bold tracking-wide rounded-xl transition-all btn-glow"
          style={{
            background: "linear-gradient(135deg, hsl(18,75%,50%), hsl(18,75%,40%))",
            color: "white",
            border: "none",
            fontFamily: "var(--font-display)",
          }}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">Saving...</span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-5 h-5" /> Save to Cookbook
            </span>
          )}
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          className="h-12 px-8 text-base font-bold tracking-wide rounded-xl transition-all"
          style={{
            background: "white",
            border: "2px solid hsl(35,20%,85%)",
            color: "hsl(20,25%,25%)",
            fontFamily: "var(--font-display)",
          }}
        >
          <RefreshCw className="w-5 h-5 mr-2" /> Try Another Dish
        </Button>
      </div>
    </motion.div>
  );
}
