export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;
    const body: any = await request.json();
    const { calculatorId, calculatorName, inputs } = body;

    if (!calculatorId || !calculatorName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: calculatorId, calculatorName" }),
        { 
          status: 400, 
          headers: { 
            "content-type": "application/json;charset=UTF-8",
            "access-control-allow-origin": "*"
          } 
        }
      );
    }

    // Cloudflare Pages retrieves environment variables from the env parameter
    const apiKey = env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: "OPENROUTER_API_KEY is missing. Please configure OPENROUTER_API_KEY in your Cloudflare Pages dashboard under Settings > Environment variables." 
        }),
        { 
          status: 400, 
          headers: { 
            "content-type": "application/json;charset=UTF-8",
            "access-control-allow-origin": "*"
          } 
        }
      );
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

    const modelName = env.OPENROUTER_MODEL || "google/gemini-2.5-flash:free";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": env.APP_URL || "https://ai.studio/build",
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
      return new Response(
        JSON.stringify({ error: `OpenRouter API error (status ${response.status}): ${errorText}` }),
        { 
          status: 500, 
          headers: { 
            "content-type": "application/json;charset=UTF-8",
            "access-control-allow-origin": "*"
          } 
        }
      );
    }

    const result: any = await response.json();
    const choice = result.choices?.[0]?.message?.content;
    if (!choice) {
      return new Response(
        JSON.stringify({ error: "No response content received from OpenRouter API choices" }),
        { 
          status: 500, 
          headers: { 
            "content-type": "application/json;charset=UTF-8",
            "access-control-allow-origin": "*"
          } 
        }
      );
    }

    let parsedData;
    try {
      parsedData = JSON.parse(choice.trim());
    } catch (parseError) {
      const cleaned = choice.replace(/```json\s?/g, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(cleaned);
    }

    if (parsedData) {
      if (!parsedData.actionSteps && parsedData.actionableStrategies) {
        parsedData.actionSteps = parsedData.actionableStrategies;
      } else if (!parsedData.actionableStrategies && parsedData.actionSteps) {
        parsedData.actionableStrategies = parsedData.actionSteps;
      }
      if (!parsedData.actionSteps) parsedData.actionSteps = [];
      if (!parsedData.actionableStrategies) parsedData.actionableStrategies = [];
      if (!parsedData.pitfallsToAvoid) parsedData.pitfallsToAvoid = [];
    }

    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: { 
        "content-type": "application/json;charset=UTF-8",
        "access-control-allow-origin": "*"
      }
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { 
        status: 500, 
        headers: { 
          "content-type": "application/json;charset=UTF-8",
          "access-control-allow-origin": "*"
        } 
      }
    );
  }
}
