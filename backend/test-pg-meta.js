const https = require('https');

const data = JSON.stringify({ query: 'SELECT 1;' });

const options = {
  hostname: 'obclcryxuhabdzmfrili.supabase.co',
  path: '/pg-meta/default/query',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iY2xjcnl4dWhhYmR6bWZyaWxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODI2OTgyNSwiZXhwIjoyMTAzODQ1ODI1fQ.dN0w3V9MYrrl8hQsDFroQrH89F5gvZngk6-v1rBmZoo',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iY2xjcnl4dWhhYmR6bWZyaWxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODI2OTgyNSwiZXhwIjoyMTAzODQ1ODI1fQ.dN0w3V9MYrrl8hQsDFroQrH89F5gvZngk6-v1rBmZoo',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (c) => body += c);
  res.on('end', () => console.log(res.statusCode, body));
});
req.on('error', console.error);
req.write(data);
req.end();
