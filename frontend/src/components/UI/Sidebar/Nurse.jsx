import React, { useState, useEffect,useContext, use } from 'react';
import AuthContext from '../../../context/Auth';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../../../api/user';
import {  NavLink, useLocation } from 'react-router-dom';
import useTitle from '../../../hooks/pageTitle';
import {
  BarChart3,
  BookOpen,
  Plus,
  FolderOpen,
  Users,
  RefreshCw,
  Send,
  Undo2,
  Clock,
  Bookmark,
  Megaphone,
  Mail,
  User,
  LogOut,
  Phone,
  Settings,
  FileText,
  Cog,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Library,
  UserCheck,
  GraduationCap
} from 'lucide-react';

const sidebarMenuItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/librarian/dashboard/',
    icon: <BarChart3 />,
    description: 'Overview of library statistics'
  },
  {
    id: 'records',
    name: 'Record Management',
    icon: <BookOpen />,
    hasSubmenu: true,
    submenu: [
      {
        id: 'all-records',
        name: 'All Records',
        path: '/nurse/all-record/',
        icon: <Library />,
        description: 'View and search all records'
      },
      {
        id: 'add-record',
        name: 'Add Record',
        path: '/nurse/add-record',
        icon: <Plus />,
        description: 'Add new record to system'
      },
    
    ]
  },
  {
    id: 'product',
    name: 'Product',
    icon: <RefreshCw />,
    hasSubmenu: true,
    submenu: [
      {
        id: 'add-product',
        name: 'Add Product',
        path: '/nurse/add-product/',
        icon: <Send />,
        description: 'Add products to system'
      },
      {
        id: 'total-product',
        name: 'Total Product',
        path: '/nurse/total-product/',
        icon: <Library />,
        description: 'View all products in system'
      },
      
    ]
  }, {
    id: 'phone-number-finder',
    name: 'Phone Number Finder',
    path: '/nurse/phone-number-finder/',
    icon: <Phone />,
    description: 'View student phone numbers',
  }
  ,
  {
    id: 'announcements',
    name: 'Principal Announcements',
    path: '/nurse/principal/',
    icon: <Megaphone />,
    description: 'View principal notices and announcements'
  },  
  {
    id: 'account',
    name: 'Account',
    icon: <User />,
    hasSubmenu: true,
    submenu: [
      {
        id: 'profile',
        name: 'My Profile',
        path: '/nurse/profile',
        icon: <User />,
        description: 'Manage your profile'
      },
      {
        id: 'logout',
        name: 'Logout',
        icon: <LogOut />,
        description: 'Sign out of the system'
      }
    ]
  },
  
];

const Sidebar = ({ isAdmin = true, className = '' }) => {

  useTitle('Library Management System');
  

  const {data, isPending,error,isError } = useQuery({
    queryFn: fetchUser,
    queryKey: ['user'],
    staleTime:  5*60*100, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })




const {user,Logout} = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 

  // Auto-expand menu if current path matches
  useEffect(() => {
    const currentPath = location.pathname;
    const newExpandedMenus = { ...expandedMenus };
    
    sidebarMenuItems.forEach(item => {
      if (item.hasSubmenu) {
        const hasActiveSubmenu = item.submenu.some(sub => 
          currentPath.startsWith(sub.path)
        );
        if (hasActiveSubmenu) {
          newExpandedMenus[item.id] = true;
        }
      }
    });
    
    setExpandedMenus(newExpandedMenus);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const isActiveMenuItem = (item) => {
    if (item.path) {
      return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
    }
    if (item.hasSubmenu) {
      return item.submenu.some(sub => 
        location.pathname === sub.path || location.pathname.startsWith(sub.path + '/')
      );
    }
    return false;
  };

  const filteredMenuItems = sidebarMenuItems.filter(item => 
    !item.adminOnly || isAdmin
  );

  return (

    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebarOnMobile}
        />
      )}

      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-6  sm:top-24 left-4 z-50 p-3 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100/50 hover:bg-gray-50/80 transition-all duration-300 md:hidden"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white/95 backdrop-blur-xl border-r border-gray-100/50 shadow-xl z-45 transition-all duration-500 ease-out ${
          isOpen 
            ? isMobile 
              ? 'w-[80%] translate-x-0' 
              : 'w-72 translate-x-0'
            : '-translate-x-full'
        } ${className}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Library className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">NMS Portal</h2>
                <p className="text-sm text-gray-500">Nurse Management</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {filteredMenuItems.map((item) => (
                <div key={item.id}>
                  {/* Main Menu Item */}
                  {item.hasSubmenu ? (
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-xl transition-all duration-300 hover:bg-gray-50/80 group ${
                        isActiveMenuItem(item)
                          ? 'bg-blue-50/80 text-blue-600 shadow-sm'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className={`transition-transform duration-300 ${
                        expandedMenus[item.id] ? 'rotate-90' : ''
                      }`}>
                        <ChevronRight size={16} />
                      </div>
                    </button>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={closeSidebarOnMobile}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gray-50/80 group ${
                          isActive
                            ? 'bg-blue-50/80 text-blue-600 shadow-sm'
                            : 'text-gray-700 hover:text-blue-600'
                        }`
                      }
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </NavLink>
                  )}                  {/* Submenu Items */}
                  {item.hasSubmenu && (
                    <div className={`ml-4 mt-1 space-y-1 transition-all duration-300 overflow-hidden ${
                      expandedMenus[item.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      {item.submenu.map((subItem) => (
                        subItem.id === 'logout' ? (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              closeSidebarOnMobile();
                              Logout();
                            }}
                            className="cursor-pointer flex items-center space-x-3 px-4 py-2.5 ml-6 rounded-lg text-sm transition-all duration-300 hover:bg-gray-50/60 group relative text-gray-600 hover:text-blue-600 w-full text-left"
                          >
                            <span className="text-base">{subItem.icon}</span>
                            <span className="font-medium">{subItem.name}</span>
                          </button>
                        ) : (
                          <NavLink
                            key={subItem.id}
                            to={subItem.path}
                            onClick={closeSidebarOnMobile}
                            className={({ isActive }) =>
                              `flex items-center space-x-3 px-4 py-2.5 ml-6 rounded-lg text-sm transition-all duration-300 hover:bg-gray-50/60 group relative ${
                                isActive
                                  ? 'bg-blue-50/60 text-blue-600 border-l-2 border-blue-600'
                                  : 'text-gray-600 hover:text-blue-600'
                              }`
                            }
                          >
                            <span className="text-base">{subItem.icon}</span>
                            <span className="font-medium">{subItem.name}</span>
                          </NavLink>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100/50">
            <div className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <img src={import.meta.env.VITE_BASE_URL + data?.picture} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {isPending && !data?.first_name && !data?.last_name ?"LibraryUser": `${data?.first_name} ${data?.last_name}` } 
                </p>
                <p className="text-xs text-gray-500 truncate">
                  @{user.username}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"></div>
      </aside>

      {/* Main Content Spacer */}
      {!isMobile && isOpen && (
        <div className="w-72 flex-shrink-0" />
      )}
    </>
  );
};

export default Sidebar;