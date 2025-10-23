import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      user_roles: UserRole;
      warehouses: Warehouse;
      retailers: Retailer;
      product_categories: ProductCategory;
      products: Product;
      warehouse_inventory: WarehouseInventory;
      orders: Order;
      order_items: OrderItem;
      stock_movements: StockMovement;
      delivery_routes: DeliveryRoute;
      payments: Payment;
      demand_forecasts: DemandForecast;
    };
  };
}

export interface UserRole {
  id: string;
  email: string;
  role: 'company' | 'retailer' | 'warehouse';
  full_name: string;
  phone: string | null;
  created_at: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  capacity: number;
  coverage_radius_km: number;
  manager_id: string | null;
  created_at: string;
}

export interface Retailer {
  id: string;
  user_id: string;
  shop_name: string;
  address: string;
  latitude: number;
  longitude: number;
  assigned_warehouse_id: string | null;
  credit_limit: number;
  credit_used: number;
  credit_score: number;
  created_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  specifications: Record<string, any>;
  price: number;
  moq: number;
  image_url: string | null;
  created_at: string;
}

export interface WarehouseInventory {
  id: string;
  warehouse_id: string;
  product_id: string;
  quantity: number;
  low_stock_threshold: number;
  last_updated: string;
}

export interface Order {
  id: string;
  order_number: string;
  retailer_id: string;
  warehouse_id: string;
  status: 'pending' | 'processing' | 'picked' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  total_amount: number;
  payment_method: 'credit' | 'upi' | 'bank_transfer' | 'cod';
  payment_status: 'pending' | 'paid' | 'overdue';
  delivery_agent_id: string | null;
  order_date: string;
  expected_delivery: string | null;
  delivered_at: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface StockMovement {
  id: string;
  warehouse_id: string;
  product_id: string;
  movement_type: 'incoming' | 'outgoing' | 'transfer' | 'adjustment';
  quantity: number;
  reference_type: string | null;
  reference_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface DeliveryRoute {
  id: string;
  order_id: string;
  delivery_agent_id: string | null;
  route_data: Record<string, any> | null;
  distance_km: number | null;
  estimated_time_minutes: number | null;
  status: 'planned' | 'in_progress' | 'completed';
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  retailer_id: string;
  order_id: string | null;
  amount: number;
  payment_method: string;
  transaction_id: string | null;
  status: 'pending' | 'completed' | 'failed';
  payment_date: string | null;
  created_at: string;
}

export interface DemandForecast {
  id: string;
  product_id: string;
  warehouse_id: string;
  forecast_date: string;
  predicted_quantity: number;
  confidence_level: number;
  created_at: string;
}
