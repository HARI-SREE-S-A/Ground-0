import { Package, Truck, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { SimpleMap } from '../ui/SimpleMap';

interface OrderTrackingProps {
  orders: any[];
  retailer: any;
}

export function OrderTracking({ orders, retailer }: OrderTrackingProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      case 'out_for_delivery':
        return Truck;
      default:
        return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'picked':
      case 'packed':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const statusSteps = ['pending', 'processing', 'picked', 'packed', 'out_for_delivery', 'delivered'];

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const StatusIcon = getStatusIcon(order.status);
        const currentStepIndex = statusSteps.indexOf(order.status);

        return (
          <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{order.order_number}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Ordered on {new Date(order.order_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full border ${getStatusColor(order.status)} font-semibold flex items-center gap-2`}>
                  <StatusIcon className="w-4 h-4" />
                  {order.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                {statusSteps.filter(s => s !== 'cancelled').map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step} className="flex-1 flex items-center">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            isCompleted
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-semibold">{index + 1}</span>
                          )}
                        </div>
                        <div className="text-xs mt-2 text-center font-medium text-gray-600">
                          {step.replace('_', ' ')}
                        </div>
                      </div>
                      {index < statusSteps.length - 2 && (
                        <div
                          className={`flex-1 h-0.5 ${
                            index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Warehouse</div>
                      <div className="font-semibold text-gray-900">{order.warehouse?.name}</div>
                      <div className="text-sm text-gray-600">{order.warehouse?.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Expected Delivery</div>
                      <div className="font-semibold text-gray-900">
                        {order.expected_delivery
                          ? new Date(order.expected_delivery).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '2-4 hours'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                      <div className="font-semibold text-gray-900">₹{order.total_amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{order.payment_method.toUpperCase()}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <SimpleMap
                    center={{
                      lat: Number(retailer.warehouse?.latitude) || 10.0,
                      lng: Number(retailer.warehouse?.longitude) || 76.5
                    }}
                    locations={[
                      {
                        lat: Number(order.warehouse?.latitude),
                        lng: Number(order.warehouse?.longitude),
                        label: 'Warehouse',
                        type: 'warehouse'
                      },
                      {
                        lat: Number(retailer.latitude),
                        lng: Number(retailer.longitude),
                        label: 'Your Store',
                        type: 'retailer'
                      }
                    ]}
                    height="250px"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-2">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.product?.name}</div>
                        <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">₹{item.subtotal.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">₹{item.unit_price} each</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {orders.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-600">Your order history will appear here</p>
        </div>
      )}
    </div>
  );
}
