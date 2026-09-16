import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Enable CORS for mobile WebViews and cross-origin requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Lazy Gemini client initialization
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Resilient Gemini invoker that falls back across supported fast models
async function callGemini(options: {
  contents: any;
  systemInstruction?: string;
  config?: any;
}) {
  const ai = getGenAI();
  const models = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of models) {
    try {
      const mergedConfig = {
        ...(options.config || {}),
        ...(options.systemInstruction ? { systemInstruction: options.systemInstruction } : {}),
      };
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: Object.keys(mergedConfig).length > 0 ? mergedConfig : undefined,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini Fallback] Model ${model} failed, attempting next model... Error:`, err?.message?.slice(0, 100));
    }
  }
  throw lastError;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "CreatorFlow AI",
    publisher: "سیدحمیدموسوی زاده",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// 1. AI Content Idea Generator
app.post("/api/ai/ideas", async (req, res) => {
  try {
    const { topic, niche, platform, audience, language = "en" } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }
    const prompt = `You are CreatorFlow AI, an elite viral social media strategist developed by سیدحمیدموسوی زاده.
Generate 4 viral content ideas for:
- Topic: ${topic}
- Niche: ${niche || "General Creator"}
- Platform: ${platform || "YouTube Shorts & Instagram Reels"}
- Target Audience: ${audience || "General Enthusiasts"}
- Target Language: ${language === "fa" ? "Persian (Farsi)" : "English"}

Return a JSON array of objects with the following keys for each idea:
- title: catchy concept title
- angle: unique angle/twist
- hookSnippet: first 3-second hook
- whyViral: viral psychological trigger
- estimatedRetention: estimated audience retention strategy`;

    const response = await callGemini({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              angle: { type: Type.STRING },
              hookSnippet: { type: Type.STRING },
              whyViral: { type: Type.STRING },
              estimatedRetention: { type: Type.STRING },
            },
            required: ["title", "angle", "hookSnippet", "whyViral", "estimatedRetention"],
          },
        },
      },
    });

    const text = response.text || "[]";
    const parsed = JSON.parse(text);
    return res.json({ ideas: parsed });
  } catch (error: any) {
    console.error("Error generating ideas:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate ideas" });
  }
});

// 2. AI Hook Generator
app.post("/api/ai/hooks", async (req, res) => {
  try {
    const { topic, platform, language = "en" } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }
    const prompt = `You are a viral retention specialist. Generate high-converting 3-second video hooks for the topic: "${topic}" on ${platform || "Short-form video"}.
Language: ${language === "fa" ? "Persian (Farsi)" : "English"}.

Generate 5 distinct hook types:
1. Curiosity Hook: open loops, irresistible intrigue
2. Emotional Hook: strikes ego, fear of missing out, or empathy
3. Problem-Solving Hook: addresses an urgent, painful barrier
4. Storytelling Hook: starts 'in media res' with high drama
5. Sales/Conversion Hook: drives immediate desire for the solution

Return a JSON array of 5 objects with keys:
- type: string (one of "Curiosity", "Emotional", "Problem-Solving", "Storytelling", "Sales")
- hookText: the exact verbal text to speak
- visualAction: recommended on-screen visual cue or gesture
- psychologicalTrigger: explanation of why this hook stops scrolling`;

    const response = await callGemini({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              hookText: { type: Type.STRING },
              visualAction: { type: Type.STRING },
              psychologicalTrigger: { type: Type.STRING },
            },
            required: ["type", "hookText", "visualAction", "psychologicalTrigger"],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return res.json({ hooks: parsed });
  } catch (error: any) {
    console.error("Error generating hooks:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate hooks" });
  }
});

// 3. AI Script Writer
app.post("/api/ai/scripts", async (req, res) => {
  try {
    const { topic, platform = "Instagram Reels", targetLength = "45s", tone = "High Energy", language = "en" } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }
    const prompt = `Generate a high-converting, professional short-form video script for:
- Topic: ${topic}
- Platform: ${platform}
- Target Duration: ${targetLength}
- Tone: ${tone}
- Language: ${language === "fa" ? "Persian (Farsi)" : "English"}

The script MUST have this strict 5-part structure:
1. Hook (0-3s)
2. Introduction (3-8s)
3. Main Content (8-35s with bullet points / key takeaways)
4. Emotional Trigger (35-40s resonance)
5. Call to Action (CTA) (40-45s)

Return a JSON object with:
- title: string
- estimatedWordCount: number
- hook: string
- intro: string
- mainContent: array of strings
- emotionalTrigger: string
- callToAction: string
- visualDirectives: array of strings (b-roll, zoom cuts, text overlays)`;

    const response = await callGemini({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            estimatedWordCount: { type: Type.INTEGER },
            hook: { type: Type.STRING },
            intro: { type: Type.STRING },
            mainContent: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            emotionalTrigger: { type: Type.STRING },
            callToAction: { type: Type.STRING },
            visualDirectives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["title", "estimatedWordCount", "hook", "intro", "mainContent", "emotionalTrigger", "callToAction", "visualDirectives"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ script: parsed });
  } catch (error: any) {
    console.error("Error generating script:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate script" });
  }
});

// 4. AI Caption Generator
app.post("/api/ai/captions", async (req, res) => {
  try {
    const { videoTopic, platform = "Instagram", ctaGoal = "Comments & Saves", language = "en" } = req.body;
    if (!videoTopic) {
      return res.status(400).json({ error: "Video topic is required" });
    }
    const prompt = `Generate 3 distinct high-engagement social media captions for:
- Video Topic: ${videoTopic}
- Platform: ${platform}
- CTA Goal: ${ctaGoal}
- Language: ${language === "fa" ? "Persian (Farsi)" : "English"}

Options to provide:
1. Story-driven Caption (deep engagement, personal tone)
2. Value-Packed Bullet List Caption (easy to save & share)
3. Punchy Minimalist Caption (bold, fast-reading)

Return a JSON array of 3 objects with:
- style: string
- headline: string
- captionBody: string with relevant emojis
- callToAction: string
- hashtags: array of 8-15 researched trending & niche hashtags`;

    const response = await callGemini({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              style: { type: Type.STRING },
              headline: { type: Type.STRING },
              captionBody: { type: Type.STRING },
              callToAction: { type: Type.STRING },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["style", "headline", "captionBody", "callToAction", "hashtags"],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return res.json({ captions: parsed });
  } catch (error: any) {
    console.error("Error generating captions:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate captions" });
  }
});

// 5. Thumbnail Studio
app.post("/api/ai/thumbnails", async (req, res) => {
  try {
    const { title, niche, language = "en" } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const prompt = `You are YouTube CTR master architect at CreatorFlow AI. Generate 3 high-CTR YouTube/Reels thumbnail concepts for:
Title: "${title}"
Niche: ${niche || "Content Creation"}
Language: ${language === "fa" ? "Persian (Farsi)" : "English"}

Return a JSON array of 3 concepts with keys:
- conceptName: string (e.g. "Shock/Contrast Split", "Minimalist Mystery", "Emotional Reaction")
- visualDescription: detailed description of composition, focal point, expression, background
- textSuggestions: array of 3 short punchy text overlays (max 3-4 words each)
- colorPalette: array of 3 HEX color codes (e.g. ["#8B5CF6", "#FFD700", "#111827"])
- layoutGuidance: specific framing instructions (rule of thirds, contrast balance, face placement)`;

    const response = await callGemini({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              conceptName: { type: Type.STRING },
              visualDescription: { type: Type.STRING },
              textSuggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              colorPalette: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              layoutGuidance: { type: Type.STRING },
            },
            required: ["conceptName", "visualDescription", "textSuggestions", "colorPalette", "layoutGuidance"],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return res.json({ concepts: parsed });
  } catch (error: any) {
    console.error("Error generating thumbnails:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate thumbnails" });
  }
});

// 6. AI Creator Assistant Chat (Social Media Strategist)
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history = [], language = "en" } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const systemInstruction = `You are the CreatorFlow AI Social Media Strategist, developed by سیدحمیدموسوی زاده.
Role: Professional social media growth strategist, viral content engineer, and creator coach.
Capabilities:
- Answer creator questions with deep algorithmic insights for YouTube, Instagram, and TikTok.
- Review and refine video scripts, hooks, titles, and storytelling arcs.
- Formulate data-driven publishing strategies and audience retention tactics.
- Analyze content concepts with brutal honesty and actionable improvements.
Tone: Encouraging, razor-sharp, professional, concise, and creator-focused.
Language mode: ${language === "fa" ? "Respond in fluent Persian (Farsi) with modern creator vocabulary" : "Respond in English"}.
Always provide specific, tactical steps rather than generic advice.`;

    const formattedContents = [
      ...history.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await callGemini({
      contents: formattedContents,
      systemInstruction,
      config: {
        temperature: 0.8,
      },
    });

    return res.json({ reply: response.text || "I'm here to strategize your next viral piece." });
  } catch (error: any) {
    console.error("Error in AI chat:", error);
    return res.status(500).json({ error: error?.message || "Failed to communicate with AI strategist" });
  }
});

// 7. Creator Analytics Strategy Advisor
app.post("/api/ai/analytics-insight", async (req, res) => {
  try {
    const { metrics = {}, platform = "All Platforms", language = "en" } = req.body;
    const prompt = `You are the Chief Data Strategist at CreatorFlow AI developed by سیدحمیدموسوی زاده.
Analyze the following creator performance metrics:
- Views: ${metrics.views || 0}
- Likes: ${metrics.likes || 0}
- Followers: ${metrics.followers || 0}
- Comments: ${metrics.comments || 0}
- Saves/Shares: ${metrics.saves || 0}
- Platform: ${platform}
- Language: ${language === "fa" ? "Persian (Farsi)" : "English"}

Provide a comprehensive audit with:
- engagementRatePercentage: float number (e.g. 4.8)
- performanceVerdict: short phrase (e.g. "High Retention - Scaling Phase")
- coreStrengths: array of 2 bullet points
- criticalBottlenecks: array of 2 bullet points
- top3ActionableSteps: array of 3 prioritized tactical actions to double reach this month`;

    const response = await callGemini({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            engagementRatePercentage: { type: Type.NUMBER },
            performanceVerdict: { type: Type.STRING },
            coreStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            criticalBottlenecks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            top3ActionableSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["engagementRatePercentage", "performanceVerdict", "coreStrengths", "criticalBottlenecks", "top3ActionableSteps"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ audit: parsed });
  } catch (error: any) {
    console.error("Error in analytics audit:", error);
    return res.status(500).json({ error: error?.message || "Failed to analyze metrics" });
  }
});

// Serve frontend with Vite in dev, static files in production
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CreatorFlow AI Server running on port ${PORT}`);
  });
}

initServer();
