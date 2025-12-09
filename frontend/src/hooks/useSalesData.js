import { useState, useEffect } from 'react';

export const useSalesData = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0
  });

  const fetchSales = async (page = 1, limit = 100) => {
    try {
      setLoading(true);
      setError(null);
      
      const [salesResponse, statsResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/sales?page=${page}&limit=${limit}&sortOrder=ASC`),
        fetch('http://localhost:5000/api/sales/stats')
      ]);
      
      if (!salesResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const salesData = await salesResponse.json();
      const statsData = await statsResponse.json();
      
      console.log(' Sales Data:', salesData);
      console.log(' Stats Data:', statsData);
      
      if (salesData.success) {
        setSales(salesData.data);
        setPagination({
          page: salesData.page,
          limit: salesData.limit,
          total: salesData.total,
          totalPages: salesData.totalPages
        });
      }
      
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(1, 100);
  }, []);

  return { 
    sales, 
    loading, 
    error, 
    stats, 
    pagination,
    refetch: fetchSales 
  };
};
