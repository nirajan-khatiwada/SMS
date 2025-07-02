import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Save, 
  X, 
  User, 
  Package, 
  Heart, 
  FileText, 
  Phone, 
  UserCheck,
  ArrowLeft,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postRecord } from '../../api/nurse';
import { getStudentProfile } from '../../api/student';
import { getProducts } from '../../api/nurse';
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
const HealthConditionTag = ({ condition, onClick, selected }) => {
  const conditionConfig = HEALTH_CONDITIONS.find(c => c.value === condition);
  if (!conditionConfig) return null;

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(condition)}
      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
        conditionConfig.color
      } ${
        onClick ? 'hover:shadow-sm cursor-pointer hover:scale-105' : ''
      } ${
        selected ? 'ring-2 ring-blue-500 ring-opacity-50 scale-105' : ''
      }`}
    >
      <span>{conditionConfig.label}</span>
    </button>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div>
          <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-64"></div>
        </div>
      </div>
    </div>
    
    {/* Form Skeleton */}
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
        <div className="flex space-x-4 pt-6 border-t border-gray-100/50">
          <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
          <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
        </div>
      </div>
    </div>
  </div>
);

const NAddRecord = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Form state
  const [formData, setFormData] = useState({
    student: '',
    product: '',
    quantity: 0,
    visit_reason: '',
    health_condition: '',
    treatment_given: '',
    parent_contacted: false,
    referred_to_doctor: false,
    note: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  // Fetch students
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getStudentProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create record mutation
  const createRecordMutation = useMutation({
    mutationFn: postRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries(['products']);
      toast.success('Record added successfully!');
      navigate('/nurse/all-record');
    },
    onError: (error) => {
      toast.error('Failed to add record. Please try again.');
      console.error('Error adding record:', error);
    },
  });

  const isLoading = studentsLoading || productsLoading;

  // Filter students based on search
  const filteredStudents = students.filter(student => {
    if (!studentSearch) return false;
    
    const searchLower = studentSearch.toLowerCase();
    const firstName = student.user?.first_name?.toLowerCase() || '';
    const lastName = student.user?.last_name?.toLowerCase() || '';
    const fullName = `${firstName} ${lastName}`;
    const studentId = student.student_id?.toString() || student.id?.toString() || '';
    const className = student.class_name?.name?.toLowerCase() || '';
    const sectionName = student.section?.name?.toLowerCase() || '';
    
    return firstName.includes(searchLower) ||
           lastName.includes(searchLower) ||
           fullName.includes(searchLower) ||
           studentId.includes(studentSearch) ||
           className.includes(searchLower) ||
           sectionName.includes(searchLower);
  });

  const selectedStudent = students.find(s => s.id === formData.student);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'student' || name === 'quantity') {
      // Convert to integer for certain fields
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || (name === 'quantity' ? 0 : '')
      }));
    } else if (name === 'product') {
      // Reset quantity when product changes
      setFormData(prev => ({
        ...prev,
        product: parseInt(value) || '',
        quantity: parseInt(value) ? 1 : 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.student) {
      newErrors.student = 'Please select a student';
    }
    
    if (!formData.visit_reason.trim()) {
      newErrors.visit_reason = 'Visit reason is required';
    }
    
    if (!formData.health_condition.trim()) {
      newErrors.health_condition = 'Health condition is required';
    }
    
    if (!formData.treatment_given.trim()) {
      newErrors.treatment_given = 'Treatment given is required';
    }
    
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createRecordMutation.mutateAsync(formData);
    } catch (error) {
      // Error is handled in the mutation's onError
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/nurse/all-records');
  };

  const handleStudentSelect = (student) => {
    setFormData(prev => ({ ...prev, student: student.id }));
    setStudentSearch(`${student.user.first_name} ${student.user.last_name} (ID: ${student.student_id || student.id})`);
    setShowStudentDropdown(false);
    
    // Clear error when student is selected
    if (errors.student) {
      setErrors(prev => ({ ...prev, student: '' }));
    }
  };

  const handleStudentSearchChange = (e) => {
    const value = e.target.value;
    setStudentSearch(value);
    setShowStudentDropdown(value.length > 0);
    
    // Clear selection if search is cleared
    if (!value) {
      setFormData(prev => ({ ...prev, student: '' }));
    }
  };

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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Record</h1>
              <p className="text-gray-600">Create a new medical record for a student</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-100/50 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Student Selection */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <User size={16} className="text-blue-600" />
                <span>Student *</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search student by name, ID, class, or section..."
                  value={studentSearch}
                  onChange={handleStudentSearchChange}
                  onFocus={() => studentSearch && setShowStudentDropdown(true)}
                  onBlur={() => {
                    // Delay to allow click events to fire first
                    setTimeout(() => setShowStudentDropdown(false), 200);
                  }}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                    errors.student ? 'border-red-300 bg-red-50/50' : 'border-gray-200/50 bg-gray-50/50'
                  }`}
                />
                
                {showStudentDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200/50 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.slice(0, 10).map((student) => (
                        <div
                          key={student.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleStudentSelect(student);
                          }}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">
                            {student.user.first_name} {student.user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {student.student_id || student.id} • Class {student.class_name.name} Section {student.section.name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        No students found matching "{studentSearch}"
                      </div>
                    )}
                  </div>
                )}
                
                {selectedStudent && (
                  <div className="mt-2 p-3 bg-blue-50/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-blue-600" />
                      <span className="font-medium text-gray-900">
                        {selectedStudent.user.first_name} {selectedStudent.user.last_name}
                      </span>
                      <span className="text-sm text-gray-500">
                        (ID: {selectedStudent.student_id || selectedStudent.id})
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Class {selectedStudent.class_name.name} • Section {selectedStudent.section.name}
                    </div>
                  </div>
                )}
              </div>
              {errors.student && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <X size={14} />
                  <span>{errors.student}</span>
                </p>
              )}
            </div>

            {/* Product and Quantity Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Package size={16} className="text-blue-600" />
                  <span>Product/Medicine (Optional)</span>
                </label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/50 bg-gray-50/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                >
                  <option value="">Select Product (Optional)</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - Stock: {product.stock}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Package size={16} className="text-blue-600" />
                  <span>Quantity</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                    errors.quantity ? 'border-red-300 bg-red-50/50' : 'border-gray-200/50 bg-gray-50/50'
                  }`}
                  placeholder="1"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm flex items-center space-x-1">
                    <X size={14} />
                    <span>{errors.quantity}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Visit Reason */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Heart size={16} className="text-blue-600" />
                <span>Visit Reason *</span>
              </label>
              <textarea
                name="visit_reason"
                value={formData.visit_reason}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                  errors.visit_reason ? 'border-red-300 bg-red-50/50' : 'border-gray-200/50 bg-gray-50/50'
                }`}
                placeholder="Describe the reason for the visit..."
              />
              {errors.visit_reason && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <X size={14} />
                  <span>{errors.visit_reason}</span>
                </p>
              )}
            </div>

            {/* Health Condition */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Activity size={16} className="text-blue-600" />
                <span>Health Condition *</span>
              </label>
              <div className="space-y-4">
                <div className="w-full max-w-[80%]">
                  <div className="flex flex-wrap gap-3">
                    {HEALTH_CONDITIONS.map((condition) => (
                      <HealthConditionTag
                        key={condition.value}
                        condition={condition.value}
                        onClick={(value) => {
                          setFormData(prev => ({ ...prev, health_condition: value }));
                          if (errors.health_condition) {
                            setErrors(prev => ({ ...prev, health_condition: '' }));
                          }
                        }}
                        selected={formData.health_condition === condition.value}
                      />
                    ))}
                  </div>
                </div>
                {formData.health_condition && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Selected:</span>
                    <HealthConditionTag condition={formData.health_condition} />
                  </div>
                )}
              </div>
              {errors.health_condition && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <X size={14} />
                  <span>{errors.health_condition}</span>
                </p>
              )}
            </div>

            {/* Treatment Given */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Heart size={16} className="text-blue-600" />
                <span>Treatment Given *</span>
              </label>
              <textarea
                name="treatment_given"
                value={formData.treatment_given}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                  errors.treatment_given ? 'border-red-300 bg-red-50/50' : 'border-gray-200/50 bg-gray-50/50'
                }`}
                placeholder="Describe the treatment provided..."
              />
              {errors.treatment_given && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <X size={14} />
                  <span>{errors.treatment_given}</span>
                </p>
              )}
            </div>

            {/* Checkboxes Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Parent Contacted */}
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="parent_contacted"
                    checked={formData.parent_contacted}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 bg-gray-50 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">Parent Contacted</span>
                  </div>
                </label>
              </div>

              {/* Referred to Doctor */}
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="referred_to_doctor"
                    checked={formData.referred_to_doctor}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 bg-gray-50 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex items-center space-x-2">
                    <UserCheck size={16} className="text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">Referred to Doctor</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <FileText size={16} className="text-blue-600" />
                <span>Additional Notes</span>
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/50 bg-gray-50/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                placeholder="Any additional notes or observations..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-100/50">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Adding Record...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Add Record</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <ArrowLeft size={18} />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NAddRecord;