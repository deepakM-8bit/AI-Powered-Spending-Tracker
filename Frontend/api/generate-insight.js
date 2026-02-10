import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // 1. CORS Setup
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // 2. Get Data
  const { analyticsData } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Missing API Key" });
  }

  try {
    // 3. Initialize the NEW Client
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 4. The Prompt
    const prompt = `
      You are an AI financial insights engine. 
      Analyze this user data: ${JSON.stringify(analyticsData)}

      Generate short, clear, bullet-point insights only. No long paragraphs.
      FORMAT STRICTLY LIKE THIS:

      📝 Key Highlights
      • (1 line insight)
      • (1 line insight)

      📊 Category Breakdown
      • Top category: (category + amount)
      • (Short note)

      💡 Savings Tips
      • (Tip 1)
      • (Tip 2)

      🔮 Prediction
      • (1 line prediction)
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // 6. Get Text
    const text = response.text;

    return res.status(200).json({ insights: text });
  } catch (error) {
    console.error("Vercel AI Error:", error);
    return res.status(500).json({
      error: "Failed to generate insights",
      details: error.message,
    });
  }
}
