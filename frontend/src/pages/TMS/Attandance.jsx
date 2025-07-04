import React, { useState, useEffect, useMemo, useContext } from 'react';
import { 
  Users, 
  Calendar, 
  Check, 
  X, 
  Save, 
  RefreshCw, 
  Search,
  Filter,
  BookOpen,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Send,
  Download
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { getAllStudentClasses, getAllStudentSections, getStudentProfile } from '../../api/student';
import { getAttandanceRecord, createAttandanceRecord } from '../../api/teacher';
import AuthContext from '../../context/Auth';

// Attendance data structure - simplified to boolean
const ATTENDANCE_STATUS = {
  PRESENT: true,
  ABSENT: false
};

// Status configuration
const statusConfig = {
  [ATTENDANCE_STATUS.PRESENT]: {
    label: 'Present',
    icon: Check,
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  [ATTENDANCE_STATUS.ABSENT]: {
    label: 'Absent',
    icon: X,
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  }
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    </div>
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex space-x-2">
              {[1, 2].map((j) => (
                <div key={j} className="w-20 h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Student Row Component
const StudentAttendanceRow = ({ student, attendance, onAttendanceChange, index, isReadOnly = false }) => {
  const getStatusButton = (status) => {
    const config = statusConfig[status];
    const isSelected = attendance[student.id] === status;
    const Icon = config.icon;

    return (
      <button
        onClick={() => !isReadOnly && onAttendanceChange(student.id, status)}
        disabled={isReadOnly}
        className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg border-2 transition-all duration-300 ${
          isReadOnly ? 'cursor-not-allowed opacity-60' : 'hover:scale-105'
        } ${
          isSelected 
            ? `${config.bgColor} ${config.textColor} ${config.borderColor} shadow-sm` 
            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
        }`}
        title={config.label}
      >
        <Icon size={16} />
        <span className="text-xs font-medium hidden sm:inline">{config.label}</span>
      </button>
    );
  };

  return (
    <div className={`flex items-center space-x-4 p-4 rounded-xl border border-gray-100/50 transition-all duration-300 hover:shadow-md ${
      index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
    }`}>
      {/* Student Info */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {student.user.first_name.charAt(0)}{student.user.last_name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">
            {student.user.first_name} {student.user.last_name}
          </h4>
          <div className="text-sm text-gray-600 truncate">
            ID: {student.student_id || student.id} • Roll: {student.roll_number || 'N/A'}
          </div>
        </div>
      </div>

      {/* Attendance Buttons */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        {Object.values(ATTENDANCE_STATUS).map(status => 
          getStatusButton(status)
        )}
      </div>
    </div>
  );
};

// Statistics Component
const AttendanceStats = ({ attendance, totalStudents }) => {
  const stats = useMemo(() => {
    const counts = {
      [ATTENDANCE_STATUS.PRESENT]: 0,
      [ATTENDANCE_STATUS.ABSENT]: 0
    };

    Object.values(attendance).forEach(status => {
      if (status === true) {
        counts[ATTENDANCE_STATUS.PRESENT]++;
      } else if (status === false) {
        counts[ATTENDANCE_STATUS.ABSENT]++;
      }
    });

    const totalMarked = Object.values(attendance).length;

    return { ...counts, totalMarked };
  }, [attendance, totalStudents]);

  const getStatCard = (status, count, total) => {
    const config = statusConfig[status];
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
      <div className={`${config.bgColor} border ${config.borderColor} rounded-xl p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{config.label}</p>
            <p className={`text-2xl font-bold ${config.textColor}`}>{count}</p>
          </div>
          <config.icon className={`w-8 h-8 ${config.textColor}`} />
        </div>
        <p className="text-xs text-gray-500 mt-1">{percentage}% of marked</p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {Object.values(ATTENDANCE_STATUS).map(status => 
        getStatCard(status, stats[status], stats.totalMarked)
      )}
    </div>
  );
};

// Main Attendance Component
const Attandance = () => {

  const {user} = useContext(AuthContext)
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendance, setAttendance] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [existingAttendance, setExistingAttendance] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isFetchingAttendance, setIsFetchingAttendance] = useState(false);

  // Fetch classes
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['student-classes'],
    queryFn: getAllStudentClasses,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch sections
  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ['student-sections'],
    queryFn: getAllStudentSections,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch all students
  const { data: allStudents = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getStudentProfile,
    staleTime: 5 * 60 * 1000,
  });

  // Filter students based on selected class and section
  useEffect(() => {
    let filtered = allStudents;

    if (selectedClass) {
      filtered = filtered.filter(student => student.class_name?.id === parseInt(selectedClass));
    }

    if (selectedSection) {
      filtered = filtered.filter(student => student.section?.id === parseInt(selectedSection));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student => 
        `${student.user.first_name} ${student.user.last_name}`.toLowerCase().includes(query) ||
        (student.student_id && student.student_id.toString().includes(query)) ||
        (student.roll_number && student.roll_number.toString().includes(query))
      );
    }

    setFilteredStudents(filtered);
    
    // Reset attendance when filters change
    setAttendance({});
    setExistingAttendance(null);
    setIsReadOnly(false);
  }, [selectedClass, selectedSection, searchQuery, allStudents]);

  // Fetch existing attendance when date, class, and section are selected
  useEffect(() => {
    const fetchExistingAttendance = async () => {
      if (!selectedClass || !selectedSection || !attendanceDate) {
        return;
      }

      setIsFetchingAttendance(true);
      try {
        const existingData = await getAttandanceRecord(selectedClass, selectedSection, attendanceDate);
        
        if (existingData && existingData.length > 0) {
          // Attendance already exists for this date - make it read-only
          const attendanceMap = {};
          existingData.forEach(record => {
            attendanceMap[record.student.id] = record.is_present;
          });
          
          setAttendance(attendanceMap);
          setExistingAttendance(existingData);
          setIsReadOnly(true);
          toast.info('Attendance for this date already exists. View mode enabled.');
        } else {
          // No existing attendance - allow editing
          setAttendance({});
          setExistingAttendance(null);
          setIsReadOnly(false);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
        // If there's an error (like 404), assume no attendance exists
        setAttendance({});
        setExistingAttendance(null);
        setIsReadOnly(false);
      } finally {
        setIsFetchingAttendance(false);
      }
    };

    fetchExistingAttendance();
  }, [selectedClass, selectedSection, attendanceDate]);

  const handleAttendanceChange = (studentId, status) => {
    if (isReadOnly) return; // Prevent changes if in read-only mode
    
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleBulkAttendance = (status) => {
    if (isReadOnly) return; // Prevent bulk changes if in read-only mode
    
    const bulkAttendance = {};
    filteredStudents.forEach(student => {
      bulkAttendance[student.id] = status;
    });
    setAttendance(bulkAttendance);
    toast.success(`Marked all students as ${statusConfig[status].label}`);
  };

  const handleSubmitAttendance = async () => {
    if (!selectedClass || !selectedSection) {
      toast.error('Please select both class and section');
      return;
    }

    if (isReadOnly) {
      toast.info('Attendance for this date has already been submitted and cannot be modified');
      return;
    }

    // Validate that ALL students have attendance marked
    const totalStudents = filteredStudents.length;
    const markedStudents = Object.keys(attendance).length;
    
    if (markedStudents === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    if (markedStudents !== totalStudents) {
      toast.error(`Please mark attendance for all ${totalStudents} students. Currently marked: ${markedStudents}`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const attendanceData = Object.entries(attendance).map(
        ([studentId, isPresent]) => ({
          teacher: user.user_id,
          student: parseInt(studentId),
          class_name: parseInt(selectedClass),
          section: parseInt(selectedSection),
          date: attendanceDate,
          is_present: isPresent
        })
      );

      console.log('Submitting attendance:', attendanceData);
      
      // Submit attendance using the API
      await createAttandanceRecord(attendanceData);
      
      toast.success(`Attendance submitted successfully for ${Object.keys(attendance).length} students`);
      
      // Set to read-only mode after successful submission
      setIsReadOnly(true);
      setExistingAttendance(attendanceData);
      
    } catch (error) {
      toast.error('Failed to submit attendance. Please try again.');
      console.error('Attendance submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearAll = () => {
    if (isReadOnly) {
      toast.info('Cannot clear attendance that has already been submitted');
      return;
    }
    setAttendance({});
    toast.info('Attendance cleared');
  };

  const isLoading = classesLoading || sectionsLoading || studentsLoading || isFetchingAttendance;

  if (isLoading) {
    return (
      <div className="flex-1 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Attendance</h1>
                <p className="text-gray-600">Mark and manage student attendance for your classes</p>
              </div>
            </div>
            {isFetchingAttendance && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Loading attendance...</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Calendar size={16} className="text-blue-600" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/50 bg-gray-50/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
              />
            </div>

            {/* Class Selection */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <BookOpen size={16} className="text-blue-600" />
                <span>Class</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/50 bg-gray-50/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Selection */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Users size={16} className="text-blue-600" />
                <span>Section</span>
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/50 bg-gray-50/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                disabled={!selectedClass}
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Students */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Search size={16} className="text-blue-600" />
                <span>Search</span>
              </label>
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/50 bg-gray-50/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedClass && selectedSection && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
              {isReadOnly && (
                <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium">View Mode - Attendance Already Submitted</span>
                </div>
              )}
              
              {!isReadOnly && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Mark All:</span>
                  {Object.values(ATTENDANCE_STATUS).map(status => {
                    const config = statusConfig[status];
                    return (
                      <button
                        key={status}
                        onClick={() => handleBulkAttendance(status)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${config.bgColor} ${config.textColor} border ${config.borderColor} hover:shadow-sm transition-all duration-300`}
                      >
                        <config.icon size={14} />
                        <span className="text-xs font-medium">{config.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleClearAll}
                  disabled={isReadOnly}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isReadOnly 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <RefreshCw size={14} />
                  <span className="text-sm font-medium">Clear</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Students List */}
        {selectedClass && selectedSection ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-100/50">
            {filteredStudents.length > 0 ? (
              <>
                {/* Statistics */}
                <div className="p-6 border-b border-gray-100">
                  <AttendanceStats 
                    attendance={attendance} 
                    totalStudents={filteredStudents.length} 
                  />
                </div>

                {/* Students List */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Students ({filteredStudents.length})
                    </h3>
                    <div className="text-sm text-gray-600">
                      Marked: {Object.keys(attendance).length}/{filteredStudents.length}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {filteredStudents.map((student, index) => (
                      <StudentAttendanceRow
                        key={student.id}
                        student={student}
                        attendance={attendance}
                        onAttendanceChange={handleAttendanceChange}
                        index={index}
                        isReadOnly={isReadOnly}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit Section */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/30">
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">
                        {Object.keys(attendance).length} of {filteredStudents.length} students marked
                      </span>
                      {!isReadOnly && Object.keys(attendance).length < filteredStudents.length && (
                        <div className="text-orange-600 text-xs mt-1">
                          All students must be marked before submission
                        </div>
                      )}
                      {isReadOnly && (
                        <div className="text-blue-600 text-xs mt-1">
                          Attendance submitted - View only
                        </div>
                      )}
                    </div>
                    
                    {!isReadOnly ? (
                      <button
                        onClick={handleSubmitAttendance}
                        disabled={isSubmitting || Object.keys(attendance).length !== filteredStudents.length}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            <span>Submit Attendance</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl font-medium">
                        <CheckCircle size={18} />
                        <span>Attendance Submitted</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
                <p className="text-gray-600">
                  No students found for the selected class and section. Please check your selection.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Class and Section</h3>
            <p className="text-gray-600">
              Please select both a class and section to view and mark student attendance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attandance;