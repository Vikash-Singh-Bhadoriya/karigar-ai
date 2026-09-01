import type { Request, Response } from 'express';
import * as aiService from '../services/ai.service';
import { getMarketPricing } from '../services/pricing/marketPricing.service';
import type { FollowUpInput, ProductInput, ProductState } from '../types/product';

export const analyzeProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { transcript, language } = (req.body ?? {}) as ProductInput;
    const imagePath = req.file?.path;

    const input: ProductInput = { transcript, language, imagePath };
    const data = await aiService.analyzeProduct(input);

    res.json({ success: true, data });
  } catch (error) {
    const e = error as { status?: number; code?: string; transient?: boolean };
    console.error('analyzeProduct error:', {
      status: e.status ?? 'n/a',
      code: e.code ?? 'n/a',
      transient: e.transient ?? false,
      error: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : undefined,
    });

    if (e.transient || e.status === 429 || e.status === 503) {
      res.status(429).json({
        success: false,
        message:
          'Gemini की अस्थायी सीमा (rate limit) पार हो गई है। कुछ सेकंड बाद फिर से कोशिश करें।',
      });
      return;
    }
    if (e.status === 400 && (e.code === 'SAFETY_BLOCK' || e.code === 'EMPTY_RESPONSE')) {
      res.status(422).json({
        success: false,
        message:
          'Gemini इस फोटो का विश्लेषण नहीं कर सका (फोटो ब्लॉक हो गई)। कृपया दूसरी, साफ फोटो से कोशिश करें।',
      });
      return;
    }
    if (e.status === 400) {
      res.status(400).json({
        success: false,
        message:
          'Gemini ने इस फोटो का फॉर्मैट/आकार स्वीकार नहीं किया। JPEG/PNG फोटो भेजें (10 MB से कम)।',
      });
      return;
    }
    if (e.status === 404) {
      res.status(500).json({
        success: false,
        message: 'Gemini model/API config गलत है। Backend में GEMINI_MODEL / API key जाँचें।',
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'प्रोडक्ट एनालिसिस के दौरान सर्वर त्रुटि हुई। कृपया फिर कोशिश करें।',
    });
  }
};

export const productFollowUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product, missingFields, answer, language, questionCount } = (req.body ?? {}) as FollowUpInput;

    if (!product || typeof product !== 'object' || !answer || !String(answer).trim()) {
      res.status(400).json({ success: false, message: 'product and answer are required' });
      return;
    }

    const data = await aiService.followUp({
      product,
      missingFields: Array.isArray(missingFields) ? missingFields : [],
      answer: String(answer).trim(),
      language: typeof language === 'string' ? language : 'हिंदी',
      questionCount: typeof questionCount === 'number' ? questionCount : 0,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('productFollowUp error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

interface PricingRequest {
  product?: Partial<ProductState>;
  language?: string;
}

export const getProductPricing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product, language } = (req.body ?? {}) as PricingRequest;

    if (!product || typeof product !== 'object') {
      res.status(400).json({ success: false, message: 'product is required' });
      return;
    }

    const data = await getMarketPricing(
      product as ProductState,
      typeof language === 'string' ? language : 'हिंदी'
    );

    res.json({ success: true, data });
  } catch (error) {
    console.error('getProductPricing error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
