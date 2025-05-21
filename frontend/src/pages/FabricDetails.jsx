import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingCart, Scissors, ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';

const FabricDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fabric, setFabric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchFabricDetails();
  }, [id]);

  const fetchFabricDetails = async () => {
    try {
      const response = await axios.get(`/api/fabrics/${id}`);
      setFabric(response.data);
      if (response.data.colors.length > 0) {
        setSelectedColor(response.data.colors[0]);
      }
    } catch (error) {
      setError('Failed to load fabric details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/cart/add',
        {
          fabricId: id,
          quantity,
          color: selectedColor
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      showToastMessage('Fabric added to your cart!');
    } catch (error) {
      showToastMessage('Failed to add fabric to cart. Please try again.');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleExploreTailors = () => {
    navigate(`/tailors?fabricId=${id}`);
  };

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/fabrics/${id}/reviews`,
        newReview,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchFabricDetails(); // Refresh reviews
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: '' });
      showToastMessage('Review submitted successfully!');
    } catch (error) {
      showToastMessage('Failed to submit review. Please try again.');
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !fabric) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error || 'Fabric not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/fabrics')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Fabrics
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fabric Image */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={fabric.image}
              alt={fabric.name}
              className="w-full h-[500px] object-cover"
            />
          </div>

          {/* Fabric Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{fabric.name}</h1>
              <p className="text-gray-600 mb-6">{fabric.description}</p>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price per meter</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${fabric.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Material Type</span>
                  <span className="text-gray-900">{fabric.materialType}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pattern</span>
                  <span className="text-gray-900">{fabric.pattern}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Availability</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      fabric.inStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {fabric.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Color
                  </label>
                  <div className="flex space-x-2">
                    {fabric.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color
                            ? 'border-indigo-600'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                    ))}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity (meters)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <button
                    onClick={handleBuyNow}
                    disabled={!fabric.inStock}
                    className="col-span-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleExploreTailors}
                    disabled={!fabric.inStock}
                    className="col-span-1 bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Scissors className="inline-block w-4 h-4 mr-2" />
                    Explore Tailors
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={!fabric.inStock}
                    className="col-span-1 bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="inline-block w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Shop Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shop Details</h2>
              <div className="space-y-3">
                <p className="text-lg font-medium text-gray-900">{fabric.shop.name}</p>
                <p className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  {fabric.shop.address}
                </p>
                <p className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-2" />
                  {fabric.shop.phone}
                </p>
                <p className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  {fabric.shop.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Customer Reviews</h2>
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Write a Review
              </button>
            </div>

            {/* Review List */}
            <div className="space-y-6">
              {fabric.reviews.map(review => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating ? 'fill-current' : 'stroke-current'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">
                      by {review.userName} • {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            rating <= newReview.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview(prev => ({ ...prev, comment: e.target.value }))
                    }
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default FabricDetails;
