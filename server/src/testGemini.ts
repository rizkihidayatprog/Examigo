import { generateQuestionsWithAI } from './services/aiService';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  console.log('Testing Gemini API key:', process.env.GEMINI_API_KEY?.slice(0, 10) + '...');
  try {
    const res = await generateQuestionsWithAI({
      materialText: 'Kura-kura adalah hewan bersisik berkaki empat yang termasuk golongan reptil. Bangsa hewan ini disebut Testudines.',
      count: 3,
      difficulty: 'MEDIUM',
      questionTypes: ['MULTIPLE_CHOICE'],
      subject: 'Biologi',
    });
    console.log('RESULT COUNT:', res.length);
    console.log('RESULT QUESTIONS:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('TEST ERROR:', err);
  }
}

test();
