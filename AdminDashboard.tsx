import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Check, 
  Trash2, 
  AlertTriangle,
  MessageSquare,
  Star,
  Calendar,
  User,
  Eye,
  MoreHorizontal,
  CheckSquare,
  Square,
  Loader2,
  ArrowUpDown,
  FileText,
  Clock
} from 'lucide-react';

interface FlaggedContent {
  id: string;
  type: 'review' | 'question';
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  submissionDate: string;
  flagReason: string;
  status: 'pending' | 'approved' | 'deleted';
  university?: string;
  rating?: number;
  category?: string;
}

interface DashboardMetrics {
  totalReviews: number;
  totalQuestions: number;
  pendingModeration: number;
  recentlyApproved: number;
}

type FilterType = 'all' | 'review' | 'question';
type SortType = 'date' | 'flagReason' | 'author';
type SortOrder = 'asc' | 'desc';

// Mock data
const mockMetrics: DashboardMetrics = {
  totalReviews: 1247,
  totalQuestions: 892,
  pendingModeration: 23,
  recentlyApproved: 156
};

const mockFlaggedContent: FlaggedContent[] = [
  {
    id: '1',
    type: 'review',
    title: 'Harvard University Review',
    content: 'This university is absolutely terrible. The professors are incompetent and the facilities are outdated. I would never recommend this place to anyone. Complete waste of money and time.',
    author: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      avatar: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
    },
    submissionDate: '2024-01-20T14:30:00Z',
    flagReason: 'Inappropriate language',
    status: 'pending',
    university: 'Harvard University',
    rating: 1
  },
  {
    id: '2',
    type: 'question',
    title: 'Is MIT worth the money?',
    content: 'I\'m considering applying to MIT but I\'ve heard some concerning things about the culture there. Can anyone share their honest experiences? Also, are there any alternatives that might be better?',
    author: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com'
    },
    submissionDate: '2024-01-20T12:15:00Z',
    flagReason: 'Spam/promotional content',
    status: 'pending',
    category: 'Admissions'
  },
  {
    id: '3',
    type: 'review',
    title: 'Stanford University Review',
    content: 'Stanford has been an incredible experience. The innovation culture here is unmatched, and the opportunities for research and networking are endless. Highly recommend for anyone serious about tech.',
    author: {
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      avatar: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
    },
    submissionDate: '2024-01-19T16:45:00Z',
    flagReason: 'Misleading information',
    status: 'pending',
    university: 'Stanford University',
    rating: 5
  },
  {
    id: '4',
    type: 'question',
    title: 'Best dorms at Cambridge?',
    content: 'I\'m an incoming student at Cambridge and wondering which college has the best accommodation. Any current students who can share their experiences?',
    author: {
      name: 'Emma Wilson',
      email: 'emma.w@email.com',
      avatar: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
    },
    submissionDate: '2024-01-19T10:20:00Z',
    flagReason: 'Duplicate content',
    status: 'pending',
    category: 'Campus Life'
  },
  {
    id: '5',
    type: 'review',
    title: 'Oxford University Review',
    content: 'The tutorial system at Oxford is phenomenal. You get personalized attention from world-class academics. The workload is intense but incredibly rewarding.',
    author: {
      name: 'David Brown',
      email: 'david.brown@email.com'
    },
    submissionDate: '2024-01-18T14:10:00Z',
    flagReason: 'Off-topic content',
    status: 'pending',
    university: 'Oxford University',
    rating: 4
  }
];

export default function AdminDashboard() {
  const [metrics] = useState<DashboardMetrics>(mockMetrics);
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>(mockFlaggedContent);
  const [filteredContent, setFilteredContent] = useState<FlaggedContent[]>(mockFlaggedContent);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort content
  useEffect(() => {
    let filtered = flaggedContent.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterType === 'all' || item.type === filterType;
      
      return matchesSearch && matchesFilter && item.status === 'pending';
    });

    // Sort content
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
          break;
        case 'flagReason':
          comparison = a.flagReason.localeCompare(b.flagReason);
          break;
        case 'author':
          comparison = a.author.name.localeCompare(b.author.name);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredContent(filtered);
    setCurrentPage(1);
  }, [flaggedContent, searchQuery, filterType, sortBy, sortOrder]);

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    const currentPageItems = getCurrentPageItems();
    const allSelected = currentPageItems.every(item => selectedItems.has(item.id));
    
    if (allSelected) {
      // Deselect all current page items
      const newSelected = new Set(selectedItems);
      currentPageItems.forEach(item => newSelected.delete(item.id));
      setSelectedItems(newSelected);
    } else {
      // Select all current page items
      const newSelected = new Set(selectedItems);
      currentPageItems.forEach(item => newSelected.add(item.id));
      setSelectedItems(newSelected);
    }
  };

  const handleApprove = async (itemIds: string[]) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setFlaggedContent(prev => 
      prev.map(item => 
        itemIds.includes(item.id) 
          ? { ...item, status: 'approved' as const }
          : item
      )
    );
    
    setSelectedItems(new Set());
    setLoading(false);
  };

  const handleDelete = async (itemIds: string[]) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setFlaggedContent(prev => 
      prev.map(item => 
        itemIds.includes(item.id) 
          ? { ...item, status: 'deleted' as const }
          : item
      )
    );
    
    setSelectedItems(new Set());
    setLoading(false);
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredContent.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const currentPageItems = getCurrentPageItems();
  const allCurrentPageSelected = currentPageItems.length > 0 && 
    currentPageItems.every(item => selectedItems.has(item.id));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFlagReasonColor = (reason: string) => {
    switch (reason.toLowerCase()) {
      case 'inappropriate language':
        return 'bg-red-100 text-red-800';
      case 'spam/promotional content':
        return 'bg-orange-100 text-orange-800';
      case 'misleading information':
        return 'bg-yellow-100 text-yellow-800';
      case 'duplicate content':
        return 'bg-blue-100 text-blue-800';
      case 'off-topic content':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
              <p className="text-gray-600">Review and moderate flagged content</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalReviews.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalQuestions.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Moderation</p>
                <p className="text-3xl font-bold text-orange-600">{metrics.pendingModeration}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recently Approved</p>
                <p className="text-3xl font-bold text-green-600">{metrics.recentlyApproved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search content, authors, or reasons..."
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value as FilterType)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="all">All Types</option>
                          <option value="review">Reviews</option>
                          <option value="question">Questions</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setSortBy(sort as SortType);
                  setSortOrder(order as SortOrder);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="flagReason-asc">Flag Reason A-Z</option>
                <option value="flagReason-desc">Flag Reason Z-A</option>
                <option value="author-asc">Author A-Z</option>
                <option value="author-desc">Author Z-A</option>
              </select>

              {/* Bulk Actions */}
              {selectedItems.size > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(Array.from(selectedItems))}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Approve ({selectedItems.size})
                  </button>
                  <button
                    onClick={() => handleDelete(Array.from(selectedItems))}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete ({selectedItems.size})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSelectAll}
                className="flex items-center justify-center w-5 h-5"
              >
                {allCurrentPageSelected ? (
                  <CheckSquare className="h-5 w-5 text-primary-600" />
                ) : (
                  <Square className="h-5 w-5 text-gray-400" />
                )}
              </button>
              <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-3">Content</div>
                <div className="col-span-2">Author</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Flag Reason</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-2">Actions</div>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {currentPageItems.map((item) => (
              <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleSelectItem(item.id)}
                    className="flex items-center justify-center w-5 h-5 mt-1"
                  >
                    {selectedItems.has(item.id) ? (
                      <CheckSquare className="h-5 w-5 text-primary-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  <div className="flex-1 grid grid-cols-12 gap-4">
                    {/* Content */}
                    <div className="col-span-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          item.type === 'review' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {item.type === 'review' ? (
                            <Star className={`h-4 w-4 ${item.type === 'review' ? 'text-blue-600' : 'text-green-600'}`} />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.content}</p>
                          {item.type === 'review' && item.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < item.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Author */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        {item.author.avatar ? (
                          <img
                            src={item.author.avatar}
                            alt={item.author.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 text-gray-500" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.author.name}</p>
                          <p className="text-xs text-gray-500 truncate">{item.author.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(item.submissionDate)}</span>
                      </div>
                    </div>

                    {/* Flag Reason */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFlagReasonColor(item.flagReason)}`}>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {item.flagReason}
                      </span>
                    </div>

                    {/* Type */}
                    <div className="col-span-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        item.type === 'review' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.type === 'review' ? 'Review' : 'Question'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove([item.id])}
                          disabled={loading}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <Check className="h-3 w-3" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleDelete([item.id])}
                          disabled={loading}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredContent.length === 0 && (
            <div className="px-6 py-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No flagged content</h3>
              <p className="text-gray-600">All content has been reviewed or no items match your filters.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredContent.length)} of {filteredContent.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm rounded-lg ${
                            currentPage === page
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}