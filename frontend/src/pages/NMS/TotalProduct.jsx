import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  RefreshCw,
  SortDesc,
  FileText,
  Hash,
  AlertTriangle,
  X,
  Save
} from 'lucide-react';
import { getProducts, updateProduct, deleteProduct } from '../../api/nurse';
import { toast } from 'react-toastify';

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((item) => (
      <div
        key={item}
        className="bg-white/70 rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded-lg w-8"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-8"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ProductCard = ({ product, onEdit, onDelete }) => {
  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'text-red-600', bg: 'bg-red-50/80', border: 'border-red-200/50', text: 'Out of Stock' };
    if (stock <= 10) return { color: 'text-yellow-600', bg: 'bg-yellow-50/80', border: 'border-yellow-200/50', text: 'Low Stock' };
    return { color: 'text-green-600', bg: 'bg-green-50/80', border: 'border-green-200/50', text: 'In Stock' };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-lg hover:bg-white/80 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100/80 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {product.description}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Hash size={14} className="text-purple-500" />
              <span>Stock: {product.stock} units</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color} border ${stockStatus.border}`}>
                <div className={`w-2 h-2 rounded-full mr-1 ${product.stock === 0 ? 'bg-red-500' : product.stock <= 10 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                {stockStatus.text}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-blue-600 hover:bg-blue-50/80 rounded-lg transition-all duration-300"
            title="Edit Product"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 text-red-600 hover:bg-red-50/80 rounded-lg transition-all duration-300"
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ product, isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-md w-full shadow-2xl border border-gray-100/50">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          
          <div className="bg-gray-50/50 rounded-xl p-4 mb-6">
            <p className="text-gray-700">
              Are you sure you want to delete <strong>"{product.name}"</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Current stock: {product.stock} units
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Delete</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditProductModal = ({ product, isOpen, onClose, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        stock: product.stock?.toString() || ''
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.stock) {
      return;
    }
    onSave({
      ...formData,
      stock: parseInt(formData.stock)
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100/50 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Edit Product</h3>
                <p className="text-sm text-gray-600">Update product information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
                placeholder="Enter product name"
                required
                disabled={isSaving}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 resize-none"
                placeholder="Enter product description"
                required
                disabled={isSaving}
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
                placeholder="Enter stock quantity"
                required
                disabled={isSaving}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isSaving || !formData.name.trim() || !formData.description.trim() || !formData.stock}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Update Product</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const TotalProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  const [editModal, setEditModal] = useState({ isOpen: false, product: null });

  // Fetch products using TanStack Query
  const { 
    data: products = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteModal({ isOpen: false, product: null });
      toast.success('Product deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product. Please try again.');
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditModal({ isOpen: false, product: null });
      toast.success('Product updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast.error('Error updating product. Please try again.');
    }
  });

  // Filter and search logic
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.id - a.id; // Assuming higher ID means newer
      } else if (sortBy === 'oldest') {
        return a.id - b.id;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'stock') {
        return b.stock - a.stock;
      }
      return 0;
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy]);

  const handleAddNew = () => {
    navigate('/nurse/add-product/');
  };

  const handleEdit = (product) => {
    setEditModal({ isOpen: true, product });
  };

  const handleSaveEdit = (productData) => {
    if (!editModal.product) return;
    
    updateMutation.mutate({
      id: editModal.product.id,
      data: productData
    });
  };

  const handleDelete = (product) => {
    setDeleteModal({ isOpen: true, product });
  };

  const confirmDelete = () => {
    if (!deleteModal.product) return;
    
    deleteMutation.mutate(deleteModal.product.id);
  };

  const handleRefresh = () => {
    refetch();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('newest');
  };

  if (error) {
    return (
      <div className="flex-1 bg-gray-50/30 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Products
            </h3>
            <p className="text-gray-600 mb-4">
              {error.message || 'There was an error loading the products. Please try again.'}
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50/30 min-h-screen">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header Skeleton */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div>
                  <div className="h-6 bg-gray-200 rounded-lg w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-64"></div>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="w-32 h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
          
          {/* Filters Skeleton */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
          
          {/* Content Skeleton */}
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
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Product Management
                </h1>
                <p className="text-gray-600">
                  Manage your inventory and product collection
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="p-3 bg-blue-50/80 text-blue-600 rounded-xl hover:bg-blue-100/80 transition-all duration-300"
                disabled={isLoading}
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={handleAddNew}
                className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={16} />
                <span className="font-medium">Add Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Product Name A-Z</option>
              <option value="stock">Highest Stock</option>
            </select>

            {/* Clear Filters */}
            {searchQuery && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl hover:bg-gray-100/50 transition-all duration-300 text-gray-600 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>
          <div className="flex items-center space-x-4">
            {searchQuery && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Search
              </button>
            )}
            <div className="flex items-center space-x-2">
              <SortDesc size={16} />
              <span>
                Sorted by {sortBy === 'newest' ? 'newest first' : 
                          sortBy === 'oldest' ? 'oldest first' :
                          sortBy === 'name' ? 'product name' : 'stock quantity'}
              </span>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "Try adjusting your search to see more products."
                  : "Get started by adding your first product to the inventory."}
              </p>
              <div className="space-x-3">
                {searchQuery && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Add First Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        product={deleteModal.product}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        product={editModal.product}
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, product: null })}
        onSave={handleSaveEdit}
        isSaving={updateMutation.isPending}
      />
    </div>
  );
};

export default TotalProduct;