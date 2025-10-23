import { useState } from 'react';
import { Package, Search, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface InventoryManagementProps {
  inventory: any[];
  warehouse: any;
}

export function InventoryManagement({ inventory }: InventoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'good'>('all');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product?.name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filterStatus === 'low') {
      matchesFilter = item.quantity < item.low_stock_threshold;
    } else if (filterStatus === 'good') {
      matchesFilter = item.quantity >= item.low_stock_threshold * 2;
    }

    return matchesSearch && matchesFilter;
  });

  const totalItems = inventory.length;
  const lowStockCount = inventory.filter(item => item.quantity < item.low_stock_threshold).length;
  const totalValue = inventory.reduce((sum, item) => {
    return sum + (item.quantity * (item.product?.price || 0));
  }, 0);

  const getStockStatus = (item: any) => {
    if (item.quantity < item.low_stock_threshold) {
      return { status: 'Low Stock', color: 'text-red-600 bg-red-50 border-red-200', icon: AlertTriangle };
    } else if (item.quantity < item.low_stock_threshold * 2) {
      return { status: 'Medium', color: 'text-orange-600 bg-orange-50 border-orange-200', icon: TrendingDown };
    } else {
      return { status: 'Good Stock', color: 'text-green-600 bg-green-50 border-green-200', icon: TrendingUp };
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-6 h-6" />
            <span className="text-sm opacity-90">Total Products</span>
          </div>
          <div className="text-3xl font-bold">{totalItems}</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6" />
            <span className="text-sm opacity-90">Low Stock Items</span>
          </div>
          <div className="text-3xl font-bold">{lowStockCount}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6" />
            <span className="text-sm opacity-90">Inventory Value</span>
          </div>
          <div className="text-3xl font-bold">₹{(totalValue / 100000).toFixed(1)}L</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Stock
            </button>
            <button
              onClick={() => setFilterStatus('low')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'low'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setFilterStatus('good')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'good'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Good Stock
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Current Stock</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Threshold</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Unit Price</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, index) => {
                const stockStatus = getStockStatus(item);
                const StatusIcon = stockStatus.icon;

                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{item.product?.name}</div>
                      <div className="text-sm text-gray-600">{item.product?.description}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.product?.category?.name}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="font-semibold text-gray-900">{item.quantity}</div>
                      <div className="text-xs text-gray-500">units</div>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-gray-700">
                      {item.low_stock_threshold}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      ₹{item.product?.price}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1 ${stockStatus.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {stockStatus.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No products match your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
