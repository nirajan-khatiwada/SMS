import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  User,
  Users,
  Calendar,
  Hash,
  Library,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter,
  RefreshCw,
  SortDesc,
  Eye,
  ArrowRight,
  X,
  Save,
  Scan,
  UserCheck
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllBooks,bookIssue } from "../../api/libriary";
import { getStudentProfile } from "../../api/student";
import { toast } from 'react-toastify';

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="bg-white/70 rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
            </div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
        </div>
      </div>
    ))}
  </div>
);

const BookCard = ({ book, onIssue, isIssuing }) => {
  const availableCopies = book.quantity - (book.issued_count || 0);
  const isAvailable = availableCopies > 0;

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-lg hover:bg-white/80 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100/80 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                {book.name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center space-x-1">
                <User size={14} />
                <span>by {book.author}</span>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Library size={14} className="text-blue-500" />
              <span>{book.classes}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Users size={14} className="text-green-500" />
              <span>Section {book.sections}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Hash size={14} className="text-purple-500" />
              <span>{book.quantity} total</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {availableCopies} available
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Added: {book.created_at ? new Date(book.created_at).toLocaleDateString() : 'N/A'}
            </div>
            <div className="flex items-center space-x-2">
              {isAvailable ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50/80 text-green-600 border border-green-200/50">
                  <CheckCircle size={12} className="mr-1" />
                  Available
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50/80 text-red-600 border border-red-200/50">
                  <AlertTriangle size={12} className="mr-1" />
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="ml-4">
          <button
            onClick={() => onIssue(book)}
            disabled={!isAvailable || isIssuing}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
              isAvailable
                ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isIssuing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Issuing...</span>
              </>
            ) : (
              <>
                <ArrowRight size={16} />
                <span>Issue Book</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentCard = ({ student, onSelect, isSelected }) => {
  return (
    <div 
      className={`bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow-sm border cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected 
          ? 'border-blue-500/50 bg-blue-50/50 ring-2 ring-blue-500/20' 
          : 'border-gray-100/50 hover:bg-white/80'
      }`}
      onClick={() => onSelect(student)}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isSelected ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <User className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{student.user.first_name} {student.user.last_name}</h4>
          <p className="text-sm text-gray-600">ID: {student.id || student.id}</p>
          <p className='text-xs text-gray-500'>Phone : {student.user.username || 'N/A'}</p>
            <p className="text-xs text-gray-500">Class: {student.class_name.name}</p>
            <p className="text-xs text-gray-500">Section: {student.section.name}</p>
          <p className="text-xs text-gray-500">Email:{student.user.email}</p>
        </div>
        {isSelected && (
          <CheckCircle className="w-5 h-5 text-blue-600" />
        )}
      </div>
    </div>
  );
};

const IssueBookModal = ({ book, isOpen, onClose, onConfirm, isIssuing, students = [] }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Set default due date (2 weeks from today)
  useEffect(() => {
    const today = new Date();
    const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    setDueDate(twoWeeksLater.toISOString().split('T')[0]);
  }, [isOpen]);

  const filteredStudents = students.filter(student =>
    `${student.user.first_name} ${student.user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.id && student.id.toString().includes(searchQuery)) ||
    (student.user.email && student.user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleConfirm = () => {
    if (selectedStudent && dueDate) {
      onConfirm({
        book_id: book.id,
        student_id: selectedStudent.id,
        due_date: dueDate
      });
    }
  };

  const handleClose = () => {
    setSelectedStudent(null);
    setSearchQuery('');
    onClose();
  };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-4xl w-full shadow-2xl border border-gray-100/50 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Issue Book</h3>
                <p className="text-sm text-gray-600">"{book.name}" by {book.author}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isIssuing}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-lg transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
                disabled={isIssuing}
              />
            </div>

            {/* Student Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student *
              </label>
              
              {/* Search Students */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students by name, ID, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
                  disabled={isIssuing}
                />
              </div>

              {/* Students List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onSelect={setSelectedStudent}
                      isSelected={selectedStudent?.id === student.id}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p>No students found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200/50">
          <div className="flex space-x-3">
            <button
              onClick={handleConfirm}
              disabled={!selectedStudent || !dueDate || isIssuing}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isIssuing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Issuing Book...</span>
                </>
              ) : (
                <>
                  <UserCheck size={16} />
                  <span>Issue Book</span>
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              disabled={isIssuing}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LIBook = () => {
  const queryClient = useQueryClient();
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [issueModal, setIssueModal] = useState({ isOpen: false, book: null });

  // Fetch books
  const { 
    data: books = [], 
    isLoading: booksLoading, 
    error: booksError,
    refetch: refetchBooks 
  } = useQuery({
    queryKey: ['books'],
    queryFn: getAllBooks,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch students
  const { 
    data: students = [], 
    isLoading: studentsLoading, 
    error: studentsError 
  } = useQuery({
    queryKey: ['students'],
    queryFn: getStudentProfile,
    staleTime: 5 * 60 * 1000,
  });

  console.log(students)

  // Issue book mutation (placeholder - you'll implement the API)
  const issueMutation = useMutation({
    mutationFn: async (issueData) => {
        const { book_id, student_id, due_date } = issueData;
      return await bookIssue({book:book_id, student:student_id, return_date:due_date});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['issued-books'] });
      setIssueModal({ isOpen: false, book: null });
      // You can add toast notification here
    },
    onError: (error) => {
      console.error('Error issuing book:', error);
      toast.error('Failed to issue book. Please try again.');
           setIssueModal({ isOpen: false, book: null });
      // You can add error toast notification here
    }
  });

  // Get unique classes and sections for filters
  const uniqueClasses = [...new Set(books.map(book => book.classes))].filter(Boolean);
  const uniqueSections = [...new Set(books.map(book => book.sections))].filter(Boolean);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...books];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (book) =>
          book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Class filter
    if (selectedClass !== 'all') {
      filtered = filtered.filter((book) => book.classes === selectedClass);
    }

    // Section filter
    if (selectedSection !== 'all') {
      filtered = filtered.filter((book) => book.sections === selectedSection);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'author') {
        return a.author.localeCompare(b.author);
      } else if (sortBy === 'available') {
        const aAvailable = a.quantity - (a.issued_count || 0);
        const bAvailable = b.quantity - (b.issued_count || 0);
        return bAvailable - aAvailable;
      }
      return 0;
    });

    setFilteredBooks(filtered);
  }, [books, searchQuery, selectedClass, selectedSection, sortBy]);

  const handleIssue = (book) => {
    setIssueModal({ isOpen: true, book });
  };

  const handleConfirmIssue = (issueData) => {
    issueMutation.mutate(issueData);
  };

  const handleRefresh = () => {
    refetchBooks();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedClass('all');
    setSelectedSection('all');
    setSortBy('name');
  };

  if (booksError || studentsError) {
    return (
      <div className="flex-1 bg-gray-50/30 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Data
            </h3>
            <p className="text-gray-600 mb-4">
              {booksError?.message || studentsError?.message || 'There was an error loading the data. Please try again.'}
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (booksLoading || studentsLoading) {
    return (
      <div className="flex-1 bg-gray-50/30 min-h-screen">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header Skeleton */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div>
                  <div className="h-6 bg-gray-200 rounded-lg w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-64"></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
          
          {/* Filters Skeleton */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
          
          {/* Content Skeleton */}
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Issue Books
                </h1>
                <p className="text-gray-600">
                  Issue books to students from the library collection
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="p-3 bg-blue-50/80 text-blue-600 rounded-xl hover:bg-blue-100/80 transition-all duration-300"
              disabled={booksLoading}
            >
              <RefreshCw className={`w-5 h-5 ${booksLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
              />
            </div>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
            >
              <option value="all">All Classes</option>
              {uniqueClasses.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>

            {/* Section Filter */}
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
            >
              <option value="all">All Sections</option>
              {uniqueSections.map((sectionName) => (
                <option key={sectionName} value={sectionName}>
                  Section {sectionName}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
            >
              <option value="name">Book Name A-Z</option>
              <option value="author">Author A-Z</option>
              <option value="available">Most Available</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>
              Showing {filteredBooks.length} of {books.length} books
            </span>
            <span className="text-green-600 font-medium">
              {filteredBooks.filter(book => (book.quantity - (book.issued_count || 0)) > 0).length} available for issue
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {(searchQuery || selectedClass !== 'all' || selectedSection !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            )}
            <div className="flex items-center space-x-2">
              <SortDesc size={16} />
              <span>
                Sorted by {sortBy === 'name' ? 'book name' : 
                          sortBy === 'author' ? 'author name' : 'availability'}
              </span>
            </div>
          </div>
        </div>

        {/* Books List */}
        <div className="space-y-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onIssue={handleIssue}
                isIssuing={issueMutation.isPending}
              />
            ))
          ) : (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No books found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedClass !== 'all' || selectedSection !== 'all'
                  ? "Try adjusting your filters to see more books."
                  : "No books are available in the library."}
              </p>
              {(searchQuery || selectedClass !== 'all' || selectedSection !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Issue Book Modal */}
      <IssueBookModal
        book={issueModal.book}
        isOpen={issueModal.isOpen}
        onClose={() => setIssueModal({ isOpen: false, book: null })}
        onConfirm={handleConfirmIssue}
        isIssuing={issueMutation.isPending}
        students={students}
      />
    </div>
  );
};

export default LIBook;