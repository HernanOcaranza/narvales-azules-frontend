export function TextArea({
  className = '',
  error,
  label,
  helperText,
  rows = 3,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`
          w-full px-3 py-2 rounded-lg border border-gray-300
          focus:border-primary-main focus:ring-2 focus:ring-primary-light/30
          outline-none transition-all resize-y min-h-[80px]
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}
          ${className}
        `}
        {...props}
      />
      {helperText && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-text-secondary'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}

export default TextArea;