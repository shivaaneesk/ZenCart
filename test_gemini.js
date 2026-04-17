import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const modelsToTest = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest'];
  for (const m of modelsToTest) {
    try {
      console.log(`Testing ${m}...`);
      let res = await ai.models.generateContent({ model: m, contents: "say yes" });
      console.log(`Success with ${m}: ${res.text}`);
      return; // Exit on first success
    } catch(e) {
      console.log(`Failed ${m}: ${e.message}`);
    }
  }
}
run();
