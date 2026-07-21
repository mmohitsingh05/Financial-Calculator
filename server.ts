import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Generate personalized Wealth & Planning Strategy using OpenRouter
  app.post("/api/calculator/strategy", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { calculatorId, calculatorName, inputs } = req.body;

      if (!calculatorId || !calculatorName) {
        res.status(400).json({ error: "Missing required fields: calculatorId, calculatorName" });
        return;
      }

      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        res.status(400).json({ 
          error: "OPENROUTER_API_KEY is missing. Please add your OpenRouter API key in Settings > Secrets." 
        });
        return;
      }

      const prompt = `Generate a highly professional, E-E-A-T compliant personal wealth advisory report based on the '${calculatorName}' calculator.
The user is working with these calculated parameters: ${JSON.stringify(inputs)}.

Provide:
- A premium, polished financial planning overview.
- An analytical deep-dive into how to optimize their parameters.
- 3 step-by-step custom actionable strategies to reach their target goal.
- 3 potential financial pitfalls or psychological blindspots they should avoid (such as fear of market corrections, lack of portfolio diversification, or high-interest consumer debt).
- A profound, guiding display quote of financial wisdom.

Provide your response ONLY in the following valid JSON schema format (without any markdown formatting, backticks, or wrapping like \`\`\`json ... \`\`\`):
{
  "overview": "A premium, sophisticated 2-3 sentence overview of their financial situation.",
  "deepDive": "An analytical deep-dive into optimizing their parameters for higher efficiency.",
  "actionableStrategies": [
    "tailored strategy 1",
    "tailored strategy 2",
    "tailored strategy 3"
  ],
  "pitfallsToAvoid": [
    "pitfall/behavioral trap 1",
    "pitfall/behavioral trap 2",
    "pitfall/behavioral trap 3"
  ],
  "advisoryQuote": "A single-sentence display quote of profound financial wisdom."
}`;

      const modelName = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash:free";
      console.log(`Calling OpenRouter API with model: ${modelName}`);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.APP_URL || "https://ai.studio/build",
          "X-Title": "Financial Calculator Suite",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: "system",
              content: "You are an elite, modern wealth advisory AI and certified strategic financial analyst. You write in a highly structured, polished, and inspiring style (sleek, humble, mathematically precise). Avoid clickbait, never guarantee absolute gains, and focus on practical growth behavior. ALWAYS respond with valid JSON matching the requested schema. Return raw JSON without markdown formatting."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error (status ${response.status}): ${errorText}`);
      }

      const result: any = await response.json();
      const choice = result.choices?.[0]?.message?.content;
      if (!choice) {
        throw new Error("No response content received from OpenRouter API choices");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(choice.trim());
      } catch (parseError) {
        // Fallback cleanup if model returns backticks
        const cleaned = choice.replace(/```json\s?/g, "").replace(/```/g, "").trim();
        parsedData = JSON.parse(cleaned);
      }

      // Safeguard property consistency between actionSteps and actionableStrategies
      if (parsedData) {
        if (!parsedData.actionSteps && parsedData.actionableStrategies) {
          parsedData.actionSteps = parsedData.actionableStrategies;
        } else if (!parsedData.actionableStrategies && parsedData.actionSteps) {
          parsedData.actionableStrategies = parsedData.actionSteps;
        }
        
        // Ensure arrays are present to avoid frontend map crashes
        if (!parsedData.actionSteps) parsedData.actionSteps = [];
        if (!parsedData.actionableStrategies) parsedData.actionableStrategies = [];
        if (!parsedData.pitfallsToAvoid) parsedData.pitfallsToAvoid = [];
      }

      res.json(parsedData);
    } catch (error: any) {
      console.error("OpenRouter API Error in /api/calculator/strategy:", error);
      res.status(500).json({
        error: error.message || "An unexpected error occurred while generating your wealth strategy.",
      });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date() });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
