import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGenerateRecipe, useSaveRecipe } from "@/hooks/use-recipes";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { Sparkles, Search, ChefHat, Loader2, ArrowDown, Star, Clock, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    emoji: "🐟",
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
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

const HERO_STATS = [
  { label: "Recipes", value: "10K+" },
  { label: "Cuisines", value: "50+" },
  { label: "Happy Chefs", value: "500K+" },
];

export default function Home() {
  const [dishName, setDishName] = useState("");
  const [loadingDish, setLoadingDish] = useState<string | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<
    (InsertRecipe & {
      imageUrl?: string | null;
      category?: string | null;
      area?: string | null;
      youtubeUrl?: string | null;
    }) | null
  >(null);

  const generateMutation = useGenerateRecipe();
  const saveMutation = useSaveRecipe();

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
      },
      onError: () => setLoadingDish(null),
    });
  };

  const handleGenerate = () => triggerGenerate(dishName);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleGenerate();
  };

  const handleSave = () => {
    if (!generatedRecipe) return;
    saveMutation.mutate(generatedRecipe);
  };

  const handleReset = () => {
    setGeneratedRecipe(null);
    setDishName("");
    setLoadingDish(null);
  };

  const scrollToContent = () => {
    document.getElementById("discover-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(36,40%,97%)" }}>
      <Navigation />

      <AnimatePresence mode="wait">
        {!generatedRecipe ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            {/* ════════════════ HERO SECTION ════════════════ */}
            <section
              style={{
                minHeight: "91vh",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                background: "hsl(36,40%,97%)",
              }}
            >
              {/* Warm ambient blobs */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background: `
                    radial-gradient(ellipse 860px 640px at 85% 50%, hsla(18,85%,55%,0.09) 0%, transparent 65%),
                    radial-gradient(ellipse 500px 400px at 8% 75%, hsla(38,95%,58%,0.07) 0%, transparent 60%),
                    radial-gradient(ellipse 380px 300px at 45% 0%, hsla(35,60%,75%,0.12) 0%, transparent 55%)
                  `,
                }}
              />

              <div
                style={{
                  maxWidth: 1240,
                  margin: "0 auto",
                  padding: "72px 32px 96px",
                  display: "flex",
                  alignItems: "center",
                  gap: 72,
                  width: "100%",
                }}
              >
                {/* ── LEFT: content ── */}
                <motion.div
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  style={{ flex: "1 1 0", display: "flex", flexDirection: "column" }}
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "7px 18px",
                      borderRadius: 999,
                      background: "hsla(18,75%,52%,0.1)",
                      border: "1.5px solid hsla(18,75%,52%,0.25)",
                      marginBottom: 28,
                      width: "fit-content",
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "hsl(18,75%,52%)",
                        flexShrink: 0,
                        boxShadow: "0 0 6px hsl(18,75%,52%)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "hsl(18,65%,40%)",
                        fontFamily: "var(--font-typewriter)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      World Kitchen &nbsp;·&nbsp; 50+ Cuisines &nbsp;·&nbsp; 10K+ Recipes
                    </span>
                  </motion.div>

                  {/* Logo icon */}
                  <motion.div
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.55, type: "spring", stiffness: 200 }}
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 18,
                      background: "linear-gradient(135deg, hsl(18,82%,54%), hsl(18,75%,42%))",
                      boxShadow: "0 8px 28px hsla(18,75%,50%,0.38)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 28,
                    }}
                  >
                    <ChefHat style={{ width: 34, height: 34, color: "white" }} />
                  </motion.div>

                  {/* H1 Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2.9rem, 5.5vw, 5rem)",
                      fontWeight: 800,
                      lineHeight: 1.04,
                      letterSpacing: "-0.03em",
                      marginBottom: 22,
                    }}
                  >
                    <span style={{ color: "hsl(20,25%,12%)", display: "block" }}>
                      Your Personal
                    </span>
                    <span
                      style={{
                        display: "block",
                        background: "linear-gradient(108deg, hsl(18,82%,50%) 0%, hsl(26,90%,54%) 45%, hsl(38,95%,52%) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 2px 12px hsla(18,80%,52%,0.22))",
                      }}
                    >
                      Fridge Chef
                    </span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{
                      color: "hsl(20,15%,44%)",
                      fontFamily: "var(--font-body)",
                      fontSize: "1.08rem",
                      lineHeight: 1.78,
                      maxWidth: 430,
                      marginBottom: 36,
                    }}
                  >
                    Search any dish and get the full recipe — step-by-step instructions,
                    curated photos &amp; videos,{" "}
                    <strong style={{ color: "hsl(18,75%,46%)", fontWeight: 600 }}>instantly</strong>.
                  </motion.p>

                  {/* Search bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 6px 6px 18px",
                      borderRadius: 16,
                      background: "white",
                      border: "1.5px solid hsl(35,20%,86%)",
                      boxShadow: "0 4px 24px hsla(20,20%,15%,0.08), 0 1px 4px hsla(20,20%,15%,0.04)",
                      maxWidth: 500,
                    }}
                  >
                    <Search style={{ width: 19, height: 19, color: "hsl(18,75%,52%)", flexShrink: 0 }} />
                    <Input
                      id="dishNameHero"
                      placeholder="e.g., Pasta Carbonara, Sushi, Jollof Rice..."
                      className="border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 text-base"
                      style={{
                        color: "hsl(20,25%,15%)",
                        fontFamily: "var(--font-typewriter)",
                        caretColor: "hsl(18,75%,52%)",
                        padding: "10px 12px",
                      }}
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button
                      size="lg"
                      onClick={handleGenerate}
                      disabled={generateMutation.isPending || !dishName.trim()}
                      style={{
                        background:
                          generateMutation.isPending || !dishName.trim()
                            ? "hsl(35,20%,90%)"
                            : "linear-gradient(135deg, hsl(18,82%,54%), hsl(18,75%,44%))",
                        color:
                          generateMutation.isPending || !dishName.trim()
                            ? "hsl(20,15%,55%)"
                            : "white",
                        border: "none",
                        borderRadius: 12,
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        minWidth: 132,
                        boxShadow: dishName.trim() ? "0 4px 20px hsla(18,75%,48%,0.38)" : "none",
                        transition: "all 0.25s",
                        padding: "10px 20px",
                      }}
                    >
                      {generateMutation.isPending && loadingDish === dishName ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <Loader2 style={{ width: 17, height: 17 }} className="animate-spin" /> Fetching…
                        </span>
                      ) : (
                        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <Sparkles style={{ width: 17, height: 17 }} /> Get Recipe
                        </span>
                      )}
                    </Button>
                  </motion.div>

                  {/* Stats row */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    style={{ display: "flex", gap: 36, marginTop: 36 }}
                  >
                    {HERO_STATS.map((stat, i) => (
                      <div key={i}>
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.65rem",
                            fontWeight: 800,
                            color: "hsl(18,75%,48%)",
                            letterSpacing: "-0.025em",
                          }}
                        >
                          {stat.value}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-typewriter)",
                            fontSize: "0.68rem",
                            color: "hsl(20,12%,56%)",
                            textTransform: "uppercase",
                            letterSpacing: "0.11em",
                            marginTop: 3,
                          }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* ── RIGHT: empty spacer to keep left text exactly where it is ── */}
                <div className="hidden md:block" style={{ flex: "1 1 0" }} />
              </div>

              {/* ── ENLARGED RIGHT HERO IMAGE (Bleeds to edge) ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.18, duration: 0.7, ease: "easeOut" }}
                className="hidden md:block"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: "50vw", // Enlarge to cover the exact right half of the screen
                  zIndex: 0,
                }}
              >
                {/* Main image spanning full height */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=90"
                    alt="Gourmet kitchen"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {/* Subtle fade to blend perfectly with the cream background on the left seam */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(90deg, hsl(36,40%,97%) 0%, transparent 8%, transparent 100%)",
                    }}
                  />
                  {/* Fade at the top to blend seamlessly with the navigation header */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, hsl(36,40%,97%) 0%, transparent 18%, transparent 100%)",
                    }}
                  />
                </div>

              </motion.div>

              {/* Scroll indicator */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85, duration: 0.5 }}
                onClick={scrollToContent}
                style={{
                  position: "absolute",
                  bottom: 32,
                  left: "25%", /* Centered perfectly under the left text column */
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 24px",
                  background: "white",
                  borderRadius: 999,
                  boxShadow: "0 8px 24px hsla(20,25%,15%,0.08)",
                  border: "1px solid hsl(35,20%,91%)",
                  cursor: "pointer",
                  color: "hsl(18,75%,48%)",
                  zIndex: 20,
                }}
              >
                <span style={{ fontFamily: "var(--font-typewriter)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em" }}>
                  Discover Dishes
                </span>
                <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
                  <ArrowDown style={{ width: 15, height: 15 }} />
                </motion.div>
              </motion.button>
            </section>

            {/* ════════════════ DISCOVER SECTION ════════════════ */}
            <section
              id="discover-section"
              style={{ background: "hsl(36,35%,93%)", padding: "80px 0 96px" }}
            >
              <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
                {/* Section header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  style={{ textAlign: "center", marginBottom: 52 }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-typewriter)",
                      fontSize: 11,
                      color: "hsl(18,75%,48%)",
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      marginBottom: 12,
                    }}
                  >
                    ✦ Handpicked Favourites
                  </p>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.9rem, 3.8vw, 2.9rem)",
                      fontWeight: 800,
                      color: "hsl(20,25%,12%)",
                      letterSpacing: "-0.025em",
                      marginBottom: 10,
                    }}
                  >
                    Popular Dishes
                  </h2>
                  <p style={{ color: "hsl(20,12%,52%)", fontFamily: "var(--font-body)", fontSize: "1rem" }}>
                    Tap any dish below to instantly get the full recipe
                  </p>
                </motion.div>

                {/* Cards grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 24,
                  }}
                >
                  {DISH_SUGGESTIONS.map((dish, i) => {
                    const isLoading = loadingDish === dish.name;
                    return (
                      <motion.button
                        key={dish.name}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-40px" }}
                        whileHover={!loadingDish ? { y: -7, scale: 1.02 } : {}}
                        whileTap={!loadingDish ? { scale: 0.97 } : {}}
                        onClick={() => !loadingDish && triggerGenerate(dish.name)}
                        disabled={!!loadingDish}
                        style={{
                          background: "white",
                          border: isLoading
                            ? "2px solid hsl(18,75%,52%)"
                            : "1.5px solid hsl(35,20%,88%)",
                          borderRadius: 22,
                          overflow: "hidden",
                          textAlign: "left",
                          cursor: loadingDish ? "not-allowed" : "pointer",
                          opacity: loadingDish && !isLoading ? 0.5 : 1,
                          boxShadow: isLoading
                            ? "0 0 0 4px hsla(18,75%,52%,0.15), 0 12px 36px hsla(18,75%,40%,0.18)"
                            : "0 2px 12px hsla(20,20%,15%,0.07), 0 1px 4px hsla(20,20%,15%,0.04)",
                          transition: "box-shadow 0.3s, border-color 0.3s, opacity 0.3s",
                        }}
                      >
                        {/* Image area */}
                        <div style={{ position: "relative", paddingTop: "65%", overflow: "hidden" }}>
                          <img
                            src={dish.image}
                            alt={dish.name}
                            style={{
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.65s ease",
                            }}
                            onMouseEnter={(e) =>
                              !loadingDish && ((e.currentTarget as HTMLElement).style.transform = "scale(1.1)")
                            }
                            onMouseLeave={(e) =>
                              ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
                            }
                          />
                          {/* Bottom scrim for dish name readability */}
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: isLoading
                                ? "hsla(18,60%,95%,0.5)"
                                : "linear-gradient(to top, rgba(20,14,10,0.72) 0%, rgba(20,14,10,0.18) 45%, transparent 100%)",
                              transition: "background 0.3s",
                            }}
                          />

                          {/* Category badge */}
                          {!isLoading && (
                            <div
                              style={{
                                position: "absolute",
                                top: 12,
                                left: 12,
                                padding: "4px 12px",
                                borderRadius: 999,
                                background: "rgba(255,255,255,0.92)",
                                backdropFilter: "blur(10px)",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "hsl(18,72%,44%)",
                                fontFamily: "var(--font-typewriter)",
                                letterSpacing: "0.07em",
                                textTransform: "uppercase",
                                border: "1px solid hsla(18,60%,60%,0.2)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                              }}
                            >
                              {dish.category}
                            </div>
                          )}

                          {/* Rating badge */}
                          {!isLoading && (
                            <div
                              style={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "4px 10px",
                                borderRadius: 999,
                                background: "rgba(255,255,255,0.92)",
                                backdropFilter: "blur(10px)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                              }}
                            >
                              <Star style={{ width: 11, height: 11, color: "hsl(38,90%,48%)", fill: "hsl(38,90%,48%)" }} />
                              <span style={{ fontSize: 12, fontWeight: 700, color: "hsl(20,25%,15%)", fontFamily: "var(--font-typewriter)" }}>
                                {dish.rating}
                              </span>
                            </div>
                          )}

                          {/* Loading spinner */}
                          {isLoading && (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: 52,
                                  height: 52,
                                  borderRadius: 14,
                                  background: "rgba(255,255,255,0.9)",
                                  backdropFilter: "blur(8px)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "0 6px 24px hsla(18,75%,40%,0.2)",
                                }}
                              >
                                <Loader2 style={{ width: 26, height: 26, color: "hsl(18,75%,48%)" }} className="animate-spin" />
                              </div>
                            </div>
                          )}

                          {/* Dish name overlay */}
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 14px" }}>
                            <p
                              style={{
                                color: "white",
                                fontFamily: "var(--font-display)",
                                fontWeight: 800,
                                fontSize: "1.05rem",
                                letterSpacing: "-0.01em",
                                textShadow: "0 2px 12px rgba(0,0,0,0.7)",
                              }}
                            >
                              {dish.emoji} {dish.name}
                            </p>
                          </div>
                        </div>

                        {/* Card footer */}
                        <div
                          style={{
                            padding: "12px 14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "white",
                            borderTop: "1px solid hsl(35,20%,92%)",
                          }}
                        >
                          <div style={{ display: "flex", gap: 8 }}>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "4px 10px",
                                borderRadius: 999,
                                background: "hsl(35,30%,95%)",
                                border: "1px solid hsl(35,20%,88%)",
                                fontSize: 11,
                                fontWeight: 600,
                                color: "hsl(20,20%,44%)",
                                fontFamily: "var(--font-typewriter)",
                              }}
                            >
                              <Clock style={{ width: 11, height: 11 }} />
                              {dish.time}
                            </span>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "4px 10px",
                                borderRadius: 999,
                                background: "hsl(35,30%,95%)",
                                border: "1px solid hsl(35,20%,88%)",
                                fontSize: 11,
                                fontWeight: 600,
                                color: "hsl(20,20%,44%)",
                                fontFamily: "var(--font-typewriter)",
                              }}
                            >
                              <Users style={{ width: 11, height: 11 }} />
                              {dish.servings}
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "5px 12px",
                              borderRadius: 999,
                              background: "linear-gradient(135deg, hsl(18,82%,54%), hsl(38,88%,54%))",
                              color: "white",
                              fontSize: 11,
                              fontWeight: 700,
                              fontFamily: "var(--font-display)",
                              boxShadow: "0 3px 12px hsla(18,75%,44%,0.35)",
                            }}
                          >
                            <Sparkles style={{ width: 11, height: 11 }} />
                            Cook it
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Footer note */}
                <p
                  style={{
                    marginTop: 56,
                    textAlign: "center",
                    fontSize: 12,
                    color: "hsl(20,10%,62%)",
                    fontFamily: "var(--font-typewriter)",
                  }}
                >
                  Est. 2025 &nbsp;·&nbsp; Powered by TheMealDB &nbsp;·&nbsp; Bon Appétit 🍽️
                </p>
              </div>
            </section>
          </motion.div>
        ) : (
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
        )}
      </AnimatePresence>
    </div>
  );
}