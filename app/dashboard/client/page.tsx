"use client"
import React, { useState } from 'react';
import { Video, Calendar, FileText, CreditCard, Settings, MessageCircle, Clock, Star, Search, Bell, LogOut, Home, User, Download, ChevronRight, PlayCircle } from 'lucide-react';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const upcomingConsultations = [
    {
      id: 1,
      lawyer: "Adv. Rajesh Kumar",
      photo: "👨‍⚖️",
      expertise: "Corporate Law",
      date: "Today",
      time: "04:00 PM",
      duration: 30,
      status: "confirmed",
      meetingLink: "#"
    },
    {
      id: 2,
      lawyer: "Adv. Priya Sharma",
      photo: "👩‍⚖️",
      expertise: "Family Law",
      date: "Tomorrow",
      time: "11:00 AM",
      duration: 30,
      status: "confirmed",
      meetingLink: "#"
    }
  ];

  const pastConsultations = [
    {
      id: 3,
      lawyer: "Adv. Vikram Mehta",
      photo: "👨‍⚖️",
      expertise: "Civil Law",
      date: "Nov 28, 2024",
      time: "03:00 PM",
      duration: 30,
      status: "completed",
      rated: false
    },
    {
      id: 4,
      lawyer: "Adv. Meera Krishnan",
      photo: "👩‍⚖️",
      expertise: "Property Law",
      date: "Nov 15, 2024",
      time: "02:00 PM",
      duration: 30,
      status: "completed",
      rated: true,
      rating: 5
    }
  ];

  const documents = [
    { id: 1, name: "Property Agreement Draft.pdf", date: "Dec 1, 2024", lawyer: "Adv. Rajesh Kumar", size: "2.4 MB" },
    { id: 2, name: "Consultation Notes.pdf", date: "Nov 28, 2024", lawyer: "Adv. Vikram Mehta", size: "1.1 MB" },
    { id: 3, name: "Legal Opinion.pdf", date: "Nov 15, 2024", lawyer: "Adv. Meera Krishnan", size: "3.2 MB" }
  ];

  const stats = [
    { label: "Total Consultations", value: "12", icon: Video, color: "bg-blue-500" },
    { label: "Upcoming", value: "2", icon: Calendar, color: "bg-green-500" },
    { label: "Documents", value: "8", icon: FileText, color: "bg-purple-500" },
    { label: "Total Spent", value: "₹18,000", icon: CreditCard, color: "bg-amber-500" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-900">Vakeel Kutami</div>
            <div className="flex items-center gap-4">
              <button className="relative w-10 h-10 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">John Doe</div>
                  <div className="text-xs text-slate-500">Client</div>
                </div>
                <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-semibold">
                  JD
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
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'messages', label: 'Messages', icon: MessageCircle },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-900 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
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
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, John!</h1>
                <p className="text-slate-600">Here's what's happening with your consultations</p>
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
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Upcoming Consultations */}
              <div className="bg-white rounded-xl shadow-sm mb-8">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">Upcoming Consultations</h2>
                    <button className="text-blue-900 hover:underline text-sm font-medium">View All</button>
                  </div>
                </div>
                <div className="p-6">
                  {upcomingConsultations.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingConsultations.map((consultation) => (
                        <div key={consultation.id} className="border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center text-2xl">
                                {consultation.photo}
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900 mb-1">{consultation.lawyer}</h3>
                                <div className="text-sm text-slate-600 mb-2">{consultation.expertise}</div>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {consultation.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {consultation.time}
                                  </span>
                                  <span>{consultation.duration} min</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              {consultation.date === "Today" && (
                                <button className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2 font-medium">
                                  <PlayCircle className="w-4 h-4" />
                                  Join Now
                                </button>
                              )}
                              <button className="px-5 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600">No upcoming consultations</p>
                      <button className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
                        Book a Consultation
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">Need Legal Help?</h3>
                  <p className="text-blue-100 mb-4">Connect with verified lawyers instantly</p>
                  <button className="px-5 py-2 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                    Find a Lawyer
                  </button>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">Refer & Earn</h3>
                  <p className="text-amber-100 mb-4">Get ₹500 for each successful referral</p>
                  <button className="px-5 py-2 bg-white text-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-medium">
                    Invite Friends
                  </button>
                </div>
              </div>

              {/* Recent Documents */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">Recent Documents</h2>
                    <button className="text-blue-900 hover:underline text-sm font-medium">View All</button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {documents.slice(0, 3).map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{doc.name}</div>
                            <div className="text-sm text-slate-500">{doc.lawyer} • {doc.date}</div>
                          </div>
                        </div>
                        <button className="w-10 h-10 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-colors">
                          <Download className="w-5 h-5 text-slate-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'consultations' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">My Consultations</h1>
                <p className="text-slate-600">Manage all your legal consultations</p>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="border-b border-slate-200 px-6">
                  <div className="flex gap-8">
                    <button className="px-4 py-4 font-medium text-blue-900 border-b-2 border-blue-900">
                      Upcoming ({upcomingConsultations.length})
                    </button>
                    <button className="px-4 py-4 font-medium text-slate-600 hover:text-slate-900">
                      Past ({pastConsultations.length})
                    </button>
                    <button className="px-4 py-4 font-medium text-slate-600 hover:text-slate-900">
                      Cancelled (0)
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingConsultations.map((consultation) => (
                      <div key={consultation.id} className="border border-slate-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center text-3xl">
                              {consultation.photo}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900 mb-1">{consultation.lawyer}</h3>
                              <div className="text-sm text-slate-600 mb-2">{consultation.expertise}</div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-medium text-slate-900">4.9</span>
                                <span className="text-sm text-slate-500">(127 reviews)</span>
                              </div>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                            Confirmed
                          </span>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4 mb-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm text-slate-600 mb-1">Date</div>
                              <div className="font-medium text-slate-900">{consultation.date}</div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-600 mb-1">Time</div>
                              <div className="font-medium text-slate-900">{consultation.time}</div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-600 mb-1">Duration</div>
                              <div className="font-medium text-slate-900">{consultation.duration} minutes</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {consultation.date === "Today" && (
                            <button className="flex-1 px-5 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 font-medium">
                              <PlayCircle className="w-5 h-5" />
                              Join Consultation
                            </button>
                          )}
                          <button className="flex-1 px-5 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                            Reschedule
                          </button>
                          <button className="flex-1 px-5 py-3 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Documents</h1>
                <p className="text-slate-600">Access all your consultation documents</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-slate-200">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-5 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 mb-1">{doc.name}</div>
                            <div className="text-sm text-slate-600">
                              {doc.lawyer} • {doc.date} • {doc.size}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
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