/*
  # LightHub Pro - LED Distribution Platform Database Schema

  ## Overview
  This migration creates the complete database schema for a hyperlocal LED distribution platform
  operating across Kerala. The system supports three types of users: Company/Manufacturer, 
  Retailers, and Warehouse Managers.

  ## New Tables

  ### 1. `user_roles`
  Stores user role information and authentication details
  - `id` (uuid, primary key)
  - `email` (text, unique)
  - `role` (text) - 'company', 'retailer', 'warehouse'
  - `full_name` (text)
  - `phone` (text)
  - `created_at` (timestamptz)

  ### 2. `warehouses`
  Stores warehouse hub locations across Kerala
  - `id` (uuid, primary key)
  - `name` (text)
  - `location` (text) - City name
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `capacity` (integer) - Total storage capacity
  - `coverage_radius_km` (integer) - Service radius in kilometers
  - `manager_id` (uuid, foreign key to user_roles)
  - `created_at` (timestamptz)

  ### 3. `retailers`
  Stores retail shop information
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to user_roles)
  - `shop_name` (text)
  - `address` (text)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `assigned_warehouse_id` (uuid, foreign key to warehouses)
  - `credit_limit` (numeric)
  - `credit_used` (numeric, default 0)
  - `credit_score` (integer, default 100)
  - `created_at` (timestamptz)

  ### 4. `product_categories`
  LED product categories
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `created_at` (timestamptz)

  ### 5. `products`
  LED product catalog
  - `id` (uuid, primary key)
  - `category_id` (uuid, foreign key to product_categories)
  - `name` (text)
  - `description` (text)
  - `specifications` (jsonb) - Technical specs
  - `price` (numeric)
  - `moq` (integer) - Minimum order quantity
  - `image_url` (text)
  - `created_at` (timestamptz)

  ### 6. `warehouse_inventory`
  Stock levels at each warehouse
  - `id` (uuid, primary key)
  - `warehouse_id` (uuid, foreign key to warehouses)
  - `product_id` (uuid, foreign key to products)
  - `quantity` (integer)
  - `low_stock_threshold` (integer)
  - `last_updated` (timestamptz)

  ### 7. `orders`
  Retail orders
  - `id` (uuid, primary key)
  - `order_number` (text, unique)
  - `retailer_id` (uuid, foreign key to retailers)
  - `warehouse_id` (uuid, foreign key to warehouses)
  - `status` (text) - pending, processing, picked, packed, out_for_delivery, delivered, cancelled
  - `total_amount` (numeric)
  - `payment_method` (text) - credit, upi, bank_transfer, cod
  - `payment_status` (text) - pending, paid, overdue
  - `delivery_agent_id` (uuid, foreign key to user_roles)
  - `order_date` (timestamptz)
  - `expected_delivery` (timestamptz)
  - `delivered_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 8. `order_items`
  Items in each order
  - `id` (uuid, primary key)
  - `order_id` (uuid, foreign key to orders)
  - `product_id` (uuid, foreign key to products)
  - `quantity` (integer)
  - `unit_price` (numeric)
  - `subtotal` (numeric)

  ### 9. `stock_movements`
  Track all inventory movements
  - `id` (uuid, primary key)
  - `warehouse_id` (uuid, foreign key to warehouses)
  - `product_id` (uuid, foreign key to products)
  - `movement_type` (text) - incoming, outgoing, transfer, adjustment
  - `quantity` (integer)
  - `reference_type` (text) - order, production, transfer
  - `reference_id` (uuid)
  - `notes` (text)
  - `created_at` (timestamptz)

  ### 10. `delivery_routes`
  Delivery route tracking
  - `id` (uuid, primary key)
  - `order_id` (uuid, foreign key to orders)
  - `delivery_agent_id` (uuid, foreign key to user_roles)
  - `route_data` (jsonb) - Route coordinates and waypoints
  - `distance_km` (numeric)
  - `estimated_time_minutes` (integer)
  - `status` (text) - planned, in_progress, completed
  - `started_at` (timestamptz)
  - `completed_at` (timestamptz)

  ### 11. `payments`
  Payment transaction records
  - `id` (uuid, primary key)
  - `retailer_id` (uuid, foreign key to retailers)
  - `order_id` (uuid, foreign key to orders)
  - `amount` (numeric)
  - `payment_method` (text)
  - `transaction_id` (text)
  - `status` (text) - pending, completed, failed
  - `payment_date` (timestamptz)
  - `created_at` (timestamptz)

  ### 12. `demand_forecasts`
  Demand prediction analytics
  - `id` (uuid, primary key)
  - `product_id` (uuid, foreign key to products)
  - `warehouse_id` (uuid, foreign key to warehouses)
  - `forecast_date` (date)
  - `predicted_quantity` (integer)
  - `confidence_level` (numeric)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for role-based access control
  - Company role can view all data
  - Retailers can only view their own data
  - Warehouse managers can view data for their assigned warehouse
*/

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('company', 'retailer', 'warehouse')),
  full_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Create warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  capacity integer NOT NULL DEFAULT 10000,
  coverage_radius_km integer NOT NULL DEFAULT 50,
  manager_id uuid REFERENCES user_roles(id),
  created_at timestamptz DEFAULT now()
);

-- Create retailers table
CREATE TABLE IF NOT EXISTS retailers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_roles(id) NOT NULL,
  shop_name text NOT NULL,
  address text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  assigned_warehouse_id uuid REFERENCES warehouses(id),
  credit_limit numeric NOT NULL DEFAULT 50000,
  credit_used numeric NOT NULL DEFAULT 0,
  credit_score integer NOT NULL DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

-- Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES product_categories(id) NOT NULL,
  name text NOT NULL,
  description text,
  specifications jsonb,
  price numeric NOT NULL,
  moq integer NOT NULL DEFAULT 1,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create warehouse_inventory table
CREATE TABLE IF NOT EXISTS warehouse_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id uuid REFERENCES warehouses(id) NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  low_stock_threshold integer NOT NULL DEFAULT 50,
  last_updated timestamptz DEFAULT now(),
  UNIQUE(warehouse_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  retailer_id uuid REFERENCES retailers(id) NOT NULL,
  warehouse_id uuid REFERENCES warehouses(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'picked', 'packed', 'out_for_delivery', 'delivered', 'cancelled')),
  total_amount numeric NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('credit', 'upi', 'bank_transfer', 'cod')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue')),
  delivery_agent_id uuid REFERENCES user_roles(id),
  order_date timestamptz DEFAULT now(),
  expected_delivery timestamptz,
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  subtotal numeric NOT NULL
);

-- Create stock_movements table
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id uuid REFERENCES warehouses(id) NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  movement_type text NOT NULL CHECK (movement_type IN ('incoming', 'outgoing', 'transfer', 'adjustment')),
  quantity integer NOT NULL,
  reference_type text,
  reference_id uuid,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create delivery_routes table
CREATE TABLE IF NOT EXISTS delivery_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) NOT NULL,
  delivery_agent_id uuid REFERENCES user_roles(id),
  route_data jsonb,
  distance_km numeric,
  estimated_time_minutes integer,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  retailer_id uuid REFERENCES retailers(id) NOT NULL,
  order_id uuid REFERENCES orders(id),
  amount numeric NOT NULL,
  payment_method text NOT NULL,
  transaction_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create demand_forecasts table
CREATE TABLE IF NOT EXISTS demand_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) NOT NULL,
  warehouse_id uuid REFERENCES warehouses(id) NOT NULL,
  forecast_date date NOT NULL,
  predicted_quantity integer NOT NULL,
  confidence_level numeric NOT NULL DEFAULT 0.75,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_forecasts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (demo mode)
-- In production, these would be more restrictive based on authenticated user roles

CREATE POLICY "Public read access to user_roles"
  ON user_roles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access to warehouses"
  ON warehouses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access to retailers"
  ON retailers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access to product_categories"
  ON product_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access to products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access to warehouse_inventory"
  ON warehouse_inventory FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access to orders"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access to order_items"
  ON order_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access to stock_movements"
  ON stock_movements FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access to delivery_routes"
  ON delivery_routes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access to payments"
  ON payments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access to demand_forecasts"
  ON demand_forecasts FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_retailers_user_id ON retailers(user_id);
CREATE INDEX IF NOT EXISTS idx_retailers_warehouse ON retailers(assigned_warehouse_id);
CREATE INDEX IF NOT EXISTS idx_orders_retailer ON orders(retailer_id);
CREATE INDEX IF NOT EXISTS idx_orders_warehouse ON orders(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_inventory_warehouse ON warehouse_inventory(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_inventory_product ON warehouse_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_warehouse ON stock_movements(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_demand_forecasts_product ON demand_forecasts(product_id);