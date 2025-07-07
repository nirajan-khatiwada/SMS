import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Users,
  Edit3,
  Trash2,
  Eye,
  FileText,
  Clock,
  User,
  Save,
  X,
  RefreshCw,
  SortAsc,
  SortDesc,
  AlertTriangle,
  CheckCircle,
  Upload
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllStudentClasses, getAllStudentSections } from '../../api/student';
import { 
  getAllAssignments, 
  createAssignment, 
  updateAssignment, 
  deleteAssignment,
  
} from '../../api/teacher';
import { useContext } from 'react';
import AuthContext from '../../context/Auth';

const Assignments = () => {
  const { user } = useContext(AuthContext);
  // State management
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('due_date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    class_name: '',
    section: '',
    subject: '',
    upload_file: null,
  });

  const queryClient = useQueryClient();

  // API queries
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['student-classes'],
    queryFn: getAllStudentClasses,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    onError: (error) => {
      console.error('Failed to fetch classes:', error);
      toast.error('Failed to load classes');
    }
  });

  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ['student-sections'],
    queryFn: getAllStudentSections,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    onError: (error) => {
      console.error('Failed to fetch sections:', error);
      toast.error('Failed to load sections');
    }
  });

  // Assignments data query
  const { data: assignments = [], isLoading: assignmentsLoading, refetch } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAllAssignments,
    staleTime: 2 * 60 * 1000,
    retry: 1,
    onError: (error) => {
      console.error('Failed to fetch assignments:', error);
      toast.error('Failed to load assignments');
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createAssignment,
    onSuccess: () => {
      toast.success('Assignment created successfully');
      setShowCreateModal(false);
      resetForm();
      queryClient.invalidateQueries(['assignments']);
    },
    onError: (error) => {
      console.error('Create assignment error:', error);
      toast.error('Failed to create assignment');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateAssignment(id, data),
    onSuccess: () => {
      toast.success('Assignment updated successfully');
      setShowEditModal(false);
      resetForm();
      queryClient.invalidateQueries(['assignments']);
    },
    onError: (error) => {
      console.error('Update assignment error:', error);
      toast.error('Failed to update assignment');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => {
      toast.success('Assignment deleted successfully');
      setShowDeleteModal(false);
      setSelectedAssignment(null);
      queryClient.invalidateQueries(['assignments']);
    },
    onError: (error) => {
      console.error('Delete assignment error:', error);
      toast.error('Failed to delete assignment');
    }
  });

  // Filtered and sorted assignments
  const filteredAssignments = useMemo(() => {
    let filtered = [...assignments];

    // Filter by class and section
    if (selectedClass && selectedSection) {
      filtered = filtered.filter(assignment => 
        assignment.class_name === selectedClass && 
        assignment.section === selectedSection
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'due_date' || sortBy === 'assigned_date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [assignments, selectedClass, selectedSection, searchTerm, sortBy, sortOrder]);

  // Helper functions
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      due_date: '',
      class_name: '',
      section: '',
      subject: '',
      upload_file: null
    });
  };

  const handleCreateAssignment = () => {
    setFormData({
      ...formData,
      class_name: selectedClass,
      section: selectedSection
    });
    setShowCreateModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date,
      class_name: assignment.class_name,
      section: assignment.section,
      subject: assignment.subject,
      upload_file: null
    });
    setShowEditModal(true);
  };

  const handleDeleteAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDeleteModal(true);
  };

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Find the actual class and section IDs for backend submission
    const selectedClassObj = classes.find(cls => cls.name === formData.class_name);
    const selectedSectionObj = sections.find(sec => sec.name === formData.section);

    const formDataToSend = new FormData();
    
    // Add teacher ID automatically
    formDataToSend.append('teacher', user?.user_id || '');
    
    Object.keys(formData).forEach(key => {
      if (key === 'upload_file') {
        // Only append file if it exists and is actually a file
        if (formData[key] && formData[key] instanceof File) {
          console.log('Appending file to FormData:', formData[key].name);
          formDataToSend.append(key, formData[key]);
        } else {
          console.log('Skipping upload_file - not a valid File object:', formData[key]);
        }
      } else if (key === 'class_name') {
        // Send class ID to backend
        if (selectedClassObj?.id) {
          formDataToSend.append(key, selectedClassObj.id);
        }
      } else if (key === 'section') {
        // Send section ID to backend
        if (selectedSectionObj?.id) {
          formDataToSend.append(key, selectedSectionObj.id);
        }
      } else if (formData[key] !== null && formData[key] !== '' && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Log FormData contents
    console.log('=== FORMDATA CONTENTS ===');
    for (let pair of formDataToSend.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
    console.log('=== END FORMDATA CONTENTS ===');

    if (showEditModal && selectedAssignment) {
      updateMutation.mutate({ id: selectedAssignment.id, data: formDataToSend });
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  const getStatusColor = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-red-600 bg-red-50 border-red-200';
    if (diffDays <= 3) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStatusText = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    if (diffDays <= 3) return `Due in ${diffDays} days`;
    return `Due in ${diffDays} days`;
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded-lg w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-64"></div>
            </div>
          </div>
        </div>
      </div>
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white/70 rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (classesLoading || sectionsLoading) {
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
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Assignment Management
                </h1>
                <p className="text-gray-600">
                  Create, manage and track student assignments
                </p>
              </div>
            </div>
            <button
              onClick={refetch}
              className="p-3 bg-blue-50/80 text-blue-600 rounded-xl hover:bg-blue-100/80 transition-all duration-300"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-3 bg-white/90 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full p-3 bg-white/90 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.name}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 p-3 bg-white/90 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Sort By
              </label>
              <div className="flex space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 p-3 bg-white/90 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                >
                  <option value="due_date">Due Date</option>
                  <option value="assigned_date">Assigned Date</option>
                  <option value="title">Title</option>
                  <option value="subject">Subject</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-3 bg-white/90 border border-gray-200/50 rounded-xl hover:bg-gray-50/90 transition-all duration-300"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Create Assignment Button */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100/50">
            <p className="text-sm text-gray-600">
              {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''} found
            </p>
            {selectedClass && selectedSection && (
              <button
                onClick={handleCreateAssignment}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                <span>Create Assignment</span>
              </button>
            )}
          </div>
        </div>

        {/* No Class/Section Selected */}
        {(!selectedClass || !selectedSection) && (
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-8 shadow-sm border border-gray-100/50 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select Class and Section
            </h3>
            <p className="text-gray-600">
              Please select both a class and section to view and manage assignments.
            </p>
          </div>
        )}

        {/* Assignments List */}
        {(selectedClass && selectedSection) && (
          <>
            {assignmentsLoading ? (
              <LoadingSkeleton />
            ) : filteredAssignments.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-8 shadow-sm border border-gray-100/50 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Assignments Found
                </h3>
                <p className="text-gray-600 mb-4">
                  No assignments found for the selected class and section.
                </p>
                <button
                  onClick={handleCreateAssignment}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Assignment</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAssignments.map((assignment) => (
                  <div 
                    key={assignment.id}
                    className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {assignment.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.due_date)}`}>
                            {getStatusText(assignment.due_date)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {assignment.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{assignment.subject}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>
                              {assignment.submitted?.total_submissions || 0}/{assignment.submitted?.total_students || 0} submitted
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleViewAssignment(assignment)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditAssignment(assignment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                          title="Edit Assignment"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(assignment)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                          title="Delete Assignment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {assignment.upload_file && (
                      <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-200/50">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4" />
                          <span>Attachment: {assignment.upload_file.split('/').pop()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100/50">
              <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100/50 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {showEditModal ? 'Edit Assignment' : 'Create New Assignment'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignment Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full p-3 bg-white/90 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      placeholder="Enter assignment title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full p-3 bg-white/90 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      placeholder="Enter subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.due_date}
                      onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 bg-white/90 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full p-3 bg-white/90 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none"
                      placeholder="Enter assignment description and instructions"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload File (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => {
                          console.log('File input change event triggered');
                          console.log('e.target.files:', e.target.files);
                          console.log('e.target.files length:', e.target.files?.length);
                          
                          const file = e.target.files?.[0];
                          console.log('Selected file (raw):', file);
                          console.log('Selected file type:', typeof file);
                          console.log('Is file instance of File?', file instanceof File);
                          
                          const fileToSet = file || null;
                          console.log('File to set in state:', fileToSet);
                          console.log('File to set type:', typeof fileToSet);
                          
                          setFormData(prev => {
                            const newFormData = {...prev, upload_file: fileToSet};
                            console.log('New form data upload_file:', newFormData.upload_file);
                            console.log('New form data upload_file type:', typeof newFormData.upload_file);
                            return newFormData;
                          });
                        }}
                        className="w-full p-3 bg-white/90 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      />
                      <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    {formData.upload_file && formData.upload_file instanceof File && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          Selected file: {formData.upload_file.name}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100/50">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {(createMutation.isPending || updateMutation.isPending) 
                        ? 'Saving...' 
                        : showEditModal ? 'Update Assignment' : 'Create Assignment'
                      }
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showViewModal && selectedAssignment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100/50 flex flex-col">
              <div className="bg-white/90 backdrop-blur-xl border-b border-gray-100/50 p-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Assignment Details
                  </h2>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedAssignment(null);
                    }}
                    className="p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Assignment Info */}
                  <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 break-words">
                          {selectedAssignment.title}
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">Subject:</span>
                            <span className="text-sm font-medium text-gray-900 break-words">{selectedAssignment.subject}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">Due Date:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {new Date(selectedAssignment.due_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">Assigned:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {new Date(selectedAssignment.assigned_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="min-w-0">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Submission Progress</h4>
                        <div className="space-y-4">
                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600 break-words">
                                {selectedAssignment.submitted?.total_submissions || 0} of {selectedAssignment.submitted?.total_students || 0} submitted
                              </span>
                              <span className="font-medium text-gray-900">
                                {Math.round(selectedAssignment.submitted?.percentage || 0)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${selectedAssignment.submitted?.percentage || 0}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-green-600">
                                {selectedAssignment.submitted?.total_submissions || 0}
                              </div>
                              <div className="text-xs text-green-600">Submitted</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-orange-600">
                                {(selectedAssignment.submitted?.total_students || 0) - (selectedAssignment.submitted?.total_submissions || 0)}
                              </div>
                              <div className="text-xs text-orange-600">Pending</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Description</h4>
                    <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-200/50">
                      <p className="text-gray-700 whitespace-pre-wrap break-words">{selectedAssignment.description}</p>
                    </div>
                  </div>

                  {/* Download File */}
                  {selectedAssignment.upload_file && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Assignment File</h4>
                      <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-200/50">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 break-words">
                                {selectedAssignment.upload_file.split('/').pop()}
                              </p>
                              <p className="text-sm text-gray-600">Assignment document</p>
                            </div>
                          </div>
                          <a
                            href={selectedAssignment.upload_file}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex-shrink-0"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100/50">
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        setSelectedAssignment(null);
                      }}
                      className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        handleEditAssignment(selectedAssignment);
                      }}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Assignment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedAssignment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-md w-full shadow-2xl border border-gray-100/50">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Delete Assignment
                    </h3>
                    <p className="text-gray-600">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    You are about to delete: <span className="font-medium">{selectedAssignment.title}</span>
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedAssignment(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(selectedAssignment.id)}
                    disabled={deleteMutation.isPending}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;