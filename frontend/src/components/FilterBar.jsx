import React, { useMemo } from 'react';
import { FiRotateCw } from 'react-icons/fi';

const FilterBar = ({
  filters = {},
  onFilterChange,
  onReset,
  onSortChange,
  sortValue = '',
  data = []
}) => {
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

  return (
    <div className="mb-4">

      <div className="flex items-center gap-2">

        <button
          onClick={onReset}
          className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
          title="Refresh"
        >
          <FiRotateCw className="text-gray-600 text-base" />
        </button>


        {filterConfig.map(({ key, label }) => (
          <select
            key={key}
            value={filters[key] || ''}
            onChange={(e) => onFilterChange(key, e.target.value)}
            className="px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-xs hover:border-gray-400 transition-colors cursor-pointer"
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
            className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-xs cursor-pointer w-56"
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
    </div>
  );
};

export default FilterBar;
