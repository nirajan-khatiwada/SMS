import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  BookOpen,
  ChevronDown,
  BarChart3,
  PieChart,
  Filter,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { getAllStudentClasses, getAllStudentSections } from '../../api/student';
import { getAttandanceRecord } from '../../api/teacher';

// Helper function to get the last N days
const getLastNDays = (n) => {
  const days = [];
  const today = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  
  return days;
};

// Helper function to get date range based on period
const getDateRange = (period) => {
  switch (period) {
    case '5days':
      return getLastNDays(5);
    case '1week':
      return getLastNDays(7);
    case '1month':
      return getLastNDays(30);
    default:
      return getLastNDays(5);
  }
};

// Helper function to get period display name
const getPeriodDisplayName = (period) => {
  switch (period) {
    case '5days':
      return 'last 5 days';
    case '1week':
      return 'last week';
    case '1month':
      return 'last month';
    default:
      return 'last 5 days';
  }
};

// Helper function to format date for display
const formatDisplayDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  if (dateString === today.toISOString().split('T')[0]) {
    return 'Today';
  } else if (dateString === yesterday.toISOString().split('T')[0]) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    </div>
  </div>
);

// Day Card Component
const DayCard = ({ date, percentage, status, totalStudents, presentStudents }) => {
  const getStatusColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50/80 border-green-200/50';
    if (percentage >= 75) return 'text-blue-600 bg-blue-50/80 border-blue-200/50';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50/80 border-yellow-200/50';
    if (percentage > 0) return 'text-red-600 bg-red-50/80 border-red-200/50';
    return 'text-gray-600 bg-gray-50/80 border-gray-200/50';
  };

  const isHoliday = status === 'holiday';
  const hasData = status === 'recorded';

  return (
    <div className={`rounded-xl border transition-all duration-300 hover:shadow-md p-4 ${
      isHoliday ? 'bg-gray-50/80 border-gray-200/50' : getStatusColor(percentage)
    }`}>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-600 mb-2">
          {formatDisplayDate(date)}
        </div>
        
        {isHoliday ? (
          <div className="space-y-2">
            <Calendar className="w-8 h-8 text-gray-400 mx-auto" />
            <div className="text-lg font-semibold text-gray-500">Holiday</div>
          </div>
        ) : hasData ? (
          <div className="space-y-2">
            <div className="text-3xl font-bold">{percentage}%</div>
            <div className="text-xs text-gray-600">
              {presentStudents}/{totalStudents} present
            </div>
            <div className="w-full bg-gray-200/50 rounded-full h-2">
              <div 
                className="bg-current rounded-full h-2 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Calendar className="w-8 h-8 text-gray-400 mx-auto" />
            <div className="text-sm text-gray-500">No Data</div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stats Summary Component
const StatsSummary = ({ attendanceData }) => {
  const stats = useMemo(() => {
    const recordedDays = attendanceData.filter(day => day.status === 'recorded');
    
    if (recordedDays.length === 0) {
      return { averageAttendance: 0, totalDays: 0, bestDay: null, worstDay: null };
    }

    const totalPercentage = recordedDays.reduce((sum, day) => sum + day.percentage, 0);
    const averageAttendance = Math.round(totalPercentage / recordedDays.length);
    
    const bestDay = recordedDays.reduce((best, day) => 
      day.percentage > best.percentage ? day : best, recordedDays[0]);
    
    const worstDay = recordedDays.reduce((worst, day) => 
      day.percentage < worst.percentage ? day : worst, recordedDays[0]);

    return { averageAttendance, totalDays: recordedDays.length, bestDay, worstDay };
  }, [attendanceData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50/80 border border-blue-200/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Average</p>
            <p className="text-2xl font-bold text-blue-700">{stats.averageAttendance}%</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      
      <div className="bg-green-50/80 border border-green-200/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600">Days Recorded</p>
            <p className="text-2xl font-bold text-green-700">{stats.totalDays}</p>
          </div>
          <Calendar className="w-8 h-8 text-green-600" />
        </div>
      </div>
      
      {stats.bestDay && (
        <div className="bg-purple-50/80 border border-purple-200/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Best Day</p>
              <p className="text-2xl font-bold text-purple-700">{stats.bestDay.percentage}%</p>
              <p className="text-xs text-purple-500">{formatDisplayDate(stats.bestDay.date)}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      )}
      
      {stats.worstDay && stats.totalDays > 1 && (
        <div className="bg-orange-50/80 border border-orange-200/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Lowest Day</p>
              <p className="text-2xl font-bold text-orange-700">{stats.worstDay.percentage}%</p>
              <p className="text-xs text-orange-500">{formatDisplayDate(stats.worstDay.date)}</p>
            </div>
            <PieChart className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      )}
    </div>
  );
};

const AttandanceHistory = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('5days');
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Fetch attendance data for the selected period
  const fetchAttendanceHistory = async () => {
    if (!selectedClass || !selectedSection) {
      setAttendanceData([]);
      return;
    }

    setIsLoading(true);
    try {
      const dateRange = getDateRange(selectedPeriod);
      const attendancePromises = dateRange.map(async (date) => {
        try {
          const data = await getAttandanceRecord(selectedClass, selectedSection, date);
          
          if (data && data.length > 0) {
            const totalStudents = data.length;
            const presentStudents = data.filter(record => record.is_present).length;
            const percentage = Math.round((presentStudents / totalStudents) * 100);
            
            return {
              date,
              percentage,
              status: 'recorded',
              totalStudents,
              presentStudents
            };
          } else {
            // No data for this date (holiday)
            return {
              date,
              percentage: 0,
              status: 'holiday',
              totalStudents: 0,
              presentStudents: 0
            };
          }
        } catch (error) {
          // Error fetching data (likely 404 - no attendance record)
          return {
            date,
            percentage: 0,
            status: 'holiday',
            totalStudents: 0,
            presentStudents: 0
          };
        }
      });

      const results = await Promise.all(attendancePromises);
      setAttendanceData(results);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      toast.error('Failed to fetch attendance history');
      setAttendanceData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch attendance when class, section, or period changes
  useEffect(() => {
    fetchAttendanceHistory();
  }, [selectedClass, selectedSection, selectedPeriod]);

  const hasValidSelection = selectedClass && selectedSection;
  const hasRecordedData = attendanceData.some(day => day.status === 'recorded');

  return (
    <div className="flex-1 bg-gray-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Attendance History</h1>
                <p className="text-gray-600">View attendance trends for the {getPeriodDisplayName(selectedPeriod)}</p>
              </div>
            </div>
            {hasValidSelection && (
              <button
                onClick={fetchAttendanceHistory}
                disabled={isLoading}
                className="p-3 bg-blue-50/80 text-blue-600 rounded-xl hover:bg-blue-100/80 transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Class Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Select Class
              </label>
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  disabled={classesLoading}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 appearance-none text-gray-900 disabled:opacity-50"
                >
                  <option value="">Choose a class...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Section Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Select Section
              </label>
              <div className="relative">
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  disabled={sectionsLoading}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 appearance-none text-gray-900 disabled:opacity-50"
                >
                  <option value="">Choose a section...</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Period Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Time Period
              </label>
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 appearance-none text-gray-900"
                >
                  <option value="5days">Last 5 Days</option>
                  <option value="1week">Last Week (7 days)</option>
                  <option value="1month">Last Month (30 days)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {(isLoading || classesLoading || sectionsLoading) && <LoadingSkeleton />}

        {/* Content */}
        {!isLoading && !classesLoading && !sectionsLoading && (
          <>
            {!hasValidSelection ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Class and Section</h3>
                <p className="text-gray-600">Please select both a class and section to view attendance history.</p>
              </div>
            ) : !hasRecordedData ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Attendance Data</h3>
                <p className="text-gray-600">No attendance records found for the selected class and section in the {getPeriodDisplayName(selectedPeriod)}.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Statistics Summary */}
                <StatsSummary attendanceData={attendanceData} />

                {/* Attendance History Cards */}
                <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {selectedPeriod === '5days' ? 'Last 5 Days' : selectedPeriod === '1week' ? 'Last Week' : 'Last Month'} Attendance
                  </h2>
                  
                  <div className={`grid gap-4 ${
                    selectedPeriod === '5days' ? 'grid-cols-1 md:grid-cols-5' :
                    selectedPeriod === '1week' ? 'grid-cols-1 md:grid-cols-7' :
                    'grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10'
                  }`}>
                    {attendanceData.map((dayData) => (
                      <DayCard
                        key={dayData.date}
                        date={dayData.date}
                        percentage={dayData.percentage}
                        status={dayData.status}
                        totalStudents={dayData.totalStudents}
                        presentStudents={dayData.presentStudents}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AttandanceHistory;