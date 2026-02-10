import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // 1. CORS Setup
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { analyticsData } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Missing API Key" });
  }

  // --- THE MODEL LIST (Priority Order) ---
  const models = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash-preview-09-2025",
    "gemini-2.5-flash-lite-preview-09-2025",
  ];

  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are an AI financial insights engine. 
      Analyze this user data: ${JSON.stringify(analyticsData)}

      Generate short, clear, bullet-point insights only. No long paragraphs.
      FORMAT STRICTLY LIKE THIS:

      📝 Key Highlights
      • (1 line insight)
      • (1 line insight)

      📊 Category Breakdown
      • Top category: (category + ₹amount)
      • (Short note about increases/decreases)

      💡 Savings Tips
      • Tip 1 (very short)
      • Tip 2 (very short)

      🔮 Prediction
      • Next month spend prediction(1 line)

      ⚠ Alerts
      • (Only if something looks unusual, keep it 1 line)
    `;

    let lastError = null;

    // --- THE FALLBACK LOOP ---
    for (const modelName of models) {
      try {
        console.log(`Attempting generation with: ${modelName}`);

        const response = await genAI.models.generateContent({
          model: modelName,
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        });

        const text = response.text;
        console.log(`Success with ${modelName}!`);

        return res.status(200).json({
          insights: text,
          model_used: modelName,
        });
      } catch (err) {
        console.warn(`Model ${modelName} failed. Reason:`, err.message);
        lastError = err;
        continue;
      }
    }

    throw lastError || new Error("All models failed.");
  } catch (error) {
    console.error("Final Vercel AI Error:", error);
    return res.status(500).json({
      error: "Failed to generate insights",
      details: "All AI models are currently busy. Please try again later.",
    });
  }
}
