import React, { useState, useEffect } from 'react';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

const Pagination = ({ pagination, onPageChange, onLimitChange }) => {
  const isMobile = useMediaQuery('(max-width: 639px)');
  if (!pagination || pagination.totalPages <= 1) return null;

  const handlePageChange = (event, newPage) => {
    if (onPageChange) onPageChange(newPage);
  };

  const handleLimitChange = (event) => {
    if (onLimitChange) onLimitChange(event.target.value);
  };

  const renderPageButtons = () => {
    const buttons = [];
    const { page, totalPages } = pagination;
    const maxButtons = isMobile ? 3 : 5;
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded text-sm ${
            page === i
              ? 'bg-primary-main text-white'
              : 'bg-gray-100 text-text-primary hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3 p-3 border-t border-gray-200">
      <div className="text-sm text-text-secondary">
        Total: {pagination.total} registros
      </div>
      <div className="flex items-center gap-3">
        <select
          value={pagination.limit}
          onChange={handleLimitChange}
          className="px-2 py-1 rounded border border-gray-300 text-sm focus:border-primary-main focus:outline-none"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={pagination.page === 1}
            className="px-2 py-1 rounded text-sm bg-gray-100 text-text-secondary hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ««
          </button>
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-2 py-1 rounded text-sm bg-gray-100 text-text-secondary hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            «
          </button>
          {renderPageButtons()}
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-2 py-1 rounded text-sm bg-gray-100 text-text-secondary hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            »
          </button>
          <button
            onClick={() => onPageChange(pagination.totalPages)}
            disabled={pagination.page === pagination.totalPages}
            className="px-2 py-1 rounded text-sm bg-gray-100 text-text-secondary hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            »»
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;