import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Eye, 
  MessageCircle, 
  Star, 
  Camera,
  Edit,
  Save,
  Plus,
  Trash2,
  TrendingUp,
  Users,
  Award,
  Loader,
  Upload,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import tailorService from '../../services/tailorService';
import uploadService from '../../services/uploadService';
import LocationInput from '../../components/common/LocationInput';

const TailorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tailorProfile, setTailorProfile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    specialization: [],
    experience: 0,
    priceRange: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    state: '',
    zipCode: '',
    country: 'India',
    completedProjects: 0,
    latitude: '',
    longitude: ''
  });

  const [portfolio, setPortfolio] = useState([]);
  const [newSpecialization, setNewSpecialization] = useState('');

  // Available specializations
  const availableSpecializations = [
    'Suits', 'Shirts', 'Traditional Wear', 'Sarees', 'Lehengas', 
    'Blouses', 'Casual Wear', 'Formal Wear', 'Alterations'
  ];

  // Fetch tailor profile data and inquiries
  useEffect(() => {
    const fetchTailorData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, get all tailors and find the one owned by current user
        const response = await tailorService.getAllTailors();
        const tailors = response.data.data;
        const userTailor = tailors.find(tailor => {
          const ownerId = tailor.owner?._id || tailor.owner;
          return ownerId === user._id;
        });
        if (userTailor) {
          setTailorProfile(userTailor);
          setProfileData({
            name: userTailor.name || '',
            bio: userTailor.bio || '',
            specialization: userTailor.specialization || [],
            experience: userTailor.experience || 0,
            priceRange: userTailor.priceRange || '',
            phone: userTailor.phone || '',
            email: userTailor.email || '',
            city: typeof userTailor.city === 'object' ? userTailor.city?.name || '' : userTailor.city || '',
            address: typeof userTailor.address === 'object' ? JSON.stringify(userTailor.address) : userTailor.address || '',
            state: userTailor.state || '',
            zipCode: userTailor.zipCode || '',
            country: userTailor.country || 'India',
            completedProjects: userTailor.completedProjects || 0,
            latitude: typeof userTailor.latitude === 'object' ? '' : userTailor.latitude || '',
            longitude: typeof userTailor.longitude === 'object' ? '' : userTailor.longitude || ''
          });
          console.log(userTailor)
          setPortfolio(userTailor.portfolio || []);
          
          // Fetch inquiries for this tailor
          try {
            const inquiriesResponse = await tailorService.getTailorInquiries(userTailor._id);
            setInquiries(inquiriesResponse.data.data || []);
          } catch (inquiryErr) {
            console.error('Error fetching inquiries:', inquiryErr);
            // Don't set error for inquiries, just log it
          }
          
          // Refresh tailor profile to get latest reviews
          try {
            const refreshedTailorResponse = await tailorService.getTailorById(userTailor._id);
            const refreshedTailor = refreshedTailorResponse.data.data;
            setTailorProfile(prev => ({
              ...prev,
              reviews: refreshedTailor.reviews,
              rating: refreshedTailor.rating,
              totalReviews: refreshedTailor.totalReviews
            }));
          } catch (reviewErr) {
            console.error('Error refreshing tailor reviews:', reviewErr);
          }
        } else {
          setError('No tailor profile found. Please create your tailor profile first.');
        }
      } catch (err) {
        console.error('Error fetching tailor profile:', err);
        setError('Failed to fetch tailor profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchTailorData();
    }
  }, [user]);

  // Real inquiries data from backend
  const [inquiries, setInquiries] = useState([]);
  
  const handleProfileSave = async () => {
    if (!tailorProfile?._id) return;
    
    try {
      setUpdating(true);
      await tailorService.updateTailor(tailorProfile._id, profileData);
      
      // Update local state
      setTailorProfile(prev => ({
        ...prev,
        ...profileData
      }));
      
      setIsEditingProfile(false);
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Handle image upload to Cloudinary
  const handleAddPortfolioImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      // Upload image to backend/Cloudinary
      const response = await uploadService.uploadSingleImage(file);
      const imageUrl = response.data.data.url;
      
      const updatedPortfolio = [...portfolio, imageUrl];
      setPortfolio(updatedPortfolio);
      
      // Update backend
      if (tailorProfile?._id) {
        await tailorService.updateTailor(tailorProfile._id, { portfolio: updatedPortfolio });
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleRemovePortfolioImage = async (index) => {
    try {
      const updatedPortfolio = portfolio.filter((_, i) => i !== index);
      setPortfolio(updatedPortfolio);
      
      // Update backend
      if (tailorProfile?._id) {
        await tailorService.updateTailor(tailorProfile._id, { portfolio: updatedPortfolio });
      }
    } catch (err) {
      console.error('Error updating portfolio:', err);
      setError('Failed to remove image. Please try again.');
    }
  };

  const handleMarkAsRead = async () => {
    if (!selectedInquiry || !tailorProfile?._id) return;
    
    // Skip if already read
    if (selectedInquiry.status === 'read') {
      alert('This inquiry has already been marked as read.');
      return;
    }
    
    try {
      setError(null);
      
      // Mark inquiry as read
      await tailorService.markInquiryAsRead(tailorProfile._id, selectedInquiry._id);
      
      // TODO: Future update - Send email notification to customer
      // Email will be sent from backend automatically
      
      // Refresh inquiries to get updated data
      const inquiriesResponse = await tailorService.getTailorInquiries(tailorProfile._id);
      const updatedInquiries = inquiriesResponse.data.data || [];
      setInquiries(updatedInquiries);
      
      // Update selected inquiry
      const updatedSelectedInquiry = updatedInquiries.find(inq => inq._id === selectedInquiry._id);
      setSelectedInquiry(updatedSelectedInquiry || null);
      
      alert('Inquiry marked as read successfully!');
    } catch (err) {
      console.error('Error marking inquiry as read:', err);
      setError(err.response?.data?.message || 'Failed to mark inquiry as read. Please try again.');
    }
  };

  const handleCloseInquiry = async () => {
    if (!selectedInquiry || !tailorProfile?._id) return;
    
    // Confirm before closing
    const confirmClose = window.confirm('Are you sure you want to close this inquiry? This action will remove it from your dashboard.');
    if (!confirmClose) return;
    
    try {
      setError(null);
      
      // Close inquiry
      await tailorService.closeInquiry(tailorProfile._id, selectedInquiry._id);
      
      // Refresh inquiries to get updated data
      const inquiriesResponse = await tailorService.getTailorInquiries(tailorProfile._id);
      const updatedInquiries = inquiriesResponse.data.data || [];
      setInquiries(updatedInquiries);
      
      // Close the inquiry detail modal
      setSelectedInquiry(null);
      
      alert('Inquiry closed successfully!');
    } catch (err) {
      console.error('Error closing inquiry:', err);
      setError(err.response?.data?.message || 'Failed to close inquiry. Please try again.');
    }
  };

  const handleAddSpecialization = () => {
    if (newSpecialization && !profileData.specialization.includes(newSpecialization)) {
      setProfileData({
        ...profileData,
        specialization: [...profileData.specialization, newSpecialization]
      });
      setNewSpecialization('');
    }
  };

  const handleRemoveSpecialization = (skillToRemove) => {
    setProfileData({
      ...profileData,
      specialization: profileData.specialization.filter(skill => skill !== skillToRemove)
    });
  };

  const stats = [
    { label: 'Total Reviews', value: tailorProfile?.totalReviews || 0, icon: Eye, color: 'text-blue-600' },
    { label: 'Customer Inquiries', value: inquiries.length, icon: MessageCircle, color: 'text-green-600' },
    { label: 'Average Rating', value: tailorProfile?.rating?.toFixed(1) || '0.0', icon: Star, color: 'text-yellow-600' },
    { label: 'Completed Projects', value: tailorProfile?.completedProjects || 0, icon: Award, color: 'text-purple-600' }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-tailor-primary mx-auto mb-4" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !tailorProfile) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <User className="w-16 h-16 mx-auto mb-2" />
            <p className="text-lg font-semibold">Profile Not Found</p>
          </div>
          <p className="text-slate-600 mb-4">{error}</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Tailor Dashboard
          </h1>
          <p className="text-slate-600">
            Welcome back, {tailorProfile?.name || user?.name}! Manage your profile, showcase your work, and connect with customers
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {[
              { id: 'overview', name: 'Overview', icon: TrendingUp },
              { id: 'profile', name: 'Profile Management', icon: User },
              { id: 'portfolio', name: 'Portfolio', icon: Camera },
              { id: 'inquiries', name: 'Customer Inquiries', icon: MessageCircle },
              { id: 'reviews', name: 'Customer Reviews', icon: Star }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-tailor-primary shadow-md'
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
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="card text-center"
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Inquiries</h3>
                  <div className="space-y-3">
                    {inquiries.slice(0, 3).map((inquiry) => (
                      <div key={inquiry._id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-slate-800">{inquiry.customerName}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            inquiry.status === 'new' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {inquiry.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{inquiry.subject}</p>
                        <p className="text-xs text-slate-500">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Portfolio Highlights</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {portfolio.slice(0, 6).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Profile Management</h2>
                <button
                  onClick={() => isEditingProfile ? handleProfileSave() : setIsEditingProfile(true)}
                  disabled={updating}
                  className="flex items-center space-x-2 bg-gradient-to-r from-tailor-primary to-tailor-secondary text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {updating ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : isEditingProfile ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Edit className="w-4 h-4" />
                  )}
                  <span>
                    {updating ? 'Saving...' : isEditingProfile ? 'Save Changes' : 'Edit Profile'}
                  </span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tailor Name *
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditingProfile}
                    required
                    className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
                    placeholder="e.g., Ramesh Tailors"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditingProfile}
                    rows={4}
                    className="input-field resize-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                    maxLength={1000}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      value={profileData.experience}
                      onChange={(e) => setProfileData({...profileData, experience: parseInt(e.target.value) || 0})}
                      disabled={!isEditingProfile}
                      className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Completed Projects
                    </label>
                    <input
                      type="number"
                      value={profileData.completedProjects}
                      onChange={(e) => setProfileData({...profileData, completedProjects: parseInt(e.target.value) || 0})}
                      disabled={!isEditingProfile}
                      className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
                      min="0"
                      placeholder="Total projects completed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Price Range
                    </label>
                    <input
                      type="text"
                      value={profileData.priceRange}
                      onChange={(e) => setProfileData({...profileData, priceRange: e.target.value})}
                      disabled={!isEditingProfile}
                      className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
                      placeholder="e.g., ₹500 - ₹2000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditingProfile}
                      className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditingProfile}
                      className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                      disabled={!isEditingProfile}
                      required
                      className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
                      placeholder="e.g., Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={profileData.state}
                      onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                      disabled={!isEditingProfile}
                      className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
                      placeholder="e.g., Maharashtra"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      value={profileData.zipCode}
                      onChange={(e) => setProfileData({...profileData, zipCode: e.target.value})}
                      disabled={!isEditingProfile}
                      className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
                      placeholder="e.g., 400001"
                      maxLength="6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={profileData.country}
                      onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                      disabled={!isEditingProfile}
                      className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
                      placeholder="e.g., India"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    disabled={!isEditingProfile}
                    rows={2}
                    className="input-field resize-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                    placeholder="Shop address, street, landmark, etc."
                  />
                </div>

                {isEditingProfile && (
                  <div>
                    <LocationInput
                      latitude={profileData.latitude}
                      longitude={profileData.longitude}
                      address={profileData.address}
                      city={profileData.city}
                      disabled={!isEditingProfile}
                      onLocationChange={(lat, lng) => {
                        setProfileData({
                          ...profileData,
                          latitude: lat,
                          longitude: lng
                        });
                      }}
                      className="bg-slate-50 p-4 rounded-lg border"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Specialization
                  </label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(profileData.specialization || []).map((skill, index) => (
                        <span
                          key={index}
                          className="flex items-center px-3 py-1 bg-gradient-to-r from-tailor-primary/10 to-tailor-secondary/10 text-tailor-primary rounded-full text-sm"
                        >
                          {skill}
                          {isEditingProfile && (
                            <button
                              onClick={() => handleRemoveSpecialization(skill)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    
                    {isEditingProfile && (
                      <div className="flex space-x-2">
                        <select
                          value={newSpecialization}
                          onChange={(e) => setNewSpecialization(e.target.value)}
                          className="flex-1 input-field"
                        >
                          <option value="">Select a specialization</option>
                          {availableSpecializations
                            .filter(spec => !profileData.specialization.includes(spec))
                            .map(spec => (
                              <option key={spec} value={spec}>{spec}</option>
                            ))}
                        </select>
                        <button
                          onClick={handleAddSpecialization}
                          disabled={!newSpecialization}
                          className="px-4 py-2 bg-tailor-primary text-white rounded-lg hover:bg-tailor-secondary transition-colors duration-300 disabled:opacity-50"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Portfolio Management</h2>
                <button
                  onClick={handleAddPortfolioImage}
                  disabled={uploadingImage}
                  className="flex items-center space-x-2 bg-gradient-to-r from-tailor-primary to-tailor-secondary text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                      <button
                        onClick={() => handleRemovePortfolioImage(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                
                {portfolio.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No portfolio images yet</h3>
                    <p className="text-slate-500 mb-4">Upload your best work to showcase your skills</p>
                    <button
                      onClick={handleAddPortfolioImage}
                      className="btn-primary"
                    >
                      Upload Your First Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Inquiries List */}
              <div className="lg:col-span-1">
                <div className="card">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Customer Inquiries</h2>
                  <div className="space-y-3">
                    {inquiries.map((inquiry) => (
                      <motion.div
                        key={inquiry._id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedInquiry(inquiry)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                          selectedInquiry?._id === inquiry._id
                            ? 'border-tailor-primary bg-tailor-light'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-slate-800 text-sm">{inquiry.customerName}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            inquiry.status === 'new' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {inquiry.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">{inquiry.subject}</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inquiry Details */}
              <div className="lg:col-span-2">
                {selectedInquiry ? (
                  <div className="card flex flex-col">
                    <div className="border-b border-slate-200 pb-4 mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">{selectedInquiry.customerName}</h3>
                          <p className="text-sm text-slate-600">{selectedInquiry.customerEmail}</p>
                          {(selectedInquiry.customer?.phone || selectedInquiry.customerMobile) && (
                            <p className="text-sm text-slate-700 font-semibold mt-1 flex items-center">
                              <span className="mr-1">📱</span>
                              {selectedInquiry.customer?.phone || selectedInquiry.customerMobile}
                            </p>
                          )}
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          selectedInquiry.status === 'read' 
                            ? 'bg-blue-100 text-blue-800' 
                            : selectedInquiry.status === 'replied'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedInquiry.status === 'read' ? 'Read' : selectedInquiry.status === 'replied' ? 'Replied' : 'New'}
                        </span>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-slate-500">Subject</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedInquiry.subject}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-96">
                      {selectedInquiry.messages.map((msg) => (
                        <div
                          key={msg._id}
                          className="flex justify-start"
                        >
                          <div className="max-w-md px-4 py-3 rounded-lg bg-slate-100 text-slate-800">
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-slate-200 pt-4">
                      <button
                        onClick={handleMarkAsRead}
                        disabled={selectedInquiry.status === 'read'}
                        className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                          selectedInquiry.status === 'read'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-tailor-primary to-tailor-secondary text-white hover:shadow-lg'
                        }`}
                      >
                        <Eye className="w-5 h-5" />
                        <span>
                          {selectedInquiry.status === 'read' ? 'Already Marked as Read' : 'Mark as Read'}
                        </span>
                      </button>
                      <p className="text-xs text-slate-500 text-center mt-2">
                        {selectedInquiry.status === 'read' 
                          ? 'This inquiry has been marked as read'
                          : 'Mark this inquiry as read to notify the customer'
                        }
                      </p>
                      
                      <button
                        onClick={handleCloseInquiry}
                        className="w-full mt-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 bg-red-500 text-white hover:bg-red-600 hover:shadow-lg"
                      >
                        <X className="w-5 h-5" />
                        <span>Close Inquiry</span>
                      </button>
                      <p className="text-xs text-slate-500 text-center mt-2">
                        Closing this inquiry will remove it from your dashboard permanently
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="card flex items-center justify-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600">Select an inquiry to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Customer Reviews</h2>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-semibold">{tailorProfile?.rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-slate-500">({tailorProfile?.totalReviews || 0} reviews)</span>
                </div>
              </div>

              <div className="space-y-6">
                {tailorProfile?.reviews && tailorProfile.reviews.length > 0 ? (
                  tailorProfile.reviews.map((review) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-slate-200 pb-6 last:border-b-0"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-800">{review.customerName}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating 
                                      ? 'text-yellow-500 fill-current' 
                                      : 'text-slate-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-slate-500">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-600 mb-3">{review.comment}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex space-x-2">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">No reviews yet</p>
                    <p className="text-slate-500 text-sm">Reviews from customers will appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TailorDashboard;