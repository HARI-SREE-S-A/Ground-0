interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  title?: string;
  centerText?: string;
}

export function DonutChart({ data, title, centerText }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let currentAngle = -90;
  const radius = 80;
  const innerRadius = 50;
  const centerX = 100;
  const centerY = 100;

  const slices = data.map(item => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;

    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const innerX1 = centerX + innerRadius * Math.cos(startRad);
    const innerY1 = centerY + innerRadius * Math.sin(startRad);
    const innerX2 = centerX + innerRadius * Math.cos(endRad);
    const innerY2 = centerY + innerRadius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${innerX2} ${innerY2}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerX1} ${innerY1}`,
      'Z'
    ].join(' ');

    currentAngle = endAngle;

    return { path, color: item.color, percentage: percentage.toFixed(1), label: item.label };
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <div className="flex items-center gap-8">
        <div className="relative">
          <svg viewBox="0 0 200 200" className="w-48 h-48">
            {slices.map((slice, index) => (
              <path
                key={index}
                d={slice.path}
                fill={slice.color}
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
            ))}
            {centerText && (
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-2xl font-bold fill-gray-900"
              >
                {centerText}
              </text>
            )}
          </svg>
        </div>
        <div className="flex-1 space-y-3">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
