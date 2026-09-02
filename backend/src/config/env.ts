import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT ?? '5000', 10),
  databaseUrl: process.env.DATABASE_URL ?? '',
  geminiApiKey: process.env.GEMINI_API_KEY ?? '',
  geminiModel: process.env.GEMINI_MODEL ?? 'gemini-3.5-flash-lite',
  geminiSpeechModel: process.env.GEMINI_SPEECH_MODEL ?? 'gemini-3.5-flash-lite',
  uploadsDir: path.resolve(process.cwd(), 'uploads'),
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY ?? '',
  supabaseStorageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? 'product-images',
};
