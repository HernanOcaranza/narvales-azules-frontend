export function Table({ children, className = '', ...props }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white/90 backdrop-blur-sm">
      <table className={`w-full ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = '', ...props }) {
  return (
    <thead className={`bg-primary-main text-white ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '', ...props }) {
  return <tbody className={className} {...props}>{children}</tbody>;
}

export function TableRow({ children, className = '', hover = true, onClick, ...props }) {
  return (
    <tr
      className={`
        ${hover ? 'hover:bg-primary-main/5 transition-colors' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        border-b border-gray-100
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHeadCell({ children, className = '', ...props }) {
  return (
    <th
      className={`
        px-4 py-3 text-left text-sm font-semibold
        text-white bg-primary-main
        ${className}
      `}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = '', ...props }) {
  return (
    <td className={`px-4 py-3 text-sm text-text-primary ${className}`} {...props}>
      {children}
    </td>
  );
}