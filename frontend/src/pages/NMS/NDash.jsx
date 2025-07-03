import React, { useMemo } from 'react';
import { 
  Heart, 
  Users, 
  Package, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Phone,
  UserCheck,
  Activity,
  AlertTriangle,
  Plus,
  Eye,
  Bell,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllRecords, getProducts } from '../../api/nurse';
import { getStudentProfile } from '../../api/student';
import { fetchNotifications } from '../../api/api';

// Health condition choices matching the backend
const HEALTH_CONDITIONS = [
  { value: 'Critical', label: 'Critical', color: 'red' },
  { value: 'Serious', label: 'Serious', color: 'orange' },
  { value: 'Stable', label: 'Stable', color: 'yellow' },
  { value: 'Recovered', label: 'Recovered', color: 'green' },
  { value: 'Deceased', label: 'Deceased', color: 'gray' },
  { value: 'Normal', label: 'Normal', color: 'blue' }
];

// Simple chart components
const SimpleBarChart = ({ data, title, color = "blue" }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
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
                style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
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
  let currentAngle = 0;
  
  const colors = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#6B7280'];
  
  return (
    <div className="space-y-2 sm:space-y-3">
      <h4 className="text-xs sm:text-sm font-medium text-gray-700">{title}</h4>
      <div className="flex items-center justify-center">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          <svg className="w-20 h-20 sm:w-24 sm:h-24 transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              const angle = (percentage / 100) * 360;
              const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              );
            })}
          </svg>
        </div>
      </div>
      <div className="space-y-1">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 text-xs">
            <div 
              className="w-2 h-2 rounded-full flex-shrink-0" 
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-gray-600 truncate flex-1">{item.label}</span>
            <span className="font-medium text-gray-700">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = "blue", loading = false }) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (trend < 0) return <TrendingDown className="w-3 h-3 text-red-500" />;
    return null;
  };

  // Define explicit color classes to ensure they're included in Tailwind build
  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
      green: 'bg-gradient-to-br from-green-500 to-green-600',
      purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
      orange: 'bg-gradient-to-br from-orange-500 to-orange-600',
      red: 'bg-gradient-to-br from-red-500 to-red-600',
      yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      pink: 'bg-gradient-to-br from-pink-500 to-pink-600',
      indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      gray: 'bg-gradient-to-br from-gray-500 to-gray-600'
    };
    return colorMap[color] || colorMap.blue;
  };

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50 animate-pulse">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="w-16 h-6 bg-gray-200 rounded" />
          <div className="w-24 h-4 bg-gray-200 rounded" />
          <div className="w-20 h-3 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getColorClasses(color)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        {getTrendIcon()}
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

const RecentActivityCard = ({ records }) => {
  const recentRecords = records.slice(0, 5);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Activity size={20} />
          <span>Recent Medical Records</span>
        </h3>
        <Eye size={16} className="text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {recentRecords.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No recent records</p>
        ) : (
          recentRecords.map((record) => (
            <div key={record.id} className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Heart size={14} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {record.student?.user?.first_name} {record.student?.user?.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {record.visit_reason} • {record.health_condition}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(record.date).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const RecentNotificationsCard = ({ notifications }) => {
  const recentNotifications = notifications.slice(0, 5);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-600';
      case 'important':
        return 'bg-orange-100 text-orange-600';
      case 'normal':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Bell size={20} />
          <span>Recent Notifications</span>
        </h3>
        <Mail size={16} className="text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {recentNotifications.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No recent notifications</p>
        ) : (
          recentNotifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50/50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell size={14} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {notification.subject}
                  </p>
                  {notification.status && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(notification.status)}`}>
                      {notification.status}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {notification.message || 'No message content'}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    From: {notification.sender || 'System'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(notification.date)}
                  </span>
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
      title: 'Add Medical Record',
      description: 'Record a new student visit',
      icon: Plus,
      color: 'blue',
      action: () => navigate('/nurse/add-record')
    },
    {
      title: 'View All Records',
      description: 'Browse all medical records',
      icon: FileText,
      color: 'green',
      action: () => navigate('/nurse/all-record')
    },
    {
      title: 'Manage Inventory',
      description: 'Update medicine stock',
      icon: Package,
      color: 'purple',
      action: () => navigate('/nurse/total-product')
    }
  ];

  // Define explicit color classes to ensure they're included in Tailwind build
  const getActionClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50/50',
        hover: 'hover:bg-blue-50',
        border: 'border-blue-100',
        iconBg: 'bg-blue-100',
        iconText: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-50/50',
        hover: 'hover:bg-green-50',
        border: 'border-green-100',
        iconBg: 'bg-green-100',
        iconText: 'text-green-600'
      },
      purple: {
        bg: 'bg-purple-50/50',
        hover: 'hover:bg-purple-50',
        border: 'border-purple-100',
        iconBg: 'bg-purple-100',
        iconText: 'text-purple-600'
      },
      orange: {
        bg: 'bg-orange-50/50',
        hover: 'hover:bg-orange-50',
        border: 'border-orange-100',
        iconBg: 'bg-orange-100',
        iconText: 'text-orange-600'
      },
      red: {
        bg: 'bg-red-50/50',
        hover: 'hover:bg-red-50',
        border: 'border-red-100',
        iconBg: 'bg-red-100',
        iconText: 'text-red-600'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => {
          const colorClasses = getActionClasses(action.color);
          return (
            <button
              key={index}
              onClick={action.action}
              className={`w-full p-3 ${colorClasses.bg} ${colorClasses.hover} border ${colorClasses.border} rounded-lg transition-all duration-300 text-left group`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${colorClasses.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-5 h-5 ${colorClasses.iconText}`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
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

const NDash = () => {

  // Fetch all data
  const { data: records = [], isLoading: recordsLoading } = useQuery({
    queryKey: ['records'],
    queryFn: getAllRecords,
    staleTime: 5 * 60 * 1000,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000,
  });

  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getStudentProfile,
    staleTime: 5 * 60 * 1000,
  });

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 5 * 60 * 1000,
  });

  // Calculate analytics
  const analytics = useMemo(() => {
    if (!records.length) return null;

    // Use all records without filtering
    const allRecords = records;

    // Basic statistics
    const totalRecords = allRecords.length;
    const totalStudents = new Set(allRecords.map(r => r.student?.id)).size;
    const parentContacted = allRecords.filter(r => r.parent_contacted).length;
    const referredToDoctors = allRecords.filter(r => r.referred_to_doctor).length;
    
    // Health condition distribution
    const healthConditions = HEALTH_CONDITIONS.map(condition => ({
      label: condition.label,
      value: allRecords.filter(r => r.health_condition === condition.value).length,
      color: condition.color
    })).filter(item => item.value > 0);

    // Most common visit reasons (top 5)
    const visitReasons = {};
    allRecords.forEach(record => {
      const reason = record.visit_reason;
      visitReasons[reason] = (visitReasons[reason] || 0) + 1;
    });
    
    const topVisitReasons = Object.entries(visitReasons)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([reason, count]) => ({ label: reason, value: count }));

    // Medicine usage
    const medicineUsage = {};
    allRecords.forEach(record => {
      if (record.product) {
        const medicine = record.product.name;
        medicineUsage[medicine] = (medicineUsage[medicine] || 0) + (record.quantity || 1);
      }
    });

    const topMedicines = Object.entries(medicineUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([medicine, quantity]) => ({ label: medicine, value: quantity }));

    // No trends calculation since we removed time filtering
    const recordsTrend = 0;

    // Low stock products
    const lowStockProducts = products.filter(product => product.stock < 11);

    return {
      totalRecords,
      totalStudents,
      parentContacted,
      referredToDoctors,
      healthConditions,
      topVisitReasons,
      topMedicines,
      recordsTrend,
      lowStockProducts: lowStockProducts.length,
      totalProducts: products.length,
      recentRecords: records.slice(-10) // Last 10 records, most recent first
    };
  }, [records, products]);

  const isLoading = recordsLoading || productsLoading || studentsLoading;

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
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Nurse Management Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Medical records and health monitoring overview</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          <StatCard
            icon={FileText}
            title="Total Records"
            value={analytics?.totalRecords || 0}
            subtitle="All time"
            trend={analytics?.recordsTrend}
            color="blue"
          />
          <StatCard
            icon={Users}
            title="Students Treated"
            value={analytics?.totalStudents || 0}
            subtitle="Unique students"
            color="green"
          />
          <StatCard
            icon={Phone}
            title="Parents Contacted"
            value={analytics?.parentContacted || 0}
            subtitle={`${analytics?.totalRecords > 0 ? Math.round((analytics.parentContacted / analytics.totalRecords) * 100) : 0}% of visits`}
            color="purple"
          />
          <StatCard
            icon={UserCheck}
            title="Doctor Referrals"
            value={analytics?.referredToDoctors || 0}
            subtitle={`${analytics?.totalRecords > 0 ? Math.round((analytics.referredToDoctors / analytics.totalRecords) * 100) : 0}% of visits`}
            color="orange"
          />
          <StatCard
            icon={Package}
            title="Low Stock Items"
            value={analytics?.lowStockProducts || 0}
            subtitle={`${analytics?.totalProducts || 0} total products`}
            color="red"
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Health Conditions Distribution */}
          {analytics?.healthConditions && analytics.healthConditions.length > 0 && (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
              <SimplePieChart
                data={analytics.healthConditions}
                title="Health Conditions Distribution"
              />
            </div>
          )}

          {/* Top Visit Reasons */}
          {analytics?.topVisitReasons && analytics.topVisitReasons.length > 0 && (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
              <SimpleBarChart
                data={analytics.topVisitReasons}
                title="Most Common Visit Reasons"
                color="blue"
              />
            </div>
          )}

          {/* Medicine Usage */}
          {analytics?.topMedicines && analytics.topMedicines.length > 0 && (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
              <SimpleBarChart
                data={analytics.topMedicines}
                title="Most Used Medicines"
                color="green"
              />
            </div>
          )}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <RecentActivityCard records={analytics?.recentRecords || []} />
          <RecentNotificationsCard notifications={notifications || []} />
          <QuickActions />
        </div>

        {/* Alerts */}
        {analytics?.lowStockProducts > 0 && (
          <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-900">Low Stock Alert</h3>
                <p className="text-sm text-red-700 mt-1">
                  {analytics.lowStockProducts} product(s) are running low on stock (less than 10 units). 
                  Please restock to avoid shortages.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NDash;