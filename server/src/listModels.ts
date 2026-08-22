import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function checkModels() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  const ai = new GoogleGenAI({ apiKey });

  const testList = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    'gemini-flash-latest'
  ];

  for (const m of testList) {
    try {
      console.log(`Testing model: ${m}`);
      const res = await ai.models.generateContent({
        model: m,
        contents: 'Say hello in 1 word',
      });
      console.log(`✅ SUCCESS with ${m}:`, res.text);
    } catch (err: any) {
      console.log(`❌ FAILED with ${m}:`, err.message);
    }
  }
}

checkModels();
