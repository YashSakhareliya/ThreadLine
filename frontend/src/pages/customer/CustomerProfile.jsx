import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save, 
  Plus,
  Trash2,
  Package
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cities } from '../../data/mockData';
import OrderCard from '../../components/cards/OrderCard';
import customerService from '../../services/customerService';
import orderService from '../../services/orderService';

const CustomerProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });

  const [addresses, setAddresses] = useState([]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  // Fetch customer profile and orders
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        const [profileResponse, ordersResponse] = await Promise.all([
          customerService.getCustomerProfile(),
          orderService.getMyOrders()
        ]);

        if (profileResponse.success) {
          const profile = profileResponse.data;
          setCustomerProfile(profile);
          setProfileData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            city: profile.city || ''
          });
          setAddresses(profile.addresses || []);
        }

        if (ordersResponse.success) {
          setUserOrders(ordersResponse.data || []);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching customer data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [user]);

  const handleProfileSave = async () => {
    try {
      setUpdating(true);
      const response = await customerService.updateCustomerProfile(profileData);
      
      if (response.success) {
        setCustomerProfile(response.data);
        setIsEditing(false);
        setError(null);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      setUpdating(true);
      const addressData = {
        ...newAddress,
        isDefault: addresses.length === 0
      };
      
      const response = await customerService.addAddress(addressData);
      
      if (response.success) {
        setCustomerProfile(response.data);
        setAddresses(response.data.addresses || []);
        setNewAddress({ name: '', address: '', city: '', zipCode: '', phone: '' });
        setShowAddressForm(false);
        setError(null);
      }
    } catch (err) {
      console.error('Error adding address:', err);
      setError('Failed to add address');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      setUpdating(true);
      const response = await customerService.deleteAddress(addressId);
      
      if (response.success) {
        setCustomerProfile(response.data);
        setAddresses(response.data.addresses || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Failed to delete address');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customer-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profile Details', icon: User },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'orders', name: 'Order History', icon: Package }
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-customer-primary to-customer-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">{customerProfile?.name}</h1>
          <p className="text-slate-600">{customerProfile?.email}</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-white text-customer-primary shadow-md'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'profile' && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Profile Details</h2>
                <button
                  onClick={() => isEditing ? handleProfileSave() : setIsEditing(true)}
                  disabled={updating}
                  className="flex items-center space-x-2 btn-primary disabled:opacity-50"
                >
                  {updating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : isEditing ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Edit className="w-4 h-4" />
                  )}
                  <span>
                    {updating ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing || updating}
                      className="input-field pl-10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing || updating}
                      className="input-field pl-10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing || updating}
                      className="input-field pl-10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                      value={profileData.city}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                      disabled={!isEditing || updating}
                      className="input-field pl-10 appearance-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                    >
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Saved Addresses</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  disabled={updating}
                  className="flex items-center space-x-2 btn-primary disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Address</span>
                </button>
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="card"
                >
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Address Name (Home, Office, etc.)"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                      disabled={updating}
                      className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                      disabled={updating}
                      className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                    <input
                      type="text"
                      placeholder="Full Address"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                      disabled={updating}
                      className="input-field md:col-span-2 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      disabled={updating}
                      className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                    <input
                      type="text"
                      placeholder="Zip Code"
                      value={newAddress.zipCode}
                      onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                      disabled={updating}
                      className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex space-x-4 mt-4">
                    <button 
                      onClick={handleAddAddress} 
                      disabled={updating}
                      className="btn-primary disabled:opacity-50"
                    >
                      {updating ? 'Saving...' : 'Save Address'}
                    </button>
                    <button 
                      onClick={() => setShowAddressForm(false)}
                      disabled={updating}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Address List */}
              <div className="space-y-4">
                {addresses.map((address) => (
                  <motion.div
                    key={address._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-bold text-slate-800">{address.name}</h3>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-customer-primary text-white text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 mb-1">{address.address}</p>
                        <p className="text-slate-600 mb-1">{address.city} - {address.zipCode}</p>
                        <p className="text-slate-600">{address.phone}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-slate-400 hover:text-customer-primary transition-colors duration-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAddress(address._id)}
                          disabled={updating}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors duration-300 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Order History</h2>
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
              {userOrders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">No orders yet</h3>
                  <p className="text-slate-500">Your order history will appear here</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerProfile;