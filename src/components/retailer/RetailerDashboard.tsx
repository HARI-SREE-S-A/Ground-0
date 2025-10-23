import { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingCart, Package, CreditCard, TrendingUp, MapPin, Clock } from 'lucide-react';
import { api } from '../../lib/api';
import { StatCard } from '../ui/StatCard';
import { ProductCatalog } from './ProductCatalog';
import { OrderTracking } from './OrderTracking';
import { CreditManagement } from './CreditManagement';

interface RetailerDashboardProps {
  onBack: () => void;
}

type TabType = 'overview' | 'catalog' | 'orders' | 'credit';

export function RetailerDashboard({ onBack }: RetailerDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [retailer, setRetailer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [retailersData, productsData] = await Promise.all([
        api.retailers.getAll(),
        api.products.getAll()
      ]);

      const firstRetailer = retailersData?.[0];
      setRetailer(firstRetailer);

      if (firstRetailer) {
        const ordersData = await api.orders.getByRetailer(firstRetailer.id);
        setOrders(ordersData || []);
      }

      setProducts(productsData || []);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!retailer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No retailer data found</p>
        </div>
      </div>
    );
  }

  const creditAvailable = retailer.credit_limit - retailer.credit_used;
  const creditUtilization = (retailer.credit_used / retailer.credit_limit) * 100;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'picked' || o.status === 'packed' || o.status === 'out_for_delivery').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: TrendingUp },
    { id: 'catalog' as const, label: 'Products', icon: Package },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingCart },
    { id: 'credit' as const, label: 'Credit & Payments', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-green-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{retailer.shop_name}</h1>
              <p className="text-green-100 mt-1 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {retailer.address}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <div className="text-sm text-green-100">Serviced by</div>
              <div className="text-lg font-semibold">{retailer.warehouse?.name}</div>
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
                    ? 'text-green-600 border-b-2 border-green-600'
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
                title="Completed Orders"
                value={completedOrders}
                icon={Package}
                color="green"
              />
              <StatCard
                title="Available Credit"
                value={`₹${(creditAvailable / 1000).toFixed(0)}K`}
                icon={CreditCard}
                color="blue"
              />
              <StatCard
                title="Total Spent"
                value={`₹${(totalSpent / 1000).toFixed(0)}K`}
                icon={TrendingUp}
                color="teal"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Status</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Credit Used</span>
                      <span className="font-semibold text-gray-900">
                        ₹{retailer.credit_used.toLocaleString()} / ₹{retailer.credit_limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          creditUtilization > 80 ? 'bg-red-500' : creditUtilization > 60 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${creditUtilization}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{creditUtilization.toFixed(1)}% utilized</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Credit Score</span>
                      <span className="text-2xl font-bold text-green-600">{retailer.credit_score}</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-2 rounded ${
                            i < Math.floor(retailer.credit_score / 20) ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order, index) => {
                    const statusColors: Record<string, string> = {
                      pending: 'bg-yellow-100 text-yellow-700',
                      processing: 'bg-blue-100 text-blue-700',
                      out_for_delivery: 'bg-purple-100 text-purple-700',
                      delivered: 'bg-green-100 text-green-700',
                      cancelled: 'bg-red-100 text-red-700'
                    };

                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{order.order_number}</div>
                          <div className="text-sm text-gray-600">₹{order.total_amount.toLocaleString()}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })}
                  {orders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No orders yet</div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Warehouse Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-semibold text-gray-900">{retailer.warehouse?.location}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Coverage Radius</div>
                    <div className="font-semibold text-gray-900">{retailer.warehouse?.coverage_radius_km} km</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Avg. Delivery Time</div>
                    <div className="font-semibold text-gray-900">2-4 hours</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <ProductCatalog products={products} retailer={retailer} onOrderPlaced={loadData} />
        )}

        {activeTab === 'orders' && (
          <OrderTracking orders={orders} retailer={retailer} />
        )}

        {activeTab === 'credit' && (
          <CreditManagement retailer={retailer} orders={orders} />
        )}
      </div>
    </div>
  );
}
