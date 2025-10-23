import { useState } from 'react';
import { Package, ChevronDown, ChevronUp, User, MapPin } from 'lucide-react';

interface OrderManagementProps {
  orders: any[];
  warehouse: any;
  onUpdate: () => void;
}

export function OrderManagement({ orders, onUpdate }: OrderManagementProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const statuses = [
    { value: 'all', label: 'All Orders', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'processing', label: 'Processing', color: 'blue' },
    { value: 'picked', label: 'Picked', color: 'indigo' },
    { value: 'packed', label: 'Packed', color: 'purple' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: 'orange' },
    { value: 'delivered', label: 'Delivered', color: 'green' }
  ];

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(o => o.status === selectedStatus);

  const statusFlow = ['pending', 'processing', 'picked', 'packed', 'out_for_delivery', 'delivered'];

  const handleStatusChange = (newStatus: string) => {
    alert(`Order status updated to ${newStatus} (Demo mode)`);
    onUpdate();
  };

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    const color = statusObj?.color || 'gray';

    const colorMap: Record<string, string> = {
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200'
    };

    return colorMap[color];
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2 overflow-x-auto">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors border ${
                selectedStatus === status.value
                  ? getStatusColor(status.value)
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status.label}
              <span className="ml-2 font-semibold">
                ({status.value === 'all' ? orders.length : orders.filter(o => o.status === status.value).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isExpanded = expandedOrder === order.id;
          const currentStatusIndex = statusFlow.indexOf(order.status);
          const nextStatus = statusFlow[currentStatusIndex + 1];

          return (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{order.order_number}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Ordered: {new Date(order.order_date).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Retailer</div>
                      <div className="font-medium text-gray-900">{order.retailer?.shop_name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Delivery Address</div>
                      <div className="font-medium text-gray-900 text-sm">{order.retailer?.address}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Order Value</div>
                      <div className="font-medium text-gray-900">₹{order.total_amount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200 pt-4 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items?.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.product?.name}</div>
                              <div className="text-sm text-gray-600">{item.product?.category?.name}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">Qty: {item.quantity}</div>
                              <div className="text-sm text-gray-600">₹{item.unit_price} each</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {nextStatus && order.status !== 'delivered' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleStatusChange(nextStatus)}
                          className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                        >
                          Move to {nextStatus.replace('_', ' ').toUpperCase()}
                        </button>
                        {order.status === 'packed' && (
                          <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                            Assign Delivery Agent
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders</h3>
            <p className="text-gray-600">No orders match the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
