import React, { useState, useEffect } from 'react';
import { ChevronRight, Play, BookOpen, Users, GraduationCap, Building2, Calendar, Stethoscope, UserCheck, Shield } from 'lucide-react';
import { NavLink,Link } from 'react-router-dom';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  const portals = [
    { icon: <BookOpen className="w-5 h-5" />, name: "Library", color: "from-blue-500 to-blue-600" },
    { icon: <Calendar className="w-5 h-5" />, name: "Attendance", color: "from-green-500 to-green-600" },
    { icon: <Users className="w-5 h-5" />, name: "Faculty", color: "from-purple-500 to-purple-600" },
    { icon: <Stethoscope className="w-5 h-5" />, name: "Hospital", color: "from-red-500 to-red-600" },
    { icon: <UserCheck className="w-5 h-5" />, name: "HOD", color: "from-orange-500 to-orange-600" },
    { icon: <Shield className="w-5 h-5" />, name: "Principal", color: "from-indigo-500 to-indigo-600" },
    { icon: <GraduationCap className="w-5 h-5" />, name: "Student", color: "from-teal-500 to-teal-600" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-500"></div>
      </div>      <div className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200/50 shadow-sm">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></span>
              <span>Complete Institution Management Platform</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  All-in-One Educational
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  & Administrative Suite
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Streamline your institution's operations with centralized portals for library, attendance, faculty, hospital, and student services. One platform, infinite possibilities.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <NavLink
                to="/login"
                className="group inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                <span>Get Started</span>
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </NavLink>
              
              <Link to="/pricing" className="group inline-flex items-center justify-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500/20 shadow-lg hover:shadow-xl">
                <Play className="w-5 h-5 transition-colors duration-300" />
                <span>Choose Your Portal</span>
              </Link>
            </div>

            {/* Stats or Features */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">8+</div>
                <div className="text-sm text-gray-600 font-medium">Integrated Portals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">100%</div>
                <div className="text-sm text-gray-600 font-medium">Cloud-Based</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">24/7</div>
                <div className="text-sm text-gray-600 font-medium">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className={`relative transition-all duration-1000 ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Main Dashboard Card */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100/50 overflow-hidden">
              
              {/* Dashboard Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">SmartCampus Dashboard</h3>
                    <p className="text-blue-100 text-sm">Institution Management Hub</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Portal Grid */}
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {portals.map((portal, index) => (
                    <div
                      key={index}
                      className={`group relative bg-gradient-to-br ${portal.color} p-4 rounded-2xl text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg transform`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {portal.icon}
                        </div>
                        <span className="text-sm font-semibold truncate">{portal.name}</span>
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>

                {/* Dashboard Stats */}
                <div className="mt-6 bg-gray-50/80 rounded-2xl p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">1,247</div>
                      <div className="text-xs text-gray-600">Active Users</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">98.5%</div>
                      <div className="text-xs text-gray-600">Uptime</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">15</div>
                      <div className="text-xs text-gray-600">Departments</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center text-white transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <GraduationCap className="w-8 h-8" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl shadow-lg flex items-center justify-center text-white transform -rotate-12 hover:rotate-0 transition-transform duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;