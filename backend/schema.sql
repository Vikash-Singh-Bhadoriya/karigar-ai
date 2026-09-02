-- Products table (main catalog)
CREATE TABLE IF NOT EXISTS products (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL DEFAULT 'Unnamed Product',
  category      TEXT NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  materials     JSONB NOT NULL DEFAULT '[]',
  tags          JSONB NOT NULL DEFAULT '[]',
  weight        TEXT,
  dimensions    TEXT,
  price         NUMERIC,
  image_url     TEXT,
  selling_scope TEXT NOT NULL DEFAULT 'local',
  artisan_name  TEXT NOT NULL DEFAULT 'कारीगर',
  artisan_location TEXT NOT NULL DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id            SERIAL PRIMARY KEY,
  product_id    INTEGER REFERENCES products(id),
  buyer_name    TEXT NOT NULL,
  buyer_phone   TEXT NOT NULL,
  buyer_message TEXT NOT NULL DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Realtime for the products table
ALTER PUBLICATION supabase_realtime ADD TABLE products;
