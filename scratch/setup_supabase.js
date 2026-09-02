const SUPABASE_URL = 'https://obclcryxuhabdzmfrili.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iY2xjcnl4dWhhYmR6bWZyaWxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODI2OTgyNSwiZXhwIjoyMTAzODQ1ODI1fQ.dN0w3V9MYrrl8hQsDFroQrH89F5gvZngk6-v1rBmZoo';

async function setup() {
  // 1. Create bucket
  console.log('Creating product-images bucket...');
  const bucketRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: 'product-images', name: 'product-images', public: true }),
  });
  const bucketData = await bucketRes.json();
  console.log('Bucket result:', bucketData);

  // 2. Check if tables exist
  console.log('\nChecking database connection...');
  const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=count&limit=0`, {
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'apikey': SERVICE_KEY,
    },
  });
  console.log('DB status:', dbRes.status, await dbRes.text());

  // 3. List buckets to verify
  console.log('\nListing buckets...');
  const listRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    headers: { 'Authorization': `Bearer ${SERVICE_KEY}` },
  });
  const buckets = await listRes.json();
  console.log('Buckets:', buckets);
}

setup();
