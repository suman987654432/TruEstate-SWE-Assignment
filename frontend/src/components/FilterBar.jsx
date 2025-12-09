import React, { useMemo, useState } from 'react';
import { FiRotateCw, FiFilter, FiX } from 'react-icons/fi';

const FilterBar = ({
  filters = {},
  onFilterChange,
  onReset,
  onSortChange,
  sortValue = '',
  data = []
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = useMemo(() => {
    const getUniqueValues = (accessor) => {
      const values = new Set();
      data.forEach(item => {
        const keys = accessor.split('.');
        let value = item;
        for (const key of keys) {
          value = value?.[key];
        }
        if (value && value !== '') values.add(value);
      });
      return Array.from(values).sort();
    };

    const getUniqueTags = () => {
      const tags = new Set();
      data.forEach(item => {
        const itemTags = item?.product?.tags || [];
        itemTags.forEach(tag => {
          if (tag) tags.add(tag);
        });
      });
      return Array.from(tags).sort();
    };

    const getUniqueDates = () => {
      const dates = new Set();
      data.forEach(item => {
        const date = item?.operational?.date;
        if (date) {
          const d = new Date(date);
          const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          dates.add(yearMonth);
        }
      });
      return Array.from(dates).sort().reverse();
    };

    return {
      'customer.region': getUniqueValues('customer.region'),
      'customer.gender': getUniqueValues('customer.gender'),
      'product.category': getUniqueValues('product.category'),
      'operational.paymentMethod': getUniqueValues('operational.paymentMethod'),
      'product.tags': getUniqueTags(),
      'operational.date': getUniqueDates()
    };
  }, [data]);

  const filterConfig = [
    { key: 'customer.region', label: 'Customer Region' },
    { key: 'customer.gender', label: 'Gender' },
    { key: 'customer.age', label: 'Age Range' },
    { key: 'product.category', label: 'Product Category' },
    { key: 'product.tags', label: 'Tags' },
    { key: 'operational.paymentMethod', label: 'Payment Method' },
    { key: 'operational.date', label: 'Date' }
  ];

  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  return (
    <div className="mb-4">

      <div className="flex items-center gap-2 lg:hidden mb-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <FiFilter className="text-gray-600 text-base" />
          <span className="text-sm font-medium text-gray-700">
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </span>
        </button>

        <button
          onClick={onReset}
          className="p-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          title="Reset Filters"
        >
          <FiRotateCw className="text-gray-600 text-base" />
        </button>
      </div>

      <div className="lg:hidden mb-3">
        <select
          value={sortValue}
          onChange={(e) => onSortChange && onSortChange(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm cursor-pointer"
        >
          <option value="">Sort by: Customer Name (A-Z)</option>
          <option value="customer.name-asc">Customer Name (A-Z)</option>
          <option value="customer.name-desc">Customer Name (Z-A)</option>
          <option value="operational.date-asc">Date (Oldest First)</option>
          <option value="operational.date-desc">Date (Newest First)</option>
          <option value="sales.finalAmount-asc">Amount (Low to High)</option>
          <option value="sales.finalAmount-desc">Amount (High to Low)</option>
        </select>
      </div>

      {showFilters && (
        <div className="lg:hidden mb-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Filter Options</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <FiX className="text-gray-600 text-lg" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filterConfig.map(({ key, label }) => (
              <select
                key={key}
                value={filters[key] || ''}
                onChange={(e) => onFilterChange(key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm cursor-pointer"
              >
                <option value="">{label}</option>
                {filterOptions[key]?.map(option => (
                  <option key={option} value={option}>
                    {key === 'operational.date' ? new Date(option + '-01').toLocaleDateString('en-IN', { year: 'numeric', month: 'short' }) : option}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      )}


      <div className="hidden lg:flex items-center gap-2 flex-wrap">
        <button
          onClick={onReset}
          className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
          title="Reset Filters"
        >
          <FiRotateCw className="text-gray-600 text-base" />
        </button>

        {filterConfig.map(({ key, label }) => (
          <select
            key={key}
            value={filters[key] || ''}
            onChange={(e) => onFilterChange(key, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-xs hover:border-gray-400 transition-colors cursor-pointer"
            style={{ minWidth: 'auto', maxWidth: '140px' }}
          >
            <option value="">{label}</option>
            {filterOptions[key]?.map(option => (
              <option key={option} value={option}>
                {key === 'operational.date' ? new Date(option + '-01').toLocaleDateString('en-IN', { year: 'numeric', month: 'short' }) : option}
              </option>
            ))}
          </select>
        ))}

        <div className="ml-auto flex-shrink-0">
          <select
            value={sortValue}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-xs cursor-pointer w-56"
          >
            <option value="">Sort by: Customer Name (A-Z)</option>
            <option value="customer.name-asc">Customer Name (A-Z)</option>
            <option value="customer.name-desc">Customer Name (Z-A)</option>
            <option value="operational.date-asc">Date (Oldest First)</option>
            <option value="operational.date-desc">Date (Newest First)</option>
            <option value="sales.finalAmount-asc">Amount (Low to High)</option>
            <option value="sales.finalAmount-desc">Amount (High to Low)</option>
          </select>
        </div>
      </div>


      {activeFiltersCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            const config = filterConfig.find(f => f.key === key);
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
              >
                <span>{config?.label}: {key === 'operational.date' ? new Date(value + '-01').toLocaleDateString('en-IN', { year: 'numeric', month: 'short' }) : value}</span>
                <button
                  onClick={() => onFilterChange(key, '')}
                  className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                >
                  <FiX className="text-xs" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
