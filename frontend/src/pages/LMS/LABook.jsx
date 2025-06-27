import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, ArrowLeft, Save, X, Library, Users, Hash, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery,useQueryClient } from '@tanstack/react-query';
import {getClasses,getSections,postBook} from './../../api/libriary.jsx';
import { toast } from 'react-toastify'; 



const LoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div>
          <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-64"></div>
        </div>
      </div>
    </div>
    
    {/* Form Skeleton */}
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((item) => (
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

const LABook = () => {
  const queryClient = useQueryClient();

  const {data:classes=[],isPending:classLoading} = useQuery({
    queryKey: ['classes'],
    queryFn: getClasses,
    staleTime: 1000 * 60 * 5, // 5 minutes

  })

  const {data:sections=[],isPending:sectionsLoading} = useQuery({
    queryKey: ['sections'],
    queryFn: getSections,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  console.log(sections)

  const {mutate,isPending:isSubmitting} = useMutation({
    mutationFn: postBook,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['books']);
      toast.success('Book added successfully!');
    },
    onError: (error) => {
      toast.error('Error adding book:', error);
    }

  })

  



  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    class_name: '',
    section: '',
    quantity: 1
  });
  const [errors, setErrors] = useState({});
const isLoading = classLoading && sectionsLoading;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name == 'class_name' || name == 'section' || name == 'quantity') {
      // Convert to integer for class_name and section
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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
      newErrors.name = 'Book name is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author name is required';
    }
    
    if (!formData.class_name) {
      newErrors.class_name = 'Class selection is required';
    }
    
    if (!formData.section) {
      newErrors.section = 'Section selection is required';
    }
    
    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
   
 
      mutate(formData);
      // Navigate back to book history page
      
  
  };

  const handleCancel = () => {
    navigate('/librarian/all-books/');
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50/30 min-h-screen">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

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
                  Add New Book
                </h1>
                <p className="text-gray-600">
                  Add a new book to the library collection
                </p>
              </div>
            </div>
           
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-100/50 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Book Name */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <BookOpen size={16} className="text-blue-600" />
                <span>Book Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                  errors.name ? 'border-red-300 bg-red-50/50' : 'border-gray-200/50 bg-gray-50/50'
                }`}
                placeholder="Enter book title"
              />
              {errors.name && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <X size={14} />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Author Name */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <User size={16} className="text-blue-600" />
                <span>Author Name</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                  errors.author ? 'border-red-300 bg-red-50/50' : 'border-gray-200/50 bg-gray-50/50'
                }`}
                placeholder="Enter author name"
              />
              {errors.author && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <X size={14} />
                  <span>{errors.author}</span>
                </p>
              )}
            </div>

            {/* Class and Section Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Library size={16} className="text-blue-600" />
                  <span>Class</span>
                </label>
                <select
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                    errors.class_name ? 'border-red-300 bg-red-50/50' : 'border-gray-200/50 bg-gray-50/50'
                  }`}
                >
                  <option value="">Select Class</option>
                  {classes?.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {errors.class_name && (
                  <p className="text-red-500 text-sm flex items-center space-x-1">
                    <X size={14} />
                    <span>{errors.class_name}</span>
                  </p>
                )}
              </div>

              {/* Section */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Users size={16} className="text-blue-600" />
                  <span>Section</span>
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                    errors.section ? 'border-red-300 bg-red-50/50' : 'border-gray-200/50 bg-gray-50/50'
                  }`}
                >
                  <option value="">Select Section</option>
                  {sections?.map((section) => (
                    <option key={section.id} value={section.id}>
                      Section {section.name}
                    </option>
                  ))}
                </select>
                {errors.section && (
                  <p className="text-red-500 text-sm flex items-center space-x-1">
                    <X size={14} />
                    <span>{errors.section}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Hash size={16} className="text-blue-600" />
                <span>Quantity</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                className={`w-full md:w-1/3 px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                  errors.quantity ? 'border-red-300 bg-red-50/50' : 'border-gray-200/50 bg-gray-50/50'
                }`}
                placeholder="Enter quantity"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <X size={14} />
                  <span>{errors.quantity}</span>
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-100/50">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Adding Book...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Add Book</span>
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

export default LABook;