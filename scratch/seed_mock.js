const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://obclcryxuhabdzmfrili.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iY2xjcnl4dWhhYmR6bWZyaWxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODI2OTgyNSwiZXhwIjoyMTAzODQ1ODI1fQ.dN0w3V9MYrrl8hQsDFroQrH89F5gvZngk6-v1rBmZoo';

const appMockData = [
  {
    name: 'कॉटन टोट बैग (Handcrafted Cotton Tote Bag)',
    category: 'Bags',
    description: 'Eco-friendly handcrafted cotton tote bag, perfect for daily use.',
    materials: JSON.stringify(['Cotton', 'Natural Dyes']),
    tags: JSON.stringify(['bag', 'cotton', 'eco-friendly']),
    price: 649,
    image_url: 'https://images.unsplash.com/photo-1611583640642-c30238227b76?w=500&h=500&fit=crop&auto=format',
    selling_scope: 'All India',
    artisan_name: 'Priya Devi',
    artisan_location: 'Jaipur, Rajasthan',
    status: 'active'
  },
  {
    name: 'हाथ से बुना दुपट्टा (Handwoven Dupatta)',
    category: 'Clothing',
    description: 'Beautiful handwoven dupatta with traditional patterns.',
    materials: JSON.stringify(['Cotton Silk']),
    tags: JSON.stringify(['dupatta', 'handwoven', 'traditional']),
    price: 1249,
    image_url: 'https://images.unsplash.com/photo-1717585679395-bbe39b5fb6bc?w=500&h=500&fit=crop&auto=format',
    selling_scope: 'All India',
    artisan_name: 'Ramesh Weaver',
    artisan_location: 'Varanasi, UP',
    status: 'active'
  },
  {
    name: 'कांथा रजाई (Kantha Quilt)',
    category: 'Home Decor',
    description: 'Traditional Kantha quilt, hand-stitched for maximum comfort and warmth.',
    materials: JSON.stringify(['Cotton', 'Thread']),
    tags: JSON.stringify(['quilt', 'kantha', 'home decor']),
    price: 2100,
    image_url: 'https://images.unsplash.com/photo-1773847099204-238d283b2845?w=500&h=500&fit=crop&auto=format',
    selling_scope: 'All India',
    artisan_name: 'Sita',
    artisan_location: 'Kolkata, West Bengal',
    status: 'active'
  },
  {
    name: 'जूट शोल्डर बैग (Jute Shoulder Bag)',
    category: 'Bags',
    description: 'Durable and stylish jute shoulder bag.',
    materials: JSON.stringify(['Jute']),
    tags: JSON.stringify(['bag', 'jute', 'sustainable']),
    price: 480,
    image_url: 'https://images.unsplash.com/photo-1531357732422-758bdf2af3d5?w=500&h=500&fit=crop&auto=format',
    selling_scope: 'All India',
    artisan_name: 'Amit Crafts',
    artisan_location: 'Pune, Maharashtra',
    status: 'active'
  },
  {
    name: 'कढ़ाई की पोटली (Embroidered Potli)',
    category: 'Accessories',
    description: 'Beautifully embroidered potli bag for festive occasions.',
    materials: JSON.stringify(['Silk', 'Beads']),
    tags: JSON.stringify(['potli', 'embroidery', 'festive']),
    price: 380,
    image_url: 'https://images.unsplash.com/photo-1777377372084-6eb0c83c2ed8?w=500&h=500&fit=crop&auto=format',
    selling_scope: 'All India',
    artisan_name: 'Meena',
    artisan_location: 'Ahmedabad, Gujarat',
    status: 'active'
  },
  {
    name: 'हैंडलूम साड़ी (Handloom Saree)',
    category: 'Clothing',
    description: 'Authentic handloom saree crafted by master weavers.',
    materials: JSON.stringify(['Silk', 'Cotton']),
    tags: JSON.stringify(['saree', 'handloom', 'traditional']),
    price: 3200,
    image_url: 'https://images.unsplash.com/photo-1640292343595-889db1c8262e?w=500&h=500&fit=crop&auto=format',
    selling_scope: 'All India',
    artisan_name: 'Weavers Guild',
    artisan_location: 'Kanchipuram, Tamil Nadu',
    status: 'active'
  }
];

async function syncMockDataToDatabase() {
  console.log('🧹 Clearing old products from Supabase...');
  
  // Wipe all products (for testing/demo)
  const clearRes = await fetch(`${SUPABASE_URL}/rest/v1/products?id=gt.0`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'apikey': SERVICE_KEY,
    }
  });

  console.log('🌱 Seeding database with Mobile App Mock Data...\n');

  for (const product of appMockData) {
    console.log(`📝 Inserting product: ${product.name}...`);
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(product),
    });

    if (insertRes.ok) {
      console.log(`  ✅ Added!`);
    } else {
      const err = await insertRes.text();
      console.error(`  ❌ Failed:`, err);
    }
  }

  console.log('\n🎉 Done! The Buyer Website now matches the Mobile App mock data.');
}

syncMockDataToDatabase();
