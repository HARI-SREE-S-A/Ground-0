interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: string;
  title?: string;
}

export function BarChart({ data, height = '300px', title }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <div className="relative" style={{ height }}>
        <div className="flex items-end justify-between h-full gap-4">
          {data.map((item, index) => {
            const heightPercent = (item.value / maxValue) * 100;
            const color = item.color || '#3b82f6';

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex items-end justify-center" style={{ height: '85%' }}>
                  <div
                    className="w-full rounded-t transition-all duration-300 hover:opacity-80 relative group"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: color,
                      minHeight: '4px'
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600 text-center font-medium">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
