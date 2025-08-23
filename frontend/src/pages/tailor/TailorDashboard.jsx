import React, { useState } from 'react';
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
  Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TailorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  
  const [profileData, setProfileData] = useState({
    bio: 'Master tailor with 15 years of experience in premium stitching',
    specialization: ['Suits', 'Shirts', 'Traditional Wear'],
    experience: 15,
    priceRange: '₹500 - ₹2000',
    phone: '+91 98765 43220',
    email: 'rajesh@tailoring.com'
  });

  const [portfolio, setPortfolio] = useState([
    'https://images.pexels.com/photos/6069120/pexels-photo-6069120.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6069121/pexels-photo-6069121.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6069122/pexels-photo-6069122.jpeg?auto=compress&cs=tinysrgb&w=800'
  ]);

  const [inquiries] = useState([
    {
      id: 1,
      customerName: 'Priya Sharma',
      customerEmail: 'priya@email.com',
      message: 'Hi, I need a custom saree blouse. Can you help?',
      date: '2024-01-20',
      status: 'new',
      messages: [
        {
          id: 1,
          sender: 'Priya Sharma',
          message: 'Hi, I need a custom saree blouse. Can you help?',
          timestamp: '2024-01-20 10:30 AM',
          isCustomer: true
        }
      ]
    },
    {
      id: 2,
      customerName: 'Amit Kumar',
      customerEmail: 'amit@email.com',
      message: 'Looking for a wedding suit. What are your rates?',
      date: '2024-01-19',
      status: 'replied',
      messages: [
        {
          id: 1,
          sender: 'Amit Kumar',
          message: 'Looking for a wedding suit. What are your rates?',
          timestamp: '2024-01-19 2:15 PM',
          isCustomer: true
        },
        {
          id: 2,
          sender: 'Rajesh Kumar',
          message: 'Hello! For wedding suits, my rates start from ₹1500. Would you like to discuss the details?',
          timestamp: '2024-01-19 3:45 PM',
          isCustomer: false
        }
      ]
    }
  ]);

  const [reviews] = useState([
    {
      id: 1,
      customerName: 'Priya Sharma',
      rating: 5,
      comment: 'Excellent work on my wedding lehenga. The stitching quality is outstanding and the fit is perfect. Highly recommended!',
      date: '2024-01-15',
      images: ['https://images.pexels.com/photos/6069126/pexels-photo-6069126.jpeg?auto=compress&cs=tinysrgb&w=400']
    },
    {
      id: 2,
      customerName: 'Amit Kumar',
      rating: 4,
      comment: 'Great attention to detail. The suit came out exactly as I wanted. Will definitely come back for more work.',
      date: '2024-01-10',
      images: []
    },
    {
      id: 3,
      customerName: 'Sneha Patel',
      rating: 5,
      comment: 'Amazing craftsmanship! The traditional wear was beautifully made with intricate details.',
      date: '2024-01-05',
      images: ['https://images.pexels.com/photos/6069127/pexels-photo-6069127.jpeg?auto=compress&cs=tinysrgb&w=400']
    }
  ]);

  const stats = [
    { label: 'Profile Views', value: 245, icon: Eye, color: 'text-blue-600' },
    { label: 'Customer Inquiries', value: 12, icon: MessageCircle, color: 'text-green-600' },
    { label: 'Average Rating', value: '4.9', icon: Star, color: 'text-yellow-600' },
    { label: 'Completed Projects', value: 89, icon: Award, color: 'text-purple-600' }
  ];

  const handleProfileSave = () => {
    console.log('Saving profile:', profileData);
    setIsEditingProfile(false);
  };

  const handleAddPortfolioImage = () => {
    // In a real app, this would open a file picker
    const newImage = 'https://images.pexels.com/photos/6069123/pexels-photo-6069123.jpeg?auto=compress&cs=tinysrgb&w=800';
    setPortfolio([...portfolio, newImage]);
  };

  const handleRemovePortfolioImage = (index) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const handleSendReply = () => {
    if (replyMessage.trim() && selectedInquiry) {
      const newMessage = {
        id: Date.now(),
        sender: user?.name || 'Tailor',
        message: replyMessage,
        timestamp: new Date().toLocaleString(),
        isCustomer: false
      };
      
      // Update the inquiry with new message
      const updatedInquiry = {
        ...selectedInquiry,
        messages: [...selectedInquiry.messages, newMessage],
        status: 'replied'
      };
      
      setSelectedInquiry(updatedInquiry);
      setReplyMessage('');
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'profile', name: 'Profile Management', icon: User },
    { id: 'portfolio', name: 'Portfolio', icon: Camera },
    { id: 'inquiries', name: 'Customer Inquiries', icon: MessageCircle },
    { id: 'reviews', name: 'Customer Reviews', icon: Star }
  ];

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
            Manage your profile, showcase your work, and connect with customers
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {tabs.map((tab) => (
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
                      <div key={inquiry.id} className="p-3 bg-slate-50 rounded-lg">
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
                        <p className="text-sm text-slate-600 mb-2">{inquiry.message}</p>
                        <p className="text-xs text-slate-500">{inquiry.date}</p>
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
                  className="flex items-center space-x-2 bg-gradient-to-r from-tailor-primary to-tailor-secondary text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isEditingProfile ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  <span>{isEditingProfile ? 'Save Changes' : 'Edit Profile'}</span>
                </button>
              </div>

              <div className="space-y-6">
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
                      onChange={(e) => setProfileData({...profileData, experience: parseInt(e.target.value)})}
                      disabled={!isEditingProfile}
                      className="input-field disabled:bg-slate-50 disabled:cursor-not-allowed"
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

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Specialization
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.specialization.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-tailor-primary/10 to-tailor-secondary/10 text-tailor-primary rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
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
                  className="flex items-center space-x-2 bg-gradient-to-r from-tailor-primary to-tailor-secondary text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Image</span>
                </button>
              </div>

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
                        key={inquiry.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedInquiry(inquiry)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                          selectedInquiry?.id === inquiry.id
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
                        <p className="text-xs text-slate-600 line-clamp-2">{inquiry.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{inquiry.date}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Interface */}
              <div className="lg:col-span-2">
                {selectedInquiry ? (
                  <div className="card h-96 flex flex-col">
                    <div className="border-b border-slate-200 pb-4 mb-4">
                      <h3 className="text-lg font-bold text-slate-800">{selectedInquiry.customerName}</h3>
                      <p className="text-sm text-slate-600">{selectedInquiry.customerEmail}</p>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                      {selectedInquiry.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isCustomer ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg ${
                              msg.isCustomer
                                ? 'bg-slate-100 text-slate-800'
                                : 'bg-tailor-primary text-white'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-slate-200 pt-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                          placeholder="Type your reply..."
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tailor-primary"
                        />
                        <button
                          onClick={handleSendReply}
                          className="px-4 py-2 bg-tailor-primary text-white rounded-lg hover:bg-tailor-secondary transition-colors duration-300"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card h-96 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600">Select an inquiry to start chatting</p>
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
                  <span className="text-lg font-semibold">4.9</span>
                  <span className="text-slate-500">({reviews.length} reviews)</span>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
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
                          <span className="text-sm text-slate-500">{review.date}</span>
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
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TailorDashboard;