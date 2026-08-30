import type { Request, Response } from 'express';
import * as aiService from '../services/ai.service';
import type { FollowUpInput, ProductInput } from '../types/product';

export const analyzeProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { transcript, language } = (req.body ?? {}) as ProductInput;
    const imagePath = req.file?.path;

    const input: ProductInput = { transcript, language, imagePath };
    const data = await aiService.analyzeProduct(input);

    res.json({ success: true, data });
  } catch (error) {
    console.error('analyzeProduct error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
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
