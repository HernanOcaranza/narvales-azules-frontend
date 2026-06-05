import { Search } from 'lucide-react';

export function Input({
  className = '',
  error,
  icon: Icon,
  iconPosition = 'left',
  label,
  helperText,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          className={`
            w-full px-3 py-2 rounded-lg border border-gray-300
            focus:border-primary-main focus:ring-2 focus:ring-primary-light/30
            outline-none transition-all
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}
            ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      {helperText && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-text-secondary'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}

export function SearchInput({ className = '', ...props }) {
  return (
    <Input
      icon={Search}
      iconPosition="left"
      className={className}
      {...props}
    />
  );
}

export default Input;