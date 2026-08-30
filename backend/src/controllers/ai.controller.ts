import type { Request, Response } from 'express';
import * as aiService from '../services/ai.service';
import type { ListingInput } from '../types/product';

export const generateListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { transcript, language } = (req.body ?? {}) as ListingInput & { language?: string };

    if (!transcript) {
      res.status(400).json({ success: false, message: 'transcript is required' });
      return;
    }

    const data = await aiService.generateListing({ transcript, language });
    res.json({ success: true, data });
  } catch (error) {
    console.error('generateListing error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
