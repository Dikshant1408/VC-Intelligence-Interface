import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/enrich", async (req, res) => {
    const { url, companyName } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const prompt = `
        You are an expert VC analyst. Analyze the website content for the company "${companyName}" at ${url}.
        Provide a structured enrichment profile with the following fields:
        1. Summary: A concise 1-2 sentence overview of what the company does.
        2. What they do: 3-6 bullet points detailing their product, value prop, and target market.
        3. Keywords: 5-10 relevant industry/tech keywords.
        4. Derived signals: 2-4 signals inferred from the page (e.g., "Careers page active", "Recent blog posts", "Changelog present", "Enterprise focus", "Open source").
        
        Format the response as JSON.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          tools: [{ urlContext: {} }],
          responseMimeType: "application/json"
        },
      });

      const result = JSON.parse(response.text || "{}");
      
      res.json({
        ...result,
        sources: [
          { url, timestamp: new Date().toISOString() }
        ]
      });
    } catch (error: any) {
      console.error("Enrichment error:", error);
      res.status(500).json({ error: error.message || "Failed to enrich company data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
