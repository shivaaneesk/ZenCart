import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function check() {
  const models = await ai.models.list();
  console.log("Allowed models:");
  for await (const m of models) {
    if (m.name.includes("flash") || m.name.includes("pro")) {
       console.log(m.name);
    }
  }
}
check();
