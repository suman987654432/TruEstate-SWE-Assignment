import React from 'react';
import { BiCopy } from 'react-icons/bi';
import { HiOutlineArrowsUpDown, HiChevronUp, HiChevronDown } from 'react-icons/hi2';

const SalesTable = ({ data, sortConfig, onSort }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <HiOutlineArrowsUpDown className="text-base text-gray-400" />;
    return sortConfig.direction === 'asc' 
      ? <HiChevronUp className="text-base text-blue-600" /> 
      : <HiChevronDown className="text-base text-blue-600" />;
  };

  const columns = [
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'operational.date', label: 'Date' },
    { key: 'customer.id', label: 'Customer ID' },
    { key: 'customer.name', label: 'Customer Name' },
    { key: 'customer.phone', label: 'Phone Number' },
    { key: 'customer.gender', label: 'Gender' },
    { key: 'customer.age', label: 'Age' },
    { key: 'customer.region', label: 'Region' },
    { key: 'product.id', label: 'Product ID' },
    { key: 'product.name', label: 'Product Name' },
    { key: 'product.category', label: 'Category' },
    { key: 'sales.quantity', label: 'Qty' },
    { key: 'sales.finalAmount', label: 'Amount' },
    { key: 'operational.paymentMethod', label: 'Payment' },
    { key: 'operational.orderStatus', label: 'Status' },
    { key: 'operational.employeeName', label: 'Employee' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left">
                  <div
                    className={`flex items-center gap-1.5 cursor-pointer select-none group ${
                      col.key === 'transactionId' ? 'justify-center' : ''
                    }`}
                    onClick={() => onSort(col.key)}
                  >
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide group-hover:text-blue-600 transition-colors whitespace-nowrap">
                      {col.label}
                    </span>
                    <span className="flex-shrink-0">
                      {getSortIcon(col.key)}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => (
              <tr key={item._id || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-900 font-medium whitespace-nowrap text-center">{item.transactionId}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                  {new Date(item.operational?.date).toLocaleDateString('en-IN', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.customer?.id}</td>
                <td className="px-4 py-2.5 text-sm text-gray-900 font-medium whitespace-nowrap">{item.customer?.name}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                  <div className="flex items-center gap-2 group">
                    <span>{item.customer?.phone}</span>
                    <button 
                      onClick={() => copyToClipboard(item.customer?.phone)} 
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all"
                      title="Copy phone number"
                    >
                      <BiCopy className="text-sm" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.customer?.gender}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap text-center">{item.customer?.age}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.customer?.region}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.product?.id}</td>
                <td className="px-4 py-2.5 text-sm text-gray-900 whitespace-nowrap">{item.product?.name}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    {item.product?.category}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-900 font-semibold whitespace-nowrap text-center">
                  {item.sales?.quantity?.toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-900 font-semibold whitespace-nowrap">
                  ₹{item.sales?.finalAmount?.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.operational?.paymentMethod}</td>
                <td className="px-4 py-2.5 text-sm whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.operational?.orderStatus === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : item.operational?.orderStatus === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.operational?.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.operational?.employeeName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;
