import React, { useState, useEffect } from "react";
import { getBookIssue,bookReturn } from "../../api/libriary";
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import {
  Undo2,
  Search,
  Calendar,
  BookOpen,
  User,
  AlertTriangle,
  Clock,
  SortDesc,
  RefreshCw,
  Filter,
  X,
  FileText,
  Hash,
  Users,
} from "lucide-react";



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
            <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="h-4 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
        </div>
      </div>
    ))}
  </div>
);

const StatusTag = ({ status, dueDate }) => {
  // Calculate overdue days
  const today = new Date();
  const due = new Date(dueDate);
  const timeDiff = today.getTime() - due.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  const configs = {
    overdue: {
      icon: <AlertTriangle size={14} />,
      text: daysDiff > 0 ? `${daysDiff} day${daysDiff > 1 ? 's' : ''} overdue` : "Overdue",
      className: "bg-red-50/80 text-red-600 border border-red-200/50",
    },
    due_today: {
      icon: <Clock size={14} />,
      text: "Due Today",
      className: "bg-yellow-50/80 text-yellow-600 border border-yellow-200/50",
    },
    active: {
      icon: <BookOpen size={14} />,
      text: "Active",
      className: "bg-blue-50/80 text-blue-600 border border-blue-200/50",
    },
  };

  const config = configs[status] || configs.active;

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.icon}
      <span>{config.text}</span>
    </span>
  );
};

const ReturnModal = ({ book, isOpen, onClose, onReturn }) => {
  const [fine, setFine] = useState(book?.fine || 0);
  const [notes, setNotes] = useState("");
  const [bookCondition, setBookCondition] = useState("good");

  if (!isOpen || !book) return null;

  const handleReturn = () => {
    onReturn({
      ...book,
      fine,
      notes,
      bookCondition,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100/50">
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100/50 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Return Book
              </h2>
              <p className="text-gray-600">Process book return for {`${book.student?.user?.first_name ?? ''} ${book.student?.user?.last_name ?? ''}`}</p>
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
          <div className="bg-gray-50/50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <BookOpen size={20} />
              <span>Book Details</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Book Title</p>
                <p className="font-medium text-gray-900">{book.book?.name || 'Unknown Book'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="font-medium text-gray-900">{`${book.student?.user?.first_name ?? ''} ${book.student?.user?.last_name ?? ''}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="font-medium text-gray-900">{book.student?.id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium text-gray-900">{book.student?.class_name?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Section</p>
                <p className="font-medium text-gray-900">{book.student?.section?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Issue Date</p>
                <p className="font-medium text-gray-900">{new Date(book.issue_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium text-gray-900">{new Date(book.return_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Condition
              </label>
              <select
                value={bookCondition}
                onChange={(e) => setBookCondition(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              >
                <option value="excellent">Excellent - Like new condition</option>
                <option value="good">Good - Minor wear and tear</option>
                <option value="fair">Fair - Noticeable wear but usable</option>
                <option value="poor">Poor - Significant damage</option>
                <option value="damaged">Damaged - Requires repair/replacement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fine Amount (₹)
              </label>
              <input
                type="number"
                value={fine}
                onChange={(e) => setFine(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                placeholder="Enter fine amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                placeholder="Add any notes about the return..."
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-gray-100/50 p-6">
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleReturn}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Confirm Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookCard = ({ book, onReturn }) => {
  console.log(book);
  
  // Calculate the actual status based on dates
  const getBookStatus = (book) => {
    const today = new Date();
    const dueDate = new Date(book.return_date);
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    if (today.getTime() > dueDate.getTime()) {
      return 'overdue';
    } else if (today.getTime() === dueDate.getTime()) {
      return 'due_today';
    } else {
      return 'active';
    }
  };
  
  const actualStatus = getBookStatus(book);
  
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-lg hover:bg-white/80 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 mb-1">
            {book.book?.name || 'Unknown Book'}
          </h3>
          <p className="text-gray-600 flex items-center space-x-1">
            <User size={14} />
            <span>{`${book.student?.user?.first_name ?? ''} ${book.student?.user?.last_name ?? ''}`} (ID: {book.student?.id || 'N/A'}) {book.student?.class_name.name || 'N/A'} ({book.student?.section.name || 'N/A'})</span>
          </p>
        </div>
        <StatusTag status={actualStatus} dueDate={book.return_date} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Issue Date</p>
          <p className="font-medium text-gray-900">
            {new Date(book.issue_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Due Date</p>
          <p className="font-medium text-gray-900">
            {new Date(book.return_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Hash size={14} />
              <span>{book.book?.author || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={14} />
              <span>{book.book?.class_name?.name || 'N/A'}({book.book?.section?.name || 'N/A'})</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onReturn(book)}
          className="px-4 py-2 bg-blue-50/80 text-blue-600 rounded-lg hover:bg-blue-100/80 transition-all duration-300 text-sm font-medium flex items-center space-x-2"
        >
          <Undo2 size={16} />
          <span>Return</span>
        </button>
      </div>
    </div>
  );
};

const LRBook = () => {
  const {data:bookIssue ,loading,refetch}=useQuery({
    queryKey: ['book-issue'],
    queryFn: getBookIssue,
  })
  const queryClient = useQueryClient();

  const {mutate} = useMutation({
    mutationFn: bookReturn,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['book-issue']);
    }
  })


  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);



  const handleReturn = (returnData) => {
    console.log("Returning book:", returnData);
    
    mutate({
      book_issue: returnData.id,
      fine_amount: returnData.fine,
      note: returnData.notes,
      condition: returnData.bookCondition,      
    });
    setShowReturnModal(false);
    setSelectedBook(null);
  };

  // Function to get calculated status
  const getCalculatedStatus = (book) => {
    const today = new Date();
    const dueDate = new Date(book.return_date);
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    if (today.getTime() > dueDate.getTime()) {
      return 'overdue';
    } else if (today.getTime() === dueDate.getTime()) {
      return 'due_today';
    } else {
      return 'active';
    }
  };

  const filteredBooks = bookIssue?.filter((book) => {
    const fullName = `${book.student.user.first_name ?? ''} ${book.student.user.last_name ?? ''}`.trim();
    const matchesSearch = 
      book.book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.student.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
    
    const calculatedStatus = getCalculatedStatus(book);
    const matchesFilter = filterStatus === "all" || calculatedStatus === filterStatus;

    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Undo2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Return Books</h1>
              <p className="text-gray-600">Process returns for currently issued books</p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by book title, student name, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              >
                <option value="all">All Books</option>
                <option value="active">Active</option>
                <option value="overdue">Overdue</option>
                <option value="due_today">Due Today</option>
              </select>
              
              <button
                onClick={() => refetch()}
                className="p-3 bg-white/70 border border-gray-200 rounded-xl hover:bg-gray-50/80 transition-all duration-300"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading || !bookIssue ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-4">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No issued books found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onReturn={(book) => {
                    setSelectedBook(book);
                    setShowReturnModal(true);
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Return Modal */}
      <ReturnModal
        book={selectedBook}
        isOpen={showReturnModal}
        onClose={() => {
          setShowReturnModal(false);
          setSelectedBook(null);
        }}
        onReturn={handleReturn}
      />
    </div>
  );
};

export default LRBook;