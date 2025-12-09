import React, { useState, useMemo } from 'react';
import { useSalesData } from '../hooks/useSalesData';
import Sidebar from '../components/Sidebar';
import StatsBar from '../components/StatsBar';
import FilterBar from '../components/FilterBar';
import SalesTable from '../components/SalesTable';
import Pagination from '../components/Pagination';
import { FiMenu, FiX } from 'react-icons/fi';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [sortDropdown, setSortDropdown] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { sales, loading, error, stats, pagination, refetch } = useSalesData();
  const filteredData = useMemo(() => {
    let filtered = [...sales];
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.customer?.name?.toLowerCase().includes(searchLower) ||
        item.customer?.phone?.toLowerCase().includes(searchLower) ||
        item.customer?.id?.toLowerCase().includes(searchLower) ||
        item.product?.name?.toLowerCase().includes(searchLower) ||
        item.operational?.employeeName?.toLowerCase().includes(searchLower)
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(item => {
          if (key === 'product.tags') {
            const tags = item?.product?.tags || [];
            return tags.includes(value);
          }
          if (key === 'operational.date') {
            const itemDate = new Date(item?.operational?.date);
            const filterYearMonth = value;
            const itemYearMonth = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`;
            return itemYearMonth === filterYearMonth;
          }


          const keys = key.split('.');
          let itemValue = item;
          for (const k of keys) {
            itemValue = itemValue?.[k];
          }
          return itemValue === value;
        });
      }
    });

    return filtered;
  }, [sales, searchQuery, filters]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const keys = sortConfig.key.split('.');
      let aVal = a;
      let bVal = b;

      for (const key of keys) {
        aVal = aVal?.[key];
        bVal = bVal?.[key];
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (newPage) => {
    refetch(newPage, pagination.limit);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    refetch(1, newSize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilters({});
    setSortDropdown('');
    setSortConfig({ key: null, direction: 'asc' });
  };

  const handleSortDropdownChange = (value) => {
    setSortDropdown(value);
    if (value) {
      const [key, direction] = value.split('-');
      setSortConfig({ key, direction });
    } else {
      setSortConfig({ key: null, direction: 'asc' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading sales data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-red-600 font-semibold">Error loading data</p>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      <div className={`fixed lg:static inset-y-0 left-0 z-30 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 overflow-auto w-full">
        <div className="p-3 sm:p-4 md:p-6">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiMenu className="text-xl text-gray-700" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Sales Management System</h1>
            </div>

            <input
              type="text"
              placeholder="Name, Phone no."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm w-full sm:w-64"
            />
          </div>

          <StatsBar stats={stats} />

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            onSortChange={handleSortDropdownChange}
            sortValue={sortDropdown}
            data={sales}
          />

          <SalesTable
            data={sortedData}
            sortConfig={sortConfig}
            onSort={handleSort}
          />

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalRecords={pagination.total}
            pageSize={pagination.limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;