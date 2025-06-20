import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronDown, Star, MapPin, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { universities, University } from '../data/universities';

type SortOption = 'rating' | 'alphabetical' | 'popularity';

export default function UniversityListingPage() {
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    ranking: ''
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
  });

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAllUniversities(universities);
      setFilteredUniversities(universities);
      setLoading(false);
    };
    loadData();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let filtered = allUniversities.filter(uni => {
      const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           uni.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = !filters.location || uni.country === filters.location;
      const matchesType = !filters.type || uni.type === filters.type;
      const matchesRanking = !filters.ranking || 
        (filters.ranking === 'top10' && uni.ranking <= 10) ||
        (filters.ranking === 'top50' && uni.ranking <= 50);
      
      return matchesSearch && matchesLocation && matchesType && matchesRanking;
    });

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'popularity':
          return b.popularity - a.popularity;
        case 'rating':
        default:
          return b.rating - a.rating;
      }
    });

    setFilteredUniversities(filtered);
  }, [allUniversities, searchQuery, filters, sortBy]);

  // Load more functionality
  useEffect(() => {
    if (inView && !loading) {
      setPage(prev => prev + 1);
    }
  }, [inView, loading]);

  const displayedUniversities = filteredUniversities.slice(0, page * itemsPerPage);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300 fill-current" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 fill-current" />);
    }

    return stars;
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'US': '🇺🇸',
      'UK': '🇬🇧',
      'CA': '🇨🇦'
    };
    return flags[country] || '🌍';
  };

  if (loading && allUniversities.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading universities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search universities by name or location..."
                style={{ minWidth: '320px', maxWidth: '600px' }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {/* Filter Dropdown */}
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <select
                          value={filters.location}
                          onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">All Countries</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="CA">Canada</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                          value={filters.type}
                          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">All Types</option>
                          <option value="Public">Public</option>
                          <option value="Private">Private</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ranking</label>
                        <select
                          value={filters.ranking}
                          onChange={(e) => setFilters(prev => ({ ...prev, ranking: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">All Rankings</option>
                          <option value="top10">Top 10</option>
                          <option value="top50">Top 50</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="rating">Sort by Rating</option>
                <option value="alphabetical">Sort Alphabetically</option>
                <option value="popularity">Sort by Popularity</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Universities</h1>
          <p className="text-gray-600">
            Showing {displayedUniversities.length} of {filteredUniversities.length} universities
          </p>
        </div>

        {/* University Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedUniversities.map((university) => (
            <Link
              key={university.id}
              to={`/universities/${university.id}`}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden"
              style={{ height: '220px' }}
            >
              <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={university.logo}
                    alt={`${university.name} logo`}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-2">
                      {university.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{getCountryFlag(university.country)} {university.location}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {renderStars(university.rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{university.rating}</span>
                  <span className="text-sm text-gray-500">({university.reviewCount} reviews)</span>
                </div>

                {/* Preview */}
                <p className="text-gray-600 text-sm line-clamp-2 flex-1">
                  {university.preview}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    #{university.ranking} Ranked
                  </span>
                  <span className="text-xs text-gray-500">{university.type}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Trigger */}
        {displayedUniversities.length < filteredUniversities.length && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        )}

        {/* No Results */}
        {filteredUniversities.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No universities found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}