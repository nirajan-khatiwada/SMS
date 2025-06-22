import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Hospital, 
  UserCheck, 
  Brain, 
  GraduationCap,
  ArrowRight,
  Zap,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const OverView = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const portals = [
    {
      id: 'lms',
      title: 'LMS',
      subtitle: 'Library Management System',
      icon: <BookOpen className="w-8 h-8" />,
      description: 'Manage books, borrowing, and inventory efficiently.',
      detailedInfo: 'Complete digital library solution with automated cataloging, real-time availability tracking, and seamless borrowing workflows.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'ams',
      title: 'AMS',
      subtitle: 'Attendance Management System',
      icon: <Calendar className="w-8 h-8" />,
      description: 'Track and manage attendance for students and faculty.',
      detailedInfo: 'Advanced attendance tracking with biometric integration, automated reports, and real-time notifications for parents and administrators.',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 'tms',
      title: 'TMS',
      subtitle: 'Teacher Management System',
      icon: <Users className="w-8 h-8" />,
      description: 'Assign teachers and monitor real-time schedules.',
      detailedInfo: 'Comprehensive teacher management with scheduling, performance tracking, and resource allocation tools.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 'hms-hospital',
      title: 'HMS',
      subtitle: 'Hospital Management System',
      icon: <Hospital className="w-8 h-8" />,
      description: 'Access medical records, sick leaves, and logs.',
      detailedInfo: 'Complete health management system with medical records, emergency protocols, and health monitoring dashboards.',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
  
    {
      id: 'pms',
      title: 'PMS',
      subtitle: 'Principal Management System',
      icon: <Brain className="w-8 h-8" />,
      description: 'Analytics dashboard and control at the principal level.',
      detailedInfo: 'Executive dashboard with comprehensive analytics, institutional insights, and strategic planning tools.',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      id: 'sms',
      title: 'SMS',
      subtitle: 'Student Management System',
      icon: <GraduationCap className="w-8 h-8" />,
      description: 'Students view all records and reports from a single dashboard.',
      detailedInfo: 'Unified student portal for grades, schedules, assignments, and communication with faculty.',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
            <Globe className="w-4 h-4" />
            <span>Platform Overview</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How Our{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SmartCampus
            </span>{' '}
            Platform Works
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive suite of integrated management systems designed to streamline every aspect of educational administration.
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-100">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Integrated Workflow</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-100">
              <Globe className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Unified Dashboard</span>
            </div>
          </div>
        </div>        {/* Portals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 mb-16">
          {portals.map((portal) => (
            <div
              key={portal.id}
              className="group relative"
              onMouseEnter={() => setHoveredCard(portal.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >              <div className={`
                relative bg-white/80 backdrop-blur-xl rounded-2xl p-3 md:p-6 shadow-xl border border-gray-100/50 
                transition-all duration-500 ease-out cursor-pointer h-full
                hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2 hover:scale-105
                ${hoveredCard === portal.id ? 'ring-2 ring-blue-500/20' : ''}
              `}>                {/* Icon Container */}
                <div className={`
                  w-12 h-12 md:w-16 md:h-16 rounded-2xl ${portal.bgColor} flex items-center justify-center mb-3 md:mb-4
                  transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                `}>
                  <div className={portal.textColor}>
                    <div className="w-6 h-6 md:w-8 md:h-8">
                      {React.cloneElement(portal.icon, { className: "w-full h-full" })}
                    </div>
                  </div>
                </div>                {/* Content */}
                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {portal.title}
                  </h3>
                  <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {portal.subtitle}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-xs md:text-sm">
                    {portal.description}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </div>

                {/* Gradient Border */}
                <div className={`
                  absolute inset-0 rounded-2xl bg-gradient-to-r ${portal.color} opacity-0 
                  group-hover:opacity-10 transition-opacity duration-300 pointer-events-none
                `}></div>
              </div>

              {/* Detailed Info Popup */}
              {hoveredCard === portal.id && (
                <div className="absolute top-full left-0 right-0 mt-2 z-20 opacity-0 animate-fade-in">
                  <div className="bg-white/95 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-gray-100/50">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {portal.detailedInfo}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Integration Flow */}
        <div className="text-center mb-12 hidden md:block">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-100/50">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-gray-700">Real-time Data Sync</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-700">Automated Workflows</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium text-gray-700">Unified Reports</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link to ="/login" className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20">
            <span>Explore Portals</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            
            {/* Button Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
          </Link>
          
          <p className="mt-4 text-sm text-gray-500">
            Access detailed portal information and login options
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default OverView;