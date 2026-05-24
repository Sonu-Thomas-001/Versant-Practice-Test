import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// API routes FIRST
app.post("/api/generate-report", async (req, res) => {
  try {
    const { scores, sectionScores } = req.body;
    
    // Check if key is available
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: "Gemini API key not configured." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are an expert ESOL examiner creating a language proficiency scorecard. 
The test assesses Speaking, Listening, Reading, and Writing.

Here are the candidate's section scores (raw out of max):
${Object.entries(sectionScores).map(([sec, data]: [string, any]) => `- Part ${sec}: ${data.score} out of ${data.maxScore}`).join('\n')}

Here are the candidate's computed skill scores (on a 10-90 scale):
- Speaking: ${scores.speaking || 'Not Assessed'}
- Listening: ${scores.listening || 'Not Assessed'}
- Reading: ${scores.reading || 'Not Assessed'}
- Writing: ${scores.writing || 'Not Assessed'}
- Overall: ${scores.overall}
- CEFR Band: ${scores.cefr}

Based on this performance data, please write the assessment.
Structure your response EXACTLY as this JSON format, keeping descriptions concise, professional, exam-report style, and directly mentioning the CEFR levels appropriately:
{
  "overallSummary": "A concise executive summary paragraph assessing their overall profile.",
  "speakingSummary": "Analysis of their speaking capability based on their score.",
  "listeningSummary": "Analysis of their listening capability.",
  "readingSummary": "Analysis of their reading capability.",
  "writingSummary": "Analysis of their writing capability.",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Area to improve 1", "Area to improve 2"],
  "speakingTip": "One actionable tip to improve speaking.",
  "listeningTip": "One actionable tip to improve listening.",
  "readingTip": "One actionable tip to improve reading.",
  "writingTip": "One actionable tip to improve writing."
}
DO NOT RETURN ANY MARKDOWN FORMATTING OR CODE BLOCKS. RETURN ONLY THE JSON OBJECT.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      }
    });

    const text = response.text || "{}";
    let jsonResult;
    try {
      jsonResult = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
    } catch (e) {
      jsonResult = { error: "Failed to parse LLM output." };
    }

    res.json(jsonResult);
  } catch (error) {
    console.error("LLM Generation Error:", error);
    res.status(500).json({ error: "Error generating report" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
