import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  X,
  Upload,
  Save,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = ['Shirts', 'Pants', 'Suits', 'Traditional Wear'];
const MEASUREMENTS = [
  'Chest',
  'Waist',
  'Hip',
  'Shoulder',
  'Sleeve Length',
  'Inseam',
  'Neck',
  'Bicep',
  'Wrist',
  'Length'
];

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    measurements: [],
    images: []
  });
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || isNaN(Number(formData.price))) newErrors.price = 'Please enter a valid price';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (formData.images.length === 0) newErrors.images = 'Please upload at least one image';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleMeasurementToggle = (measurement) => {
    setFormData(prev => ({
      ...prev,
      measurements: prev.measurements.includes(measurement)
        ? prev.measurements.filter(m => m !== measurement)
        : [...prev.measurements, measurement]
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...validFiles] }));
    if (errors.images) setErrors(prev => ({ ...prev, images: undefined }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('measurements', JSON.stringify(formData.measurements));
      formData.images.forEach(image => formDataToSend.append('images', image));

      const token = localStorage.getItem('token');
      await fetch('/api/tailor/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend
      });

      navigate('/tailor/products');
    } catch (error) {
      console.error('Failed to create product:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create product. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      measurements: [],
      images: []
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Add New Product
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
                />
                {errors.name && <p className="text-red-600 text-sm mt-2">{errors.name}</p>}
              </div>
              {/* Add other input fields similarly */}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
