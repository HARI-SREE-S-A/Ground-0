import { useEffect, useState } from 'react';
import { ArrowLeft, Package, Truck, MapPin, Clock, CheckCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { StatCard } from '../ui/StatCard';
import { OrderManagement } from './OrderManagement';
import { InventoryManagement } from './InventoryManagement';
import { DeliveryMap } from './DeliveryMap';

interface WarehouseDashboardProps {
  onBack: () => void;
}

type TabType = 'overview' | 'orders' | 'inventory' | 'delivery';

export function WarehouseDashboard({ onBack }: WarehouseDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [warehouse, setWarehouse] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [retailers, setRetailers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [warehousesData, retailersData] = await Promise.all([
        api.warehouses.getAll(),
        api.retailers.getAll()
      ]);

      const firstWarehouse = warehousesData?.[0];
      setWarehouse(firstWarehouse);

      if (firstWarehouse) {
        const [warehouseOrders, warehouseInventory] = await Promise.all([
          api.orders.getByWarehouse(firstWarehouse.id),
          api.inventory.getByWarehouse(firstWarehouse.id)
        ]);

        setOrders(warehouseOrders || []);
        setInventory(warehouseInventory || []);

        const warehouseRetailers = retailersData?.filter(
          r => r.assigned_warehouse_id === firstWarehouse.id
        ) || [];
        setRetailers(warehouseRetailers);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No warehouse data found</p>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const activeDeliveries = orders.filter(o => o.status === 'out_for_delivery').length;
  const completedToday = orders.filter(o => {
    if (o.status !== 'delivered') return false;
    const today = new Date().toDateString();
    return new Date(o.delivered_at || o.order_date).toDateString() === today;
  }).length;
  const totalStock = inventory.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Package },
    { id: 'orders' as const, label: 'Order Management', icon: Truck },
    { id: 'inventory' as const, label: 'Inventory', icon: Package },
    { id: 'delivery' as const, label: 'Delivery Map', icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-orange-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{warehouse.name}</h1>
              <p className="text-orange-100 mt-1 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {warehouse.location} | Coverage: {warehouse.coverage_radius_km}km
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <div className="text-sm text-orange-100">Capacity</div>
              <div className="text-lg font-semibold">{warehouse.capacity.toLocaleString()} units</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Pending Orders"
                value={pendingOrders}
                icon={Clock}
                color="orange"
              />
              <StatCard
                title="Active Deliveries"
                value={activeDeliveries}
                icon={Truck}
                color="blue"
              />
              <StatCard
                title="Completed Today"
                value={completedToday}
                icon={CheckCircle}
                color="green"
                trend={{ value: 8.5, isPositive: true }}
              />
              <StatCard
                title="Total Stock"
                value={totalStock.toLocaleString()}
                icon={Package}
                color="teal"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 6).map((order, index) => {
                    const statusColors: Record<string, string> = {
                      pending: 'bg-yellow-100 text-yellow-700',
                      processing: 'bg-blue-100 text-blue-700',
                      picked: 'bg-indigo-100 text-indigo-700',
                      packed: 'bg-purple-100 text-purple-700',
                      out_for_delivery: 'bg-orange-100 text-orange-700',
                      delivered: 'bg-green-100 text-green-700'
                    };

                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{order.order_number}</div>
                          <div className="text-sm text-gray-600">{order.retailer?.shop_name}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alerts</h3>
                <div className="space-y-3">
                  {inventory
                    .filter(item => item.quantity < item.low_stock_threshold)
                    .slice(0, 6)
                    .map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{item.product?.name}</div>
                          <div className="text-sm text-gray-600">Current: {item.quantity} units</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-red-600">Low Stock</div>
                          <div className="text-xs text-gray-600">Threshold: {item.low_stock_threshold}</div>
                        </div>
                      </div>
                    ))}
                  {inventory.filter(item => item.quantity < item.low_stock_threshold).length === 0 && (
                    <div className="text-center py-8 text-gray-500">All products are well stocked</div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Orders Processed Today</span>
                      <span className="text-lg font-bold text-blue-600">{completedToday}</span>
                    </div>
                    <div className="text-xs text-gray-500">Target: 25 orders/day</div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Avg. Processing Time</span>
                      <span className="text-lg font-bold text-green-600">28 min</span>
                    </div>
                    <div className="text-xs text-gray-500">Target: 30 min</div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">On-Time Delivery Rate</span>
                      <span className="text-lg font-bold text-orange-600">95.2%</span>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '95.2%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Served Retailers</h3>
                <div className="space-y-3">
                  {retailers.slice(0, 6).map((retailer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{retailer.shop_name}</div>
                        <div className="text-sm text-gray-600">{retailer.address}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          Credit: ₹{((retailer.credit_limit - retailer.credit_used) / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <OrderManagement orders={orders} warehouse={warehouse} onUpdate={loadData} />
        )}

        {activeTab === 'inventory' && (
          <InventoryManagement inventory={inventory} warehouse={warehouse} />
        )}

        {activeTab === 'delivery' && (
          <DeliveryMap warehouse={warehouse} orders={orders} retailers={retailers} />
        )}
      </div>
    </div>
  );
}
