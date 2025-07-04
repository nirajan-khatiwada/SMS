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
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { getAllStudentClasses, getAllStudentSections } from '../../api/student';
import { getAttendanceRecordByDateRange } from '../../api/teacher';

const AttandanceStudent = () => {
  // State management
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('1_week');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('percentage');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);

  // Date range calculation
  const dateRanges = {
    '1_week': { days: 7, label: '1 Week' },
    '1_month': { days: 30, label: '1 Month' },
    '6_months': { days: 180, label: '6 Months' },
    '1_year': { days: 365, label: '1 Year' }
  };

  const getDateRange = (period) => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - dateRanges[period].days);
    
    return {
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0]
    };
  };

  // API queries
  const { data: classes = [], isLoading: classesLoading, error: classesError } = useQuery({
    queryKey: ['student-classes'],
    queryFn: getAllStudentClasses,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    onError: (error) => {
      console.error('Failed to fetch classes:', error);
      toast.error('Failed to load classes. Please check your authentication.');
    }
  });

  const { data: sections = [], isLoading: sectionsLoading, error: sectionsError } = useQuery({
    queryKey: ['student-sections'],
    queryFn: getAllStudentSections,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    onError: (error) => {
      console.error('Failed to fetch sections:', error);
      toast.error('Failed to load sections. Please check your authentication.');
    }
  });

  // Attendance data query
  const { data: attendanceData = [], isLoading: attendanceLoading, error: attendanceError, refetch } = useQuery({
    queryKey: ['attendance-records', selectedClassId, selectedSectionId, selectedPeriod],
    queryFn: () => {
      if (!selectedClassId || !selectedSectionId) return [];
      const { fromDate, toDate } = getDateRange(selectedPeriod);
      return getAttendanceRecordByDateRange(fromDate, toDate, selectedClassId, selectedSectionId);
    },
    enabled: !!(selectedClassId && selectedSectionId),
    staleTime: 2 * 60 * 1000,
    retry: 1,
    onError: (error) => {
      console.error('Failed to fetch attendance data:', error);
      toast.error('Failed to load attendance data. Please check your authentication.');
    }
  });

  // Filtered and sorted data
  const processedData = useMemo(() => {
    // Safety check for data structure
    if (!Array.isArray(attendanceData)) {
      console.warn('Attendance data is not an array:', attendanceData);
      return [];
    }

    let filtered = attendanceData.filter(student => {
      // Safety checks for student object
      if (!student || typeof student !== 'object') return false;
      
      const firstName = student.first_name || '';
      const lastName = student.last_name || '';
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const rollNumber = student.roll_number?.toString().toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();
      
      return fullName.includes(searchLower) || rollNumber.includes(searchLower);
    });

    // Add percentage calculation
    filtered = filtered.map(student => ({
      ...student,
      percentage: (student.total_attendance && student.total_attendance > 0) 
        ? Math.round((student.total_present / student.total_attendance) * 100)
        : 0
    }));

    // Sort data
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'name':
          valueA = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase();
          valueB = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase();
          break;
        case 'roll_number':
          valueA = parseInt(a.roll_number) || 0;
          valueB = parseInt(b.roll_number) || 0;
          break;
        case 'percentage':
          valueA = a.percentage;
          valueB = b.percentage;
          break;
        case 'present':
          valueA = a.total_present || 0;
          valueB = b.total_present || 0;
          break;
        case 'total':
          valueA = a.total_attendance || 0;
          valueB = b.total_attendance || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    return filtered;
  }, [attendanceData, searchTerm, sortBy, sortOrder]);

  // Statistics calculation
  const stats = useMemo(() => {
    if (processedData.length === 0) return null;

    const totalStudents = processedData.length;
    const totalAttendanceSum = processedData.reduce((sum, student) => sum + student.total_attendance, 0);
    const totalPresentSum = processedData.reduce((sum, student) => sum + student.total_present, 0);
    const averagePercentage = totalAttendanceSum > 0 
      ? Math.round((totalPresentSum / totalAttendanceSum) * 100)
      : 0;
    
    const goodAttendance = processedData.filter(s => s.percentage >= 75).length;
    const poorAttendance = processedData.filter(s => s.percentage < 50).length;

    return {
      totalStudents,
      averagePercentage,
      goodAttendance,
      poorAttendance,
      totalAttendanceSum,
      totalPresentSum
    };
  }, [processedData]);

  // Get attendance status styling
  const getAttendanceStatus = (percentage) => {
    if (percentage >= 90) return { color: 'text-green-600', bg: 'bg-green-50', label: 'Excellent' };
    if (percentage >= 75) return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Good' };
    if (percentage >= 50) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Average' };
    return { color: 'text-red-600', bg: 'bg-red-50', label: 'Poor' };
  };

  // Reset section when class changes
  useEffect(() => {
    setSelectedSection('');
    setSelectedSectionId('');
  }, [selectedClass, selectedClassId]);

  const handleRefresh = () => {
    setIsLoading(true);
    refetch().finally(() => setIsLoading(false));
  };

  // Debug logging
  console.log('Debug - Selected Class:', selectedClass, 'Class ID:', selectedClassId);
  console.log('Debug - Selected Section:', selectedSection, 'Section ID:', selectedSectionId);
  console.log('Debug - Classes data:', classes);
  console.log('Debug - Sections data:', sections);

  return (
    <div className="flex-1 bg-gray-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Attendance Records</h1>
                <p className="text-gray-600">Track and analyze student attendance patterns</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex items-center space-x-3 mb-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          
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
                  
                  // Find the corresponding class object to get the ID
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
                  
                  // Find the corresponding section object to get the ID
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

            {/* Period Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Time Period</span>
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                {Object.entries(dateRanges).map(([key, range]) => (
                  <option key={key} value={key}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or roll number"
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averagePercentage}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Good Attendance (≥75%)</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.goodAttendance}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Poor Attendance {'(<50%)'}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.poorAttendance}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sorting and Actions */}
        {processedData.length > 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="percentage">Attendance %</option>
                    <option value="name">Name</option>
                    <option value="roll_number">Roll Number</option>
                    <option value="present">Days Present</option>
                    <option value="total">Total Days</option>
                  </select>
                </div>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-300"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  <span className="text-sm">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                Showing {processedData.length} students
              </div>
            </div>
          </div>
        )}

        {/* Student List */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-100/50 overflow-hidden">
          {(classesLoading || sectionsLoading || attendanceLoading) ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading attendance data...</p>
            </div>
          ) : (classesError || sectionsError || attendanceError) ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-red-600 font-medium mb-2">Error Loading Data</p>
              <p className="text-gray-600 mb-4">
                {classesError || sectionsError ? 
                  'Failed to load classes or sections. Please check your authentication.' :
                  'Failed to load attendance data. Please try again.'
                }
              </p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : !selectedClass || !selectedSection ? (
            <div className="p-8 text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Please select a class and section to view attendance records</p>
            </div>
          ) : processedData.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No attendance records found for the selected criteria</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {processedData.map((student, index) => {
                  const status = getAttendanceStatus(student.percentage);
                  const firstName = student.first_name || '';
                  const lastName = student.last_name || '';
                  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
                  
                  return (
                    <div 
                      key={student.student_id || index} 
                      className={`flex items-center justify-between p-4 rounded-xl border border-gray-100/50 transition-all duration-300 hover:shadow-md ${
                        index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
                      }`}
                    >
                      {/* Student Info */}
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {initials}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {firstName} {lastName}
                          </h4>
                          <div className="text-sm text-gray-600">
                            Roll: {student.roll_number || 'N/A'} • ID: {student.student_id || 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Attendance Stats */}
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Present / Total</div>
                          <div className="text-lg font-bold text-gray-900">
                            {student.total_present || 0} / {student.total_attendance || 0}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Percentage</div>
                          <div className={`text-xl font-bold ${status.color}`}>
                            {student.percentage}%
                          </div>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                          {status.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttandanceStudent;