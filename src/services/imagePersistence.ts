import * as FileSystem from 'expo-file-system/legacy';

export const PRODUCT_IMAGES_DIR = 'product-images';

function extensionFromUri(uri: string): string {
  const clean = uri.split('?')[0];
  const match = clean.match(/\.([a-zA-Z0-9]+)$/);
  const ext = match ? match[1].toLowerCase() : '';
  return ext.length > 0 && ext.length <= 5 ? `.${ext}` : '.jpg';
}

/**
 * Copy a (possibly temporary picker/cache) image into durable app-owned
 * storage so the URI survives OS cache cleanup. Returns the durable file:// URI.
 * Falls back to the original URI if the copy fails (e.g. web where
 * documentDirectory is unavailable) so callers never lose the image.
 */
export async function persistLocalImage(uri: string): Promise<string> {
  try {
    const base = FileSystem.documentDirectory;
    if (!base) return uri;
    const dir = `${base}${PRODUCT_IMAGES_DIR}/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const ext = extensionFromUri(uri);
    const dest = `${dir}img-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    console.log('[IMAGE] persisted picker image ->', dest);
    return dest;
  } catch (err) {
    console.log('[IMAGE] persist failed, keeping original URI', err);
    return uri;
  }
}

/** True when the URI points into this app's durable document directory. */
export function isAppOwnedImageUri(uri: string): boolean {
  const base = FileSystem.documentDirectory;
  return !!base && uri.startsWith(base);
}

/** Delete a durable local image copy (idempotent; ignores failures). */
export async function deleteLocalImage(uri: string): Promise<void> {
  if (!isAppOwnedImageUri(uri)) return;
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
    console.log('[IMAGE] deleted durable copy ->', uri);
  } catch {
    // Non-fatal: leftover copies are harmless.
  }
}