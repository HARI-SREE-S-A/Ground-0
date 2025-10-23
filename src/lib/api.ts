import { supabase } from './supabase';

export const api = {
  warehouses: {
    async getAll() {
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  },

  products: {
    async getAll() {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:product_categories(*)
        `)
        .order('name');

      if (error) throw error;
      return data;
    },

    async getByCategory(categoryId: string) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:product_categories(*)
        `)
        .eq('category_id', categoryId)
        .order('name');

      if (error) throw error;
      return data;
    }
  },

  categories: {
    async getAll() {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  },

  inventory: {
    async getByWarehouse(warehouseId: string) {
      const { data, error } = await supabase
        .from('warehouse_inventory')
        .select(`
          *,
          product:products(*,category:product_categories(*)),
          warehouse:warehouses(*)
        `)
        .eq('warehouse_id', warehouseId)
        .order('last_updated', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getAll() {
      const { data, error } = await supabase
        .from('warehouse_inventory')
        .select(`
          *,
          product:products(*,category:product_categories(*)),
          warehouse:warehouses(*)
        `)
        .order('last_updated', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getLowStock() {
      const { data, error } = await supabase
        .from('warehouse_inventory')
        .select(`
          *,
          product:products(*,category:product_categories(*)),
          warehouse:warehouses(*)
        `)
        .order('quantity');

      if (error) throw error;
      return data?.filter(item => item.quantity < item.low_stock_threshold) || [];
    }
  },

  retailers: {
    async getAll() {
      const { data, error } = await supabase
        .from('retailers')
        .select(`
          *,
          user:user_roles(*),
          warehouse:warehouses(*)
        `)
        .order('shop_name');

      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('retailers')
        .select(`
          *,
          user:user_roles(*),
          warehouse:warehouses(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async getByUserId(userId: string) {
      const { data, error } = await supabase
        .from('retailers')
        .select(`
          *,
          user:user_roles(*),
          warehouse:warehouses(*)
        `)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  },

  orders: {
    async getAll() {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          retailer:retailers(*,user:user_roles(*)),
          warehouse:warehouses(*),
          items:order_items(*,product:products(*,category:product_categories(*)))
        `)
        .order('order_date', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getByRetailer(retailerId: string) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          retailer:retailers(*,user:user_roles(*)),
          warehouse:warehouses(*),
          items:order_items(*,product:products(*,category:product_categories(*)))
        `)
        .eq('retailer_id', retailerId)
        .order('order_date', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getByWarehouse(warehouseId: string) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          retailer:retailers(*,user:user_roles(*)),
          warehouse:warehouses(*),
          items:order_items(*,product:products(*,category:product_categories(*)))
        `)
        .eq('warehouse_id', warehouseId)
        .order('order_date', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          retailer:retailers(*,user:user_roles(*)),
          warehouse:warehouses(*),
          items:order_items(*,product:products(*,category:product_categories(*)))
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  },

  stockMovements: {
    async getAll() {
      const { data, error } = await supabase
        .from('stock_movements')
        .select(`
          *,
          product:products(*,category:product_categories(*)),
          warehouse:warehouses(*)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },

    async getByWarehouse(warehouseId: string) {
      const { data, error } = await supabase
        .from('stock_movements')
        .select(`
          *,
          product:products(*,category:product_categories(*)),
          warehouse:warehouses(*)
        `)
        .eq('warehouse_id', warehouseId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    }
  },

  payments: {
    async getByRetailer(retailerId: string) {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('retailer_id', retailerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  },

  demandForecasts: {
    async getAll() {
      const { data, error } = await supabase
        .from('demand_forecasts')
        .select(`
          *,
          product:products(*,category:product_categories(*)),
          warehouse:warehouses(*)
        `)
        .gte('forecast_date', new Date().toISOString().split('T')[0])
        .order('forecast_date');

      if (error) throw error;
      return data;
    }
  }
};
