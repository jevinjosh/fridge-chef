import { useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGenerateRecipe, useSaveRecipe, useSearchRecipes, type DishOption } from "@/hooks/use-recipes";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { Sparkles, Search, ChefHat, Loader2, ArrowDown, Star, Clock, Users, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { type InsertRecipe } from "@shared/schema";

const DISH_SUGGESTIONS = [
  {
    name: "Pasta Carbonara",
    emoji: "🍝",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80",
    time: "25 min",
    servings: 4,
    rating: 4.8,
    category: "Italian",
  },
  {
    name: "Butter Chicken",
    emoji: "🍛",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80",
    time: "40 min",
    servings: 6,
    rating: 4.9,
    category: "Indian",
  },
  {
    name: "Beef Tacos",
    emoji: "🌮",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
    time: "20 min",
    servings: 4,
    rating: 4.7,
    category: "Mexican",
  },
  {
    name: "Tiramisu",
    emoji: "🍰",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80",
    time: "30 min",
    servings: 8,
    rating: 4.9,
    category: "Dessert",
  },
  {
    name: "Pad Thai",
    emoji: "🍜",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&q=80",
    time: "30 min",
    servings: 4,
    rating: 4.6,
    category: "Thai",
  },
  {
    name: "Beef Stroganoff",
    emoji: "🥘",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    time: "45 min",
    servings: 5,
    rating: 4.7,
    category: "Russian",
  },
  {
    name: "Lasagna",
    emoji: "🫕",
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&q=80",
    time: "90 min",
    servings: 8,
    rating: 4.8,
    category: "Italian",
  },
  {
    name: "Fish and Chips",
    emoji: "🍟",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80",
    time: "35 min",
    servings: 4,
    rating: 4.5,
    category: "British",
  },
  {
    name: "Spaghetti Bolognese",
    emoji: "🍝",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80",
    time: "50 min",
    servings: 6,
    rating: 4.8,
    category: "Italian",
  },
  {
    name: "Chicken Curry",
    emoji: "🍗",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80",
    time: "40 min",
    servings: 5,
    rating: 4.7,
    category: "Indian",
  },
  {
    name: "Moussaka",
    emoji: "🫙",
    image: "https://images.unsplash.com/photo-1599789197514-47270cd526b4?w=600&q=80",
    time: "75 min",
    servings: 6,
    rating: 4.6,
    category: "Greek",
  },
  {
    name: "Chicken Tikka Masala",
    emoji: "🍲",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
    time: "45 min",
    servings: 6,
    rating: 4.9,
    category: "Indian",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: (i % 4) * 0.1,
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1] // Buttery smooth ease-out
    },
  }),
  hover: {
    y: -6,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const imageVariants = {
  hidden: { scale: 1.15 },
  visible: {
    scale: 1,
    transition: { duration: 1.6, ease: [0.25, 1, 0.5, 1] }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const HERO_STATS = [
  { label: "Recipes", value: "10K+" },
  { label: "Cuisines", value: "50+" },
  { label: "Happy Chefs", value: "500K+" },
];

export default function Home() {
  const [dishName, setDishName] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // committed query for the search hook
  const [loadingDish, setLoadingDish] = useState<string | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<
    (InsertRecipe & {
      imageUrl?: string | null;
      category?: string | null;
      area?: string | null;
      youtubeUrl?: string | null;
    }) | null
  >(null);
  const [showVarieties, setShowVarieties] = useState(false); // true when showing option-selection screen

  // ── Scroll-driven 3D animation hooks ──
  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  const heroImgY = useTransform(scrollY, [0, 700], [0, 200]);       // parallax: bg moves slower
  const heroContentY = useTransform(scrollY, [0, 500], [0, -55]);   // content lifts on scroll
  const heroOpacity = useTransform(scrollY, [0, 380], [1, 0.45]);  // hero fades as scrolled

  const generateMutation = useGenerateRecipe();
  const saveMutation = useSaveRecipe();
  const searchResult = useSearchRecipes(searchQuery);

  // Step 1: user presses "Get Recipe" → search for varieties
  const handleGenerate = () => {
    if (!dishName.trim()) return;
    setSearchQuery(dishName.trim());
    setShowVarieties(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleGenerate();
  };

  // Step 2: user picks a specific variety → generate the full recipe
  const triggerGenerate = (name: string) => {
    if (!name.trim()) return;
    setLoadingDish(name);
    generateMutation.mutate(name, {
      onSuccess: (data) => {
        setGeneratedRecipe({
          ...data,
          userIngredients: name,
          imageUrl: (data as any).imageUrl ?? null,
          category: (data as any).category ?? null,
          area: (data as any).area ?? null,
          youtubeUrl: (data as any).youtubeUrl ?? null,
        });
        setLoadingDish(null);
        setShowVarieties(false);
      },
      onError: () => setLoadingDish(null),
    });
  };

  const handleSave = () => {
    if (!generatedRecipe) return;
    saveMutation.mutate(generatedRecipe);
  };

  const handleReset = () => {
    setGeneratedRecipe(null);
    setDishName("");
    setLoadingDish(null);
    setShowVarieties(false);
    setSearchQuery("");
  };

  const scrollToContent = () => {
    document.getElementById("discover-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(36,40%,97%)" }}>
      {/* ── Fixed scroll progress bar ── */}
      <motion.div
        style={{
          scaleX: smoothProgress,
          transformOrigin: "left",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, hsl(18,82%,54%), hsl(38,95%,52%), hsl(18,82%,54%))",
          zIndex: 9999,
          boxShadow: "0 0 12px hsla(18,82%,54%,0.6)",
        }}
      />
      <Navigation />

      <AnimatePresence mode="wait">
        {generatedRecipe ? (
          /* ════════════════ RECIPE RESULT VIEW ════════════════ */
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 pt-10 max-w-5xl"
          >
            <button
              onClick={handleReset}
              className="mb-6 flex items-center gap-2 text-sm transition-colors"
              style={{ color: "hsl(20,15%,55%)", fontFamily: "var(--font-typewriter)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "hsl(18,75%,42%)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "hsl(20,15%,55%)")}
            >
              ← Back to dishes
            </button>
            <RecipeDisplay
              recipe={generatedRecipe}
              onSave={handleSave}
              isSaving={saveMutation.isPending}
              onReset={handleReset}
            />
          </motion.div>
        ) : showVarieties ? (
          /* ════════════════ VARIETY PICKER VIEW ════════════════ */
          <motion.div
            key="varieties"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 28px 96px" }}
          >
            {/* Back + heading */}
            <button
              onClick={handleReset}
              className="mb-8 flex items-center gap-2 text-sm transition-colors"
              style={{ color: "hsl(20,15%,55%)", fontFamily: "var(--font-typewriter)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "hsl(18,75%,42%)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "hsl(20,15%,55%)")}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} /> Back to search
            </button>

            <div style={{ marginBottom: 40 }}>
              <p style={{ fontFamily: "var(--font-typewriter)", fontSize: 11, color: "hsl(18,75%,48%)", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>
                ✦ Choose a Recipe
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.7rem,3.5vw,2.6rem)", fontWeight: 800, color: "hsl(20,25%,12%)", letterSpacing: "-0.025em", marginBottom: 8 }}>
                What kind of{" "}
                <span style={{ background: "linear-gradient(108deg,hsl(18,82%,50%),hsl(38,95%,52%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  "{searchQuery}"
                </span>{" "}
                would you like?
              </h2>
              <p style={{ color: "hsl(20,12%,52%)", fontFamily: "var(--font-body)", fontSize: "1rem" }}>
                {searchResult.isLoading
                  ? "Searching across our recipe database…"
                  : `Found ${searchResult.data?.length ?? 0} options — tap one to get the full recipe`}
              </p>
            </div>

            {/* Loading skeleton */}
            {searchResult.isLoading && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ borderRadius: 18, overflow: "hidden", background: "hsl(36,30%,90%)", height: 260, animation: "pulse 1.6s ease-in-out infinite" }} />
                ))}
              </div>
            )}

            {/* Options grid */}
            {!searchResult.isLoading && searchResult.data && searchResult.data.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20 }}>
                {searchResult.data.map((option, i) => {
                  const isLoading = loadingDish === option.name;
                  return (
                    <motion.button
                      key={option.name}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={!loadingDish ? { y: -6, scale: 1.025 } : {}}
                      whileTap={!loadingDish ? { scale: 0.97 } : {}}
                      onClick={() => !loadingDish && triggerGenerate(option.name)}
                      disabled={!!loadingDish}
                      style={{
                        background: "white",
                        border: isLoading ? "2px solid hsl(18,75%,52%)" : "1.5px solid hsl(35,20%,88%)",
                        borderRadius: 18,
                        overflow: "hidden",
                        textAlign: "left",
                        cursor: loadingDish ? "not-allowed" : "pointer",
                        opacity: loadingDish && !isLoading ? 0.5 : 1,
                        boxShadow: isLoading
                          ? "0 0 0 4px hsla(18,75%,52%,0.15), 0 12px 36px hsla(18,75%,40%,0.18)"
                          : "0 2px 12px hsla(20,20%,15%,0.07)",
                        transition: "box-shadow 0.3s, border-color 0.3s, opacity 0.3s",
                      }}
                    >
                      {/* Image — server always provides one; onError is a last-resort safety net */}
                      <div style={{ position: "relative", paddingTop: "65%", overflow: "hidden", background: "hsl(36,30%,92%)" }}>
                        <img
                          src={option.imageUrl ?? `https://loremflickr.com/640/480/${encodeURIComponent(option.name + ",food")}?lock=1`}
                          alt={option.name}
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector(".img-fallback")) {
                              const fb = document.createElement("div");
                              fb.className = "img-fallback";
                              fb.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:48px;";
                              fb.textContent = "🍽️";
                              parent.appendChild(fb);
                            }
                          }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,14,10,0.65) 0%, transparent 55%)" }} />

                        {isLoading && (
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "hsla(36,40%,97%,0.7)" }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px hsla(18,75%,40%,0.2)" }}>
                              <Loader2 style={{ width: 24, height: 24, color: "hsl(18,75%,48%)" }} className="animate-spin" />
                            </div>
                          </div>
                        )}

                        {option.area && (
                          <div style={{ position: "absolute", top: 10, left: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", fontSize: 10, fontWeight: 700, color: "hsl(18,72%,44%)", fontFamily: "var(--font-typewriter)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {option.area}
                          </div>
                        )}

                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px" }}>
                          <p style={{ color: "white", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.95rem", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
                            {option.name}
                          </p>
                        </div>
                      </div>

                      {/* Card footer */}
                      <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "hsl(20,15%,50%)", fontFamily: "var(--font-typewriter)" }}>
                          {option.category || "Recipe"}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 999, background: "linear-gradient(135deg,hsl(18,82%,54%),hsl(38,88%,54%))", color: "white", fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)", boxShadow: "0 2px 8px hsla(18,75%,44%,0.3)" }}>
                          <Sparkles style={{ width: 10, height: 10 }} />
                          Cook it
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* No results */}
            {!searchResult.isLoading && searchResult.data?.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🔍</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "hsl(20,25%,20%)", marginBottom: 12 }}>
                  No varieties found for "{searchQuery}"
                </h3>
                <p style={{ color: "hsl(20,12%,52%)", fontFamily: "var(--font-body)", marginBottom: 24 }}>
                  Try a different name or generate the recipe directly.
                </p>
                <Button
                  onClick={() => triggerGenerate(searchQuery)}
                  disabled={!!loadingDish}
                  style={{ background: "linear-gradient(135deg,hsl(18,82%,54%),hsl(18,75%,44%))", color: "white", border: "none", borderRadius: 12, fontFamily: "var(--font-display)", fontWeight: 700, padding: "12px 28px" }}
                >
                  {loadingDish ? <><Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> Generating…</> : <><Sparkles style={{ width: 16, height: 16 }} /> Generate Anyway</>}
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          /* ════════════════ HOME / HERO VIEW ════════════════ */
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            {/* ════════════════ HERO SECTION (ESPACIO LA NUBE STYLE) ════════════════ */}
            <section
              style={{
                position: "relative",
                width: "100%",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                background: "hsl(20,25%,12%)",
              }}
            >
              {/* ── MASSIVE IMMERSIVE BACKGROUND ── */}
              <motion.div
                initial={{ scale: 1.08, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2.2, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                }}
              >
                <motion.img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=2400&q=90"
                  alt="Immersive kitchen"
                  style={{ width: "100%", height: "115%", objectFit: "cover", marginTop: "-5vh", y: heroImgY }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,10,5,0.3) 0%, rgba(15,10,5,0.85) 100%)" }} />
              </motion.div>

              {/* ── CENTERED HERO CONTENT ── */}
              <motion.div
                style={{
                  position: "relative",
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 24px",
                  maxWidth: 900,
                  y: heroContentY,
                  opacity: heroOpacity,
                }}
              >
                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                  style={{
                    padding: "8px 24px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    marginBottom: 36,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "hsl(35,80%,85%)",
                      fontFamily: "var(--font-typewriter)",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    }}
                  >
                    World Kitchen &nbsp;·&nbsp; 50+ Cuisines
                  </span>
                </motion.div>

                {/* Massive Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(3.5rem, 8vw, 8rem)",
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    color: "white",
                    marginBottom: 32,
                    textShadow: "0 10px 40px rgba(0,0,0,0.6)",
                  }}
                >
                  Your Personal<br />
                  <span style={{ color: "hsl(18,82%,58%)" }}>Fridge Chef</span>
                </motion.h1>

                {/* Elegant Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                  style={{
                    color: "hsl(35,40%,85%)",
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                    lineHeight: 1.6,
                    maxWidth: 600,
                    marginBottom: 56,
                    fontWeight: 300,
                  }}
                >
                  Search any dish to explore authentic varieties and generate perfect, restaurant-quality recipes instantly.
                </motion.p>

                {/* Immersive Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 1, ease: "easeOut" }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 8px 8px 24px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                    width: "100%",
                    maxWidth: 580,
                  }}
                >
                  <Search style={{ width: 22, height: 22, color: "hsl(20,20%,40%)", flexShrink: 0 }} />
                  <Input
                    id="dishNameHero"
                    placeholder="e.g., Ice Cream, Pasta, Biryani…"
                    className="border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                    style={{
                      color: "hsl(20,25%,15%)",
                      fontFamily: "var(--font-body)",
                      fontSize: "1.1rem",
                      padding: "12px 0",
                    }}
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    size="lg"
                    onClick={handleGenerate}
                    disabled={!dishName.trim()}
                    style={{
                      background: !dishName.trim()
                        ? "hsl(35,20%,85%)"
                        : "hsl(18,82%,54%)",
                      color: !dishName.trim() ? "hsl(20,15%,55%)" : "white",
                      border: "none",
                      borderRadius: 999,
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      padding: "0 32px",
                      height: 54,
                      transition: "all 0.3s",
                    }}
                  >
                    Search
                  </Button>
                </motion.div>
              </motion.div>

              {/* Scroll indicator */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                onClick={scrollToContent}
                style={{
                  position: "absolute",
                  bottom: 40,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.7)",
                  zIndex: 20,
                }}
              >
                <span style={{ fontFamily: "var(--font-typewriter)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em" }}>
                  Scroll to Discover
                </span>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                  <ArrowDown style={{ width: 20, height: 20 }} />
                </motion.div>
              </motion.button>
            </section>
            {/* ════════════════ POPULAR DISHES SECTION ════════════════ */}
            <section
              id="discover-section"
              style={{ position: "relative", background: "hsl(20,25%,10%)", padding: "140px 0 160px", overflow: "hidden" }}
            >
              {/* Artistic Background Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background: `
                    radial-gradient(circle at 15% 30%, hsla(18,85%,55%,0.06) 0%, transparent 45%),
                    radial-gradient(circle at 85% 70%, hsla(38,95%,58%,0.04) 0%, transparent 45%),
                    url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                  `,
                }}
              />
              <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 28px", zIndex: 10 }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ textAlign: "center", marginBottom: 72 }}
                >
                  <p style={{ fontFamily: "var(--font-typewriter)", fontSize: 12, color: "hsl(18,75%,55%)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
                    ✦ Trending Now
                  </p>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", marginBottom: 16 }}>
                    Popular Dishes
                  </h2>
                  <p style={{ color: "hsl(20,15%,65%)", fontFamily: "var(--font-body)", fontSize: "1.1rem", maxWidth: 500, margin: "0 auto" }}>
                    Tap any dish to explore authentic varieties and generate the perfect restaurant-quality recipe.
                  </p>
                </motion.div>

                {/* Image card grid — sleek, tight, dark theme layout */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 28, perspective: "1200px" }}>
                  {DISH_SUGGESTIONS.map((dish, i) => (
                    <motion.button
                      key={dish.name}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      whileHover="hover"
                      viewport={{ once: true, margin: "-40px" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setDishName(dish.name);
                        setSearchQuery(dish.name);
                        setShowVarieties(true);
                      }}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 20,
                        overflow: "hidden",
                        textAlign: "left",
                        cursor: "pointer",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {/* Image area */}
                      <div style={{ position: "relative", paddingTop: "70%", overflow: "hidden", background: "hsl(20,25%,15%)" }}>
                        <motion.img
                          src={dish.image}
                          alt={dish.name}
                          variants={imageVariants}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,10,5,0.8) 0%, transparent 60%)" }} />
                        {/* Category badge */}
                        <div style={{ position: "absolute", top: 12, left: 12, padding: "4px 12px", borderRadius: 999, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", fontSize: 10, fontWeight: 700, color: "hsl(18,80%,60%)", fontFamily: "var(--font-typewriter)", textTransform: "uppercase", letterSpacing: "0.08em", border: "1px solid rgba(255,255,255,0.1)" }}>
                          {dish.category}
                        </div>
                        {/* Dish name overlay */}
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 16px" }}>
                          <p style={{ color: "white", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                            {dish.name}
                          </p>
                        </div>
                      </div>
                      {/* Card footer */}
                      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 11, color: "hsl(20,15%,65%)", fontFamily: "var(--font-typewriter)" }}>⏱ {dish.time}</span>
                          <span style={{ fontSize: 11, color: "hsl(20,15%,65%)", fontFamily: "var(--font-typewriter)" }}>👥 {dish.servings}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Star style={{ width: 12, height: 12, color: "hsl(38,95%,52%)", fill: "hsl(38,95%,52%)" }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: "hsl(35,80%,85%)", fontFamily: "var(--font-display)" }}>{dish.rating}</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <p style={{ marginTop: 80, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-typewriter)", letterSpacing: "0.05em" }}>
                  Est. 2025 &nbsp;·&nbsp; Powered by Groq AI &nbsp;·&nbsp; Bon Appétit 🍽️
                </p>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
