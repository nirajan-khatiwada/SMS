import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Package, 
  FileText, 
  Hash, 
  Save, 
  ArrowLeft, 
  X 
} from 'lucide-react';
import { postProduct } from '../../api/nurse';
import { toast } from 'react-toastify';

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div>
          <div className="h-6 bg-gray-200 rounded-lg w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-64"></div>
        </div>
      </div>
    </div>
    
    {/* Form Skeleton */}
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
        <div className="flex space-x-4 pt-6 border-t border-gray-100/50">
          <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
          <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
        </div>
      </div>
    </div>
  </div>
);

const AddProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: ''
  });

  const [errors, setErrors] = useState({});

  // Mutation for adding product
  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: postProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product added successfully!');
      navigate('/nurse/total-product/');
    },
    onError: (error) => {
      toast.error('Error adding product. Please try again.');
      console.error('Error adding product:', error);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'Stock must be a valid number (0 or greater)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      stock: parseInt(formData.stock)
    };

    mutate(productData);
  };

  const handleCancel = () => {
    navigate('/nurse/total-product/');
  };

  return (
    <div className="flex-1 bg-gray-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Add New Product
                </h1>
                <p className="text-gray-600">
                  Add a new product to the inventory system
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-100/50 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Package size={16} className="text-blue-600" />
                <span>Product Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                  errors.name ? 'border-red-300 bg-red-50/50' : 'border-gray-200/50 bg-gray-50/50'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <X size={14} />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <FileText size={16} className="text-blue-600" />
                <span>Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 resize-none ${
                  errors.description ? 'border-red-300 bg-red-50/50' : 'border-gray-200/50 bg-gray-50/50'
                }`}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <X size={14} />
                  <span>{errors.description}</span>
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Hash size={16} className="text-purple-600" />
                <span>Stock Quantity</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className={`w-full md:w-1/3 px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                  errors.stock ? 'border-red-300 bg-red-50/50' : 'border-gray-200/50 bg-gray-50/50'
                }`}
                placeholder="Enter stock quantity"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <X size={14} />
                  <span>{errors.stock}</span>
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-100/50">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Adding Product...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Add Product</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <ArrowLeft size={18} />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;