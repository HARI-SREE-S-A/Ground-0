interface Location {
  lat: number;
  lng: number;
  label: string;
  type?: 'warehouse' | 'retailer' | 'delivery';
}

interface SimpleMapProps {
  center: { lat: number; lng: number };
  locations: Location[];
  height?: string;
}

export function SimpleMap({ locations, height = '400px' }: SimpleMapProps) {
  const getMarkerColor = (type?: string) => {
    switch (type) {
      case 'warehouse':
        return '#3b82f6';
      case 'retailer':
        return '#10b981';
      case 'delivery':
        return '#f97316';
      default:
        return '#6366f1';
    }
  };

  return (
    <div
      className="relative bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200"
      style={{ height }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full relative bg-gradient-to-br from-blue-50 to-teal-50">
          <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded shadow text-sm font-medium text-gray-700">
            Kerala Distribution Network
          </div>

          <svg className="w-full h-full">
            {locations.map((location, index) => {
              const x = ((location.lng - 75) / 2) * 100;
              const y = ((11.5 - location.lat) / 3.5) * 100;

              return (
                <g key={index}>
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="8"
                    fill={getMarkerColor(location.type)}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={`${x}%`}
                    y={`${y}%`}
                    dy="25"
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700"
                  >
                    {location.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded shadow text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-700">Warehouse</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-700">Retailer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-gray-700">In Transit</span>
        </div>
      </div>
    </div>
  );
}
