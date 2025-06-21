import React, { useState, useContext, useEffect } from 'react';
import { useQuery,useMutation } from '@tanstack/react-query';
import { updateEmailAndFn,fetchUser } from '../../api/api';

import {
    Shield,
  User,
  Mail,
  AtSign,
  Edit,
  Save,
  X,
  Lock,
  Settings,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';
import { set } from 'react-hook-form';

const Lprofile = () => {
    const { data,isPending} = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    })

    

    const {mutate:profileMutate}=useMutation({
        mutationFn: (data)=>{
            //split data into first_name and last_name comb
            const [first_name, ...last_name] = data.fullName.split(' ');
            return updateEmailAndFn({
                first_name,
                last_name: last_name.join(' '),
                email: data.email,
            },
            
        
        );
        },
        onSuccess: (sdata,data) => {
            console.log('Profile updated successfully:', sdata,data);
            
        },
    })

    
 
  // State for editing
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    username: '',
    role: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Handlers
  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  useEffect(() => {
    if (data) {
      setPersonalInfo({
        fullName: (data.first_name + ' ' + data.last_name).trim(),
        email: data.email || '',
        username: data.username || '',
        role: data.role || ''
      });
    }
  }, [data]);

  const handleSavePersonalInfo = () => {
    // API call to save personal info
    profileMutate(
        {
            fullName: personalInfo.fullName,
            email: personalInfo.email,

        }
    )
    setIsEditingPersonal(false);
  };  
  
  const handleCancelPersonalEdit = () => {
    // Reset to original values from API data
    if (data) {
      setPersonalInfo({
        fullName: (data.first_name + ' ' + data.last_name).trim(),
        email: data.email || '',
        username: data.username || '',
        role: data.role || ''
      });
    }
    setIsEditingPersonal(false);
  };

  const handleChangePassword = () => {
    // API call to change password
    console.log('Changing password');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangingPassword(false);
  };

  const handleCancelPasswordChange = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangingPassword(false);
  };
  // Loading state
  if (isPending) {
    return (
      <div className="flex-1 overflow-y-auto bg-gray-50/30">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and account settings</p>
          </div>

          {/* Loading Skeleton */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
            <div className="p-6 border-b border-gray-100/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                  <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
            <div className="p-6 border-b border-gray-100/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                <div className="h-10 bg-gray-100 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/30">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
          <div className="p-6 border-b border-gray-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  <p className="text-sm text-gray-500">Your basic profile details</p>
                </div>
              </div>
              {!isEditingPersonal && (
                <button
                  onClick={() => setIsEditingPersonal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50/80 text-blue-600 rounded-xl hover:bg-blue-100/80 transition-all duration-300 hover:scale-105"
                >
                  <Edit className="w-4 h-4" />
                  <span className="font-medium">Edit</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </label>
              {isEditingPersonal ? (
                <input
                  type="text"
                  value={personalInfo.fullName}
                  onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50/30 rounded-xl text-gray-900 font-medium">
                  {personalInfo.fullName}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Role</span>
              </label>
              <div className="px-4 py-3 bg-gray-50/30 rounded-xl text-gray-600 flex items-center justify-between">
                <span className="font-medium">{personalInfo.role}</span>
                <span className="text-xs text-gray-500 bg-gray-200/50 px-2 py-1 rounded-lg">
                  Read Only
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </label>
              {isEditingPersonal ? (
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email address"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50/30 rounded-xl text-gray-900 font-medium">
                  {personalInfo.email}
                </p>
              )}
            </div>            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <AtSign className="w-4 h-4" />
                <span>Username</span>
              </label>
              <div className="px-4 py-3 bg-gray-50/30 rounded-xl text-gray-600 flex items-center justify-between">
                <span className="font-medium">{personalInfo.username}</span>
                <span className="text-xs text-gray-500 bg-gray-200/50 px-2 py-1 rounded-lg">
                  Read Only
                </span>
              </div>
            </div>

            {/* Edit Actions */}
            {isEditingPersonal && (
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-100/50">
                <button
                  onClick={handleSavePersonalInfo}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  <span className="font-medium">Save Changes</span>
                </button>
                <button
                  onClick={handleCancelPersonalEdit}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100/80 text-gray-700 rounded-xl hover:bg-gray-200/80 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                  <span className="font-medium">Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
          <div className="p-6 border-b border-gray-100/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
                <p className="text-sm text-gray-500">Security and notification preferences</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Change Password */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Change Password</h3>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                </div>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="px-4 py-2 bg-blue-50/80 text-blue-600 rounded-xl hover:bg-blue-100/80 transition-all duration-300 hover:scale-105 font-medium"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {isChangingPassword && (
                <div className="ml-8 space-y-4 p-4 bg-gray-50/30 rounded-xl">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      onClick={handleChangePassword}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      <Save className="w-4 h-4" />
                      <span className="font-medium">Update Password</span>
                    </button>
                    <button
                      onClick={handleCancelPasswordChange}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100/80 text-gray-700 rounded-xl hover:bg-gray-200/80 transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                      <span className="font-medium">Cancel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Message (conditionally rendered) */}
        {/* You can add this based on API responses */}
        {false && (
          <div className="bg-green-50/80 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">Profile updated successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lprofile;