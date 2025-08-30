import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Clock, 
  MessageCircle, 
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import tailorService from '../services/tailorService';

const TailorPortfolioPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [tailor, setTailor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [inquirySubject, setInquirySubject] = useState('');

  useEffect(() => {
    const fetchTailor = async () => {
      try {
        setLoading(true);
        const res = await tailorService.getTailorById(id);
        setTailor(res.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tailor details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTailor();
  }, [id]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !inquirySubject.trim()) {
      setError('Please provide both subject and message.');
      return;
    }
    
    try {
      setSendingInquiry(true);
      setError(null);
      
      await tailorService.sendInquiry(id, {
        subject: inquirySubject,
        message: chatMessage
      });
      
      // Clear form and close modal
      setChatMessage('');
      setInquirySubject('');
      setShowChatModal(false);
      
      // Show success message
      alert('Inquiry sent successfully! The tailor will respond soon.');
    } catch (err) {
      console.error('Error sending inquiry:', err);
      setError(err.response?.data?.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setSendingInquiry(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) return;
    
    try {
      setSubmittingReview(true);
      setError(null);
      
      await tailorService.addTailorReview(id, {
        rating: newReview.rating,
        comment: newReview.comment
      });
      
      // Refresh tailor data to get updated reviews
      const res = await tailorService.getTailorById(id);
      setTailor(res.data.data);
      
      setNewReview({ rating: 5, comment: '' });
      setShowReviewModal(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-tailor-primary" />
      </div>
    );
  }

  if (error || !tailor) {
    return (
      <div className="min-h-screen pt-20 text-center">
        <h2 className="text-2xl text-red-500">{error || 'Tailor not found.'}</h2>
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
          className="card mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <img
                src={tailor.portfolio[0]}
                alt={tailor.name}
                className="w-full h-80 object-cover rounded-xl"
              />
            </div>
            
            <div className="lg:w-2/3 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                    {tailor.name}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-lg font-semibold text-slate-700">{tailor.rating}</span>
                      <span className="text-slate-500">({tailor.reviews?.length || 0} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{tailor.experience} years experience</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 glass rounded-lg hover:bg-white/30 transition-colors duration-300">
                    <Heart className="w-5 h-5 text-slate-600" />
                  </button>
                  <button className="p-2 glass rounded-lg hover:bg-white/30 transition-colors duration-300">
                    <Share2 className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              <p className="text-lg text-slate-600 leading-relaxed">
                {tailor.bio}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-tailor-primary" />
                  <div>
                    <p className="font-semibold text-slate-700">Location</p>
                    <p className="text-slate-600">{tailor.city}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-tailor-primary" />
                  <div>
                    <p className="font-semibold text-slate-700">Price Range</p>
                    <p className="text-slate-600">{tailor.priceRange}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-tailor-primary" />
                  <div>
                    <p className="font-semibold text-slate-700">Phone</p>
                    <p className="text-slate-600">{tailor.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-tailor-primary" />
                  <div>
                    <p className="font-semibold text-slate-700">Response Time</p>
                    <p className="text-slate-600">{tailor.responseTime || '2-4 hours'}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {tailor.specialization.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-tailor-primary/10 to-tailor-secondary/10 text-tailor-primary rounded-full text-sm font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowChatModal(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-tailor-primary to-tailor-secondary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Inquire with Tailor</span>
                </motion.button>
                
                {user && user.role === 'customer' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReviewModal(true)}
                    className="flex items-center space-x-2 border-2 border-tailor-primary text-tailor-primary px-6 py-3 rounded-xl font-semibold hover:bg-tailor-primary hover:text-white transition-all duration-300"
                  >
                    <Star className="w-5 h-5" />
                    <span>Write Review</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Portfolio</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tailor.portfolio?.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer"
                onClick={() => {
                  setSelectedImage(index);
                  setShowImageModal(true);
                }}
              >
                <img
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 rounded-xl" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Customer Reviews</h2>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-lg font-semibold">{tailor.rating}</span>
              <span className="text-slate-500">({tailor.reviews?.length || 0} reviews)</span>
            </div>
          </div>

          <div className="space-y-6">
            {tailor.reviews?.map((review, index) => (
              <div key={review._id || index} className="border-b border-slate-200 pb-6 last:border-b-0">
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
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={tailor.portfolio[selectedImage]}
                alt={`Portfolio ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain rounded-xl"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(prev => prev > 0 ? prev - 1 : tailor.portfolio.length - 1);
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(prev => prev < tailor.portfolio.length - 1 ? prev + 1 : 0);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md h-96 flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-bold text-slate-800">Chat with {tailor.name}</h3>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                <div className="text-center text-slate-500 text-sm">
                  <p>Send an inquiry to {tailor.name}</p>
                  <p>They will respond to your message soon.</p>
                </div>
              </div>
              
              <div className="p-4 border-t">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={inquirySubject}
                    onChange={(e) => setInquirySubject(e.target.value)}
                    placeholder="Subject (e.g., Custom suit inquiry)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tailor-primary"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !sendingInquiry && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tailor-primary"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={sendingInquiry || !inquirySubject.trim() || !chatMessage.trim()}
                      className="px-4 py-2 bg-tailor-primary text-white rounded-lg hover:bg-tailor-secondary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {sendingInquiry ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{sendingInquiry ? 'Sending...' : 'Send'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Write a Review</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newReview.rating
                              ? 'text-yellow-500 fill-current'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    rows={4}
                    placeholder="Share your experience with this tailor..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tailor-primary resize-none"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleSubmitReview}
                    disabled={submittingReview || !newReview.comment.trim()}
                    className="flex-1 bg-tailor-primary text-white py-2 rounded-lg font-semibold hover:bg-tailor-secondary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {submittingReview && <Loader className="w-4 h-4 animate-spin" />}
                    <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
                  </button>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    disabled={submittingReview}
                    className="flex-1 border border-slate-300 text-slate-600 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors duration-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TailorPortfolioPage;