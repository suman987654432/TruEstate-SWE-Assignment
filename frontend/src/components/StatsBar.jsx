import React from 'react';
import { HiOutlineInformationCircle } from 'react-icons/hi';
const StatsBar = ({ stats }) => {
  const formatCurrency = (amount) => `₹${amount?.toLocaleString('en-IN') || 0}`;
  
  const statCards = [
    {
    
      label: 'Total units sold',
      value: stats?.overall?.totalQuantity?.toLocaleString() || '0',
      detail: `${stats?.overall?.totalSales?.toLocaleString() || 0} SRs`,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    {
    
      label: 'Total Amount',
      value: formatCurrency(stats?.overall?.totalRevenue),
      detail: `${stats?.overall?.totalSales?.toLocaleString() || 0} SRs`,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
     
      label: 'Total Discount',
      value: formatCurrency(stats?.overall?.totalRevenue * 0.1),
      detail: `${stats?.overall?.totalSales?.toLocaleString() || 0} SRs`,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.bgColor} border ${stat.borderColor} rounded-lg p-4 shadow-sm `}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-600">{stat.label}</span>
                  <HiOutlineInformationCircle 
                    className="text-gray-400 text-sm cursor-help flex-shrink-0" 
                    title={stat.detail} 
                  />
                </div>
                <div className="mb-1">
                  <span className="text-2xl font-bold text-gray-900 block">
                    {stat.value}
                  </span>
                </div>
                <span className="text-xs text-gray-500">({stat.detail})</span>
              </div>
            
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
