import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  SortDesc,
  RefreshCw,
  Filter,
  MoreHorizontal,
  Library,
  User,
  Hash,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllBooks, deleteBook as deleteBookAPI, updateBook as updateBookAPI, getClasses, getSections } from '../../api/libriary.jsx';

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
              <div className="h-4 bg-gray-200 rounded-lg w-16"></div>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded-lg w-8"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-8"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-8"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-lg hover:bg-white/80 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100/80 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                {book.name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center space-x-1">
                <User size={14} />
                <span>by {book.author}</span>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Library size={14} className="text-blue-500" />
              <span>{book.classes}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Users size={14} className="text-green-500" />
              <span>Section {book.sections}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Hash size={14} className="text-purple-500" />
              <span>{book.quantity} copies</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar size={14} className="text-orange-500" />
              <span>{book.created_at ? new Date(book.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
        
          <button
            onClick={() => onEdit(book)}
            className="p-2 text-green-600 hover:bg-green-50/80 rounded-lg transition-all duration-300"
            title="Edit Book"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(book)}
            className="p-2 text-red-600 hover:bg-red-50/80 rounded-lg transition-all duration-300"
            title="Delete Book"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ book, isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-md w-full shadow-2xl border border-gray-100/50">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Book</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          
          <div className="bg-gray-50/50 rounded-xl p-4 mb-6">
            <p className="text-gray-700">
              Are you sure you want to delete <strong>"{book.name}"</strong> by {book.author}?
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

const EditBookModal = ({ book, isOpen, onClose, onSave, isSaving, classes = [], sections = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    class_name: '',
    section: '',
    quantity: ''
  });

  useEffect(() => {
    if (book && classes.length > 0 && sections.length > 0) {
      // Find the class and section IDs from their names
      const selectedClassId = classes.find(cls => cls.name === book.classes)?.id || '';
      const selectedSectionId = sections.find(sec => sec.name === book.sections)?.id || '';
      
      setFormData({
        name: book.name || '',
        author: book.author || '',
        class_name: selectedClassId,
        section: selectedSectionId,
        quantity: book.quantity?.toString() || ''
      });
    }
  }, [book, classes, sections]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.author.trim() || !formData.quantity) {
      return;
    }
    onSave({
      ...formData,
      quantity: parseInt(formData.quantity)
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen || !book) return null;

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
                <h3 className="text-xl font-semibold text-gray-900">Edit Book</h3>
                <p className="text-sm text-gray-600">Update book information</p>
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
            {/* Book Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
                placeholder="Enter book name"
                required
                disabled={isSaving}
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
                placeholder="Enter author name"
                required
                disabled={isSaving}
              />
            </div>

            {/* Class and Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class *
                </label>
                <select
                  value={formData.class_name}
                  onChange={(e) => handleChange('class_name', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
                  required
                  disabled={isSaving}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section *
                </label>
                <select
                  value={formData.section}
                  onChange={(e) => handleChange('section', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
                  required
                  disabled={isSaving}
                >
                  <option value="">Select Section</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
                placeholder="Enter quantity"
                required
                disabled={isSaving}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isSaving || !formData.name.trim() || !formData.author.trim() || !formData.quantity}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Update Book</span>
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

const LBookHistory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, book: null });
  const [editModal, setEditModal] = useState({ isOpen: false, book: null });

  // Fetch books using TanStack Query
  const { 
    data: books = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['books'],
    queryFn: getAllBooks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch classes for edit modal
  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: getClasses,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch sections for edit modal
  const { data: sections = [] } = useQuery({
    queryKey: ['sections'],
    queryFn: getSections,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBookAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setDeleteModal({ isOpen: false, book: null });
    },
    onError: (error) => {
      console.error('Error deleting book:', error);
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateBookAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setEditModal({ isOpen: false, book: null });
    },
    onError: (error) => {
      console.error('Error updating book:', error);
    }
  });

  // Filter and search logic
  useEffect(() => {
    let filtered = [...books];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (book) =>
          book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Class filter
    if (selectedClass !== 'all') {
      filtered = filtered.filter((book) => book.classes === selectedClass);
    }

    // Section filter
    if (selectedSection !== 'all') {
      filtered = filtered.filter((book) => book.sections === selectedSection);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'author') {
        return a.author.localeCompare(b.author);
      }
      return 0;
    });

    setFilteredBooks(filtered);
  }, [books, searchQuery, selectedClass, selectedSection, sortBy]);

  const handleAddNew = () => {
    navigate('/librarian/add-book/');
  };

  const handleEdit = (book) => {
    setEditModal({ isOpen: true, book });
  };

  const handleSaveEdit = (bookData) => {
    if (!editModal.book) return;
    
    updateMutation.mutate({
      id: editModal.book.id,
      data: bookData
    });
  };


  const handleDelete = (book) => {
    setDeleteModal({ isOpen: true, book });
  };

  const confirmDelete = () => {
    if (!deleteModal.book) return;
    
    deleteMutation.mutate(deleteModal.book.id);
  };

  const handleRefresh = () => {
    refetch();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedClass('all');
    setSelectedSection('all');
    setSortBy('newest');
  };

  if (error) {
    return (
      <div className="flex-1 bg-gray-50/30 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Books
            </h3>
            <p className="text-gray-600 mb-4">
              {error.message || 'There was an error loading the books. Please try again.'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
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
                <Library className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Book Management
                </h1>
                <p className="text-gray-600">
                  Manage your library collection and inventory
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
                className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium"
              >
                <Plus size={18} />
                <span>Add Book</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
              />
            </div>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
            >
              <option value="all">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>

            {/* Section Filter */}
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
            >
              <option value="all">All Sections</option>
              {sections.map((section) => (
                <option key={section.id} value={section.name}>
                  {section.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Book Name A-Z</option>
              <option value="author">Author A-Z</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredBooks.length} of {books.length} books
          </span>
          <div className="flex items-center space-x-4">
            {(searchQuery || selectedClass !== 'all' || selectedSection !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            )}
            <div className="flex items-center space-x-2">
              <SortDesc size={16} />
              <span>
                Sorted by {sortBy === 'newest' ? 'newest first' : 
                          sortBy === 'oldest' ? 'oldest first' :
                          sortBy === 'name' ? 'book name' : 'author name'}
              </span>
            </div>
          </div>
        </div>

        {/* Books List */}
        <div className="space-y-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No books found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedClass !== 'all' || selectedSection !== 'all'
                  ? "Try adjusting your filters to see more books."
                  : "Get started by adding your first book to the library."}
              </p>
              <div className="space-x-3">
                {(searchQuery || selectedClass !== 'all' || selectedSection !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Add First Book
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        book={deleteModal.book}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, book: null })}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />

      {/* Edit Book Modal */}
      <EditBookModal
        book={editModal.book}
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, book: null })}
        onSave={handleSaveEdit}
        isSaving={updateMutation.isPending}
        classes={classes}
        sections={sections}
      />
    </div>
  );
};

export default LBookHistory;
