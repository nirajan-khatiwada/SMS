import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Bell,
  Eye,
  BookOpen,
  GraduationCap,
  Award,
  Target,
  RefreshCw,
  Plus,
  ArrowUp,
  ArrowDown,
  Minus,
  BookMarked,
  UserCheck,
  Clipboard
} from 'lucide-react';
import { 
  getAllAssignments,
  getAttendanceRecordByDateRange
} from '../../api/teacher';
import { getAllStudentClasses, getAllStudentSections, getStudentProfile } from '../../api/student';
import { fetchNotifications } from '../../api/notification';

// Simple chart components
const SimpleBarChart = ({ data, title, color = "blue" }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="space-y-2 sm:space-y-3">
      <h4 className="text-xs sm:text-sm font-medium text-gray-700">{title}</h4>
      <div className="space-y-1.5 sm:space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-xs text-gray-600 w-16 sm:w-20 truncate flex-shrink-0">{item.label}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div 
                className={`bg-${color}-500 h-1.5 sm:h-2 rounded-full transition-all duration-300`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700 w-6 sm:w-8 text-right flex-shrink-0">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = "blue", loading = false }) => {
  const getTrendIcon = () => {
    if (trend > 0) return <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
    if (trend < 0) return <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />;
    return <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50 animate-pulse">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-xl" />
          {trend !== undefined && <div className="w-6 h-4 bg-gray-200 rounded" />}
        </div>
        <div className="space-y-2">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        {trend !== undefined && getTrendIcon()}
      </div>
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-xs sm:text-sm font-medium text-gray-700">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

const RecentActivityCard = ({ assignments, title = "Recent Assignments" }) => {
  const recentAssignments = assignments.slice(0, 5);

  const getStatusColor = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return 'text-red-600 bg-red-50';
    if (daysUntilDue <= 2) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Clipboard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <span>{title}</span>
        </h3>
        <Eye size={16} className="text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {recentAssignments.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No assignments created yet</p>
        ) : (
          recentAssignments.map((assignment) => (
            <div key={assignment.id} className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText size={14} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {assignment.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {assignment.class_name?.name} {assignment.section?.name} • {assignment.subject}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(assignment.due_date)}`}>
                  {formatDate(assignment.due_date)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Create Assignment',
      description: 'Create new assignment',
      icon: Plus,
      color: 'blue',
      action: () => navigate('/teacher/assignments/')
    },
    {
      title: 'Take Attendance',
      description: 'Mark student attendance',
      icon: UserCheck,
      color: 'green',
      action: () => navigate('/teacher/add-attandance/')
    },
    {
      title: 'View Reports',
      description: 'Check attendance reports',
      icon: BarChart3,
      color: 'purple',
      action: () => navigate('/teacher/attandance-history/')
    },
    {
      title: 'Student Progress',
      description: 'Review student assignments',
      icon: Award,
      color: 'orange',
      action: () => navigate('/teacher/assignment-student-History/')
    }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`p-3 sm:p-4 rounded-xl border-2 border-${action.color}-100 bg-${action.color}-50/50 hover:bg-${action.color}-100/70 transition-all duration-300 group`}
          >
            <action.icon className={`w-6 h-6 sm:w-8 sm:h-8 text-${action.color}-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300`} />
            <p className="text-xs sm:text-sm font-medium text-gray-900">{action.title}</p>
            <p className="text-xs text-gray-600 mt-1">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-4 sm:space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <StatCard key={i} loading={true} />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white/70 rounded-xl p-4 sm:p-6 animate-pulse">
          <div className="w-32 sm:w-40 h-4 sm:h-5 bg-gray-200 rounded mb-3 sm:mb-4" />
          <div className="space-y-2 sm:space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="w-full h-3 sm:h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TDash = () => {
  const [timeFilter, setTimeFilter] = useState('30d');
  const navigate = useNavigate();

  // Fetch all data
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAllAssignments,
    staleTime: 5 * 60 * 1000,
  });

  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getStudentProfile,
    staleTime: 5 * 60 * 1000,
  });

  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['student-classes'],
    queryFn: getAllStudentClasses,
    staleTime: 5 * 60 * 1000,
  });

  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ['student-sections'],
    queryFn: getAllStudentSections,
    staleTime: 5 * 60 * 1000,
  });

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 5 * 60 * 1000,
  });

  // Calculate analytics
  const analytics = useMemo(() => {
    // Assignment analytics
    const totalAssignments = assignments.length;
    const pendingAssignments = assignments.filter(a => new Date(a.due_date) > new Date()).length;
    const overdueAssignments = assignments.filter(a => new Date(a.due_date) < new Date()).length;
    
    // Recent assignments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentAssignments = assignments.filter(a => new Date(a.assigned_date) >= thirtyDaysAgo);
    
    // Assignment by subject distribution
    const assignmentsBySubject = {};
    assignments.forEach(assignment => {
      const subject = assignment.subject || 'Other';
      assignmentsBySubject[subject] = (assignmentsBySubject[subject] || 0) + 1;
    });
    
    const subjectData = Object.entries(assignmentsBySubject)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([subject, count]) => ({ label: subject, value: count }));

    // Class distribution
    const studentsByClass = classes.map(cls => ({
      label: cls.name,
      value: students.filter(student => student.class_name?.id === cls.id).length
    }));

    // Assignment by class
    const assignmentsByClass = classes.map(cls => ({
      label: cls.name,
      value: assignments.filter(assignment => assignment.class_name === cls.id).length
    }));

    // Recent activity - sorted by due date (earliest first)
    const recentActivity = assignments
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 5);

    // Calculate pending tasks (assignments due within 7 days + overdue)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const pendingTasks = assignments.filter(a => 
      new Date(a.due_date) <= sevenDaysFromNow && new Date(a.due_date) >= new Date()
    ).length + overdueAssignments;

    return {
      totalAssignments,
      pendingAssignments,
      overdueAssignments,
      recentAssignmentsCount: recentAssignments.length,
      totalStudents: students.length,
      totalClasses: classes.length,
      totalSections: sections.length,
      subjectData,
      studentsByClass,
      assignmentsByClass,
      recentActivity,
      urgentNotifications: notifications.filter(n => n.status === 'Urgent').length,
      pendingTasks
    };
  }, [assignments, students, classes, sections, notifications]);

  const isLoading = assignmentsLoading || studentsLoading || classesLoading || sectionsLoading;

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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-sm sm:text-base text-gray-600">Manage classes, assignments and track student progress</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm bg-white/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          <StatCard
            icon={FileText}
            title="Total Assignments"
            value={analytics.totalAssignments.toLocaleString()}
            subtitle="All assignments created"
            color="blue"
          />
          <StatCard
            icon={Clock}
            title="Pending"
            value={analytics.pendingTasks.toLocaleString()}
            subtitle="Tasks requiring attention"
            color="yellow"
          />
          <StatCard
            icon={Clock}
            title="Pending Assignments"
            value={analytics.pendingAssignments.toLocaleString()}
            subtitle="Due assignments"
            color="orange"
          />
          <StatCard
            icon={AlertTriangle}
            title="Overdue Assignments"
            value={analytics.overdueAssignments.toLocaleString()}
            subtitle="Past due date"
            color="red"
          />
          <StatCard
            icon={Bell}
            title="Urgent Notifications"
            value={analytics.urgentNotifications.toLocaleString()}
            subtitle="Requires attention"
            color="purple"
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Assignments by Subject */}
          {analytics.subjectData.length > 0 && (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
              <SimpleBarChart
                data={analytics.subjectData}
                title="Assignments by Subject"
                color="blue"
              />
            </div>
          )}

          {/* Students by Class */}
          {analytics.studentsByClass.length > 0 && (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
              <SimpleBarChart
                data={analytics.studentsByClass}
                title="Students by Class"
                color="green"
              />
            </div>
          )}

          {/* Quick Actions */}
          <QuickActions />
        </div>

        {/* Recent Activity & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Assignments */}
          <RecentActivityCard 
            assignments={analytics.recentActivity} 
            title="Recent Assignments"
          />

          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  <span className="hidden sm:inline">Recent Notifications</span>
                  <span className="sm:hidden">Notifications</span>
                </h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-yellow-50/50 border border-yellow-200/50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">{notification.subject}</h4>
                      <p className="text-xs text-gray-600 mt-1 overflow-hidden">{notification.message}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TDash