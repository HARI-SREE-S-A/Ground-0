import { useEffect, useState } from 'react';
import { ArrowLeft, Package, Truck, AlertTriangle, DollarSign } from 'lucide-react';
import { api } from '../../lib/api';
import { StatCard } from '../ui/StatCard';
import { BarChart } from '../ui/BarChart';
import { DonutChart } from '../ui/DonutChart';
import { LineChart } from '../ui/LineChart';
import { SimpleMap } from '../ui/SimpleMap';

interface CompanyDashboardProps {
  onBack: () => void;
}

export function CompanyDashboard({ onBack }: CompanyDashboardProps) {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [warehousesData, inventoryData, ordersData, lowStockData] = await Promise.all([
        api.warehouses.getAll(),
        api.inventory.getAll(),
        api.orders.getAll(),
        api.inventory.getLowStock()
      ]);

      setWarehouses(warehousesData || []);
      setInventory(inventoryData || []);
      setOrders(ordersData || []);
      setLowStock(lowStockData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalStock = inventory.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  const stockByWarehouse = warehouses.map(warehouse => {
    const warehouseStock = inventory.filter(inv => inv.warehouse_id === warehouse.id);
    return {
      label: warehouse.location,
      value: warehouseStock.reduce((sum, item) => sum + (item.quantity || 0), 0),
      color: '#3b82f6'
    };
  });

  const stockByCategory = (() => {
    const categoryMap: Record<string, number> = {};
    inventory.forEach(item => {
      const category = item.product?.category?.name || 'Unknown';
      categoryMap[category] = (categoryMap[category] || 0) + (item.quantity || 0);
    });
    return Object.entries(categoryMap).map(([label, value]) => ({ label, value }));
  })();

  const categoryColors: Record<string, string> = {
    'LED Bulbs': '#3b82f6',
    'LED Tube Lights': '#10b981',
    'LED Panel Lights': '#f59e0b',
    'LED Street Lights': '#ef4444',
    'Decorative Lights': '#8b5cf6'
  };

  const stockByCategoryWithColors = stockByCategory.map(item => ({
    ...item,
    color: categoryColors[item.label] || '#6b7280'
  }));

  const demandData = [
    { label: 'Mon', value: 150 },
    { label: 'Tue', value: 180 },
    { label: 'Wed', value: 165 },
    { label: 'Thu', value: 195 },
    { label: 'Fri', value: 220 },
    { label: 'Sat', value: 200 },
    { label: 'Sun', value: 170 }
  ];

  const mapLocations = warehouses.map(warehouse => ({
    lat: Number(warehouse.latitude),
    lng: Number(warehouse.longitude),
    label: warehouse.location,
    type: 'warehouse' as const
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Company Dashboard</h1>
              <p className="text-blue-100 mt-1">Comprehensive inventory and analytics overview</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <div className="text-sm text-blue-100">Last Updated</div>
              <div className="text-lg font-semibold">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Inventory"
            value={totalStock.toLocaleString()}
            icon={Package}
            color="blue"
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={Truck}
            color="green"
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Low Stock Items"
            value={lowStock.length}
            icon={AlertTriangle}
            color="orange"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
            icon={DollarSign}
            color="teal"
            trend={{ value: 15.3, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <BarChart
            title="Inventory by Warehouse"
            data={stockByWarehouse}
            height="320px"
          />
          <DonutChart
            title="Stock Distribution by Category"
            data={stockByCategoryWithColors}
            centerText={`${stockByCategory.length}`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <LineChart
            title="7-Day Demand Trend"
            data={demandData}
            height="320px"
            color="#3b82f6"
          />
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Planning</h3>
            <div className="space-y-4">
              {lowStock.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.product?.name}</div>
                    <div className="text-sm text-gray-600">
                      Current: {item.quantity} | Threshold: {item.low_stock_threshold}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-orange-600">
                      Produce: {Math.max(500, item.low_stock_threshold * 3)}
                    </div>
                  </div>
                </div>
              ))}
              {lowStock.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  All products are well stocked
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Warehouse Network</h3>
            <SimpleMap
              center={{ lat: 10.0, lng: 76.5 }}
              locations={mapLocations}
              height="400px"
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Order Fulfillment Rate</span>
                  <span className="text-lg font-bold text-blue-600">94.5%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94.5%' }}></div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">On-Time Delivery</span>
                  <span className="text-lg font-bold text-green-600">92.8%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '92.8%' }}></div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Warehouse Utilization</span>
                  <span className="text-lg font-bold text-orange-600">78.3%</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '78.3%' }}></div>
                </div>
              </div>

              <div className="p-4 bg-teal-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Customer Satisfaction</span>
                  <span className="text-lg font-bold text-teal-600">96.2%</span>
                </div>
                <div className="w-full bg-teal-200 rounded-full h-2">
                  <div className="bg-teal-600 h-2 rounded-full" style={{ width: '96.2%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Stock Movements</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Warehouse</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Current Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.slice(0, 10).map((item, index) => {
                  const status = item.quantity < item.low_stock_threshold ? 'Low Stock' : item.quantity < item.low_stock_threshold * 2 ? 'Medium' : 'Good';
                  const statusColor = status === 'Low Stock' ? 'text-red-600 bg-red-50' : status === 'Medium' ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50';

                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{item.warehouse?.location}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.product?.name}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.quantity}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
