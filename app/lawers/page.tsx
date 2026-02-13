"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, MapPin, Star, Video, Clock, ChevronDown, X, Filter, Loader2, User } from 'lucide-react';
import { lawyerAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Lawyer {
  id: string;
  name: string;
  photo: string | null;
  expertise: string[];
  specializations: string[];
  experience: string;
  experienceYears: number;
  languages: string[];
  location: string;
  city: string;
  state: string;
  rating: number;
  reviews: number;
  fee: number;
  bio: string;
  barCouncil: string;
  available: boolean;
}

export default function LawyerListingPage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [experienceRange, setExperienceRange] = useState([0, 30]);
  const [minRating, setMinRating] = useState<string>('');
  const [sortBy, setSortBy] = useState('relevance');
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allExpertiseAreas, setAllExpertiseAreas] = useState<string[]>([]);
  const [allLanguages, setAllLanguages] = useState<string[]>([]);

  // Fetch lawyers with filters
  const fetchLawyers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = {
        sortBy,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedExpertise.length > 0) params.practiceArea = selectedExpertise.join(",");
      if (selectedLanguages.length > 0) params.language = selectedLanguages.join(",");
      if (priceRange[1] < 5000) params.maxFee = priceRange[1].toString();
      if (experienceRange[1] > 0) params.minExperience = experienceRange[1].toString();
      if (minRating) params.minRating = minRating;

      const response = await lawyerAPI.getAll(params);
      const lawyersData = response.data.data || [];

      // Extract unique expertise areas and languages from all lawyers
      const expertiseSet = new Set<string>();
      const languagesSet = new Set<string>();
      lawyersData.forEach((lawyer: Lawyer) => {
        lawyer.expertise?.forEach(exp => expertiseSet.add(exp));
        lawyer.languages?.forEach(lang => languagesSet.add(lang));
      });
      setAllExpertiseAreas(Array.from(expertiseSet).sort());
      setAllLanguages(Array.from(languagesSet).sort());

      setLawyers(lawyersData);
    } catch (error: any) {
      console.error('Error fetching lawyers:', error);
      toast.error('Failed to load lawyers. Please try again.');
      setLawyers([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedExpertise, selectedLanguages, priceRange, experienceRange, minRating, sortBy]);

  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);

  const toggleExpertise = (exp: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(exp) ? prev.filter((e) => e !== exp) : [...prev, exp]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedExpertise([]);
    setSelectedLanguages([]);
    setPriceRange([0, 5000]);
    setExperienceRange([0, 30]);
    setMinRating('');
    setSortBy('relevance');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLawyers();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by lawyer name, expertise, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-white border-2 border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg text-slate-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-900 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                {/* Expertise */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Practice Areas</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allExpertiseAreas.length > 0 ? (
                      allExpertiseAreas.map((exp) => (
                        <label key={exp} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedExpertise.includes(exp)}
                            onChange={() => toggleExpertise(exp)}
                            className="w-4 h-4 text-blue-900 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700">{exp}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No practice areas available</p>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Languages</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allLanguages.length > 0 ? (
                      allLanguages.map((lang) => (
                        <label key={lang} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedLanguages.includes(lang)}
                            onChange={() => toggleLanguage(lang)}
                            className="w-4 h-4 text-blue-900 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700">{lang}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No languages available</p>
                    )}
                  </div>
                </div>

                {/* Experience Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Experience (Years)</h4>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={experienceRange[1]}
                    onChange={(e) => setExperienceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-600 mt-2">
                    <span>0 years</span>
                    <span>{experienceRange[1]} years</span>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Consultation Fee</h4>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-600 mt-2">
                    <span>₹0</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Minimum Rating</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === ''}
                        onChange={() => setMinRating('')}
                        className="w-4 h-4 text-blue-900"
                      />
                      <span className="text-sm text-slate-700">Any rating</span>
                    </label>
                    {[5, 4, 3].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === rating.toString()}
                          onChange={() => setMinRating(rating.toString())}
                          className="w-4 h-4 text-blue-900"
                        />
                        <div className="flex items-center gap-1">
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-sm text-slate-700 ml-1">& up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Availability</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-900 rounded" />
                      <span className="text-sm text-slate-700">Available Now</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-900 rounded" />
                      <span className="text-sm text-slate-700">Today</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-900 rounded" />
                      <span className="text-sm text-slate-700">This Week</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Sort & Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600">
                Showing <span className="font-semibold text-slate-900">{lawyers.length}</span> lawyers
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="experience">Experience (High to Low)</option>
                  <option value="price-low">Fee (Low to High)</option>
                  <option value="price-high">Fee (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Lawyer Cards */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-900 mx-auto mb-4" />
                  <p className="text-slate-600">Loading lawyers...</p>
                </div>
              </div>
            ) : lawyers.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No lawyers found</h3>
                <p className="text-slate-600 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {lawyers.map((lawyer) => (
                  <div key={lawyer.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex gap-6">
                      {/* Profile Photo */}
                      <div className="flex-shrink-0">
                        {lawyer.photo ? (
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                            <Image
                              src={lawyer.photo}
                              alt={lawyer.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                            <User className="w-12 h-12 text-blue-600" />
                          </div>
                        )}
                      </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 mb-1">{lawyer.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {lawyer.location}
                            </span>
                            <span>•</span>
                            <span>{lawyer.experience} exp.</span>
                          </div>
                        </div>
                        {lawyer.available && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Available
                          </div>
                        )}
                      </div>

                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {lawyer.expertise.map((exp, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-900 rounded-full text-sm">
                            {exp}
                          </span>
                        ))}
                      </div>

                      {/* Languages */}
                      <div className="text-sm text-slate-600 mb-3">
                        <span className="font-medium">Languages:</span> {lawyer.languages.join(', ')}
                      </div>

                      {/* Rating & Reviews */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-slate-900">{lawyer.rating}</span>
                          <span className="text-slate-600">({lawyer.reviews} reviews)</span>
                        </div>
                        <span className="text-slate-300">|</span>
                        <span className="text-sm text-slate-600">Bar ID: {lawyer.barCouncil}</span>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <div>
                          <div className="text-sm text-slate-600">Consultation Fee</div>
                          <div className="text-2xl font-bold text-blue-900">₹{lawyer.fee}
                            <span className="text-sm font-normal text-slate-600">/30 min</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Link
                            href={`/lawers/${lawyer.id}`}
                            className="px-5 py-2 border-2 border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            View Profile
                          </Link>
                          <Link
                            href={`/book/${lawyer.id}`}
                            className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
                          >
                            <Video className="w-4 h-4" />
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}