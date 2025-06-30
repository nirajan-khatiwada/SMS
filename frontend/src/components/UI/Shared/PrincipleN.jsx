import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Search,
  Download,
  Calendar,
  AlertCircle,
  Info,
  Building2,
  FileText,
  SortDesc,
  RefreshCw,
  Bell,
  Users,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { fetchNotifications } from "./../../../api/api";

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
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
        </div>
      </div>
    ))}
  </div>
);

const PriorityTag = ({ priority }) => {
  const configs = {
    urgent: {
      icon: <AlertCircle size={14} />,
      text: "Urgent",
      className: "bg-red-50/80 text-red-600 border border-red-200/50",
    },
    normal: {
      icon: <Bell size={14} />,
      text: "Normal",
      className: "bg-yellow-50/80 text-yellow-600 border border-yellow-200/50",
    },
    info: {
      icon: <Info size={14} />,
      text: "Info",
      className: "bg-blue-50/80 text-blue-600 border border-blue-200/50",
    },
  };

  const config = configs[priority.toLowerCase()] || configs.info;

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.icon}
      <span>{config.text}</span>
    </span>
  );
};

const DetailModal = ({ announcement, isOpen, onClose, onDownload }) => {
  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100/50">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100/50 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <PriorityTag priority={announcement.status || 'info'} />
                <span className="text-sm text-gray-500 flex items-center space-x-1">
                  <Building2 size={14} />
                  <span>{announcement.sender || 'Principal\'s Office'}</span>
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {announcement.subject}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>
                    {new Date(announcement.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={14} />
                  <span>From {announcement.sender || 'Principal\'s Office'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="p-6">
          <div className="prose max-w-none">
            <div className="bg-gray-50/50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <FileText size={20} />
                <span>Announcement Details</span>
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {announcement.message}
              </p>
            </div>

            {announcement.documents && (
              <div className="bg-blue-50/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Download size={20} />
                  <span>Attachment</span>
                </h3>
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-blue-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {announcement.documents}
                      </p>
                      <p className="text-sm text-gray-500">Document</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDownload(announcement.documents)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Publication Info
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Published:</span>
                    <span>
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>From:</span>
                    <span>{announcement.sender || 'Principal\'s Office'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="capitalize">{announcement.status || 'info'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-gray-100/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {announcement.documents && (
                <button
                  onClick={() => onDownload(announcement.documents)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  <Download size={16} />
                  <span>Download Attachment</span>
                </button>
              )}
            </div>
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

const AnnouncementCard = ({
  announcement,
  onViewDetails,
  onDownload,
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50 hover:shadow-lg hover:bg-white/80 transition-all duration-300 group">
      {/* Header */}      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <PriorityTag priority={announcement.status || 'info'} />
            <span className="text-sm text-gray-500 flex items-center space-x-1">
              <Building2 size={14} />
              <span>{announcement.sender || 'Principal\'s Office'}</span>
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
            {announcement.subject}
          </h3>
        </div>
      </div>
      {/* Date and Author */}
      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Calendar size={14} />
          <span>
            {new Date(announcement.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Users size={14} />
          <span>From {announcement.sender || 'Principal\'s Office'}</span>
        </div>
      </div>
      {/* Message */}
      <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
        {announcement.message}
      </p>
      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {announcement.documents && (
            <button
              onClick={() => onDownload(announcement.documents)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-300"
            >
              <FileText size={16} />
              <span>{announcement.documents}</span>
              <Download size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => onViewDetails(announcement)}
          className="px-4 py-2 bg-blue-50/80 text-blue-600 rounded-lg hover:bg-blue-100/80 transition-all duration-300 text-sm font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const Principle = () => {  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const {
    data: notifications = [],
    isPending: isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  // Filter and search logic
  useEffect(() => {
    if (!notifications.length) {
      setFilteredAnnouncements([]);
      return;
    }

    let filtered = [...notifications];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (announcement) =>
          announcement.subject
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          announcement.message?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }    // Priority filter (using status field from API)
    if (selectedPriority !== "all") {
      filtered = filtered.filter(
        (announcement) => announcement.status === selectedPriority
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date) - new Date(a.date);
      } else {
        return new Date(a.date) - new Date(b.date);
      }
    });

    setFilteredAnnouncements(filtered);
  }, [notifications, searchQuery, selectedPriority, sortBy]);const handleRefresh = () => {
    refetch();
  };

  const handleViewDetails = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDetailModalOpen(true);
  };  const handleDownloadAttachment = (attachmentName) => {
    const url = import.meta.env.VITE_BASE_URL + `${attachmentName}`;
    const a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedAnnouncement(null);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <Megaphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Principal Announcements
                </h1>
                <p className="text-gray-600">
                  Stay updated with the latest notices and announcements
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
        </div>        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-gray-100/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">🔴 Urgent</option>
              <option value="Normal">🟡 Normal</option>
              <option value="Info">🔵 Info</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredAnnouncements.length} of {notifications?.length || 0}{" "}
            announcements
          </span>
          <div className="flex items-center space-x-2">
            <SortDesc size={16} />
            <span>
              Sorted by {sortBy === "newest" ? "newest first" : "oldest first"}
            </span>          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onViewDetails={handleViewDetails}
                onDownload={handleDownloadAttachment}
              />
            ))
          ) : (
            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-12 shadow-sm border border-gray-100/50 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Megaphone className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No announcements found
              </h3>              <p className="text-gray-600 mb-4">
                {searchQuery ||
                selectedPriority !== "all"
                  ? "Try adjusting your filters to see more announcements."
                  : "There are no announcements available at the moment."}
              </p>
              {(searchQuery ||
                selectedPriority !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedPriority("all");
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

      {/* Detail Modal */}
      <DetailModal
        announcement={selectedAnnouncement}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        onDownload={handleDownloadAttachment}
      />
    </div>
  );
};

export default Principle;
