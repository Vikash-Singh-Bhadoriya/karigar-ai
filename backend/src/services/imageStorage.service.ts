import { randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

const BUCKET = config.supabaseStorageBucket || 'product-images';

const supabase =
  config.supabaseUrl && config.supabaseSecretKey
    ? createClient(config.supabaseUrl, config.supabaseSecretKey, {
        auth: { persistSession: false },
      })
    : null;

function extensionFor(contentType: string): string {
  switch (contentType.toLowerCase()) {
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    case 'image/heic':
      return '.heic';
    case 'image/heif':
      return '.heif';
    default:
      return '.jpg';
  }
}

/**
 * Upload a marketplace product image to Supabase Storage and return its
 * persistent public URL.
 *
 * Throws on missing configuration or upload failure so the caller never
 * persists a product pointing to a nonexistent image. The error message is
 * safe to log (the service-role key is never included).
 */
export async function storeProductImage(input: {
  buffer: Buffer;
  contentType: string;
}): Promise<string> {
  if (!supabase) {
    throw new Error(
      'SUPABASE_URL या SUPABASE_SECRET_KEY set नहीं हैं — image upload unavailable'
    );
  }

  const objectPath = `products/${Date.now()}-${randomUUID()}${extensionFor(input.contentType)}`;

  const { error } = await supabase.storage.from(BUCKET).upload(objectPath, input.buffer, {
    contentType: input.contentType,
    upsert: false,
  });

  if (error) {
    throw new Error(`Failed to upload product image to storage: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}