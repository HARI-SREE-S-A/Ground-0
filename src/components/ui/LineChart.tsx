interface LineChartProps {
  data: { label: string; value: number }[];
  height?: string;
  title?: string;
  color?: string;
}

export function LineChart({ data, height = '300px', title, color = '#3b82f6' }: LineChartProps) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 80;
    return { x, y, value: item.value };
  });

  const pathD = points.map((point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${command} ${point.x} ${point.y}`;
  }).join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x} 100 L 0 100 Z`;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <div className="relative" style={{ height }}>
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={areaD}
            fill="url(#lineGradient)"
          />

          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />

          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="1"
                fill="white"
                stroke={color}
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
                className="hover:r-2 transition-all"
              />
            </g>
          ))}
        </svg>

        <div className="flex justify-between mt-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="text-xs text-gray-600 text-center"
              style={{ width: `${100 / data.length}%` }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
