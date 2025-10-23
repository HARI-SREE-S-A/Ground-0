import { SimpleMap } from '../ui/SimpleMap';
import { Truck, MapPin, Clock, Package } from 'lucide-react';

interface DeliveryMapProps {
  warehouse: any;
  orders: any[];
  retailers: any[];
}

export function DeliveryMap({ warehouse, orders, retailers }: DeliveryMapProps) {
  const activeDeliveries = orders.filter(o => o.status === 'out_for_delivery');
  const pendingOrders = orders.filter(o => o.status === 'packed' || o.status === 'picked');

  const mapLocations = [
    {
      lat: Number(warehouse.latitude),
      lng: Number(warehouse.longitude),
      label: warehouse.name,
      type: 'warehouse' as const
    },
    ...retailers.map(retailer => ({
      lat: Number(retailer.latitude),
      lng: Number(retailer.longitude),
      label: retailer.shop_name,
      type: 'retailer' as const
    }))
  ];

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getDeliveryInfo = (order: any) => {
    const retailer = retailers.find(r => r.id === order.retailer_id);
    if (!retailer) return null;

    const distance = calculateDistance(
      Number(warehouse.latitude),
      Number(warehouse.longitude),
      Number(retailer.latitude),
      Number(retailer.longitude)
    );

    const estimatedTime = Math.ceil((distance / 30) * 60);

    return { retailer, distance: distance.toFixed(1), estimatedTime };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Area Map</h3>
        <SimpleMap
          center={{
            lat: Number(warehouse.latitude),
            lng: Number(warehouse.longitude)
          }}
          locations={mapLocations}
          height="500px"
        />
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{retailers.length}</div>
            <div className="text-sm text-gray-600">Served Retailers</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{activeDeliveries.length}</div>
            <div className="text-sm text-gray-600">Active Deliveries</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{warehouse.coverage_radius_km}km</div>
            <div className="text-sm text-gray-600">Coverage Radius</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Active Deliveries</h3>
          </div>

          {activeDeliveries.length > 0 ? (
            <div className="space-y-3">
              {activeDeliveries.map((order, index) => {
                const info = getDeliveryInfo(order);
                if (!info) return null;

                return (
                  <div key={index} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-gray-900">{order.order_number}</div>
                      <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-xs font-medium">
                        In Transit
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{info.retailer.shop_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span>{order.items?.length || 0} items | ₹{order.total_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-orange-200">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>ETA: {info.estimatedTime} min</span>
                        </div>
                        <span className="text-gray-600">{info.distance} km</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Truck className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>No active deliveries</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Ready for Dispatch</h3>
          </div>

          {pendingOrders.length > 0 ? (
            <div className="space-y-3">
              {pendingOrders.map((order, index) => {
                const info = getDeliveryInfo(order);
                if (!info) return null;

                return (
                  <div key={index} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-gray-900">{order.order_number}</div>
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{info.retailer.shop_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span>{order.items?.length || 0} items | ₹{order.total_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                        <span className="text-gray-600">{info.distance} km away</span>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">
                          Assign Agent
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>No orders ready for dispatch</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Optimization</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Avg. Delivery Distance</div>
            <div className="text-2xl font-bold text-blue-600">12.5 km</div>
            <div className="text-xs text-gray-500 mt-1">Optimized routes</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Avg. Delivery Time</div>
            <div className="text-2xl font-bold text-green-600">32 min</div>
            <div className="text-xs text-gray-500 mt-1">Including traffic</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="text-sm text-gray-600 mb-1">Deliveries per Route</div>
            <div className="text-2xl font-bold text-orange-600">3.2</div>
            <div className="text-xs text-gray-500 mt-1">Multi-drop efficiency</div>
          </div>
        </div>
      </div>
    </div>
  );
}
