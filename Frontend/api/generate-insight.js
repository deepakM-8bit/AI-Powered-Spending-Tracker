import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // 1. CORS Setup (Crucial for React to talk to this)
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

  // Handle preflight check
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // 2. Security Check
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 3. Get Data from Frontend
  const { analyticsData } = req.body;

  if (!analyticsData) {
    return res.status(400).json({ error: "No analytics data provided" });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("API Key Missing!");
    return res
      .status(500)
      .json({ error: "Server Configuration Error (Missing Key)" });
  }

  try {
    // 4. Initialize AI (Vercel servers are in US = No Location Error!)
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Use the reliable standard model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 5. The Prompt (Cleaned up for JSON safety)
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

    // 6. Generate
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 7. Send Success Response
    return res.status(200).json({ insights: text });
  } catch (error) {
    console.error("Vercel AI Error:", error);
    return res.status(500).json({
      error: "Failed to generate insights",
      details: error.message,
    });
  }
}
