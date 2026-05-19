import { X } from 'lucide-react';

export function Chip({
  children,
  label,
  variant = 'default',
  size = 'md',
  onDelete,
  className = '',
  ...props
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-main/10 text-primary-main',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    outlined: 'border border-gray-300 bg-transparent text-gray-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const content = label || children;

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-md
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {content}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="ml-1 hover:bg-black/10 rounded p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

export default Chip;