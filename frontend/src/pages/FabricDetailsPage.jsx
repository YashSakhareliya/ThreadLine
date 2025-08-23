import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Package, 
  Ruler, 
  Palette, 
  ChevronLeft, 
  ChevronRight,
  X,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import fabricService from '../services/fabricService';
import shopService from '../services/shopService';

const FabricDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [fabric, setFabric] = useState(null);
  const [shop, setShop] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', images: [] });
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchFabricDetails = async () => {
      try {
        const fabricRes = await fabricService.getFabricById(id);
        const fabricData = fabricRes.data.data;
        setFabric(fabricData);
        
        if (fabricData.shop) {
          const shopRes = await shopService.getShopById(fabricData.shop);
          setShop(shopRes.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch fabric details:', error);
      }
    };

    fetchFabricDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (user && user.role === 'customer' && fabric) {
      addToCart(fabric, quantity);
    }
  };

  const handleSubmitReview = () => {
    if (newReview.comment.trim()) {
      const review = {
        id: Date.now(),
        customerName: user?.name || 'Anonymous',
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toLocaleDateString(),
        images: newReview.images
      };
      
      setFabric(prev => ({
        ...prev,
        reviews: [review, ...prev.reviews]
      }));
      
      setNewReview({ rating: 5, comment: '', images: [] });
      setShowReviewModal(false);
    }
  };

  if (!fabric || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-customer-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <img
                src={fabric.images?.[selectedImage] || fabric.image}
                alt={fabric.name}
                className="w-full h-96 object-cover rounded-2xl cursor-pointer"
                onClick={() => setShowImageModal(true)}
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 glass rounded-lg transition-colors duration-300 ${
                    isLiked ? 'text-red-500' : 'text-slate-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 glass rounded-lg text-slate-600 hover:text-customer-primary transition-colors duration-300">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {fabric.images && fabric.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {fabric.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-customer-primary' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${fabric.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{fabric.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{fabric.ratings}</span>
                  <span className="text-slate-500">({fabric.reviews?.length || 0} reviews)</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Heart className="w-4 h-4" />
                  <span>{fabric.likes} likes</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Package className="w-4 h-4" />
                  <span>{fabric.totalPurchases} sold</span>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">{fabric.description}</p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <div className="text-3xl font-bold text-customer-primary mb-4">
                ₹{fabric.price.toLocaleString()}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-customer-primary" />
                  <div>
                    <p className="font-semibold text-slate-700">Color</p>
                    <p className="text-slate-600">{fabric.color}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-customer-primary" />
                  <div>
                    <p className="font-semibold text-slate-700">Stock</p>
                    <p className="text-slate-600">{fabric.stock} units</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Ruler className="w-5 h-5 text-customer-primary" />
                  <div>
                    <p className="font-semibold text-slate-700">Width</p>
                    <p className="text-slate-600">{fabric.specifications?.width || fabric.width || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-customer-primary rounded-full" />
                  <div>
                    <p className="font-semibold text-slate-700">Material</p>
                    <p className="text-slate-600">{fabric.material}</p>
                  </div>
                </div>
              </div>

              {user && user.role === 'customer' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-slate-700">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(fabric.stock, quantity + 1))}
                        className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={fabric.stock === 0}
                    className="w-full flex items-center justify-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{fabric.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Shop Info */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-800 mb-3">Sold by</h3>
              <div className="flex items-center space-x-3">
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-slate-800">{shop.name}</h4>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-slate-600">{shop.rating} rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="border-t border-slate-200 pt-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Free delivery on orders above ₹1000</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">7 days return policy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-slate-700">100% authentic products</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mt-8"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fabric.specifications && Object.entries(fabric.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-semibold text-slate-700 capitalize">
                  {key.replace('_', ' ')}:
                </span>
                <span className="text-slate-600">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mt-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Customer Reviews</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-lg font-semibold">{fabric.ratings}</span>
                <span className="text-slate-500">({fabric.reviews?.length || 0} reviews)</span>
              </div>
              {user && user.role === 'customer' && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="btn-primary"
                >
                  Write Review
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {fabric.reviews?.map((review) => (
              <div key={review.id} className="border-b border-slate-200 pb-6 last:border-b-0">
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
                src={fabric.images?.[selectedImage] || fabric.image}
                alt={fabric.name}
                className="max-w-full max-h-full object-contain rounded-xl"
              />
              {fabric.images && fabric.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(prev => prev > 0 ? prev - 1 : fabric.images.length - 1);
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors duration-300"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(prev => prev < fabric.images.length - 1 ? prev + 1 : 0);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors duration-300"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
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
                    placeholder="Share your experience with this fabric..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customer-primary resize-none"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleSubmitReview}
                    className="flex-1 bg-customer-primary text-white py-2 rounded-lg font-semibold hover:bg-customer-secondary transition-colors duration-300"
                  >
                    Submit Review
                  </button>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 border border-slate-300 text-slate-600 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors duration-300"
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

export default FabricDetailsPage;