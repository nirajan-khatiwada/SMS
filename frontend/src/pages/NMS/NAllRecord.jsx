import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  User, 
  Package, 
  Heart, 
  Phone, 
  UserCheck, 
  Calendar,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  FileText,
  CheckCircle,
  X,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllRecords, updateRecord, deleteRecord } from '../../api/nurse';
import { toast } from 'react-toastify';

// Health condition choices matching the backend
const HEALTH_CONDITIONS = [
  { value: 'Critical', label: 'Critical', color: 'bg-red-50/80 text-red-600 border border-red-200/50' },
  { value: 'Serious', label: 'Serious', color: 'bg-orange-50/80 text-orange-600 border border-orange-200/50' },
  { value: 'Stable', label: 'Stable', color: 'bg-yellow-50/80 text-yellow-600 border border-yellow-200/50' },
  { value: 'Recovered', label: 'Recovered', color: 'bg-green-50/80 text-green-600 border border-green-200/50' },
  { value: 'Deceased', label: 'Deceased', color: 'bg-gray-50/80 text-gray-600 border border-gray-200/50' },
  { value: 'Normal', label: 'Normal', color: 'bg-blue-50/80 text-blue-600 border border-blue-200/50' }
];

// Health Condition Tag Component
const HealthConditionTag = ({ condition }) => {
  const conditionConfig = HEALTH_CONDITIONS.find(c => c.value === condition);
  if (!conditionConfig) return condition;

  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${conditionConfig.color}`}>
      <span>{conditionConfig.label}</span>
    </span>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((item) => (
      <div
        key={item}
        className="bg-white/70 rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
          </div>
          <div className="flex space-x-2">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-4 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
);

const StatusBadge = ({ status, text }) => {
  const configs = {
    contacted: {
      className: "bg-green-50/80 text-green-600 border border-green-200/50",
      icon: <CheckCircle size={12} />
    },
    not_contacted: {
      className: "bg-gray-50/80 text-gray-600 border border-gray-200/50",
      icon: <X size={12} />
    },
    referred: {
      className: "bg-blue-50/80 text-blue-600 border border-blue-200/50",
      icon: <UserCheck size={12} />
    },
    not_referred: {
      className: "bg-gray-50/80 text-gray-600 border border-gray-200/50",
      icon: <X size={12} />
    }
  };

  const config = configs[status] || configs.not_contacted;

  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.icon}
      <span>{text}</span>
    </span>
  );
};

const RecordCard = ({ record, onDelete, onView }) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50 hover:bg-white/80 transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100/80 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 truncate">
                {record.student?.user?.first_name} {record.student?.user?.last_name}
              </h3>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  ID: {record.student?.student_id || record.student?.id} • Class {record.student?.class_name?.name} • Section {record.student?.section?.name}
                </p>
                <p className="text-xs text-gray-500">
                  Student ID: {record.student?.student_id || record.student?.id}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-2 sm:space-x-2">
          <button
            onClick={() => onView(record)}
            className="p-2 text-blue-600 hover:bg-blue-50/80 rounded-lg transition-all duration-300"
            title="View Details"
          >
            <Eye size={16} />
          </button>
         
          <button
            onClick={() => onDelete(record)}
            className="p-2 text-red-600 hover:bg-red-50/80 rounded-lg transition-all duration-300"
            title="Delete Record"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Record Details */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Heart size={14} className="text-red-500" />
            <span className="font-medium">Reason:</span>
            <span className="truncate">{record.visit_reason}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar size={14} className="text-blue-500" />
            <span className="font-medium">Date:</span>
            <span className="truncate">{new Date(record.date).toLocaleDateString()}</span>
          </div>
          {record.product && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Package size={14} className="text-purple-500" />
              <span className="font-medium">Medicine:</span>
              <span className="truncate">{record.product.name} (Qty: {record.quantity})</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Heart size={14} className="text-orange-500" />
          <span className="font-medium">Condition:</span>
          <HealthConditionTag condition={record.health_condition} />
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Heart size={14} className="text-green-500" />
          <span className="font-medium">Treatment:</span>
          <span className="line-clamp-1">{record.treatment_given}</span>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100/50">
          <StatusBadge 
            status={record.parent_contacted ? "contacted" : "not_contacted"} 
            text={record.parent_contacted ? "Parent Contacted" : "Parent Not Contacted"} 
          />
          <StatusBadge 
            status={record.referred_to_doctor ? "referred" : "not_referred"} 
            text={record.referred_to_doctor ? "Referred to Doctor" : "Not Referred"} 
          />
        </div>

        {record.note && (
          <div className="mt-3 p-3 bg-gray-50/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <FileText size={14} className="text-gray-500 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-gray-700">Notes:</span>
                <p className="text-sm text-gray-600 mt-1">{record.note}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ViewRecordModal = ({ record, isOpen, onClose }) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100/50">
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100/50 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Medical Record Details
              </h2>
              <p className="text-gray-600">
                {record.student?.user?.first_name} {record.student?.user?.last_name} (ID: {record.student?.student_id || record.student?.id}) - 
                Class {record.student?.class_name?.name} Section {record.student?.section?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Visit Information */}
            <div className="bg-blue-50/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Heart size={20} />
                <span>Visit Information</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Visit Date</p>
                  <p className="font-medium text-gray-900">{new Date(record.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Visit Reason</p>
                  <p className="font-medium text-gray-900">{record.visit_reason}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Health Condition</p>
                  <div className="mt-1">
                    <HealthConditionTag condition={record.health_condition} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Treatment Given</p>
                  <p className="font-medium text-gray-900">{record.treatment_given}</p>
                </div>
              </div>
            </div>

            {/* Medicine Information */}
            {record.product && (
              <div className="bg-purple-50/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Package size={20} />
                  <span>Medicine/Product</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Product</p>
                    <p className="font-medium text-gray-900">{record.product.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium text-gray-900">{record.quantity}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Status Information */}
            <div className="bg-green-50/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <CheckCircle size={20} />
                <span>Status</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Parent Contacted:</span>
                  <StatusBadge 
                    status={record.parent_contacted ? "contacted" : "not_contacted"} 
                    text={record.parent_contacted ? "Yes" : "No"} 
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <UserCheck size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Referred to Doctor:</span>
                  <StatusBadge 
                    status={record.referred_to_doctor ? "referred" : "not_referred"} 
                    text={record.referred_to_doctor ? "Yes" : "No"} 
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {record.note && (
              <div className="bg-gray-50/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <FileText size={20} />
                  <span>Additional Notes</span>
                </h3>
                <p className="text-gray-900">{record.note}</p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-gray-100/50 p-6">
          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NAllRecord = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Fetch records
  const { data: records = [], isLoading, error, refetch } = useQuery({
    queryKey: ['records'],
    queryFn: getAllRecords,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success('Record deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete record. Please try again.');
    },
  });

  // Filter and search records
  const filteredRecords = useMemo(() => {
    if (!records) return [];
    
    return records.filter(record => {
      const matchesSearch = !searchTerm || 
        record.student?.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.student?.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.student?.student_id?.toString().includes(searchTerm) ||
        record.student?.id?.toString().includes(searchTerm) ||
        record.visit_reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.health_condition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.treatment_given?.toLowerCase().includes(searchTerm.toLowerCase());

      // Get current month and year
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const recordDate = new Date(record.date);
      const recordMonth = recordDate.getMonth();
      const recordYear = recordDate.getFullYear();

      const matchesFilter = filterType === 'all' ||
        (filterType === 'this_month' && recordMonth === currentMonth && recordYear === currentYear) ||
        (filterType === 'parent_contacted' && record.parent_contacted) ||
        (filterType === 'referred' && record.referred_to_doctor) ||
        (filterType === 'with_medicine' && record.product);

      return matchesSearch && matchesFilter;
    });
  }, [records, searchTerm, filterType]);

  const handleAddRecord = () => {
    navigate('/nurse/add-record');
  };

 
  const handleDeleteRecord = (record) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteMutation.mutate(record.id);
    }
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  if (error) {
    return (
      <div className="flex-1 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50/50 border border-red-200 rounded-xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Records</h3>
            <p className="text-red-700 mb-4">There was an error loading the medical records.</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">All Medical Records</h1>
                <p className="text-sm sm:text-base text-gray-600">View and manage all student medical records</p>
              </div>
            </div>
            <button
              onClick={handleAddRecord}
              className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto"
            >
              <Plus size={18} />
              <span>Add Record</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="sm:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by student name, ID, reason, condition, or treatment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 text-sm"
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 text-sm"
            >
              <option value="all">All Records</option>
              <option value="this_month">This Month</option>
              <option value="parent_contacted">Parent Contacted</option>
              <option value="referred">Referred to Doctor</option>
              <option value="with_medicine">With Medicine</option>
            </select>

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/70 border border-gray-200 rounded-xl hover:bg-gray-50/80 transition-all duration-300 text-sm"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 text-sm text-gray-600">
          <span>
            Showing {filteredRecords.length} of {records.length} records
          </span>
          {searchTerm && (
            <span className="text-xs sm:text-sm">
              Search results for "{searchTerm}"
            </span>
          )}
        </div>

        {/* Records List */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterType !== 'all' ? 'No matching records found' : 'No medical records yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Start by adding the first medical record'
              }
            </p>
            <button
              onClick={handleAddRecord}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 mx-auto"
            >
              <Plus size={18} />
              <span>Add First Record</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                onDelete={handleDeleteRecord}
                onView={handleViewRecord}
              />
            ))}
          </div>
        )}

        {/* View Record Modal */}
        <ViewRecordModal
          record={selectedRecord}
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedRecord(null);
          }}
        />
      </div>
    </div>
  );
};

export default NAllRecord;