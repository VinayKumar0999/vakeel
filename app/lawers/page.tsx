"use client";
import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Star, Video, Clock, ChevronDown, X, Filter } from 'lucide-react';

export default function LawyerListingPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [selectedExpertise, setSelectedExpertise] = useState<any>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<any>([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [experienceRange, setExperienceRange] = useState([0, 30]);
  const [sortBy, setSortBy] = useState('relevance');

  const expertiseAreas = ['Family Law', 'Criminal Law', 'Corporate Law', 'Property Law', 'Civil Law', 'Consumer Law'];
  const languages = ['English', 'Hindi', 'Telugu', 'Tamil', 'Malayalam', 'Kannada'];

  const lawyers = [
    {
      id: 1,
      name: "Adv. Rajesh Kumar",
      photo: "👨‍⚖️",
      expertise: ["Corporate Law", "Property Law"],
      experience: 15,
      languages: ["English", "Hindi", "Telugu"],
      location: "Hyderabad, Telangana",
      rating: 4.9,
      reviews: 127,
      fee: 1500,
      available: true,
      barCouncil: "TN/12345/2008"
    },
    {
      id: 2,
      name: "Adv. Priya Sharma",
      photo: "👩‍⚖️",
      expertise: ["Family Law", "Criminal Law"],
      experience: 12,
      languages: ["English", "Hindi"],
      location: "Mumbai, Maharashtra",
      rating: 4.8,
      reviews: 95,
      fee: 2000,
      available: true,
      barCouncil: "MH/98765/2011"
    },
    {
      id: 3,
      name: "Adv. Vikram Mehta",
      photo: "👨‍⚖️",
      expertise: ["Civil Law", "Consumer Law"],
      experience: 20,
      languages: ["English", "Hindi", "Gujarati"],
      location: "Delhi NCR",
      rating: 4.7,
      reviews: 203,
      fee: 2500,
      available: false,
      barCouncil: "DL/45678/2003"
    },
    {
      id: 4,
      name: "Adv. Meera Krishnan",
      photo: "👩‍⚖️",
      expertise: ["Property Law", "Civil Law"],
      experience: 8,
      languages: ["English", "Tamil", "Malayalam"],
      location: "Chennai, Tamil Nadu",
      rating: 4.9,
      reviews: 64,
      fee: 1200,
      available: true,
      barCouncil: "TN/23456/2015"
    }
  ];

  const toggleExpertise = (exp:any) => {
    setSelectedExpertise((prev:any) =>
      prev.includes(exp) ? prev.filter((e:any) => e !== exp) : [...prev, exp]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev:string[]) =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by lawyer name, expertise, or location..."
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>
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
                  <button className="text-sm text-blue-900 hover:underline">Clear All</button>
                </div>

                {/* Expertise */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Expertise</h4>
                  <div className="space-y-2">
                    {expertiseAreas.map(exp => (
                      <label key={exp} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedExpertise.includes(exp)}
                          onChange={() => toggleExpertise(exp)}
                          className="w-4 h-4 text-blue-900 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">{exp}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Languages</h4>
                  <div className="space-y-2">
                    {languages.map(lang => (
                      <label key={lang} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(lang)}
                          onChange={() => toggleLanguage(lang)}
                          className="w-4 h-4 text-blue-900 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">{lang}</span>
                      </label>
                    ))}
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
                    {[5, 4, 3].map(rating => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="rating" className="w-4 h-4 text-blue-900" />
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
            <div className="space-y-4">
              {lawyers.map(lawyer => (
                <div key={lawyer.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-6">
                    {/* Profile Photo */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center text-5xl">
                        {lawyer.photo}
                      </div>
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
                            <span>{lawyer.experience} years exp.</span>
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
                          <button className="px-5 py-2 border-2 border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 transition-colors">
                            View Profile
                          </button>
                          <button className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="px-8 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                Load More Lawyers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}