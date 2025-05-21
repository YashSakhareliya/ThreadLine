import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  Package,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  BarChart
} from 'lucide-react';

const SellerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/seller', icon: Home },
    { name: 'My Listings', href: '/seller/products', icon: ShoppingBag },
    { name: 'Add Product', href: '/seller/products/add', icon: PlusCircle },
    { name: 'Orders', href: '/seller/orders', icon: Package },
    { name: 'Reports', href: '/seller/reports', icon: BarChart }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-full mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <span className="ml-4 text-xl font-semibold text-gray-900">
                Seller Dashboard
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <Bell size={24} />
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    2
                  </span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">
                        New Order Received
                      </p>
                      <p className="text-sm text-gray-600">
                        Order #1234 has been placed
                      </p>
                      <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">
                        Low Stock Alert
                      </p>
                      <p className="text-sm text-gray-600">
                        Italian Cotton Fabric is running low
                      </p>
                      <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button className="flex items-center space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    John Seller
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-full bg-white shadow-lg transition-transform duration-300 transform z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '250px' }}
      >
        <nav className="mt-8 px-4">
          <div className="space-y-1">
            {navigation.map(item => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  location.pathname === item.href
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              to="/seller/settings"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-0'} pt-16`}
      >
        <Outlet />
      </div>

      {/* Footer */}
      <footer
        className={`bg-white shadow-md py-4 transition-all duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2024 SuitCraft. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                to="/seller/support"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Seller Support
              </Link>
              <span className="text-sm text-gray-500">|</span>
              <a
                href="tel:+1234567890"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SellerLayout;
