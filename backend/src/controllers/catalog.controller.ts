import type { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';
import * as catalogService from '../services/catalog.service';
import * as fs from 'fs';

// Supabase client for Storage uploads
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

/* ------------------------------------------------------------------ */
/*  Products                                                           */
/* ------------------------------------------------------------------ */

export const listProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, minPrice, maxPrice, page, limit } = req.query;
    const data = await catalogService.getAllProducts({
      search: typeof search === 'string' ? search : undefined,
      category: typeof category === 'string' ? category : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    res.json({ success: true, data });
  } catch (error) {
    console.error('listProducts error:', error);
    res.status(500).json({ success: false, message: 'Failed to list products' });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid product ID' });
      return;
    }
    const product = await catalogService.getProductById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('getProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to get product' });
  }
};

export const publishProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body ?? {};

    // Upload image to Supabase Storage if a file was uploaded via multer
    let imageUrl: string | null = null;
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const fileBuffer = fs.readFileSync(req.file.path);
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, fileBuffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        console.error('Supabase Storage upload error:', uploadError);
        // Fallback to local URL if Storage upload fails
        imageUrl = `/uploads/${req.file.filename}`;
      } else {
        // Get the public URL from Supabase Storage
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }
    } else if (typeof body.image_url === 'string' && body.image_url) {
      imageUrl = body.image_url;
    }

    // Parse materials and tags if they come as JSON strings
    let materials: string[] = [];
    if (typeof body.materials === 'string') {
      try { materials = JSON.parse(body.materials); } catch { materials = []; }
    } else if (Array.isArray(body.materials)) {
      materials = body.materials;
    }

    let tags: string[] = [];
    if (typeof body.tags === 'string') {
      try { tags = JSON.parse(body.tags); } catch { tags = []; }
    } else if (Array.isArray(body.tags)) {
      tags = body.tags;
    }

    const input: catalogService.CreateProductInput = {
      name: String(body.name || '').trim() || 'Unnamed Product',
      category: String(body.category || '').trim(),
      description: String(body.description || '').trim(),
      materials,
      tags,
      weight: body.weight ?? null,
      dimensions: body.dimensions ?? null,
      price: (body.price !== undefined && body.price !== '' && body.price !== null) ? Number(body.price) : null,
      image_url: imageUrl,
      selling_scope: body.selling_scope ?? 'local',
      artisan_name: body.artisan_name ?? 'कारीगर',
      artisan_location: body.artisan_location ?? '',
    };

    const product = await catalogService.createProduct(input);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('publishProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to publish product' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid product ID' });
      return;
    }
    const product = await catalogService.updateProduct(id, req.body ?? {});
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('updateProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid product ID' });
      return;
    }
    const deleted = await catalogService.deleteProduct(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await catalogService.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ success: false, message: 'Failed to get categories' });
  }
};

/* ------------------------------------------------------------------ */
/*  Orders                                                             */
/* ------------------------------------------------------------------ */

export const placeOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id, buyer_name, buyer_phone, buyer_message } = req.body ?? {};

    if (!product_id || !buyer_name || !buyer_phone) {
      res.status(400).json({
        success: false,
        message: 'product_id, buyer_name, and buyer_phone are required',
      });
      return;
    }

    // Verify the product exists
    const product = await catalogService.getProductById(Number(product_id));
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const order = await catalogService.createOrder({
      product_id: Number(product_id),
      buyer_name: String(buyer_name).trim(),
      buyer_phone: String(buyer_phone).trim(),
      buyer_message: buyer_message ? String(buyer_message).trim() : '',
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('placeOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
};

export const listOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await catalogService.getOrders();
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('listOrders error:', error);
    res.status(500).json({ success: false, message: 'Failed to list orders' });
  }
};
