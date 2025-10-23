import { Building2, Store, Warehouse, Zap } from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: 'company' | 'retailer' | 'warehouse') => void;
}

export function LandingPage({ onSelectRole }: LandingPageProps) {
  const roles = [
    {
      id: 'company' as const,
      title: 'Company Dashboard',
      description: 'Comprehensive inventory management, demand analytics, and production planning across all hubs',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      features: ['Real-time Inventory', 'Demand Forecasting', 'Production Planning', 'Performance Analytics']
    },
    {
      id: 'retailer' as const,
      title: 'Retailer Dashboard',
      description: 'Browse products, place orders, track deliveries, and manage credit payments',
      icon: Store,
      color: 'from-green-500 to-green-600',
      features: ['Product Catalog', 'Order Tracking', 'Credit Management', 'Sales Analytics']
    },
    {
      id: 'warehouse' as const,
      title: 'Warehouse Dashboard',
      description: 'Manage orders, optimize delivery routes, track inventory, and coordinate operations',
      icon: Warehouse,
      color: 'from-orange-500 to-orange-600',
      features: ['Order Management', 'Route Optimization', 'Inventory Control', 'Delivery Tracking']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-3 rounded-xl">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              LightHub Pro
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hyperlocal LED Distribution Platform for Kerala
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Just-in-Time LED lighting distribution with real-time tracking and smart analytics
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-left"
            >
              <div className={`absolute top-0 left-0 right-0 h-2 rounded-t-2xl bg-gradient-to-r ${role.color}`}></div>

              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${role.color} mb-6`}>
                <role.icon className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {role.title}
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {role.description}
              </p>

              <div className="space-y-2">
                {role.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.color}`}></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className={`text-sm font-semibold bg-gradient-to-r ${role.color} bg-clip-text text-transparent`}>
                  Enter Dashboard
                </span>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transform group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-white px-8 py-4 rounded-xl shadow">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">5</div>
              <div className="text-xs text-gray-600">Warehouses</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">50+</div>
              <div className="text-xs text-gray-600">Retailers</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">25+</div>
              <div className="text-xs text-gray-600">Products</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">50km</div>
              <div className="text-xs text-gray-600">Max Radius</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
