import type { Request, Response } from 'express';
import * as aiService from '../services/ai.service';
import type { ProductInput } from '../types/product';

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
