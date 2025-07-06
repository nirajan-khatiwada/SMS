import React, { useState,useContext } from 'react';
import AuthContext from '../context/Auth';
import { Eye, EyeOff, Mail, Lock, Shield, User, ChevronDown, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';
import Logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import useTitle from "../hooks/pageTitle"
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const Login = () => {
    // State to manage form data and loading state
    const { Login:login } = useContext(AuthContext);

    const {register, handleSubmit, formState: { errors,isSubmitting }} = useForm();
    useTitle("Login | Smart Campus");
    const [showPassword, setShowPassword] = useState(false);


  const portals = [
    { value: 'librarian', label: 'Library Management', icon: '📚' },
    { value: 'teacher', label: 'Teacher Portal', icon: '👨‍🏫' },
    { value: 'student', label: 'Student Portal', icon: '🎓' },
    { value: 'principal', label: 'Principal Portal', icon: '🏛️' },
    { value: 'nurse', label: 'Nurse Management', icon: '🏥' },
    { value: 'hod', label: 'Coordinator Management', icon: '📋' }
  ];

  const handleLogin = async (e) => {
   try{
    await login(e)
   }catch(err){
    toast.error('Login failed. Please check your credentials and try again.');
    
    
    
   }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      {/* Go Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-gray-700 hover:text-blue-600 hover:bg-white/95 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-100/50 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-sm font-medium">Go Back</span>
      </Link>

      {/* Login Container */}
      <div className="relative w-[80%] sm:w-full max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100/50 overflow-hidden">
          {/* Header Section */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src={Logo}
                  alt="Platform Logo"
                  className="w-16 h-16 object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600 text-sm font-medium">One platform. Many portals. Total control.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(handleLogin)} className="px-8 pb-8 space-y-6">            {/* Portal Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Select Portal
              </label>
              <div className="relative">
                <select
                  name="portal"
                  {...register("role", { required: "Please select a portal" })}
                  className={`w-full pl-4 pr-10 py-3 bg-gray-50/80 border rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none font-medium ${
                    errors.role 
                      ? "border-red-400 focus:border-red-500 bg-red-50/30" 
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                >
                  {portals.map(portal => (
                    <option key={portal.value} value={portal.value}>
                      {portal.icon} {portal.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.role && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 text-red-700 font-mono text-sm font-medium">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="leading-tight">{errors.role.message}</span>
                  </div>
                </div>
              )}
            </div>            {/* Email/Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
              Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register("username", { required: "Username is required", minLength:{value:5,message:"Username must be at least 5 characters long"}})}
                  placeholder="Enter your username"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50/80 border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-medium ${
                    errors.username 
                      ? "border-red-400 focus:border-red-500 bg-red-50/30" 
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                  required
                />
              </div>
              {errors.username && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 text-red-700 font-mono text-sm font-medium">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="leading-tight">{errors.username.message}</span>
                  </div>
                </div>
              )}
            </div>            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register("password", { required: "Password is required", minLength:{value:5,message:"Password must be at least 5 characters long"}})}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 bg-gray-50/80 border rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-medium ${
                    errors.password 
                      ? "border-red-400 focus:border-red-500 bg-red-50/30" 
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 text-red-700 font-mono text-sm font-medium">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="leading-tight">{errors.password.message}</span>
                  </div>
                </div>
              )}
            </div>

     
            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>

     
            
          </form>
        </div>

     
      </div>
    </div>
  );
};

export default Login;