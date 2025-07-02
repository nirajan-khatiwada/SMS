import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  X, 
  Search, 
  Filter, 
  Save, 
  RefreshCw,
  User,
  Clock,
  AlertTriangle,
  BookOpen,
  Eye,
  Download,
  Clipboard,
  TrendingUp,
  UserCheck,
  UserX,
  CheckSquare,
  Square,
  Plus
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudentProfile } from '../../api/student';
import { getClasses, getSections } from '../../api/libriary';
import { toast } from 'react-toastify';

// Dummy API functions - replace these with actual API calls later
const dummySubmitAttendance = async (attendanceData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Submitting attendance:', attendanceData);
      resolve({ success: true });
    }, 1000);
  });
};

const dummyGetAttendanceHistory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          date: '2025-01-01',
          class_name: 'Grade 10',
          section: 'A',
          total_students: 30,
          present: 28,
          absent: 2,
          status: 'completed'
        },
        {
          id: 2,
          date: '2024-12-30',
          class_name: 'Grade 10',
          section: 'A',
          total_students: 30,
          present: 25,
          absent: 5,
          status: 'completed'
        }
      ]);
    }, 500);
  });
};

const dummyGetTeacherClassInfo = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        isClassTeacher: true,
        assignedClass: {
          id: 1,
          name: 'Grade 10'
        },
        assignedSection: {
          id: 1,
          name: 'A'
        }
      });
    }, 500);
  });
};

// Enhanced dummy student data that matches the assigned class and section
const dummyGetStudentsForClass = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          user: {
            id: 1,
            first_name: 'John',
            last_name: 'Smith',
            username: 'johnsmith',
            email: 'john.smith@school.edu'
          },
          class_name: { id: 1, name: 'Grade 10' },
          section: { id: 1, name: 'A' },
          roll_number: 'ST001',
          father_name: 'Michael Smith',
          mother_name: 'Sarah Smith'
        },
        {
          id: 2,
          user: {
            id: 2,
            first_name: 'Emma',
            last_name: 'Johnson',
            username: 'emmajohnson',
            email: 'emma.johnson@school.edu'
          },
          class_name: { id: 1, name: 'Grade 10' },
          section: { id: 1, name: 'A' },
          roll_number: 'ST002',
          father_name: 'David Johnson',
          mother_name: 'Lisa Johnson'
        },
        {
          id: 3,
          user: {
            id: 3,
            first_name: 'Michael',
            last_name: 'Brown',
            username: 'michaelbrown',
            email: 'michael.brown@school.edu'
          },
          class_name: { id: 1, name: 'Grade 10' },
          section: { id: 1, name: 'A' },
          roll_number: 'ST003',
          father_name: 'Robert Brown',
          mother_name: 'Jennifer Brown'
        },
        {
          id: 4,
          user: {
            id: 4,
            first_name: 'Sophia',
            last_name: 'Davis',
            username: 'sophiadavis',
            email: 'sophia.davis@school.edu'
          },
          class_name: { id: 1, name: 'Grade 10' },
          section: { id: 1, name: 'A' },
          roll_number: 'ST004',
          father_name: 'William Davis',
          mother_name: 'Ashley Davis'
        },
        {
          id: 5,
          user: {
            id: 5,
            first_name: 'James',
            last_name: 'Wilson',
            username: 'jameswilson',
            email: 'james.wilson@school.edu'
          },
          class_name: { id: 1, name: 'Grade 10' },
          section: { id: 1, name: 'A' },
          roll_number: 'ST005',
          father_name: 'Thomas Wilson',
          mother_name: 'Maria Wilson'
        },
        {
          id: 6,
          user: {
            id: 6,
            first_name: 'Olivia',
            last_name: 'Miller',
            username: 'oliviamiller',
            email: 'olivia.miller@school.edu'
          },
          class_name: { id: 1, name: 'Grade 10' },
          section: { id: 1, name: 'A' },
          roll_number: 'ST006',
          father_name: 'Christopher Miller',
          mother_name: 'Amanda Miller'
        },
        {
          id: 7,
          user: {
            id: 7,
            first_name: 'Benjamin',
            last_name: 'Garcia',
            username: 'benjamingarcia',
            email: 'benjamin.garcia@school.edu'
          },
          class_name: { id: 1, name: 'Grade 10' },
          section: { id: 1, name: 'A' },
          roll_number: 'ST007',
          father_name: 'Carlos Garcia',
          mother_name: 'Sofia Garcia'
        },
        {
          id: 8,
          user: {
            id: 8,
            first_name: 'Charlotte',
            last_name: 'Martinez',
            username: 'charlottemartinez',
            email: 'charlotte.martinez@school.edu'
          },
          class_name: { id: 1, name: 'Grade 10' },
          section: { id: 1, name: 'A' },
          roll_number: 'ST008',
          father_name: 'Diego Martinez',
          mother_name: 'Isabella Martinez'
        },
        {
          id: 9,
          user: {
            id: 9,
            first_name: 'Alexander',
            last_name: 'Anderson',
            username: 'alexanderanderson',
            email: 'alexander.anderson@school.edu'
          },
          class_name: { id: 1, name: 'Grade 10' },
          section: { id: 1, name: 'A' },
          roll_number: 'ST009',
          father_name: 'John Anderson',
          mother_name: 'Michelle Anderson'
        },
        {
          id: 10,
          user: {
            id: 10,
            first_name: 'Isabella',
            last_name: 'Taylor',
            username: 'isabellataylor',
            email: 'isabella.taylor@school.edu'
          },
          class_name: { id: 1, name: 'Grade 10' },
          section: { id: 1, name: 'A' },
          roll_number: 'ST010',
          father_name: 'Ryan Taylor',
          mother_name: 'Nicole Taylor'
        }
      ]);
    }, 800);
  });
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="bg-white/70 rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
      <div className="h-6 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
    </div>
    
    {/* Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white/70 rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
          <div className="h-6 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
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

// Status Badge Component
const StatusBadge = ({ status, text }) => {
  const config = {
    present: { 
      className: 'bg-green-50/80 text-green-600 border border-green-200/50',
      icon: <CheckCircle size={12} />
    },
    absent: { 
      className: 'bg-red-50/80 text-red-600 border border-red-200/50',
      icon: <X size={12} />
    },
    late: { 
      className: 'bg-yellow-50/80 text-yellow-600 border border-yellow-200/50',
      icon: <Clock size={12} />
    }
  };

  const { className, icon } = config[status] || config.absent;

  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
      {icon}
      <span>{text}</span>
    </span>
  );
};

// Student Card Component
const StudentCard = ({ student, attendance, onAttendanceChange, isSubmitting }) => {
  const studentStatus = attendance[student.id] || 'absent';
  
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100/80 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">
              {student.user.first_name} {student.user.last_name}
            </h4>
            <p className="text-sm text-gray-600">Roll No: {student.roll_number || student.id}</p>
            <p className="text-xs text-gray-500">
              Class {student.class_name?.name} • Section {student.section?.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAttendanceChange(student.id, 'present')}
            disabled={isSubmitting}
            className={`p-2 rounded-lg transition-all duration-300 ${
              studentStatus === 'present'
                ? 'bg-green-100 text-green-600 ring-2 ring-green-500/20'
                : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600'
            }`}
            title="Mark Present"
          >
            <CheckCircle size={18} />
          </button>
          <button
            onClick={() => onAttendanceChange(student.id, 'absent')}
            disabled={isSubmitting}
            className={`p-2 rounded-lg transition-all duration-300 ${
              studentStatus === 'absent'
                ? 'bg-red-100 text-red-600 ring-2 ring-red-500/20'
                : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600'
            }`}
            title="Mark Absent"
          >
            <X size={18} />
          </button>
          <button
            onClick={() => onAttendanceChange(student.id, 'late')}
            disabled={isSubmitting}
            className={`p-2 rounded-lg transition-all duration-300 ${
              studentStatus === 'late'
                ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-500/20'
                : 'bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600'
            }`}
            title="Mark Late"
          >
            <Clock size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue", loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white/70 rounded-xl p-4 sm:p-6 animate-pulse">
        <div className="w-10 h-10 bg-gray-200 rounded-xl mb-3"></div>
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-8 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600"
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-300">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center mb-3 sm:mb-4`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <h3 className="text-sm sm:text-base font-medium text-gray-600 mb-1 sm:mb-2">{title}</h3>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

const Attandance = () => {
  const queryClient = useQueryClient();
  
  // State management
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch teacher class info (dummy)
  const { data: teacherInfo = {}, isLoading: teacherInfoLoading } = useQuery({
    queryKey: ['teacher-class-info'],
    queryFn: dummyGetTeacherClassInfo,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch students for the assigned class (using dummy data for now)
  const { data: allStudents = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: dummyGetStudentsForClass,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch attendance history (dummy)
  const { data: attendanceHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['attendance-history'],
    queryFn: dummyGetAttendanceHistory,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Filter students for assigned class and section
  const classStudents = useMemo(() => {
    if (!teacherInfo.assignedClass || !teacherInfo.assignedSection) return [];
    
    return allStudents.filter(student => 
      student.class_name?.id === teacherInfo.assignedClass?.id &&
      student.section?.id === teacherInfo.assignedSection?.id
    );
  }, [allStudents, teacherInfo]);

  // Filter students based on search and status
  const filteredStudents = useMemo(() => {
    let filtered = classStudents;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student =>
        `${student.user.first_name} ${student.user.last_name}`.toLowerCase().includes(query) ||
        (student.roll_number?.toString() || student.id?.toString()).includes(query)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(student => {
        const status = attendance[student.id] || 'absent';
        return status === filterStatus;
      });
    }

    return filtered;
  }, [classStudents, searchQuery, filterStatus, attendance]);

  // Calculate attendance statistics
  const attendanceStats = useMemo(() => {
    const total = classStudents.length;
    const present = Object.values(attendance).filter(status => status === 'present').length;
    const absent = Object.values(attendance).filter(status => status === 'absent').length;
    const late = Object.values(attendance).filter(status => status === 'late').length;
    const unmarked = total - present - absent - late;

    return { total, present, absent, late, unmarked };
  }, [classStudents, attendance]);

  // Submit attendance mutation
  const submitAttendanceMutation = useMutation({
    mutationFn: dummySubmitAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      toast.success('Attendance submitted successfully!');
      setAttendance({});
    },
    onError: (error) => {
      toast.error('Failed to submit attendance: ' + (error.message || 'Unknown error'));
    },
  });

  // Handle attendance change
  const handleAttendanceChange = (studentId, status) => {
    if (isSubmitting) return;
    
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Handle bulk operations
  const handleMarkAllPresent = () => {
    if (isSubmitting) return;
    
    const newAttendance = {};
    filteredStudents.forEach(student => {
      newAttendance[student.id] = 'present';
    });
    setAttendance(prev => ({ ...prev, ...newAttendance }));
    toast.success('All visible students marked as present');
  };

  const handleMarkAllAbsent = () => {
    if (isSubmitting) return;
    
    const newAttendance = {};
    filteredStudents.forEach(student => {
      newAttendance[student.id] = 'absent';
    });
    setAttendance(prev => ({ ...prev, ...newAttendance }));
    toast.success('All visible students marked as absent');
  };

  // Handle form submission
  const handleSubmitAttendance = () => {
    if (Object.keys(attendance).length === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    const attendanceData = {
      date: currentDate,
      class_id: teacherInfo.assignedClass?.id,
      section_id: teacherInfo.assignedSection?.id,
      attendance: Object.entries(attendance).map(([studentId, status]) => ({
        student_id: parseInt(studentId),
        status: status
      }))
    };

    setIsSubmitting(true);
    submitAttendanceMutation.mutate(attendanceData, {
      onSettled: () => {
        setIsSubmitting(false);
      }
    });
  };

  const isLoading = teacherInfoLoading || studentsLoading;

  if (isLoading) {
    return (
      <div className="flex-1 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  // Check if teacher is a class teacher
  if (!teacherInfo.isClassTeacher) {
    return (
      <div className="flex-1 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-8 shadow-sm border border-gray-100/50 text-center">
            <div className="w-16 h-16 bg-yellow-100/80 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-4">
              Attendance management is only available for class teachers. You need to be assigned as a class teacher to access this feature.
            </p>
            <p className="text-sm text-gray-500">
              Please contact the administrator if you believe this is an error.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Clipboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Attendance Management</h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Class {teacherInfo.assignedClass?.name} - Section {teacherInfo.assignedSection?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="px-4 py-2 bg-white/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
          <StatCard
            icon={Users}
            title="Total Students"
            value={attendanceStats.total}
            subtitle="In class"
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            title="Present"
            value={attendanceStats.present}
            subtitle={`${attendanceStats.total > 0 ? Math.round((attendanceStats.present / attendanceStats.total) * 100) : 0}% attendance`}
            color="green"
          />
          <StatCard
            icon={X}
            title="Absent"
            value={attendanceStats.absent}
            subtitle="Not present"
            color="red"
          />
          <StatCard
            icon={Clock}
            title="Late"
            value={attendanceStats.late}
            subtitle="Arrived late"
            color="yellow"
          />
          <StatCard
            icon={AlertTriangle}
            title="Unmarked"
            value={attendanceStats.unmarked}
            subtitle="Pending"
            color="purple"
          />
        </div>

        {/* Controls */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students by name or roll number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all duration-300"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all duration-300"
              >
                <option value="all">All Students</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>

            {/* Bulk Actions */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleMarkAllPresent}
                disabled={isSubmitting || filteredStudents.length === 0}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-300 disabled:opacity-50"
                title="Mark all visible students as present"
              >
                <CheckSquare size={16} />
                <span>All Present</span>
              </button>
              <button
                onClick={handleMarkAllAbsent}
                disabled={isSubmitting || filteredStudents.length === 0}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-300 disabled:opacity-50"
                title="Mark all visible students as absent"
              >
                <Square size={16} />
                <span>All Absent</span>
              </button>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Students ({filteredStudents.length})</span>
            </h2>
          </div>

          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  attendance={attendance}
                  onAttendanceChange={handleAttendanceChange}
                  isSubmitting={isSubmitting}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-500">
                {searchQuery || filterStatus !== 'all'
                  ? 'No students match your current search or filter criteria.'
                  : 'No students are assigned to this class and section.'}
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        {Object.keys(attendance).length > 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ready to Submit</h3>
                <p className="text-gray-600">
                  {Object.keys(attendance).length} student(s) marked for {currentDate}
                </p>
              </div>
              <button
                onClick={handleSubmitAttendance}
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Submit Attendance</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Attendance History */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Recent Attendance History</span>
            </h2>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['attendance-history'] })}
              className="p-2 bg-green-50/80 text-green-600 rounded-lg hover:bg-green-100/80 transition-all duration-300"
              disabled={historyLoading}
            >
              <RefreshCw className={`w-5 h-5 ${historyLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : attendanceHistory.length > 0 ? (
            <div className="space-y-3">
              {attendanceHistory.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100/80 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Class {record.class_name} - Section {record.section}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {record.present}/{record.total_students} Present
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.round((record.present / record.total_students) * 100)}% Attendance
                      </p>
                    </div>
                    <StatusBadge 
                      status={record.status === 'completed' ? 'present' : 'absent'} 
                      text={record.status === 'completed' ? 'Completed' : 'Pending'} 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendance History</h3>
              <p className="text-gray-500">No attendance records found for this class.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attandance;