import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PEXELS_KEY = process.env.PEXELS_API_KEY ?? "";

// Hash helper — maps a string to a stable index for picking from photo arrays
const nameHash = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h += s.charCodeAt(i); return h; };

// Timed fetch — aborts after ms milliseconds so slow APIs never hang the search
function fetchWithTimeout(url: string, opts: RequestInit = {}, ms = 2000): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

// Converts a YouTube watch URL to a direct watch URL
function toWatchUrl(watchUrl: string): string {
  const match = watchUrl.match(/[?&]v=([^&]+)/);
  if (match?.[1]) return `https://www.youtube.com/watch?v=${match[1]}`;
  return watchUrl;
}

// Scrapes YouTube's search page to get the top video ID for a dish.
// YouTube embeds all search results as JSON (ytInitialData) in the page HTML —
// we extract the first 11-character video ID directly from that.
// This is the most reliable free method: it uses YouTube itself, no API key needed.
async function searchYouTubeVideoId(dishName: string): Promise<string | null> {
  const query = encodeURIComponent(dishName + " recipe");

  // Try YouTube search page scraping first (most reliable)
  try {
    const res = await fetchWithTimeout(
      `https://www.youtube.com/results?search_query=${query}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      },
      8000
    );
    if (res.ok) {
      const html = await res.text();
      // YouTube includes all results as ytInitialData JSON in the page.
      // The first "videoId":"XXXXXXXXXXX" (11-char ID) is always the top result.
      const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      if (match?.[1]) return match[1];
    }
  } catch {}

  // Fallback: try Piped API (open-source YouTube proxy)
  try {
    const res = await fetchWithTimeout(
      `https://pipedapi.kavin.rocks/search?q=${query}&filter=videos`,
      {},
      5000
    );
    if (res.ok) {
      const data = await res.json();
      const item = (data?.items ?? []).find((i: any) => typeof i.url === "string" && i.url.includes("/watch?v="));
      const m = item?.url?.match(/[?&]v=([^&]+)/);
      if (m?.[1]) return m[1];
    }
  } catch {}

  // Fallback: try Invidious instances in parallel
  const invidiousBases = [
    "https://invidious.privacydev.net",
    "https://inv.nadeko.net",
    "https://yewtu.be",
    "https://invidious.flokinet.to",
  ];

  try {
    const videoId = await Promise.any(
      invidiousBases.map(async (base) => {
        const res = await fetchWithTimeout(`${base}/api/v1/search?q=${query}&type=video`, {}, 5000);
        if (!res.ok) throw new Error("fail");
        const data = await res.json();
        const first = Array.isArray(data) ? data[0] : null;
        if (first?.videoId) return first.videoId as string;
        throw new Error("no id");
      })
    );
    return videoId;
  } catch {}

  return null;
}

// Returns dish image + a direct YouTube video URL for the dish
async function getFoodImage(dishName: string): Promise<{ imageUrl: string; category: string | null; area: string | null; youtubeUrl: string }> {
  const fallbackYoutubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(dishName + " recipe")}`;

  // TheMealDB exact match — provides image AND a specific YouTube video via strYoutube
  try {
    const d = await (await fetchWithTimeout(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(dishName)}`)).json();
    const m = d?.meals?.[0];
    if (m?.strMealThumb) {
      // strYoutube is the exact cooking video for this dish
      const youtubeUrl = m.strYoutube ? toWatchUrl(m.strYoutube) : fallbackYoutubeUrl;
      return { imageUrl: m.strMealThumb, category: m.strCategory ?? null, area: m.strArea ?? null, youtubeUrl };
    }
  } catch {}

  // For dishes not in TheMealDB: search Invidious to get a real video ID
  const videoId = await searchYouTubeVideoId(dishName);
  const youtubeUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : fallbackYoutubeUrl;

  // Pexels for the image
  if (PEXELS_KEY) {
    try {
      const d = await (await fetchWithTimeout(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(dishName)}&per_page=15&orientation=landscape`,
        { headers: { Authorization: PEXELS_KEY } }
      )).json();
      const photos: any[] = d?.photos ?? [];
      if (photos.length > 0) {
        const photo = photos[nameHash(dishName) % photos.length];
        return { imageUrl: photo.src.large, category: null, area: null, youtubeUrl };
      }
    } catch {}
  }

  return { imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=640&q=80", category: null, area: null, youtubeUrl };
}



export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ── SEARCH: Ask Groq for a list of specific dish varieties ──
  app.get("/api/recipes/search", async (req, res) => {
    try {
      const q = String(req.query.q || "").trim();
      if (!q) return res.json({ options: [] });

      const completion = await groq.chat.completions.create({
        // Use the same powerful 70B model as recipe generation — 8b was too unreliable
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a culinary expert. Return ONLY a valid JSON array of strings — no explanation, no markdown, no extra text whatsoever.",
          },
          {
            role: "user",
            content: `The user searched for: "${q}".

List exactly 12 real, specific, well-known dish names that are varieties of or directly related to "${q}".

STRICT RULES:
- Every item MUST be a real dish that is a type of "${q}" or contains "${q}" as a key ingredient/component.
- Do NOT include unrelated dishes.
- Use the full proper dish name (e.g., "Pad Thai Noodles", "Japanese Ramen Noodles", "Dan Dan Noodles").
- Return ONLY a JSON array of 12 strings, nothing else.

Example: if input is "noodles", return: ["Pad Thai Noodles", "Japanese Ramen Noodles", "Dan Dan Noodles", "Lo Mein Noodles", "Soba Noodles", "Udon Noodles", "Pho Noodles", "Singapore Noodles", "Chow Mein Noodles", "Glass Noodles Stir Fry", "Laksa Noodles", "Yakisoba Noodles"]`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      const raw = completion.choices[0]?.message?.content?.trim() ?? "[]";

      let names: string[] = [];
      try {
        const cleaned = raw
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();
        names = JSON.parse(cleaned);
        if (!Array.isArray(names)) names = [];
      } catch (_) {
        names = [];
      }

      const qLower = q.toLowerCase();
      const dishNames = names
        .filter((n) => typeof n === "string" && n.trim().length > 0)
        .slice(0, 12)
        .map((n) => n.trim());

      // Fetch images for ALL dishes in parallel — every card ALWAYS gets a photo
      const options = await Promise.all(
        dishNames.map(async (name) => {
          const { imageUrl, category, area } = await getFoodImage(name);
          return { name, imageUrl, category, area };
        })
      );

      return res.json({ options });
    } catch (error: any) {
      console.error("Search error:", error);
      return res.status(500).json({ options: [] });
    }
  });

  // ── GENERATE: Ask Groq for a full, detailed recipe ──
  app.post(api.recipes.generate.path, async (req, res) => {
    try {
      const parsed = api.recipes.generate.input.parse(req.body);
      const { dishName } = parsed;

      const prompt = `You are a world-class professional chef with 30 years of experience in authentic global cuisine. Create a complete, accurate, restaurant-quality recipe for: "${dishName}".

Return ONLY a valid JSON object (no markdown, no explanation, no extra text) with this EXACT structure:
{
  "title": "The full, professional name of the dish",
  "summary": "2-3 sentences describing the dish's origins, cultural significance, key flavors, and what makes it special. Make it mouth-watering and informative.",
  "servings": "e.g., Serves 4",
  "cookTime": "e.g., 45 minutes (include both prep + cook time)",
  "category": "e.g., Italian, Indian, Dessert, Seafood, Vegan",
  "area": "e.g., Italian, American, Indian, Thai, Japanese",
  "ingredients": [
    "exact quantity + ingredient name (e.g., '2 cups (480ml) all-purpose flour')",
    "... at least 10-15 ingredients with precise measurements"
  ],
  "instructions": [
    "Step 1: Clear, detailed action starting with a verb. Include temperatures, timings, and visual/sensory cues (e.g., 'Heat a large skillet over medium-high heat. Add 2 tbsp olive oil and wait until it shimmers, about 1 minute.').",
    "... at least 8-12 clear, numbered steps that a home cook can follow"
  ]
}

CRITICAL RULES:
- The dish must EXACTLY match "${dishName}" — do not substitute or approximate
- ingredients: array of strings with precise quantities (metric + imperial where helpful)
- instructions: array of detailed strings, each step actionable and clear
- cookTime: be realistic and specific (e.g., "Prep: 15 min | Cook: 30 min | Total: 45 min")
- summary: mention the cuisine origin and what makes this dish unique
- All fields are required — no nulls, no empty strings
- Make it authentic, impressive, and delicious`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a world-class professional chef and expert recipe writer. You ONLY respond with a single, perfectly valid JSON object. No markdown fences, no commentary, no extra text — pure JSON only. Every recipe you write is authentic, detailed, and impressive.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 2000,
      });

      const raw = completion.choices[0]?.message?.content?.trim() ?? "";
      // Strip any accidental markdown fences
      const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      let recipeData: any;
      try {
        recipeData = JSON.parse(cleaned);
      } catch (_) {
        // Try extracting JSON from the response if wrapped in text
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try { recipeData = JSON.parse(jsonMatch[0]); } catch { /* fall through */ }
        }
        if (!recipeData) {
          throw new Error("Could not parse recipe data. Please try again.");
        }
      }

      if (!recipeData?.title || !Array.isArray(recipeData?.ingredients) || recipeData.ingredients.length === 0) {
        throw new Error("Incomplete recipe returned. Please try again.");
      }

      // Fetch image and YouTube video in parallel with recipe data
      const { imageUrl, youtubeUrl } = await getFoodImage(dishName);

      return res.json({
        title: recipeData.title,
        ingredients: recipeData.ingredients,
        instructions: Array.isArray(recipeData.instructions) ? recipeData.instructions : [],
        summary: recipeData.summary || `A delicious, authentic ${dishName} recipe.`,
        servings: recipeData.servings || "Serves 4",
        cookTime: recipeData.cookTime || "30 minutes",
        category: recipeData.category || "Global",
        area: recipeData.area || "International",
        imageUrl,
        youtubeUrl,
      });
    } catch (error: any) {
      console.error("Recipe generation error:", error);
      return res
        .status(500)
        .json({ message: error.message || "Failed to generate recipe. Please try again." });
    }
  });

  // ── List Recipes ──
  app.get(api.recipes.list.path, async (req, res) => {
    const recipes = await storage.getRecipes();
    res.json(recipes);
  });

  // ── Save Recipe ──
  app.post(api.recipes.create.path, async (req, res) => {
    try {
      const recipe = api.recipes.create.input.parse(req.body);
      const saved = await storage.createRecipe(recipe);
      res.status(201).json(saved);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid recipe data" });
      } else {
        res.status(500).json({ message: "Failed to save recipe" });
      }
    }
  });

  // ── Delete Recipe ──
  app.delete(api.recipes.delete.path, async (req, res) => {
    const id = parseInt(String(req.params.id));
    await storage.deleteRecipe(id);
    res.status(204).send();
  });

  return httpServer;
}
