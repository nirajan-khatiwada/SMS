import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  BookOpen, 
  Users, 
  Calendar,
  FileText,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
  Award,
  Search
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllAssignments, 
  getAllAssignmentSubmition,
  updateAssignmentSubmission
} from '../../api/teacher';

const ASubmission = () => {
  const queryClient = useQueryClient();

  // State management
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, submitted, not_submitted
  const [sortBy, setSortBy] = useState('name'); // name, roll_number, status
  const [sortOrder, setSortOrder] = useState('asc');
  const [feedbackInputs, setFeedbackInputs] = useState({}); // Track local feedback inputs
  
  // Refs for debouncing
  const feedbackTimeouts = useRef({});

  // Fetch assignments
  const { data: assignments = [], isLoading: loadingAssignments } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAllAssignments
  });

  // Fetch assignment submissions when assignment is selected
  const { data: submissions = [], isLoading: loadingSubmissions, refetch } = useQuery({
    queryKey: ['assignment-submissions', selectedAssignment],
    queryFn: () => getAllAssignmentSubmition(selectedAssignment),
    enabled: !!selectedAssignment
  });

  // Update submission mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateAssignmentSubmission(id, data),
    onSuccess: () => {
      toast.success('Submission updated successfully');
      queryClient.invalidateQueries(["assignment-submissions"]);
      queryClient.invalidateQueries(["assignments"]);
      refetch();
    },
    onError: (error) => {
      console.error('Update submission error:', error);
      toast.error('Failed to update submission');
    }
  });

  // Handle grade change
  const handleGradeChange = (submissionId, grade) => {
    updateMutation.mutate({
      id: submissionId,
      data: { grade }
    });
  };

  // Handle feedback change with debouncing
  const handleFeedbackChange = useCallback((submissionId, feedback) => {
    // Update local state immediately for responsive UI
    setFeedbackInputs(prev => ({
      ...prev,
      [submissionId]: feedback
    }));

    // Clear existing timeout for this submission
    if (feedbackTimeouts.current[submissionId]) {
      clearTimeout(feedbackTimeouts.current[submissionId]);
    }

    // Set new timeout to submit after user stops typing
    feedbackTimeouts.current[submissionId] = setTimeout(() => {
      updateMutation.mutate({
        id: submissionId,
        data: { feedback }
      });
      // Clean up timeout reference
      delete feedbackTimeouts.current[submissionId];
    }, 1000); // 1 second delay after user stops typing
  }, [updateMutation]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(feedbackTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  // Initialize feedback inputs when submissions change
  useEffect(() => {
    if (submissions.length > 0) {
      const initialFeedback = {};
      submissions.forEach(submission => {
        initialFeedback[submission.id] = submission.feedback || '';
      });
      setFeedbackInputs(initialFeedback);
    }
  }, [submissions]);

  // Get selected assignment details
  const selectedAssignmentDetails = useMemo(() => {
    return assignments.find(assignment => assignment.id == selectedAssignment);
  }, [assignments, selectedAssignment]);

  // Filter and sort submissions
  const filteredAndSortedSubmissions = useMemo(() => {
    let filtered = [...submissions];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(submission =>
        `${submission.student.first_name} ${submission.student.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submission.student.roll_number.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(submission => {
        if (filterStatus === 'submitted') return submission.status;
        if (filterStatus === 'not_submitted') return !submission.status;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.student.first_name} ${a.student.last_name}`.toLowerCase();
          bValue = `${b.student.first_name} ${b.student.last_name}`.toLowerCase();
          break;
        case 'roll_number':
          aValue = parseInt(a.student.roll_number);
          bValue = parseInt(b.student.roll_number);
          break;
        case 'status':
          aValue = a.status ? 1 : 0;
          bValue = b.status ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [submissions, searchTerm, filterStatus, sortBy, sortOrder]);

  // Performance status options
  const performanceOptions = [
    { value: '', label: 'Not Graded', color: 'bg-gray-50 text-gray-600 border-gray-200' },
    { value: 'Good', label: 'Good', color: 'bg-green-50 text-green-600 border-green-200' },
    { value: 'OK', label: 'OK', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    { value: 'Bad', label: 'Bad', color: 'bg-red-50 text-red-600 border-red-200' },
    { value: 'Late', label: 'Late Submit', color: 'bg-orange-50 text-orange-600 border-orange-200' }
  ];

  const getStatusBadge = (submission) => {
    if (submission.status) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50/80 text-green-600 border border-green-200/50">
          <CheckCircle size={12} />
          <span>Submitted</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50/80 text-red-600 border border-red-200/50">
          <XCircle size={12} />
          <span>Not Submitted</span>
        </span>
      );
    }
  };

  const getGradeBadge = (grade) => {
    const option = performanceOptions.find(opt => opt.value === grade);
    if (!option || !grade) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
          Not Graded
        </span>
      );
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${option.color}`}>
        {option.label}
      </span>
    );
  };

  if (loadingAssignments) {
    return (
      <div className="flex-1 bg-gray-50/30 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/70 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assignment Submissions</h1>
                <p className="text-gray-600">Review and grade student assignment submissions</p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              disabled={!selectedAssignment}
              className="p-3 bg-blue-50/80 text-blue-600 rounded-xl hover:bg-blue-100/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Assignment Selection */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Select Assignment</h2>
            </div>
            
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
            >
              <option value="">Choose an assignment...</option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.title} - {assignment.class_name} {assignment.section} ({assignment.subject})
                </option>
              ))}
            </select>

            {selectedAssignmentDetails && (
              <div className="mt-4 p-4 bg-blue-50/30 rounded-xl border border-blue-200/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {selectedAssignmentDetails.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {selectedAssignmentDetails.class_name} - {selectedAssignmentDetails.section}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Due: {new Date(selectedAssignmentDetails.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{selectedAssignmentDetails.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Search - Only show when assignment is selected */}
        {selectedAssignment && (
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by student name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="not_submitted">Not Submitted</option>
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="roll_number-asc">Roll Number (Low-High)</option>
                <option value="roll_number-desc">Roll Number (High-Low)</option>
                <option value="status-desc">Submitted First</option>
                <option value="status-asc">Not Submitted First</option>
              </select>
            </div>
          </div>
        )}

        {/* Submissions List */}
        {selectedAssignment && (
          <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-100/50 overflow-hidden">
            {loadingSubmissions ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl animate-pulse">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredAndSortedSubmissions.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No students have been assigned this assignment yet.'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100/50">
                {filteredAndSortedSubmissions.map((submission, index) => (
                  <div
                    key={submission.id}
                    className={`p-6 transition-all duration-300 hover:bg-gray-50/50 ${
                      index % 2 === 0 ? 'bg-white/30' : 'bg-gray-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Student Info */}
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {submission.student.first_name.charAt(0)}{submission.student.last_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-gray-900">
                              {submission.student.first_name} {submission.student.last_name}
                            </h3>
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100/80 text-gray-600 rounded-lg">
                              Roll: {submission.student.roll_number}
                            </span>
                            {getStatusBadge(submission)}
                          </div>
                          {submission.submitted_date && (
                            <p className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                              <Clock size={12} />
                              <span>Submitted: {new Date(submission.submitted_date).toLocaleDateString()}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Grade and Actions */}
                      <div className="flex items-center space-x-4">
                        {/* Current Grade Display */}
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Grade</p>
                          {getGradeBadge(submission.grade)}
                        </div>

                        {/* Grade Selection */}
                        <div className="min-w-[140px]">
                          <select
                            value={submission.grade || ''}
                            onChange={(e) => handleGradeChange(submission.id, e.target.value)}
                            disabled={updateMutation.isPending}
                            className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 disabled:opacity-50"
                          >
                            {performanceOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Feedback Input */}
                        <div className="min-w-[200px]">
                          <input
                            type="text"
                            placeholder="Add feedback..."
                            value={feedbackInputs[submission.id] || ''}
                            onChange={(e) => handleFeedbackChange(submission.id, e.target.value)}
                            disabled={updateMutation.isPending}
                            className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Feedback Display */}
                    {(submission.feedback || feedbackInputs[submission.id]) && (
                      <div className="mt-4 p-3 bg-blue-50/30 rounded-lg border border-blue-200/30">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Feedback:</span> {submission.feedback || feedbackInputs[submission.id]}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Summary - Only show when assignment is selected */}
        {selectedAssignment && !loadingSubmissions && submissions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow-sm border border-gray-100/50">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow-sm border border-gray-100/50">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {submissions.filter(s => s.status).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow-sm border border-gray-100/50">
              <div className="flex items-center space-x-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Not Submitted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {submissions.filter(s => !s.status).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow-sm border border-gray-100/50">
              <div className="flex items-center space-x-3">
                <Award className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Graded</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {submissions.filter(s => s.grade).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Assignment Selected State */}
        {!selectedAssignment && (
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Assignment</h3>
            <p className="text-gray-500">Choose an assignment from the dropdown above to view and grade student submissions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ASubmission;