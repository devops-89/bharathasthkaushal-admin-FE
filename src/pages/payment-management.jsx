import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Filter, Download, Eye, MoreHorizontal, Calendar, CreditCard, User, Package } from 'lucide-react';
const PaymentManagement = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const paymentData = [   
    {
      id: 'PAY001',
      customerName: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      product: 'Banarasi Silk Saree',
      category: 'Handloom',
      amount: 4500.00,
      date: '15 Aug 2025',
      status: 'Completed',
      paymentMethod: 'UPI',
      orderId: 'ORD001',
      phone: '+91 98765 43210'
    },
    {
      id: 'PAY002',
      customerName: 'Rajesh Kumar',
      email: 'rajesh.k@email.com',
      product: 'Wooden Handicraft Set',
    
      category: 'Handicraft',
      amount: 2300.00,
      date: '14 Aug 2025',
      status: 'Failed',
      paymentMethod: 'Credit Card',
      orderId: 'ORD002',
      phone: '+91 87654 32109'
    },
    {
      id: 'PAY003',
      customerName: 'Meera Patel',
      email: 'meera.patel@email.com',
      product: 'Khadi Cotton Kurta',
      category: 'Handloom',
      amount: 1800.00,
      date: '13 Aug 2025',
      status: 'Processing',
      paymentMethod: 'Net Banking',
      orderId: 'ORD003',
      phone: '+91 76543 21098'
    },
    {
      id: 'PAY004',
      customerName: 'Arjun Singh',
      email: 'arjun.singh@email.com',
      product: 'Brass Decorative Items',
      category: 'Handicraft',
      amount: 3200.00,
      date: '12 Aug 2025',
      status: 'Completed',
      paymentMethod: 'UPI',
      orderId: 'ORD004',
      phone: '+91 65432 10987'
    },
    {
      id: 'PAY005',
      customerName: 'Lakshmi Nair',
      email: 'lakshmi.nair@email.com',
      product: 'Kerala Kasavu Saree',
      category: 'Handloom',
      amount: 5500.00,
      date: '11 Aug 2025',
      status: 'Completed',
      paymentMethod: 'Debit Card',
      orderId: 'ORD005',
      phone: '+91 54321 09876'
    },
    {
      id: 'PAY006',
      customerName: 'Vikram Gupta',
      email: 'vikram.gupta@email.com',
      product: 'Terracotta Pottery Set',
      category: 'Handicraft',
      amount: 1500.00,
      date: '10 Aug 2025',
      status: 'Refunded',
      paymentMethod: 'UPI',
      orderId: 'ORD006',
      phone: '+91 43210 98765'
    }
  ];

  // Calculate statistics
  const totalPayments = paymentData.reduce((sum, payment) => sum + payment.amount, 0);
  const successfulPayments = paymentData.filter(p => p.status === 'Completed').length;
  const failedPayments = paymentData.filter(p => p.status === 'Failed').length;
  const processingPayments = paymentData.filter(p => p.status === 'Processing').length;

  const filteredPayments = paymentData.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'All') return matchesSearch;
    return matchesSearch && payment.status === selectedFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    return category === 'Handloom' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">Payment Management</h1>
            
                      {/* <p className="text-gray-600">Dashboard • Auctions</p> */}
                                    <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
                                      <NavLink
                          to="/dashboard"
                          className={({ isActive }) => isActive ? "text-orange-600 font-semibold" : ""}
                        >
                          Dashboard
                        </NavLink>
                                      
                                      <span>•</span>
                                       <NavLink
                          to="/payment-management"
                          className={({ isActive }) => isActive ? "text-orange-600 font-semibold" : ""}
                        >
                          Payment Management 
                        </NavLink>
                                    </nav>
                      
          </div>
          <button className="bg-orange-500 to oranage-700 text-white px-4 py-2 rounded-lg hover: transition-colors flex items-center gap-2 ">
            <CreditCard size={20} />
            Create Payment
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Payments</p>
                <p className="text-2xl font-bold text-blue-900">₹{totalPayments.toLocaleString()}</p>
                <p className="text-blue-700 text-sm mt-1">+30.20% from last month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <CreditCard className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Successful Payments</p>
                <p className="text-2xl font-bold text-green-900">{successfulPayments}</p>
                <p className="text-green-700 text-sm mt-1">+21 from yesterday</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Package className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Failed Payments</p>
                <p className="text-2xl font-bold text-red-900">{failedPayments}</p>
                <p className="text-red-700 text-sm mt-1">-2 from yesterday</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <User className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Processing</p>
                <p className="text-2xl font-bold text-yellow-900">{processingPayments}</p>
                <p className="text-yellow-700 text-sm mt-1">Pending approval</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Calendar className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by customer, product, email..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
                <option value="Processing">Processing</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Filter size={16} />
                Filter
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Recent Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Payments</h2>
              <select
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="customer">Sort by Customer</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Details</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {payment.customerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                          <div className="text-sm text-gray-500">{payment.email}</div>
                          <div className="text-xs text-gray-400">{payment.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{payment.product}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(payment.category)}`}>
                          {payment.category}
                        </span>
                        <span className="text-xs text-gray-500">ID: {payment.orderId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">₹{payment.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{payment.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status === 'Completed' && '✓ '}
                        {payment.status === 'Failed' && '✗ '}
                        {payment.status === 'Processing' && '⏳ '}
                        {payment.status === 'Refunded' && '↩ '}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{payment.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Payment Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Payment Methods Distribution */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="space-y-3">
              {['UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map((method) => {
                const count = paymentData.filter(p => p.paymentMethod === method).length;
                const percentage = (count / paymentData.length) * 100;
                return (
                  <div key={method} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{method}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Revenue */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
            <div className="space-y-4">
              {['Handloom', 'Handicraft'].map((category) => {
                const categoryPayments = paymentData.filter(p => p.category === category && p.status === 'Completed');
                const revenue = categoryPayments.reduce((sum, p) => sum + p.amount, 0);
                const totalRevenue = paymentData.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
                const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                        {category}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">₹{revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${category === 'Handloom' ? 'bg-purple-500' : 'bg-orange-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}% of total revenue</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        
      </div>
    </div>
  );
};

export default PaymentManagement;