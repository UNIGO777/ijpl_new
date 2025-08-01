import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Download,
  LogOut,
  Settings,
  Bell,
  DollarSign,
  Package,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Login component
  const LoginForm = () => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoginLoading(true);
      setLoginError('');

      try {
        const response = await fetch('https://ijpl-new-backend.onrender.com/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('adminToken', data.data.token);
          localStorage.setItem('adminRefreshToken', data.data.refreshToken);
          setUser(data.data.admin);
          setIsAuthenticated(true);
        } else {
          setLoginError(data.message || 'Login failed');
        }
      } catch (error) {
        setLoginError('Connection error. Please try again.');
      } finally {
        setLoginLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">League Admin</h1>
            <p className="text-gray-600">Indian Jabalpur Premier League Admin Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@ijpl.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loginLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Default credentials: admin@neelkanthpharmacy.com / admin123
            </p>
          </div>
        </motion.div>
      </div>
    );
  };

  // Analytics Dashboard Component
  const AnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [dateRange, setDateRange] = useState('7d');

    useEffect(() => {
      fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('https://ijpl-new-backend.onrender.com/api/orders/analytics/summary', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setAnalytics(data.data);
        }
      } catch (error) {
        console.error('Analytics fetch error:', error);
      }
    };

    if (!analytics) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      );
    }

    const statusColors = {
      pending: 'text-yellow-600 bg-yellow-100',
      confirmed: 'text-blue-600 bg-blue-100',
      processing: 'text-purple-600 bg-purple-100',
      shipped: 'text-orange-600 bg-orange-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    };

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.summary.totalOrders || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{analytics.summary.totalRevenue || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Order</p>
                <p className="text-2xl font-bold text-gray-900">₹{Math.round(analytics.summary.avgOrderValue || 0)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Units Sold</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.summary.totalQuantity || 0}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts and Recent Orders */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Order Status Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
            <div className="space-y-3">
              {analytics.statusDistribution.map((status, index) => (
                <div key={status._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status._id] || 'text-gray-600 bg-gray-100'}`}>
                      {status._id.charAt(0).toUpperCase() + status._id.slice(1)}
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">{status.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
            <div className="space-y-3">
              {analytics.recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.customer.name}</p>
                    <p className="text-sm text-gray-600">{order.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
                    <p className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] || 'text-gray-600 bg-gray-100'}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  // Cricket Registrations Management Component
  const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

    useEffect(() => {
      fetchOrders();
    }, [pagination.page, statusFilter]);

    useEffect(() => {
      filterOrders();
    }, [orders, searchTerm, statusFilter]);

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const params = new URLSearchParams({
          page: pagination.page,
          limit: pagination.limit,
          ...(statusFilter !== 'all' && { status: statusFilter })
        });

        const response = await fetch(`https://ijpl-new-backend.onrender.com/api/orders?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Orders response:', response);

        const data = await response.json();
        if (data.success) {
          setOrders(data.data.orders);
          setPagination(prev => ({ ...prev, total: data.data.pagination.total }));
        }
      } catch (error) {
        console.error('Orders fetch error:', error);
      }
    };

    const filterOrders = () => {
      let filtered = orders;

      if (searchTerm) {
        filtered = filtered.filter(order =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.player && order.player.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.player && order.player.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.player && order.player.phone.includes(searchTerm)) ||
          (order.player && order.player.ageGroup.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.player && order.player.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.player && order.player.playingRole.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      setFilteredOrders(filtered);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`https://ijpl-new-backend.onrender.com/api/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();
        if (data.success) {
          fetchOrders();
          if (selectedOrder?.orderId === orderId) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
          }
        }
      } catch (error) {
        console.error('Status update error:', error);
      }
    };

    const OrderModal = () => {
      if (!selectedOrder) return null;

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                    <p className="text-gray-900 font-semibold">{selectedOrder.orderId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.orderId, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="text-gray-900">{selectedOrder.customer.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{selectedOrder.customer.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{selectedOrder.customer.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                  <p className="text-gray-900">
                    {selectedOrder.customer.address.street}<br />
                    {selectedOrder.customer.address.city}, {selectedOrder.customer.address.state}<br />
                    {selectedOrder.customer.address.pincode}, {selectedOrder.customer.address.country}
                  </p>
                </div>

                {/* Product & Payment */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>Product:</span>
                      <span className="font-semibold">{selectedOrder.product.name}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Quantity:</span>
                      <span className="font-semibold">{selectedOrder.product.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Payment Method:</span>
                      <span className="font-semibold capitalize">{selectedOrder.payment.method}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                      <span>Total Amount:</span>
                      <span className="text-red-600">₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      );
    };

    const statusColors = {
      pending: 'text-yellow-600 bg-yellow-100',
      completed: 'text-green-600 bg-green-100',
      processing: 'text-purple-600 bg-purple-100',
      shipped: 'text-orange-600 bg-orange-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    };

    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search registrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age Group
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Playing Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Fee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{order.orderId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.player?.fullName || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.player?.email || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.player?.phone || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{order.player?.ageGroup || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{order.player?.playingRole || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-green-600">₹{order.totalAmount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.payment.status] || 'text-gray-600 bg-gray-100'}`}>
                        {order.payment.status} 
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 mr-3"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} registrations
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page * pagination.limit >= pagination.total}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showOrderModal && <OrderModal />}
        </AnimatePresence>
      </div>
    );
  };

  // Main Admin Panel Layout
  const AdminLayout = () => {
    const handleLogout = () => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      setIsAuthenticated(false);
      setUser(null);
      setActiveTab('analytics');
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Neelkanth Pharmacy Management</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </div>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Registrations
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <AnalyticsDashboard />
              </motion.div>
            )}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <OrdersManagement />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    );
  };

  return isAuthenticated ? <AdminLayout /> : <LoginForm />;
};

export default AdminPanel; 