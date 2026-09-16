var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var genAIClient = null;
function getGenAI() {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    genAIClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return genAIClient;
}
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "CreatorFlow AI",
    publisher: "\u0633\u06CC\u062F\u062D\u0645\u06CC\u062F\u0645\u0648\u0633\u0648\u06CC \u0632\u0627\u062F\u0647",
    hasApiKey: !!process.env.GEMINI_API_KEY
  });
});
app.post("/api/ai/ideas", async (req, res) => {
  try {
    const { topic, niche, platform, audience, language = "en" } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }
    const ai = getGenAI();
    const prompt = `You are CreatorFlow AI, an elite viral social media strategist developed by \u0633\u06CC\u062F\u062D\u0645\u06CC\u062F\u0645\u0648\u0633\u0648\u06CC \u0632\u0627\u062F\u0647.
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
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              title: { type: import_genai.Type.STRING },
              angle: { type: import_genai.Type.STRING },
              hookSnippet: { type: import_genai.Type.STRING },
              whyViral: { type: import_genai.Type.STRING },
              estimatedRetention: { type: import_genai.Type.STRING }
            },
            required: ["title", "angle", "hookSnippet", "whyViral", "estimatedRetention"]
          }
        }
      }
    });
    const text = response.text || "[]";
    const parsed = JSON.parse(text);
    return res.json({ ideas: parsed });
  } catch (error) {
    console.error("Error generating ideas:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate ideas" });
  }
});
app.post("/api/ai/hooks", async (req, res) => {
  try {
    const { topic, platform, language = "en" } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }
    const ai = getGenAI();
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
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              type: { type: import_genai.Type.STRING },
              hookText: { type: import_genai.Type.STRING },
              visualAction: { type: import_genai.Type.STRING },
              psychologicalTrigger: { type: import_genai.Type.STRING }
            },
            required: ["type", "hookText", "visualAction", "psychologicalTrigger"]
          }
        }
      }
    });
    const parsed = JSON.parse(response.text || "[]");
    return res.json({ hooks: parsed });
  } catch (error) {
    console.error("Error generating hooks:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate hooks" });
  }
});
app.post("/api/ai/scripts", async (req, res) => {
  try {
    const { topic, platform = "Instagram Reels", targetLength = "45s", tone = "High Energy", language = "en" } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }
    const ai = getGenAI();
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
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            title: { type: import_genai.Type.STRING },
            estimatedWordCount: { type: import_genai.Type.INTEGER },
            hook: { type: import_genai.Type.STRING },
            intro: { type: import_genai.Type.STRING },
            mainContent: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING }
            },
            emotionalTrigger: { type: import_genai.Type.STRING },
            callToAction: { type: import_genai.Type.STRING },
            visualDirectives: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING }
            }
          },
          required: ["title", "estimatedWordCount", "hook", "intro", "mainContent", "emotionalTrigger", "callToAction", "visualDirectives"]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return res.json({ script: parsed });
  } catch (error) {
    console.error("Error generating script:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate script" });
  }
});
app.post("/api/ai/captions", async (req, res) => {
  try {
    const { videoTopic, platform = "Instagram", ctaGoal = "Comments & Saves", language = "en" } = req.body;
    if (!videoTopic) {
      return res.status(400).json({ error: "Video topic is required" });
    }
    const ai = getGenAI();
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
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              style: { type: import_genai.Type.STRING },
              headline: { type: import_genai.Type.STRING },
              captionBody: { type: import_genai.Type.STRING },
              callToAction: { type: import_genai.Type.STRING },
              hashtags: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.STRING }
              }
            },
            required: ["style", "headline", "captionBody", "callToAction", "hashtags"]
          }
        }
      }
    });
    const parsed = JSON.parse(response.text || "[]");
    return res.json({ captions: parsed });
  } catch (error) {
    console.error("Error generating captions:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate captions" });
  }
});
app.post("/api/ai/thumbnails", async (req, res) => {
  try {
    const { title, niche, language = "en" } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const ai = getGenAI();
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
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              conceptName: { type: import_genai.Type.STRING },
              visualDescription: { type: import_genai.Type.STRING },
              textSuggestions: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.STRING }
              },
              colorPalette: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.STRING }
              },
              layoutGuidance: { type: import_genai.Type.STRING }
            },
            required: ["conceptName", "visualDescription", "textSuggestions", "colorPalette", "layoutGuidance"]
          }
        }
      }
    });
    const parsed = JSON.parse(response.text || "[]");
    return res.json({ concepts: parsed });
  } catch (error) {
    console.error("Error generating thumbnails:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate thumbnails" });
  }
});
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history = [], language = "en" } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const ai = getGenAI();
    const systemInstruction = `You are the CreatorFlow AI Social Media Strategist, developed by \u0633\u06CC\u062F\u062D\u0645\u06CC\u062F\u0645\u0648\u0633\u0648\u06CC \u0632\u0627\u062F\u0647.
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
      ...history.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      })),
      {
        role: "user",
        parts: [{ text: message }]
      }
    ];
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.8
      }
    });
    return res.json({ reply: response.text || "I'm here to strategize your next viral piece." });
  } catch (error) {
    console.error("Error in AI chat:", error);
    return res.status(500).json({ error: error?.message || "Failed to communicate with AI strategist" });
  }
});
app.post("/api/ai/analytics-insight", async (req, res) => {
  try {
    const { metrics = {}, platform = "All Platforms", language = "en" } = req.body;
    const ai = getGenAI();
    const prompt = `You are the Chief Data Strategist at CreatorFlow AI developed by \u0633\u06CC\u062F\u062D\u0645\u06CC\u062F\u0645\u0648\u0633\u0648\u06CC \u0632\u0627\u062F\u0647.
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
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            engagementRatePercentage: { type: import_genai.Type.NUMBER },
            performanceVerdict: { type: import_genai.Type.STRING },
            coreStrengths: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING }
            },
            criticalBottlenecks: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING }
            },
            top3ActionableSteps: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING }
            }
          },
          required: ["engagementRatePercentage", "performanceVerdict", "coreStrengths", "criticalBottlenecks", "top3ActionableSteps"]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return res.json({ audit: parsed });
  } catch (error) {
    console.error("Error in analytics audit:", error);
    return res.status(500).json({ error: error?.message || "Failed to analyze metrics" });
  }
});
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CreatorFlow AI Server running on port ${PORT}`);
  });
}
initServer();
//# sourceMappingURL=server.cjs.map
