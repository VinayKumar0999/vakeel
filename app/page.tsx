"use client"
import React, { useState } from 'react';
import { Scale, Video, Shield, Clock, Search, CheckCircle, ArrowRight, Star, Users } from 'lucide-react';

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-2 bg-blue-50 text-blue-900 rounded-full text-sm font-medium mb-6">
              🎯 Expert Legal Consultation at Your Fingertips
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Connect with Top Lawyers <span className="text-blue-900">Instantly</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Get professional legal consultation through secure video calls. Book verified lawyers, discuss your case, and get expert advice—all from the comfort of your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                Find a Lawyer <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white text-blue-900 border-2 border-blue-900 rounded-lg hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>
            <div className="flex items-center gap-8 mt-10 pt-10 border-t border-slate-200">
              <div>
                <div className="text-3xl font-bold text-slate-900">500+</div>
                <div className="text-slate-600">Verified Lawyers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">10k+</div>
                <div className="text-slate-600">Consultations</div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-3xl font-bold text-slate-900">4.9</span>
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-slate-600">Average Rating</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-900" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Live Consultation</div>
                    <div className="text-sm text-slate-600">In Progress</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-blue-900 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">22:30 / 30:00</span>
                    <span className="text-green-600 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                      Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-semibold shadow-lg">
                Secure & Private
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Vakeel Kutami?</h2>
            <p className="text-xl text-slate-600">Experience the future of legal consultation</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: "HD Video Consultations",
                description: "Crystal-clear video calls with screen sharing and document collaboration features"
              },
              {
                icon: Shield,
                title: "Verified Lawyers Only",
                description: "All lawyers are Bar Council verified with validated credentials and experience"
              },
              {
                icon: Clock,
                title: "Instant Booking",
                description: "Book appointments in seconds and get legal advice within hours, not days"
              },
              {
                icon: Search,
                title: "Smart Search",
                description: "Find the perfect lawyer by expertise, language, location, and ratings"
              },
              {
                icon: CheckCircle,
                title: "Transparent Pricing",
                description: "No hidden fees. See lawyer rates upfront and pay only for confirmed consultations"
              },
              {
                icon: Scale,
                title: "Multiple Practice Areas",
                description: "From family law to corporate, find specialists in all legal domains"
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                  hoveredCard === idx ? 'bg-blue-900' : 'bg-blue-50'
                }`}>
                  <feature.icon className={`w-7 h-7 transition-colors ${
                    hoveredCard === idx ? 'text-white' : 'text-blue-900'
                  }`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Get legal help in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              { step: "1", title: "Find Your Lawyer", desc: "Search by expertise, location, or language. Review profiles and ratings" },
              { step: "2", title: "Book Consultation", desc: "Choose a convenient time slot and make secure payment" },
              { step: "3", title: "Get Expert Advice", desc: "Join video call and discuss your legal matters confidentially" }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-200 -z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Legal Help?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands who trust Vakeel Kutami for their legal needs</p>
          <button className="px-8 py-4 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 font-semibold shadow-xl">
            Find a Lawyer Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-6 h-6 text-white" />
                <span className="text-xl font-bold text-white">Vakeel Kutami</span>
              </div>
              <p className="text-sm">Connecting you with the best legal minds in India.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Clients</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Find Lawyers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Lawyers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Join as Lawyer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Benefits</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            © 2024 Vakeel Kutami. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}