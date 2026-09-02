const { createClient } = require('@supabase/supabase-js');
const http = require('http');

// This simulates the Website's connection
const supabaseUrl = 'https://obclcryxuhabdzmfrili.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iY2xjcnl4dWhhYmR6bWZyaWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjk4MjUsImV4cCI6MjEwMzg0NTgyNX0.NSxffEAc_IOUmB70O2yxdonWydAKO7uZC60Qp7zOVQM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔄 Setting up Realtime connection (Simulating Website)...');

const channel = supabase
  .channel('public:products')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'products' },
    (payload) => {
      console.log('✅ Real-time event received on Website! New Product Data:');
      console.log(payload.new);
      console.log('🎉 TEST SUCCESSFUL! App -> Backend -> Database -> Website connection is working perfectly.');
      process.exit(0);
    }
  )
  .subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('✅ Website is subscribed to real-time changes.');
      
      console.log('📱 Simulating Mobile App sending product to backend...');
      
      // Simulate App -> Backend POST
      const postData = JSON.stringify({
        name: 'Test Artisan Pot',
        category: 'Pottery',
        description: 'A beautiful handcrafted test pot',
        price: 499,
        selling_scope: 'india'
      });

      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/catalog',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          console.log(`Backend replied with status: ${res.statusCode}`);
          if (res.statusCode === 201) {
            console.log('✅ Backend successfully stored product in database.');
            console.log('⏳ Waiting for real-time broadcast from Database to Website...');
          } else {
            console.error('❌ Backend error:', data);
            process.exit(1);
          }
        });
      });

      req.on('error', (e) => {
        console.error(`❌ Problem with request: ${e.message}`);
        process.exit(1);
      });

      req.write(postData);
      req.end();
    }
  });

// Timeout after 15 seconds
setTimeout(() => {
  console.error('❌ Timed out waiting for real-time event.');
  process.exit(1);
}, 15000);
