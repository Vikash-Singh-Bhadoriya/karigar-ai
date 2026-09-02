const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://obclcryxuhabdzmfrili.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iY2xjcnl4dWhhYmR6bWZyaWxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODI2OTgyNSwiZXhwIjoyMTAzODQ1ODI1fQ.dN0w3V9MYrrl8hQsDFroQrH89F5gvZngk6-v1rBmZoo';

const demoProducts = [
  {
    name: 'लाख की चूड़ियाँ (Handmade Lac Bangles)',
    category: 'Jewellery',
    description: 'Authentic handmade lac bangles from Rajasthan, crafted by local artisans using traditional techniques passed down through generations. Features intricate mirror work and vibrant colors suitable for festive occasions and weddings.',
    materials: JSON.stringify(['Lac', 'Glass Mirrors', 'Natural Colors']),
    tags: JSON.stringify(['bangles', 'handmade', 'rajasthan', 'festive', 'wedding']),
    price: '450',
    selling_scope: 'All India',
    artisan_name: 'Meena Devi',
    artisan_location: 'Jaipur, Rajasthan',
    localImage: 'painting.jpg'
  },
  {
    name: 'सूती टोट बैग (Eco-friendly Cotton Tote)',
    category: 'Bag',
    description: 'Durable, eco-friendly cotton tote bag with traditional block print designs inspired by Gujarati textile art. Perfect for daily use and shopping. Made from 100% organic cotton with natural vegetable dyes.',
    materials: JSON.stringify(['100% Organic Cotton', 'Natural Vegetable Dyes']),
    tags: JSON.stringify(['tote', 'cotton', 'eco-friendly', 'block print', 'gujarat']),
    price: '250',
    selling_scope: 'All India',
    artisan_name: 'Ramesh Weaver',
    artisan_location: 'Ahmedabad, Gujarat',
    localImage: 'bamboo.jpg'
  },
  {
    name: 'Kashmiri Hand-knotted Silk Carpet',
    category: 'Home Decor',
    description: 'Exquisite hand-knotted Kashmiri silk carpet featuring traditional Persian-inspired floral motifs. Each piece takes 6-12 months to complete. Extremely soft, durable, and a true masterpiece of craftsmanship worthy of being a family heirloom.',
    materials: JSON.stringify(['Pure Silk', 'Cotton Base', 'Natural Dyes']),
    tags: JSON.stringify(['carpet', 'kashmir', 'silk', 'hand-knotted', 'luxury']),
    price: '15000',
    selling_scope: 'All India',
    artisan_name: 'Tariq Ahmed',
    artisan_location: 'Srinagar, Jammu & Kashmir',
    localImage: 'carpet.jpg'
  }
];

async function seedDemoProducts() {
  console.log('🌱 Seeding demo products with images to Supabase...\n');

  for (const product of demoProducts) {
    const imgPath = path.join(__dirname, '../website/public/images', product.localImage);
    
    // Step 1: Upload image to Supabase Storage
    let imageUrl = null;
    if (fs.existsSync(imgPath)) {
      const fileName = `demo-${Date.now()}-${product.localImage}`;
      const fileBuffer = fs.readFileSync(imgPath);
      
      console.log(`  📸 Uploading image: ${product.localImage}...`);
      const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/product-images/${fileName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'image/jpeg',
        },
        body: fileBuffer,
      });
      
      if (uploadRes.ok) {
        imageUrl = `${SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;
        console.log(`  ✅ Image uploaded: ${imageUrl}`);
      } else {
        const err = await uploadRes.text();
        console.error(`  ❌ Image upload failed:`, err);
      }
    } else {
      console.warn(`  ⚠️ Image not found: ${imgPath}`);
    }

    // Step 2: Insert product record into Supabase PostgreSQL
    console.log(`  📝 Inserting product: ${product.name}...`);
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        name: product.name,
        category: product.category,
        description: product.description,
        materials: JSON.parse(product.materials),
        tags: JSON.parse(product.tags),
        price: parseFloat(product.price),
        image_url: imageUrl,
        selling_scope: product.selling_scope,
        artisan_name: product.artisan_name,
        artisan_location: product.artisan_location,
        status: 'active',
      }),
    });

    if (insertRes.ok) {
      const data = await insertRes.json();
      console.log(`  ✅ Product created with ID: ${data[0]?.id}\n`);
    } else {
      const err = await insertRes.text();
      console.error(`  ❌ Product insert failed:`, err, '\n');
    }
  }

  // Step 3: Verify by fetching all products
  console.log('🔍 Verifying products in database...');
  const verifyRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,name,image_url,status&status=eq.active`, {
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'apikey': SERVICE_KEY,
    },
  });
  const products = await verifyRes.json();
  console.log(`\n📊 Total active products: ${products.length}`);
  products.forEach(p => {
    const hasImage = p.image_url ? '🖼️' : '❌';
    console.log(`  ${hasImage} [${p.id}] ${p.name}`);
    if (p.image_url) console.log(`     → ${p.image_url}`);
  });

  // Step 4: Test the backend API
  console.log('\n🧪 Testing backend API at http://localhost:5000...');
  try {
    const apiRes = await fetch('http://localhost:5000/api/catalog');
    const apiData = await apiRes.json();
    if (apiData.success) {
      console.log(`✅ Backend API returned ${apiData.data.products.length} products`);
    } else {
      console.log('❌ Backend API failed:', apiData.message);
    }
  } catch (e) {
    console.log('❌ Backend not reachable:', e.message);
  }

  console.log('\n🎉 Done! Refresh http://localhost:3000 to see products on the buyer website.');
}

seedDemoProducts();
