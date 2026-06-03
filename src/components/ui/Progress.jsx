export function LinearProgress({ value = 0, color = 'primary', className = '', ...props }) {
  const colors = {
    primary: 'bg-primary-main',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`} {...props}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${colors[color]}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function CircularProgress({ value = 0, size = 40, thickness = 4, color = 'primary', className = '' }) {
  const colors = {
    primary: '#0D7CAD',
    success: '#2E7D32',
    warning: '#ED6C02',
    error: '#D32F2F',
    white: '#FFFFFF',
  };

  const numericSize = parseInt(size, 10) || 40;
  const numericThickness = parseInt(thickness, 10) || 4;
  const radius = (numericSize - numericThickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: numericSize, height: numericSize }}>
      <svg className="transform -rotate-90" width={numericSize} height={numericSize}>
        <circle
          cx={numericSize / 2}
          cy={numericSize / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={numericThickness}
        />
        <circle
          cx={numericSize / 2}
          cy={numericSize / 2}
          r={radius}
          fill="none"
          stroke={colors[color]}
          strokeWidth={numericThickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300"
        />
      </svg>
      <span className="absolute text-sm font-semibold text-text-primary">
        {Math.round(value)}%
      </span>
    </div>
  );
}