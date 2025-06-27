import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Save, 
  X, 
  Edit3, 
  Trash2, 
  Filter, 
  BookOpen, 
  Users, 
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { 
  getClasses, 
  createClass, 
  deleteClass, 
  updateClass,
  getSections,
  createSection,
  deleteSection,
  updateSection
} from '../../api/libriary';

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Forms Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((item) => (
        <div key={item} className="bg-white/70 rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
          <div className="h-6 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
            <div className="flex space-x-3">
              <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
    
    {/* Table Skeleton */}
    <div className="bg-white/70 rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
      <div className="h-6 bg-gray-200 rounded-lg w-1/4 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LMClass = () => {
  const queryClient = useQueryClient();
  
  // State management
  const [className, setClassName] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Fetch Classes
  const { data: classes = [], isLoading: classesLoading, error: classesError } = useQuery({
    queryKey: ['classes'],
    queryFn: getClasses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch Sections
  const { data: sections = [], isLoading: sectionsLoading, error: sectionsError } = useQuery({
    queryKey: ['sections'],
    queryFn: getSections,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations for Classes
  const createClassMutation = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setClassName('');
      toast.success('Class added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add class: ' + (error.response?.data?.message || error.message));
    },
  });

  const updateClassMutation = useMutation({
    mutationFn: ({ id, data }) => updateClass(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setEditingItem(null);
      setEditValue('');
      toast.success('Class updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update class: ' + (error.response?.data?.message || error.message));
    },
  });

  const deleteClassMutation = useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete class: ' + (error.response?.data?.message || error.message));
    },
  });

  // Mutations for Sections
  const createSectionMutation = useMutation({
    mutationFn: createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      setSectionName('');
      toast.success('Section added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add section: ' + (error.response?.data?.message || error.message));
    },
  });

  const updateSectionMutation = useMutation({
    mutationFn: ({ id, data }) => updateSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      setEditingItem(null);
      setEditValue('');
      toast.success('Section updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update section: ' + (error.response?.data?.message || error.message));
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast.success('Section deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete section: ' + (error.response?.data?.message || error.message));
    },
  });

  // Combine classes and sections into one history array
  const combinedHistory = useMemo(() => [
    ...classes.map(cls => ({ ...cls, type: 'Class', uniqueKey: `class-${cls.id}` })),
    ...sections.map(section => ({ ...section, type: 'Section', uniqueKey: `section-${section.id}` }))
  ], [classes, sections]);

  // Filter and search logic
  useEffect(() => {
    let filtered = combinedHistory;

    // Apply filter
    if (filter === 'classes') {
      filtered = filtered.filter(item => item.type === 'Class');
    } else if (filter === 'sections') {
      filtered = filtered.filter(item => item.type === 'Section');
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by creation date (newest first)
    setFilteredHistory(filtered);
  }, [combinedHistory, filter, searchQuery]);

  // Handle adding new class
  const handleAddClass = () => {
    if (!className.trim()) {
      toast.error('Please enter a class name');
      return;
    }

    createClassMutation.mutate({ name: className.trim() });
  };

  // Handle adding new section
  const handleAddSection = () => {
    if (!sectionName.trim()) {
      toast.error('Please enter a section name');
      return;
    }

    createSectionMutation.mutate({ name: sectionName.trim() });
  };

  // Handle editing
  const startEdit = (item) => {
    setEditingItem(item.uniqueKey);
    setEditValue(item.name);
  };

  const saveEdit = () => {
    if (!editValue.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    const editingItemData = combinedHistory.find(item => item.uniqueKey === editingItem);
    
    if (editingItemData.type === 'Class') {
      updateClassMutation.mutate({ 
        id: editingItemData.id, 
        data: { name: editValue.trim() } 
      });
    } else {
      updateSectionMutation.mutate({ 
        id: editingItemData.id, 
        data: { name: editValue.trim() } 
      });
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValue('');
  };

  // Handle deletion
  const handleDelete = (id, type) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (type === 'Class') {
        deleteClassMutation.mutate(id);
      } else {
        deleteSectionMutation.mutate(id);
      }
    }
  };

  // Cancel handlers
  const handleCancelClass = () => {
    setClassName('');
  };

  const handleCancelSection = () => {
    setSectionName('');
  };

  // Loading state
  const isLoading = classesLoading && sectionsLoading;
  
  // Error handling
  if (classesError || sectionsError) {
    return (
      <div className="flex-1 p-4 md:p-6 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50/80 border border-red-200/50 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Error Loading Data</h3>
            </div>
            <p className="text-red-700">
              {classesError?.message || sectionsError?.message || 'Failed to load classes and sections'}
            </p>
            <button
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['classes'] });
                queryClient.invalidateQueries({ queryKey: ['sections'] });
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-4 md:p-6 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Class & Section Management</h1>
              <p className="text-gray-600">Manage classes and sections independently</p>
            </div>
          </div>
        </div>

        {/* Add Forms Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Class Form */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Add New Class</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Enter class name (e.g., Grade 10)"
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddClass()}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleAddClass}
                  disabled={createClassMutation.isPending}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                >
                  <Save size={16} />
                  <span>{createClassMutation.isPending ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancelClass}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 font-medium"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Add Section Form */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Add New Section</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Name
                </label>
                <input
                  type="text"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  placeholder="Enter section name (e.g., Section A)"
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSection()}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleAddSection}
                  disabled={createSectionMutation.isPending}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                >
                  <Save size={16} />
                  <span>{createSectionMutation.isPending ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancelSection}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 font-medium"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Class & Section History</h2>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100/50 px-3 py-1 rounded-full">
              {filteredHistory.length} items
            </span>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search classes and sections..."
                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              />
            </div>

            {/* Filter Options */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Show All' },
                { key: 'classes', label: 'Only Classes' },
                { key: 'sections', label: 'Only Sections' }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                    filter === option.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100/50 text-gray-600 hover:bg-gray-200/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Class Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Section Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center space-y-2">
                        <BookOpen className="w-12 h-12 text-gray-300" />
                        <span>No items found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item) => (
                    <tr key={item.uniqueKey} className="border-b border-gray-100/50 hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="py-3 px-4">
                        {editingItem === item.uniqueKey && item.type === 'Class' ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium text-gray-900">
                            {item.type === 'Class' ? item.name : '-'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingItem === item.uniqueKey && item.type === 'Section' ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium text-gray-900">
                            {item.type === 'Section' ? item.name : '-'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.type === 'Class' 
                            ? 'bg-blue-50/80 text-blue-600 border border-blue-200/50' 
                            : 'bg-purple-50/80 text-purple-600 border border-purple-200/50'
                        }`}>
                          {item.type === 'Class' ? <BookOpen size={12} className="mr-1" /> : <Users size={12} className="mr-1" />}
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {editingItem === item.uniqueKey ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={saveEdit}
                              disabled={updateClassMutation.isPending || updateSectionMutation.isPending}
                              className="p-1 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-200"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => startEdit(item)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.type)}
                              disabled={deleteClassMutation.isPending || deleteSectionMutation.isPending}
                              className="p-1 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-200"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Card Layout - Mobile */}
          <div className="md:hidden space-y-3">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center space-y-2">
                  <BookOpen className="w-12 h-12 text-gray-300" />
                  <span>No items found</span>
                </div>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div key={item.uniqueKey} className="bg-white/50 rounded-lg p-4 border border-gray-200/50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.type === 'Class' 
                          ? 'bg-blue-50/80 text-blue-600 border border-blue-200/50' 
                          : 'bg-purple-50/80 text-purple-600 border border-purple-200/50'
                      }`}>
                        {item.type === 'Class' ? <BookOpen size={12} className="mr-1" /> : <Users size={12} className="mr-1" />}
                        {item.type}
                      </span>
                    </div>
                    
                    {editingItem === item.uniqueKey ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={saveEdit}
                          disabled={updateClassMutation.isPending || updateSectionMutation.isPending}
                          className="p-2 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.type)}
                          disabled={deleteClassMutation.isPending || deleteSectionMutation.isPending}
                          className="p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {item.type === 'Class' && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Class Name</label>
                        {editingItem === item.uniqueKey ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                            autoFocus
                          />
                        ) : (
                          <div className="mt-1 font-medium text-gray-900">{item.name}</div>
                        )}
                      </div>
                    )}
                    
                    {item.type === 'Section' && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Section Name</label>
                        {editingItem === item.uniqueKey ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                            autoFocus
                          />
                        ) : (
                          <div className="mt-1 font-medium text-gray-900">{item.name}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMClass