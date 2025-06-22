import React, { useState, useEffect } from 'react';
import {
  Mail,
  Users,
  UserCheck,
  Search,
  Plus,
  X,
  Send,
  Calendar,
  FileText,
  Upload,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Filter,
  Download
} from 'lucide-react';

const LNotify = () => {
  const [selectedRecipientType, setSelectedRecipientType] = useState('all');
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data for classes
  const availableClasses = [
    { id: 1, name: 'Grade 10', students: 45 },
    { id: 2, name: 'Grade 11 Science', students: 38 },
    { id: 3, name: 'Grade 11 Commerce', students: 42 },
    { id: 4, name: 'Grade 12 Science', students: 35 },
    { id: 5, name: 'Grade 12 Commerce', students: 40 },
  ];

  // Mock data for users (search results)
  const searchResults = [
    { id: 1, name: 'John Smith', class: 'Grade 12 Science', email: 'john@school.edu' },
    { id: 2, name: 'Emma Wilson', class: 'Grade 11 Commerce', email: 'emma@school.edu' },
    { id: 3, name: 'Michael Brown', class: 'Grade 10', email: 'michael@school.edu' },
  ];

  // Mock notification history
  const notificationHistory = [
    {
      id: 1,
      title: 'Library Book Return Reminder',
      audience: 'Grade 12',
      date: '2025-06-20',
      status: 'Sent',
      recipients: 35
    },
    {
      id: 2,
      title: 'New Books Available',
      audience: 'All Users',
      date: '2025-06-18',
      status: 'Sent',
      recipients: 200
    },
    {
      id: 3,
      title: 'Library Closure Notice',
      audience: 'All Users',
      date: '2025-06-15',
      status: 'Sent',
      recipients: 200
    }
  ];

  const handleClassToggle = (classItem) => {
    setSelectedClasses(prev => {
      const exists = prev.find(c => c.id === classItem.id);
      if (exists) {
        return prev.filter(c => c.id !== classItem.id);
      } else {
        return [...prev, classItem];
      }
    });
  };

  const handleUserAdd = (user) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(prev => [...prev, user]);
    }
    setSearchQuery('');
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const calculateTotalRecipients = () => {
    if (selectedRecipientType === 'all') return 200; // Mock total users
    if (selectedRecipientType === 'class') {
      return selectedClasses.reduce((total, cls) => total + cls.students, 0);
    }
    if (selectedRecipientType === 'specific') return selectedUsers.length;
    return 0;
  };

  const handleSendNotification = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    
    // Reset form
    setNotificationTitle('');
    setNotificationMessage('');
    setAttachment(null);
    setSelectedUsers([]);
    setSelectedClasses([]);
    setSelectedRecipientType('all');
    
    alert('Notification sent successfully!');
  };

  // Loading skeleton component
  const LoadingSkeleton = ({ lines = 3, height = 'h-4' }) => (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`bg-gray-200 rounded ${height} ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}></div>
      ))}
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50/30 overflow-y-auto">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Send Notification</h1>
              <p className="text-sm text-gray-500">Send messages to students and users</p>
            </div>
          </div>
        </div>
      </div>      {/* Main Content */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-5 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
          
          {/* Card 1: Select Recipients */}
          <div className="xl:col-span-2 lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">              <div className="p-4 md:p-6 border-b border-gray-100/50">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Select Recipients</h2>
                </div>
              </div>
              
              <div className="p-4 md:p-6 space-y-4">
                {/* Recipient Type Selection */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="recipientType"
                      value="all"
                      checked={selectedRecipientType === 'all'}
                      onChange={(e) => setSelectedRecipientType(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">All Users</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="recipientType"
                      value="class"
                      checked={selectedRecipientType === 'class'}
                      onChange={(e) => setSelectedRecipientType(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">All Users of Specific Class</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="recipientType"
                      value="specific"
                      checked={selectedRecipientType === 'specific'}
                      onChange={(e) => setSelectedRecipientType(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Specific Users</span>
                  </label>
                </div>

                {/* Class Selection */}
                {selectedRecipientType === 'class' && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Select Classes</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {availableClasses.map(classItem => (
                        <label key={classItem.id} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg cursor-pointer hover:bg-gray-100/80 transition-colors">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedClasses.some(c => c.id === classItem.id)}
                              onChange={() => handleClassToggle(classItem)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">{classItem.name}</span>
                          </div>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                            {classItem.students} students
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specific User Selection */}
                {selectedRecipientType === 'specific' && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Search & Add Users</label>
                    
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Search Results */}
                    {searchQuery && (
                      <div className="bg-gray-50/80 rounded-lg p-2 space-y-1 max-h-32 overflow-y-auto">
                        {searchResults
                          .filter(user => 
                            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map(user => (
                            <button
                              key={user.id}
                              onClick={() => handleUserAdd(user)}
                              className="w-full text-left p-2 hover:bg-white rounded-lg transition-colors"
                            >
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.class} • {user.email}</div>
                            </button>
                          ))
                        }
                      </div>
                    )}

                    {/* Selected Users */}
                    {selectedUsers.length > 0 && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Selected Users</label>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {selectedUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-2 bg-blue-50/80 rounded-lg">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.class}</div>
                              </div>
                              <button
                                onClick={() => handleUserRemove(user.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Recipients Count */}
                <div className="flex items-center justify-center p-3 bg-green-50/80 rounded-lg border border-green-200/50">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-700">
                    {calculateTotalRecipients()} recipients selected
                  </span>
                </div>
              </div>
            </div>
          </div>          {/* Card 2: Compose Notification */}
          <div className="xl:col-span-3 lg:col-span-2 space-y-4 md:space-y-6">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">              <div className="p-4 md:p-6 border-b border-gray-100/50">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Compose Notification</h2>
                </div>
              </div>
              
              <div className="p-4 md:p-6 space-y-4">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title / Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Library Reminder, New Books Available..."
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Make it clear and descriptive</span>
                    <span className="text-xs text-gray-400">{notificationTitle.length}/100</span>
                  </div>
                </div>                {/* Message Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Write your notification message here..."
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  />
                </div>                {/* File Attachment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachment (Optional)
                  </label>
                  <div 
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer relative"
                    onClick={() => document.getElementById('file-upload').click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-blue-400', 'bg-blue-50/30');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50/30');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50/30');
                      const files = e.dataTransfer.files;
                      if (files.length > 0) {
                        setAttachment(files[0]);
                      }
                    }}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
                    <p className="text-xs text-gray-400">PDF, DOC, JPG, PNG up to 10MB</p>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => setAttachment(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                  {attachment && (
                    <div className="mt-2 p-3 bg-blue-50/80 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-gray-700">{attachment.name}</span>
                      <button
                        onClick={() => setAttachment(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>            {/* Card 3: Send/Schedule */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-100/50">
                <div className="flex items-center space-x-3">
                  <Send className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Send Notification</h2>
                </div>
              </div>
              
              <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Ready to send this notification to{' '}
                      <span className="font-semibold text-gray-900">
                        {calculateTotalRecipients()} recipients
                      </span>
                      ?
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      This action cannot be undone
                    </p>
                  </div>
                  
                  <button
                    onClick={handleSendNotification}
                    disabled={!notificationTitle || !notificationMessage || calculateTotalRecipients() === 0 || isLoading}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Notification History */}
        <div className="mt-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden max-w-7xl mx-auto">
          <div className="p-4 md:p-6 border-b border-gray-100/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Notification History</h2>
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50/80 rounded-lg transition-colors w-full sm:w-auto justify-center sm:justify-start"
              >
                <Eye className="w-4 h-4" />
                <span>{showHistory ? 'Hide' : 'Show'} History</span>
              </button>
            </div>
          </div>
            {showHistory && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Audience</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Recipients</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {notificationHistory.map((notification) => (
                    <tr key={notification.id} className="hover:bg-gray-50/50">
                      <td className="px-4 md:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{notification.title}</div>
                        <div className="text-xs text-gray-500 sm:hidden">{notification.audience}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-sm text-gray-600">{notification.audience}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{notification.date}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {notification.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-600">{notification.recipients} users</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm">View</button>
                          <button className="text-green-600 hover:text-green-900 text-xs sm:text-sm">Resend</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LNotify;