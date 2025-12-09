import React from 'react';
import { MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

const Pagination = ({ currentPage, totalPages, totalRecords, pageSize, onPageChange, onPageSizeChange }) => {
  const pageOptions = [50, 100, 200, 500, 1000];

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
      <div className="flex items-center justify-between flex-wrap gap-4">

        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
          <span className="font-semibold text-gray-900">{Math.min(currentPage * pageSize, totalRecords)}</span> of{' '}
          <span className="font-semibold text-gray-900">{totalRecords.toLocaleString()}</span> records
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="First Page"
          >
            <MdFirstPage className="text-lg text-gray-600" />
          </button>

          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Previous Page"
          >
            <MdNavigateBefore className="text-lg text-gray-600" />
          </button>
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400 text-sm">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`min-w-[36px] px-3 py-1.5 rounded-md text-sm font-medium transition-all ${currentPage === page
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Next Page"
          >
            <MdNavigateNext className="text-lg text-gray-600" />
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Last Page"
          >
            <MdLastPage className="text-lg text-gray-600" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Show:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer text-sm font-medium"
          >
            {pageOptions.map(size => (
              <option key={size} value={size}>
                {size} rows
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
