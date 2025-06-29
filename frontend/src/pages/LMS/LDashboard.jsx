import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Library,
  UserCheck,
  BookMarked,
  Bell,
  RefreshCw,
  Filter,
  Download,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { 
  getAllBooks, 
  getBookIssue, 
  getBookReturn, 
  getClasses, 
  getSections 
} from '../../api/libriary';
import { getStudentProfile } from '../../api/student';
import { fetchNotifications } from '../../api/api';

// Simple chart components since no chart library is installed
const SimpleBarChart = ({ data, title, color = "blue" }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-2 sm:space-y-3">
      <h4 className="text-xs sm:text-sm font-medium text-gray-700">{title}</h4>
      <div className="space-y-1.5 sm:space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-xs text-gray-600 w-12 sm:w-16 truncate flex-shrink-0">{item.label}</span>
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

const SimplePieChart = ({ data, title }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  return (
    <div className="space-y-2 sm:space-y-3">
      <h4 className="text-xs sm:text-sm font-medium text-gray-700">{title}</h4>
      <div className="flex items-center justify-center">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          <svg className="w-20 h-20 sm:w-24 sm:h-24 transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={colors[index % colors.length]}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={index === 0 ? 0 : -data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 100, 0)}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
        </div>
      </div>
      <div className="space-y-1">
        {data.map((item, index) => {
          const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
          return (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${colors[index % colors.length]} flex-shrink-0`} />
              <span className="text-xs text-gray-600 truncate">{item.label}: {item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = "blue", loading = false }) => {
  const getTrendIcon = () => {
    if (trend > 0) return <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
    if (trend < 0) return <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />;
    return <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50 animate-pulse">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-xl`} />
          <div className="w-12 sm:w-16 h-3 sm:h-4 bg-gray-200 rounded" />
        </div>
        <div className="w-16 sm:w-20 h-6 sm:h-8 bg-gray-200 rounded mb-2" />
        <div className="w-24 sm:w-32 h-3 sm:h-4 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>

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

const LDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('7d');
  
  // Fetch all data
  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: getAllBooks,
    staleTime: 5 * 60 * 1000,
  });

  const { data: bookIssues = [], isLoading: issuesLoading } = useQuery({
    queryKey: ['book-issues'],
    queryFn: getBookIssue,
    staleTime: 5 * 60 * 1000,
  });

  const { data: bookReturns = [], isLoading: returnsLoading } = useQuery({
    queryKey: ['book-returns'],
    queryFn: getBookReturn,
    staleTime: 5 * 60 * 1000,
  });

  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getStudentProfile,
    staleTime: 5 * 60 * 1000,
  });

  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: getClasses,
    staleTime: 5 * 60 * 1000,
  });

  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ['sections'],
    queryFn: getSections,
    staleTime: 5 * 60 * 1000,
  });

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 5 * 60 * 1000,
  });

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalBooks = books.reduce((sum, book) => sum + (book.quantity || 0), 0);
    const issuedBooks = bookIssues.length;
    const availableBooks = totalBooks - issuedBooks;
    const returnedBooks = bookReturns.length;
    
    // Books by class distribution
    const booksByClass = classes.map(cls => ({
      label: cls.name,
      value: books.filter(book => book.class_name === cls.id).length
    }));

    // Books by status
    const bookStatus = [
      { label: 'Available', value: availableBooks },
      { label: 'Issued', value: issuedBooks },
      { label: 'Returned', value: returnedBooks }
    ];

    // Students by class
    const studentsByClass = classes.map(cls => ({
      label: cls.name,
      value: students.filter(student => student.class_name?.id === cls.id).length
    }));

    // Recent activity
    const recentIssues = bookIssues
      .sort((a, b) => new Date(b.issue_date) - new Date(a.issue_date))
      .slice(0, 5);

    // Recent returns
    const recentReturns = bookReturns
      .sort((a, b) => new Date(b.return_date) - new Date(a.return_date))
      .slice(0, 5);

    return {
      totalBooks,
      issuedBooks,
      availableBooks,
      returnedBooks,
      booksByClass,
      bookStatus,
      studentsByClass,
      recentIssues,
      recentReturns,
      totalStudents: students.length,
      totalClasses: classes.length,
      totalSections: sections.length
    };
  }, [books, bookIssues, bookReturns, students, classes, sections]);

  const isLoading = booksLoading || issuesLoading || returnsLoading || studentsLoading || classesLoading || sectionsLoading;

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
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">LMS Dashboard</h1>
                <p className="text-sm sm:text-base text-gray-600">Library Management System Overview</p>
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
            icon={BookOpen}
            title="Total Books"
            value={analytics.totalBooks.toLocaleString()}
            subtitle={`${books.length} unique titles`}
            color="blue"
          />
          <StatCard
            icon={Users}
            title="Active Students"
            value={analytics.totalStudents.toLocaleString()}
            subtitle={`${analytics.totalClasses} classes, ${analytics.totalSections} sections`}
            color="green"
          />
          <StatCard
            icon={BookMarked}
            title="Books Issued"
            value={analytics.issuedBooks.toLocaleString()}
            subtitle="Currently issued"
            color="yellow"
          />
          <StatCard
            icon={Library}
            title="Available Books"
            value={analytics.availableBooks.toLocaleString()}
            subtitle="Ready to issue"
            color="indigo"
          />
          <StatCard
            icon={CheckCircle}
            title="Books Returned"
            value={analytics.returnedBooks.toLocaleString()}
            subtitle="This month"
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Book Status */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span>Book Status</span>
              </h3>
              <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
            <SimplePieChart data={analytics.bookStatus} title="Current Status" />
          </div>

          {/* Recent Book Issues */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                <span className="hidden sm:inline">Recent Book Issues</span>
                <span className="sm:hidden">Recent Issues</span>
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {analytics.recentIssues.length > 0 ? (
                analytics.recentIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {issue.book?.name || 'Unknown Book'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {issue.student?.user?.first_name} {issue.student?.user?.last_name}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {new Date(issue.issue_date).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm">No recent book issues</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Book Returns */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span className="hidden sm:inline">Recent Returns</span>
                <span className="sm:hidden">Returns</span>
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {analytics.recentReturns.length > 0 ? (
                analytics.recentReturns.map((returnItem) => (
                  <div key={returnItem.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {returnItem.book_issue?.book?.name || 'Unknown Book'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {returnItem.book_issue?.student?.user?.first_name} {returnItem.book_issue?.student?.user?.last_name}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {new Date(returnItem.return_date).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm">No recent returns</p>
                </div>
              )}
            </div>
          </div>
        </div>

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
  );
};

export default LDashboard;