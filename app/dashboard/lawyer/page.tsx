"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Calendar, Users, DollarSign, Clock, TrendingUp, Bell, Settings, LogOut, Home, FileText, BarChart3, CheckCircle, X, Eye, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function LawyerDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [availabilityStatus, setAvailabilityStatus] = useState('available');

  // Protect route - check authentication
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push('/login?redirect=/dashboard/lawyer');
        return;
      }
      
      // Check if user has correct role
      if (user.role !== 'LAWYER' && user.role !== 'lawyer') {
        // Redirect to appropriate dashboard based on role
        if (user.role === 'CLIENT' || user.role === 'user') {
          router.push('/dashboard/client');
        } else {
          router.push('/login');
        }
        return;
      }

      // Check verification status for lawyers
      if (user.verificationStatus && user.verificationStatus !== 'APPROVED') {
        router.push('/lawyer/verification-pending');
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const todayConsultations = [
    {
      id: 1,
      client: "Amit Sharma",
      time: "10:00 AM",
      duration: 30,
      type: "Property Dispute",
      status: "upcoming",
      photo: "👤"
    },
    {
      id: 2,
      client: "Priya Reddy",
      time: "02:00 PM",
      duration: 30,
      type: "Corporate Law",
      status: "upcoming",
      photo: "👤"
    },
    {
      id: 3,
      client: "Vikram Singh",
      time: "04:00 PM",
      duration: 30,
      type: "Contract Review",
      status: "upcoming",
      photo: "👤"
    }
  ];

  const pendingRequests = [
    {
      id: 1,
      client: "Rahul Verma",
      requestedDate: "Dec 5, 2024",
      requestedTime: "11:00 AM",
      type: "Real Estate Matter",
      description: "Need consultation regarding property purchase agreement review...",
      photo: "👤"
    },
    {
      id: 2,
      client: "Sneha Patel",
      requestedDate: "Dec 6, 2024",
      requestedTime: "03:00 PM",
      type: "Business Contract",
      description: "Looking for advice on partnership agreement terms...",
      photo: "👤"
    }
  ];

  const stats = [
    { label: "Today's Consultations", value: "3", icon: Video, color: "bg-blue-500", trend: "+2 from yesterday" },
    { label: "This Month", value: "45", icon: Calendar, color: "bg-green-500", trend: "+12% from last month" },
    { label: "Total Clients", value: "189", icon: Users, color: "bg-purple-500", trend: "+23 this month" },
    { label: "Earnings (MTD)", value: "₹67,500", icon: DollarSign, color: "bg-amber-500", trend: "+18% from last month" }
  ];

  const recentReviews = [
    {
      id: 1,
      client: "John Doe",
      rating: 5,
      comment: "Excellent consultation! Very professional and knowledgeable.",
      date: "2 days ago"
    },
    {
      id: 2,
      client: "Sarah Smith",
      rating: 5,
      comment: "Great advice on my property matter. Highly recommend!",
      date: "5 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-900">Vakeel Kutami</div>
            <div className="flex items-center gap-4">
              {/* Availability Toggle */}
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Status:</span>
                <select
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value)}
                  className="text-sm font-medium border-0 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="available">🟢 Available</option>
                  <option value="busy">🔴 Busy</option>
                  <option value="offline">⚫ Offline</option>
                </select>
              </div>
              
              <button className="relative w-10 h-10 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">Adv. Rajesh Kumar</div>
                  <div className="text-xs text-slate-500">Lawyer</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center text-xl">
                  👨‍⚖️
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen sticky top-16">
          <nav className="p-4">
            <div className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: Home },
                { id: 'consultations', label: 'Consultations', icon: Video },
                { id: 'requests', label: 'Requests', icon: Clock, badge: pendingRequests.length },
                { id: 'clients', label: 'Clients', icon: Users },
                { id: 'earnings', label: 'Earnings', icon: BarChart3 },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-900 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-200">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Adv. Rajesh!</h1>
                <p className="text-slate-600">Here's your practice overview for today</p>
              </div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-600 mb-2">{stat.label}</div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Today's Schedule */}
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900">Today's Schedule</h2>
                        <button className="text-blue-900 hover:underline text-sm font-medium">View Calendar</button>
                      </div>
                    </div>
                    <div className="p-6">
                      {todayConsultations.length > 0 ? (
                        <div className="space-y-4">
                          {todayConsultations.map((consultation) => (
                            <div key={consultation.id} className="border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">
                                    {consultation.photo}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-slate-900">{consultation.client}</h3>
                                    <div className="text-sm text-slate-600 mt-1">{consultation.type}</div>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {consultation.time}
                                      </span>
                                      <span>•</span>
                                      <span>{consultation.duration} min</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium">
                                    Start
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                          <p className="text-slate-600">No consultations scheduled for today</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Reviews */}
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900">Recent Reviews</h2>
                        <button className="text-blue-900 hover:underline text-sm font-medium">View All</button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {recentReviews.map((review) => (
                          <div key={review.id} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="font-medium text-slate-900">{review.client}</div>
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <span key={i} className="text-amber-400">★</span>
                                  ))}
                                </div>
                              </div>
                              <span className="text-sm text-slate-500">{review.date}</span>
                            </div>
                            <p className="text-slate-600 text-sm">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Pending Requests */}
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Pending Requests</h3>
                        <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full font-semibold">
                          {pendingRequests.length} New
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {pendingRequests.map((request) => (
                          <div key={request.id} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl">
                                {request.photo}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-slate-900 text-sm">{request.client}</div>
                                <div className="text-xs text-slate-500 mt-1">{request.type}</div>
                              </div>
                            </div>
                            <div className="text-xs text-slate-600 mb-3 line-clamp-2">{request.description}</div>
                            <div className="text-xs text-slate-500 mb-3">
                              {request.requestedDate} at {request.requestedTime}
                            </div>
                            <div className="flex gap-2">
                              <button className="flex-1 px-3 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-xs font-medium">
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                Accept
                              </button>
                              <button className="flex-1 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium">
                                <X className="w-3 h-3 inline mr-1" />
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl p-6 text-white">
                    <h3 className="font-semibold mb-4">This Week</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100 text-sm">Consultations</span>
                        <span className="font-bold text-xl">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100 text-sm">New Clients</span>
                        <span className="font-bold text-xl">5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100 text-sm">Earnings</span>
                        <span className="font-bold text-xl">₹18,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Completion */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-900">Profile Strength</h3>
                      <span className="text-sm font-bold text-blue-900">85%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                      <div className="bg-blue-900 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Profile photo added</span>
                      </li>
                      <li className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Documents verified</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-500">
                        <div className="w-4 h-4 border-2 border-slate-300 rounded-full"></div>
                        <span>Add practice areas</span>
                      </li>
                    </ul>
                    <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-900 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      Complete Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Consultation Requests</h1>
                <p className="text-slate-600">Review and manage incoming consultation requests</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6">
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl">
                            {request.photo}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">{request.client}</h3>
                                <div className="text-sm text-slate-600 mt-1">{request.type}</div>
                              </div>
                              <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                                Pending
                              </span>
                            </div>
                            
                            <div className="bg-slate-50 rounded-lg p-4 mb-4">
                              <div className="text-sm font-medium text-slate-700 mb-2">Consultation Details</div>
                              <p className="text-slate-600 text-sm mb-3">{request.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1 text-slate-700">
                                  <Calendar className="w-4 h-4" />
                                  {request.requestedDate}
                                </span>
                                <span className="flex items-center gap-1 text-slate-700">
                                  <Clock className="w-4 h-4" />
                                  {request.requestedTime}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button className="flex-1 px-5 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 font-medium">
                                <CheckCircle className="w-5 h-5" />
                                Accept Request
                              </button>
                              <button className="px-5 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-medium">
                                <MessageCircle className="w-5 h-5" />
                                Message
                              </button>
                              <button className="px-5 py-3 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 font-medium">
                                <X className="w-5 h-5" />
                                Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}