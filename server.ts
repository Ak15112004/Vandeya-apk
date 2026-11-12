import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Google Gemini AI SDK if key available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI();
  } catch (err) {
    console.warn('Failed to initialize Google GenAI SDK:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    platform: 'VANDEYA',
    version: '1.0.0',
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY)
  });
});

// AI Caption & Post Assistant Endpoint
app.post('/api/ai/assistant', async (req: Request, res: Response) => {
  const { action, prompt, text, tone = 'desi_modern', language = 'en' } = req.body;

  try {
    if (ai) {
      let systemPrompt = `You are VANDEYA AI Brain, the hyper-intelligent built-in creative assistant for India's Next Generation Social Media Super App "VANDEYA" (वंदेया). 
Tagline: "Connect India. Inspire the World."
Keep responses punchy, culturally resonant, modern, vibrant, and engaging. Avoid generic corporate fluff.`;

      let userPrompt = '';
      if (action === 'caption') {
        userPrompt = `Generate 3 distinct, viral, engaging social media captions for this topic or image description: "${prompt}".
Tone: ${tone} (Options: desi_modern, professional_bharat, poetic_shayari, youth_slang).
Language preference: ${language}.
Also provide 5-8 relevant trending Indian and global hashtags (e.g. #Vandeya #DigitalIndia #MadeInIndia). Format with clean sections.`;
      } else if (action === 'hashtags') {
        userPrompt = `Generate a set of 12 trending, high-reach hashtags for this post content: "${text || prompt}". Include a blend of viral Indian hashtags, niche tags, and community tags.`;
      } else if (action === 'translate') {
        userPrompt = `Translate the following social text into ${language} (preserve the cultural tone, emojis, and social media slang):
"${text}"`;
      } else if (action === 'enhance') {
        userPrompt = `Rewrite and polish this social media post for higher engagement on VANDEYA:
Original text: "${text}"
Tone: ${tone}.
Make it punchy, include fitting emojis, and structure for maximum readability.`;
      } else if (action === 'reply') {
        userPrompt = `Suggest 3 quick, witty, and warm comment/message reply options to this message: "${text}". 
Tone: Friendly Indian social vibe.`;
      } else {
        userPrompt = prompt || text || 'Provide inspiration for a post on Vandeya.';
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\n${userPrompt}`,
      });

      return res.json({ result: response.text });
    }

    // Fallback if Gemini key is not supplied or during local testing
    let fallbackResult = '';
    if (action === 'caption') {
      fallbackResult = `✨ "${prompt || 'New journey begins'}" — Rooted in heritage, flying towards the future. 🇮🇳\n\n#Vandeya #ProudlyIndian #ConnectIndia #BharatTech #NewEra`;
    } else if (action === 'hashtags') {
      fallbackResult = `#Vandeya #IncredibleIndia #DigitalBharat #CreatorEconomy #TechIndia #MakeInIndia #GenZIndia`;
    } else if (action === 'translate') {
      fallbackResult = `[अनुवाद / Translated]: ${text}\n(वंदेया के साथ जुड़े रहें और दुनिया को प्रेरित करें)`;
    } else if (action === 'enhance') {
      fallbackResult = `🚀 ${text}\n\nPowered by passion. What do you think about this? Share your thoughts below! 👇\n#Vandeya`;
    } else {
      fallbackResult = `Namaste! Absolutely agreed. Let's build together! 🇮🇳✨`;
    }

    return res.json({ result: fallbackResult });
  } catch (error: any) {
    console.error('Gemini AI API error:', error);
    return res.status(500).json({
      error: 'AI assistance generation failed',
      fallback: `Celebrating India's vibrant creativity on Vandeya! 🇮🇳✨ #Vandeya #ProudlyIndian`
    });
  }
});

// Setup dev server with Vite or static production serving
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 VANDEYA Super App Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
