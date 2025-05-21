import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Store,
  Scissors,
  Package,
  DollarSign,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  User
} from 'lucide-react';

// Dummy data
const stats = {
  totalUsers: 1248,
  totalSellers: 156,
  totalTailors: 89,
  totalOrders: 2567,
  totalRevenue: 156789
};

const recentOrders = [
  {
    id: 'ORD001',
    customer: 'John Smith',
    status: 'Pending',
    amount: 299.99,
    date: '2024-03-15'
  },
  {
    id: 'ORD002',
    customer: 'Sarah Johnson',
    status: 'Shipped',
    amount: 459.99,
    date: '2024-03-14'
  },
  {
    id: 'ORD003',
    customer: 'Michael Brown',
    status: 'Delivered',
    amount: 189.99,
    date: '2024-03-13'
  }
];

const notifications = [
  {
    id: 1,
    title: 'New Seller Registration',
    message: 'Classic Fabrics has requested approval',
    time: '5 minutes ago'
  },
  {
    id: 2,
    title: 'Order Flagged',
    message: 'Order #ORD001 has been flagged for review',
    time: '10 minutes ago'
  },
  {
    id: 3,
    title: 'New Tailor Application',
    message: 'James Wilson applied as a tailor',
    time: '1 hour ago'
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-full mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <span className="ml-4 text-xl font-semibold text-gray-900">SuitCraft Admin</span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="p-2 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <Bell size={24} />
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button className="text-sm text-indigo-600 hover:text-indigo-900">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 p-2 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                    alt="Admin"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="hidden md:block text-sm font-medium">John Admin</span>
                  <ChevronDown size={16} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => navigate('/admin/profile')}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </button>
                    <button
                      onClick={() => navigate('/admin/settings')}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </button>
                    <button
                      onClick={() => navigate('/logout')}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-full bg-white shadow-lg transition-transform duration-300 transform z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '250px' }}
      >
        <nav className="mt-8 px-4">
          <div className="space-y-1">
            {[{ name: 'Dashboard', icon: Package, path: '/admin' },
              { name: 'Users', icon: Users, path: '/admin/users' },
              { name: 'Sellers', icon: Store, path: '/admin/sellers' },
              { name: 'Tailors', icon: Scissors, path: '/admin/tailors' },
              { name: 'Products', icon: Package, path: '/admin/products' },
              { name: 'Orders', icon: Package, path: '/admin/orders' }].map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-0'} pt-16`}>
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-100', textColor: 'text-blue-600' },
              { label: 'Total Sellers', value: stats.totalSellers, icon: Store, color: 'bg-green-100', textColor: 'text-green-600' },
              { label: 'Total Tailors', value: stats.totalTailors, icon: Scissors, color: 'bg-purple-100', textColor: 'text-purple-600' },
              { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'bg-yellow-100', textColor: 'text-yellow-600' },
              { label: 'Total Revenue', value: stats.totalRevenue, icon: DollarSign, color: 'bg-indigo-100', textColor: 'text-indigo-600' }
            ].map((stat) => (
              <div className="bg-white rounded-lg shadow p-6" key={stat.label}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color} ${stat.textColor}`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'Shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`bg-white shadow-md py-4 transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2024 SuitCraft Admin Panel. Version 1.0.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
