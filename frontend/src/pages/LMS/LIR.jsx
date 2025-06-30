import React, { useState, useEffect, use } from "react";
import { getBookReturn } from "../../api/libriary";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  Clock,
  Search,
  Calendar,
  BookOpen,
  User,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  Download,
  Eye,
  X,
  FileText,
  Hash,
  Users,
  RefreshCw,
} from "lucide-react";



const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((item) => (
      <div
        key={item}
        className="bg-white/70 rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="h-4 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded-lg w-32"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
        </div>
      </div>
    ))}
  </div>
);

const StatusTag = ({ status }) => {
  const configs = {
    returned: {
      icon: <CheckCircle size={14} />,
      text: "Returned",
      className: "bg-green-50/80 text-green-600 border border-green-200/50",
    },
    returned_late: {
      icon: <AlertTriangle size={14} />,
      text: "Returned Late",
      className: "bg-orange-50/80 text-orange-600 border border-orange-200/50",
    },
    issued: {
      icon: <BookOpen size={14} />,
      text: "Currently Issued",
      className: "bg-blue-50/80 text-blue-600 border border-blue-200/50",
    },
    overdue: {
      icon: <AlertTriangle size={14} />,
      text: "Overdue",
      className: "bg-red-50/80 text-red-600 border border-red-200/50",
    },
  };

  const config = configs[status] || configs.issued;

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.icon}
      <span>{config.text}</span>
    </span>
  );
};

const DetailModal = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100/50">
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100/50 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">          <div className="flex items-center space-x-3 mb-3">
            <StatusTag status="returned" />
          </div>          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Book Return Details
          </h2>
              <p className="text-gray-600">{transaction.bookTitle}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Information */}
            <div className="bg-blue-50/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User size={20} />
                <span>Student Information</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="font-medium text-gray-900">{transaction.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-medium text-gray-900">{transaction.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-medium text-gray-900">{transaction.class}</p>
                </div>
              </div>
            </div>

            {/* Book Information */}
            <div className="bg-green-50/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <BookOpen size={20} />
                <span>Book Information</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Book Title</p>
                  <p className="font-medium text-gray-900">{transaction.bookTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Book ID</p>
                  <p className="font-medium text-gray-900">{transaction.bookId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Author</p>
                  <p className="font-medium text-gray-900">{transaction.author}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Class Section</p>
                  <p className="font-medium text-gray-900">{transaction.class}</p>
                </div>
              </div>
            </div>

            {/* Return Information */}
            <div className="bg-purple-50/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock size={20} />
                <span>Return Information</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Return Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(transaction.returnDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Book Condition</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {transaction.condition || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fine Amount</p>
                  <p className={`font-medium text-lg ${transaction.fine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{transaction.fine}
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Timeline */}
            <div className="bg-orange-50/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar size={20} />
                <span>Issue Timeline</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Issue Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(transaction.issueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(transaction.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText size={20} />
                <span>Additional Information</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Librarian</p>
                  <p className="font-medium text-gray-900">{transaction.librarian}</p>
                </div>
                {transaction.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium text-gray-900">{transaction.notes}</p>
                  </div>
                )}
              </div>
            </div>
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

const HistoryCard = ({ transaction, onViewDetails, searchType, searchTerm }) => {
  const hasFine = transaction.fine > 0;

  // Helper function to highlight search term
  const highlightText = (text, shouldHighlight) => {
    if (!shouldHighlight || !searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.toString().split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div className="bg-white/70 rounded-xl p-6 shadow-sm border border-gray-100/50 hover:bg-white/90 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {searchType === "book_title" ? 
              highlightText(transaction.bookTitle, true) : 
              transaction.bookTitle
            }
          </h3>
          <p className="text-gray-600 flex items-center space-x-1 mb-1">
            <User size={14} />
            <span>
              {searchType === "student_name" ? 
                highlightText(transaction.studentName, true) : 
                transaction.studentName
              } {transaction.class} (ID: {
                searchType === "student_id" ? 
                  <span className="font-semibold text-blue-600">
                    {highlightText(transaction.studentId, true)}
                  </span> : 
                  transaction.studentId
              })
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Author: {searchType === "author" ? 
              highlightText(transaction.author, true) : 
              transaction.author
            }
          </p>
        </div>
        <StatusTag status="returned" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Issue Date</p>
          <p className="font-medium text-gray-900">
            {new Date(transaction.issueDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Due Date</p>
          <p className="font-medium text-gray-900">
            {new Date(transaction.dueDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Return Date</p>
          <p className="font-medium text-gray-900">
            {new Date(transaction.returnDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Fine</p>
          <p className={`font-medium ${hasFine ? 'text-red-600' : 'text-green-600'}`}>
            ₹{transaction.fine}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center space-x-1">
            <Users size={14} />
            <span>Class {transaction.class}</span>
          </span>
          {transaction.condition && (
            <span className="flex items-center space-x-1">
              <CheckCircle size={14} />
              <span className="capitalize">{transaction.condition}</span>
            </span>
          )}
        </div>
        <button
          onClick={() => onViewDetails(transaction)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          <Eye size={16} />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};

const LIR = () => {
  const { data: apiData, isLoading, error,refetch } = useQuery({
    queryKey: ['bookReturn'],
    queryFn: getBookReturn,
  });

  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("issueDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Transform API data to component format
  useEffect(() => {
    if (apiData) {
      const transformedData = apiData.map(item => ({
        id: item.id,
        transactionId: `TXN${item.id.toString().padStart(6, '0')}`,
        bookTitle: item.book_issue.book.name,
        bookId: item.book_issue.book.id,
        author: item.book_issue.book.author,
        studentName: `${item.book_issue.student.user.first_name} ${item.book_issue.student.user.last_name}`,
        studentId: item.book_issue.student.id,
        class: `${item.book_issue.student.class_name.name}(${item.book_issue.student.section.name})`,
        issueDate: item.book_issue.issue_date,
        dueDate: item.book_issue.return_date,
        returnDate: item.return_date,
        fine: parseFloat(item.fine_amount),
        notes: item.note,
        condition: item.condition,
        status: 'returned', // All items in this API are returned books
        librarian: 'System' // Default value as not provided in API
      }));
      setTransactions(transformedData);
    }
  }, [apiData]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getSearchPlaceholder = () => {
    switch (searchType) {
      case "student_id":
        return "Search by Student ID...";
      case "student_name":
        return "Search by Student Name...";
      case "book_title":
        return "Search by Book Title...";
      case "author":
        return "Search by Author...";
      case "transaction_id":
        return "Search by Transaction ID...";
      default:
        return "Search by book, student, author, or transaction...";
    }
  };

  const filteredAndSortedTransactions = transactions
    .filter((transaction) => {
      let matchesSearch = true;
      
      if (searchTerm.trim()) {
        switch (searchType) {
          case "student_id":
            matchesSearch = transaction.studentId && 
              transaction.studentId.toString().toLowerCase().includes(searchTerm.toLowerCase());
            break;
          case "student_name":
            matchesSearch = transaction.studentName && 
              transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase());
            break;
          case "book_title":
            matchesSearch = transaction.bookTitle && 
              transaction.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());
            break;
          case "author":
            matchesSearch = transaction.author && 
              transaction.author.toLowerCase().includes(searchTerm.toLowerCase());
            break;
          case "transaction_id":
            matchesSearch = transaction.transactionId && 
              transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
            break;
          default: // "all"
            matchesSearch = 
              (transaction.bookTitle && transaction.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (transaction.studentName && transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (transaction.studentId && transaction.studentId.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
              (transaction.transactionId && transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (transaction.author && transaction.author.toLowerCase().includes(searchTerm.toLowerCase()));
            break;
        }
      }
      
      const matchesFilter = filterStatus === "all" || 
        (filterStatus === "with_fine" && transaction.fine > 0) ||
        (filterStatus === "no_fine" && transaction.fine === 0) ||
        (filterStatus === "return_before_due" && new Date(transaction.returnDate) <= new Date(transaction.dueDate)) ||
        (filterStatus === "with_notes" && transaction.notes);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      if (sortBy.includes("Date")) {
        valueA = new Date(valueA || 0);
        valueB = new Date(valueB || 0);
      }

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Book Return History</h1>
              <p className="text-gray-600">Track all returned books and transaction details</p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                  setSearchTerm(""); // Clear search term when changing type
                }}
                className="px-3 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 min-w-[140px]"
              >
                <option value="all">All Fields</option>
                <option value="student_id">Student ID</option>
                <option value="student_name">Student Name</option>
                <option value="book_title">Book Title</option>
                <option value="author">Author</option>
                <option value="transaction_id">Transaction ID</option>
              </select>
              
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={getSearchPlaceholder()}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              >
                <option value="all">All Returns</option>
                <option value="with_fine">With Fine</option>
                <option value="no_fine">No Fine</option>
                <option value="return_before_due">Return before duedate</option>
                <option value="with_notes">With Notes</option>
              </select>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              >
                <option value="issueDate-desc">Issue Date (Newest)</option>
                <option value="issueDate-asc">Issue Date (Oldest)</option>
                <option value="dueDate-desc">Due Date (Latest)</option>
                <option value="dueDate-asc">Due Date (Earliest)</option>
                <option value="returnDate-desc">Return Date (Latest)</option>
                <option value="returnDate-asc">Return Date (Earliest)</option>
              </select>
              
              <button
                onClick={() => refetch()}
                className="p-3 bg-white/70 border border-gray-200 rounded-xl hover:bg-gray-50/80 transition-all duration-300"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/60 rounded-xl p-4 border border-gray-100/50">
              <p className="text-sm text-gray-500">Total Returns</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
            <div className="bg-white/60 rounded-xl p-4 border border-gray-100/50">
              <p className="text-sm text-gray-500">With Fines</p>
              <p className="text-2xl font-bold text-red-600">
                {transactions.filter(t => t.fine > 0).length}
              </p>
            </div>
            <div className="bg-white/60 rounded-xl p-4 border border-gray-100/50">
              <p className="text-sm text-gray-500">Return before duedate</p>
              <p className="text-2xl font-bold text-green-600">
                {transactions.filter(t => new Date(t.returnDate) <= new Date(t.dueDate)).length}
              </p>
            </div>
            <div className="bg-white/60 rounded-xl p-4 border border-gray-100/50">
              <p className="text-sm text-gray-500">Total Fines</p>
              <p className="text-2xl font-bold text-orange-600">
                ₹{transactions.reduce((sum, t) => sum + t.fine, 0)}
              </p>
            </div>
          </div>

          {/* Quick Search Shortcuts */}
          {searchType !== "student_id" && (
            <div className="mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Hash size={16} />
                <span>Quick search by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSearchType("student_id");
                    setSearchTerm("");
                  }}
                  className="px-3 py-1.5 bg-blue-100/60 text-blue-700 rounded-lg hover:bg-blue-200/60 transition-all duration-300 text-sm flex items-center space-x-1"
                >
                  <Hash size={14} />
                  <span>Student ID</span>
                </button>
                <button
                  onClick={() => {
                    setSearchType("student_name");
                    setSearchTerm("");
                  }}
                  className="px-3 py-1.5 bg-green-100/60 text-green-700 rounded-lg hover:bg-green-200/60 transition-all duration-300 text-sm flex items-center space-x-1"
                >
                  <User size={14} />
                  <span>Student Name</span>
                </button>
                <button
                  onClick={() => {
                    setSearchType("book_title");
                    setSearchTerm("");
                  }}
                  className="px-3 py-1.5 bg-purple-100/60 text-purple-700 rounded-lg hover:bg-purple-200/60 transition-all duration-300 text-sm flex items-center space-x-1"
                >
                  <BookOpen size={14} />
                  <span>Book Title</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load transactions</h3>
            <p className="text-gray-600">Please try again later</p>
          </div>
        ) : (
          <>
            {/* Search Results Info */}
            {searchTerm && (
              <div className="mb-4 p-3 bg-blue-50/60 border border-blue-200/50 rounded-lg">
                <p className="text-sm text-blue-800">
                  {searchType === "all" ? (
                    <>Searching all fields for: <span className="font-semibold">"{searchTerm}"</span></>
                  ) : (
                    <>Searching by {searchType.replace('_', ' ')}: <span className="font-semibold">"{searchTerm}"</span></>
                  )}
                  {filteredAndSortedTransactions.length > 0 && (
                    <span className="ml-2">({filteredAndSortedTransactions.length} results found)</span>
                  )}
                </p>
              </div>
            )}
            
            <div className="space-y-4">
            {filteredAndSortedTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No return records found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredAndSortedTransactions.map((transaction) => (
                <HistoryCard
                  key={transaction.id}
                  transaction={transaction}
                  searchType={searchType}
                  searchTerm={searchTerm}
                  onViewDetails={(transaction) => {
                    setSelectedTransaction(transaction);
                    setShowDetailModal(true);
                  }}
                />
              ))
            )}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      <DetailModal
        transaction={selectedTransaction}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedTransaction(null);
        }}
      />
    </div>
  );
};

export default LIR;