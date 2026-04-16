import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { useGenerateRecipe, useSaveRecipe } from "@/hooks/use-recipes";
import { countries, type Country, type Region, type SubRegion, type Dish } from "@/data/regional-cuisine";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Globe, MapPin, Utensils, ArrowLeft, Loader2 } from "lucide-react";
import { type InsertRecipe } from "@shared/schema";

type Step = "country" | "region" | "subregion" | "dish";

interface BreadcrumbItem {
  label: string;
  step: Step;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
  }),
};

const slideVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -60, transition: { duration: 0.2 } },
};

export default function RegionalCuisine() {
  const [step, setStep] = useState<Step>("country");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedSubRegion, setSelectedSubRegion] = useState<SubRegion | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<InsertRecipe | null>(null);
  const [loadingDish, setLoadingDish] = useState<string | null>(null);

  const generateMutation = useGenerateRecipe();
  const saveMutation = useSaveRecipe();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [{ label: "World", step: "country" }];
    if (selectedCountry) crumbs.push({ label: selectedCountry.name + " " + selectedCountry.flag, step: "region" });
    if (selectedRegion) crumbs.push({ label: selectedRegion.emoji + " " + selectedRegion.name, step: "subregion" });
    if (selectedSubRegion) crumbs.push({ label: selectedSubRegion.emoji + " " + selectedSubRegion.name, step: "dish" });
    return crumbs;
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setStep("region");
  };

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    setStep("subregion");
  };

  const handleSubRegionSelect = (sub: SubRegion) => {
    setSelectedSubRegion(sub);
    setStep("dish");
  };

  const handleDishSelect = (dish: Dish) => {
    setLoadingDish(dish.name);
    generateMutation.mutate(dish.name, {
      onSuccess: (data) => {
        setGeneratedRecipe({
          ...data,
          userIngredients: dish.name,
          ingredients: data.ingredients,
          instructions: data.instructions,
        });
        setLoadingDish(null);
      },
      onError: () => {
        setLoadingDish(null);
      },
    });
  };

  const handleBreadcrumbClick = (targetStep: Step) => {
    setGeneratedRecipe(null);
    setLoadingDish(null);
    setStep(targetStep);
    if (targetStep === "country") {
      setSelectedCountry(null);
      setSelectedRegion(null);
      setSelectedSubRegion(null);
    } else if (targetStep === "region") {
      setSelectedRegion(null);
      setSelectedSubRegion(null);
    } else if (targetStep === "subregion") {
      setSelectedSubRegion(null);
    }
  };

  const handleBack = () => {
    setGeneratedRecipe(null);
    setLoadingDish(null);
    if (step === "region") { setSelectedCountry(null); setStep("country"); }
    else if (step === "subregion") { setSelectedRegion(null); setStep("region"); }
    else if (step === "dish") { setSelectedSubRegion(null); setStep("subregion"); }
  };

  const handleResetRecipe = () => {
    setGeneratedRecipe(null);
  };

  const handleSave = () => {
    if (!generatedRecipe) return;
    saveMutation.mutate(generatedRecipe);
  };

  if (generatedRecipe) {
    return (
      <div className="min-h-screen pb-20">
        <Navigation />
        <main className="container mx-auto px-4 pt-8">
          <button
            onClick={handleResetRecipe}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground font-display text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {selectedSubRegion?.name ?? "dishes"}
          </button>
          <RecipeDisplay
            recipe={generatedRecipe}
            onSave={handleSave}
            isSaving={saveMutation.isPending}
            onReset={handleResetRecipe}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Navigation />

      <main className="container mx-auto px-4 pt-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl text-primary mb-3 font-display font-bold drop-shadow-sm">
            🌍 World Kitchen
          </h1>
          <p className="text-muted-foreground font-body italic text-lg">
            Explore cuisine by country, region, and tradition
          </p>
        </motion.div>

        {/* Breadcrumb */}
        {step !== "country" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center flex-wrap gap-1 mb-6 text-sm font-typewriter"
          >
            <button
              onClick={handleBack}
              className="mr-2 flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            {getBreadcrumbs().map((crumb, i) => (
              <span key={crumb.step} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground/50" />}
                <button
                  onClick={() => handleBreadcrumbClick(crumb.step)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    i === getBreadcrumbs().length - 1
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {crumb.label}
                </button>
              </span>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Country Selection */}
          {step === "country" && (
            <motion.div key="country" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <div className="mb-4 flex items-center gap-2 text-muted-foreground font-display text-sm uppercase tracking-widest">
                <Globe className="w-4 h-4" />
                Select a Country
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {countries.map((country, i) => (
                  <motion.button
                    key={country.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCountrySelect(country)}
                    className="group p-5 rounded-xl border-2 border-primary/10 bg-[#FFFBF0]/80 hover:bg-[#FFFBF0] hover:border-secondary/50 hover:shadow-lg transition-all text-left"
                  >
                    <div className="text-4xl mb-3">{country.flag}</div>
                    <div className="font-display font-bold text-foreground text-base group-hover:text-primary transition-colors">
                      {country.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-body mt-1 line-clamp-2">
                      {country.description}
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs text-secondary font-typewriter opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ChevronRight className="w-3 h-3" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Region Selection */}
          {step === "region" && selectedCountry && (
            <motion.div key="region" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <div className="mb-4 flex items-center gap-2 text-muted-foreground font-display text-sm uppercase tracking-widest">
                <MapPin className="w-4 h-4" />
                Select a Region in {selectedCountry.name}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedCountry.regions.map((region, i) => (
                  <motion.button
                    key={region.name}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleRegionSelect(region)}
                    className="group p-6 rounded-xl border-2 border-primary/10 bg-[#FFFBF0]/80 hover:bg-[#FFFBF0] hover:border-secondary/50 hover:shadow-lg transition-all text-left"
                  >
                    <div className="text-3xl mb-3">{region.emoji}</div>
                    <div className="font-display font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                      {region.name}
                    </div>
                    <div className="text-sm text-muted-foreground font-body mt-1">
                      {region.description}
                    </div>
                    <div className="mt-3 text-xs text-secondary font-typewriter">
                      {region.subRegions.length} areas →
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Sub-region / State Selection */}
          {step === "subregion" && selectedRegion && (
            <motion.div key="subregion" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <div className="mb-4 flex items-center gap-2 text-muted-foreground font-display text-sm uppercase tracking-widest">
                <MapPin className="w-4 h-4" />
                Select a State / Area
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {selectedRegion.subRegions.map((sub, i) => (
                  <motion.button
                    key={sub.name}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.04, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSubRegionSelect(sub)}
                    className="group p-5 rounded-xl border-2 border-primary/10 bg-[#FFFBF0]/80 hover:bg-[#FFFBF0] hover:border-secondary/50 hover:shadow-lg transition-all text-left"
                  >
                    <div className="text-3xl mb-2">{sub.emoji}</div>
                    <div className="font-display font-bold text-foreground text-base group-hover:text-primary transition-colors">
                      {sub.name}
                    </div>
                    <div className="mt-2 text-xs text-secondary font-typewriter">
                      {sub.dishes.length} dishes →
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Dish Selection */}
          {step === "dish" && selectedSubRegion && (
            <motion.div key="dish" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <div className="mb-4 flex items-center gap-2 text-muted-foreground font-display text-sm uppercase tracking-widest">
                <Utensils className="w-4 h-4" />
                Dishes from {selectedSubRegion.name}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {selectedSubRegion.dishes.map((dish, i) => {
                  const isLoading = loadingDish === dish.name;
                  return (
                    <motion.button
                      key={dish.name}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={!isLoading ? { scale: 1.05, y: -4 } : {}}
                      whileTap={!isLoading ? { scale: 0.97 } : {}}
                      onClick={() => !loadingDish && handleDishSelect(dish)}
                      disabled={!!loadingDish}
                      className={`group relative p-6 rounded-xl border-2 transition-all text-center ${
                        isLoading
                          ? "border-secondary bg-secondary/10 shadow-lg"
                          : loadingDish
                          ? "border-primary/10 bg-[#FFFBF0]/50 opacity-50 cursor-not-allowed"
                          : "border-primary/10 bg-[#FFFBF0]/80 hover:bg-[#FFFBF0] hover:border-secondary/50 hover:shadow-lg cursor-pointer"
                      }`}
                    >
                      <div className="text-4xl mb-3">
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                            className="flex justify-center"
                          >
                            <Loader2 className="w-8 h-8 text-secondary" />
                          </motion.div>
                        ) : (
                          dish.emoji
                        )}
                      </div>
                      <div className="font-display font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                        {dish.name}
                      </div>
                      {!loadingDish && (
                        <div className="mt-2 text-xs text-secondary font-typewriter opacity-0 group-hover:opacity-100 transition-opacity">
                          Get Recipe →
                        </div>
                      )}
                      {isLoading && (
                        <div className="mt-2 text-xs text-secondary font-typewriter">
                          Fetching...
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <p className="mt-6 text-center text-xs text-muted-foreground font-typewriter">
                Click any dish to get its full recipe instantly
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
