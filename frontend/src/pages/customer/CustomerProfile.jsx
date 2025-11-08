import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cities } from '../../data/mockData';
import customerService from '../../services/customerService';

const CustomerProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });

  // Fetch customer profile
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        const profileResponse = await customerService.getCustomerProfile();

        if (profileResponse.success) {
          const profile = profileResponse.data;
          setCustomerProfile(profile);
          setProfileData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            city: profile.city || ''
          });
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

        {/* Profile Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Profile Details</h2>

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
                    readOnly
                    className="input-field pl-10 bg-slate-50 cursor-default"
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
                    readOnly
                    className="input-field pl-10 bg-slate-50 cursor-default"
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
                    readOnly
                    className="input-field pl-10 bg-slate-50 cursor-default"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={profileData.city}
                    readOnly
                    className="input-field pl-10 bg-slate-50 cursor-default"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerProfile;