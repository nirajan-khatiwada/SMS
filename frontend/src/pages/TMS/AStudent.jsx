import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  BookOpen,
  User,
  SortAsc,
  SortDesc,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  GraduationCap,
  Target,
  Award,
  Eye,
  ChevronRight,
  Loader
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { getAllStudentClasses, getAllStudentSections } from '../../api/student';
import { assignmentSummary } from '../../api/teacher';

const AStudent = () => {
  // State management
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('roll_number');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [assignmentData, setAssignmentData] = useState(null);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);

  // Fetch classes
  const { data: classes = [], isLoading: classesLoading, error: classesError } = useQuery({
    queryKey: ['student-classes'],
    queryFn: getAllStudentClasses,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Fetch sections
  const { data: sections = [], isLoading: sectionsLoading, error: sectionsError } = useQuery({
    queryKey: ['student-sections'],
    queryFn: getAllStudentSections,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Fetch assignment data when class and section are selected
  const fetchAssignmentData = async () => {
    if (!selectedClassId || !selectedSectionId) {
      setAssignmentData(null);
      return;
    }

    setIsLoadingAssignments(true);
    try {
      const data = await assignmentSummary(selectedClassId, selectedSectionId);
      setAssignmentData(data);
    } catch (error) {
      console.error('Error fetching assignment data:', error);
      toast.error('Failed to load assignment data');
      setAssignmentData(null);
    } finally {
      setIsLoadingAssignments(false);
    }
  };

  // Effect to fetch data when class/section changes
  useEffect(() => {
    fetchAssignmentData();
  }, [selectedClassId, selectedSectionId]);

  // Reset section when class changes
  useEffect(() => {
    setSelectedSection('');
    setSelectedSectionId('');
    setAssignmentData(null);
  }, [selectedClass, selectedClassId]);

  // Filtered and sorted students
  const filteredStudents = useMemo(() => {
    if (!assignmentData?.students) return [];

    let filtered = assignmentData.students;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student => 
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(query) ||
        student.roll_number.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case 'name':
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'roll_number':
          aValue = a.roll_number.toLowerCase();
          bValue = b.roll_number.toLowerCase();
          break;
        case 'submitted_assignments':
          aValue = a.submitted_assignments || 0;
          bValue = b.submitted_assignments || 0;
          break;
        case 'completion_percentage':
          aValue = a.total_assignments > 0 ? (a.submitted_assignments / a.total_assignments) * 100 : 0;
          bValue = b.total_assignments > 0 ? (b.submitted_assignments / b.total_assignments) * 100 : 0;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [assignmentData?.students, searchQuery, sortBy, sortOrder]);

  // Get performance statistics
  const performanceStats = useMemo(() => {
    if (!assignmentData?.students) return { excellent: 0, good: 0, average: 0, poor: 0 };

    const stats = { excellent: 0, good: 0, average: 0, poor: 0 };
    
    assignmentData.students.forEach(student => {
      const percentage = student.total_assignments > 0 ? 
        (student.submitted_assignments / student.total_assignments) * 100 : 0;
      
      if (percentage >= 90) stats.excellent++;
      else if (percentage >= 75) stats.good++;
      else if (percentage >= 50) stats.average++;
      else stats.poor++;
    });

    return stats;
  }, [assignmentData?.students]);

  // Get performance color and label
  const getPerformanceStatus = (submitted, total) => {
    if (total === 0) return { color: 'text-gray-600', bg: 'bg-gray-50', label: 'No Data', percentage: 0 };
    
    const percentage = (submitted / total) * 100;
    if (percentage >= 90) return { color: 'text-green-600', bg: 'bg-green-50', label: 'Excellent', percentage };
    if (percentage >= 75) return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Good', percentage };
    if (percentage >= 50) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Average', percentage };
    return { color: 'text-red-600', bg: 'bg-red-50', label: 'Poor', percentage };
  };

  // Handle student detail view
  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const isLoading = classesLoading || sectionsLoading || isLoadingAssignments;

  return (
    <div className="flex-1 bg-gray-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Assignment Tracking</h1>
                <p className="text-gray-600">Monitor student assignment submissions and performance</p>
              </div>
            </div>
            <button
              onClick={fetchAssignmentData}
              disabled={!selectedClassId || !selectedSectionId || isLoadingAssignments}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingAssignments ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Class Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Class</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setSelectedClass(selectedValue);
                  
                  const selectedClassObj = classes.find(cls => 
                    (typeof cls === 'object' ? cls.name : cls) === selectedValue
                  );
                  setSelectedClassId(typeof selectedClassObj === 'object' ? selectedClassObj.id : selectedValue);
                }}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select Class</option>
                {classes.map((cls, index) => (
                  <option key={typeof cls === 'object' ? cls.id || index : cls} value={typeof cls === 'object' ? cls.name : cls}>
                    {typeof cls === 'object' ? cls.name : cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Section</span>
              </label>
              <select
                value={selectedSection}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setSelectedSection(selectedValue);
                  
                  const selectedSectionObj = sections.find(section => 
                    (typeof section === 'object' ? section.name : section) === selectedValue
                  );
                  setSelectedSectionId(typeof selectedSectionObj === 'object' ? selectedSectionObj.id : selectedValue);
                }}
                disabled={!selectedClass}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
              >
                <option value="">Select Section</option>
                {sections.map((section, index) => (
                  <option key={typeof section === 'object' ? section.id || index : section} value={typeof section === 'object' ? section.name : section}>
                    {typeof section === 'object' ? section.name : section}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Search Students</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or roll number..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Sort By</span>
              </label>
              <div className="flex space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="roll_number">Roll Number</option>
                  <option value="name">Name</option>
                  <option value="submitted_assignments">Submitted</option>
                  <option value="completion_percentage">Completion %</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-3 bg-gray-50/50 border border-gray-200 rounded-xl hover:bg-gray-100/50 transition-colors"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {assignmentData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Students */}
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{assignmentData.total_students}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Total Assignments */}
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">{assignmentData.total_assignments}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Excellent (≥90%)</p>
                  <p className="text-2xl font-bold text-green-600">{performanceStats.excellent}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Good (≥75%)</p>
                  <p className="text-2xl font-bold text-blue-600">{performanceStats.good}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Needs Support (&lt;75%)</p>
                  <p className="text-2xl font-bold text-red-600">{performanceStats.average + performanceStats.poor}</p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {selectedClass && selectedSection ? (
          isLoadingAssignments ? (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Assignment Data</h3>
              <p className="text-gray-600">Please wait while we fetch the assignment data...</p>
            </div>
          ) : assignmentData && filteredStudents.length > 0 ? (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-100/50 overflow-hidden">
              <div className="p-6 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {assignmentData.class_name} - {assignmentData.section}
                    </h2>
                    <p className="text-gray-600">{filteredStudents.length} students found</p>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignments</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {filteredStudents.map((student) => {
                      const performance = getPerformanceStatus(student.submitted_assignments, student.total_assignments);
                      return (
                        <tr key={student.student_id} className="hover:bg-gray-50/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {student.first_name} {student.last_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.roll_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.total_assignments}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                {student.submitted_assignments}
                              </span>
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${performance.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {Math.round(performance.percentage)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${performance.bg} ${performance.color}`}>
                              {performance.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleViewStudent(student)}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : assignmentData ? (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-600">
                No students found matching your search criteria.
              </p>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Data</h3>
              <p className="text-gray-600">
                Unable to load assignment data. Please try again.
              </p>
            </div>
          )
        ) : (
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Class and Section</h3>
            <p className="text-gray-600">
              Please select both a class and section to view student assignment tracking data.
            </p>
          </div>
        )}

        {/* Student Detail Modal */}
        {showStudentModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedStudent.first_name} {selectedStudent.last_name}
                      </h2>
                      <p className="text-gray-600">Roll Number: {selectedStudent.roll_number}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStudentModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Total Assignments</p>
                        <p className="text-2xl font-bold text-blue-900">{selectedStudent.total_assignments}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm text-green-600 font-medium">Completed</p>
                        <p className="text-2xl font-bold text-green-900">{selectedStudent.submitted_assignments}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Completion Rate</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {selectedStudent.total_assignments > 0 ? 
                            Math.round((selectedStudent.submitted_assignments / selectedStudent.total_assignments) * 100) : 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h3>
                  <div className="space-y-3">
                    {selectedStudent.assignment_details?.map((assignment, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{assignment.assignment_title}</h4>
                          <div className="flex items-center space-x-2">
                            {assignment.submission_status ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${
                              assignment.submission_status ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {assignment.submission_status ? 'Submitted' : 'Not Submitted'}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Subject:</span> {assignment.subject}
                          </div>
                          <div>
                            <span className="font-medium">Due Date:</span> {new Date(assignment.due_date).toLocaleDateString()}
                          </div>
                          {assignment.submitted_date && (
                            <div>
                              <span className="font-medium">Submitted:</span> {new Date(assignment.submitted_date).toLocaleDateString()}
                            </div>
                          )}
                          {assignment.grade && (
                            <div>
                              <span className="font-medium">Grade:</span> {assignment.grade}
                            </div>
                          )}
                        </div>
                        {assignment.feedback && (
                          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm font-medium text-blue-900">Feedback:</span>
                            <p className="text-sm text-blue-800 mt-1">{assignment.feedback}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {!selectedStudent.assignment_details?.length && (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p>No assignment details available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AStudent;