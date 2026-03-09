import { z } from "zod";
import { insertRecipeSchema, recipes } from "./schema";

export const api = {
  recipes: {
    generate: {
      method: "POST" as const,
      path: "/api/recipes/generate",
      input: z.object({
        ingredients: z.string(),
      }),
      responses: {
        200: z.object({
          title: z.string(),
          ingredients: z.array(z.string()),
          instructions: z.array(z.string()),
          summary: z.string(),
          servings: z.string(),
          cookTime: z.string(),
        }),
        500: z.object({ message: z.string() }),
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/recipes",
      responses: {
        200: z.array(z.custom<typeof recipes.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/recipes",
      input: insertRecipeSchema,
      responses: {
        201: z.custom<typeof recipes.$inferSelect>(),
        500: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/recipes/:id",
      responses: {
        204: z.void(),
        404: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
