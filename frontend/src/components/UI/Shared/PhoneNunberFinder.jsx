import React, { useState, useEffect } from "react";
import {
  Phone,
  Search,
  Users,
  User,
  Hash,
  GraduationCap,
  RefreshCw,
  SortDesc,
  Filter,
  BookOpen,
  AlertCircle,
  CheckCircle,
  School,
  UserCheck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getStudentPhoneNumber } from "../../../api/student";

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((item) => (
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

const StudentCard = ({ student }) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-lg hover:bg-white/80 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100/80 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                {student.first_name} {student.last_name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center space-x-1">
                <Hash size={14} />
                <span>ID: {student.id}</span>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone size={14} className="text-green-500" />
              <span className="font-medium">{student.phone_number}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <GraduationCap size={14} className="text-blue-500" />
              <span>Class {student.class_name}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <School size={14} className="text-purple-500" />
              <span>Section {student.section}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Hash size={14} className="text-orange-500" />
              <span>Roll {student.roll_number}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Student ID: {student.id} | Roll: {student.roll_number}
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50/80 text-green-600 border border-green-200/50">
                <CheckCircle size={12} className="mr-1" />
                Active
              </span>
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex flex-col space-y-2">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {student.first_name} {student.last_name}
            </div>
            <div className="text-xs text-gray-500">
              Class {student.class_name} - {student.section} | Roll {student.roll_number}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PhoneNunberFinder = () => {
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const {
    data: students = [],
    isPending: isLoading,
    refetch,
  } = useQuery({
    queryKey: ["studentPhoneNumbers"],
    queryFn: getStudentPhoneNumber,
  });

  // Get unique classes for filter
  const uniqueClasses = [...new Set(students.map(student => student.class_name))].sort();

  // Filter and search logic
  useEffect(() => {
    if (!students.length) {
      setFilteredStudents([]);
      return;
    }

    let filtered = [...students];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (student) => {
          const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
          const query = searchQuery.toLowerCase();
          
          return (
            student.first_name?.toLowerCase().includes(query) ||
            student.last_name?.toLowerCase().includes(query) ||
            fullName.includes(query) ||
            student.phone_number?.toLowerCase().includes(query) ||
            student.id?.toString().includes(query) ||
            student.class_name?.toLowerCase().includes(query) ||
            student.roll_number?.toString().includes(query)
          );
        }
      );
    }

    // Class filter
    if (selectedClass !== "all") {
      filtered = filtered.filter(
        (student) => student.class_name === selectedClass
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
      } else if (sortBy === "class") {
        return a.class_name.localeCompare(b.class_name);
      } else if (sortBy === "id") {
        return a.id - b.id;
      } else if (sortBy === "roll") {
        return parseInt(a.roll_number) - parseInt(b.roll_number);
      }
      return 0;
    });

    setFilteredStudents(filtered);
  }, [students, searchQuery, selectedClass, sortBy]);

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
          
          {/* Results Summary Skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded-lg w-32"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Student Phone Directory
                </h1>
                <p className="text-gray-600">
                  Find and view student contact information
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="p-3 bg-blue-50/80 text-blue-600 rounded-xl hover:bg-blue-100/80 transition-all duration-300"
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, phone, ID, roll number, or class..."
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
                  Class {className}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
            >
              <option value="name">Sort by Name</option>
              <option value="class">Sort by Class</option>
              <option value="id">Sort by ID</option>
              <option value="roll">Sort by Roll Number</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredStudents.length} of {students?.length || 0} students
          </span>
          <div className="flex items-center space-x-2">
            <SortDesc size={16} />
            <span>
              Sorted by {sortBy === "name" ? "name" : sortBy === "class" ? "class" : sortBy === "roll" ? "roll number" : "ID"}
            </span>
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-4">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))
          ) : (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No students found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedClass !== "all"
                  ? "Try adjusting your filters to see more students."
                  : "There are no students available at the moment."}
              </p>
              {(searchQuery || selectedClass !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedClass("all");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneNunberFinder;