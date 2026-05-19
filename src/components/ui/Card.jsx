export function Card({ children, className = '', hover = false, onClick, ...props }) {
  return (
    <div
      className={`
        bg-white/90 backdrop-blur-sm rounded-card shadow-md p-4
        ${hover ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;